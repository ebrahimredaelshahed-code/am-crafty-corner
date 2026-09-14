import { useState } from "react";
import { Eye, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  buildProductOrderMessage,
  buildWhatsappLink,
  categoryLabel,
  type Product,
} from "@/lib/store";

export function ProductCard({ product, whatsapp }: { product: Product; whatsapp: string }) {
  const href = buildWhatsappLink(product, whatsapp);
  const [detailsOpen, setDetailsOpen] = useState(false);

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
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setDetailsOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-card-foreground transition-colors hover:bg-secondary cursor-pointer"
          >
            <Eye className="h-4 w-4" />
            عرض التفاصيل
          </button>
          <button
            type="button"
            onClick={handleWhatsAppClick}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 cursor-pointer border-0"
          >
            <MessageCircle className="h-4 w-4" />
            اطلب الآن
          </button>
        </div>
      </div>
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent dir="rtl" className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader className="text-right">
            <DialogTitle className="font-display text-2xl">{product.name}</DialogTitle>
            <DialogDescription>{categoryLabel(product.category)}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 sm:grid-cols-[minmax(0,0.9fr)_1.1fr] sm:items-start">
            <img
              src={product.image}
              alt={product.name}
              className="aspect-square w-full rounded-2xl object-cover"
            />
            <div className="space-y-4 text-right">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">النوع</p>
                <p className="mt-1 text-card-foreground">{categoryLabel(product.category)}</p>
              </div>
              {product.price ? (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">السعر</p>
                  <p className="mt-1 font-semibold text-primary">{product.price}</p>
                </div>
              ) : null}
              <div>
                <p className="text-sm font-semibold text-muted-foreground">التفاصيل</p>
                <p className="mt-1 leading-7 text-card-foreground">{product.details}</p>
              </div>
              <button
                type="button"
                onClick={handleWhatsAppClick}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 cursor-pointer border-0"
              >
                <MessageCircle className="h-4 w-4" />
                اطلب الآن عبر واتساب
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </article>
  );
}
