import { createFileRoute } from "@tanstack/react-router";

const WHATSAPP_NUMBER = "+20 10 66063038";

function digits(v: string) {
  return v.replace(/[^\d]/g, "");
}

export const Route = createFileRoute("/api/public/whatsapp")({
  server: {
    handlers: {
      GET: async () => {
        const number = digits(WHATSAPP_NUMBER);
        return Response.json(
          {
            whatsapp: WHATSAPP_NUMBER,
            number,
            link: `https://wa.me/${number}`,
          },
          { headers: { "cache-control": "public, max-age=300" } },
        );
      },
    },
  },
});
