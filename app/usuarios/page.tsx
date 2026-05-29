"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Trash2,
  RotateCcw,
  Users,
  School,
  ShieldCheck,
} from "lucide-react";
import { Card } from "@/components/Card";
import { Button, Input, Label, Select } from "@/components/Form";

type Clase = {
  id: number;
  nombre: string;
  etapa?: string | null;
  ciclo?: string | null;
};

type Empresa = {
  id: number;
  nombre: string;
};

type Alumno = {
  id: number;
  nombre: string;
  apellidos: string;
};

type Usuario = {
  id: number;
  nombre: string;
  apellidos?: string | null;
  username: string;
  email?: string | null;
  rol: string;
  activo: boolean;
  fotoUrl?: string | null;
  claseId?: number | null;
  empresaId?: number | null;
  alumnoId?: number | null;
  clase?: Clase | null;
  empresa?: Empresa | null;
  alumno?: Alumno | null;
};

const emptyUser = {
  nombre: "",
  apellidos: "",
  username: "",
  email: "",
  password: "",
  rol: "TUTOR",
  activo: true,
  fotoUrl: "",
  claseId: "",
  empresaId: "",
  alumnoId: "",
};

const emptyClase = {
  nombre: "",
  etapa: "",
  ciclo: "",
};

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [clases, setClases] = useState<Clase[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [userForm, setUserForm] = useState(emptyUser);
  const [claseForm, setClaseForm] = useState(emptyClase);
  const [search, setSearch] = useState("");
  const [savingUser, setSavingUser] = useState(false);
  const [savingClase, setSavingClase] = useState(false);
  const [error, setError] = useState("");

  async function loadData() {
    setError("");

    try {
      const [usuariosRes, clasesRes, empresasRes, alumnosRes] =
        await Promise.all([
          fetch("/api/usuarios"),
          fetch("/api/clases"),
          fetch("/api/empresas"),
          fetch("/api/alumnos"),
        ]);

      if (!usuariosRes.ok) {
        throw new Error("No tienes permisos para gestionar usuarios.");
      }

      setUsuarios(await usuariosRes.json());
      setClases(clasesRes.ok ? await clasesRes.json() : []);
      setEmpresas(empresasRes.ok ? await empresasRes.json() : []);
      setAlumnos(alumnosRes.ok ? await alumnosRes.json() : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo cargar la gestión de usuarios."
      );
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function createUsuario(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSavingUser(true);
    setError("");

    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userForm),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo crear el usuario.");
      }

      setUserForm(emptyUser);
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo crear el usuario."
      );
    } finally {
      setSavingUser(false);
    }
  }

  async function createClase(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSavingClase(true);
    setError("");

    try {
      const res = await fetch("/api/clases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(claseForm),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo crear la clase.");
      }

      setClaseForm(emptyClase);
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo crear la clase."
      );
    } finally {
      setSavingClase(false);
    }
  }

  async function deleteUsuario(id: number) {
    if (!confirm("¿Seguro que quieres eliminar este usuario?")) return;

    await fetch(`/api/usuarios/${id}`, {
      method: "DELETE",
    });

    await loadData();
  }

  async function resetPassword(usuario: Usuario) {
    const nueva = prompt(
      `Nueva contraseña para ${usuario.nombre}:`,
      "Savia1234!"
    );

    if (!nueva) return;

    await fetch(`/api/usuarios/${usuario.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        username: usuario.username,
        email: usuario.email,
        rol: usuario.rol,
        activo: usuario.activo,
        fotoUrl: usuario.fotoUrl,
        claseId: usuario.claseId,
        empresaId: usuario.empresaId,
        alumnoId: usuario.alumnoId,
        password: nueva,
      }),
    });

    await loadData();
  }

  const filteredUsuarios = useMemo(() => {
    return usuarios.filter((usuario) => {
      const text = [
        usuario.nombre,
        usuario.apellidos,
        usuario.username,
        usuario.email,
        usuario.rol,
        usuario.clase?.nombre,
        usuario.empresa?.nombre,
        usuario.alumno?.nombre,
        usuario.alumno?.apellidos,
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(search.toLowerCase());
    });
  }, [usuarios, search]);

  return (
    <div className="mx-auto max-w-7xl space-y-10">
      <section className="rounded-[2rem] border border-red-100 bg-gradient-to-br from-white via-[#fff7f8] to-[#fff1f3] p-8 shadow-sm">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#dc001b] shadow-sm">
              <ShieldCheck size={15} />
              Administración
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-950">
              Usuarios y permisos
            </h1>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-500">
              Gestiona usuarios, roles, clases, tutores, empresas asociadas y
              accesos a la plataforma.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
              <p className="text-xs font-bold text-slate-400">Usuarios</p>
              <p className="mt-1 text-3xl font-black text-slate-950">
                {usuarios.length}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
              <p className="text-xs font-bold text-slate-400">Clases</p>
              <p className="mt-1 text-3xl font-black text-[#dc001b]">
                {clases.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-3xl border border-red-100 bg-red-50 p-5 text-sm font-bold text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-8 xl:grid-cols-[1.4fr_0.8fr]">
        <Card className="p-8">
          <div className="mb-8 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-[#fff1f3] text-[#dc001b]">
              <Plus />
            </div>

            <div>
              <h2 className="text-2xl font-black tracking-tight">
                Crear usuario
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Crea administradores, coordinadores, tutores, empresas o
                alumnos.
              </p>
            </div>
          </div>

          <form onSubmit={createUsuario} className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <Label>Nombre</Label>
                <Input
                  required
                  value={userForm.nombre}
                  onChange={(e) =>
                    setUserForm({ ...userForm, nombre: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Apellidos</Label>
                <Input
                  value={userForm.apellidos}
                  onChange={(e) =>
                    setUserForm({ ...userForm, apellidos: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Usuario</Label>
                <Input
                  required
                  value={userForm.username}
                  onChange={(e) =>
                    setUserForm({ ...userForm, username: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Correo electrónico</Label>
                <Input
                  type="email"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm({ ...userForm, email: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Contraseña inicial</Label>
                <Input
                  type="password"
                  value={userForm.password}
                  onChange={(e) =>
                    setUserForm({ ...userForm, password: e.target.value })
                  }
                  placeholder="Si lo dejas vacío: Savia1234!"
                />
              </div>

              <div>
                <Label>Rol</Label>
                <Select
                  value={userForm.rol}
                  onChange={(e) =>
                    setUserForm({ ...userForm, rol: e.target.value })
                  }
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="COORDINADOR">COORDINADOR</option>
                  <option value="TUTOR">TUTOR</option>
                  <option value="EMPRESA">EMPRESA</option>
                  <option value="ALUMNO">ALUMNO</option>
                </Select>
              </div>

              {userForm.rol === "TUTOR" ? (
                <div>
                  <Label>Clase / tutoría</Label>
                  <Select
                    value={userForm.claseId}
                    onChange={(e) =>
                      setUserForm({ ...userForm, claseId: e.target.value })
                    }
                  >
                    <option value="">Sin clase</option>
                    {clases.map((clase) => (
                      <option key={clase.id} value={clase.id}>
                        {clase.nombre}
                      </option>
                    ))}
                  </Select>
                </div>
              ) : null}

              {userForm.rol === "EMPRESA" ? (
                <div>
                  <Label>Empresa asociada</Label>
                  <Select
                    value={userForm.empresaId}
                    onChange={(e) =>
                      setUserForm({ ...userForm, empresaId: e.target.value })
                    }
                  >
                    <option value="">Sin empresa</option>
                    {empresas.map((empresa) => (
                      <option key={empresa.id} value={empresa.id}>
                        {empresa.nombre}
                      </option>
                    ))}
                  </Select>
                </div>
              ) : null}

              {userForm.rol === "ALUMNO" ? (
                <div>
                  <Label>Alumno asociado</Label>
                  <Select
                    value={userForm.alumnoId}
                    onChange={(e) =>
                      setUserForm({ ...userForm, alumnoId: e.target.value })
                    }
                  >
                    <option value="">Sin alumno</option>
                    {alumnos.map((alumno) => (
                      <option key={alumno.id} value={alumno.id}>
                        {alumno.nombre} {alumno.apellidos}
                      </option>
                    ))}
                  </Select>
                </div>
              ) : null}

              <div className="md:col-span-2">
                <Label>Foto URL</Label>
                <Input
                  value={userForm.fotoUrl}
                  onChange={(e) =>
                    setUserForm({ ...userForm, fotoUrl: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
            </div>

            <Button disabled={savingUser}>
              {savingUser ? "Guardando..." : "Crear usuario"}
            </Button>
          </form>
        </Card>

        <Card className="p-8">
          <div className="mb-8 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-[#fff1f3] text-[#dc001b]">
              <School />
            </div>

            <div>
              <h2 className="text-2xl font-black tracking-tight">
                Crear clase
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Las clases creadas aquí podrán asignarse a alumnos y tutores.
              </p>
            </div>
          </div>

          <form onSubmit={createClase} className="space-y-5">
            <div>
              <Label>Nombre de la clase</Label>
              <Input
                required
                value={claseForm.nombre}
                onChange={(e) =>
                  setClaseForm({ ...claseForm, nombre: e.target.value })
                }
                placeholder="Ej. 3ºA"
              />
            </div>

            <div>
              <Label>Etapa</Label>
              <Input
                value={claseForm.etapa}
                onChange={(e) =>
                  setClaseForm({ ...claseForm, etapa: e.target.value })
                }
                placeholder="Ej. ESO, FPB, CFGM..."
              />
            </div>

            <div>
              <Label>Ciclo</Label>
              <Input
                value={claseForm.ciclo}
                onChange={(e) =>
                  setClaseForm({ ...claseForm, ciclo: e.target.value })
                }
                placeholder="Ej. Informática"
              />
            </div>

            <Button disabled={savingClase}>
              {savingClase ? "Guardando..." : "Crear clase"}
            </Button>
          </form>

          <div className="mt-8 space-y-2">
            {clases.map((clase) => (
              <div
                key={clase.id}
                className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700"
              >
                {clase.nombre}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#fff1f3] text-[#dc001b]">
              <Users />
            </div>

            <div>
              <h2 className="text-2xl font-black tracking-tight">
                Usuarios creados
              </h2>
              <p className="text-sm text-slate-500">
                Listado de usuarios y permisos activos.
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              className="pl-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar usuario..."
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-4">Usuario</th>
                <th className="px-5 py-4">Rol</th>
                <th className="px-5 py-4">Asignación</th>
                <th className="px-5 py-4">Estado</th>
                <th className="px-5 py-4 text-right">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredUsuarios.map((usuario) => (
                <tr key={usuario.id} className="bg-white">
                  <td className="px-5 py-4">
                    <div className="font-black text-slate-950">
                      {usuario.nombre} {usuario.apellidos}
                    </div>
                    <div className="text-xs font-semibold text-slate-400">
                      {usuario.username} · {usuario.email || "Sin correo"}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-[#fff1f3] px-3 py-1 text-xs font-black text-[#dc001b]">
                      {usuario.rol}
                    </span>
                  </td>

                  <td className="px-5 py-4 font-semibold text-slate-600">
                    {usuario.rol === "TUTOR"
                      ? usuario.clase?.nombre || "Sin clase"
                      : usuario.rol === "EMPRESA"
                        ? usuario.empresa?.nombre || "Sin empresa"
                        : usuario.rol === "ALUMNO"
                          ? usuario.alumno
                            ? `${usuario.alumno.nombre} ${usuario.alumno.apellidos}`
                            : "Sin alumno"
                          : "Global"}
                  </td>

                  <td className="px-5 py-4">
                    {usuario.activo ? (
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                        Activo
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">
                        Inactivo
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => resetPassword(usuario)}
                        className="rounded-xl bg-slate-100 p-2 text-slate-600 transition hover:bg-[#fff1f3] hover:text-[#dc001b]"
                        title="Restablecer clave"
                      >
                        <RotateCcw size={17} />
                      </button>

                      <button
                        onClick={() => deleteUsuario(usuario.id)}
                        className="rounded-xl bg-slate-100 p-2 text-slate-600 transition hover:bg-red-50 hover:text-red-700"
                        title="Eliminar"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}