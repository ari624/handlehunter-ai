-- HandleHunter.ai Database Schema
-- Run this in your Supabase SQL Editor

-- Searches table
CREATE TABLE IF NOT EXISTS searches (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name      text NOT NULL,
  email           text,
  domains_checked text[] DEFAULT '{.com,.ai,.io,.co}',
  socials_checked text[] DEFAULT '{instagram,tiktok,x,youtube}',
  results         jsonb,
  created_at      timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  search_id           uuid REFERENCES searches(id),
  stripe_session_id   text UNIQUE NOT NULL,
  stripe_payment_id   text,
  customer_email      text NOT NULL,
  tier                text NOT NULL CHECK (tier IN ('audit','concierge','premium')),
  selected_items      jsonb NOT NULL,
  preferred_email     text,
  email_type          text CHECK (email_type IN ('existing','new_gmail')),
  intake_notes        text,
  amount_cents        integer NOT NULL,
  status              text DEFAULT 'paid' CHECK (status IN ('paid','in_progress','completed','cancelled')),
  webhook_sent        boolean DEFAULT false,
  webhook_sent_at     timestamptz,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (no auth for v1)
CREATE POLICY "Allow anonymous insert searches" ON searches
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous read searches" ON searches
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous read orders" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous update orders" ON orders
  FOR UPDATE USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_searches_created_at ON searches(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_search_id ON orders(search_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
