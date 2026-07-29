export default function BottomBar({ children }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/60 bg-white/75 px-5 py-4 shadow-[0_-8px_30px_-8px_rgba(15,23,42,0.12)] backdrop-blur-xl backdrop-saturate-150 [padding-bottom:calc(1rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-[560px] flex-col gap-2.5">{children}</div>
    </div>
  )
}