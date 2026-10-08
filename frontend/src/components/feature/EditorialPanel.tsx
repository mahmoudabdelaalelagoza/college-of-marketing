/**
 * Editorial artwork for imagery slots.
 *
 * The site previously hot-linked placeholder photography from a third-party
 * image service. That service now returns errors, which left every content
 * image broken in production. Rather than depend on an external host that can
 * disappear again, imagery slots fall back to deterministic, on-brand vector
 * artwork rendered inline: no network request, no layout shift, sharp at any
 * size, and it stays inside the existing plum / gold / cream palette.
 *
 * An earlier version of this component drew a single large ring on a grid. In
 * the rendered page that read as a broken or unloaded image rather than as a
 * deliberate visual. The artwork below is therefore built as a small set of
 * composed "marketing performance" motifs (column growth, reach arcs, audience
 * density, trend curves) rather than one abstract shape. Each slot picks a motif
 * deterministically from its seed, so a given image position always looks the
 * same, while different positions stay visually distinct.
 *
 * These remain decorative placeholders for real photography. They are not a
 * substitute for approved imagery, and are never used where an editor has
 * supplied a real image.
 */
import { useId } from 'react';
import type { ReactElement } from 'react';

interface EditorialPanelProps {
  /** Accessible description of what the panel represents. */
  label: string;
  /** Stable key that selects a deterministic layout variation. */
  seed: string;
  tone?: 'plum' | 'cream';
}

/** Small deterministic hash so each slot gets a stable, distinct variation. */
function hashSeed(seed: string): number {
  let hash = 7;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % 99991;
  }
  return hash;
}

interface Palette {
  gold: string;
  goldStrong: string;
  glow: string;
  line: string;
  wash: string;
}

interface MotifProps {
  uid: string;
  hash: number;
  palette: Palette;
}

