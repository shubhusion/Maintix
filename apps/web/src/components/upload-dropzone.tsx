'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, FileText, ImageIcon, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api-client';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  ALLOWED_FILE_TYPES,
  ALLOWED_FILE_EXTENSIONS,
  MAX_UPLOAD_SIZE,
  MAX_ATTACHMENTS_PER_TICKET,
} from '@maintix/shared-types';

interface UploadDropzoneProps {
  ticketId: string;
  propertyId: string;
  currentCount: number;
  onUploadComplete: () => void;
}

interface UploadState {
  file: File;
  progress: number;
  status: 'uploading' | 'done' | 'error';
  error?: string;
}

export function UploadDropzone({
  ticketId,
  propertyId,
  currentCount,
  onUploadComplete,
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const remaining = MAX_ATTACHMENTS_PER_TICKET - currentCount;

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return `"${file.name}" is not a supported file type. Allowed: ${ALLOWED_FILE_EXTENSIONS.join(', ')}`;
      }
      if (file.size > MAX_UPLOAD_SIZE) {
        return `"${file.name}" exceeds the ${MAX_UPLOAD_SIZE / (1024 * 1024)}MB size limit`;
      }
      return null;
    },
    [],
  );

  const uploadFile = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      setUploads((prev) => [...prev, { file, progress: 0, status: 'uploading' }]);

      try {
        await api.uploadWithProgress(
          `/properties/${propertyId}/tickets/${ticketId}/attachments`,
          formData,
          (percent) => {
            setUploads((prev) =>
              prev.map((u) => (u.file === file ? { ...u, progress: percent } : u)),
            );
          },
        );

        setUploads((prev) =>
          prev.map((u) => (u.file === file ? { ...u, progress: 100, status: 'done' } : u)),
        );
        onUploadComplete();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        setUploads((prev) =>
          prev.map((u) => (u.file === file ? { ...u, status: 'error', error: message } : u)),
        );
        toast({ title: 'Upload failed', description: message, variant: 'destructive' });
      }
    },
    [ticketId, propertyId, onUploadComplete, toast],
  );

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);

      if (fileArray.length > remaining) {
        toast({
          title: 'Too many files',
          description: `You can only upload ${remaining} more file${remaining !== 1 ? 's' : ''}`,
          variant: 'destructive',
        });
        return;
      }

      for (const file of fileArray) {
        const error = validateFile(file);
        if (error) {
          toast({ title: 'Invalid file', description: error, variant: 'destructive' });
          return;
        }
      }

      for (const file of fileArray) {
        uploadFile(file);
      }
    },
    [remaining, validateFile, uploadFile, toast],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (remaining <= 0) {
        toast({
          title: 'Limit reached',
          description: `Maximum of ${MAX_ATTACHMENTS_PER_TICKET} attachments per ticket`,
          variant: 'destructive',
        });
        return;
      }

      handleFiles(e.dataTransfer.files);
    },
    [remaining, handleFiles, toast],
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files);
        e.target.value = '';
      }
    },
    [handleFiles],
  );

  const clearCompleted = useCallback(() => {
    setUploads((prev) => prev.filter((u) => u.status === 'uploading'));
  }, []);

  if (remaining <= 0) return null;

  const activeUploads = uploads.filter((u) => u.status === 'uploading');
  const completedUploads = uploads.filter((u) => u.status !== 'uploading');

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50',
        )}
      >
        <Upload
          className={cn(
            'h-8 w-8 transition-colors',
            isDragging ? 'text-primary' : 'text-muted-foreground',
          )}
        />
        <div className="text-center">
          <p className="text-sm font-medium">
            {isDragging ? 'Drop files here' : 'Drag & drop files or click to browse'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {ALLOWED_FILE_EXTENSIONS.join(', ')} — Max {MAX_UPLOAD_SIZE / (1024 * 1024)}MB —{' '}
            {remaining} slot{remaining !== 1 ? 's' : ''} remaining
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={ALLOWED_FILE_TYPES.join(',')}
        multiple
        onChange={handleInputChange}
      />

      {/* Active uploads with progress */}
      {activeUploads.length > 0 && (
        <div className="space-y-2">
          {activeUploads.map((upload, idx) => (
            <div key={idx} className="flex items-center gap-3 rounded-md border p-3">
              {upload.file.type.startsWith('image/') ? (
                <ImageIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
              ) : (
                <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{upload.file.name}</p>
                <Progress value={upload.progress} className="mt-1.5" />
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{upload.progress}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Completed/errored uploads */}
      {completedUploads.length > 0 && (
        <div className="space-y-2">
          {completedUploads.map((upload, idx) => (
            <div
              key={idx}
              className={cn(
                'flex items-center gap-3 rounded-md border p-3',
                upload.status === 'error' && 'border-destructive/50 bg-destructive/5',
              )}
            >
              {upload.status === 'error' ? (
                <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
              ) : upload.file.type.startsWith('image/') ? (
                <ImageIcon className="h-4 w-4 shrink-0 text-success-600" />
              ) : (
                <FileText className="h-4 w-4 shrink-0 text-success-600" />
              )}
              <p className="text-sm truncate flex-1 min-w-0">
                {upload.file.name}
                {upload.status === 'error' && (
                  <span className="text-xs text-destructive ml-2">{upload.error}</span>
                )}
              </p>
            </div>
          ))}
          <Button variant="ghost" size="sm" onClick={clearCompleted}>
            <X className="mr-1 h-3 w-3" />
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}
