-- Add matching fields to capability_library
ALTER TABLE capability_library 
ADD COLUMN domain TEXT,
ADD COLUMN client_type TEXT,
ADD COLUMN certification_type TEXT,
ADD COLUMN project_summary TEXT,
ADD COLUMN keywords TEXT[];

-- Update existing capabilities with matching metadata
UPDATE capability_library SET 
  domain = 'Enterprise Software',
  client_type = 'Enterprise',
  keywords = ARRAY['software', 'enterprise', 'development', 'digital transformation'],
  project_summary = '14 years delivering enterprise software solutions across multiple industries'
WHERE title = 'Enterprise Software Portfolio';

UPDATE capability_library SET 
  domain = 'Cloud Services',
  client_type = 'Enterprise',
  keywords = ARRAY['cloud', 'migration', 'aws', 'azure', 'infrastructure'],
  project_summary = 'Fortune 500 cloud migration delivering infrastructure modernization'
WHERE title = 'TechCorp Cloud Migration';

UPDATE capability_library SET 
  domain = 'Information Security',
  client_type = 'Any',
  certification_type = 'ISO 27001',
  keywords = ARRAY['security', 'iso', 'certification', 'compliance', 'information security'],
  project_summary = 'ISO 27001:2013 certified for information security management'
WHERE title = 'ISO 27001:2013';

UPDATE capability_library SET 
  domain = 'Digital Transformation',
  client_type = 'Finance',
  keywords = ARRAY['portal', 'finance', 'digital', 'customer experience', 'transformation'],
  project_summary = 'Digital portal transformation serving 50,000+ users with 99.97% uptime'
WHERE title = 'Enterprise Portal for Global Finance';

UPDATE capability_library SET 
  domain = 'Healthcare IT',
  client_type = 'Healthcare',
  keywords = ARRAY['healthcare', 'hipaa', 'platform', 'modernization', 'compliance'],
  project_summary = 'Healthcare platform modernization with HIPAA and SOC 2 compliance'
WHERE title = 'MedCare Platform Modernization';

UPDATE capability_library SET 
  domain = 'Cloud Services',
  client_type = 'Any',
  certification_type = 'AWS Partner',
  keywords = ARRAY['aws', 'cloud', 'partner', 'certified', 'devops'],
  project_summary = 'AWS Advanced Consulting Partner with cloud migration competencies'
WHERE title = 'AWS Advanced Partner';

UPDATE capability_library SET 
  domain = 'Information Security',
  client_type = 'Any',
  certification_type = 'SOC 2',
  keywords = ARRAY['soc2', 'security', 'compliance', 'attestation', 'availability'],
  project_summary = 'SOC 2 Type II attested for security, availability, and confidentiality'
WHERE title = 'SOC 2 Type II';

UPDATE capability_library SET 
  domain = 'Government',
  client_type = 'Government',
  keywords = ARRAY['government', 'federal', 'defense', 'clearance', 'public sector'],
  project_summary = '45 government projects delivered across DoD, HHS, DHS, and VA agencies'
WHERE title = 'Government Sector Experience';

UPDATE capability_library SET 
  domain = 'Cloud Architecture',
  client_type = 'Any',
  keywords = ARRAY['architecture', 'cloud', 'aws', 'azure', 'gcp', 'design', 'team'],
  project_summary = '12-member team with AWS SA Pro, Azure Expert, and GCP certifications'
WHERE title = 'Cloud Architecture Team';

UPDATE capability_library SET 
  domain = 'Cybersecurity',
  client_type = 'Any',
  keywords = ARRAY['security', 'penetration testing', 'cissp', 'incident response', 'team'],
  project_summary = '8 security specialists with CISSP, CISM, and CEH certifications'
WHERE title = 'Security Team';

-- Create a requirements table for tender requirements if not exists
CREATE TABLE IF NOT EXISTS tender_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  requirement_text TEXT NOT NULL,
  category TEXT,
  domain TEXT,
  client_type TEXT,
  certification_required TEXT,
  mandatory BOOLEAN DEFAULT false,
  weight DECIMAL(3,2) DEFAULT 1.0,
  keywords TEXT[],
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tender_requirements ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "public_select_tender_requirements" ON tender_requirements FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_tender_requirements" ON tender_requirements FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "public_update_tender_requirements" ON tender_requirements FOR UPDATE TO authenticated USING (true);
CREATE POLICY "public_delete_tender_requirements" ON tender_requirements FOR DELETE TO authenticated USING (true);

-- Create capability_match_results table to store matching results
CREATE TABLE capability_match_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requirement_id UUID REFERENCES tender_requirements(id) ON DELETE CASCADE,
  capability_id UUID REFERENCES capability_library(id) ON DELETE CASCADE,
  match_percentage DECIMAL(5,2),
  confidence_score DECIMAL(5,2),
  match_type TEXT,
  match_details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE capability_match_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_select_match_results" ON capability_match_results FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_insert_match_results" ON capability_match_results FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "public_update_match_results" ON capability_match_results FOR UPDATE TO authenticated USING (true);
CREATE POLICY "public_delete_match_results" ON capability_match_results FOR DELETE TO authenticated USING (true);