export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function daysUntil(value: string | Date) {
  const today = new Date();
  const target = new Date(value);

  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  return Math.ceil(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
}

export function badgeClass(status: string) {
  const base = "inline-flex rounded-full px-3 py-1 text-xs font-black";

  if (
    [
      "ACTIVA",
      "FIRMADO",
      "VIGENTE",
      "CONFIRMADA",
      "EN_CURSO",
      "FINALIZADA",
      "CORRECTO",
    ].includes(status)
  ) {
    return `${base} bg-emerald-100 text-emerald-700`;
  }

  if (["CADUCADO", "CANCELADA", "INACTIVA", "INCIDENCIA"].includes(status)) {
    return `${base} bg-red-100 text-red-700`;
  }

  if (
    [
      "REQUIERE_ACCION",
      "ENVIADO",
      "CONTACTADA",
      "INTERESADA",
      "PROPUESTA",
    ].includes(status)
  ) {
    return `${base} bg-[#fff1f3] text-[#dc001b]`;
  }

  return `${base} bg-slate-100 text-slate-700`;
}