import { Tender, Requirement, CapabilityMatch, ProposalSection, DashboardStats, ChartData } from '../types';

export const dashboardStats: DashboardStats = {
  totalBids: 147,
  activeBids: 23,
  wonBids: 89,
  winRate: 73.2,
  complianceRate: 94.7,
  totalValue: 12500000,
  avgWinProbability: 68.5,
};

export const bidHistoryData: ChartData[] = [
  { name: 'Jan', value: 12 },
  { name: 'Feb', value: 19 },
  { name: 'Mar', value: 15 },
  { name: 'Apr', value: 21 },
  { name: 'May', value: 18 },
  { name: 'Jun', value: 24 },
  { name: 'Jul', value: 22 },
  { name: 'Aug', value: 28 },
  { name: 'Sep', value: 31 },
  { name: 'Oct', value: 26 },
  { name: 'Nov', value: 29 },
  { name: 'Dec', value: 32 },
];

export const winRateData: ChartData[] = [
  { name: 'Jan', value: 65 },
  { name: 'Feb', value: 71 },
  { name: 'Mar', value: 68 },
  { name: 'Apr', value: 74 },
  { name: 'May', value: 72 },
  { name: 'Jun', value: 69 },
  { name: 'Jul', value: 75 },
  { name: 'Aug', value: 78 },
  { name: 'Sep', value: 76 },
  { name: 'Oct', value: 73 },
  { name: 'Nov', value: 79 },
  { name: 'Dec', value: 82 },
];

export const categoryData: ChartData[] = [
  { name: 'IT Services', value: 42, fill: '#3b82f6' },
  { name: 'Consulting', value: 28, fill: '#0ea5e9' },
  { name: 'Construction', value: 18, fill: '#10b981' },
  { name: 'Healthcare', value: 12, fill: '#f59e0b' },
];

export const recentTenders: Tender[] = [
  {
    id: '1',
    title: 'Enterprise Cloud Migration RFP',
    client: 'TechCorp Industries',
    deadline: '2026-06-25',
    budget: { min: 2500000, max: 3500000 },
    status: 'analyzing',
    complianceScore: 87,
    winProbability: 72,
    createdAt: '2026-06-08',
  },
  {
    id: '2',
    title: 'Digital Transformation Services',
    client: 'Global Finance Ltd',
    deadline: '2026-07-01',
    budget: { min: 1800000, max: 2200000 },
    status: 'ready',
    complianceScore: 94,
    winProbability: 85,
    createdAt: '2026-06-05',
  },
  {
    id: '3',
    title: 'Healthcare Management Platform',
    client: 'MedCare Systems',
    deadline: '2026-06-30',
    budget: { min: 3200000, max: 4000000 },
    status: 'draft',
    complianceScore: 65,
    winProbability: 48,
    createdAt: '2026-06-10',
  },
  {
    id: '4',
    title: 'Cybersecurity Assessment & Implementation',
    client: 'Defense Holdings Inc',
    deadline: '2026-07-15',
    budget: { min: 1500000, max: 2000000 },
    status: 'submitted',
    complianceScore: 91,
    winProbability: 78,
    createdAt: '2026-05-28',
  },
];

