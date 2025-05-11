export interface AttendeeInfo {
  user_id: number;
  name: string;
  profile_image_url?: string;
}

export interface Diary {
  id: number;
  group_id: number;
  user_id: number;
  schedule_id?: number;
  attendance_id?: number;
  title: string;
  diary_text: string;
  summary?: string;
  image_path?: string;
  created_at: string;
  hashtags?: string[];
  attendees: AttendeeInfo[];
}

export interface DiaryAutoGenerateInput {
  group_id: number;
  schedule_id: number;
  attendance_id: number;
  user_id: number;
}
