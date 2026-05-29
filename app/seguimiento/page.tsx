"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { Button, Input, Label, Select, Textarea } from "@/components/Form";
import { badgeClass, formatDate } from "@/lib/utils";
import {
  AlertTriangle,
  Building2,
  CalendarCheck2,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  GraduationCap,
  MessageSquareText,
  Search,
  Sparkles,
  TimerReset,
} from "lucide-react";

type Alumno = {
  id: number;
  nombre: string;
  apellidos: string;
  ciclo: string;
  curso: string;
};

type Empresa = {
  id: number;
  nombre: string;
  municipio: string;
  sector: string;
};

type Asignacion = {
  id: number;
  alumnoId: number;
  empresaId: number;
  fechaInicio: string;
  fechaFin: string;
  horasPrevistas: number;
  horasRealizadas: number;
  tutorCentro: string;
  tutorEmpresa?: string | null;
  estado: string;
  alumno: Alumno;
  empresa: Empresa;
};

type Seguimiento = {
  id: number;
  asignacionId: number;
  fecha: string;
  horas: number;
  resumen: string;
  incidencia?: string | null;
  resultado: string;
  asignacion: Asignacion;
};

const emptyForm = {
  asignacionId: "",
  fecha: "",
  horas: 0,
  resumen: "",
  incidencia: "",
  resultado: "CORRECTO",
};

function resultadoIcon(resultado: string) {
  if (resultado === "CORRECTO") {
    return <CheckCircle2 size={18} className="text-emerald-600" />;
  }

  if (resultado === "INCIDENCIA") {
    return <AlertTriangle size={18} className="text-red-600" />;
  }

  return <TimerReset size={18} className="text-amber-600" />;
}

function resultadoSoftClass(resultado: string) {
  if (resultado === "CORRECTO") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (resultado === "INCIDENCIA") {
    return "bg-red-50 text-red-700";
  }

  return "bg-amber-50 text-amber-700";
}

function progressPercent(realizadas: number, previstas: number) {
  if (!previstas || previstas <= 0) return 0;
  return Math.min(100, Math.round((realizadas / previstas) * 100));
}

