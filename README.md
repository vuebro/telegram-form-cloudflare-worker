# Cloudflare based Telegram Form Submission

This is a simple Cloudflare worker script that can submit html form data with help of Cloudflare worker and Telegram bot api

## 1. Deploy a worker to the cloudflare

Press the button to deploy the worker

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/vues3/telegram-form-cloudflare-worker)

## 2. Set the environment variables

Head towards Workers & Pages section in the Cloudflare account, open

`telegram-form > Setting > Variables and Secrets`

and add the following Variables:

`TELEGRAM_API_KEY` = "You get it from @Botfather"

> [!TIP]
>
> Open Botfather and create a new bot and you will get an API key

`TELEGRAM_CHAT_ID` = "Your telegram Group id you get using @MissRose_bot"

> [!TIP]
>
> 1.  Create a Group and add your newly created bot in the Group and give admin permission to it. (Its important to give admin permission to receive messages)
> 2.  You have to figure out your Group id, it can be done by adding another popular bot in your Group which is MissRose_bot https://t.me/MissRose_bot Give it admin permission and send /id in the group. You will get your group id which looks something like this -10069696969669

`ALLOWED_ORIGIN` = "Your website url"

### Optional

`STATUS_LOCALE` = "Can be one from the list: de-de, en-us, ja-jp, ko-kr, zh-cn, ru-ru"

## How to use it

Now you can use the worker in that way:

```
<form action="https://yourcloudflare.workers.dev/" method="POST">
```

> [!NOTE]
>
> <img src="https://vues3.ru/images/drakkar.svg" width="250"/>
>
> Made on the shores of the Baltic Sea

License: [AGPL](https://choosealicense.com/licenses/agpl-3.0)
