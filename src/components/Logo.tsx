/** Original SHOE LOCKER mark: SL monogram built from a shoe-box notch. */
export function Mark({ className = "h-8 w-8" }: { className?: string }) {
  return (<svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square">
    <path d="M38 14H18a6 6 0 0 0 0 12h12a6 6 0 0 1 0 12H8" /><path d="M44 4v40" strokeWidth="2" /></svg>);
}
export function Wordmark() {
  return (<span className="inline-flex items-center gap-2 sm:gap-3"><Mark /><span className="display text-base sm:text-[1.15rem] leading-none tracking-[-0.05em]">SHOE<br className="hidden" /> LOCKER</span></span>);
}
