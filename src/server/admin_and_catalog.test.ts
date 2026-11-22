import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import app from '../../server';
import {
  evaluateAdminAuthorization,
  PRIMARY_ADMIN_EMAIL,
  PRIMARY_ADMIN_UID,
  HIDDEN_PUBLIC_SERVICE_IDS
} from './firebaseService';
import { createSession, validateSession, destroySession } from './auth';
import { E_SERVICES, SERVICES_DATA, SOFTWARE_SERVICES, COMPLIANCE_SERVICES } from '../config/agencyConfig';
import { TAMIL_SERVICES_DATA } from '../i18n/serviceTranslations';

async function startTestServer(): Promise<{ baseUrl: string; close: () => Promise<void> }> {
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  const baseUrl = `http://127.0.0.1:${address.port}`;
  return {
    baseUrl,
    close: () => new Promise<void>((resolve) => server.close(() => resolve()))
  };
}

// =========================================================================
// Task A: CRM Administrator Authorization Verification
// =========================================================================

test('Admin Auth 1: Primary admin UID xd60RtfunBd6mIOxLAdu6acegio1 + admin@rubitechpark.com is authorized as super_admin', () => {
  const res = evaluateAdminAuthorization({
    uid: PRIMARY_ADMIN_UID,
    email: PRIMARY_ADMIN_EMAIL
  });
  assert.equal(res.authorized, true);
  assert.equal(res.role, 'super_admin');
  assert.equal(res.matchedBy, 'uid_and_email');
});

test('Admin Auth 2: Case-insensitive admin@rubitechpark.com email with UID xd60RtfunBd6mIOxLAdu6acegio1 is authorized', () => {
  const res = evaluateAdminAuthorization({
    uid: 'xd60RtfunBd6mIOxLAdu6acegio1',
    email: '  Admin@RubiTechPark.com '
  });
  assert.equal(res.authorized, true);
  assert.equal(res.role, 'super_admin');
});

test('Admin Auth 3: Arbitrary authenticated Firebase user is strictly denied', () => {
  const res = evaluateAdminAuthorization({
    uid: 'randomUserUid999',
    email: 'customer@example.com'
  });
  assert.equal(res.authorized, false);
  assert.equal(res.role, null);
});

test('Admin Auth 4: UID xd60RtfunBd6mIOxLAdu6acegio1 with non-admin email and no claims/role is denied', () => {
  const res = evaluateAdminAuthorization({
    uid: PRIMARY_ADMIN_UID,
    email: 'untrusted@example.com',
    customClaims: {},
    firestoreRole: null
  });
  assert.equal(res.authorized, false);
  assert.equal(res.role, null);
});

test('Admin Auth 5: Disabled admin account is strictly denied', () => {
  const res = evaluateAdminAuthorization({
    uid: PRIMARY_ADMIN_UID,
    email: PRIMARY_ADMIN_EMAIL,
    disabled: true
  });
  assert.equal(res.authorized, false);
  assert.equal(res.reason, 'account_disabled');
});

test('Admin Auth 6: Verified Firebase Custom Claims and active Firestore admin_roles grant access; inactive role denied', () => {
  const viaClaim = evaluateAdminAuthorization({
    uid: 'uid_custom_claim_1',
    email: 'ops@rubitechpark.com',
    customClaims: { admin: true }
  });
  assert.equal(viaClaim.authorized, true);
  assert.equal(viaClaim.matchedBy, 'custom_claims');

  const viaFirestoreActive = evaluateAdminAuthorization({
    uid: 'uid_firestore_role_1',
    email: 'manager@rubitechpark.com',
    firestoreRole: { uid: 'uid_firestore_role_1', email: 'manager@rubitechpark.com', role: 'admin', active: true }
  });
  assert.equal(viaFirestoreActive.authorized, true);
  assert.equal(viaFirestoreActive.role, 'admin');
  assert.equal(viaFirestoreActive.matchedBy, 'firestore_admin_roles');

  const viaFirestoreInactive = evaluateAdminAuthorization({
    uid: 'uid_firestore_role_2',
    email: 'former@rubitechpark.com',
    firestoreRole: { uid: 'uid_firestore_role_2', role: 'super_admin', active: false }
  });
  assert.equal(viaFirestoreInactive.authorized, false);
});

test('Admin Auth 7: HMAC-signed session tokens validate cleanly, reject tampering, and revoke on logout', () => {
  const session = createSession({
    id: PRIMARY_ADMIN_UID,
    email: PRIMARY_ADMIN_EMAIL,
    name: 'RUBI TECH PARK Admin',
    role: 'super_admin',
    firebaseUid: PRIMARY_ADMIN_UID
  });

  assert.ok(session.token.startsWith('rtp_adm.'));
  const validated = validateSession(session.token);
  assert.ok(validated);
  assert.equal(validated.userEmail, PRIMARY_ADMIN_EMAIL);
  assert.equal(validated.firebaseUid, PRIMARY_ADMIN_UID);

  // Tampered token must fail
  assert.equal(validateSession(`${session.token}tampered`), null);

  // Logout revocation must immediately invalidate token
  destroySession(session.token);
  assert.equal(validateSession(session.token), null);
});

