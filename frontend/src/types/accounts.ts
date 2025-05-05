// src/features/accounts/types.ts
export interface GroupAccountMember {
  user_account_id: number;
  name: string;
  locked_amount: number;
}

export interface GroupAccountSummary {
  group_account_id: number;
  account_number: string;
  total_balance: number;
  members: GroupAccountMember[];
  available_to_spend: number;
}
