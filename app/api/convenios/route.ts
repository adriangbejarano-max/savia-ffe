import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const convenios = await prisma.convenio.findMany({
    orderBy: {
      fechaFin: "asc",
    },
    include: {
      empresa: true,
    },
  });

  return NextResponse.json(convenios);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const convenio = await prisma.convenio.create({
    data: {
      empresaId: Number(body.empresaId),
      titulo: body.titulo,
      fechaInicio: new Date(body.fechaInicio),
      fechaFin: new Date(body.fechaFin),
      estado: body.estado || "BORRADOR",
      documentoUrl: body.documentoUrl || null,
      observaciones: body.observaciones || null,
    },
  });

  return NextResponse.json(convenio, { status: 201 });
}