import { Axial, Cube } from "./type";

export const HEX_DIRECTIONS_AXIAL: ReadonlyArray<Axial> = [
  { q: +1, r: 0 }, { q: +1, r: -1 }, { q: 0, r: -1 },
  { q: -1, r: 0 }, { q: -1, r: +1 }, { q: 0, r: +1 },
] as const;

export function axialAdd(a: Axial, b: Axial): Axial { return { q: a.q + b.q, r: a.r + b.r }; }

export function axialNeighbors(a: Axial): Axial[] { return HEX_DIRECTIONS_AXIAL.map(d => axialAdd(a, d)); }

export function axialToCube(a: Axial): Cube { return { x: a.q, z: a.r, y: -a.q - a.r }; }
export function cubeToAxial(c: Cube): Axial { return { q: c.x, r: c.z }; }

function cubeRound(frac: Cube): Cube {
  let rx = Math.round(frac.x);
  let ry = Math.round(frac.y);
  let rz = Math.round(frac.z);

  const x_diff = Math.abs(rx - frac.x);
  const y_diff = Math.abs(ry - frac.y);
  const z_diff = Math.abs(rz - frac.z);

  if (x_diff > y_diff && x_diff > z_diff) {
    rx = -ry - rz;
  } else if (y_diff > z_diff) {
    ry = -rx - rz;
  } else {
    rz = -rx - ry;
  }
  return { x: rx, y: ry, z: rz };
}

// --- Pointy-topped hexes ---
// Layout formulas (size = radius in pixels)
// x = size * (sqrt(3) * q + sqrt(3)/2 * r)
// y = size * (3/2 * r)
const SQRT3 = Math.sqrt(3);

export function axialToPixel(a: Axial, size: number): { x: number; y: number } {
  const x = size * (SQRT3 * a.q + (SQRT3 / 2) * a.r);
  const y = size * (1.5 * a.r);
  return { x, y };
}

export function pixelToAxial(x: number, y: number, size: number): Axial {
  const q = (SQRT3 / 3 * x - 1 / 3 * y) / size;
  const r = (2 / 3 * y) / size;
  const rounded = cubeRound({ x: q, y: -q - r, z: r });
  return cubeToAxial(rounded);
}

export function hexPolygonPath(size: number): string {
  // returns SVG path for a pointy-top hex centered at (0,0)
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 180 * (60 * i - 30);
    pts.push([size * Math.cos(angle), size * Math.sin(angle)]);
  }
  return `M ${pts.map(p => p.join(',')).join(' L ')} Z`;
}

export function colorToFill(color: string): string {
  switch (color) {
    case 'red': return '#ef233c';
    case 'blue': return '#3a86ff';
    case 'green': return '#7cb518';
    case 'yellow': return '#f3de2c';
    case 'purple': return '#a663cc';
    case 'orange': return '#fb8500';
    default: return '#222';
  }
}
