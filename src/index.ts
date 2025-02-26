import { status as getStatus } from "@http-util/status-i18n";
export default {
  async fetch(
    request: Request,
    {
      ALLOWED_ORIGIN: url,
      STATUS_LOCALE: locale = "en-us",
      TELEGRAM_API_KEY: telegramToken,
      TELEGRAM_CHAT_ID: chat_id,
    }: {
      ALLOWED_ORIGIN: string;
      STATUS_LOCALE?: string;
      TELEGRAM_API_KEY: string;
      TELEGRAM_CHAT_ID: string;
    },
  ): Promise<Response> {
    const getResponse = (status: number) =>
        new Response(getStatus(status, locale), {
          headers: { "Access-Control-Allow-Origin": url },
          status,
        }),
      { method } = request;
    switch (method) {
      case "OPTIONS": {
        const headers = {
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Origin": url,
        };
        return new Response(null, { headers });
      }
      case "POST": {
        let data: Record<string, string>;
        const contentType = request.headers.get("Content-Type");
        switch (true) {
          case request.headers.get("Origin") !== url:
            return getResponse(403);
          case contentType?.includes("application/json"):
            data = (await request.json()) as Record<string, string>;
            break;
          case contentType?.includes("application/x-www-form-urlencoded"):
            data = Object.fromEntries(await request.formData()) as Record<
              string,
              string
            >;
            break;
          default:
            return getResponse(415);
        }
        try {
          const parse_mode = "Markdown",
            text = [
              ...Object.entries(data).map(
                ([key, value]) => `${key}\n\`\`\`\n${value}\n\`\`\``,
              ),
              url,
            ].join(`\n`),
            inline_keyboard = [[{ text: url, url }]],
            reply_markup = { inline_keyboard },
            body = JSON.stringify({ chat_id, parse_mode, reply_markup, text }),
            headers = { "Content-Type": "application/json" },
            { ok } = await fetch(
              `https://api.telegram.org/bot${telegramToken}/sendMessage`,
              { body, headers, method },
            );
          if (ok) return getResponse(200);
          else return getResponse(500);
        } catch {
          return getResponse(500);
        }
      }
      default:
        return getResponse(405);
    }
  },
};