export const tenderRequirements: Requirement[] = [
  {
    id: '1',
    category: 'Technical Capability',
    description: 'Minimum 5 years experience in enterprise software development',
    mandatory: true,
    status: 'compliant',
    evidence: 'Company founded 2012, 14 years of enterprise software delivery',
  },
  {
    id: '2',
    category: 'Technical Capability',
    description: 'Demonstrated experience with cloud platforms (AWS, Azure, GCP)',
    mandatory: true,
    status: 'compliant',
    evidence: 'AWS Advanced Partner, Azure Gold Partner, 150+ cloud migrations',
  },
  {
    id: '3',
    category: 'Certifications',
    description: 'ISO 27001 certification required',
    mandatory: true,
    status: 'compliant',
    evidence: 'ISO 27001:2013 certified, Certificate No. IS-789456',
  },
  {
    id: '4',
    category: 'Certifications',
    description: 'SOC 2 Type II attestation',
    mandatory: false,
    status: 'compliant',
    evidence: 'SOC 2 Type II report available for last 3 years',
  },
  {
    id: '5',
    category: 'Team Requirements',
    description: 'Dedicated project team of minimum 8 FTEs',
    mandatory: true,
    status: 'partial',
    notes: 'Currently 6 FTEs available, can scale to 10 within 4 weeks',
  },
  {
    id: '6',
    category: 'Security',
    description: 'Security clearance Level 3 for all personnel',
    mandatory: true,
    status: 'gap',
    notes: 'Only 4 of 8 team members have L3 clearance',
  },
  {
    id: '7',
    category: 'Financial',
    description: 'Professional indemnity insurance minimum $5M',
    mandatory: true,
    status: 'compliant',
    evidence: 'Current PI policy: $10M coverage with AIG',
  },
  {
    id: '8',
    category: 'Past Performance',
    description: 'Minimum 3 similar projects in last 5 years',
    mandatory: true,
    status: 'compliant',
    evidence: '7 similar enterprise transformation projects delivered',
  },
];

export const capabilityMatches: CapabilityMatch[] = [
  {
    id: '1',
    requirementId: '1',
    type: 'experience',
    title: 'Enterprise Software Portfolio',
    description: '14 years of enterprise software development across industries',
    relevanceScore: 98,
    details: {
      yearsActive: 14,
      projectsDelivered: 250,
      industries: ['Finance', 'Healthcare', 'Government', 'Retail'],
    },
  },
  {
    id: '2',
    requirementId: '2',
    type: 'project',
    title: 'TechCorp Cloud Migration',
    description: 'Large-scale cloud migration for Fortune 500 client',
    relevanceScore: 95,
    details: {
      client: 'TechCorp Industries',
      year: '2024',
      value: '$2.8M',
      services: ['Assessment', 'Migration', 'Optimization'],
    },
  },
  {
    id: '3',
    requirementId: '3',
    type: 'certification',
    title: 'ISO 27001:2013',
    description: 'Information Security Management System certification',
    relevanceScore: 100,
    details: {
      certBody: 'BSI Group',
      validUntil: '2027-06-15',
      scope: 'Software development and cloud services',
    },
  },
  {
    id: '4',
    requirementId: '8',
    type: 'project',
    title: 'Enterprise Portal for Global Finance',
    description: 'Digital transformation of customer portal',
    relevanceScore: 92,
    details: {
      client: 'Global Finance Ltd',
      year: '2023',
      value: '$1.9M',
      users: '50,000+',
      uptime: '99.97%',
    },
  },
  {
    id: '5',
    requirementId: '8',
    type: 'project',
    title: 'MedCare Platform Modernization',
    description: 'Healthcare platform rebuild and migration',
    relevanceScore: 88,
    details: {
      client: 'MedCare Systems',
      year: '2024',
      value: '$3.1M',
      compliance: 'HIPAA, SOC 2',
    },
  },
];

