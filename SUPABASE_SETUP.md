# RUBI TECH PARK — Supabase Integration & Setup Guide

This guide explains how to connect **Supabase** as the persistent cloud database and backend for the **RUBI TECH PARK** customer lead management system and admin dashboard.

---

## 1. Resilience & Fallback Architecture

The RUBI TECH PARK CRM is built with an **enterprise-grade resilient dual-storage engine**:
- **When Supabase is configured and connected:**
  All newly submitted leads are directly stored in your Supabase PostgreSQL cloud database, with Row Level Security (RLS) policies protecting customer data. Leads are also mirrored to local persistent storage (`data/crm_leads.json`) for zero-loss redundancy.
- **When Supabase credentials are pending or absent:**
  The system automatically and gracefully operates in **Local Persistent Mode**. All customer inquiries, notes, status changes, and payments are stored in `data/crm_leads.json` and `data/crm_payments.json`. **Zero customer leads are ever lost.**

---

## 2. Step-by-Step Supabase Setup

### Step 1: Create a Free Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and sign in or sign up.
2. Click **New Project**.
3. Choose your organization, set the project name (e.g. `rubi-tech-park-crm`), choose a strong database password, and pick a region close to your clients (e.g., `ap-south-1` Mumbai, India).
4. Wait 1-2 minutes for the database to provision.

### Step 2: Run the SQL Schema
1. In your Supabase dashboard, click on **SQL Editor** from the left navigation.
2. Click **New query**.
3. Copy the entire contents of the project's [`supabase/schema.sql`](./supabase/schema.sql) file and paste it into the editor.
4. Click **Run** (or press Ctrl+Enter).

This creates:
- The `leads` table with all required fields (`customer_name`, `phone_number`, `email`, `business_name`, `service_interested`, `message`, `source_page`, `status`, `admin_notes`, `created_at`, `updated_at`).
- An automatic `updated_at` trigger.
- Fast B-Tree indexes on `status`, `phone_number`, `email`, and `created_at`.
- Strict Row Level Security (RLS) policies enabling public insert of enquiries and restricting admin operations to authorized service role / admin tokens.

### Step 3: Get Your Supabase API Keys
1. In your Supabase dashboard, navigate to **Project Settings** > **API**.
2. Copy the following values:
   - **Project URL** (e.g., `https://xyzcompany.supabase.co`)
   - **service_role key** (under *Project API keys* > *service_role* secret key)
   - **anon public key** (under *Project API keys* > *anon* public key)

### Step 4: Configure Environment Variables
Add the keys to your `.env` file (or set them in your deployment platform such as Vercel / Cloud Run):

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-secret-key

# Client-side Supabase keys (if using client SDK directly)
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-public-key
```

### Step 5: Verify the Connection
1. Restart the server (`npm run dev` or restart dev server).
2. Sign in to the Admin Dashboard at `/admin/login` (default email: `admin@rubitechpark.com`).
3. The dashboard header pill will now display **🟢 Supabase Connected (Cloud Database Active)**!
4. You can also test the connection endpoint directly:
   ```bash
   curl http://localhost:3000/api/admin/supabase-status
   ```
   Response:
   ```json
   {
     "configured": true,
     "connected": true,
     "urlConfigured": true,
     "keyConfigured": true,
     "error": null,
     "mode": "supabase",
     "requiredEnvVars": ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]
   }
   ```

---

## 3. Database Schema Reference

Table: `public.leads`

| Column | Type | Constraints / Default | Description |
|---|---|---|---|
| `id` | `UUID` | Primary Key, `gen_random_uuid()` | Unique Lead ID |
| `customer_name` | `TEXT` | NOT NULL | Customer Full Name |
| `phone_number` | `TEXT` | NOT NULL | 10-digit Phone Number |
| `email` | `TEXT` | NOT NULL | Customer Email Address |
| `business_name` | `TEXT` | NULL | Business / Company Name |
| `service_interested` | `TEXT` | NOT NULL | Service requested |
| `message` | `TEXT` | NULL | Project brief / inquiry message |
| `source_page` | `TEXT` | DEFAULT `'Website'` | Lead origin page / campaign |
| `status` | `TEXT` | DEFAULT `'New'` | Choices: `New`, `Contacted`, `Interested`, `Converted`, `Not Interested` |
| `admin_notes` | `TEXT` | NULL | Internal administrative remarks |
| `created_at` | `TIMESTAMPTZ` | DEFAULT `NOW()` | Timestamp created |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT `NOW()` | Timestamp updated |

---

## 4. Vercel Deployment Instructions

1. Push your repository to GitHub.
2. In Vercel, click **Add New Project** and import the repository.
3. In **Environment Variables**, add:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `ADMIN_INITIAL_PASSWORD`
   - `ADMIN_SESSION_SECRET`
4. Deploy! The provided `vercel.json` ensures both the frontend Vite SPA and Express backend serverless functions route properly.
