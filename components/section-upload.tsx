"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Upload, FileText, X } from "lucide-react";
import { useRef } from "react";

interface FileMetadata {
  name: string;
  size: number;
}

interface SectionUploadProps {
  uploadedFiles: FileMetadata[];
  onFilesUpload: (files: File[]) => void;
  onFileRemove: (index: number) => void;
  code: string;
  onCodeChange: (value: string) => void;
}

export function SectionUpload({
  uploadedFiles,
  onFilesUpload,
  onFileRemove,
  code,
  onCodeChange,
}: SectionUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesUpload(files);
    }
    // Allow re-selecting the same file later
    e.target.value = "";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[1.5rem]">Add context (optional)</CardTitle>
        <CardDescription className="pb-8">
          Upload a screenshot or mockup, or paste code, to guide the AI.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.gif,.svg,.webp"
          className="hidden"
          onChange={handleFileChange}
        />

        <div
          onClick={handleUploadClick}
          className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors hover:border-primary/30 hover:bg-white/5 cursor-pointer group"
        >
          <div className="p-4 rounded-full bg-white/5 mb-4 group-hover:scale-110 transition-transform duration-300">
            <Upload className="w-6 h-6 text-gray-400 group-hover:text-primary" />
          </div>
          <h4 className="text-sm font-medium mb-1">
            Upload a screenshot or mockup
          </h4>
          <p className="text-xs text-muted-foreground">
            Images (PNG, JPG, GIF, SVG, WebP)
          </p>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Uploaded Files:
            </h4>
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-black/20 group"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm text-gray-300">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <button
                  onClick={() => onFileRemove(index)}
                  className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <h4 className="text-xl font-bold text-blue-400 mt-8 block">
              Paste Code Snippets
            </h4>
            <span className="block text-sm text-muted-foreground">
              Existing code or patterns the AI should follow.
            </span>
          </div>
          <Textarea
            placeholder="Paste your code or text examples here..."
            className="min-h-[120px] focus-visible:ring-primary/50 font-mono text-xs"
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
