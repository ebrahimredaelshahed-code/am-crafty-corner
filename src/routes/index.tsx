import { createFileRoute } from "@tanstack/react-router";
import { Send, Sparkles } from "lucide-react";
import { useState } from "react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductCard } from "@/components/ProductCard";
import {
  buildCustomOrderMessage,
  buildWhatsappMessageLink,
  CATEGORIES,
  useProducts,
  useSettings,
  type CategoryId,
} from "@/lib/store";

const CUSTOM_DESIGN_WHATSAPP = "https://wa.me/201066063038";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A @ M | Crochet & Macrame" },
      {
        name: "description",
        content:
          "متجر A @ M للمشغولات اليدوية:  كروشيه ومكرميه بتصميمات مميزة، اطلب منتجك مباشرة عبر موقعنا وتواصل عبر واتساب.",
      },
      { property: "og:title", content: "A @ M | Crochet & Macrame" },
      {
        property: "og:description",
        content: "كروشيه ومكرميه هاند ميد، .",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { products } = useProducts();
  const { settings } = useSettings();
  const [active, setActive] = useState<CategoryId | "custom">(() => {
    if (typeof window === "undefined") return "crochet";
    const category = new URLSearchParams(window.location.search).get("cat");
    return CATEGORIES.some((item) => item.id === category) ? (category as CategoryId) : "crochet";
  });

  const visible = products.filter((p) => p.category === active);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4">
        <section className="py-14 text-center">
          <h1 className="font-display text-3xl font-bold leading-relaxed text-foreground md:text-5xl">
            أهلاً بيكِ في متجر <span className="text-primary">A @ M</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
            كل قطعة هنا مشغولة بالإيد بحب واهتمام… اختاري التبويب اللي يعجبك واستعرضي الكتالوجات،
            والطلب يوصلنا مباشرة على الواتساب.
          </p>
        </section>

        <nav
          aria-label="تبويبات عرض المنتجات"
          className="mx-auto flex w-fit flex-wrap justify-center gap-2 rounded-full border border-border bg-secondary/70 p-2"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActive(cat.id)}
              aria-pressed={active === cat.id}
              className={
                "rounded-full px-6 py-2.5 text-sm font-semibold transition-colors " +
                (active === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-background")
              }
            >
              {cat.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setActive("custom")}
            aria-pressed={active === "custom"}
            className={
              "inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-colors " +
              (active === "custom"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-background")
            }
          >
            <Sparkles className="h-4 w-4" />
            تصميمك الخاص
          </button>
        </nav>

        <section className="mt-10">
          {active === "custom" ? (
            <CustomDesignForm />
          ) : visible.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
              لا توجد منتجات في هذا التبويب حاليًا، تابعينا قريبًا.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} whatsapp={settings.whatsapp} />
              ))}
            </div>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function CustomDesignForm() {
  const [details, setDetails] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");

  const sendOrder = () => {
    if (!details.trim()) {
      setStatus("اكتبي تفاصيل التصميم أولًا.");
      return;
    }

    const message = buildCustomOrderMessage(details.trim(), notes.trim());
    window.location.assign(buildWhatsappMessageLink(message, CUSTOM_DESIGN_WHATSAPP));
  };

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] md:p-8">
      <div className="space-y-5">
        <div>
          <h2 className="font-display text-2xl font-bold text-card-foreground">
            صممي قطعتك على ذوقك
          </h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            ابعتي فكرتك، وسنرجع لكِ بالتفاصيل والتكلفة المناسبة.
          </p>
        </div>
        <label className="block space-y-2 text-sm font-semibold text-card-foreground">
          تفاصيل التصميم <span className="text-primary">*</span>
          <textarea
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            placeholder=" نوع القطعة، المقاس، الألوان والخامة..."
            className="min-h-32 w-full rounded-xl border border-input bg-background px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <label className="block space-y-2 text-sm font-semibold text-card-foreground">
          ملاحظات إضافية
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="أي ملاحظات او تفاصيل اضافيه    "
            className="min-h-24 w-full rounded-xl border border-input bg-background px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <button
          type="button"
          onClick={sendOrder}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground hover:opacity-90"
        >
          <Send className="h-4 w-4" />
          إرسال التصميم عبر واتساب
        </button>
        {status ? <p className="text-center text-sm text-muted-foreground">{status}</p> : null}
      </div>
    </div>
  );
}
