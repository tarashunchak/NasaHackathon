const styles = {
  mark: "h-12 w-14 shrink-0 overflow-visible",
};

function Rocket() {
  return (
    <g>
      <path d="M0 -6 C-2 -3.5 -1.7 0.1 -0.9 2.2 L0 1.2 L0.9 2.2 C1.7 0.1 2 -3.5 0 -6Z" fill="var(--signal)" />
      <circle cx="0" cy="-2.6" r="0.8" fill="var(--surface)" />
      <path d="M-1.1 0.6 -2.6 2.2 -0.6 1.8 M1.1 0.6 2.6 2.2 0.6 1.8" fill="var(--signal)" />
      <path d="M-0.8 2.1 0 4 0.8 2.1Z" fill="var(--green)" />
    </g>
  );
}

export default function ProtractorRocket() {
  return (
    <svg className={styles.mark} viewBox="0 0 72 56" aria-hidden="true">
      <path d="M10 44 A26 26 0 0 1 62 44" fill="none" stroke="var(--line-strong)" strokeWidth="1.2" />
      <path d="M10 44H62" fill="none" stroke="var(--line-strong)" strokeWidth="1.2" />
      <path d="M36 44L10 44 M36 44L13 31 M36 44L23 22 M36 44L36 18 M36 44L49 22 M36 44L59 31 M36 44L62 44" fill="none" stroke="var(--muted)" strokeWidth="0.7" opacity="0.75" />
      <path d="M15 44H57" fill="none" stroke="var(--signal)" strokeWidth="0.7" strokeDasharray="1.5 2" opacity="0.7" />
      <g className="protractor-rocket" transform="translate(18 26) rotate(45)">
        <Rocket />
      </g>
    </svg>
  );
}