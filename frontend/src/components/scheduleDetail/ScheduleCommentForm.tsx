// src/components/scheduleDetail/ScheduleCommentForm.tsx
"use client";

import { useState } from "react";
import { useScheduleComment } from "@/hooks/schedule/useScheduleComment";
import { useUserStore } from "@/stores/userStore";
import { Button } from "@/components/ui-components/ui/Button";
import { Flex } from "@/components/ui-components/layout/Flex";

interface ScheduleCommentFormProps {
  scheduleId: number;
  onSuccess?: () => void;
}

export default function ScheduleCommentForm({
  scheduleId,
  onSuccess,
}: ScheduleCommentFormProps) {
  const { userId } = useUserStore();
  const [content, setContent] = useState("");
  const { mutate: postComment, isPending } = useScheduleComment(scheduleId);

  const handleSubmit = () => {
    if (!content.trim()) return;

    postComment(
      { user_id: userId, content },
      {
        onSuccess: () => {
          setContent("");
          onSuccess?.();
        },
      }
    );
  };

  return (
    <Flex.RowStartCenter className="w-full gap-3">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력하세요"
        className="flex-8 rounded-full px-4 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-gray-100"
      />
      <Button
        onClick={handleSubmit}
        disabled={isPending}
        size="xs"
        className="flex-1 rounded-full"
      >
        작성
      </Button>
    </Flex.RowStartCenter>
  );
}
