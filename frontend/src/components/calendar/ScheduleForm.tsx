// src/components/calendar/ScheduleForm.tsx
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useScheduleCreate } from "@/hooks/useScheduleCreate";
import { useUserStore } from "@/stores/userStore";
import type { ScheduleItem } from "@/types/schedule";
import { Typography } from "../ui-components/typography/Typography";
import { Grid } from "../ui-components/layout/Grid";
import { Flex } from "../ui-components/layout/Flex";
import CalendarSelectorModal from "./CalendarSelectorModal";
import TimePickerModal from "./TimePickerModal";

// 날짜 + 시간 → ISO 문자열
const toISOString = (date: string, time: string): string =>
  new Date(`${date}T${time}:00`).toISOString();

interface ScheduleFormProps {
  onCreated?: (item: ScheduleItem) => void;
}
export default function ScheduleForm({ onCreated }: ScheduleFormProps) {
  const { groupId } = useParams();
  const router = useRouter();
  const userId = useUserStore((state) => state.userId);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [values, setValues] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
  });

  const { mutate, isPending } = useScheduleCreate(Number(groupId));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      {
        user_id: userId,
        title: values.title,
        date: toISOString(values.date, values.time),
        time: values.time,
        location: values.location,
        description: values.description,
      },
      {
        onSuccess: (item) => {
          onCreated?.(item);
          router.push(`/groups/${groupId}/calendar`);
        },
        onError: (err: unknown) => {
          if (err instanceof Error) {
            alert(err.message);
          } else {
            alert("일정 등록 실패");
          }
        },
      }
    );
  };

  return (
    <Flex.ColCenter>
      <form
        className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg space-y-6"
        onSubmit={handleSubmit}
      >
        <Typography.Heading2>일정 생성</Typography.Heading2>

        <div>
          <Typography.Label>제목</Typography.Label>
          <input
            type="text"
            name="title"
            value={values.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#22BD9C]"
          />
        </div>

        <Grid.Col2>
          <div>
            <Typography.Label>날짜</Typography.Label>
            <input
              type="text"
              name="date"
              value={values.date}
              readOnly
              onClick={() => setShowCalendar(true)}
              className="w-full px-3 py-2 border rounded-md cursor-pointer focus:ring-2 focus:ring-[#22BD9C]"
            />
            {showCalendar && (
              <CalendarSelectorModal
                onClose={() => setShowCalendar(false)}
                onSelect={(date) =>
                  setValues((prev) => ({
                    ...prev,
                    date: date.toLocaleDateString("sv-SE"),
                  }))
                }
              />
            )}
          </div>
          <div>
            <Typography.Label>시간</Typography.Label>
            <input
              type="text"
              name="time"
              value={values.time}
              readOnly
              onClick={() => setShowTimePicker(true)}
              required
              className="w-full px-3 py-2 border rounded-md cursor-pointer focus:ring-2 focus:ring-[#22BD9C]"
            />

            {showTimePicker && (
              <TimePickerModal
                onClose={() => setShowTimePicker(false)}
                onSelect={(hour, minute) => {
                  const formatted = `${String(hour).padStart(2, "0")}:${String(
                    minute
                  ).padStart(2, "0")}`;

                  setValues((prev) => ({
                    ...prev,
                    time: formatted, // 또는 `${meridiem} ${h}:${minute}` 등 원하는 형식
                  }));
                }}
              />
            )}
          </div>
        </Grid.Col2>

        <div>
          <Typography.Label>장소</Typography.Label>
          <input
            type="text"
            name="location"
            placeholder="선택 사항"
            value={values.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#22BD9C]"
          />
        </div>

        <div>
          <Typography.Label>설명</Typography.Label>
          <textarea
            name="description"
            rows={3}
            placeholder="선택 사항"
            value={values.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md resize-none focus:ring-2 focus:ring-[#22BD9C]"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 bg-[#22BD9C] hover:bg-[#1aa88b] text-white rounded-md transition"
        >
          저장하기
        </button>
      </form>
    </Flex.ColCenter>
  );
}
