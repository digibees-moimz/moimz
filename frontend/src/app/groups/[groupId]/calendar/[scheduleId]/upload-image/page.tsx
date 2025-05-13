// src/app/groups/[groupId]/calendar/[scheduleId]/upload-image/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { uploadScheduleImage } from "@/api/schedule"; // ✅ 실제 업로드 함수 import

export default function ScheduleImageUploadPage() {
  const { groupId, scheduleId } = useParams();
  const router = useRouter();
  const [files, setFiles] = useState<FileList | null>(null);

  const handleSubmit = async () => {
    if (!files) return;

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
    }
  };

  return (
    <div className="p-6 space-y-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold text-center">사진 업로드</h1>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => setFiles(e.target.files)}
        className="w-full border p-2 rounded"
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition"
      >
        업로드 후 일정 보기
      </button>

      <button
        onClick={() => router.push(`/groups/${groupId}/calendar/${scheduleId}`)}
        className="w-full text-sm text-gray-500 underline mt-2"
      >
        건너뛰기
      </button>
    </div>
  );
}
