import { motion } from 'framer-motion';
import {
  FileText,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MessageSquare,
  ChevronRight,
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import GlassCard from '../components/ui/GlassCard';
import StatusBadge from '../components/ui/StatusBadge';
import ProgressBar from '../components/ui/ProgressBar';

const tenderInfo = {
  title: 'Enterprise Cloud Migration RFP',
  client: 'TechCorp Industries',
  referenceNumber: 'TCI-2026-RFP-0142',
  issueDate: '2026-06-01',
  submissionDeadline: '2026-06-25',
  budgetRange: { min: 2500000, max: 3500000 },
  currency: 'USD',
};

const extractedRequirements = [
  {
    id: '1',
    category: 'Technical',
    requirement: 'Cloud platform expertise (AWS, Azure, or GCP)',
    priority: 'Mandatory',
    details:
      'Minimum 5 years demonstrated experience with enterprise cloud migrations. Must include at least 3 large-scale deployments (1000+ users).',
  },
  {
    id: '2',
    category: 'Technical',
    requirement: 'Security certifications',
    priority: 'Mandatory',
    details:
      'ISO 27001 certification required. SOC 2 Type II attestation preferred. NIST compliance framework experience.',
  },
  {
    id: '3',
    category: 'Technical',
    requirement: 'Data migration capabilities',
    priority: 'Mandatory',
    details:
      'Proven methodology for zero-downtime data migration. Support for SQL and NoSQL databases. Real-time replication capabilities.',
  },
  {
    id: '4',
    category: 'Operations',
    requirement: 'Project timeline',
    priority: 'High',
    details:
      'Complete migration within 18 months. Phased approach with defined milestones. Progress reporting every 2 weeks.',
  },
  {
    id: '5',
    category: 'Commercial',
    requirement: 'Fixed price proposal',
    priority: 'High',
    details:
      'Lump sum pricing preferred. Payment milestones tied to deliverable completion. Change request process defined.',
  },
  {
    id: '6',
    category: 'Experience',
    requirement: 'Reference projects',
    priority: 'Mandatory',
    details:
      'Minimum 3 reference projects in similar scale. Contact details for reference verification. Case studies required.',
  },
];

const evaluationCriteria = [
  { criterion: 'Technical Approach', weight: 30, score: null },
  { criterion: 'Past Performance', weight: 25, score: null },
  { criterion: 'Team Qualifications', weight: 20, score: null },
  { criterion: 'Price Competitiveness', weight: 15, score: null },
  { criterion: 'Risk Management', weight: 10, score: null },
];

const questionsAnswers = [
  {
    id: '1',
    question: 'What is the expected user base post-migration?',
    answer: 'Approximately 15,000 employees across 12 global offices.',
    source: 'Section 2.1 - Scope',
  },
  {
    id: '2',
    question: 'Is there an existing cloud footprint?',
    answer: 'Yes, approximately 30% of workloads already on Azure. Migration targets AWS/GCP.',
    source: 'Section 3.4 - Current State',
  },
  {
    id: '3',
    question: 'What legacy systems need integration?',
    answer: 'SAP ERP, Salesforce CRM, Custom HRIS, and legacy inventory management.',
    source: 'Section 2.3 - Integration Requirements',
  },
  {
    id: '4',
    question: 'Budget flexibility for scope changes?',
    answer: '10% contingency budget allocated. Any overrun requires CIO approval.',
    source: 'Financial Appendix A',
  },
];

export default function TenderAnalysisPage() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: tenderInfo.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const daysUntilDeadline = () => {
    const deadline = new Date(tenderInfo.submissionDeadline);
    const today = new Date();
    const diff = Math.ceil(
      (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff;
  };

  return (
    <PageLayout
      title="Tender Analysis"
      subtitle="AI-extracted requirements and evaluation insights"
    >
      <div className="space-y-6">
        <GlassCard delay={0}>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {tenderInfo.title}
                  </h2>
                  <p className="text-muted-foreground">
                    {tenderInfo.client} • Ref: {tenderInfo.referenceNumber}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">Issue Date</span>
                  </div>
                  <p className="font-medium text-foreground">
                    {new Date(tenderInfo.issueDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 text-error mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">Deadline</span>
                  </div>
                  <p className="font-medium text-foreground">
                    {new Date(tenderInfo.submissionDeadline).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-error mt-1">
                    {daysUntilDeadline()} days remaining
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-xs">Budget Range</span>
                  </div>
                  <p className="font-medium text-foreground">
                    {formatCurrency(tenderInfo.budgetRange.min)} -{' '}
                    {formatCurrency(tenderInfo.budgetRange.max)}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs">Extraction Status</span>
                  </div>
                  <StatusBadge status="success">Complete</StatusBadge>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="lg:col-span-2" delay={0.1}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">
                Extracted Requirements
              </h3>
              <span className="text-sm text-muted-foreground">
                {extractedRequirements.length} requirements identified
              </span>
            </div>

            <div className="space-y-3">
              {extractedRequirements.map((req, index) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="p-4 rounded-lg bg-muted/30 border border-border/30 hover:border-primary/30 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <StatusBadge
                          status={
                            req.priority === 'Mandatory' ? 'error' : 'warning'
                          }
                          size="sm"
                        >
                          {req.priority}
                        </StatusBadge>
                        <span className="text-xs text-muted-foreground">
                          {req.category}
                        </span>
                      </div>
                      <h4 className="font-medium text-foreground mb-1">
                        {req.requirement}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {req.details}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          <GlassCard delay={0.2}>
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Evaluation Criteria
            </h3>

            <div className="space-y-4">
              {evaluationCriteria.map((criteria, index) => (
                <motion.div
                  key={criteria.criterion}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground">
                      {criteria.criterion}
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {criteria.weight}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${criteria.weight}%` }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                      className="h-full gradient-primary rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Key Insight
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Technical approach has highest weight. Focus proposal on
                    demonstrating cloud expertise and migration methodology.
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        <GlassCard delay={0.3}>
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-semibold text-foreground">
              Q&A Extraction
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {questionsAnswers.map((qa, index) => (
              <motion.div
                key={qa.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="p-4 rounded-lg bg-muted/30 border border-border/30"
              >
                <p className="text-sm font-medium text-foreground mb-2">
                  Q: {qa.question}
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  A: {qa.answer}
                </p>
                <p className="text-xs text-accent">
                  Source: {qa.source}
                </p>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </PageLayout>
  );
}
