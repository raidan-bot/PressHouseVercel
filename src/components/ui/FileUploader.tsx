import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, File, Trash2, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface UploadFile {
  id: string;
  file: File;
  preview?: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

interface FileUploaderProps {
  onUpload: (files: File[]) => Promise<void>;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
  uploadText?: string;
  dropText?: string;
}

export function FileUploader({
  onUpload,
  accept = 'image/*',
  multiple = true,
  maxSize = 10,
  maxFiles = 10,
  disabled = false,
  className,
  uploadText = 'Click to upload or drag and drop',
  dropText = 'Drop files here',
}: FileUploaderProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }
    return null;
  };

  const processFiles = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: UploadFile[] = Array.from(selectedFiles).map((file) => {
      const error = validateFile(file);
      const uploadFile: UploadFile = {
        id: Math.random().toString(36).substring(7),
        file,
        progress: 0,
        status: error ? 'error' : 'uploading',
        error: error || undefined,
      };

      // Create preview for images
      if (file.type.startsWith('image/') && !error) {
        uploadFile.preview = URL.createObjectURL(file);
      }

      return uploadFile;
    });

    setFiles((prev) => [...prev, ...newFiles].slice(0, maxFiles));

    // Simulate upload
    newFiles.forEach((uploadFile) => {
      if (uploadFile.status === 'error') return;

      const interval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? { ...f, progress: Math.min(f.progress + 10, 100) }
              : f
          )
        );
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id ? { ...f, progress: 100, status: 'completed' as const } : f
          )
        );
      }, 2000);
    });

    // Call actual upload handler
    onUpload(Array.from(selectedFiles));
  }, [maxFiles, maxSize, onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    e.target.value = ''; // Reset input
  }, [processFiles]);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    files.forEach((f) => {
      if (f.preview) URL.revokeObjectURL(f.preview);
    });
    setFiles([]);
  }, [files]);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors',
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          disabled={disabled}
          className="hidden"
        />

        <Upload size={48} className="mx-auto text-slate-400 mb-4" />
        <p className="text-slate-600 font-medium mb-2">{isDragging ? dropText : uploadText}</p>
        <p className="text-slate-400 text-sm">
          {accept.includes('image')
            ? `Images up to ${maxSize}MB`
            : `Files up to ${maxSize}MB`}
        </p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">
              {files.length} file{files.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={clearAll}
              className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
            >
              <Trash2 size={14} />
              Clear all
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200"
              >
                {/* Preview */}
                {file.preview ? (
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                    <img
                      src={file.preview}
                      alt={file.file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <File size={24} className="text-slate-400" />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {file.file.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>

                  {/* Progress bar */}
                  {file.status === 'uploading' && (
                    <div className="mt-1 w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}

                  {/* Error */}
                  {file.error && (
                    <p className="text-xs text-red-600 mt-1">{file.error}</p>
                  )}
                </div>

                {/* Status */}
                <div className="flex-shrink-0">
                  {file.status === 'completed' && (
                    <Check size={20} className="text-green-600" />
                  )}
                  {file.status === 'error' && (
                    <span className="text-xs text-red-600 font-medium">Error</span>
                  )}
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X size={16} className="text-slate-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUploader;