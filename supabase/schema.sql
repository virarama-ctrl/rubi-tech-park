-- =====================================================================
-- RUBI TECH PARK - Supabase Database Schema & Row Level Security (RLS)
-- =====================================================================
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- This creates the 'leads' table, indexes, updated_at trigger, and secure RLS policies.

-- 1. Enable UUID Extension (built into Postgres)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create the 'leads' table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT NOT NULL,
    business_name TEXT,
    service_interested TEXT NOT NULL,
    message TEXT,
    source_page TEXT DEFAULT 'Website',
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Interested', 'Converted', 'Not Interested', 'Qualified', 'Proposal Sent', 'Won', 'Lost')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Performance Indexes for Fast Filtering & Search
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON public.leads (phone_number);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads (email);
CREATE INDEX IF NOT EXISTS idx_leads_customer_name ON public.leads (customer_name);

-- 4. Trigger to automatically update 'updated_at' column on row modification
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_leads_updated_at ON public.leads;
CREATE TRIGGER trigger_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 5. Optional Admin Users Table for Explicit Role Authorization
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'manager')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed default initial admin (Replace with your actual admin email)
INSERT INTO public.admin_users (email, full_name, role)
VALUES ('rubienterprisesgst@gmail.com', 'RUBI TECH PARK Administrator', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for 'leads' Table
-- Policy A: Allow server-side service_role / backend endpoint or public insert
DROP POLICY IF EXISTS "Public users can insert leads" ON public.leads;
CREATE POLICY "Public users can insert leads"
    ON public.leads
    FOR INSERT
    TO anon, authenticated, service_role
    WITH CHECK (true);

-- Policy B: Only authenticated administrators can read leads
DROP POLICY IF EXISTS "Admins can view leads" ON public.leads;
CREATE POLICY "Admins can view leads"
    ON public.leads
    FOR SELECT
    TO authenticated, service_role
    USING (
        (auth.jwt() ->> 'email') IN (SELECT email FROM public.admin_users WHERE is_active = true)
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
        OR current_user = 'service_role'
    );

-- Policy C: Only authenticated administrators can update leads
DROP POLICY IF EXISTS "Admins can update leads" ON public.leads;
CREATE POLICY "Admins can update leads"
    ON public.leads
    FOR UPDATE
    TO authenticated, service_role
    USING (
        (auth.jwt() ->> 'email') IN (SELECT email FROM public.admin_users WHERE is_active = true)
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
        OR current_user = 'service_role'
    )
    WITH CHECK (true);

-- Policy D: Only authenticated administrators can delete leads
DROP POLICY IF EXISTS "Admins can delete leads" ON public.leads;
CREATE POLICY "Admins can delete leads"
    ON public.leads
    FOR DELETE
    TO authenticated, service_role
    USING (
        (auth.jwt() ->> 'email') IN (SELECT email FROM public.admin_users WHERE is_active = true)
        OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
        OR current_user = 'service_role'
    );

-- 8. RLS Policies for 'admin_users'
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
CREATE POLICY "Admins can view admin_users"
    ON public.admin_users
    FOR SELECT
    TO authenticated, service_role
    USING (true);

-- =====================================================================
-- End of Schema Definition
-- =====================================================================
