export function Logo({
  variant = 'light',
  size = 'md',
}: {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}) {
  const color = variant === 'light' ? 'text-cream-50' : 'text-bottega-800';
  const sub = variant === 'light' ? 'text-cream-100/80' : 'text-bottega-700/80';
  const sizes = {
    sm: { main: 'text-xl', sub: 'text-[10px]' },
    md: { main: 'text-2xl md:text-3xl', sub: 'text-[11px]' },
    lg: { main: 'text-4xl md:text-5xl', sub: 'text-xs md:text-sm' },
  }[size];

  return (
    <div className={`display ${color} leading-none flex flex-col items-center text-center`}>
      <span className={`${sizes.main} tracking-[0.18em] font-medium`}>
        LE BOTTEGHE
      </span>
      <span
        className={`${sub} ${sizes.sub} mt-1 uppercase tracking-[0.32em]`}
      >
        Arrosto · Vino · Cucina
      </span>
    </div>
  );
}
