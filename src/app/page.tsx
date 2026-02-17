"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  CheckCircle,
  Rocket,
  ChevronDown,
  Globe,
  Instagram,
  Twitter,
  Youtube,
  ArrowRight,
} from "lucide-react";

const DOMAIN_TLDS = [".com", ".ai", ".io", ".co"];
const SOCIAL_PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: Instagram },
  { id: "tiktok", label: "TikTok", icon: Globe },
  { id: "x", label: "X", icon: Twitter },
  { id: "youtube", label: "YouTube", icon: Youtube },
];

const PRICING = [
  {
    tier: "audit",
    name: "Audit & Map",
    price: 97,
    popular: false,
    features: [
      "Every domain and handle, checked and mapped",
      "Which handles to claim first (and why)",
      "Alternative names if your first choice is taken",
      "PDF report delivered within 24 hours",
    ],
  },
  {
    tier: "concierge",
    name: "Full Concierge",
    price: 497,
    popular: true,
    features: [
      "Everything in Audit & Map",
      "We register every available domain for you",
      "Profiles created with your bio, photo, and header — ready to post",
      "Done within 5 business days",
    ],
  },
  {
    tier: "premium",
    name: "Premium Acquisition",
    price: 997,
    popular: false,
    features: [
      "Everything in Full Concierge",
      "Taken domains? We negotiate with the owner",
      "Custom outreach to handle squatters",
      "One person. Your person. Until it\u2019s done.",
    ],
  },
];

const FAQ_ITEMS = [
  {
    q: "How fast do you actually secure handles?",
    a: "Most orders ship within 5 business days. Premium domain acquisitions can take longer \u2014 we\u2019re negotiating with real humans, not bots.",
  },
  {
    q: "What if the domain I want is already taken?",
    a: "That\u2019s exactly what Premium Acquisition is for. We track down the owner, assess fair market value, and run the negotiation so you don\u2019t have to.",
  },
  {
    q: "Do you actually set up my profiles, or just claim the handles?",
    a: "We set them up. Bios, profile photos, header images, links \u2014 consistent across every platform. You log in and it\u2019s ready to go.",
  },
  {
    q: "Which email gets used for registrations?",
    a: "Your call. Use your existing business email or we\u2019ll create a fresh Gmail for your brand. We never store passwords \u2014 you share access securely after payment.",
  },
  {
    q: "Can I just get the report without the done-for-you service?",
    a: "Yes. The Audit & Map tier is a full availability report with strategic recommendations, delivered as a PDF within 24 hours. No execution, just the intel.",
  },
];

