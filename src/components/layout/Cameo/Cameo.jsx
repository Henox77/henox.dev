import { Component, lazy, Suspense } from 'react';
import useSkin from '../../../lib/useSkin.js';
import './Cameo.css';

const CAMEOS = {
  'retro-os': lazy(() => import('../Assistant/Assistant.jsx')),
  gameboy: lazy(() => import('./pets/Tamagotchi.jsx')),
  crt: lazy(() => import('./pets/Invader.jsx')),
  'crt-amber': lazy(() => import('./pets/AsciiCat.jsx')),
  cyberpunk: lazy(() => import('./pets/Drone.jsx')),
  blueprint: lazy(() => import('./pets/Compass.jsx')),
  paper: lazy(() => import('./pets/Doodle.jsx')),
  matrix: lazy(() => import('./pets/Rabbit.jsx')),
  vaporwave: lazy(() => import('./pets/Flamingo.jsx')),
};

const SCOPE = {
  paper: { only: ['home'] },
  cyberpunk: { calm: (view) => view.startsWith('lab/') },
  'crt-amber': { calm: (view) => view.startsWith('lab/') },
};

class Safe extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function Cameo({ view, onNavigate, onToggleTheme, onOpenSkins }) {
  const { skin } = useSkin();
  const Pet = CAMEOS[skin];
  if (!Pet) return null;
  const scope = SCOPE[skin] ?? {};
  if (scope.only && !scope.only.includes(view)) return null;
  const calm = scope.calm?.(view) ?? false;
  return (
    <Safe key={skin}>
      <Suspense fallback={null}>
        <div className={`cameo-layer cameo-${skin}`}>
          <Pet view={view} calm={calm} onNavigate={onNavigate} onToggleTheme={onToggleTheme} onOpenSkins={onOpenSkins} />
        </div>
      </Suspense>
    </Safe>
  );
}
