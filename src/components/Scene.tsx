import type { ReactNode } from "react";
import type { SceneKind, Tone } from "@/lib/types";

/**
 * Original Prestagio scene illustrations.
 *
 * These are placeholders for licensed photography: atmospheric, deliberately
 * non-literal compositions that never depict a specific real property, car or
 * watch. They are pure SVG, so they cost almost nothing to deliver and render
 * crisply at every size.
 */

type Palette = {
  sky: string[];
  sun: string;
  glow: string;
  water: string[];
  far: string;
  mid: string;
  near: string;
  land: string;
  light: string;
};

const PALETTES: Record<Tone, Palette> = {
  dusk: {
    sky: ["#2a2338", "#6e3f52", "#c8704f", "#efb77c", "#f8dcae"],
    sun: "#fff1cf",
    glow: "#ffcf8a",
    water: ["#e2a071", "#7b4d53", "#2b2230"],
    far: "#9a6a70",
    mid: "#5b3f4a",
    near: "#2c2129",
    land: "#1b1512",
    light: "#ffd79a",
  },
  golden: {
    sky: ["#5d7894", "#a7a3a0", "#e3b88a", "#f5d6a4", "#fbe9c8"],
    sun: "#fff6de",
    glow: "#ffe0a3",
    water: ["#e9c69a", "#6f7e86", "#27353d"],
    far: "#9c948f",
    mid: "#5e5a55",
    near: "#2f2b27",
    land: "#1e1a15",
    light: "#ffe2a8",
  },
  day: {
    sky: ["#3f73a3", "#6f9fc4", "#a9c8dc", "#dbe7ea", "#eef1ec"],
    sun: "#ffffff",
    glow: "#fff4dc",
    water: ["#8fd0cf", "#2f8698", "#123f55"],
    far: "#8aa4b2",
    mid: "#4e6b6c",
    near: "#243a33",
    land: "#1a2620",
    light: "#fff2cf",
  },
  night: {
    sky: ["#05070f", "#0b1226", "#18213f", "#2a2f55", "#4a4166"],
    sun: "#f4ecd6",
    glow: "#8d86b8",
    water: ["#3a3a5e", "#141a30", "#070a14"],
    far: "#2c3152",
    mid: "#1a1f38",
    near: "#0e1122",
    land: "#080a14",
    light: "#ffcf7a",
  },
  dawn: {
    sky: ["#34405f", "#7d7a97", "#c9a7ae", "#efcdb9", "#f8e6d6"],
    sun: "#fff7ec",
    glow: "#ffd9c2",
    water: ["#e7c5b8", "#77808f", "#2c3444"],
    far: "#a4a0b0",
    mid: "#6c6a7e",
    near: "#343648",
    land: "#1d1f2a",
    light: "#ffe0b8",
  },
};

const DEFAULT_TONE: Record<SceneKind, Tone> = {
  lake: "golden",
  coast: "dusk",
  atoll: "dusk",
  "city-night": "night",
  temple: "dawn",
  riad: "golden",
  alpine: "dawn",
  highland: "dawn",
  cape: "golden",
  venice: "dusk",
  riviera: "day",
  road: "golden",
  jet: "golden",
  watch: "night",
  aroma: "golden",
  interior: "dusk",
  architecture: "day",
  spa: "dawn",
};

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let a = seed || 1;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 1600;
const H = 1000;

/** Midpoint-displacement ridge line closed to the bottom of the canvas. */
function ridge(rand: () => number, baseY: number, amp: number, rough = 0.55, from = 0, to = W, bottom = H) {
  let pts: [number, number][] = [
    [from, baseY + (rand() - 0.5) * amp],
    [to, baseY + (rand() - 0.5) * amp],
  ];
  let a = amp;
  for (let depth = 0; depth < 7; depth++) {
    const next: [number, number][] = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, y1] = pts[i];
      const [x2, y2] = pts[i + 1];
      next.push([x1, y1], [(x1 + x2) / 2, (y1 + y2) / 2 + (rand() - 0.5) * a]);
    }
    next.push(pts[pts.length - 1]);
    pts = next;
    a *= rough;
  }
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join("");
  return `${d}L${to},${bottom}L${from},${bottom}Z`;
}

/** A mountain massif: a peak shape rising from one side of the frame. */
function massif(rand: () => number, fromX: number, toX: number, peakX: number, peakY: number, baseY: number) {
  const pts: string[] = [`M${fromX},${baseY}`];
  const steps = 26;
  for (let i = 0; i <= steps; i++) {
    const x = fromX + ((toX - fromX) * i) / steps;
    const dist = Math.abs(x - peakX) / Math.max(peakX - fromX, toX - peakX);
    const y = peakY + (baseY - peakY) * Math.pow(dist, 0.9) + (rand() - 0.5) * 34 * (1 - dist * 0.5);
    pts.push(`L${x.toFixed(1)},${y.toFixed(1)}`);
  }
  pts.push(`L${toX},${H}L${fromX},${H}Z`);
  return pts.join("");
}

