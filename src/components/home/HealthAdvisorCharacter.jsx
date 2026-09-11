import React, { useEffect, useRef, useState } from 'react';

/**
 * Original vector illustration of a friendly BK Pharmacy health advisor.
 * The head + eyes track the cursor (or the nearest touch point) for a
 * subtle, alive presence at the center of the needs/symptoms selector —
 * inspired by damaar.uz-style hero characters, but hand-drawn for BK
 * Pharmacy's own emerald brand rather than copying any external asset.
 *
 * Motion approach (per the `motion-design` / `impeccable` skill guidance):
 * - eased, spring-like interpolation (lerp toward target every frame),
 *   never an instant snap
 * - small, restrained ranges (head tilt/translate) so it reads as "aware
 *   of you", not distracting
 * - eyes carry most of the "looking at you" read (strongest gaze cue),
 *   head adds a secondary, subtler tilt
 * - a gentle idle sway plays when the pointer is elsewhere/absent, so the
 *   figure never looks inert
 * - fully disabled under prefers-reduced-motion
 */
export const HealthAdvisorCharacter = ({ className = '' }) => {
  const wrapperRef = useRef(null);
  const headRef = useRef(null);
  const lPupilRef = useRef(null);
  const rPupilRef = useRef(null);
  const target = useRef({ rot: 0, tx: 0, ty: 0, px: 0, py: 0 });
  const current = useRef({ rot: 0, tx: 0, ty: 0, px: 0, py: 0 });
  const rafRef = useRef(null);
  const idleT = useRef(0);
  const hasPointer = useRef(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;

    const handleMove = (e) => {
      const el = wrapperRef.current;
      if (!el) return;
      hasPointer.current = true;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height * 0.34; // roughly the face's height
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const reach = 640; // px distance at which the tracking maxes out
      const nx = Math.max(-1, Math.min(1, dx / reach));
      const ny = Math.max(-1, Math.min(1, dy / reach));

      target.current = {
        rot: nx * 9,      // head tilt, degrees
        tx: nx * 6,        // head micro-shift, px
        ty: ny * 4,
        px: nx * 4.2,       // pupil shift inside the eye, px
        py: ny * 3
      };
    };

    const handleLeave = () => { hasPointer.current = false; };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerleave', handleLeave);
    window.addEventListener('blur', handleLeave);

    const ease = 0.08;
    const tick = () => {
      idleT.current += 0.012;
      const c = current.current;
      let t = target.current;

      if (!hasPointer.current) {
        // Gentle idle sway so the character never looks frozen when no
        // one is moving the mouse.
        const s = Math.sin(idleT.current);
        t = { rot: s * 2.4, tx: s * 1.6, ty: Math.cos(idleT.current * 0.7) * 1.2, px: s * 1.2, py: 0 };
      }

      c.rot += (t.rot - c.rot) * ease;
      c.tx += (t.tx - c.tx) * ease;
      c.ty += (t.ty - c.ty) * ease;
      c.px += (t.px - c.px) * ease;
      c.py += (t.py - c.py) * ease;

      if (headRef.current) {
        headRef.current.style.transform = `translate(${c.tx}px, ${c.ty}px) rotate(${c.rot}deg)`;
      }
      if (lPupilRef.current) lPupilRef.current.setAttribute('transform', `translate(${c.px} ${c.py})`);
      if (rPupilRef.current) rPupilRef.current.setAttribute('transform', `translate(${c.px} ${c.py})`);

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerleave', handleLeave);
      window.removeEventListener('blur', handleLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  return (
    <div ref={wrapperRef} className={`relative select-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 400 560" className="w-full h-full overflow-visible" style={{ transformOrigin: '50% 85%' }}>
        <defs>
          {/* Emerald scrub top — a colored uniform reads much better against
              a busy photo background than the earlier near-white coat did. */}
          <linearGradient id="coatGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="collarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#eef6f1" />
          </linearGradient>
          <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f7c9a0" />
            <stop offset="100%" stopColor="#e8a876" />
          </linearGradient>
          <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a2f1f" />
            <stop offset="100%" stopColor="#2a1a10" />
          </linearGradient>
          <radialGradient id="badgeGlow" cx="50%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </radialGradient>
          <filter id="charShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#022c22" floodOpacity="0.28" />
          </filter>
        </defs>

        {/* Soft contact shadow + drop shadow on the whole figure so it sits
            forward of the nature-photo backdrop instead of blending in. */}
        <g filter="url(#charShadow)">
        {/* ---- Body (static) ---- */}
        <g>
          {/* Shadow under the figure */}
          <ellipse cx="200" cy="536" rx="98" ry="16" fill="#022c22" opacity="0.14" />

          {/* Legs / trousers */}
          <path d="M150 430 L146 540 L182 540 L192 440 Z" fill="#0f172a" />
          <path d="M250 430 L254 540 L218 540 L208 440 Z" fill="#0f172a" />

          {/* Torso — scrub top */}
          <path
            d="M200 210
               C 150 210 118 236 112 284
               L 100 420
               C 98 436 108 448 124 448
               L 276 448
               C 292 448 302 436 300 420
               L 288 284
               C 282 236 250 210 200 210 Z"
            fill="url(#coatGrad)"
            stroke="#065f46"
            strokeWidth="2.5"
          />
          {/* Collar / lapels — white for contrast against the emerald top */}
          <path d="M200 220 L172 300 L200 340 L228 300 Z" fill="url(#collarGrad)" />
          {/* Coat center seam */}
          <line x1="200" y1="222" x2="200" y2="446" stroke="#065f46" strokeWidth="1.5" opacity="0.4" />

          {/* Arms */}
          <path d="M114 288 C 92 306 80 344 84 390 L 108 396 C 106 356 114 322 132 300 Z" fill="url(#coatGrad)" stroke="#065f46" strokeWidth="2.5" />
          <path d="M286 288 C 308 306 320 344 316 390 L 292 396 C 294 356 286 322 268 300 Z" fill="url(#coatGrad)" stroke="#065f46" strokeWidth="2.5" />
          {/* Hands */}
          <circle cx="94" cy="400" r="13" fill="url(#skinGrad)" />
          <circle cx="306" cy="400" r="13" fill="url(#skinGrad)" />

          {/* Brand badge on coat */}
          <circle cx="200" cy="300" r="17" fill="url(#badgeGlow)" stroke="#ffffff" strokeWidth="2" />
          <path d="M200 292v16M192 300h16" stroke="#ffffff" strokeWidth="3.4" strokeLinecap="round" />

          {/* Neck */}
          <rect x="182" y="188" width="36" height="34" rx="10" fill="url(#skinGrad)" />
        </g>

        {/* ---- Head (rotatable) ---- */}
        <g ref={headRef} style={{ transformOrigin: '200px 150px' }}>
          {/* Hair back */}
          <path d="M136 150 C 132 96 164 60 200 60 C 236 60 268 96 264 150 L 264 168 C 264 122 236 96 200 96 C 164 96 136 122 136 168 Z" fill="url(#hairGrad)" stroke="#1a0f08" strokeWidth="1" />

          {/* Face */}
          <ellipse cx="200" cy="150" rx="58" ry="66" fill="url(#skinGrad)" stroke="#c98a5c" strokeWidth="1" />

          {/* Ears */}
          <ellipse cx="142" cy="152" rx="8" ry="12" fill="url(#skinGrad)" />
          <ellipse cx="258" cy="152" rx="8" ry="12" fill="url(#skinGrad)" />

          {/* Hair front / fringe */}
          <path d="M144 128 C 150 92 176 74 200 74 C 224 74 250 92 256 128 C 236 112 218 106 200 106 C 182 106 164 112 144 128 Z" fill="url(#hairGrad)" />
          {/* Hair bun */}
          <circle cx="200" cy="62" r="22" fill="url(#hairGrad)" />

          {/* Eyebrows */}
          <path d="M164 134 Q 176 126 190 132" stroke="#3d2b23" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M210 132 Q 224 126 236 134" stroke="#3d2b23" strokeWidth="4" strokeLinecap="round" fill="none" />

          {/* Eyes (sclera) */}
          <ellipse cx="178" cy="150" rx="12" ry="8.5" fill="#ffffff" stroke="#e3ccb4" strokeWidth="1" />
          <ellipse cx="222" cy="150" rx="12" ry="8.5" fill="#ffffff" stroke="#e3ccb4" strokeWidth="1" />
          {/* Pupils (tracked) */}
          <g ref={lPupilRef}>
            <circle cx="178" cy="150" r="5.4" fill="#2a1c17" />
            <circle cx="180" cy="148" r="1.4" fill="#ffffff" />
          </g>
          <g ref={rPupilRef}>
            <circle cx="222" cy="150" r="5.4" fill="#2a1c17" />
            <circle cx="224" cy="148" r="1.4" fill="#ffffff" />
          </g>

          {/* Nose */}
          <path d="M198 156 Q 194 168 200 172 Q 206 170 202 156" stroke="#d99f74" strokeWidth="2.2" fill="none" strokeLinecap="round" />

          {/* Smile */}
          <path d="M180 184 Q 200 198 220 184" stroke="#a85f42" strokeWidth="3.2" fill="none" strokeLinecap="round" />

          {/* Blush */}
          <ellipse cx="164" cy="172" rx="9" ry="5.5" fill="#f4a889" opacity="0.35" />
          <ellipse cx="236" cy="172" rx="9" ry="5.5" fill="#f4a889" opacity="0.35" />
        </g>
        </g>
      </svg>
    </div>
  );
};
