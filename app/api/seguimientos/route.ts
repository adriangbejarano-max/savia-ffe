import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const seguimientos = await prisma.seguimiento.findMany({
    orderBy: {
      fecha: "desc",
    },
    include: {
      asignacion: {
        include: {
          alumno: true,
          empresa: true,
        },
      },
    },
  });

  return NextResponse.json(seguimientos);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const seguimiento = await prisma.seguimiento.create({
    data: {
      asignacionId: Number(body.asignacionId),
      fecha: new Date(body.fecha),
      horas: Number(body.horas || 0),
      resumen: body.resumen,
      incidencia: body.incidencia || null,
      resultado: body.resultado || "CORRECTO",
    },
    include: {
      asignacion: {
        include: {
          alumno: true,
          empresa: true,
        },
      },
    },
  });

  await prisma.asignacion.update({
    where: {
      id: Number(body.asignacionId),
    },
    data: {
      horasRealizadas: {
        increment: Number(body.horas || 0),
      },
    },
  });

  return NextResponse.json(seguimiento, { status: 201 });
}