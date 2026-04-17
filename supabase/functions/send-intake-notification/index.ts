import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const PATH_LABELS: Record<string, string> = {
  artist: "Artist Inquiry",
  label: "Label Inquiry",
  catalog: "Catalog Inquiry",
  brand: "Brand Inquiry",
  scout: "Scout Inquiry",
  ai: "AI Platform Inquiry",
};

const FIELD_LABELS: Record<string, string> = {
  full_name: "Full Name",
  email: "Email",
  company_name: "Company / Project Name",
  website: "Website / Social Link",
  artist_name: "Artist Name",
  primary_genre: "Primary Genre",
  current_stage: "Current Stage",
  support_needed: "Support Needed",
  label_name: "Label Name",
  roster_size: "Roster Size",
  distribution_setup: "Distribution Setup",
  growth_priorities: "Growth Priorities",
  catalog_name: "Catalog Name",
  catalog_size: "Catalog Size",
  rights_situation: "Rights Situation",
  unlock_goals: "Unlock Goals",
  brand_company: "Brand / Company",
  partnership_type: "Partnership Type",
  campaign_timeline: "Campaign Timeline",
  budget_range: "Budget Range",
  scout_role: "Role",
  scout_organization: "Organization",
  area_of_focus: "Area of Focus",
  work_interest: "How They Want to Work",
  platform_name: "Platform Name",
  product_category: "Product Category",
  user_base: "User Base / Stage",
  partnership_need: "Partnership Need",
  looking_for: "Main Goal",
  message: "Message",
  selected_path: "Selected Path",
};

const FIELD_ORDER = [
  "full_name", "email", "company_name", "website",
  "artist_name", "primary_genre", "current_stage", "support_needed",
  "label_name", "roster_size", "distribution_setup", "growth_priorities",
  "catalog_name", "catalog_size", "rights_situation", "unlock_goals",
  "brand_company", "partnership_type", "campaign_timeline", "budget_range",
  "scout_role", "scout_organization", "area_of_focus", "work_interest",
  "platform_name", "product_category", "user_base", "partnership_need",
  "looking_for", "message",
];

function buildEmailHtml(body: Record<string, string | null>, pathLabel: string): string {
  const rows = FIELD_ORDER
    .filter((key) => body[key])
    .map((key) => {
      const label = FIELD_LABELS[key] || key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      const val = String(body[key]).replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return `<tr>
        <td style="padding:10px 16px;color:#9FA1A6;font-size:12px;white-space:nowrap;vertical-align:top;border-bottom:1px solid rgba(255,255,255,0.04);">${label}</td>
        <td style="padding:10px 16px;color:#F5F5F7;font-size:13px;vertical-align:top;border-bottom:1px solid rgba(255,255,255,0.04);">${val}</td>
      </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="background:#0B0B0D;margin:0;padding:0;font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <div style="margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.06);">
      <p style="color:#9FA1A6;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;margin:0 0 10px 0;">Greater Music Group</p>
      <h1 style="color:#F5F5F7;font-size:20px;font-weight:700;margin:0 0 8px 0;">New Intake Submission</h1>
      <div style="display:inline-block;padding:4px 12px;background:rgba(20,20,30,0.8);border:1px solid rgba(255,255,255,0.1);border-radius:20px;">
        <span style="color:#E5E5E7;font-size:11px;font-weight:600;letter-spacing:0.08em;">${pathLabel}</span>
      </div>
    </div>
    <table style="width:100%;border-collapse:collapse;background:#15161A;border:1px solid rgba(255,255,255,0.06);border-radius:12px;overflow:hidden;">
      ${rows}
    </table>
    <p style="color:rgba(159,161,166,0.5);font-size:11px;margin-top:24px;text-align:center;">
      Submitted via greatermusicgroup.com &mdash; Reply directly to this email to respond to the inquiry.
    </p>
  </div>
</body>
</html>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body: Record<string, string | null> = await req.json();
    console.log("Request body:", JSON.stringify(body));

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      console.error("process.env.RESEND_API_KEY is undefined — email not sent.");
      return new Response(
        JSON.stringify({ success: false, error: "Email service not configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("RESEND_API_KEY exists:", true);

    const pathLabel = PATH_LABELS[body.selected_path as string] || body.selected_path || "Unknown";
    const submitterEmail = body.email || null;
    const subject = `New GMG Inquiry – ${pathLabel}`;
    const html = buildEmailHtml(body, pathLabel);

    const emailPayload: Record<string, unknown> = {
      from: "GMG Intake <intake@greatermusicgroup.com>",
      to: ["hq@greatermusicgroup.com", "greatermusicgrouphq@gmail.com"],
      subject,
      html,
    };

    if (submitterEmail) {
      emailPayload.reply_to = [submitterEmail];
    }

    console.log("Sending to Resend:", JSON.stringify({ ...emailPayload, html: "[omitted]" }));

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    const responseText = await res.text();
    console.log("Resend response status:", res.status);
    console.log("Resend response body:", responseText);

    if (!res.ok) {
      return new Response(
        JSON.stringify({ success: false, error: `Resend error ${res.status}: ${responseText}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Edge function error:", message);
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
