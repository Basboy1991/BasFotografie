import type { APIRoute } from "astro";

export const prerender = false;

const MAX_FIELD_LENGTH = 2_000;
const REQUIRED_FIELDS = ["naam", "email", "shootsoort", "bericht"] as const;
const FIELD_NAMES = ["naam", "email", "telefoon", "shootsoort", "pakket", "voorkeursdatum", "locatie", "aantal", "bericht", "privacy", "bot-field"] as const;

export const POST: APIRoute = async ({ request }) => {
  const fields = await getFields(request);
  if (fields["bot-field"]) return redirect(request, "/bedankt/");

  const hasRequiredFields = REQUIRED_FIELDS.every((field) => Boolean(fields[field]));
  if (!hasRequiredFields || fields.privacy !== "on" || !isValidEmail(fields.email)) {
    return redirect(request, "/contact/?status=error");
  }

  const resendApiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.CONTACT_EMAIL_TO;
  const from = import.meta.env.CONTACT_EMAIL_FROM;
  if (!resendApiKey || !to || !from) {
    console.error("Contact form is missing its email configuration.");
    return redirect(request, "/contact/?status=error");
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: fields.email,
        subject: `Nieuwe shootaanvraag van ${fields.naam}`,
        text: formatMessage(fields),
      }),
    });
    if (!response.ok) {
      console.error("Contact form email delivery failed.", response.status);
      return redirect(request, "/contact/?status=error");
    }
  } catch (error) {
    console.error("Contact form email delivery could not be started.", error);
    return redirect(request, "/contact/?status=error");
  }
  return redirect(request, "/bedankt/");
};

async function getFields(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  const source: Record<string, unknown> = contentType.includes("application/json")
    ? await request.json()
    : Object.fromEntries(await request.formData());
  return Object.fromEntries(
    FIELD_NAMES.map((key) => [key, typeof source[key] === "string" ? source[key].trim().slice(0, MAX_FIELD_LENGTH) : ""]),
  ) as Record<(typeof FIELD_NAMES)[number], string>;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatMessage(fields: Record<string, string>) {
  const labels: Record<string, string> = {
    naam: "Naam", email: "E-mail", telefoon: "Telefoon", shootsoort: "Shootsoort",
    pakket: "Pakket", voorkeursdatum: "Voorkeursdatum", locatie: "Locatie of plaats",
    aantal: "Aantal personen/dieren", bericht: "Bericht",
  };
  return Object.entries(labels)
    .map(([key, label]) => `${label}: ${fields[key] || "Niet ingevuld"}`)
    .join("\n\n");
}

function redirect(request: Request, path: string) {
  return Response.redirect(new URL(path, request.url), 303);
}
