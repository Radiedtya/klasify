export function getStatusColor(status) {
  const map = {
    pending: "warning",
    confirmed: "success",
    rejected: "danger",
    approved: "success",
    belum_bayar: "danger",
    lunas: "success",
    belum_lunas: "warning",
  };
  return map[status] || "gray";
}

export function getStatusLabel(status) {
  const map = {
    pending: "Pending",
    confirmed: "Dikonfirmasi",
    rejected: "Ditolak",
    approved: "Disetujui",
    belum_bayar: "Belum Bayar",
    lunas: "Lunas",
    belum_lunas: "Belum Lunas",
  };
  return map[status] || status;
}
