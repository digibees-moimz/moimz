// src/hooks/usePhotoUpload.ts
"use client";

import { useState, useEffect } from "react";
import {
  Photo,
  Person,
  Face,
  PersonFacesResult,
  UpdatePersonNamePayload,
  UpdatePersonNameResponse,
} from "@/types/album";
import {
  uploadPhotos,
  fetchPersons,
  fetchPersonFaces,
  updatePersonName,
} from "@/api/album";

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

export function useAlbumData(tab: string, groupId: number) {
  const { persons, loading: l1 } = usePersons(tab === "인물" ? groupId : 0);
  // const { events, loading: l2 } = useEvents(tab === "일정" ? groupId : 0);
  // const { places, loading: l3 } = usePlaces(tab === "지역" ? groupId : 0);

  if (tab === "인물") return { data: persons, loading: l1 };
  // if (tab === "일정") return { data: events, loading: l2 };
  // if (tab === "지역") return { data: places, loading: l3 };
  return { data: [], loading: false };
}

export function usePersonFaces(
  groupId: number,
  personId: number
): PersonFacesResult {
  const [faces, setFaces] = useState<Face[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!groupId || !personId) return;

    fetchPersonFaces(groupId, personId)
      .then((res) => {
        setFaces(res.faces);
        setCount(res.count);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [groupId, personId]);

  return { faces, count, loading, error };
}

export function useUpdatePersonName() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (
    payload: UpdatePersonNamePayload
  ): Promise<UpdatePersonNameResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      return await updatePersonName(payload);
    } catch (err: any) {
      setError(err.message || "이름 수정 중 오류 발생");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}
