// src/types/transaction.ts
export type TransactionParticipant = {
  user_id: number;
  amount: number;
};

export interface TransactionRead {
  id: number;
  group_id: number;
  schedule_id?: number;
  store_name?: string | null;
  description?: string | null;
  mcc_code?: number | null;
  total_amount: number;
  created_at: string;
  participants: TransactionParticipant[];
}
