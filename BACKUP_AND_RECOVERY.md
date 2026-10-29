# Ellora Digital Hub CRM — Backup, Recovery & Security Plan

This document details the security model, persistent database storage structure, backup procedures, and disaster recovery protocol for the Ellora Digital Hub Lead Management CRM (Phase 2).

---

## 1. Architecture & Storage Model

* **Storage Location:** `/data/` directory at the project workspace root.
* **Core Data Files:**
  * `/data/crm_leads.json`: Inbound lead inquiries, contact details, service requirements, budget ranges, pipeline statuses, internal notes, and activity histories.
  * `/data/crm_users.json`: Administrator accounts with cryptographic password hashes (scrypt + 16-byte random salt).
  * `/data/crm_audit.json`: Immutable audit trail recording administrative actions, logins, status changes, CSV exports, and system backups.
* **Atomic File Writes:** All storage writes use temporary files (`.tmp`) followed by atomic filesystem replacement (`fs.renameSync`). This prevents corrupted states during abrupt shutdowns or container restarts.

---

## 2. Server-Enforced Authentication & Security Controls

1. **No Public Admin Registration:** Administrative accounts can only be seeded via server environment variables (`ADMIN_EMAIL` and `ADMIN_INITIAL_PASSWORD`).
2. **Cryptographic Verification:** Passwords are verified using constant-time byte comparisons (`crypto.timingSafeEqual`) to prevent timing side-channel attacks.
3. **Session Management:** Authenticated administrators receive a cryptographically random 32-byte Bearer token with a strict 8-hour expiration lifetime. Tokens can be revoked immediately on logout.
4. **Anti-Brute-Force Rate Limiting:**
   * Login endpoint (`/api/admin/login`): Maximum 5 attempts per 15 minutes per IP address.
   * Public enquiry endpoint (`/api/enquiries`): Maximum 6 submissions per 10 minutes per IP address.
5. **Anti-Spam Bot Honeypot:** Hidden trap inputs (`website_trap`) silently absorb automated bot payloads without polluting database tables.
6. **Input Sanitization:** Strips HTML/scripts and truncates malicious payloads before database write.

---

## 3. Automated & On-Demand Backup Routine

* **Backup Directory:** `/data/backups/`
* **File Naming Format:** `crm_backup_YYYY-MM-DDTHH-mm-ss-SSSZ.json`
* **Trigger Methods:**
  1. **UI Snapshot Button:** Click **"Snapshot Backup"** in the Admin CRM header.
  2. **API Endpoint:** Authenticated `POST /api/admin/backup`.
* **Backup Content:** Complete point-in-time snapshot of leads, schema version, and security audit logs.

---

## 4. Disaster Recovery & Restoration Procedure

In the event of accidental deletion, data corruption, or server migration:

1. Locate the desired backup file in `/data/backups/` (e.g., `/data/backups/crm_backup_2026-10-29T15-00-00-000Z.json`).
2. Verify backup JSON integrity:
   ```bash
   node -e 'const d = JSON.parse(fs.readFileSync("/data/backups/<backup-file>.json")); console.log("Leads count:", d.leads.length);'
   ```
3. Copy the verified snapshot contents back to `/data/crm_leads.json`:
   ```bash
   cp /data/backups/<backup-file>.json /data/crm_leads.json
   ```
4. Restart the full-stack server process (`npm run dev` or `npm start`).
5. Verify leads appear in the Admin Dashboard at `#/admin`.

---

## 5. Security Checklist for Production Deployment

* [x] Never commit production `.env` files to source control.
* [x] Configure dedicated, strong `ADMIN_INITIAL_PASSWORD` before production launch.
* [x] Restrict CSV export functionality strictly to authenticated `super_admin` sessions.
* [x] Maintain automated daily cron snapshots to off-site cloud storage (e.g., Google Cloud Storage bucket) for enterprise production tiers.