export default function Home() {
  const router = useRouter();
  const [brandName, setBrandName] = useState("");
  const [selectedTLDs, setSelectedTLDs] = useState<string[]>([
    ".com",
    ".ai",
    ".io",
    ".co",
  ]);
  const [selectedSocials, setSelectedSocials] = useState<string[]>([
    "instagram",
    "tiktok",
    "x",
    "youtube",
  ]);
  const [searching, setSearching] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleTLD = (tld: string) => {
    setSelectedTLDs((prev) =>
      prev.includes(tld) ? prev.filter((t) => t !== tld) : [...prev, tld]
    );
  };

  const toggleSocial = (id: string) => {
    setSelectedSocials((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSearch = async () => {
    if (!brandName.trim()) return;
    setSearching(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: brandName.trim(),
          tlds: selectedTLDs,
          socials: selectedSocials,
        }),
      });
      const data = await res.json();
      if (data.searchId) {
        sessionStorage.setItem(`search-${data.searchId}`, JSON.stringify(data));
        router.push(`/results/${data.searchId}`);
      }
    } catch (err) {
      console.error("Search failed:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-ink/[0.04] px-6 md:px-10 py-3.5 flex items-center justify-between">
        <div className="font-display font-bold text-lg tracking-tight">
          Handle<span className="text-violet">Hunter</span>
        </div>
        <div className="hidden md:flex gap-7">
          <a
            href="#how-it-works"
            className="text-xs font-medium uppercase tracking-widest opacity-35 hover:opacity-100 transition-opacity"
          >
            How It Works
          </a>
          <a
            href="#pricing"
            className="text-xs font-medium uppercase tracking-widest opacity-35 hover:opacity-100 transition-opacity"
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="text-xs font-medium uppercase tracking-widest opacity-35 hover:opacity-100 transition-opacity"
          >
            FAQ
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center bg-hero-gradient overflow-hidden px-5 pt-20 pb-16">
        {/* Floating orbs */}
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-violet/20 blur-[120px] animate-float" />
        <div className="absolute -bottom-[30%] -left-[10%] w-[500px] h-[500px] rounded-full bg-plum/15 blur-[120px] animate-float-delay-1" />
        <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full bg-violet-light/10 blur-[120px] animate-float-delay-2" />

        <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
          {/* Badge */}
          <div className="inline-block bg-white/[0.06] border border-white/[0.08] rounded-full px-5 py-1.5 text-[11px] font-medium uppercase tracking-[1.5px] mb-8 backdrop-blur-sm animate-fade-up opacity-0">
            Brand Handle Concierge
          </div>

          {/* Headline */}
          <h1
            className="font-display font-bold text-[clamp(40px,6vw,72px)] leading-[1.02] tracking-[-3px] mb-6 animate-fade-up opacity-0"
            style={{ animationDelay: "0.1s" }}
          >
            You own the brand.
            <br />
            Do you own the handles?
          </h1>

          {/* Subtitle */}
          <p
            className="text-[17px] font-light opacity-45 max-w-[520px] mx-auto leading-relaxed mb-10 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            One search checks every domain and social handle. Mark what&apos;s
            yours. We&apos;ll secure what&apos;s not.
          </p>

          {/* Search Input */}
          <div
            className="max-w-xl mx-auto animate-fade-up opacity-0"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex bg-white rounded-2xl overflow-hidden shadow-2xl shadow-black/20">
              <input
                type="text"
                placeholder="Enter your brand name..."
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 px-6 py-4 text-ink text-base outline-none placeholder:text-grey-300 font-body"
              />
              <button
                onClick={handleSearch}
                disabled={searching || !brandName.trim()}
                className="bg-violet hover:bg-[#6a4eff] text-white font-semibold px-6 py-4 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
              >
                {searching ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Hunt Handles <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>

            {/* Toggle pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              {DOMAIN_TLDS.map((tld) => (
                <button
                  key={tld}
                  onClick={() => toggleTLD(tld)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedTLDs.includes(tld)
                      ? "bg-white/20 text-white"
                      : "bg-white/[0.06] text-white/40 hover:bg-white/10"
                  }`}
                >
                  {tld}
                </button>
              ))}
              <div className="w-px h-4 bg-white/10 mx-1" />
              {SOCIAL_PLATFORMS.map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleSocial(p.id)}
                    className={`p-2 rounded-full transition-all ${
                      selectedSocials.includes(p.id)
                        ? "bg-white/20 text-white"
                        : "bg-white/[0.06] text-white/40 hover:bg-white/10"
                    }`}
                    title={p.label}
                  >
                    <Icon size={16} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/[0.12] rounded-xl flex justify-center">
            <div className="w-[3px] h-2 bg-white/30 rounded-full mt-1.5 animate-scroll-hint" />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 md:py-32 px-5 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-xs font-bold uppercase tracking-[2.5px] text-violet mb-3">
            How It Works
          </div>
          <h2 className="font-display font-bold text-[clamp(32px,4vw,48px)] tracking-[-2px] leading-tight">
            From &ldquo;is it taken?&rdquo;
            <br />
            to &ldquo;it&apos;s all mine&rdquo;
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              icon: Search,
              title: "Search Everything",
              desc: "Type your brand name. See every .com, .ai, .io, and social handle \u2014 checked in seconds, not hours.",
            },
            {
              icon: CheckCircle,
              title: "Mark & Select",
              desc: "Already own the .com? Mark it. Want the TikTok handle? Select it. Your dashboard, your decisions.",
            },
            {
              icon: Rocket,
              title: "We Handle It",
              desc: "Pick a package. Our team registers domains, claims handles, and sets up profiles. You don\u2019t lift a finger.",
            },
          ].map((step, i) => (
            <div
              key={i}
              className="bg-white border border-grey-100 rounded-[20px] p-9 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-ink/[0.06]"
            >
              <div className="w-12 h-12 rounded-xl bg-violet/[0.06] flex items-center justify-center text-violet mb-5">
                <step.icon size={22} />
              </div>
              <h3 className="font-display font-semibold text-lg tracking-tight mb-2.5">
                {step.title}
              </h3>
              <p className="text-sm text-grey-500 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto h-px bg-gradient-to-r from-transparent via-grey-200 to-transparent" />

      {/* PRICING */}
      <section id="pricing" className="py-24 md:py-32 px-5 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-xs font-bold uppercase tracking-[2.5px] text-violet mb-3">
            Pricing
          </div>
          <h2 className="font-display font-bold text-[clamp(32px,4vw,48px)] tracking-[-2px] leading-tight">
            Three ways to lock it down
          </h2>
          <p className="text-base text-grey-400 mt-3 max-w-md mx-auto">
            One payment. No subscriptions. No surprises.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {PRICING.map((p) => (
            <div
              key={p.tier}
              className={`relative rounded-[20px] p-8 transition-all duration-300 hover:-translate-y-1.5 ${
                p.popular
                  ? "bg-white border-2 border-violet shadow-xl shadow-violet/10"
                  : "bg-white border border-grey-100 hover:shadow-lg hover:shadow-ink/[0.04]"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="font-display font-semibold text-lg mb-1">
                {p.name}
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-display font-bold text-4xl tracking-tight">
                  ${p.price}
                </span>
                <span className="text-sm text-grey-400">one-time</span>
              </div>
              <ul className="space-y-3 mb-8">
                {p.features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-grey-500"
                  >
                    <CheckCircle
                      size={16}
                      className="text-teal mt-0.5 flex-shrink-0"
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`block text-center py-3 px-6 rounded-full font-semibold text-sm transition-all hover:-translate-y-0.5 ${
                  p.popular
                    ? "bg-violet text-white hover:bg-[#6a4eff] hover:shadow-lg hover:shadow-violet/30"
                    : p.tier === "premium"
                    ? "bg-ink text-white hover:shadow-lg hover:shadow-ink/20"
                    : "border-[1.5px] border-grey-200 text-ink hover:border-violet hover:text-violet"
                }`}
              >
                Start Your Search <span className="ml-1">&rarr;</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-6xl mx-auto h-px bg-gradient-to-r from-transparent via-grey-200 to-transparent" />

      {/* FAQ */}
      <section id="faq" className="py-24 md:py-32 px-5 max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-xs font-bold uppercase tracking-[2.5px] text-violet mb-3">
            FAQ
          </div>
          <h2 className="font-display font-bold text-[clamp(32px,4vw,48px)] tracking-[-2px] leading-tight">
            You&apos;re probably wondering
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, i) => (
            <div
              key={i}
              className="bg-grey-50 border border-grey-100 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-display font-semibold text-base pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  size={20}
                  className={`text-grey-400 flex-shrink-0 transition-transform duration-300 ${
                    openFAQ === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ${
                  openFAQ === i
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm text-grey-500 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-ink text-white py-20 px-5 text-center">
        <div className="font-display font-bold text-4xl tracking-[-2px] mb-2">
          Handle<span className="text-violet">Hunter</span>
        </div>
        <p className="text-xs opacity-20 mb-8">A Creator Genius Product</p>
        <div className="flex justify-center gap-6 text-xs opacity-30 mb-6">
          <a href="#" className="hover:opacity-70 transition-opacity">
            Privacy Policy
          </a>
          <a href="#" className="hover:opacity-70 transition-opacity">
            Terms of Service
          </a>
        </div>
        <p className="text-[11px] opacity-15">
          &copy; 2026 HandleHunter.ai
        </p>
      </footer>
    </div>
  );
}