export default function SeguimientoPage() {
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [seguimientos, setSeguimientos] = useState<Seguimiento[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadData() {
    const [asignacionesRes, seguimientosRes] = await Promise.all([
      fetch("/api/asignaciones"),
      fetch("/api/seguimientos"),
    ]);

    const asignacionesData = await asignacionesRes.json();
    const seguimientosData = await seguimientosRes.json();

    setAsignaciones(asignacionesData);
    setSeguimientos(seguimientosData);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function submitSeguimiento(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    await fetch("/api/seguimientos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setForm(emptyForm);
    await loadData();
    setSaving(false);
  }

  const asignacionesActivas = asignaciones.filter((asignacion) =>
    ["PROPUESTA", "CONFIRMADA", "EN_CURSO"].includes(asignacion.estado)
  );

  const selectedAsignacion = asignaciones.find(
    (asignacion) => String(asignacion.id) === form.asignacionId
  );

  const filteredSeguimientos = seguimientos.filter((seguimiento) => {
    const text = [
      seguimiento.asignacion?.alumno?.nombre,
      seguimiento.asignacion?.alumno?.apellidos,
      seguimiento.asignacion?.alumno?.ciclo,
      seguimiento.asignacion?.empresa?.nombre,
      seguimiento.asignacion?.empresa?.municipio,
      seguimiento.resumen,
      seguimiento.incidencia,
      seguimiento.resultado,
    ]
      .join(" ")
      .toLowerCase();

    return text.includes(search.toLowerCase());
  });

  const stats = useMemo(() => {
    const horas = seguimientos.reduce(
      (acc, seguimiento) => acc + seguimiento.horas,
      0
    );

    const incidencias = seguimientos.filter(
      (seguimiento) =>
        seguimiento.resultado === "INCIDENCIA" ||
        seguimiento.resultado === "REQUIERE_ACCION"
    ).length;

    const correctos = seguimientos.filter(
      (seguimiento) => seguimiento.resultado === "CORRECTO"
    ).length;

    return {
      total: seguimientos.length,
      horas,
      incidencias,
      correctos,
    };
  }, [seguimientos]);

  return (
    <div className="mx-auto max-w-7xl space-y-10">
      <section className="rounded-[2rem] border border-red-100 bg-gradient-to-br from-white via-[#fff7f8] to-[#fff1f3] p-8 shadow-sm">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#dc001b] shadow-sm">
              <Sparkles size={15} />
              SAVIA FFE
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-950">
              Seguimiento
            </h1>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-500">
              Registra tutorías, visitas, horas realizadas, evolución e
              incidencias durante la estancia del alumno en empresa.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
              <p className="text-xs font-bold text-slate-400">Registros</p>
              <p className="mt-1 text-3xl font-black text-slate-950">
                {stats.total}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
              <p className="text-xs font-bold text-slate-400">Horas</p>
              <p className="mt-1 text-3xl font-black text-[#dc001b]">
                {stats.horas}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
              <p className="text-xs font-bold text-slate-400">Correctos</p>
              <p className="mt-1 text-3xl font-black text-slate-950">
                {stats.correctos}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
              <p className="text-xs font-bold text-slate-400">Incidencias</p>
              <p className="mt-1 text-3xl font-black text-slate-950">
                {stats.incidencias}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Card className="p-8">
        <div className="mb-8 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-[#fff1f3] text-[#dc001b]">
            <ClipboardCheck />
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-tight">
              Nuevo seguimiento
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Añade un registro de seguimiento y suma automáticamente las horas
              realizadas a la asignación.
            </p>
          </div>
        </div>

        <form onSubmit={submitSeguimiento} className="space-y-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <Label>Asignación</Label>
              <Select
                required
                value={form.asignacionId}
                onChange={(e) =>
                  setForm({ ...form, asignacionId: e.target.value })
                }
              >
                <option value="">Selecciona una asignación</option>
                {asignacionesActivas.map((asignacion) => (
                  <option key={asignacion.id} value={asignacion.id}>
                    {asignacion.alumno.nombre} {asignacion.alumno.apellidos} ·{" "}
                    {asignacion.empresa.nombre}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label>Resultado</Label>
              <Select
                value={form.resultado}
                onChange={(e) =>
                  setForm({ ...form, resultado: e.target.value })
                }
              >
                <option>CORRECTO</option>
                <option>INCIDENCIA</option>
                <option>REQUIERE_ACCION</option>
              </Select>
            </div>

            <div>
              <Label>Fecha</Label>
              <Input
                required
                type="date"
                value={form.fecha}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              />
            </div>

            <div>
              <Label>Horas realizadas</Label>
              <Input
                type="number"
                min={0}
                value={form.horas}
                onChange={(e) =>
                  setForm({ ...form, horas: Number(e.target.value) })
                }
              />
            </div>

            <div className="md:col-span-2">
              <Label>Resumen del seguimiento</Label>
              <Textarea
                required
                value={form.resumen}
                onChange={(e) =>
                  setForm({ ...form, resumen: e.target.value })
                }
                placeholder="Describe el avance del alumno, tareas realizadas, valoración del tutor, visita, reunión..."
              />
            </div>

            <div className="md:col-span-2">
              <Label>Incidencia o acción requerida</Label>
              <Textarea
                value={form.incidencia}
                onChange={(e) =>
                  setForm({ ...form, incidencia: e.target.value })
                }
                placeholder="Indica aquí cualquier incidencia, ausencia, problema de adaptación, tarea pendiente..."
              />
            </div>
          </div>

          {selectedAsignacion ? (
            <div className="rounded-3xl bg-[#fff7f8] p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-[#dc001b]">
                    Asignación seleccionada
                  </p>
                  <p className="mt-2 text-lg font-black text-slate-950">
                    {selectedAsignacion.alumno.nombre}{" "}
                    {selectedAsignacion.alumno.apellidos}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {selectedAsignacion.empresa.nombre} ·{" "}
                    {selectedAsignacion.alumno.ciclo}
                  </p>
                </div>

                <div className="min-w-64">
                  <div className="mb-2 flex items-center justify-between text-xs font-black text-slate-500">
                    <span>Progreso actual</span>
                    <span>
                      {progressPercent(
                        selectedAsignacion.horasRealizadas,
                        selectedAsignacion.horasPrevistas
                      )}
                      %
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-[#dc001b]"
                      style={{
                        width: `${progressPercent(
                          selectedAsignacion.horasRealizadas,
                          selectedAsignacion.horasPrevistas
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-xs font-bold text-slate-500">
                    {selectedAsignacion.horasRealizadas}/
                    {selectedAsignacion.horasPrevistas} horas registradas
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex justify-end border-t border-slate-100 pt-6">
            <Button disabled={saving}>
              {saving ? "Guardando..." : "Guardar seguimiento"}
            </Button>
          </div>
        </form>
      </Card>

      <section>
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-950">
              Historial de seguimientos
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Consulta los registros realizados por alumno, empresa o resultado.
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar seguimientos..."
              className="pl-11"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {filteredSeguimientos.map((seguimiento) => {
            const asignacion = seguimiento.asignacion;
            const percent = progressPercent(
              asignacion.horasRealizadas,
              asignacion.horasPrevistas
            );

            return (
              <article
                key={seguimiento.id}
                className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex gap-4">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl ${resultadoSoftClass(
                      seguimiento.resultado
                    )}`}
                  >
                    {resultadoIcon(seguimiento.resultado)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-xl font-black tracking-tight text-slate-950">
                      {asignacion.alumno.nombre} {asignacion.alumno.apellidos}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {asignacion.empresa.nombre} ·{" "}
                      {formatDate(seguimiento.fecha)}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className={badgeClass(seguimiento.resultado)}>
                        {seguimiento.resultado}
                      </span>

                      <span className="rounded-full bg-[#fff1f3] px-3 py-1 text-xs font-black text-[#dc001b]">
                        +{seguimiento.horas} horas
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                        {asignacion.alumno.ciclo}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl bg-slate-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                      <Clock3 size={14} />
                      Progreso de la asignación
                    </div>
                    <p className="text-sm font-black text-[#dc001b]">
                      {percent}%
                    </p>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-[#dc001b]"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <p className="mt-2 text-xs font-bold text-slate-500">
                    {asignacion.horasRealizadas}/{asignacion.horasPrevistas}{" "}
                    horas realizadas
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-[#fff7f8] p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#dc001b]">
                      <GraduationCap size={14} />
                      Alumno
                    </div>
                    <p className="text-sm font-bold text-slate-900">
                      {asignacion.alumno.nombre} {asignacion.alumno.apellidos}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {asignacion.alumno.ciclo} · {asignacion.alumno.curso}
                    </p>
                  </div>

                  <div className="rounded-3xl bg-[#fff7f8] p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#dc001b]">
                      <Building2 size={14} />
                      Empresa
                    </div>
                    <p className="text-sm font-bold text-slate-900">
                      {asignacion.empresa.nombre}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {asignacion.empresa.municipio}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-3xl bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                    <MessageSquareText size={14} />
                    Resumen
                  </div>
                  <p className="text-sm leading-6 text-slate-600">
                    {seguimiento.resumen}
                  </p>
                </div>

                {seguimiento.incidencia ? (
                  <div className="mt-3 rounded-3xl bg-red-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-red-600">
                      <AlertTriangle size={14} />
                      Incidencia / acción requerida
                    </div>
                    <p className="text-sm leading-6 text-red-700">
                      {seguimiento.incidencia}
                    </p>
                  </div>
                ) : null}

                <div className="mt-5 flex items-center gap-2 text-xs font-bold text-slate-400">
                  <CalendarCheck2 size={14} />
                  Registro creado para el día {formatDate(seguimiento.fecha)}
                </div>
              </article>
            );
          })}

          {filteredSeguimientos.length === 0 ? (
            <div className="col-span-full rounded-[2rem] border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
              No hay seguimientos que coincidan con la búsqueda.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}