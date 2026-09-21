import React, { useId } from 'react';

/**
 * BK Pharmacy brand mark: a four-petal "botanical cross". The plus sign says
 * pharmacy at a glance; each arm is a leaf, so it also says natural /
 * plant-based care. One petal is gold — the "spark" of quality — and the
 * whole flower turns a few degrees on hover.
 *
 * Original artwork, no external assets. Gradient ids are made unique per
 * instance (useId) so the header, footer and admin marks never collide.
 */
export const BrandMark = ({ className = 'w-11 h-11', spin = true }) => {
  const uid = useId().replace(/:/g, '');
  const bg = `bk-bg-${uid}`;
  const petal = `bk-petal-${uid}`;
  const gold = `bk-gold-${uid}`;
  const gloss = `bk-gloss-${uid}`;

  // One leaf pointing up from the center; the other three are rotations.
  const leaf = 'M0 -2.4 C -6.8 -6.2 -6.8 -15.4 0 -19.6 C 6.8 -15.4 6.8 -6.2 0 -2.4 Z';

  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={bg} x1="4" y1="2" x2="44" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#065f46" />
          <stop offset="0.55" stopColor="#0f9b78" />
          <stop offset="1" stopColor="#2dd4bf" />
        </linearGradient>
        <linearGradient id={petal} x1="0" y1="-20" x2="0" y2="-2" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d1fae5" />
        </linearGradient>
        <linearGradient id={gold} x1="0" y1="-20" x2="0" y2="-2" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id={gloss} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.32" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Squircle tile */}
      <rect width="48" height="48" rx="15" fill={`url(#${bg})`} />
      {/* Soft top gloss */}
      <path d="M0 15C0 6.7 6.7 0 15 0h18c8.3 0 15 6.7 15 15v3C36 24 12 24 0 18Z" fill={`url(#${gloss})`} />

      {/* Petals — outer group positions, inner group rotates about its own
          center (fill-box) so the CSS transform never fights the SVG one. */}
      <g transform="translate(24 24)">
        <g
          className={spin ? 'transition-transform duration-700 ease-out group-hover:rotate-[38deg]' : undefined}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        >
          <path d={leaf} fill={`url(#${petal})`} />
          <path d={leaf} fill={`url(#${gold})`} transform="rotate(90)" />
          <path d={leaf} fill={`url(#${petal})`} transform="rotate(180)" />
          <path d={leaf} fill={`url(#${petal})`} transform="rotate(270)" />
          {/* Leaf veins */}
          {[0, 90, 180, 270].map((r) => (
            <path key={r} d="M0 -5 V-15.5" stroke="#047857" strokeOpacity="0.28" strokeWidth="0.9" strokeLinecap="round" transform={`rotate(${r})`} />
          ))}
        </g>
      </g>

      {/* Center jewel */}
      <circle cx="24" cy="24" r="3.6" fill="#065f46" />
      <circle cx="24" cy="24" r="1.7" fill="#a7f3d0" />
    </svg>
  );
};

/**
 * Full lockup: mark + "BK" (heavy display) + "Pharmacy" (editorial italic).
 * tone="dark" is for dark backgrounds (footer).
 */
export const BrandLogo = ({ tagline, tone = 'light', size = 'md', className = '' }) => {
  const isDark = tone === 'dark';
  const markSize = size === 'lg' ? 'w-14 h-14' : size === 'sm' ? 'w-9 h-9' : 'w-11 h-11 sm:w-12 sm:h-12';
  const textSize = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-lg' : 'text-2xl sm:text-[1.7rem]';

  return (
    <span className={`group inline-flex items-center gap-3 ${className}`}>
      <span className="relative shrink-0 drop-shadow-[0_6px_10px_rgba(5,150,105,0.35)] transition-transform duration-300 group-hover:scale-105">
        <BrandMark className={markSize} />
      </span>
      <span className="flex flex-col leading-none">
        <span className={`flex items-baseline gap-1.5 ${textSize}`}>
          <span className={`font-display font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            BK
          </span>
          <span className="w-px h-[0.85em] self-center bg-gradient-to-b from-transparent via-amber-400 to-transparent" />
          <span className={`font-editorial italic font-semibold tracking-tight ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
            Pharmacy
          </span>
        </span>
        {tagline && (
          <span className={`hidden sm:block mt-1.5 text-[10px] font-semibold tracking-[0.18em] uppercase ${isDark ? 'text-emerald-400/90' : 'text-emerald-700/80'}`}>
            {tagline}
          </span>
        )}
      </span>
    </span>
  );
};
