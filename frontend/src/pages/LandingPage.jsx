import { useState } from "react";
import Button from "../components/ui/Button";

const NAV_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
];

const FEATURES = [
  {
    title: 'EaseScholar Matching',
    desc: 'Instantly compares your profile with scholarship requirements to help you discover opportunities you are eligible for.',
    icon: (
      <>
        <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
        <circle cx="12" cy="12" r="4" />
      </>
    ),
  },
  {
    title: 'Verified Scholarship Database',
    desc: 'Browse updated government, university, and private scholarships in one trusted platform.',
    icon: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </>
    ),
  },
  {
    title: 'Eligibility Checker',
    desc: 'Quickly see which scholarships you qualify for, what requirements you are missing, and where to apply next.',
    icon: (
      <>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </>
    ),
  },
]

const STATS = [
  { value: "500+", label: "Scholarships tracked" },
  { value: "17", label: "Regions covered" },
  { value: "<4s", label: "To generate your matches" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Tell us about you",
    desc: "Region, school, GPA, and income bracket — a few short steps, no essays required.",
  },
  {
    step: "02",
    title: "Add documents",
    desc: 'Optional — moves matches from "Missing Requirements" to "Eligible."',
  },
  {
    step: "03",
    title: "Get matched instantly",
    desc: "See exactly which scholarships you qualify for.",
  },
];

const DOC_TRUST_ITEMS = [
  "Report Card / SF9",
  "BIR ITR",
  "Certificate of Indigency",
  "National ID",
];

const ABOUT_CHECKLIST = [
  "Checked against CHED, DOST & university scholarships",
  "Eligible, Missing Requirements, or Not Eligible — always specific",
  "You apply on the scholarship's own official page, not on EaseKolar",
];

