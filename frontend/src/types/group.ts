// src/types/group.ts
export interface GroupType {
  id: number;
  name: string;
  description?: string;
  category?: string;
  image_url?: string;
  locked_amount?: number; // 내가 락인한 금액
  group_balance?: number; // 그룹 전체 잔액 (✅ 추가)
}
