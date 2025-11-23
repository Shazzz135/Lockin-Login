import { jwtDecode } from "jwt-decode";

export function routeGuard(token: string | null): boolean {
  if (!token) return false;
  try {
    const decoded: any = jwtDecode(token);
    if (!decoded || !decoded.exp) return false;
    // exp is in seconds since epoch
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp > now;
  } catch {
    return false;
  }
}
