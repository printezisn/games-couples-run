import { D as c, F as we, P as T, V as at, T as nt, p as oe, g as A, K as Ce, u as V, G as B, C as st, a as Q, x as Re, j as C, b as _, W as ot, R as Z, m as dt, o as Be, $ as lt, c as ut, d as ht, e as N, f as X, t as G, H as k, h as ct, i as q, N as pt, l as U, n as de, I as L, q as ft, r as ee, v as Ue, w as Pe, y as gt, z as mt, A as xt, J as Me, L as _t, M as bt, O as ke, Q as yt, S as Ae, U as le, Z as ue, X as J, Y as z, _ as he, a0 as H, a1 as Tt, a2 as vt, a3 as St } from "./index-DhNE1FXG.js";
import { k as w, w as E, v as W, U as Fe, m as wt, O as Ct } from "./colorToUniform-CoBYoR1j-yYvqPvR8.js";
class Ge {
  /**
   * Initialize the plugin with scope of application instance
   * @static
   * @private
   * @param {object} [options] - See application options
   */
  static init(e) {
    Object.defineProperty(
      this,
      "resizeTo",
      /**
       * The HTML element or window to automatically resize the
       * renderer's view element to match width and height.
       * @member {Window|HTMLElement}
       * @name resizeTo
       * @memberof app.Application#
       */
      {
        set(t) {
          globalThis.removeEventListener("resize", this.queueResize), this._resizeTo = t, t && (globalThis.addEventListener("resize", this.queueResize), this.resize());
        },
        get() {
          return this._resizeTo;
        }
      }
    ), this.queueResize = () => {
      this._resizeTo && (this._cancelResize(), this._resizeId = requestAnimationFrame(() => this.resize()));
    }, this._cancelResize = () => {
      this._resizeId && (cancelAnimationFrame(this._resizeId), this._resizeId = null);
    }, this.resize = () => {
      if (!this._resizeTo)
        return;
      this._cancelResize();
      let t, r;
      if (this._resizeTo === globalThis.window)
        t = globalThis.innerWidth, r = globalThis.innerHeight;
      else {
        const { clientWidth: i, clientHeight: n } = this._resizeTo;
        t = i, r = n;
      }
      this.renderer.resize(t, r), this.render();
    }, this._resizeId = null, this._resizeTo = null, this.resizeTo = e.resizeTo || null;
  }
  /**
   * Clean up the ticker, scoped to application
   * @static
   * @private
   */
  static destroy() {
    globalThis.removeEventListener("resize", this.queueResize), this._cancelResize(), this._cancelResize = null, this.queueResize = null, this.resizeTo = null, this.resize = null;
  }
}
Ge.extension = c.Application;
class ze {
  /**
   * Initialize the plugin with scope of application instance
   * @static
   * @private
   * @param {object} [options] - See application options
   */
  static init(e) {
    e = Object.assign({
      autoStart: !0,
      sharedTicker: !1
    }, e), Object.defineProperty(
      this,
      "ticker",
      {
        set(t) {
          this._ticker && this._ticker.remove(this.render, this), this._ticker = t, t && t.add(this.render, this, nt.LOW);
        },
        get() {
          return this._ticker;
        }
      }
    ), this.stop = () => {
      this._ticker.stop();
    }, this.start = () => {
      this._ticker.start();
    }, this._ticker = null, this.ticker = e.sharedTicker ? oe.shared : new oe(), e.autoStart && this.start();
  }
  /**
   * Clean up the ticker, scoped to application.
   * @static
   * @private
   */
  static destroy() {
    if (this._ticker) {
      const e = this._ticker;
      this.ticker = null, e.destroy();
    }
  }
}
ze.extension = c.Application;
class He {
  constructor(e) {
    this._renderer = e;
  }
  push(e, t, r) {
    this._renderer.renderPipes.batch.break(r), r.add({
      renderPipeId: "filter",
      canBundle: !1,
      action: "pushFilter",
      container: t,
      filterEffect: e
    });
  }
  pop(e, t, r) {
    this._renderer.renderPipes.batch.break(r), r.add({
      renderPipeId: "filter",
      action: "popFilter",
      canBundle: !1
    });
  }
  execute(e) {
    e.action === "pushFilter" ? this._renderer.filter.push(e) : e.action === "popFilter" && this._renderer.filter.pop();
  }
  destroy() {
    this._renderer = null;
  }
}
He.extension = {
  type: [
    c.WebGLPipes,
    c.WebGPUPipes,
    c.CanvasPipes
  ],
  name: "filter"
};
const Rt = new C();
function Bt(a, e) {
  return e.clear(), De(a, e), e.isValid || e.set(0, 0, 0, 0), a.renderGroup ? e.applyMatrix(a.renderGroup.localTransform) : e.applyMatrix(a.parentRenderGroup.worldTransform), e;
}
function De(a, e) {
  if (a.localDisplayStatus !== 7 || !a.measurable)
    return;
  const t = !!a.effects.length;
  let r = e;
  if ((a.renderGroup || t) && (r = L.get().clear()), a.boundsArea)
    e.addRect(a.boundsArea, a.worldTransform);
  else {
    if (a.renderPipeId) {
      const n = a.bounds;
      r.addFrame(
        n.minX,
        n.minY,
        n.maxX,
        n.maxY,
        a.groupTransform
      );
    }
    const i = a.children;
    for (let n = 0; n < i.length; n++)
      De(i[n], r);
  }
  if (t) {
    let i = !1;
    for (let n = 0; n < a.effects.length; n++)
      a.effects[n].addBounds && (i || (i = !0, r.applyMatrix(a.parentRenderGroup.worldTransform)), a.effects[n].addBounds(r, !0));
    i && (r.applyMatrix(a.parentRenderGroup.worldTransform.copyTo(Rt).invert()), e.addBounds(r, a.relativeGroupTransform)), e.addBounds(r), L.return(r);
  } else a.renderGroup && (e.addBounds(r, a.relativeGroupTransform), L.return(r));
}
function Ut(a, e) {
  e.clear();
  const t = e.matrix;
  for (let r = 0; r < a.length; r++) {
    const i = a[r];
    i.globalDisplayStatus < 7 || (e.matrix = i.worldTransform, i.addBounds(e));
  }
  return e.matrix = t, e;
}
const Pt = new we({
  attributes: {
    aPosition: {
      buffer: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
      format: "float32x2",
      stride: 2 * 4,
      offset: 0
    }
  },
  indexBuffer: new Uint32Array([0, 1, 2, 0, 2, 3])
});
class Oe {
  constructor(e) {
    this._filterStackIndex = 0, this._filterStack = [], this._filterGlobalUniforms = new A({
      uInputSize: { value: new Float32Array(4), type: "vec4<f32>" },
      uInputPixel: { value: new Float32Array(4), type: "vec4<f32>" },
      uInputClamp: { value: new Float32Array(4), type: "vec4<f32>" },
      uOutputFrame: { value: new Float32Array(4), type: "vec4<f32>" },
      uGlobalFrame: { value: new Float32Array(4), type: "vec4<f32>" },
      uOutputTexture: { value: new Float32Array(4), type: "vec4<f32>" }
    }), this._globalFilterBindGroup = new Ce({}), this.renderer = e;
  }
  /**
   * The back texture of the currently active filter. Requires the filter to have `blendRequired` set to true.
   * @readonly
   */
  get activeBackTexture() {
    var e;
    return (e = this._activeFilterData) == null ? void 0 : e.backTexture;
  }
  push(e) {
    var t;
    const r = this.renderer, i = e.filterEffect.filters;
    this._filterStack[this._filterStackIndex] || (this._filterStack[this._filterStackIndex] = this._getFilterData());
    const n = this._filterStack[this._filterStackIndex];
    if (this._filterStackIndex++, i.length === 0) {
      n.skip = !0;
      return;
    }
    const s = n.bounds;
    e.renderables ? Ut(e.renderables, s) : e.filterEffect.filterArea ? (s.clear(), s.addRect(e.filterEffect.filterArea), s.applyMatrix(e.container.worldTransform)) : Bt(e.container, s);
    const o = r.renderTarget.renderTarget.colorTexture.source;
    let d = 1 / 0, u = 0, l = !0, h = !1, p = !1, m = !0;
    for (let g = 0; g < i.length; g++) {
      const f = i[g];
      if (d = Math.min(d, f.resolution === "inherit" ? o._resolution : f.resolution), u += f.padding, f.antialias === "off" ? l = !1 : f.antialias === "inherit" && l && (l = o.antialias), f.clipToViewport || (m = !1), !(f.compatibleRenderers & r.type)) {
        p = !1;
        break;
      }
      if (f.blendRequired && !(((t = r.backBuffer) == null ? void 0 : t.useBackBuffer) ?? !0)) {
        V("Blend filter requires backBuffer on WebGL renderer to be enabled. Set `useBackBuffer: true` in the renderer options."), p = !1;
        break;
      }
      p = f.enabled || p, h = h || f.blendRequired;
    }
    if (!p) {
      n.skip = !0;
      return;
    }
    if (s.scale(d), m) {
      const g = r.renderTarget.rootViewPort;
      s.fitBounds(0, g.width, 0, g.height);
    }
    if (s.ceil().scale(1 / d).pad(u | 0), !s.isPositive) {
      n.skip = !0;
      return;
    }
    n.skip = !1, n.bounds = s, n.blendRequired = h, n.container = e.container, n.filterEffect = e.filterEffect, n.previousRenderSurface = r.renderTarget.renderSurface, n.inputTexture = w.getOptimalTexture(
      s.width,
      s.height,
      d,
      l
    ), r.renderTarget.bind(n.inputTexture, !0), r.globalUniforms.push({
      offset: s
    });
  }
  pop() {
    const e = this.renderer;
    this._filterStackIndex--;
    const t = this._filterStack[this._filterStackIndex];
    if (t.skip)
      return;
    this._activeFilterData = t;
    const r = t.inputTexture, i = t.bounds;
    let n = B.EMPTY;
    if (e.renderTarget.finishRenderPass(), t.blendRequired) {
      const o = this._filterStackIndex > 0 ? this._filterStack[this._filterStackIndex - 1].bounds : null, d = e.renderTarget.getRenderTarget(t.previousRenderSurface);
      n = this.getBackTexture(d, i, o);
    }
    t.backTexture = n;
    const s = t.filterEffect.filters;
    if (this._globalFilterBindGroup.setResource(r.source.style, 2), this._globalFilterBindGroup.setResource(n.source, 3), e.globalUniforms.pop(), s.length === 1)
      s[0].apply(this, r, t.previousRenderSurface, !1), w.returnTexture(r);
    else {
      let o = t.inputTexture, d = w.getOptimalTexture(
        i.width,
        i.height,
        o.source._resolution,
        !1
      ), u = 0;
      for (u = 0; u < s.length - 1; ++u) {
        s[u].apply(this, o, d, !0);
        const l = o;
        o = d, d = l;
      }
      s[u].apply(this, o, t.previousRenderSurface, !1), w.returnTexture(o), w.returnTexture(d);
    }
    t.blendRequired && w.returnTexture(n);
  }
  getBackTexture(e, t, r) {
    const i = e.colorTexture.source._resolution, n = w.getOptimalTexture(
      t.width,
      t.height,
      i,
      !1
    );
    let s = t.minX, o = t.minY;
    r && (s -= r.minX, o -= r.minY), s = Math.floor(s * i), o = Math.floor(o * i);
    const d = Math.ceil(t.width * i), u = Math.ceil(t.height * i);
    return this.renderer.renderTarget.copyToTexture(
      e,
      n,
      { x: s, y: o },
      { width: d, height: u },
      { x: 0, y: 0 }
    ), n;
  }
  applyFilter(e, t, r, i) {
    const n = this.renderer, s = this._filterStack[this._filterStackIndex], o = s.bounds, d = st.shared, u = s.previousRenderSurface === r;
    let l = this.renderer.renderTarget.rootRenderTarget.colorTexture.source._resolution, h = this._filterStackIndex - 1;
    for (; h > 0 && this._filterStack[h].skip; )
      --h;
    h > 0 && (l = this._filterStack[h].inputTexture.source._resolution);
    const p = this._filterGlobalUniforms, m = p.uniforms, g = m.uOutputFrame, f = m.uInputSize, x = m.uInputPixel, y = m.uInputClamp, R = m.uGlobalFrame, b = m.uOutputTexture;
    if (u) {
      let S = this._filterStackIndex;
      for (; S > 0; ) {
        S--;
        const M = this._filterStack[this._filterStackIndex - 1];
        if (!M.skip) {
          d.x = M.bounds.minX, d.y = M.bounds.minY;
          break;
        }
      }
      g[0] = o.minX - d.x, g[1] = o.minY - d.y;
    } else
      g[0] = 0, g[1] = 0;
    g[2] = t.frame.width, g[3] = t.frame.height, f[0] = t.source.width, f[1] = t.source.height, f[2] = 1 / f[0], f[3] = 1 / f[1], x[0] = t.source.pixelWidth, x[1] = t.source.pixelHeight, x[2] = 1 / x[0], x[3] = 1 / x[1], y[0] = 0.5 * x[2], y[1] = 0.5 * x[3], y[2] = t.frame.width * f[2] - 0.5 * x[2], y[3] = t.frame.height * f[3] - 0.5 * x[3];
    const P = this.renderer.renderTarget.rootRenderTarget.colorTexture;
    R[0] = d.x * l, R[1] = d.y * l, R[2] = P.source.width * l, R[3] = P.source.height * l;
    const F = this.renderer.renderTarget.getRenderTarget(r);
    if (n.renderTarget.bind(r, !!i), r instanceof B ? (b[0] = r.frame.width, b[1] = r.frame.height) : (b[0] = F.width, b[1] = F.height), b[2] = F.isRoot ? -1 : 1, p.update(), n.renderPipes.uniformBatch) {
      const S = n.renderPipes.uniformBatch.getUboResource(p);
      this._globalFilterBindGroup.setResource(S, 0);
    } else
      this._globalFilterBindGroup.setResource(p, 0);
    this._globalFilterBindGroup.setResource(t.source, 1), this._globalFilterBindGroup.setResource(t.source.style, 2), e.groups[0] = this._globalFilterBindGroup, n.encoder.draw({
      geometry: Pt,
      shader: e,
      state: e._state,
      topology: "triangle-list"
    }), n.type === Q.WEBGL && n.renderTarget.finishRenderPass();
  }
  _getFilterData() {
    return {
      skip: !1,
      inputTexture: null,
      bounds: new Re(),
      container: null,
      filterEffect: null,
      blendRequired: !1,
      previousRenderSurface: null
    };
  }
  /**
   * Multiply _input normalized coordinates_ to this matrix to get _sprite texture normalized coordinates_.
   *
   * Use `outputMatrix * vTextureCoord` in the shader.
   * @param outputMatrix - The matrix to output to.
   * @param {Sprite} sprite - The sprite to map to.
   * @returns The mapped matrix.
   */
  calculateSpriteMatrix(e, t) {
    const r = this._activeFilterData, i = e.set(
      r.inputTexture._source.width,
      0,
      0,
      r.inputTexture._source.height,
      r.bounds.minX,
      r.bounds.minY
    ), n = t.worldTransform.copyTo(C.shared);
    return n.invert(), i.prepend(n), i.scale(
      1 / t.texture.frame.width,
      1 / t.texture.frame.height
    ), i.translate(t.anchor.x, t.anchor.y), i;
  }
}
Oe.extension = {
  type: [
    c.WebGLSystem,
    c.WebGPUSystem
  ],
  name: "filter"
};
function Mt(a) {
  const e = a._stroke, t = a._fill, r = [`div { ${[
    `color: ${U.shared.setValue(t.color).toHex()}`,
    `font-size: ${a.fontSize}px`,
    `font-family: ${a.fontFamily}`,
    `font-weight: ${a.fontWeight}`,
    `font-style: ${a.fontStyle}`,
    `font-variant: ${a.fontVariant}`,
    `letter-spacing: ${a.letterSpacing}px`,
    `text-align: ${a.align}`,
    `padding: ${a.padding}px`,
    `white-space: ${a.whiteSpace === "pre" && a.wordWrap ? "pre-wrap" : a.whiteSpace}`,
    ...a.lineHeight ? [`line-height: ${a.lineHeight}px`] : [],
    ...a.wordWrap ? [
      `word-wrap: ${a.breakWords ? "break-all" : "break-word"}`,
      `max-width: ${a.wordWrapWidth}px`
    ] : [],
    ...e ? [Ee(e)] : [],
    ...a.dropShadow ? [Ve(a.dropShadow)] : [],
    ...a.cssOverrides
  ].join(";")} }`];
  return kt(a.tagStyles, r), r.join(" ");
}
function Ve(a) {
  const e = U.shared.setValue(a.color).setAlpha(a.alpha).toHexa(), t = Math.round(Math.cos(a.angle) * a.distance), r = Math.round(Math.sin(a.angle) * a.distance), i = `${t}px ${r}px`;
  return a.blur > 0 ? `text-shadow: ${i} ${a.blur}px ${e}` : `text-shadow: ${i} ${e}`;
}
function Ee(a) {
  return [
    `-webkit-text-stroke-width: ${a.width}px`,
    `-webkit-text-stroke-color: ${U.shared.setValue(a.color).toHex()}`,
    `text-stroke-width: ${a.width}px`,
    `text-stroke-color: ${U.shared.setValue(a.color).toHex()}`,
    "paint-order: stroke"
  ].join(";");
}
const ce = {
  fontSize: "font-size: {{VALUE}}px",
  fontFamily: "font-family: {{VALUE}}",
  fontWeight: "font-weight: {{VALUE}}",
  fontStyle: "font-style: {{VALUE}}",
  fontVariant: "font-variant: {{VALUE}}",
  letterSpacing: "letter-spacing: {{VALUE}}px",
  align: "text-align: {{VALUE}}",
  padding: "padding: {{VALUE}}px",
  whiteSpace: "white-space: {{VALUE}}",
  lineHeight: "line-height: {{VALUE}}px",
  wordWrapWidth: "max-width: {{VALUE}}px"
}, pe = {
  fill: (a) => `color: ${U.shared.setValue(a).toHex()}`,
  breakWords: (a) => `word-wrap: ${a ? "break-all" : "break-word"}`,
  stroke: Ee,
  dropShadow: Ve
};
function kt(a, e) {
  for (const t in a) {
    const r = a[t], i = [];
    for (const n in r)
      pe[n] ? i.push(pe[n](r[n])) : ce[n] && i.push(ce[n].replace("{{VALUE}}", r[n]));
    e.push(`${t} { ${i.join(";")} }`);
  }
}
class te extends q {
  constructor(e = {}) {
    super(e), this._cssOverrides = [], this.cssOverrides ?? (this.cssOverrides = e.cssOverrides), this.tagStyles = e.tagStyles ?? {};
  }
  /** List of style overrides that will be applied to the HTML text. */
  set cssOverrides(e) {
    this._cssOverrides = e instanceof Array ? e : [e], this.update();
  }
  get cssOverrides() {
    return this._cssOverrides;
  }
  _generateKey() {
    return this._styleKey = ft(this) + this._cssOverrides.join("-"), this._styleKey;
  }
  update() {
    this._cssStyle = null, super.update();
  }
  /**
   * Creates a new HTMLTextStyle object with the same values as this one.
   * @returns New cloned HTMLTextStyle object
   */
  clone() {
    return new te({
      align: this.align,
      breakWords: this.breakWords,
      dropShadow: this.dropShadow ? { ...this.dropShadow } : null,
      fill: this._fill,
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      fontStyle: this.fontStyle,
      fontVariant: this.fontVariant,
      fontWeight: this.fontWeight,
      letterSpacing: this.letterSpacing,
      lineHeight: this.lineHeight,
      padding: this.padding,
      stroke: this._stroke,
      whiteSpace: this.whiteSpace,
      wordWrap: this.wordWrap,
      wordWrapWidth: this.wordWrapWidth,
      cssOverrides: this.cssOverrides
    });
  }
  get cssStyle() {
    return this._cssStyle || (this._cssStyle = Mt(this)), this._cssStyle;
  }
  /**
   * Add a style override, this can be any CSS property
   * it will override any built-in style. This is the
   * property and the value as a string (e.g., `color: red`).
   * This will override any other internal style.
   * @param {string} value - CSS style(s) to add.
   * @example
   * style.addOverride('background-color: red');
   */
  addOverride(...e) {
    const t = e.filter((r) => !this.cssOverrides.includes(r));
    t.length > 0 && (this.cssOverrides.push(...t), this.update());
  }
  /**
   * Remove any overrides that match the value.
   * @param {string} value - CSS style to remove.
   * @example
   * style.removeOverride('background-color: red');
   */
  removeOverride(...e) {
    const t = e.filter((r) => this.cssOverrides.includes(r));
    t.length > 0 && (this.cssOverrides = this.cssOverrides.filter((r) => !t.includes(r)), this.update());
  }
  set fill(e) {
    typeof e != "string" && typeof e != "number" && V("[HTMLTextStyle] only color fill is not supported by HTMLText"), super.fill = e;
  }
  set stroke(e) {
    e && typeof e != "string" && typeof e != "number" && V("[HTMLTextStyle] only color stroke is not supported by HTMLText"), super.stroke = e;
  }
}
const fe = "http://www.w3.org/2000/svg", ge = "http://www.w3.org/1999/xhtml";
class We {
  constructor() {
    this.svgRoot = document.createElementNS(fe, "svg"), this.foreignObject = document.createElementNS(fe, "foreignObject"), this.domElement = document.createElementNS(ge, "div"), this.styleElement = document.createElementNS(ge, "style"), this.image = new Image();
    const { foreignObject: e, svgRoot: t, styleElement: r, domElement: i } = this;
    e.setAttribute("width", "10000"), e.setAttribute("height", "10000"), e.style.overflow = "hidden", t.appendChild(e), e.appendChild(r), e.appendChild(i);
  }
}
let me;
function At(a, e, t, r) {
  r = r || me || (me = new We());
  const { domElement: i, styleElement: n, svgRoot: s } = r;
  i.innerHTML = `<style>${e.cssStyle};</style><div style='padding:0'>${a}</div>`, i.setAttribute("style", "transform-origin: top left; display: inline-block"), t && (n.textContent = t), document.body.appendChild(s);
  const o = i.getBoundingClientRect();
  s.remove();
  const d = e.padding * 2;
  return {
    width: o.width - d,
    height: o.height - d
  };
}
class Ie {
  constructor(e, t) {
    this.state = E.for2d(), this._graphicsBatchesHash = /* @__PURE__ */ Object.create(null), this._destroyRenderableBound = this.destroyRenderable.bind(this), this.renderer = e, this._adaptor = t, this._adaptor.init(), this.renderer.renderableGC.addManagedHash(this, "_graphicsBatchesHash");
  }
  validateRenderable(e) {
    const t = e.context, r = !!this._graphicsBatchesHash[e.uid], i = this.renderer.graphicsContext.updateGpuContext(t);
    return !!(i.isBatchable || r !== i.isBatchable);
  }
  addRenderable(e, t) {
    const r = this.renderer.graphicsContext.updateGpuContext(e.context);
    e.didViewUpdate && this._rebuild(e), r.isBatchable ? this._addToBatcher(e, t) : (this.renderer.renderPipes.batch.break(t), t.add(e));
  }
  updateRenderable(e) {
    const t = this._graphicsBatchesHash[e.uid];
    if (t)
      for (let r = 0; r < t.length; r++) {
        const i = t[r];
        i._batcher.updateElement(i);
      }
  }
  destroyRenderable(e) {
    this._graphicsBatchesHash[e.uid] && this._removeBatchForRenderable(e.uid), e.off("destroyed", this._destroyRenderableBound);
  }
  execute(e) {
    if (!e.isRenderable)
      return;
    const t = this.renderer, r = e.context;
    if (!t.graphicsContext.getGpuContext(r).batches.length)
      return;
    const i = r.customShader || this._adaptor.shader;
    this.state.blendMode = e.groupBlendMode;
    const n = i.resources.localUniforms.uniforms;
    n.uTransformMatrix = e.groupTransform, n.uRound = t._roundPixels | e._roundPixels, W(
      e.groupColorAlpha,
      n.uColor,
      0
    ), this._adaptor.execute(this, e);
  }
  _rebuild(e) {
    const t = !!this._graphicsBatchesHash[e.uid], r = this.renderer.graphicsContext.updateGpuContext(e.context);
    t && this._removeBatchForRenderable(e.uid), r.isBatchable && this._initBatchesForRenderable(e), e.batched = r.isBatchable;
  }
  _addToBatcher(e, t) {
    const r = this.renderer.renderPipes.batch, i = this._getBatchesForRenderable(e);
    for (let n = 0; n < i.length; n++) {
      const s = i[n];
      r.addToBatch(s, t);
    }
  }
  _getBatchesForRenderable(e) {
    return this._graphicsBatchesHash[e.uid] || this._initBatchesForRenderable(e);
  }
  _initBatchesForRenderable(e) {
    const t = e.context, r = this.renderer.graphicsContext.getGpuContext(t), i = this.renderer._roundPixels | e._roundPixels, n = r.batches.map((s) => {
      const o = _.get(ot);
      return s.copyTo(o), o.renderable = e, o.roundPixels = i, o;
    });
    return this._graphicsBatchesHash[e.uid] === void 0 && e.on("destroyed", this._destroyRenderableBound), this._graphicsBatchesHash[e.uid] = n, n;
  }
  _removeBatchForRenderable(e) {
    this._graphicsBatchesHash[e].forEach((t) => {
      _.return(t);
    }), this._graphicsBatchesHash[e] = null;
  }
  destroy() {
    this.renderer = null, this._adaptor.destroy(), this._adaptor = null, this.state = null;
    for (const e in this._graphicsBatchesHash)
      this._removeBatchForRenderable(e);
    this._graphicsBatchesHash = null;
  }
}
Ie.extension = {
  type: [
    c.WebGLPipes,
    c.WebGPUPipes,
    c.CanvasPipes
  ],
  name: "graphics"
};
class re {
  constructor() {
    this.batcherName = "default", this.packAsQuad = !1, this.indexOffset = 0, this.attributeOffset = 0, this.roundPixels = 0, this._batcher = null, this._batch = null, this._uvUpdateId = -1, this._textureMatrixUpdateId = -1;
  }
  get blendMode() {
    return this.renderable.groupBlendMode;
  }
  reset() {
    this.renderable = null, this.texture = null, this._batcher = null, this._batch = null, this.geometry = null, this._uvUpdateId = -1, this._textureMatrixUpdateId = -1;
  }
  get uvs() {
    const e = this.geometry.getBuffer("aUV"), t = e.data;
    let r = t;
    const i = this.texture.textureMatrix;
    return i.isSimple || (r = this._transformedUvs, (this._textureMatrixUpdateId !== i._updateID || this._uvUpdateId !== e._updateID) && ((!r || r.length < t.length) && (r = this._transformedUvs = new Float32Array(t.length)), this._textureMatrixUpdateId = i._updateID, this._uvUpdateId = e._updateID, i.multiplyUvs(t, r))), r;
  }
  get positions() {
    return this.geometry.positions;
  }
  get indices() {
    return this.geometry.indices;
  }
  get color() {
    return this.renderable.groupColorAlpha;
  }
  get groupTransform() {
    return this.renderable.groupTransform;
  }
  get attributeSize() {
    return this.geometry.positions.length / 2;
  }
  get indexSize() {
    return this.geometry.indices.length;
  }
}
class Le {
  constructor(e, t) {
    this.localUniforms = new A({
      uTransformMatrix: { value: new C(), type: "mat3x3<f32>" },
      uColor: { value: new Float32Array([1, 1, 1, 1]), type: "vec4<f32>" },
      uRound: { value: 0, type: "f32" }
    }), this.localUniformsBindGroup = new Ce({
      0: this.localUniforms
    }), this._meshDataHash = /* @__PURE__ */ Object.create(null), this._gpuBatchableMeshHash = /* @__PURE__ */ Object.create(null), this._destroyRenderableBound = this.destroyRenderable.bind(this), this.renderer = e, this._adaptor = t, this._adaptor.init(), e.renderableGC.addManagedHash(this, "_gpuBatchableMeshHash"), e.renderableGC.addManagedHash(this, "_meshDataHash");
  }
  validateRenderable(e) {
    const t = this._getMeshData(e), r = t.batched, i = e.batched;
    if (t.batched = i, r !== i)
      return !0;
    if (i) {
      const n = e._geometry;
      if (n.indices.length !== t.indexSize || n.positions.length !== t.vertexSize)
        return t.indexSize = n.indices.length, t.vertexSize = n.positions.length, !0;
      const s = this._getBatchableMesh(e), o = e.texture;
      if (s.texture._source !== o._source && s.texture._source !== o._source)
        return !s._batcher.checkAndUpdateTexture(s, o);
    }
    return !1;
  }
  addRenderable(e, t) {
    const r = this.renderer.renderPipes.batch, { batched: i } = this._getMeshData(e);
    if (i) {
      const n = this._getBatchableMesh(e);
      n.texture = e._texture, n.geometry = e._geometry, r.addToBatch(n, t);
    } else
      r.break(t), t.add(e);
  }
  updateRenderable(e) {
    if (e.batched) {
      const t = this._gpuBatchableMeshHash[e.uid];
      t.texture = e._texture, t.geometry = e._geometry, t._batcher.updateElement(t);
    }
  }
  destroyRenderable(e) {
    this._meshDataHash[e.uid] = null;
    const t = this._gpuBatchableMeshHash[e.uid];
    t && (_.return(t), this._gpuBatchableMeshHash[e.uid] = null), e.off("destroyed", this._destroyRenderableBound);
  }
  execute(e) {
    if (!e.isRenderable)
      return;
    e.state.blendMode = Z(e.groupBlendMode, e.texture._source);
    const t = this.localUniforms;
    t.uniforms.uTransformMatrix = e.groupTransform, t.uniforms.uRound = this.renderer._roundPixels | e._roundPixels, t.update(), W(
      e.groupColorAlpha,
      t.uniforms.uColor,
      0
    ), this._adaptor.execute(this, e);
  }
  _getMeshData(e) {
    return this._meshDataHash[e.uid] || this._initMeshData(e);
  }
  _initMeshData(e) {
    var t, r;
    return this._meshDataHash[e.uid] = {
      batched: e.batched,
      indexSize: (t = e._geometry.indices) == null ? void 0 : t.length,
      vertexSize: (r = e._geometry.positions) == null ? void 0 : r.length
    }, e.on("destroyed", this._destroyRenderableBound), this._meshDataHash[e.uid];
  }
  _getBatchableMesh(e) {
    return this._gpuBatchableMeshHash[e.uid] || this._initBatchableMesh(e);
  }
  _initBatchableMesh(e) {
    const t = _.get(re);
    return t.renderable = e, t.texture = e._texture, t.transform = e.groupTransform, t.roundPixels = this.renderer._roundPixels | e._roundPixels, this._gpuBatchableMeshHash[e.uid] = t, t;
  }
  destroy() {
    for (const e in this._gpuBatchableMeshHash)
      this._gpuBatchableMeshHash[e] && _.return(this._gpuBatchableMeshHash[e]);
    this._gpuBatchableMeshHash = null, this._meshDataHash = null, this.localUniforms = null, this.localUniformsBindGroup = null, this._adaptor.destroy(), this._adaptor = null, this.renderer = null;
  }
}
Le.extension = {
  type: [
    c.WebGLPipes,
    c.WebGPUPipes,
    c.CanvasPipes
  ],
  name: "mesh"
};
class Ft {
  execute(e, t) {
    const r = e.state, i = e.renderer, n = t.shader || e.defaultShader;
    n.resources.uTexture = t.texture._source, n.resources.uniforms = e.localUniforms;
    const s = i.gl, o = e.getBuffers(t);
    i.shader.bind(n), i.state.set(r), i.geometry.bind(o.geometry, n.glProgram);
    const d = o.geometry.indexBuffer.data.BYTES_PER_ELEMENT === 2 ? s.UNSIGNED_SHORT : s.UNSIGNED_INT;
    s.drawElements(s.TRIANGLES, t.particleChildren.length * 6, d, 0);
  }
}
class Gt {
  execute(e, t) {
    const r = e.renderer, i = t.shader || e.defaultShader;
    i.groups[0] = r.renderPipes.uniformBatch.getUniformBindGroup(e.localUniforms, !0), i.groups[1] = r.texture.getTextureBindGroup(t.texture);
    const n = e.state, s = e.getBuffers(t);
    r.encoder.draw({
      geometry: s.geometry,
      shader: t.shader || e.defaultShader,
      state: n,
      size: t.particleChildren.length * 6
    });
  }
}
function xe(a, e = null) {
  const t = a * 6;
  if (t > 65535 ? e = e || new Uint32Array(t) : e = e || new Uint16Array(t), e.length !== t)
    throw new Error(`Out buffer length is incorrect, got ${e.length} and expected ${t}`);
  for (let r = 0, i = 0; r < t; r += 6, i += 4)
    e[r + 0] = i + 0, e[r + 1] = i + 1, e[r + 2] = i + 2, e[r + 3] = i + 0, e[r + 4] = i + 2, e[r + 5] = i + 3;
  return e;
}
function zt(a) {
  return {
    dynamicUpdate: _e(a, !0),
    staticUpdate: _e(a, !1)
  };
}
function _e(a, e) {
  const t = [];
  t.push(`
      
        var index = 0;

        for (let i = 0; i < ps.length; ++i)
        {
            const p = ps[i];

            `);
  let r = 0;
  for (const n in a) {
    const s = a[n];
    if (e !== s.dynamic)
      continue;
    t.push(`offset = index + ${r}`), t.push(s.code);
    const o = J(s.format);
    r += o.stride / 4;
  }
  t.push(`
            index += stride * 4;
        }
    `), t.unshift(`
        var stride = ${r};
    `);
  const i = t.join(`
`);
  return new Function("ps", "f32v", "u32v", i);
}
class Ht {
  constructor(e) {
    this._size = 0, this._generateParticleUpdateCache = {};
    const t = this._size = e.size ?? 1e3, r = e.properties;
    let i = 0, n = 0;
    for (const l in r) {
      const h = r[l], p = J(h.format);
      h.dynamic ? n += p.stride : i += p.stride;
    }
    this._dynamicStride = n / 4, this._staticStride = i / 4, this.staticAttributeBuffer = new z(t * 4 * i), this.dynamicAttributeBuffer = new z(t * 4 * n), this.indexBuffer = xe(t);
    const s = new we();
    let o = 0, d = 0;
    this._staticBuffer = new he({
      data: new Float32Array(1),
      label: "static-particle-buffer",
      shrinkToFit: !1,
      usage: H.VERTEX | H.COPY_DST
    }), this._dynamicBuffer = new he({
      data: new Float32Array(1),
      label: "dynamic-particle-buffer",
      shrinkToFit: !1,
      usage: H.VERTEX | H.COPY_DST
    });
    for (const l in r) {
      const h = r[l], p = J(h.format);
      h.dynamic ? (s.addAttribute(h.attributeName, {
        buffer: this._dynamicBuffer,
        stride: this._dynamicStride * 4,
        offset: o * 4,
        format: h.format
      }), o += p.size) : (s.addAttribute(h.attributeName, {
        buffer: this._staticBuffer,
        stride: this._staticStride * 4,
        offset: d * 4,
        format: h.format
      }), d += p.size);
    }
    s.addIndex(this.indexBuffer);
    const u = this.getParticleUpdate(r);
    this._dynamicUpload = u.dynamicUpdate, this._staticUpload = u.staticUpdate, this.geometry = s;
  }
  getParticleUpdate(e) {
    const t = Dt(e);
    return this._generateParticleUpdateCache[t] ? this._generateParticleUpdateCache[t] : (this._generateParticleUpdateCache[t] = this.generateParticleUpdate(e), this._generateParticleUpdateCache[t]);
  }
  generateParticleUpdate(e) {
    return zt(e);
  }
  update(e, t) {
    e.length > this._size && (t = !0, this._size = Math.max(e.length, this._size * 1.5 | 0), this.staticAttributeBuffer = new z(this._size * this._staticStride * 4 * 4), this.dynamicAttributeBuffer = new z(this._size * this._dynamicStride * 4 * 4), this.indexBuffer = xe(this._size), this.geometry.indexBuffer.setDataWithSize(
      this.indexBuffer,
      this.indexBuffer.byteLength,
      !0
    ));
    const r = this.dynamicAttributeBuffer;
    if (this._dynamicUpload(e, r.float32View, r.uint32View), this._dynamicBuffer.setDataWithSize(
      this.dynamicAttributeBuffer.float32View,
      e.length * this._dynamicStride * 4,
      !0
    ), t) {
      const i = this.staticAttributeBuffer;
      this._staticUpload(e, i.float32View, i.uint32View), this._staticBuffer.setDataWithSize(
        i.float32View,
        e.length * this._staticStride * 4,
        !0
      );
    }
  }
  destroy() {
    this._staticBuffer.destroy(), this._dynamicBuffer.destroy(), this.geometry.destroy();
  }
}
function Dt(a) {
  const e = [];
  for (const t in a) {
    const r = a[t];
    e.push(t, r.code, r.dynamic ? "d" : "s");
  }
  return e.join("_");
}
var Ot = `varying vec2 vUV;
varying vec4 vColor;

uniform sampler2D uTexture;

void main(void){
    vec4 color = texture2D(uTexture, vUV) * vColor;
    gl_FragColor = color;
}`, Vt = `attribute vec2 aVertex;
attribute vec2 aUV;
attribute vec4 aColor;

attribute vec2 aPosition;
attribute float aRotation;

uniform mat3 uTranslationMatrix;
uniform float uRound;
uniform vec2 uResolution;
uniform vec4 uColor;

varying vec2 vUV;
varying vec4 vColor;

vec2 roundPixels(vec2 position, vec2 targetSize)
{       
    return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
}

void main(void){
    float cosRotation = cos(aRotation);
    float sinRotation = sin(aRotation);
    float x = aVertex.x * cosRotation - aVertex.y * sinRotation;
    float y = aVertex.x * sinRotation + aVertex.y * cosRotation;

    vec2 v = vec2(x, y);
    v = v + aPosition;

    gl_Position = vec4((uTranslationMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

    if(uRound == 1.0)
    {
        gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
    }

    vUV = aUV;
    vColor = aColor * uColor;
}
`, be = `
struct ParticleUniforms {
  uProjectionMatrix:mat3x3<f32>,
  uResolution:vec2<f32>,
  uRoundPixels:f32,
};

@group(0) @binding(0) var<uniform> uniforms: ParticleUniforms;

@group(1) @binding(0) var uTexture: texture_2d<f32>;
@group(1) @binding(1) var uSampler : sampler;

struct VSOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv : vec2<f32>,
    @location(1) color : vec4<f32>,
  };
@vertex
fn mainVertex(
  @location(0) aVertex: vec2<f32>,
  @location(1) aPosition: vec2<f32>,
  @location(2) aUV: vec2<f32>,
  @location(3) aColor: vec4<f32>,
  @location(4) aRotation: f32,
) -> VSOutput {
  
   let v = vec2(
       aVertex.x * cos(aRotation) - aVertex.y * sin(aRotation),
       aVertex.x * sin(aRotation) + aVertex.y * cos(aRotation)
   ) + aPosition;

   let position = vec4((uniforms.uProjectionMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);

  return VSOutput(
   position,
   aUV,
   aColor,
  );
}

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
  @location(1) color: vec4<f32>,
  @builtin(position) position: vec4<f32>,
) -> @location(0) vec4<f32> {

    var sample = textureSample(uTexture, uSampler, uv) * color;
   
    return sample;
}`;
class Et extends ee {
  constructor() {
    const e = Tt.from({
      vertex: Vt,
      fragment: Ot
    }), t = vt.from({
      fragment: {
        source: be,
        entryPoint: "mainFragment"
      },
      vertex: {
        source: be,
        entryPoint: "mainVertex"
      }
    });
    super({
      glProgram: e,
      gpuProgram: t,
      resources: {
        // this will be replaced with the texture from the particle container
        uTexture: B.WHITE.source,
        // this will be replaced with the texture style from the particle container
        uSampler: new St({}),
        // this will be replaced with the local uniforms from the particle container
        uniforms: {
          uTranslationMatrix: { value: new C(), type: "mat3x3<f32>" },
          uColor: { value: new U(16777215), type: "vec4<f32>" },
          uRound: { value: 1, type: "f32" },
          uResolution: { value: [0, 0], type: "vec2<f32>" }
        }
      }
    });
  }
}
class $e {
  /**
   * @param renderer - The renderer this sprite batch works for.
   * @param adaptor
   */
  constructor(e, t) {
    this.state = E.for2d(), this._gpuBufferHash = /* @__PURE__ */ Object.create(null), this._destroyRenderableBound = this.destroyRenderable.bind(this), this.localUniforms = new A({
      uTranslationMatrix: { value: new C(), type: "mat3x3<f32>" },
      uColor: { value: new Float32Array(4), type: "vec4<f32>" },
      uRound: { value: 1, type: "f32" },
      uResolution: { value: [0, 0], type: "vec2<f32>" }
    }), this.renderer = e, this.adaptor = t, this.defaultShader = new Et(), this.state = E.for2d();
  }
  validateRenderable(e) {
    return !1;
  }
  addRenderable(e, t) {
    this.renderer.renderPipes.batch.break(t), t.add(e);
  }
  getBuffers(e) {
    return this._gpuBufferHash[e.uid] || this._initBuffer(e);
  }
  _initBuffer(e) {
    return this._gpuBufferHash[e.uid] = new Ht({
      size: e.particleChildren.length,
      properties: e._properties
    }), e.on("destroyed", this._destroyRenderableBound), this._gpuBufferHash[e.uid];
  }
  updateRenderable(e) {
  }
  destroyRenderable(e) {
    this._gpuBufferHash[e.uid].destroy(), this._gpuBufferHash[e.uid] = null, e.off("destroyed", this._destroyRenderableBound);
  }
  execute(e) {
    const t = e.particleChildren;
    if (t.length === 0)
      return;
    const r = this.renderer, i = this.getBuffers(e);
    e.texture || (e.texture = t[0].texture);
    const n = this.state;
    i.update(t, e._childrenDirty), e._childrenDirty = !1, n.blendMode = Z(e.blendMode, e.texture._source);
    const s = this.localUniforms.uniforms, o = s.uTranslationMatrix;
    e.worldTransform.copyTo(o), o.prepend(r.globalUniforms.globalUniformData.projectionMatrix), s.uResolution = r.globalUniforms.globalUniformData.resolution, s.uRound = r._roundPixels | e._roundPixels, W(
      e.groupColorAlpha,
      s.uColor,
      0
    ), this.adaptor.execute(this, e);
  }
  /** Destroys the ParticleRenderer. */
  destroy() {
    this.defaultShader && (this.defaultShader.destroy(), this.defaultShader = null);
  }
}
class je extends $e {
  constructor(e) {
    super(e, new Ft());
  }
}
je.extension = {
  type: [
    c.WebGLPipes
  ],
  name: "particle"
};
class Ke extends $e {
  constructor(e) {
    super(e, new Gt());
  }
}
Ke.extension = {
  type: [
    c.WebGPUPipes
  ],
  name: "particle"
};
class Ye {
  constructor(e) {
    this._gpuSpriteHash = /* @__PURE__ */ Object.create(null), this._destroyRenderableBound = this.destroyRenderable.bind(this), this._renderer = e, this._renderer.renderableGC.addManagedHash(this, "_gpuSpriteHash");
  }
  addRenderable(e, t) {
    const r = this._getGpuSprite(e);
    e.didViewUpdate && this._updateBatchableSprite(e, r), this._renderer.renderPipes.batch.addToBatch(r, t);
  }
  updateRenderable(e) {
    const t = this._gpuSpriteHash[e.uid];
    e.didViewUpdate && this._updateBatchableSprite(e, t), t._batcher.updateElement(t);
  }
  validateRenderable(e) {
    const t = e._texture, r = this._getGpuSprite(e);
    return r.texture._source !== t._source ? !r._batcher.checkAndUpdateTexture(r, t) : !1;
  }
  destroyRenderable(e) {
    const t = this._gpuSpriteHash[e.uid];
    _.return(t.geometry), _.return(t), this._gpuSpriteHash[e.uid] = null, e.off("destroyed", this._destroyRenderableBound);
  }
  _updateBatchableSprite(e, t) {
    t.geometry.update(e), t.texture = e._texture;
  }
  _getGpuSprite(e) {
    return this._gpuSpriteHash[e.uid] || this._initGPUSprite(e);
  }
  _initGPUSprite(e) {
    const t = _.get(re);
    return t.geometry = _.get(dt), t.renderable = e, t.transform = e.groupTransform, t.texture = e._texture, t.roundPixels = this._renderer._roundPixels | e._roundPixels, this._gpuSpriteHash[e.uid] = t, e.didViewUpdate || this._updateBatchableSprite(e, t), e.on("destroyed", this._destroyRenderableBound), t;
  }
  destroy() {
    for (const e in this._gpuSpriteHash)
      this._gpuSpriteHash[e].geometry.destroy();
    this._gpuSpriteHash = null, this._renderer = null;
  }
}
Ye.extension = {
  type: [
    c.WebGLPipes,
    c.WebGPUPipes,
    c.CanvasPipes
  ],
  name: "nineSliceSprite"
};
const Wt = {
  name: "tiling-bit",
  vertex: {
    header: (
      /* wgsl */
      `
            struct TilingUniforms {
                uMapCoord:mat3x3<f32>,
                uClampFrame:vec4<f32>,
                uClampOffset:vec2<f32>,
                uTextureTransform:mat3x3<f32>,
                uSizeAnchor:vec4<f32>
            };

            @group(2) @binding(0) var<uniform> tilingUniforms: TilingUniforms;
            @group(2) @binding(1) var uTexture: texture_2d<f32>;
            @group(2) @binding(2) var uSampler: sampler;
        `
    ),
    main: (
      /* wgsl */
      `
            uv = (tilingUniforms.uTextureTransform * vec3(uv, 1.0)).xy;

            position = (position - tilingUniforms.uSizeAnchor.zw) * tilingUniforms.uSizeAnchor.xy;
        `
    )
  },
  fragment: {
    header: (
      /* wgsl */
      `
            struct TilingUniforms {
                uMapCoord:mat3x3<f32>,
                uClampFrame:vec4<f32>,
                uClampOffset:vec2<f32>,
                uTextureTransform:mat3x3<f32>,
                uSizeAnchor:vec4<f32>
            };

            @group(2) @binding(0) var<uniform> tilingUniforms: TilingUniforms;
            @group(2) @binding(1) var uTexture: texture_2d<f32>;
            @group(2) @binding(2) var uSampler: sampler;
        `
    ),
    main: (
      /* wgsl */
      `

            var coord = vUV + ceil(tilingUniforms.uClampOffset - vUV);
            coord = (tilingUniforms.uMapCoord * vec3(coord, 1.0)).xy;
            var unclamped = coord;
            coord = clamp(coord, tilingUniforms.uClampFrame.xy, tilingUniforms.uClampFrame.zw);

            var bias = 0.;

            if(unclamped.x == coord.x && unclamped.y == coord.y)
            {
                bias = -32.;
            } 

            outColor = textureSampleBias(uTexture, uSampler, coord, bias);
        `
    )
  }
}, It = {
  name: "tiling-bit",
  vertex: {
    header: (
      /* glsl */
      `
            uniform mat3 uTextureTransform;
            uniform vec4 uSizeAnchor;
        
        `
    ),
    main: (
      /* glsl */
      `
            uv = (uTextureTransform * vec3(aUV, 1.0)).xy;

            position = (position - uSizeAnchor.zw) * uSizeAnchor.xy;
        `
    )
  },
  fragment: {
    header: (
      /* glsl */
      `
            uniform sampler2D uTexture;
            uniform mat3 uMapCoord;
            uniform vec4 uClampFrame;
            uniform vec2 uClampOffset;
        `
    ),
    main: (
      /* glsl */
      `

        vec2 coord = vUV + ceil(uClampOffset - vUV);
        coord = (uMapCoord * vec3(coord, 1.0)).xy;
        vec2 unclamped = coord;
        coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);
        
        outColor = texture(uTexture, coord, unclamped == coord ? 0.0 : -32.0);// lod-bias very negative to force lod 0
    
        `
    )
  }
};
let $, j;
class Lt extends ee {
  constructor() {
    $ ?? ($ = Ue({
      name: "tiling-sprite-shader",
      bits: [
        wt,
        Wt,
        Me
      ]
    })), j ?? (j = Pe({
      name: "tiling-sprite-shader",
      bits: [
        Ct,
        It,
        ke
      ]
    }));
    const e = new A({
      uMapCoord: { value: new C(), type: "mat3x3<f32>" },
      uClampFrame: { value: new Float32Array([0, 0, 1, 1]), type: "vec4<f32>" },
      uClampOffset: { value: new Float32Array([0, 0]), type: "vec2<f32>" },
      uTextureTransform: { value: new C(), type: "mat3x3<f32>" },
      uSizeAnchor: { value: new Float32Array([100, 100, 0.5, 0.5]), type: "vec4<f32>" }
    });
    super({
      glProgram: j,
      gpuProgram: $,
      resources: {
        localUniforms: new A({
          uTransformMatrix: { value: new C(), type: "mat3x3<f32>" },
          uColor: { value: new Float32Array([1, 1, 1, 1]), type: "vec4<f32>" },
          uRound: { value: 0, type: "f32" }
        }),
        tilingUniforms: e,
        uTexture: B.EMPTY.source,
        uSampler: B.EMPTY.source.style
      }
    });
  }
  updateUniforms(e, t, r, i, n, s) {
    const o = this.resources.tilingUniforms, d = s.width, u = s.height, l = s.textureMatrix, h = o.uniforms.uTextureTransform;
    h.set(
      r.a * d / e,
      r.b * d / t,
      r.c * u / e,
      r.d * u / t,
      r.tx / e,
      r.ty / t
    ), h.invert(), o.uniforms.uMapCoord = l.mapCoord, o.uniforms.uClampFrame = l.uClampFrame, o.uniforms.uClampOffset = l.uClampOffset, o.uniforms.uTextureTransform = h, o.uniforms.uSizeAnchor[0] = e, o.uniforms.uSizeAnchor[1] = t, o.uniforms.uSizeAnchor[2] = i, o.uniforms.uSizeAnchor[3] = n, s && (this.resources.uTexture = s.source, this.resources.uSampler = s.source.style);
  }
}
class $t extends Be {
  constructor() {
    super({
      positions: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
      uvs: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
      indices: new Uint32Array([0, 1, 2, 0, 2, 3])
    });
  }
}
function jt(a, e) {
  const t = a.anchor.x, r = a.anchor.y;
  e[0] = -t * a.width, e[1] = -r * a.height, e[2] = (1 - t) * a.width, e[3] = -r * a.height, e[4] = (1 - t) * a.width, e[5] = (1 - r) * a.height, e[6] = -t * a.width, e[7] = (1 - r) * a.height;
}
function Kt(a, e, t, r) {
  let i = 0;
  const n = a.length / e, s = r.a, o = r.b, d = r.c, u = r.d, l = r.tx, h = r.ty;
  for (t *= e; i < n; ) {
    const p = a[t], m = a[t + 1];
    a[t] = s * p + d * m + l, a[t + 1] = o * p + u * m + h, t += e, i++;
  }
}
function Yt(a, e) {
  const t = a.texture, r = t.frame.width, i = t.frame.height;
  let n = 0, s = 0;
  a._applyAnchorToTexture && (n = a.anchor.x, s = a.anchor.y), e[0] = e[6] = -n, e[2] = e[4] = 1 - n, e[1] = e[3] = -s, e[5] = e[7] = 1 - s;
  const o = C.shared;
  o.copyFrom(a._tileTransform.matrix), o.tx /= a.width, o.ty /= a.height, o.invert(), o.scale(a.width / r, a.height / i), Kt(e, 2, 0, o);
}
const D = new $t();
class Ne {
  constructor(e) {
    this._state = E.default2d, this._tilingSpriteDataHash = /* @__PURE__ */ Object.create(null), this._destroyRenderableBound = this.destroyRenderable.bind(this), this._renderer = e, this._renderer.renderableGC.addManagedHash(this, "_tilingSpriteDataHash");
  }
  validateRenderable(e) {
    const t = this._getTilingSpriteData(e), r = t.canBatch;
    this._updateCanBatch(e);
    const i = t.canBatch;
    if (i && i === r) {
      const { batchableMesh: n } = t;
      if (n && n.texture._source !== e.texture._source)
        return !n._batcher.checkAndUpdateTexture(n, e.texture);
    }
    return r !== i;
  }
  addRenderable(e, t) {
    const r = this._renderer.renderPipes.batch;
    this._updateCanBatch(e);
    const i = this._getTilingSpriteData(e), { geometry: n, canBatch: s } = i;
    if (s) {
      i.batchableMesh || (i.batchableMesh = new re());
      const o = i.batchableMesh;
      e.didViewUpdate && (this._updateBatchableMesh(e), o.geometry = n, o.renderable = e, o.transform = e.groupTransform, o.texture = e._texture), o.roundPixels = this._renderer._roundPixels | e._roundPixels, r.addToBatch(o, t);
    } else
      r.break(t), i.shader || (i.shader = new Lt()), this.updateRenderable(e), t.add(e);
  }
  execute(e) {
    const { shader: t } = this._tilingSpriteDataHash[e.uid];
    t.groups[0] = this._renderer.globalUniforms.bindGroup;
    const r = t.resources.localUniforms.uniforms;
    r.uTransformMatrix = e.groupTransform, r.uRound = this._renderer._roundPixels | e._roundPixels, W(
      e.groupColorAlpha,
      r.uColor,
      0
    ), this._state.blendMode = Z(e.groupBlendMode, e.texture._source), this._renderer.encoder.draw({
      geometry: D,
      shader: t,
      state: this._state
    });
  }
  updateRenderable(e) {
    const t = this._getTilingSpriteData(e), { canBatch: r } = t;
    if (r) {
      const { batchableMesh: i } = t;
      e.didViewUpdate && this._updateBatchableMesh(e), i._batcher.updateElement(i);
    } else if (e.didViewUpdate) {
      const { shader: i } = t;
      i.updateUniforms(
        e.width,
        e.height,
        e._tileTransform.matrix,
        e.anchor.x,
        e.anchor.y,
        e.texture
      );
    }
  }
  destroyRenderable(e) {
    var t;
    const r = this._getTilingSpriteData(e);
    r.batchableMesh = null, (t = r.shader) == null || t.destroy(), this._tilingSpriteDataHash[e.uid] = null, e.off("destroyed", this._destroyRenderableBound);
  }
  _getTilingSpriteData(e) {
    return this._tilingSpriteDataHash[e.uid] || this._initTilingSpriteData(e);
  }
  _initTilingSpriteData(e) {
    const t = new Be({
      indices: D.indices,
      positions: D.positions.slice(),
      uvs: D.uvs.slice()
    });
    return this._tilingSpriteDataHash[e.uid] = {
      canBatch: !0,
      renderable: e,
      geometry: t
    }, e.on("destroyed", this._destroyRenderableBound), this._tilingSpriteDataHash[e.uid];
  }
  _updateBatchableMesh(e) {
    const t = this._getTilingSpriteData(e), { geometry: r } = t, i = e.texture.source.style;
    i.addressMode !== "repeat" && (i.addressMode = "repeat", i.update()), Yt(e, r.uvs), jt(e, r.positions);
  }
  destroy() {
    for (const e in this._tilingSpriteDataHash)
      this.destroyRenderable(this._tilingSpriteDataHash[e].renderable);
    this._tilingSpriteDataHash = null, this._renderer = null;
  }
  _updateCanBatch(e) {
    const t = this._getTilingSpriteData(e), r = e.texture;
    let i = !0;
    return this._renderer.type === Q.WEBGL && (i = this._renderer.context.supports.nonPowOf2wrapping), t.canBatch = r.textureMatrix.isSimple && (i || r.source.isPowerOfTwo), t.canBatch;
  }
}
Ne.extension = {
  type: [
    c.WebGLPipes,
    c.WebGPUPipes,
    c.CanvasPipes
  ],
  name: "tilingSprite"
};
const Nt = {
  name: "local-uniform-msdf-bit",
  vertex: {
    header: (
      /* wgsl */
      `
            struct LocalUniforms {
                uColor:vec4<f32>,
                uTransformMatrix:mat3x3<f32>,
                uDistance: f32,
                uRound:f32,
            }

            @group(2) @binding(0) var<uniform> localUniforms : LocalUniforms;
        `
    ),
    main: (
      /* wgsl */
      `
            vColor *= localUniforms.uColor;
            modelMatrix *= localUniforms.uTransformMatrix;
        `
    ),
    end: (
      /* wgsl */
      `
            if(localUniforms.uRound == 1)
            {
                vPosition = vec4(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
            }
        `
    )
  },
  fragment: {
    header: (
      /* wgsl */
      `
            struct LocalUniforms {
                uColor:vec4<f32>,
                uTransformMatrix:mat3x3<f32>,
                uDistance: f32
            }

            @group(2) @binding(0) var<uniform> localUniforms : LocalUniforms;
         `
    ),
    main: (
      /* wgsl */
      ` 
            outColor = vec4<f32>(calculateMSDFAlpha(outColor, localUniforms.uColor, localUniforms.uDistance));
        `
    )
  }
}, Xt = {
  name: "local-uniform-msdf-bit",
  vertex: {
    header: (
      /* glsl */
      `
            uniform mat3 uTransformMatrix;
            uniform vec4 uColor;
            uniform float uRound;
        `
    ),
    main: (
      /* glsl */
      `
            vColor *= uColor;
            modelMatrix *= uTransformMatrix;
        `
    ),
    end: (
      /* glsl */
      `
            if(uRound == 1.)
            {
                gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
            }
        `
    )
  },
  fragment: {
    header: (
      /* glsl */
      `
            uniform float uDistance;
         `
    ),
    main: (
      /* glsl */
      ` 
            outColor = vec4(calculateMSDFAlpha(outColor, vColor, uDistance));
        `
    )
  }
}, qt = {
  name: "msdf-bit",
  fragment: {
    header: (
      /* wgsl */
      `
            fn calculateMSDFAlpha(msdfColor:vec4<f32>, shapeColor:vec4<f32>, distance:f32) -> f32 {
                
                // MSDF
                var median = msdfColor.r + msdfColor.g + msdfColor.b -
                    min(msdfColor.r, min(msdfColor.g, msdfColor.b)) -
                    max(msdfColor.r, max(msdfColor.g, msdfColor.b));
            
                // SDF
                median = min(median, msdfColor.a);

                var screenPxDistance = distance * (median - 0.5);
                var alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);
                if (median < 0.01) {
                    alpha = 0.0;
                } else if (median > 0.99) {
                    alpha = 1.0;
                }

                // Gamma correction for coverage-like alpha
                var luma: f32 = dot(shapeColor.rgb, vec3<f32>(0.299, 0.587, 0.114));
                var gamma: f32 = mix(1.0, 1.0 / 2.2, luma);
                var coverage: f32 = pow(shapeColor.a * alpha, gamma);

                return coverage;
             
            }
        `
    )
  }
}, Jt = {
  name: "msdf-bit",
  fragment: {
    header: (
      /* glsl */
      `
            float calculateMSDFAlpha(vec4 msdfColor, vec4 shapeColor, float distance) {
                
                // MSDF
                float median = msdfColor.r + msdfColor.g + msdfColor.b -
                                min(msdfColor.r, min(msdfColor.g, msdfColor.b)) -
                                max(msdfColor.r, max(msdfColor.g, msdfColor.b));
               
                // SDF
                median = min(median, msdfColor.a);
            
                float screenPxDistance = distance * (median - 0.5);
                float alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);
           
                if (median < 0.01) {
                    alpha = 0.0;
                } else if (median > 0.99) {
                    alpha = 1.0;
                }

                // Gamma correction for coverage-like alpha
                float luma = dot(shapeColor.rgb, vec3(0.299, 0.587, 0.114));
                float gamma = mix(1.0, 1.0 / 2.2, luma);
                float coverage = pow(shapeColor.a * alpha, gamma);  
              
                return coverage;
            }
        `
    )
  }
};
let K, Y;
class Qt extends ee {
  constructor() {
    const e = new A({
      uColor: { value: new Float32Array([1, 1, 1, 1]), type: "vec4<f32>" },
      uTransformMatrix: { value: new C(), type: "mat3x3<f32>" },
      uDistance: { value: 4, type: "f32" },
      uRound: { value: 0, type: "f32" }
    }), t = gt();
    K ?? (K = Ue({
      name: "sdf-shader",
      bits: [
        mt,
        xt(t),
        Nt,
        qt,
        Me
      ]
    })), Y ?? (Y = Pe({
      name: "sdf-shader",
      bits: [
        _t,
        bt(t),
        Xt,
        Jt,
        ke
      ]
    })), super({
      glProgram: Y,
      gpuProgram: K,
      resources: {
        localUniforms: e,
        batchSamplers: yt(t)
      }
    });
  }
}
class Xe {
  constructor(e) {
    this._gpuBitmapText = {}, this._destroyRenderableBound = this.destroyRenderable.bind(this), this._renderer = e, this._renderer.renderableGC.addManagedHash(this, "_gpuBitmapText");
  }
  validateRenderable(e) {
    const t = this._getGpuBitmapText(e);
    return e._didTextUpdate && (e._didTextUpdate = !1, this._updateContext(e, t)), this._renderer.renderPipes.graphics.validateRenderable(t);
  }
  addRenderable(e, t) {
    const r = this._getGpuBitmapText(e);
    ye(e, r), e._didTextUpdate && (e._didTextUpdate = !1, this._updateContext(e, r)), this._renderer.renderPipes.graphics.addRenderable(r, t), r.context.customShader && this._updateDistanceField(e);
  }
  destroyRenderable(e) {
    e.off("destroyed", this._destroyRenderableBound), this._destroyRenderableByUid(e.uid);
  }
  _destroyRenderableByUid(e) {
    const t = this._gpuBitmapText[e].context;
    t.customShader && (_.return(t.customShader), t.customShader = null), _.return(this._gpuBitmapText[e]), this._gpuBitmapText[e] = null;
  }
  updateRenderable(e) {
    const t = this._getGpuBitmapText(e);
    ye(e, t), this._renderer.renderPipes.graphics.updateRenderable(t), t.context.customShader && this._updateDistanceField(e);
  }
  _updateContext(e, t) {
    const { context: r } = t, i = lt.getFont(e.text, e._style);
    r.clear(), i.distanceField.type !== "none" && (r.customShader || (r.customShader = _.get(Qt)));
    const n = Array.from(e.text), s = e._style;
    let o = i.baseLineOffset;
    const d = ut(n, s, i, !0);
    let u = 0;
    const l = s.padding, h = d.scale;
    let p = d.width, m = d.height + d.offsetY;
    s._stroke && (p += s._stroke.width / h, m += s._stroke.width / h), r.translate(-e._anchor._x * p - l, -e._anchor._y * m - l).scale(h, h);
    const g = i.applyFillAsTint ? s._fill.color : 16777215;
    for (let f = 0; f < d.lines.length; f++) {
      const x = d.lines[f];
      for (let y = 0; y < x.charPositions.length; y++) {
        const R = n[u++], b = i.chars[R];
        b != null && b.texture && r.texture(
          b.texture,
          g || "black",
          Math.round(x.charPositions[y] + b.xOffset),
          Math.round(o + b.yOffset)
        );
      }
      o += i.lineHeight;
    }
  }
  _getGpuBitmapText(e) {
    return this._gpuBitmapText[e.uid] || this.initGpuText(e);
  }
  initGpuText(e) {
    const t = _.get(ht);
    return this._gpuBitmapText[e.uid] = t, this._updateContext(e, t), e.on("destroyed", this._destroyRenderableBound), this._gpuBitmapText[e.uid];
  }
  _updateDistanceField(e) {
    const t = this._getGpuBitmapText(e).context, r = e._style.fontFamily, i = N.get(`${r}-bitmap`), { a: n, b: s, c: o, d } = e.groupTransform, u = Math.sqrt(n * n + s * s), l = Math.sqrt(o * o + d * d), h = (Math.abs(u) + Math.abs(l)) / 2, p = i.baseRenderedFontSize / e._style.fontSize, m = h * i.distanceField.range * (1 / p);
    t.customShader.resources.localUniforms.uniforms.uDistance = m;
  }
  destroy() {
    for (const e in this._gpuBitmapText)
      this._destroyRenderableByUid(e);
    this._gpuBitmapText = null, this._renderer = null;
  }
}
Xe.extension = {
  type: [
    c.WebGLPipes,
    c.WebGPUPipes,
    c.CanvasPipes
  ],
  name: "bitmapText"
};
function ye(a, e) {
  e.groupTransform = a.groupTransform, e.groupColorAlpha = a.groupColorAlpha, e.groupColor = a.groupColor, e.groupBlendMode = a.groupBlendMode, e.globalDisplayStatus = a.globalDisplayStatus, e.groupTransform = a.groupTransform, e.localDisplayStatus = a.localDisplayStatus, e.groupAlpha = a.groupAlpha, e._roundPixels = a._roundPixels;
}
class qe {
  constructor(e) {
    this._gpuText = /* @__PURE__ */ Object.create(null), this._destroyRenderableBound = this.destroyRenderable.bind(this), this._renderer = e, this._renderer.runners.resolutionChange.add(this), this._renderer.renderableGC.addManagedHash(this, "_gpuText");
  }
  resolutionChange() {
    for (const e in this._gpuText) {
      const t = this._gpuText[e];
      if (!t)
        continue;
      const r = t.batchableSprite.renderable;
      r._autoResolution && (r._resolution = this._renderer.resolution, r.onViewUpdate());
    }
  }
  validateRenderable(e) {
    const t = this._getGpuText(e), r = e._getKey();
    return t.textureNeedsUploading ? (t.textureNeedsUploading = !1, !0) : t.currentKey !== r;
  }
  addRenderable(e, t) {
    const r = this._getGpuText(e).batchableSprite;
    e._didTextUpdate && this._updateText(e), this._renderer.renderPipes.batch.addToBatch(r, t);
  }
  updateRenderable(e) {
    const t = this._getGpuText(e).batchableSprite;
    e._didTextUpdate && this._updateText(e), t._batcher.updateElement(t);
  }
  destroyRenderable(e) {
    e.off("destroyed", this._destroyRenderableBound), this._destroyRenderableById(e.uid);
  }
  _destroyRenderableById(e) {
    const t = this._gpuText[e];
    this._renderer.htmlText.decreaseReferenceCount(t.currentKey), _.return(t.batchableSprite), this._gpuText[e] = null;
  }
  _updateText(e) {
    const t = e._getKey(), r = this._getGpuText(e), i = r.batchableSprite;
    r.currentKey !== t && this._updateGpuText(e).catch((s) => {
      console.error(s);
    }), e._didTextUpdate = !1;
    const n = e._style.padding;
    X(i.bounds, e._anchor, i.texture, n);
  }
  async _updateGpuText(e) {
    e._didTextUpdate = !1;
    const t = this._getGpuText(e);
    if (t.generatingTexture)
      return;
    const r = e._getKey();
    this._renderer.htmlText.decreaseReferenceCount(t.currentKey), t.generatingTexture = !0, t.currentKey = r;
    const i = e.resolution ?? this._renderer.resolution, n = await this._renderer.htmlText.getManagedTexture(
      e.text,
      i,
      e._style,
      e._getKey()
    ), s = t.batchableSprite;
    s.texture = t.texture = n, t.generatingTexture = !1, t.textureNeedsUploading = !0, e.onViewUpdate();
    const o = e._style.padding;
    X(s.bounds, e._anchor, s.texture, o);
  }
  _getGpuText(e) {
    return this._gpuText[e.uid] || this.initGpuText(e);
  }
  initGpuText(e) {
    const t = {
      texture: B.EMPTY,
      currentKey: "--",
      batchableSprite: _.get(Fe),
      textureNeedsUploading: !1,
      generatingTexture: !1
    }, r = t.batchableSprite;
    return r.renderable = e, r.transform = e.groupTransform, r.texture = B.EMPTY, r.bounds = { minX: 0, maxX: 1, minY: 0, maxY: 0 }, r.roundPixels = this._renderer._roundPixels | e._roundPixels, e._resolution = e._autoResolution ? this._renderer.resolution : e.resolution, this._gpuText[e.uid] = t, e.on("destroyed", this._destroyRenderableBound), t;
  }
  destroy() {
    for (const e in this._gpuText)
      this._destroyRenderableById(e);
    this._gpuText = null, this._renderer = null;
  }
}
qe.extension = {
  type: [
    c.WebGLPipes,
    c.WebGPUPipes,
    c.CanvasPipes
  ],
  name: "htmlText"
};
function Zt() {
  const { userAgent: a } = Ae.get().getNavigator();
  return /^((?!chrome|android).)*safari/i.test(a);
}
const er = new Re();
function Je(a, e, t, r) {
  const i = er;
  i.minX = 0, i.minY = 0, i.maxX = a.width / r | 0, i.maxY = a.height / r | 0;
  const n = w.getOptimalTexture(
    i.width,
    i.height,
    r,
    !1
  );
  return n.source.uploadMethodId = "image", n.source.resource = a, n.source.alphaMode = "premultiply-alpha-on-upload", n.frame.width = e / r, n.frame.height = t / r, n.source.emit("update", n.source), n.updateUvs(), n;
}
function tr(a, e) {
  const t = e.fontFamily, r = [], i = {}, n = /font-family:([^;"\s]+)/g, s = a.match(n);
  function o(d) {
    i[d] || (r.push(d), i[d] = !0);
  }
  if (Array.isArray(t))
    for (let d = 0; d < t.length; d++)
      o(t[d]);
  else
    o(t);
  s && s.forEach((d) => {
    const u = d.split(":")[1].trim();
    o(u);
  });
  for (const d in e.tagStyles) {
    const u = e.tagStyles[d].fontFamily;
    o(u);
  }
  return r;
}
async function rr(a) {
  const e = await (await Ae.get().fetch(a)).blob(), t = new FileReader();
  return await new Promise((r, i) => {
    t.onloadend = () => r(t.result), t.onerror = i, t.readAsDataURL(e);
  });
}
async function Te(a, e) {
  const t = await rr(e);
  return `@font-face {
        font-family: "${a.fontFamily}";
        src: url('${t}');
        font-weight: ${a.fontWeight};
        font-style: ${a.fontStyle};
    }`;
}
const O = /* @__PURE__ */ new Map();
async function ir(a, e, t) {
  const r = a.filter((i) => N.has(`${i}-and-url`)).map((i, n) => {
    if (!O.has(i)) {
      const { url: s } = N.get(`${i}-and-url`);
      n === 0 ? O.set(i, Te({
        fontWeight: e.fontWeight,
        fontStyle: e.fontStyle,
        fontFamily: i
      }, s)) : O.set(i, Te({
        fontWeight: t.fontWeight,
        fontStyle: t.fontStyle,
        fontFamily: i
      }, s));
    }
    return O.get(i);
  });
  return (await Promise.all(r)).join(`
`);
}
function ar(a, e, t, r, i) {
  const { domElement: n, styleElement: s, svgRoot: o } = i;
  n.innerHTML = `<style>${e.cssStyle}</style><div style='padding:0;'>${a}</div>`, n.setAttribute("style", `transform: scale(${t});transform-origin: top left; display: inline-block`), s.textContent = r;
  const { width: d, height: u } = i.image;
  return o.setAttribute("width", d.toString()), o.setAttribute("height", u.toString()), new XMLSerializer().serializeToString(o);
}
function nr(a, e) {
  const t = G.getOptimalCanvasAndContext(
    a.width,
    a.height,
    e
  ), { context: r } = t;
  return r.clearRect(0, 0, a.width, a.height), r.drawImage(a, 0, 0), t;
}
function sr(a, e, t) {
  return new Promise(async (r) => {
    t && await new Promise((i) => setTimeout(i, 100)), a.onload = () => {
      r();
    }, a.src = `data:image/svg+xml;charset=utf8,${encodeURIComponent(e)}`, a.crossOrigin = "anonymous";
  });
}
class ie {
  constructor(e) {
    this._activeTextures = {}, this._renderer = e, this._createCanvas = e.type === Q.WEBGPU;
  }
  getTexture(e) {
    return this._buildTexturePromise(
      e.text,
      e.resolution,
      e.style
    );
  }
  getManagedTexture(e, t, r, i) {
    if (this._activeTextures[i])
      return this._increaseReferenceCount(i), this._activeTextures[i].promise;
    const n = this._buildTexturePromise(e, t, r).then((s) => (this._activeTextures[i].texture = s, s));
    return this._activeTextures[i] = {
      texture: null,
      promise: n,
      usageCount: 1
    }, n;
  }
  async _buildTexturePromise(e, t, r) {
    const i = _.get(We), n = tr(e, r), s = await ir(
      n,
      r,
      te.defaultTextStyle
    ), o = At(e, r, s, i), d = Math.ceil(Math.ceil(Math.max(1, o.width) + r.padding * 2) * t), u = Math.ceil(Math.ceil(Math.max(1, o.height) + r.padding * 2) * t), l = i.image, h = 2;
    l.width = (d | 0) + h, l.height = (u | 0) + h;
    const p = ar(e, r, t, s, i);
    await sr(l, p, Zt() && n.length > 0);
    const m = l;
    let g;
    this._createCanvas && (g = nr(l, t));
    const f = Je(
      g ? g.canvas : m,
      l.width - h,
      l.height - h,
      t
    );
    return this._createCanvas && (this._renderer.texture.initSource(f.source), G.returnCanvasAndContext(g)), _.return(i), f;
  }
  _increaseReferenceCount(e) {
    this._activeTextures[e].usageCount++;
  }
  decreaseReferenceCount(e) {
    const t = this._activeTextures[e];
    t && (t.usageCount--, t.usageCount === 0 && (t.texture ? this._cleanUp(t) : t.promise.then((r) => {
      t.texture = r, this._cleanUp(t);
    }).catch(() => {
      V("HTMLTextSystem: Failed to clean texture");
    }), this._activeTextures[e] = null));
  }
  _cleanUp(e) {
    w.returnTexture(e.texture), e.texture.source.resource = null, e.texture.source.uploadMethodId = "unknown";
  }
  getReferenceCount(e) {
    return this._activeTextures[e].usageCount;
  }
  destroy() {
    this._activeTextures = null;
  }
}
ie.extension = {
  type: [
    c.WebGLSystem,
    c.WebGPUSystem,
    c.CanvasSystem
  ],
  name: "htmlText"
};
ie.defaultFontOptions = {
  fontFamily: "Arial",
  fontStyle: "normal",
  fontWeight: "normal"
};
class Qe {
  constructor(e) {
    this._gpuText = /* @__PURE__ */ Object.create(null), this._destroyRenderableBound = this.destroyRenderable.bind(this), this._renderer = e, this._renderer.runners.resolutionChange.add(this), this._renderer.renderableGC.addManagedHash(this, "_gpuText");
  }
  resolutionChange() {
    for (const e in this._gpuText) {
      const t = this._gpuText[e];
      if (!t)
        continue;
      const r = t.batchableSprite.renderable;
      r._autoResolution && (r._resolution = this._renderer.resolution, r.onViewUpdate());
    }
  }
  validateRenderable(e) {
    const t = this._getGpuText(e), r = e._getKey();
    return t.currentKey !== r;
  }
  addRenderable(e, t) {
    const r = this._getGpuText(e).batchableSprite;
    e._didTextUpdate && this._updateText(e), this._renderer.renderPipes.batch.addToBatch(r, t);
  }
  updateRenderable(e) {
    const t = this._getGpuText(e).batchableSprite;
    e._didTextUpdate && this._updateText(e), t._batcher.updateElement(t);
  }
  destroyRenderable(e) {
    e.off("destroyed", this._destroyRenderableBound), this._destroyRenderableById(e.uid);
  }
  _destroyRenderableById(e) {
    const t = this._gpuText[e];
    this._renderer.canvasText.decreaseReferenceCount(t.currentKey), _.return(t.batchableSprite), this._gpuText[e] = null;
  }
  _updateText(e) {
    const t = e._getKey(), r = this._getGpuText(e), i = r.batchableSprite;
    r.currentKey !== t && this._updateGpuText(e), e._didTextUpdate = !1;
    const n = e._style.padding;
    X(i.bounds, e._anchor, i.texture, n);
  }
  _updateGpuText(e) {
    const t = this._getGpuText(e), r = t.batchableSprite;
    t.texture && this._renderer.canvasText.decreaseReferenceCount(t.currentKey), t.texture = r.texture = this._renderer.canvasText.getManagedTexture(e), t.currentKey = e._getKey(), r.texture = t.texture;
  }
  _getGpuText(e) {
    return this._gpuText[e.uid] || this.initGpuText(e);
  }
  initGpuText(e) {
    const t = {
      texture: null,
      currentKey: "--",
      batchableSprite: _.get(Fe)
    };
    return t.batchableSprite.renderable = e, t.batchableSprite.transform = e.groupTransform, t.batchableSprite.bounds = { minX: 0, maxX: 1, minY: 0, maxY: 0 }, t.batchableSprite.roundPixels = this._renderer._roundPixels | e._roundPixels, this._gpuText[e.uid] = t, e._resolution = e._autoResolution ? this._renderer.resolution : e.resolution, this._updateText(e), e.on("destroyed", this._destroyRenderableBound), t;
  }
  destroy() {
    for (const e in this._gpuText)
      this._destroyRenderableById(e);
    this._gpuText = null, this._renderer = null;
  }
}
Qe.extension = {
  type: [
    c.WebGLPipes,
    c.WebGPUPipes,
    c.CanvasPipes
  ],
  name: "text"
};
function ve(a, e, t) {
  for (let r = 0, i = 4 * t * e; r < e; ++r, i += 4)
    if (a[i + 3] !== 0)
      return !1;
  return !0;
}
function Se(a, e, t, r, i) {
  const n = 4 * e;
  for (let s = r, o = r * n + 4 * t; s <= i; ++s, o += n)
    if (a[o + 3] !== 0)
      return !1;
  return !0;
}
function or(a, e = 1) {
  const { width: t, height: r } = a, i = a.getContext("2d", {
    willReadFrequently: !0
  });
  if (i === null)
    throw new TypeError("Failed to get canvas 2D context");
  const n = i.getImageData(0, 0, t, r).data;
  let s = 0, o = 0, d = t - 1, u = r - 1;
  for (; o < r && ve(n, t, o); )
    ++o;
  if (o === r)
    return le.EMPTY;
  for (; ve(n, t, u); )
    --u;
  for (; Se(n, t, s, o, u); )
    ++s;
  for (; Se(n, t, d, o, u); )
    --d;
  return ++d, ++u, new le(s / e, o / e, (d - s) / e, (u - o) / e);
}
class Ze {
  constructor(e) {
    this._activeTextures = {}, this._renderer = e;
  }
  getTextureSize(e, t, r) {
    const i = k.measureText(e || " ", r);
    let n = Math.ceil(Math.ceil(Math.max(1, i.width) + r.padding * 2) * t), s = Math.ceil(Math.ceil(Math.max(1, i.height) + r.padding * 2) * t);
    return n = Math.ceil(n - 1e-6), s = Math.ceil(s - 1e-6), n = ue(n), s = ue(s), { width: n, height: s };
  }
  getTexture(e, t, r, i) {
    typeof e == "string" && (ct("8.0.0", "CanvasTextSystem.getTexture: Use object TextOptions instead of separate arguments"), e = {
      text: e,
      style: r,
      resolution: t
    }), e.style instanceof q || (e.style = new q(e.style));
    const { texture: n, canvasAndContext: s } = this.createTextureAndCanvas(
      e
    );
    return this._renderer.texture.initSource(n._source), G.returnCanvasAndContext(s), n;
  }
  createTextureAndCanvas(e) {
    const { text: t, style: r } = e, i = e.resolution ?? this._renderer.resolution, n = k.measureText(t || " ", r), s = Math.ceil(Math.ceil(Math.max(1, n.width) + r.padding * 2) * i), o = Math.ceil(Math.ceil(Math.max(1, n.height) + r.padding * 2) * i), d = G.getOptimalCanvasAndContext(s, o), { canvas: u } = d;
    this.renderTextToCanvas(t, r, i, d);
    const l = Je(u, s, o, i);
    if (r.trim) {
      const h = or(u, i);
      l.frame.copyFrom(h), l.updateUvs();
    }
    return { texture: l, canvasAndContext: d };
  }
  getManagedTexture(e) {
    e._resolution = e._autoResolution ? this._renderer.resolution : e.resolution;
    const t = e._getKey();
    if (this._activeTextures[t])
      return this._increaseReferenceCount(t), this._activeTextures[t].texture;
    const { texture: r, canvasAndContext: i } = this.createTextureAndCanvas(e);
    return this._activeTextures[t] = {
      canvasAndContext: i,
      texture: r,
      usageCount: 1
    }, r;
  }
  _increaseReferenceCount(e) {
    this._activeTextures[e].usageCount++;
  }
  decreaseReferenceCount(e) {
    const t = this._activeTextures[e];
    if (t.usageCount--, t.usageCount === 0) {
      G.returnCanvasAndContext(t.canvasAndContext), w.returnTexture(t.texture);
      const r = t.texture.source;
      r.resource = null, r.uploadMethodId = "unknown", r.alphaMode = "no-premultiply-alpha", this._activeTextures[e] = null;
    }
  }
  getReferenceCount(e) {
    return this._activeTextures[e].usageCount;
  }
  /**
   * Renders text to its canvas, and updates its texture.
   *
   * By default this is used internally to ensure the texture is correct before rendering,
   * but it can be used called externally, for example from this class to 'pre-generate' the texture from a piece of text,
   * and then shared across multiple Sprites.
   * @param text
   * @param style
   * @param resolution
   * @param canvasAndContext
   */
  renderTextToCanvas(e, t, r, i) {
    var n, s, o, d;
    const { canvas: u, context: l } = i, h = pt(t), p = k.measureText(e || " ", t), m = p.lines, g = p.lineHeight, f = p.lineWidths, x = p.maxLineWidth, y = p.fontProperties, R = u.height;
    if (l.resetTransform(), l.scale(r, r), l.textBaseline = t.textBaseline, (n = t._stroke) != null && n.width) {
      const S = t._stroke;
      l.lineWidth = S.width, l.miterLimit = S.miterLimit, l.lineJoin = S.join, l.lineCap = S.cap;
    }
    l.font = h;
    let b, P;
    const F = t.dropShadow ? 2 : 1;
    for (let S = 0; S < F; ++S) {
      const M = t.dropShadow && S === 0, I = M ? Math.ceil(Math.max(1, R) + t.padding * 2) : 0, et = I * r;
      if (M) {
        l.fillStyle = "black", l.strokeStyle = "black";
        const v = t.dropShadow, tt = v.color, rt = v.alpha;
        l.shadowColor = U.shared.setValue(tt).setAlpha(rt).toRgbaString();
        const it = v.blur * r, se = v.distance * r;
        l.shadowBlur = it, l.shadowOffsetX = Math.cos(v.angle) * se, l.shadowOffsetY = Math.sin(v.angle) * se + et;
      } else
        l.fillStyle = t._fill ? de(t._fill, l) : null, (s = t._stroke) != null && s.width && (l.strokeStyle = de(t._stroke, l)), l.shadowColor = "black";
      let ae = (g - y.fontSize) / 2;
      g - y.fontSize < 0 && (ae = 0);
      const ne = ((o = t._stroke) == null ? void 0 : o.width) ?? 0;
      for (let v = 0; v < m.length; v++)
        b = ne / 2, P = ne / 2 + v * g + y.ascent + ae, t.align === "right" ? b += x - f[v] : t.align === "center" && (b += (x - f[v]) / 2), (d = t._stroke) != null && d.width && this._drawLetterSpacing(
          m[v],
          t,
          i,
          b + t.padding,
          P + t.padding - I,
          !0
        ), t._fill !== void 0 && this._drawLetterSpacing(
          m[v],
          t,
          i,
          b + t.padding,
          P + t.padding - I
        );
    }
  }
  /**
   * Render the text with letter-spacing.
   * @param text - The text to draw
   * @param style
   * @param canvasAndContext
   * @param x - Horizontal position to draw the text
   * @param y - Vertical position to draw the text
   * @param isStroke - Is this drawing for the outside stroke of the
   *  text? If not, it's for the inside fill
   */
  _drawLetterSpacing(e, t, r, i, n, s = !1) {
    const { context: o } = r, d = t.letterSpacing;
    let u = !1;
    if (k.experimentalLetterSpacingSupported && (k.experimentalLetterSpacing ? (o.letterSpacing = `${d}px`, o.textLetterSpacing = `${d}px`, u = !0) : (o.letterSpacing = "0px", o.textLetterSpacing = "0px")), d === 0 || u) {
      s ? o.strokeText(e, i, n) : o.fillText(e, i, n);
      return;
    }
    let l = i;
    const h = k.graphemeSegmenter(e);
    let p = o.measureText(e).width, m = 0;
    for (let g = 0; g < h.length; ++g) {
      const f = h[g];
      s ? o.strokeText(f, l, n) : o.fillText(f, l, n);
      let x = "";
      for (let y = g + 1; y < h.length; ++y)
        x += h[y];
      m = o.measureText(x).width, l += p - m + d, p = m;
    }
  }
  destroy() {
    this._activeTextures = null;
  }
}
Ze.extension = {
  type: [
    c.WebGLSystem,
    c.WebGPUSystem,
    c.CanvasSystem
  ],
  name: "canvasText"
};
T.add(Ge);
T.add(ze);
T.add(Ie);
T.add(at);
T.add(Le);
T.add(je);
T.add(Ke);
T.add(Ze);
T.add(Qe);
T.add(Xe);
T.add(ie);
T.add(qe);
T.add(Ne);
T.add(Ye);
T.add(Oe);
T.add(He);
