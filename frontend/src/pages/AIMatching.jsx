import { useEffect, useRef, useState } from "react";
import useProfileStore from "../store/useProfileStore";
import useDocumentsStore from "../store/useDocumentsStore";
import useMatchStore from "../store/useMatchStore";
import Button from "../components/ui/Button";

const STEPS = [
  { label: "Checking GPA", delay: 400 },
  { label: "Checking Income Bracket", delay: 900 },
  { label: "Checking Region & Citizenship", delay: 1400 },
  { label: "Matching University Programs", delay: 1900 },
  { label: "Comparing Scholarship Requirements", delay: 2400 },
  { label: "Generating Match Scores...", delay: 3000 },
];

export default function AIMatching({ onComplete, onError }) {
  const [checked, setChecked] = useState([]);
  const [done, setDone] = useState(false);
  const [stillWorking, setStillWorking] = useState(false);

  const profile = useProfileStore((s) => s.profile);
  const reportCard = useDocumentsStore((s) => s.reportCard);
  const optional = useDocumentsStore((s) => s.optional);
  const documents = { reportCard, optional }; 
  const runMatch = useMatchStore((s) => s.runMatch);
  const apiStatus = useMatchStore((s) => s.status);
  const apiError = useMatchStore((s) => s.error);

  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    STEPS.forEach((s, i) => {
      setTimeout(() => setChecked((prev) => [...prev, i]), s.delay);
    });

    const stillWorkingTimer = setTimeout(() => setStillWorking(true), 4200);

    runMatch(profile, documents)
      .then(() => {
        clearTimeout(stillWorkingTimer);
        const elapsed = 3000;
        setTimeout(() => {
          setDone(true);
          setTimeout(onComplete, 500);
        }, elapsed);
      })
      .catch(() => {
        clearTimeout(stillWorkingTimer);
      });

    return () => clearTimeout(stillWorkingTimer);
  }, []);

  if (apiStatus === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-danger-soft">
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#DC2626"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        </div>
        <h1 className="font-display text-xl font-bold text-ink">
          We couldn't finish matching
        </h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
          {apiError}
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" onClick={onError}>
            Back to documents
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              startedRef.current = false;
              setChecked([]);
              setDone(false);
              setStillWorking(false);
              runMatch(profile, documents)
                .then(() => {
                  setDone(true);
                  setTimeout(onComplete, 400);
                })
                .catch(() => {});
            }}
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 py-10">
      <div className="mb-12 flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        </div>
        <span className="font-display text-xl font-bold text-ink">
          EaseKolar
        </span>
      </div>

      <div className="relative mb-10 h-[100px] w-[100px]">
        <div
          className={`flex h-[100px] w-[100px] items-center justify-center rounded-full bg-gradient-to-br from-primary via-primary-light to-blue-300 ${
            !done ? "animate-pulseRing" : ""
          }`}
        >
          {done ? (
            <svg
              width="44"
              height="44"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-checkTick"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a10 10 0 1 0 10 10" strokeDasharray="60">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 12 12"
                  to="360 12 12"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          )}
        </div>
      </div>

      <h1 className="text-center font-display text-[clamp(22px,5vw,28px)] font-extrabold tracking-tight text-ink">
        {done ? "Matches Ready!" : "Finding your scholarships..."}
      </h1>
      <p className="mb-10 mt-2 text-center text-[15px] text-ink-soft">
        {done
          ? "We found scholarships matched to your profile."
          : "EaseKolar is analyzing your profile against every scholarship in our database."}
      </p>

      <div className="flex w-full max-w-[400px] flex-col gap-3.5 rounded-2xl border border-line-soft bg-white p-6">
        {STEPS.map((step, i) => {
          const isChecked = checked.includes(i);
          const isLast = i === STEPS.length - 1;
          return (
            <div
              key={step.label}
              className={`flex items-center gap-3.5 transition-opacity duration-400 ${isChecked ? "opacity-100" : "opacity-35"}`}
            >
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors ${
                  isChecked
                    ? isLast && !done
                      ? "bg-warn"
                      : "bg-success"
                    : "bg-line-soft"
                }`}
              >
                {isChecked && (
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-checkTick"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </div>
              <span
                className={`text-sm ${isLast ? "font-display font-bold" : "font-medium"} ${isChecked ? "text-ink" : "text-ink-faint"}`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {stillWorking && !done && (
        <div className="mt-6 flex items-center gap-2 text-[13px] text-ink-soft animate-fadeIn">
          <div className="h-2 w-2 rounded-full bg-warn animate-pulseRing" />
          Reading your documents can take a little longer — hang tight...
        </div>
      )}
    </div>
  );
}
