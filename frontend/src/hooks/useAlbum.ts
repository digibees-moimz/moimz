// src/hooks/usePhotoUpload.ts
"use client";

import { useState } from "react";
import { Photo } from "@/types/album";
import { uploadPhotos } from "@/api/album";

export function usePhotoUpload() {
  const [uploadedPhotos, setUploadedPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (
    groupId: number,
    userId: number | null,
    files: File[]
  ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await uploadPhotos(groupId, userId, files);
      setUploadedPhotos(result);
      return result;
    } catch (err: any) {
      setError(err.message || "업로드 중 오류 발생");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { uploadedPhotos, upload, loading, error };
}
