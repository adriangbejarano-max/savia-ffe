"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { Button, Input, Label, Select, Textarea } from "@/components/Form";
import { badgeClass } from "@/lib/utils";
import {
  Building2,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

type Empresa = {
  id: number;
  nombre: string;
  cif?: string | null;
  sector: string;
  municipio: string;
  direccion?: string | null;
  web?: string | null;
  telefono?: string | null;
  email?: string | null;
  contactoNombre?: string | null;
  contactoCargo?: string | null;
  ciclosAceptados: string;
  plazas: number;
  modalidad: string;
  estado: string;
  valoracion: number;
  observaciones?: string | null;
};

const emptyForm = {
  nombre: "",
  cif: "",
  sector: "",
  municipio: "",
  direccion: "",
  web: "",
  telefono: "",
  email: "",
  contactoNombre: "",
  contactoCargo: "",
  ciclosAceptados: "",
  plazas: 1,
  modalidad: "General",
  estado: "PROSPECTO",
  valoracion: 3,
  observaciones: "",
};

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadEmpresas() {
    const res = await fetch("/api/empresas");
    const data = await res.json();
    setEmpresas(data);
  }

  useEffect(() => {
    loadEmpresas();
  }, []);

  async function submitEmpresa(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    await fetch("/api/empresas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setForm(emptyForm);
    await loadEmpresas();
    setSaving(false);
  }

  const filteredEmpresas = empresas.filter((empresa) => {
    const text = [
      empresa.nombre,
      empresa.cif,
      empresa.sector,
      empresa.municipio,
      empresa.email,
      empresa.contactoNombre,
      empresa.ciclosAceptados,
      empresa.estado,
    ]
      .join(" ")
      .toLowerCase();

    return text.includes(search.toLowerCase());
  });

  const stats = useMemo(() => {
    return {
      total: empresas.length,
      activas: empresas.filter((empresa) => empresa.estado === "ACTIVA").length,
      plazas: empresas.reduce((acc, empresa) => acc + empresa.plazas, 0),
      media:
        empresas.length === 0
          ? 0
          : (
              empresas.reduce((acc, empresa) => acc + empresa.valoracion, 0) /
              empresas.length
            ).toFixed(1),
    };
  }, [empresas]);

  return (
    <div className="space-y-10">
      <section className="rounded-[2rem] border border-red-100 bg-gradient-to-br from-white via-[#fff7f8] to-[#fff1f3] p-8 shadow-sm">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#dc001b] shadow-sm">
              <Sparkles size={15} />
              SAVIA FFE
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-950">
              Empresas colaboradoras
            </h1>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-500">
              Una base de datos clara y visual para gestionar empresas,
              contactos, plazas, ciclos aceptados y estado de colaboración.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[560px]">
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <p className="text-xs font-bold text-slate-400">Total</p>
              <p className="mt-1 text-3xl font-black text-slate-950">
                {stats.total}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <p className="text-xs font-bold text-slate-400">Activas</p>
              <p className="mt-1 text-3xl font-black text-[#dc001b]">
                {stats.activas}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <p className="text-xs font-bold text-slate-400">Plazas</p>
              <p className="mt-1 text-3xl font-black text-slate-950">
                {stats.plazas}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <p className="text-xs font-bold text-slate-400">Media</p>
              <p className="mt-1 text-3xl font-black text-slate-950">
                {stats.media}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Card className="p-8">
        <div className="mb-8 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-[#fff1f3] text-[#dc001b]">
            <Plus />
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-tight">
              Añadir empresa
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Registra solo lo imprescindible al principio. Después podrás
              completar datos de contacto, observaciones y seguimiento.
            </p>
          </div>
        </div>

        <form onSubmit={submitEmpresa} className="space-y-8">
          <div>
            <h3 className="mb-4 text-sm font-black uppercase tracking-[0.16em] text-slate-400">
              Datos principales
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              <div className="xl:col-span-2">
                <Label>Nombre de la empresa</Label>
                <Input
                  required
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Ej. TechSoluciones Madrid"
                />
              </div>

              <div>
                <Label>CIF</Label>
                <Input
                  value={form.cif}
                  onChange={(e) => setForm({ ...form, cif: e.target.value })}
                  placeholder="B12345678"
                />
              </div>

              <div>
                <Label>Sector</Label>
                <Input
                  required
                  value={form.sector}
                  onChange={(e) => setForm({ ...form, sector: e.target.value })}
                  placeholder="Desarrollo software"
                />
              </div>

              <div>
                <Label>Municipio</Label>
                <Input
                  required
                  value={form.municipio}
                  onChange={(e) =>
                    setForm({ ...form, municipio: e.target.value })
                  }
                  placeholder="Madrid"
                />
              </div>

              <div>
                <Label>Ciclos aceptados</Label>
                <Input
                  required
                  value={form.ciclosAceptados}
                  onChange={(e) =>
                    setForm({ ...form, ciclosAceptados: e.target.value })
                  }
                  placeholder="DAW, DAM, ASIR..."
                />
              </div>

              <div>
                <Label>Plazas</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.plazas}
                  onChange={(e) =>
                    setForm({ ...form, plazas: Number(e.target.value) })
                  }
                />
              </div>

              <div>
                <Label>Modalidad</Label>
                <Select
                  value={form.modalidad}
                  onChange={(e) =>
                    setForm({ ...form, modalidad: e.target.value })
                  }
                >
                  <option>General</option>
                  <option>Intensiva</option>
                  <option>Ambas</option>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-black uppercase tracking-[0.16em] text-slate-400">
              Contacto
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="contacto@empresa.com"
                />
              </div>

              <div>
                <Label>Teléfono</Label>
                <Input
                  value={form.telefono}
                  onChange={(e) =>
                    setForm({ ...form, telefono: e.target.value })
                  }
                  placeholder="910000000"
                />
              </div>

              <div>
                <Label>Persona de contacto</Label>
                <Input
                  value={form.contactoNombre}
                  onChange={(e) =>
                    setForm({ ...form, contactoNombre: e.target.value })
                  }
                  placeholder="Nombre y apellidos"
                />
              </div>

              <div>
                <Label>Cargo del contacto</Label>
                <Input
                  value={form.contactoCargo}
                  onChange={(e) =>
                    setForm({ ...form, contactoCargo: e.target.value })
                  }
                  placeholder="RRHH, tutor empresa..."
                />
              </div>

              <div className="md:col-span-2">
                <Label>Dirección</Label>
                <Input
                  value={form.direccion}
                  onChange={(e) =>
                    setForm({ ...form, direccion: e.target.value })
                  }
                  placeholder="Calle, número, CP..."
                />
              </div>

              <div className="md:col-span-2">
                <Label>Web</Label>
                <Input
                  value={form.web}
                  onChange={(e) => setForm({ ...form, web: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-black uppercase tracking-[0.16em] text-slate-400">
              Estado interno
            </h3>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
              <div>
                <Label>Estado</Label>
                <Select
                  value={form.estado}
                  onChange={(e) =>
                    setForm({ ...form, estado: e.target.value })
                  }
                >
                  <option>PROSPECTO</option>
                  <option>CONTACTADA</option>
                  <option>INTERESADA</option>
                  <option>ACTIVA</option>
                  <option>INACTIVA</option>
                </Select>
              </div>

              <div>
                <Label>Valoración</Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={form.valoracion}
                  onChange={(e) =>
                    setForm({ ...form, valoracion: Number(e.target.value) })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <Label>Observaciones</Label>
                <Textarea
                  value={form.observaciones}
                  onChange={(e) =>
                    setForm({ ...form, observaciones: e.target.value })
                  }
                  placeholder="Notas internas, requisitos, experiencia previa..."
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end border-t border-slate-100 pt-6">
            <Button disabled={saving}>
              {saving ? "Guardando..." : "Guardar empresa"}
            </Button>
          </div>
        </form>
      </Card>

      <section>
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-950">
              Empresas registradas
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Vista visual en tarjetas, más cómoda para revisar contactos y
              disponibilidad.
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
              placeholder="Buscar empresas..."
              className="pl-11"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {filteredEmpresas.map((empresa) => (
            <article
              key={empresa.id}
              className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-5">
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-[#fff1f3] text-[#dc001b]">
                    <Building2 size={24} />
                  </div>

                  <div>
                    <h3 className="text-xl font-black tracking-tight text-slate-950">
                      {empresa.nombre}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {empresa.sector} · {empresa.municipio}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className={badgeClass(empresa.estado)}>
                        {empresa.estado}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                        {empresa.modalidad}
                      </span>
                      <span className="rounded-full bg-[#fff1f3] px-3 py-1 text-xs font-black text-[#dc001b]">
                        {empresa.ciclosAceptados}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-[#dc001b]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        size={15}
                        fill={
                          index < empresa.valoracion ? "#dc001b" : "none"
                        }
                        className={
                          index < empresa.valoracion
                            ? "text-[#dc001b]"
                            : "text-slate-200"
                        }
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-xs font-bold text-slate-400">
                    Valoración
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                    <Users size={14} />
                    Plazas
                  </div>
                  <p className="text-2xl font-black text-slate-950">
                    {empresa.plazas}
                  </p>
                </div>

                <div className="rounded-3xl bg-slate-50 p-4 sm:col-span-2">
                  <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                    <Mail size={14} />
                    Contacto
                  </div>
                  <p className="truncate text-sm font-bold text-slate-800">
                    {empresa.contactoNombre || "Sin persona de contacto"}
                  </p>
                  <p className="truncate text-sm text-slate-500">
                    {empresa.email || "Sin email registrado"}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 rounded-3xl bg-white text-sm text-slate-500">
                  <Phone size={16} className="text-slate-300" />
                  {empresa.telefono || "Sin teléfono"}
                </div>

                <div className="flex items-center gap-2 rounded-3xl bg-white text-sm text-slate-500">
                  <MapPin size={16} className="text-slate-300" />
                  {empresa.direccion || empresa.municipio}
                </div>
              </div>

              {empresa.observaciones ? (
                <div className="mt-5 rounded-3xl bg-[#fff7f8] p-4 text-sm leading-6 text-slate-600">
                  {empresa.observaciones}
                </div>
              ) : null}
            </article>
          ))}

          {filteredEmpresas.length === 0 ? (
            <div className="col-span-full rounded-[2rem] border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
              No hay empresas que coincidan con la búsqueda.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}