"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  GraduationCap,
  FileText,
  UsersRound,
  ClipboardCheck,
  LayoutDashboard,
  Sparkles,
  LogOut,
  UserCircle2,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

type SessionUser = {
  id: number;
  nombre: string;
  username: string;
  rol: string;
};

const allLinks = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "COORDINADOR", "TUTOR"],
  },
  {
    href: "/usuarios",
    label: "Usuarios",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    href: "/empresas",
    label: "Empresas",
    icon: Building2,
    roles: ["ADMIN", "COORDINADOR", "TUTOR"],
  },
  {
    href: "/alumnos",
    label: "Alumnos",
    icon: GraduationCap,
    roles: ["ADMIN", "COORDINADOR", "TUTOR"],
  },
  {
    href: "/convenios",
    label: "Convenios",
    icon: FileText,
    roles: ["ADMIN", "COORDINADOR"],
  },
  {
    href: "/asignaciones",
    label: "Asignaciones",
    icon: UsersRound,
    roles: ["ADMIN", "COORDINADOR", "TUTOR"],
  },
  {
    href: "/seguimiento",
    label: "Seguimiento",
    icon: ClipboardCheck,
    roles: ["ADMIN", "COORDINADOR", "TUTOR", "EMPRESA"],
  },
];

export function Nav() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    async function loadUser() {
      const res = await fetch("/api/auth/me");

      if (!res.ok) {
        router.push("/login");
        return;
      }

      const data = await res.json();
      setUser(data.user);
    }

    loadUser();
  }, [router]);

  const links = useMemo(() => {
    if (!user) return [];
    return allLinks.filter((link) => link.roles.includes(user.rol));
  }, [user]);

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="flex min-h-screen w-72 flex-col border-r border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#dc001b] text-white shadow-lg shadow-red-200">
            <Sparkles size={22} />
          </div>

          <div>
            <div className="text-2xl font-black tracking-tight text-slate-950">
              SAVIA <span className="text-[#dc001b]">FFE</span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Formación en empresa
            </p>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 transition-all hover:bg-[#fff1f3] hover:text-[#dc001b]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-all group-hover:bg-[#dc001b] group-hover:text-white">
              <Icon size={18} />
            </span>
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="rounded-3xl bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff1f3] text-[#dc001b]">
              <UserCircle2 />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-black text-slate-950">
                {user?.nombre || "Cargando..."}
              </p>
              <p className="text-xs font-bold text-[#dc001b]">
                {user?.rol || ""}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-[#dc001b]"
        >
          <LogOut size={17} />
          Cerrar sesión
        </button>

        <div className="rounded-3xl bg-slate-950 p-5 text-white">
          <p className="text-sm font-black">Gestión inteligente</p>
          <p className="mt-2 text-xs leading-5 text-slate-300">
            Powered by Salesianos Domingo Savio.
          </p>
        </div>
      </div>
    </aside>
  );
}