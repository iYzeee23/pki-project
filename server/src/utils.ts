import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { LngLat, LOCATION_CACHE_SERVER } from "@app/shared";

declare global {
  namespace Express {
    interface Request {
      auth?: { userId: string; isAdmin: boolean };
    }
  }
}

type ErrorLike = { status?: number; message?: string; details?: unknown };

export const errorHandler = 
    (err: unknown, _req: Request, res: Response, _next: NextFunction) =>
    {
        const e = err as ErrorLike;
        const status = typeof e.status === "number" ? e.status : 500;
        const message = e.message ?? "Unexpected error";
        const details = e.details ?? undefined;
        res.status(status).json({ error: message, details: details });
    }

export const asyncHandler =
    (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
    (req: Request, res: Response, next: NextFunction) => Promise.resolve(fn(req, res, next)).catch(next);

export class HttpError extends Error {
    readonly status: number;
    readonly details: unknown;

    constructor(status?: number, message?: string, details?: unknown) {
        super(message ?? "Unexpected error");
        this.status = typeof status === "number" ? status : 500;
        this.details = details ?? undefined;
    }
}

type JwtPayload = { userId: string; isAdmin: boolean };

export function signToken(userId: string, isAdmin: boolean): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("Missing JWT_SECRET");

    const payload: JwtPayload = { userId, isAdmin };
    return jwt.sign(payload, secret, { expiresIn: "1d" });
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
    try {
        const auth = req.headers.authorization;
        if (!auth?.startsWith("Bearer ")) throw new HttpError(401, "Missing Bearer token");

        const token = auth.slice("Bearer ".length);
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error("Missing JWT_SECRET");

        const decoded = jwt.verify(token, secret) as JwtPayload;
        req.auth = { userId: decoded.userId, isAdmin: decoded.isAdmin };
        next();
    }
    catch (e) {
        next(new HttpError(401, "Invalid token"));
    }
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void  {
    if (!req.auth) return next(new HttpError(401, "Not authenticated"));
    if (!req.auth.isAdmin) return next(new HttpError(403, "Admin only"));
    next();
}

export async function hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
}
export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
}

export const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/reverse";
export const NOMINATIM_QUERY_PARAMS = "format=jsonv2&zoom=18&addressdetails=1";

export function toAcceptLanguage(uiLang: string): string {
  const lang = uiLang.toLowerCase();
  
  if (lang.startsWith("en")) return "en;q=1.0,sr-Latn;q=0.8,sr;q=0.7";
  if (lang.startsWith("sr")) return "sr-Latn;q=1.0,sr;q=0.9,en;q=0.7";

  return "";
}

export function extractAddressName(address: any) {
    const postcode = address.postcode;
    const road =
        address.road ||
        address.pedestrian ||
        address.footway ||
        address.cycleway ||
        address.path ||
        address.residential ||
        address.street;

    const extracted = road ? `${road} [${postcode}]` : "Unknown location";
    return extracted;
}
