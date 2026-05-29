"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
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
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
      setLoading(false);
    }
  }

  return (
    <main className="login-bg relative flex min-h-screen items-center justify-center overflow-hidden bg-[#b40018] px-6 py-14">
      {/* Fondo degradado */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#ff5b6f_0,_transparent_34%),radial-gradient(circle_at_bottom_right,_#7b0011_0,_transparent_40%)]" />

      {/* Iconos decorativos animados */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="float-slow absolute left-10 top-16 text-7xl font-black text-white">
          ✦
        </div>
        <div className="float-medium absolute right-16 top-20 text-8xl font-black text-white">
          ＋
        </div>
        <div className="float-fast absolute bottom-24 left-16 text-7xl font-black text-white">
          ●
        </div>
        <div className="float-slow absolute bottom-32 right-24 text-8xl font-black text-white">
          ✦
        </div>
        <div className="float-medium absolute left-1/4 top-1/3 text-6xl font-black text-white">
          ○
        </div>
        <div className="float-fast absolute right-1/4 bottom-1/3 text-6xl font-black text-white">
          ＋
        </div>

        <div className="float-slow absolute bottom-[18%] left-[12%] text-5xl text-white">
          🎓
        </div>
        <div className="float-medium absolute right-[14%] top-[42%] text-5xl text-white">
          🏢
        </div>
        <div className="float-fast absolute left-[42%] top-[14%] text-5xl text-white">
          📋
        </div>
        <div className="float-medium absolute bottom-[12%] left-[44%] text-5xl text-white">
          📚
        </div>
        <div className="float-slow absolute right-[8%] bottom-[18%] text-5xl text-white">
          🤝
        </div>
      </div>

      {/* Formas luminosas de fondo */}
      <div className="absolute -left-28 top-20 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -right-28 bottom-20 h-96 w-96 rounded-full bg-black/20 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15" />
      <div className="absolute left-1/2 top-1/2 h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />

      {/* Contenido principal */}
      <section className="relative z-10 grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[1fr_440px]">
        {/* Bloque izquierdo */}
        <div className="hidden text-white lg:block">
          <div className="mb-6 inline-flex rounded-full bg-white/15 px-5 py-2 text-xs font-black uppercase tracking-[0.25em] backdrop-blur">
            Formación · Futuro · Empresa
          </div>

          <h1 className="max-w-xl text-6xl font-black leading-[0.95] tracking-tight">
            SAVIA
            <span className="block text-white/75">FFE</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg font-medium leading-8 text-white/80">
            Plataforma de gestión para la Formación en Centros de Trabajo,
            empresas, alumnado y seguimiento educativo.
          </p>

          <div className="mt-10 grid max-w-md grid-cols-3 gap-3 text-center">
            <div className="rounded-3xl bg-white/15 p-4 backdrop-blur">
              <div className="text-3xl">🎓</div>
              <div className="mt-2 text-xs font-black uppercase tracking-wider">
                Alumnos
              </div>
            </div>

            <div className="rounded-3xl bg-white/15 p-4 backdrop-blur">
              <div className="text-3xl">🏢</div>
              <div className="mt-2 text-xs font-black uppercase tracking-wider">
                Empresas
              </div>
            </div>

            <div className="rounded-3xl bg-white/15 p-4 backdrop-blur">
              <div className="text-3xl">📋</div>
              <div className="mt-2 text-xs font-black uppercase tracking-wider">
                Gestión
              </div>
            </div>
          </div>
        </div>

        {/* Caja login */}
        <div className="relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-2xl shadow-black/30 sm:p-10">
          <div className="absolute right-0 top-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full bg-[#dc001b]/15" />
          <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-8 translate-y-8 rounded-full bg-[#dc001b]/10" />

          <div className="relative">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#dc001b] text-4xl shadow-lg shadow-red-200">
              🔐
            </div>

            <div className="mb-8 text-center">
              <h2 className="text-3xl font-black tracking-tight text-slate-950">
                Iniciar sesión
              </h2>

              <p className="mt-2 text-sm font-medium text-slate-500">
                Introduce tus credenciales para acceder.
              </p>
            </div>

            <form onSubmit={login} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Usuario
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                    👤
                  </span>
                  <input
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 pl-12 text-sm font-bold text-slate-900 outline-none transition focus:border-[#dc001b] focus:bg-white focus:ring-4 focus:ring-red-100"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Contraseña
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                    🔑
                  </span>
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 pl-12 text-sm font-bold text-slate-900 outline-none transition focus:border-[#dc001b] focus:bg-white focus:ring-4 focus:ring-red-100"
                    autoComplete="current-password"
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
                className="w-full rounded-2xl bg-[#dc001b] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white shadow-lg shadow-red-200 transition hover:-translate-y-0.5 hover:bg-[#a90014] disabled:translate-y-0 disabled:opacity-50"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Franja inferior */}
      <footer className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/20 bg-[#8f0012] px-4 py-3 text-center text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-lg">
        POWERED BY SALESIANOS DOMINGO SAVIO | www.salesianosdosa.com
      </footer>

      <style jsx global>{`
        .login-bg::before {
          content: "";
          position: absolute;
          inset: -40%;
          background:
            radial-gradient(
              circle at 20% 20%,
              rgba(255, 255, 255, 0.2),
              transparent 22%
            ),
            radial-gradient(
              circle at 80% 30%,
              rgba(255, 255, 255, 0.14),
              transparent 24%
            ),
            radial-gradient(
              circle at 50% 80%,
              rgba(0, 0, 0, 0.18),
              transparent 28%
            );
          animation: bgMove 14s ease-in-out infinite alternate;
        }

        .float-slow {
          animation: floatSlow 8s ease-in-out infinite;
        }

        .float-medium {
          animation: floatMedium 6s ease-in-out infinite;
        }

        .float-fast {
          animation: floatFast 4.8s ease-in-out infinite;
        }

        @keyframes bgMove {
          0% {
            transform: translate3d(-2%, -2%, 0) rotate(0deg) scale(1);
          }
          100% {
            transform: translate3d(2%, 2%, 0) rotate(8deg) scale(1.08);
          }
        }

        @keyframes floatSlow {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-22px) rotate(8deg);
          }
        }

        @keyframes floatMedium {
          0%,
          100% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          50% {
            transform: translateY(18px) translateX(-10px) rotate(-10deg);
          }
        }

        @keyframes floatFast {
          0%,
          100% {
            transform: translateY(0) translateX(0) scale(1);
          }
          50% {
            transform: translateY(-16px) translateX(12px) scale(1.08);
          }
        }
      `}</style>
    </main>
  );
}