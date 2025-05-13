import axios, { uploadFile } from "@/lib/axios";
import {
  Photo,
  Person,
  PersonFacesResponse,
  UpdatePersonNamePayload,
  UpdatePersonNameResponse,
  AlbumSummary,
} from "@/types/album";

// 1. 사진 업로드
export const uploadPhotos = async (
  groupId: number,
  userId: number | null,
  files: File[]
): Promise<Photo[]> => {
  const formData = new FormData();
  formData.append("group_id", String(groupId));
  if (userId !== null) {
    formData.append("user_id", String(userId));
  }
  files.forEach((file) => formData.append("files", file));

  const { uploaded } = await uploadFile<{ uploaded: Photo[] }>(
    `/api/photos`,
    formData
  );
  return uploaded;
};

// 2. 인물 목록 조회 (썸네일)
export const fetchPersons = async (groupId: number): Promise<Person[]> => {
  const { persons } = (await axios.get(
    `/api/photos/groups/${groupId}/persons`
  )) as { group_id: number; persons: Person[] };

  return persons;
};

// 3. 인물별 앨범 상세 조회
export const fetchPersonFaces = async (
  groupId: number,
  personId: number
): Promise<PersonFacesResponse> =>
  axios.get(`/api/photos/groups/${groupId}/persons/${personId}`);

// 4. 인물 이름 수정
export const updatePersonName = async ({
  group_id,
  person_id,
  new_name,
}: UpdatePersonNamePayload): Promise<UpdatePersonNameResponse> => {
  const formData = new FormData();
  formData.append("new_name", new_name);

  return uploadFile<UpdatePersonNameResponse>(
    `/api/photos/groups/${group_id}/persons/${person_id}/name`,
    formData,
    {
      method: "patch",
    }
  );
};

// 5. 사진 상세 조회
export const fetchPhotoDetail = (photoId: number): Promise<Photo> =>
  axios.get(`/api/photos/${photoId}`);

// 6. 전체 사진 썸네일 조회
export const fetchAlbumSummary = (groupId: number): Promise<AlbumSummary> =>
  axios.get(`/api/photos/groups/${groupId}/all`);

// 7. 전체 사진 목록 조회
export const fetchGroupPhotos = (groupId: number): Promise<Photo[]> =>
  axios.get(`/api/photos/groups/${groupId}`);

// 8. 인물 병합
export const mergePersons = (
  groupId: number,
  personId1: number,
  personId2: number
): Promise<{ message: string; final_person_id: number }> =>
  axios.post(`/api/photos/groups/${groupId}/merge`, null, {
    params: {
      person_id_1: personId1,
      person_id_2: personId2,
    },
  });

// 9. 인물별 대표벡터 기반 썸네일 반환
export const getThumbnailUrl = (groupId: number, personId: number) =>
  `/api/photos/groups/${groupId}/thumbnails/${personId}`;
