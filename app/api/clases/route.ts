import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { response } = requireApiRole(req, ["ADMIN", "COORDINADOR", "TUTOR"]);

  if (response) return response;

  const clases = await prisma.clase.findMany({
    orderBy: {
      nombre: "asc",
    },
  });

  return NextResponse.json(clases);
}

export async function POST(req: NextRequest) {
  const { response } = requireApiRole(req, ["ADMIN"]);

  if (response) return response;

  const body = await req.json();

  const nombre = String(body.nombre || "").trim();

  if (!nombre) {
    return NextResponse.json(
      { error: "El nombre de la clase es obligatorio." },
      { status: 400 }
    );
  }

  const clase = await prisma.clase.create({
    data: {
      nombre,
      etapa: body.etapa || null,
      ciclo: body.ciclo || null,
      activa: body.activa ?? true,
    },
  });

  return NextResponse.json(clase, { status: 201 });
}