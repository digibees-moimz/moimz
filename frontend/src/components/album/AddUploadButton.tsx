import { useRef } from "react";
import { usePhotoUpload } from "@/hooks/useAlbum";
import {
  showSuccessToast,
  showErrorToast,
} from "@/components/ui-components/ui/Toast";
import { ImPlus } from "react-icons/im";

interface UploadPhotsProps {
  userId: number;
  groupId: number;
}

export const AddUploadButton = ({ userId, groupId }: UploadPhotsProps) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { upload } = usePhotoUpload();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);

    try {
      await upload(groupId, userId, files);
      showSuccessToast(`사진 ${files.length}장을 앨범에 추가했어요`);
    } catch (err: unknown) {
      console.error("업로드 실패:", err); // ✅ err 사용
      showErrorToast(
        `업로드 중에 문제가 발생했습니다.
        잠시 후 다시 시도해주세요.`
      );
    } finally {
      e.target.value = ""; // 같은 파일 또 올릴 수 있도록 초기화
    }
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
