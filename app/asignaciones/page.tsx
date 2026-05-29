"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { Button, Input, Label, Select, Textarea } from "@/components/Form";
import { badgeClass, formatDate } from "@/lib/utils";
import {
  Building2,
  CalendarDays,
  GraduationCap,
  Link2,
  Search,
  Sparkles,
  Target,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";

type Alumno = {
  id: number;
  nombre: string;
  apellidos: string;
  ciclo: string;
  curso: string;
  prlSuperada: boolean;
  aptoFfe: boolean;
};

type Empresa = {
  id: number;
  nombre: string;
  municipio: string;
  sector: string;
  ciclosAceptados: string;
  plazas: number;
  estado: string;
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
  planFormacion?: string | null;
  observaciones?: string | null;
  alumno: Alumno;
  empresa: Empresa;
};

const emptyForm = {
  alumnoId: "",
  empresaId: "",
  fechaInicio: "",
  fechaFin: "",
  horasPrevistas: 500,
  horasRealizadas: 0,
  tutorCentro: "",
  tutorEmpresa: "",
  estado: "PROPUESTA",
  planFormacion: "",
  observaciones: "",
};

function progressPercent(realizadas: number, previstas: number) {
  if (!previstas || previstas <= 0) return 0;
  return Math.min(100, Math.round((realizadas / previstas) * 100));
}

export default function AsignacionesPage() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadData() {
    const [alumnosRes, empresasRes, asignacionesRes] = await Promise.all([
      fetch("/api/alumnos"),
      fetch("/api/empresas"),
      fetch("/api/asignaciones"),
    ]);

    const alumnosData = await alumnosRes.json();
    const empresasData = await empresasRes.json();
    const asignacionesData = await asignacionesRes.json();

    setAlumnos(alumnosData);
    setEmpresas(empresasData);
    setAsignaciones(asignacionesData);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function submitAsignacion(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    await fetch("/api/asignaciones", {
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

  const alumnosAptos = alumnos.filter((alumno) => alumno.aptoFfe);

  const filteredAsignaciones = asignaciones.filter((asignacion) => {
    const text = [
      asignacion.alumno?.nombre,
      asignacion.alumno?.apellidos,
      asignacion.alumno?.ciclo,
      asignacion.empresa?.nombre,
      asignacion.empresa?.municipio,
      asignacion.tutorCentro,
      asignacion.tutorEmpresa,
      asignacion.estado,
      asignacion.planFormacion,
      asignacion.observaciones,
    ]
      .join(" ")
      .toLowerCase();

    return text.includes(search.toLowerCase());
  });

  const stats = useMemo(() => {
    const enCurso = asignaciones.filter((a) => a.estado === "EN_CURSO").length;
    const finalizadas = asignaciones.filter(
      (a) => a.estado === "FINALIZADA"
    ).length;
    const horasTotales = asignaciones.reduce(
      (acc, asignacion) => acc + asignacion.horasRealizadas,
      0
    );

    return {
      total: asignaciones.length,
      enCurso,
      finalizadas,
      horasTotales,
    };
  }, [asignaciones]);

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
              Asignaciones
            </h1>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-500">
              Asigna alumnos a empresas, controla fechas, horas previstas,
              tutores y plan de formación individual.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
              <p className="text-xs font-bold text-slate-400">Total</p>
              <p className="mt-1 text-3xl font-black text-slate-950">
                {stats.total}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
              <p className="text-xs font-bold text-slate-400">En curso</p>
              <p className="mt-1 text-3xl font-black text-[#dc001b]">
                {stats.enCurso}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
              <p className="text-xs font-bold text-slate-400">Finalizadas</p>
              <p className="mt-1 text-3xl font-black text-slate-950">
                {stats.finalizadas}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
              <p className="text-xs font-bold text-slate-400">Horas</p>
              <p className="mt-1 text-3xl font-black text-slate-950">
                {stats.horasTotales}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Card className="p-8">
        <div className="mb-8 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-[#fff1f3] text-[#dc001b]">
            <Link2 />
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-tight">
              Nueva asignación
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Relaciona un alumno con una empresa y define el periodo formativo.
            </p>
          </div>
        </div>

        <form onSubmit={submitAsignacion} className="space-y-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <Label>Alumno</Label>
              <Select
                required
                value={form.alumnoId}
                onChange={(e) =>
                  setForm({ ...form, alumnoId: e.target.value })
                }
              >
                <option value="">Selecciona un alumno</option>
                {alumnosAptos.map((alumno) => (
                  <option key={alumno.id} value={alumno.id}>
                    {alumno.nombre} {alumno.apellidos} · {alumno.ciclo}
                  </option>
                ))}
              </Select>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                Solo aparecen alumnos marcados como aptos para FFE.
              </p>
            </div>

            <div>
              <Label>Empresa</Label>
              <Select
                required
                value={form.empresaId}
                onChange={(e) =>
                  setForm({ ...form, empresaId: e.target.value })
                }
              >
                <option value="">Selecciona una empresa</option>
                {empresas.map((empresa) => (
                  <option key={empresa.id} value={empresa.id}>
                    {empresa.nombre} · {empresa.ciclosAceptados}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label>Fecha de inicio</Label>
              <Input
                required
                type="date"
                value={form.fechaInicio}
                onChange={(e) =>
                  setForm({ ...form, fechaInicio: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Fecha de fin</Label>
              <Input
                required
                type="date"
                value={form.fechaFin}
                onChange={(e) =>
                  setForm({ ...form, fechaFin: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Horas previstas</Label>
              <Input
                type="number"
                min={0}
                value={form.horasPrevistas}
                onChange={(e) =>
                  setForm({
                    ...form,
                    horasPrevistas: Number(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label>Horas realizadas iniciales</Label>
              <Input
                type="number"
                min={0}
                value={form.horasRealizadas}
                onChange={(e) =>
                  setForm({
                    ...form,
                    horasRealizadas: Number(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label>Tutor del centro</Label>
              <Input
                required
                value={form.tutorCentro}
                onChange={(e) =>
                  setForm({ ...form, tutorCentro: e.target.value })
                }
                placeholder="Nombre del tutor/a del centro"
              />
            </div>

            <div>
              <Label>Tutor de empresa</Label>
              <Input
                value={form.tutorEmpresa}
                onChange={(e) =>
                  setForm({ ...form, tutorEmpresa: e.target.value })
                }
                placeholder="Nombre del tutor/a de empresa"
              />
            </div>

            <div>
              <Label>Estado</Label>
              <Select
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value })}
              >
                <option>PROPUESTA</option>
                <option>CONFIRMADA</option>
                <option>EN_CURSO</option>
                <option>FINALIZADA</option>
                <option>CANCELADA</option>
              </Select>
            </div>

            <div>
              <Label>Observaciones</Label>
              <Input
                value={form.observaciones}
                onChange={(e) =>
                  setForm({ ...form, observaciones: e.target.value })
                }
                placeholder="Notas internas rápidas"
              />
            </div>

            <div className="md:col-span-2">
              <Label>Plan de formación</Label>
              <Textarea
                value={form.planFormacion}
                onChange={(e) =>
                  setForm({ ...form, planFormacion: e.target.value })
                }
                placeholder="Resultados de aprendizaje, actividades previstas, tareas, seguimiento..."
              />
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-6">
            <Button disabled={saving}>
              {saving ? "Guardando..." : "Guardar asignación"}
            </Button>
          </div>
        </form>
      </Card>

      <section>
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-950">
              Asignaciones registradas
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Visualiza alumno, empresa, periodo, tutores y progreso de horas.
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
              placeholder="Buscar asignaciones..."
              className="pl-11"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {filteredAsignaciones.map((asignacion) => {
            const percent = progressPercent(
              asignacion.horasRealizadas,
              asignacion.horasPrevistas
            );

            return (
              <article
                key={asignacion.id}
                className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-[#fff1f3] text-[#dc001b]">
                    <UsersRound size={25} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-xl font-black tracking-tight text-slate-950">
                      {asignacion.alumno.nombre}{" "}
                      {asignacion.alumno.apellidos}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {asignacion.empresa.nombre} · {asignacion.alumno.ciclo}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className={badgeClass(asignacion.estado)}>
                        {asignacion.estado}
                      </span>

                      <span className="rounded-full bg-[#fff1f3] px-3 py-1 text-xs font-black text-[#dc001b]">
                        {asignacion.alumno.ciclo}
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                        {asignacion.horasRealizadas}/
                        {asignacion.horasPrevistas} h
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl bg-slate-50 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                      <Target size={14} />
                      Progreso de horas
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
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                      <GraduationCap size={14} />
                      Alumno
                    </div>
                    <p className="text-sm font-bold text-slate-900">
                      {asignacion.alumno.nombre}{" "}
                      {asignacion.alumno.apellidos}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {asignacion.alumno.ciclo} · {asignacion.alumno.curso}
                    </p>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-slate-400">
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

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-3xl bg-[#fff7f8] p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#dc001b]">
                      <CalendarDays size={14} />
                      Inicio
                    </div>
                    <p className="text-sm font-black text-slate-900">
                      {formatDate(asignacion.fechaInicio)}
                    </p>
                  </div>

                  <div className="rounded-3xl bg-[#fff7f8] p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#dc001b]">
                      <CalendarDays size={14} />
                      Fin
                    </div>
                    <p className="text-sm font-black text-slate-900">
                      {formatDate(asignacion.fechaFin)}
                    </p>
                  </div>

                  <div className="rounded-3xl bg-[#fff7f8] p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#dc001b]">
                      <UserRoundCheck size={14} />
                      Tutor centro
                    </div>
                    <p className="truncate text-sm font-black text-slate-900">
                      {asignacion.tutorCentro}
                    </p>
                  </div>
                </div>

                {asignacion.tutorEmpresa ? (
                  <div className="mt-3 rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                      Tutor de empresa
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-800">
                      {asignacion.tutorEmpresa}
                    </p>
                  </div>
                ) : null}

                {asignacion.planFormacion ? (
                  <div className="mt-3 rounded-3xl bg-slate-50 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                      Plan de formación
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {asignacion.planFormacion}
                    </p>
                  </div>
                ) : null}

                {asignacion.observaciones ? (
                  <div className="mt-3 rounded-3xl bg-white p-4 text-sm leading-6 text-slate-500">
                    {asignacion.observaciones}
                  </div>
                ) : null}
              </article>
            );
          })}

          {filteredAsignaciones.length === 0 ? (
            <div className="col-span-full rounded-[2rem] border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
              No hay asignaciones que coincidan con la búsqueda.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}