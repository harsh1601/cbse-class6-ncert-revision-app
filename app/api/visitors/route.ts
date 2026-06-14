import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

type VisitorRequest = {
  sessionId?: string;
  visitorName?: string;
};

const sessionIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function sanitizeVisitorName(value: unknown) {
  if (typeof value !== "string") {
    return "Student";
  }

  return value.replace(/\s+/g, " ").trim().slice(0, 80) || "Student";
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const vercelIp = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();

  return forwardedFor || vercelIp || realIp || null;
}

async function getVisitorCount() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return { configured: false, visitorCount: null as number | null };
  }

  const { count, error } = await supabase.from("visitor_audit").select("id", { count: "exact", head: true });

  if (error) {
    console.error("Visitor count failed", error);
    return { configured: true, visitorCount: null as number | null };
  }

  return { configured: true, visitorCount: count ?? 0 };
}

export async function GET() {
  const countResult = await getVisitorCount();

  return NextResponse.json(countResult, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(request: Request) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json(
      { configured: false, visitorCount: null },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  let body: VisitorRequest = {};

  try {
    body = (await request.json()) as VisitorRequest;
  } catch {
    body = {};
  }

  const sessionId = typeof body.sessionId === "string" && sessionIdPattern.test(body.sessionId) ? body.sessionId : crypto.randomUUID();
  const visitorName = sanitizeVisitorName(body.visitorName);
  const ipAddress = getClientIp(request);

  const { error } = await supabase.from("visitor_audit").insert({
    session_id: sessionId,
    visitor_name: visitorName,
    ip_address: ipAddress,
  });

  if (error) {
    console.error("Visitor audit insert failed", error);
    return NextResponse.json(
      { configured: true, visitorCount: null },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }

  const countResult = await getVisitorCount();

  return NextResponse.json(countResult, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