function Cypress({ x, y, h, fill }: { x: number; y: number; h: number; fill: string }) {
  const w = h * 0.16;
  return (
    <path
      d={`M${x},${y - h} C${x + w * 0.9},${y - h * 0.7} ${x + w},${y - h * 0.25} ${x + w * 0.35},${y} L${x - w * 0.35},${y} C${x - w},${y - h * 0.25} ${x - w * 0.9},${y - h * 0.7} ${x},${y - h}Z`}
      fill={fill}
    />
  );
}

function Palm({ x, y, h, fill }: { x: number; y: number; h: number; fill: string }) {
  const tx = x + h * 0.12;
  const ty = y - h;
  const fronds = [-160, -130, -95, -60, -25, 10].map((deg, i) => {
    const r = (deg * Math.PI) / 180;
    const len = h * (0.38 + (i % 2) * 0.08);
    const ex = tx + Math.cos(r) * len;
    const ey = ty + Math.sin(r) * len * 0.55 + len * 0.28;
    const cx = tx + Math.cos(r) * len * 0.5;
    const cy = ty + Math.sin(r) * len * 0.5 - len * 0.12;
    return <path key={deg} d={`M${tx},${ty} Q${cx},${cy} ${ex},${ey}`} stroke={fill} strokeWidth={h * 0.035} fill="none" strokeLinecap="round" />;
  });
  return (
    <g>
      <path d={`M${x},${y} Q${x + h * 0.02},${y - h * 0.5} ${tx},${ty}`} stroke={fill} strokeWidth={h * 0.03} fill="none" />
      {fronds}
    </g>
  );
}

function Balustrade({ y, fill, count = 34 }: { y: number; fill: string; count?: number }) {
  const step = W / count;
  const posts: ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    const cx = i * step + step / 2;
    posts.push(
      <path
        key={i}
        d={`M${cx - 9},${y + 22} C${cx - 20},${y + 50} ${cx - 16},${y + 78} ${cx - 7},${y + 96} L${cx + 7},${y + 96} C${cx + 16},${y + 78} ${cx + 20},${y + 50} ${cx + 9},${y + 22}Z`}
        fill={fill}
      />,
    );
  }
  return (
    <g>
      <rect x={0} y={y} width={W} height={24} fill={fill} />
      {posts}
      <rect x={0} y={y + 94} width={W} height={H - y} fill={fill} />
    </g>
  );
}

function Lights({ seed, x0, x1, y0, y1, n, color, size = 2.4 }: { seed: number; x0: number; x1: number; y0: number; y1: number; n: number; color: string; size?: number }) {
  const rand = rng(seed);
  return (
    <g fill={color}>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={x0 + rand() * (x1 - x0)} cy={y0 + rand() * (y1 - y0)} r={size * (0.5 + rand())} opacity={0.35 + rand() * 0.6} />
      ))}
    </g>
  );
}

function Village({ seed, x0, x1, y0, y1, n, wall, roof }: { seed: number; x0: number; x1: number; y0: number; y1: number; n: number; wall: string; roof: string }) {
  const rand = rng(seed);
  const houses: ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const x = x0 + rand() * (x1 - x0);
    const t = (x - x0) / (x1 - x0);
    const y = y0 + (y1 - y0) * t + (rand() - 0.5) * 70;
    const w = 3 + rand() * 6;
    const h = 3 + rand() * 4;
    houses.push(
      <g key={i}>
        <rect x={x} y={y} width={w} height={h} fill={wall} opacity={0.75 + rand() * 0.25} />
        <rect x={x} y={y - 1.5} width={w} height={2} fill={roof} opacity={0.5} />
      </g>,
    );
  }
  return <g>{houses}</g>;
}

function Reflection({ x, y, color, width = 220, rows = 16 }: { x: number; y: number; color: string; width?: number; rows?: number }) {
  return (
    <g fill={color}>
      {Array.from({ length: rows }, (_, i) => {
        const w = width * (1 - i / (rows * 1.25)) * (0.55 + ((i * 37) % 10) / 22);
        return <rect key={i} x={x - w / 2} y={y + 6 + i * i * 1.6} width={w} height={2.5 + i * 0.35} opacity={0.75 - i * 0.035} rx={2} />;
      })}
    </g>
  );
}

function Boats({ seed, y0, y1, n, color }: { seed: number; y0: number; y1: number; n: number; color: string }) {
  const rand = rng(seed);
  return (
    <g fill={color}>
      {Array.from({ length: n }, (_, i) => {
        const x = 120 + rand() * 1360;
        const y = y0 + rand() * (y1 - y0);
        const s = 0.6 + ((y - y0) / (y1 - y0)) * 1.2;
        return <path key={i} d={`M${x},${y} l${14 * s},0 l${-2 * s},${3 * s} l${-10 * s},0z`} opacity={0.85} />;
      })}
    </g>
  );
}

