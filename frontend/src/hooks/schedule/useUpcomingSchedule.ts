import { useQuery } from "@tanstack/react-query";
import {
  fetchTodaySchedule,
  fetchUpcomingSchedule,
  fetchGroupUpcomingSchedule,
  fetchTodaySchedules,
} from "@/api/schedule";
import type { ScheduleCalendarItem } from "@/types/schedule";

// 전체 모임 중 오늘 일정 1개
export function useTodaySchedule(userId: number) {
  return useQuery<ScheduleCalendarItem>({
    queryKey: ["schedules", "today", userId],
    queryFn: () => fetchTodaySchedule(userId),
    enabled: !!userId,
  });
}

// 전체 모임 중 다음 일정 1개
export function useUpcomingSchedule(userId: number) {
  return useQuery<ScheduleCalendarItem>({
    queryKey: ["schedules", "upcoming", userId],
    queryFn: () => fetchUpcomingSchedule(userId),
    enabled: !!userId,
  });
}

// 특정 그룹의 다음 일정 1개
export function useGroupUpcomingSchedule(groupId: number) {
  return useQuery<ScheduleCalendarItem>({
    queryKey: ["schedules", "group", "upcoming", groupId],
    queryFn: () => fetchGroupUpcomingSchedule(groupId),
    enabled: !!groupId,
  });
}

// 특정 그룹의 오늘 일정 리스트
export const useTodaySchedules = (
  groupId: number,
  is_done: boolean = false
) => {
  return useQuery<ScheduleCalendarItem[], Error>({
    queryKey: ["todaySchedules", groupId, is_done],
    queryFn: () => fetchTodaySchedules(groupId, is_done),
    enabled: !!groupId,
  });
};
