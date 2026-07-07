import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const protectedRoutes = [
  "/admin",
  "/college-admin",
  "/dashboard",
  "/profile",
  "/supervisor",
];

function isProtectedRoute(pathname: string) {
  return protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function redirectWithSupabaseCookies(
  request: NextRequest,
  supabaseResponse: NextResponse,
  pathname: string,
) {
  const redirectResponse = NextResponse.redirect(
    new URL(pathname, request.url),
  );

  supabaseResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });

  return redirectResponse;
}

export async function updateSession(request: NextRequest) {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/login";

  // Redirect unauthenticated users
  if (!user && isProtectedRoute(pathname)) {
    return redirectWithSupabaseCookies(request, supabaseResponse, "/login");
  }

  // Redirect logged-in users away from the login form only.
  if (user && isLoginPage) {
    if (user?.role !== "super_admin") {
      return redirectWithSupabaseCookies(
        request,
        supabaseResponse,
        "/dashboard",
      );
    } else if (user?.role === "super_admin") {
      return redirectWithSupabaseCookies(request, supabaseResponse, "/admin");
    }
  }

  return supabaseResponse;
}
