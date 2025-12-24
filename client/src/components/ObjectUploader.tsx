import { useState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, FileIcon, ImageIcon, VideoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ObjectUploaderProps {
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  allowedFileTypes?: string[];
  onFilesChange?: (files: string[]) => void;
  buttonClassName?: string;
  buttonVariant?: "default" | "outline" | "ghost" | "secondary";
  children: ReactNode;
}

interface UploadedFile {
  name: string;
  url: string;
  type: string;
}

export function ObjectUploader({
  maxNumberOfFiles = 5,
  maxFileSize = 52428800,
  allowedFileTypes = ["image/*", "video/*", "application/pdf"],
  onFilesChange,
  buttonClassName,
  buttonVariant = "outline",
  children,
}: ObjectUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.size > maxFileSize) {
        console.error(`File ${file.name} is too large`);
        continue;
      }

      try {
        const response = await fetch("/api/objects/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
          }),
        });
        const data = await response.json();

        await fetch(data.uploadURL, {
          method: "PUT",
          headers: {
            "Content-Type": file.type || "application/octet-stream",
          },
          body: file,
        });

        const normalizeResponse = await fetch("/api/medical-files", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileURL: data.uploadURL }),
        });
        const normalizedData = await normalizeResponse.json();

        newFiles.push({
          name: file.name,
          url: normalizedData.objectPath || data.uploadURL,
          type: file.type,
        });
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
      }
    }

    const allFiles = [...uploadedFiles, ...newFiles];
    setUploadedFiles(allFiles);
    onFilesChange?.(allFiles.map(f => f.url));
    setIsUploading(false);

    e.target.value = "";
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onFilesChange?.(newFiles.map(f => f.url));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="w-4 h-4" />;
    if (type.startsWith("video/")) return <VideoIcon className="w-4 h-4" />;
    return <FileIcon className="w-4 h-4" />;
  };

  const canAddMore = uploadedFiles.length < maxNumberOfFiles;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {canAddMore && (
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              accept={allowedFileTypes.join(",")}
              onChange={handleFileSelect}
              className="hidden"
              disabled={isUploading}
              data-testid="input-file-upload"
            />
            <Button
              type="button"
              variant={buttonVariant}
              className={buttonClassName}
              disabled={isUploading}
              asChild
            >
              <span>
                <Upload className="w-4 h-4 ml-2" />
                {isUploading ? "מעלה..." : children}
              </span>
            </Button>
          </label>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {uploadedFiles.map((file, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-2 py-1.5 px-3"
              data-testid={`badge-file-${index}`}
            >
              {getFileIcon(file.type)}
              <span className="max-w-32 truncate text-xs">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="mr-1 opacity-70 hover:opacity-100"
                data-testid={`button-remove-file-${index}`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
