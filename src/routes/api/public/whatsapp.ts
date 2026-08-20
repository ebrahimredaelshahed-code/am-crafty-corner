import { createFileRoute } from "@tanstack/react-router";

const WHATSAPP_LINK = "https://wa.me/qr/Q4KOXWP5DRFDA1";

const getConfig = () => ({
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
  recipient: process.env.WHATSAPP_RECIPIENT_NUMBER,
  apiVersion: process.env.WHATSAPP_GRAPH_API_VERSION || "v23.0",
});

export const Route = createFileRoute("/api/public/whatsapp")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json(
          {
            whatsapp: WHATSAPP_LINK,
            link: WHATSAPP_LINK,
          },
          { headers: { "cache-control": "public, max-age=300" } },
        );
      },
      POST: async ({ request }) => {
        const { accessToken, phoneNumberId, recipient, apiVersion } = getConfig();
        if (!accessToken || !phoneNumberId || !recipient) {
          return Response.json(
            { message: "لم يتم إعداد اتصال WhatsApp Cloud API على الموقع بعد." },
            { status: 503 },
          );
        }

        const formData = await request.formData();
        const image = formData.get("image");
        const message = formData.get("message");
        if (!(image instanceof File) || typeof message !== "string" || !message.trim()) {
          return Response.json({ message: "الصورة والتفاصيل مطلوبة." }, { status: 400 });
        }
        if (!image.type.startsWith("image/") || image.size > 10 * 1024 * 1024) {
          return Response.json(
            { message: "يجب أن تكون الصورة أقل من 10 ميجابايت." },
            { status: 400 },
          );
        }

        const apiBase = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}`;
        const mediaData = new FormData();
        mediaData.append("messaging_product", "whatsapp");
        mediaData.append("file", image, image.name || "design-image");
        const mediaResponse = await fetch(`${apiBase}/media`, {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: mediaData,
        });
        const mediaResult = (await mediaResponse.json()) as { id?: string };
        if (!mediaResponse.ok || !mediaResult.id) {
          return Response.json({ message: "تعذر رفع صورة التصميم إلى واتساب." }, { status: 502 });
        }

        const sendResponse = await fetch(`${apiBase}/messages`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: recipient,
            type: "image",
            image: { id: mediaResult.id, caption: message.trim() },
          }),
        });
        if (!sendResponse.ok) {
          return Response.json({ message: "تعذر إرسال التصميم إلى واتساب." }, { status: 502 });
        }

        return Response.json({ ok: true });
      },
    },
  },
});
