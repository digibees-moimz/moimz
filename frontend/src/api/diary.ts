import axios from "@/lib/axios";
import { Diary, DiaryAutoGenerateInput } from "@/types/diary"

// 1. 모임 일기 조회
export async function fetchDiariesByGroup(groupId: number): Promise<Diary[]> {
  return axios.get(`/api/diaries/group/${groupId}`);
}

// 2. 모임 일기 자동 생성
export async function generateDiaryAuto(
  data: DiaryAutoGenerateInput
): Promise<Diary> {
  return axios.post(`/api/diaries/auto-generate`, null, {
    params: data,
  });
}
