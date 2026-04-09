import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/9abac6a8-705b-458e-b619-686aac94d3a0/files/16297383-4ffa-4d68-9c58-f29ea9c560d1.jpg";

const products = [
  { id: 1, name: "Кроссовки Ultra Boost X", price: "12 990", oldPrice: "16 990", badge: "Хит", category: "Обувь", rating: 4.9, reviews: 128 },
  { id: 2, name: "Куртка Neon Street", price: "8 490", oldPrice: null, badge: "Новинка", category: "Одежда", rating: 4.7, reviews: 64 },
  { id: 3, name: "Сумка Edge Runner", price: "5 290", oldPrice: "7 000", badge: "−25%", category: "Аксессуары", rating: 4.8, reviews: 91 },
  { id: 4, name: "Часы Cyber Pulse", price: "21 990", oldPrice: null, badge: "Лимит", category: "Аксессуары", rating: 5.0, reviews: 43 },
  { id: 5, name: "Худи Voltage", price: "6 490", oldPrice: "8 490", badge: "−23%", category: "Одежда", rating: 4.6, reviews: 207 },
  { id: 6, name: "Очки Futura", price: "3 990", oldPrice: null, badge: "Новинка", category: "Аксессуары", rating: 4.5, reviews: 35 },
];

const reviewsData = [
  { name: "Алексей М.", rating: 5, text: "Заказал кроссовки — пришли за 2 дня! Качество супер, буду заказывать ещё.", date: "3 апреля 2026" },
  { name: "Светлана К.", rating: 5, text: "Оплата прошла моментально, всё безопасно. Куртка точно по размеру, очень доволен магазином.", date: "1 апреля 2026" },
  { name: "Дмитрий Н.", rating: 4, text: "Крутой дизайн сайта и отличные товары. Оплата картой — без проблем. Рекомендую!", date: "28 марта 2026" },
  { name: "Ольга В.", rating: 5, text: "Купила сумку в подарок — получила восторженные комплименты! Спасибо магазину.", date: "25 марта 2026" },
];

const navLinks = ["Главная", "Каталог", "О магазине", "Отзывы", "Контакты"];
const categories = ["Все", "Обувь", "Одежда", "Аксессуары"];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.floor(rating) ? "text-yellow-400" : "text-gray-600"} style={{ fontSize: 14 }}>★</span>
      ))}
    </div>
  );
}

function useIntersect(ref: React.RefObject<Element>) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