export default function EditorialPanel({ label, seed, tone = 'plum' }: EditorialPanelProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const dark = tone === 'plum';

  const hash = hashSeed(seed);
  const motif = hash % 4;

  const palette: Palette = dark
    ? {
        gold: '#f8d667',
        goldStrong: '#ffe79a',
        glow: 'rgba(248, 214, 103, 0.26)',
        line: 'rgba(251, 243, 242, 0.14)',
        wash: 'rgba(248, 214, 103, 0.10)',
      }
    : {
        gold: '#8a6a12',
        goldStrong: '#6b5209',
        glow: 'rgba(138, 106, 18, 0.16)',
        line: 'rgba(61, 23, 48, 0.12)',
        wash: 'rgba(138, 106, 18, 0.08)',
      };

  return (
    <div role="img" aria-label={label} className="h-full w-full">
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id={`${uid}-surface`} x1="0" y1="0" x2="1" y2="1">
            {dark ? (
              <>
                <stop offset="0%" stopColor="#3d1730" />
                <stop offset="52%" stopColor="#2a0f21" />
                <stop offset="100%" stopColor="#1c0a16" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#fbf3f2" />
                <stop offset="55%" stopColor="#f6e7e6" />
                <stop offset="100%" stopColor="#efe0de" />
              </>
            )}
          </linearGradient>

          <radialGradient id={`${uid}-glow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={palette.glow} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          <linearGradient id={`${uid}-gold`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={palette.gold} stopOpacity="0.35" />
            <stop offset="100%" stopColor={palette.goldStrong} stopOpacity="0.95" />
          </linearGradient>

          <pattern id={`${uid}-grid`} width="25" height="25" patternUnits="userSpaceOnUse">
            <path d="M25 0H0V25" fill="none" stroke={palette.line} strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="400" height="300" fill={`url(#${uid}-surface)`} />
        <rect width="400" height="300" fill={`url(#${uid}-grid)`} />
        <circle
          cx={120 + (hash % 5) * 40}
          cy={70 + (hash % 3) * 60}
          r="165"
          fill={`url(#${uid}-glow)`}
        />

        {motif === 0 ? <Columns {...motifProps(uid, hash, palette)} /> : null}
        {motif === 1 ? <Arcs uid={uid} hash={hash} palette={palette} /> : null}
        {motif === 2 ? <Density uid={uid} hash={hash} palette={palette} /> : null}
        {motif === 3 ? <Trend {...motifProps(uid, hash, palette)} /> : null}

        {/* Corner registration marks: a quiet editorial frame that stops the
            composition reading as an empty panel. */}
        <g stroke={palette.gold} strokeOpacity="0.5" strokeWidth="1.5" fill="none">
          <path d="M18 30V18H30" />
          <path d="M370 282H382V270" />
        </g>
      </svg>
    </div>
  );
}

function motifProps(uid: string, hash: number, palette: Palette): MotifProps {
  return { uid, hash, palette };
}

/** Ascending column groups with a highlighted leading column. */
function Columns({ uid, hash, palette }: MotifProps) {
  const baseline = 252;
  const width = 46;
  const gap = 20;

  return (
    <g>
      <line x1="24" y1={baseline} x2="376" y2={baseline} stroke={palette.gold} strokeOpacity="0.45" strokeWidth="1.5" />
      {[0, 1, 2, 3, 4].map((index) => {
        const ratio = [0.34, 0.52, 0.44, 0.7, 0.6][index] * (0.85 + ((hash >> index) % 4) * 0.05);
        const height = ratio * 150;
        const x = 38 + index * (width + gap);
        const y = baseline - height;
        const leading = index === 3;
        return (
          <rect
            key={x}
            x={x}
            y={y}
            width={width}
            height={height}
            rx="7"
            fill={leading ? `url(#${uid}-gold)` : palette.wash}
            stroke={leading ? palette.goldStrong : palette.gold}
            strokeOpacity={leading ? 0.9 : 0.35}
            strokeWidth="1.25"
          />
        );
      })}
    </g>
  );
}

/** Concentric quarter-arcs suggesting reach and audience spread. */
function Arcs({ hash, palette }: MotifProps) {
  const cx = 300;
  const cy = 262;
  const radii = [64, 104, 144, 184, 224];

  return (
    <g fill="none" stroke={palette.gold} strokeLinecap="round">
      {radii.map((radius, index) => (
        <path
          key={radius}
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx} ${cy - radius}`}
          stroke={index === 3 ? palette.goldStrong : palette.gold}
          strokeOpacity={index === 3 ? 0.85 : 0.22 + index * 0.05}
          strokeWidth={index === 3 ? 2 : 1.25}
          strokeDasharray={index % 2 === 0 ? 'none' : '5 7'}
        />
      ))}
      <circle cx={cx} cy={cy} r="5" fill={palette.goldStrong} stroke="none" />
      <circle
        cx={cx - radii[3]}
        cy={cy - radii[3]}
        r="4"
        fill={palette.gold}
        stroke="none"
        opacity={0.5 + (hash % 5) * 0.08}
      />
    </g>
  );
}

/** Audience-density halftone: dot size falls away from a focal point. */
function Density({ hash, palette }: MotifProps) {
  const fx = 110 + (hash % 6) * 24;
  const fy = 90 + (hash % 4) * 30;
  const dots: ReactElement[] = [];

  for (let row = 0; row < 10; row += 1) {
    for (let column = 0; column < 15; column += 1) {
      const x = 22 + column * 25;
      const y = 20 + row * 28;
      const distance = Math.hypot(x - fx, y - fy) / 320;
      const radius = 4.6 * (1 - distance);
      if (radius < 0.5) continue;
      dots.push(
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r={radius}
          fill={radius > 2.6 ? palette.goldStrong : palette.gold}
          opacity={Math.min(1, 0.22 + radius / 4)}
        />,
      );
    }
  }

  return <g>{dots}</g>;
}

/** Layered trend curves, echoing campaign performance over time. */
function Trend({ uid, hash, palette }: MotifProps) {
  const shift = (hash % 5) * 8;

  return (
    <g>
      <path
        d={`M 20 244 C 90 ${210 - shift}, 140 ${246 - shift}, 200 ${206 - shift} S 320 ${168 - shift}, 380 ${188 - shift} L 380 280 L 20 280 Z`}
        fill={palette.wash}
      />
      <path
        d={`M 20 244 C 90 ${210 - shift}, 140 ${246 - shift}, 200 ${206 - shift} S 320 ${168 - shift}, 380 ${188 - shift}`}
        fill="none"
        stroke={palette.goldStrong}
        strokeWidth="2.25"
        strokeLinecap="round"
      />
      <path
        d={`M 20 262 C 100 ${244 - shift}, 160 ${262 - shift}, 230 ${232 - shift} S 330 ${206 - shift}, 380 ${220 - shift}`}
        fill="none"
        stroke={palette.gold}
        strokeOpacity="0.45"
        strokeWidth="1.5"
        strokeDasharray="6 6"
        strokeLinecap="round"
      />
      <line x1="20" y1="280" x2="380" y2="280" stroke={palette.gold} strokeOpacity="0.4" strokeWidth="1.25" />
      <circle cx={200} cy={206 - shift} r="12" fill={`url(#${uid}-glow)`} />
      <circle cx={200} cy={206 - shift} r="5.5" fill={palette.goldStrong} />
    </g>
  );
}
