export interface Company {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  plan: 'basic' | 'premium';
  is_lifetime: boolean;
  subscription_status: 'active' | 'canceled' | 'past_due';
  is_admin: boolean;
  logo_url: string | null;
  theme_hex_primary: string | null;
  theme_hex_bg: string | null;
  theme_bg_image: string | null;
  theme_border_radius: string | null;
  created_at: string;
}

export interface Evaluation {
  id: string;
  company_id: string;
  rating: number;
  comment: string | null;
  customer_name: string | null;
  created_at: string;
}
