/* A tiny "diffusion sampler" for text, drawn with 2D canvas.

   Every particle has a target pixel x0 (sampled from the rendered word) and a
   unit Gaussian noise vector eps. Its position at noise level tau in [0,1] is
   the DDPM forward process with a cosine schedule:

       x_tau = c + a(tau) * (x0 - c) + b(tau) * eps * spread
       a = sin(pi/2 * tau)   b = cos(pi/2 * tau)   (a^2 + b^2 = 1)

   so tau 0 is pure noise around the centre and tau 1 is the clean sample.
   eps drifts a little every frame (an Ornstein-Uhlenbeck walk that keeps unit
   variance), which gives the stochastic "sampling" shimmer.

   The cursor adds local "heat": particles near it get extra noise that decays
   back to zero, so the word heals itself after you stop.

   All per-particle state lives in typed arrays and one requestAnimationFrame
   loop draws everything. The loop stops whenever the canvas is offscreen or the
   tab is hidden, and nothing allocates per frame. */

export type FieldOptions = {
  text: string;
  /** CSS font-family string to render the word with. */
  fontFamily: string;
  fontWeight?: number;
  /** Particle colours, in draw order, with their share of the population. */
  palette: { color: string; share: number; size: number; alpha?: number }[];
  /** Particles per 1000 CSS px^2 of canvas, clamped by min/max. */
  density: number;
  min: number;
  max: number;
  /** Vertical centre of the word as a fraction of the canvas height. */
  centerY: (w: number, h: number) => number;
  /** Max word width / height as fractions of the canvas. */
  maxW: number;
  maxH: number;
  /** Total denoise duration for one run, ms. */
  duration?: number;
  steps?: number;
  /** Radius (CSS px) of the cursor's noise brush. */
  brush?: number;
  onStep?: (step: number, sigma: number) => void;
  onLocal?: (x: number, y: number, sigma: number, on: boolean) => void;
};

export class LatentField {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private o: Required<Omit<FieldOptions, "onStep" | "onLocal">> &
    Pick<FieldOptions, "onStep" | "onLocal">;

  private n = 0;
  private tx = new Float32Array(0);
  private ty = new Float32Array(0);
  private ex = new Float32Array(0);
  private ey = new Float32Array(0);
  private heat = new Float32Array(0);
  private group = new Uint8Array(0);
  private groupStart: number[] = [];

  private w = 0;
  private h = 0;
  private dpr = 1;
  private raf = 0;
  private last = 0;
  private visible = false;
  private hidden = false;
  private running = false;

  /** Current and target noise progress. In "auto" mode tau runs 0 -> 1. */
  tau = 0;
  target = 1;
  mode: "auto" | "follow" = "auto";
  private runStart = 0;
  private lastStep = -1;

  private px = -1;
  private py = -1;
  private pointerAt = 0;
  private pointerOn = false;

