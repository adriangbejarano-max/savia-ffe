import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const empresas = await prisma.empresa.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });

  return NextResponse.json(empresas);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const empresa = await prisma.empresa.create({
    data: {
      nombre: body.nombre,
      cif: body.cif || null,
      sector: body.sector,
      municipio: body.municipio,
      direccion: body.direccion || null,
      web: body.web || null,
      telefono: body.telefono || null,
      email: body.email || null,
      contactoNombre: body.contactoNombre || null,
      contactoCargo: body.contactoCargo || null,
      ciclosAceptados: body.ciclosAceptados,
      plazas: Number(body.plazas || 0),
      modalidad: body.modalidad || "General",
      estado: body.estado || "PROSPECTO",
      valoracion: Number(body.valoracion || 3),
      observaciones: body.observaciones || null,
    },
  });

  return NextResponse.json(empresa, { status: 201 });
}