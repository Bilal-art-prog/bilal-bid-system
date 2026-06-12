export interface CapabilityItem {
  id: string;
  type: 'project' | 'certification' | 'experience' | 'resource';
  title: string;
  description: string;
  relevance_score: number;
  details: Record<string, unknown>;
  domain: string | null;
  client_type: string | null;
  certification_type: string | null;
  project_summary: string | null;
  keywords: string[] | null;
}

export interface TenderRequirement {
  id: string;
  requirement_text: string;
  category: string | null;
  domain: string | null;
  client_type: string | null;
  certification_required: string | null;
  mandatory: boolean;
  weight: number;
  keywords: string[] | null;
}

export interface MatchResult {
  requirementId: string;
  requirementText: string;
  category: string | null;
  mandatory: boolean;
  matchedCapabilities: CapabilityMatch[];
  matchPercentage: number;
  confidenceScore: number;
  status: 'matched' | 'partial' | 'gap';
}

export interface CapabilityMatch {
  capability: CapabilityItem;
  matchPercentage: number;
  confidenceScore: number;
  matchType: 'domain' | 'certification' | 'client_type' | 'keyword' | 'project_summary';
  matchDetails: string[];
}

interface Weights {
  domain: number;
  certification: number;
  clientType: number;
  keyword: number;
  projectSummary: number;
}

const DEFAULT_WEIGHTS: Weights = {
  domain: 30,
  certification: 35,
  clientType: 15,
  keyword: 15,
  projectSummary: 5,
};

function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

function keywordOverlapScore(requirementKeywords: string[], capabilityKeywords: string[]): number {
  if (!requirementKeywords?.length || !capabilityKeywords?.length) return 0;

  const normalizedReq = requirementKeywords.map(normalizeText);
  const normalizedCap = capabilityKeywords.map(normalizeText);

  const matches = normalizedReq.filter(k =>
    normalizedCap.some(ck => ck.includes(k) || k.includes(ck))
  );

  return (matches.length / requirementKeywords.length) * 100;
}

function textSimilarityScore(text1: string, text2: string): number {
  if (!text1 || !text2) return 0;

  const words1 = normalizeText(text1).split(/\s+/);
  const words2 = normalizeText(text2).split(/\s+/);

  const commonWords = words1.filter(w =>
    words2.some(w2 => w2.includes(w) || w.includes(w2))
  );

  return (commonWords.length / Math.max(words1.length, 1)) * 100;
}

function domainMatchScore(requirementDomain: string | null, capabilityDomain: string | null): number {
  if (!requirementDomain || !capabilityDomain) return 0;

  const reqDomain = normalizeText(requirementDomain);
  const capDomain = normalizeText(capabilityDomain);

  if (reqDomain === capDomain) return 100;
  if (reqDomain.includes(capDomain) || capDomain.includes(reqDomain)) return 80;

  // Check for related domains
  const domainSynonyms: Record<string, string[]> = {
    'cloud services': ['cloud', 'cloud architecture', 'infrastructure'],
    'information security': ['security', 'cybersecurity', 'information security'],
    'digital transformation': ['software', 'enterprise software', 'portal'],
    'healthcare it': ['healthcare', 'medical', 'hipaa'],
  };

  for (const [key, synonyms] of Object.entries(domainSynonyms)) {
    const normalizedSynonyms = synonyms.map(normalizeText);
    if (normalizedSynonyms.includes(reqDomain) && normalizedSynonyms.includes(capDomain)) {
      return 70;
    }
  }

  return 0;
}

function certificationMatchScore(
  requiredCert: string | null,
  capabilityCert: string | null,
  capabilityType: string
): number {
  if (!requiredCert) return 50; // No cert required, partial match
  if (capabilityType !== 'certification') return 0;

  if (!capabilityCert) return 0;

  const reqCert = normalizeText(requiredCert);
  const capCert = normalizeText(capabilityCert);

  if (reqCert === capCert) return 100;
  if (reqCert.includes(capCert) || capCert.includes(reqCert)) return 90;

  // Check for related certifications
  const certEquivalents: Record<string, string[]> = {
    'iso 27001': ['iso 27001:2013', 'iso27001', 'iso-27001'],
    'soc 2': ['soc 2 type ii', 'soc2', 'soc-2'],
    'aws': ['aws partner', 'aws advanced partner', 'aws certified'],
  };

  for (const [key, equivalents] of Object.entries(certEquivalents)) {
    const allCerts = [key, ...equivalents].map(normalizeText);
    if (allCerts.includes(reqCert) && allCerts.includes(capCert)) {
      return 95;
    }
  }

  return 0;
}

function clientTypeMatchScore(
  requiredClientType: string | null,
  capabilityClientType: string | null
): number {
  if (!requiredClientType || !capabilityClientType) return 50;

  const reqType = normalizeText(requiredClientType);
  const capType = normalizeText(capabilityClientType);

  if (capType === 'any') return 75;
  if (reqType === capType) return 100;

  // Enterprise can often cover other types
  if (capType === 'enterprise' && ['government', 'finance', 'healthcare'].includes(reqType)) {
    return 70;
  }

  return 30;
}

