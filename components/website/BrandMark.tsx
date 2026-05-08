export function BrandMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" aria-hidden>
      <path d="M9 28 L11 44 Q11 46 14 46 L24 46 Q27 46 27 44 L29 28 Z" fill="white" opacity="0.95" />
      <path d="M29 33 Q35 33 35 37 Q35 42 29 42" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <ellipse cx="19" cy="29" rx="5" ry="1.8" fill="oklch(76% 0.14 75)" opacity="0.7" />
      <path d="M16 24 Q15 20 16 16" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M22 24 Q21 20 22 16" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.5" />
      <path d="M28 27 Q33 14 43 16 Q48 19 46 26 Q43 33 35 33 Q28 32 28 27 Z" fill="oklch(76% 0.14 75)" opacity="0.97" />
      <path d="M32 30 Q37 18 43 18" stroke="oklch(82% 0.09 40)" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}
