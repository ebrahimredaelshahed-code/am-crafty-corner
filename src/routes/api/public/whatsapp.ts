import { createFileRoute } from "@tanstack/react-router";

const WHATSAPP_LINK = "https://wa.me/201066063038";

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
    },
  },
});
