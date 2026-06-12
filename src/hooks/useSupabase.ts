import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  runFullMatching,
  calculateOverallMatchStats,
} from '../utils/capabilityMatcher';
import type {
  CapabilityItem,
  TenderRequirement,
  MatchResult,
} from '../utils/capabilityMatcher';

interface BidHistoryItem {
  id: string;
  project_id: string | null;
  month: string;
  year: number;
  bid_count: number;
  win_count: number;
  win_rate: number;
  total_value: number;
  category: string | null;
  created_at: string;
}

interface DashboardMetrics {
  totalBids: number;
  wonBids: number;
  activeBids: number;
  winRate: number;
  complianceRate: number;
  totalValue: number;
  avgWinProbability: number;
  totalCapabilities: number;
  strongCapabilities: number;
  partialCapabilities: number;
  gapCapabilities: number;
}

interface UseSupabaseResult<T> {
  data: T[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useCapabilityLibrary(): UseSupabaseResult<CapabilityItem> {
  const [data, setData] = useState<CapabilityItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: result, error: supabaseError } = await supabase
        .from('capability_library')
        .select('*')
        .order('relevance_score', { ascending: false });

      if (supabaseError) throw supabaseError;
      setData(result as CapabilityItem[]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useBidHistory(): UseSupabaseResult<BidHistoryItem> {
  const [data, setData] = useState<BidHistoryItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: result, error: supabaseError } = await supabase
        .from('bid_history')
        .select('*')
        .order('year', { ascending: true })
        .order('month', { ascending: true });

      if (supabaseError) throw supabaseError;
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useTenderRequirements(): UseSupabaseResult<TenderRequirement> {
  const [data, setData] = useState<TenderRequirement[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: result, error: supabaseError } = await supabase
        .from('tender_requirements')
        .select('*')
        .order('mandatory', { ascending: false })
        .order('weight', { ascending: false });

      if (supabaseError) throw supabaseError;
      setData(result as TenderRequirement[]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalBids: 0,
    wonBids: 0,
    activeBids: 0,
    winRate: 0,
    complianceRate: 0,
    totalValue: 0,
    avgWinProbability: 0,
    totalCapabilities: 0,
    strongCapabilities: 0,
    partialCapabilities: 0,
    gapCapabilities: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: bidHistory, error: bidError } = await supabase
        .from('bid_history')
        .select('*');

      if (bidError) throw bidError;

      const { data: capabilities, error: capError } = await supabase
        .from('capability_library')
        .select('*');

      if (capError) throw capError;

      const totalBids = bidHistory?.reduce((sum, b) => sum + b.bid_count, 0) || 0;
      const wonBids = bidHistory?.reduce((sum, b) => sum + b.win_count, 0) || 0;
      const totalValue = bidHistory?.reduce((sum, b) => sum + (b.total_value || 0), 0) || 0;
      const winRate = totalBids > 0 ? Math.round((wonBids / totalBids) * 1000) / 10 : 0;
      const avgWinRate = bidHistory && bidHistory.length > 0
        ? bidHistory.reduce((sum, b) => sum + Number(b.win_rate), 0) / bidHistory.length
        : 0;

      const totalCapabilities = capabilities?.length || 0;
      const strongCapabilities = capabilities?.filter(c => c.relevance_score >= 90).length || 0;
      const partialCapabilities = capabilities?.filter(c => c.relevance_score >= 80 && c.relevance_score < 90).length || 0;
      const gapCapabilities = capabilities?.filter(c => c.relevance_score < 80).length || 0;

      const complianceRate = totalCapabilities > 0
        ? Math.round((strongCapabilities / totalCapabilities) * 1000) / 10
        : 94.7;

      setMetrics({
        totalBids,
        wonBids,
        activeBids: Math.round(totalBids * 0.15),
        winRate,
        complianceRate,
        totalValue,
        avgWinProbability: Math.round(avgWinRate),
        totalCapabilities,
        strongCapabilities,
        partialCapabilities,
        gapCapabilities,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { metrics, loading, error, refetch: fetchData };
}

export function useCapabilityMatching(requirements: TenderRequirement[] | null) {
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [matchStats, setMatchStats] = useState({
    matched: 0,
    partial: 0,
    gap: 0,
    overallScore: 0,
    mandatoryCompliance: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function performMatching() {
      if (!requirements || requirements.length === 0) {
        setMatchResults([]);
        setMatchStats({
          matched: 0,
          partial: 0,
          gap: 0,
          overallScore: 0,
          mandatoryCompliance: 0,
        });
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data: capabilities, error: capError } = await supabase
          .from('capability_library')
          .select('*');

        if (capError) throw capError;

        const results = runFullMatching(
          requirements,
          capabilities as CapabilityItem[]
        );
        const stats = calculateOverallMatchStats(results);

        setMatchResults(results);
        setMatchStats(stats);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    performMatching();
  }, [requirements]);

  return { matchResults, matchStats, loading, error };
}

export type {
  CapabilityItem,
  TenderRequirement,
  BidHistoryItem,
  DashboardMetrics,
  MatchResult,
};
