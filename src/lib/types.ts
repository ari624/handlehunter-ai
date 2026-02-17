export interface ResultItem {
  type: 'domain' | 'social';
  name: string;
  platform: string;
  available: boolean | null;
  competition: 'low' | 'medium' | 'high' | null;
  notes: string | null;
  owned: boolean;
  selected: boolean;
}

export interface SearchResult {
  id: string;
  brand_name: string;
  email: string | null;
  domains_checked: string[];
  socials_checked: string[];
  results: ResultItem[];
  created_at: string;
}

export interface Order {
  id: string;
  search_id: string;
  stripe_session_id: string;
  stripe_payment_id: string | null;
  customer_email: string;
  tier: 'audit' | 'concierge' | 'premium';
  selected_items: ResultItem[];
  preferred_email: string | null;
  email_type: 'existing' | 'new_gmail' | null;
  intake_notes: string | null;
  amount_cents: number;
  status: 'paid' | 'in_progress' | 'completed' | 'cancelled';
  webhook_sent: boolean;
  created_at: string;
}

export const TIERS = {
  audit: { name: 'Audit & Map', price: 97, amount_cents: 9700 },
  concierge: { name: 'Full Concierge', price: 497, amount_cents: 49700 },
  premium: { name: 'Premium Acquisition', price: 997, amount_cents: 99700 },
} as const;

export type TierKey = keyof typeof TIERS;
