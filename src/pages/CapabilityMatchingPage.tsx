import { motion } from 'framer-motion';
import { useMemo, useState, Fragment } from 'react';
import {
  Target,
  Award,
  Briefcase,
  Users,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import GlassCard from '../components/ui/GlassCard';
import ProgressBar from '../components/ui/ProgressBar';
import StatusBadge from '../components/ui/StatusBadge';
import {
  useCapabilityLibrary,
  useTenderRequirements,
  useCapabilityMatching,
  type CapabilityItem,
} from '../hooks/useSupabase';

export default function CapabilityMatchingPage() {
  const { data: capabilities, loading: capabilitiesLoading, error: capabilitiesError, refetch: refetchCapabilities } = useCapabilityLibrary();
  const { data: requirements, loading: requirementsLoading, error: requirementsError, refetch: refetchRequirements } = useTenderRequirements();
  const { matchResults, matchStats, loading: matchingLoading, error: matchingError } = useCapabilityMatching(requirements);
  const [expandedRequirement, setExpandedRequirement] = useState<string | null>(null);

  const matchCategories = useMemo(() => {
    if (!capabilities) return [];
    return [
      {
        type: 'project',
        label: 'Matching Projects',
        count: capabilities.filter(c => c.type === 'project').length,
        icon: Briefcase,
        color: '#3b82f6',
      },
      {
        type: 'certification',
        label: 'Certifications',
        count: capabilities.filter(c => c.type === 'certification').length,
        icon: Award,
        color: '#10b981',
      },
      {
        type: 'experience',
        label: 'Experience Records',
        count: capabilities.filter(c => c.type === 'experience').length,
        icon: Target,
        color: '#f59e0b',
      },
      {
        type: 'resource',
        label: 'Team Resources',
        count: capabilities.filter(c => c.type === 'resource').length,
        icon: Users,
        color: '#0ea5e9',
      },
    ];
  }, [capabilities]);

  const overallScore = useMemo(() => {
    if (!capabilities || capabilities.length === 0) return 0;
    const avg = capabilities.reduce((sum, c) => sum + c.relevance_score, 0) / capabilities.length;
    return Math.round(avg);
  }, [capabilities]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <Briefcase className="w-5 h-5" />;
      case 'certification':
        return <Award className="w-5 h-5" />;
      case 'experience':
        return <Target className="w-5 h-5" />;
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'project':
        return 'bg-primary/15 text-primary';
      case 'certification':
        return 'bg-success/15 text-success';
      case 'experience':
        return 'bg-warning/15 text-warning';
      default:
        return 'bg-accent/15 text-accent';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'matched':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'partial':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'gap':
        return <XCircle className="w-5 h-5 text-error" />;
      default:
        return null;
    }
  };

  const handleRefresh = () => {
    refetchCapabilities();
    refetchRequirements();
  };

  const toggleRequirement = (id: string) => {
    setExpandedRequirement(expandedRequirement === id ? null : id);
  };

  const loading = capabilitiesLoading || requirementsLoading || matchingLoading;
  const error = capabilitiesError || requirementsError || matchingError;

  return (
    <PageLayout
      title="Capability Matching"
      subtitle="AI-matched capabilities against tender requirements"
    >
      <div className="space-y-6">
        {/* Error Banner */}
        {error && (
          <GlassCard>
            <div className="flex items-center gap-4 p-4">
              <AlertCircle className="w-6 h-6 text-error" />
              <div className="flex-1">
                <p className="font-medium text-foreground">Failed to load data</p>
                <p className="text-sm text-muted-foreground">{error.message}</p>
              </div>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
            </div>
          </GlassCard>
        )}

        {/* Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {matchCategories.map((category, index) => (
            <GlassCard key={category.type} delay={index * 0.1}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {category.label}
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {loading ? '--' : category.count}
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: `${category.color}15`,
                    boxShadow: `0 0 20px ${category.color}20`,
                  }}
                >
                  <category.icon
                    className="w-6 h-6"
                    style={{ color: category.color }}
                  />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Overall Match Score */}
        <GlassCard delay={0.4}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Overall Match Score
              </h3>
              <p className="text-sm text-muted-foreground">
                Confidence level based on matched capabilities
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-4xl font-bold text-gradient">
                {loading ? '--' : `${matchStats.overallScore}%`}
              </div>
              {!loading && matchStats.overallScore > 0 && (
                <div className="flex items-center gap-1 text-success">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {matchStats.mandatoryCompliance}% mandatory compliance
                  </span>
                </div>
              )}
            </div>
          </div>
          <ProgressBar
            value={matchStats.overallScore}
            size="lg"
            variant="default"
          />
        </GlassCard>

        {/* Matching Results Table */}
        <GlassCard delay={0.5}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Requirement Matching Results
              </h3>
              <p className="text-sm text-muted-foreground">
                {requirements?.length || 0} requirements analyzed
              </p>
            </div>
            <button className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
              View Full Report
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-xl bg-muted/30 border border-border/30">
                  <div className="animate-pulse flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-muted" />
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded w-64 mb-2" />
                      <div className="h-3 bg-muted rounded w-48" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : matchResults.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground w-8"></th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Requirement</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Match %</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Confidence</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {matchResults.map((result, index) => (
                    <Fragment key={result.requirementId}>
                      <motion.tr
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-border/30 hover:bg-muted/20 transition-colors cursor-pointer"
                        onClick={() => toggleRequirement(result.requirementId)}
                      >
                        <td className="py-4 px-4">
                          {expandedRequirement === result.requirementId ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {result.mandatory && (
                              <span className="px-1.5 py-0.5 rounded text-xs bg-error/10 text-error font-medium">
                                M
                              </span>
                            )}
                            <p className="font-medium text-foreground max-w-md truncate">
                              {result.requirementText}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-muted-foreground">
                            {result.category || 'General'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-muted/50 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  result.matchPercentage >= 75
                                    ? 'bg-success'
                                    : result.matchPercentage >= 50
                                    ? 'bg-warning'
                                    : 'bg-error'
                                }`}
                                style={{ width: `${result.matchPercentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-foreground">
                              {result.matchPercentage}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm font-medium text-foreground">
                            {result.confidenceScore}%
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(result.status)}
                            <StatusBadge
                              status={
                                result.status === 'matched'
                                  ? 'success'
                                  : result.status === 'partial'
                                  ? 'warning'
                                  : 'error'
                              }
                            >
                              {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                            </StatusBadge>
                          </div>
                        </td>
                      </motion.tr>
                      {expandedRequirement === result.requirementId && (
                        <tr>
                          <td colSpan={6} className="px-4 py-0">
                            <div className="py-4">
                              <div className="pl-8 pr-4">
                                <p className="text-sm font-medium text-foreground mb-3">
                                  Matched Capabilities ({result.matchedCapabilities.length})
                                </p>
                                <div className="space-y-2">
                                  {result.matchedCapabilities.map((match, idx) => (
                                    <div
                                      key={idx}
                                      className="p-3 rounded-lg bg-muted/30 border border-border/30 flex items-center gap-3"
                                    >
                                      <div
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(
                                          match.capability.type
                                        )}`}
                                      >
                                        {getTypeIcon(match.capability.type)}
                                      </div>
                                      <div className="flex-1">
                                        <p className="font-medium text-foreground text-sm">
                                          {match.capability.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {match.matchType} match
                                          {match.matchDetails.length > 0 && ` - ${match.matchDetails[0]}`}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-sm font-bold text-primary">
                                          {match.matchPercentage}%
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {match.confidenceScore}% conf
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              No requirements to match. Upload a tender to begin analysis.
            </div>
          )}
        </GlassCard>

        {/* Match Summary Statistics */}
        <GlassCard delay={0.6}>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <h3 className="text-lg font-semibold text-foreground">
              Match Summary
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-success/10 border border-success/20">
              <p className="text-sm text-muted-foreground mb-1">
                Full Match
              </p>
              <p className="text-2xl font-bold text-success">
                {loading ? '--' : matchStats.matched}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Requirements fully matched
              </p>
            </div>
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
              <p className="text-sm text-muted-foreground mb-1">
                Partial Match
              </p>
              <p className="text-2xl font-bold text-warning">
                {loading ? '--' : matchStats.partial}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Requirements partially matched
              </p>
            </div>
            <div className="p-4 rounded-lg bg-error/10 border border-error/20">
              <p className="text-sm text-muted-foreground mb-1">
                Gap Identified
              </p>
              <p className="text-2xl font-bold text-error">
                {loading ? '--' : matchStats.gap}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Requirements not matched
              </p>
            </div>
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">
                Mandatory Compliance
              </p>
              <p className="text-2xl font-bold text-primary">
                {loading ? '--' : `${matchStats.mandatoryCompliance}%`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Mandatory requirements met
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </PageLayout>
  );
}
