"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Sparkles, UserRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("coordinador");
  const [password, setPassword] = useState("coord123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "No se pudo iniciar sesión.");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-[#fff7f8] to-[#fff1f3] p-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-red-100 lg:grid-cols-2">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#dc001b] via-[#b80016] to-[#7f000f] p-10 text-white">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
          <div className="absolute bottom-0 left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

          <div className="relative flex h-full min-h-[420px] flex-col justify-between">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white">
                <Sparkles size={15} />
                SAVIA FFE
              </div>

              <h1 className="text-5xl font-black tracking-tight">
                Gestión FFE
              </h1>

              <p className="mt-5 max-w-md text-base leading-7 text-white/85">
                Plataforma de gestión de empresas, convenios, alumnos,
                asignaciones y seguimiento de la formación en empresa.
              </p>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/15 p-5 backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">
                Powered by
              </p>
              <p className="mt-1 text-xl font-black">
                Salesianos Domingo Savio
              </p>
            </div>
          </div>
        </section>

        <section className="p-10">
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight text-slate-950">
              Iniciar sesión
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Accede con tu usuario y contraseña para gestionar SAVIA FFE.
            </p>
          </div>

          <form onSubmit={login} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">
                Usuario
              </label>

              <div className="relative">
                <UserRound
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#dc001b] focus:ring-4 focus:ring-red-100"
                  placeholder="coordinador"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">
                Contraseña
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#dc001b] focus:ring-4 focus:ring-red-100"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error ? (
              <div className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
                {error}
              </div>
            ) : null}

            <button
              disabled={loading}
              className="w-full rounded-2xl bg-[#dc001b] px-6 py-4 text-sm font-black text-white shadow-lg shadow-red-200 transition hover:bg-[#a90014] disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div className="mt-8 rounded-3xl bg-slate-50 p-5">
            <p className="text-sm font-black text-slate-700">
              Usuarios de prueba
            </p>

            <div className="mt-3 grid gap-2 text-xs text-slate-500">
              <p>
                <strong>admin</strong> / admin123 — ADMIN
              </p>
              <p>
                <strong>coordinador</strong> / coord123 — COORDINADOR
              </p>
              <p>
                <strong>tutor</strong> / tutor123 — TUTOR
              </p>
              <p>
                <strong>empresa</strong> / empresa123 — EMPRESA
              </p>
              <p>
                <strong>alumno</strong> / alumno123 — ALUMNO
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}