export function matchRequirementToCapabilities(
  requirement: TenderRequirement,
  capabilities: CapabilityItem[],
  weights: Weights = DEFAULT_WEIGHTS
): MatchResult {
  const matchedCapabilities: CapabilityMatch[] = [];

  for (const capability of capabilities) {
    const matchDetails: string[] = [];
    let totalScore = 0;
    let matchCount = 0;

    // Domain matching
    const domainScore = domainMatchScore(requirement.domain, capability.domain);
    if (domainScore > 0) {
      totalScore += (domainScore / 100) * weights.domain;
      matchCount++;
      if (domainScore >= 70) {
        matchDetails.push(`Domain match: ${capability.domain}`);
      }
    }

    // Certification matching
    const certScore = certificationMatchScore(
      requirement.certification_required,
      capability.certification_type,
      capability.type
    );
    if (certScore > 0) {
      if (requirement.certification_required) {
        totalScore += (certScore / 100) * weights.certification;
        matchCount++;
        if (certScore >= 90) {
          matchDetails.push(`Certification match: ${capability.certification_type || capability.title}`);
        }
      }
    }

    // Client type matching
    const clientScore = clientTypeMatchScore(requirement.client_type, capability.client_type);
    totalScore += (clientScore / 100) * weights.clientType;
    if (clientScore >= 70) {
      matchDetails.push(`Client type compatible: ${capability.client_type}`);
    }

    // Keyword matching
    const keywordScore = keywordOverlapScore(requirement.keywords || [], capability.keywords || []);
    totalScore += (keywordScore / 100) * weights.keyword;
    if (keywordScore >= 50) {
      matchDetails.push(`Keyword overlap: ${Math.round(keywordScore)}%`);
    }

    // Project summary text similarity
    const summaryScore = textSimilarityScore(
      requirement.requirement_text,
      capability.project_summary || capability.description
    );
    totalScore += (summaryScore / 100) * weights.projectSummary;

    // Calculate final match percentage
    const matchPercentage = Math.min(100, Math.round(totalScore));

    // Calculate confidence based on match quality
    const confidenceScore = Math.round(
      (matchCount / 3) * 40 +
      (matchPercentage > 80 ? 30 : matchPercentage > 60 ? 20 : 10) +
      (matchDetails.length > 2 ? 30 : matchDetails.length * 10)
    );

    // Determine match type
    let matchType: CapabilityMatch['matchType'] = 'keyword';
    if (certScore >= 90) matchType = 'certification';
    else if (domainScore >= 70) matchType = 'domain';
    else if (clientScore >= 70) matchType = 'client_type';
    else if (summaryScore >= 30) matchType = 'project_summary';

    if (matchPercentage >= 40) {
      matchedCapabilities.push({
        capability,
        matchPercentage,
        confidenceScore,
        matchType,
        matchDetails,
      });
    }
  }

  // Sort by match percentage descending
  matchedCapabilities.sort((a, b) => b.matchPercentage - a.matchPercentage);

  // Calculate overall match for requirement
  const overallPercentage = matchedCapabilities.length > 0
    ? Math.round(matchedCapabilities.reduce((sum, m) => sum + m.matchPercentage, 0) / Math.min(3, matchedCapabilities.length))
    : 0;

  const overallConfidence = matchedCapabilities.length > 0
    ? Math.round(matchedCapabilities.reduce((sum, m) => sum + m.confidenceScore, 0) / matchedCapabilities.length)
    : 0;

  // Determine status
  let status: 'matched' | 'partial' | 'gap';
  if (overallPercentage >= 75 && matchedCapabilities.length >= 1) {
    status = 'matched';
  } else if (overallPercentage >= 50 && matchedCapabilities.length >= 1) {
    status = 'partial';
  } else {
    status = 'gap';
  }

  return {
    requirementId: requirement.id,
    requirementText: requirement.requirement_text,
    category: requirement.category,
    mandatory: requirement.mandatory,
    matchedCapabilities: matchedCapabilities.slice(0, 5), // Top 5 matches
    matchPercentage: overallPercentage,
    confidenceScore: overallConfidence,
    status,
  };
}

export function runFullMatching(
  requirements: TenderRequirement[],
  capabilities: CapabilityItem[]
): MatchResult[] {
  return requirements.map(req => matchRequirementToCapabilities(req, capabilities));
}

export function calculateOverallMatchStats(results: MatchResult[]): {
  matched: number;
  partial: number;
  gap: number;
  overallScore: number;
  mandatoryCompliance: number;
} {
  const matched = results.filter(r => r.status === 'matched').length;
  const partial = results.filter(r => r.status === 'partial').length;
  const gap = results.filter(r => r.status === 'gap').length;

  const overallScore = Math.round(
    results.reduce((sum, r) => sum + r.matchPercentage, 0) / results.length
  );

  const mandatoryResults = results.filter(r => r.mandatory);
  const mandatoryMatched = mandatoryResults.filter(r => r.status === 'matched').length;
  const mandatoryCompliance = mandatoryResults.length > 0
    ? Math.round((mandatoryMatched / mandatoryResults.length) * 100)
    : 100;

  return {
    matched,
    partial,
    gap,
    overallScore,
    mandatoryCompliance,
  };
}
