import crypto from "crypto";

export type SessionUser = {
  id: number;
  nombre: string;
  username: string;
  rol: string;
};

const COOKIE_NAME = "savia_session";

function getSecret() {
  return process.env.AUTH_SECRET || "dev-secret";
}

function signPayload(payload: string) {
  return crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");
}

export function createSessionToken(user: SessionUser) {
  const payload = Buffer.from(JSON.stringify(user)).toString("base64url");
  const signature = signPayload(payload);

  return `${payload}.${signature}`;
}

export function verifySessionToken(token?: string): SessionUser | null {
  if (!token) return null;

  const [payload, signature] = token.split(".");

  if (!payload || !signature) return null;

  const expectedSignature = signPayload(payload);

  if (signature !== expectedSignature) return null;

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export { COOKIE_NAME };

import { NextRequest, NextResponse } from "next/server";

export function getUserFromRequest(req: NextRequest) {
  const token = req.cookies.get("savia_session")?.value;
  return verifySessionToken(token);
}

export function requireApiUser(req: NextRequest) {
  const user = getUserFromRequest(req);

  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        { error: "No autenticado." },
        { status: 401 }
      ),
    };
  }

  return {
    user,
    response: null,
  };
}

export function requireApiRole(req: NextRequest, roles: string[]) {
  const { user, response } = requireApiUser(req);

  if (response || !user) {
    return {
      user: null,
      response,
    };
  }

  if (!roles.includes(user.rol)) {
    return {
      user,
      response: NextResponse.json(
        { error: "No tienes permisos para realizar esta acción." },
        { status: 403 }
      ),
    };
  }

  return {
    user,
    response: null,
  };
}