function Section({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useIntersect(ref as React.RefObject<Element>);
  return (
    <section
      id={id}
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </section>
  );
}

export default function Index() {
  const [activeSection, setActiveSection] = useState("Главная");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [addedId, setAddedId] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [formSent, setFormSent] = useState(false);

  const filtered = activeCategory === "Все" ? products : products.filter(p => p.category === activeCategory);

  function handleAddToCart(id: number) {
    setCartCount(c => c + 1);
    setAddedId(id);
    setTimeout(() => setAddedId(null), 1200);
  }

  function handleNav(link: string) {
    setActiveSection(link);
    setMenuOpen(false);
    const map: Record<string, string> = {
      "Главная": "hero",
      "Каталог": "catalog",
      "О магазине": "about",
      "Отзывы": "reviews",
      "Контакты": "contacts",
    };
    const el = document.getElementById(map[link]);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormSent(true);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-body text-white overflow-x-hidden">

      {/* TICKER */}
      <div className="bg-[#FF2D78] py-2 overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap">
          {Array(8).fill("⚡ БЕСПЛАТНАЯ ДОСТАВКА ОТ 5000₽ · 🔒 БЕЗОПАСНАЯ ОПЛАТА ОНЛАЙН · ✨ НОВЫЕ ПОСТУПЛЕНИЯ КАЖДУЮ НЕДЕЛЮ · 🎁 ПОДАРОК К КАЖДОМУ ЗАКАЗУ · ").map((t, i) => (
            <span key={i} className="text-white font-display text-sm font-semibold tracking-widest mr-8">{t}</span>
          ))}
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0a]/90 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="font-display text-2xl font-bold tracking-wider">
            <span className="text-gradient-pink">NEON</span>
            <span className="text-white"> SHOP</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <button
                key={link}
                onClick={() => handleNav(link)}
                className={`font-display text-sm font-medium tracking-widest uppercase transition-all duration-200 ${
                  activeSection === link
                    ? "text-[#FF2D78] border-b-2 border-[#FF2D78] pb-0.5"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {link}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => handleNav("Каталог")} className="relative p-2 text-white/70 hover:text-white transition-colors">
              <Icon name="ShoppingBag" size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF2D78] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-scale-in">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="md:hidden p-2 text-white/70 hover:text-white" onClick={() => setMenuOpen(m => !m)}>
              <Icon name={menuOpen ? "X" : "Menu"} size={22} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-[#111] border-t border-white/5 px-6 py-4 flex flex-col gap-4 animate-fade-in">
            {navLinks.map(link => (
              <button
                key={link}
                onClick={() => handleNav(link)}
                className={`font-display text-base uppercase tracking-widest text-left py-2 border-b border-white/5 ${
                  activeSection === link ? "text-[#FF2D78]" : "text-white/70"
                }`}
              >
                {link}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="hero" className="relative min-h-[92vh] flex items-center grid-bg overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Hero" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        </div>
        <div className="absolute top-20 right-1/4 w-96 h-96 rounded-full bg-[#FF2D78]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-1/3 w-64 h-64 rounded-full bg-[#00F5FF]/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#FF2D78]/10 border border-[#FF2D78]/30 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-[#FF2D78] animate-pulse" />
              <span className="font-display text-sm tracking-widest text-[#FF2D78] uppercase">Новая коллекция 2026</span>
            </div>
            <h1 className="font-display text-6xl md:text-8xl font-bold leading-none mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              БУДЬ
              <span className="block text-gradient-pink">ВПЕРЕДИ</span>
              <span className="block">ТРЕНДОВ</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-10 font-body animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Эксклюзивные товары с безопасной оплатой онлайн. Доставка по всей России. Новые поступления каждую неделю.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <button onClick={() => handleNav("Каталог")} className="btn-neon px-8 py-4 rounded-lg text-base">Смотреть каталог</button>
              <button onClick={() => handleNav("О магазине")} className="btn-outline-cyan px-8 py-4 rounded-lg text-base">О нас</button>
            </div>
            <div className="flex gap-10 mt-14 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              {[["2 000+", "Товаров"], ["15 000+", "Клиентов"], ["4.9 ★", "Рейтинг"]].map(([val, label]) => (
                <div key={label}>
                  <div className="font-display text-3xl font-bold text-gradient-pink">{val}</div>
                  <div className="text-white/50 text-sm mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 animate-bounce">
          <span className="text-xs font-display tracking-widest uppercase">Скролл</span>
          <Icon name="ChevronDown" size={18} />
        </div>
      </section>

      {/* FEATURES */}
      <Section className="py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "Lock", title: "Безопасная оплата", desc: "SSL-шифрование и проверенные платёжные системы" },
              { icon: "Truck", title: "Быстрая доставка", desc: "2-5 дней по всей России" },
              { icon: "RefreshCw", title: "Возврат 30 дней", desc: "Обменяем или вернём деньги без вопросов" },
              { icon: "Headphones", title: "Поддержка 24/7", desc: "Всегда на связи, отвечаем быстро" },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center p-6 rounded-xl bg-white/[0.03] neon-border-pink card-hover">
                <div className="w-12 h-12 rounded-lg bg-[#FF2D78]/10 flex items-center justify-center mb-4">
                  <Icon name={icon} size={22} className="text-[#FF2D78]" />
                </div>
                <h3 className="font-display text-base font-semibold tracking-wide mb-2">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CATALOG */}
      <Section id="catalog" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-[#FF2D78] font-display text-sm tracking-widest uppercase mb-2">— Каталог</p>
              <h2 className="font-display text-5xl font-bold">НАШИ <span className="text-gradient-cyan">ТОВАРЫ</span></h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`font-display text-sm uppercase tracking-widest px-5 py-2 rounded-full border transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-[#FF2D78] border-[#FF2D78] text-white shadow-[0_0_20px_rgba(255,45,120,0.4)]"
                      : "border-white/20 text-white/60 hover:border-white/40 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product, i) => (
              <div key={product.id} className="bg-[#111] rounded-2xl overflow-hidden card-hover neon-border-pink" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="relative h-56 bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-[#FF2D78]/10 flex items-center justify-center">
                      <Icon
                        name={product.category === "Обувь" ? "Footprints" : product.category === "Одежда" ? "Shirt" : "Watch"}
                        size={40}
                        className="text-[#FF2D78]/60"
                        fallback="Package"
                      />
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className={`font-display text-xs font-bold px-3 py-1 rounded-full ${
                      product.badge.startsWith("−") ? "bg-[#FFE600] text-black" :
                      product.badge === "Новинка" ? "bg-[#00F5FF] text-black" :
                      product.badge === "Лимит" ? "bg-white text-black" :
                      "bg-[#FF2D78] text-white"
                    }`}>
                      {product.badge}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent opacity-60" />
                </div>
                <div className="p-5">
                  <p className="text-white/40 text-xs font-display uppercase tracking-widest mb-1">{product.category}</p>
                  <h3 className="font-display text-lg font-semibold mb-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <StarRating rating={product.rating} />
                    <span className="text-white/40 text-xs">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-display text-xl font-bold text-white">{product.price} ₽</span>
                      {product.oldPrice && (
                        <span className="text-white/30 text-sm line-through ml-2">{product.oldPrice} ₽</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className={`font-display text-xs uppercase tracking-widest px-4 py-2 rounded-lg transition-all duration-300 ${
                        addedId === product.id ? "bg-[#39FF14] text-black scale-95" : "btn-neon"
                      }`}
                    >
                      {addedId === product.id ? "✓ В корзине" : "Купить"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ABOUT */}
      <Section id="about" className="py-24 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#00F5FF] font-display text-sm tracking-widest uppercase mb-4">— О магазине</p>
              <h2 className="font-display text-5xl font-bold leading-tight mb-6">
                МЫ СОЗДАЁМ
                <span className="block text-gradient-pink">БУДУЩЕЕ</span>
                МОДЫ
              </h2>
              <p className="text-white/60 leading-relaxed mb-6">
                NEON SHOP — это место, где смелый стиль встречается с современными технологиями. Мы отбираем лучшие товары от ведущих брендов и доставляем их прямо к вашей двери.
              </p>
              <p className="text-white/60 leading-relaxed mb-8">
                Наша платёжная система защищена по стандарту PCI DSS. Оплата картой, по QR-коду или через СБП — быстро, безопасно, удобно.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { num: "2020", label: "Год основания" },
                  { num: "50+", label: "Брендов-партнёров" },
                  { num: "99%", label: "Довольных клиентов" },
                  { num: "24/7", label: "Поддержка" },
                ].map(({ num, label }) => (
                  <div key={label} className="bg-white/[0.03] neon-border-cyan rounded-xl p-5">
                    <div className="font-display text-3xl font-bold text-gradient-cyan">{num}</div>
                    <div className="text-white/50 text-sm mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[#FF2D78]/20 to-[#00F5FF]/10 blur-2xl" />
              <div className="relative bg-[#111] rounded-3xl p-8 neon-border-pink">
                <h3 className="font-display text-2xl font-bold mb-6">Безопасная оплата</h3>
                <div className="space-y-4">
                  {[
                    { icon: "CreditCard", title: "Банковские карты", desc: "Visa, Mastercard, МИР" },
                    { icon: "Smartphone", title: "СБП и QR-код", desc: "Мгновенный перевод" },
                    { icon: "Shield", title: "SSL-шифрование", desc: "Ваши данные защищены" },
                    { icon: "RotateCcw", title: "Гарантия возврата", desc: "Деньги вернём за 3 дня" },
                  ].map(({ icon, title, desc }) => (
                    <div key={title} className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-[#FF2D78]/10 flex items-center justify-center flex-shrink-0">
                        <Icon name={icon} size={18} className="text-[#FF2D78]" />
                      </div>
                      <div>
                        <div className="font-display text-sm font-semibold">{title}</div>
                        <div className="text-white/40 text-xs">{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* REVIEWS */}
      <Section id="reviews" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[#FF2D78] font-display text-sm tracking-widest uppercase mb-3">— Отзывы</p>
            <h2 className="font-display text-5xl font-bold">ЧТО ГОВОРЯТ <span className="text-gradient-pink">КЛИЕНТЫ</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviewsData.map((review, i) => (
              <div key={i} className="bg-[#111] rounded-2xl p-7 neon-border-pink card-hover">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FF2D78] to-[#FF7E5F] flex items-center justify-center font-display font-bold text-white">
                      {review.name[0]}
                    </div>
                    <div>
                      <div className="font-display font-semibold text-sm">{review.name}</div>
                      <div className="text-white/40 text-xs">{review.date}</div>
                    </div>
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-white/70 leading-relaxed text-sm">"{review.text}"</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-3 bg-[#FF2D78]/10 border border-[#FF2D78]/30 rounded-2xl px-8 py-5">
              <div className="font-display text-4xl font-bold text-gradient-pink">4.9</div>
              <div>
                <StarRating rating={5} />
                <div className="text-white/50 text-sm mt-1">На основе 500+ отзывов</div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* CONTACTS */}
      <Section id="contacts" className="py-24 bg-[#0d0d0d]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[#00F5FF] font-display text-sm tracking-widest uppercase mb-3">— Контакты</p>
            <h2 className="font-display text-5xl font-bold">СВЯЖИТЕСЬ <span className="text-gradient-cyan">С НАМИ</span></h2>
            <p className="text-white/50 mt-4">Ответим в течение 30 минут в рабочее время</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {[
              { icon: "Mail", label: "Email", value: "hello@neonshop.ru" },
              { icon: "Phone", label: "Телефон", value: "+7 (800) 555-35-35" },
              { icon: "MapPin", label: "Адрес", value: "Москва, ул. Арбат, 24" },
            ].map(({ icon, label, value }) => (
              <div key={label} className="bg-[#111] neon-border-cyan rounded-2xl p-6 text-center card-hover">
                <div className="w-12 h-12 rounded-xl bg-[#00F5FF]/10 flex items-center justify-center mx-auto mb-3">
                  <Icon name={icon} size={20} className="text-[#00F5FF]" />
                </div>
                <div className="text-white/40 text-xs font-display uppercase tracking-widest mb-1">{label}</div>
                <div className="font-semibold text-sm">{value}</div>
              </div>
            ))}
          </div>
          {formSent ? (
            <div className="text-center py-12 bg-[#111] neon-border-pink rounded-2xl animate-scale-in">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="font-display text-2xl font-bold mb-2">Сообщение отправлено!</h3>
              <p className="text-white/50">Мы свяжемся с вами в ближайшее время</p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="bg-[#111] neon-border-pink rounded-2xl p-8 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-white/50 text-xs font-display uppercase tracking-widest block mb-2">Имя</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Ваше имя"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#FF2D78]/50 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="text-white/50 text-xs font-display uppercase tracking-widest block mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="email@example.com"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#FF2D78]/50 transition-colors text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-white/50 text-xs font-display uppercase tracking-widest block mb-2">Сообщение</label>
                <textarea
                  required
                  value={contactForm.message}
                  onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Ваш вопрос или предложение..."
                  rows={4}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#FF2D78]/50 transition-colors text-sm resize-none"
                />
              </div>
              <button type="submit" className="btn-neon w-full py-4 rounded-xl text-base">
                Отправить сообщение
              </button>
            </form>
          )}
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-display text-xl font-bold">
            <span className="text-gradient-pink">NEON</span>
            <span className="text-white"> SHOP</span>
          </div>
          <div className="flex gap-6 flex-wrap justify-center">
            {navLinks.map(link => (
              <button key={link} onClick={() => handleNav(link)} className="text-white/40 hover:text-white text-xs font-display uppercase tracking-widest transition-colors">
                {link}
              </button>
            ))}
          </div>
          <div className="text-white/30 text-xs">© 2026 NEON SHOP. Все права защищены</div>
        </div>
      </footer>
    </div>
  );
}
