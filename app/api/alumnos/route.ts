import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const alumnos = await prisma.alumno.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });

  return NextResponse.json(alumnos);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const alumno = await prisma.alumno.create({
    data: {
      nombre: body.nombre,
      apellidos: body.apellidos,
      email: body.email || null,
      telefono: body.telefono || null,
      ciclo: body.ciclo,
      curso: body.curso,
      prlSuperada: Boolean(body.prlSuperada),
      aptoFfe: Boolean(body.aptoFfe),
      preferencias: body.preferencias || null,
      observaciones: body.observaciones || null,
    },
  });

  return NextResponse.json(alumno, { status: 201 });
}