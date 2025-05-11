import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchDiariesByGroup,
  fetchDiaryById,
  generateDiaryAuto,
} from "@/api/diary";
import type { Diary, DiaryAutoGenerateInput } from "@/types/diary";

export const useDiary = () => {
  // 1. 일기 목록 조회
  const useDiaryByGroup = (groupId: number) => {
    return useQuery<Diary[]>({
      queryKey: ["diaries", groupId],
      queryFn: () => fetchDiariesByGroup(groupId),
    });
  };

  // 2. 일기 자동 생성
  const useGenerateDiaryAuto = () => {
    const queryClient = useQueryClient();
    return useMutation<Diary, Error, DiaryAutoGenerateInput>({
      mutationFn: generateDiaryAuto,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["diaries", data.group_id] });
      },
    });
  };

  // 3. 일기 단일 조회회
  const useDiaryById = (diaryId: number) =>
    useQuery<Diary>({
      queryKey: ["diary", diaryId],
      queryFn: () => fetchDiaryById(diaryId),
      enabled: !!diaryId,
    });

  return { useDiaryByGroup, useGenerateDiaryAuto, useDiaryById };
};
