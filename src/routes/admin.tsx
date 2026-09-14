import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ChevronDown, ImagePlus, Pencil, Save, Trash2, X } from "lucide-react";
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
  images: [] as string[],
};

function Admin() {
  const { products, save } = useProducts();
  const { settings, save: saveSettings } = useSettings();
  const [form, setForm] = useState(emptyForm);
  const [contact, setContact] = useState(settings);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const onImageFiles = (files: FileList) => {
    const selectedFiles = Array.from(files);
    const oversizedFile = selectedFiles.find((file) => file.size > 2_000_000);
    if (oversizedFile) {
      toast.error("حجم إحدى الصور كبير، اختاري صورًا أقل من 2 ميجابايت للصورة");
      return;
    }

    Promise.all(
      selectedFiles.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = reject;
            reader.readAsDataURL(file);
          }),
      ),
    ).then((images) => setForm((current) => ({ ...current, image: images[0] ?? "", images })));
  };

  const addProduct = async (e: FormEvent) => {
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
      images: form.images,
    };
    try {
      await save([product, ...products]);
      setForm(emptyForm);
      toast.success("تمت إضافة المنتج للكتالوج");
    } catch {
      toast.error("تعذر حفظ المنتج على الخادم، تأكدي من إعداد قاعدة البيانات في Vercel");
    }
  };

  const remove = async (id: string) => {
    try {
      await save(products.filter((p) => p.id !== id));
      toast.success("تم حذف المنتج");
    } catch {
      toast.error("تعذر حذف المنتج على الخادم، تأكدي من إعداد قاعدة البيانات في Vercel");
    }
  };

  const updateProduct = async () => {
    if (!editingProduct?.name.trim() || !editingProduct.details.trim()) {
      toast.error("من فضلك أكملي اسم المنتج والتفاصيل");
      return;
    }
    try {
      await save(
        products.map((product) =>
          product.id === editingProduct.id
            ? {
                ...editingProduct,
                name: editingProduct.name.trim().slice(0, 120),
                details: editingProduct.details.trim().slice(0, 600),
                price: editingProduct.price.trim().slice(0, 40),
                image: editingProduct.images?.[0] ?? editingProduct.image,
              }
            : product,
        ),
      );
      setEditingProduct(null);
      toast.success("تم تعديل الكتالوج");
    } catch {
      toast.error("تعذر حفظ التعديل على الخادم، تأكدي من إعداد قاعدة البيانات في Vercel");
    }
  };

  const addImagesToEditingProduct = (files: FileList) => {
    const selectedFiles = Array.from(files);
    if (selectedFiles.some((file) => file.size > 2_000_000)) {
      toast.error("حجم إحدى الصور كبير، اختاري صورًا أقل من 2 ميجابايت للصورة");
      return;
    }
    Promise.all(
      selectedFiles.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = reject;
            reader.readAsDataURL(file);
          }),
      ),
    ).then((images) =>
      setEditingProduct((product) =>
        product
          ? {
              ...product,
              images: [...(product.images?.length ? product.images : [product.image]), ...images],
            }
          : product,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-3xl font-bold">لوحة الإدارة</h1>

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
                onChange={(e) => setForm({ ...form, category: e.target.value as CategoryId })}
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

            <Field label="صورة المنتج">
              <input
                type="file"
                accept="image/*"
                multiple
                className={inputCls}
                onChange={(e) => {
                  if (e.target.files?.length) onImageFiles(e.target.files);
                }}
              />
            </Field>

            {form.images.length ? (
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                {form.images.map((image, index) => (
                  <img
                    key={`${image}-${index}`}
                    src={image}
                    alt={`معاينة الصورة ${index + 1}`}
                    className="aspect-square w-full rounded-xl object-cover"
                  />
                ))}
              </div>
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
                onClick={async () => {
                  try {
                    await saveSettings(contact);
                    toast.success("تم حفظ بيانات المتجر");
                  } catch {
                    toast.error("تعذر حفظ البيانات، تأكدي من إعداد قاعدة البيانات في Vercel");
                  }
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
                  onClick={async () => {
                    try {
                      await save(DEFAULT_PRODUCTS);
                      toast.success("تمت الاستعادة للمنتجات الافتراضية");
                    } catch {
                      toast.error("تعذر الاستعادة، تأكدي من إعداد قاعدة البيانات في Vercel");
                    }
                  }}
                  className="text-xs text-muted-foreground underline"
                >
                  استعادة الافتراضي
                </button>
              </div>
              <ul className="mt-4 space-y-3">
                {products.map((p) => (
                  <li key={p.id} className="rounded-xl border border-border p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0] ?? p.image}
                        alt={p.name}
                        loading="lazy"
                        className="h-14 w-14 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {categoryLabel(p.category)} {p.price ? `· ${p.price}` : ""} ·{" "}
                          {p.images?.length ?? 1} صور
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={`عرض محتوى ${p.name}`}
                        onClick={() =>
                          setExpandedProduct((current) => (current === p.id ? null : p.id))
                        }
                        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary"
                      >
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${expandedProduct === p.id ? "rotate-180" : ""}`}
                        />
                      </button>
                      <button
                        type="button"
                        aria-label={`تعديل ${p.name}`}
                        onClick={() => {
                          setExpandedProduct(p.id);
                          setEditingProduct({
                            ...p,
                            images: p.images?.length ? [...p.images] : [p.image],
                          });
                        }}
                        className="rounded-lg p-2 text-primary transition-colors hover:bg-secondary"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`حذف ${p.name}`}
                        onClick={() => remove(p.id)}
                        className="rounded-lg p-2 text-destructive transition-colors hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {expandedProduct === p.id ? (
                      <div className="mt-4 space-y-4 border-t border-border pt-4">
                        {editingProduct?.id === p.id ? (
                          <>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <Field label="اسم المنتج">
                                <input
                                  className={inputCls}
                                  value={editingProduct.name}
                                  onChange={(event) =>
                                    setEditingProduct({
                                      ...editingProduct,
                                      name: event.target.value,
                                    })
                                  }
                                />
                              </Field>
                              <Field label="التبويب / النوع">
                                <select
                                  className={inputCls}
                                  value={editingProduct.category}
                                  onChange={(event) =>
                                    setEditingProduct({
                                      ...editingProduct,
                                      category: event.target.value as CategoryId,
                                    })
                                  }
                                >
                                  {CATEGORIES.map((category) => (
                                    <option key={category.id} value={category.id}>
                                      {category.label}
                                    </option>
                                  ))}
                                </select>
                              </Field>
                            </div>
                            <Field label="السعر">
                              <input
                                className={inputCls}
                                value={editingProduct.price}
                                onChange={(event) =>
                                  setEditingProduct({
                                    ...editingProduct,
                                    price: event.target.value,
                                  })
                                }
                              />
                            </Field>
                            <Field label="التفاصيل">
                              <textarea
                                className={inputCls + " min-h-24"}
                                value={editingProduct.details}
                                onChange={(event) =>
                                  setEditingProduct({
                                    ...editingProduct,
                                    details: event.target.value,
                                  })
                                }
                              />
                            </Field>
                            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                              {(editingProduct.images?.length
                                ? editingProduct.images
                                : [editingProduct.image]
                              ).map((image, index, images) => (
                                <div key={`${image}-${index}`} className="relative">
                                  <img
                                    src={image}
                                    alt={`صورة ${index + 1}`}
                                    className="aspect-square w-full rounded-lg object-cover"
                                  />
                                  <button
                                    type="button"
                                    aria-label={`حذف الصورة ${index + 1}`}
                                    onClick={() =>
                                      setEditingProduct({
                                        ...editingProduct,
                                        images: images.filter(
                                          (_, imageIndex) => imageIndex !== index,
                                        ),
                                      })
                                    }
                                    className="absolute right-1 top-1 rounded-full bg-background/90 p-1 text-destructive"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary">
                                <ImagePlus className="h-4 w-4" />
                                إضافة صور
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  className="sr-only"
                                  onChange={(event) => {
                                    if (event.target.files?.length)
                                      addImagesToEditingProduct(event.target.files);
                                    event.target.value = "";
                                  }}
                                />
                              </label>
                              <button
                                type="button"
                                onClick={updateProduct}
                                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                              >
                                <Save className="h-4 w-4" />
                                حفظ التعديل
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingProduct(null)}
                                className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary"
                              >
                                إلغاء
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="space-y-3">
                            <p className="leading-7 text-muted-foreground">{p.details}</p>
                            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                              {(p.images?.length ? p.images : [p.image]).map((image, index) => (
                                <img
                                  key={`${image}-${index}`}
                                  src={image}
                                  alt={`${p.name} - صورة ${index + 1}`}
                                  className="aspect-square w-full rounded-lg object-cover"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null}
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