export default function LandingPage({ onStart }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div id="top" className="min-h-screen bg-bg">
      {/* Nav — glass */}
      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/70 shadow-[0_1px_0_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)] backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5">
          <a href="#top" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-dark">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-ink">
              EaseKolar
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={onStart}
              className="hidden sm:inline-flex"
            >
              Find My Scholarships
            </Button>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg text-ink transition-colors hover:bg-ink/5 md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                {menuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-line-soft bg-white/95 px-5 py-4 backdrop-blur-xl md:hidden animate-fadeIn">
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-medium text-ink-soft"
                >
                  {l.label}
                </a>
              ))}
              <Button
                variant="primary"
                size="md"
                onClick={onStart}
                className="w-full"
              >
                Find My Scholarships
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero — fully centered */}
      <section className="relative mx-auto max-w-[720px] overflow-hidden px-5 pb-10 pt-16 text-center sm:pt-24">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary-soft/60 blur-3xl" />

        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line-soft bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-ink-soft backdrop-blur-sm">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
          </span>
          Built for students in all 17 regions of the Philippines
        </div>

        <h1 className="font-display text-[clamp(43px,10vw,60px)] font-extrabold leading-[1.1] tracking-tight text-ink">
          Find Scholarships That Match You.
        </h1>
        <p className="mx-auto mt-5 max-w-[600px] text-[18px] leading-relaxed text-ink-soft">
          Stop searching through hundreds of scholarship websites. Tell us about
          yourself and instantly discover scholarships you actually qualify for.
        </p>
        <div className="mt-8 flex items-center justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={onStart}
            className="w-full sm:w-auto"
          >
            Find My Scholarships →
          </Button>
        </div>

        <div className="mx-auto mt-12 flex max-w-[480px] items-center justify-center divide-x divide-line-soft rounded-2xl border border-line-soft bg-white/70 py-4 backdrop-blur-sm">
          {STATS.map((s) => (
            <div key={s.label} className="flex-1 px-2">
              <p className="font-display text-xl font-extrabold text-ink sm:text-2xl">
                {s.value}
              </p>
              <p className="mt-0.5 text-[11px] leading-tight text-ink-faint sm:text-xs">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto px-40 py-20 bg-white">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-line-soft bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-16px_rgba(15,23,42,0.15)]"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {f.icon}
                </svg>
              </div>
              <h3 className="font-display text-base font-bold text-ink">
                {f.title}
              </h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink-soft">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works — connected horizontal timeline */}
      <section id="how-it-works" className="mx-auto max-w-[1200px] px-5 py-16">
        <div className="mx-auto max-w-[560px] text-center">
          <h2 className="font-display text-[clamp(22px,4vw,30px)] font-extrabold tracking-tight text-ink">
            How EaseKolar works
          </h2>
          <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">
            Three steps between you and a clear answer on where you stand.
          </p>
        </div>

        <div className="relative mx-auto mt-12 max-w-[900px]">
          {/* connecting line — desktop only */}
          <div className="absolute left-0 right-0 top-5 hidden h-px bg-line-soft sm:block" />

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {HOW_IT_WORKS.map((s) => (
              <div
                key={s.step}
                className="relative flex flex-col items-center text-center sm:items-center"
              >
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary font-display text-sm font-extrabold text-white ring-4 ring-bg">
                  {s.step}
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-ink">
                  {s.title}
                </h3>
                <p className="mt-1.5 max-w-[220px] text-[13.5px] leading-relaxed text-ink-soft">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About — two-column split: narrative left, verification checklist right */}
      <section id="about" className="border-y border-line-soft bg-white">
        <div className="mx-auto max-w-[1200px] px-5 py-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <h2 className="font-display text-[clamp(22px,4vw,30px)] font-extrabold tracking-tight text-ink">
                What is EaseKolar?
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                A scholarship-matching tool built for Filipino students — one
                profile in, every scholarship checked.
              </p>
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  onStart();
                }}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
              >
                Start your profile →
              </a>
            </div>

            <div className="rounded-2xl border border-line-soft bg-bg p-6">
              <ul className="flex flex-col gap-4">
                {ABOUT_CHECKLIST.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success">
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    <span className="text-[14px] leading-relaxed text-ink">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 border-t border-line-soft pt-5">
                <div className="flex items-center gap-2 text-ink-soft">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 text-primary"
                  >
                    <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
                  </svg>
                  <p className="text-[12.5px] leading-relaxed">
                    Your data is not saved or stored — never shared without
                    consent.
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {DOC_TRUST_ITEMS.map((d) => (
                    <span
                      key={d}
                      className="rounded-full border border-line-soft bg-white px-2.5 py-1 text-[11px] font-medium text-ink-faint"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white">
        <div className="mx-auto max-w-[1200px] px-5 py-10">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-dark">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                </span>
                <span className="font-display text-base font-bold text-ink">
                  EaseKolar
                </span>
              </div>
              <p className="mt-2 max-w-[280px] text-[12.5px] leading-relaxed text-ink-faint">
                Helping Filipino students find scholarships they actually
                qualify for — no forms filled out on our end, just clarity
                before you apply.
              </p>
            </div>

            <div className="flex gap-10 text-[13px]">
              <div className="flex flex-col gap-2.5 text-center sm:text-left">
                <span className="font-semibold text-ink">Product</span>
                <a
                  href="#how-it-works"
                  className="text-ink-faint hover:text-ink-soft"
                >
                  How It Works
                </a>
                <a href="#about" className="text-ink-faint hover:text-ink-soft">
                  About
                </a>
              </div>
              {/* <div className="flex flex-col gap-2.5 text-center sm:text-left">
                <span className="font-semibold text-ink">Legal</span>
                <a href="#" className="text-ink-faint hover:text-ink-soft">
                  Privacy Policy
                </a>
                <a href="#" className="text-ink-faint hover:text-ink-soft">
                  Terms of Use
                </a>
              </div> */}
            </div>
          </div>

          <div className="mt-8 border-t border-line-soft pt-5 text-center text-[12px] text-ink-faint">
            © {new Date().getFullYear()} EaseKolar. Built for Filipino students.
          </div>
        </div>
      </footer>
    </div>
  );
}
