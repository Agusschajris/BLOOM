export { auth as middleware } from "./auth";
export const config = {
  //matcher: "/(^api(?!\\/auth).*$)" // Match all routes except /api/auth
  matcher: [
    "/api/dataset/:path*",
    "/api/projects",
    "/api/projects/:path*",
    "/dashboard",
    "/proyecto",
    "/proyecto/:path*",
  ]
}