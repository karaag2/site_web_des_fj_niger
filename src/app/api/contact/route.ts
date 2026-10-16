import { headers } from "next/headers";

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  subject?: unknown;
  message?: unknown;
  honeypot?: unknown; // anti-spam field
}

// Simple email regex for robust RFC-compatible validation
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export async function POST(request: Request) {
  try {
    const rawBody: ContactPayload = await request.json().catch(() => ({}));

    // 1. Anti-bot honeypot check (silent discard for bots)
    if (typeof rawBody.honeypot === "string" && rawBody.honeypot.trim().length > 0) {
      console.warn("[Contact API] Bot honeypot triggered. Silently discarded.");
      return Response.json(
        { success: true, message: "Votre message a été transmis avec succès." },
        { status: 200 }
      );
    }

    const { name, email, subject, message } = rawBody;
    const errors: Record<string, string> = {};

    // 2. Validate "name"
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      errors.name = "Le nom doit comporter au moins 2 caractères.";
    } else if (name.trim().length > 100) {
      errors.name = "Le nom ne peut pas dépasser 100 caractères.";
    }

    // 3. Validate "email"
    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      errors.email = "Veuillez fournir une adresse email valide.";
    } else if (email.trim().length > 255) {
      errors.email = "L'adresse email est trop longue (255 caractères maximum).";
    }

    // 4. Validate "subject" (optional, with fallback)
    let sanitizedSubject = "Demande de contact générale";
    if (subject && typeof subject === "string" && subject.trim().length > 0) {
      if (subject.trim().length > 200) {
        errors.subject = "Le sujet ne peut pas dépasser 200 caractères.";
      } else {
        sanitizedSubject = subject.trim();
      }
    }

    // 5. Validate "message"
    if (!message || typeof message !== "string" || message.trim().length < 10) {
      errors.message = "Le message doit contenir au moins 10 caractères.";
    } else if (message.trim().length > 5000) {
      errors.message = "Le message ne peut pas dépasser 5000 caractères.";
    }

    if (Object.keys(errors).length > 0) {
      return Response.json(
        {
          success: false,
          error: "Veuillez vérifier les informations saisies.",
          details: errors,
        },
        { status: 400 }
      );
    }

    const sanitizedPayload = {
      name: (name as string).trim(),
      email: (email as string).trim().toLowerCase(),
      subject: sanitizedSubject,
      message: (message as string).trim(),
    };

    // 6. Extraction of request metadata for logging and traceability
    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : headerList.get("x-real-ip") || "unknown";
    const userAgent = headerList.get("user-agent") || "unknown";

    const logEntry = {
      timestamp: new Date().toISOString(),
      event: "CONTACT_FORM_SUBMISSION",
      ip,
      userAgent,
      contact: {
        name: sanitizedPayload.name,
        email: sanitizedPayload.email,
        subject: sanitizedPayload.subject,
        messageLength: sanitizedPayload.message.length,
      },
    };

    // Structured logger ready for monitoring (Datadog, CloudWatch, Axiom, etc.)
    console.info("[Contact API Log]", JSON.stringify(logEntry, null, 2));

    // 7. Dispatch hook ready for mail services (Resend / SendGrid / Nodemailer / Webhook)
    // Example future integration:
    // if (process.env.RESEND_API_KEY) {
    //   await resend.emails.send({
    //     from: "Les Fabricants de Joie <contact@fabricantsdejoie.ne>",
    //     to: ["destinataire@fabricantsdejoie.ne"],
    //     replyTo: sanitizedPayload.email,
    //     subject: `[Contact Web] ${sanitizedPayload.subject}`,
    //     text: sanitizedPayload.message,
    //   });
    // }

    return Response.json(
      {
        success: true,
        message: "Votre message a été envoyé avec joie ! Notre équipe vous répondra dans les plus brefs délais.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Contact API Error]", error);
    return Response.json(
      {
        success: false,
        error: "Une erreur inattendue est survenue lors de l'envoi de votre message. Veuillez réessayer ultérieurement.",
      },
      { status: 500 }
    );
  }
}
