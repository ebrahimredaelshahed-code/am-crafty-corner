import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { buildWhatsappLink, categoryLabel, type Product } from "@/lib/store";

export function ProductCard({ product, whatsapp }: { product: Product; whatsapp: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const href = mounted
    ? buildWhatsappLink(product, whatsapp)
    : `https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`;

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
        <h3 className="font-display text-lg font-semibold text-card-foreground">
          {product.name}
        </h3>
        <p className="text-sm leading-7 text-muted-foreground">{product.details}</p>
        {product.price ? (
          <p className="font-semibold text-primary">{product.price}</p>
        ) : null}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <MessageCircle className="h-4 w-4" />
          اطلب الآن عبر واتساب
        </a>
      </div>
    </article>
  );
}
