import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
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
              مشغولات يدوية · كروشيه ومكرميه وشنط
            </span>
          </span>
        </Link>
      </div>
    </header>
  );
}
