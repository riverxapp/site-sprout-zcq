"use client";

import { useState, useRef, useCallback } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  currentAvatar?: string;
  name?: string;
  onSave?: (file: File) => Promise<void>;
  className?: string;
}

export function AvatarUpload({ currentAvatar, name, onSave, className }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatar ?? null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    if (onSave) {
      setIsLoading(true);
      try {
        await onSave(file);
        toast.success("Avatar updated successfully");
      } catch {
        toast.error("Failed to save avatar");
        setPreview(currentAvatar ?? null);
      } finally {
        setIsLoading(false);
      }
    }
  }, [onSave, currentAvatar]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleRemove = useCallback(() => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div
        role="button"
        tabIndex={0}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
        className={cn(
          "relative flex h-32 w-32 cursor-pointer items-center justify-center rounded-full border-2 border-dashed transition-colors",
          isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-muted-foreground/50"
        )}
      >
        {isLoading ? (
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        ) : preview ? (
          <Avatar className="h-full w-full">
            <AvatarImage src={preview} alt={name ?? "Avatar preview"} />
            <AvatarFallback>{name?.charAt(0)?.toUpperCase() ?? "?"}</AvatarFallback>
          </Avatar>
        ) : (
          <Upload className="h-8 w-8 text-muted-foreground" />
        )}
      </div>
      <div className="flex items-center gap-2">
        <Label htmlFor="avatar-upload" className="sr-only">Upload avatar</Label>
        <Input
          id="avatar-upload"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />
        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
          {preview ? "Change" : "Upload"}
        </Button>
        {preview && (
          <Button variant="ghost" size="icon" onClick={handleRemove} disabled={isLoading} aria-label="Remove avatar">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
