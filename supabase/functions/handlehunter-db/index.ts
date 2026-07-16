import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}

function safeEqual(left: string, right: string) {
  if (!left || left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return response({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!supabaseUrl || !serviceRoleKey) {
    return response({ error: "Server configuration error" }, 500);
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const presentedKey = request.headers.get("x-handlehunter-key")?.trim() ?? "";
  const { data: config, error: configError } = await admin
    .from("app_config")
    .select("value")
    .eq("key", "handlehunter_internal_key")
    .maybeSingle();

  if (
    configError ||
    typeof config?.value !== "string" ||
    !safeEqual(presentedKey, config.value)
  ) {
    return response({ error: "Unauthorized" }, 401);
  }

  let input: { action?: string; payload?: Record<string, unknown> };
  try {
    input = await request.json();
  } catch {
    return response({ error: "Invalid JSON" }, 400);
  }

  const payload = input.payload ?? {};

  if (input.action === "create_search") {
    const brandName = typeof payload.brand_name === "string"
      ? payload.brand_name.trim().slice(0, 200)
      : "";
    if (!brandName) return response({ error: "brand_name is required" }, 400);

    const { data, error } = await admin
      .from("searches")
      .insert({
        brand_name: brandName,
        domains_checked: Array.isArray(payload.domains_checked)
          ? payload.domains_checked.slice(0, 20)
          : [],
        socials_checked: Array.isArray(payload.socials_checked)
          ? payload.socials_checked.slice(0, 20)
          : [],
        results: Array.isArray(payload.results)
          ? payload.results.slice(0, 1000)
          : [],
      })
      .select("id")
      .single();

    if (error) return response({ error: "Could not save search" }, 500);
    return response({ id: data.id });
  }

  if (input.action === "create_order") {
    const stripeSessionId = typeof payload.stripe_session_id === "string"
      ? payload.stripe_session_id
      : "";
    const customerEmail = typeof payload.customer_email === "string"
      ? payload.customer_email
      : "";
    const tier = typeof payload.tier === "string" ? payload.tier : "";
    if (!stripeSessionId || !customerEmail || !["audit", "concierge", "premium"].includes(tier)) {
      return response({ error: "Invalid order payload" }, 400);
    }

    const { data, error } = await admin
      .from("orders")
      .upsert(
        {
          search_id: typeof payload.search_id === "string" ? payload.search_id : null,
          stripe_session_id: stripeSessionId,
          stripe_payment_id: typeof payload.stripe_payment_id === "string"
            ? payload.stripe_payment_id
            : null,
          customer_email: customerEmail,
          tier,
          selected_items: Array.isArray(payload.selected_items)
            ? payload.selected_items.slice(0, 100)
            : [],
          preferred_email: typeof payload.preferred_email === "string"
            ? payload.preferred_email
            : null,
          email_type: ["existing", "new_gmail"].includes(String(payload.email_type))
            ? payload.email_type
            : null,
          intake_notes: typeof payload.intake_notes === "string"
            ? payload.intake_notes.slice(0, 5000)
            : null,
          amount_cents: typeof payload.amount_cents === "number" && Number.isInteger(payload.amount_cents)
            ? payload.amount_cents
            : 0,
          status: "paid",
          webhook_sent: false,
        },
        { onConflict: "stripe_session_id" },
      )
      .select("id")
      .single();

    if (error) return response({ error: "Could not save order" }, 500);
    return response({ id: data.id });
  }

  if (input.action === "mark_webhook_sent") {
    const orderId = typeof payload.order_id === "string" ? payload.order_id : "";
    if (!orderId) return response({ error: "order_id is required" }, 400);

    const { error } = await admin
      .from("orders")
      .update({
        webhook_sent: true,
        webhook_sent_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (error) return response({ error: "Could not update order" }, 500);
    return response({ ok: true });
  }

  return response({ error: "Unknown action" }, 400);
});