function OverwaterVilla({ x, y, s, fill, glow }: { x: number; y: number; s: number; fill: string; glow: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-120} y={-8} width={240} height={10} fill={fill} />
      {[-100, -60, -20, 20, 60, 100].map((px) => (
        <rect key={px} x={px - 2} y={0} width={4} height={34} fill={fill} />
      ))}
      <rect x={-92} y={-56} width={184} height={48} fill={fill} />
      <rect x={-70} y={-44} width={36} height={30} fill={glow} opacity={0.85} />
      <rect x={-20} y={-44} width={40} height={30} fill={glow} opacity={0.7} />
      <rect x={34} y={-44} width={36} height={30} fill={glow} opacity={0.85} />
      <path d="M-140,-52 L0,-118 L140,-52 Z" fill={fill} />
      <path d="M-140,-52 L0,-118 L140,-52" fill="none" stroke={glow} strokeOpacity={0.25} strokeWidth={2} />
    </g>
  );
}

function Skyline({ seed, y, fill, light, dense = 1 }: { seed: number; y: number; fill: string; light: string; dense?: number }) {
  const rand = rng(seed);
  const blocks: ReactNode[] = [];
  let x = -10;
  let i = 0;
  while (x < W + 10) {
    const w = 40 + rand() * 90;
    const h = 60 + rand() * 170 * dense;
    const top = y - h;
    blocks.push(<rect key={`b${i}`} x={x} y={top} width={w + 1} height={H - top} fill={fill} />);
    if (rand() > 0.6) blocks.push(<path key={`r${i}`} d={`M${x},${top} L${x + w / 2},${top - 16 - rand() * 18} L${x + w},${top}Z`} fill={fill} />);
    for (let wy = top + 12; wy < y - 6; wy += 16) {
      for (let wx = x + 8; wx < x + w - 8; wx += 14) {
        if (rand() > 0.58) blocks.push(<rect key={`w${i}-${wx}-${wy}`} x={wx} y={wy} width={5} height={7} fill={light} opacity={0.4 + rand() * 0.55} />);
      }
    }
    x += w + 2;
    i++;
  }
  return <g>{blocks}</g>;
}

function Pagoda({ x, y, s, fill }: { x: number; y: number; s: number; fill: string }) {
  const tiers = [0, 1, 2, 3, 4];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
      <rect x={-6} y={-470} width={12} height={90} />
      {tiers.map((t) => {
        const ty = -t * 78;
        const w = 150 - t * 20;
        return (
          <g key={t}>
            <rect x={-w * 0.36} y={ty - 56} width={w * 0.72} height={56} />
            <path d={`M${-w},${ty - 50} Q${-w * 0.5},${ty - 62} 0,${ty - 82} Q${w * 0.5},${ty - 62} ${w},${ty - 50} L${w * 0.8},${ty - 56} L${-w * 0.8},${ty - 56}Z`} />
          </g>
        );
      })}
    </g>
  );
}

function Maple({ seed, x, y, r, fill }: { seed: number; x: number; y: number; r: number; fill: string }) {
  const rand = rng(seed);
  return (
    <g fill={fill}>
      <rect x={x - r * 0.05} y={y - r * 0.4} width={r * 0.1} height={r * 0.8} />
      {Array.from({ length: 16 }, (_, i) => (
        <circle key={i} cx={x + (rand() - 0.5) * r * 1.8} cy={y - r * 0.6 + (rand() - 0.5) * r * 0.9} r={r * (0.22 + rand() * 0.25)} opacity={0.85} />
      ))}
    </g>
  );
}

function Arches({ y, fill, count = 5, opening }: { y: number; fill: string; count?: number; opening?: string }) {
  const step = W / count;
  const holes = Array.from({ length: count }, (_, i) => {
    const x = i * step + step * 0.16;
    const w = step * 0.68;
    return `M${x},${H} L${x},${y + w * 0.5} A${w / 2},${w / 2} 0 0 1 ${x + w},${y + w * 0.5} L${x + w},${H}Z`;
  }).join("");
  return (
    <g>
      {opening ? <path d={holes} fill={opening} opacity={0.12} /> : null}
      <path d={`M0,${y - 60}L${W},${y - 60}L${W},${H}L0,${H}Z ${holes}`} fill={fill} fillRule="evenodd" />
    </g>
  );
}

function Road({ fill, line, y }: { fill: string; line: string; y: number }) {
  const d = `M-40,${H} C 380,${H - 40} 520,${y + 190} 860,${y + 120} S 1300,${y + 30} 1660,${y + 10}`;
  return (
    <g fill="none">
      <path d={d} stroke={fill} strokeWidth={120} strokeLinecap="round" />
      <path d={d} stroke={line} strokeWidth={3} strokeDasharray="26 22" opacity={0.7} />
    </g>
  );
}

