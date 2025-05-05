// src/types/schedule.ts

export interface ScheduleItem {
  id: number;
  title: string;
  date: string; // ISO 문자열, ex) "2025-05-03T11:50:49.169000"
  is_done: boolean;

  location?: string; // 추가
  description?: string; // 추가
}

export interface ScheduleComment {
  id: number;
  user: {
    id: number;
    name: string;
  };
  content: string;
  created_at: string;
}

export interface ScheduleDetail extends ScheduleItem {
  group_id: number;
  user: {
    id: number;
    name: string;
    profile_image_url?: string | null; // ✅ 추가
  };
  location?: string;
  description?: string;
  created_at: string;
  comments: ScheduleComment[];
}

export interface ScheduleCreateInput {
  user_id: number;
  title: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:mm"
  location?: string;
  description?: string;
}
