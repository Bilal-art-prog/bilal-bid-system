import { motion } from 'framer-motion';
import {
  TrendingUp,
  Target,
  DollarSign,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import PageLayout from '../components/layout/PageLayout';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import { GoNoGoBadge } from '../components/ui/StatusBadge';
import { winProbabilityFactors } from '../data/mockData';

const factors = [
  {
    id: 'compliance',
    label: 'Compliance Score',
    value: winProbabilityFactors.complianceScore,
    max: 100,
    icon: CheckCircle2,
    color: '#10b981',
    description: 'Based on mandatory requirements coverage',
  },
  {
    id: 'similar',
    label: 'Similar Project Score',
    value: winProbabilityFactors.similarProjectScore,
    max: 100,
    icon: Target,
    color: '#3b82f6',
    description: 'Match with past successful projects',
  },
  {
    id: 'budget',
    label: 'Budget Alignment',
    value: winProbabilityFactors.budgetAlignment,
    max: 100,
    icon: DollarSign,
    color: '#f59e0b',
    description: 'Competitive positioning within range',
  },
  {
    id: 'historical',
    label: 'Historical Success Rate',
    value: winProbabilityFactors.historicalSuccessRate,
    max: 100,
    icon: BarChart3,
    color: '#0ea5e9',
    description: 'Win rate for similar opportunities',
  },
];

const chartData = factors.map((f) => ({
  name: f.label,
  value: f.value,
  fill: f.color,
}));

export default function WinProbabilityPage() {
  const { overallScore, recommendation } = winProbabilityFactors;

  const getRecommendationColor = () => {
    switch (recommendation) {
      case 'GO':
        return 'from-emerald-500 to-teal-500';
      case 'NO_GO':
        return 'from-rose-500 to-red-500';
      default:
        return 'from-amber-500 to-orange-500';
    }
  };

  return (
    <PageLayout
      title="Win Probability Dashboard"
      subtitle="AI-powered prediction and GO/NO-GO recommendation"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="lg:col-span-1" delay={0}>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Overall Win Probability
              </h3>

              <div className="relative w-48 h-48 mx-auto mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    innerRadius="70%"
                    outerRadius="100%"
                    data={chartData}
                    startAngle={180}
                    endAngle={0}
                  >
                    <PolarAngleAxis
                      type="number"
                      domain={[0, 100]}
                      angleAxisId={0}
                      tick={false}
                    />
                    <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                      <RadialBar
                        angleAxisId={0}
                        background
                        dataKey="value"
                        cornerRadius={10}
                      />
                    </PolarRadiusAxis>
                  </RadialBarChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <motion.p
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 200,
                        delay: 0.3,
                      }}
                      className="text-4xl font-bold text-gradient"
                    >
                      {overallScore}%
                    </motion.p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-1.5 text-success">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+12% from avg</span>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="lg:col-span-2" delay={0.1}>
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Probability Factors
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {factors.map((factor, index) => (
                <motion.div
                  key={factor.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="p-4 rounded-xl bg-muted/30 border border-border/30 hover:border-border/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          background: `${factor.color}20`,
                          boxShadow: `0 0 20px ${factor.color}20`,
                        }}
                      >
                        <factor.icon
                          className="w-5 h-5"
                          style={{ color: factor.color }}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {factor.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {factor.description}
                        </p>
                      </div>
                    </div>
                    <span
                      className="text-2xl font-bold"
                      style={{ color: factor.color }}
                    >
                      {factor.value}%
                    </span>
                  </div>

                  <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${factor.value}%` }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                      className="h-full rounded-full"
                      style={{ background: factor.color }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>

        <GlassCard
          delay={0.5}
          className="overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  delay: 0.6,
                }}
                className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${getRecommendationColor()} flex items-center justify-center shadow-lg`}
                style={{
                  boxShadow: recommendation === 'GO'
                    ? '0 0 40px rgba(16, 185, 129, 0.3)'
                    : '0 0 40px rgba(239, 68, 68, 0.3)',
                }}
              >
                {recommendation === 'GO' ? (
                  <CheckCircle2 className="w-12 h-12 text-white" />
                ) : (
                  <AlertTriangle className="w-12 h-12 text-white" />
                )}
              </motion.div>

              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  AI Recommendation
                </p>
                <div className="mb-2">
                  <GoNoGoBadge type={recommendation} />
                </div>
                <p className="text-sm text-muted-foreground max-w-md">
                  {recommendation === 'GO'
                    ? 'Strong alignment with requirements and competitive positioning. Recommend proceeding with proposal submission.'
                    : recommendation === 'NO_GO'
                    ? 'Significant gaps identified that may impact win probability. Consider addressing gaps before proceeding.'
                    : 'Moderate probability with some areas requiring attention. Review gap analysis before final decision.'}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary">View Analysis</Button>
              <Button className="gap-2">
                Proceed
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard delay={0.6}>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Strengths
            </h3>
            <div className="space-y-3">
              {[
                'Strong compliance with mandatory requirements (87%)',
                'Excellent track record with similar projects',
                'Competitive pricing within budget range',
                'ISO 27001 and SOC 2 certifications aligned',
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-success/10 border border-success/20"
                >
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{item}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          <GlassCard delay={0.7}>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Areas for Improvement
            </h3>
            <div className="space-y-3">
              {[
                'Team size requirement gap - need 2 additional FTEs',
                'Security clearance L3 for remaining personnel',
                'Consider adding case studies for healthcare sector',
                'Budget optimization for margin improvement',
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20"
                >
                  <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{item}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </PageLayout>
  );
}
