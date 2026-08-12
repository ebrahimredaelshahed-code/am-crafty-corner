import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  CATEGORIES,
  DEFAULT_PRODUCTS,
  categoryLabel,
  useProducts,
  useSettings,
  type CategoryId,
  type Product,
} from "@/lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة الإدارة | متجر A @ M" },
      {
        name: "description",
        content: "إدارة كتالوجات متجر A @ M: إضافة المنتجات وصورها وتفاصيلها وبيانات التواصل.",
      },
      { property: "og:title", content: "لوحة الإدارة | متجر A @ M" },
      {
        property: "og:description",
        content: "إضافة وتعديل كتالوجات المنتجات وبيانات المتجر.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const emptyForm = {
  name: "",
  category: "crochet" as CategoryId,
  details: "",
  price: "",
  image: "",
};

function Admin() {
  const { products, save } = useProducts();
  const { settings, save: saveSettings } = useSettings();
  const [form, setForm] = useState(emptyForm);
  const [contact, setContact] = useState(settings);

  const onImageFile = (file: File) => {
    if (file.size > 2_000_000) {
      toast.error("حجم الصورة كبير، اختاري صورة أقل من 2 ميجابايت");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, image: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const addProduct = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.details.trim() || !form.image) {
      toast.error("من فضلك أكملي اسم المنتج والتفاصيل والصورة");
      return;
    }
    const product: Product = {
      id: crypto.randomUUID(),
      name: form.name.trim().slice(0, 120),
      category: form.category,
      details: form.details.trim().slice(0, 600),
      price: form.price.trim().slice(0, 40),
      image: form.image,
    };
    save([product, ...products]);
    setForm(emptyForm);
    toast.success("تمت إضافة المنتج للكتالوج");
  };

  const remove = (id: string) => {
    save(products.filter((p) => p.id !== id));
    toast.success("تم حذف المنتج");
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-3xl font-bold">لوحة الإدارة</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          أضيفي الكتالوجات والمنتجات وتفاصيلها. البيانات محفوظة على هذا الجهاز فقط —
          لو حابة تظهر لكل الزوار، اطلبي مني تفعيل قاعدة بيانات للمتجر.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <form
            onSubmit={addProduct}
            className="space-y-4 rounded-2xl border border-border bg-card p-6"
          >
            <h2 className="font-display text-xl font-semibold">إضافة منتج جديد</h2>

            <Field label="اسم المنتج">
              <input
                className={inputCls}
                maxLength={120}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Field>

            <Field label="التبويب / الكتالوج">
              <select
                className={inputCls}
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as CategoryId })
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="تفاصيل المنتج">
              <textarea
                className={inputCls + " min-h-28"}
                maxLength={600}
                value={form.details}
                onChange={(e) => setForm({ ...form, details: e.target.value })}
              />
            </Field>

            <Field label="السعر (اختياري)">
              <input
                className={inputCls}
                maxLength={40}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </Field>

            <Field label="صورة المنتج">
              <input
                type="file"
                accept="image/*"
                className={inputCls}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onImageFile(file);
                }}
              />
            </Field>

            {form.image ? (
              <img
                src={form.image}
                alt="معاينة صورة المنتج"
                className="h-32 w-32 rounded-xl object-cover"
              />
            ) : null}

            <button
              type="submit"
              className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              إضافة إلى الكتالوج
            </button>
          </form>

          <div className="space-y-8">
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-xl font-semibold">بيانات المتجر والتواصل</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="رقم واتساب (بصيغة دولية)">
                  <input
                    className={inputCls}
                    value={contact.whatsapp}
                    onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                  />
                </Field>
                <Field label="فيسبوك">
                  <input
                    className={inputCls}
                    value={contact.facebook}
                    onChange={(e) => setContact({ ...contact, facebook: e.target.value })}
                  />
                </Field>
                <Field label="انستجرام">
                  <input
                    className={inputCls}
                    value={contact.instagram}
                    onChange={(e) => setContact({ ...contact, instagram: e.target.value })}
                  />
                </Field>
                <Field label="تيك توك">
                  <input
                    className={inputCls}
                    value={contact.tiktok}
                    onChange={(e) => setContact({ ...contact, tiktok: e.target.value })}
                  />
                </Field>
              </div>
              <Field label="نبذة عن المتجر">
                <textarea
                  className={inputCls + " mt-4 min-h-24"}
                  maxLength={500}
                  value={contact.about}
                  onChange={(e) => setContact({ ...contact, about: e.target.value })}
                />
              </Field>
              <button
                type="button"
                onClick={() => {
                  saveSettings(contact);
                  toast.success("تم حفظ بيانات المتجر");
                }}
                className="mt-4 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-accent"
              >
                حفظ البيانات
              </button>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">
                  المنتجات الحالية ({products.length})
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    save(DEFAULT_PRODUCTS);
                    toast.success("تمت الاستعادة للمنتجات الافتراضية");
                  }}
                  className="text-xs text-muted-foreground underline"
                >
                  استعادة الافتراضي
                </button>
              </div>
              <ul className="mt-4 space-y-3">
                {products.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center gap-3 rounded-xl border border-border p-3"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {categoryLabel(p.category)} {p.price ? `· ${p.price}` : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label={`حذف ${p.name}`}
                      onClick={() => remove(p.id)}
                      className="rounded-lg p-2 text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>
      
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2 text-sm font-medium">
      <span>{label}</span>
      {children}
    </label>
  );
}
