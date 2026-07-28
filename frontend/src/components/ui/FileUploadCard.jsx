import { useRef } from 'react'

/**
 * Real file upload card (camera-first, per EaseKolar's mobile design rules).
 * Two hidden inputs: one with `capture="environment"` for the camera button,
 * one plain file picker for "Choose file". Both accept image/* since every
 * backend OCR path (EasyOCR) expects an image.
 */
export default function FileUploadCard({ label, hint, file, onSelect, onRemove, required = false }) {
  const cameraRef = useRef(null)
  const fileRef = useRef(null)

  const done = !!file

  return (
    <div className={`rounded-2xl border-[1.5px] p-4 transition-colors sm:p-5 ${done ? 'border-success-border' : 'border-line'} bg-white`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                done ? 'bg-success' : 'border-[1.5px] border-line-soft border-ink-faint/40 bg-line-soft'
              }`}
            >
              {done && (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </div>
            <span className="text-sm font-semibold text-ink">
              {label}
              {required && <span className="ml-1 text-danger">*</span>}
            </span>
          </div>
          <p className="mt-1 pl-7 text-[13px] leading-relaxed text-ink-soft">{hint}</p>
          {done && <p className="mt-1.5 pl-7 truncate text-[12px] font-medium text-success-text">{file.name}</p>}
        </div>

        <div className="shrink-0">
          {!done ? (
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => cameraRef.current?.click()}
                className="flex items-center gap-1.5 rounded-lg bg-primary-soft px-3 py-2 text-[13px] font-semibold text-primary"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                Camera
              </button>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-[13px] font-semibold text-ink-soft"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                File
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onRemove}
              className="rounded-lg border border-line px-3 py-2 text-[13px] font-semibold text-ink-soft"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Camera capture input */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onSelect(e.target.files[0])}
      />
      {/* Plain file picker */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onSelect(e.target.files[0])}
      />
    </div>
  )
}