function Car({ x, y, s, fill, glint }: { x: number; y: number; s: number; fill: string; glint: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={6} rx={130} ry={10} fill="#000" opacity={0.35} />
      <path
        d="M-128,-6 C-128,-26 -110,-34 -86,-38 L-52,-44 C-30,-70 10,-74 40,-70 C66,-66 84,-52 100,-40 L122,-34 C132,-30 134,-18 132,-6 Z"
        fill={fill}
      />
      <path d="M-40,-46 C-22,-64 12,-66 36,-62 C52,-58 64,-50 74,-42 Z" fill={glint} opacity={0.35} />
      <path d="M-110,-30 C-40,-40 60,-40 118,-30" stroke={glint} strokeOpacity={0.4} strokeWidth={2} fill="none" />
      <circle cx={-80} cy={-4} r={20} fill="#0b0b0b" />
      <circle cx={80} cy={-4} r={20} fill="#0b0b0b" />
      <circle cx={-80} cy={-4} r={9} fill={glint} opacity={0.35} />
      <circle cx={80} cy={-4} r={9} fill={glint} opacity={0.35} />
    </g>
  );
}

function Jet({ x, y, s, fill, glint }: { x: number; y: number; s: number; fill: string; glint: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={60} rx={300} ry={12} fill="#000" opacity={0.3} />
      <path d="M-300,0 C-300,-24 -270,-36 -220,-38 L220,-40 C260,-40 300,-30 330,-8 C300,6 250,10 200,10 L-260,10 C-290,10 -300,6 -300,0Z" fill={fill} />
      <path d="M-250,-38 L-300,-120 L-262,-120 L-190,-40Z" fill={fill} />
      <path d="M-60,4 L-150,56 L-110,56 L30,6Z" fill={fill} opacity={0.9} />
      <rect x={-190} y={-44} width={80} height={26} rx={13} fill={fill} />
      {Array.from({ length: 9 }, (_, i) => (
        <ellipse key={i} cx={-60 + i * 30} cy={-18} rx={7} ry={9} fill={glint} opacity={0.55} />
      ))}
      <path d="M-280,-6 L300,-10" stroke={glint} strokeOpacity={0.35} strokeWidth={3} />
      {[-150, 0, 180].map((wx) => (
        <g key={wx}>
          <rect x={wx - 2} y={10} width={4} height={40} fill="#111" />
          <circle cx={wx} cy={52} r={9} fill="#111" />
        </g>
      ))}
    </g>
  );
}

function Watch({ fill, dial, glint, index }: { fill: string; dial: string; glint: string; index: string }) {
  const cx = 800;
  const cy = 500;
  const hand = (deg: number, len: number, w: number, color: string) => {
    const r = ((deg - 90) * Math.PI) / 180;
    return <line x1={cx} y1={cy} x2={cx + Math.cos(r) * len} y2={cy + Math.sin(r) * len} stroke={color} strokeWidth={w} strokeLinecap="round" />;
  };
  return (
    <g>
      <path d={`M${cx - 120},0 L${cx + 120},0 L${cx + 110},${cy - 180} L${cx - 110},${cy - 180}Z`} fill="#1b1410" />
      <path d={`M${cx - 110},${cy + 180} L${cx + 110},${cy + 180} L${cx + 120},${H} L${cx - 120},${H}Z`} fill="#1b1410" />
      <ellipse cx={cx + 30} cy={cy + 40} rx={260} ry={230} fill="#000" opacity={0.35} />
      <circle cx={cx} cy={cy} r={236} fill={fill} />
      <circle cx={cx} cy={cy} r={236} fill="none" stroke={glint} strokeOpacity={0.5} strokeWidth={3} />
      <circle cx={cx} cy={cy} r={214} fill="none" stroke="#000" strokeOpacity={0.35} strokeWidth={18} />
      <rect x={cx + 232} y={cy - 22} width={34} height={44} rx={6} fill={fill} />
      <circle cx={cx} cy={cy} r={196} fill={dial} />
      {Array.from({ length: 60 }, (_, i) => {
        const r = (i * 6 * Math.PI) / 180;
        const long = i % 5 === 0;
        const r1 = long ? 150 : 176;
        return (
          <line
            key={i}
            x1={cx + Math.cos(r) * r1}
            y1={cy + Math.sin(r) * r1}
            x2={cx + Math.cos(r) * 186}
            y2={cy + Math.sin(r) * 186}
            stroke={index}
            strokeWidth={long ? 7 : 1.5}
            opacity={long ? 0.95 : 0.55}
          />
        );
      })}
      {hand(305, 118, 10, index)}
      {hand(60, 160, 7, index)}
      {hand(190, 176, 2, "#c8883f")}
      <circle cx={cx} cy={cy} r={12} fill={index} />
      <path d={`M${cx - 150},${cy - 110} A200,200 0 0 1 ${cx + 60},${cy - 190}`} stroke="#fff" strokeOpacity={0.14} strokeWidth={30} fill="none" strokeLinecap="round" />
    </g>
  );
}

