export const isQrTokenValid = (createdAt?: string): boolean => {
  if (!createdAt) return false;
  const created = new Date(createdAt).getTime();
  return Date.now() - created < 30 * 60 * 1000; // 30분 이내
};

export const getTokenRemainingSeconds = (createdAt: string): number => {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  const diff = 30 * 60 * 1000 - (now - created);
  return Math.max(0, Math.floor(diff / 1000));
};
