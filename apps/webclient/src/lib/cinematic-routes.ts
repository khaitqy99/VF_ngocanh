/** Routes that start with a full-bleed dark / cinematic hero under the header. */
export function isCinematicHeroRoute(pathname: string): boolean {
  if (pathname === "/") return true;

  const exact = [
    "/oto",
    "/xe-may-dien",
    "/phu-kien",
    "/pin-va-tram-sac",
    "/dich-vu-hau-mai",
    "/gioi-thieu",
    "/luu-tru-nang-luong",
  ];
  if (exact.includes(pathname)) return true;

  if (pathname.endsWith("/preview")) return false;

  return /^\/(oto|xe-may-dien|phu-kien)\/[^/]+$/.test(pathname);
}
