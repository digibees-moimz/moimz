// src/utils/formatDate.ts

type DateFormatOptions = {
  year?: boolean;
  month?: boolean;
  day?: boolean;
  hour?: boolean;
  minute?: boolean;
  second?: boolean;
};

export function formatKoreanDateCustom(
  dateInput: string | Date,
  options: DateFormatOptions = {}
): string {
  const raw = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const date: Date = raw;

  const localeOptions: Intl.DateTimeFormatOptions = {
    ...(options.year && { year: "numeric" }),
    ...(options.month && { month: "long" }),
    ...(options.day && { day: "numeric" }),
    ...(options.hour && { hour: "2-digit", hour12: false }),
    ...(options.minute && { minute: "2-digit" }),
    ...(options.second && { second: "2-digit" }),
  };

  return date
    .toLocaleString("ko-KR", localeOptions)
    .replace("오전", "AM")
    .replace("오후", "PM");
}
