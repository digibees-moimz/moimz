import { useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "../ui-components/ui/Button";

export const PhotoSelectModal = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();
  const { groupId } = useParams<{ groupId: string }>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      console.log("업로드할 파일:", file);
      router.push(
        `/groups/${groupId}/attendance/photo/preview?src=${encodeURIComponent(
          previewUrl
        )}`
      );
    }
    onClose(); // 닫기
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-50">
        <div className="w-full rounded-t-xl max-w-sm px-2 py-4 space-y-3">
          <Button
            onClick={() => {
              navigator.mediaDevices.getUserMedia({ video: true }).then(() => {
                // 카메라 페이지로 이동 or 모달 닫기
                console.log("카메라 열기");
              });
              onClose();
            }}
          >
            사진 촬영
          </Button>

          <Button onClick={openFilePicker}>사진 업로드</Button>

          <Button variant="destructive" onClick={onClose}>
            취소
          </Button>
        </div>
      </div>

      {/* 숨겨진 input */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </>
  );
};
