import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

let resend = null;

/**
 * Returns a singleton Resend client.
 * Logs a warning when the API key is missing so the app can still boot.
 */
export function getResendClient() {
  if (!resend) {
    if (!RESEND_API_KEY) {
      console.warn(
        "[resend] RESEND_API_KEY is not set — emails will be logged instead of sent."
      );
      // Return a mock so the app doesn't crash
      return createMockClient();
    }
    resend = new Resend(RESEND_API_KEY);
  }
  return resend;
}

/**
 * Send (or log) an email via Resend.
 * Returns the response data or null when using the mock.
 */
export async function sendEmail({ to, subject, html, from }) {
  const sender = from || process.env.RESEND_FROM_EMAIL || "noreply@venuefinder.app";
  const client = getResendClient();

  try {
    if (client._isMock) {
      console.log("[email mock] ───────────────────────────────────────");
      console.log(`[email mock] To:      ${to}`);
      console.log(`[email mock] From:    ${sender}`);
      console.log(`[email mock] Subject: ${subject}`);
      console.log(`[email mock] Body:    ${html.replace(/<[^>]*>/g, "").slice(0, 300)}...`);
      console.log("[email mock] ───────────────────────────────────────");
      return { mock: true, to, subject };
    }

    const { data, error } = await client.emails.send({
      from: sender,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("[resend] send error:", error);
      return null;
    }

    console.log(`[resend] email sent to ${to} — id: ${data?.id}`);
    return data;
  } catch (err) {
    console.error("[resend] send exception:", err);
    return null;
  }
}

function createMockClient() {
  return {
    _isMock: true,
    emails: {
      send: async ({ to, subject, html, from }) => {
        console.log("[email mock] ───────────────────────────────────────");
        console.log(`[email mock] To:      ${to}`);
        console.log(`[email mock] From:    ${from || process.env.RESEND_FROM_EMAIL || "noreply@venuefinder.app"}`);
        console.log(`[email mock] Subject: ${subject}`);
        console.log(`[email mock] Body:    ${html.replace(/<[^>]*>/g, "").slice(0, 300)}...`);
        console.log("[email mock] ───────────────────────────────────────");
        return { data: { id: "mock_" + Date.now() } };
      },
    },
  };
}

export default getResendClient;
