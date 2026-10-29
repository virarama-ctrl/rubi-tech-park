import test from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword, createSession, validateSession, destroySession, extractBearerToken, AdminUser } from './auth';

test('hashPassword produces salt:hash and verifyPassword validates correctly', () => {
  const password = 'TestSecretPassword2026!';
  const hash = hashPassword(password);
  
  assert.ok(hash.includes(':'));
  assert.equal(verifyPassword(password, hash), true);
  assert.equal(verifyPassword('WrongPassword', hash), false);
  assert.equal(verifyPassword('', hash), false);
});

test('session lifecycle works: creation, validation, and destruction', () => {
  const dummyUser: AdminUser = {
    id: 'usr_test_01',
    email: 'admin@test.com',
    name: 'Test Admin',
    role: 'super_admin',
    passwordHash: 'dummy',
    createdAt: new Date().toISOString()
  };

  const session = createSession(dummyUser);
  assert.ok(session.token.length >= 32);

  const validated = validateSession(session.token);
  assert.ok(validated);
  assert.equal(validated?.userEmail, 'admin@test.com');

  const destroyed = destroySession(session.token);
  assert.equal(destroyed, true);

  const postDestroy = validateSession(session.token);
  assert.equal(postDestroy, null);
});

test('extractBearerToken extracts token cleanly', () => {
  assert.equal(extractBearerToken('Bearer my_secret_token_123'), 'my_secret_token_123');
  assert.equal(extractBearerToken('bearer my_secret_token_123'), 'my_secret_token_123');
  assert.equal(extractBearerToken('Basic credentials'), null);
  assert.equal(extractBearerToken(''), null);
  assert.equal(extractBearerToken(undefined), null);
});
