import { D as p, q as Z, C as v, h as ct, d as pt, w as he, a as F, z as Re, c as V, W as U, A as ft, _ as ee, b as Ue, H as B, $ as te, l as G, R as C, S as _, e as gt, s as re, E as mt, f as xt, X as _t, g as N, i as q, j as z, k, n as J, o as bt, p as P, r as ce, t as L, u as Pe, v as yt, x as ie, y as Me, B as Ae, Z as vt, F as Tt, G as St, J as ke, K as wt, L as Ct, M as Fe, N as Bt, O as He, P as pe, Q as fe, U as Q, V as D, Y as Rt, a0 as Ut, a1 as Pt } from "./index-BP2uAOLI.js";
import { k as w, w as E, v as $, U as Ge, m as Mt, O as At } from "./colorToUniform-Cu0xVW3l-BmPmCrvf.js";
class ze {
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
        const { clientWidth: i, clientHeight: a } = this._resizeTo;
        t = i, r = a;
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
ze.extension = p.Application;
class De {
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
          this._ticker && this._ticker.remove(this.render, this), this._ticker = t, t && t.add(this.render, this, pt.LOW);
        },
        get() {
          return this._ticker;
        }
      }
    ), this.stop = () => {
      this._ticker.stop();
    }, this.start = () => {
      this._ticker.start();
    }, this._ticker = null, this.ticker = e.sharedTicker ? he.shared : new he(), e.autoStart && this.start();
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
De.extension = p.Application;
class We {
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
We.extension = {
  type: [
    p.WebGLPipes,
    p.WebGPUPipes,
    p.CanvasPipes
  ],
  name: "filter"
};
const kt = new B();
function Ft(s, e) {
  return e.clear(), Oe(s, e), e.isValid || e.set(0, 0, 0, 0), s.renderGroup ? e.applyMatrix(s.renderGroup.localTransform) : e.applyMatrix(s.parentRenderGroup.worldTransform), e;
}
function Oe(s, e) {
  if (s.localDisplayStatus !== 7 || !s.measurable)
    return;
  const t = !!s.effects.length;
  let r = e;
  if ((s.renderGroup || t) && (r = L.get().clear()), s.boundsArea)
    e.addRect(s.boundsArea, s.worldTransform);
  else {
    if (s.renderPipeId) {
      const a = s.bounds;
      r.addFrame(
        a.minX,
        a.minY,
        a.maxX,
        a.maxY,
        s.groupTransform
      );
    }
    const i = s.children;
    for (let a = 0; a < i.length; a++)
      Oe(i[a], r);
  }
  if (t) {
    let i = !1;
    for (let a = 0; a < s.effects.length; a++)
      s.effects[a].addBounds && (i || (i = !0, r.applyMatrix(s.parentRenderGroup.worldTransform)), s.effects[a].addBounds(r, !0));
    i && (r.applyMatrix(s.parentRenderGroup.worldTransform.copyTo(kt).invert()), e.addBounds(r, s.relativeGroupTransform)), e.addBounds(r), L.return(r);
  } else s.renderGroup && (e.addBounds(r, s.relativeGroupTransform), L.return(r));
}
function Ht(s, e) {
  e.clear();
  const t = e.matrix;
  for (let r = 0; r < s.length; r++) {
    const i = s[r];
    i.globalDisplayStatus < 7 || (e.matrix = i.worldTransform, i.addBounds(e));
  }
  return e.matrix = t, e;
}
const Gt = new Z({
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
class Ve {
  constructor(e) {
    this._filterStackIndex = 0, this._filterStack = [], this._filterGlobalUniforms = new F({
      uInputSize: { value: new Float32Array(4), type: "vec4<f32>" },
      uInputPixel: { value: new Float32Array(4), type: "vec4<f32>" },
      uInputClamp: { value: new Float32Array(4), type: "vec4<f32>" },
      uOutputFrame: { value: new Float32Array(4), type: "vec4<f32>" },
      uGlobalFrame: { value: new Float32Array(4), type: "vec4<f32>" },
      uOutputTexture: { value: new Float32Array(4), type: "vec4<f32>" }
    }), this._globalFilterBindGroup = new Re({}), this.renderer = e;
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
    const a = this._filterStack[this._filterStackIndex];
    if (this._filterStackIndex++, i.length === 0) {
      a.skip = !0;
      return;
    }
    const n = a.bounds;
    e.renderables ? Ht(e.renderables, n) : e.filterEffect.filterArea ? (n.clear(), n.addRect(e.filterEffect.filterArea), n.applyMatrix(e.container.worldTransform)) : Ft(e.container, n);
    const o = r.renderTarget.renderTarget.colorTexture.source;
    let d = 1 / 0, h = 0, u = !0, l = !1, c = !1, f = !0;
    for (let m = 0; m < i.length; m++) {
      const g = i[m];
      if (d = Math.min(d, g.resolution === "inherit" ? o._resolution : g.resolution), h += g.padding, g.antialias === "off" ? u = !1 : g.antialias === "inherit" && u && (u = o.antialias), g.clipToViewport || (f = !1), !(g.compatibleRenderers & r.type)) {
        c = !1;
        break;
      }
      if (g.blendRequired && !(((t = r.backBuffer) == null ? void 0 : t.useBackBuffer) ?? !0)) {
        V("Blend filter requires backBuffer on WebGL renderer to be enabled. Set `useBackBuffer: true` in the renderer options."), c = !1;
        break;
      }
      c = g.enabled || c, l = l || g.blendRequired;
    }
    if (!c) {
      a.skip = !0;
      return;
    }
    if (n.scale(d), f) {
      const m = r.renderTarget.rootViewPort;
      n.fitBounds(0, m.width, 0, m.height);
    }
    if (n.ceil().scale(1 / d).pad(h | 0), !n.isPositive) {
      a.skip = !0;
      return;
    }
    a.skip = !1, a.bounds = n, a.blendRequired = l, a.container = e.container, a.filterEffect = e.filterEffect, a.previousRenderSurface = r.renderTarget.renderSurface, a.inputTexture = w.getOptimalTexture(
      n.width,
      n.height,
      d,
      u
    ), r.renderTarget.bind(a.inputTexture, !0), r.globalUniforms.push({
      offset: n
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
    let a = U.EMPTY;
    if (e.renderTarget.finishRenderPass(), t.blendRequired) {
      const o = this._filterStackIndex > 0 ? this._filterStack[this._filterStackIndex - 1].bounds : null, d = e.renderTarget.getRenderTarget(t.previousRenderSurface);
      a = this.getBackTexture(d, i, o);
    }
    t.backTexture = a;
    const n = t.filterEffect.filters;
    if (this._globalFilterBindGroup.setResource(r.source.style, 2), this._globalFilterBindGroup.setResource(a.source, 3), e.globalUniforms.pop(), n.length === 1)
      n[0].apply(this, r, t.previousRenderSurface, !1), w.returnTexture(r);
    else {
      let o = t.inputTexture, d = w.getOptimalTexture(
        i.width,
        i.height,
        o.source._resolution,
        !1
      ), h = 0;
      for (h = 0; h < n.length - 1; ++h) {
        n[h].apply(this, o, d, !0);
        const u = o;
        o = d, d = u;
      }
      n[h].apply(this, o, t.previousRenderSurface, !1), w.returnTexture(o), w.returnTexture(d);
    }
    t.blendRequired && w.returnTexture(a);
  }
  getBackTexture(e, t, r) {
    const i = e.colorTexture.source._resolution, a = w.getOptimalTexture(
      t.width,
      t.height,
      i,
      !1
    );
    let n = t.minX, o = t.minY;
    r && (n -= r.minX, o -= r.minY), n = Math.floor(n * i), o = Math.floor(o * i);
    const d = Math.ceil(t.width * i), h = Math.ceil(t.height * i);
    return this.renderer.renderTarget.copyToTexture(
      e,
      a,
      { x: n, y: o },
      { width: d, height: h },
      { x: 0, y: 0 }
    ), a;
  }
  applyFilter(e, t, r, i) {
    const a = this.renderer, n = this._filterStack[this._filterStackIndex], o = n.bounds, d = ft.shared, h = n.previousRenderSurface === r;
    let u = this.renderer.renderTarget.rootRenderTarget.colorTexture.source._resolution, l = this._filterStackIndex - 1;
    for (; l > 0 && this._filterStack[l].skip; )
      --l;
    l > 0 && (u = this._filterStack[l].inputTexture.source._resolution);
    const c = this._filterGlobalUniforms, f = c.uniforms, m = f.uOutputFrame, g = f.uInputSize, x = f.uInputPixel, b = f.uInputClamp, R = f.uGlobalFrame, y = f.uOutputTexture;
    if (h) {
      let S = this._filterStackIndex;
      for (; S > 0; ) {
        S--;
        const A = this._filterStack[this._filterStackIndex - 1];
        if (!A.skip) {
          d.x = A.bounds.minX, d.y = A.bounds.minY;
          break;
        }
      }
      m[0] = o.minX - d.x, m[1] = o.minY - d.y;
    } else
      m[0] = 0, m[1] = 0;
    m[2] = t.frame.width, m[3] = t.frame.height, g[0] = t.source.width, g[1] = t.source.height, g[2] = 1 / g[0], g[3] = 1 / g[1], x[0] = t.source.pixelWidth, x[1] = t.source.pixelHeight, x[2] = 1 / x[0], x[3] = 1 / x[1], b[0] = 0.5 * x[2], b[1] = 0.5 * x[3], b[2] = t.frame.width * g[2] - 0.5 * x[2], b[3] = t.frame.height * g[3] - 0.5 * x[3];
    const M = this.renderer.renderTarget.rootRenderTarget.colorTexture;
    R[0] = d.x * u, R[1] = d.y * u, R[2] = M.source.width * u, R[3] = M.source.height * u;
    const H = this.renderer.renderTarget.getRenderTarget(r);
    if (a.renderTarget.bind(r, !!i), r instanceof U ? (y[0] = r.frame.width, y[1] = r.frame.height) : (y[0] = H.width, y[1] = H.height), y[2] = H.isRoot ? -1 : 1, c.update(), a.renderPipes.uniformBatch) {
      const S = a.renderPipes.uniformBatch.getUboResource(c);
      this._globalFilterBindGroup.setResource(S, 0);
    } else
      this._globalFilterBindGroup.setResource(c, 0);
    this._globalFilterBindGroup.setResource(t.source, 1), this._globalFilterBindGroup.setResource(t.source.style, 2), e.groups[0] = this._globalFilterBindGroup, a.encoder.draw({
      geometry: Gt,
      shader: e,
      state: e._state,
      topology: "triangle-list"
    }), a.type === ee.WEBGL && a.renderTarget.finishRenderPass();
  }
  _getFilterData() {
    return {
      skip: !1,
      inputTexture: null,
      bounds: new Ue(),
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
    ), a = t.worldTransform.copyTo(B.shared);
    return a.invert(), i.prepend(a), i.scale(
      1 / t.texture.frame.width,
      1 / t.texture.frame.height
    ), i.translate(t.anchor.x, t.anchor.y), i;
  }
}
Ve.extension = {
  type: [
    p.WebGLSystem,
    p.WebGPUSystem
  ],
  name: "filter"
};
const Ee = class $e extends Z {
  constructor(...e) {
    let t = e[0] ?? {};
    t instanceof Float32Array && (te(Pe, "use new MeshGeometry({ positions, uvs, indices }) instead"), t = {
      positions: t,
      uvs: e[1],
      indices: e[2]
    }), t = { ...$e.defaultOptions, ...t };
    const r = t.positions || new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), i = t.uvs || new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), a = t.indices || new Uint32Array([0, 1, 2, 0, 2, 3]), n = t.shrinkBuffersToFit, o = new G({
      data: r,
      label: "attribute-mesh-positions",
      shrinkToFit: n,
      usage: C.VERTEX | C.COPY_DST
    }), d = new G({
      data: i,
      label: "attribute-mesh-uvs",
      shrinkToFit: n,
      usage: C.VERTEX | C.COPY_DST
    }), h = new G({
      data: a,
      label: "index-mesh-buffer",
      shrinkToFit: n,
      usage: C.INDEX | C.COPY_DST
    });
    super({
      attributes: {
        aPosition: {
          buffer: o,
          format: "float32x2",
          stride: 2 * 4,
          offset: 0
        },
        aUV: {
          buffer: d,
          format: "float32x2",
          stride: 2 * 4,
          offset: 0
        }
      },
      indexBuffer: h,
      topology: t.topology
    }), this.batchMode = "auto";
  }
  /** The positions of the mesh. */
  get positions() {
    return this.attributes.aPosition.buffer.data;
  }
  set positions(e) {
    this.attributes.aPosition.buffer.data = e;
  }
  /** The UVs of the mesh. */
  get uvs() {
    return this.attributes.aUV.buffer.data;
  }
  set uvs(e) {
    this.attributes.aUV.buffer.data = e;
  }
  /** The indices of the mesh. */
  get indices() {
    return this.indexBuffer.data;
  }
  set indices(e) {
    this.indexBuffer.data = e;
  }
};
Ee.defaultOptions = {
  topology: "triangle-list",
  shrinkBuffersToFit: !1
};
let se = Ee;
function zt(s) {
  const e = s._stroke, t = s._fill, r = [`div { ${[
    `color: ${P.shared.setValue(t.color).toHex()}`,
    `font-size: ${s.fontSize}px`,
    `font-family: ${s.fontFamily}`,
    `font-weight: ${s.fontWeight}`,
    `font-style: ${s.fontStyle}`,
    `font-variant: ${s.fontVariant}`,
    `letter-spacing: ${s.letterSpacing}px`,
    `text-align: ${s.align}`,
    `padding: ${s.padding}px`,
    `white-space: ${s.whiteSpace === "pre" && s.wordWrap ? "pre-wrap" : s.whiteSpace}`,
    ...s.lineHeight ? [`line-height: ${s.lineHeight}px`] : [],
    ...s.wordWrap ? [
      `word-wrap: ${s.breakWords ? "break-all" : "break-word"}`,
      `max-width: ${s.wordWrapWidth}px`
    ] : [],
    ...e ? [Le(e)] : [],
    ...s.dropShadow ? [Ie(s.dropShadow)] : [],
    ...s.cssOverrides
  ].join(";")} }`];
  return Dt(s.tagStyles, r), r.join(" ");
}
function Ie(s) {
  const e = P.shared.setValue(s.color).setAlpha(s.alpha).toHexa(), t = Math.round(Math.cos(s.angle) * s.distance), r = Math.round(Math.sin(s.angle) * s.distance), i = `${t}px ${r}px`;
  return s.blur > 0 ? `text-shadow: ${i} ${s.blur}px ${e}` : `text-shadow: ${i} ${e}`;
}
function Le(s) {
  return [
    `-webkit-text-stroke-width: ${s.width}px`,
    `-webkit-text-stroke-color: ${P.shared.setValue(s.color).toHex()}`,
    `text-stroke-width: ${s.width}px`,
    `text-stroke-color: ${P.shared.setValue(s.color).toHex()}`,
    "paint-order: stroke"
  ].join(";");
}
const ge = {
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
}, me = {
  fill: (s) => `color: ${P.shared.setValue(s).toHex()}`,
  breakWords: (s) => `word-wrap: ${s ? "break-all" : "break-word"}`,
  stroke: Le,
  dropShadow: Ie
};
function Dt(s, e) {
  for (const t in s) {
    const r = s[t], i = [];
    for (const a in r)
      me[a] ? i.push(me[a](r[a])) : ge[a] && i.push(ge[a].replace("{{VALUE}}", r[a]));
    e.push(`${t} { ${i.join(";")} }`);
  }
}
class ae extends J {
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
    return this._styleKey = yt(this) + this._cssOverrides.join("-"), this._styleKey;
  }
  update() {
    this._cssStyle = null, super.update();
  }
  /**
   * Creates a new HTMLTextStyle object with the same values as this one.
   * @returns New cloned HTMLTextStyle object
   */
  clone() {
    return new ae({
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
    return this._cssStyle || (this._cssStyle = zt(this)), this._cssStyle;
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
const xe = "http://www.w3.org/2000/svg", _e = "http://www.w3.org/1999/xhtml";
class Xe {
  constructor() {
    this.svgRoot = document.createElementNS(xe, "svg"), this.foreignObject = document.createElementNS(xe, "foreignObject"), this.domElement = document.createElementNS(_e, "div"), this.styleElement = document.createElementNS(_e, "style"), this.image = new Image();
    const { foreignObject: e, svgRoot: t, styleElement: r, domElement: i } = this;
    e.setAttribute("width", "10000"), e.setAttribute("height", "10000"), e.style.overflow = "hidden", t.appendChild(e), e.appendChild(r), e.appendChild(i);
  }
}
let be;
function Wt(s, e, t, r) {
  r = r || be || (be = new Xe());
  const { domElement: i, styleElement: a, svgRoot: n } = r;
  i.innerHTML = `<style>${e.cssStyle};</style><div style='padding:0'>${s}</div>`, i.setAttribute("style", "transform-origin: top left; display: inline-block"), t && (a.textContent = t), document.body.appendChild(n);
  const o = i.getBoundingClientRect();
  n.remove();
  const d = e.padding * 2;
  return {
    width: o.width - d,
    height: o.height - d
  };
}
class Ye {
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
    const a = i.resources.localUniforms.uniforms;
    a.uTransformMatrix = e.groupTransform, a.uRound = t._roundPixels | e._roundPixels, $(
      e.groupColorAlpha,
      a.uColor,
      0
    ), this._adaptor.execute(this, e);
  }
  _rebuild(e) {
    const t = !!this._graphicsBatchesHash[e.uid], r = this.renderer.graphicsContext.updateGpuContext(e.context);
    t && this._removeBatchForRenderable(e.uid), r.isBatchable && this._initBatchesForRenderable(e), e.batched = r.isBatchable;
  }
  _addToBatcher(e, t) {
    const r = this.renderer.renderPipes.batch, i = this._getBatchesForRenderable(e);
    for (let a = 0; a < i.length; a++) {
      const n = i[a];
      r.addToBatch(n, t);
    }
  }
  _getBatchesForRenderable(e) {
    return this._graphicsBatchesHash[e.uid] || this._initBatchesForRenderable(e);
  }
  _initBatchesForRenderable(e) {
    const t = e.context, r = this.renderer.graphicsContext.getGpuContext(t), i = this.renderer._roundPixels | e._roundPixels, a = r.batches.map((n) => {
      const o = _.get(gt);
      return n.copyTo(o), o.renderable = e, o.roundPixels = i, o;
    });
    return this._graphicsBatchesHash[e.uid] === void 0 && e.on("destroyed", this._destroyRenderableBound), this._graphicsBatchesHash[e.uid] = a, a;
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
Ye.extension = {
  type: [
    p.WebGLPipes,
    p.WebGPUPipes,
    p.CanvasPipes
  ],
  name: "graphics"
};
const je = class Ke extends se {
  constructor(...e) {
    super({});
    let t = e[0] ?? {};
    typeof t == "number" && (te(Pe, "PlaneGeometry constructor changed please use { width, height, verticesX, verticesY } instead"), t = {
      width: t,
      height: e[1],
      verticesX: e[2],
      verticesY: e[3]
    }), this.build(t);
  }
  /**
   * Refreshes plane coordinates
   * @param options - Options to be applied to plane geometry
   */
  build(e) {
    e = { ...Ke.defaultOptions, ...e }, this.verticesX = this.verticesX ?? e.verticesX, this.verticesY = this.verticesY ?? e.verticesY, this.width = this.width ?? e.width, this.height = this.height ?? e.height;
    const t = this.verticesX * this.verticesY, r = [], i = [], a = [], n = this.verticesX - 1, o = this.verticesY - 1, d = this.width / n, h = this.height / o;
    for (let l = 0; l < t; l++) {
      const c = l % this.verticesX, f = l / this.verticesX | 0;
      r.push(c * d, f * h), i.push(c / n, f / o);
    }
    const u = n * o;
    for (let l = 0; l < u; l++) {
      const c = l % n, f = l / n | 0, m = f * this.verticesX + c, g = f * this.verticesX + c + 1, x = (f + 1) * this.verticesX + c, b = (f + 1) * this.verticesX + c + 1;
      a.push(
        m,
        g,
        x,
        g,
        b,
        x
      );
    }
    this.buffers[0].data = new Float32Array(r), this.buffers[1].data = new Float32Array(i), this.indexBuffer.data = new Uint32Array(a), this.buffers[0].update(), this.buffers[1].update(), this.indexBuffer.update();
  }
};
je.defaultOptions = {
  width: 100,
  height: 100,
  verticesX: 10,
  verticesY: 10
};
let Ot = je;
class ne {
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
class Ne {
  constructor(e, t) {
    this.localUniforms = new F({
      uTransformMatrix: { value: new B(), type: "mat3x3<f32>" },
      uColor: { value: new Float32Array([1, 1, 1, 1]), type: "vec4<f32>" },
      uRound: { value: 0, type: "f32" }
    }), this.localUniformsBindGroup = new Re({
      0: this.localUniforms
    }), this._meshDataHash = /* @__PURE__ */ Object.create(null), this._gpuBatchableMeshHash = /* @__PURE__ */ Object.create(null), this._destroyRenderableBound = this.destroyRenderable.bind(this), this.renderer = e, this._adaptor = t, this._adaptor.init(), e.renderableGC.addManagedHash(this, "_gpuBatchableMeshHash"), e.renderableGC.addManagedHash(this, "_meshDataHash");
  }
  validateRenderable(e) {
    const t = this._getMeshData(e), r = t.batched, i = e.batched;
    if (t.batched = i, r !== i)
      return !0;
    if (i) {
      const a = e._geometry;
      if (a.indices.length !== t.indexSize || a.positions.length !== t.vertexSize)
        return t.indexSize = a.indices.length, t.vertexSize = a.positions.length, !0;
      const n = this._getBatchableMesh(e), o = e.texture;
      if (n.texture._source !== o._source && n.texture._source !== o._source)
        return !n._batcher.checkAndUpdateTexture(n, o);
    }
    return !1;
  }
  addRenderable(e, t) {
    const r = this.renderer.renderPipes.batch, { batched: i } = this._getMeshData(e);
    if (i) {
      const a = this._getBatchableMesh(e);
      a.texture = e._texture, a.geometry = e._geometry, r.addToBatch(a, t);
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
    e.state.blendMode = re(e.groupBlendMode, e.texture._source);
    const t = this.localUniforms;
    t.uniforms.uTransformMatrix = e.groupTransform, t.uniforms.uRound = this.renderer._roundPixels | e._roundPixels, t.update(), $(
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
    const t = _.get(ne);
    return t.renderable = e, t.texture = e._texture, t.transform = e.groupTransform, t.roundPixels = this.renderer._roundPixels | e._roundPixels, this._gpuBatchableMeshHash[e.uid] = t, t;
  }
  destroy() {
    for (const e in this._gpuBatchableMeshHash)
      this._gpuBatchableMeshHash[e] && _.return(this._gpuBatchableMeshHash[e]);
    this._gpuBatchableMeshHash = null, this._meshDataHash = null, this.localUniforms = null, this.localUniformsBindGroup = null, this._adaptor.destroy(), this._adaptor = null, this.renderer = null;
  }
}
Ne.extension = {
  type: [
    p.WebGLPipes,
    p.WebGPUPipes,
    p.CanvasPipes
  ],
  name: "mesh"
};
class Vt {
  execute(e, t) {
    const r = e.state, i = e.renderer, a = t.shader || e.defaultShader;
    a.resources.uTexture = t.texture._source, a.resources.uniforms = e.localUniforms;
    const n = i.gl, o = e.getBuffers(t);
    i.shader.bind(a), i.state.set(r), i.geometry.bind(o.geometry, a.glProgram);
    const d = o.geometry.indexBuffer.data.BYTES_PER_ELEMENT === 2 ? n.UNSIGNED_SHORT : n.UNSIGNED_INT;
    n.drawElements(n.TRIANGLES, t.particleChildren.length * 6, d, 0);
  }
}
class Et {
  execute(e, t) {
    const r = e.renderer, i = t.shader || e.defaultShader;
    i.groups[0] = r.renderPipes.uniformBatch.getUniformBindGroup(e.localUniforms, !0), i.groups[1] = r.texture.getTextureBindGroup(t.texture);
    const a = e.state, n = e.getBuffers(t);
    r.encoder.draw({
      geometry: n.geometry,
      shader: t.shader || e.defaultShader,
      state: a,
      size: t.particleChildren.length * 6
    });
  }
}
function ye(s, e = null) {
  const t = s * 6;
  if (t > 65535 ? e = e || new Uint32Array(t) : e = e || new Uint16Array(t), e.length !== t)
    throw new Error(`Out buffer length is incorrect, got ${e.length} and expected ${t}`);
  for (let r = 0, i = 0; r < t; r += 6, i += 4)
    e[r + 0] = i + 0, e[r + 1] = i + 1, e[r + 2] = i + 2, e[r + 3] = i + 0, e[r + 4] = i + 2, e[r + 5] = i + 3;
  return e;
}
function $t(s) {
  return {
    dynamicUpdate: ve(s, !0),
    staticUpdate: ve(s, !1)
  };
}
function ve(s, e) {
  const t = [];
  t.push(`
      
        var index = 0;

        for (let i = 0; i < ps.length; ++i)
        {
            const p = ps[i];

            `);
  let r = 0;
  for (const a in s) {
    const n = s[a];
    if (e !== n.dynamic)
      continue;
    t.push(`offset = index + ${r}`), t.push(n.code);
    const o = Q(n.format);
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
class It {
  constructor(e) {
    this._size = 0, this._generateParticleUpdateCache = {};
    const t = this._size = e.size ?? 1e3, r = e.properties;
    let i = 0, a = 0;
    for (const u in r) {
      const l = r[u], c = Q(l.format);
      l.dynamic ? a += c.stride : i += c.stride;
    }
    this._dynamicStride = a / 4, this._staticStride = i / 4, this.staticAttributeBuffer = new D(t * 4 * i), this.dynamicAttributeBuffer = new D(t * 4 * a), this.indexBuffer = ye(t);
    const n = new Z();
    let o = 0, d = 0;
    this._staticBuffer = new G({
      data: new Float32Array(1),
      label: "static-particle-buffer",
      shrinkToFit: !1,
      usage: C.VERTEX | C.COPY_DST
    }), this._dynamicBuffer = new G({
      data: new Float32Array(1),
      label: "dynamic-particle-buffer",
      shrinkToFit: !1,
      usage: C.VERTEX | C.COPY_DST
    });
    for (const u in r) {
      const l = r[u], c = Q(l.format);
      l.dynamic ? (n.addAttribute(l.attributeName, {
        buffer: this._dynamicBuffer,
        stride: this._dynamicStride * 4,
        offset: o * 4,
        format: l.format
      }), o += c.size) : (n.addAttribute(l.attributeName, {
        buffer: this._staticBuffer,
        stride: this._staticStride * 4,
        offset: d * 4,
        format: l.format
      }), d += c.size);
    }
    n.addIndex(this.indexBuffer);
    const h = this.getParticleUpdate(r);
    this._dynamicUpload = h.dynamicUpdate, this._staticUpload = h.staticUpdate, this.geometry = n;
  }
  getParticleUpdate(e) {
    const t = Lt(e);
    return this._generateParticleUpdateCache[t] ? this._generateParticleUpdateCache[t] : (this._generateParticleUpdateCache[t] = this.generateParticleUpdate(e), this._generateParticleUpdateCache[t]);
  }
  generateParticleUpdate(e) {
    return $t(e);
  }
  update(e, t) {
    e.length > this._size && (t = !0, this._size = Math.max(e.length, this._size * 1.5 | 0), this.staticAttributeBuffer = new D(this._size * this._staticStride * 4 * 4), this.dynamicAttributeBuffer = new D(this._size * this._dynamicStride * 4 * 4), this.indexBuffer = ye(this._size), this.geometry.indexBuffer.setDataWithSize(
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
function Lt(s) {
  const e = [];
  for (const t in s) {
    const r = s[t];
    e.push(t, r.code, r.dynamic ? "d" : "s");
  }
  return e.join("_");
}
var Xt = `varying vec2 vUV;
varying vec4 vColor;

uniform sampler2D uTexture;

void main(void){
    vec4 color = texture2D(uTexture, vUV) * vColor;
    gl_FragColor = color;
}`, Yt = `attribute vec2 aVertex;
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
`, Te = `
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
class jt extends ie {
  constructor() {
    const e = Rt.from({
      vertex: Yt,
      fragment: Xt
    }), t = Ut.from({
      fragment: {
        source: Te,
        entryPoint: "mainFragment"
      },
      vertex: {
        source: Te,
        entryPoint: "mainVertex"
      }
    });
    super({
      glProgram: e,
      gpuProgram: t,
      resources: {
        // this will be replaced with the texture from the particle container
        uTexture: U.WHITE.source,
        // this will be replaced with the texture style from the particle container
        uSampler: new Pt({}),
        // this will be replaced with the local uniforms from the particle container
        uniforms: {
          uTranslationMatrix: { value: new B(), type: "mat3x3<f32>" },
          uColor: { value: new P(16777215), type: "vec4<f32>" },
          uRound: { value: 1, type: "f32" },
          uResolution: { value: [0, 0], type: "vec2<f32>" }
        }
      }
    });
  }
}
class qe {
  /**
   * @param renderer - The renderer this sprite batch works for.
   * @param adaptor
   */
  constructor(e, t) {
    this.state = E.for2d(), this._gpuBufferHash = /* @__PURE__ */ Object.create(null), this._destroyRenderableBound = this.destroyRenderable.bind(this), this.localUniforms = new F({
      uTranslationMatrix: { value: new B(), type: "mat3x3<f32>" },
      uColor: { value: new Float32Array(4), type: "vec4<f32>" },
      uRound: { value: 1, type: "f32" },
      uResolution: { value: [0, 0], type: "vec2<f32>" }
    }), this.renderer = e, this.adaptor = t, this.defaultShader = new jt(), this.state = E.for2d();
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
    return this._gpuBufferHash[e.uid] = new It({
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
    const a = this.state;
    i.update(t, e._childrenDirty), e._childrenDirty = !1, a.blendMode = re(e.blendMode, e.texture._source);
    const n = this.localUniforms.uniforms, o = n.uTranslationMatrix;
    e.worldTransform.copyTo(o), o.prepend(r.globalUniforms.globalUniformData.projectionMatrix), n.uResolution = r.globalUniforms.globalUniformData.resolution, n.uRound = r._roundPixels | e._roundPixels, $(
      e.groupColorAlpha,
      n.uColor,
      0
    ), this.adaptor.execute(this, e);
  }
  /** Destroys the ParticleRenderer. */
  destroy() {
    this.defaultShader && (this.defaultShader.destroy(), this.defaultShader = null);
  }
}
class Je extends qe {
  constructor(e) {
    super(e, new Vt());
  }
}
Je.extension = {
  type: [
    p.WebGLPipes
  ],
  name: "particle"
};
class Qe extends qe {
  constructor(e) {
    super(e, new Et());
  }
}
Qe.extension = {
  type: [
    p.WebGPUPipes
  ],
  name: "particle"
};
const Ze = class et extends Ot {
  constructor(e = {}) {
    e = { ...et.defaultOptions, ...e }, super({
      width: e.width,
      height: e.height,
      verticesX: 4,
      verticesY: 4
    }), this.update(e);
  }
  /**
   * Updates the NineSliceGeometry with the options.
   * @param options - The options of the NineSliceGeometry.
   */
  update(e) {
    this.width = e.width ?? this.width, this.height = e.height ?? this.height, this._originalWidth = e.originalWidth ?? this._originalWidth, this._originalHeight = e.originalHeight ?? this._originalHeight, this._leftWidth = e.leftWidth ?? this._leftWidth, this._rightWidth = e.rightWidth ?? this._rightWidth, this._topHeight = e.topHeight ?? this._topHeight, this._bottomHeight = e.bottomHeight ?? this._bottomHeight, this.updateUvs(), this.updatePositions();
  }
  /** Updates the positions of the vertices. */
  updatePositions() {
    const e = this.positions, t = this._leftWidth + this._rightWidth, r = this.width > t ? 1 : this.width / t, i = this._topHeight + this._bottomHeight, a = this.height > i ? 1 : this.height / i, n = Math.min(r, a);
    e[9] = e[11] = e[13] = e[15] = this._topHeight * n, e[17] = e[19] = e[21] = e[23] = this.height - this._bottomHeight * n, e[25] = e[27] = e[29] = e[31] = this.height, e[2] = e[10] = e[18] = e[26] = this._leftWidth * n, e[4] = e[12] = e[20] = e[28] = this.width - this._rightWidth * n, e[6] = e[14] = e[22] = e[30] = this.width, this.getBuffer("aPosition").update();
  }
  /** Updates the UVs of the vertices. */
  updateUvs() {
    const e = this.uvs;
    e[0] = e[8] = e[16] = e[24] = 0, e[1] = e[3] = e[5] = e[7] = 0, e[6] = e[14] = e[22] = e[30] = 1, e[25] = e[27] = e[29] = e[31] = 1;
    const t = 1 / this._originalWidth, r = 1 / this._originalHeight;
    e[2] = e[10] = e[18] = e[26] = t * this._leftWidth, e[9] = e[11] = e[13] = e[15] = r * this._topHeight, e[4] = e[12] = e[20] = e[28] = 1 - t * this._rightWidth, e[17] = e[19] = e[21] = e[23] = 1 - r * this._bottomHeight, this.getBuffer("aUV").update();
  }
};
Ze.defaultOptions = {
  /** The width of the NineSlicePlane, setting this will actually modify the vertices and UV's of this plane. */
  width: 100,
  /** The height of the NineSlicePlane, setting this will actually modify the vertices and UV's of this plane. */
  height: 100,
  /** The width of the left column. */
  leftWidth: 10,
  /** The height of the top row. */
  topHeight: 10,
  /** The width of the right column. */
  rightWidth: 10,
  /** The height of the bottom row. */
  bottomHeight: 10,
  /** The original width of the texture */
  originalWidth: 100,
  /** The original height of the texture */
  originalHeight: 100
};
let Kt = Ze;
class tt {
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
    const t = _.get(ne);
    return t.geometry = _.get(Kt), t.renderable = e, t.transform = e.groupTransform, t.texture = e._texture, t.roundPixels = this._renderer._roundPixels | e._roundPixels, this._gpuSpriteHash[e.uid] = t, e.didViewUpdate || this._updateBatchableSprite(e, t), e.on("destroyed", this._destroyRenderableBound), t;
  }
  destroy() {
    for (const e in this._gpuSpriteHash)
      this._gpuSpriteHash[e].geometry.destroy();
    this._gpuSpriteHash = null, this._renderer = null;
  }
}
tt.extension = {
  type: [
    p.WebGLPipes,
    p.WebGPUPipes,
    p.CanvasPipes
  ],
  name: "nineSliceSprite"
};
const Nt = {
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
}, qt = {
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
let X, Y;
class Jt extends ie {
  constructor() {
    X ?? (X = Me({
      name: "tiling-sprite-shader",
      bits: [
        Mt,
        Nt,
        ke
      ]
    })), Y ?? (Y = Ae({
      name: "tiling-sprite-shader",
      bits: [
        At,
        qt,
        Fe
      ]
    }));
    const e = new F({
      uMapCoord: { value: new B(), type: "mat3x3<f32>" },
      uClampFrame: { value: new Float32Array([0, 0, 1, 1]), type: "vec4<f32>" },
      uClampOffset: { value: new Float32Array([0, 0]), type: "vec2<f32>" },
      uTextureTransform: { value: new B(), type: "mat3x3<f32>" },
      uSizeAnchor: { value: new Float32Array([100, 100, 0.5, 0.5]), type: "vec4<f32>" }
    });
    super({
      glProgram: Y,
      gpuProgram: X,
      resources: {
        localUniforms: new F({
          uTransformMatrix: { value: new B(), type: "mat3x3<f32>" },
          uColor: { value: new Float32Array([1, 1, 1, 1]), type: "vec4<f32>" },
          uRound: { value: 0, type: "f32" }
        }),
        tilingUniforms: e,
        uTexture: U.EMPTY.source,
        uSampler: U.EMPTY.source.style
      }
    });
  }
  updateUniforms(e, t, r, i, a, n) {
    const o = this.resources.tilingUniforms, d = n.width, h = n.height, u = n.textureMatrix, l = o.uniforms.uTextureTransform;
    l.set(
      r.a * d / e,
      r.b * d / t,
      r.c * h / e,
      r.d * h / t,
      r.tx / e,
      r.ty / t
    ), l.invert(), o.uniforms.uMapCoord = u.mapCoord, o.uniforms.uClampFrame = u.uClampFrame, o.uniforms.uClampOffset = u.uClampOffset, o.uniforms.uTextureTransform = l, o.uniforms.uSizeAnchor[0] = e, o.uniforms.uSizeAnchor[1] = t, o.uniforms.uSizeAnchor[2] = i, o.uniforms.uSizeAnchor[3] = a, n && (this.resources.uTexture = n.source, this.resources.uSampler = n.source.style);
  }
}
class Qt extends se {
  constructor() {
    super({
      positions: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
      uvs: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
      indices: new Uint32Array([0, 1, 2, 0, 2, 3])
    });
  }
}
function Zt(s, e) {
  const t = s.anchor.x, r = s.anchor.y;
  e[0] = -t * s.width, e[1] = -r * s.height, e[2] = (1 - t) * s.width, e[3] = -r * s.height, e[4] = (1 - t) * s.width, e[5] = (1 - r) * s.height, e[6] = -t * s.width, e[7] = (1 - r) * s.height;
}
function er(s, e, t, r) {
  let i = 0;
  const a = s.length / e, n = r.a, o = r.b, d = r.c, h = r.d, u = r.tx, l = r.ty;
  for (t *= e; i < a; ) {
    const c = s[t], f = s[t + 1];
    s[t] = n * c + d * f + u, s[t + 1] = o * c + h * f + l, t += e, i++;
  }
}
function tr(s, e) {
  const t = s.texture, r = t.frame.width, i = t.frame.height;
  let a = 0, n = 0;
  s._applyAnchorToTexture && (a = s.anchor.x, n = s.anchor.y), e[0] = e[6] = -a, e[2] = e[4] = 1 - a, e[1] = e[3] = -n, e[5] = e[7] = 1 - n;
  const o = B.shared;
  o.copyFrom(s._tileTransform.matrix), o.tx /= s.width, o.ty /= s.height, o.invert(), o.scale(s.width / r, s.height / i), er(e, 2, 0, o);
}
const W = new Qt();
class rt {
  constructor(e) {
    this._state = E.default2d, this._tilingSpriteDataHash = /* @__PURE__ */ Object.create(null), this._destroyRenderableBound = this.destroyRenderable.bind(this), this._renderer = e, this._renderer.renderableGC.addManagedHash(this, "_tilingSpriteDataHash");
  }
  validateRenderable(e) {
    const t = this._getTilingSpriteData(e), r = t.canBatch;
    this._updateCanBatch(e);
    const i = t.canBatch;
    if (i && i === r) {
      const { batchableMesh: a } = t;
      if (a && a.texture._source !== e.texture._source)
        return !a._batcher.checkAndUpdateTexture(a, e.texture);
    }
    return r !== i;
  }
  addRenderable(e, t) {
    const r = this._renderer.renderPipes.batch;
    this._updateCanBatch(e);
    const i = this._getTilingSpriteData(e), { geometry: a, canBatch: n } = i;
    if (n) {
      i.batchableMesh || (i.batchableMesh = new ne());
      const o = i.batchableMesh;
      e.didViewUpdate && (this._updateBatchableMesh(e), o.geometry = a, o.renderable = e, o.transform = e.groupTransform, o.texture = e._texture), o.roundPixels = this._renderer._roundPixels | e._roundPixels, r.addToBatch(o, t);
    } else
      r.break(t), i.shader || (i.shader = new Jt()), this.updateRenderable(e), t.add(e);
  }
  execute(e) {
    const { shader: t } = this._tilingSpriteDataHash[e.uid];
    t.groups[0] = this._renderer.globalUniforms.bindGroup;
    const r = t.resources.localUniforms.uniforms;
    r.uTransformMatrix = e.groupTransform, r.uRound = this._renderer._roundPixels | e._roundPixels, $(
      e.groupColorAlpha,
      r.uColor,
      0
    ), this._state.blendMode = re(e.groupBlendMode, e.texture._source), this._renderer.encoder.draw({
      geometry: W,
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
    const t = new se({
      indices: W.indices,
      positions: W.positions.slice(),
      uvs: W.uvs.slice()
    });
    return this._tilingSpriteDataHash[e.uid] = {
      canBatch: !0,
      renderable: e,
      geometry: t
    }, e.on("destroyed", this._destroyRenderableBound), this._tilingSpriteDataHash[e.uid];
  }
  _updateBatchableMesh(e) {
    const t = this._getTilingSpriteData(e), { geometry: r } = t, i = e.texture.source.style;
    i.addressMode !== "repeat" && (i.addressMode = "repeat", i.update()), tr(e, r.uvs), Zt(e, r.positions);
  }
  destroy() {
    for (const e in this._tilingSpriteDataHash)
      this.destroyRenderable(this._tilingSpriteDataHash[e].renderable);
    this._tilingSpriteDataHash = null, this._renderer = null;
  }
  _updateCanBatch(e) {
    const t = this._getTilingSpriteData(e), r = e.texture;
    let i = !0;
    return this._renderer.type === ee.WEBGL && (i = this._renderer.context.supports.nonPowOf2wrapping), t.canBatch = r.textureMatrix.isSimple && (i || r.source.isPowerOfTwo), t.canBatch;
  }
}
rt.extension = {
  type: [
    p.WebGLPipes,
    p.WebGPUPipes,
    p.CanvasPipes
  ],
  name: "tilingSprite"
};
const rr = {
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
}, ir = {
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
}, sr = {
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
}, ar = {
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
let j, K;
class nr extends ie {
  constructor() {
    const e = new F({
      uColor: { value: new Float32Array([1, 1, 1, 1]), type: "vec4<f32>" },
      uTransformMatrix: { value: new B(), type: "mat3x3<f32>" },
      uDistance: { value: 4, type: "f32" },
      uRound: { value: 0, type: "f32" }
    }), t = vt();
    j ?? (j = Me({
      name: "sdf-shader",
      bits: [
        Tt,
        St(t),
        rr,
        sr,
        ke
      ]
    })), K ?? (K = Ae({
      name: "sdf-shader",
      bits: [
        wt,
        Ct(t),
        ir,
        ar,
        Fe
      ]
    })), super({
      glProgram: K,
      gpuProgram: j,
      resources: {
        localUniforms: e,
        batchSamplers: Bt(t)
      }
    });
  }
}
class it {
  constructor(e) {
    this._gpuBitmapText = {}, this._destroyRenderableBound = this.destroyRenderable.bind(this), this._renderer = e, this._renderer.renderableGC.addManagedHash(this, "_gpuBitmapText");
  }
  validateRenderable(e) {
    const t = this._getGpuBitmapText(e);
    return e._didTextUpdate && (e._didTextUpdate = !1, this._updateContext(e, t)), this._renderer.renderPipes.graphics.validateRenderable(t);
  }
  addRenderable(e, t) {
    const r = this._getGpuBitmapText(e);
    Se(e, r), e._didTextUpdate && (e._didTextUpdate = !1, this._updateContext(e, r)), this._renderer.renderPipes.graphics.addRenderable(r, t), r.context.customShader && this._updateDistanceField(e);
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
    Se(e, t), this._renderer.renderPipes.graphics.updateRenderable(t), t.context.customShader && this._updateDistanceField(e);
  }
  _updateContext(e, t) {
    const { context: r } = t, i = mt.getFont(e.text, e._style);
    r.clear(), i.distanceField.type !== "none" && (r.customShader || (r.customShader = _.get(nr)));
    const a = Array.from(e.text), n = e._style;
    let o = i.baseLineOffset;
    const d = xt(a, n, i, !0);
    let h = 0;
    const u = n.padding, l = d.scale;
    let c = d.width, f = d.height + d.offsetY;
    n._stroke && (c += n._stroke.width / l, f += n._stroke.width / l), r.translate(-e._anchor._x * c - u, -e._anchor._y * f - u).scale(l, l);
    const m = i.applyFillAsTint ? n._fill.color : 16777215;
    for (let g = 0; g < d.lines.length; g++) {
      const x = d.lines[g];
      for (let b = 0; b < x.charPositions.length; b++) {
        const R = a[h++], y = i.chars[R];
        y != null && y.texture && r.texture(
          y.texture,
          m || "black",
          Math.round(x.charPositions[b] + y.xOffset),
          Math.round(o + y.yOffset)
        );
      }
      o += i.lineHeight;
    }
  }
  _getGpuBitmapText(e) {
    return this._gpuBitmapText[e.uid] || this.initGpuText(e);
  }
  initGpuText(e) {
    const t = _.get(_t);
    return this._gpuBitmapText[e.uid] = t, this._updateContext(e, t), e.on("destroyed", this._destroyRenderableBound), this._gpuBitmapText[e.uid];
  }
  _updateDistanceField(e) {
    const t = this._getGpuBitmapText(e).context, r = e._style.fontFamily, i = N.get(`${r}-bitmap`), { a, b: n, c: o, d } = e.groupTransform, h = Math.sqrt(a * a + n * n), u = Math.sqrt(o * o + d * d), l = (Math.abs(h) + Math.abs(u)) / 2, c = i.baseRenderedFontSize / e._style.fontSize, f = l * i.distanceField.range * (1 / c);
    t.customShader.resources.localUniforms.uniforms.uDistance = f;
  }
  destroy() {
    for (const e in this._gpuBitmapText)
      this._destroyRenderableByUid(e);
    this._gpuBitmapText = null, this._renderer = null;
  }
}
it.extension = {
  type: [
    p.WebGLPipes,
    p.WebGPUPipes,
    p.CanvasPipes
  ],
  name: "bitmapText"
};
function Se(s, e) {
  e.groupTransform = s.groupTransform, e.groupColorAlpha = s.groupColorAlpha, e.groupColor = s.groupColor, e.groupBlendMode = s.groupBlendMode, e.globalDisplayStatus = s.globalDisplayStatus, e.groupTransform = s.groupTransform, e.localDisplayStatus = s.localDisplayStatus, e.groupAlpha = s.groupAlpha, e._roundPixels = s._roundPixels;
}
class st {
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
    r.currentKey !== t && this._updateGpuText(e).catch((n) => {
      console.error(n);
    }), e._didTextUpdate = !1;
    const a = e._style.padding;
    q(i.bounds, e._anchor, i.texture, a);
  }
  async _updateGpuText(e) {
    e._didTextUpdate = !1;
    const t = this._getGpuText(e);
    if (t.generatingTexture)
      return;
    const r = e._getKey();
    this._renderer.htmlText.decreaseReferenceCount(t.currentKey), t.generatingTexture = !0, t.currentKey = r;
    const i = e.resolution ?? this._renderer.resolution, a = await this._renderer.htmlText.getManagedTexture(
      e.text,
      i,
      e._style,
      e._getKey()
    ), n = t.batchableSprite;
    n.texture = t.texture = a, t.generatingTexture = !1, t.textureNeedsUploading = !0, e.onViewUpdate();
    const o = e._style.padding;
    q(n.bounds, e._anchor, n.texture, o);
  }
  _getGpuText(e) {
    return this._gpuText[e.uid] || this.initGpuText(e);
  }
  initGpuText(e) {
    const t = {
      texture: U.EMPTY,
      currentKey: "--",
      batchableSprite: _.get(Ge),
      textureNeedsUploading: !1,
      generatingTexture: !1
    }, r = t.batchableSprite;
    return r.renderable = e, r.transform = e.groupTransform, r.texture = U.EMPTY, r.bounds = { minX: 0, maxX: 1, minY: 0, maxY: 0 }, r.roundPixels = this._renderer._roundPixels | e._roundPixels, e._resolution = e._autoResolution ? this._renderer.resolution : e.resolution, this._gpuText[e.uid] = t, e.on("destroyed", this._destroyRenderableBound), t;
  }
  destroy() {
    for (const e in this._gpuText)
      this._destroyRenderableById(e);
    this._gpuText = null, this._renderer = null;
  }
}
st.extension = {
  type: [
    p.WebGLPipes,
    p.WebGPUPipes,
    p.CanvasPipes
  ],
  name: "htmlText"
};
function or() {
  const { userAgent: s } = He.get().getNavigator();
  return /^((?!chrome|android).)*safari/i.test(s);
}
const dr = new Ue();
function at(s, e, t, r) {
  const i = dr;
  i.minX = 0, i.minY = 0, i.maxX = s.width / r | 0, i.maxY = s.height / r | 0;
  const a = w.getOptimalTexture(
    i.width,
    i.height,
    r,
    !1
  );
  return a.source.uploadMethodId = "image", a.source.resource = s, a.source.alphaMode = "premultiply-alpha-on-upload", a.frame.width = e / r, a.frame.height = t / r, a.source.emit("update", a.source), a.updateUvs(), a;
}
function ur(s, e) {
  const t = e.fontFamily, r = [], i = {}, a = /font-family:([^;"\s]+)/g, n = s.match(a);
  function o(d) {
    i[d] || (r.push(d), i[d] = !0);
  }
  if (Array.isArray(t))
    for (let d = 0; d < t.length; d++)
      o(t[d]);
  else
    o(t);
  n && n.forEach((d) => {
    const h = d.split(":")[1].trim();
    o(h);
  });
  for (const d in e.tagStyles) {
    const h = e.tagStyles[d].fontFamily;
    o(h);
  }
  return r;
}
async function lr(s) {
  const e = await (await He.get().fetch(s)).blob(), t = new FileReader();
  return await new Promise((r, i) => {
    t.onloadend = () => r(t.result), t.onerror = i, t.readAsDataURL(e);
  });
}
async function we(s, e) {
  const t = await lr(e);
  return `@font-face {
        font-family: "${s.fontFamily}";
        src: url('${t}');
        font-weight: ${s.fontWeight};
        font-style: ${s.fontStyle};
    }`;
}
const O = /* @__PURE__ */ new Map();
async function hr(s, e, t) {
  const r = s.filter((i) => N.has(`${i}-and-url`)).map((i, a) => {
    if (!O.has(i)) {
      const { url: n } = N.get(`${i}-and-url`);
      a === 0 ? O.set(i, we({
        fontWeight: e.fontWeight,
        fontStyle: e.fontStyle,
        fontFamily: i
      }, n)) : O.set(i, we({
        fontWeight: t.fontWeight,
        fontStyle: t.fontStyle,
        fontFamily: i
      }, n));
    }
    return O.get(i);
  });
  return (await Promise.all(r)).join(`
`);
}
function cr(s, e, t, r, i) {
  const { domElement: a, styleElement: n, svgRoot: o } = i;
  a.innerHTML = `<style>${e.cssStyle}</style><div style='padding:0;'>${s}</div>`, a.setAttribute("style", `transform: scale(${t});transform-origin: top left; display: inline-block`), n.textContent = r;
  const { width: d, height: h } = i.image;
  return o.setAttribute("width", d.toString()), o.setAttribute("height", h.toString()), new XMLSerializer().serializeToString(o);
}
function pr(s, e) {
  const t = z.getOptimalCanvasAndContext(
    s.width,
    s.height,
    e
  ), { context: r } = t;
  return r.clearRect(0, 0, s.width, s.height), r.drawImage(s, 0, 0), t;
}
function fr(s, e, t) {
  return new Promise(async (r) => {
    t && await new Promise((i) => setTimeout(i, 100)), s.onload = () => {
      r();
    }, s.src = `data:image/svg+xml;charset=utf8,${encodeURIComponent(e)}`, s.crossOrigin = "anonymous";
  });
}
class oe {
  constructor(e) {
    this._activeTextures = {}, this._renderer = e, this._createCanvas = e.type === ee.WEBGPU;
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
    const a = this._buildTexturePromise(e, t, r).then((n) => (this._activeTextures[i].texture = n, n));
    return this._activeTextures[i] = {
      texture: null,
      promise: a,
      usageCount: 1
    }, a;
  }
  async _buildTexturePromise(e, t, r) {
    const i = _.get(Xe), a = ur(e, r), n = await hr(
      a,
      r,
      ae.defaultTextStyle
    ), o = Wt(e, r, n, i), d = Math.ceil(Math.ceil(Math.max(1, o.width) + r.padding * 2) * t), h = Math.ceil(Math.ceil(Math.max(1, o.height) + r.padding * 2) * t), u = i.image, l = 2;
    u.width = (d | 0) + l, u.height = (h | 0) + l;
    const c = cr(e, r, t, n, i);
    await fr(u, c, or() && a.length > 0);
    const f = u;
    let m;
    this._createCanvas && (m = pr(u, t));
    const g = at(
      m ? m.canvas : f,
      u.width - l,
      u.height - l,
      t
    );
    return this._createCanvas && (this._renderer.texture.initSource(g.source), z.returnCanvasAndContext(m)), _.return(i), g;
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
oe.extension = {
  type: [
    p.WebGLSystem,
    p.WebGPUSystem,
    p.CanvasSystem
  ],
  name: "htmlText"
};
oe.defaultFontOptions = {
  fontFamily: "Arial",
  fontStyle: "normal",
  fontWeight: "normal"
};
class nt {
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
    const a = e._style.padding;
    q(i.bounds, e._anchor, i.texture, a);
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
      batchableSprite: _.get(Ge)
    };
    return t.batchableSprite.renderable = e, t.batchableSprite.transform = e.groupTransform, t.batchableSprite.bounds = { minX: 0, maxX: 1, minY: 0, maxY: 0 }, t.batchableSprite.roundPixels = this._renderer._roundPixels | e._roundPixels, this._gpuText[e.uid] = t, e._resolution = e._autoResolution ? this._renderer.resolution : e.resolution, this._updateText(e), e.on("destroyed", this._destroyRenderableBound), t;
  }
  destroy() {
    for (const e in this._gpuText)
      this._destroyRenderableById(e);
    this._gpuText = null, this._renderer = null;
  }
}
nt.extension = {
  type: [
    p.WebGLPipes,
    p.WebGPUPipes,
    p.CanvasPipes
  ],
  name: "text"
};
function Ce(s, e, t) {
  for (let r = 0, i = 4 * t * e; r < e; ++r, i += 4)
    if (s[i + 3] !== 0)
      return !1;
  return !0;
}
function Be(s, e, t, r, i) {
  const a = 4 * e;
  for (let n = r, o = r * a + 4 * t; n <= i; ++n, o += a)
    if (s[o + 3] !== 0)
      return !1;
  return !0;
}
function gr(s, e = 1) {
  const { width: t, height: r } = s, i = s.getContext("2d", {
    willReadFrequently: !0
  });
  if (i === null)
    throw new TypeError("Failed to get canvas 2D context");
  const a = i.getImageData(0, 0, t, r).data;
  let n = 0, o = 0, d = t - 1, h = r - 1;
  for (; o < r && Ce(a, t, o); )
    ++o;
  if (o === r)
    return pe.EMPTY;
  for (; Ce(a, t, h); )
    --h;
  for (; Be(a, t, n, o, h); )
    ++n;
  for (; Be(a, t, d, o, h); )
    --d;
  return ++d, ++h, new pe(n / e, o / e, (d - n) / e, (h - o) / e);
}
class ot {
  constructor(e) {
    this._activeTextures = {}, this._renderer = e;
  }
  getTextureSize(e, t, r) {
    const i = k.measureText(e || " ", r);
    let a = Math.ceil(Math.ceil(Math.max(1, i.width) + r.padding * 2) * t), n = Math.ceil(Math.ceil(Math.max(1, i.height) + r.padding * 2) * t);
    return a = Math.ceil(a - 1e-6), n = Math.ceil(n - 1e-6), a = fe(a), n = fe(n), { width: a, height: n };
  }
  getTexture(e, t, r, i) {
    typeof e == "string" && (te("8.0.0", "CanvasTextSystem.getTexture: Use object TextOptions instead of separate arguments"), e = {
      text: e,
      style: r,
      resolution: t
    }), e.style instanceof J || (e.style = new J(e.style));
    const { texture: a, canvasAndContext: n } = this.createTextureAndCanvas(
      e
    );
    return this._renderer.texture.initSource(a._source), z.returnCanvasAndContext(n), a;
  }
  createTextureAndCanvas(e) {
    const { text: t, style: r } = e, i = e.resolution ?? this._renderer.resolution, a = k.measureText(t || " ", r), n = Math.ceil(Math.ceil(Math.max(1, a.width) + r.padding * 2) * i), o = Math.ceil(Math.ceil(Math.max(1, a.height) + r.padding * 2) * i), d = z.getOptimalCanvasAndContext(n, o), { canvas: h } = d;
    this.renderTextToCanvas(t, r, i, d);
    const u = at(h, n, o, i);
    if (r.trim) {
      const l = gr(h, i);
      u.frame.copyFrom(l), u.updateUvs();
    }
    return { texture: u, canvasAndContext: d };
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
      z.returnCanvasAndContext(t.canvasAndContext), w.returnTexture(t.texture);
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
    var a, n, o, d;
    const { canvas: h, context: u } = i, l = bt(t), c = k.measureText(e || " ", t), f = c.lines, m = c.lineHeight, g = c.lineWidths, x = c.maxLineWidth, b = c.fontProperties, R = h.height;
    if (u.resetTransform(), u.scale(r, r), u.textBaseline = t.textBaseline, (a = t._stroke) != null && a.width) {
      const S = t._stroke;
      u.lineWidth = S.width, u.miterLimit = S.miterLimit, u.lineJoin = S.join, u.lineCap = S.cap;
    }
    u.font = l;
    let y, M;
    const H = t.dropShadow ? 2 : 1;
    for (let S = 0; S < H; ++S) {
      const A = t.dropShadow && S === 0, I = A ? Math.ceil(Math.max(1, R) + t.padding * 2) : 0, dt = I * r;
      if (A) {
        u.fillStyle = "black", u.strokeStyle = "black";
        const T = t.dropShadow, ut = T.color, lt = T.alpha;
        u.shadowColor = P.shared.setValue(ut).setAlpha(lt).toRgbaString();
        const ht = T.blur * r, le = T.distance * r;
        u.shadowBlur = ht, u.shadowOffsetX = Math.cos(T.angle) * le, u.shadowOffsetY = Math.sin(T.angle) * le + dt;
      } else
        u.fillStyle = t._fill ? ce(t._fill, u) : null, (n = t._stroke) != null && n.width && (u.strokeStyle = ce(t._stroke, u)), u.shadowColor = "black";
      let de = (m - b.fontSize) / 2;
      m - b.fontSize < 0 && (de = 0);
      const ue = ((o = t._stroke) == null ? void 0 : o.width) ?? 0;
      for (let T = 0; T < f.length; T++)
        y = ue / 2, M = ue / 2 + T * m + b.ascent + de, t.align === "right" ? y += x - g[T] : t.align === "center" && (y += (x - g[T]) / 2), (d = t._stroke) != null && d.width && this._drawLetterSpacing(
          f[T],
          t,
          i,
          y + t.padding,
          M + t.padding - I,
          !0
        ), t._fill !== void 0 && this._drawLetterSpacing(
          f[T],
          t,
          i,
          y + t.padding,
          M + t.padding - I
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
  _drawLetterSpacing(e, t, r, i, a, n = !1) {
    const { context: o } = r, d = t.letterSpacing;
    let h = !1;
    if (k.experimentalLetterSpacingSupported && (k.experimentalLetterSpacing ? (o.letterSpacing = `${d}px`, o.textLetterSpacing = `${d}px`, h = !0) : (o.letterSpacing = "0px", o.textLetterSpacing = "0px")), d === 0 || h) {
      n ? o.strokeText(e, i, a) : o.fillText(e, i, a);
      return;
    }
    let u = i;
    const l = k.graphemeSegmenter(e);
    let c = o.measureText(e).width, f = 0;
    for (let m = 0; m < l.length; ++m) {
      const g = l[m];
      n ? o.strokeText(g, u, a) : o.fillText(g, u, a);
      let x = "";
      for (let b = m + 1; b < l.length; ++b)
        x += l[b];
      f = o.measureText(x).width, u += c - f + d, c = f;
    }
  }
  destroy() {
    this._activeTextures = null;
  }
}
ot.extension = {
  type: [
    p.WebGLSystem,
    p.WebGPUSystem,
    p.CanvasSystem
  ],
  name: "canvasText"
};
v.add(ze);
v.add(De);
v.add(Ye);
v.add(ct);
v.add(Ne);
v.add(Je);
v.add(Qe);
v.add(ot);
v.add(nt);
v.add(it);
v.add(oe);
v.add(st);
v.add(rt);
v.add(tt);
v.add(Ve);
v.add(We);
