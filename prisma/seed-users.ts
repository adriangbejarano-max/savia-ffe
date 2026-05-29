import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      nombre: "Administrador SAVIA",
      username: "admin",
      password: "admin123",
      rol: "ADMIN",
    },
    {
      nombre: "Coordinador FFE",
      username: "coordinador",
      password: "coord123",
      rol: "COORDINADOR",
    },
    {
      nombre: "Tutor Centro",
      username: "tutor",
      password: "tutor123",
      rol: "TUTOR",
    },
    {
      nombre: "Empresa Colaboradora",
      username: "empresa",
      password: "empresa123",
      rol: "EMPRESA",
    },
    {
      nombre: "Alumno Demo",
      username: "alumno",
      password: "alumno123",
      rol: "ALUMNO",
    },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.  usuario.upsert({
      where: {
        username: user.username,
      },
      update: {
        nombre: user.nombre,
        password: hashedPassword,
        rol: user.rol,
        activo: true,
      },
      create: {
        nombre: user.nombre,
        username: user.username,
        password: hashedPassword,
        rol: user.rol,
        activo: true,
      },
    });
  }

  console.log("Usuarios creados correctamente");
  console.table(
    users.map((user) => ({
      usuario: user.username,
      contraseña: user.password,
      rol: user.rol,
    }))
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
