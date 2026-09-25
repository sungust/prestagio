const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true, focusable: false };

export const SearchIcon = () => (
  <svg viewBox="0 0 24 24" {...base}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4.5 4.5" />
  </svg>
);
export const HeartIcon = () => (
  <svg viewBox="0 0 24 24" {...base}>
    <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z" />
  </svg>
);
export const MenuIcon = () => (
  <svg viewBox="0 0 24 24" {...base}>
    <path d="M3 7h18M3 12h18M3 17h18" />
  </svg>
);
export const CloseIcon = () => (
  <svg viewBox="0 0 24 24" {...base}>
    <path d="M5 5l14 14M19 5L5 19" />
  </svg>
);
export const CheckIcon = () => (
  <svg viewBox="0 0 24 24" {...base} strokeWidth={2.2}>
    <path d="M5 12.5l4.5 4.5L19 7" />
  </svg>
);
export const Arrow = () => (
  <span className="arrow" aria-hidden="true">
    →
  </span>
);
