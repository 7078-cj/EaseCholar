export default function TextInput({ value, onChange, placeholder, type = 'text', inputMode, ...props }) {
  return (
    <input
      type={type}
      inputMode={inputMode}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-2xl border-[1.5px] border-line bg-white px-4 py-[14px] text-[15px] text-ink outline-none transition-all placeholder:text-ink-faint focus:border-primary focus:ring-4 focus:ring-primary/10"
      {...props}
    />
  )
}