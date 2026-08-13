import { Facebook, Instagram, MessageCircle, Music2 } from "lucide-react";
import logo from "@/assets/logo.png";
import { useSettings } from "@/lib/store";

export function SiteFooter() {
  const { settings } = useSettings();
  const waLink = `whatsapp://send?phone=${settings.whatsapp.replace(/[^\d]/g, "")}`;

  return (
    <footer className="mt-20 border-t border-border bg-secondary/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <img
            src={logo}
            alt="شعار A @ M"
            loading="lazy"
            width={72}
            height={72}
            className="h-18 w-18 object-contain"
          />
          <h2 className="mt-3 font-display text-xl font-bold text-primary">A @ M</h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">{settings.about}</p>
        </div>

        <div>
          <h3 className="font-display text-lg font-semibold">بيانات المتجر</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>واتساب: {settings.whatsapp}</li>
            <li>ساعات العمل: يوميًا من 10 صباحًا حتى 10 مساءً</li>
            <li>الشحن متاح لجميع المحافظات</li>
            <li>كل القطع تُنفَّذ يدويًا حسب الطلب</li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg font-semibold">تواصل معنا</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <SocialButton href={waLink} label="واتساب">
              <MessageCircle className="h-4 w-4" />
            </SocialButton>
            <SocialButton href={settings.facebook} label="فيسبوك">
              <Facebook className="h-4 w-4" />
            </SocialButton>
            <SocialButton href={settings.instagram} label="انستجرام">
              <Instagram className="h-4 w-4" />
            </SocialButton>
            <SocialButton href={settings.tiktok} label="تيك توك">
              <Music2 className="h-4 w-4" />
            </SocialButton>
          </div>
        </div>
      </div>
      <div className="border-t border-border/70 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} A @ M — جميع الحقوق محفوظة
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
      className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm transition-colors hover:bg-primary hover:text-primary-foreground"
    >
      {children}
      {label}
    </a>
  );
}
