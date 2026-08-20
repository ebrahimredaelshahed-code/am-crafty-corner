import { createFileRoute } from "@tanstack/react-router";
import { ImagePlus, Send, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

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

const CUSTOM_DESIGN_WHATSAPP = "https://wa.me/qr/Q4KOXWP5DRFDA1";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A @ M | متجر المشغولات اليدوية — كروشيه ومكرميه وشنط" },
      {
        name: "description",
        content:
          "متجر A @ M للمشغولات اليدوية: كتالوجات كروشيه ومكرميه وشنط بتصميمات مميزة، اطلب منتجك مباشرة عبر واتساب.",
      },
      { property: "og:title", content: "A @ M | متجر المشغولات اليدوية" },
      {
        property: "og:description",
        content: "كروشيه ومكرميه وشنط هاند ميد، والطلب مباشرة عبر واتساب.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { products } = useProducts();
  const { settings } = useSettings();
  const [active, setActive] = useState<CategoryId | "custom">("crochet");

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
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [details, setDetails] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const sendOrder = async () => {
    if (!image || !details.trim()) {
      setStatus("أرفقي صورة واكتبي تفاصيل التصميم أولًا.");
      return;
    }

    const message = buildCustomOrderMessage(details.trim(), notes.trim());
    try {
      if (navigator.share && navigator.canShare?.({ files: [image] })) {
        await navigator.share({ title: "تصميم خاص من A @ M", text: message, files: [image] });
        setStatus("تم تجهيز المشاركة عبر واتساب.");
        return;
      }
    } catch (error) {
      if ((error as DOMException).name === "AbortError") return;
    }

    window.open(
      buildWhatsappMessageLink(message, CUSTOM_DESIGN_WHATSAPP),
      "_blank",
      "noopener,noreferrer",
    );
    setStatus("تم فتح واتساب. أرفقي الصورة من جهازك قبل الإرسال.");
  };

  return (
    <div className="mx-auto grid max-w-4xl gap-8 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] md:grid-cols-[0.9fr_1.1fr] md:p-8">
      <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/40 bg-secondary/40 p-5 text-center">
        {preview ? (
          <img
            src={preview}
            alt="معاينة التصميم"
            className="h-64 w-full rounded-xl object-contain"
          />
        ) : (
          <ImagePlus className="mb-4 h-12 w-12 text-primary" />
        )}
        <label className="mt-4 cursor-pointer rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
          {image ? "تغيير الصورة" : "أرفقي صورة التصميم"}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => setImage(event.target.files?.[0] ?? null)}
          />
        </label>
        <p className="mt-3 text-xs text-muted-foreground">صورة واحدة بصيغة JPG أو PNG</p>
      </div>
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
            placeholder="اكتبي نوع القطعة، المقاس، الألوان والخامة..."
            className="min-h-32 w-full rounded-xl border border-input bg-background px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <label className="block space-y-2 text-sm font-semibold text-card-foreground">
          ملاحظات إضافية
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="أي ملاحظات أو موعد استلام مفضل"
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
