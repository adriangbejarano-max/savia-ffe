import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireApiRole } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = requireApiRole(req, ["ADMIN"]);

  if (response) return response;

  const { id } = await params;
  const body = await req.json();

  const data: {
    nombre?: string;
    apellidos?: string | null;
    username?: string;
    email?: string | null;
    rol?: string;
    activo?: boolean;
    fotoUrl?: string | null;
    claseId?: number | null;
    empresaId?: number | null;
    alumnoId?: number | null;
    password?: string;
    debeCambiarPassword?: boolean;
  } = {
    nombre: body.nombre,
    apellidos: body.apellidos || null,
    username: body.username,
    email: body.email || null,
    rol: body.rol,
    activo: body.activo ?? true,
    fotoUrl: body.fotoUrl || null,
    claseId: body.claseId ? Number(body.claseId) : null,
    empresaId: body.empresaId ? Number(body.empresaId) : null,
    alumnoId: body.alumnoId ? Number(body.alumnoId) : null,
  };

  if (body.password) {
    data.password = await bcrypt.hash(String(body.password), 10);
    data.debeCambiarPassword = true;
  }

  const usuario = await prisma.usuario.update({
    where: {
      id: Number(id),
    },
    data,
    include: {
      clase: true,
      empresa: true,
      alumno: true,
    },
  });

  const { password, ...safeUser } = usuario;

  return NextResponse.json(safeUser);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = requireApiRole(req, ["ADMIN"]);

  if (response) return response;

  const { id } = await params;

  await prisma.usuario.delete({
    where: {
      id: Number(id),
    },
  });

  return NextResponse.json({
    ok: true,
  });
}