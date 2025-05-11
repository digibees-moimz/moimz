// frontend/src/hooks/Attendance/useAttendance.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  checkPhotoAttendance,
  checkManualAttendance,
  completeAttendance,
  fetchAttendanceRecord,
  updateAttendanceRecord,
  generateQrForAttendance,
  fetchAttendanceBySchedule,
} from "@/api/attendance";
import {
  ManualAttendanceRequest,
  AttendanceCompleteRequest,
  ManualAttendanceResponse,
  PhotoAttendanceResponse,
  AttendanceRecordRead,
  AttendanceRecord,
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

  // 일정에 연결된 출석 정보 조회
  const useAttendanceBySchedule = (scheduleId: number) => {
    return useQuery<AttendanceRecord>({
      queryKey: ["attendance-by-schedule", scheduleId],
      queryFn: () => fetchAttendanceBySchedule(scheduleId),
      enabled: !!scheduleId,
    });
  };

  return {
    usePhotoAttendance,
    useManualAttendance,
    useCompleteAttendance,
    useAttendanceRecord,
    useUpdateAttendance,
    useGenerateQr,
    useAttendanceBySchedule,
  };
};
