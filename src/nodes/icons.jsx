export function PersonIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="8" r="3.6" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.5 20c1.4-3.6 4.4-5.4 7.5-5.4s6.1 1.8 7.5 5.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function TeamIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="8.5" cy="8.5" r="2.8" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="16" cy="9.5" r="2.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 19c1.1-3 3.1-4.5 5.5-4.5S12.9 16 14 19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M14.5 19c.8-2.2 2.3-3.4 4-3.4s3.1 1.1 3.9 3.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function CodeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M9 7 4 12l5 5M15 7l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HeadsetIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="3" y="13" width="4" height="6" rx="1.6" stroke="currentColor" strokeWidth="1.8" />
      <rect x="17" y="13" width="4" height="6" rx="1.6" stroke="currentColor" strokeWidth="1.8" />
      <path d="M19 19v1a2 2 0 0 1-2 2h-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function DollarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 3v18M16.5 7.5c0-1.7-2-2.8-4.5-2.8s-4.5 1.1-4.5 2.9c0 3.6 9 1.6 9 5.4 0 1.9-2 3-4.5 3s-4.7-1.1-4.7-2.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FlagIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M6 3v18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 4.5c3-1.4 4.8.6 7.5-.6 2-.9 3 .3 4 .6-.3 1.7-.6 3.6-1 5.4-2.7 1.2-4.5-.8-7.5.6-1 .4-1.9.3-3 0V4.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export function iconFor(entity) {
  if (entity.type === "person") return PersonIcon;
  if (entity.type === "area") return FlagIcon;
  const n = entity.name.toLowerCase();
  if (n.includes("support")) return HeadsetIcon;
  if (n.includes("financ")) return DollarIcon;
  if (n.includes("dev") || n.includes("engineer")) return CodeIcon;
  return TeamIcon;
}
