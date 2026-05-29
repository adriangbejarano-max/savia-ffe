import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.seguimiento.deleteMany();
  await prisma.asignacion.deleteMany();
  await prisma.convenio.deleteMany();
  await prisma.alumno.deleteMany();
  await prisma.empresa.deleteMany();

  const empresa1 = await prisma.empresa.create({
    data: {
      nombre: "TechSoluciones Madrid",
      cif: "B12345678",
      sector: "Desarrollo software",
      municipio: "Madrid",
      direccion: "Calle Alcalá 120",
      web: "https://example.com",
      telefono: "910000001",
      email: "rrhh@techsoluciones.example",
      contactoNombre: "Laura Martín",
      contactoCargo: "Responsable RRHH",
      ciclosAceptados: "DAW, DAM, ASIR",
      plazas: 4,
      modalidad: "General",
      estado: "ACTIVA",
      valoracion: 5,
      observaciones: "Buena empresa para perfiles web y backend.",
    },
  });

  const empresa2 = await prisma.empresa.create({
    data: {
      nombre: "DataCloud Consultores",
      cif: "B87654321",
      sector: "Cloud y datos",
      municipio: "Alcobendas",
      telefono: "910000002",
      email: "formacion@datacloud.example",
      contactoNombre: "Miguel Ruiz",
      contactoCargo: "Tutor empresa",
      ciclosAceptados: "ASIR, DAM",
      plazas: 2,
      modalidad: "Intensiva",
      estado: "INTERESADA",
      valoracion: 4,
    },
  });

  const alumno1 = await prisma.alumno.create({
    data: {
      nombre: "Nora",
      apellidos: "García López",
      email: "nora.garcia@example.com",
      ciclo: "DAW",
      curso: "2º",
      prlSuperada: true,
      aptoFfe: true,
      preferencias: "Frontend, UX, React",
    },
  });

  const alumno2 = await prisma.alumno.create({
    data: {
      nombre: "Sergio",
      apellidos: "Pérez Cano",
      email: "sergio.perez@example.com",
      ciclo: "ASIR",
      curso: "2º",
      prlSuperada: true,
      aptoFfe: true,
      preferencias: "Sistemas, cloud, redes",
    },
  });

  await prisma.convenio.create({
    data: {
      empresaId: empresa1.id,
      titulo: "Convenio FFE 2025-2026",
      fechaInicio: new Date("2025-09-01"),
      fechaFin: new Date("2026-08-31"),
      estado: "VIGENTE",
      observaciones: "Convenio marco para alumnado de informática.",
    },
  });

  const asignacion = await prisma.asignacion.create({
    data: {
      alumnoId: alumno1.id,
      empresaId: empresa1.id,
      fechaInicio: new Date("2026-03-15"),
      fechaFin: new Date("2026-06-15"),
      horasPrevistas: 500,
      horasRealizadas: 80,
      tutorCentro: "María Sánchez",
      tutorEmpresa: "Laura Martín",
      estado: "EN_CURSO",
      planFormacion:
        "Desarrollo de componentes React, pruebas, documentación y revisión de código.",
    },
  });

  await prisma.asignacion.create({
    data: {
      alumnoId: alumno2.id,
      empresaId: empresa2.id,
      fechaInicio: new Date("2026-03-15"),
      fechaFin: new Date("2026-06-15"),
      horasPrevistas: 500,
      horasRealizadas: 0,
      tutorCentro: "Javier Torres",
      tutorEmpresa: "Miguel Ruiz",
      estado: "PROPUESTA",
      planFormacion:
        "Administración de sistemas Linux, despliegues cloud y monitorización.",
    },
  });

  await prisma.seguimiento.create({
    data: {
      asignacionId: asignacion.id,
      fecha: new Date("2026-04-10"),
      horas: 40,
      resumen:
        "La alumna se integra bien en el equipo y avanza en tareas de frontend.",
      resultado: "CORRECTO",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Datos de ejemplo creados correctamente");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });