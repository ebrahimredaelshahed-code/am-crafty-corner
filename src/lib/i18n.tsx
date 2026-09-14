import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Language = "ar" | "en" | "zh";

const languages: Language[] = ["ar", "en", "zh"];
const languageNames: Record<Language, string> = {
  ar: "العربية",
  en: "English",
  zh: "中文",
};

const translations = {
  ar: {
    switchLanguage: "English",
    handmade: "مشغولات يدوية · كروشيه ومكرميه",
    welcome: "أهلاً بيكِ في متجر",
    intro:
      "كل قطعة هنا مشغولة بالإيد بحب واهتمام… اختاري التبويب اللي يعجبك واستعرضي الكتالوجات، والطلب يوصلنا مباشرة على الواتساب.",
    catalogTabs: "تبويبات عرض المنتجات",
    crochet: "كروشيه",
    macrame: "مكرميه",
    bags: "شنط",
    custom: "تصميمك الخاص",
    noProducts: "لا توجد منتجات في هذا التبويب حاليًا، تابعينا قريبًا.",
    customTitle: "صممي قطعتك على ذوقك",
    customIntro: "ابعتِ فكرتك، وسنرجع لكِ بالتفاصيل والتكلفة المناسبة.",
    designDetails: "تفاصيل التصميم",
    designPlaceholder: "نوع القطعة، المقاس، الألوان والخامة...",
    extraNotes: "ملاحظات إضافية",
    notesPlaceholder: "أي ملاحظات أو تفاصيل إضافية",
    sendDesign: "إرسال التصميم عبر واتساب",
    writeDetails: "اكتبي تفاصيل التصميم أولًا.",
    details: "عرض التفاصيل",
    order: "اطلب الآن",
    orderWhatsapp: "اطلب الآن عبر واتساب",
    type: "النوع",
    price: "السعر",
    productDetails: "التفاصيل",
    previous: "الصورة السابقة",
    next: "الصورة التالية",
    showImage: "عرض الصورة",
    care: "نهتم بأدق التفاصيل",
    contact: "تواصل معنا",
    rights: "جميع الحقوق محفوظة",
    whatsapp: "واتساب",
    facebook: "فيسبوك",
    instagram: "انستجرام",
    tiktok: "تيك توك",
  },
  en: {
    switchLanguage: "中文",
    handmade: "Handmade crafts · Crochet & Macrame",
    welcome: "Welcome to",
    intro:
      "Every piece is handmade with care and love. Choose a category to explore the catalog and order directly through WhatsApp.",
    catalogTabs: "Product categories",
    crochet: "Crochet",
    macrame: "Macrame",
    bags: "Bags",
    custom: "Custom design",
    noProducts: "There are no products in this category yet. Check back soon.",
    customTitle: "Design your own piece",
    customIntro:
      "Share your idea and we will get back to you with the details and a suitable price.",
    designDetails: "Design details",
    designPlaceholder: "Item type, size, colors, and materials...",
    extraNotes: "Additional notes",
    notesPlaceholder: "Any extra notes or details",
    sendDesign: "Send design via WhatsApp",
    writeDetails: "Please write the design details first.",
    details: "View details",
    order: "Order now",
    orderWhatsapp: "Order via WhatsApp",
    type: "Type",
    price: "Price",
    productDetails: "Details",
    previous: "Previous image",
    next: "Next image",
    showImage: "View image",
    care: "We care about every detail",
    contact: "Contact us",
    rights: "All rights reserved",
    whatsapp: "WhatsApp",
    facebook: "Facebook",
    instagram: "Instagram",
    tiktok: "TikTok",
  },
  zh: {
    switchLanguage: "العربية",
    handmade: "手工制品 · 钩针与编织",
    welcome: "欢迎来到",
    intro: "每件作品都倾注了手工制作的爱与心意。选择分类浏览目录，并通过 WhatsApp 直接下单。",
    catalogTabs: "产品分类",
    crochet: "钩针",
    macrame: "编织",
    bags: "包袋",
    custom: "专属设计",
    noProducts: "此分类暂时没有商品，欢迎稍后再来。",
    customTitle: "设计你的专属作品",
    customIntro: "告诉我们你的想法，我们会回复合适的详情和报价。",
    designDetails: "设计详情",
    designPlaceholder: "作品类型、尺寸、颜色和材质……",
    extraNotes: "补充说明",
    notesPlaceholder: "其他说明或细节",
    sendDesign: "通过 WhatsApp 发送设计",
    writeDetails: "请先填写设计详情。",
    details: "查看详情",
    order: "立即下单",
    orderWhatsapp: "通过 WhatsApp 下单",
    type: "类型",
    price: "价格",
    productDetails: "详情",
    previous: "上一张图片",
    next: "下一张图片",
    showImage: "查看图片",
    care: "我们重视每一个细节",
    contact: "联系我们",
    rights: "版权所有",
    whatsapp: "WhatsApp",
    facebook: "Facebook",
    instagram: "Instagram",
    tiktok: "TikTok",
  },
} as const;

type TranslationKey = keyof typeof translations.ar;
type I18nContextValue = {
  language: Language;
  direction: "rtl" | "ltr";
  t: (key: TranslationKey) => string;
  toggleLanguage: () => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar");

  const direction = language === "ar" ? "rtl" : "ltr";
  useEffect(() => {
    const saved = window.localStorage.getItem("am-language") as Language | null;
    if (saved && languages.includes(saved)) setLanguage(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    document.body.dir = direction;
    window.localStorage.setItem("am-language", language);
  }, [direction, language]);

  const toggleLanguage = () => {
    setLanguage((current) => languages[(languages.indexOf(current) + 1) % languages.length]);
  };

  return (
    <I18nContext.Provider
      value={{ language, direction, t: (key) => translations[language][key], toggleLanguage }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}

export function getLanguageName(language: Language) {
  return languageNames[language];
}

export function getCategoryLabel(category: string, language: Language) {
  const key = category as "crochet" | "macrame" | "bags";
  return translations[language][key] ?? category;
}
