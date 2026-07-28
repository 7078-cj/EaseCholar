export default function BottomBar({ children }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line-soft bg-white/95 px-5 py-4 backdrop-blur-md [padding-bottom:calc(1rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-[560px] flex-col gap-2.5">{children}</div>
    </div>
  )
}