import { motion } from 'framer-motion';
import { useState, useMemo, Fragment } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Filter,
  AlertCircle,
  RefreshCw,
  FileText,
  Briefcase,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import GlassCard from '../components/ui/GlassCard';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import {
  useTenderRequirements,
  useCapabilityMatching,
  type MatchResult,
} from '../hooks/useSupabase';

type FilterType = 'all' | 'matched' | 'partial' | 'gap';

export default function ComplianceMatrixPage() {
  const { data: requirements, loading: reqLoading, error: reqError, refetch: refetchReqs } = useTenderRequirements();
  const { matchResults, matchStats, loading: matchLoading, error: matchError } = useCapabilityMatching(requirements);
  const [filter, setFilter] = useState<FilterType>('all');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const loading = reqLoading || matchLoading;
  const error = reqError || matchError;

  const filteredResults = useMemo(() => {
    if (filter === 'all') return matchResults;
    return matchResults.filter(r => r.status === filter);
  }, [matchResults, filter]);

  const statusCounts = useMemo(() => ({
    matched: matchStats.matched,
    partial: matchStats.partial,
    gap: matchStats.gap,
    total: matchResults.length,
  }), [matchStats, matchResults]);

  const overallCompliance = useMemo(() => {
    if (statusCounts.total === 0) return 0;
    return Math.round(((statusCounts.matched * 100) + (statusCounts.partial * 50)) / statusCounts.total);
  }, [statusCounts]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'matched':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'partial':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'gap':
        return <XCircle className="w-5 h-5 text-error" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'matched':
        return 'bg-success/10 border-success/20';
      case 'partial':
        return 'bg-warning/10 border-warning/20';
      case 'gap':
        return 'bg-error/10 border-error/20';
      default:
        return 'bg-muted/30 border-border/50';
    }
  };

  const getMatchStatusText = (status: string) => {
    switch (status) {
      case 'matched':
        return 'PASS';
      case 'partial':
        return 'PARTIAL';
      case 'gap':
        return 'FAIL';
      default:
        return 'PENDING';
    }
  };

  const getEvidence = (result: MatchResult): string => {
    if (result.matchedCapabilities.length === 0) return 'No matching capability found';
    const cap = result.matchedCapabilities[0].capability;
    return `${cap.title} (${cap.type})`;
  };

  const getGapAnalysis = (result: MatchResult): string => {
    if (result.status === 'matched') {
      return 'Requirement fully met by existing capability.';
    }
    if (result.status === 'partial') {
      return `Partial coverage (${result.matchPercentage}%). Consider strengthening capability or acquiring additional resources.`;
    }
    return 'No matching capability. Requires new capability development or partnership.';
  };

  const handleRefresh = () => {
    refetchReqs();
  };

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <PageLayout
      title="Compliance Matrix"
      subtitle="Requirement compliance status with evidence and gap analysis"
    >
      <div className="space-y-6">
        {/* Error Banner */}
        {error && (
          <GlassCard>
            <div className="flex items-center gap-4 p-4">
              <AlertCircle className="w-6 h-6 text-error" />
              <div className="flex-1">
                <p className="font-medium text-foreground">Failed to load compliance data</p>
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

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <GlassCard
            delay={0}
            className={`bg-success/5 border-success/20 cursor-pointer hover:bg-success/10 transition-colors ${filter === 'matched' ? 'ring-2 ring-success' : ''}`}
            onClick={() => setFilter(filter === 'matched' ? 'all' : 'matched')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success">
                  {loading ? '--' : statusCounts.matched}
                </p>
                <p className="text-xs text-muted-foreground">PASS</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard
            delay={0.1}
            className={`bg-warning/5 border-warning/20 cursor-pointer hover:bg-warning/10 transition-colors ${filter === 'partial' ? 'ring-2 ring-warning' : ''}`}
            onClick={() => setFilter(filter === 'partial' ? 'all' : 'partial')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">
                  {loading ? '--' : statusCounts.partial}
                </p>
                <p className="text-xs text-muted-foreground">PARTIAL</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard
            delay={0.2}
            className={`bg-error/5 border-error/20 cursor-pointer hover:bg-error/10 transition-colors ${filter === 'gap' ? 'ring-2 ring-error' : ''}`}
            onClick={() => setFilter(filter === 'gap' ? 'all' : 'gap')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-error/20 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-error" />
              </div>
              <div>
                <p className="text-2xl font-bold text-error">
                  {loading ? '--' : statusCounts.gap}
                </p>
                <p className="text-xs text-muted-foreground">FAIL</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard
            delay={0.3}
            className="bg-primary/5 border-primary/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">
                  {loading ? '--' : `${overallCompliance}%`}
                </p>
                <p className="text-xs text-muted-foreground">Compliance</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Compliance Matrix Table */}
        <GlassCard delay={0.4}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-foreground">
                Requirements Matrix
              </h3>
              <span className="px-2 py-1 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                {filteredResults.length} of {statusCounts.total}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={() => setFilter('all')}
              >
                <Filter className="w-4 h-4" />
                Reset Filter
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 rounded-xl bg-muted/30 border border-border/30">
                  <div className="animate-pulse flex gap-4">
                    <div className="w-8 h-8 rounded-lg bg-muted" />
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded w-64 mb-2" />
                      <div className="h-3 bg-muted rounded w-48" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground w-8"></th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Requirement</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Evidence</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Gap Analysis</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((result, index) => (
                    <Fragment key={result.requirementId}>
                      <motion.tr
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`border-b border-border/30 hover:bg-muted/10 transition-colors cursor-pointer ${expandedRow === result.requirementId ? 'bg-muted/10' : ''}`}
                        onClick={() => toggleRow(result.requirementId)}
                      >
                        <td className="py-4 px-4">
                          {expandedRow === result.requirementId ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-start gap-2">
                            {result.mandatory && (
                              <span className="mt-1 px-1.5 py-0.5 rounded text-xs bg-error/10 text-error font-medium shrink-0">
                                M
                              </span>
                            )}
                            <div>
                              <p className="text-sm font-medium text-foreground max-w-md">
                                {result.requirementText}
                              </p>
                              {result.category && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {result.category}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 w-fit ${getStatusBg(result.status)}`}>
                            {getStatusIcon(result.status)}
                            <span className="text-sm font-semibold">
                              {getMatchStatusText(result.status)}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-foreground max-w-xs truncate">
                            {getEvidence(result)}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-muted-foreground max-w-xs truncate">
                            {getGapAnalysis(result)}
                          </p>
                        </td>
                      </motion.tr>
                      {expandedRow === result.requirementId && (
                        <tr>
                          <td colSpan={5} className="px-4 py-0">
                            <div className="py-4 pl-8 pr-4">
                              <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                                <h4 className="text-sm font-medium text-foreground mb-3">
                                  Matched Capabilities ({result.matchedCapabilities.length})
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {result.matchedCapabilities.map((match, idx) => (
                                    <div
                                      key={idx}
                                      className="p-3 rounded-lg bg-background/50 border border-border/50 flex items-center gap-3"
                                    >
                                      <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                                        <Briefcase className="w-5 h-5 text-primary" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-foreground">
                                          {match.capability.title}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                          <span className="text-xs text-muted-foreground">
                                            {match.capability.type}
                                          </span>
                                          <span className="text-xs text-muted-foreground">
                                            |
                                          </span>
                                          <span className="text-xs text-primary">
                                            {match.matchPercentage}% match
                                          </span>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-lg font-bold text-primary">
                                          {match.confidenceScore}%
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          confidence
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
              No requirements to display. Upload a tender to begin compliance analysis.
            </div>
          )}
        </GlassCard>

        {/* Gap Analysis & Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard delay={0.6}>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <h3 className="text-lg font-semibold text-foreground">
                Gaps & Partial Matches
              </h3>
            </div>
            <div className="space-y-3">
              {loading ? (
                <div className="animate-pulse p-4 rounded-lg bg-muted/30">Loading...</div>
              ) : matchResults.filter(r => r.status === 'gap' || r.status === 'partial').length > 0 ? (
                matchResults
                  .filter(r => r.status === 'gap' || r.status === 'partial')
                  .map((result, index) => (
                    <motion.div
                      key={result.requirementId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className={`p-4 rounded-lg border ${getStatusBg(result.status)}`}
                    >
                      <div className="flex items-start gap-3">
                        {getStatusIcon(result.status)}
                        <div className="flex-1">
                          <p className="font-medium text-foreground mb-1">
                            {result.requirementText}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {getGapAnalysis(result)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs font-medium text-muted-foreground">
                              Match: {result.matchPercentage}%
                            </span>
                            <span className="text-xs text-muted-foreground">|</span>
                            <span className="text-xs font-medium text-muted-foreground">
                              Confidence: {result.confidenceScore}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
              ) : (
                <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <p className="text-sm text-foreground">
                      All requirements fully matched. No gaps identified.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>

          <GlassCard delay={0.7}>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                Recommendations
              </h3>
            </div>
            <div className="space-y-3">
              {loading ? (
                <div className="animate-pulse p-4 rounded-lg bg-muted/30">Loading...</div>
              ) : (
                <>
                  {matchStats.mandatoryCompliance < 100 && (
                    <div className="p-4 rounded-lg bg-error/10 border border-error/20">
                      <p className="text-sm font-medium text-foreground mb-1">
                        Address Mandatory Requirements
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {100 - matchStats.mandatoryCompliance}% of mandatory requirements need attention.
                        Focus on gaps identified above to improve bid competitiveness.
                      </p>
                    </div>
                  )}
                  {matchStats.partial > 0 && (
                    <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                      <p className="text-sm font-medium text-foreground mb-1">
                        Strengthen Partial Matches
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {matchStats.partial} requirements have partial coverage.
                        Consider obtaining additional certifications or documented experience.
                      </p>
                    </div>
                  )}
                  {matchStats.matched > matchStats.total / 2 && (
                    <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                      <p className="text-sm font-medium text-foreground mb-1">
                        Strong Compliance Position
                      </p>
                      <p className="text-xs text-muted-foreground">
                        You have full matches for {matchStats.matched} requirements.
                        Leverage existing capabilities in your proposal.
                      </p>
                    </div>
                  )}
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-sm font-medium text-foreground mb-1">
                      Overall Strategy
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Compliance rate: {overallCompliance}%.
                      {overallCompliance >= 80
                        ? ' Strong competitive position for this tender.'
                        : ' Consider addressing gaps before submission.'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </PageLayout>
  );
}
