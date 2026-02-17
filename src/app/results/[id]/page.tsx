'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ResultItem, TIERS, TierKey } from '@/lib/types';
import {
  Globe,
  Instagram,
  AtSign,
  Youtube,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldCheck,
  Lock,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Loader2,
  Mail,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

/* ─── Icon helper ────────────────────────────────────────────── */
function PlatformIcon({ platform, className }: { platform: string; className?: string }) {
  switch (platform) {
    case 'instagram': return <Instagram className={className} />;
    case 'youtube': return <Youtube className={className} />;
    case 'tiktok': return <AtSign className={className} />;
    case 'x': return <AtSign className={className} />;
    default: return <Globe className={className} />;
  }
}

function StatusBadge({ available }: { available: boolean | null }) {
  if (available === true) return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
      <CheckCircle2 className="w-3 h-3" /> Available
    </span>
  );
  if (available === false) return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
      <XCircle className="w-3 h-3" /> Taken
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-grey-500 bg-grey-100 px-2 py-0.5 rounded-full">
      <HelpCircle className="w-3 h-3" /> Unknown
    </span>
  );
}

/* ─── Step types ─────────────────────────────────────────────── */
type Step = 'results' | 'email' | 'tier' | 'notes' | 'review';

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const searchId = params.id as string;

  const [results, setResults] = useState<ResultItem[]>([]);
  const [brandName, setBrandName] = useState('');
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>('results');

  // Checkout state
  const [customerEmail, setCustomerEmail] = useState('');
  const [emailType, setEmailType] = useState<'existing' | 'new_gmail'>('existing');
  const [preferredEmail, setPreferredEmail] = useState('');
  const [selectedTier, setSelectedTier] = useState<TierKey>('concierge');
  const [intakeNotes, setIntakeNotes] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Fetch results
  useEffect(() => {
    const stored = sessionStorage.getItem(`search-${searchId}`);
    if (stored) {
      const data = JSON.parse(stored);
      setResults(data.results || []);
      setBrandName(data.brandName || '');
      setLoading(false);
    } else {
      // TODO: fetch from Supabase by searchId for shared URLs
      setLoading(false);
    }
  }, [searchId]);

  const toggleOwned = useCallback((idx: number) => {
    setResults((prev) => prev.map((r, i) =>
      i === idx ? { ...r, owned: !r.owned, selected: r.owned ? r.selected : false } : r
    ));
  }, []);

  const toggleSelected = useCallback((idx: number) => {
    setResults((prev) => prev.map((r, i) =>
      i === idx ? { ...r, selected: !r.selected } : r
    ));
  }, []);

  const selectedItems = results.filter((r) => r.selected);
  const ownedCount = results.filter((r) => r.owned).length;
  const domains = results.filter((r) => r.type === 'domain');
  const socials = results.filter((r) => r.type === 'social');

  const handleCheckout = async () => {
    if (!customerEmail) return;
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchId,
          tier: selectedTier,
          customerEmail,
          selectedItems,
          preferredEmail,
          emailType,
          intakeNotes,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet" />
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-8">
        <h1 className="font-display text-2xl font-bold text-ink">No results found</h1>
        <p className="text-grey-500">This search may have expired or the link is invalid.</p>
        <button onClick={() => router.push('/')} className="bg-violet text-white px-6 py-3 rounded-full font-semibold hover:bg-violet-light transition">
          Start New Search
        </button>
      </div>
    );
  }

  /* ─── STEP: Results Grid ───────────────────────────────────── */
  if (step === 'results') {
    return (
      <div className="min-h-screen bg-grey-50">
        {/* Header */}
        <header className="bg-white border-b border-grey-200 sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <button onClick={() => router.push('/')} className="text-grey-400 hover:text-ink text-sm flex items-center gap-1 mb-1">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <h1 className="font-display text-xl font-bold text-ink">
                Results for &ldquo;{brandName}&rdquo;
              </h1>
              <p className="text-sm text-grey-500">{results.length} handles checked · {ownedCount} marked as owned</p>
            </div>
            <button
              onClick={() => selectedItems.length > 0 ? setStep('email') : null}
              disabled={selectedItems.length === 0}
              className="bg-violet text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-violet-light transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Secure {selectedItems.length} Handle{selectedItems.length !== 1 ? 's' : ''} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-8">
          {/* Domains Section */}
          {domains.length > 0 && (
            <section className="mb-10">
              <h2 className="font-display text-lg font-bold text-ink mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-violet" /> Domains
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {domains.map((item, idx) => {
                  const globalIdx = results.indexOf(item);
                  return (
                    <div
                      key={`domain-${idx}`}
                      className={`bg-white rounded-md border p-4 transition-all ${
                        item.selected ? 'border-violet ring-2 ring-violet/20' :
                        item.owned ? 'border-teal ring-2 ring-teal/20' :
                        'border-grey-200 hover:border-grey-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-mono text-sm font-medium text-ink">{item.name}</p>
                          {item.notes && <p className="text-xs text-grey-400 mt-0.5">{item.notes}</p>}
                        </div>
                        <StatusBadge available={item.available} />
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => toggleOwned(globalIdx)}
                          className={`flex-1 text-xs py-1.5 rounded-full font-medium transition ${
                            item.owned
                              ? 'bg-teal/10 text-teal border border-teal'
                              : 'bg-grey-100 text-grey-500 hover:bg-grey-200'
                          }`}
                        >
                          <ShieldCheck className="w-3 h-3 inline mr-1" />
                          {item.owned ? 'I Own This' : 'I Own'}
                        </button>
                        <button
                          onClick={() => toggleSelected(globalIdx)}
                          disabled={item.owned}
                          className={`flex-1 text-xs py-1.5 rounded-full font-medium transition ${
                            item.selected
                              ? 'bg-violet/10 text-violet border border-violet'
                              : 'bg-grey-100 text-grey-500 hover:bg-grey-200'
                          } ${item.owned ? 'opacity-40 cursor-not-allowed' : ''}`}
                        >
                          <Lock className="w-3 h-3 inline mr-1" />
                          {item.selected ? 'Selected' : 'Secure'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Socials Section */}
          {socials.length > 0 && (
            <section className="mb-10">
              <h2 className="font-display text-lg font-bold text-ink mb-4 flex items-center gap-2">
                <AtSign className="w-5 h-5 text-violet" /> Social Handles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {socials.map((item, idx) => {
                  const globalIdx = results.indexOf(item);
                  return (
                    <div
                      key={`social-${idx}`}
                      className={`bg-white rounded-md border p-4 transition-all ${
                        item.selected ? 'border-violet ring-2 ring-violet/20' :
                        item.owned ? 'border-teal ring-2 ring-teal/20' :
                        'border-grey-200 hover:border-grey-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <PlatformIcon platform={item.platform} className="w-4 h-4 text-grey-400" />
                          <div>
                            <p className="font-mono text-sm font-medium text-ink">{item.name}</p>
                            <p className="text-xs text-grey-400 capitalize">{item.platform}</p>
                          </div>
                        </div>
                        <StatusBadge available={item.available} />
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => toggleOwned(globalIdx)}
                          className={`flex-1 text-xs py-1.5 rounded-full font-medium transition ${
                            item.owned
                              ? 'bg-teal/10 text-teal border border-teal'
                              : 'bg-grey-100 text-grey-500 hover:bg-grey-200'
                          }`}
                        >
                          <ShieldCheck className="w-3 h-3 inline mr-1" />
                          {item.owned ? 'I Own This' : 'I Own'}
                        </button>
                        <button
                          onClick={() => toggleSelected(globalIdx)}
                          disabled={item.owned}
                          className={`flex-1 text-xs py-1.5 rounded-full font-medium transition ${
                            item.selected
                              ? 'bg-violet/10 text-violet border border-violet'
                              : 'bg-grey-100 text-grey-500 hover:bg-grey-200'
                          } ${item.owned ? 'opacity-40 cursor-not-allowed' : ''}`}
                        >
                          <Lock className="w-3 h-3 inline mr-1" />
                          {item.selected ? 'Selected' : 'Secure'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </main>

        {/* Sticky bottom bar */}
        {selectedItems.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-grey-200 shadow-lg z-40 animate-slide-up">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-ink">{selectedItems.length} handle{selectedItems.length !== 1 ? 's' : ''} selected</p>
                <p className="text-xs text-grey-400">Starting at ${TIERS.audit.price}</p>
              </div>
              <button
                onClick={() => setStep('email')}
                className="bg-violet text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-violet-light transition"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ─── STEP: Email Identity ──────────────────────────────────── */
  if (step === 'email') {
    return (
      <div className="min-h-screen bg-grey-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg border border-grey-200 shadow-sm max-w-lg w-full p-8">
          <button onClick={() => setStep('results')} className="text-grey-400 hover:text-ink text-sm flex items-center gap-1 mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to results
          </button>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-violet/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-violet" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-ink">Email Identity</h2>
              <p className="text-sm text-grey-500">Which email should we use to set things up?</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <label className="block">
              <span className="text-sm font-medium text-ink">Your email (for order confirmation)</span>
              <input
                type="email"
                placeholder="you@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="mt-1 w-full border border-grey-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet"
              />
            </label>

            <div className="border border-grey-200 rounded-md overflow-hidden">
              <button
                onClick={() => setEmailType('existing')}
                className={`w-full text-left px-4 py-3 text-sm transition ${emailType === 'existing' ? 'bg-violet/5 border-l-2 border-violet' : 'hover:bg-grey-50'}`}
              >
                <span className="font-medium">Use my existing business email</span>
                <p className="text-xs text-grey-400 mt-0.5">Best if you already have domain email (e.g. hello@yourbrand.com)</p>
              </button>
              {emailType === 'existing' && (
                <div className="px-4 pb-3">
                  <input
                    type="email"
                    placeholder="socials@yourdomain.com"
                    value={preferredEmail}
                    onChange={(e) => setPreferredEmail(e.target.value)}
                    className="w-full border border-grey-200 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet"
                  />
                </div>
              )}
              <button
                onClick={() => { setEmailType('new_gmail'); setPreferredEmail(''); }}
                className={`w-full text-left px-4 py-3 text-sm border-t border-grey-100 transition ${emailType === 'new_gmail' ? 'bg-violet/5 border-l-2 border-violet' : 'hover:bg-grey-50'}`}
              >
                <span className="font-medium">Create a new Gmail for me</span>
                <p className="text-xs text-grey-400 mt-0.5">We&apos;ll set up a fresh gmail.com address for your brand</p>
              </button>
            </div>
          </div>

          <button
            onClick={() => customerEmail ? setStep('tier') : null}
            disabled={!customerEmail}
            className="w-full bg-violet text-white py-3 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-violet-light transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  /* ─── STEP: Tier Selection ──────────────────────────────────── */
  if (step === 'tier') {
    const tiers: { key: TierKey; icon: React.ReactNode; features: string[] }[] = [
      {
        key: 'audit',
        icon: <CheckCircle2 className="w-6 h-6" />,
        features: ['Full search report', 'Availability map', 'Strategy recommendations PDF', 'Report only \u2014 no execution'],
      },
      {
        key: 'concierge',
        icon: <Sparkles className="w-6 h-6" />,
        features: ['Everything in Audit', 'We register every available domain', 'We claim every social handle', 'Profiles set up with bios, headers, links'],
      },
      {
        key: 'premium',
        icon: <Lock className="w-6 h-6" />,
        features: ['Everything in Concierge', 'We negotiate with domain owners', 'Handle acquisition outreach', 'Priority 48-hour turnaround'],
      },
    ];

    return (
      <div className="min-h-screen bg-grey-50 flex items-center justify-center p-6">
        <div className="max-w-3xl w-full">
          <button onClick={() => setStep('email')} className="text-grey-400 hover:text-ink text-sm flex items-center gap-1 mb-6">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h2 className="font-display text-2xl font-bold text-ink mb-2">Pick your level</h2>
          <p className="text-grey-500 mb-8">Report only, full done-for-you, or premium acquisition.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {tiers.map((t) => (
              <button
                key={t.key}
                onClick={() => setSelectedTier(t.key)}
                className={`text-left p-6 rounded-lg border-2 transition-all ${
                  selectedTier === t.key
                    ? 'border-violet bg-violet/5 shadow-md'
                    : 'border-grey-200 bg-white hover:border-grey-300'
                }`}
              >
                <div className={`mb-3 ${selectedTier === t.key ? 'text-violet' : 'text-grey-400'}`}>
                  {t.icon}
                </div>
                <h3 className="font-display font-bold text-ink">{TIERS[t.key].name}</h3>
                <p className="text-2xl font-bold text-ink mt-1">${TIERS[t.key].price}</p>
                <ul className="mt-4 space-y-2">
                  {t.features.map((f, i) => (
                    <li key={i} className="text-xs text-grey-500 flex items-start gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-teal mt-0.5 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>

          <button
            onClick={() => setStep('notes')}
            className="w-full bg-violet text-white py-3 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-violet-light transition"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  /* ─── STEP: Intake Notes ────────────────────────────────────── */
  if (step === 'notes') {
    return (
      <div className="min-h-screen bg-grey-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg border border-grey-200 shadow-sm max-w-lg w-full p-8">
          <button onClick={() => setStep('tier')} className="text-grey-400 hover:text-ink text-sm flex items-center gap-1 mb-6">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-violet/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-violet" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-ink">Anything else?</h2>
              <p className="text-sm text-grey-500">Tell us about your brand so we can set things up perfectly.</p>
            </div>
          </div>

          <textarea
            value={intakeNotes}
            onChange={(e) => setIntakeNotes(e.target.value)}
            placeholder="E.g., I want consistent branding across all platforms. Priority is the .ai domain and Instagram handle. My brand colors are purple and gold..."
            rows={5}
            className="w-full border border-grey-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet/30 focus:border-violet resize-none mb-6"
          />

          <button
            onClick={() => setStep('review')}
            className="w-full bg-violet text-white py-3 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-violet-light transition"
          >
            Review Order <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  /* ─── STEP: Review & Pay ────────────────────────────────────── */
  if (step === 'review') {
    const tierData = TIERS[selectedTier];
    return (
      <div className="min-h-screen bg-grey-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg border border-grey-200 shadow-sm max-w-lg w-full p-8">
          <button onClick={() => setStep('notes')} className="text-grey-400 hover:text-ink text-sm flex items-center gap-1 mb-6">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h2 className="font-display text-xl font-bold text-ink mb-6">Review Your Order</h2>

          <div className="space-y-4 mb-6">
            <div className="bg-grey-50 rounded-md p-4">
              <p className="text-xs text-grey-400 uppercase tracking-wide mb-1">Package</p>
              <p className="font-semibold text-ink">{tierData.name} — ${tierData.price}</p>
            </div>
            <div className="bg-grey-50 rounded-md p-4">
              <p className="text-xs text-grey-400 uppercase tracking-wide mb-1">Handles to Secure ({selectedItems.length})</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {selectedItems.map((item, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-white border border-grey-200 rounded-full px-2.5 py-1 text-xs font-mono">
                    <PlatformIcon platform={item.platform} className="w-3 h-3 text-grey-400" />
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-grey-50 rounded-md p-4">
              <p className="text-xs text-grey-400 uppercase tracking-wide mb-1">Email</p>
              <p className="text-sm text-ink">{customerEmail}</p>
              {preferredEmail && <p className="text-xs text-grey-500 mt-0.5">Preferred: {preferredEmail}</p>}
              {emailType === 'new_gmail' && <p className="text-xs text-grey-500 mt-0.5">We&apos;ll create a new Gmail for your brand</p>}
            </div>
            {intakeNotes && (
              <div className="bg-grey-50 rounded-md p-4">
                <p className="text-xs text-grey-400 uppercase tracking-wide mb-1">Notes</p>
                <p className="text-sm text-grey-500">{intakeNotes}</p>
              </div>
            )}
          </div>

          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="w-full bg-violet text-white py-3 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-violet-light transition disabled:opacity-70"
          >
            {checkoutLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
            ) : (
              <>Pay ${tierData.price} <ArrowRight className="w-4 h-4" /></>
            )}
          </button>

          <p className="text-xs text-grey-400 text-center mt-4">
            Secure checkout powered by Stripe. You&apos;ll be redirected to complete payment.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