test('Admin Auth 8: POST /api/admin/firebase-login rejects fake idToken (401), missing password (401), non-admin (403), and authorizes admin (200)', async () => {
  const srv = await startTestServer();
  try {
    // 8a. Invalid/tampered Firebase ID token -> 401 Unauthorized
    const fakeTokenRes = await fetch(`${srv.baseUrl}/api/admin/firebase-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: PRIMARY_ADMIN_EMAIL,
        idToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmYWtlIn0.invalid'
      })
    });
    assert.equal(fakeTokenRes.status, 401);
    const fakeTokenData: any = await fakeTokenRes.json();
    assert.equal(fakeTokenData.code, 'INVALID_FIREBASE_TOKEN');

    // 8b. Authorized email with NO idToken and NO password -> 401 (no unauthenticated bypass)
    const noCredRes = await fetch(`${srv.baseUrl}/api/admin/firebase-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: PRIMARY_ADMIN_EMAIL })
    });
    assert.equal(noCredRes.status, 401);

    // 8c. Authorized email with WRONG password -> 401
    const wrongPassRes = await fetch(`${srv.baseUrl}/api/admin/firebase-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: PRIMARY_ADMIN_EMAIL, password: 'WrongPassword!999' })
    });
    assert.equal(wrongPassRes.status, 401);

    // 8d. Non-admin email -> 403 ACCESS_DENIED
    const nonAdminRes = await fetch(`${srv.baseUrl}/api/admin/firebase-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'visitor@example.com', password: 'SomePassword123!' })
    });
    assert.equal(nonAdminRes.status, 403);
    const nonAdminData: any = await nonAdminRes.json();
    assert.equal(nonAdminData.code, 'ACCESS_DENIED');

    // 8e. Authorized admin with valid credentials -> 200 OK & working session
    const validRes = await fetch(`${srv.baseUrl}/api/admin/firebase-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: PRIMARY_ADMIN_EMAIL,
        password: process.env.ADMIN_INITIAL_PASSWORD || 'ElloraAdmin2026!Secure'
      })
    });
    assert.equal(validRes.status, 200);
    const validData: any = await validRes.json();
    assert.equal(validData.success, true);
    assert.ok(validData.token);
    assert.equal(validData.user.email, PRIMARY_ADMIN_EMAIL);

    const meRes = await fetch(`${srv.baseUrl}/api/admin/me`, {
      headers: { Authorization: `Bearer ${validData.token}` }
    });
    assert.equal(meRes.status, 200);
    const meData: any = await meRes.json();
    assert.equal(meData.authenticated, true);
    assert.equal(meData.user.email, PRIMARY_ADMIN_EMAIL);
  } finally {
    await srv.close();
  }
});

// =========================================================================
// Task B: "Other Eligible Online Government Services" Complete Removal
// =========================================================================

test('Catalog 1: Other Eligible Online Government Services is removed from E_SERVICES and SERVICES_DATA while preserving all other services', () => {
  assert.equal(
    E_SERVICES.some((s) => s.id === 'other-online-government-services' || s.title.includes('Other Eligible Online Government Services')),
    false
  );
  assert.equal(
    SERVICES_DATA.some((s) => s.id === 'other-online-government-services' || s.title.includes('Other Eligible Online Government Services')),
    false
  );

  // Confirm E-Services category and all other citizen e-services remain intact
  const preservedIds = [
    'pan-card-application-correction',
    'voter-id-application-correction',
    'passport-application-assistance',
    'passport-renewal-assistance',
    'address-change-assistance',
    'document-application-support',
    'online-form-filling',
    'certificate-application-assistance',
    'ration-card-application-correction',
    'eb-new-application-correction'
  ];
  for (const id of preservedIds) {
    assert.ok(
      E_SERVICES.some((s) => s.id === id),
      `Expected preserved E-Service "${id}" to remain in E_SERVICES`
    );
  }
  assert.equal(E_SERVICES.length, 10);
  assert.equal(SERVICES_DATA.length, SOFTWARE_SERVICES.length + COMPLIANCE_SERVICES.length + E_SERVICES.length);
});

test('Catalog 2: Removed service is absent from serviceImages, Tamil translations, and chatbot system prompt', () => {
  const serviceImagesSource = fs.readFileSync(path.resolve(process.cwd(), 'src/config/serviceImages.tsx'), 'utf-8');
  assert.equal(serviceImagesSource.includes('other-online-government-services'), false);
  assert.equal('other-online-government-services' in TAMIL_SERVICES_DATA, false);
  assert.equal(HIDDEN_PUBLIC_SERVICE_IDS.has('other-online-government-services'), true);

  const geminiSource = fs.readFileSync(path.resolve(process.cwd(), 'src/server/gemini.ts'), 'utf-8');
  assert.equal(geminiSource.includes('Other Eligible Online Government Services'), false);
  assert.equal(geminiSource.includes('PAN Card Application / Correction Assistance'), true);
  assert.equal(geminiSource.includes('Ration Card Application / Correction Assistance'), true);
  assert.equal(geminiSource.includes('EB New application / Correction Assistance'), true);
});

test('Catalog 3: GET /api/services/images does not expose removed service key', async () => {
  const srv = await startTestServer();
  try {
    const res = await fetch(`${srv.baseUrl}/api/services/images`);
    assert.equal(res.status, 200);
    const data: any = await res.json();
    assert.equal(data.success, true);
    assert.equal('other-online-government-services' in (data.images || {}), false);
  } finally {
    await srv.close();
  }
});
