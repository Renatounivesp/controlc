-- Companies table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  plan TEXT DEFAULT 'basic' CHECK (plan IN ('basic', 'premium')),
  is_lifetime BOOLEAN DEFAULT FALSE,
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'inactive')),
  is_admin BOOLEAN DEFAULT FALSE,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Evaluations table
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  customer_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Policies for companies
CREATE POLICY "Users can view their own company" ON companies
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can update their own company" ON companies
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Public can view company by slug" ON companies
  FOR SELECT USING (true);

-- Policies for evaluations
CREATE POLICY "Users can view evaluations for their companies" ON evaluations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM companies 
      WHERE companies.id = evaluations.company_id 
      AND companies.owner_id = auth.uid()
    )
  );

CREATE POLICY "Public can insert evaluations" ON evaluations
  FOR INSERT WITH CHECK (true);
