import { Link } from "@tanstack/react-router";
import { Languages } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function SiteHeader() {
  const { t, toggleLanguage } = useLanguage();
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo.png.png"
            alt="شعار متجر A @ M للمشغولات اليدوية"
            width={56}
            height={56}
            className="h-14 w-14 object-contain"
          />
          <span className="leading-tight">
            <span className="block font-display text-2xl font-bold tracking-wide text-primary">
              A @ M
            </span>
            <span className="block text-xs text-muted-foreground">
              مشغولات يدوية · كروشيه ومكرميه
            </span>
          </span>
        </Link>
        <button
          type="button"
          onClick={toggleLanguage}
          title={t("switchLanguage")}
          aria-label={t("switchLanguage")}
          className="absolute left-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
        >
          <Languages className="h-4 w-4" />
          <span>{t("switchLanguage")}</span>
        </button>
      </div>
    </header>
  );
}
