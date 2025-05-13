import axios, { uploadFile } from "@/lib/axios";
import {
  Photo,
  Person,
  PersonFacesResponse,
  UpdatePersonNamePayload,
  UpdatePersonNameResponse,
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

// 2. 인물 목록 조회
export const fetchPersons = async (groupId: number): Promise<Person[]> => {
  const { persons } = (await axios.get(
    `/api/photos/groups/${groupId}/persons`
  )) as { group_id: number; persons: Person[] };

  return persons;
};

// 3. 인물 얼굴 목록 조회
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
    formData
  );
};
