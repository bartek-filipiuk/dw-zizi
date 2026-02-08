import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-me"
);

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export async function createAccessToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

export async function createRefreshToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({ ...payload, type: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export async function setAuthCookies(payload: TokenPayload) {
  const cookieStore = await cookies();
  const accessToken = await createAccessToken(payload);
  const refreshToken = await createRefreshToken(payload);

  cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60,
  });

  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}

export async function getAuthFromCookies(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (accessToken) {
    const payload = await verifyToken(accessToken);
    if (payload) return payload;
  }

  const refreshToken = cookieStore.get("refresh_token")?.value;
  if (refreshToken) {
    const payload = await verifyToken(refreshToken);
    if (payload && (payload as TokenPayload & { type?: string }).type !== "refresh") {
      return null;
    }
    if (payload) {
      const newPayload: TokenPayload = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };
      await setAuthCookies(newPayload);
      return newPayload;
    }
  }

  return null;
}

export async function getAuthFromRequest(
  request: NextRequest
): Promise<TokenPayload | null> {
  const accessToken = request.cookies.get("access_token")?.value;

  if (accessToken) {
    const payload = await verifyToken(accessToken);
    if (payload) return payload;
  }

  const refreshToken = request.cookies.get("refresh_token")?.value;
  if (refreshToken) {
    const payload = await verifyToken(refreshToken);
    if (payload) return payload;
  }

  return null;
}
