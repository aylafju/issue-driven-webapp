import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Refresht die Supabase-Session bei jedem Request. Server Components können
// selbst keine Cookies setzen (siehe server.ts) – ohne diesen Middleware-
// Aufruf würden abgelaufene Sessions dort nicht erneuert.
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // getUser() validiert den Token beim Supabase-Server und refresht ihn bei
  // Bedarf – notwendig, damit Server Components eine gültige Session sehen.
  await supabase.auth.getUser();

  return supabaseResponse;
}
