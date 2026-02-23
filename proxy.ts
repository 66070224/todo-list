import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const proxy = auth((req) => {
  if (!req.auth) {
    const Url = new URL("/", req.nextUrl.origin);
    return NextResponse.redirect(Url);
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard",
    "/tasks",
    "/api/tasks",
    "/api/tasks/:path*",
    "/api/users",
  ],
};
