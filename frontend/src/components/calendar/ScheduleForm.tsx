// src/components/calendar/ScheduleForm.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useScheduleCreate } from "@/hooks/schedule/useScheduleCreate";
import { useUserStore } from "@/stores/userStore";
import type { ScheduleItem } from "@/types/schedule";
import CalendarSelectorModal from "./CalendarSelectorModal";
import TimePickerModal from "./TimePickerModal";
import { Typography } from "../ui-components/typography/Typography";
import { Grid } from "../ui-components/layout/Grid";
import { Button } from "../ui-components/ui/Button";

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
          // router.push(`/groups/${groupId}/calendar`);
          router.push(`/groups/${groupId}/calendar/${item.id}/upload-image`);
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
    <div className="flex flex-col h-[calc(100vh-120px)] bg-[#E3F7F4] w-full ">
      <Typography.Heading3 className="px-8 text-gray-800 py-6 space-y-6">
        일정 등록
      </Typography.Heading3>

      {/* 상단 민트 배경 */}
      <div className="py-6 flex flex-col items-center relative">
        <div className={`absolute translate-x-20 z-10 top-0 -translate-y-1/2`}>
          <Image
            src="/icons/calendar-illust.png"
            width={230}
            height={70}
            alt="단디 똑디 우디"
          />
        </div>

        {/* 입력 폼 */}
        <div className="flex-1">
          <form
            id="schedule-form"
            className="w-full max-w-md p-6 space-y-6 bg-white rounded-t-3xl h-[calc(100vh-220px)] pt-10"
            onSubmit={handleSubmit}
          >
            <div>
              <Typography.Label className="text-gray-400 font-bold pl-2">
                제목
              </Typography.Label>
              <input
                type="text"
                name="title"
                value={values.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-[#22BD9C]"
              />
            </div>

            <Grid.Col2>
              <div>
                <Typography.Label className="text-gray-400 font-bold pl-2 pb-1">
                  날짜
                </Typography.Label>
                <input
                  type="text"
                  name="date"
                  value={values.date}
                  readOnly
                  onClick={() => setShowCalendar(true)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md cursor-pointeroutline-none focus:outline-none focus:ring-2 focus:ring-[#22BD9C]"
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
                <Typography.Label className="text-gray-400 font-bold pl-2 pb-1">
                  시간
                </Typography.Label>
                <input
                  type="text"
                  name="time"
                  value={values.time}
                  readOnly
                  onClick={() => setShowTimePicker(true)}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-md cursor-pointeroutline-none focus:outline-none focus:ring-2 focus:ring-[#22BD9C]"
                />

                {showTimePicker && (
                  <TimePickerModal
                    onClose={() => setShowTimePicker(false)}
                    onSelect={(hour, minute) => {
                      const formatted = `${String(hour).padStart(
                        2,
                        "0"
                      )}:${String(minute).padStart(2, "0")}`;

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
              <Typography.Label className="text-gray-400 font-bold pl-2 pb-1">
                장소
              </Typography.Label>
              <input
                type="text"
                name="location"
                placeholder="선택 사항"
                value={values.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200  rounded-md outline-none focus:outline-none focus:ring-2 focus:ring-[#22BD9C]"
              />
            </div>

            <div>
              <Typography.Label className="text-gray-400 font-bold pl-2 pb-1">
                설명
              </Typography.Label>
              <textarea
                name="description"
                rows={3}
                placeholder="선택 사항"
                value={values.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-md  resize-noneoutline-none focus:outline-none focus:ring-2 focus:ring-[#22BD9C]"
              />
            </div>

            <Button
              type="submit"
              form="schedule-form"
              disabled={isPending}
              variant="secondary"
              className="mt-40"
            >
              저장하기
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
