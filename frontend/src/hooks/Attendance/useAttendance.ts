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
  PhotoAttendanceResponse,
  AttendanceRecordRead,
} from "@/types/attendance";

export const useAttendance = () => {
  // 사진 출석
  const usePhotoAttendance = () =>
    useMutation<
      PhotoAttendanceResponse,
      Error,
      { formData: FormData; groupId: number }
    >({
      mutationFn: ({ formData, groupId }) =>
        checkPhotoAttendance(formData, groupId),
    });

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
  const useAttendanceRecord = (attendanceId: number) =>
    useQuery<AttendanceRecordRead>({
      queryKey: ["attendance", attendanceId],
      queryFn: () => fetchAttendanceRecord(attendanceId),
      enabled: !!attendanceId,
    });

  // 출석 명단 수정
  const useUpdateAttendance = () =>
    useMutation<
      AttendanceRecordRead,
      Error,
      { attendanceId: number; user_ids: number[] }
    >({
      mutationFn: ({ attendanceId, user_ids }) =>
        updateAttendanceRecord(attendanceId, user_ids),
    });

  // QR 코드 생성
  const useGenerateQr = () =>
    useMutation<{ qr_token: string; qr_url: string }, Error, number>({
      mutationFn: (attendanceId) => generateQrForAttendance(attendanceId),
    });

  return {
    usePhotoAttendance,
    useManualAttendance,
    useCompleteAttendance,
    useAttendanceRecord,
    useUpdateAttendance,
    useGenerateQr,
  };
};
