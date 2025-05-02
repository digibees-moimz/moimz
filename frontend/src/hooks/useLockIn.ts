import axios from "@/lib/axios";

export function useLockIn(userId: number) {
  const lockIn = async (groupId: number, amount: number) => {
    const res = await axios.post("/api/lockin", {
      group_id: groupId,
      user_id: userId,
      amount,
      description: "락인",
    });
    return res.data;
  };

  const lockOut = async (groupId: number, amount: number) => {
    const res = await axios.post("/api/lockout", {
      group_id: groupId,
      user_id: userId,
      amount,
      description: "락인 해제",
    });
    return res.data;
  };

  return { lockIn, lockOut };
}
