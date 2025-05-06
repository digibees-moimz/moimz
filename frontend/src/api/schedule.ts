// src/api/schedule.ts
import axios from "@/lib/axios";
import { ScheduleDetail, ScheduleCalendarItem } from "@/types/schedule";

export async function fetchSchedulesByGroup(
  groupId: number
): Promise<ScheduleDetail[]> {
  return axios.get(`/api/schedules/group/${groupId}`);
}

// 오늘 날짜 기준 일정 조회
export async function fetchTodaySchedules(
  groupId: number,
  is_done: boolean = false
): Promise<ScheduleCalendarItem[]> {
  return axios.get(`/api/schedules/group/${groupId}/today`, {
    params: { is_done },
  });
}
