import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  File,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  progress: number;
}

const acceptedTypes = [
  { ext: '.pdf', type: 'application/pdf', label: 'PDF' },
  { ext: '.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', label: 'DOCX' },
  { ext: '.doc', type: 'application/msword', label: 'DOC' },
];

export default function UploadTenderPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const generateId = () => Math.random().toString(36).substring(2, 9);

  const simulateUpload = useCallback((fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, progress: 100, status: 'processing' } : f
          )
        );

        setTimeout(() => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId
                ? { ...f, status: Math.random() > 0.1 ? 'complete' : 'error' }
                : f
            )
          );
        }, 2000);
      } else {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, progress: Math.min(progress, 100) } : f
          )
        );
      }
    }, 100);
  }, []);

  const handleFiles = useCallback(
    (fileList: FileList) => {
      Array.from(fileList).forEach((file) => {
        const fileId = generateId();
        const newFile: UploadedFile = {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'uploading',
          progress: 0,
        };

        setFiles((prev) => [...prev, newFile]);
        simulateUpload(fileId);
      });
    },
    [simulateUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files);
      }
    },
    [handleFiles]
  );

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      case 'complete':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-error" />;
      default:
        return null;
    }
  };

  return (
    <PageLayout
      title="Upload Tender"
      subtitle="Upload your tender documents for AI-powered analysis"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <GlassCard delay={0}>
          <motion.div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            animate={{
              scale: isDragging ? 1.02 : 1,
              borderColor: isDragging
                ? 'rgba(59, 130, 246, 0.5)'
                : 'rgba(255, 255, 255, 0.08)',
            }}
            className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
              isDragging ? 'bg-primary/5' : ''
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              multiple
              onChange={handleInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <motion.div
              animate={{ y: isDragging ? -10 : 0 }}
              className="relative z-10"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                <Upload className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-xl font-semibold text-foreground mb-2">
                {isDragging
                  ? 'Drop files here'
                  : 'Drag and drop your tender documents'}
              </h3>
              <p className="text-muted-foreground mb-4">
                or click to browse from your computer
              </p>

              <div className="flex items-center justify-center gap-3">
                {acceptedTypes.map((type) => (
                  <div
                    key={type.ext}
                    className="px-3 py-1.5 rounded-lg bg-muted/50 text-sm text-muted-foreground border border-border/50"
                  >
                    {type.label}
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                Maximum file size: 50MB per file
              </p>
            </motion.div>
          </motion.div>
        </GlassCard>

        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-3"
            >
              <h3 className="text-lg font-semibold text-foreground">
                Uploaded Files ({files.length})
              </h3>

              {files.map((file, index) => (
                <GlassCard key={file.id} delay={index * 0.1}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      {getFileIcon(file.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-foreground truncate">
                          {file.name}
                        </p>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-1 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {formatFileSize(file.size)}
                      </p>

                      {file.status === 'uploading' && (
                        <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${file.progress}%` }}
                            className="h-full gradient-primary rounded-full"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {file.status === 'processing' && (
                        <span className="text-sm text-primary animate-pulse">
                          Processing with AI...
                        </span>
                      )}
                      {getStatusIcon(file.status)}
                    </div>
                  </div>
                </GlassCard>
              ))}

              <div className="flex justify-end pt-4">
                <Button className="gap-2">
                  Continue to Analysis
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <GlassCard delay={0.2}>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Upload Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Supported Formats',
                description:
                  'PDF, DOCX, and DOC files are supported. Scanned documents should be OCR processed.',
              },
              {
                title: 'File Size',
                description:
                  'Maximum 50MB per file. Larger files can be split into multiple uploads.',
              },
              {
                title: 'Content Requirements',
                description:
                  'Ensure documents include all tender requirements, evaluation criteria, and submission guidelines.',
              },
              {
                title: 'Processing Time',
                description:
                  'AI analysis typically completes within 2-5 minutes depending on document complexity.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="p-4 rounded-lg bg-muted/30 border border-border/30"
              >
                <h4 className="font-medium text-foreground mb-1">
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </PageLayout>
  );
}
