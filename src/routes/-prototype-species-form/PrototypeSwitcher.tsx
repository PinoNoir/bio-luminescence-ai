// PROTOTYPE — wipe me. Floating variant + mode switcher for ticket 11. Hidden in production builds.
import { useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface VariantMeta {
  key: string;
  label: string;
}

interface PrototypeSwitcherProps {
  variants: VariantMeta[];
  current: string;
  mode: 'create' | 'edit';
}

function PrototypeSwitcher({ variants, current, mode }: PrototypeSwitcherProps) {
  const navigate = useNavigate({ from: '/prototype-species-form' });
  const search = useSearch({ from: '/prototype-species-form' });

  const currentIndex = Math.max(0, variants.findIndex((v) => v.key === current));

  const go = (delta: number) => {
    const nextIndex = (currentIndex + delta + variants.length) % variants.length;
    navigate({ search: { ...search, variant: variants[nextIndex].key } });
  };

  const toggleMode = () => {
    navigate({ search: { ...search, mode: mode === 'create' ? 'edit' : 'create' } });
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditable =
        target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (isEditable) return;
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  if (import.meta.env.PROD) return null;

  const currentMeta = variants[currentIndex];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-3">
      <button
        onClick={toggleMode}
        className="rounded-full border border-yellow-400/40 bg-black px-3 py-2 text-xs font-mono text-yellow-300 tracking-wide hover:bg-yellow-400/10 transition-colors"
      >
        MODE: {mode.toUpperCase()}
      </button>
      <div className="flex items-center gap-3 rounded-full border border-yellow-400/40 bg-black shadow-[0_0_0_1px_rgba(250,204,21,0.15),0_8px_30px_rgba(0,0,0,0.6)] px-2 py-2">
        <button
          onClick={() => go(-1)}
          className="p-2 rounded-full text-yellow-300 hover:bg-yellow-400/10 transition-colors"
          aria-label="Previous variant"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-mono text-yellow-300 tracking-wide px-1 select-none">
          PROTOTYPE — {currentMeta.key} · {currentMeta.label}
        </span>
        <button
          onClick={() => go(1)}
          className="p-2 rounded-full text-yellow-300 hover:bg-yellow-400/10 transition-colors"
          aria-label="Next variant"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default PrototypeSwitcher;
