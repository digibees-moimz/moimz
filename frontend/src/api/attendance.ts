import axios, { uploadFile } from "@/lib/axios";
import {
  PhotoAttendanceResponse,
  ManualAttendanceRequest,
  ManualAttendanceResponse,
  AttendanceCompleteRequest,
  AttendanceRecordRead,
} from "@/types/attendance";

// 1. 사진 기반 출석체크
export const checkPhotoAttendance = (formData: FormData, groupId: number) =>
  uploadFile(`api/attendance/photo?group_id=${groupId}`, formData);

// 2. 출석 결과 이미지 조회
export const getAttendanceImageUrl = (checkId: string) =>
  `/api/attendance/photo/${checkId}`;

// 3. 수동 출석체크
export const checkManualAttendance = (
  data: ManualAttendanceRequest
): Promise<ManualAttendanceResponse> =>
  axios.post(`api/attendance/manual`, data);

// 4. 출석 완료 저장
export const completeAttendance = (
  data: AttendanceCompleteRequest
): Promise<{ attendance_id: number }> =>
  axios.post(`api/attendance/complete`, data);

// 5. 출석 조회
export const fetchAttendanceRecord = (attendanceId: number) =>
  axios.get<AttendanceRecordRead>(`api/attendance/${attendanceId}`);

// 6. 출석 명단 수정
export const updateAttendanceRecord = (
  attendanceId: number,
  user_ids: number[]
) =>
  axios.put<AttendanceRecordRead>(`api/attendance/${attendanceId}`, {
    user_ids,
  });

// 7. QR 코드 생성
export const generateQrForAttendance = (attendanceId: number) =>
  axios.post<{ qr_token: string; qr_url: string }>(
    `/attendance/${attendanceId}/qr`
  );

// 8. QR 이미지 조회 URL 반환
export const getQrImageUrl = (token: string) =>
  `/api/attendance/qr/image/${token}`;
