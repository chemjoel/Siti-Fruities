import React, { useState, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, Loader2, X, RefreshCw, AlertCircle, CheckCircle2, Link as LinkIcon } from 'lucide-react';

interface ImageUploadProps {
  bucket: 'product-images' | 'promo-flyers';
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  maxSizeMB?: number;
  onUploadingChange?: (isUploading: boolean) => void;
}

export default function ImageUpload({
  bucket,
  value,
  onChange,
  label = 'Product Image',
  helperText = 'Recommended: JPG, PNG, or WebP under 5MB',
  maxSizeMB = 5,
  onUploadingChange,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);

  const setUploadingState = (state: boolean) => {
    setUploading(state);
    if (onUploadingChange) {
      onUploadingChange(state);
    }
  };

  const handleFileSelect = async (file: File) => {
    setError(null);

    // 1. Validate file format
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setError('Invalid file format. Please choose a JPG, PNG, or WebP image.');
      return;
    }

    // 2. Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`Image exceeds maximum size limit of ${maxSizeMB}MB (${(file.size / (1024 * 1024)).toFixed(1)}MB).`);
      return;
    }

    // 3. Upload to Supabase Storage
    setUploadingState(true);
    try {
      if (!isSupabaseConfigured()) {
        // Fallback for offline/preview mode: Create a data URL preview
        const reader = new FileReader();
        reader.onloadend = () => {
          onChange(reader.result as string);
          setUploadingState(false);
        };
        reader.readAsDataURL(file);
        return;
      }

      // Generate sanitized unique filename
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
      const uniquePath = `${Date.now()}_${cleanFileName}`;

      const { error: uploadError } = await supabase.storage.from(bucket).upload(uniquePath, file);
      if (uploadError) {
        throw new Error(uploadError.message || 'Failed to upload image to storage');
      }

      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(uniquePath);
      if (urlData?.publicUrl) {
        onChange(urlData.publicUrl);
      } else {
        throw new Error('Could not retrieve public image URL');
      }
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setUploadingState(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-bold text-foreground">{label}</Label>
        <button
          type="button"
          onClick={() => setShowManualUrl(!showManualUrl)}
          className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showManualUrl ? 'Use File Upload' : 'Enter URL Manually'}</span>
        </button>
      </div>

      {error && (
        <div className="p-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Hidden File Input for Native File/Photo Picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={onFileInputChange}
        className="hidden"
      />

      {showManualUrl ? (
        <div className="space-y-1.5">
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. /assets/IMG_8455_parfait_bowls.jpg or https://..."
            className="rounded-xl bg-white text-xs"
          />
          <p className="text-[10px] text-muted-foreground">Type or paste an image URL or local asset path directly.</p>
        </div>
      ) : value ? (
        /* Image Preview Box with Replace and Remove Options */
        <div className="relative rounded-2xl border border-border bg-muted/30 p-3 flex items-center gap-3.5 group">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted border border-border shrink-0">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-foreground block truncate">
              {value.startsWith('data:') ? 'Local Image Attached' : value.split('/').pop() || 'Image Attached'}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3" />
              Image Loaded
            </span>

            <div className="flex items-center gap-2 mt-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="h-7 text-[11px] font-bold rounded-lg gap-1 px-2.5"
              >
                {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                {uploading ? 'Uploading...' : 'Replace Photo'}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={uploading}
                onClick={() => onChange('')}
                className="h-7 text-[11px] font-semibold text-destructive hover:bg-destructive/10 rounded-lg px-2"
              >
                <X className="w-3.5 h-3.5" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Drag & Drop Dropzone / Tap Target */
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
            isDragOver
              ? 'border-primary bg-primary/5 scale-[1.01]'
              : 'border-border hover:border-primary/40 bg-muted/20 hover:bg-muted/40'
          } ${uploading ? 'opacity-60 pointer-events-none' : ''}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="w-7 h-7 text-primary animate-spin" />
              <span className="text-xs font-bold text-foreground">Uploading to Supabase Storage...</span>
              <span className="text-[11px] text-muted-foreground">Please wait a moment</span>
            </div>
          ) : (
            <>
              <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-1">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-foreground">
                <span className="text-primary">Tap to upload photo</span> or drag and drop
              </div>
              <p className="text-[11px] text-muted-foreground">{helperText}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
