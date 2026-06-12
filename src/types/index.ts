export interface Tender {
  id: string;
  title: string;
  client: string;
  deadline: string;
  budget: { min: number; max: number };
  status: 'draft' | 'analyzing' | 'ready' | 'submitted' | 'won' | 'lost';
  complianceScore: number;
  winProbability: number;
  createdAt: string;
}

export interface Requirement {
  id: string;
  category: string;
  description: string;
  mandatory: boolean;
  evidence?: string;
  status: 'compliant' | 'partial' | 'gap' | 'pending';
  notes?: string;
}

export interface CapabilityMatch {
  id: string;
  requirementId: string;
  type: 'project' | 'certification' | 'experience' | 'resource';
  title: string;
  description: string;
  relevanceScore: number;
  details: Record<string, unknown>;
}

export interface ProposalSection {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  status: 'draft' | 'review' | 'approved';
  lastEdited: string;
}

export interface WinProbabilityFactors {
  complianceScore: number;
  similarProjectScore: number;
  budgetAlignment: number;
  historicalSuccessRate: number;
  overallScore: number;
  recommendation: 'GO' | 'NO_GO' | 'CONDITIONAL';
}

export interface DashboardStats {
  totalBids: number;
  activeBids: number;
  wonBids: number;
  winRate: number;
  complianceRate: number;
  totalValue: number;
  avgWinProbability: number;
}

export interface ChartData {
  name: string;
  value: number;
  fill?: string;
}
