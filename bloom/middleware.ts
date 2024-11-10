export const runtime = 'experimental-edge'
export { auth as middleware } from "@/auth";
export const config = {
  //matcher: "/(^api(?!\\/auth).*$)" // Match all routes except /api/auth
  matcher: [
    "/api/dataset/:path*",
    "/api/projects",
    "/api/projects/:path*",
    "/api/clases",
    "/api/clases/:path*",
    "/api/export",
    "/api/export/:path*",
    "/dashboard",
    "/proyecto",
    "/proyecto/:path*",
    "/classes",
    "/classes/:path*",
  ]
}