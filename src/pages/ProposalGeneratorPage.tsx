import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Check,
  Clock,
  Edit3,
  Sparkles,
  Save,
  ChevronDown,
  ChevronUp,
  Wand2,
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import { proposalSections } from '../data/mockData';

interface Section {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  status: 'draft' | 'review' | 'approved';
  lastEdited: string;
  isEditing?: boolean;
}

export default function ProposalGeneratorPage() {
  const [sections, setSections] = useState<Section[]>(proposalSections);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Check className="w-4 h-4 text-success" />;
      case 'review':
        return <Clock className="w-4 h-4 text-warning" />;
      default:
        return <Edit3 className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const handleEdit = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isEditing: true } : s))
    );
  };

  const handleSave = async (id: string) => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSections((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              isEditing: false,
              status: 'review',
              lastEdited: new Date().toISOString(),
            }
          : s
      )
    );
    setSaving(false);
  };

  const handleContentChange = (id: string, content: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, content, wordCount: content.split(/\s+/).filter(Boolean).length }
          : s
      )
    );
  };

  const handleAIEnhance = async (id: string) => {
    const section = sections.find((s) => s.id === id);
    if (!section) return;

    const enhanced = section.content + '\n\n[AI-Enhanced] Additional insights: Our team brings unparalleled expertise in enterprise cloud migrations, backed by a 100% on-time delivery record and industry-leading customer satisfaction scores of 4.9/5.';

    handleContentChange(id, enhanced);
  };

  const totalWords = sections.reduce((acc, s) => acc + s.wordCount, 0);
  const approvedCount = sections.filter((s) => s.status === 'approved').length;
  const progressPercent = (approvedCount / sections.length) * 100;

  return (
    <PageLayout
      title="Proposal Generator"
      subtitle="Create and edit your proposal sections"
    >
      <div className="space-y-6">
        <GlassCard delay={0}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Proposal Progress
              </h3>
              <p className="text-sm text-muted-foreground">
                {approvedCount} of {sections.length} sections approved
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">
                  {totalWords.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Total Words</p>
              </div>
            </div>
          </div>

          <div className="h-3 bg-muted/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8 }}
              className="h-full gradient-primary rounded-full"
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Draft</span>
            <span>Review</span>
            <span>Approved</span>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 gap-4">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <GlassCard className="overflow-hidden">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    setExpandedSection(
                      expandedSection === section.id ? null : section.id
                    )
                  }
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        section.status === 'approved'
                          ? 'bg-success/15'
                          : section.status === 'review'
                          ? 'bg-warning/15'
                          : 'bg-muted/50'
                      }`}
                    >
                      {getStatusIcon(section.status)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {section.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {section.wordCount} words
                        </span>
                        <StatusBadge
                          status={
                            section.status === 'approved'
                              ? 'success'
                              : section.status === 'review'
                              ? 'warning'
                              : 'neutral'
                          }
                          size="sm"
                        >
                          {section.status}
                        </StatusBadge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Last edited{' '}
                      {new Date(section.lastEdited).toLocaleDateString()}
                    </span>
                    {expandedSection === section.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedSection === section.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-4 pt-4 border-t border-border/30"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-foreground">
                          Content
                        </label>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5"
                            onClick={() => handleAIEnhance(section.id)}
                          >
                            <Wand2 className="w-3.5 h-3.5" />
                            Enhance with AI
                          </Button>
                          {section.isEditing && (
                            <Button
                              size="sm"
                              className="gap-1.5"
                              onClick={() => handleSave(section.id)}
                              loading={saving}
                            >
                              <Save className="w-3.5 h-3.5" />
                              Save
                            </Button>
                          )}
                        </div>
                      </div>

                      {section.isEditing ? (
                        <textarea
                          value={section.content}
                          onChange={(e) =>
                            handleContentChange(section.id, e.target.value)
                          }
                          className="w-full h-64 p-4 rounded-lg bg-muted/30 border border-border/50 text-foreground text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                        />
                      ) : (
                        <div
                          className="p-4 rounded-lg bg-muted/20 border border-border/30 min-h-32"
                          onClick={() => handleEdit(section.id)}
                        >
                          <p className="text-sm text-foreground whitespace-pre-wrap">
                            {section.content}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <p className="text-xs text-muted-foreground">
                          Click on content to edit
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Characters: {section.content.length}</span>
                          <span>Words: {section.wordCount}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <GlassCard delay={0.5}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg gradient-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">AI Assistant</h3>
              <p className="text-sm text-muted-foreground">
                Get help writing and improving your proposal
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button className="p-4 rounded-lg bg-muted/30 border border-border/30 hover:border-primary/30 hover:bg-primary/5 transition-all text-left group">
              <p className="font-medium text-foreground mb-1 group-hover:text-primary transition-colors">
                Generate Executive Summary
              </p>
              <p className="text-xs text-muted-foreground">
                Create a compelling overview
              </p>
            </button>
            <button className="p-4 rounded-lg bg-muted/30 border border-border/30 hover:border-primary/30 hover:bg-primary/5 transition-all text-left group">
              <p className="font-medium text-foreground mb-1 group-hover:text-primary transition-colors">
                Improve Section
              </p>
              <p className="text-xs text-muted-foreground">
                Enhance clarity and impact
              </p>
            </button>
            <button className="p-4 rounded-lg bg-muted/30 border border-border/30 hover:border-primary/30 hover:bg-primary/5 transition-all text-left group">
              <p className="font-medium text-foreground mb-1 group-hover:text-primary transition-colors">
                Check Compliance
              </p>
              <p className="text-xs text-muted-foreground">
                Verify requirements coverage
              </p>
            </button>
          </div>
        </GlassCard>

        <div className="flex justify-end gap-3">
          <Button variant="secondary">Export as PDF</Button>
          <Button className="gap-2">
            <FileText className="w-4 h-4" />
            Submit Proposal
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
