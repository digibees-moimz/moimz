// src/utils/formatDate.ts

type DateFormatOptions = {
  year?: boolean;
  month?: boolean;
  day?: boolean;
  hour?: boolean;
  minute?: boolean;
  second?: boolean;
};

export function parseISOAsUtc(input: string): Date {
  return new Date(input.endsWith("Z") ? input : input + "Z");
}

export function formatKoreanDateCustom(
  dateInput: string | Date,
  options: DateFormatOptions = {},
  hour12: boolean = false
): string {
  const date =
    typeof dateInput === "string" ? parseISOAsUtc(dateInput) : dateInput;

  const localeOptions: Intl.DateTimeFormatOptions = {
    ...(options.year && { year: "numeric" }),
    ...(options.month && { month: "long" }),
    ...(options.day && { day: "numeric" }),
    ...(options.hour && { hour: "2-digit", hour12 }),
    ...(options.minute && { minute: "2-digit" }),
    ...(options.second && { second: "2-digit" }),
    timeZone: "Asia/Seoul",
  };

  return date
    .toLocaleString("ko-KR", localeOptions)
    .replace("오전", "AM")
    .replace("오후", "PM");
}

// 주어진 날짜에 대한 D-day 텍스트 반환 (D-day, D-1, D+1 형식)
export function getDdayLabel(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const today = new Date();

  // 날짜만 비교
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const now = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const diff = Math.floor(
    (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diff === 0) return "D-day";
  if (diff > 0) return `D-${diff}`;
  return `D+${Math.abs(diff)}`;
}

// 시:분만 출력 (HH:mm)
export function formatTimeOnly(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
