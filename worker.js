export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // برای وصل کردن Webhook
    if (request.method === "GET" && url.pathname === "/setup") {
      if (url.searchParams.get("key") !== env.SETUP_KEY) {
        return new Response("Unauthorized", { status: 401 });
      }

      const webhookUrl = `${url.origin}/telegram`;

      const result = await fetch(
        `https://api.telegram.org/bot${env.BOT_TOKEN}/setWebhook`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: webhookUrl })
        }
      );

      return new Response(await result.text(), {
        headers: { "Content-Type": "application/json" }
      });
    }

    // دریافت پیام‌های تلگرام
    if (request.method === "POST" && url.pathname === "/telegram") {
      const update = await request.json();
      const message = update.message;

      if (!message) {
        return new Response("OK");
      }

      // پیام‌های خودت یا دستور /start را ارسال نکن
      if (message.chat?.id?.toString() === env.ADMIN_ID) {
        return new Response("OK");
      }

      const text = message.text;

      if (!text) {
        return new Response("OK");
      }

      // فقط متن پیام؛ بدون نام، username یا ID فرستنده
      await fetch(
        `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: env.ADMIN_ID,
            text: `💌 پیام ناشناس\n\n${text}`
          })
        }
      );

      return new Response("OK");
    }

    return new Response("OK");
  }
};
