import { Facebook, Instagram, MessageCircle, Music2 } from "lucide-react";
import { useSettings } from "@/lib/store";
import { useLanguage } from "@/lib/i18n";

export function SiteFooter() {
  const { settings } = useSettings();
  const { t } = useLanguage();
  const waLink = `whatsapp://send?phone=${settings.whatsapp.replace(/[^\d]/g, "")}`;

  return (
    <footer className="mt-20 border-t-2 border-primary/20 bg-secondary/55">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
        <div className="text-center md:text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/75">
            {t("care")}
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold text-primary">A @ M</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-muted-foreground md:mx-0">
            {settings.about}
          </p>
        </div>

        <div className="border-t border-border/80 pt-6 text-center md:border-t-0 md:border-r md:pt-0 md:pr-10 md:text-right">
          <h3 className="font-display text-2xl font-semibold text-foreground">{t("contact")}</h3>
          <div className="mt-5 flex flex-wrap justify-center gap-3 md:justify-start">
            <SocialButton href={waLink} label={t("whatsapp")}>
              <MessageCircle className="h-4 w-4" />
            </SocialButton>
            <SocialButton href={settings.facebook} label={t("facebook")}>
              <Facebook className="h-4 w-4" />
            </SocialButton>
            <SocialButton href={settings.instagram} label={t("instagram")}>
              <Instagram className="h-4 w-4" />
            </SocialButton>
            <SocialButton href={settings.tiktok} label={t("tiktok")}>
              <Music2 className="h-4 w-4" />
            </SocialButton>
          </div>
        </div>
      </div>
      <div className="border-t border-border/70 px-4 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} A @ M · {t("rights")}
      </div>
    </footer>
  );
}

function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-w-32 items-center justify-center gap-2 rounded-full border border-border bg-background/75 px-4 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground"
    >
      {children}
      {label}
    </a>
  );
}
