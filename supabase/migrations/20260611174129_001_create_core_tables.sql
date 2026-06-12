-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  client TEXT NOT NULL,
  deadline DATE NOT NULL,
  budget_min DECIMAL(15,2) NOT NULL,
  budget_max DECIMAL(15,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'analyzing', 'ready', 'submitted', 'won', 'lost')),
  compliance_score DECIMAL(5,2) DEFAULT 0,
  win_probability DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create requirements table
CREATE TABLE requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  mandatory BOOLEAN DEFAULT false,
  evidence TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('compliant', 'partial', 'gap', 'pending')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create capability_library table
CREATE TABLE capability_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requirement_id UUID REFERENCES requirements(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('project', 'certification', 'experience', 'resource')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  relevance_score DECIMAL(5,2) DEFAULT 0,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create proposals table
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  word_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved')),
  last_edited TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bid_history table
CREATE TABLE bid_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  bid_count INTEGER DEFAULT 0,
  win_count INTEGER DEFAULT 0,
  win_rate DECIMAL(5,2) DEFAULT 0,
  total_value DECIMAL(15,2) DEFAULT 0,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE capability_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE bid_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (public read for demo purposes)
CREATE POLICY "public_select_projects" ON projects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_projects" ON projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "public_update_projects" ON projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "public_delete_projects" ON projects FOR DELETE TO authenticated USING (true);

CREATE POLICY "public_select_requirements" ON requirements FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_requirements" ON requirements FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "public_update_requirements" ON requirements FOR UPDATE TO authenticated USING (true);
CREATE POLICY "public_delete_requirements" ON requirements FOR DELETE TO authenticated USING (true);

CREATE POLICY "public_select_capability_library" ON capability_library FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_capability_library" ON capability_library FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "public_update_capability_library" ON capability_library FOR UPDATE TO authenticated USING (true);
CREATE POLICY "public_delete_capability_library" ON capability_library FOR DELETE TO authenticated USING (true);

CREATE POLICY "public_select_proposals" ON proposals FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_proposals" ON proposals FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "public_update_proposals" ON proposals FOR UPDATE TO authenticated USING (true);
CREATE POLICY "public_delete_proposals" ON proposals FOR DELETE TO authenticated USING (true);

CREATE POLICY "public_select_bid_history" ON bid_history FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_bid_history" ON bid_history FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "public_update_bid_history" ON bid_history FOR UPDATE TO authenticated USING (true);
CREATE POLICY "public_delete_bid_history" ON bid_history FOR DELETE TO authenticated USING (true);