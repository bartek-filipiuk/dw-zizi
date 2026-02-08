"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";

interface ImageUploaderProps {
  onUpload: (file: File) => Promise<void>;
  accept?: string;
}

export default function ImageUploader({
  onUpload,
  accept = "image/jpeg,image/png,image/webp,image/avif",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      await onUpload(file);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
        dragOver
          ? "border-oak-400 bg-oak-500/10"
          : "border-charcoal-700 hover:border-charcoal-500"
      }`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      <Upload className="mb-2 h-8 w-8 text-charcoal-500" />
      <p className="text-sm text-charcoal-400">
        {uploading ? "Uploading..." : "Drop an image or click to upload"}
      </p>
      <p className="mt-1 text-xs text-charcoal-600">JPEG, PNG, WebP, AVIF up to 10MB</p>
    </div>
  );
}
