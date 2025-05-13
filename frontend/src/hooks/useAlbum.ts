// src/hooks/usePhotoUpload.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Photo,
  Person,
  PersonFacesResult,
  UpdatePersonNamePayload,
  UpdatePersonNameResponse,
} from "@/types/album";
import {
  uploadPhotos,
  fetchPersons,
  fetchPersonFaces,
  updatePersonName,
  fetchPhotoDetail,
  fetchAlbumSummary,
  fetchGroupPhotos,
  mergePersons,
} from "@/api/album";

export const useAlbum = () => {
  const queryClient = useQueryClient();

  // 1. 사진 업로드
  const usePhotoUpload = () =>
    useMutation<
      Photo[],
      Error,
      { groupId: number; userId: number | null; files: File[] }
    >({
      mutationFn: ({ groupId, userId, files }) =>
        uploadPhotos(groupId, userId, files),
      onSuccess: (_, { groupId }) => {
        queryClient.invalidateQueries({ queryKey: ["persons", groupId] });
      },
    });

  // 2. 인물 목록 조회
  const usePersons = (groupId: number) =>
    useQuery<Person[]>({
      queryKey: ["persons", groupId],
      queryFn: () => fetchPersons(groupId),
      enabled: !!groupId,
    });

  // 3. 특정 인물 얼굴 조회
  const usePersonFaces = (
    groupId: number,
    personId: number
  ): PersonFacesResult => {
    const query = useQuery({
      queryKey: ["personFaces", groupId, personId],
      queryFn: () => fetchPersonFaces(groupId, personId),
      enabled: !!groupId && !!personId,
    });
    return {
      faces: query.data?.faces ?? [],
      count: query.data?.count ?? 0,
      loading: query.isPending,
      error: query.error?.message ?? null,
    };
  };

  // 4. 인물 이름 수정
  const useUpdatePersonName = () =>
    useMutation<UpdatePersonNameResponse, Error, UpdatePersonNamePayload>({
      mutationFn: updatePersonName,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["persons", data.group_id] });
      },
    });

  // 5. 사진 상세 조회
  const usePhotoDetail = (photoId: number) =>
    useQuery({
      queryKey: ["photo", photoId],
      queryFn: () => fetchPhotoDetail(photoId),
      enabled: !!photoId,
    });

  // 6. 전체 사진 썸네일
  const useAlbumSummary = (groupId: number) =>
    useQuery({
      queryKey: ["album-summary", groupId],
      queryFn: () => fetchAlbumSummary(groupId),
      enabled: !!groupId,
    });

  // 7. 전체 사진 목록 조회
  const useGroupPhotos = (groupId: number) =>
    useQuery<Photo[]>({
      queryKey: ["groupPhotos", groupId],
      queryFn: () => fetchGroupPhotos(groupId),
      enabled: !!groupId,
    });

  // 8. 인물 병합
  const useMergePersons = () =>
    useMutation<
      { message: string; final_person_id: number },
      Error,
      { groupId: number; personId1: number; personId2: number }
    >({
      mutationFn: ({ groupId, personId1, personId2 }) =>
        mergePersons(groupId, personId1, personId2),
    });

  return {
    usePhotoUpload,
    usePersons,
    usePersonFaces,
    useUpdatePersonName,
    usePhotoDetail,
    useAlbumSummary,
    useGroupPhotos,
    useMergePersons,
  };
};

export function useAlbumData(tab: string, groupId: number) {
  const { usePersons } = useAlbum();
  const { data: persons = [], isPending: loadingPersons } = usePersons(
    tab === "인물" ? groupId : 0
  );

  // TODO: useEvents, usePlaces로 확장
  const data = tab === "인물" ? persons : [];

  return {
    data,
    loading: tab === "인물" ? loadingPersons : false,
  };
}
