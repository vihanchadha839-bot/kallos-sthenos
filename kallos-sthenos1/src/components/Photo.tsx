import { useState, type ReactNode } from 'react';
import { imgUrl } from '../data/images';

interface Props {
  id?: string;
  alt: string;
  className?: string;
  /** Approximate rendered width in CSS px, used to pick the right file size */
  sizes?: string;
  priority?: boolean;
  children?: ReactNode;
  overlay?: boolean;
}

const WIDTHS = [400, 700, 1000, 1400];

/** Lazy, responsive, fade-in photo. Falls back to a plain gradient if the image fails or is missing. */
export default function Photo({ id, alt, className = '', sizes = '100vw', priority, children, overlay = true }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900 ${className}`}>
      {id && !failed && (
        <img
          src={imgUrl(id, 700)}
          srcSet={WIDTHS.map((w) => `${imgUrl(id, w)} ${w}w`).join(', ')}
          sizes={sizes}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          // @ts-expect-error fetchpriority is valid HTML, React 19 passes it through
          fetchpriority={priority ? 'high' : 'auto'}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      {overlay && <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/10" />}
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}

export function Hero({ id, title, sub, priority = true }: { id: string; title: string; sub: string; priority?: boolean }) {
  return (
    <Photo id={id} alt="" priority={priority} sizes="(min-width: 1152px) 1152px, 100vw" className="h-32 sm:h-44 rounded-2xl border border-neutral-800">
      <div className="h-full flex flex-col justify-end p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white drop-shadow">{title}</h2>
        <p className="text-sm text-neutral-300 max-w-xl">{sub}</p>
      </div>
    </Photo>
  );
}
