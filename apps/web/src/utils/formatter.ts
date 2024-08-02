export const tableDateFormat: Intl.DateTimeFormatOptions = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("id-ID", tableDateFormat).format(new Date(date));
}

export function formatQueryString(string: string) {
  return string.replaceAll(" ", "+").replaceAll("&", "%26").replaceAll(",", "%2C");
}

export function formatSearchParams(string: string) {
  return string.replaceAll("+", " ").replaceAll("%26", " & ").replaceAll("%2C", ", ");
}
