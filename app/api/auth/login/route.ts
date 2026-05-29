import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, createSessionToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const username = String(body.username || "").trim();
  const password = String(body.password || "");

  if (!username || !password) {
    return NextResponse.json(
      {
        error: "Introduce usuario y contraseña.",
      },
      { status: 400 }
    );
  }

  const user = await prisma.usuario.findUnique({
    where: {
      username,
    },
  });

  if (!user || !user.activo) {
    return NextResponse.json(
      {
        error: "Usuario o contraseña incorrectos.",
      },
      { status: 401 }
    );
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return NextResponse.json(
      {
        error: "Usuario o contraseña incorrectos.",
      },
      { status: 401 }
    );
  }

  const token = createSessionToken({
    id: user.id,
    nombre: user.nombre,
    username: user.username,
    rol: user.rol,
  });

  const response = NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      nombre: user.nombre,
      username: user.username,
      rol: user.rol,
    },
  });

  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}