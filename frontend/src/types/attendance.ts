// types/attendance.ts
export type AttendanceCheckType = "photo" | "manual";

export interface BaseAttendanceItem {
  user_id: number;
  name: string;
  locked_amount: number;
}

export interface PhotoAttendanceItem extends BaseAttendanceItem {
  similarity: number;
}

export interface ManualAttendanceItem extends BaseAttendanceItem {}

export interface BaseAttendanceResponse {
  group_id: number;
  user_ids: number[];
  available_to_spend: number;
  count: number;
}

export interface PhotoAttendanceResponse extends BaseAttendanceResponse {
  duration: number;
  image_url: string;
  attendees: PhotoAttendanceItem[];
  check_type: "photo";
}

export interface ManualAttendanceResponse extends BaseAttendanceResponse {
  attendees: ManualAttendanceItem[];
  check_type: "manual";
}

export interface ManualAttendanceRequest {
  group_id: number;
  user_ids: number[];
}

export interface AttendanceCompleteRequest {
  group_id: number;
  schedule_id?: number;
  user_ids: number[];
  check_type: AttendanceCheckType;
  image_url?: string;
}

export interface SavedAttendanceItem {
  user_id: number;
  name: string;
  locked_amount: number;
}

export interface AttendanceRecordRead {
  attendance_id: number;
  attendees: SavedAttendanceItem[];
  count: number;
  available_to_spend: number;
  check_type: AttendanceCheckType;
  image_url?: string;
}
