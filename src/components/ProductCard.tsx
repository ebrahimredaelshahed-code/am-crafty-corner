import { MessageCircle } from "lucide-react";
import {
  buildProductOrderMessage,
  buildWhatsappLink,
  categoryLabel,
  type Product,
} from "@/lib/store";

export function ProductCard({ product, whatsapp }: { product: Product; whatsapp: string }) {
  const href = buildWhatsappLink(product, whatsapp);

  const handleWhatsAppClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (href) {
      window.location.assign(href);
    }
  };

  return (
    <article
      id={`p-${product.id}`}
      className="group overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-1"
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={768}
          height={768}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-2 p-5">
        <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
          {categoryLabel(product.category)}
        </span>
        <h3 className="font-display text-lg font-semibold text-card-foreground">{product.name}</h3>
        <p className="text-sm leading-7 text-muted-foreground">{product.details}</p>
        <button
          onClick={handleWhatsAppClick}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 cursor-pointer border-0"
        >
          <MessageCircle className="h-4 w-4" />
          اطلب الآن عبر واتساب
        </button>
      </div>
    </article>
  );
}
