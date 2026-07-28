import { useState } from 'react'
import Button from '../components/ui/Button'

const NAV_LINKS = ['Home', 'Browse Scholarships', 'How It Works', 'About']

const FEATURES = [
  {
    title: 'AI Matching',
    desc: 'Your profile is checked against every scholarship in our database in seconds — not hours of manual searching.',
    icon: (
      <>
        <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
        <circle cx="12" cy="12" r="4" />
      </>
    ),
  },
  {
    title: 'Verified Scholarship Database',
    desc: 'Government tracks like CHED and DOST, plus university-provided scholarships, kept up to date.',
    icon: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </>
    ),
  },
  {
    title: 'Fast Eligibility Checker',
    desc: 'See exactly where you stand per scholarship — eligible, missing a document, or not a fit — before you invest time applying.',
    icon: (
      <>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </>
    ),
  },
]

export default function LandingPage({ onStart, onBrowse }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-bg">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-line-soft bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5">
          <span className="font-display text-lg font-bold text-ink">EaseKolar</span>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((l) => (
              <a key={l} href="#" className="text-sm font-medium text-ink-soft transition-colors hover:text-ink">
                {l}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="primary" size="md" onClick={onStart} className="hidden sm:inline-flex">
              Find My Scholarships
            </Button>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg text-ink md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-line-soft bg-white px-5 py-4 md:hidden animate-fadeIn">
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((l) => (
                <a key={l} href="#" className="text-sm font-medium text-ink-soft">
                  {l}
                </a>
              ))}
              <Button variant="primary" size="md" onClick={onStart} className="w-full">
                Find My Scholarships
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero — fully centered */}
      <section className="mx-auto max-w-[720px] px-5 pb-16 pt-16 text-center sm:pt-24">
        <h1 className="font-display text-[clamp(30px,7vw,48px)] font-extrabold leading-[1.1] tracking-tight text-ink">
          Find Scholarships That Match You.
        </h1>
        <p className="mx-auto mt-5 max-w-[520px] text-[16px] leading-relaxed text-ink-soft">
          Stop searching through hundreds of scholarship websites. Tell us about yourself and instantly discover
          scholarships you actually qualify for.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button variant="primary" size="lg" onClick={onStart} className="w-full sm:w-auto">
            Find My Scholarships →
          </Button>
          <Button variant="secondary" size="lg" onClick={onBrowse} className="w-full sm:w-auto">
            Browse Scholarships
          </Button>
        </div>
      </section>

      {/* Feature cards */}
      <section className="mx-auto max-w-[1200px] px-5 pb-14">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-line-soft bg-white p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {f.icon}
                </svg>
              </div>
              <h3 className="font-display text-base font-bold text-ink">{f.title}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section className="mx-auto max-w-[1200px] px-5 pb-20">
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-line-soft bg-white px-6 py-5 text-center">
          <div className="flex items-center gap-2 text-ink-soft">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
            </svg>
            <p className="text-[13px]">
              Your information is encrypted and never shared without consent — see our{' '}
              <a href="#" className="font-semibold text-primary">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}