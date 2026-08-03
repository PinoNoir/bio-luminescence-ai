// The Marine Institute mark: a specimen-frame outline with corner
// brackets (the motif used throughout the app since the species detail
// view, ticket 10) around a pulsing glow dot — ties the brand mark to
// the product's own visual language instead of a generic stock icon.
interface LogoProps {
  className?: string;
  glowClassName?: string;
}

function Logo({ className = 'w-8 h-8', glowClassName = 'w-8 h-8' }: LogoProps) {
  return (
    <div className="relative">
      <svg viewBox="0 0 32 32" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* corner brackets */}
        <path d="M2 9V3.5A1.5 1.5 0 0 1 3.5 2H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M23 2h5.5A1.5 1.5 0 0 1 30 3.5V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M30 23v5.5a1.5 1.5 0 0 1-1.5 1.5H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M9 30H3.5A1.5 1.5 0 0 1 2 28.5V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        {/* specimen dot */}
        <circle cx="16" cy="16" r="4" fill="currentColor" />
      </svg>
      <div className={`absolute inset-0 ${glowClassName} bg-bio-blue/20 rounded-full blur-lg animate-bio-pulse`} />
    </div>
  );
}

export default Logo;
