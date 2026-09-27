import os
import requests

TOKEN = os.environ["BOT_TOKEN"]
ADMIN_ID = int(os.environ["ADMIN_ID"])

API = f"https://api.telegram.org/bot{TOKEN}"


def send_message(chat_id, text):
    requests.post(
        f"{API}/sendMessage",
        data={
            "chat_id": chat_id,
            "text": text
        }
    )


offset = None

while True:
    response = requests.get(
        f"{API}/getUpdates",
        params={"offset": offset, "timeout": 30}
    ).json()

    for update in response.get("result", []):
        offset = update["update_id"] + 1

        message = update.get("message")
        if not message:
            continue

        chat = message.get("chat", {})
        user_id = chat.get("id")

        # پیام خودت را نادیده می‌گیرد
        if user_id == ADMIN_ID:
            continue

        text = message.get("text")
        if not text:
            continue

        send_message(
            ADMIN_ID,
            f"💌 پیام ناشناس\n\n{text}"
        )
