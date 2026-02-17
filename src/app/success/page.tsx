'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { CheckCircle2, ArrowRight, Mail, Clock, Sparkles } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const searchId = searchParams.get('search_id');

  return (
    <div className="min-h-screen bg-grey-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-6 animate-fade-up">
          <CheckCircle2 className="w-10 h-10 text-teal" />
        </div>

        <h1 className="font-display text-3xl font-bold text-ink mb-3 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          Locked in.
        </h1>
        <p className="text-grey-500 mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Payment received. Our team is already working on your handles.
        </p>

        {/* What happens next */}
        <div className="bg-white rounded-lg border border-grey-200 p-6 text-left mb-8 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="font-display font-bold text-ink mb-4">What happens next?</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-violet/10 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-violet" />
              </div>
              <div>
                <p className="text-sm font-medium text-ink">Receipt in your inbox</p>
                <p className="text-xs text-grey-400">Order details and payment confirmation — check your email.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-violet/10 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-violet" />
              </div>
              <div>
                <p className="text-sm font-medium text-ink">Specialist assigned within 2 hours</p>
                <p className="text-xs text-grey-400">A real person reviewing your handles right now.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-violet/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-violet" />
              </div>
              <div>
                <p className="text-sm font-medium text-ink">Handles live within 24–72 hours</p>
                <p className="text-xs text-grey-400">You&apos;ll get an email each time a domain or handle is secured.</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push('/')}
          className="bg-violet text-white px-8 py-3 rounded-full font-semibold inline-flex items-center gap-2 hover:bg-violet-light transition animate-fade-up"
          style={{ animationDelay: '0.4s' }}
        >
          Search Another Brand <ArrowRight className="w-4 h-4" />
        </button>

        {sessionId && (
          <p className="text-xs text-grey-300 mt-6">
            Order ref: {sessionId.slice(0, 16)}...
          </p>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-violet border-t-transparent animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
