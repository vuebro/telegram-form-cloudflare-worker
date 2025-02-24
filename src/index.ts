const message = {
	200: "Сообщение отправлено",
	403: "Потеряно",
	405: "Метод не разрешен",
	415: "Неподдерживаемый тип",
	500: "Ошибка отправки сообщения",
};

export default {
	async fetch(
		request: Request,
		{
			ALLOWED_ORIGIN: url,
			TELEGRAM_API_KEY: telegramToken,
			TELEGRAM_CHAT_ID: chat_id,
		}: {
			ALLOWED_ORIGIN: string;
			TELEGRAM_API_KEY: string;
			TELEGRAM_CHAT_ID: string;
		},
	): Promise<Response> {
		const getResponse = (status: number) =>
				new Response(message[status as keyof object], {
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
