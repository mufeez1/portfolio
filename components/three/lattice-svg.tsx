import { buildLattice, projectLattice } from "@/lib/lattice";

const SIZE = 520;

/**
 * Static, server-rendered rendition of the hero lattice. This is what mobile,
 * reduced-motion and pre-hydration users see — it costs zero JavaScript and
 * paints with the document, so the hero never waits on WebGL.
 */
export function LatticeSvg({ count = 52 }: { count?: number }) {
  const lattice = buildLattice(count);
  const projected = projectLattice(lattice, SIZE);

  return (
    <svg
      data-testid="hero-lattice"
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      aria-hidden="true"
      focusable="false"
      className="size-full"
    >
      <g stroke="currentColor" className="text-line-strong">
        {lattice.links.map(([from, to], index) => {
          const a = projected[from]!;
          const b = projected[to]!;
          return (
            <line
              key={index}
              x1={a.cx}
              y1={a.cy}
              x2={b.cx}
              y2={b.cy}
              strokeWidth={0.75}
              opacity={0.25 + ((a.depth + b.depth) / 2) * 0.55}
            />
          );
        })}
      </g>
      <g className="text-accent" fill="currentColor">
        {projected.map((point, index) => (
          <circle
            key={index}
            cx={point.cx}
            cy={point.cy}
            r={1 + point.depth * 2}
            opacity={0.3 + point.depth * 0.6}
          />
        ))}
      </g>
    </svg>
  );
}
