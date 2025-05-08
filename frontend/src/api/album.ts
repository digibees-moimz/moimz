import axios from "@/lib/axios";
import {
  Photo,
  Person,
  PersonFacesResponse,
  UpdatePersonNamePayload,
  UpdatePersonNameResponse,
} from "@/types/album";

export async function uploadPhotos(
  groupId: number,
  userId: number | null,
  files: File[]
): Promise<Photo[]> {
  const formData = new FormData();
  formData.append("group_id", String(groupId));
  if (userId !== null) {
    formData.append("user_id", String(userId));
  }
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await axios.post<{ uploaded: Photo[] }>(
    "/api/photos",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data.uploaded;
}

export async function fetchPersons(groupId: number): Promise<Person[]> {
  const response = await axios.get<{ group_id: number; persons: Person[] }>(
    `/api/photos/groups/${groupId}/persons`
  );
  return response.data.persons;
}

export async function fetchPersonFaces(
  groupId: number,
  personId: number
): Promise<PersonFacesResponse> {
  const response = await axios.get<PersonFacesResponse>(
    `/api/photos/groups/${groupId}/persons/${personId}`
  );
  return response.data;
}

export async function updatePersonName({
  group_id,
  person_id,
  new_name,
}: UpdatePersonNamePayload): Promise<UpdatePersonNameResponse> {
  const formData = new FormData();
  formData.append("new_name", new_name);

  const response = await axios.patch<UpdatePersonNameResponse>(
    `/api/photos/groups/${group_id}/persons/${person_id}/name`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
}
