import dayjs from "dayjs";
import "dayjs/locale/id";

dayjs.locale("id");

export function formatTanggal(date, format = "DD MMMM YYYY") {
  if (!date) return "-";
  return dayjs(date).format(format);
}

export function formatTanggalWaktu(date) {
  if (!date) return "-";
  return dayjs(date).format("DD MMMM YYYY, HH:mm");
}

export function relativeTime(date) {
  if (!date) return "-";
  return dayjs(date).fromNow();
}