export const proposalSections: ProposalSection[] = [
  {
    id: '1',
    title: 'Executive Summary',
    content: `We are pleased to submit this proposal for the Enterprise Cloud Migration project. Our organization brings 14 years of proven expertise in enterprise software development and cloud transformation services.

With over 250 successful projects delivered across finance, healthcare, government, and retail sectors, we have developed a deep understanding of the challenges and opportunities inherent in large-scale digital transformation initiatives.

Our proposed approach combines industry-leading methodologies with cutting-edge cloud technologies to deliver a solution that is not only technically robust but also strategically aligned with your business objectives.

Key differentiators of our offering:
- AWS Advanced Partner with 150+ successful cloud migrations
- ISO 27001 and SOC 2 Type II certified operations
- Dedicated team with average 12 years of experience
- Proven track record of on-time, on-budget delivery (94% success rate)`,
    wordCount: 156,
    status: 'approved',
    lastEdited: '2026-06-09T14:30:00Z',
  },
  {
    id: '2',
    title: 'Technical Approach',
    content: `Our technical approach is built on four foundational pillars:

1. Assessment & Discovery
   - Comprehensive infrastructure analysis
   - Application dependency mapping
   - Cloud readiness scoring for all workloads
   - Risk identification and mitigation planning

2. Migration Strategy
   - Phase 1: Lift and shift non-critical applications
   - Phase 2: Re-platform database and storage layers
   - Phase 3: Re-architect critical services for cloud-native
   - Phase 4: Optimization and cost management

3. Architecture Design
   - Multi-region deployment for high availability
   - Infrastructure as Code using Terraform
   - Container orchestration with Kubernetes
   - Zero-trust security model implementation

4. Implementation & Support
   - Agile delivery in 2-week sprints
   - Dedicated DevOps team for continuous deployment
   - 24/7 monitoring and incident response
   - Post-migration optimization reviews`,
    wordCount: 188,
    status: 'review',
    lastEdited: '2026-06-10T09:15:00Z',
  },
  {
    id: '3',
    title: 'Relevant Experience',
    content: `Project 1: Global Finance Digital Transformation
- Client: Global Finance Ltd
- Value: $1.9M
- Duration: 18 months
- Outcome: Successfully migrated 47 legacy applications to AWS
- Key Achievement: Reduced infrastructure costs by 40% while improving performance by 60%

Project 2: Healthcare Platform Modernization
- Client: MedCare Systems
- Value: $3.1M
- Duration: 24 months
- Outcome: Rebuilt patient portal serving 50,000+ users
- Key Achievement: HIPAA-compliant architecture with 99.97% uptime

Project 3: Government Services Portal
- Client: Department of Digital Services
- Value: $2.4M
- Duration: 15 months
- Outcome: Cloud migration of citizen services portal
- Key Achievement: Zero-downtime migration of 2M+ citizen records`,
    wordCount: 142,
    status: 'draft',
    lastEdited: '2026-06-08T16:45:00Z',
  },
  {
    id: '4',
    title: 'Risk Management',
    content: `Risk Assessment and Mitigation Strategy

1. Technical Risks
   Risk: Application compatibility issues during migration
   Mitigation: Comprehensive assessment phase with proof-of-concept testing
   Contingency: Rollback procedures for each migration phase

2. Security Risks
   Risk: Data exposure during cloud transition
   Mitigation: Encrypted data transfer, VPC isolation, security group policies
   Contingency: Immediate security audit and remediation protocols

3. Schedule Risks
   Risk: Delays due to unforeseen dependencies
   Mitigation: 15% schedule buffer, parallel workstreams where possible
   Contingency: Additional resources available within 2 weeks notice

4. Resource Risks
   Risk: Key personnel unavailability
   Mitigation: Cross-training, shadow assignments, documentation
   Contingency: Backup resources identified per critical role`,
    wordCount: 147,
    status: 'approved',
    lastEdited: '2026-06-09T11:20:00Z',
  },
  {
    id: '5',
    title: 'Compliance Statement',
    content: `Compliance Commitment and Certifications

We confirm full compliance with all mandatory requirements specified in the RFP:

Security & Privacy:
- ISO 27001:2013 certified for information security management
- SOC 2 Type II attested for security, availability, and confidentiality
- GDPR compliant data processing policies
- HIPAA capable for healthcare data handling

Professional Standards:
- Professional indemnity insurance: $10M coverage
- Workers compensation insurance current
- Financial stability confirmed by Dun & Bradstreet Rating A+

Personnel:
- Background checks completed for all project team members
- Security clearance Level 3 available for 4 senior personnel
- NDAs signed across all project participants

Organizational:
- No pending litigation or regulatory actions
- No conflicts of interest identified
- Compliance with all applicable laws confirmed`,
    wordCount: 143,
    status: 'review',
    lastEdited: '2026-06-10T08:00:00Z',
  },
];

export const winProbabilityFactors = {
  complianceScore: 87,
  similarProjectScore: 92,
  budgetAlignment: 78,
  historicalSuccessRate: 74,
  overallScore: 82,
  recommendation: 'GO' as const,
};