  constructor(canvas: HTMLCanvasElement, options: FieldOptions) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) throw new Error("2d context unavailable");
    this.ctx = ctx;
    this.o = {
      fontWeight: 800,
      duration: 2600,
      steps: 50,
      brush: 110,
      ...options,
    } as LatentField["o"];
  }

  /** Re-measure, re-sample targets, keep the current tau. */
  layout() {
    const rect = this.canvas.getBoundingClientRect();
    this.w = Math.max(1, Math.round(rect.width));
    this.h = Math.max(1, Math.round(rect.height));
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);
    this.sample();
  }

  private sample() {
    const { w, h, o } = this;
    // Render the word small (half res) and read back its alpha mask.
    const scale = 0.5;
    const sw = Math.max(1, Math.round(w * scale));
    const sh = Math.max(1, Math.round(h * scale));
    const off = document.createElement("canvas");
    off.width = sw;
    off.height = sh;
    const c = off.getContext("2d", { willReadFrequently: true });
    if (!c) return;
    let size = 100;
    c.font = `${o.fontWeight} ${size}px ${o.fontFamily}`;
    const m = c.measureText(o.text);
    const capH = (m.actualBoundingBoxAscent || size * 0.72) + (m.actualBoundingBoxDescent || 0);
    size = Math.min((sw * o.maxW) / m.width, (sh * o.maxH) / capH) * 100;
    c.font = `${o.fontWeight} ${size}px ${o.fontFamily}`;
    c.textAlign = "center";
    c.textBaseline = "alphabetic";
    const m2 = c.measureText(o.text);
    const asc = m2.actualBoundingBoxAscent || size * 0.72;
    const desc = m2.actualBoundingBoxDescent || 0;
    const cy = o.centerY(w, h) * sh;
    c.fillStyle = "#000";
    c.fillText(o.text, sw / 2, cy + (asc - desc) / 2);
    const data = c.getImageData(0, 0, sw, sh).data;

    const pts: number[] = [];
    for (let y = 0; y < sh; y++) {
      for (let x = 0; x < sw; x++) {
        if (data[(y * sw + x) * 4 + 3] > 140) pts.push(x, y);
      }
    }
    const count = Math.round(
      Math.min(o.max, Math.max(o.min, ((w * h) / 1000) * o.density))
    );
    this.alloc(count);
    const total = pts.length / 2;
    for (let i = 0; i < count; i++) {
      if (total === 0) {
        this.tx[i] = w / 2;
        this.ty[i] = h / 2;
        continue;
      }
      const k = (Math.random() * total) | 0;
      this.tx[i] = (pts[k * 2] + Math.random()) / scale;
      this.ty[i] = (pts[k * 2 + 1] + Math.random()) / scale;
    }
  }

  private alloc(count: number) {
    if (count !== this.n) {
      this.n = count;
      this.tx = new Float32Array(count);
      this.ty = new Float32Array(count);
      this.ex = new Float32Array(count);
      this.ey = new Float32Array(count);
      this.heat = new Float32Array(count);
      this.group = new Uint8Array(count);
      this.reseedNoise();
    }
    // Contiguous colour groups so drawing needs one fillStyle per group.
    const shares = this.o.palette.map((p) => p.share);
    const sum = shares.reduce((a, b) => a + b, 0);
    this.groupStart = [];
    let at = 0;
    shares.forEach((s, g) => {
      this.groupStart.push(at);
      const end = g === shares.length - 1 ? count : Math.round(at + (s / sum) * count);
      for (let i = at; i < end; i++) this.group[i] = g;
      at = end;
    });
    this.groupStart.push(count);
  }

  private reseedNoise() {
    for (let i = 0; i < this.n; i++) {
      // Box-Muller
      const u = Math.random() || 1e-6;
      const v = Math.random();
      const r = Math.sqrt(-2 * Math.log(u));
      this.ex[i] = r * Math.cos(2 * Math.PI * v);
      this.ey[i] = r * Math.sin(2 * Math.PI * v);
    }
  }

  /** Start a fresh sample from pure noise. */
  resample() {
    this.sample();
    this.reseedNoise();
    this.tau = 0;
    this.mode = "auto";
    this.runStart = performance.now();
    this.lastStep = -1;
    this.wake();
  }

  /** Follow an externally driven tau (scroll, leave, etc). */
  follow(target: number) {
    this.mode = "follow";
    this.target = Math.min(1, Math.max(0, target));
    this.wake();
  }

  setVisible(v: boolean) {
    this.visible = v;
    if (v) this.wake();
    else this.sleep();
  }

  setHidden(h: boolean) {
    this.hidden = h;
    if (h) this.sleep();
    else this.wake();
  }

  pointer(x: number, y: number) {
    this.px = x;
    this.py = y;
    this.pointerAt = performance.now();
    this.pointerOn = true;
    this.wake();
  }

  pointerLeave() {
    this.pointerOn = false;
    this.o.onLocal?.(0, 0, 0, false);
  }

  /** Draw a single settled frame (reduced motion). */
  still(tau = 1) {
    this.tau = tau;
    this.heat.fill(0);
    this.draw(0);
  }

  destroy() {
    this.sleep();
  }

  private wake() {
    if (this.running || !this.visible || this.hidden) return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  private sleep() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private frame = (now: number) => {
    if (!this.running) return;
    const dt = Math.max(0, Math.min(48, now - this.last));
    this.last = now;
    const { o } = this;

    if (this.mode === "auto") {
      const t = Math.min(1, (now - this.runStart) / o.duration);
      // ease-out so the late, fine steps get more screen time
      this.tau = 1 - Math.pow(1 - t, 2.2);
      const step = Math.min(o.steps, Math.floor(t * o.steps));
      if (step !== this.lastStep) {
        this.lastStep = step;
        o.onStep?.(step, Math.cos((Math.PI / 2) * this.tau));
      }
    } else {
      const k = 1 - Math.pow(0.9, dt / 16.7);
      this.tau += (this.target - this.tau) * k;
      if (Math.abs(this.target - this.tau) < 0.0005) this.tau = this.target;
      const step = Math.round(this.tau * o.steps);
      if (step !== this.lastStep) {
        this.lastStep = step;
        o.onStep?.(step, Math.cos((Math.PI / 2) * this.tau));
      }
    }

    // Brush: inject heat near the pointer while it is moving.
    const n = this.n;
    const heat = this.heat;
    const brushing = this.pointerOn && now - this.pointerAt < 140;
    let local = 0;
    if (brushing) {
      const r = o.brush;
      const r2 = r * r;
      const gain = 0.16 * (dt / 16.7);
      for (let i = 0; i < n; i++) {
        const dx = this.tx[i] - this.px;
        const dy = this.ty[i] - this.py;
        const d2 = dx * dx + dy * dy;
        if (d2 < r2) {
          const f = 1 - Math.sqrt(d2) / r;
          heat[i] = Math.min(1, heat[i] + f * f * gain * 2.4);
          if (heat[i] > local) local = heat[i];
        }
      }
    }
    const decay = Math.pow(0.955, dt / 16.7);
    let hot = 0;
    for (let i = 0; i < n; i++) {
      if (heat[i] > 0.002) {
        heat[i] *= decay;
        hot++;
      } else heat[i] = 0;
    }
    if (this.pointerOn) {
      o.onLocal?.(this.px, this.py, local, brushing);
    }

    // Drift eps (OU walk, unit variance preserved).
    const rho = Math.pow(0.985, dt / 16.7);
    const kick = Math.sqrt(1 - rho * rho);
    for (let i = 0; i < n; i++) {
      this.ex[i] = this.ex[i] * rho + kick * gauss();
      this.ey[i] = this.ey[i] * rho + kick * gauss();
    }

    this.draw(now);

    const settled =
      (this.mode === "auto" ? this.tau >= 1 : this.tau === this.target) &&
      hot === 0 &&
      !brushing;
    // Keep a gentle idle shimmer only while the canvas is visible; but stop the
    // loop entirely once everything has settled and nobody is touching it.
    if (settled && this.idleFrames++ > 90) {
      this.idleFrames = 0;
      this.running = false;
      return;
    }
    if (!settled) this.idleFrames = 0;
    this.raf = requestAnimationFrame(this.frame);
  };
  private idleFrames = 0;

  private draw(now: number) {
    const { ctx, w, h, dpr, n, o } = this;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!n) return;
    const a = Math.sin((Math.PI / 2) * this.tau);
    const b = Math.cos((Math.PI / 2) * this.tau);
    const cx = w / 2;
    const cy = o.centerY(w, h) * h;
    const sx = w * 0.26;
    const sy = h * 0.3;
    const shimmer = 0.35 + 0.15 * Math.sin(now / 900);
    const brushPx = o.brush * 0.55;
    for (let g = 0; g < o.palette.length; g++) {
      const p = o.palette[g];
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha ?? 1;
      const s = p.size;
      const half = s / 2;
      const end = this.groupStart[g + 1];
      for (let i = this.groupStart[g]; i < end; i++) {
        const hx = this.heat[i] * brushPx;
        const x = cx + a * (this.tx[i] - cx) + this.ex[i] * (b * sx + hx + shimmer);
        const y = cy + a * (this.ty[i] - cy) + this.ey[i] * (b * sy + hx + shimmer);
        ctx.fillRect(x - half, y - half, s, s);
      }
    }
    ctx.globalAlpha = 1;
  }
}

// Cheap approximate standard normal (sum of uniforms, Irwin-Hall, var 1).
function gauss() {
  return (Math.random() + Math.random() + Math.random() - 1.5) * 2;
}