function Bottle({ glass, liquid, cap, glint, stone }: { glass: string; liquid: string; cap: string; glint: string; stone: string }) {
  const cx = 820;
  return (
    <g>
      <path d={`M0,780 L${W},740 L${W},${H} L0,${H}Z`} fill={stone} />
      <ellipse cx={cx + 90} cy={790} rx={260} ry={24} fill="#000" opacity={0.35} />
      <rect x={cx - 150} y={430} width={300} height={360} rx={18} fill={glass} opacity={0.7} />
      <rect x={cx - 132} y={540} width={264} height={232} rx={10} fill={liquid} opacity={0.9} />
      <rect x={cx - 132} y={540} width={264} height={10} fill={glint} opacity={0.35} />
      <rect x={cx - 150} y={430} width={300} height={360} rx={18} fill="none" stroke={glint} strokeOpacity={0.55} strokeWidth={3} />
      <rect x={cx - 118} y={450} width={18} height={320} rx={9} fill="#fff" opacity={0.22} />
      <rect x={cx - 40} y={380} width={80} height={54} fill={glass} opacity={0.85} />
      <rect x={cx - 76} y={250} width={152} height={132} rx={6} fill={cap} />
      <rect x={cx - 70} y={256} width={10} height={118} fill="#fff" opacity={0.12} />
      <rect x={cx - 70} y={610} width={140} height={66} fill={glint} opacity={0.2} />
    </g>
  );
}

function Rationalist({ y, stone, shadow, glass }: { y: number; stone: string; shadow: string; glass: string }) {
  const x0 = 260;
  const x1 = 1340;
  const cols = 6;
  const rows = 4;
  const cw = (x1 - x0) / cols;
  const rh = (H - y) / (rows + 0.6);
  const cells: ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = x0 + c * cw;
      const yy = y + 40 + r * rh;
      cells.push(<rect key={`${r}-${c}`} x={x + 16} y={yy + 14} width={cw - 32} height={rh - 28} fill={shadow} />);
      cells.push(<rect key={`g${r}-${c}`} x={x + 34} y={yy + 30} width={cw - 68} height={rh - 60} fill={glass} opacity={0.5} />);
    }
  }
  return (
    <g>
      <rect x={x0 - 40} y={y} width={x1 - x0 + 80} height={H - y} fill={stone} />
      {cells}
      <rect x={x0 - 40} y={y} width={x1 - x0 + 80} height={40} fill={stone} />
      <path d={`M${x1 + 40},${y} L${x1 + 120},${y + 40} L${x1 + 120},${H} L${x1 + 40},${H}Z`} fill={shadow} opacity={0.7} />
    </g>
  );
}

function Venice({ y, fill, light, seed }: { y: number; fill: string; light: string; seed: number }) {
  return (
    <g fill={fill}>
      <rect x={0} y={y - 70} width={W} height={80} />
      {/* domes and a campanile, suggestive rather than literal */}
      <path d={`M300,${y - 70} a90,90 0 0 1 180,0z`} />
      <rect x={380} y={y - 200} width={20} height={40} />
      <path d={`M520,${y - 70} a60,60 0 0 1 120,0z`} />
      <rect x={880} y={y - 330} width={46} height={270} />
      <path d={`M872,${y - 330} L903,${y - 400} L934,${y - 330}Z`} />
      <rect x={1080} y={y - 110} width={200} height={50} />
      <path d={`M1120,${y - 110} a60,60 0 0 1 120,0z`} />
      <Lights seed={seed + 1} x0={0} x1={W} y0={y - 60} y1={y} n={60} color={light} size={2} />
      <path d={`M620,${y + 150} q60,-26 120,0 l-6,6 q-54,-18 -108,0z`} opacity={0.9} />
      <rect x={708} y={y + 90} width={3} height={58} />
    </g>
  );
}

function Grain({ id }: { id: string }) {
  return (
    <filter id={id} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
      <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.45  0 0 0 0 0.4  0 0 0 0.09 0" />
    </filter>
  );
}

