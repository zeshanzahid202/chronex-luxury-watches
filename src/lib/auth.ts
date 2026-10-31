import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const cookieName = "chronex_session";
function key() { const secret = process.env.AUTH_SECRET; if (!secret || secret.length < 32) throw new Error("AUTH_SECRET must contain at least 32 characters."); return new TextEncoder().encode(secret); }
export type SessionUser = { id: string; email: string; name: string; role: "customer" | "admin" };

export async function createSession(user: SessionUser) {
  const token = await new SignJWT(user).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(key());
  (await cookies()).set(cookieName, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
}
export async function getSession(): Promise<SessionUser | null> {
  const token = (await cookies()).get(cookieName)?.value; if (!token) return null;
  try { const { payload } = await jwtVerify(token, key()); return payload as unknown as SessionUser; } catch { return null; }
}
export async function clearSession() { (await cookies()).delete(cookieName); }
