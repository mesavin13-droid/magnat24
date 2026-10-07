import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/mockData';
import { Code2, Globe, CheckCircle2, Copy, Sparkles, X, Eye } from 'lucide-react';

interface MetaData {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  canonicalUrl: string;
  jsonLd: Record<string, any>;
}

export const SEOManager: React.FC = () => {
  const { 
    activeTab, 
    selectedCategory, 
    selectedProductId, 
    products, 
    currentCity, 
    searchQuery 
  } = useStore();

  const [showInspector, setShowInspector] = useState(false);
  const [copied, setCopied] = useState(false);

  // Compute active product & category
  const activeProduct = selectedProductId 
    ? products.find(p => p.id === selectedProductId) 
    : null;

  const activeCategory = selectedCategory 
    ? CATEGORIES.find(c => c.id === selectedCategory) 
    : null;

  // Dynamic SEO metadata calculation based on context
  const getSEOData = (): MetaData => {
    const siteName = 'МАГНАТ24.РФ';
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://магнат24.рф';

    // 1. PRODUCT DETAIL PAGE
    if (activeTab === 'product-detail' && activeProduct) {
      const priceText = `${activeProduct.price} ₽/${activeProduct.unit}`;
      const title = `${activeProduct.name} купить в ${currentCity}е по цене ${priceText} — ${siteName}`;
      const description = `Купить ${activeProduct.name} (${activeProduct.subtitle || activeProduct.category}) в интернет-магазине ${siteName}. В наличии на складах в ${currentCity}е. Быстрая доставка манипулятором и самосвалами от 3 часов. Опт и розница.`;
      const keywords = `${activeProduct.name}, ${activeProduct.sku}, купить ${activeProduct.name}, стройматериалы ${currentCity}, цена ${activeProduct.price} руб, доставка ${activeProduct.category}`;
      const canonicalUrl = `${baseUrl}/product/${activeProduct.sku.toLowerCase()}`;

      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: activeProduct.name,
        image: [activeProduct.image, ...(activeProduct.gallery || [])],
        description: activeProduct.description,
        sku: activeProduct.sku,
        mpn: activeProduct.sku,
        brand: {
          '@type': 'Brand',
          name: activeProduct.brand || 'Магнат'
        },
        offers: {
          '@type': 'Offer',
          url: canonicalUrl,
          priceCurrency: 'RUB',
          price: activeProduct.price,
          priceValidUntil: '2027-12-31',
          itemCondition: 'https://schema.org/NewCondition',
          availability: activeProduct.inStock 
            ? 'https://schema.org/InStock' 
            : 'https://schema.org/PreOrder',
          seller: {
            '@type': 'Organization',
            name: 'ООО «Магнат»'
          }
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: activeProduct.rating || 4.9,
          reviewCount: activeProduct.reviewsCount || 25,
          bestRating: '5',
          worstRating: '1'
        }
      };

      return {
        title,
        description,
        keywords,
        ogTitle: `${activeProduct.name} — ${priceText} в ${currentCity}е`,
        ogDescription: description,
        ogImage: activeProduct.image,
        ogType: 'product',
        canonicalUrl,
        jsonLd
      };
    }

    // 2. CATEGORY PAGE IN CATALOG
    if ((activeTab === 'catalog' || activeTab === 'home') && activeCategory) {
      const categoryProducts = products.filter(p => p.category === activeCategory.id);
      const minPrice = categoryProducts.length > 0 
        ? Math.min(...categoryProducts.map(p => p.price)) 
        : 100;

      const title = `${activeCategory.name} в ${currentCity}е: каталог, цены от ${minPrice} ₽ — ${siteName}`;
      const description = `Купить ${activeCategory.name.toLowerCase()} по оптовым ценам от производителя в ${currentCity}е. В каталоге ${categoryProducts.length} наименований в наличии на складах с доставкой за 3 часа.`;
      const keywords = `${activeCategory.name}, ${activeCategory.name} ${currentCity}, купить ${activeCategory.name.toLowerCase()}, цены на ${activeCategory.name.toLowerCase()}, склад стройматериалов ${currentCity}`;
      const canonicalUrl = `${baseUrl}/catalog/${activeCategory.id}`;

      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${activeCategory.name} в ${currentCity}е`,
        description,
        url: canonicalUrl,
        numberOfItems: categoryProducts.length,
        itemListElement: categoryProducts.slice(0, 10).map((p, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: p.name,
          url: `${baseUrl}/product/${p.sku.toLowerCase()}`,
          price: p.price,
          priceCurrency: 'RUB'
        }))
      };

      return {
        title,
        description,
        keywords,
        ogTitle: `${activeCategory.name} в ${currentCity}е — оптовые цены от ${minPrice} ₽`,
        ogDescription: description,
        ogImage: activeCategory.img || categoryProducts[0]?.image || 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=1000&q=80',
        ogType: 'website',
        canonicalUrl,
        jsonLd
      };
    }

    // 3. CATALOG ALL OR SEARCH RESULTS
    if (activeTab === 'catalog') {
      const title = searchQuery.trim() 
        ? `Поиск: «${searchQuery}» — стройматериалы в ${currentCity}е | ${siteName}`
        : `Каталог стройматериалов в ${currentCity}е — цены от производителя | ${siteName}`;

      const description = searchQuery.trim()
        ? `Результаты поиска «${searchQuery}» в каталоге строительных материалов ${siteName}. Наличие на складах, оптовые цены и оперативная доставка.`
        : `Полный каталог строительных материалов в ${currentCity}е: керамзит, кирпич, газобетон, утеплители, смеси, кровля. Опт и розница с доставкой от 490 ₽.`;

      const keywords = `каталог стройматериалов, стройматериалы ${currentCity}, керамзит, кирпич, газобетон Силекс, Пеноплэкс, сухие смеси, магнат24`;
      const canonicalUrl = `${baseUrl}/catalog`;

      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SearchResultsPage',
        name: title,
        description,
        url: canonicalUrl
      };

      return {
        title,
        description,
        keywords,
        ogTitle: title,
        ogDescription: description,
        ogImage: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=1000&q=80',
        ogType: 'website',
        canonicalUrl,
        jsonLd
      };
    }

    // 4. MATERIAL CALCULATOR
    if (activeTab === 'calculator') {
      const title = `Калькулятор стройматериалов онлайн: расчет газобетона, кирпича, керамзита | ${siteName}`;
      const description = `Бесплатный инженерный калькулятор расхода стройматериалов: расчет газоблоков, кирпича, керамзита для стяжки и утеплителя. Добавление всего расчета в корзину в 1 клик.`;
      const keywords = `калькулятор стройматериалов, расчет газоблока, расчет кирпича, калькулятор керамзита, расчет сухой стяжки, нормы расхода`;
      const canonicalUrl = `${baseUrl}/calculator`;

      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Инженерный калькулятор стройматериалов МАГНАТ24',
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'All',
        description,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'RUB'
        }
      };

      return {
        title,
        description,
        keywords,
        ogTitle: title,
        ogDescription: description,
        ogImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80',
        ogType: 'website',
        canonicalUrl,
        jsonLd
      };
    }

    // 5. DEFAULT HOMEPAGE
    const title = `МАГНАТ24.РФ — Оптово-розничный гипермаркет стройматериалов в ${currentCity}е`;
    const description = `Официальный магазин ООО «Магнат»: керамзит всех фракций, кирпич М-150, газобетон Силекс, утеплитель Пеноплэкс, сухие смеси с доставкой манипулятором и самосвалами за 3 часа.`;
    const keywords = `стройматериалы ${currentCity}, керамзит, кирпич М150, газобетон Силекс, Пеноплэкс, OSB-3, цемент М500, доставка стройматериалов, магнат24`;
    const canonicalUrl = baseUrl;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'HardwareStore',
      name: 'МАГНАТ24 — Гипермаркет стройматериалов',
      alternateName: 'ООО «Магнат»',
      url: baseUrl,
      logo: `${baseUrl}/favicon.ico`,
      image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=1000&q=80',
      description,
      telephone: currentCity === 'Новосибирск' ? '+7-383-310-85-44' : '+7-391-2-347-858',
      email: 'smk2000@yandex.ru',
      priceRange: '₽₽',
      currenciesAccepted: 'RUB',
      paymentAccepted: 'Cash, Credit Card, SBP, Bank Transfer',
      address: {
        '@type': 'PostalAddress',
        addressLocality: currentCity,
        streetAddress: currentCity === 'Новосибирск' ? 'ул. Петухова, 47а' : 'ул. Академика Павлова, д. 27а, оф. 103',
        addressCountry: 'RU'
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '08:30',
          closes: '18:00'
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Saturday'],
          opens: '09:00',
          closes: '15:00'
        }
      ]
    };

    return {
      title,
      description,
      keywords,
      ogTitle: title,
      ogDescription: description,
      ogImage: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=1000&q=80',
      ogType: 'website',
      canonicalUrl,
      jsonLd
    };
  };

  const seoData = getSEOData();

  // Dynamically update DOM head tags
  useEffect(() => {
    // 1. Update Title
    document.title = seoData.title;

    // Helper to set or create meta tag
    const setMetaTag = (attribute: string, key: string, content: string) => {
      let meta = document.querySelector(`meta[${attribute}="${key}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, key);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Helper to set canonical link
    const setCanonical = (href: string) => {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    // Helper to inject Schema.org JSON-LD
    const setJsonLd = (data: Record<string, any>) => {
      let script = document.getElementById('dynamic-jsonld-schema');
      if (!script) {
        script = document.createElement('script');
        script.id = 'dynamic-jsonld-schema';
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(data, null, 2);
    };

    // 2. Standard SEO Meta
    setMetaTag('name', 'description', seoData.description);
    setMetaTag('name', 'keywords', seoData.keywords);
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // 3. OpenGraph Social Cards
    setMetaTag('property', 'og:title', seoData.ogTitle);
    setMetaTag('property', 'og:description', seoData.ogDescription);
    setMetaTag('property', 'og:image', seoData.ogImage);
    setMetaTag('property', 'og:url', seoData.canonicalUrl);
    setMetaTag('property', 'og:type', seoData.ogType);
    setMetaTag('property', 'og:site_name', 'МАГНАТ24.РФ');
    setMetaTag('property', 'og:locale', 'ru_RU');

    // 4. Twitter / X Cards
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', seoData.ogTitle);
    setMetaTag('name', 'twitter:description', seoData.ogDescription);
    setMetaTag('name', 'twitter:image', seoData.ogImage);

    // 5. Canonical Link
    setCanonical(seoData.canonicalUrl);

    // 6. Schema.org JSON-LD
    setJsonLd(seoData.jsonLd);

  }, [seoData.title, seoData.description, seoData.ogImage, seoData.canonicalUrl]);

  const copyJsonLd = () => {
    navigator.clipboard.writeText(JSON.stringify(seoData.jsonLd, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Discreet floating SEO inspection badge in bottom right corner (hidden during cart/checkout) */}
      {activeTab !== 'cart' && activeTab !== 'checkout' && (
        <button
          onClick={() => setShowInspector(true)}
          className="fixed bottom-20 right-4 z-30 bg-slate-900/90 hover:bg-slate-900 text-amber-400 border border-slate-700 p-2.5 rounded-2xl shadow-lg backdrop-blur-md flex items-center gap-1.5 text-xs font-bold transition-all hover:scale-105 active:scale-95 group"
          title="SEO Инспектор: посмотреть текущие мета-теги и Schema.org"
          aria-label="Открыть SEO Инспектор"
        >
          <Globe className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline text-[11px] text-white">SEO Meta</span>
        </button>
      )}

      {/* Interactive SEO Inspector Modal */}
      {showInspector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">SEO Инспектор страницы</h3>
                  <p className="text-[11px] text-slate-500">Динамические Meta-теги и разметка Schema.org</p>
                </div>
              </div>

              <button
                onClick={() => setShowInspector(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inspector body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {/* Google Snippet Live Preview */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5 mb-1.5">
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Превью в поисковой выдаче (Google / Яндекс):</span>
                </div>
                <div className="text-[11px] text-emerald-700 font-mono truncate">{seoData.canonicalUrl}</div>
                <div className="text-sm font-bold text-blue-700 hover:underline cursor-pointer leading-snug">
                  {seoData.title}
                </div>
                <div className="text-xs text-slate-600 leading-relaxed mt-0.5">
                  {seoData.description}
                </div>
              </div>

              {/* Tag fields breakdown */}
              <div className="space-y-2.5">
                <div>
                  <span className="font-bold text-slate-700 block mb-1">
                    &lt;title&gt; ({seoData.title.length} симв.)
                  </span>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900">
                    {seoData.title}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-700 block mb-1">
                    &lt;meta name="description"&gt; ({seoData.description.length} симв.)
                  </span>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-800 leading-relaxed">
                    {seoData.description}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-700 block mb-1">
                    &lt;link rel="canonical"&gt;
                  </span>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-slate-800 text-[11px]">
                    {seoData.canonicalUrl}
                  </div>
                </div>

                {/* Schema.org JSON-LD Code Block */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                      <Code2 className="w-3.5 h-3.5 text-amber-500" />
                      <span>Schema.org JSON-LD ({seoData.jsonLd['@type']})</span>
                    </span>
                    <button
                      onClick={copyJsonLd}
                      className="text-amber-600 font-bold hover:underline flex items-center gap-1 text-[11px]"
                    >
                      {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Скопировано!' : 'Копировать'}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-48 leading-relaxed">
                    {JSON.stringify(seoData.jsonLd, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                ✅ Мета-теги обновляются реактивно при каждом переходе
              </span>
              <button
                onClick={() => setShowInspector(false)}
                className="py-2 px-4 rounded-xl bg-slate-900 text-white font-bold"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
