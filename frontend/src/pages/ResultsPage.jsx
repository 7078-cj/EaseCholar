import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  LayoutGrid,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Check,
} from "lucide-react";
import useMatchStore from "../store/useMatchStore";
import TopBar from "../components/layout/TopBar";
import ScholarshipCard from "../components/results/ScholarshipCard";
import BottomSheet from "../components/ui/BottomSheet";
import InfoBanner from "../components/ui/InfoBanner";
import Button from "../components/ui/Button";

const STATUS_TABS = [
  {
    key: "all",
    label: "All",
    icon: LayoutGrid,
    activeClass: "border-primary bg-primary text-white",
  },
  {
    key: "eligible",
    label: "Eligible",
    icon: CheckCircle2,
    activeClass: "border-success bg-success text-white",
  },
  {
    key: "missing",
    label: "Missing Requirements",
    icon: AlertTriangle,
    activeClass: "border-warn bg-warn text-white",
  },
  {
    key: "not-eligible",
    label: "Not Eligible",
    icon: XCircle,
    activeClass: "border-danger bg-danger text-white",
  },
];

// Only sorts backed by data the backend actually returns — no fabricated
// deadline/amount fields (the Scholarship model doesn't have them yet).
const SORT_OPTIONS = [
  { key: "match", label: "Highest Match" },
  { key: "location", label: "Location (Region)" },
  { key: "name", label: "Scholarship Name (A–Z)" },
];

export default function ResultsPage({ onSelect, onBack, onAddDocuments }) {
  const results = useMatchStore((s) => s.results);
  const status = useMatchStore((s) => s.status);
  const needsReview = useMatchStore((s) => s.needsReview);
  const reviewMessage = useMatchStore((s) => s.reviewMessage);

  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState("match");
  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = useMemo(() => {
    let list =
      statusFilter === "all"
        ? results
        : results.filter((r) => r.status === statusFilter);
    list = [...list].sort((a, b) => {
      if (sortKey === "match") return b.matchPercent - a.matchPercent;
      if (sortKey === "location")
        return (a.region || "").localeCompare(b.region || "");
      if (sortKey === "name") return a.name.localeCompare(b.name);
      return 0;
    });
    return list;
  }, [results, statusFilter, sortKey]);

  const counts = useMemo(
    () => ({
      eligible: results.filter((r) => r.status === "eligible").length,
      missing: results.filter((r) => r.status === "missing").length,
      "not-eligible": results.filter((r) => r.status === "not-eligible").length,
    }),
    [results],
  );

  const activeSortLabel = SORT_OPTIONS.find((o) => o.key === sortKey)?.label;

  return (
    <div className="min-h-screen bg-bg">
      <TopBar
        onBack={onBack}
        right={
          <button
            onClick={() => setSheetOpen(true)}
            className="flex min-h-[40px] items-center gap-1.5 rounded-full border border-line-soft bg-white px-3.5 py-2 text-[13px] font-semibold text-ink shadow-sm transition-colors hover:border-primary hover:text-primary"
          >
            <ArrowUpDown size={14} strokeWidth={2.5} />
            Sort
          </button>
        }
      />

      <div className="mx-auto max-w-[1200px] px-5 pb-16 pt-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">
          Your Scholarship Matches
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          {results.length} scholarship{results.length !== 1 ? "s" : ""} checked
          against your profile
          {sortKey !== "match" && <> · sorted by {activeSortLabel}</>}
        </p>
        {needsReview && reviewMessage && (
          <div className="mt-4">
            <InfoBanner tone="warn" title="Double-check your details">
              {reviewMessage}
            </InfoBanner>
          </div>
        )}
        {/* Summary counts */}
        {results.length > 0 && (
          <div className="mt-5 grid grid-cols-3 gap-2.5">
            <div className="rounded-xl border border-success-border bg-success-soft px-3 py-2.5 text-center">
              <p className="font-display text-lg font-extrabold text-success-text">
                {counts.eligible}
              </p>
              <p className="text-[11px] font-medium leading-tight text-success-text">
                Eligible
              </p>
            </div>
            <div className="rounded-xl border border-warn-border bg-warn-soft px-3 py-2.5 text-center">
              <p className="font-display text-lg font-extrabold text-warn-text">
                {counts.missing}
              </p>
              <p className="text-[11px] font-medium leading-tight text-warn-text">
                Missing Reqs
              </p>
            </div>
            <div className="rounded-xl border border-danger-border bg-danger-soft px-3 py-2.5 text-center">
              <p className="font-display text-lg font-extrabold text-danger-text">
                {counts["not-eligible"]}
              </p>
              <p className="text-[11px] font-medium leading-tight text-danger-text">
                Not Eligible
              </p>
            </div>
          </div>
        )}
        
        {/* Status filter chips — horizontally scrollable, never wraps the layout */}
        <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
          {STATUS_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                  isActive
                    ? tab.activeClass
                    : "border-line bg-white text-ink-soft hover:border-ink-faint/40"
                }`}
              >
                <Icon size={14} strokeWidth={2.5} />
                {tab.label}
                {tab.key !== "all" && counts[tab.key] > 0 && (
                  <span
                    className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${isActive ? "bg-white/25" : "bg-bg text-ink-faint"}`}
                  >
                    {counts[tab.key]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {status === "loading" && (
          <p className="mt-10 text-center text-sm text-ink-soft">
            Loading your matches...
          </p>
        )}
        {status === "success" &&
          filtered.length === 0 &&
          results.length > 0 && (
            <div className="mt-10 rounded-2xl border border-line-soft bg-white p-6 text-center">
              <p className="text-sm font-semibold text-ink">
                No scholarships in this filter yet
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                Try a different tab, or view all results.
              </p>
              <Button
                variant="secondary"
                size="md"
                className="mt-4"
                onClick={() => setStatusFilter("all")}
              >
                View all results
              </Button>
            </div>
          )}
        {status === "success" && results.length === 0 && (
          <div className="mt-10 rounded-2xl border border-line-soft bg-white p-6 text-center">
            <p className="text-sm font-semibold text-ink">
              No exact matches yet
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              We couldn't find scholarships in our database right now. Check
              back soon, or refine your profile.
            </p>
          </div>
        )}
        {filtered.length > 0 && (
          <div className="mt-6 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <ScholarshipCard
                key={s.id}
                scholarship={s}
                onViewDetails={onSelect}
                onAddDocuments={onAddDocuments}
              />
            ))}
          </div>
        )}
      </div>

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Sort by"
      >
        <div className="flex flex-col gap-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => {
                setSortKey(opt.key);
                setSheetOpen(false);
              }}
              className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-left text-[15px] font-medium ${
                sortKey === opt.key
                  ? "bg-primary-soft text-primary"
                  : "text-ink"
              }`}
            >
              {opt.label}
              {sortKey === opt.key && <Check size={18} strokeWidth={2.5} />}
            </button>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}
