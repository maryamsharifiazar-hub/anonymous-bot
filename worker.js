export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/telegram") {
      const update = await request.json();
      const message = update.message;

      if (!message || !message.text) {
        return new Response("OK");
      }

      if (message.chat?.id?.toString() === env.ADMIN_ID) {
        return new Response("OK");
      }

      await fetch(
        `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            chat_id: env.ADMIN_ID,
            text: `💌 پیام ناشناس\n\n${message.text}`
          })
        }
      );

      return new Response("OK");
    }

    return new Response("OK");
  }
};
