import { useState } from "react";
import { ChevronLeft, ChevronRight, Eye, MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { buildProductOrderMessage, buildWhatsappLink, type Product } from "@/lib/store";
import { getCategoryLabel, useLanguage } from "@/lib/i18n";

export function ProductCard({ product, whatsapp }: { product: Product; whatsapp: string }) {
  const { language, t } = useLanguage();
  const href = buildWhatsappLink(product, whatsapp);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const images = product.images?.length ? product.images : [product.image];
  const [activeImage, setActiveImage] = useState(0);

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
          src={images[0]}
          alt={product.name}
          loading="lazy"
          width={768}
          height={768}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-2 p-5">
        <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
          {getCategoryLabel(product.category, language)}
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
            {t("details")}
          </button>
          <button
            type="button"
            onClick={handleWhatsAppClick}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 cursor-pointer border-0"
          >
            <MessageCircle className="h-4 w-4" />
            {t("order")}
          </button>
        </div>
      </div>
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent dir="rtl" className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader className="text-right">
            <DialogTitle className="font-display text-2xl">{product.name}</DialogTitle>
            <DialogDescription>{getCategoryLabel(product.category, language)}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 sm:grid-cols-[minmax(0,0.9fr)_1.1fr] sm:items-start">
            <div className="space-y-3">
              <div className="relative overflow-hidden rounded-2xl bg-muted">
                <img
                  src={images[activeImage]}
                  alt={`${product.name} - صورة ${activeImage + 1}`}
                  className="aspect-square w-full object-cover"
                />
                {images.length > 1 ? (
                  <>
                    <button
                      type="button"
                      aria-label={t("previous")}
                      onClick={() =>
                        setActiveImage((current) => (current - 1 + images.length) % images.length)
                      }
                      className="absolute right-3 top-1/2 rounded-full bg-background/90 p-2 text-foreground shadow transition-colors hover:bg-background"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      aria-label={t("next")}
                      onClick={() => setActiveImage((current) => (current + 1) % images.length)}
                      className="absolute left-3 top-1/2 rounded-full bg-background/90 p-2 text-foreground shadow transition-colors hover:bg-background"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                  </>
                ) : null}
              </div>
              {images.length > 1 ? (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      aria-label={`${t("showImage")} ${index + 1}`}
                      aria-pressed={activeImage === index}
                      onClick={() => setActiveImage(index)}
                      className={`shrink-0 overflow-hidden rounded-lg border-2 ${
                        activeImage === index ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <img src={image} alt="" className="h-14 w-14 object-cover" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="space-y-4 text-right">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">{t("type")}</p>
                <p className="mt-1 text-card-foreground">
                  {getCategoryLabel(product.category, language)}
                </p>
              </div>
              {product.price ? (
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">{t("price")}</p>
                  <p className="mt-1 font-semibold text-primary">{product.price}</p>
                </div>
              ) : null}
              <div>
                <p className="text-sm font-semibold text-muted-foreground">{t("productDetails")}</p>
                <p className="mt-1 leading-7 text-card-foreground">{product.details}</p>
              </div>
              <button
                type="button"
                onClick={handleWhatsAppClick}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 cursor-pointer border-0"
              >
                <MessageCircle className="h-4 w-4" />
                {t("orderWhatsapp")}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </article>
  );
}
