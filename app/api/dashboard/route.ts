import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      empresas,
      empresasActivas,
      alumnos,
      alumnosAptos,
      conveniosVigentes,
      asignacionesEnCurso,
      seguimientosConIncidencia,
    ] = await Promise.all([
      prisma.empresa.count(),
      prisma.empresa.count({ where: { estado: "ACTIVA" } }),
      prisma.alumno.count(),
      prisma.alumno.count({ where: { aptoFfe: true } }),
      prisma.convenio.count({ where: { estado: "VIGENTE" } }),
      prisma.asignacion.count({ where: { estado: "EN_CURSO" } }),
      prisma.seguimiento.count({
        where: { resultado: { in: ["INCIDENCIA", "REQUIERE_ACCION"] } },
      }),
    ]);

    const proximosConvenios = await prisma.convenio.findMany({
      take: 5,
      orderBy: { fechaFin: "asc" },
      include: { empresa: true },
    });

    return NextResponse.json({
      empresas,
      empresasActivas,
      alumnos,
      alumnosAptos,
      conveniosVigentes,
      asignacionesEnCurso,
      seguimientosConIncidencia,
      proximosConvenios,
    });
  } catch (error) {
    console.error("ERROR DASHBOARD:", error);

    return NextResponse.json(
      {
        error: "Error cargando dashboard",
        detail: String(error),
      },
      { status: 500 }
    );
  }
}