// frontend/src/hooks/Attendance/useAttendance.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  checkPhotoAttendance,
  checkManualAttendance,
  completeAttendance,
  fetchAttendanceRecord,
  updateAttendanceRecord,
  generateQrForAttendance,
} from "@/api/attendance";
import {
  ManualAttendanceRequest,
  AttendanceCompleteRequest,
  ManualAttendanceResponse,
} from "@/types/attendance";

export const useAttendance = () => {
  // 사진 출석
  const usePhotoAttendance = () => {
    return useMutation({
      mutationFn: ({
        formData,
        groupId,
      }: {
        formData: FormData;
        groupId: number;
      }) => checkPhotoAttendance(formData, groupId),
    });
  };

  // 수동 출석
  const useManualAttendance = () =>
    useMutation<ManualAttendanceResponse, Error, ManualAttendanceRequest>({
      mutationFn: (data) => checkManualAttendance(data),
    });

  // 출석 완료 저장
  const useCompleteAttendance = () =>
    useMutation<{ attendance_id: number }, Error, AttendanceCompleteRequest>({
      mutationFn: (data) => completeAttendance(data),
    });

  // 출석 조회
  const useAttendanceRecord = (attendanceId: number) => {
    return useQuery({
      queryKey: ["attendance", attendanceId],
      queryFn: () => fetchAttendanceRecord(attendanceId),
      enabled: !!attendanceId, // id 있을 때만 fetch
    });
  };

  // 출석 명단 수정
  const useUpdateAttendance = () => {
    return useMutation({
      mutationFn: ({
        attendanceId,
        user_ids,
      }: {
        attendanceId: number;
        user_ids: number[];
      }) => updateAttendanceRecord(attendanceId, user_ids),
    });
  };

  // QR 코드 생성
  const useGenerateQr = () => {
    return useMutation({
      mutationFn: (attendanceId: number) =>
        generateQrForAttendance(attendanceId),
    });
  };

  return {
    usePhotoAttendance,
    useManualAttendance,
    useCompleteAttendance,
    useAttendanceRecord,
    useUpdateAttendance,
    useGenerateQr,
  };
};
