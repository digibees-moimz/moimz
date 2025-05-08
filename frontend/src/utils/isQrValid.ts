export const isQrTokenValid = (createdAt?: string): boolean => {
  if (!createdAt) return false;
  const created = new Date(createdAt).getTime();
  return Date.now() - created < 30 * 60 * 1000; // 30분 이내
};
