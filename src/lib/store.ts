import { useCallback, useEffect, useState } from "react";

import crochetImg from "@/assets/p-crochet.jpg";
import macrameImg from "@/assets/p-macrame.jpg";
import bagImg from "@/assets/p-bag.jpg";

export type CategoryId = "crochet" | "macrame" | "bags";

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "crochet", label: "كروشيه" },
  { id: "macrame", label: "مكرميه" },
  { id: "bags", label: "شنط" },
];

export const categoryLabel = (id: string) => CATEGORIES.find((c) => c.id === id)?.label ?? id;

export type Product = {
  id: string;
  name: string;
  category: CategoryId;
  details: string;
  price: string;
  image: string;
};

export type Settings = {
  whatsapp: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  about: string;
};

export const DEFAULT_SETTINGS: Settings = {
  whatsapp: "https://wa.me/qr/Q4KOXWP5DRFDA1",
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  tiktok: "https://tiktok.com",
  about:
    "A @ M متجر متخصص في المشغولات اليدوية من الكروشيه والمكرميه والشنط، كل قطعة تُصنع يدويًا بخامات مختارة بعناية وبلمسة خاصة تناسب ذوقك.",
};

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "seed-1",
    name: "شنطة كروشيه بيضاء بوردة",
    category: "crochet",
    details: "شنطة كروشيه قطن 100% بمقاس متوسط، خفيفة ومتينة ومناسبة للاستخدام اليومي.",
    price: "450 ج.م",
    image: crochetImg,
  },
  {
    id: "seed-2",
    name: "معلقة مكرميه للحائط",
    category: "macrame",
    details: "معلقة حائط مكرميه بحبل قطن طبيعي وشماعة خشب، مقاس 40×70 سم.",
    price: "600 ج.م",
    image: macrameImg,
  },
  {
    id: "seed-3",
    name: "شنطة يد بأيادي خشب",
    category: "bags",
    details: "شنطة يد بتصميم مميز بلونين وأيادي خشبية، بطانة داخلية وجيب صغير.",
    price: "750 ج.م",
    image: bagImg,
  },
];

const PRODUCTS_KEY = "am-store-products";
const SETTINGS_KEY = "am-store-settings";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProducts(read(PRODUCTS_KEY, DEFAULT_PRODUCTS));
    setReady(true);
  }, []);

  const save = useCallback((next: Product[]) => {
    setProducts(next);
    window.localStorage.setItem(PRODUCTS_KEY, JSON.stringify(next));
  }, []);

  return { products, save, ready };
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const local = { ...DEFAULT_SETTINGS, ...read(SETTINGS_KEY, DEFAULT_SETTINGS) };
    setSettings(local);

    let cancelled = false;
    fetch("/api/public/whatsapp")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.whatsapp) {
          setSettings((prev) => ({ ...prev, whatsapp: data.whatsapp }));
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  const save = useCallback((next: Settings) => {
    setSettings(next);
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  }, []);

  return { settings, save };
}

export function buildWhatsappLink(product: Product, whatsapp: string) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const imageUrl = product.image.startsWith("data:")
    ? ""
    : product.image.startsWith("http")
      ? product.image
      : origin + product.image;

  const message = [
    "السلام عليكم، أرغب في طلب المنتج التالي من متجر A @ M:",
    "",
    `اسم المنتج: ${product.name}`,
    `النوع: ${categoryLabel(product.category)}`,
    `السعر: ${product.price || "غير محدد"}`,
    `التفاصيل: ${product.details}`,
    ...(imageUrl ? [`صورة المنتج: ${imageUrl}`] : []),
    `رابط الكتالوج: ${origin}/?cat=${product.category}#p-${product.id}`,
    "",
    "برجاء تأكيد التوفر وطريقة الشحن.",
  ].join("\n");

  return buildWhatsappMessageLink(message, whatsapp);
}

export function buildWhatsappMessageLink(message: string, whatsapp: string) {
  const number = whatsapp.replace(/[^\d]/g, "");
  const base = whatsapp.includes("/qr/") ? whatsapp : number ? `https://wa.me/${number}` : whatsapp;

  return `${base}${base.includes("?") ? "&" : "?"}text=${encodeURIComponent(message)}`;
}

export function buildCustomOrderMessage(details: string, notes: string) {
  return [
    "السلام عليكم، أريد تنفيذ تصميم خاص من متجر A @ M:",
    "",
    `التفاصيل المطلوبة: ${details}`,
    `الملاحظات: ${notes || "لا توجد ملاحظات إضافية"}`,
    "",
    "الصورة مرفقة مع الرسالة.",
  ].join("\n");
}
