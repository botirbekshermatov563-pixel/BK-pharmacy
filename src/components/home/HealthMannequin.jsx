import React, { lazy, Suspense, useState } from 'react';
import { HealthAdvisorCharacter } from './HealthAdvisorCharacter';
import { useTranslation } from '../../i18n';

// three.js is ~500 KB — load it lazily so the storefront's first paint isn't
// blocked, and keep the flat SVG advisor as both the loading placeholder and
// the fallback when WebGL isn't available.
const Mannequin3D = lazy(() => import('./Mannequin3D'));

export const HealthMannequin = ({ className = '', activeNeed, onPickNeed, onHoverNeed }) => {
  const { lang } = useTranslation();
  const [unsupported, setUnsupported] = useState(false);

  const fallback = <HealthAdvisorCharacter className={className} />;
  if (unsupported) return fallback;

  return (
    <Suspense fallback={fallback}>
      <Mannequin3D
        className={`${className} aspect-[2/3]`}
        activeNeed={activeNeed}
        lang={lang}
        onPick={onPickNeed}
        onHover={onHoverNeed}
        onUnsupported={() => setUnsupported(true)}
      />
    </Suspense>
  );
};
