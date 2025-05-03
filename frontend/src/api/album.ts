import axios from "@/lib/axios";
import { Photo } from "@/types/album";

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
