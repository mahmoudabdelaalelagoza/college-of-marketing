/**
 * Image slot for editorial artwork.
 *
 * Renders a real image when one is available (local asset or a CMS-supplied
 * `image_url`), and falls back to on-brand inline vector artwork when it is
 * not. This keeps CMS content working while guaranteeing that no slot can
 * render as a broken image.
 */
import EditorialPanel from '@/components/feature/EditorialPanel';

interface EditorialImageProps {
  /** Optional image source. Falls back to vector artwork when absent. */
  src?: string | null;
  /** Alternative text. Required for real images, ignored by the panel. */
  alt: string;
  /** Stable key driving the fallback artwork variation. */
  seed: string;
  tone?: 'plum' | 'cream';
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
}

export default function EditorialImage({
  src,
  alt,
  seed,
  tone = 'plum',
  className = 'h-full w-full object-cover',
  loading = 'lazy',
  fetchPriority,
}: EditorialImageProps) {
  if (!src) {
    return <EditorialPanel label={alt} seed={seed} tone={tone} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      {...(fetchPriority ? { fetchPriority } : {})}
      className={className}
    />
  );
}
