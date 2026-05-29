import { Card, StatCard } from "@/components/Card";
import { prisma } from "@/lib/prisma";
import { badgeClass, daysUntil, formatDate } from "@/lib/utils";
import {
  AlertTriangle,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Link2,
  Network,
  Sparkles,
  UserCircle2,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

function progressPercent(realizadas: number, previstas: number) {
  if (!previstas || previstas <= 0) return 0;
  return Math.min(100, Math.round((realizadas / previstas) * 100));
}

function calendarBadgeClass(type: string) {
  if (type === "danger") {
    return "bg-red-50 text-red-700 border-red-100";
  }

  if (type === "warning") {
    return "bg-amber-50 text-amber-700 border-amber-100";
  }

  return "bg-[#fff1f3] text-[#dc001b] border-red-100";
}

export default async function DashboardPage() {
  const [
    empresas,
    empresasActivas,
    alumnos,
    alumnosAptos,
    conveniosVigentes,
    asignacionesEnCurso,
    seguimientosConIncidencia,
  ] = await Promise.all([
    prisma.empresa.count(),
    prisma.empresa.count({ where: { estado: "ACTIVA" } }),
    prisma.alumno.count(),
    prisma.alumno.count({ where: { aptoFfe: true } }),
    prisma.convenio.count({ where: { estado: "VIGENTE" } }),
    prisma.asignacion.count({ where: { estado: "EN_CURSO" } }),
    prisma.seguimiento.count({
      where: { resultado: { in: ["INCIDENCIA", "REQUIERE_ACCION"] } },
    }),
  ]);

  const proximosConvenios = await prisma.convenio.findMany({
    take: 5,
    orderBy: { fechaFin: "asc" },
    include: { empresa: true },
  });

  const asignaciones = await prisma.asignacion.findMany({
    take: 5,
    orderBy: { fechaFin: "asc" },
    include: {
      alumno: true,
      empresa: true,
    },
  });

  const alumnosPendientes = await prisma.alumno.count({
    where: {
      OR: [{ prlSuperada: false }, { aptoFfe: false }],
    },
  });

  const empresasSinPlazas = await prisma.empresa.count({
    where: {
      plazas: 0,
    },
  });

  const conveniosProximos = proximosConvenios.filter((convenio) => {
    const dias = daysUntil(convenio.fechaFin);
    return dias >= 0 && dias <= 60;
  }).length;

  const calendario = [
    ...proximosConvenios.map((convenio) => {
      const dias = daysUntil(convenio.fechaFin);

      return {
        id: `convenio-${convenio.id}`,
        fecha: convenio.fechaFin,
        titulo: `Vence convenio: ${convenio.empresa.nombre}`,
        subtitulo: convenio.titulo,
        tipo: dias < 0 ? "danger" : dias <= 60 ? "warning" : "normal",
        etiqueta: dias < 0 ? "Vencido" : `${dias} días`,
      };
    }),
    ...asignaciones.map((asignacion) => {
      const dias = daysUntil(asignacion.fechaFin);

      return {
        id: `asignacion-${asignacion.id}`,
        fecha: asignacion.fechaFin,
        titulo: `Finaliza FFE: ${asignacion.alumno.nombre} ${asignacion.alumno.apellidos}`,
        subtitulo: asignacion.empresa.nombre,
        tipo: dias < 0 ? "danger" : dias <= 30 ? "warning" : "normal",
        etiqueta: dias < 0 ? "Finalizada" : `${dias} días`,
      };
    }),
  ]
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
    .slice(0, 6);

  const alertas = [
    {
      title: "Convenios próximos a vencer",
      value: conveniosProximos,
      description: "Revisa renovaciones o documentación pendiente.",
      icon: FileText,
      href: "/convenios",
    },
    {
      title: "Alumnos pendientes de validación",
      value: alumnosPendientes,
      description: "PRL o aptitud FFE pendiente de marcar.",
      icon: GraduationCap,
      href: "/alumnos",
    },
    {
      title: "Seguimientos con incidencia",
      value: seguimientosConIncidencia,
      description: "Registros que requieren revisión del tutor.",
      icon: ClipboardCheck,
      href: "/seguimiento",
    },
    {
      title: "Empresas sin plazas",
      value: empresasSinPlazas,
      description: "Empresas registradas sin plazas disponibles.",
      icon: Building2,
      href: "/empresas",
    },
  ];

  const quickLinks = [
    {
      href: "/empresas",
      title: "Añadir empresa",
      description: "Registra una nueva empresa colaboradora.",
      icon: Building2,
    },
    {
      href: "/alumnos",
      title: "Añadir alumno",
      description: "Alta de alumno y validación FFE.",
      icon: GraduationCap,
    },
    {
      href: "/convenios",
      title: "Nuevo convenio",
      description: "Controla fechas y estado documental.",
      icon: FileText,
    },
    {
      href: "/asignaciones",
      title: "Asignar alumno",
      description: "Relaciona alumno, empresa y periodo.",
      icon: Link2,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_360px]">
        <div className="rounded-[2rem] border border-red-100 bg-gradient-to-br from-white via-[#fff7f8] to-[#fff1f3] p-7 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#dc001b] shadow-sm">
                <Sparkles size={15} />
                SAVIA FFE
              </div>

              <h1 className="text-4xl font-black tracking-tight text-slate-950">
                Panel de control
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                Vista rápida de empresas, alumnado, convenios, asignaciones y
                seguimientos de la FFE.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Powered by
              </p>
              <p className="mt-1 text-lg font-black text-[#dc001b]">
                Salesianos Domingo Savio
              </p>
            </div>
          </div>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#fff1f3] text-[#dc001b]">
              <UserCircle2 size={34} />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Perfil activo
              </p>
              <h2 className="mt-1 text-xl font-black text-slate-950">
                Coordinador FFE
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Salesianos Domingo Savio
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-3xl bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-700">
              Sesión de trabajo
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Revisa alertas, asignaciones próximas y convenios antes de
              contactar con empresas.
            </p>
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          title="Empresas"
          value={empresas}
          note={`${empresasActivas} activas`}
        />
        <StatCard
          title="Alumnos"
          value={alumnos}
          note={`${alumnosAptos} aptos FFE`}
        />
        <StatCard title="Convenios vigentes" value={conveniosVigentes} />
        <StatCard
          title="Asignaciones en curso"
          value={asignacionesEnCurso}
          note={`${seguimientosConIncidencia} incidencias`}
        />
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-7">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">
                Calendario FFE
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Próximos vencimientos y finales de estancia.
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#fff1f3] text-[#dc001b]">
              <CalendarDays />
            </div>
          </div>

          <div className="space-y-3">
            {calendario.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm"
              >
                <div className="w-20 rounded-2xl bg-slate-50 p-3 text-center">
                  <p className="text-xs font-black uppercase text-slate-400">
                    {new Date(item.fecha).toLocaleDateString("es-ES", {
                      month: "short",
                    })}
                  </p>
                  <p className="text-2xl font-black text-slate-950">
                    {new Date(item.fecha).getDate()}
                  </p>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-slate-950">
                    {item.titulo}
                  </p>
                  <p className="mt-1 truncate text-sm text-slate-500">
                    {item.subtitulo}
                  </p>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-black ${calendarBadgeClass(
                    item.tipo
                  )}`}
                >
                  {item.etiqueta}
                </span>
              </div>
            ))}

            {calendario.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                No hay eventos próximos.
              </div>
            ) : null}
          </div>
        </Card>

        <Card className="p-7">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">
                Alertas operativas
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Puntos que conviene revisar.
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-amber-50 text-amber-600">
              <AlertTriangle />
            </div>
          </div>

          <div className="space-y-3">
            {alertas.map((alerta) => {
              const Icon = alerta.icon;
              const isUrgent = alerta.value > 0;

              return (
                <Link
                  key={alerta.title}
                  href={alerta.href}
                  className="block rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                        isUrgent
                          ? "bg-[#fff1f3] text-[#dc001b]"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      {isUrgent ? <Icon size={20} /> : <CheckCircle2 />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-black text-slate-950">
                          {alerta.title}
                        </p>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${
                            isUrgent
                              ? "bg-[#fff1f3] text-[#dc001b]"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {alerta.value}
                        </span>
                      </div>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {alerta.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-7">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">
                Accesos rápidos
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Acciones habituales del coordinador.
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#fff1f3] text-[#dc001b]">
              <Network />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {quickLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff1f3] text-[#dc001b]">
                    <Icon size={20} />
                  </div>
                  <p className="text-sm font-black text-slate-950">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </Card>

        <Card className="p-7">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">
                Asignaciones próximas
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Seguimiento rápido del progreso de horas.
              </p>
            </div>

            <Link
              href="/asignaciones"
              className="rounded-2xl bg-[#dc001b] px-4 py-3 text-sm font-black text-white shadow-lg shadow-red-100 transition hover:bg-[#a90014]"
            >
              Ver todas
            </Link>
          </div>

          <div className="space-y-3">
            {asignaciones.map((asignacion) => {
              const percent = progressPercent(
                asignacion.horasRealizadas,
                asignacion.horasPrevistas
              );

              return (
                <div
                  key={asignacion.id}
                  className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-black text-slate-950">
                        {asignacion.alumno.nombre}{" "}
                        {asignacion.alumno.apellidos}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {asignacion.empresa.nombre} ·{" "}
                        {formatDate(asignacion.fechaFin)}
                      </p>
                    </div>

                    <span className={badgeClass(asignacion.estado)}>
                      {asignacion.estado}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between text-xs font-black text-slate-400">
                      <span>Progreso</span>
                      <span className="text-[#dc001b]">{percent}%</span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[#dc001b]"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <p className="mt-2 text-xs font-bold text-slate-500">
                      {asignacion.horasRealizadas}/{asignacion.horasPrevistas}{" "}
                      horas
                    </p>
                  </div>
                </div>
              );
            })}

            {asignaciones.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                No hay asignaciones registradas.
              </div>
            ) : null}
          </div>
        </Card>
      </section>

      <Card className="p-7">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight">
              Convenios próximos
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Seguimiento de vencimientos y estado documental.
            </p>
          </div>

          <Link
            href="/convenios"
            className="rounded-2xl bg-[#dc001b] px-4 py-3 text-sm font-black text-white shadow-lg shadow-red-100 transition hover:bg-[#a90014]"
          >
            Ver convenios
          </Link>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#dc001b] text-white">
              <tr>
                <th className="p-4">Empresa</th>
                <th className="p-4">Convenio</th>
                <th className="p-4">Fin</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Aviso</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {proximosConvenios.map((c) => (
                <tr key={c.id} className="border-t border-slate-100">
                  <td className="p-4 font-bold text-slate-900">
                    {c.empresa.nombre}
                  </td>
                  <td className="p-4 text-slate-600">{c.titulo}</td>
                  <td className="p-4 text-slate-600">
                    {formatDate(c.fechaFin)}
                  </td>
                  <td className="p-4">
                    <span className={badgeClass(c.estado)}>{c.estado}</span>
                  </td>
                  <td className="p-4 font-bold text-[#dc001b]">
                    {daysUntil(c.fechaFin)} días
                  </td>
                </tr>
              ))}

              {proximosConvenios.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No hay convenios registrados.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}