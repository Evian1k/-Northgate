/**
 * Password hashing & verification utilities.
 * Uses bcryptjs with cost factor 12.
 */
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function isPasswordStrong(p: string): boolean {
  // Min 8 chars, at least 1 upper, 1 lower, 1 digit, 1 symbol
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(p);
}
