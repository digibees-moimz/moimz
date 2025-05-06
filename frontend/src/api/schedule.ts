// src/api/schedule.ts
import axios from "@/lib/axios";
import { ScheduleDetail, ScheduleCalendarItem } from "@/types/schedule";

// 특정 그룹의 모든 일정 조회
export async function fetchSchedulesByGroup(
  groupId: number
): Promise<ScheduleDetail[]> {
  return axios.get(`/api/schedules/group/${groupId}`);
}

// 사용자 기준 오늘 일정 조회
export async function fetchTodaySchedule(
  userId: number
): Promise<ScheduleCalendarItem> {
  return axios.get(`/api/schedules/today`, {
    params: { user_id: userId },
  });
}

// 사용자 기준 전체 중 다음 일정 조회
export async function fetchUpcomingSchedule(
  userId: number
): Promise<ScheduleCalendarItem> {
  return axios.get(`/api/schedules/upcoming`, {
    params: { user_id: userId },
  });
}

// 특정 그룹 기준 오늘 일정 리스트 조회
export async function fetchTodaySchedules(
  groupId: number,
  is_done: boolean = false
): Promise<ScheduleCalendarItem[]> {
  return axios.get(`/api/schedules/group/${groupId}/today`, {
    params: { is_done },
  });
}

// 특정 그룹 기준 다음 일정 조회
export async function fetchGroupUpcomingSchedule(
  groupId: number
): Promise<ScheduleCalendarItem> {
  return axios.get(`/api/schedules/groups/${groupId}/upcoming`);
}
