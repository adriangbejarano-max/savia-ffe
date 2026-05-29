import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const asignaciones = await prisma.asignacion.findMany({
    orderBy: {
      fechaInicio: "desc",
    },
    include: {
      alumno: true,
      empresa: true,
    },
  });

  return NextResponse.json(asignaciones);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const asignacion = await prisma.asignacion.create({
    data: {
      alumnoId: Number(body.alumnoId),
      empresaId: Number(body.empresaId),
      fechaInicio: new Date(body.fechaInicio),
      fechaFin: new Date(body.fechaFin),
      horasPrevistas: Number(body.horasPrevistas || 500),
      horasRealizadas: Number(body.horasRealizadas || 0),
      tutorCentro: body.tutorCentro,
      tutorEmpresa: body.tutorEmpresa || null,
      estado: body.estado || "PROPUESTA",
      planFormacion: body.planFormacion || null,
      observaciones: body.observaciones || null,
    },
    include: {
      alumno: true,
      empresa: true,
    },
  });

  return NextResponse.json(asignacion, { status: 201 });
}