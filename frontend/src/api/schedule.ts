// src/api/schedule.ts
import axios from "@/lib/axios";
import { ScheduleDetail } from "@/types/schedule";

export async function fetchSchedulesByGroup(
  groupId: number
): Promise<ScheduleDetail[]> {
  return axios.get(`/api/schedules/group/${groupId}`);
}
