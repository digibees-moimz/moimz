import { useRef } from "react";
import { usePhotoUpload } from "@/hooks/useAlbum";
import { ImPlus } from "react-icons/im";

interface UploadPhotsProps {
  userId: number;
  groupId: number;
}

export const AddUploadButton = ({ userId, groupId }: UploadPhotsProps) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { upload, loading } = usePhotoUpload();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    await upload(groupId, userId, files);
    e.target.value = ""; // 같은 파일 또 올릴 수 있도록 초기화
  };

  return (
    <>
      <input
        type="file"
        ref={fileRef}
        multiple
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleChange}
      />
      <button
        onClick={() => fileRef.current?.click()}
        className="fixed bottom-6 right-6 z-50 bg-[#22BD9C] hover:bg-emerald-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition"
      >
        <ImPlus size={24} />
      </button>
    </>
  );
};
