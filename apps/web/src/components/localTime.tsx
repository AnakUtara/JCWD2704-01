"use client";
export default function LocalTime({ time, option }: { time: Date; option?: Intl.DateTimeFormatOptions }) {
  let a = "id";
  try {
    a = navigator.language;
  } catch (e) {
    a = "id";
  }

  option = option || {
    hour: "numeric",
    minute: "numeric",
    year: "numeric",
    month: "short",
    day: "numeric",
    hourCycle: "h23",
    timeZoneName: "shortOffset",
  };
  return <>{new Date(time).toLocaleDateString(a, option)}</>;
}
