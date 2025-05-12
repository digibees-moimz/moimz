// src/api/schedule.ts
import axios from "@/lib/axios";
import { ScheduleCommentCreateInput } from "@/types/comment";
import {
  ScheduleDetail,
  ScheduleCardItem,
  AllScheduleCardItem,
  ScheduleCreateInput,
  ScheduleItem,
  PendingSchedule,
} from "@/types/schedule";

// 특정 그룹의 모든 일정 조회
export async function fetchSchedulesByGroup(
  groupId: number
): Promise<ScheduleDetail[]> {
  return axios.get(`/api/schedules/group/${groupId}`);
}

// 사용자 기준 오늘 일정 조회
export async function fetchTodaySchedule(
  userId: number
): Promise<AllScheduleCardItem> {
  return axios.get(`/api/schedules/today`, {
    params: { user_id: userId },
  });
}

// 사용자 기준 전체 중 다음 일정 조회
export async function fetchUpcomingSchedule(
  userId: number
): Promise<AllScheduleCardItem> {
  return axios.get(`/api/schedules/upcoming`, {
    params: { user_id: userId },
  });
}

// 특정 그룹 기준 오늘 일정 리스트 조회
export async function fetchTodaySchedules(
  groupId: number,
  is_done: boolean = false
): Promise<ScheduleCardItem[]> {
  return axios.get(`/api/schedules/group/${groupId}/today`, {
    params: { is_done },
  });
}

// 특정 그룹 기준 다음 일정 조회
export async function fetchGroupUpcomingSchedule(
  groupId: number
): Promise<ScheduleCardItem> {
  return axios.get(`/api/schedules/groups/${groupId}/upcoming`);
}

// 특정 그룹 월별 일정 조회 후 캘린더 나타내기기
export async function fetchMonthlySchedules(
  groupId: number,
  year: number,
  month: number
): Promise<ScheduleCardItem[]> {
  return axios.get(`/api/schedules/group/${groupId}/monthly`, {
    params: { year, month },
  });
}

// 일정 생성
export async function createSchedule(
  groupId: number,
  payload: ScheduleCreateInput
): Promise<ScheduleItem> {
  const { data } = await axios.post<ScheduleItem>("/api/schedules", {
    group_id: groupId,
    ...payload,
  });
  return data;
}

// 일정 상세 조회
export async function fetchScheduleDetail(
  scheduleId: number
): Promise<ScheduleDetail> {
  return axios.get(`/api/schedules/${scheduleId}`);
}

// 출석체크 12시간 경과 후에도 종료되지 않은 일정 조회
export async function fetchPendingSchedule(
  groupId: number
): Promise<PendingSchedule | null> {
  return axios.get(`/api/schedules/groups/${groupId}/pending`);
}

// 일정 종료 및 일기 자동 생성
export async function completeSchedule(
  scheduleId: number,
  groupId: number,
  userId: number
): Promise<{ message: string; diary_id: number | null }> {
  return axios.patch(`/api/schedules/${scheduleId}/done`, null, {
    params: { group_id: groupId, user_id: userId },
  });
}

// 스케줄에 댓글 작성 API
export async function postScheduleComment(
  scheduleId: number,
  input: ScheduleCommentCreateInput
) {
  return axios.post(`/api/schedules/${scheduleId}/comments`, input);
}
