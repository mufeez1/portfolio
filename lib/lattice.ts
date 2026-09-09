/**
 * Deterministic node lattice shared by the static SVG fallback and the WebGL
 * scene, so both render the same graph. Pure and dependency-free, which means
 * the fallback can be server-rendered with zero client JavaScript.
 */
export interface LatticePoint {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface Lattice {
  readonly points: readonly LatticePoint[];
  /** Index pairs into `points`. */
  readonly links: readonly (readonly [number, number])[];
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/**
 * Fibonacci sphere: evenly distributed points with no clustering artefacts and
 * no randomness, so server and client always agree.
 */
export function buildLattice(count: number, linkRadius = 0.58): Lattice {
  const points: LatticePoint[] = [];

  for (let i = 0; i < count; i += 1) {
    const y = count === 1 ? 0 : 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = i * GOLDEN_ANGLE;
    points.push({ x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius });
  }

  const links: [number, number][] = [];
  const degree = new Array<number>(count).fill(0);
  const maxDegree = 3;

  const degreeOf = (index: number) => degree[index] ?? 0;

  for (let i = 0; i < count; i += 1) {
    for (let j = i + 1; j < count; j += 1) {
      if (degreeOf(i) >= maxDegree) break;
      if (degreeOf(j) >= maxDegree) continue;

      const a = points[i]!;
      const b = points[j]!;
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dz = a.z - b.z;

      if (Math.sqrt(dx * dx + dy * dy + dz * dz) < linkRadius) {
        links.push([i, j]);
        degree[i] = degreeOf(i) + 1;
        degree[j] = degreeOf(j) + 1;
      }
    }
  }

  return { points, links };
}

/** Orthographic projection into a square viewBox, with a fixed tilt for depth. */
export function projectLattice(lattice: Lattice, size: number, tilt = 0.42) {
  const cos = Math.cos(tilt);
  const sin = Math.sin(tilt);
  const half = size / 2;
  const scale = half * 0.86;

  return lattice.points.map((point) => {
    const y = point.y * cos - point.z * sin;
    const z = point.y * sin + point.z * cos;
    return {
      cx: half + point.x * scale,
      cy: half - y * scale,
      /** 0 (far) to 1 (near) — drives opacity and radius so depth reads. */
      depth: (z + 1) / 2,
    };
  });
}
