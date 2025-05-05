import axios from "@/lib/axios";

export async function postLockIn(
  userId: number,
  group_account_id: number,
  amount: number
) {
  return axios.post("/api/lockin", {
    user_id: userId,
    group_account_id: group_account_id,
    amount,
    description: "락인",
  });
}

export async function postLockOut(
  userId: number,
  group_account_id: number,
  amount: number
) {
  return axios.post("/api/lockout", {
    user_id: userId,
    group_account_id: group_account_id,
    amount,
    description: "락인 해제",
  });
}
