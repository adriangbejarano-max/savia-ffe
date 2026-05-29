"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { Button, Input, Label, Select, Textarea } from "@/components/Form";
import { badgeClass, daysUntil, formatDate } from "@/lib/utils";
import {
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock,
  ExternalLink,
  FilePlus2,
  FileText,
  Search,
  Sparkles,
} from "lucide-react";

type Empresa = {
  id: number;
  nombre: string;
  sector: string;
  municipio: string;
  ciclosAceptados: string;
  estado: string;
};

type Convenio = {
  id: number;
  empresaId: number;
  titulo: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  documentoUrl?: string | null;
  observaciones?: string | null;
  empresa: Empresa;
};

const emptyForm = {
  empresaId: "",
  titulo: "",
  fechaInicio: "",
  fechaFin: "",
  estado: "BORRADOR",
  documentoUrl: "",
  observaciones: "",
};

export default function ConveniosPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [convenios, setConvenios] = useState<Convenio[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadData() {
    const [empresasRes, conveniosRes] = await Promise.all([
      fetch("/api/empresas"),
      fetch("/api/convenios"),
    ]);

    const empresasData = await empresasRes.json();
    const conveniosData = await conveniosRes.json();

    setEmpresas(empresasData);
    setConvenios(conveniosData);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function submitConvenio(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    await fetch("/api/convenios", {
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

  const filteredConvenios = convenios.filter((convenio) => {
    const text = [
      convenio.titulo,
      convenio.estado,
      convenio.empresa?.nombre,
      convenio.empresa?.sector,
      convenio.empresa?.municipio,
      convenio.observaciones,
    ]
      .join(" ")
      .toLowerCase();

    return text.includes(search.toLowerCase());
  });

  const stats = useMemo(() => {
    const vigentes = convenios.filter((c) => c.estado === "VIGENTE").length;
    const firmados = convenios.filter((c) => c.estado === "FIRMADO").length;
    const vencenPronto = convenios.filter((c) => {
      const dias = daysUntil(c.fechaFin);
      return dias >= 0 && dias <= 60;
    }).length;

    return {
      total: convenios.length,
      vigentes,
      firmados,
      vencenPronto,
    };
  }, [convenios]);

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
              Convenios
            </h1>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-500">
              Controla convenios con empresas, fechas de vigencia, estado
              documental, enlaces a archivos y observaciones internas.
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
              <p className="text-xs font-bold text-slate-400">Vigentes</p>
              <p className="mt-1 text-3xl font-black text-[#dc001b]">
                {stats.vigentes}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
              <p className="text-xs font-bold text-slate-400">Firmados</p>
              <p className="mt-1 text-3xl font-black text-slate-950">
                {stats.firmados}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
              <p className="text-xs font-bold text-slate-400">≤ 60 días</p>
              <p className="mt-1 text-3xl font-black text-slate-950">
                {stats.vencenPronto}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Card className="p-8">
        <div className="mb-8 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-[#fff1f3] text-[#dc001b]">
            <FilePlus2 />
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-tight">
              Añadir convenio
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Registra un convenio, su empresa asociada y las fechas de inicio y
              finalización.
            </p>
          </div>
        </div>

        <form onSubmit={submitConvenio} className="space-y-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
                    {empresa.nombre} · {empresa.municipio}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label>Título del convenio</Label>
              <Input
                required
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Convenio FFE 2025-2026"
              />
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
              <Label>Estado</Label>
              <Select
                value={form.estado}
                onChange={(e) => setForm({ ...form, estado: e.target.value })}
              >
                <option>BORRADOR</option>
                <option>ENVIADO</option>
                <option>FIRMADO</option>
                <option>VIGENTE</option>
                <option>CADUCADO</option>
                <option>ARCHIVADO</option>
              </Select>
            </div>

            <div>
              <Label>Enlace al documento</Label>
              <Input
                value={form.documentoUrl}
                onChange={(e) =>
                  setForm({ ...form, documentoUrl: e.target.value })
                }
                placeholder="https://drive.google.com/..."
              />
            </div>

            <div className="md:col-span-2">
              <Label>Observaciones</Label>
              <Textarea
                value={form.observaciones}
                onChange={(e) =>
                  setForm({ ...form, observaciones: e.target.value })
                }
                placeholder="Notas internas, estado de firma, condiciones, próximos pasos..."
              />
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-6">
            <Button disabled={saving}>
              {saving ? "Guardando..." : "Guardar convenio"}
            </Button>
          </div>
        </form>
      </Card>

      <section>
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-950">
              Convenios registrados
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Revisa vencimientos, empresa asociada y estado documental.
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
              placeholder="Buscar convenios..."
              className="pl-11"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {filteredConvenios.map((convenio) => {
            const dias = daysUntil(convenio.fechaFin);
            const vencePronto = dias >= 0 && dias <= 60;
            const vencido = dias < 0;

            return (
              <article
                key={convenio.id}
                className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-[#fff1f3] text-[#dc001b]">
                    <FileText size={25} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-xl font-black tracking-tight text-slate-950">
                      {convenio.titulo}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {convenio.empresa?.nombre || "Empresa no encontrada"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className={badgeClass(convenio.estado)}>
                        {convenio.estado}
                      </span>

                      {vencido ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-700">
                          <Clock size={14} />
                          Vencido
                        </span>
                      ) : vencePronto ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
                          <CalendarClock size={14} />
                          Vence pronto
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                          <CheckCircle2 size={14} />
                          En plazo
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <div className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                      Inicio
                    </div>
                    <p className="text-sm font-black text-slate-900">
                      {formatDate(convenio.fechaInicio)}
                    </p>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-4">
                    <div className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                      Fin
                    </div>
                    <p className="text-sm font-black text-slate-900">
                      {formatDate(convenio.fechaFin)}
                    </p>
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-4">
                    <div className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                      Aviso
                    </div>
                    <p
                      className={`text-sm font-black ${
                        vencido || vencePronto
                          ? "text-[#dc001b]"
                          : "text-slate-900"
                      }`}
                    >
                      {vencido ? `Hace ${Math.abs(dias)} días` : `${dias} días`}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-3xl bg-[#fff7f8] p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-[#dc001b]">
                    <Building2 size={14} />
                    Empresa
                  </div>
                  <p className="text-sm font-bold text-slate-900">
                    {convenio.empresa?.nombre}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {convenio.empresa?.sector} · {convenio.empresa?.municipio}
                  </p>
                </div>

                {convenio.observaciones ? (
                  <div className="mt-3 rounded-3xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                    {convenio.observaciones}
                  </div>
                ) : null}

                {convenio.documentoUrl ? (
                  <a
                    href={convenio.documentoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#dc001b] px-4 py-3 text-sm font-black text-white shadow-lg shadow-red-100 transition hover:bg-[#a90014]"
                  >
                    <ExternalLink size={16} />
                    Abrir documento
                  </a>
                ) : null}
              </article>
            );
          })}

          {filteredConvenios.length === 0 ? (
            <div className="col-span-full rounded-[2rem] border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
              No hay convenios que coincidan con la búsqueda.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}