// src/hooks/usePhotoUpload.ts
"use client";

import { useState, useEffect } from "react";
import { Photo, Person } from "@/types/album";
import { uploadPhotos, fetchPersons } from "@/api/album";

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

export function usePersons(groupId: number) {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!groupId) return;

    fetchPersons(groupId)
      .then(setPersons)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [groupId]);

  return { persons, loading, error };
}