export function Scene({
  kind,
  tone,
  seed = "",
  className,
  title,
  focus = "any",
}: {
  /** Keep the sun on one side, e.g. away from overlaid text. */
  focus?: "any" | "left" | "right";
  kind: SceneKind;
  tone?: Tone;
  seed?: string;
  className?: string;
  /** Accessible description. Omit only when the scene is decorative. */
  title?: string;
}) {
  const t = tone ?? DEFAULT_TONE[kind];
  const p = PALETTES[t];
  const key = `${kind}-${t}-${seed}`;
  const uid = `s${hash(key).toString(36)}`;
  const rand = rng(hash(key));
  const horizon = { lake: 560, coast: 590, atoll: 610, riviera: 600, cape: 600, venice: 640, spa: 600 }[kind as string] ?? 620;

  const sky = (
    <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
      {p.sky.map((c, i) => (
        <stop key={i} offset={i / (p.sky.length - 1)} stopColor={c} />
      ))}
    </linearGradient>
  );
  const water = (
    <linearGradient id={`${uid}-water`} x1="0" y1="0" x2="0" y2="1">
      {p.water.map((c, i) => (
        <stop key={i} offset={i / (p.water.length - 1)} stopColor={c} />
      ))}
    </linearGradient>
  );
  const sunRoll = rand();
  const sunX = focus === "right" ? 1050 + sunRoll * 330 : focus === "left" ? 220 + sunRoll * 330 : 380 + sunRoll * 840;
  const sunY = horizon - 40 - rand() * 120;
  const glow = (
    <radialGradient id={`${uid}-glow`} cx={sunX / W} cy={sunY / H} r="0.55">
      <stop offset="0" stopColor={p.glow} stopOpacity="0.85" />
      <stop offset="0.35" stopColor={p.glow} stopOpacity="0.25" />
      <stop offset="1" stopColor={p.glow} stopOpacity="0" />
    </radialGradient>
  );
  const haze = (
    <linearGradient id={`${uid}-haze`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={p.sky[3]} stopOpacity="0" />
      <stop offset="1" stopColor={p.sky[3]} stopOpacity="0.55" />
    </linearGradient>
  );

  const backdrop = (withSun = true) => (
    <>
      <rect width={W} height={H} fill={`url(#${uid}-sky)`} />
      <rect width={W} height={H} fill={`url(#${uid}-glow)`} />
      {withSun && t !== "day" ? <circle cx={sunX} cy={sunY} r={t === "night" ? 38 : 46} fill={p.sun} opacity={t === "night" ? 0.9 : 0.95} /> : null}
      {t === "night" ? <Lights seed={hash(`${key}-2`)} x0={0} x1={W} y0={0} y1={horizon - 200} n={90} color="#fff" size={1.2} /> : null}
    </>
  );

  const sea = (y: number) => (
    <>
      <rect x={0} y={y} width={W} height={H - y} fill={`url(#${uid}-water)`} />
      {t !== "day" ? <Reflection x={sunX} y={y} color={p.glow} /> : null}
    </>
  );

  let body: ReactNode;
  switch (kind) {
    case "lake":
      body = (
        <>
          {backdrop()}
          <path d={massif(rand, -100, 900, 380, 250, horizon)} fill={p.far} />
          <path d={massif(rand, 600, 1700, 1180, 200, horizon)} fill={p.far} opacity={0.9} />
          <rect x={0} y={horizon - 120} width={W} height={120} fill={`url(#${uid}-haze)`} />
          <path d={ridge(rand, horizon - 40, 90, 0.5, 900, W, horizon + 10)} fill={p.mid} />
          <Village seed={hash(`${key}-3`)} x0={1000} x1={1560} y0={horizon - 50} y1={horizon - 10} n={40} wall={p.sky[4]} roof={p.mid} />
          {sea(horizon)}
          <Boats seed={hash(`${key}-4`)} y0={horizon + 30} y1={horizon + 180} n={5} color={p.sky[4]} />
          <Cypress x={140} y={820} h={430} fill={p.near} />
          <Cypress x={220} y={830} h={330} fill={p.near} />
          <Cypress x={1470} y={820} h={470} fill={p.near} />
          <Balustrade y={800} fill={p.land} />
        </>
      );
      break;
    case "coast":
      body = (
        <>
          {backdrop()}
          <path d={massif(rand, 700, 1800, 1320, 230, horizon)} fill={p.far} />
          <path d={massif(rand, 900, 1800, 1500, 330, horizon + 10)} fill={p.mid} />
          <Village seed={hash(`${key}-5`)} x0={1060} x1={1540} y0={horizon - 170} y1={horizon - 20} n={90} wall={p.sky[4]} roof={p.near} />
          <Lights seed={hash(`${key}-6`)} x0={1060} x1={1560} y0={horizon - 170} y1={horizon} n={40} color={p.light} size={2} />
          {sea(horizon)}
          <Boats seed={hash(`${key}-7`)} y0={horizon + 20} y1={horizon + 220} n={9} color="#fff" />
          <path d={ridge(rand, 900, 60, 0.5)} fill={p.land} />
          <Cypress x={1500} y={930} h={360} fill={p.land} />
        </>
      );
      break;
    case "atoll":
      body = (
        <>
          {backdrop()}
          {sea(horizon)}
          <OverwaterVilla x={520} y={horizon + 60} s={0.9} fill={p.near} glow={p.light} />
          <OverwaterVilla x={980} y={horizon + 30} s={0.55} fill={p.mid} glow={p.light} />
          <OverwaterVilla x={1250} y={horizon + 18} s={0.38} fill={p.mid} glow={p.light} />
          <rect x={0} y={horizon + 88} width={1600} height={8} fill={p.near} opacity={0.8} />
          <Palm x={120} y={940} h={520} fill={p.land} />
          <Palm x={1480} y={960} h={440} fill={p.land} />
          <path d={`M0,${H - 60} Q800,${H - 110} ${W},${H - 50} L${W},${H} L0,${H}Z`} fill={p.land} />
        </>
      );
      break;
    case "city-night":
      body = (
        <>
          {backdrop()}
          <Skyline seed={hash(`${key}-8`)} y={horizon - 60} fill={p.far} light={p.light} dense={0.7} />
          <Skyline seed={hash(`${key}-9`)} y={horizon + 40} fill={p.mid} light={p.light} dense={1} />
          <rect x={0} y={horizon + 40} width={W} height={H} fill={`url(#${uid}-water)`} />
          <Reflection x={600} y={horizon + 40} color={p.light} width={600} rows={18} />
          <path d={`M-20,${horizon + 150} Q800,${horizon + 40} 1620,${horizon + 150}`} stroke={p.near} strokeWidth={36} fill="none" />
          <Lights seed={hash(`${key}-10`)} x0={0} x1={W} y0={horizon + 120} y1={horizon + 150} n={30} color={p.light} size={3} />
          <path d={ridge(rand, 930, 30, 0.4)} fill={p.land} />
        </>
      );
      break;
    case "temple":
      body = (
        <>
          {backdrop()}
          <path d={ridge(rand, horizon - 180, 160, 0.52)} fill={p.far} />
          <rect x={0} y={horizon - 260} width={W} height={260} fill={`url(#${uid}-haze)`} />
          <path d={ridge(rand, horizon - 60, 100, 0.52)} fill={p.mid} />
          <Pagoda x={1060} y={horizon + 140} s={0.95} fill={p.near} />
          <Maple seed={hash(`${key}-11`)} x={260} y={760} r={240} fill="#8a2f2a" />
          <Maple seed={hash(`${key}-12`)} x={1480} y={820} r={200} fill="#9b3a2a" />
          <path d={ridge(rand, 900, 40, 0.4)} fill={p.land} />
        </>
      );
      break;
    case "riad":
      body = (
        <>
          {backdrop()}
          <path d={ridge(rand, horizon - 120, 140, 0.55)} fill={p.far} opacity={0.8} />
          <Palm x={420} y={900} h={560} fill={p.mid} />
          <Palm x={1200} y={900} h={620} fill={p.mid} />
          <rect x={0} y={760} width={W} height={H} fill={`url(#${uid}-water)`} opacity={0.6} />
          <Arches y={240} fill="#8a4b36" count={3} />
        </>
      );
      break;
    case "alpine":
    case "highland": {
      const snow = kind === "alpine";
      body = (
        <>
          {backdrop()}
          <path d={massif(rand, -100, 1000, 420, snow ? 170 : 330, horizon + 40)} fill={p.far} />
          {snow ? <path d={massif(rand, 260, 580, 420, 175, 330)} fill="#f6f2ee" opacity={0.85} /> : null}
          <path d={massif(rand, 700, 1800, 1260, snow ? 210 : 360, horizon + 40)} fill={p.far} opacity={0.95} />
          <rect x={0} y={horizon - 180} width={W} height={200} fill={`url(#${uid}-haze)`} />
          <path d={ridge(rand, horizon + 30, 120, 0.55)} fill={p.mid} />
          {kind === "highland" ? sea(horizon + 110) : null}
          <path d={ridge(rand, horizon + 140, 110, 0.5)} fill={p.near} />
          <Road fill="#1e1c1e" line={p.sky[4]} y={horizon + 90} />
          <Car x={880} y={horizon + 240} s={0.65} fill="#161616" glint={p.glow} />
        </>
      );
      break;
    }
    case "cape":
      body = (
        <>
          {backdrop()}
          <path d={`M300,${horizon} L420,${horizon - 290} L1100,${horizon - 300} L1240,${horizon}Z`} fill={p.far} />
          <path d={ridge(rand, horizon - 30, 80, 0.5, 1100, W, horizon + 20)} fill={p.mid} />
          {sea(horizon)}
          <path d={`M0,${horizon + 120} C300,${horizon + 60} 460,${horizon + 180} 700,${horizon + 250} L700,${H} L0,${H}Z`} fill={p.near} />
          <Road fill="#1f1d1b" line={p.sky[4]} y={horizon + 150} />
          <Car x={1060} y={horizon + 250} s={0.55} fill="#d9d2c7" glint="#fff" />
        </>
      );
      break;
    case "venice":
      body = (
        <>
          {backdrop()}
          {sea(horizon)}
          <Venice y={horizon} fill={p.near} light={p.light} seed={hash(`${key}-13`)} />
        </>
      );
      break;
    case "riviera":
      body = (
        <>
          {backdrop()}
          {sea(horizon)}
          <Boats seed={hash(`${key}-14`)} y0={horizon + 30} y1={horizon + 200} n={7} color="#fff" />
          <path d={`M-10,${horizon - 30} C300,${horizon - 140} 600,${horizon - 20} 760,${horizon + 60} L760,${H} L-10,${H}Z`} fill={p.mid} />
          <Village seed={hash(`${key}-15`)} x0={20} x1={640} y0={horizon - 90} y1={horizon + 20} n={45} wall="#f1e6d4" roof="#b86b4b" />
          <Road fill="#3a3632" line="#f1ece2" y={horizon + 160} />
          <Car x={620} y={horizon + 330} s={0.7} fill="#7a1f1b" glint="#ffd9c7" />
          <Palm x={1450} y={960} h={620} fill={p.near} />
        </>
      );
      break;
    case "road":
      body = (
        <>
          {backdrop()}
          <path d={ridge(rand, horizon - 140, 160, 0.55)} fill={p.far} />
          <rect x={0} y={horizon - 220} width={W} height={220} fill={`url(#${uid}-haze)`} />
          <path d={ridge(rand, horizon - 20, 120, 0.5)} fill={p.mid} />
          <path d={ridge(rand, horizon + 120, 100, 0.5)} fill={p.near} />
          <Road fill="#1c1a19" line={p.sky[4]} y={horizon + 80} />
          <Car x={860} y={horizon + 240} s={0.8} fill="#141414" glint={p.glow} />
        </>
      );
      break;
    case "jet":
      body = (
        <>
          {backdrop()}
          <path d={ridge(rand, horizon - 40, 70, 0.5)} fill={p.far} opacity={0.8} />
          <rect x={0} y={horizon} width={W} height={H} fill={p.mid} />
          <rect x={0} y={horizon + 150} width={W} height={H} fill={p.near} />
          <path d={`M0,${horizon + 240} L${W},${horizon + 200}`} stroke={p.sky[4]} strokeOpacity={0.5} strokeWidth={4} strokeDasharray="60 40" />
          <Jet x={620} y={horizon + 100} s={1.2} fill="#eeeae3" glint="#6b6f78" />
          <Car x={1300} y={horizon + 260} s={0.9} fill="#121212" glint={p.glow} />
        </>
      );
      break;
    case "watch":
      body = (
        <>
          <rect width={W} height={H} fill="#1e1712" />
          <rect width={W} height={H} fill={`url(#${uid}-glow)`} opacity={0.35} />
          <Watch fill="#b08452" dial="#1f2a3a" glint="#f4d9ae" index="#efe7d8" />
        </>
      );
      break;
    case "aroma":
      body = (
        <>
          {backdrop(false)}
          <path d={ridge(rand, 640, 180, 0.5)} fill={p.far} opacity={0.7} />
          <Bottle glass="#e9dcc6" liquid="#b9773c" cap="#1d1814" glint="#fff" stone="#cdb89a" />
        </>
      );
      break;
    case "interior":
      body = (
        <>
          {backdrop()}
          {sea(horizon)}
          <path d={massif(rand, 900, 1800, 1400, 360, horizon)} fill={p.far} />
          {/* the room: walls frame a wide window */}
          <path d={`M0,0 L${W},0 L${W},${H} L0,${H}Z M220,120 L1380,120 L1380,720 L220,720Z`} fill="#e8dccb" fillRule="evenodd" />
          <rect x={220} y={120} width={1160} height={600} fill="none" stroke="#3c2f25" strokeWidth={10} />
          <rect x={795} y={120} width={10} height={600} fill="#3c2f25" />
          <path d={`M0,${H - 190} L${W},${H - 210} L${W},${H} L0,${H}Z`} fill="#cdb79a" />
          <rect x={120} y={690} width={980} height={190} rx={14} fill="#f7f1e8" />
          <rect x={120} y={690} width={980} height={40} rx={10} fill="#efe6d7" />
          <rect x={160} y={640} width={260} height={80} rx={30} fill="#faf6ef" />
          <rect x={440} y={640} width={260} height={80} rx={30} fill="#f3ebde" />
          <rect x={1240} y={560} width={12} height={280} fill="#3c2f25" />
          <circle cx={1246} cy={560} r={70} fill={p.light} opacity={0.5} />
        </>
      );
      break;
    case "architecture":
      body = (
        <>
          {backdrop(false)}
          <path d={ridge(rand, 520, 180, 0.5)} fill={p.far} opacity={0.6} />
          <Rationalist y={250} stone="#efe8dc" shadow="#a79a88" glass="#3a4a5a" />
          <rect x={0} y={900} width={W} height={100} fill="#cfc5b4" />
        </>
      );
      break;
    case "spa":
      body = (
        <>
          {backdrop()}
          <path d={massif(rand, -100, 900, 300, 260, horizon)} fill={p.far} />
          <path d={massif(rand, 700, 1800, 1300, 300, horizon)} fill={p.far} opacity={0.9} />
          <rect x={0} y={horizon - 140} width={W} height={140} fill={`url(#${uid}-haze)`} />
          {sea(horizon)}
          <rect x={0} y={horizon + 150} width={W} height={H} fill="#5f8f9a" />
          <rect x={0} y={horizon + 150} width={W} height={12} fill="#e9e1d4" />
          <Reflection x={sunX} y={horizon + 160} color={p.glow} width={300} rows={10} />
          <path d={`M0,${H - 90} L${W},${H - 90} L${W},${H} L0,${H}Z`} fill="#d9cdb9" />
          <Palm x={1460} y={H - 90} h={520} fill={p.near} />
        </>
      );
      break;
  }

  return (
    <svg
      className={className}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <defs>
        {sky}
        {water}
        {glow}
        {haze}
        <Grain id={`${uid}-grain`} />
      </defs>
      {body}
      <rect width={W} height={H} filter={`url(#${uid}-grain)`} style={{ mixBlendMode: "overlay" }} />
    </svg>
  );
}
