"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { Button, Input, Label, Select, Textarea } from "@/components/Form";
import {
  CheckCircle2,
  GraduationCap,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  UserPlus,
  XCircle,
} from "lucide-react";

type Alumno = {
  id: number;
  nombre: string;
  apellidos: string;
  email?: string | null;
  telefono?: string | null;
  ciclo: string;
  curso: string;
  prlSuperada: boolean;
  aptoFfe: boolean;
  preferencias?: string | null;
  observaciones?: string | null;
};

const emptyForm = {
  nombre: "",
  apellidos: "",
  email: "",
  telefono: "",
  ciclo: "",
  curso: "1º",
  prlSuperada: false,
  aptoFfe: false,
  preferencias: "",
  observaciones: "",
};

function EstadoBadge({
  active,
  yes,
  no,
}: {
  active: boolean;
  yes: string;
  no: string;
}) {
  if (active) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
        <CheckCircle2 size={14} />
        {yes}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
      <XCircle size={14} />
      {no}
    </span>
  );
}

export default function AlumnosPage() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadAlumnos() {
    const res = await fetch("/api/alumnos");
    const data = await res.json();
    setAlumnos(data);
  }

  useEffect(() => {
    loadAlumnos();
  }, []);

  async function submitAlumno(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    await fetch("/api/alumnos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setForm(emptyForm);
    await loadAlumnos();
    setSaving(false);
  }

  const filteredAlumnos = alumnos.filter((alumno) => {
    const text = [
      alumno.nombre,
      alumno.apellidos,
      alumno.email,
      alumno.telefono,
      alumno.ciclo,
      alumno.curso,
      alumno.preferencias,
      alumno.observaciones,
    ]
      .join(" ")
      .toLowerCase();

    return text.includes(search.toLowerCase());
  });

  const stats = useMemo(() => {
    return {
      total: alumnos.length,
      aptos: alumnos.filter((alumno) => alumno.aptoFfe).length,
      prl: alumnos.filter((alumno) => alumno.prlSuperada).length,
    };
  }, [alumnos]);

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
              Alumnado
            </h1>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-500">
              Gestiona los alumnos, su ciclo, curso, PRL, aptitud FFE y
              preferencias para facilitar la asignación a empresas.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
              <p className="text-xs font-bold text-slate-400">Total</p>
              <p className="mt-1 text-3xl font-black text-slate-950">
                {stats.total}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
              <p className="text-xs font-bold text-slate-400">Aptos FFE</p>
              <p className="mt-1 text-3xl font-black text-[#dc001b]">
                {stats.aptos}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
              <p className="text-xs font-bold text-slate-400">PRL OK</p>
              <p className="mt-1 text-3xl font-black text-slate-950">
                {stats.prl}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Card className="p-8">
        <div className="mb-8 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-[#fff1f3] text-[#dc001b]">
            <UserPlus />
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-tight">
              Añadir alumno
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Registra los datos básicos y el estado de preparación para la FFE.
            </p>
          </div>
        </div>

        <form onSubmit={submitAlumno} className="space-y-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <Label>Nombre</Label>
              <Input
                required
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Nombre"
              />
            </div>

            <div>
              <Label>Apellidos</Label>
              <Input
                required
                value={form.apellidos}
                onChange={(e) =>
                  setForm({ ...form, apellidos: e.target.value })
                }
                placeholder="Apellidos"
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="alumno@correo.com"
              />
            </div>

            <div>
              <Label>Teléfono</Label>
              <Input
                value={form.telefono}
                onChange={(e) =>
                  setForm({ ...form, telefono: e.target.value })
                }
                placeholder="600000000"
              />
            </div>

            <div>
              <Label>Ciclo formativo</Label>
              <Input
                required
                value={form.ciclo}
                onChange={(e) => setForm({ ...form, ciclo: e.target.value })}
                placeholder="DAW, DAM, ASIR..."
              />
            </div>

            <div>
              <Label>Curso</Label>
              <Select
                value={form.curso}
                onChange={(e) => setForm({ ...form, curso: e.target.value })}
              >
                <option>1º</option>
                <option>2º</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <label className="flex cursor-pointer gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <input
                type="checkbox"
                checked={form.prlSuperada}
                onChange={(e) =>
                  setForm({ ...form, prlSuperada: e.target.checked })
                }
                className="mt-1 h-5 w-5 accent-[#dc001b]"
              />
              <span>
                <span className="block text-sm font-black text-slate-900">
                  PRL superada
                </span>
                <span className="mt-1 block text-sm leading-6 text-slate-500">
                  El alumno ha completado la formación de prevención de riesgos.
                </span>
              </span>
            </label>

            <label className="flex cursor-pointer gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-5">
              <input
                type="checkbox"
                checked={form.aptoFfe}
                onChange={(e) =>
                  setForm({ ...form, aptoFfe: e.target.checked })
                }
                className="mt-1 h-5 w-5 accent-[#dc001b]"
              />
              <span>
                <span className="block text-sm font-black text-slate-900">
                  Apto para FFE
                </span>
                <span className="mt-1 block text-sm leading-6 text-slate-500">
                  El alumno puede ser asignado a una empresa colaboradora.
                </span>
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <Label>Preferencias</Label>
              <Textarea
                value={form.preferencias}
                onChange={(e) =>
                  setForm({ ...form, preferencias: e.target.value })
                }
                placeholder="Frontend, backend, redes, sistemas, cercanía..."
              />
            </div>

            <div>
              <Label>Observaciones</Label>
              <Textarea
                value={form.observaciones}
                onChange={(e) =>
                  setForm({ ...form, observaciones: e.target.value })
                }
                placeholder="Notas internas del tutor, disponibilidad, necesidades..."
              />
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-6">
            <Button disabled={saving}>
              {saving ? "Guardando..." : "Guardar alumno"}
            </Button>
          </div>
        </form>
      </Card>

      <section>
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-950">
              Alumnos registrados
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Revisa de forma visual el estado de cada alumno.
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
              placeholder="Buscar alumnos..."
              className="pl-11"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {filteredAlumnos.map((alumno) => (
            <article
              key={alumno.id}
              className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-[#fff1f3] text-[#dc001b]">
                  <GraduationCap size={25} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-xl font-black tracking-tight text-slate-950">
                    {alumno.nombre} {alumno.apellidos}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {alumno.ciclo} · {alumno.curso} curso
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#fff1f3] px-3 py-1 text-xs font-black text-[#dc001b]">
                      {alumno.ciclo}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                      {alumno.curso}
                    </span>

                    <EstadoBadge
                      active={alumno.prlSuperada}
                      yes="PRL superada"
                      no="PRL pendiente"
                    />

                    <EstadoBadge
                      active={alumno.aptoFfe}
                      yes="Apto FFE"
                      no="No apto FFE"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                    <Mail size={14} />
                    Email
                  </div>
                  <p className="truncate text-sm font-bold text-slate-800">
                    {alumno.email || "Sin email registrado"}
                  </p>
                </div>

                <div className="rounded-3xl bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                    <Phone size={14} />
                    Teléfono
                  </div>
                  <p className="truncate text-sm font-bold text-slate-800">
                    {alumno.telefono || "Sin teléfono"}
                  </p>
                </div>
              </div>

              {alumno.preferencias ? (
                <div className="mt-5 rounded-3xl bg-[#fff7f8] p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#dc001b]">
                    <ShieldCheck size={14} />
                    Preferencias
                  </div>
                  <p className="text-sm leading-6 text-slate-600">
                    {alumno.preferencias}
                  </p>
                </div>
              ) : null}

              {alumno.observaciones ? (
                <div className="mt-3 rounded-3xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                  {alumno.observaciones}
                </div>
              ) : null}
            </article>
          ))}

          {filteredAlumnos.length === 0 ? (
            <div className="col-span-full rounded-[2rem] border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
              No hay alumnos que coincidan con la búsqueda.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}