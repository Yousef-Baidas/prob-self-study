// Shared geometry for the note figures. Every chart previously rolled its own
// padding object, its own scale closure and its own rounding, which is how the
// eleven of them drifted apart. The types here are deliberately small: this is
// a kit for hand-drawn SVG, not a charting library.

/**
 * The natural width of each chart, in px — one source of truth shared by the
 * component (as its default `width`) and by the `<Figure width={…}>` that wraps
 * it in the MDX.
 *
 * These two numbers MUST agree: Figure renders the svg at exactly `width` px so
 * that one SVG user unit is one CSS pixel and the type scale in charts.css means
 * what it says. When each side carried its own literal, nothing caught a
 * disagreement — no type error, no test, just a chart quietly rendering at the
 * wrong scale. Importing the same constant on both sides makes the mismatch
 * unrepresentable.
 */
export const CHART_WIDTH = {
  dotPlot: 560,
  boxPlot: 560,
  histogramTriptych: 560,
  diceGrid: 314,
  venn: 380,
  probTree: 540,
  massChart: 380,
  cdfStep: 380,
  densityArea: 380,
  continuousCdf: 380,
} as const;

/**
 * JointGrid is the one chart whose width depends on its data — a table with
 * four columns is genuinely wider than one with three — so it gets a shared
 * formula rather than a constant. The component and the MDX both call this.
 */
export const jointGridWidth = (colCount: number, cell = 60): number =>
  JOINT_GRID_ORIGIN + cell * colCount + cell + 1;

/** Left/top gutter in JointGrid: axis-name strip plus the header row. */
export const JOINT_GRID_ORIGIN = 56;

export interface Padding {
  top: number;

  right: number;

  bottom: number;

  left: number;
}

/** Room for one line of tick labels below and a value label above. */
export const PLOT_PADDING: Padding = { top: 26, right: 20, bottom: 34, left: 22 };

/** As above, plus a gutter on the left for a labelled y axis. */
export const AXIS_PADDING: Padding = { top: 26, right: 20, bottom: 34, left: 40 };

export interface Plot {
  padding: Padding;

  width: number;

  height: number;

  /** Inner drawing area, excluding padding. */
  innerWidth: number;

  innerHeight: number;

  /** Pixel position of the x axis. */
  baseline: number;

  left: number;

  right: number;

  top: number;
}

export const plot = (width: number, height: number, padding: Padding = PLOT_PADDING): Plot => ({
  padding,
  width,
  height,
  innerWidth: width - padding.left - padding.right,
  innerHeight: height - padding.top - padding.bottom,
  baseline: height - padding.bottom,
  left: padding.left,
  right: width - padding.right,
  top: padding.top,
});

/** Maps a data domain onto a pixel range. */
export const scale = (domain: [number, number], range: [number, number]) => {
  const [d0, d1] = domain;

  const [r0, r1] = range;

  const span = d1 - d0 || 1;

  return (value: number) => r0 + ((value - d0) / span) * (r1 - r0);
};

/** Pads a data range so extreme points do not sit on the frame. */
export const padDomain = (min: number, max: number, fraction = 0.08): [number, number] => {
  const pad = (max - min || 1) * fraction;

  return [min - pad, max + pad];
};

export const samplePoints = (
  fn: (x: number) => number,
  domain: [number, number],
  samples: number,
): { x: number; y: number }[] => {
  const [xMin, xMax] = domain;

  return Array.from({ length: samples + 1 }, (_, i) => {
    const x = xMin + (i / samples) * (xMax - xMin);

    return { x, y: fn(x) };
  });
};

/** Round tick values on a 1/2/5/10 step, so an axis reads 0, 10, 20 rather
    than 0, 8.4, 16.8. Returns only ticks inside the domain. */
export const ticks = (domain: [number, number], count = 5): number[] => {
  const [min, max] = domain;

  // A zero-width domain sends log10(0) to -Infinity and every downstream value
  // to NaN, which loses the axis silently rather than loudly. One tick at the
  // value is the honest answer.
  if (!(max > min)) {
    return Number.isFinite(min) ? [round(min, 6)] : [];
  }

  const rough = (max - min) / count;

  const magnitude = 10 ** Math.floor(Math.log10(rough));

  const normalised = rough / magnitude;

  // Thresholds are the geometric midpoints of the 1/2/5/10 ladder, so the step
  // lands on whichever rung is *nearest* the ideal spacing. Rounding up
  // instead — the obvious 1/2/5 comparison — doubles the step whenever `rough`
  // is a shade over a power of ten, which is how a 0–50 axis ended up labelled
  // only 0, 20, 40.
  const step =
    (normalised >= Math.sqrt(50) ? 10 : normalised >= Math.sqrt(10) ? 5 : normalised >= Math.sqrt(2) ? 2 : 1) *
    magnitude;

  const first = Math.ceil(min / step) * step;

  const out: number[] = [];

  for (let v = first; v <= max + step * 1e-9; v += step) {
    // Re-round: repeated addition of a fractional step accumulates float noise
    // that would surface as a "0.30000000000000004" tick label.
    out.push(round(v, 6));
  }

  return out;
};

export const round = (value: number, places = 2): number => {
  const factor = 10 ** places;

  return Math.round(value * factor) / factor;
};

/** SVG ids are document-global and a component can render several times on one
    page, so every pattern and clip path needs an id unique to its instance. */
export const uid = (prefix: string): string => `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
