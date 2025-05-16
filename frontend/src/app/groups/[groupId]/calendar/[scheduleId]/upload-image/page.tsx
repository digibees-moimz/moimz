// src/app/groups/[groupId]/calendar/[scheduleId]/upload-image/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useRef, useCallback } from "react";
import { uploadScheduleImage } from "@/api/schedule";

export default function ScheduleImageUploadPage() {
  const { groupId, scheduleId } = useParams();
  const router = useRouter();
  const [files, setFiles] = useState<FileList | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (!selectedFiles) return;

      setFiles(selectedFiles);

      // 미리보기 생성
      const newPreviews: string[] = [];
      Array.from(selectedFiles).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newPreviews.push(e.target.result as string);
            if (newPreviews.length === selectedFiles.length) {
              setPreviews(newPreviews);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    },
    []
  );

  const handleSubmit = async () => {
    if (!files) return;

    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("schedule_id", String(Number(scheduleId)));
        formData.append("files", file);
        await uploadScheduleImage(formData);
      }
      router.push(`/groups/${groupId}/calendar/${scheduleId}`);
    } catch (error) {
      alert("사진 업로드에 실패했습니다.");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFiles(null);
    setPreviews([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* 상단 타이틀 - 간결하게 유지 */}
      <div className="text-center py-4 border-b">
        <h1 className="text-xl font-bold text-gray-800">사진 업로드</h1>
      </div>

      <div className="flex-1 flex flex-col p-4">
        {/* 안내 텍스트 */}
        <p className="text-center text-gray-500 mb-4">
          일정에 추가할 사진을 선택해주세요
        </p>

        {/* 업로드 영역 - 모바일에 최적화 */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mb-4"
          onClick={() => inputRef.current?.click()}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            ref={inputRef}
            className="hidden"
          />

          {previews.length > 0 ? (
            <div>
              <div className="flex flex-wrap gap-2 justify-center">
                {previews.map((preview, index) => (
                  <div key={index} className="relative w-16 h-16">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
              <p className="text-teal-600 font-medium mt-3">
                {files?.length}장의 이미지가 선택되었습니다
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile();
                }}
                className="text-sm text-red-500 mt-2"
              >
                다시 선택하기
              </button>
            </div>
          ) : (
            <div className="py-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-teal-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">
                터치하여 사진 선택하기
              </p>
              <p className="text-gray-400 text-sm mt-1">
                JPG, PNG 등의 이미지 파일
              </p>
            </div>
          )}
        </div>

        {/* 하단 여백을 채워주는 flex-grow */}
        <div className="flex-grow"></div>

        {/* 버튼 영역 - 하단에 고정 */}
        <div className="space-y-3 mt-auto">
          <button
            onClick={handleSubmit}
            disabled={!files || isUploading}
            className={`w-full py-3 rounded-lg font-medium transition ${
              files && !isUploading
                ? "bg-teal-500 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {isUploading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>업로드 중...</span>
              </div>
            ) : (
              "업로드하기"
            )}
          </button>

          <button
            onClick={() =>
              router.push(`/groups/${groupId}/calendar/${scheduleId}`)
            }
            className="w-full py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium"
          >
            건너뛰기
          </button>
        </div>
      </div>
    </div>
  );
}
