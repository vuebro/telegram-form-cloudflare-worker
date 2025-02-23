export interface Env {
	ALLOWED_ORIGIN: string;
	TELEGRAM_API_KEY: string;
	TELEGRAM_CHAT_ID: string;
}
export default {
	async fetch(
		request,
		{
			ALLOWED_ORIGIN: url,
			TELEGRAM_API_KEY: telegramToken,
			TELEGRAM_CHAT_ID: chat_id,
		}
	): Promise<Response> {
		const message = {
				200: "Сообщение отправлено",
				403: "Потеряно",
				405: "Метод не разрешен",
				415: "Неподдерживаемый тип",
				500: "Ошибка отправки сообщения",
			},
			getResponse = (status: number) =>
				new Response(message[status as keyof object], {
					headers: { "Access-Control-Allow-Origin": url },
					status,
				}),
			{ method } = request;
		switch (method) {
			case "OPTIONS": {
				const headers = {
					"Access-Control-Allow-Origin": url,
					"Access-Control-Allow-Methods": "POST",
					"Access-Control-Allow-Headers": "Content-Type",
				};
				return new Response(null, { headers });
			}
			case "POST":
				let data: Record<string, string>;
				const contentType = request.headers.get("Content-Type");
				switch (true) {
					case request.headers.get("Origin") !== url:
						return getResponse(403);
					case contentType?.includes("application/json"):
						data = await request.json();
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
					const headers = { "Content-Type": "application/json" },
						parse_mode = "Markdown",
						text = [
							...Object.entries({ ...data, url }).map(
								([key, value]) => `${key}\n\`\`\`\n${value}\n\`\`\`\n`
							),
						].join(`\n`),
						inline_keyboard = [[{ text: url, url }]],
						reply_markup = { inline_keyboard },
						body = JSON.stringify({ chat_id, text, parse_mode, reply_markup }),
						{ ok } = await fetch(
							`https://api.telegram.org/bot${telegramToken}/sendMessage`,
							{ method, headers, body }
						);
					if (ok) return getResponse(200);
					else return getResponse(500);
				} catch (error) {
					return getResponse(500);
				}
			default:
				return getResponse(405);
		}
	},
} satisfies ExportedHandler<Env>;
