import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireApiRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { response } = requireApiRole(req, ["ADMIN"]);

  if (response) return response;

  const usuarios = await prisma.usuario.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      clase: true,
      empresa: true,
      alumno: true,
    },
  });

  const safeUsers = usuarios.map(({ password, ...usuario }) => usuario);

  return NextResponse.json(safeUsers);
}

export async function POST(req: NextRequest) {
  const { response } = requireApiRole(req, ["ADMIN"]);

  if (response) return response;

  const body = await req.json();

  const nombre = String(body.nombre || "").trim();
  const username = String(body.username || "").trim();

  if (!nombre || !username) {
    return NextResponse.json(
      { error: "Nombre y usuario son obligatorios." },
      { status: 400 }
    );
  }

  const passwordPlano = body.password || "Savia1234!";

  const usuario = await prisma.usuario.create({
    data: {
      nombre,
      apellidos: body.apellidos || null,
      username,
      email: body.email || null,
      password: await bcrypt.hash(passwordPlano, 10),
      rol: body.rol || "TUTOR",
      activo: body.activo ?? true,
      fotoUrl: body.fotoUrl || null,
      claseId: body.claseId ? Number(body.claseId) : null,
      empresaId: body.empresaId ? Number(body.empresaId) : null,
      alumnoId: body.alumnoId ? Number(body.alumnoId) : null,
      debeCambiarPassword: true,
    },
    include: {
      clase: true,
      empresa: true,
      alumno: true,
    },
  });

  const { password, ...safeUser } = usuario;

  return NextResponse.json(safeUser, { status: 201 });
}