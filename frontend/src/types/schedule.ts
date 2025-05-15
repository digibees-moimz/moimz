// src/types/schedule.ts

import { TransactionRead } from "./transaction";

export interface ScheduleItem {
  id: number;
  title: string;
  date: string; // ISO 문자열, ex) "2025-05-03T11:50:49.169000"
  is_done: boolean;

  location?: string; // 추가
  description?: string; // 추가
}

export interface ScheduleImage {
  id: number;
  image_url: string;
  uploaded_at: string;
}

export interface ScheduleComment {
  id: number;
  user: {
    id: number;
    name: string;
    profile_image_url?: string | null;
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
  transactions: TransactionRead[]; // ✅ 이 줄 추가!
  diary_id?: number | null; // ✅ 이 줄 추가
  images?: ScheduleImage[]; // ✅ 이 줄 추가
}

export interface ScheduleCreateInput {
  user_id: number;
  title: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:mm"
  location?: string;
  description?: string;
}

export interface ScheduleCardItem {
  id: number;
  title: string;
  date: string;
  is_done: boolean;
  location?: string;
}

export interface AllScheduleCardItem extends ScheduleCardItem {
  group_id: number;
  group_name: string;
}

export interface PendingSchedule {
  id: number;
  group_id: number;
  title: string;
  date: string;
  is_done: boolean;
  location?: string;
}
