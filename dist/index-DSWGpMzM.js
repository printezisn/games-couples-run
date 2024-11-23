var Vu = Object.defineProperty;
var Hu = (i, t, e) => t in i ? Vu(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var $ = (i, t, e) => Hu(i, typeof t != "symbol" ? t + "" : t, e);
var ju = Object.defineProperty, Nu = (i, t, e) => t in i ? ju(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e, $t = (i, t, e) => Nu(i, typeof t != "symbol" ? t + "" : t, e);
const L = {
  gameName: "",
  gameContainer: document.body,
  maxFPS: 60,
  debug: !1,
  assets: {
    basePath: "/assets",
    manifest: {},
    extra: []
  },
  colors: {
    backgroundColor: "#000000"
  },
  screen: {
    width: 1280,
    aspectRatio: 1.7777777777777777
  },
  tickIntervalMillis: 16,
  loadingScene: {
    fontFamily: "Arial, sans-serif",
    fontSize: 28,
    textColor: 16777215,
    keepAliveTimeMS: 2e3,
    text: "Loading..."
  },
  pauseScene: {
    overlayColor: 0,
    overlayAlpha: 0.8,
    fontFamily: "Arial, sans-serif",
    titleFontSize: 48,
    subTitleFontSize: 28,
    textColor: 16777215,
    title: "Paused",
    subTitle: "Click/tap to continue"
  },
  signals: {
    onResize: "onResize",
    onOrientationChange: "onOrientationChange",
    onTick: "onTick",
    destroyLoadingScene: "destroyLoadingScene"
  },
  sounds: {
    click: "click"
  }
}, V = {
  screen: {
    orientation: "landscape",
    width: 0,
    height: 0
  },
  scene: null,
  muted: localStorage.getItem("muted") === "true"
};
var D = /* @__PURE__ */ ((i) => (i.Application = "application", i.WebGLPipes = "webgl-pipes", i.WebGLPipesAdaptor = "webgl-pipes-adaptor", i.WebGLSystem = "webgl-system", i.WebGPUPipes = "webgpu-pipes", i.WebGPUPipesAdaptor = "webgpu-pipes-adaptor", i.WebGPUSystem = "webgpu-system", i.CanvasSystem = "canvas-system", i.CanvasPipesAdaptor = "canvas-pipes-adaptor", i.CanvasPipes = "canvas-pipes", i.Asset = "asset", i.LoadParser = "load-parser", i.ResolveParser = "resolve-parser", i.CacheParser = "cache-parser", i.DetectionParser = "detection-parser", i.MaskEffect = "mask-effect", i.BlendMode = "blend-mode", i.TextureSource = "texture-source", i.Environment = "environment", i.ShapeBuilder = "shape-builder", i.Batcher = "batcher", i))(D || {});
const Ls = (i) => {
  if (typeof i == "function" || typeof i == "object" && i.extension) {
    if (!i.extension)
      throw new Error("Extension class must have an extension object");
    i = { ...typeof i.extension != "object" ? { type: i.extension } : i.extension, ref: i };
  }
  if (typeof i == "object")
    i = { ...i };
  else
    throw new Error("Invalid extension type");
  return typeof i.type == "string" && (i.type = [i.type]), i;
}, Vr = (i, t) => Ls(i).priority ?? t, Mt = {
  /** @ignore */
  _addHandlers: {},
  /** @ignore */
  _removeHandlers: {},
  /** @ignore */
  _queue: {},
  /**
   * Remove extensions from PixiJS.
   * @param extensions - Extensions to be removed.
   * @returns {extensions} For chaining.
   */
  remove(...i) {
    return i.map(Ls).forEach((t) => {
      t.type.forEach((e) => {
        var r, s;
        return (s = (r = this._removeHandlers)[e]) == null ? void 0 : s.call(r, t);
      });
    }), this;
  },
  /**
   * Register new extensions with PixiJS.
   * @param extensions - The spread of extensions to add to PixiJS.
   * @returns {extensions} For chaining.
   */
  add(...i) {
    return i.map(Ls).forEach((t) => {
      t.type.forEach((e) => {
        var r, s;
        const n = this._addHandlers, o = this._queue;
        n[e] ? (s = n[e]) == null || s.call(n, t) : (o[e] = o[e] || [], (r = o[e]) == null || r.push(t));
      });
    }), this;
  },
  /**
   * Internal method to handle extensions by name.
   * @param type - The extension type.
   * @param onAdd  - Function handler when extensions are added/registered {@link StrictExtensionFormat}.
   * @param onRemove  - Function handler when extensions are removed/unregistered {@link StrictExtensionFormat}.
   * @returns {extensions} For chaining.
   */
  handle(i, t, e) {
    var r;
    const s = this._addHandlers, n = this._removeHandlers;
    if (s[i] || n[i])
      throw new Error(`Extension type ${i} already has a handler`);
    s[i] = t, n[i] = e;
    const o = this._queue;
    return o[i] && ((r = o[i]) == null || r.forEach((a) => t(a)), delete o[i]), this;
  },
  /**
   * Handle a type, but using a map by `name` property.
   * @param type - Type of extension to handle.
   * @param map - The object map of named extensions.
   * @returns {extensions} For chaining.
   */
  handleByMap(i, t) {
    return this.handle(
      i,
      (e) => {
        e.name && (t[e.name] = e.ref);
      },
      (e) => {
        e.name && delete t[e.name];
      }
    );
  },
  /**
   * Handle a type, but using a list of extensions with a `name` property.
   * @param type - Type of extension to handle.
   * @param map - The array of named extensions.
   * @param defaultPriority - Fallback priority if none is defined.
   * @returns {extensions} For chaining.
   */
  handleByNamedList(i, t, e = -1) {
    return this.handle(
      i,
      (r) => {
        t.findIndex((s) => s.name === r.name) >= 0 || (t.push({ name: r.name, value: r.ref }), t.sort((s, n) => Vr(n.value, e) - Vr(s.value, e)));
      },
      (r) => {
        const s = t.findIndex((n) => n.name === r.name);
        s !== -1 && t.splice(s, 1);
      }
    );
  },
  /**
   * Handle a type, but using a list of extensions.
   * @param type - Type of extension to handle.
   * @param list - The list of extensions.
   * @param defaultPriority - The default priority to use if none is specified.
   * @returns {extensions} For chaining.
   */
  handleByList(i, t, e = -1) {
    return this.handle(
      i,
      (r) => {
        t.includes(r.ref) || (t.push(r.ref), t.sort((s, n) => Vr(n, e) - Vr(s, e)));
      },
      (r) => {
        const s = t.indexOf(r.ref);
        s !== -1 && t.splice(s, 1);
      }
    );
  }
}, Wu = {
  extension: {
    type: D.Environment,
    name: "browser",
    priority: -1
  },
  test: () => !0,
  load: async () => {
    await import("./browserAll-CG6BSre2-WnaO-BT3.js");
  }
}, Yu = {
  extension: {
    type: D.Environment,
    name: "webworker",
    priority: 0
  },
  test: () => typeof self < "u" && self.WorkerGlobalScope !== void 0,
  load: async () => {
    await import("./webworkerAll-Bo9rMnfB-Da5qfCsE.js");
  }
};
class xt {
  /**
   * Creates a new `ObservablePoint`
   * @param observer - Observer to pass to listen for change events.
   * @param {number} [x=0] - position of the point on the x axis
   * @param {number} [y=0] - position of the point on the y axis
   */
  constructor(t, e, r) {
    this._x = e || 0, this._y = r || 0, this._observer = t;
  }
  /**
   * Creates a clone of this point.
   * @param observer - Optional observer to pass to the new observable point.
   * @returns a copy of this observable point
   */
  clone(t) {
    return new xt(t ?? this._observer, this._x, this._y);
  }
  /**
   * Sets the point to a new `x` and `y` position.
   * If `y` is omitted, both `x` and `y` will be set to `x`.
   * @param {number} [x=0] - position of the point on the x axis
   * @param {number} [y=x] - position of the point on the y axis
   * @returns The observable point instance itself
   */
  set(t = 0, e = t) {
    return (this._x !== t || this._y !== e) && (this._x = t, this._y = e, this._observer._onUpdate(this)), this;
  }
  /**
   * Copies x and y from the given point (`p`)
   * @param p - The point to copy from. Can be any of type that is or extends `PointData`
   * @returns The observable point instance itself
   */
  copyFrom(t) {
    return (this._x !== t.x || this._y !== t.y) && (this._x = t.x, this._y = t.y, this._observer._onUpdate(this)), this;
  }
  /**
   * Copies this point's x and y into that of the given point (`p`)
   * @param p - The point to copy to. Can be any of type that is or extends `PointData`
   * @returns The point (`p`) with values updated
   */
  copyTo(t) {
    return t.set(this._x, this._y), t;
  }
  /**
   * Accepts another point (`p`) and returns `true` if the given point is equal to this point
   * @param p - The point to check
   * @returns Returns `true` if both `x` and `y` are equal
   */
  equals(t) {
    return t.x === this._x && t.y === this._y;
  }
  toString() {
    return `[pixi.js/math:ObservablePoint x=0 y=0 scope=${this._observer}]`;
  }
  /** Position of the observable point on the x axis. */
  get x() {
    return this._x;
  }
  set x(t) {
    this._x !== t && (this._x = t, this._observer._onUpdate(this));
  }
  /** Position of the observable point on the y axis. */
  get y() {
    return this._y;
  }
  set y(t) {
    this._y !== t && (this._y = t, this._observer._onUpdate(this));
  }
}
var ii = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Co(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
var Qh = { exports: {} };
(function(i) {
  var t = Object.prototype.hasOwnProperty, e = "~";
  function r() {
  }
  Object.create && (r.prototype = /* @__PURE__ */ Object.create(null), new r().__proto__ || (e = !1));
  function s(h, c, l) {
    this.fn = h, this.context = c, this.once = l || !1;
  }
  function n(h, c, l, f, p) {
    if (typeof l != "function")
      throw new TypeError("The listener must be a function");
    var u = new s(l, f || h, p), d = e ? e + c : c;
    return h._events[d] ? h._events[d].fn ? h._events[d] = [h._events[d], u] : h._events[d].push(u) : (h._events[d] = u, h._eventsCount++), h;
  }
  function o(h, c) {
    --h._eventsCount === 0 ? h._events = new r() : delete h._events[c];
  }
  function a() {
    this._events = new r(), this._eventsCount = 0;
  }
  a.prototype.eventNames = function() {
    var h = [], c, l;
    if (this._eventsCount === 0) return h;
    for (l in c = this._events)
      t.call(c, l) && h.push(e ? l.slice(1) : l);
    return Object.getOwnPropertySymbols ? h.concat(Object.getOwnPropertySymbols(c)) : h;
  }, a.prototype.listeners = function(h) {
    var c = e ? e + h : h, l = this._events[c];
    if (!l) return [];
    if (l.fn) return [l.fn];
    for (var f = 0, p = l.length, u = new Array(p); f < p; f++)
      u[f] = l[f].fn;
    return u;
  }, a.prototype.listenerCount = function(h) {
    var c = e ? e + h : h, l = this._events[c];
    return l ? l.fn ? 1 : l.length : 0;
  }, a.prototype.emit = function(h, c, l, f, p, u) {
    var d = e ? e + h : h;
    if (!this._events[d]) return !1;
    var m = this._events[d], g = arguments.length, y, v;
    if (m.fn) {
      switch (m.once && this.removeListener(h, m.fn, void 0, !0), g) {
        case 1:
          return m.fn.call(m.context), !0;
        case 2:
          return m.fn.call(m.context, c), !0;
        case 3:
          return m.fn.call(m.context, c, l), !0;
        case 4:
          return m.fn.call(m.context, c, l, f), !0;
        case 5:
          return m.fn.call(m.context, c, l, f, p), !0;
        case 6:
          return m.fn.call(m.context, c, l, f, p, u), !0;
      }
      for (v = 1, y = new Array(g - 1); v < g; v++)
        y[v - 1] = arguments[v];
      m.fn.apply(m.context, y);
    } else {
      var _ = m.length, w;
      for (v = 0; v < _; v++)
        switch (m[v].once && this.removeListener(h, m[v].fn, void 0, !0), g) {
          case 1:
            m[v].fn.call(m[v].context);
            break;
          case 2:
            m[v].fn.call(m[v].context, c);
            break;
          case 3:
            m[v].fn.call(m[v].context, c, l);
            break;
          case 4:
            m[v].fn.call(m[v].context, c, l, f);
            break;
          default:
            if (!y) for (w = 1, y = new Array(g - 1); w < g; w++)
              y[w - 1] = arguments[w];
            m[v].fn.apply(m[v].context, y);
        }
    }
    return !0;
  }, a.prototype.on = function(h, c, l) {
    return n(this, h, c, l, !1);
  }, a.prototype.once = function(h, c, l) {
    return n(this, h, c, l, !0);
  }, a.prototype.removeListener = function(h, c, l, f) {
    var p = e ? e + h : h;
    if (!this._events[p]) return this;
    if (!c)
      return o(this, p), this;
    var u = this._events[p];
    if (u.fn)
      u.fn === c && (!f || u.once) && (!l || u.context === l) && o(this, p);
    else {
      for (var d = 0, m = [], g = u.length; d < g; d++)
        (u[d].fn !== c || f && !u[d].once || l && u[d].context !== l) && m.push(u[d]);
      m.length ? this._events[p] = m.length === 1 ? m[0] : m : o(this, p);
    }
    return this;
  }, a.prototype.removeAllListeners = function(h) {
    var c;
    return h ? (c = e ? e + h : h, this._events[c] && o(this, c)) : (this._events = new r(), this._eventsCount = 0), this;
  }, a.prototype.off = a.prototype.removeListener, a.prototype.addListener = a.prototype.on, a.prefixed = e, a.EventEmitter = a, i.exports = a;
})(Qh);
var Xu = Qh.exports;
const Bt = /* @__PURE__ */ Co(Xu), qu = Math.PI * 2, Ku = 180 / Math.PI, Qu = Math.PI / 180;
class kt {
  /**
   * Creates a new `Point`
   * @param {number} [x=0] - position of the point on the x axis
   * @param {number} [y=0] - position of the point on the y axis
   */
  constructor(t = 0, e = 0) {
    this.x = 0, this.y = 0, this.x = t, this.y = e;
  }
  /**
   * Creates a clone of this point
   * @returns A clone of this point
   */
  clone() {
    return new kt(this.x, this.y);
  }
  /**
   * Copies `x` and `y` from the given point into this point
   * @param p - The point to copy from
   * @returns The point instance itself
   */
  copyFrom(t) {
    return this.set(t.x, t.y), this;
  }
  /**
   * Copies this point's x and y into the given point (`p`).
   * @param p - The point to copy to. Can be any of type that is or extends `PointData`
   * @returns The point (`p`) with values updated
   */
  copyTo(t) {
    return t.set(this.x, this.y), t;
  }
  /**
   * Accepts another point (`p`) and returns `true` if the given point is equal to this point
   * @param p - The point to check
   * @returns Returns `true` if both `x` and `y` are equal
   */
  equals(t) {
    return t.x === this.x && t.y === this.y;
  }
  /**
   * Sets the point to a new `x` and `y` position.
   * If `y` is omitted, both `x` and `y` will be set to `x`.
   * @param {number} [x=0] - position of the point on the `x` axis
   * @param {number} [y=x] - position of the point on the `y` axis
   * @returns The point instance itself
   */
  set(t = 0, e = t) {
    return this.x = t, this.y = e, this;
  }
  toString() {
    return `[pixi.js/math:Point x=${this.x} y=${this.y}]`;
  }
  /**
   * A static Point object with `x` and `y` values of `0`. Can be used to avoid creating new objects multiple times.
   * @readonly
   */
  static get shared() {
    return Kn.x = 0, Kn.y = 0, Kn;
  }
}
const Kn = new kt();
class K {
  /**
   * @param a - x scale
   * @param b - y skew
   * @param c - x skew
   * @param d - y scale
   * @param tx - x translation
   * @param ty - y translation
   */
  constructor(t = 1, e = 0, r = 0, s = 1, n = 0, o = 0) {
    this.array = null, this.a = t, this.b = e, this.c = r, this.d = s, this.tx = n, this.ty = o;
  }
  /**
   * Creates a Matrix object based on the given array. The Element to Matrix mapping order is as follows:
   *
   * a = array[0]
   * b = array[1]
   * c = array[3]
   * d = array[4]
   * tx = array[2]
   * ty = array[5]
   * @param array - The array that the matrix will be populated from.
   */
  fromArray(t) {
    this.a = t[0], this.b = t[1], this.c = t[3], this.d = t[4], this.tx = t[2], this.ty = t[5];
  }
  /**
   * Sets the matrix properties.
   * @param a - Matrix component
   * @param b - Matrix component
   * @param c - Matrix component
   * @param d - Matrix component
   * @param tx - Matrix component
   * @param ty - Matrix component
   * @returns This matrix. Good for chaining method calls.
   */
  set(t, e, r, s, n, o) {
    return this.a = t, this.b = e, this.c = r, this.d = s, this.tx = n, this.ty = o, this;
  }
  /**
   * Creates an array from the current Matrix object.
   * @param transpose - Whether we need to transpose the matrix or not
   * @param [out=new Float32Array(9)] - If provided the array will be assigned to out
   * @returns The newly created array which contains the matrix
   */
  toArray(t, e) {
    this.array || (this.array = new Float32Array(9));
    const r = e || this.array;
    return t ? (r[0] = this.a, r[1] = this.b, r[2] = 0, r[3] = this.c, r[4] = this.d, r[5] = 0, r[6] = this.tx, r[7] = this.ty, r[8] = 1) : (r[0] = this.a, r[1] = this.c, r[2] = this.tx, r[3] = this.b, r[4] = this.d, r[5] = this.ty, r[6] = 0, r[7] = 0, r[8] = 1), r;
  }
  /**
   * Get a new position with the current transformation applied.
   * Can be used to go from a child's coordinate space to the world coordinate space. (e.g. rendering)
   * @param pos - The origin
   * @param {Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
   * @returns {Point} The new point, transformed through this matrix
   */
  apply(t, e) {
    e = e || new kt();
    const r = t.x, s = t.y;
    return e.x = this.a * r + this.c * s + this.tx, e.y = this.b * r + this.d * s + this.ty, e;
  }
  /**
   * Get a new position with the inverse of the current transformation applied.
   * Can be used to go from the world coordinate space to a child's coordinate space. (e.g. input)
   * @param pos - The origin
   * @param {Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
   * @returns {Point} The new point, inverse-transformed through this matrix
   */
  applyInverse(t, e) {
    e = e || new kt();
    const r = this.a, s = this.b, n = this.c, o = this.d, a = this.tx, h = this.ty, c = 1 / (r * o + n * -s), l = t.x, f = t.y;
    return e.x = o * c * l + -n * c * f + (h * n - a * o) * c, e.y = r * c * f + -s * c * l + (-h * r + a * s) * c, e;
  }
  /**
   * Translates the matrix on the x and y.
   * @param x - How much to translate x by
   * @param y - How much to translate y by
   * @returns This matrix. Good for chaining method calls.
   */
  translate(t, e) {
    return this.tx += t, this.ty += e, this;
  }
  /**
   * Applies a scale transformation to the matrix.
   * @param x - The amount to scale horizontally
   * @param y - The amount to scale vertically
   * @returns This matrix. Good for chaining method calls.
   */
  scale(t, e) {
    return this.a *= t, this.d *= e, this.c *= t, this.b *= e, this.tx *= t, this.ty *= e, this;
  }
  /**
   * Applies a rotation transformation to the matrix.
   * @param angle - The angle in radians.
   * @returns This matrix. Good for chaining method calls.
   */
  rotate(t) {
    const e = Math.cos(t), r = Math.sin(t), s = this.a, n = this.c, o = this.tx;
    return this.a = s * e - this.b * r, this.b = s * r + this.b * e, this.c = n * e - this.d * r, this.d = n * r + this.d * e, this.tx = o * e - this.ty * r, this.ty = o * r + this.ty * e, this;
  }
  /**
   * Appends the given Matrix to this Matrix.
   * @param matrix - The matrix to append.
   * @returns This matrix. Good for chaining method calls.
   */
  append(t) {
    const e = this.a, r = this.b, s = this.c, n = this.d;
    return this.a = t.a * e + t.b * s, this.b = t.a * r + t.b * n, this.c = t.c * e + t.d * s, this.d = t.c * r + t.d * n, this.tx = t.tx * e + t.ty * s + this.tx, this.ty = t.tx * r + t.ty * n + this.ty, this;
  }
  /**
   * Appends two matrix's and sets the result to this matrix. AB = A * B
   * @param a - The matrix to append.
   * @param b - The matrix to append.
   * @returns This matrix. Good for chaining method calls.
   */
  appendFrom(t, e) {
    const r = t.a, s = t.b, n = t.c, o = t.d, a = t.tx, h = t.ty, c = e.a, l = e.b, f = e.c, p = e.d;
    return this.a = r * c + s * f, this.b = r * l + s * p, this.c = n * c + o * f, this.d = n * l + o * p, this.tx = a * c + h * f + e.tx, this.ty = a * l + h * p + e.ty, this;
  }
  /**
   * Sets the matrix based on all the available properties
   * @param x - Position on the x axis
   * @param y - Position on the y axis
   * @param pivotX - Pivot on the x axis
   * @param pivotY - Pivot on the y axis
   * @param scaleX - Scale on the x axis
   * @param scaleY - Scale on the y axis
   * @param rotation - Rotation in radians
   * @param skewX - Skew on the x axis
   * @param skewY - Skew on the y axis
   * @returns This matrix. Good for chaining method calls.
   */
  setTransform(t, e, r, s, n, o, a, h, c) {
    return this.a = Math.cos(a + c) * n, this.b = Math.sin(a + c) * n, this.c = -Math.sin(a - h) * o, this.d = Math.cos(a - h) * o, this.tx = t - (r * this.a + s * this.c), this.ty = e - (r * this.b + s * this.d), this;
  }
  /**
   * Prepends the given Matrix to this Matrix.
   * @param matrix - The matrix to prepend
   * @returns This matrix. Good for chaining method calls.
   */
  prepend(t) {
    const e = this.tx;
    if (t.a !== 1 || t.b !== 0 || t.c !== 0 || t.d !== 1) {
      const r = this.a, s = this.c;
      this.a = r * t.a + this.b * t.c, this.b = r * t.b + this.b * t.d, this.c = s * t.a + this.d * t.c, this.d = s * t.b + this.d * t.d;
    }
    return this.tx = e * t.a + this.ty * t.c + t.tx, this.ty = e * t.b + this.ty * t.d + t.ty, this;
  }
  /**
   * Decomposes the matrix (x, y, scaleX, scaleY, and rotation) and sets the properties on to a transform.
   * @param transform - The transform to apply the properties to.
   * @returns The transform with the newly applied properties
   */
  decompose(t) {
    const e = this.a, r = this.b, s = this.c, n = this.d, o = t.pivot, a = -Math.atan2(-s, n), h = Math.atan2(r, e), c = Math.abs(a + h);
    return c < 1e-5 || Math.abs(qu - c) < 1e-5 ? (t.rotation = h, t.skew.x = t.skew.y = 0) : (t.rotation = 0, t.skew.x = a, t.skew.y = h), t.scale.x = Math.sqrt(e * e + r * r), t.scale.y = Math.sqrt(s * s + n * n), t.position.x = this.tx + (o.x * e + o.y * s), t.position.y = this.ty + (o.x * r + o.y * n), t;
  }
  /**
   * Inverts this matrix
   * @returns This matrix. Good for chaining method calls.
   */
  invert() {
    const t = this.a, e = this.b, r = this.c, s = this.d, n = this.tx, o = t * s - e * r;
    return this.a = s / o, this.b = -e / o, this.c = -r / o, this.d = t / o, this.tx = (r * this.ty - s * n) / o, this.ty = -(t * this.ty - e * n) / o, this;
  }
  /** Checks if this matrix is an identity matrix */
  isIdentity() {
    return this.a === 1 && this.b === 0 && this.c === 0 && this.d === 1 && this.tx === 0 && this.ty === 0;
  }
  /**
   * Resets this Matrix to an identity (default) matrix.
   * @returns This matrix. Good for chaining method calls.
   */
  identity() {
    return this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.tx = 0, this.ty = 0, this;
  }
  /**
   * Creates a new Matrix object with the same values as this one.
   * @returns A copy of this matrix. Good for chaining method calls.
   */
  clone() {
    const t = new K();
    return t.a = this.a, t.b = this.b, t.c = this.c, t.d = this.d, t.tx = this.tx, t.ty = this.ty, t;
  }
  /**
   * Changes the values of the given matrix to be the same as the ones in this matrix
   * @param matrix - The matrix to copy to.
   * @returns The matrix given in parameter with its values updated.
   */
  copyTo(t) {
    return t.a = this.a, t.b = this.b, t.c = this.c, t.d = this.d, t.tx = this.tx, t.ty = this.ty, t;
  }
  /**
   * Changes the values of the matrix to be the same as the ones in given matrix
   * @param matrix - The matrix to copy from.
   * @returns this
   */
  copyFrom(t) {
    return this.a = t.a, this.b = t.b, this.c = t.c, this.d = t.d, this.tx = t.tx, this.ty = t.ty, this;
  }
  /**
   * check to see if two matrices are the same
   * @param matrix - The matrix to compare to.
   */
  equals(t) {
    return t.a === this.a && t.b === this.b && t.c === this.c && t.d === this.d && t.tx === this.tx && t.ty === this.ty;
  }
  toString() {
    return `[pixi.js:Matrix a=${this.a} b=${this.b} c=${this.c} d=${this.d} tx=${this.tx} ty=${this.ty}]`;
  }
  /**
   * A default (identity) matrix.
   *
   * This is a shared object, if you want to modify it consider creating a new `Matrix`
   * @readonly
   */
  static get IDENTITY() {
    return Zu.identity();
  }
  /**
   * A static Matrix that can be used to avoid creating new objects.
   * Will always ensure the matrix is reset to identity when requested.
   * Use this object for fast but temporary calculations, as it may be mutated later on.
   * This is a different object to the `IDENTITY` object and so can be modified without changing `IDENTITY`.
   * @readonly
   */
  static get shared() {
    return Ju.identity();
  }
}
const Ju = new K(), Zu = new K(), Je = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1], Ze = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1], $e = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1], ti = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1], zs = [], Jh = [], Hr = Math.sign;
function $u() {
  for (let i = 0; i < 16; i++) {
    const t = [];
    zs.push(t);
    for (let e = 0; e < 16; e++) {
      const r = Hr(Je[i] * Je[e] + $e[i] * Ze[e]), s = Hr(Ze[i] * Je[e] + ti[i] * Ze[e]), n = Hr(Je[i] * $e[e] + $e[i] * ti[e]), o = Hr(Ze[i] * $e[e] + ti[i] * ti[e]);
      for (let a = 0; a < 16; a++)
        if (Je[a] === r && Ze[a] === s && $e[a] === n && ti[a] === o) {
          t.push(a);
          break;
        }
    }
  }
  for (let i = 0; i < 16; i++) {
    const t = new K();
    t.set(Je[i], Ze[i], $e[i], ti[i], 0, 0), Jh.push(t);
  }
}
$u();
const it = {
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 0°       | East      |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  E: 0,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 45°↻     | Southeast |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  SE: 1,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 90°↻     | South     |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  S: 2,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 135°↻    | Southwest |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  SW: 3,
  /**
   * | Rotation | Direction |
   * |----------|-----------|
   * | 180°     | West      |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  W: 4,
  /**
   * | Rotation    | Direction    |
   * |-------------|--------------|
   * | -135°/225°↻ | Northwest    |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  NW: 5,
  /**
   * | Rotation    | Direction    |
   * |-------------|--------------|
   * | -90°/270°↻  | North        |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  N: 6,
  /**
   * | Rotation    | Direction    |
   * |-------------|--------------|
   * | -45°/315°↻  | Northeast    |
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  NE: 7,
  /**
   * Reflection about Y-axis.
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  MIRROR_VERTICAL: 8,
  /**
   * Reflection about the main diagonal.
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  MAIN_DIAGONAL: 10,
  /**
   * Reflection about X-axis.
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  MIRROR_HORIZONTAL: 12,
  /**
   * Reflection about reverse diagonal.
   * @memberof maths.groupD8
   * @constant {GD8Symmetry}
   */
  REVERSE_DIAGONAL: 14,
  /**
   * @memberof maths.groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The X-component of the U-axis
   *    after rotating the axes.
   */
  uX: (i) => Je[i],
  /**
   * @memberof maths.groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The Y-component of the U-axis
   *    after rotating the axes.
   */
  uY: (i) => Ze[i],
  /**
   * @memberof maths.groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The X-component of the V-axis
   *    after rotating the axes.
   */
  vX: (i) => $e[i],
  /**
   * @memberof maths.groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The Y-component of the V-axis
   *    after rotating the axes.
   */
  vY: (i) => ti[i],
  /**
   * @memberof maths.groupD8
   * @param {GD8Symmetry} rotation - symmetry whose opposite
   *   is needed. Only rotations have opposite symmetries while
   *   reflections don't.
   * @returns {GD8Symmetry} The opposite symmetry of `rotation`
   */
  inv: (i) => i & 8 ? i & 15 : -i & 7,
  /**
   * Composes the two D8 operations.
   *
   * Taking `^` as reflection:
   *
   * |       | E=0 | S=2 | W=4 | N=6 | E^=8 | S^=10 | W^=12 | N^=14 |
   * |-------|-----|-----|-----|-----|------|-------|-------|-------|
   * | E=0   | E   | S   | W   | N   | E^   | S^    | W^    | N^    |
   * | S=2   | S   | W   | N   | E   | S^   | W^    | N^    | E^    |
   * | W=4   | W   | N   | E   | S   | W^   | N^    | E^    | S^    |
   * | N=6   | N   | E   | S   | W   | N^   | E^    | S^    | W^    |
   * | E^=8  | E^  | N^  | W^  | S^  | E    | N     | W     | S     |
   * | S^=10 | S^  | E^  | N^  | W^  | S    | E     | N     | W     |
   * | W^=12 | W^  | S^  | E^  | N^  | W    | S     | E     | N     |
   * | N^=14 | N^  | W^  | S^  | E^  | N    | W     | S     | E     |
   *
   * [This is a Cayley table]{@link https://en.wikipedia.org/wiki/Cayley_table}
   * @memberof maths.groupD8
   * @param {GD8Symmetry} rotationSecond - Second operation, which
   *   is the row in the above cayley table.
   * @param {GD8Symmetry} rotationFirst - First operation, which
   *   is the column in the above cayley table.
   * @returns {GD8Symmetry} Composed operation
   */
  add: (i, t) => zs[i][t],
  /**
   * Reverse of `add`.
   * @memberof maths.groupD8
   * @param {GD8Symmetry} rotationSecond - Second operation
   * @param {GD8Symmetry} rotationFirst - First operation
   * @returns {GD8Symmetry} Result
   */
  sub: (i, t) => zs[i][it.inv(t)],
  /**
   * Adds 180 degrees to rotation, which is a commutative
   * operation.
   * @memberof maths.groupD8
   * @param {number} rotation - The number to rotate.
   * @returns {number} Rotated number
   */
  rotate180: (i) => i ^ 4,
  /**
   * Checks if the rotation angle is vertical, i.e. south
   * or north. It doesn't work for reflections.
   * @memberof maths.groupD8
   * @param {GD8Symmetry} rotation - The number to check.
   * @returns {boolean} Whether or not the direction is vertical
   */
  isVertical: (i) => (i & 3) === 2,
  // rotation % 4 === 2
  /**
   * Approximates the vector `V(dx,dy)` into one of the
   * eight directions provided by `groupD8`.
   * @memberof maths.groupD8
   * @param {number} dx - X-component of the vector
   * @param {number} dy - Y-component of the vector
   * @returns {GD8Symmetry} Approximation of the vector into
   *  one of the eight symmetries.
   */
  byDirection: (i, t) => Math.abs(i) * 2 <= Math.abs(t) ? t >= 0 ? it.S : it.N : Math.abs(t) * 2 <= Math.abs(i) ? i > 0 ? it.E : it.W : t > 0 ? i > 0 ? it.SE : it.SW : i > 0 ? it.NE : it.NW,
  /**
   * Helps sprite to compensate texture packer rotation.
   * @memberof maths.groupD8
   * @param {Matrix} matrix - sprite world matrix
   * @param {GD8Symmetry} rotation - The rotation factor to use.
   * @param {number} tx - sprite anchoring
   * @param {number} ty - sprite anchoring
   */
  matrixAppendRotationInv: (i, t, e = 0, r = 0) => {
    const s = Jh[it.inv(t)];
    s.tx = e, s.ty = r, i.append(s);
  }
}, jr = [new kt(), new kt(), new kt(), new kt()];
class mt {
  /**
   * @param x - The X coordinate of the upper-left corner of the rectangle
   * @param y - The Y coordinate of the upper-left corner of the rectangle
   * @param width - The overall width of the rectangle
   * @param height - The overall height of the rectangle
   */
  constructor(t = 0, e = 0, r = 0, s = 0) {
    this.type = "rectangle", this.x = Number(t), this.y = Number(e), this.width = Number(r), this.height = Number(s);
  }
  /** Returns the left edge of the rectangle. */
  get left() {
    return this.x;
  }
  /** Returns the right edge of the rectangle. */
  get right() {
    return this.x + this.width;
  }
  /** Returns the top edge of the rectangle. */
  get top() {
    return this.y;
  }
  /** Returns the bottom edge of the rectangle. */
  get bottom() {
    return this.y + this.height;
  }
  /** Determines whether the Rectangle is empty. */
  isEmpty() {
    return this.left === this.right || this.top === this.bottom;
  }
  /** A constant empty rectangle. This is a new object every time the property is accessed */
  static get EMPTY() {
    return new mt(0, 0, 0, 0);
  }
  /**
   * Creates a clone of this Rectangle
   * @returns a copy of the rectangle
   */
  clone() {
    return new mt(this.x, this.y, this.width, this.height);
  }
  /**
   * Converts a Bounds object to a Rectangle object.
   * @param bounds - The bounds to copy and convert to a rectangle.
   * @returns Returns itself.
   */
  copyFromBounds(t) {
    return this.x = t.minX, this.y = t.minY, this.width = t.maxX - t.minX, this.height = t.maxY - t.minY, this;
  }
  /**
   * Copies another rectangle to this one.
   * @param rectangle - The rectangle to copy from.
   * @returns Returns itself.
   */
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.width = t.width, this.height = t.height, this;
  }
  /**
   * Copies this rectangle to another one.
   * @param rectangle - The rectangle to copy to.
   * @returns Returns given parameter.
   */
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this Rectangle
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coordinates are within this Rectangle
   */
  contains(t, e) {
    return this.width <= 0 || this.height <= 0 ? !1 : t >= this.x && t < this.x + this.width && e >= this.y && e < this.y + this.height;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this rectangle including the stroke.
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @param strokeWidth - The width of the line to check
   * @returns Whether the x/y coordinates are within this rectangle
   */
  strokeContains(t, e, r) {
    const { width: s, height: n } = this;
    if (s <= 0 || n <= 0)
      return !1;
    const o = this.x, a = this.y, h = o - r / 2, c = o + s + r / 2, l = a - r / 2, f = a + n + r / 2, p = o + r / 2, u = o + s - r / 2, d = a + r / 2, m = a + n - r / 2;
    return t >= h && t <= c && e >= l && e <= f && !(t > p && t < u && e > d && e < m);
  }
  /**
   * Determines whether the `other` Rectangle transformed by `transform` intersects with `this` Rectangle object.
   * Returns true only if the area of the intersection is >0, this means that Rectangles
   * sharing a side are not overlapping. Another side effect is that an arealess rectangle
   * (width or height equal to zero) can't intersect any other rectangle.
   * @param {Rectangle} other - The Rectangle to intersect with `this`.
   * @param {Matrix} transform - The transformation matrix of `other`.
   * @returns {boolean} A value of `true` if the transformed `other` Rectangle intersects with `this`; otherwise `false`.
   */
  intersects(t, e) {
    if (!e) {
      const b = this.x < t.x ? t.x : this.x;
      if ((this.right > t.right ? t.right : this.right) <= b)
        return !1;
      const C = this.y < t.y ? t.y : this.y;
      return (this.bottom > t.bottom ? t.bottom : this.bottom) > C;
    }
    const r = this.left, s = this.right, n = this.top, o = this.bottom;
    if (s <= r || o <= n)
      return !1;
    const a = jr[0].set(t.left, t.top), h = jr[1].set(t.left, t.bottom), c = jr[2].set(t.right, t.top), l = jr[3].set(t.right, t.bottom);
    if (c.x <= a.x || h.y <= a.y)
      return !1;
    const f = Math.sign(e.a * e.d - e.b * e.c);
    if (f === 0 || (e.apply(a, a), e.apply(h, h), e.apply(c, c), e.apply(l, l), Math.max(a.x, h.x, c.x, l.x) <= r || Math.min(a.x, h.x, c.x, l.x) >= s || Math.max(a.y, h.y, c.y, l.y) <= n || Math.min(a.y, h.y, c.y, l.y) >= o))
      return !1;
    const p = f * (h.y - a.y), u = f * (a.x - h.x), d = p * r + u * n, m = p * s + u * n, g = p * r + u * o, y = p * s + u * o;
    if (Math.max(d, m, g, y) <= p * a.x + u * a.y || Math.min(d, m, g, y) >= p * l.x + u * l.y)
      return !1;
    const v = f * (a.y - c.y), _ = f * (c.x - a.x), w = v * r + _ * n, x = v * s + _ * n, A = v * r + _ * o, S = v * s + _ * o;
    return !(Math.max(w, x, A, S) <= v * a.x + _ * a.y || Math.min(w, x, A, S) >= v * l.x + _ * l.y);
  }
  /**
   * Pads the rectangle making it grow in all directions.
   * If paddingY is omitted, both paddingX and paddingY will be set to paddingX.
   * @param paddingX - The horizontal padding amount.
   * @param paddingY - The vertical padding amount.
   * @returns Returns itself.
   */
  pad(t = 0, e = t) {
    return this.x -= t, this.y -= e, this.width += t * 2, this.height += e * 2, this;
  }
  /**
   * Fits this rectangle around the passed one.
   * @param rectangle - The rectangle to fit.
   * @returns Returns itself.
   */
  fit(t) {
    const e = Math.max(this.x, t.x), r = Math.min(this.x + this.width, t.x + t.width), s = Math.max(this.y, t.y), n = Math.min(this.y + this.height, t.y + t.height);
    return this.x = e, this.width = Math.max(r - e, 0), this.y = s, this.height = Math.max(n - s, 0), this;
  }
  /**
   * Enlarges rectangle that way its corners lie on grid
   * @param resolution - resolution
   * @param eps - precision
   * @returns Returns itself.
   */
  ceil(t = 1, e = 1e-3) {
    const r = Math.ceil((this.x + this.width - e) * t) / t, s = Math.ceil((this.y + this.height - e) * t) / t;
    return this.x = Math.floor((this.x + e) * t) / t, this.y = Math.floor((this.y + e) * t) / t, this.width = r - this.x, this.height = s - this.y, this;
  }
  /**
   * Enlarges this rectangle to include the passed rectangle.
   * @param rectangle - The rectangle to include.
   * @returns Returns itself.
   */
  enlarge(t) {
    const e = Math.min(this.x, t.x), r = Math.max(this.x + this.width, t.x + t.width), s = Math.min(this.y, t.y), n = Math.max(this.y + this.height, t.y + t.height);
    return this.x = e, this.width = r - e, this.y = s, this.height = n - s, this;
  }
  /**
   * Returns the framing rectangle of the rectangle as a Rectangle object
   * @param out - optional rectangle to store the result
   * @returns The framing rectangle
   */
  getBounds(t) {
    return t = t || new mt(), t.copyFrom(this), t;
  }
  toString() {
    return `[pixi.js/math:Rectangle x=${this.x} y=${this.y} width=${this.width} height=${this.height}]`;
  }
}
const Qn = {
  default: -1
};
function vt(i = "default") {
  return Qn[i] === void 0 && (Qn[i] = -1), ++Qn[i];
}
const pa = {}, q = "8.0.0", td = "8.3.4";
function X(i, t, e = 3) {
  if (pa[t])
    return;
  let r = new Error().stack;
  typeof r > "u" ? console.warn("PixiJS Deprecation Warning: ", `${t}
Deprecated since v${i}`) : (r = r.split(`
`).splice(e).join(`
`), console.groupCollapsed ? (console.groupCollapsed(
    "%cPixiJS Deprecation Warning: %c%s",
    "color:#614108;background:#fffbe6",
    "font-weight:normal;color:#614108;background:#fffbe6",
    `${t}
Deprecated since v${i}`
  ), console.warn(r), console.groupEnd()) : (console.warn("PixiJS Deprecation Warning: ", `${t}
Deprecated since v${i}`), console.warn(r))), pa[t] = !0;
}
const Zh = () => {
};
function fa(i) {
  return i += i === 0 ? 1 : 0, --i, i |= i >>> 1, i |= i >>> 2, i |= i >>> 4, i |= i >>> 8, i |= i >>> 16, i + 1;
}
function ma(i) {
  return !(i & i - 1) && !!i;
}
function ed(i) {
  const t = {};
  for (const e in i)
    i[e] !== void 0 && (t[e] = i[e]);
  return t;
}
const ga = /* @__PURE__ */ Object.create(null);
function id(i) {
  const t = ga[i];
  return t === void 0 && (ga[i] = vt("resource")), t;
}
const $h = class tl extends Bt {
  /**
   * @param options - options for the style
   */
  constructor(t = {}) {
    super(), this._resourceType = "textureSampler", this._touched = 0, this._maxAnisotropy = 1, this.destroyed = !1, t = { ...tl.defaultOptions, ...t }, this.addressMode = t.addressMode, this.addressModeU = t.addressModeU ?? this.addressModeU, this.addressModeV = t.addressModeV ?? this.addressModeV, this.addressModeW = t.addressModeW ?? this.addressModeW, this.scaleMode = t.scaleMode, this.magFilter = t.magFilter ?? this.magFilter, this.minFilter = t.minFilter ?? this.minFilter, this.mipmapFilter = t.mipmapFilter ?? this.mipmapFilter, this.lodMinClamp = t.lodMinClamp, this.lodMaxClamp = t.lodMaxClamp, this.compare = t.compare, this.maxAnisotropy = t.maxAnisotropy ?? 1;
  }
  set addressMode(t) {
    this.addressModeU = t, this.addressModeV = t, this.addressModeW = t;
  }
  /** setting this will set wrapModeU,wrapModeV and wrapModeW all at once! */
  get addressMode() {
    return this.addressModeU;
  }
  set wrapMode(t) {
    X(q, "TextureStyle.wrapMode is now TextureStyle.addressMode"), this.addressMode = t;
  }
  get wrapMode() {
    return this.addressMode;
  }
  set scaleMode(t) {
    this.magFilter = t, this.minFilter = t, this.mipmapFilter = t;
  }
  /** setting this will set magFilter,minFilter and mipmapFilter all at once!  */
  get scaleMode() {
    return this.magFilter;
  }
  /** Specifies the maximum anisotropy value clamp used by the sampler. */
  set maxAnisotropy(t) {
    this._maxAnisotropy = Math.min(t, 16), this._maxAnisotropy > 1 && (this.scaleMode = "linear");
  }
  get maxAnisotropy() {
    return this._maxAnisotropy;
  }
  // TODO - move this to WebGL?
  get _resourceId() {
    return this._sharedResourceId || this._generateResourceId();
  }
  update() {
    this.emit("change", this), this._sharedResourceId = null;
  }
  _generateResourceId() {
    const t = `${this.addressModeU}-${this.addressModeV}-${this.addressModeW}-${this.magFilter}-${this.minFilter}-${this.mipmapFilter}-${this.lodMinClamp}-${this.lodMaxClamp}-${this.compare}-${this._maxAnisotropy}`;
    return this._sharedResourceId = id(t), this._resourceId;
  }
  /** Destroys the style */
  destroy() {
    this.destroyed = !0, this.emit("destroy", this), this.emit("change", this), this.removeAllListeners();
  }
};
$h.defaultOptions = {
  addressMode: "clamp-to-edge",
  scaleMode: "linear"
};
let rd = $h;
const el = class il extends Bt {
  /**
   * @param options - options for creating a new TextureSource
   */
  constructor(t = {}) {
    super(), this.options = t, this.uid = vt("textureSource"), this._resourceType = "textureSource", this._resourceId = vt("resource"), this.uploadMethodId = "unknown", this._resolution = 1, this.pixelWidth = 1, this.pixelHeight = 1, this.width = 1, this.height = 1, this.sampleCount = 1, this.mipLevelCount = 1, this.autoGenerateMipmaps = !1, this.format = "rgba8unorm", this.dimension = "2d", this.antialias = !1, this._touched = 0, this._batchTick = -1, this._textureBindLocation = -1, t = { ...il.defaultOptions, ...t }, this.label = t.label ?? "", this.resource = t.resource, this.autoGarbageCollect = t.autoGarbageCollect, this._resolution = t.resolution, t.width ? this.pixelWidth = t.width * this._resolution : this.pixelWidth = this.resource ? this.resourceWidth ?? 1 : 1, t.height ? this.pixelHeight = t.height * this._resolution : this.pixelHeight = this.resource ? this.resourceHeight ?? 1 : 1, this.width = this.pixelWidth / this._resolution, this.height = this.pixelHeight / this._resolution, this.format = t.format, this.dimension = t.dimensions, this.mipLevelCount = t.mipLevelCount, this.autoGenerateMipmaps = t.autoGenerateMipmaps, this.sampleCount = t.sampleCount, this.antialias = t.antialias, this.alphaMode = t.alphaMode, this.style = new rd(ed(t)), this.destroyed = !1, this._refreshPOT();
  }
  /** returns itself */
  get source() {
    return this;
  }
  /** the style of the texture */
  get style() {
    return this._style;
  }
  set style(t) {
    var e, r;
    this.style !== t && ((e = this._style) == null || e.off("change", this._onStyleChange, this), this._style = t, (r = this._style) == null || r.on("change", this._onStyleChange, this), this._onStyleChange());
  }
  /** setting this will set wrapModeU,wrapModeV and wrapModeW all at once! */
  get addressMode() {
    return this._style.addressMode;
  }
  set addressMode(t) {
    this._style.addressMode = t;
  }
  /** setting this will set wrapModeU,wrapModeV and wrapModeW all at once! */
  get repeatMode() {
    return this._style.addressMode;
  }
  set repeatMode(t) {
    this._style.addressMode = t;
  }
  /** Specifies the sampling behavior when the sample footprint is smaller than or equal to one texel. */
  get magFilter() {
    return this._style.magFilter;
  }
  set magFilter(t) {
    this._style.magFilter = t;
  }
  /** Specifies the sampling behavior when the sample footprint is larger than one texel. */
  get minFilter() {
    return this._style.minFilter;
  }
  set minFilter(t) {
    this._style.minFilter = t;
  }
  /** Specifies behavior for sampling between mipmap levels. */
  get mipmapFilter() {
    return this._style.mipmapFilter;
  }
  set mipmapFilter(t) {
    this._style.mipmapFilter = t;
  }
  /** Specifies the minimum and maximum levels of detail, respectively, used internally when sampling a texture. */
  get lodMinClamp() {
    return this._style.lodMinClamp;
  }
  set lodMinClamp(t) {
    this._style.lodMinClamp = t;
  }
  /** Specifies the minimum and maximum levels of detail, respectively, used internally when sampling a texture. */
  get lodMaxClamp() {
    return this._style.lodMaxClamp;
  }
  set lodMaxClamp(t) {
    this._style.lodMaxClamp = t;
  }
  _onStyleChange() {
    this.emit("styleChange", this);
  }
  /** call this if you have modified the texture outside of the constructor */
  update() {
    if (this.resource) {
      const t = this._resolution;
      if (this.resize(this.resourceWidth / t, this.resourceHeight / t))
        return;
    }
    this.emit("update", this);
  }
  /** Destroys this texture source */
  destroy() {
    this.destroyed = !0, this.emit("destroy", this), this.emit("change", this), this._style && (this._style.destroy(), this._style = null), this.uploadMethodId = null, this.resource = null, this.removeAllListeners();
  }
  /**
   * This will unload the Texture source from the GPU. This will free up the GPU memory
   * As soon as it is required fore rendering, it will be re-uploaded.
   */
  unload() {
    this._resourceId = vt("resource"), this.emit("change", this), this.emit("unload", this);
  }
  /** the width of the resource. This is the REAL pure number, not accounting resolution   */
  get resourceWidth() {
    const { resource: t } = this;
    return t.naturalWidth || t.videoWidth || t.displayWidth || t.width;
  }
  /** the height of the resource. This is the REAL pure number, not accounting resolution */
  get resourceHeight() {
    const { resource: t } = this;
    return t.naturalHeight || t.videoHeight || t.displayHeight || t.height;
  }
  /**
   * the resolution of the texture. Changing this number, will not change the number of pixels in the actual texture
   * but will the size of the texture when rendered.
   *
   * changing the resolution of this texture to 2 for example will make it appear twice as small when rendered (as pixel
   * density will have increased)
   */
  get resolution() {
    return this._resolution;
  }
  set resolution(t) {
    this._resolution !== t && (this._resolution = t, this.width = this.pixelWidth / t, this.height = this.pixelHeight / t);
  }
  /**
   * Resize the texture, this is handy if you want to use the texture as a render texture
   * @param width - the new width of the texture
   * @param height - the new height of the texture
   * @param resolution - the new resolution of the texture
   * @returns - if the texture was resized
   */
  resize(t, e, r) {
    r = r || this._resolution, t = t || this.width, e = e || this.height;
    const s = Math.round(t * r), n = Math.round(e * r);
    return this.width = s / r, this.height = n / r, this._resolution = r, this.pixelWidth === s && this.pixelHeight === n ? !1 : (this._refreshPOT(), this.pixelWidth = s, this.pixelHeight = n, this.emit("resize", this), this._resourceId = vt("resource"), this.emit("change", this), !0);
  }
  /**
   * Lets the renderer know that this texture has been updated and its mipmaps should be re-generated.
   * This is only important for RenderTexture instances, as standard Texture instances will have their
   * mipmaps generated on upload. You should call this method after you make any change to the texture
   *
   * The reason for this is is can be quite expensive to update mipmaps for a texture. So by default,
   * We want you, the developer to specify when this action should happen.
   *
   * Generally you don't want to have mipmaps generated on Render targets that are changed every frame,
   */
  updateMipmaps() {
    this.autoGenerateMipmaps && this.mipLevelCount > 1 && this.emit("updateMipmaps", this);
  }
  set wrapMode(t) {
    this._style.wrapMode = t;
  }
  get wrapMode() {
    return this._style.wrapMode;
  }
  set scaleMode(t) {
    this._style.scaleMode = t;
  }
  /** setting this will set magFilter,minFilter and mipmapFilter all at once!  */
  get scaleMode() {
    return this._style.scaleMode;
  }
  /**
   * Refresh check for isPowerOfTwo texture based on size
   * @private
   */
  _refreshPOT() {
    this.isPowerOfTwo = ma(this.pixelWidth) && ma(this.pixelHeight);
  }
  static test(t) {
    throw new Error("Unimplemented");
  }
};
el.defaultOptions = {
  resolution: 1,
  format: "bgra8unorm",
  alphaMode: "premultiply-alpha-on-upload",
  dimensions: "2d",
  mipLevelCount: 1,
  autoGenerateMipmaps: !1,
  sampleCount: 1,
  antialias: !1,
  autoGarbageCollect: !1
};
let Ae = el;
class Po extends Ae {
  constructor(t) {
    const e = t.resource || new Float32Array(t.width * t.height * 4);
    let r = t.format;
    r || (e instanceof Float32Array ? r = "rgba32float" : e instanceof Int32Array || e instanceof Uint32Array ? r = "rgba32uint" : e instanceof Int16Array || e instanceof Uint16Array ? r = "rgba16uint" : r = "bgra8unorm"), super({
      ...t,
      resource: e,
      format: r
    }), this.uploadMethodId = "buffer";
  }
  static test(t) {
    return t instanceof Int8Array || t instanceof Uint8Array || t instanceof Uint8ClampedArray || t instanceof Int16Array || t instanceof Uint16Array || t instanceof Int32Array || t instanceof Uint32Array || t instanceof Float32Array;
  }
}
Po.extension = D.TextureSource;
const ya = new K();
class nd {
  /**
   * @param texture - observed texture
   * @param clampMargin - Changes frame clamping, 0.5 by default. Use -0.5 for extra border.
   */
  constructor(t, e) {
    this.mapCoord = new K(), this.uClampFrame = new Float32Array(4), this.uClampOffset = new Float32Array(2), this._textureID = -1, this._updateID = 0, this.clampOffset = 0, typeof e > "u" ? this.clampMargin = t.width < 10 ? 0 : 0.5 : this.clampMargin = e, this.isSimple = !1, this.texture = t;
  }
  /** Texture property. */
  get texture() {
    return this._texture;
  }
  set texture(t) {
    var e;
    this.texture !== t && ((e = this._texture) == null || e.removeListener("update", this.update, this), this._texture = t, this._texture.addListener("update", this.update, this), this.update());
  }
  /**
   * Multiplies uvs array to transform
   * @param uvs - mesh uvs
   * @param [out=uvs] - output
   * @returns - output
   */
  multiplyUvs(t, e) {
    e === void 0 && (e = t);
    const r = this.mapCoord;
    for (let s = 0; s < t.length; s += 2) {
      const n = t[s], o = t[s + 1];
      e[s] = n * r.a + o * r.c + r.tx, e[s + 1] = n * r.b + o * r.d + r.ty;
    }
    return e;
  }
  /**
   * Updates matrices if texture was changed
   * @returns - whether or not it was updated
   */
  update() {
    const t = this._texture;
    this._updateID++;
    const e = t.uvs;
    this.mapCoord.set(e.x1 - e.x0, e.y1 - e.y0, e.x3 - e.x0, e.y3 - e.y0, e.x0, e.y0);
    const r = t.orig, s = t.trim;
    s && (ya.set(
      r.width / s.width,
      0,
      0,
      r.height / s.height,
      -s.x / s.width,
      -s.y / s.height
    ), this.mapCoord.append(ya));
    const n = t.source, o = this.uClampFrame, a = this.clampMargin / n._resolution, h = this.clampOffset / n._resolution;
    return o[0] = (t.frame.x + a + h) / n.width, o[1] = (t.frame.y + a + h) / n.height, o[2] = (t.frame.x + t.frame.width - a + h) / n.width, o[3] = (t.frame.y + t.frame.height - a + h) / n.height, this.uClampOffset[0] = this.clampOffset / n.pixelWidth, this.uClampOffset[1] = this.clampOffset / n.pixelHeight, this.isSimple = t.frame.width === n.width && t.frame.height === n.height && t.rotate === 0, !0;
  }
}
class H extends Bt {
  /**
   * @param {rendering.TextureOptions} options - Options for the texture
   */
  constructor({
    source: t,
    label: e,
    frame: r,
    orig: s,
    trim: n,
    defaultAnchor: o,
    defaultBorders: a,
    rotate: h,
    dynamic: c
  } = {}) {
    if (super(), this.uid = vt("texture"), this.uvs = { x0: 0, y0: 0, x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0 }, this.frame = new mt(), this.noFrame = !1, this.dynamic = !1, this.isTexture = !0, this.label = e, this.source = (t == null ? void 0 : t.source) ?? new Ae(), this.noFrame = !r, r)
      this.frame.copyFrom(r);
    else {
      const { width: l, height: f } = this._source;
      this.frame.width = l, this.frame.height = f;
    }
    this.orig = s || this.frame, this.trim = n, this.rotate = h ?? 0, this.defaultAnchor = o, this.defaultBorders = a, this.destroyed = !1, this.dynamic = c || !1, this.updateUvs();
  }
  set source(t) {
    this._source && this._source.off("resize", this.update, this), this._source = t, t.on("resize", this.update, this), this.emit("update", this);
  }
  /** the underlying source of the texture (equivalent of baseTexture in v7) */
  get source() {
    return this._source;
  }
  /** returns a TextureMatrix instance for this texture. By default, that object is not created because its heavy. */
  get textureMatrix() {
    return this._textureMatrix || (this._textureMatrix = new nd(this)), this._textureMatrix;
  }
  /** The width of the Texture in pixels. */
  get width() {
    return this.orig.width;
  }
  /** The height of the Texture in pixels. */
  get height() {
    return this.orig.height;
  }
  /** Call this function when you have modified the frame of this texture. */
  updateUvs() {
    const { uvs: t, frame: e } = this, { width: r, height: s } = this._source, n = e.x / r, o = e.y / s, a = e.width / r, h = e.height / s;
    let c = this.rotate;
    if (c) {
      const l = a / 2, f = h / 2, p = n + l, u = o + f;
      c = it.add(c, it.NW), t.x0 = p + l * it.uX(c), t.y0 = u + f * it.uY(c), c = it.add(c, 2), t.x1 = p + l * it.uX(c), t.y1 = u + f * it.uY(c), c = it.add(c, 2), t.x2 = p + l * it.uX(c), t.y2 = u + f * it.uY(c), c = it.add(c, 2), t.x3 = p + l * it.uX(c), t.y3 = u + f * it.uY(c);
    } else
      t.x0 = n, t.y0 = o, t.x1 = n + a, t.y1 = o, t.x2 = n + a, t.y2 = o + h, t.x3 = n, t.y3 = o + h;
  }
  /**
   * Destroys this texture
   * @param destroySource - Destroy the source when the texture is destroyed.
   */
  destroy(t = !1) {
    this._source && t && (this._source.destroy(), this._source = null), this._textureMatrix = null, this.destroyed = !0, this.emit("destroy", this), this.removeAllListeners();
  }
  /**
   * Call this if you have modified the `texture outside` of the constructor.
   *
   * If you have modified this texture's source, you must separately call `texture.source.update()` to see those changes.
   */
  update() {
    this.noFrame && (this.frame.width = this._source.width, this.frame.height = this._source.height), this.updateUvs(), this.emit("update", this);
  }
  /** @deprecated since 8.0.0 */
  get baseTexture() {
    return X(q, "Texture.baseTexture is now Texture.source"), this._source;
  }
}
H.EMPTY = new H({
  label: "EMPTY",
  source: new Ae({
    label: "EMPTY"
  })
});
H.EMPTY.destroy = Zh;
H.WHITE = new H({
  source: new Po({
    resource: new Uint8Array([255, 255, 255, 255]),
    width: 1,
    height: 1,
    alphaMode: "premultiply-alpha-on-upload",
    label: "WHITE"
  }),
  label: "WHITE"
});
H.WHITE.destroy = Zh;
function sd(i, t, e, r) {
  const { width: s, height: n } = e.orig, o = e.trim;
  if (o) {
    const a = o.width, h = o.height;
    i.minX = o.x - t._x * s - r, i.maxX = i.minX + a, i.minY = o.y - t._y * n - r, i.maxY = i.minY + h;
  } else
    i.minX = -t._x * s - r, i.maxX = i.minX + s, i.minY = -t._y * n - r, i.maxY = i.minY + n;
}
const xa = new K();
class _e {
  constructor(t = 1 / 0, e = 1 / 0, r = -1 / 0, s = -1 / 0) {
    this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0, this.matrix = xa, this.minX = t, this.minY = e, this.maxX = r, this.maxY = s;
  }
  /**
   * Checks if bounds are empty.
   * @returns - True if empty.
   */
  isEmpty() {
    return this.minX > this.maxX || this.minY > this.maxY;
  }
  /** The bounding rectangle of the bounds. */
  get rectangle() {
    this._rectangle || (this._rectangle = new mt());
    const t = this._rectangle;
    return this.minX > this.maxX || this.minY > this.maxY ? (t.x = 0, t.y = 0, t.width = 0, t.height = 0) : t.copyFromBounds(this), t;
  }
  /** Clears the bounds and resets. */
  clear() {
    return this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0, this.matrix = xa, this;
  }
  /**
   * Sets the bounds.
   * @param x0 - left X of frame
   * @param y0 - top Y of frame
   * @param x1 - right X of frame
   * @param y1 - bottom Y of frame
   */
  set(t, e, r, s) {
    this.minX = t, this.minY = e, this.maxX = r, this.maxY = s;
  }
  /**
   * Adds sprite frame
   * @param x0 - left X of frame
   * @param y0 - top Y of frame
   * @param x1 - right X of frame
   * @param y1 - bottom Y of frame
   * @param matrix
   */
  addFrame(t, e, r, s, n) {
    n || (n = this.matrix);
    const o = n.a, a = n.b, h = n.c, c = n.d, l = n.tx, f = n.ty;
    let p = this.minX, u = this.minY, d = this.maxX, m = this.maxY, g = o * t + h * e + l, y = a * t + c * e + f;
    g < p && (p = g), y < u && (u = y), g > d && (d = g), y > m && (m = y), g = o * r + h * e + l, y = a * r + c * e + f, g < p && (p = g), y < u && (u = y), g > d && (d = g), y > m && (m = y), g = o * t + h * s + l, y = a * t + c * s + f, g < p && (p = g), y < u && (u = y), g > d && (d = g), y > m && (m = y), g = o * r + h * s + l, y = a * r + c * s + f, g < p && (p = g), y < u && (u = y), g > d && (d = g), y > m && (m = y), this.minX = p, this.minY = u, this.maxX = d, this.maxY = m;
  }
  /**
   * Adds a rectangle to the bounds.
   * @param rect - The rectangle to be added.
   * @param matrix - The matrix to apply to the bounds.
   */
  addRect(t, e) {
    this.addFrame(t.x, t.y, t.x + t.width, t.y + t.height, e);
  }
  /**
   * Adds other {@link Bounds}.
   * @param bounds - The Bounds to be added
   * @param matrix
   */
  addBounds(t, e) {
    this.addFrame(t.minX, t.minY, t.maxX, t.maxY, e);
  }
  /**
   * Adds other Bounds, masked with Bounds.
   * @param mask - The Bounds to be added.
   */
  addBoundsMask(t) {
    this.minX = this.minX > t.minX ? this.minX : t.minX, this.minY = this.minY > t.minY ? this.minY : t.minY, this.maxX = this.maxX < t.maxX ? this.maxX : t.maxX, this.maxY = this.maxY < t.maxY ? this.maxY : t.maxY;
  }
  /**
   * Adds other Bounds, multiplied with matrix.
   * @param matrix - The matrix to apply to the bounds.
   */
  applyMatrix(t) {
    const e = this.minX, r = this.minY, s = this.maxX, n = this.maxY, { a: o, b: a, c: h, d: c, tx: l, ty: f } = t;
    let p = o * e + h * r + l, u = a * e + c * r + f;
    this.minX = p, this.minY = u, this.maxX = p, this.maxY = u, p = o * s + h * r + l, u = a * s + c * r + f, this.minX = p < this.minX ? p : this.minX, this.minY = u < this.minY ? u : this.minY, this.maxX = p > this.maxX ? p : this.maxX, this.maxY = u > this.maxY ? u : this.maxY, p = o * e + h * n + l, u = a * e + c * n + f, this.minX = p < this.minX ? p : this.minX, this.minY = u < this.minY ? u : this.minY, this.maxX = p > this.maxX ? p : this.maxX, this.maxY = u > this.maxY ? u : this.maxY, p = o * s + h * n + l, u = a * s + c * n + f, this.minX = p < this.minX ? p : this.minX, this.minY = u < this.minY ? u : this.minY, this.maxX = p > this.maxX ? p : this.maxX, this.maxY = u > this.maxY ? u : this.maxY;
  }
  /**
   * Resizes the bounds object to include the given rectangle.
   * @param rect - The rectangle to be included.
   */
  fit(t) {
    return this.minX < t.left && (this.minX = t.left), this.maxX > t.right && (this.maxX = t.right), this.minY < t.top && (this.minY = t.top), this.maxY > t.bottom && (this.maxY = t.bottom), this;
  }
  /**
   * Resizes the bounds object to include the given bounds.
   * @param left - The left value of the bounds.
   * @param right - The right value of the bounds.
   * @param top - The top value of the bounds.
   * @param bottom - The bottom value of the bounds.
   */
  fitBounds(t, e, r, s) {
    return this.minX < t && (this.minX = t), this.maxX > e && (this.maxX = e), this.minY < r && (this.minY = r), this.maxY > s && (this.maxY = s), this;
  }
  /**
   * Pads bounds object, making it grow in all directions.
   * If paddingY is omitted, both paddingX and paddingY will be set to paddingX.
   * @param paddingX - The horizontal padding amount.
   * @param paddingY - The vertical padding amount.
   */
  pad(t, e = t) {
    return this.minX -= t, this.maxX += t, this.minY -= e, this.maxY += e, this;
  }
  /** Ceils the bounds. */
  ceil() {
    return this.minX = Math.floor(this.minX), this.minY = Math.floor(this.minY), this.maxX = Math.ceil(this.maxX), this.maxY = Math.ceil(this.maxY), this;
  }
  /** Clones the bounds. */
  clone() {
    return new _e(this.minX, this.minY, this.maxX, this.maxY);
  }
  /**
   * Scales the bounds by the given values
   * @param x - The X value to scale by.
   * @param y - The Y value to scale by.
   */
  scale(t, e = t) {
    return this.minX *= t, this.minY *= e, this.maxX *= t, this.maxY *= e, this;
  }
  /** the x value of the bounds. */
  get x() {
    return this.minX;
  }
  set x(t) {
    const e = this.maxX - this.minX;
    this.minX = t, this.maxX = t + e;
  }
  /** the y value of the bounds. */
  get y() {
    return this.minY;
  }
  set y(t) {
    const e = this.maxY - this.minY;
    this.minY = t, this.maxY = t + e;
  }
  /** the width value of the bounds. */
  get width() {
    return this.maxX - this.minX;
  }
  set width(t) {
    this.maxX = this.minX + t;
  }
  /** the height value of the bounds. */
  get height() {
    return this.maxY - this.minY;
  }
  set height(t) {
    this.maxY = this.minY + t;
  }
  /** the left value of the bounds. */
  get left() {
    return this.minX;
  }
  /** the right value of the bounds. */
  get right() {
    return this.maxX;
  }
  /** the top value of the bounds. */
  get top() {
    return this.minY;
  }
  /** the bottom value of the bounds. */
  get bottom() {
    return this.maxY;
  }
  /** Is the bounds positive. */
  get isPositive() {
    return this.maxX - this.minX > 0 && this.maxY - this.minY > 0;
  }
  get isValid() {
    return this.minX + this.minY !== 1 / 0;
  }
  /**
   * Adds screen vertices from array
   * @param vertexData - calculated vertices
   * @param beginOffset - begin offset
   * @param endOffset - end offset, excluded
   * @param matrix
   */
  addVertexData(t, e, r, s) {
    let n = this.minX, o = this.minY, a = this.maxX, h = this.maxY;
    s || (s = this.matrix);
    const c = s.a, l = s.b, f = s.c, p = s.d, u = s.tx, d = s.ty;
    for (let m = e; m < r; m += 2) {
      const g = t[m], y = t[m + 1], v = c * g + f * y + u, _ = l * g + p * y + d;
      n = v < n ? v : n, o = _ < o ? _ : o, a = v > a ? v : a, h = _ > h ? _ : h;
    }
    this.minX = n, this.minY = o, this.maxX = a, this.maxY = h;
  }
  /**
   * Checks if the point is contained within the bounds.
   * @param x - x coordinate
   * @param y - y coordinate
   */
  containsPoint(t, e) {
    return this.minX <= t && this.minY <= e && this.maxX >= t && this.maxY >= e;
  }
  toString() {
    return `[pixi.js:Bounds minX=${this.minX} minY=${this.minY} maxX=${this.maxX} maxY=${this.maxY} width=${this.width} height=${this.height}]`;
  }
}
var od = { grad: 0.9, turn: 360, rad: 360 / (2 * Math.PI) }, Ce = function(i) {
  return typeof i == "string" ? i.length > 0 : typeof i == "number";
}, _t = function(i, t, e) {
  return t === void 0 && (t = 0), e === void 0 && (e = Math.pow(10, t)), Math.round(e * i) / e + 0;
}, te = function(i, t, e) {
  return t === void 0 && (t = 0), e === void 0 && (e = 1), i > e ? e : i > t ? i : t;
}, rl = function(i) {
  return (i = isFinite(i) ? i % 360 : 0) > 0 ? i : i + 360;
}, va = function(i) {
  return { r: te(i.r, 0, 255), g: te(i.g, 0, 255), b: te(i.b, 0, 255), a: te(i.a) };
}, Jn = function(i) {
  return { r: _t(i.r), g: _t(i.g), b: _t(i.b), a: _t(i.a, 3) };
}, ad = /^#([0-9a-f]{3,8})$/i, Nr = function(i) {
  var t = i.toString(16);
  return t.length < 2 ? "0" + t : t;
}, nl = function(i) {
  var t = i.r, e = i.g, r = i.b, s = i.a, n = Math.max(t, e, r), o = n - Math.min(t, e, r), a = o ? n === t ? (e - r) / o : n === e ? 2 + (r - t) / o : 4 + (t - e) / o : 0;
  return { h: 60 * (a < 0 ? a + 6 : a), s: n ? o / n * 100 : 0, v: n / 255 * 100, a: s };
}, sl = function(i) {
  var t = i.h, e = i.s, r = i.v, s = i.a;
  t = t / 360 * 6, e /= 100, r /= 100;
  var n = Math.floor(t), o = r * (1 - e), a = r * (1 - (t - n) * e), h = r * (1 - (1 - t + n) * e), c = n % 6;
  return { r: 255 * [r, a, o, o, h, r][c], g: 255 * [h, r, r, a, o, o][c], b: 255 * [o, o, h, r, r, a][c], a: s };
}, ba = function(i) {
  return { h: rl(i.h), s: te(i.s, 0, 100), l: te(i.l, 0, 100), a: te(i.a) };
}, _a = function(i) {
  return { h: _t(i.h), s: _t(i.s), l: _t(i.l), a: _t(i.a, 3) };
}, wa = function(i) {
  return sl((e = (t = i).s, { h: t.h, s: (e *= ((r = t.l) < 50 ? r : 100 - r) / 100) > 0 ? 2 * e / (r + e) * 100 : 0, v: r + e, a: t.a }));
  var t, e, r;
}, fr = function(i) {
  return { h: (t = nl(i)).h, s: (s = (200 - (e = t.s)) * (r = t.v) / 100) > 0 && s < 200 ? e * r / 100 / (s <= 100 ? s : 200 - s) * 100 : 0, l: s / 2, a: t.a };
  var t, e, r, s;
}, hd = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, ld = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, cd = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, ud = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, Ds = { string: [[function(i) {
  var t = ad.exec(i);
  return t ? (i = t[1]).length <= 4 ? { r: parseInt(i[0] + i[0], 16), g: parseInt(i[1] + i[1], 16), b: parseInt(i[2] + i[2], 16), a: i.length === 4 ? _t(parseInt(i[3] + i[3], 16) / 255, 2) : 1 } : i.length === 6 || i.length === 8 ? { r: parseInt(i.substr(0, 2), 16), g: parseInt(i.substr(2, 2), 16), b: parseInt(i.substr(4, 2), 16), a: i.length === 8 ? _t(parseInt(i.substr(6, 2), 16) / 255, 2) : 1 } : null : null;
}, "hex"], [function(i) {
  var t = cd.exec(i) || ud.exec(i);
  return t ? t[2] !== t[4] || t[4] !== t[6] ? null : va({ r: Number(t[1]) / (t[2] ? 100 / 255 : 1), g: Number(t[3]) / (t[4] ? 100 / 255 : 1), b: Number(t[5]) / (t[6] ? 100 / 255 : 1), a: t[7] === void 0 ? 1 : Number(t[7]) / (t[8] ? 100 : 1) }) : null;
}, "rgb"], [function(i) {
  var t = hd.exec(i) || ld.exec(i);
  if (!t) return null;
  var e, r, s = ba({ h: (e = t[1], r = t[2], r === void 0 && (r = "deg"), Number(e) * (od[r] || 1)), s: Number(t[3]), l: Number(t[4]), a: t[5] === void 0 ? 1 : Number(t[5]) / (t[6] ? 100 : 1) });
  return wa(s);
}, "hsl"]], object: [[function(i) {
  var t = i.r, e = i.g, r = i.b, s = i.a, n = s === void 0 ? 1 : s;
  return Ce(t) && Ce(e) && Ce(r) ? va({ r: Number(t), g: Number(e), b: Number(r), a: Number(n) }) : null;
}, "rgb"], [function(i) {
  var t = i.h, e = i.s, r = i.l, s = i.a, n = s === void 0 ? 1 : s;
  if (!Ce(t) || !Ce(e) || !Ce(r)) return null;
  var o = ba({ h: Number(t), s: Number(e), l: Number(r), a: Number(n) });
  return wa(o);
}, "hsl"], [function(i) {
  var t = i.h, e = i.s, r = i.v, s = i.a, n = s === void 0 ? 1 : s;
  if (!Ce(t) || !Ce(e) || !Ce(r)) return null;
  var o = function(a) {
    return { h: rl(a.h), s: te(a.s, 0, 100), v: te(a.v, 0, 100), a: te(a.a) };
  }({ h: Number(t), s: Number(e), v: Number(r), a: Number(n) });
  return sl(o);
}, "hsv"]] }, Aa = function(i, t) {
  for (var e = 0; e < t.length; e++) {
    var r = t[e][0](i);
    if (r) return [r, t[e][1]];
  }
  return [null, void 0];
}, dd = function(i) {
  return typeof i == "string" ? Aa(i.trim(), Ds.string) : typeof i == "object" && i !== null ? Aa(i, Ds.object) : [null, void 0];
}, Zn = function(i, t) {
  var e = fr(i);
  return { h: e.h, s: te(e.s + 100 * t, 0, 100), l: e.l, a: e.a };
}, $n = function(i) {
  return (299 * i.r + 587 * i.g + 114 * i.b) / 1e3 / 255;
}, Sa = function(i, t) {
  var e = fr(i);
  return { h: e.h, s: e.s, l: te(e.l + 100 * t, 0, 100), a: e.a };
}, Us = function() {
  function i(t) {
    this.parsed = dd(t)[0], this.rgba = this.parsed || { r: 0, g: 0, b: 0, a: 1 };
  }
  return i.prototype.isValid = function() {
    return this.parsed !== null;
  }, i.prototype.brightness = function() {
    return _t($n(this.rgba), 2);
  }, i.prototype.isDark = function() {
    return $n(this.rgba) < 0.5;
  }, i.prototype.isLight = function() {
    return $n(this.rgba) >= 0.5;
  }, i.prototype.toHex = function() {
    return t = Jn(this.rgba), e = t.r, r = t.g, s = t.b, o = (n = t.a) < 1 ? Nr(_t(255 * n)) : "", "#" + Nr(e) + Nr(r) + Nr(s) + o;
    var t, e, r, s, n, o;
  }, i.prototype.toRgb = function() {
    return Jn(this.rgba);
  }, i.prototype.toRgbString = function() {
    return t = Jn(this.rgba), e = t.r, r = t.g, s = t.b, (n = t.a) < 1 ? "rgba(" + e + ", " + r + ", " + s + ", " + n + ")" : "rgb(" + e + ", " + r + ", " + s + ")";
    var t, e, r, s, n;
  }, i.prototype.toHsl = function() {
    return _a(fr(this.rgba));
  }, i.prototype.toHslString = function() {
    return t = _a(fr(this.rgba)), e = t.h, r = t.s, s = t.l, (n = t.a) < 1 ? "hsla(" + e + ", " + r + "%, " + s + "%, " + n + ")" : "hsl(" + e + ", " + r + "%, " + s + "%)";
    var t, e, r, s, n;
  }, i.prototype.toHsv = function() {
    return t = nl(this.rgba), { h: _t(t.h), s: _t(t.s), v: _t(t.v), a: _t(t.a, 3) };
    var t;
  }, i.prototype.invert = function() {
    return fe({ r: 255 - (t = this.rgba).r, g: 255 - t.g, b: 255 - t.b, a: t.a });
    var t;
  }, i.prototype.saturate = function(t) {
    return t === void 0 && (t = 0.1), fe(Zn(this.rgba, t));
  }, i.prototype.desaturate = function(t) {
    return t === void 0 && (t = 0.1), fe(Zn(this.rgba, -t));
  }, i.prototype.grayscale = function() {
    return fe(Zn(this.rgba, -1));
  }, i.prototype.lighten = function(t) {
    return t === void 0 && (t = 0.1), fe(Sa(this.rgba, t));
  }, i.prototype.darken = function(t) {
    return t === void 0 && (t = 0.1), fe(Sa(this.rgba, -t));
  }, i.prototype.rotate = function(t) {
    return t === void 0 && (t = 15), this.hue(this.hue() + t);
  }, i.prototype.alpha = function(t) {
    return typeof t == "number" ? fe({ r: (e = this.rgba).r, g: e.g, b: e.b, a: t }) : _t(this.rgba.a, 3);
    var e;
  }, i.prototype.hue = function(t) {
    var e = fr(this.rgba);
    return typeof t == "number" ? fe({ h: t, s: e.s, l: e.l, a: e.a }) : _t(e.h);
  }, i.prototype.isEqual = function(t) {
    return this.toHex() === fe(t).toHex();
  }, i;
}(), fe = function(i) {
  return i instanceof Us ? i : new Us(i);
}, Ca = [], pd = function(i) {
  i.forEach(function(t) {
    Ca.indexOf(t) < 0 && (t(Us, Ds), Ca.push(t));
  });
};
function fd(i, t) {
  var e = { white: "#ffffff", bisque: "#ffe4c4", blue: "#0000ff", cadetblue: "#5f9ea0", chartreuse: "#7fff00", chocolate: "#d2691e", coral: "#ff7f50", antiquewhite: "#faebd7", aqua: "#00ffff", azure: "#f0ffff", whitesmoke: "#f5f5f5", papayawhip: "#ffefd5", plum: "#dda0dd", blanchedalmond: "#ffebcd", black: "#000000", gold: "#ffd700", goldenrod: "#daa520", gainsboro: "#dcdcdc", cornsilk: "#fff8dc", cornflowerblue: "#6495ed", burlywood: "#deb887", aquamarine: "#7fffd4", beige: "#f5f5dc", crimson: "#dc143c", cyan: "#00ffff", darkblue: "#00008b", darkcyan: "#008b8b", darkgoldenrod: "#b8860b", darkkhaki: "#bdb76b", darkgray: "#a9a9a9", darkgreen: "#006400", darkgrey: "#a9a9a9", peachpuff: "#ffdab9", darkmagenta: "#8b008b", darkred: "#8b0000", darkorchid: "#9932cc", darkorange: "#ff8c00", darkslateblue: "#483d8b", gray: "#808080", darkslategray: "#2f4f4f", darkslategrey: "#2f4f4f", deeppink: "#ff1493", deepskyblue: "#00bfff", wheat: "#f5deb3", firebrick: "#b22222", floralwhite: "#fffaf0", ghostwhite: "#f8f8ff", darkviolet: "#9400d3", magenta: "#ff00ff", green: "#008000", dodgerblue: "#1e90ff", grey: "#808080", honeydew: "#f0fff0", hotpink: "#ff69b4", blueviolet: "#8a2be2", forestgreen: "#228b22", lawngreen: "#7cfc00", indianred: "#cd5c5c", indigo: "#4b0082", fuchsia: "#ff00ff", brown: "#a52a2a", maroon: "#800000", mediumblue: "#0000cd", lightcoral: "#f08080", darkturquoise: "#00ced1", lightcyan: "#e0ffff", ivory: "#fffff0", lightyellow: "#ffffe0", lightsalmon: "#ffa07a", lightseagreen: "#20b2aa", linen: "#faf0e6", mediumaquamarine: "#66cdaa", lemonchiffon: "#fffacd", lime: "#00ff00", khaki: "#f0e68c", mediumseagreen: "#3cb371", limegreen: "#32cd32", mediumspringgreen: "#00fa9a", lightskyblue: "#87cefa", lightblue: "#add8e6", midnightblue: "#191970", lightpink: "#ffb6c1", mistyrose: "#ffe4e1", moccasin: "#ffe4b5", mintcream: "#f5fffa", lightslategray: "#778899", lightslategrey: "#778899", navajowhite: "#ffdead", navy: "#000080", mediumvioletred: "#c71585", powderblue: "#b0e0e6", palegoldenrod: "#eee8aa", oldlace: "#fdf5e6", paleturquoise: "#afeeee", mediumturquoise: "#48d1cc", mediumorchid: "#ba55d3", rebeccapurple: "#663399", lightsteelblue: "#b0c4de", mediumslateblue: "#7b68ee", thistle: "#d8bfd8", tan: "#d2b48c", orchid: "#da70d6", mediumpurple: "#9370db", purple: "#800080", pink: "#ffc0cb", skyblue: "#87ceeb", springgreen: "#00ff7f", palegreen: "#98fb98", red: "#ff0000", yellow: "#ffff00", slateblue: "#6a5acd", lavenderblush: "#fff0f5", peru: "#cd853f", palevioletred: "#db7093", violet: "#ee82ee", teal: "#008080", slategray: "#708090", slategrey: "#708090", aliceblue: "#f0f8ff", darkseagreen: "#8fbc8f", darkolivegreen: "#556b2f", greenyellow: "#adff2f", seagreen: "#2e8b57", seashell: "#fff5ee", tomato: "#ff6347", silver: "#c0c0c0", sienna: "#a0522d", lavender: "#e6e6fa", lightgreen: "#90ee90", orange: "#ffa500", orangered: "#ff4500", steelblue: "#4682b4", royalblue: "#4169e1", turquoise: "#40e0d0", yellowgreen: "#9acd32", salmon: "#fa8072", saddlebrown: "#8b4513", sandybrown: "#f4a460", rosybrown: "#bc8f8f", darksalmon: "#e9967a", lightgoldenrodyellow: "#fafad2", snow: "#fffafa", lightgrey: "#d3d3d3", lightgray: "#d3d3d3", dimgray: "#696969", dimgrey: "#696969", olivedrab: "#6b8e23", olive: "#808000" }, r = {};
  for (var s in e) r[e[s]] = s;
  var n = {};
  i.prototype.toName = function(o) {
    if (!(this.rgba.a || this.rgba.r || this.rgba.g || this.rgba.b)) return "transparent";
    var a, h, c = r[this.toHex()];
    if (c) return c;
    if (o != null && o.closest) {
      var l = this.toRgb(), f = 1 / 0, p = "black";
      if (!n.length) for (var u in e) n[u] = new i(e[u]).toRgb();
      for (var d in e) {
        var m = (a = l, h = n[d], Math.pow(a.r - h.r, 2) + Math.pow(a.g - h.g, 2) + Math.pow(a.b - h.b, 2));
        m < f && (f = m, p = d);
      }
      return p;
    }
  }, t.string.push([function(o) {
    var a = o.toLowerCase(), h = a === "transparent" ? "#0000" : e[a];
    return h ? new i(h).toRgb() : null;
  }, "name"]);
}
pd([fd]);
const Fi = class sr {
  /**
   * @param {ColorSource} value - Optional value to use, if not provided, white is used.
   */
  constructor(t = 16777215) {
    this._value = null, this._components = new Float32Array(4), this._components.fill(1), this._int = 16777215, this.value = t;
  }
  /** Get red component (0 - 1) */
  get red() {
    return this._components[0];
  }
  /** Get green component (0 - 1) */
  get green() {
    return this._components[1];
  }
  /** Get blue component (0 - 1) */
  get blue() {
    return this._components[2];
  }
  /** Get alpha component (0 - 1) */
  get alpha() {
    return this._components[3];
  }
  /**
   * Set the value, suitable for chaining
   * @param value
   * @see Color.value
   */
  setValue(t) {
    return this.value = t, this;
  }
  /**
   * The current color source.
   *
   * When setting:
   * - Setting to an instance of `Color` will copy its color source and components.
   * - Otherwise, `Color` will try to normalize the color source and set the components.
   *   If the color source is invalid, an `Error` will be thrown and the `Color` will left unchanged.
   *
   * Note: The `null` in the setter's parameter type is added to match the TypeScript rule: return type of getter
   * must be assignable to its setter's parameter type. Setting `value` to `null` will throw an `Error`.
   *
   * When getting:
   * - A return value of `null` means the previous value was overridden (e.g., {@link Color.multiply multiply},
   *   {@link Color.premultiply premultiply} or {@link Color.round round}).
   * - Otherwise, the color source used when setting is returned.
   */
  set value(t) {
    if (t instanceof sr)
      this._value = this._cloneSource(t._value), this._int = t._int, this._components.set(t._components);
    else {
      if (t === null)
        throw new Error("Cannot set Color#value to null");
      (this._value === null || !this._isSourceEqual(this._value, t)) && (this._value = this._cloneSource(t), this._normalize(this._value));
    }
  }
  get value() {
    return this._value;
  }
  /**
   * Copy a color source internally.
   * @param value - Color source
   */
  _cloneSource(t) {
    return typeof t == "string" || typeof t == "number" || t instanceof Number || t === null ? t : Array.isArray(t) || ArrayBuffer.isView(t) ? t.slice(0) : typeof t == "object" && t !== null ? { ...t } : t;
  }
  /**
   * Equality check for color sources.
   * @param value1 - First color source
   * @param value2 - Second color source
   * @returns `true` if the color sources are equal, `false` otherwise.
   */
  _isSourceEqual(t, e) {
    const r = typeof t;
    if (r !== typeof e)
      return !1;
    if (r === "number" || r === "string" || t instanceof Number)
      return t === e;
    if (Array.isArray(t) && Array.isArray(e) || ArrayBuffer.isView(t) && ArrayBuffer.isView(e))
      return t.length !== e.length ? !1 : t.every((s, n) => s === e[n]);
    if (t !== null && e !== null) {
      const s = Object.keys(t), n = Object.keys(e);
      return s.length !== n.length ? !1 : s.every((o) => t[o] === e[o]);
    }
    return t === e;
  }
  /**
   * Convert to a RGBA color object.
   * @example
   * import { Color } from 'pixi.js';
   * new Color('white').toRgb(); // returns { r: 1, g: 1, b: 1, a: 1 }
   */
  toRgba() {
    const [t, e, r, s] = this._components;
    return { r: t, g: e, b: r, a: s };
  }
  /**
   * Convert to a RGB color object.
   * @example
   * import { Color } from 'pixi.js';
   * new Color('white').toRgb(); // returns { r: 1, g: 1, b: 1 }
   */
  toRgb() {
    const [t, e, r] = this._components;
    return { r: t, g: e, b: r };
  }
  /** Convert to a CSS-style rgba string: `rgba(255,255,255,1.0)`. */
  toRgbaString() {
    const [t, e, r] = this.toUint8RgbArray();
    return `rgba(${t},${e},${r},${this.alpha})`;
  }
  toUint8RgbArray(t) {
    const [e, r, s] = this._components;
    return this._arrayRgb || (this._arrayRgb = []), t = t || this._arrayRgb, t[0] = Math.round(e * 255), t[1] = Math.round(r * 255), t[2] = Math.round(s * 255), t;
  }
  toArray(t) {
    this._arrayRgba || (this._arrayRgba = []), t = t || this._arrayRgba;
    const [e, r, s, n] = this._components;
    return t[0] = e, t[1] = r, t[2] = s, t[3] = n, t;
  }
  toRgbArray(t) {
    this._arrayRgb || (this._arrayRgb = []), t = t || this._arrayRgb;
    const [e, r, s] = this._components;
    return t[0] = e, t[1] = r, t[2] = s, t;
  }
  /**
   * Convert to a hexadecimal number.
   * @example
   * import { Color } from 'pixi.js';
   * new Color('white').toNumber(); // returns 16777215
   */
  toNumber() {
    return this._int;
  }
  /**
   * Convert to a BGR number
   * @example
   * import { Color } from 'pixi.js';
   * new Color(0xffcc99).toBgrNumber(); // returns 0x99ccff
   */
  toBgrNumber() {
    const [t, e, r] = this.toUint8RgbArray();
    return (r << 16) + (e << 8) + t;
  }
  /**
   * Convert to a hexadecimal number in little endian format (e.g., BBGGRR).
   * @example
   * import { Color } from 'pixi.js';
   * new Color(0xffcc99).toLittleEndianNumber(); // returns 0x99ccff
   * @returns {number} - The color as a number in little endian format.
   */
  toLittleEndianNumber() {
    const t = this._int;
    return (t >> 16) + (t & 65280) + ((t & 255) << 16);
  }
  /**
   * Multiply with another color. This action is destructive, and will
   * override the previous `value` property to be `null`.
   * @param {ColorSource} value - The color to multiply by.
   */
  multiply(t) {
    const [e, r, s, n] = sr._temp.setValue(t)._components;
    return this._components[0] *= e, this._components[1] *= r, this._components[2] *= s, this._components[3] *= n, this._refreshInt(), this._value = null, this;
  }
  /**
   * Converts color to a premultiplied alpha format. This action is destructive, and will
   * override the previous `value` property to be `null`.
   * @param alpha - The alpha to multiply by.
   * @param {boolean} [applyToRGB=true] - Whether to premultiply RGB channels.
   * @returns {Color} - Itself.
   */
  premultiply(t, e = !0) {
    return e && (this._components[0] *= t, this._components[1] *= t, this._components[2] *= t), this._components[3] = t, this._refreshInt(), this._value = null, this;
  }
  /**
   * Premultiplies alpha with current color.
   * @param {number} alpha - The alpha to multiply by.
   * @param {boolean} [applyToRGB=true] - Whether to premultiply RGB channels.
   * @returns {number} tint multiplied by alpha
   */
  toPremultiplied(t, e = !0) {
    if (t === 1)
      return (255 << 24) + this._int;
    if (t === 0)
      return e ? 0 : this._int;
    let r = this._int >> 16 & 255, s = this._int >> 8 & 255, n = this._int & 255;
    return e && (r = r * t + 0.5 | 0, s = s * t + 0.5 | 0, n = n * t + 0.5 | 0), (t * 255 << 24) + (r << 16) + (s << 8) + n;
  }
  /**
   * Convert to a hexadecimal string.
   * @example
   * import { Color } from 'pixi.js';
   * new Color('white').toHex(); // returns "#ffffff"
   */
  toHex() {
    const t = this._int.toString(16);
    return `#${"000000".substring(0, 6 - t.length) + t}`;
  }
  /**
   * Convert to a hexadecimal string with alpha.
   * @example
   * import { Color } from 'pixi.js';
   * new Color('white').toHexa(); // returns "#ffffffff"
   */
  toHexa() {
    const t = Math.round(this._components[3] * 255).toString(16);
    return this.toHex() + "00".substring(0, 2 - t.length) + t;
  }
  /**
   * Set alpha, suitable for chaining.
   * @param alpha
   */
  setAlpha(t) {
    return this._components[3] = this._clamp(t), this;
  }
  /**
   * Normalize the input value into rgba
   * @param value - Input value
   */
  _normalize(t) {
    let e, r, s, n;
    if ((typeof t == "number" || t instanceof Number) && t >= 0 && t <= 16777215) {
      const o = t;
      e = (o >> 16 & 255) / 255, r = (o >> 8 & 255) / 255, s = (o & 255) / 255, n = 1;
    } else if ((Array.isArray(t) || t instanceof Float32Array) && t.length >= 3 && t.length <= 4)
      t = this._clamp(t), [e, r, s, n = 1] = t;
    else if ((t instanceof Uint8Array || t instanceof Uint8ClampedArray) && t.length >= 3 && t.length <= 4)
      t = this._clamp(t, 0, 255), [e, r, s, n = 255] = t, e /= 255, r /= 255, s /= 255, n /= 255;
    else if (typeof t == "string" || typeof t == "object") {
      if (typeof t == "string") {
        const a = sr.HEX_PATTERN.exec(t);
        a && (t = `#${a[2]}`);
      }
      const o = fe(t);
      o.isValid() && ({ r: e, g: r, b: s, a: n } = o.rgba, e /= 255, r /= 255, s /= 255);
    }
    if (e !== void 0)
      this._components[0] = e, this._components[1] = r, this._components[2] = s, this._components[3] = n, this._refreshInt();
    else
      throw new Error(`Unable to convert color ${t}`);
  }
  /** Refresh the internal color rgb number */
  _refreshInt() {
    this._clamp(this._components);
    const [t, e, r] = this._components;
    this._int = (t * 255 << 16) + (e * 255 << 8) + (r * 255 | 0);
  }
  /**
   * Clamps values to a range. Will override original values
   * @param value - Value(s) to clamp
   * @param min - Minimum value
   * @param max - Maximum value
   */
  _clamp(t, e = 0, r = 1) {
    return typeof t == "number" ? Math.min(Math.max(t, e), r) : (t.forEach((s, n) => {
      t[n] = Math.min(Math.max(s, e), r);
    }), t);
  }
  /**
   * Check if the value is a color-like object
   * @param value - Value to check
   * @returns True if the value is a color-like object
   * @static
   * @example
   * import { Color } from 'pixi.js';
   * Color.isColorLike('white'); // returns true
   * Color.isColorLike(0xffffff); // returns true
   * Color.isColorLike([1, 1, 1]); // returns true
   */
  static isColorLike(t) {
    return typeof t == "number" || typeof t == "string" || t instanceof Number || t instanceof sr || Array.isArray(t) || t instanceof Uint8Array || t instanceof Uint8ClampedArray || t instanceof Float32Array || t.r !== void 0 && t.g !== void 0 && t.b !== void 0 || t.r !== void 0 && t.g !== void 0 && t.b !== void 0 && t.a !== void 0 || t.h !== void 0 && t.s !== void 0 && t.l !== void 0 || t.h !== void 0 && t.s !== void 0 && t.l !== void 0 && t.a !== void 0 || t.h !== void 0 && t.s !== void 0 && t.v !== void 0 || t.h !== void 0 && t.s !== void 0 && t.v !== void 0 && t.a !== void 0;
  }
};
Fi.shared = new Fi();
Fi._temp = new Fi();
Fi.HEX_PATTERN = /^(#|0x)?(([a-f0-9]{3}){1,2}([a-f0-9]{2})?)$/i;
let gt = Fi;
const md = {
  cullArea: null,
  cullable: !1,
  cullableChildren: !0
};
class ko {
  /**
   * Constructs a new Pool.
   * @param ClassType - The constructor of the items in the pool.
   * @param {number} [initialSize] - The initial size of the pool.
   */
  constructor(t, e) {
    this._pool = [], this._count = 0, this._index = 0, this._classType = t, e && this.prepopulate(e);
  }
  /**
   * Prepopulates the pool with a given number of items.
   * @param total - The number of items to add to the pool.
   */
  prepopulate(t) {
    for (let e = 0; e < t; e++)
      this._pool[this._index++] = new this._classType();
    this._count += t;
  }
  /**
   * Gets an item from the pool. Calls the item's `init` method if it exists.
   * If there are no items left in the pool, a new one will be created.
   * @param {unknown} [data] - Optional data to pass to the item's constructor.
   * @returns {T} The item from the pool.
   */
  get(t) {
    var e;
    let r;
    return this._index > 0 ? r = this._pool[--this._index] : r = new this._classType(), (e = r.init) == null || e.call(r, t), r;
  }
  /**
   * Returns an item to the pool. Calls the item's `reset` method if it exists.
   * @param {T} item - The item to return to the pool.
   */
  return(t) {
    var e;
    (e = t.reset) == null || e.call(t), this._pool[this._index++] = t;
  }
  /**
   * Gets the number of items in the pool.
   * @readonly
   * @member {number}
   */
  get totalSize() {
    return this._count;
  }
  /**
   * Gets the number of items in the pool that are free to use without needing to create more.
   * @readonly
   * @member {number}
   */
  get totalFree() {
    return this._index;
  }
  /**
   * Gets the number of items in the pool that are currently in use.
   * @readonly
   * @member {number}
   */
  get totalUsed() {
    return this._count - this._index;
  }
  /** clears the pool - mainly used for debugging! */
  clear() {
    this._pool.length = 0, this._index = 0;
  }
}
class gd {
  constructor() {
    this._poolsByClass = /* @__PURE__ */ new Map();
  }
  /**
   * Prepopulates a specific pool with a given number of items.
   * @template T The type of items in the pool. Must extend PoolItem.
   * @param {PoolItemConstructor<T>} Class - The constructor of the items in the pool.
   * @param {number} total - The number of items to add to the pool.
   */
  prepopulate(t, e) {
    this.getPool(t).prepopulate(e);
  }
  /**
   * Gets an item from a specific pool.
   * @template T The type of items in the pool. Must extend PoolItem.
   * @param {PoolItemConstructor<T>} Class - The constructor of the items in the pool.
   * @param {unknown} [data] - Optional data to pass to the item's constructor.
   * @returns {T} The item from the pool.
   */
  get(t, e) {
    return this.getPool(t).get(e);
  }
  /**
   * Returns an item to its respective pool.
   * @param {PoolItem} item - The item to return to the pool.
   */
  return(t) {
    this.getPool(t.constructor).return(t);
  }
  /**
   * Gets a specific pool based on the class type.
   * @template T The type of items in the pool. Must extend PoolItem.
   * @param {PoolItemConstructor<T>} ClassType - The constructor of the items in the pool.
   * @returns {Pool<T>} The pool of the given class type.
   */
  getPool(t) {
    return this._poolsByClass.has(t) || this._poolsByClass.set(t, new ko(t)), this._poolsByClass.get(t);
  }
  /** gets the usage stats of each pool in the system */
  stats() {
    const t = {};
    return this._poolsByClass.forEach((e) => {
      const r = t[e._classType.name] ? e._classType.name + e._classType.ID : e._classType.name;
      t[r] = {
        free: e.totalFree,
        used: e.totalUsed,
        size: e.totalSize
      };
    }), t;
  }
}
const Ee = new gd();
function yd(i, t, e) {
  const r = i.length;
  let s;
  if (t >= r || e === 0)
    return;
  e = t + e > r ? r - t : e;
  const n = r - e;
  for (s = t; s < n; ++s)
    i[s] = i[s + e];
  i.length = n;
}
const xd = {
  allowChildren: !0,
  /**
   * Removes all children from this container that are within the begin and end indexes.
   * @param beginIndex - The beginning position.
   * @param endIndex - The ending position. Default value is size of the container.
   * @returns - List of removed children
   * @memberof scene.Container#
   */
  removeChildren(i = 0, t) {
    const e = t ?? this.children.length, r = e - i, s = [];
    if (r > 0 && r <= e) {
      for (let o = e - 1; o >= i; o--) {
        const a = this.children[o];
        a && (s.push(a), a.parent = null);
      }
      yd(this.children, i, e);
      const n = this.renderGroup || this.parentRenderGroup;
      n && n.removeChildren(s);
      for (let o = 0; o < s.length; ++o)
        this.emit("childRemoved", s[o], this, o), s[o].emit("removed", this);
      return s;
    } else if (r === 0 && this.children.length === 0)
      return s;
    throw new RangeError("removeChildren: numeric values are outside the acceptable range.");
  },
  /**
   * Removes a child from the specified index position.
   * @param index - The index to get the child from
   * @returns The child that was removed.
   * @memberof scene.Container#
   */
  removeChildAt(i) {
    const t = this.getChildAt(i);
    return this.removeChild(t);
  },
  /**
   * Returns the child at the specified index
   * @param index - The index to get the child at
   * @returns - The child at the given index, if any.
   * @memberof scene.Container#
   */
  getChildAt(i) {
    if (i < 0 || i >= this.children.length)
      throw new Error(`getChildAt: Index (${i}) does not exist.`);
    return this.children[i];
  },
  /**
   * Changes the position of an existing child in the container container
   * @param child - The child Container instance for which you want to change the index number
   * @param index - The resulting index number for the child container
   * @memberof scene.Container#
   */
  setChildIndex(i, t) {
    if (t < 0 || t >= this.children.length)
      throw new Error(`The index ${t} supplied is out of bounds ${this.children.length}`);
    this.getChildIndex(i), this.addChildAt(i, t);
  },
  /**
   * Returns the index position of a child Container instance
   * @param child - The Container instance to identify
   * @returns - The index position of the child container to identify
   * @memberof scene.Container#
   */
  getChildIndex(i) {
    const t = this.children.indexOf(i);
    if (t === -1)
      throw new Error("The supplied Container must be a child of the caller");
    return t;
  },
  /**
   * Adds a child to the container at a specified index. If the index is out of bounds an error will be thrown.
   * If the child is already in this container, it will be moved to the specified index.
   * @param {Container} child - The child to add.
   * @param {number} index - The absolute index where the child will be positioned at the end of the operation.
   * @returns {Container} The child that was added.
   * @memberof scene.Container#
   */
  addChildAt(i, t) {
    this.allowChildren || X(q, "addChildAt: Only Containers will be allowed to add children in v8.0.0");
    const { children: e } = this;
    if (t < 0 || t > e.length)
      throw new Error(`${i}addChildAt: The index ${t} supplied is out of bounds ${e.length}`);
    if (i.parent) {
      const s = i.parent.children.indexOf(i);
      if (i.parent === this && s === t)
        return i;
      s !== -1 && i.parent.children.splice(s, 1);
    }
    t === e.length ? e.push(i) : e.splice(t, 0, i), i.parent = this, i.didChange = !0, i._updateFlags = 15;
    const r = this.renderGroup || this.parentRenderGroup;
    return r && r.addChild(i), this.sortableChildren && (this.sortDirty = !0), this.emit("childAdded", i, this, t), i.emit("added", this), i;
  },
  /**
   * Swaps the position of 2 Containers within this container.
   * @param child - First container to swap
   * @param child2 - Second container to swap
   * @memberof scene.Container#
   */
  swapChildren(i, t) {
    if (i === t)
      return;
    const e = this.getChildIndex(i), r = this.getChildIndex(t);
    this.children[e] = t, this.children[r] = i;
    const s = this.renderGroup || this.parentRenderGroup;
    s && (s.structureDidChange = !0), this._didContainerChangeTick++;
  },
  /**
   * Remove the Container from its parent Container. If the Container has no parent, do nothing.
   * @memberof scene.Container#
   */
  removeFromParent() {
    var i;
    (i = this.parent) == null || i.removeChild(this);
  },
  /**
   * Reparent the child to this container, keeping the same worldTransform.
   * @param child - The child to reparent
   * @returns The first child that was reparented.
   * @memberof scene.Container#
   */
  reparentChild(...i) {
    return i.length === 1 ? this.reparentChildAt(i[0], this.children.length) : (i.forEach((t) => this.reparentChildAt(t, this.children.length)), i[0]);
  },
  /**
   * Reparent the child to this container at the specified index, keeping the same worldTransform.
   * @param child - The child to reparent
   * @param index - The index to reparent the child to
   * @memberof scene.Container#
   */
  reparentChildAt(i, t) {
    if (i.parent === this)
      return this.setChildIndex(i, t), i;
    const e = i.worldTransform.clone();
    i.removeFromParent(), this.addChildAt(i, t);
    const r = this.worldTransform.clone();
    return r.invert(), e.prepend(r), i.setFromMatrix(e), i;
  }
};
class Pa {
  constructor() {
    this.pipe = "filter", this.priority = 1;
  }
  destroy() {
    for (let t = 0; t < this.filters.length; t++)
      this.filters[t].destroy();
    this.filters = null, this.filterArea = null;
  }
}
class vd {
  constructor() {
    this._effectClasses = [], this._tests = [], this._initialized = !1;
  }
  init() {
    this._initialized || (this._initialized = !0, this._effectClasses.forEach((t) => {
      this.add({
        test: t.test,
        maskClass: t
      });
    }));
  }
  add(t) {
    this._tests.push(t);
  }
  getMaskEffect(t) {
    this._initialized || this.init();
    for (let e = 0; e < this._tests.length; e++) {
      const r = this._tests[e];
      if (r.test(t))
        return Ee.get(r.maskClass, t);
    }
    return t;
  }
  returnMaskEffect(t) {
    Ee.return(t);
  }
}
const Gs = new vd();
Mt.handleByList(D.MaskEffect, Gs._effectClasses);
const bd = {
  _maskEffect: null,
  _maskOptions: {
    inverse: !1
  },
  _filterEffect: null,
  /**
   * @todo Needs docs.
   * @memberof scene.Container#
   * @type {Array<Effect>}
   */
  effects: [],
  /**
   * @todo Needs docs.
   * @param effect - The effect to add.
   * @memberof scene.Container#
   * @ignore
   */
  addEffect(i) {
    if (this.effects.indexOf(i) !== -1)
      return;
    this.effects.push(i), this.effects.sort((e, r) => e.priority - r.priority);
    const t = this.renderGroup || this.parentRenderGroup;
    t && (t.structureDidChange = !0), this._updateIsSimple();
  },
  /**
   * @todo Needs docs.
   * @param effect - The effect to remove.
   * @memberof scene.Container#
   * @ignore
   */
  removeEffect(i) {
    const t = this.effects.indexOf(i);
    t !== -1 && (this.effects.splice(t, 1), this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateIsSimple());
  },
  set mask(i) {
    const t = this._maskEffect;
    (t == null ? void 0 : t.mask) !== i && (t && (this.removeEffect(t), Gs.returnMaskEffect(t), this._maskEffect = null), i != null && (this._maskEffect = Gs.getMaskEffect(i), this.addEffect(this._maskEffect)));
  },
  /**
   * Used to set mask and control mask options.
   * @param options
   * @example
   * import { Graphics, Sprite } from 'pixi.js';
   *
   * const graphics = new Graphics();
   * graphics.beginFill(0xFF3300);
   * graphics.drawRect(50, 250, 100, 100);
   * graphics.endFill();
   *
   * const sprite = new Sprite(texture);
   * sprite.setMask({
   *     mask: graphics,
   *     inverse: true,
   * });
   * @memberof scene.Container#
   */
  setMask(i) {
    this._maskOptions = {
      ...this._maskOptions,
      ...i
    }, i.mask && (this.mask = i.mask);
  },
  /**
   * Sets a mask for the displayObject. A mask is an object that limits the visibility of an
   * object to the shape of the mask applied to it. In PixiJS a regular mask must be a
   * {@link Graphics} or a {@link Sprite} object. This allows for much faster masking in canvas as it
   * utilities shape clipping. Furthermore, a mask of an object must be in the subtree of its parent.
   * Otherwise, `getLocalBounds` may calculate incorrect bounds, which makes the container's width and height wrong.
   * To remove a mask, set this property to `null`.
   *
   * For sprite mask both alpha and red channel are used. Black mask is the same as transparent mask.
   * @example
   * import { Graphics, Sprite } from 'pixi.js';
   *
   * const graphics = new Graphics();
   * graphics.beginFill(0xFF3300);
   * graphics.drawRect(50, 250, 100, 100);
   * graphics.endFill();
   *
   * const sprite = new Sprite(texture);
   * sprite.mask = graphics;
   * @memberof scene.Container#
   */
  get mask() {
    var i;
    return (i = this._maskEffect) == null ? void 0 : i.mask;
  },
  set filters(i) {
    var t;
    !Array.isArray(i) && i && (i = [i]);
    const e = this._filterEffect || (this._filterEffect = new Pa());
    i = i;
    const r = (i == null ? void 0 : i.length) > 0, s = ((t = e.filters) == null ? void 0 : t.length) > 0, n = r !== s;
    i = Array.isArray(i) ? i.slice(0) : i, e.filters = Object.freeze(i), n && (r ? this.addEffect(e) : (this.removeEffect(e), e.filters = i ?? null));
  },
  /**
   * Sets the filters for the displayObject.
   * IMPORTANT: This is a WebGL only feature and will be ignored by the canvas renderer.
   * To remove filters simply set this property to `'null'`.
   * @memberof scene.Container#
   */
  get filters() {
    var i;
    return (i = this._filterEffect) == null ? void 0 : i.filters;
  },
  set filterArea(i) {
    this._filterEffect || (this._filterEffect = new Pa()), this._filterEffect.filterArea = i;
  },
  /**
   * The area the filter is applied to. This is used as more of an optimization
   * rather than figuring out the dimensions of the displayObject each frame you can set this rectangle.
   *
   * Also works as an interaction mask.
   * @memberof scene.Container#
   */
  get filterArea() {
    var i;
    return (i = this._filterEffect) == null ? void 0 : i.filterArea;
  }
}, _d = {
  /**
   * The instance label of the object.
   * @memberof scene.Container#
   * @member {string} label
   */
  label: null,
  /**
   * The instance name of the object.
   * @deprecated since 8.0.0
   * @see scene.Container#label
   * @member {string} name
   * @memberof scene.Container#
   */
  get name() {
    return X(q, "Container.name property has been removed, use Container.label instead"), this.label;
  },
  set name(i) {
    X(q, "Container.name property has been removed, use Container.label instead"), this.label = i;
  },
  /**
   * @method getChildByName
   * @deprecated since 8.0.0
   * @param {string} name - Instance name.
   * @param {boolean}[deep=false] - Whether to search recursively
   * @returns {Container} The child with the specified name.
   * @see scene.Container#getChildByLabel
   * @memberof scene.Container#
   */
  getChildByName(i, t = !1) {
    return this.getChildByLabel(i, t);
  },
  /**
   * Returns the first child in the container with the specified label.
   *
   * Recursive searches are done in a pre-order traversal.
   * @memberof scene.Container#
   * @param {string|RegExp} label - Instance label.
   * @param {boolean}[deep=false] - Whether to search recursively
   * @returns {Container} The child with the specified label.
   */
  getChildByLabel(i, t = !1) {
    const e = this.children;
    for (let r = 0; r < e.length; r++) {
      const s = e[r];
      if (s.label === i || i instanceof RegExp && i.test(s.label))
        return s;
    }
    if (t)
      for (let r = 0; r < e.length; r++) {
        const s = e[r].getChildByLabel(i, !0);
        if (s)
          return s;
      }
    return null;
  },
  /**
   * Returns all children in the container with the specified label.
   * @memberof scene.Container#
   * @param {string|RegExp} label - Instance label.
   * @param {boolean}[deep=false] - Whether to search recursively
   * @param {Container[]} [out=[]] - The array to store matching children in.
   * @returns {Container[]} An array of children with the specified label.
   */
  getChildrenByLabel(i, t = !1, e = []) {
    const r = this.children;
    for (let s = 0; s < r.length; s++) {
      const n = r[s];
      (n.label === i || i instanceof RegExp && i.test(n.label)) && e.push(n);
    }
    if (t)
      for (let s = 0; s < r.length; s++)
        r[s].getChildrenByLabel(i, !0, e);
    return e;
  }
}, Be = new ko(K), Li = new ko(_e);
function ol(i, t, e) {
  e.clear();
  let r, s;
  return i.parent ? t ? r = i.parent.worldTransform : (s = Be.get().identity(), r = ln(i, s)) : r = K.IDENTITY, al(i, e, r, t), s && Be.return(s), e.isValid || e.set(0, 0, 0, 0), e;
}
function al(i, t, e, r) {
  var s, n;
  if (!i.visible || !i.measurable)
    return;
  let o;
  r ? o = i.worldTransform : (i.updateLocalTransform(), o = Be.get(), o.appendFrom(i.localTransform, e));
  const a = t, h = !!i.effects.length;
  if (h && (t = Li.get().clear()), i.boundsArea)
    t.addRect(i.boundsArea, o);
  else {
    i.addBounds && (t.matrix = o, i.addBounds(t));
    for (let c = 0; c < i.children.length; c++)
      al(i.children[c], t, o, r);
  }
  if (h) {
    for (let c = 0; c < i.effects.length; c++)
      (n = (s = i.effects[c]).addBounds) == null || n.call(s, t);
    a.addBounds(t, K.IDENTITY), Li.return(t);
  }
  r || Be.return(o);
}
function ln(i, t) {
  const e = i.parent;
  return e && (ln(e, t), e.updateLocalTransform(), t.append(e.localTransform)), t;
}
let ts = 0;
const ka = 500;
function dt(...i) {
  ts !== ka && (ts++, ts === ka ? console.warn("PixiJS Warning: too many warnings, no more warnings will be reported to the console by PixiJS.") : console.warn("PixiJS Warning: ", ...i));
}
function hl(i, t, e) {
  return t.clear(), e || (e = K.IDENTITY), ll(i, t, e, i, !0), t.isValid || t.set(0, 0, 0, 0), t;
}
function ll(i, t, e, r, s) {
  var n, o;
  let a;
  if (s)
    a = Be.get(), a = e.copyTo(a);
  else {
    if (!i.visible || !i.measurable)
      return;
    i.updateLocalTransform();
    const l = i.localTransform;
    a = Be.get(), a.appendFrom(l, e);
  }
  const h = t, c = !!i.effects.length;
  if (c && (t = Li.get().clear()), i.boundsArea)
    t.addRect(i.boundsArea, a);
  else {
    i.renderPipeId && (t.matrix = a, i.addBounds(t));
    const l = i.children;
    for (let f = 0; f < l.length; f++)
      ll(l[f], t, a, r, !1);
  }
  if (c) {
    for (let l = 0; l < i.effects.length; l++)
      (o = (n = i.effects[l]).addLocalBounds) == null || o.call(n, t, r);
    h.addBounds(t, K.IDENTITY), Li.return(t);
  }
  Be.return(a);
}
function cl(i, t) {
  const e = i.children;
  for (let r = 0; r < e.length; r++) {
    const s = e[r], n = s.uid, o = (s._didViewChangeTick & 65535) << 16 | s._didContainerChangeTick & 65535, a = t.index;
    (t.data[a] !== n || t.data[a + 1] !== o) && (t.data[t.index] = n, t.data[t.index + 1] = o, t.didChange = !0), t.index = a + 2, s.children.length && cl(s, t);
  }
  return t.didChange;
}
const wd = new K(), Ad = {
  _localBoundsCacheId: -1,
  _localBoundsCacheData: null,
  _setWidth(i, t) {
    const e = Math.sign(this.scale.x) || 1;
    t !== 0 ? this.scale.x = i / t * e : this.scale.x = e;
  },
  _setHeight(i, t) {
    const e = Math.sign(this.scale.y) || 1;
    t !== 0 ? this.scale.y = i / t * e : this.scale.y = e;
  },
  /**
   * Retrieves the local bounds of the container as a Bounds object.
   * @returns - The bounding area.
   * @memberof scene.Container#
   */
  getLocalBounds() {
    this._localBoundsCacheData || (this._localBoundsCacheData = {
      data: [],
      index: 1,
      didChange: !1,
      localBounds: new _e()
    });
    const i = this._localBoundsCacheData;
    return i.index = 1, i.didChange = !1, i.data[0] !== this._didViewChangeTick && (i.didChange = !0, i.data[0] = this._didViewChangeTick), cl(this, i), i.didChange && hl(this, i.localBounds, wd), i.localBounds;
  },
  /**
   * Calculates and returns the (world) bounds of the display object as a [Rectangle]{@link Rectangle}.
   * @param skipUpdate - Setting to `true` will stop the transforms of the scene graph from
   *  being updated. This means the calculation returned MAY be out of date BUT will give you a
   *  nice performance boost.
   * @param bounds - Optional bounds to store the result of the bounds calculation.
   * @returns - The minimum axis-aligned rectangle in world space that fits around this object.
   * @memberof scene.Container#
   */
  getBounds(i, t) {
    return ol(this, i, t || new _e());
  }
}, Sd = {
  _onRender: null,
  set onRender(i) {
    const t = this.renderGroup || this.parentRenderGroup;
    if (!i) {
      this._onRender && (t == null || t.removeOnRender(this)), this._onRender = null;
      return;
    }
    this._onRender || t == null || t.addOnRender(this), this._onRender = i;
  },
  /**
   * This callback is used when the container is rendered. This is where you should add your custom
   * logic that is needed to be run every frame.
   *
   * In v7 many users used `updateTransform` for this, however the way v8 renders objects is different
   * and "updateTransform" is no longer called every frame
   * @example
   * const container = new Container();
   * container.onRender = () => {
   *    container.rotation += 0.01;
   * };
   * @memberof scene.Container#
   */
  get onRender() {
    return this._onRender;
  }
}, Cd = {
  _zIndex: 0,
  /**
   * Should children be sorted by zIndex at the next render call.
   *
   * Will get automatically set to true if a new child is added, or if a child's zIndex changes.
   * @type {boolean}
   * @memberof scene.Container#
   */
  sortDirty: !1,
  /**
   * If set to true, the container will sort its children by `zIndex` value
   * when the next render is called, or manually if `sortChildren()` is called.
   *
   * This actually changes the order of elements in the array, so should be treated
   * as a basic solution that is not performant compared to other solutions,
   * such as {@link https://github.com/pixijs/layers PixiJS Layers}
   *
   * Also be aware of that this may not work nicely with the `addChildAt()` function,
   * as the `zIndex` sorting may cause the child to automatically sorted to another position.
   * @type {boolean}
   * @memberof scene.Container#
   */
  sortableChildren: !1,
  /**
   * The zIndex of the container.
   *
   * Setting this value, will automatically set the parent to be sortable. Children will be automatically
   * sorted by zIndex value; a higher value will mean it will be moved towards the end of the array,
   * and thus rendered on top of other display objects within the same container.
   * @see scene.Container#sortableChildren
   * @memberof scene.Container#
   */
  get zIndex() {
    return this._zIndex;
  },
  set zIndex(i) {
    this._zIndex !== i && (this._zIndex = i, this.depthOfChildModified());
  },
  depthOfChildModified() {
    this.parent && (this.parent.sortableChildren = !0, this.parent.sortDirty = !0), this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0);
  },
  /**
   * Sorts children by zIndex.
   * @memberof scene.Container#
   */
  sortChildren() {
    this.sortDirty && (this.sortDirty = !1, this.children.sort(Pd));
  }
};
function Pd(i, t) {
  return i._zIndex - t._zIndex;
}
const kd = {
  /**
   * Returns the global position of the container.
   * @param point - The optional point to write the global value to.
   * @param skipUpdate - Should we skip the update transform.
   * @returns - The updated point.
   * @memberof scene.Container#
   */
  getGlobalPosition(i = new kt(), t = !1) {
    return this.parent ? this.parent.toGlobal(this._position, i, t) : (i.x = this._position.x, i.y = this._position.y), i;
  },
  /**
   * Calculates the global position of the container.
   * @param position - The world origin to calculate from.
   * @param point - A Point object in which to store the value, optional
   *  (otherwise will create a new Point).
   * @param skipUpdate - Should we skip the update transform.
   * @returns - A point object representing the position of this object.
   * @memberof scene.Container#
   */
  toGlobal(i, t, e = !1) {
    if (!e) {
      this.updateLocalTransform();
      const r = ln(this, new K());
      return r.append(this.localTransform), r.apply(i, t);
    }
    return this.worldTransform.apply(i, t);
  },
  /**
   * Calculates the local position of the container relative to another point.
   * @param position - The world origin to calculate from.
   * @param from - The Container to calculate the global position from.
   * @param point - A Point object in which to store the value, optional
   *  (otherwise will create a new Point).
   * @param skipUpdate - Should we skip the update transform
   * @returns - A point object representing the position of this object
   * @memberof scene.Container#
   */
  toLocal(i, t, e, r) {
    if (t && (i = t.toGlobal(i, e, r)), !r) {
      this.updateLocalTransform();
      const s = ln(this, new K());
      return s.append(this.localTransform), s.applyInverse(i, e);
    }
    return this.worldTransform.applyInverse(i, e);
  }
};
let Md = 0;
class ul {
  constructor() {
    this.uid = vt("instructionSet"), this.instructions = [], this.instructionSize = 0, this.renderables = [], this.tick = 0;
  }
  /** reset the instruction set so it can be reused set size back to 0 */
  reset() {
    this.instructionSize = 0, this.tick = Md++;
  }
  /**
   * Add an instruction to the set
   * @param instruction - add an instruction to the set
   */
  add(t) {
    this.instructions[this.instructionSize++] = t;
  }
  /**
   * Log the instructions to the console (for debugging)
   * @internal
   * @ignore
   */
  log() {
    this.instructions.length = this.instructionSize, console.table(this.instructions, ["type", "action"]);
  }
}
class Td {
  constructor() {
    this.renderPipeId = "renderGroup", this.root = null, this.canBundle = !1, this.renderGroupParent = null, this.renderGroupChildren = [], this.worldTransform = new K(), this.worldColorAlpha = 4294967295, this.worldColor = 16777215, this.worldAlpha = 1, this.childrenToUpdate = /* @__PURE__ */ Object.create(null), this.updateTick = 0, this.childrenRenderablesToUpdate = { list: [], index: 0 }, this.structureDidChange = !0, this.instructionSet = new ul(), this._onRenderContainers = [];
  }
  init(t) {
    this.root = t, t._onRender && this.addOnRender(t), t.didChange = !0;
    const e = t.children;
    for (let r = 0; r < e.length; r++)
      this.addChild(e[r]);
  }
  reset() {
    this.renderGroupChildren.length = 0;
    for (const t in this.childrenToUpdate) {
      const e = this.childrenToUpdate[t];
      e.list.fill(null), e.index = 0;
    }
    this.childrenRenderablesToUpdate.index = 0, this.childrenRenderablesToUpdate.list.fill(null), this.root = null, this.updateTick = 0, this.structureDidChange = !0, this._onRenderContainers.length = 0, this.renderGroupParent = null;
  }
  get localTransform() {
    return this.root.localTransform;
  }
  addRenderGroupChild(t) {
    t.renderGroupParent && t.renderGroupParent._removeRenderGroupChild(t), t.renderGroupParent = this, this.renderGroupChildren.push(t);
  }
  _removeRenderGroupChild(t) {
    const e = this.renderGroupChildren.indexOf(t);
    e > -1 && this.renderGroupChildren.splice(e, 1), t.renderGroupParent = null;
  }
  addChild(t) {
    if (this.structureDidChange = !0, t.parentRenderGroup = this, t.updateTick = -1, t.parent === this.root ? t.relativeRenderGroupDepth = 1 : t.relativeRenderGroupDepth = t.parent.relativeRenderGroupDepth + 1, t.didChange = !0, this.onChildUpdate(t), t.renderGroup) {
      this.addRenderGroupChild(t.renderGroup);
      return;
    }
    t._onRender && this.addOnRender(t);
    const e = t.children;
    for (let r = 0; r < e.length; r++)
      this.addChild(e[r]);
  }
  removeChild(t) {
    if (this.structureDidChange = !0, t._onRender && (t.renderGroup || this.removeOnRender(t)), t.parentRenderGroup = null, t.renderGroup) {
      this._removeRenderGroupChild(t.renderGroup);
      return;
    }
    const e = t.children;
    for (let r = 0; r < e.length; r++)
      this.removeChild(e[r]);
  }
  removeChildren(t) {
    for (let e = 0; e < t.length; e++)
      this.removeChild(t[e]);
  }
  onChildUpdate(t) {
    let e = this.childrenToUpdate[t.relativeRenderGroupDepth];
    e || (e = this.childrenToUpdate[t.relativeRenderGroupDepth] = {
      index: 0,
      list: []
    }), e.list[e.index++] = t;
  }
  updateRenderable(t) {
    t.globalDisplayStatus < 7 || (this.instructionSet.renderPipes[t.renderPipeId].updateRenderable(t), t.didViewUpdate = !1);
  }
  onChildViewUpdate(t) {
    this.childrenRenderablesToUpdate.list[this.childrenRenderablesToUpdate.index++] = t;
  }
  get isRenderable() {
    return this.root.localDisplayStatus === 7 && this.worldAlpha > 0;
  }
  /**
   * adding a container to the onRender list will make sure the user function
   * passed in to the user defined 'onRender` callBack
   * @param container - the container to add to the onRender list
   */
  addOnRender(t) {
    this._onRenderContainers.push(t);
  }
  removeOnRender(t) {
    this._onRenderContainers.splice(this._onRenderContainers.indexOf(t), 1);
  }
  runOnRender() {
    for (let t = 0; t < this._onRenderContainers.length; t++)
      this._onRenderContainers[t]._onRender();
  }
  destroy() {
    this.renderGroupParent = null, this.root = null, this.childrenRenderablesToUpdate = null, this.childrenToUpdate = null, this.renderGroupChildren = null, this._onRenderContainers = null, this.instructionSet = null;
  }
  getChildren(t = []) {
    const e = this.root.children;
    for (let r = 0; r < e.length; r++)
      this._getChildren(e[r], t);
    return t;
  }
  _getChildren(t, e = []) {
    if (e.push(t), t.renderGroup)
      return e;
    const r = t.children;
    for (let s = 0; s < r.length; s++)
      this._getChildren(r[s], e);
    return e;
  }
}
function Ed(i, t, e = {}) {
  for (const r in t)
    !e[r] && t[r] !== void 0 && (i[r] = t[r]);
}
const es = new xt(null), is = new xt(null), rs = new xt(null, 1, 1), Ma = 1, Bd = 2, ns = 4;
class Ot extends Bt {
  constructor(t = {}) {
    var e, r;
    super(), this.uid = vt("renderable"), this._updateFlags = 15, this.renderGroup = null, this.parentRenderGroup = null, this.parentRenderGroupIndex = 0, this.didChange = !1, this.didViewUpdate = !1, this.relativeRenderGroupDepth = 0, this.children = [], this.parent = null, this.includeInBuild = !0, this.measurable = !0, this.isSimple = !0, this.updateTick = -1, this.localTransform = new K(), this.relativeGroupTransform = new K(), this.groupTransform = this.relativeGroupTransform, this.destroyed = !1, this._position = new xt(this, 0, 0), this._scale = rs, this._pivot = is, this._skew = es, this._cx = 1, this._sx = 0, this._cy = 0, this._sy = 1, this._rotation = 0, this.localColor = 16777215, this.localAlpha = 1, this.groupAlpha = 1, this.groupColor = 16777215, this.groupColorAlpha = 4294967295, this.localBlendMode = "inherit", this.groupBlendMode = "normal", this.localDisplayStatus = 7, this.globalDisplayStatus = 7, this._didContainerChangeTick = 0, this._didViewChangeTick = 0, this._didLocalTransformChangeId = -1, this.effects = [], Ed(this, t, {
      children: !0,
      parent: !0,
      effects: !0
    }), (e = t.children) == null || e.forEach((s) => this.addChild(s)), (r = t.parent) == null || r.addChild(this);
  }
  /**
   * Mixes all enumerable properties and methods from a source object to Container.
   * @param source - The source of properties and methods to mix in.
   */
  static mixin(t) {
    Object.defineProperties(Ot.prototype, Object.getOwnPropertyDescriptors(t));
  }
  /**
   * We now use the _didContainerChangeTick and _didViewChangeTick to track changes
   * @deprecated since 8.2.6
   * @ignore
   */
  set _didChangeId(t) {
    this._didViewChangeTick = t >> 12 & 4095, this._didContainerChangeTick = t & 4095;
  }
  get _didChangeId() {
    return this._didContainerChangeTick & 4095 | (this._didViewChangeTick & 4095) << 12;
  }
  /**
   * Adds one or more children to the container.
   *
   * Multiple items can be added like so: `myContainer.addChild(thingOne, thingTwo, thingThree)`
   * @param {...Container} children - The Container(s) to add to the container
   * @returns {Container} - The first child that was added.
   */
  addChild(...t) {
    if (this.allowChildren || X(q, "addChild: Only Containers will be allowed to add children in v8.0.0"), t.length > 1) {
      for (let s = 0; s < t.length; s++)
        this.addChild(t[s]);
      return t[0];
    }
    const e = t[0];
    if (e.parent === this)
      return this.children.splice(this.children.indexOf(e), 1), this.children.push(e), this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), e;
    e.parent && e.parent.removeChild(e), this.children.push(e), this.sortableChildren && (this.sortDirty = !0), e.parent = this, e.didChange = !0, e._updateFlags = 15;
    const r = this.renderGroup || this.parentRenderGroup;
    return r && r.addChild(e), this.emit("childAdded", e, this, this.children.length - 1), e.emit("added", this), this._didViewChangeTick++, e._zIndex !== 0 && e.depthOfChildModified(), e;
  }
  /**
   * Removes one or more children from the container.
   * @param {...Container} children - The Container(s) to remove
   * @returns {Container} The first child that was removed.
   */
  removeChild(...t) {
    if (t.length > 1) {
      for (let s = 0; s < t.length; s++)
        this.removeChild(t[s]);
      return t[0];
    }
    const e = t[0], r = this.children.indexOf(e);
    return r > -1 && (this._didViewChangeTick++, this.children.splice(r, 1), this.renderGroup ? this.renderGroup.removeChild(e) : this.parentRenderGroup && this.parentRenderGroup.removeChild(e), e.parent = null, this.emit("childRemoved", e, this, r), e.emit("removed", this)), e;
  }
  /** @ignore */
  _onUpdate(t) {
    t && t === this._skew && this._updateSkew(), this._didContainerChangeTick++, !this.didChange && (this.didChange = !0, this.parentRenderGroup && this.parentRenderGroup.onChildUpdate(this));
  }
  set isRenderGroup(t) {
    !!this.renderGroup !== t && (t ? this.enableRenderGroup() : this.disableRenderGroup());
  }
  /**
   * Returns true if this container is a render group.
   * This means that it will be rendered as a separate pass, with its own set of instructions
   */
  get isRenderGroup() {
    return !!this.renderGroup;
  }
  /**
   * Calling this enables a render group for this container.
   * This means it will be rendered as a separate set of instructions.
   * The transform of the container will also be handled on the GPU rather than the CPU.
   */
  enableRenderGroup() {
    if (this.renderGroup)
      return;
    const t = this.parentRenderGroup;
    t == null || t.removeChild(this), this.renderGroup = Ee.get(Td, this), this.groupTransform = K.IDENTITY, t == null || t.addChild(this), this._updateIsSimple();
  }
  /** This will disable the render group for this container. */
  disableRenderGroup() {
    if (!this.renderGroup)
      return;
    const t = this.parentRenderGroup;
    t == null || t.removeChild(this), Ee.return(this.renderGroup), this.renderGroup = null, this.groupTransform = this.relativeGroupTransform, t == null || t.addChild(this), this._updateIsSimple();
  }
  /** @ignore */
  _updateIsSimple() {
    this.isSimple = !this.renderGroup && this.effects.length === 0;
  }
  /**
   * Current transform of the object based on world (parent) factors.
   * @readonly
   */
  get worldTransform() {
    return this._worldTransform || (this._worldTransform = new K()), this.renderGroup ? this._worldTransform.copyFrom(this.renderGroup.worldTransform) : this.parentRenderGroup && this._worldTransform.appendFrom(this.relativeGroupTransform, this.parentRenderGroup.worldTransform), this._worldTransform;
  }
  // / ////// transform related stuff
  /**
   * The position of the container on the x axis relative to the local coordinates of the parent.
   * An alias to position.x
   */
  get x() {
    return this._position.x;
  }
  set x(t) {
    this._position.x = t;
  }
  /**
   * The position of the container on the y axis relative to the local coordinates of the parent.
   * An alias to position.y
   */
  get y() {
    return this._position.y;
  }
  set y(t) {
    this._position.y = t;
  }
  /**
   * The coordinate of the object relative to the local coordinates of the parent.
   * @since 4.0.0
   */
  get position() {
    return this._position;
  }
  set position(t) {
    this._position.copyFrom(t);
  }
  /**
   * The rotation of the object in radians.
   * 'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.
   */
  get rotation() {
    return this._rotation;
  }
  set rotation(t) {
    this._rotation !== t && (this._rotation = t, this._onUpdate(this._skew));
  }
  /**
   * The angle of the object in degrees.
   * 'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.
   */
  get angle() {
    return this.rotation * Ku;
  }
  set angle(t) {
    this.rotation = t * Qu;
  }
  /**
   * The center of rotation, scaling, and skewing for this display object in its local space. The `position`
   * is the projection of `pivot` in the parent's local space.
   *
   * By default, the pivot is the origin (0, 0).
   * @since 4.0.0
   */
  get pivot() {
    return this._pivot === is && (this._pivot = new xt(this, 0, 0)), this._pivot;
  }
  set pivot(t) {
    this._pivot === is && (this._pivot = new xt(this, 0, 0)), typeof t == "number" ? this._pivot.set(t) : this._pivot.copyFrom(t);
  }
  /**
   * The skew factor for the object in radians.
   * @since 4.0.0
   */
  get skew() {
    return this._skew === es && (this._skew = new xt(this, 0, 0)), this._skew;
  }
  set skew(t) {
    this._skew === es && (this._skew = new xt(this, 0, 0)), this._skew.copyFrom(t);
  }
  /**
   * The scale factors of this object along the local coordinate axes.
   *
   * The default scale is (1, 1).
   * @since 4.0.0
   */
  get scale() {
    return this._scale === rs && (this._scale = new xt(this, 1, 1)), this._scale;
  }
  set scale(t) {
    this._scale === rs && (this._scale = new xt(this, 0, 0)), typeof t == "number" ? this._scale.set(t) : this._scale.copyFrom(t);
  }
  /**
   * The width of the Container, setting this will actually modify the scale to achieve the value set.
   * @memberof scene.Container#
   */
  get width() {
    return Math.abs(this.scale.x * this.getLocalBounds().width);
  }
  set width(t) {
    const e = this.getLocalBounds().width;
    this._setWidth(t, e);
  }
  /**
   * The height of the Container, setting this will actually modify the scale to achieve the value set.
   * @memberof scene.Container#
   */
  get height() {
    return Math.abs(this.scale.y * this.getLocalBounds().height);
  }
  set height(t) {
    const e = this.getLocalBounds().height;
    this._setHeight(t, e);
  }
  /**
   * Retrieves the size of the container as a [Size]{@link Size} object.
   * This is faster than get the width and height separately.
   * @param out - Optional object to store the size in.
   * @returns - The size of the container.
   * @memberof scene.Container#
   */
  getSize(t) {
    t || (t = {});
    const e = this.getLocalBounds();
    return t.width = Math.abs(this.scale.x * e.width), t.height = Math.abs(this.scale.y * e.height), t;
  }
  /**
   * Sets the size of the container to the specified width and height.
   * This is faster than setting the width and height separately.
   * @param value - This can be either a number or a [Size]{@link Size} object.
   * @param height - The height to set. Defaults to the value of `width` if not provided.
   * @memberof scene.Container#
   */
  setSize(t, e) {
    const r = this.getLocalBounds();
    typeof t == "object" ? (e = t.height ?? t.width, t = t.width) : e ?? (e = t), t !== void 0 && this._setWidth(t, r.width), e !== void 0 && this._setHeight(e, r.height);
  }
  /** Called when the skew or the rotation changes. */
  _updateSkew() {
    const t = this._rotation, e = this._skew;
    this._cx = Math.cos(t + e._y), this._sx = Math.sin(t + e._y), this._cy = -Math.sin(t - e._x), this._sy = Math.cos(t - e._x);
  }
  /**
   * Updates the transform properties of the container (accepts partial values).
   * @param {object} opts - The options for updating the transform.
   * @param {number} opts.x - The x position of the container.
   * @param {number} opts.y - The y position of the container.
   * @param {number} opts.scaleX - The scale factor on the x-axis.
   * @param {number} opts.scaleY - The scale factor on the y-axis.
   * @param {number} opts.rotation - The rotation of the container, in radians.
   * @param {number} opts.skewX - The skew factor on the x-axis.
   * @param {number} opts.skewY - The skew factor on the y-axis.
   * @param {number} opts.pivotX - The x coordinate of the pivot point.
   * @param {number} opts.pivotY - The y coordinate of the pivot point.
   */
  updateTransform(t) {
    return this.position.set(
      typeof t.x == "number" ? t.x : this.position.x,
      typeof t.y == "number" ? t.y : this.position.y
    ), this.scale.set(
      typeof t.scaleX == "number" ? t.scaleX || 1 : this.scale.x,
      typeof t.scaleY == "number" ? t.scaleY || 1 : this.scale.y
    ), this.rotation = typeof t.rotation == "number" ? t.rotation : this.rotation, this.skew.set(
      typeof t.skewX == "number" ? t.skewX : this.skew.x,
      typeof t.skewY == "number" ? t.skewY : this.skew.y
    ), this.pivot.set(
      typeof t.pivotX == "number" ? t.pivotX : this.pivot.x,
      typeof t.pivotY == "number" ? t.pivotY : this.pivot.y
    ), this;
  }
  /**
   * Updates the local transform using the given matrix.
   * @param matrix - The matrix to use for updating the transform.
   */
  setFromMatrix(t) {
    t.decompose(this);
  }
  /** Updates the local transform. */
  updateLocalTransform() {
    const t = this._didContainerChangeTick;
    if (this._didLocalTransformChangeId === t)
      return;
    this._didLocalTransformChangeId = t;
    const e = this.localTransform, r = this._scale, s = this._pivot, n = this._position, o = r._x, a = r._y, h = s._x, c = s._y;
    e.a = this._cx * o, e.b = this._sx * o, e.c = this._cy * a, e.d = this._sy * a, e.tx = n._x - (h * e.a + c * e.c), e.ty = n._y - (h * e.b + c * e.d);
  }
  // / ///// color related stuff
  set alpha(t) {
    t !== this.localAlpha && (this.localAlpha = t, this._updateFlags |= Ma, this._onUpdate());
  }
  /** The opacity of the object. */
  get alpha() {
    return this.localAlpha;
  }
  set tint(t) {
    const e = gt.shared.setValue(t ?? 16777215).toBgrNumber();
    e !== this.localColor && (this.localColor = e, this._updateFlags |= Ma, this._onUpdate());
  }
  /**
   * The tint applied to the sprite. This is a hex value.
   *
   * A value of 0xFFFFFF will remove any tint effect.
   * @default 0xFFFFFF
   */
  get tint() {
    const t = this.localColor;
    return ((t & 255) << 16) + (t & 65280) + (t >> 16 & 255);
  }
  // / //////////////// blend related stuff
  set blendMode(t) {
    this.localBlendMode !== t && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= Bd, this.localBlendMode = t, this._onUpdate());
  }
  /**
   * The blend mode to be applied to the sprite. Apply a value of `'normal'` to reset the blend mode.
   * @default 'normal'
   */
  get blendMode() {
    return this.localBlendMode;
  }
  // / ///////// VISIBILITY / RENDERABLE /////////////////
  /** The visibility of the object. If false the object will not be drawn, and the transform will not be updated. */
  get visible() {
    return !!(this.localDisplayStatus & 2);
  }
  set visible(t) {
    const e = t ? 2 : 0;
    (this.localDisplayStatus & 2) !== e && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= ns, this.localDisplayStatus ^= 2, this._onUpdate());
  }
  /** @ignore */
  get culled() {
    return !(this.localDisplayStatus & 4);
  }
  /** @ignore */
  set culled(t) {
    const e = t ? 0 : 4;
    (this.localDisplayStatus & 4) !== e && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= ns, this.localDisplayStatus ^= 4, this._onUpdate());
  }
  /** Can this object be rendered, if false the object will not be drawn but the transform will still be updated. */
  get renderable() {
    return !!(this.localDisplayStatus & 1);
  }
  set renderable(t) {
    const e = t ? 1 : 0;
    (this.localDisplayStatus & 1) !== e && (this._updateFlags |= ns, this.localDisplayStatus ^= 1, this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._onUpdate());
  }
  /** Whether or not the object should be rendered. */
  get isRenderable() {
    return this.localDisplayStatus === 7 && this.groupAlpha > 0;
  }
  /**
   * Removes all internal references and listeners as well as removes children from the display list.
   * Do not use a Container after calling `destroy`.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.children=false] - if set to true, all the children will have their destroy
   *  method called as well. 'options' will be passed on to those calls.
   * @param {boolean} [options.texture=false] - Only used for children with textures e.g. Sprites. If options.children
   * is set to true it should destroy the texture of the child sprite
   * @param {boolean} [options.textureSource=false] - Only used for children with textures e.g. Sprites.
   * If options.children is set to true it should destroy the texture source of the child sprite
   * @param {boolean} [options.context=false] - Only used for children with graphicsContexts e.g. Graphics.
   * If options.children is set to true it should destroy the context of the child graphics
   */
  destroy(t = !1) {
    var e;
    if (this.destroyed)
      return;
    this.destroyed = !0;
    let r;
    if (this.children.length && (r = this.removeChildren(0, this.children.length)), this.removeFromParent(), this.parent = null, this._maskEffect = null, this._filterEffect = null, this.effects = null, this._position = null, this._scale = null, this._pivot = null, this._skew = null, this.emit("destroyed", this), this.removeAllListeners(), (typeof t == "boolean" ? t : t == null ? void 0 : t.children) && r)
      for (let s = 0; s < r.length; ++s)
        r[s].destroy(t);
    (e = this.renderGroup) == null || e.destroy(), this.renderGroup = null;
  }
}
Ot.mixin(xd);
Ot.mixin(kd);
Ot.mixin(Sd);
Ot.mixin(Ad);
Ot.mixin(bd);
Ot.mixin(_d);
Ot.mixin(Cd);
Ot.mixin(md);
class Lr extends Ot {
  constructor() {
    super(...arguments), this.canBundle = !0, this.allowChildren = !1, this._roundPixels = 0, this._lastUsed = 0, this._lastInstructionTick = -1, this._bounds = new _e(0, 1, 0, 0), this._boundsDirty = !0;
  }
  /** @private */
  _updateBounds() {
  }
  /**
   * Whether or not to round the x/y position of the sprite.
   * @type {boolean}
   */
  get roundPixels() {
    return !!this._roundPixels;
  }
  set roundPixels(t) {
    this._roundPixels = t ? 1 : 0;
  }
  /**
   * Checks if the object contains the given point.
   * @param point - The point to check
   */
  containsPoint(t) {
    const e = this.bounds, { x: r, y: s } = t;
    return r >= e.minX && r <= e.maxX && s >= e.minY && s <= e.maxY;
  }
  /** @private */
  onViewUpdate() {
    if (this._didViewChangeTick++, this.didViewUpdate)
      return;
    this.didViewUpdate = !0;
    const t = this.renderGroup || this.parentRenderGroup;
    t && t.onChildViewUpdate(this);
  }
  destroy(t) {
    super.destroy(t), this._bounds = null;
  }
}
class zi extends Lr {
  /**
   * @param options - The options for creating the sprite.
   */
  constructor(t = H.EMPTY) {
    t instanceof H && (t = { texture: t });
    const { texture: e = H.EMPTY, anchor: r, roundPixels: s, width: n, height: o, ...a } = t;
    super({
      label: "Sprite",
      ...a
    }), this.renderPipeId = "sprite", this.batched = !0, this._sourceBounds = { minX: 0, maxX: 1, minY: 0, maxY: 0 }, this._sourceBoundsDirty = !0, this._anchor = new xt(
      {
        _onUpdate: () => {
          this.onViewUpdate();
        }
      }
    ), r ? this.anchor = r : e.defaultAnchor && (this.anchor = e.defaultAnchor), this.texture = e, this.allowChildren = !1, this.roundPixels = s ?? !1, n !== void 0 && (this.width = n), o !== void 0 && (this.height = o);
  }
  /**
   * Helper function that creates a new sprite based on the source you provide.
   * The source can be - frame id, image, video, canvas element, video element, texture
   * @param source - Source to create texture from
   * @param [skipCache] - Whether to skip the cache or not
   * @returns The newly created sprite
   */
  static from(t, e = !1) {
    return t instanceof H ? new zi(t) : new zi(H.from(t, e));
  }
  set texture(t) {
    t || (t = H.EMPTY);
    const e = this._texture;
    e !== t && (e && e.dynamic && e.off("update", this.onViewUpdate, this), t.dynamic && t.on("update", this.onViewUpdate, this), this._texture = t, this._width && this._setWidth(this._width, this._texture.orig.width), this._height && this._setHeight(this._height, this._texture.orig.height), this.onViewUpdate());
  }
  /** The texture that the sprite is using. */
  get texture() {
    return this._texture;
  }
  /**
   * The local bounds of the sprite.
   * @type {rendering.Bounds}
   */
  get bounds() {
    return this._boundsDirty && (this._updateBounds(), this._boundsDirty = !1), this._bounds;
  }
  /**
   * The bounds of the sprite, taking the texture's trim into account.
   * @type {rendering.Bounds}
   */
  get sourceBounds() {
    return this._sourceBoundsDirty && (this._updateSourceBounds(), this._sourceBoundsDirty = !1), this._sourceBounds;
  }
  /**
   * Checks if the object contains the given point.
   * @param point - The point to check
   */
  containsPoint(t) {
    const e = this.sourceBounds;
    return t.x >= e.maxX && t.x <= e.minX && t.y >= e.maxY && t.y <= e.minY;
  }
  /**
   * Adds the bounds of this object to the bounds object.
   * @param bounds - The output bounds object.
   */
  addBounds(t) {
    const e = this._texture.trim ? this.sourceBounds : this.bounds;
    t.addFrame(e.minX, e.minY, e.maxX, e.maxY);
  }
  onViewUpdate() {
    this._sourceBoundsDirty = this._boundsDirty = !0, super.onViewUpdate();
  }
  _updateBounds() {
    sd(this._bounds, this._anchor, this._texture, 0);
  }
  _updateSourceBounds() {
    const t = this._anchor, e = this._texture, r = this._sourceBounds, { width: s, height: n } = e.orig;
    r.maxX = -t._x * s, r.minX = r.maxX + s, r.maxY = -t._y * n, r.minY = r.maxY + n;
  }
  /**
   * Destroys this sprite renderable and optionally its texture.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.texture=false] - Should it destroy the current texture of the renderable as well
   * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the renderable as well
   */
  destroy(t = !1) {
    if (super.destroy(t), typeof t == "boolean" ? t : t == null ? void 0 : t.texture) {
      const e = typeof t == "boolean" ? t : t == null ? void 0 : t.textureSource;
      this._texture.destroy(e);
    }
    this._texture = null, this._bounds = null, this._sourceBounds = null, this._anchor = null;
  }
  /**
   * The anchor sets the origin point of the sprite. The default value is taken from the {@link Texture}
   * and passed to the constructor.
   *
   * The default is `(0,0)`, this means the sprite's origin is the top left.
   *
   * Setting the anchor to `(0.5,0.5)` means the sprite's origin is centered.
   *
   * Setting the anchor to `(1,1)` would mean the sprite's origin point will be the bottom right corner.
   *
   * If you pass only single parameter, it will set both x and y to the same value as shown in the example below.
   * @example
   * import { Sprite } from 'pixi.js';
   *
   * const sprite = new Sprite({texture: Texture.WHITE});
   * sprite.anchor.set(0.5); // This will set the origin to center. (0.5) is same as (0.5, 0.5).
   */
  get anchor() {
    return this._anchor;
  }
  set anchor(t) {
    typeof t == "number" ? this._anchor.set(t) : this._anchor.copyFrom(t);
  }
  /** The width of the sprite, setting this will actually modify the scale to achieve the value set. */
  get width() {
    return Math.abs(this.scale.x) * this._texture.orig.width;
  }
  set width(t) {
    this._setWidth(t, this._texture.orig.width), this._width = t;
  }
  /** The height of the sprite, setting this will actually modify the scale to achieve the value set. */
  get height() {
    return Math.abs(this.scale.y) * this._texture.orig.height;
  }
  set height(t) {
    this._setHeight(t, this._texture.orig.height), this._height = t;
  }
  /**
   * Retrieves the size of the Sprite as a [Size]{@link Size} object.
   * This is faster than get the width and height separately.
   * @param out - Optional object to store the size in.
   * @returns - The size of the Sprite.
   */
  getSize(t) {
    return t || (t = {}), t.width = Math.abs(this.scale.x) * this._texture.orig.width, t.height = Math.abs(this.scale.y) * this._texture.orig.height, t;
  }
  /**
   * Sets the size of the Sprite to the specified width and height.
   * This is faster than setting the width and height separately.
   * @param value - This can be either a number or a [Size]{@link Size} object.
   * @param height - The height to set. Defaults to the value of `width` if not provided.
   */
  setSize(t, e) {
    typeof t == "object" ? (e = t.height ?? t.width, t = t.width) : e ?? (e = t), t !== void 0 && this._setWidth(t, this._texture.orig.width), e !== void 0 && this._setHeight(e, this._texture.orig.height);
  }
}
const Rd = new _e();
function dl(i, t, e) {
  const r = Rd;
  i.measurable = !0, ol(i, e, r), t.addBoundsMask(r), i.measurable = !1;
}
function pl(i, t, e) {
  const r = Li.get();
  i.measurable = !0;
  const s = Be.get().identity(), n = fl(i, e, s);
  hl(i, r, n), i.measurable = !1, t.addBoundsMask(r), Be.return(s), Li.return(r);
}
function fl(i, t, e) {
  return i ? (i !== t && (fl(i.parent, t, e), i.updateLocalTransform(), e.append(i.localTransform)), e) : (dt("Mask bounds, renderable is not inside the root container"), e);
}
class ml {
  constructor(t) {
    this.priority = 0, this.inverse = !1, this.pipe = "alphaMask", t != null && t.mask && this.init(t.mask);
  }
  init(t) {
    this.mask = t, this.renderMaskToTexture = !(t instanceof zi), this.mask.renderable = this.renderMaskToTexture, this.mask.includeInBuild = !this.renderMaskToTexture, this.mask.measurable = !1;
  }
  reset() {
    this.mask.measurable = !0, this.mask = null;
  }
  addBounds(t, e) {
    this.inverse || dl(this.mask, t, e);
  }
  addLocalBounds(t, e) {
    pl(this.mask, t, e);
  }
  containsPoint(t, e) {
    const r = this.mask;
    return e(r, t);
  }
  destroy() {
    this.reset();
  }
  static test(t) {
    return t instanceof zi;
  }
}
ml.extension = D.MaskEffect;
class gl {
  constructor(t) {
    this.priority = 0, this.pipe = "colorMask", t != null && t.mask && this.init(t.mask);
  }
  init(t) {
    this.mask = t;
  }
  destroy() {
  }
  static test(t) {
    return typeof t == "number";
  }
}
gl.extension = D.MaskEffect;
class yl {
  constructor(t) {
    this.priority = 0, this.pipe = "stencilMask", t != null && t.mask && this.init(t.mask);
  }
  init(t) {
    this.mask = t, this.mask.includeInBuild = !1, this.mask.measurable = !1;
  }
  reset() {
    this.mask.measurable = !0, this.mask.includeInBuild = !0, this.mask = null;
  }
  addBounds(t, e) {
    dl(this.mask, t, e);
  }
  addLocalBounds(t, e) {
    pl(this.mask, t, e);
  }
  containsPoint(t, e) {
    const r = this.mask;
    return e(r, t);
  }
  destroy() {
    this.reset();
  }
  static test(t) {
    return t instanceof Ot;
  }
}
yl.extension = D.MaskEffect;
const Id = {
  createCanvas: (i, t) => {
    const e = document.createElement("canvas");
    return e.width = i, e.height = t, e;
  },
  getCanvasRenderingContext2D: () => CanvasRenderingContext2D,
  getWebGLRenderingContext: () => WebGLRenderingContext,
  getNavigator: () => navigator,
  getBaseUrl: () => document.baseURI ?? window.location.href,
  getFontFaceSet: () => document.fonts,
  fetch: (i, t) => fetch(i, t),
  parseXML: (i) => new DOMParser().parseFromString(i, "text/xml")
};
let Ta = Id;
const at = {
  /**
   * Returns the current adapter.
   * @returns {environment.Adapter} The current adapter.
   */
  get() {
    return Ta;
  },
  /**
   * Sets the current adapter.
   * @param adapter - The new adapter.
   */
  set(i) {
    Ta = i;
  }
};
class xl extends Ae {
  constructor(t) {
    t.resource || (t.resource = at.get().createCanvas()), t.width || (t.width = t.resource.width, t.autoDensity || (t.width /= t.resolution)), t.height || (t.height = t.resource.height, t.autoDensity || (t.height /= t.resolution)), super(t), this.uploadMethodId = "image", this.autoDensity = t.autoDensity;
    const e = t.resource;
    (this.pixelWidth !== e.width || this.pixelWidth !== e.height) && this.resizeCanvas(), this.transparent = !!t.transparent;
  }
  resizeCanvas() {
    this.autoDensity && (this.resource.style.width = `${this.width}px`, this.resource.style.height = `${this.height}px`), (this.resource.width !== this.pixelWidth || this.resource.height !== this.pixelHeight) && (this.resource.width = this.pixelWidth, this.resource.height = this.pixelHeight);
  }
  resize(t = this.width, e = this.height, r = this._resolution) {
    const s = super.resize(t, e, r);
    return s && this.resizeCanvas(), s;
  }
  static test(t) {
    return globalThis.HTMLCanvasElement && t instanceof HTMLCanvasElement || globalThis.OffscreenCanvas && t instanceof OffscreenCanvas;
  }
  /**
   * Returns the 2D rendering context for the canvas.
   * Caches the context after creating it.
   * @returns The 2D rendering context of the canvas.
   */
  get context2D() {
    return this._context2D || (this._context2D = this.resource.getContext("2d"));
  }
}
xl.extension = D.TextureSource;
class Ni extends Ae {
  constructor(t) {
    if (t.resource && globalThis.HTMLImageElement && t.resource instanceof HTMLImageElement) {
      const e = at.get().createCanvas(t.resource.width, t.resource.height);
      e.getContext("2d").drawImage(t.resource, 0, 0, t.resource.width, t.resource.height), t.resource = e, dt("ImageSource: Image element passed, converting to canvas. Use CanvasSource instead.");
    }
    super(t), this.uploadMethodId = "image", this.autoGarbageCollect = !0;
  }
  static test(t) {
    return globalThis.HTMLImageElement && t instanceof HTMLImageElement || typeof ImageBitmap < "u" && t instanceof ImageBitmap || globalThis.VideoFrame && t instanceof VideoFrame;
  }
}
Ni.extension = D.TextureSource;
var Vs = /* @__PURE__ */ ((i) => (i[i.INTERACTION = 50] = "INTERACTION", i[i.HIGH = 25] = "HIGH", i[i.NORMAL = 0] = "NORMAL", i[i.LOW = -25] = "LOW", i[i.UTILITY = -50] = "UTILITY", i))(Vs || {});
class ss {
  /**
   * Constructor
   * @private
   * @param fn - The listener function to be added for one update
   * @param context - The listener context
   * @param priority - The priority for emitting
   * @param once - If the handler should fire once
   */
  constructor(t, e = null, r = 0, s = !1) {
    this.next = null, this.previous = null, this._destroyed = !1, this._fn = t, this._context = e, this.priority = r, this._once = s;
  }
  /**
   * Simple compare function to figure out if a function and context match.
   * @param fn - The listener function to be added for one update
   * @param context - The listener context
   * @returns `true` if the listener match the arguments
   */
  match(t, e = null) {
    return this._fn === t && this._context === e;
  }
  /**
   * Emit by calling the current function.
   * @param ticker - The ticker emitting.
   * @returns Next ticker
   */
  emit(t) {
    this._fn && (this._context ? this._fn.call(this._context, t) : this._fn(t));
    const e = this.next;
    return this._once && this.destroy(!0), this._destroyed && (this.next = null), e;
  }
  /**
   * Connect to the list.
   * @param previous - Input node, previous listener
   */
  connect(t) {
    this.previous = t, t.next && (t.next.previous = this), this.next = t.next, t.next = this;
  }
  /**
   * Destroy and don't use after this.
   * @param hard - `true` to remove the `next` reference, this
   *        is considered a hard destroy. Soft destroy maintains the next reference.
   * @returns The listener to redirect while emitting or removing.
   */
  destroy(t = !1) {
    this._destroyed = !0, this._fn = null, this._context = null, this.previous && (this.previous.next = this.next), this.next && (this.next.previous = this.previous);
    const e = this.next;
    return this.next = t ? null : e, this.previous = null, e;
  }
}
const vl = class Nt {
  constructor() {
    this.autoStart = !1, this.deltaTime = 1, this.lastTime = -1, this.speed = 1, this.started = !1, this._requestId = null, this._maxElapsedMS = 100, this._minElapsedMS = 0, this._protected = !1, this._lastFrame = -1, this._head = new ss(null, null, 1 / 0), this.deltaMS = 1 / Nt.targetFPMS, this.elapsedMS = 1 / Nt.targetFPMS, this._tick = (t) => {
      this._requestId = null, this.started && (this.update(t), this.started && this._requestId === null && this._head.next && (this._requestId = requestAnimationFrame(this._tick)));
    };
  }
  /**
   * Conditionally requests a new animation frame.
   * If a frame has not already been requested, and if the internal
   * emitter has listeners, a new frame is requested.
   * @private
   */
  _requestIfNeeded() {
    this._requestId === null && this._head.next && (this.lastTime = performance.now(), this._lastFrame = this.lastTime, this._requestId = requestAnimationFrame(this._tick));
  }
  /**
   * Conditionally cancels a pending animation frame.
   * @private
   */
  _cancelIfNeeded() {
    this._requestId !== null && (cancelAnimationFrame(this._requestId), this._requestId = null);
  }
  /**
   * Conditionally requests a new animation frame.
   * If the ticker has been started it checks if a frame has not already
   * been requested, and if the internal emitter has listeners. If these
   * conditions are met, a new frame is requested. If the ticker has not
   * been started, but autoStart is `true`, then the ticker starts now,
   * and continues with the previous conditions to request a new frame.
   * @private
   */
  _startIfPossible() {
    this.started ? this._requestIfNeeded() : this.autoStart && this.start();
  }
  /**
   * Register a handler for tick events. Calls continuously unless
   * it is removed or the ticker is stopped.
   * @param fn - The listener function to be added for updates
   * @param context - The listener context
   * @param {number} [priority=UPDATE_PRIORITY.NORMAL] - The priority for emitting
   * @returns This instance of a ticker
   */
  add(t, e, r = Vs.NORMAL) {
    return this._addListener(new ss(t, e, r));
  }
  /**
   * Add a handler for the tick event which is only execute once.
   * @param fn - The listener function to be added for one update
   * @param context - The listener context
   * @param {number} [priority=UPDATE_PRIORITY.NORMAL] - The priority for emitting
   * @returns This instance of a ticker
   */
  addOnce(t, e, r = Vs.NORMAL) {
    return this._addListener(new ss(t, e, r, !0));
  }
  /**
   * Internally adds the event handler so that it can be sorted by priority.
   * Priority allows certain handler (user, AnimatedSprite, Interaction) to be run
   * before the rendering.
   * @private
   * @param listener - Current listener being added.
   * @returns This instance of a ticker
   */
  _addListener(t) {
    let e = this._head.next, r = this._head;
    if (!e)
      t.connect(r);
    else {
      for (; e; ) {
        if (t.priority > e.priority) {
          t.connect(r);
          break;
        }
        r = e, e = e.next;
      }
      t.previous || t.connect(r);
    }
    return this._startIfPossible(), this;
  }
  /**
   * Removes any handlers matching the function and context parameters.
   * If no handlers are left after removing, then it cancels the animation frame.
   * @param fn - The listener function to be removed
   * @param context - The listener context to be removed
   * @returns This instance of a ticker
   */
  remove(t, e) {
    let r = this._head.next;
    for (; r; )
      r.match(t, e) ? r = r.destroy() : r = r.next;
    return this._head.next || this._cancelIfNeeded(), this;
  }
  /**
   * The number of listeners on this ticker, calculated by walking through linked list
   * @readonly
   * @member {number}
   */
  get count() {
    if (!this._head)
      return 0;
    let t = 0, e = this._head;
    for (; e = e.next; )
      t++;
    return t;
  }
  /** Starts the ticker. If the ticker has listeners a new animation frame is requested at this point. */
  start() {
    this.started || (this.started = !0, this._requestIfNeeded());
  }
  /** Stops the ticker. If the ticker has requested an animation frame it is canceled at this point. */
  stop() {
    this.started && (this.started = !1, this._cancelIfNeeded());
  }
  /** Destroy the ticker and don't use after this. Calling this method removes all references to internal events. */
  destroy() {
    if (!this._protected) {
      this.stop();
      let t = this._head.next;
      for (; t; )
        t = t.destroy(!0);
      this._head.destroy(), this._head = null;
    }
  }
  /**
   * Triggers an update. An update entails setting the
   * current {@link ticker.Ticker#elapsedMS|elapsedMS},
   * the current {@link ticker.Ticker#deltaTime|deltaTime},
   * invoking all listeners with current deltaTime,
   * and then finally setting {@link ticker.Ticker#lastTime|lastTime}
   * with the value of currentTime that was provided.
   * This method will be called automatically by animation
   * frame callbacks if the ticker instance has been started
   * and listeners are added.
   * @param {number} [currentTime=performance.now()] - the current time of execution
   */
  update(t = performance.now()) {
    let e;
    if (t > this.lastTime) {
      if (e = this.elapsedMS = t - this.lastTime, e > this._maxElapsedMS && (e = this._maxElapsedMS), e *= this.speed, this._minElapsedMS) {
        const n = t - this._lastFrame | 0;
        if (n < this._minElapsedMS)
          return;
        this._lastFrame = t - n % this._minElapsedMS;
      }
      this.deltaMS = e, this.deltaTime = this.deltaMS * Nt.targetFPMS;
      const r = this._head;
      let s = r.next;
      for (; s; )
        s = s.emit(this);
      r.next || this._cancelIfNeeded();
    } else
      this.deltaTime = this.deltaMS = this.elapsedMS = 0;
    this.lastTime = t;
  }
  /**
   * The frames per second at which this ticker is running.
   * The default is approximately 60 in most modern browsers.
   * **Note:** This does not factor in the value of
   * {@link ticker.Ticker#speed|speed}, which is specific
   * to scaling {@link ticker.Ticker#deltaTime|deltaTime}.
   * @member {number}
   * @readonly
   */
  get FPS() {
    return 1e3 / this.elapsedMS;
  }
  /**
   * Manages the maximum amount of milliseconds allowed to
   * elapse between invoking {@link ticker.Ticker#update|update}.
   * This value is used to cap {@link ticker.Ticker#deltaTime|deltaTime},
   * but does not effect the measured value of {@link ticker.Ticker#FPS|FPS}.
   * When setting this property it is clamped to a value between
   * `0` and `Ticker.targetFPMS * 1000`.
   * @member {number}
   * @default 10
   */
  get minFPS() {
    return 1e3 / this._maxElapsedMS;
  }
  set minFPS(t) {
    const e = Math.min(this.maxFPS, t), r = Math.min(Math.max(0, e) / 1e3, Nt.targetFPMS);
    this._maxElapsedMS = 1 / r;
  }
  /**
   * Manages the minimum amount of milliseconds required to
   * elapse between invoking {@link ticker.Ticker#update|update}.
   * This will effect the measured value of {@link ticker.Ticker#FPS|FPS}.
   * If it is set to `0`, then there is no limit; PixiJS will render as many frames as it can.
   * Otherwise it will be at least `minFPS`
   * @member {number}
   * @default 0
   */
  get maxFPS() {
    return this._minElapsedMS ? Math.round(1e3 / this._minElapsedMS) : 0;
  }
  set maxFPS(t) {
    if (t === 0)
      this._minElapsedMS = 0;
    else {
      const e = Math.max(this.minFPS, t);
      this._minElapsedMS = 1 / (e / 1e3);
    }
  }
  /**
   * The shared ticker instance used by {@link AnimatedSprite} and by
   * {@link VideoResource} to update animation frames / video textures.
   *
   * It may also be used by {@link Application} if created with the `sharedTicker` option property set to true.
   *
   * The property {@link ticker.Ticker#autoStart|autoStart} is set to `true` for this instance.
   * Please follow the examples for usage, including how to opt-out of auto-starting the shared ticker.
   * @example
   * import { Ticker } from 'pixi.js';
   *
   * const ticker = Ticker.shared;
   * // Set this to prevent starting this ticker when listeners are added.
   * // By default this is true only for the Ticker.shared instance.
   * ticker.autoStart = false;
   *
   * // FYI, call this to ensure the ticker is stopped. It should be stopped
   * // if you have not attempted to render anything yet.
   * ticker.stop();
   *
   * // Call this when you are ready for a running shared ticker.
   * ticker.start();
   * @example
   * import { autoDetectRenderer, Container } from 'pixi.js';
   *
   * // You may use the shared ticker to render...
   * const renderer = autoDetectRenderer();
   * const stage = new Container();
   * document.body.appendChild(renderer.view);
   * ticker.add((time) => renderer.render(stage));
   *
   * // Or you can just update it manually.
   * ticker.autoStart = false;
   * ticker.stop();
   * const animate = (time) => {
   *     ticker.update(time);
   *     renderer.render(stage);
   *     requestAnimationFrame(animate);
   * };
   * animate(performance.now());
   * @member {ticker.Ticker}
   * @readonly
   * @static
   */
  static get shared() {
    if (!Nt._shared) {
      const t = Nt._shared = new Nt();
      t.autoStart = !0, t._protected = !0;
    }
    return Nt._shared;
  }
  /**
   * The system ticker instance used by {@link BasePrepare} for core timing
   * functionality that shouldn't usually need to be paused, unlike the `shared`
   * ticker which drives visual animations and rendering which may want to be paused.
   *
   * The property {@link ticker.Ticker#autoStart|autoStart} is set to `true` for this instance.
   * @member {ticker.Ticker}
   * @readonly
   * @static
   */
  static get system() {
    if (!Nt._system) {
      const t = Nt._system = new Nt();
      t.autoStart = !0, t._protected = !0;
    }
    return Nt._system;
  }
};
vl.targetFPMS = 0.06;
let Te = vl, os;
async function bl() {
  return os ?? (os = (async () => {
    var i;
    const t = document.createElement("canvas").getContext("webgl");
    if (!t)
      return "premultiply-alpha-on-upload";
    const e = await new Promise((o) => {
      const a = document.createElement("video");
      a.onloadeddata = () => o(a), a.onerror = () => o(null), a.autoplay = !1, a.crossOrigin = "anonymous", a.preload = "auto", a.src = "data:video/webm;base64,GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQJChYECGFOAZwEAAAAAAAHTEU2bdLpNu4tTq4QVSalmU6yBoU27i1OrhBZUrmtTrIHGTbuMU6uEElTDZ1OsggEXTbuMU6uEHFO7a1OsggG97AEAAAAAAABZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmoCrXsYMPQkBNgIRMYXZmV0GETGF2ZkSJiEBEAAAAAAAAFlSua8yuAQAAAAAAAEPXgQFzxYgAAAAAAAAAAZyBACK1nIN1bmSIgQCGhVZfVlA5g4EBI+ODhAJiWgDglLCBArqBApqBAlPAgQFVsIRVuYEBElTDZ9Vzc9JjwItjxYgAAAAAAAAAAWfInEWjh0VOQ09ERVJEh49MYXZjIGxpYnZweC12cDlnyKJFo4hEVVJBVElPTkSHlDAwOjAwOjAwLjA0MDAwMDAwMAAAH0O2dcfngQCgwqGggQAAAIJJg0IAABAAFgA4JBwYSgAAICAAEb///4r+AAB1oZ2mm+6BAaWWgkmDQgAAEAAWADgkHBhKAAAgIABIQBxTu2uRu4+zgQC3iveBAfGCAXHwgQM=", a.load();
    });
    if (!e)
      return "premultiply-alpha-on-upload";
    const r = t.createTexture();
    t.bindTexture(t.TEXTURE_2D, r);
    const s = t.createFramebuffer();
    t.bindFramebuffer(t.FRAMEBUFFER, s), t.framebufferTexture2D(
      t.FRAMEBUFFER,
      t.COLOR_ATTACHMENT0,
      t.TEXTURE_2D,
      r,
      0
    ), t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL, t.NONE), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, e);
    const n = new Uint8Array(4);
    return t.readPixels(0, 0, 1, 1, t.RGBA, t.UNSIGNED_BYTE, n), t.deleteFramebuffer(s), t.deleteTexture(r), (i = t.getExtension("WEBGL_lose_context")) == null || i.loseContext(), n[0] <= n[3] ? "premultiplied-alpha" : "premultiply-alpha-on-upload";
  })()), os;
}
const Cn = class _l extends Ae {
  constructor(t) {
    super(t), this.isReady = !1, this.uploadMethodId = "video", t = {
      ..._l.defaultOptions,
      ...t
    }, this._autoUpdate = !0, this._isConnectedToTicker = !1, this._updateFPS = t.updateFPS || 0, this._msToNextUpdate = 0, this.autoPlay = t.autoPlay !== !1, this.alphaMode = t.alphaMode ?? "premultiply-alpha-on-upload", this._videoFrameRequestCallback = this._videoFrameRequestCallback.bind(this), this._videoFrameRequestCallbackHandle = null, this._load = null, this._resolve = null, this._reject = null, this._onCanPlay = this._onCanPlay.bind(this), this._onCanPlayThrough = this._onCanPlayThrough.bind(this), this._onError = this._onError.bind(this), this._onPlayStart = this._onPlayStart.bind(this), this._onPlayStop = this._onPlayStop.bind(this), this._onSeeked = this._onSeeked.bind(this), t.autoLoad !== !1 && this.load();
  }
  /** Update the video frame if the source is not destroyed and meets certain conditions. */
  updateFrame() {
    if (!this.destroyed) {
      if (this._updateFPS) {
        const t = Te.shared.elapsedMS * this.resource.playbackRate;
        this._msToNextUpdate = Math.floor(this._msToNextUpdate - t);
      }
      (!this._updateFPS || this._msToNextUpdate <= 0) && (this._msToNextUpdate = this._updateFPS ? Math.floor(1e3 / this._updateFPS) : 0), this.isValid && this.update();
    }
  }
  /** Callback to update the video frame and potentially request the next frame update. */
  _videoFrameRequestCallback() {
    this.updateFrame(), this.destroyed ? this._videoFrameRequestCallbackHandle = null : this._videoFrameRequestCallbackHandle = this.resource.requestVideoFrameCallback(
      this._videoFrameRequestCallback
    );
  }
  /**
   * Checks if the resource has valid dimensions.
   * @returns {boolean} True if width and height are set, otherwise false.
   */
  get isValid() {
    return !!this.resource.videoWidth && !!this.resource.videoHeight;
  }
  /**
   * Start preloading the video resource.
   * @returns {Promise<this>} Handle the validate event
   */
  async load() {
    if (this._load)
      return this._load;
    const t = this.resource, e = this.options;
    return (t.readyState === t.HAVE_ENOUGH_DATA || t.readyState === t.HAVE_FUTURE_DATA) && t.width && t.height && (t.complete = !0), t.addEventListener("play", this._onPlayStart), t.addEventListener("pause", this._onPlayStop), t.addEventListener("seeked", this._onSeeked), this._isSourceReady() ? this._mediaReady() : (e.preload || t.addEventListener("canplay", this._onCanPlay), t.addEventListener("canplaythrough", this._onCanPlayThrough), t.addEventListener("error", this._onError, !0)), this.alphaMode = await bl(), this._load = new Promise((r, s) => {
      this.isValid ? r(this) : (this._resolve = r, this._reject = s, e.preloadTimeoutMs !== void 0 && (this._preloadTimeout = setTimeout(() => {
        this._onError(new ErrorEvent(`Preload exceeded timeout of ${e.preloadTimeoutMs}ms`));
      })), t.load());
    }), this._load;
  }
  /**
   * Handle video error events.
   * @param event - The error event
   */
  _onError(t) {
    this.resource.removeEventListener("error", this._onError, !0), this.emit("error", t), this._reject && (this._reject(t), this._reject = null, this._resolve = null);
  }
  /**
   * Checks if the underlying source is playing.
   * @returns True if playing.
   */
  _isSourcePlaying() {
    const t = this.resource;
    return !t.paused && !t.ended;
  }
  /**
   * Checks if the underlying source is ready for playing.
   * @returns True if ready.
   */
  _isSourceReady() {
    return this.resource.readyState > 2;
  }
  /** Runs the update loop when the video is ready to play. */
  _onPlayStart() {
    this.isValid || this._mediaReady(), this._configureAutoUpdate();
  }
  /** Stops the update loop when a pause event is triggered. */
  _onPlayStop() {
    this._configureAutoUpdate();
  }
  /** Handles behavior when the video completes seeking to the current playback position. */
  _onSeeked() {
    this._autoUpdate && !this._isSourcePlaying() && (this._msToNextUpdate = 0, this.updateFrame(), this._msToNextUpdate = 0);
  }
  _onCanPlay() {
    this.resource.removeEventListener("canplay", this._onCanPlay), this._mediaReady();
  }
  _onCanPlayThrough() {
    this.resource.removeEventListener("canplaythrough", this._onCanPlay), this._preloadTimeout && (clearTimeout(this._preloadTimeout), this._preloadTimeout = void 0), this._mediaReady();
  }
  /** Fired when the video is loaded and ready to play. */
  _mediaReady() {
    const t = this.resource;
    this.isValid && (this.isReady = !0, this.resize(t.videoWidth, t.videoHeight)), this._msToNextUpdate = 0, this.updateFrame(), this._msToNextUpdate = 0, this._resolve && (this._resolve(this), this._resolve = null, this._reject = null), this._isSourcePlaying() ? this._onPlayStart() : this.autoPlay && this.resource.play();
  }
  /** Cleans up resources and event listeners associated with this texture. */
  destroy() {
    this._configureAutoUpdate();
    const t = this.resource;
    t && (t.removeEventListener("play", this._onPlayStart), t.removeEventListener("pause", this._onPlayStop), t.removeEventListener("seeked", this._onSeeked), t.removeEventListener("canplay", this._onCanPlay), t.removeEventListener("canplaythrough", this._onCanPlayThrough), t.removeEventListener("error", this._onError, !0), t.pause(), t.src = "", t.load()), super.destroy();
  }
  /** Should the base texture automatically update itself, set to true by default. */
  get autoUpdate() {
    return this._autoUpdate;
  }
  set autoUpdate(t) {
    t !== this._autoUpdate && (this._autoUpdate = t, this._configureAutoUpdate());
  }
  /**
   * How many times a second to update the texture from the video.
   * Leave at 0 to update at every render.
   * A lower fps can help performance, as updating the texture at 60fps on a 30ps video may not be efficient.
   */
  get updateFPS() {
    return this._updateFPS;
  }
  set updateFPS(t) {
    t !== this._updateFPS && (this._updateFPS = t, this._configureAutoUpdate());
  }
  /**
   * Configures the updating mechanism based on the current state and settings.
   *
   * This method decides between using the browser's native video frame callback or a custom ticker
   * for updating the video frame. It ensures optimal performance and responsiveness
   * based on the video's state, playback status, and the desired frames-per-second setting.
   *
   * - If `_autoUpdate` is enabled and the video source is playing:
   *   - It will prefer the native video frame callback if available and no specific FPS is set.
   *   - Otherwise, it will use a custom ticker for manual updates.
   * - If `_autoUpdate` is disabled or the video isn't playing, any active update mechanisms are halted.
   */
  _configureAutoUpdate() {
    this._autoUpdate && this._isSourcePlaying() ? !this._updateFPS && this.resource.requestVideoFrameCallback ? (this._isConnectedToTicker && (Te.shared.remove(this.updateFrame, this), this._isConnectedToTicker = !1, this._msToNextUpdate = 0), this._videoFrameRequestCallbackHandle === null && (this._videoFrameRequestCallbackHandle = this.resource.requestVideoFrameCallback(
      this._videoFrameRequestCallback
    ))) : (this._videoFrameRequestCallbackHandle !== null && (this.resource.cancelVideoFrameCallback(this._videoFrameRequestCallbackHandle), this._videoFrameRequestCallbackHandle = null), this._isConnectedToTicker || (Te.shared.add(this.updateFrame, this), this._isConnectedToTicker = !0, this._msToNextUpdate = 0)) : (this._videoFrameRequestCallbackHandle !== null && (this.resource.cancelVideoFrameCallback(this._videoFrameRequestCallbackHandle), this._videoFrameRequestCallbackHandle = null), this._isConnectedToTicker && (Te.shared.remove(this.updateFrame, this), this._isConnectedToTicker = !1, this._msToNextUpdate = 0));
  }
  static test(t) {
    return globalThis.HTMLVideoElement && t instanceof HTMLVideoElement;
  }
};
Cn.extension = D.TextureSource;
Cn.defaultOptions = {
  ...Ae.defaultOptions,
  /** If true, the video will start loading immediately. */
  autoLoad: !0,
  /** If true, the video will start playing as soon as it is loaded. */
  autoPlay: !0,
  /** The number of times a second to update the texture from the video. Leave at 0 to update at every render. */
  updateFPS: 0,
  /** If true, the video will be loaded with the `crossorigin` attribute. */
  crossorigin: !0,
  /** If true, the video will loop when it ends. */
  loop: !1,
  /** If true, the video will be muted. */
  muted: !0,
  /** If true, the video will play inline. */
  playsinline: !0,
  /** If true, the video will be preloaded. */
  preload: !1
};
Cn.MIME_TYPES = {
  ogv: "video/ogg",
  mov: "video/quicktime",
  m4v: "video/mp4"
};
let tn = Cn;
const he = (i, t, e = !1) => (Array.isArray(i) || (i = [i]), t ? i.map((r) => typeof r == "string" || e ? t(r) : r) : i);
class Od {
  constructor() {
    this._parsers = [], this._cache = /* @__PURE__ */ new Map(), this._cacheMap = /* @__PURE__ */ new Map();
  }
  /** Clear all entries. */
  reset() {
    this._cacheMap.clear(), this._cache.clear();
  }
  /**
   * Check if the key exists
   * @param key - The key to check
   */
  has(t) {
    return this._cache.has(t);
  }
  /**
   * Fetch entry by key
   * @param key - The key of the entry to get
   */
  get(t) {
    const e = this._cache.get(t);
    return e || dt(`[Assets] Asset id ${t} was not found in the Cache`), e;
  }
  /**
   * Set a value by key or keys name
   * @param key - The key or keys to set
   * @param value - The value to store in the cache or from which cacheable assets will be derived.
   */
  set(t, e) {
    const r = he(t);
    let s;
    for (let h = 0; h < this.parsers.length; h++) {
      const c = this.parsers[h];
      if (c.test(e)) {
        s = c.getCacheableAssets(r, e);
        break;
      }
    }
    const n = new Map(Object.entries(s || {}));
    s || r.forEach((h) => {
      n.set(h, e);
    });
    const o = [...n.keys()], a = {
      cacheKeys: o,
      keys: r
    };
    r.forEach((h) => {
      this._cacheMap.set(h, a);
    }), o.forEach((h) => {
      const c = s ? s[h] : e;
      this._cache.has(h) && this._cache.get(h) !== c && dt("[Cache] already has key:", h), this._cache.set(h, n.get(h));
    });
  }
  /**
   * Remove entry by key
   *
   * This function will also remove any associated alias from the cache also.
   * @param key - The key of the entry to remove
   */
  remove(t) {
    if (!this._cacheMap.has(t)) {
      dt(`[Assets] Asset id ${t} was not found in the Cache`);
      return;
    }
    const e = this._cacheMap.get(t);
    e.cacheKeys.forEach((r) => {
      this._cache.delete(r);
    }), e.keys.forEach((r) => {
      this._cacheMap.delete(r);
    });
  }
  /** All loader parsers registered */
  get parsers() {
    return this._parsers;
  }
}
const nt = new Od(), Hs = [];
Mt.handleByList(D.TextureSource, Hs);
function wl(i = {}) {
  const t = i && i.resource, e = t ? i.resource : i, r = t ? i : { resource: i };
  for (let s = 0; s < Hs.length; s++) {
    const n = Hs[s];
    if (n.test(e))
      return new n(r);
  }
  throw new Error(`Could not find a source type for resource: ${r.resource}`);
}
function Fd(i = {}, t = !1) {
  const e = i && i.resource, r = e ? i.resource : i, s = e ? i : { resource: i };
  if (!t && nt.has(r))
    return nt.get(r);
  const n = new H({ source: wl(s) });
  return n.on("destroy", () => {
    nt.has(r) && nt.remove(r);
  }), t || nt.set(r, n), n;
}
function Ld(i, t = !1) {
  return typeof i == "string" ? nt.get(i) : i instanceof Ae ? new H({ source: i }) : Fd(i, t);
}
H.from = Ld;
Ae.from = wl;
Mt.add(ml, gl, yl, tn, Ni, xl, Po);
var Fe = /* @__PURE__ */ ((i) => (i[i.Low = 0] = "Low", i[i.Normal = 1] = "Normal", i[i.High = 2] = "High", i))(Fe || {});
function ae(i) {
  if (typeof i != "string")
    throw new TypeError(`Path must be a string. Received ${JSON.stringify(i)}`);
}
function $i(i) {
  return i.split("?")[0].split("#")[0];
}
function zd(i) {
  return i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Dd(i, t, e) {
  return i.replace(new RegExp(zd(t), "g"), e);
}
function Ud(i, t) {
  let e = "", r = 0, s = -1, n = 0, o = -1;
  for (let a = 0; a <= i.length; ++a) {
    if (a < i.length)
      o = i.charCodeAt(a);
    else {
      if (o === 47)
        break;
      o = 47;
    }
    if (o === 47) {
      if (!(s === a - 1 || n === 1)) if (s !== a - 1 && n === 2) {
        if (e.length < 2 || r !== 2 || e.charCodeAt(e.length - 1) !== 46 || e.charCodeAt(e.length - 2) !== 46) {
          if (e.length > 2) {
            const h = e.lastIndexOf("/");
            if (h !== e.length - 1) {
              h === -1 ? (e = "", r = 0) : (e = e.slice(0, h), r = e.length - 1 - e.lastIndexOf("/")), s = a, n = 0;
              continue;
            }
          } else if (e.length === 2 || e.length === 1) {
            e = "", r = 0, s = a, n = 0;
            continue;
          }
        }
      } else
        e.length > 0 ? e += `/${i.slice(s + 1, a)}` : e = i.slice(s + 1, a), r = a - s - 1;
      s = a, n = 0;
    } else o === 46 && n !== -1 ? ++n : n = -1;
  }
  return e;
}
const Ct = {
  /**
   * Converts a path to posix format.
   * @param path - The path to convert to posix
   */
  toPosix(i) {
    return Dd(i, "\\", "/");
  },
  /**
   * Checks if the path is a URL e.g. http://, https://
   * @param path - The path to check
   */
  isUrl(i) {
    return /^https?:/.test(this.toPosix(i));
  },
  /**
   * Checks if the path is a data URL
   * @param path - The path to check
   */
  isDataUrl(i) {
    return /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z0-9-.!#$%*+.{}|~`]+=[a-z0-9-.!#$%*+.{}()_|~`]+)*)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s<>]*?)$/i.test(i);
  },
  /**
   * Checks if the path is a blob URL
   * @param path - The path to check
   */
  isBlobUrl(i) {
    return i.startsWith("blob:");
  },
  /**
   * Checks if the path has a protocol e.g. http://, https://, file:///, data:, blob:, C:/
   * This will return true for windows file paths
   * @param path - The path to check
   */
  hasProtocol(i) {
    return /^[^/:]+:/.test(this.toPosix(i));
  },
  /**
   * Returns the protocol of the path e.g. http://, https://, file:///, data:, blob:, C:/
   * @param path - The path to get the protocol from
   */
  getProtocol(i) {
    ae(i), i = this.toPosix(i);
    const t = /^file:\/\/\//.exec(i);
    if (t)
      return t[0];
    const e = /^[^/:]+:\/{0,2}/.exec(i);
    return e ? e[0] : "";
  },
  /**
   * Converts URL to an absolute path.
   * When loading from a Web Worker, we must use absolute paths.
   * If the URL is already absolute we return it as is
   * If it's not, we convert it
   * @param url - The URL to test
   * @param customBaseUrl - The base URL to use
   * @param customRootUrl - The root URL to use
   */
  toAbsolute(i, t, e) {
    if (ae(i), this.isDataUrl(i) || this.isBlobUrl(i))
      return i;
    const r = $i(this.toPosix(t ?? at.get().getBaseUrl())), s = $i(this.toPosix(e ?? this.rootname(r)));
    return i = this.toPosix(i), i.startsWith("/") ? Ct.join(s, i.slice(1)) : this.isAbsolute(i) ? i : this.join(r, i);
  },
  /**
   * Normalizes the given path, resolving '..' and '.' segments
   * @param path - The path to normalize
   */
  normalize(i) {
    if (ae(i), i.length === 0)
      return ".";
    if (this.isDataUrl(i) || this.isBlobUrl(i))
      return i;
    i = this.toPosix(i);
    let t = "";
    const e = i.startsWith("/");
    this.hasProtocol(i) && (t = this.rootname(i), i = i.slice(t.length));
    const r = i.endsWith("/");
    return i = Ud(i), i.length > 0 && r && (i += "/"), e ? `/${i}` : t + i;
  },
  /**
   * Determines if path is an absolute path.
   * Absolute paths can be urls, data urls, or paths on disk
   * @param path - The path to test
   */
  isAbsolute(i) {
    return ae(i), i = this.toPosix(i), this.hasProtocol(i) ? !0 : i.startsWith("/");
  },
  /**
   * Joins all given path segments together using the platform-specific separator as a delimiter,
   * then normalizes the resulting path
   * @param segments - The segments of the path to join
   */
  join(...i) {
    if (i.length === 0)
      return ".";
    let t;
    for (let e = 0; e < i.length; ++e) {
      const r = i[e];
      if (ae(r), r.length > 0)
        if (t === void 0)
          t = r;
        else {
          const s = i[e - 1] ?? "";
          this.joinExtensions.includes(this.extname(s).toLowerCase()) ? t += `/../${r}` : t += `/${r}`;
        }
    }
    return t === void 0 ? "." : this.normalize(t);
  },
  /**
   * Returns the directory name of a path
   * @param path - The path to parse
   */
  dirname(i) {
    if (ae(i), i.length === 0)
      return ".";
    i = this.toPosix(i);
    let t = i.charCodeAt(0);
    const e = t === 47;
    let r = -1, s = !0;
    const n = this.getProtocol(i), o = i;
    i = i.slice(n.length);
    for (let a = i.length - 1; a >= 1; --a)
      if (t = i.charCodeAt(a), t === 47) {
        if (!s) {
          r = a;
          break;
        }
      } else
        s = !1;
    return r === -1 ? e ? "/" : this.isUrl(o) ? n + i : n : e && r === 1 ? "//" : n + i.slice(0, r);
  },
  /**
   * Returns the root of the path e.g. /, C:/, file:///, http://domain.com/
   * @param path - The path to parse
   */
  rootname(i) {
    ae(i), i = this.toPosix(i);
    let t = "";
    if (i.startsWith("/") ? t = "/" : t = this.getProtocol(i), this.isUrl(i)) {
      const e = i.indexOf("/", t.length);
      e !== -1 ? t = i.slice(0, e) : t = i, t.endsWith("/") || (t += "/");
    }
    return t;
  },
  /**
   * Returns the last portion of a path
   * @param path - The path to test
   * @param ext - Optional extension to remove
   */
  basename(i, t) {
    ae(i), t && ae(t), i = $i(this.toPosix(i));
    let e = 0, r = -1, s = !0, n;
    if (t !== void 0 && t.length > 0 && t.length <= i.length) {
      if (t.length === i.length && t === i)
        return "";
      let o = t.length - 1, a = -1;
      for (n = i.length - 1; n >= 0; --n) {
        const h = i.charCodeAt(n);
        if (h === 47) {
          if (!s) {
            e = n + 1;
            break;
          }
        } else
          a === -1 && (s = !1, a = n + 1), o >= 0 && (h === t.charCodeAt(o) ? --o === -1 && (r = n) : (o = -1, r = a));
      }
      return e === r ? r = a : r === -1 && (r = i.length), i.slice(e, r);
    }
    for (n = i.length - 1; n >= 0; --n)
      if (i.charCodeAt(n) === 47) {
        if (!s) {
          e = n + 1;
          break;
        }
      } else r === -1 && (s = !1, r = n + 1);
    return r === -1 ? "" : i.slice(e, r);
  },
  /**
   * Returns the extension of the path, from the last occurrence of the . (period) character to end of string in the last
   * portion of the path. If there is no . in the last portion of the path, or if there are no . characters other than
   * the first character of the basename of path, an empty string is returned.
   * @param path - The path to parse
   */
  extname(i) {
    ae(i), i = $i(this.toPosix(i));
    let t = -1, e = 0, r = -1, s = !0, n = 0;
    for (let o = i.length - 1; o >= 0; --o) {
      const a = i.charCodeAt(o);
      if (a === 47) {
        if (!s) {
          e = o + 1;
          break;
        }
        continue;
      }
      r === -1 && (s = !1, r = o + 1), a === 46 ? t === -1 ? t = o : n !== 1 && (n = 1) : t !== -1 && (n = -1);
    }
    return t === -1 || r === -1 || n === 0 || n === 1 && t === r - 1 && t === e + 1 ? "" : i.slice(t, r);
  },
  /**
   * Parses a path into an object containing the 'root', `dir`, `base`, `ext`, and `name` properties.
   * @param path - The path to parse
   */
  parse(i) {
    ae(i);
    const t = { root: "", dir: "", base: "", ext: "", name: "" };
    if (i.length === 0)
      return t;
    i = $i(this.toPosix(i));
    let e = i.charCodeAt(0);
    const r = this.isAbsolute(i);
    let s;
    t.root = this.rootname(i), r || this.hasProtocol(i) ? s = 1 : s = 0;
    let n = -1, o = 0, a = -1, h = !0, c = i.length - 1, l = 0;
    for (; c >= s; --c) {
      if (e = i.charCodeAt(c), e === 47) {
        if (!h) {
          o = c + 1;
          break;
        }
        continue;
      }
      a === -1 && (h = !1, a = c + 1), e === 46 ? n === -1 ? n = c : l !== 1 && (l = 1) : n !== -1 && (l = -1);
    }
    return n === -1 || a === -1 || l === 0 || l === 1 && n === a - 1 && n === o + 1 ? a !== -1 && (o === 0 && r ? t.base = t.name = i.slice(1, a) : t.base = t.name = i.slice(o, a)) : (o === 0 && r ? (t.name = i.slice(1, n), t.base = i.slice(1, a)) : (t.name = i.slice(o, n), t.base = i.slice(o, a)), t.ext = i.slice(n, a)), t.dir = this.dirname(i), t;
  },
  sep: "/",
  delimiter: ":",
  joinExtensions: [".html"]
};
function Al(i, t, e, r, s) {
  const n = t[e];
  for (let o = 0; o < n.length; o++) {
    const a = n[o];
    e < t.length - 1 ? Al(i.replace(r[e], a), t, e + 1, r, s) : s.push(i.replace(r[e], a));
  }
}
function Gd(i) {
  const t = /\{(.*?)\}/g, e = i.match(t), r = [];
  if (e) {
    const s = [];
    e.forEach((n) => {
      const o = n.substring(1, n.length - 1).split(",");
      s.push(o);
    }), Al(i, s, 0, e, r);
  } else
    r.push(i);
  return r;
}
const cn = (i) => !Array.isArray(i);
class Wi {
  constructor() {
    this._defaultBundleIdentifierOptions = {
      connector: "-",
      createBundleAssetId: (t, e) => `${t}${this._bundleIdConnector}${e}`,
      extractAssetIdFromBundle: (t, e) => e.replace(`${t}${this._bundleIdConnector}`, "")
    }, this._bundleIdConnector = this._defaultBundleIdentifierOptions.connector, this._createBundleAssetId = this._defaultBundleIdentifierOptions.createBundleAssetId, this._extractAssetIdFromBundle = this._defaultBundleIdentifierOptions.extractAssetIdFromBundle, this._assetMap = {}, this._preferredOrder = [], this._parsers = [], this._resolverHash = {}, this._bundles = {};
  }
  /**
   * Override how the resolver deals with generating bundle ids.
   * must be called before any bundles are added
   * @param bundleIdentifier - the bundle identifier options
   */
  setBundleIdentifier(t) {
    if (this._bundleIdConnector = t.connector ?? this._bundleIdConnector, this._createBundleAssetId = t.createBundleAssetId ?? this._createBundleAssetId, this._extractAssetIdFromBundle = t.extractAssetIdFromBundle ?? this._extractAssetIdFromBundle, this._extractAssetIdFromBundle("foo", this._createBundleAssetId("foo", "bar")) !== "bar")
      throw new Error("[Resolver] GenerateBundleAssetId are not working correctly");
  }
  /**
   * Let the resolver know which assets you prefer to use when resolving assets.
   * Multiple prefer user defined rules can be added.
   * @example
   * resolver.prefer({
   *     // first look for something with the correct format, and then then correct resolution
   *     priority: ['format', 'resolution'],
   *     params:{
   *         format:'webp', // prefer webp images
   *         resolution: 2, // prefer a resolution of 2
   *     }
   * })
   * resolver.add('foo', ['bar@2x.webp', 'bar@2x.png', 'bar.webp', 'bar.png']);
   * resolver.resolveUrl('foo') // => 'bar@2x.webp'
   * @param preferOrders - the prefer options
   */
  prefer(...t) {
    t.forEach((e) => {
      this._preferredOrder.push(e), e.priority || (e.priority = Object.keys(e.params));
    }), this._resolverHash = {};
  }
  /**
   * Set the base path to prepend to all urls when resolving
   * @example
   * resolver.basePath = 'https://home.com/';
   * resolver.add('foo', 'bar.ong');
   * resolver.resolveUrl('foo', 'bar.png'); // => 'https://home.com/bar.png'
   * @param basePath - the base path to use
   */
  set basePath(t) {
    this._basePath = t;
  }
  get basePath() {
    return this._basePath;
  }
  /**
   * Set the root path for root-relative URLs. By default the `basePath`'s root is used. If no `basePath` is set, then the
   * default value for browsers is `window.location.origin`
   * @example
   * // Application hosted on https://home.com/some-path/index.html
   * resolver.basePath = 'https://home.com/some-path/';
   * resolver.rootPath = 'https://home.com/';
   * resolver.add('foo', '/bar.png');
   * resolver.resolveUrl('foo', '/bar.png'); // => 'https://home.com/bar.png'
   * @param rootPath - the root path to use
   */
  set rootPath(t) {
    this._rootPath = t;
  }
  get rootPath() {
    return this._rootPath;
  }
  /**
   * All the active URL parsers that help the parser to extract information and create
   * an asset object-based on parsing the URL itself.
   *
   * Can be added using the extensions API
   * @example
   * resolver.add('foo', [
   *     {
   *         resolution: 2,
   *         format: 'png',
   *         src: 'image@2x.png',
   *     },
   *     {
   *         resolution:1,
   *         format:'png',
   *         src: 'image.png',
   *     },
   * ]);
   *
   * // With a url parser the information such as resolution and file format could extracted from the url itself:
   * extensions.add({
   *     extension: ExtensionType.ResolveParser,
   *     test: loadTextures.test, // test if url ends in an image
   *     parse: (value: string) =>
   *     ({
   *         resolution: parseFloat(Resolver.RETINA_PREFIX.exec(value)?.[1] ?? '1'),
   *         format: value.split('.').pop(),
   *         src: value,
   *     }),
   * });
   *
   * // Now resolution and format can be extracted from the url
   * resolver.add('foo', [
   *     'image@2x.png',
   *     'image.png',
   * ]);
   */
  get parsers() {
    return this._parsers;
  }
  /** Used for testing, this resets the resolver to its initial state */
  reset() {
    this.setBundleIdentifier(this._defaultBundleIdentifierOptions), this._assetMap = {}, this._preferredOrder = [], this._resolverHash = {}, this._rootPath = null, this._basePath = null, this._manifest = null, this._bundles = {}, this._defaultSearchParams = null;
  }
  /**
   * Sets the default URL search parameters for the URL resolver. The urls can be specified as a string or an object.
   * @param searchParams - the default url parameters to append when resolving urls
   */
  setDefaultSearchParams(t) {
    if (typeof t == "string")
      this._defaultSearchParams = t;
    else {
      const e = t;
      this._defaultSearchParams = Object.keys(e).map((r) => `${encodeURIComponent(r)}=${encodeURIComponent(e[r])}`).join("&");
    }
  }
  /**
   * Returns the aliases for a given asset
   * @param asset - the asset to get the aliases for
   */
  getAlias(t) {
    const { alias: e, src: r } = t;
    return he(
      e || r,
      (s) => typeof s == "string" ? s : Array.isArray(s) ? s.map((n) => (n == null ? void 0 : n.src) ?? n) : s != null && s.src ? s.src : s,
      !0
    );
  }
  /**
   * Add a manifest to the asset resolver. This is a nice way to add all the asset information in one go.
   * generally a manifest would be built using a tool.
   * @param manifest - the manifest to add to the resolver
   */
  addManifest(t) {
    this._manifest && dt("[Resolver] Manifest already exists, this will be overwritten"), this._manifest = t, t.bundles.forEach((e) => {
      this.addBundle(e.name, e.assets);
    });
  }
  /**
   * This adds a bundle of assets in one go so that you can resolve them as a group.
   * For example you could add a bundle for each screen in you pixi app
   * @example
   * resolver.addBundle('animals', [
   *  { alias: 'bunny', src: 'bunny.png' },
   *  { alias: 'chicken', src: 'chicken.png' },
   *  { alias: 'thumper', src: 'thumper.png' },
   * ]);
   * // or
   * resolver.addBundle('animals', {
   *     bunny: 'bunny.png',
   *     chicken: 'chicken.png',
   *     thumper: 'thumper.png',
   * });
   *
   * const resolvedAssets = await resolver.resolveBundle('animals');
   * @param bundleId - The id of the bundle to add
   * @param assets - A record of the asset or assets that will be chosen from when loading via the specified key
   */
  addBundle(t, e) {
    const r = [];
    let s = e;
    Array.isArray(e) || (s = Object.entries(e).map(([n, o]) => typeof o == "string" || Array.isArray(o) ? { alias: n, src: o } : { alias: n, ...o })), s.forEach((n) => {
      const o = n.src, a = n.alias;
      let h;
      if (typeof a == "string") {
        const c = this._createBundleAssetId(t, a);
        r.push(c), h = [a, c];
      } else {
        const c = a.map((l) => this._createBundleAssetId(t, l));
        r.push(...c), h = [...a, ...c];
      }
      this.add({
        ...n,
        alias: h,
        src: o
      });
    }), this._bundles[t] = r;
  }
  /**
   * Tells the resolver what keys are associated with witch asset.
   * The most important thing the resolver does
   * @example
   * // Single key, single asset:
   * resolver.add({alias: 'foo', src: 'bar.png');
   * resolver.resolveUrl('foo') // => 'bar.png'
   *
   * // Multiple keys, single asset:
   * resolver.add({alias: ['foo', 'boo'], src: 'bar.png'});
   * resolver.resolveUrl('foo') // => 'bar.png'
   * resolver.resolveUrl('boo') // => 'bar.png'
   *
   * // Multiple keys, multiple assets:
   * resolver.add({alias: ['foo', 'boo'], src: ['bar.png', 'bar.webp']});
   * resolver.resolveUrl('foo') // => 'bar.png'
   *
   * // Add custom data attached to the resolver
   * Resolver.add({
   *     alias: 'bunnyBooBooSmooth',
   *     src: 'bunny{png,webp}',
   *     data: { scaleMode:SCALE_MODES.NEAREST }, // Base texture options
   * });
   *
   * resolver.resolve('bunnyBooBooSmooth') // => { src: 'bunny.png', data: { scaleMode: SCALE_MODES.NEAREST } }
   * @param aliases - the UnresolvedAsset or array of UnresolvedAssets to add to the resolver
   */
  add(t) {
    const e = [];
    Array.isArray(t) ? e.push(...t) : e.push(t);
    let r;
    r = (s) => {
      this.hasKey(s) && dt(`[Resolver] already has key: ${s} overwriting`);
    }, he(e).forEach((s) => {
      const { src: n } = s;
      let { data: o, format: a, loadParser: h } = s;
      const c = he(n).map((p) => typeof p == "string" ? Gd(p) : Array.isArray(p) ? p : [p]), l = this.getAlias(s);
      Array.isArray(l) ? l.forEach(r) : r(l);
      const f = [];
      c.forEach((p) => {
        p.forEach((u) => {
          let d = {};
          if (typeof u != "object") {
            d.src = u;
            for (let m = 0; m < this._parsers.length; m++) {
              const g = this._parsers[m];
              if (g.test(u)) {
                d = g.parse(u);
                break;
              }
            }
          } else
            o = u.data ?? o, a = u.format ?? a, h = u.loadParser ?? h, d = {
              ...d,
              ...u
            };
          if (!l)
            throw new Error(`[Resolver] alias is undefined for this asset: ${d.src}`);
          d = this._buildResolvedAsset(d, {
            aliases: l,
            data: o,
            format: a,
            loadParser: h
          }), f.push(d);
        });
      }), l.forEach((p) => {
        this._assetMap[p] = f;
      });
    });
  }
  // TODO: this needs an overload like load did in Assets
  /**
   * If the resolver has had a manifest set via setManifest, this will return the assets urls for
   * a given bundleId or bundleIds.
   * @example
   * // Manifest Example
   * const manifest = {
   *     bundles: [
   *         {
   *             name: 'load-screen',
   *             assets: [
   *                 {
   *                     alias: 'background',
   *                     src: 'sunset.png',
   *                 },
   *                 {
   *                     alias: 'bar',
   *                     src: 'load-bar.{png,webp}',
   *                 },
   *             ],
   *         },
   *         {
   *             name: 'game-screen',
   *             assets: [
   *                 {
   *                     alias: 'character',
   *                     src: 'robot.png',
   *                 },
   *                 {
   *                     alias: 'enemy',
   *                     src: 'bad-guy.png',
   *                 },
   *             ],
   *         },
   *     ]
   * };
   *
   * resolver.setManifest(manifest);
   * const resolved = resolver.resolveBundle('load-screen');
   * @param bundleIds - The bundle ids to resolve
   * @returns All the bundles assets or a hash of assets for each bundle specified
   */
  resolveBundle(t) {
    const e = cn(t);
    t = he(t);
    const r = {};
    return t.forEach((s) => {
      const n = this._bundles[s];
      if (n) {
        const o = this.resolve(n), a = {};
        for (const h in o) {
          const c = o[h];
          a[this._extractAssetIdFromBundle(s, h)] = c;
        }
        r[s] = a;
      }
    }), e ? r[t[0]] : r;
  }
  /**
   * Does exactly what resolve does, but returns just the URL rather than the whole asset object
   * @param key - The key or keys to resolve
   * @returns - The URLs associated with the key(s)
   */
  resolveUrl(t) {
    const e = this.resolve(t);
    if (typeof t != "string") {
      const r = {};
      for (const s in e)
        r[s] = e[s].src;
      return r;
    }
    return e.src;
  }
  resolve(t) {
    const e = cn(t);
    t = he(t);
    const r = {};
    return t.forEach((s) => {
      if (!this._resolverHash[s])
        if (this._assetMap[s]) {
          let n = this._assetMap[s];
          const o = this._getPreferredOrder(n);
          o == null || o.priority.forEach((a) => {
            o.params[a].forEach((h) => {
              const c = n.filter((l) => l[a] ? l[a] === h : !1);
              c.length && (n = c);
            });
          }), this._resolverHash[s] = n[0];
        } else
          this._resolverHash[s] = this._buildResolvedAsset({
            alias: [s],
            src: s
          }, {});
      r[s] = this._resolverHash[s];
    }), e ? r[t[0]] : r;
  }
  /**
   * Checks if an asset with a given key exists in the resolver
   * @param key - The key of the asset
   */
  hasKey(t) {
    return !!this._assetMap[t];
  }
  /**
   * Checks if a bundle with the given key exists in the resolver
   * @param key - The key of the bundle
   */
  hasBundle(t) {
    return !!this._bundles[t];
  }
  /**
   * Internal function for figuring out what prefer criteria an asset should use.
   * @param assets
   */
  _getPreferredOrder(t) {
    for (let e = 0; e < t.length; e++) {
      const r = t[0], s = this._preferredOrder.find((n) => n.params.format.includes(r.format));
      if (s)
        return s;
    }
    return this._preferredOrder[0];
  }
  /**
   * Appends the default url parameters to the url
   * @param url - The url to append the default parameters to
   * @returns - The url with the default parameters appended
   */
  _appendDefaultSearchParams(t) {
    if (!this._defaultSearchParams)
      return t;
    const e = /\?/.test(t) ? "&" : "?";
    return `${t}${e}${this._defaultSearchParams}`;
  }
  _buildResolvedAsset(t, e) {
    const { aliases: r, data: s, loadParser: n, format: o } = e;
    return (this._basePath || this._rootPath) && (t.src = Ct.toAbsolute(t.src, this._basePath, this._rootPath)), t.alias = r ?? t.alias ?? [t.src], t.src = this._appendDefaultSearchParams(t.src), t.data = { ...s || {}, ...t.data }, t.loadParser = n ?? t.loadParser, t.format = o ?? t.format ?? Vd(t.src), t;
  }
}
Wi.RETINA_PREFIX = /@([0-9\.]+)x/;
function Vd(i) {
  return i.split(".").pop().split("?").shift().split("#").shift();
}
const js = (i, t) => {
  const e = t.split("?")[1];
  return e && (i += `?${e}`), i;
}, Sl = class or {
  /**
   * @param texture - Reference to the source BaseTexture object.
   * @param {object} data - Spritesheet image data.
   */
  constructor(t, e) {
    this.linkedSheets = [], this._texture = t instanceof H ? t : null, this.textureSource = t.source, this.textures = {}, this.animations = {}, this.data = e;
    const r = parseFloat(e.meta.scale);
    r ? (this.resolution = r, t.source.resolution = this.resolution) : this.resolution = t.source._resolution, this._frames = this.data.frames, this._frameKeys = Object.keys(this._frames), this._batchIndex = 0, this._callback = null;
  }
  /**
   * Parser spritesheet from loaded data. This is done asynchronously
   * to prevent creating too many Texture within a single process.
   */
  parse() {
    return new Promise((t) => {
      this._callback = t, this._batchIndex = 0, this._frameKeys.length <= or.BATCH_SIZE ? (this._processFrames(0), this._processAnimations(), this._parseComplete()) : this._nextBatch();
    });
  }
  /**
   * Process a batch of frames
   * @param initialFrameIndex - The index of frame to start.
   */
  _processFrames(t) {
    let e = t;
    const r = or.BATCH_SIZE;
    for (; e - t < r && e < this._frameKeys.length; ) {
      const s = this._frameKeys[e], n = this._frames[s], o = n.frame;
      if (o) {
        let a = null, h = null;
        const c = n.trimmed !== !1 && n.sourceSize ? n.sourceSize : n.frame, l = new mt(
          0,
          0,
          Math.floor(c.w) / this.resolution,
          Math.floor(c.h) / this.resolution
        );
        n.rotated ? a = new mt(
          Math.floor(o.x) / this.resolution,
          Math.floor(o.y) / this.resolution,
          Math.floor(o.h) / this.resolution,
          Math.floor(o.w) / this.resolution
        ) : a = new mt(
          Math.floor(o.x) / this.resolution,
          Math.floor(o.y) / this.resolution,
          Math.floor(o.w) / this.resolution,
          Math.floor(o.h) / this.resolution
        ), n.trimmed !== !1 && n.spriteSourceSize && (h = new mt(
          Math.floor(n.spriteSourceSize.x) / this.resolution,
          Math.floor(n.spriteSourceSize.y) / this.resolution,
          Math.floor(o.w) / this.resolution,
          Math.floor(o.h) / this.resolution
        )), this.textures[s] = new H({
          source: this.textureSource,
          frame: a,
          orig: l,
          trim: h,
          rotate: n.rotated ? 2 : 0,
          defaultAnchor: n.anchor,
          defaultBorders: n.borders,
          label: s.toString()
        });
      }
      e++;
    }
  }
  /** Parse animations config. */
  _processAnimations() {
    const t = this.data.animations || {};
    for (const e in t) {
      this.animations[e] = [];
      for (let r = 0; r < t[e].length; r++) {
        const s = t[e][r];
        this.animations[e].push(this.textures[s]);
      }
    }
  }
  /** The parse has completed. */
  _parseComplete() {
    const t = this._callback;
    this._callback = null, this._batchIndex = 0, t.call(this, this.textures);
  }
  /** Begin the next batch of textures. */
  _nextBatch() {
    this._processFrames(this._batchIndex * or.BATCH_SIZE), this._batchIndex++, setTimeout(() => {
      this._batchIndex * or.BATCH_SIZE < this._frameKeys.length ? this._nextBatch() : (this._processAnimations(), this._parseComplete());
    }, 0);
  }
  /**
   * Destroy Spritesheet and don't use after this.
   * @param {boolean} [destroyBase=false] - Whether to destroy the base texture as well
   */
  destroy(t = !1) {
    var e;
    for (const r in this.textures)
      this.textures[r].destroy();
    this._frames = null, this._frameKeys = null, this.data = null, this.textures = null, t && ((e = this._texture) == null || e.destroy(), this.textureSource.destroy()), this._texture = null, this.textureSource = null, this.linkedSheets = [];
  }
};
Sl.BATCH_SIZE = 1e3;
let Ea = Sl;
const Hd = [
  "jpg",
  "png",
  "jpeg",
  "avif",
  "webp",
  "basis",
  "etc2",
  "bc7",
  "bc6h",
  "bc5",
  "bc4",
  "bc3",
  "bc2",
  "bc1",
  "eac",
  "astc"
];
function Cl(i, t, e) {
  const r = {};
  if (i.forEach((s) => {
    r[s] = t;
  }), Object.keys(t.textures).forEach((s) => {
    r[s] = t.textures[s];
  }), !e) {
    const s = Ct.dirname(i[0]);
    t.linkedSheets.forEach((n, o) => {
      const a = Cl([`${s}/${t.data.meta.related_multi_packs[o]}`], n, !0);
      Object.assign(r, a);
    });
  }
  return r;
}
const jd = {
  extension: D.Asset,
  /** Handle the caching of the related Spritesheet Textures */
  cache: {
    test: (i) => i instanceof Ea,
    getCacheableAssets: (i, t) => Cl(i, t, !1)
  },
  /** Resolve the resolution of the asset. */
  resolver: {
    extension: {
      type: D.ResolveParser,
      name: "resolveSpritesheet"
    },
    test: (i) => {
      const t = i.split("?")[0].split("."), e = t.pop(), r = t.pop();
      return e === "json" && Hd.includes(r);
    },
    parse: (i) => {
      var t;
      const e = i.split(".");
      return {
        resolution: parseFloat(((t = Wi.RETINA_PREFIX.exec(i)) == null ? void 0 : t[1]) ?? "1"),
        format: e[e.length - 2],
        src: i
      };
    }
  },
  /**
   * Loader plugin that parses sprite sheets!
   * once the JSON has been loaded this checks to see if the JSON is spritesheet data.
   * If it is, we load the spritesheets image and parse the data into Spritesheet
   * All textures in the sprite sheet are then added to the cache
   */
  loader: {
    name: "spritesheetLoader",
    extension: {
      type: D.LoadParser,
      priority: Fe.Normal,
      name: "spritesheetLoader"
    },
    async testParse(i, t) {
      return Ct.extname(t.src).toLowerCase() === ".json" && !!i.frames;
    },
    async parse(i, t, e) {
      var r, s;
      const {
        texture: n,
        // if user need to use preloaded texture
        imageFilename: o
        // if user need to use custom filename (not from jsonFile.meta.image)
      } = (t == null ? void 0 : t.data) ?? {};
      let a = Ct.dirname(t.src);
      a && a.lastIndexOf("/") !== a.length - 1 && (a += "/");
      let h;
      if (n instanceof H)
        h = n;
      else {
        const f = js(a + (o ?? i.meta.image), t.src);
        h = (await e.load([f]))[f];
      }
      const c = new Ea(
        h.source,
        i
      );
      await c.parse();
      const l = (r = i == null ? void 0 : i.meta) == null ? void 0 : r.related_multi_packs;
      if (Array.isArray(l)) {
        const f = [];
        for (const u of l) {
          if (typeof u != "string")
            continue;
          let d = a + u;
          (s = t.data) != null && s.ignoreMultiPack || (d = js(d, t.src), f.push(e.load({
            src: d,
            data: {
              ignoreMultiPack: !0
            }
          })));
        }
        const p = await Promise.all(f);
        c.linkedSheets = p, p.forEach((u) => {
          u.linkedSheets = [c].concat(c.linkedSheets.filter((d) => d !== u));
        });
      }
      return c;
    },
    async unload(i, t, e) {
      await e.unload(i.textureSource._sourceOrigin), i.destroy(!1);
    }
  }
};
Mt.add(jd);
var as = /iPhone/i, Ba = /iPod/i, Ra = /iPad/i, Ia = /\biOS-universal(?:.+)Mac\b/i, hs = /\bAndroid(?:.+)Mobile\b/i, Oa = /Android/i, vi = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i, Wr = /Silk/i, Pe = /Windows Phone/i, Fa = /\bWindows(?:.+)ARM\b/i, La = /BlackBerry/i, za = /BB10/i, Da = /Opera Mini/i, Ua = /\b(CriOS|Chrome)(?:.+)Mobile/i, Ga = /Mobile(?:.+)Firefox\b/i, Va = function(i) {
  return typeof i < "u" && i.platform === "MacIntel" && typeof i.maxTouchPoints == "number" && i.maxTouchPoints > 1 && typeof MSStream > "u";
};
function Nd(i) {
  return function(t) {
    return t.test(i);
  };
}
function Ha(i) {
  var t = {
    userAgent: "",
    platform: "",
    maxTouchPoints: 0
  };
  !i && typeof navigator < "u" ? t = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    maxTouchPoints: navigator.maxTouchPoints || 0
  } : typeof i == "string" ? t.userAgent = i : i && i.userAgent && (t = {
    userAgent: i.userAgent,
    platform: i.platform,
    maxTouchPoints: i.maxTouchPoints || 0
  });
  var e = t.userAgent, r = e.split("[FBAN");
  typeof r[1] < "u" && (e = r[0]), r = e.split("Twitter"), typeof r[1] < "u" && (e = r[0]);
  var s = Nd(e), n = {
    apple: {
      phone: s(as) && !s(Pe),
      ipod: s(Ba),
      tablet: !s(as) && (s(Ra) || Va(t)) && !s(Pe),
      universal: s(Ia),
      device: (s(as) || s(Ba) || s(Ra) || s(Ia) || Va(t)) && !s(Pe)
    },
    amazon: {
      phone: s(vi),
      tablet: !s(vi) && s(Wr),
      device: s(vi) || s(Wr)
    },
    android: {
      phone: !s(Pe) && s(vi) || !s(Pe) && s(hs),
      tablet: !s(Pe) && !s(vi) && !s(hs) && (s(Wr) || s(Oa)),
      device: !s(Pe) && (s(vi) || s(Wr) || s(hs) || s(Oa)) || s(/\bokhttp\b/i)
    },
    windows: {
      phone: s(Pe),
      tablet: s(Fa),
      device: s(Pe) || s(Fa)
    },
    other: {
      blackberry: s(La),
      blackberry10: s(za),
      opera: s(Da),
      firefox: s(Ga),
      chrome: s(Ua),
      device: s(La) || s(za) || s(Da) || s(Ga) || s(Ua)
    },
    any: !1,
    phone: !1,
    tablet: !1
  };
  return n.any = n.apple.device || n.android.device || n.windows.device || n.other.device, n.phone = n.apple.phone || n.android.phone || n.windows.phone, n.tablet = n.apple.tablet || n.android.tablet || n.windows.tablet, n;
}
const Wd = Ha.default ?? Ha, xx = Wd(globalThis.navigator), ls = /* @__PURE__ */ Object.create(null), ja = /* @__PURE__ */ Object.create(null);
function Mo(i, t) {
  let e = ja[i];
  return e === void 0 && (ls[t] === void 0 && (ls[t] = 1), ja[i] = e = ls[t]++), e;
}
let tr;
function Pl() {
  return (!tr || tr != null && tr.isContextLost()) && (tr = at.get().createCanvas().getContext("webgl", {})), tr;
}
let Yr;
function Yd() {
  if (!Yr) {
    Yr = "mediump";
    const i = Pl();
    i && i.getShaderPrecisionFormat && (Yr = i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.HIGH_FLOAT).precision ? "highp" : "mediump");
  }
  return Yr;
}
function Xd(i, t, e) {
  return t ? i : e ? (i = i.replace("out vec4 finalColor;", ""), `
        
        #ifdef GL_ES // This checks if it is WebGL1
        #define in varying
        #define finalColor gl_FragColor
        #define texture texture2D
        #endif
        ${i}
        `) : `
        
        #ifdef GL_ES // This checks if it is WebGL1
        #define in attribute
        #define out varying
        #endif
        ${i}
        `;
}
function qd(i, t, e) {
  const r = e ? t.maxSupportedFragmentPrecision : t.maxSupportedVertexPrecision;
  if (i.substring(0, 9) !== "precision") {
    let s = e ? t.requestedFragmentPrecision : t.requestedVertexPrecision;
    return s === "highp" && r !== "highp" && (s = "mediump"), `precision ${s} float;
${i}`;
  } else if (r !== "highp" && i.substring(0, 15) === "precision highp")
    return i.replace("precision highp", "precision mediump");
  return i;
}
function Kd(i, t) {
  return t ? `#version 300 es
${i}` : i;
}
const Qd = {}, Jd = {};
function Zd(i, { name: t = "pixi-program" }, e = !0) {
  t = t.replace(/\s+/g, "-"), t += e ? "-fragment" : "-vertex";
  const r = e ? Qd : Jd;
  return r[t] ? (r[t]++, t += `-${r[t]}`) : r[t] = 1, i.indexOf("#define SHADER_NAME") !== -1 ? i : `${`#define SHADER_NAME ${t}`}
${i}`;
}
function $d(i, t) {
  return t ? i.replace("#version 300 es", "") : i;
}
const cs = {
  // strips any version headers..
  stripVersion: $d,
  // adds precision string if not already present
  ensurePrecision: qd,
  // add some defines if WebGL1 to make it more compatible with WebGL2 shaders
  addProgramDefines: Xd,
  // add the program name to the shader
  setProgramName: Zd,
  // add the version string to the shader header
  insertVersion: Kd
}, us = /* @__PURE__ */ Object.create(null), kl = class Ns {
  /**
   * Creates a shiny new GlProgram. Used by WebGL renderer.
   * @param options - The options for the program.
   */
  constructor(t) {
    t = { ...Ns.defaultOptions, ...t };
    const e = t.fragment.indexOf("#version 300 es") !== -1, r = {
      stripVersion: e,
      ensurePrecision: {
        requestedFragmentPrecision: t.preferredFragmentPrecision,
        requestedVertexPrecision: t.preferredVertexPrecision,
        maxSupportedVertexPrecision: "highp",
        maxSupportedFragmentPrecision: Yd()
      },
      setProgramName: {
        name: t.name
      },
      addProgramDefines: e,
      insertVersion: e
    };
    let s = t.fragment, n = t.vertex;
    Object.keys(cs).forEach((o) => {
      const a = r[o];
      s = cs[o](s, a, !0), n = cs[o](n, a, !1);
    }), this.fragment = s, this.vertex = n, this._key = Mo(`${this.vertex}:${this.fragment}`, "gl-program");
  }
  /** destroys the program */
  destroy() {
    this.fragment = null, this.vertex = null, this._attributeData = null, this._uniformData = null, this._uniformBlockData = null, this.transformFeedbackVaryings = null;
  }
  /**
   * Helper function that creates a program for a given source.
   * It will check the program cache if the program has already been created.
   * If it has that one will be returned, if not a new one will be created and cached.
   * @param options - The options for the program.
   * @returns A program using the same source
   */
  static from(t) {
    const e = `${t.vertex}:${t.fragment}`;
    return us[e] || (us[e] = new Ns(t)), us[e];
  }
};
kl.defaultOptions = {
  preferredVertexPrecision: "highp",
  preferredFragmentPrecision: "mediump"
};
let Ml = kl;
const Na = {
  uint8x2: { size: 2, stride: 2, normalised: !1 },
  uint8x4: { size: 4, stride: 4, normalised: !1 },
  sint8x2: { size: 2, stride: 2, normalised: !1 },
  sint8x4: { size: 4, stride: 4, normalised: !1 },
  unorm8x2: { size: 2, stride: 2, normalised: !0 },
  unorm8x4: { size: 4, stride: 4, normalised: !0 },
  snorm8x2: { size: 2, stride: 2, normalised: !0 },
  snorm8x4: { size: 4, stride: 4, normalised: !0 },
  uint16x2: { size: 2, stride: 4, normalised: !1 },
  uint16x4: { size: 4, stride: 8, normalised: !1 },
  sint16x2: { size: 2, stride: 4, normalised: !1 },
  sint16x4: { size: 4, stride: 8, normalised: !1 },
  unorm16x2: { size: 2, stride: 4, normalised: !0 },
  unorm16x4: { size: 4, stride: 8, normalised: !0 },
  snorm16x2: { size: 2, stride: 4, normalised: !0 },
  snorm16x4: { size: 4, stride: 8, normalised: !0 },
  float16x2: { size: 2, stride: 4, normalised: !1 },
  float16x4: { size: 4, stride: 8, normalised: !1 },
  float32: { size: 1, stride: 4, normalised: !1 },
  float32x2: { size: 2, stride: 8, normalised: !1 },
  float32x3: { size: 3, stride: 12, normalised: !1 },
  float32x4: { size: 4, stride: 16, normalised: !1 },
  uint32: { size: 1, stride: 4, normalised: !1 },
  uint32x2: { size: 2, stride: 8, normalised: !1 },
  uint32x3: { size: 3, stride: 12, normalised: !1 },
  uint32x4: { size: 4, stride: 16, normalised: !1 },
  sint32: { size: 1, stride: 4, normalised: !1 },
  sint32x2: { size: 2, stride: 8, normalised: !1 },
  sint32x3: { size: 3, stride: 12, normalised: !1 },
  sint32x4: { size: 4, stride: 16, normalised: !1 }
};
function tp(i) {
  return Na[i] ?? Na.float32;
}
const ep = {
  f32: "float32",
  "vec2<f32>": "float32x2",
  "vec3<f32>": "float32x3",
  "vec4<f32>": "float32x4",
  vec2f: "float32x2",
  vec3f: "float32x3",
  vec4f: "float32x4",
  i32: "sint32",
  "vec2<i32>": "sint32x2",
  "vec3<i32>": "sint32x3",
  "vec4<i32>": "sint32x4",
  u32: "uint32",
  "vec2<u32>": "uint32x2",
  "vec3<u32>": "uint32x3",
  "vec4<u32>": "uint32x4",
  bool: "uint32",
  "vec2<bool>": "uint32x2",
  "vec3<bool>": "uint32x3",
  "vec4<bool>": "uint32x4"
};
function ip({ source: i, entryPoint: t }) {
  const e = {}, r = i.indexOf(`fn ${t}`);
  if (r !== -1) {
    const s = i.indexOf("->", r);
    if (s !== -1) {
      const n = i.substring(r, s), o = /@location\((\d+)\)\s+([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z0-9_<>]+)(?:,|\s|$)/g;
      let a;
      for (; (a = o.exec(n)) !== null; ) {
        const h = ep[a[3]] ?? "float32";
        e[a[2]] = {
          location: parseInt(a[1], 10),
          format: h,
          stride: tp(h).stride,
          offset: 0,
          instance: !1,
          start: 0
        };
      }
    }
  }
  return e;
}
function ds(i) {
  var t, e;
  const r = /(^|[^/])@(group|binding)\(\d+\)[^;]+;/g, s = /@group\((\d+)\)/, n = /@binding\((\d+)\)/, o = /var(<[^>]+>)? (\w+)/, a = /:\s*(\w+)/, h = /struct\s+(\w+)\s*{([^}]+)}/g, c = /(\w+)\s*:\s*([\w\<\>]+)/g, l = /struct\s+(\w+)/, f = (t = i.match(r)) == null ? void 0 : t.map((u) => ({
    group: parseInt(u.match(s)[1], 10),
    binding: parseInt(u.match(n)[1], 10),
    name: u.match(o)[2],
    isUniform: u.match(o)[1] === "<uniform>",
    type: u.match(a)[1]
  }));
  if (!f)
    return {
      groups: [],
      structs: []
    };
  const p = ((e = i.match(h)) == null ? void 0 : e.map((u) => {
    const d = u.match(l)[1], m = u.match(c).reduce((g, y) => {
      const [v, _] = y.split(":");
      return g[v.trim()] = _.trim(), g;
    }, {});
    return m ? { name: d, members: m } : null;
  }).filter(({ name: u }) => f.some((d) => d.type === u))) ?? [];
  return {
    groups: f,
    structs: p
  };
}
var ar = /* @__PURE__ */ ((i) => (i[i.VERTEX = 1] = "VERTEX", i[i.FRAGMENT = 2] = "FRAGMENT", i[i.COMPUTE = 4] = "COMPUTE", i))(ar || {});
function rp({ groups: i }) {
  const t = [];
  for (let e = 0; e < i.length; e++) {
    const r = i[e];
    t[r.group] || (t[r.group] = []), r.isUniform ? t[r.group].push({
      binding: r.binding,
      visibility: ar.VERTEX | ar.FRAGMENT,
      buffer: {
        type: "uniform"
      }
    }) : r.type === "sampler" ? t[r.group].push({
      binding: r.binding,
      visibility: ar.FRAGMENT,
      sampler: {
        type: "filtering"
      }
    }) : r.type === "texture_2d" && t[r.group].push({
      binding: r.binding,
      visibility: ar.FRAGMENT,
      texture: {
        sampleType: "float",
        viewDimension: "2d",
        multisampled: !1
      }
    });
  }
  return t;
}
function np({ groups: i }) {
  const t = [];
  for (let e = 0; e < i.length; e++) {
    const r = i[e];
    t[r.group] || (t[r.group] = {}), t[r.group][r.name] = r.binding;
  }
  return t;
}
function sp(i, t) {
  const e = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set(), s = [...i.structs, ...t.structs].filter((o) => e.has(o.name) ? !1 : (e.add(o.name), !0)), n = [...i.groups, ...t.groups].filter((o) => {
    const a = `${o.name}-${o.binding}`;
    return r.has(a) ? !1 : (r.add(a), !0);
  });
  return { structs: s, groups: n };
}
const ps = /* @__PURE__ */ Object.create(null);
class Pn {
  /**
   * Create a new GpuProgram
   * @param options - The options for the gpu program
   */
  constructor(t) {
    var e, r;
    this._layoutKey = 0, this._attributeLocationsKey = 0;
    const { fragment: s, vertex: n, layout: o, gpuLayout: a, name: h } = t;
    if (this.name = h, this.fragment = s, this.vertex = n, s.source === n.source) {
      const c = ds(s.source);
      this.structsAndGroups = c;
    } else {
      const c = ds(n.source), l = ds(s.source);
      this.structsAndGroups = sp(c, l);
    }
    this.layout = o ?? np(this.structsAndGroups), this.gpuLayout = a ?? rp(this.structsAndGroups), this.autoAssignGlobalUniforms = ((e = this.layout[0]) == null ? void 0 : e.globalUniforms) !== void 0, this.autoAssignLocalUniforms = ((r = this.layout[1]) == null ? void 0 : r.localUniforms) !== void 0, this._generateProgramKey();
  }
  // TODO maker this pure
  _generateProgramKey() {
    const { vertex: t, fragment: e } = this, r = t.source + e.source + t.entryPoint + e.entryPoint;
    this._layoutKey = Mo(r, "program");
  }
  get attributeData() {
    return this._attributeData ?? (this._attributeData = ip(this.vertex)), this._attributeData;
  }
  /** destroys the program */
  destroy() {
    this.gpuLayout = null, this.layout = null, this.structsAndGroups = null, this.fragment = null, this.vertex = null;
  }
  /**
   * Helper function that creates a program for a given source.
   * It will check the program cache if the program has already been created.
   * If it has that one will be returned, if not a new one will be created and cached.
   * @param options - The options for the program.
   * @returns A program using the same source
   */
  static from(t) {
    const e = `${t.vertex.source}:${t.fragment.source}:${t.fragment.entryPoint}:${t.vertex.entryPoint}`;
    return ps[e] || (ps[e] = new Pn(t)), ps[e];
  }
}
const Tl = [
  "f32",
  "i32",
  "vec2<f32>",
  "vec3<f32>",
  "vec4<f32>",
  "mat2x2<f32>",
  "mat3x3<f32>",
  "mat4x4<f32>",
  "mat3x2<f32>",
  "mat4x2<f32>",
  "mat2x3<f32>",
  "mat4x3<f32>",
  "mat2x4<f32>",
  "mat3x4<f32>"
], op = Tl.reduce((i, t) => (i[t] = !0, i), {});
function ap(i, t) {
  switch (i) {
    case "f32":
      return 0;
    case "vec2<f32>":
      return new Float32Array(2 * t);
    case "vec3<f32>":
      return new Float32Array(3 * t);
    case "vec4<f32>":
      return new Float32Array(4 * t);
    case "mat2x2<f32>":
      return new Float32Array([
        1,
        0,
        0,
        1
      ]);
    case "mat3x3<f32>":
      return new Float32Array([
        1,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        1
      ]);
    case "mat4x4<f32>":
      return new Float32Array([
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
      ]);
  }
  return null;
}
const El = class Bl {
  /**
   * Create a new Uniform group
   * @param uniformStructures - The structures of the uniform group
   * @param options - The optional parameters of this uniform group
   */
  constructor(t, e) {
    this._touched = 0, this.uid = vt("uniform"), this._resourceType = "uniformGroup", this._resourceId = vt("resource"), this.isUniformGroup = !0, this._dirtyId = 0, this.destroyed = !1, e = { ...Bl.defaultOptions, ...e }, this.uniformStructures = t;
    const r = {};
    for (const s in t) {
      const n = t[s];
      if (n.name = s, n.size = n.size ?? 1, !op[n.type])
        throw new Error(`Uniform type ${n.type} is not supported. Supported uniform types are: ${Tl.join(", ")}`);
      n.value ?? (n.value = ap(n.type, n.size)), r[s] = n.value;
    }
    this.uniforms = r, this._dirtyId = 1, this.ubo = e.ubo, this.isStatic = e.isStatic, this._signature = Mo(Object.keys(r).map(
      (s) => `${s}-${t[s].type}`
    ).join("-"), "uniform-group");
  }
  /** Call this if you want the uniform groups data to be uploaded to the GPU only useful if `isStatic` is true. */
  update() {
    this._dirtyId++;
  }
};
El.defaultOptions = {
  /** if true the UniformGroup is handled as an Uniform buffer object. */
  ubo: !1,
  /** if true, then you are responsible for when the data is uploaded to the GPU by calling `update()` */
  isStatic: !1
};
let Rl = El;
class en {
  /**
   * Create a new instance eof the Bind Group.
   * @param resources - The resources that are bound together for use by a shader.
   */
  constructor(t) {
    this.resources = /* @__PURE__ */ Object.create(null), this._dirty = !0;
    let e = 0;
    for (const r in t) {
      const s = t[r];
      this.setResource(s, e++);
    }
    this._updateKey();
  }
  /**
   * Updates the key if its flagged as dirty. This is used internally to
   * match this bind group to a WebGPU BindGroup.
   * @internal
   * @ignore
   */
  _updateKey() {
    if (!this._dirty)
      return;
    this._dirty = !1;
    const t = [];
    let e = 0;
    for (const r in this.resources)
      t[e++] = this.resources[r]._resourceId;
    this._key = t.join("|");
  }
  /**
   * Set a resource at a given index. this function will
   * ensure that listeners will be removed from the current resource
   * and added to the new resource.
   * @param resource - The resource to set.
   * @param index - The index to set the resource at.
   */
  setResource(t, e) {
    var r, s;
    const n = this.resources[e];
    t !== n && (n && ((r = t.off) == null || r.call(t, "change", this.onResourceChange, this)), (s = t.on) == null || s.call(t, "change", this.onResourceChange, this), this.resources[e] = t, this._dirty = !0);
  }
  /**
   * Returns the resource at the current specified index.
   * @param index - The index of the resource to get.
   * @returns - The resource at the specified index.
   */
  getResource(t) {
    return this.resources[t];
  }
  /**
   * Used internally to 'touch' each resource, to ensure that the GC
   * knows that all resources in this bind group are still being used.
   * @param tick - The current tick.
   * @internal
   * @ignore
   */
  _touch(t) {
    const e = this.resources;
    for (const r in e)
      e[r]._touched = t;
  }
  /** Destroys this bind group and removes all listeners. */
  destroy() {
    var t;
    const e = this.resources;
    for (const r in e) {
      const s = e[r];
      (t = s.off) == null || t.call(s, "change", this.onResourceChange, this);
    }
    this.resources = null;
  }
  onResourceChange(t) {
    if (this._dirty = !0, t.destroyed) {
      const e = this.resources;
      for (const r in e)
        e[r] === t && (e[r] = null);
    } else
      this._updateKey();
  }
}
var Ws = /* @__PURE__ */ ((i) => (i[i.WEBGL = 1] = "WEBGL", i[i.WEBGPU = 2] = "WEBGPU", i[i.BOTH = 3] = "BOTH", i))(Ws || {});
class To extends Bt {
  constructor(t) {
    super(), this._uniformBindMap = /* @__PURE__ */ Object.create(null), this._ownedBindGroups = [];
    let {
      gpuProgram: e,
      glProgram: r,
      groups: s,
      resources: n,
      compatibleRenderers: o,
      groupMap: a
    } = t;
    this.gpuProgram = e, this.glProgram = r, o === void 0 && (o = 0, e && (o |= Ws.WEBGPU), r && (o |= Ws.WEBGL)), this.compatibleRenderers = o;
    const h = {};
    if (!n && !s && (n = {}), n && s)
      throw new Error("[Shader] Cannot have both resources and groups");
    if (!e && s && !a)
      throw new Error("[Shader] No group map or WebGPU shader provided - consider using resources instead.");
    if (!e && s && a)
      for (const c in a)
        for (const l in a[c]) {
          const f = a[c][l];
          h[f] = {
            group: c,
            binding: l,
            name: f
          };
        }
    else if (e && s && !a) {
      const c = e.structsAndGroups.groups;
      a = {}, c.forEach((l) => {
        a[l.group] = a[l.group] || {}, a[l.group][l.binding] = l.name, h[l.name] = l;
      });
    } else if (n) {
      s = {}, a = {}, e && e.structsAndGroups.groups.forEach((l) => {
        a[l.group] = a[l.group] || {}, a[l.group][l.binding] = l.name, h[l.name] = l;
      });
      let c = 0;
      for (const l in n)
        h[l] || (s[99] || (s[99] = new en(), this._ownedBindGroups.push(s[99])), h[l] = { group: 99, binding: c, name: l }, a[99] = a[99] || {}, a[99][c] = l, c++);
      for (const l in n) {
        const f = l;
        let p = n[l];
        !p.source && !p._resourceType && (p = new Rl(p));
        const u = h[f];
        u && (s[u.group] || (s[u.group] = new en(), this._ownedBindGroups.push(s[u.group])), s[u.group].setResource(p, u.binding));
      }
    }
    this.groups = s, this._uniformBindMap = a, this.resources = this._buildResourceAccessor(s, h);
  }
  /**
   * Sometimes a resource group will be provided later (for example global uniforms)
   * In such cases, this method can be used to let the shader know about the group.
   * @param name - the name of the resource group
   * @param groupIndex - the index of the group (should match the webGPU shader group location)
   * @param bindIndex - the index of the bind point (should match the webGPU shader bind point)
   */
  addResource(t, e, r) {
    var s, n;
    (s = this._uniformBindMap)[e] || (s[e] = {}), (n = this._uniformBindMap[e])[r] || (n[r] = t), this.groups[e] || (this.groups[e] = new en(), this._ownedBindGroups.push(this.groups[e]));
  }
  _buildResourceAccessor(t, e) {
    const r = {};
    for (const s in e) {
      const n = e[s];
      Object.defineProperty(r, n.name, {
        get() {
          return t[n.group].getResource(n.binding);
        },
        set(o) {
          t[n.group].setResource(o, n.binding);
        }
      });
    }
    return r;
  }
  /**
   * Use to destroy the shader when its not longer needed.
   * It will destroy the resources and remove listeners.
   * @param destroyPrograms - if the programs should be destroyed as well.
   * Make sure its not being used by other shaders!
   */
  destroy(t = !1) {
    var e, r;
    this.emit("destroy", this), t && ((e = this.gpuProgram) == null || e.destroy(), (r = this.glProgram) == null || r.destroy()), this.gpuProgram = null, this.glProgram = null, this.removeAllListeners(), this._uniformBindMap = null, this._ownedBindGroups.forEach((s) => {
      s.destroy();
    }), this._ownedBindGroups = null, this.resources = null, this.groups = null;
  }
  static from(t) {
    const { gpu: e, gl: r, ...s } = t;
    let n, o;
    return e && (n = Pn.from(e)), r && (o = Ml.from(r)), new To({
      gpuProgram: n,
      glProgram: o,
      ...s
    });
  }
}
const Ys = [];
Mt.handleByNamedList(D.Environment, Ys);
async function hp(i) {
  if (!i)
    for (let t = 0; t < Ys.length; t++) {
      const e = Ys[t];
      if (e.value.test()) {
        await e.value.load();
        return;
      }
    }
}
let er;
function lp() {
  if (typeof er == "boolean")
    return er;
  try {
    er = new Function("param1", "param2", "param3", "return param1[param2] === param3;")({ a: "b" }, "a", "b") === !0;
  } catch {
    er = !1;
  }
  return er;
}
var Eo = { exports: {} };
Eo.exports = kn;
Eo.exports.default = kn;
function kn(i, t, e) {
  e = e || 2;
  var r = t && t.length, s = r ? t[0] * e : i.length, n = Il(i, 0, s, e, !0), o = [];
  if (!n || n.next === n.prev) return o;
  var a, h, c, l, f, p, u;
  if (r && (n = fp(i, t, n, e)), i.length > 80 * e) {
    a = c = i[0], h = l = i[1];
    for (var d = e; d < s; d += e)
      f = i[d], p = i[d + 1], f < a && (a = f), p < h && (h = p), f > c && (c = f), p > l && (l = p);
    u = Math.max(c - a, l - h), u = u !== 0 ? 32767 / u : 0;
  }
  return _r(n, o, e, a, h, u, 0), o;
}
function Il(i, t, e, r, s) {
  var n, o;
  if (s === Ks(i, t, e, r) > 0)
    for (n = t; n < e; n += r) o = Wa(n, i[n], i[n + 1], o);
  else
    for (n = e - r; n >= t; n -= r) o = Wa(n, i[n], i[n + 1], o);
  return o && Mn(o, o.next) && (Ar(o), o = o.next), o;
}
function di(i, t) {
  if (!i) return i;
  t || (t = i);
  var e = i, r;
  do
    if (r = !1, !e.steiner && (Mn(e, e.next) || st(e.prev, e, e.next) === 0)) {
      if (Ar(e), e = t = e.prev, e === e.next) break;
      r = !0;
    } else
      e = e.next;
  while (r || e !== t);
  return t;
}
function _r(i, t, e, r, s, n, o) {
  if (i) {
    !o && n && vp(i, r, s, n);
    for (var a = i, h, c; i.prev !== i.next; ) {
      if (h = i.prev, c = i.next, n ? up(i, r, s, n) : cp(i)) {
        t.push(h.i / e | 0), t.push(i.i / e | 0), t.push(c.i / e | 0), Ar(i), i = c.next, a = c.next;
        continue;
      }
      if (i = c, i === a) {
        o ? o === 1 ? (i = dp(di(i), t, e), _r(i, t, e, r, s, n, 2)) : o === 2 && pp(i, t, e, r, s, n) : _r(di(i), t, e, r, s, n, 1);
        break;
      }
    }
  }
}
function cp(i) {
  var t = i.prev, e = i, r = i.next;
  if (st(t, e, r) >= 0) return !1;
  for (var s = t.x, n = e.x, o = r.x, a = t.y, h = e.y, c = r.y, l = s < n ? s < o ? s : o : n < o ? n : o, f = a < h ? a < c ? a : c : h < c ? h : c, p = s > n ? s > o ? s : o : n > o ? n : o, u = a > h ? a > c ? a : c : h > c ? h : c, d = r.next; d !== t; ) {
    if (d.x >= l && d.x <= p && d.y >= f && d.y <= u && Ci(s, a, n, h, o, c, d.x, d.y) && st(d.prev, d, d.next) >= 0) return !1;
    d = d.next;
  }
  return !0;
}
function up(i, t, e, r) {
  var s = i.prev, n = i, o = i.next;
  if (st(s, n, o) >= 0) return !1;
  for (var a = s.x, h = n.x, c = o.x, l = s.y, f = n.y, p = o.y, u = a < h ? a < c ? a : c : h < c ? h : c, d = l < f ? l < p ? l : p : f < p ? f : p, m = a > h ? a > c ? a : c : h > c ? h : c, g = l > f ? l > p ? l : p : f > p ? f : p, y = Xs(u, d, t, e, r), v = Xs(m, g, t, e, r), _ = i.prevZ, w = i.nextZ; _ && _.z >= y && w && w.z <= v; ) {
    if (_.x >= u && _.x <= m && _.y >= d && _.y <= g && _ !== s && _ !== o && Ci(a, l, h, f, c, p, _.x, _.y) && st(_.prev, _, _.next) >= 0 || (_ = _.prevZ, w.x >= u && w.x <= m && w.y >= d && w.y <= g && w !== s && w !== o && Ci(a, l, h, f, c, p, w.x, w.y) && st(w.prev, w, w.next) >= 0)) return !1;
    w = w.nextZ;
  }
  for (; _ && _.z >= y; ) {
    if (_.x >= u && _.x <= m && _.y >= d && _.y <= g && _ !== s && _ !== o && Ci(a, l, h, f, c, p, _.x, _.y) && st(_.prev, _, _.next) >= 0) return !1;
    _ = _.prevZ;
  }
  for (; w && w.z <= v; ) {
    if (w.x >= u && w.x <= m && w.y >= d && w.y <= g && w !== s && w !== o && Ci(a, l, h, f, c, p, w.x, w.y) && st(w.prev, w, w.next) >= 0) return !1;
    w = w.nextZ;
  }
  return !0;
}
function dp(i, t, e) {
  var r = i;
  do {
    var s = r.prev, n = r.next.next;
    !Mn(s, n) && Ol(s, r, r.next, n) && wr(s, n) && wr(n, s) && (t.push(s.i / e | 0), t.push(r.i / e | 0), t.push(n.i / e | 0), Ar(r), Ar(r.next), r = i = n), r = r.next;
  } while (r !== i);
  return di(r);
}
function pp(i, t, e, r, s, n) {
  var o = i;
  do {
    for (var a = o.next.next; a !== o.prev; ) {
      if (o.i !== a.i && wp(o, a)) {
        var h = Fl(o, a);
        o = di(o, o.next), h = di(h, h.next), _r(o, t, e, r, s, n, 0), _r(h, t, e, r, s, n, 0);
        return;
      }
      a = a.next;
    }
    o = o.next;
  } while (o !== i);
}
function fp(i, t, e, r) {
  var s = [], n, o, a, h, c;
  for (n = 0, o = t.length; n < o; n++)
    a = t[n] * r, h = n < o - 1 ? t[n + 1] * r : i.length, c = Il(i, a, h, r, !1), c === c.next && (c.steiner = !0), s.push(_p(c));
  for (s.sort(mp), n = 0; n < s.length; n++)
    e = gp(s[n], e);
  return e;
}
function mp(i, t) {
  return i.x - t.x;
}
function gp(i, t) {
  var e = yp(i, t);
  if (!e)
    return t;
  var r = Fl(e, i);
  return di(r, r.next), di(e, e.next);
}
function yp(i, t) {
  var e = t, r = i.x, s = i.y, n = -1 / 0, o;
  do {
    if (s <= e.y && s >= e.next.y && e.next.y !== e.y) {
      var a = e.x + (s - e.y) * (e.next.x - e.x) / (e.next.y - e.y);
      if (a <= r && a > n && (n = a, o = e.x < e.next.x ? e : e.next, a === r))
        return o;
    }
    e = e.next;
  } while (e !== t);
  if (!o) return null;
  var h = o, c = o.x, l = o.y, f = 1 / 0, p;
  e = o;
  do
    r >= e.x && e.x >= c && r !== e.x && Ci(s < l ? r : n, s, c, l, s < l ? n : r, s, e.x, e.y) && (p = Math.abs(s - e.y) / (r - e.x), wr(e, i) && (p < f || p === f && (e.x > o.x || e.x === o.x && xp(o, e))) && (o = e, f = p)), e = e.next;
  while (e !== h);
  return o;
}
function xp(i, t) {
  return st(i.prev, i, t.prev) < 0 && st(t.next, i, i.next) < 0;
}
function vp(i, t, e, r) {
  var s = i;
  do
    s.z === 0 && (s.z = Xs(s.x, s.y, t, e, r)), s.prevZ = s.prev, s.nextZ = s.next, s = s.next;
  while (s !== i);
  s.prevZ.nextZ = null, s.prevZ = null, bp(s);
}
function bp(i) {
  var t, e, r, s, n, o, a, h, c = 1;
  do {
    for (e = i, i = null, n = null, o = 0; e; ) {
      for (o++, r = e, a = 0, t = 0; t < c && (a++, r = r.nextZ, !!r); t++)
        ;
      for (h = c; a > 0 || h > 0 && r; )
        a !== 0 && (h === 0 || !r || e.z <= r.z) ? (s = e, e = e.nextZ, a--) : (s = r, r = r.nextZ, h--), n ? n.nextZ = s : i = s, s.prevZ = n, n = s;
      e = r;
    }
    n.nextZ = null, c *= 2;
  } while (o > 1);
  return i;
}
function Xs(i, t, e, r, s) {
  return i = (i - e) * s | 0, t = (t - r) * s | 0, i = (i | i << 8) & 16711935, i = (i | i << 4) & 252645135, i = (i | i << 2) & 858993459, i = (i | i << 1) & 1431655765, t = (t | t << 8) & 16711935, t = (t | t << 4) & 252645135, t = (t | t << 2) & 858993459, t = (t | t << 1) & 1431655765, i | t << 1;
}
function _p(i) {
  var t = i, e = i;
  do
    (t.x < e.x || t.x === e.x && t.y < e.y) && (e = t), t = t.next;
  while (t !== i);
  return e;
}
function Ci(i, t, e, r, s, n, o, a) {
  return (s - o) * (t - a) >= (i - o) * (n - a) && (i - o) * (r - a) >= (e - o) * (t - a) && (e - o) * (n - a) >= (s - o) * (r - a);
}
function wp(i, t) {
  return i.next.i !== t.i && i.prev.i !== t.i && !Ap(i, t) && // dones't intersect other edges
  (wr(i, t) && wr(t, i) && Sp(i, t) && // locally visible
  (st(i.prev, i, t.prev) || st(i, t.prev, t)) || // does not create opposite-facing sectors
  Mn(i, t) && st(i.prev, i, i.next) > 0 && st(t.prev, t, t.next) > 0);
}
function st(i, t, e) {
  return (t.y - i.y) * (e.x - t.x) - (t.x - i.x) * (e.y - t.y);
}
function Mn(i, t) {
  return i.x === t.x && i.y === t.y;
}
function Ol(i, t, e, r) {
  var s = qr(st(i, t, e)), n = qr(st(i, t, r)), o = qr(st(e, r, i)), a = qr(st(e, r, t));
  return !!(s !== n && o !== a || s === 0 && Xr(i, e, t) || n === 0 && Xr(i, r, t) || o === 0 && Xr(e, i, r) || a === 0 && Xr(e, t, r));
}
function Xr(i, t, e) {
  return t.x <= Math.max(i.x, e.x) && t.x >= Math.min(i.x, e.x) && t.y <= Math.max(i.y, e.y) && t.y >= Math.min(i.y, e.y);
}
function qr(i) {
  return i > 0 ? 1 : i < 0 ? -1 : 0;
}
function Ap(i, t) {
  var e = i;
  do {
    if (e.i !== i.i && e.next.i !== i.i && e.i !== t.i && e.next.i !== t.i && Ol(e, e.next, i, t)) return !0;
    e = e.next;
  } while (e !== i);
  return !1;
}
function wr(i, t) {
  return st(i.prev, i, i.next) < 0 ? st(i, t, i.next) >= 0 && st(i, i.prev, t) >= 0 : st(i, t, i.prev) < 0 || st(i, i.next, t) < 0;
}
function Sp(i, t) {
  var e = i, r = !1, s = (i.x + t.x) / 2, n = (i.y + t.y) / 2;
  do
    e.y > n != e.next.y > n && e.next.y !== e.y && s < (e.next.x - e.x) * (n - e.y) / (e.next.y - e.y) + e.x && (r = !r), e = e.next;
  while (e !== i);
  return r;
}
function Fl(i, t) {
  var e = new qs(i.i, i.x, i.y), r = new qs(t.i, t.x, t.y), s = i.next, n = t.prev;
  return i.next = t, t.prev = i, e.next = s, s.prev = e, r.next = e, e.prev = r, n.next = r, r.prev = n, r;
}
function Wa(i, t, e, r) {
  var s = new qs(i, t, e);
  return r ? (s.next = r.next, s.prev = r, r.next.prev = s, r.next = s) : (s.prev = s, s.next = s), s;
}
function Ar(i) {
  i.next.prev = i.prev, i.prev.next = i.next, i.prevZ && (i.prevZ.nextZ = i.nextZ), i.nextZ && (i.nextZ.prevZ = i.prevZ);
}
function qs(i, t, e) {
  this.i = i, this.x = t, this.y = e, this.prev = null, this.next = null, this.z = 0, this.prevZ = null, this.nextZ = null, this.steiner = !1;
}
kn.deviation = function(i, t, e, r) {
  var s = t && t.length, n = s ? t[0] * e : i.length, o = Math.abs(Ks(i, 0, n, e));
  if (s)
    for (var a = 0, h = t.length; a < h; a++) {
      var c = t[a] * e, l = a < h - 1 ? t[a + 1] * e : i.length;
      o -= Math.abs(Ks(i, c, l, e));
    }
  var f = 0;
  for (a = 0; a < r.length; a += 3) {
    var p = r[a] * e, u = r[a + 1] * e, d = r[a + 2] * e;
    f += Math.abs(
      (i[p] - i[d]) * (i[u + 1] - i[p + 1]) - (i[p] - i[u]) * (i[d + 1] - i[p + 1])
    );
  }
  return o === 0 && f === 0 ? 0 : Math.abs((f - o) / o);
};
function Ks(i, t, e, r) {
  for (var s = 0, n = t, o = e - r; n < e; n += r)
    s += (i[o] - i[n]) * (i[n + 1] + i[o + 1]), o = n;
  return s;
}
kn.flatten = function(i) {
  for (var t = i[0][0].length, e = { vertices: [], holes: [], dimensions: t }, r = 0, s = 0; s < i.length; s++) {
    for (var n = 0; n < i[s].length; n++)
      for (var o = 0; o < t; o++) e.vertices.push(i[s][n][o]);
    s > 0 && (r += i[s - 1].length, e.holes.push(r));
  }
  return e;
};
var Cp = Eo.exports;
const Pp = /* @__PURE__ */ Co(Cp);
var Ll = /* @__PURE__ */ ((i) => (i[i.NONE = 0] = "NONE", i[i.COLOR = 16384] = "COLOR", i[i.STENCIL = 1024] = "STENCIL", i[i.DEPTH = 256] = "DEPTH", i[i.COLOR_DEPTH = 16640] = "COLOR_DEPTH", i[i.COLOR_STENCIL = 17408] = "COLOR_STENCIL", i[i.DEPTH_STENCIL = 1280] = "DEPTH_STENCIL", i[i.ALL = 17664] = "ALL", i))(Ll || {});
class kp {
  /**
   * @param name - The function name that will be executed on the listeners added to this Runner.
   */
  constructor(t) {
    this.items = [], this._name = t;
  }
  /* eslint-disable jsdoc/require-param, jsdoc/check-param-names */
  /**
   * Dispatch/Broadcast Runner to all listeners added to the queue.
   * @param {...any} params - (optional) parameters to pass to each listener
   */
  /*  eslint-enable jsdoc/require-param, jsdoc/check-param-names */
  emit(t, e, r, s, n, o, a, h) {
    const { name: c, items: l } = this;
    for (let f = 0, p = l.length; f < p; f++)
      l[f][c](t, e, r, s, n, o, a, h);
    return this;
  }
  /**
   * Add a listener to the Runner
   *
   * Runners do not need to have scope or functions passed to them.
   * All that is required is to pass the listening object and ensure that it has contains a function that has the same name
   * as the name provided to the Runner when it was created.
   *
   * Eg A listener passed to this Runner will require a 'complete' function.
   *
   * ```
   * import { Runner } from 'pixi.js';
   *
   * const complete = new Runner('complete');
   * ```
   *
   * The scope used will be the object itself.
   * @param {any} item - The object that will be listening.
   */
  add(t) {
    return t[this._name] && (this.remove(t), this.items.push(t)), this;
  }
  /**
   * Remove a single listener from the dispatch queue.
   * @param {any} item - The listener that you would like to remove.
   */
  remove(t) {
    const e = this.items.indexOf(t);
    return e !== -1 && this.items.splice(e, 1), this;
  }
  /**
   * Check to see if the listener is already in the Runner
   * @param {any} item - The listener that you would like to check.
   */
  contains(t) {
    return this.items.indexOf(t) !== -1;
  }
  /** Remove all listeners from the Runner */
  removeAll() {
    return this.items.length = 0, this;
  }
  /** Remove all references, don't use after this. */
  destroy() {
    this.removeAll(), this.items = null, this._name = null;
  }
  /**
   * `true` if there are no this Runner contains no listeners
   * @readonly
   */
  get empty() {
    return this.items.length === 0;
  }
  /**
   * The name of the runner.
   * @readonly
   */
  get name() {
    return this._name;
  }
}
const Mp = [
  "init",
  "destroy",
  "contextChange",
  "resolutionChange",
  "reset",
  "renderEnd",
  "renderStart",
  "render",
  "update",
  "postrender",
  "prerender"
], zl = class Dl extends Bt {
  /**
   * Set up a system with a collection of SystemClasses and runners.
   * Systems are attached dynamically to this class when added.
   * @param config - the config for the system manager
   */
  constructor(t) {
    super(), this.runners = /* @__PURE__ */ Object.create(null), this.renderPipes = /* @__PURE__ */ Object.create(null), this._initOptions = {}, this._systemsHash = /* @__PURE__ */ Object.create(null), this.type = t.type, this.name = t.name, this.config = t;
    const e = [...Mp, ...this.config.runners ?? []];
    this._addRunners(...e), this._unsafeEvalCheck();
  }
  /**
   * Initialize the renderer.
   * @param options - The options to use to create the renderer.
   */
  async init(t = {}) {
    const e = t.skipExtensionImports === !0 ? !0 : t.manageImports === !1;
    await hp(e), this._addSystems(this.config.systems), this._addPipes(this.config.renderPipes, this.config.renderPipeAdaptors);
    for (const r in this._systemsHash)
      t = { ...this._systemsHash[r].constructor.defaultOptions, ...t };
    t = { ...Dl.defaultOptions, ...t }, this._roundPixels = t.roundPixels ? 1 : 0;
    for (let r = 0; r < this.runners.init.items.length; r++)
      await this.runners.init.items[r].init(t);
    this._initOptions = t;
  }
  render(t, e) {
    let r = t;
    if (r instanceof Ot && (r = { container: r }, e && (X(q, "passing a second argument is deprecated, please use render options instead"), r.target = e.renderTexture)), r.target || (r.target = this.view.renderTarget), r.target === this.view.renderTarget && (this._lastObjectRendered = r.container, r.clearColor = this.background.colorRgba), r.clearColor) {
      const s = Array.isArray(r.clearColor) && r.clearColor.length === 4;
      r.clearColor = s ? r.clearColor : gt.shared.setValue(r.clearColor).toArray();
    }
    r.transform || (r.container.updateLocalTransform(), r.transform = r.container.localTransform), this.runners.prerender.emit(r), this.runners.renderStart.emit(r), this.runners.render.emit(r), this.runners.renderEnd.emit(r), this.runners.postrender.emit(r);
  }
  /**
   * Resizes the WebGL view to the specified width and height.
   * @param desiredScreenWidth - The desired width of the screen.
   * @param desiredScreenHeight - The desired height of the screen.
   * @param resolution - The resolution / device pixel ratio of the renderer.
   */
  resize(t, e, r) {
    const s = this.view.resolution;
    this.view.resize(t, e, r), this.emit("resize", this.view.screen.width, this.view.screen.height, this.view.resolution), r !== void 0 && r !== s && this.runners.resolutionChange.emit(r);
  }
  clear(t = {}) {
    const e = this;
    t.target || (t.target = e.renderTarget.renderTarget), t.clearColor || (t.clearColor = this.background.colorRgba), t.clear ?? (t.clear = Ll.ALL);
    const { clear: r, clearColor: s, target: n } = t;
    gt.shared.setValue(s ?? this.background.colorRgba), e.renderTarget.clear(n, r, gt.shared.toArray());
  }
  /** The resolution / device pixel ratio of the renderer. */
  get resolution() {
    return this.view.resolution;
  }
  set resolution(t) {
    this.view.resolution = t, this.runners.resolutionChange.emit(t);
  }
  /**
   * Same as view.width, actual number of pixels in the canvas by horizontal.
   * @member {number}
   * @readonly
   * @default 800
   */
  get width() {
    return this.view.texture.frame.width;
  }
  /**
   * Same as view.height, actual number of pixels in the canvas by vertical.
   * @default 600
   */
  get height() {
    return this.view.texture.frame.height;
  }
  // NOTE: this was `view` in v7
  /**
   * The canvas element that everything is drawn to.
   * @type {environment.ICanvas}
   */
  get canvas() {
    return this.view.canvas;
  }
  /**
   * the last object rendered by the renderer. Useful for other plugins like interaction managers
   * @readonly
   */
  get lastObjectRendered() {
    return this._lastObjectRendered;
  }
  /**
   * Flag if we are rendering to the screen vs renderTexture
   * @readonly
   * @default true
   */
  get renderingToScreen() {
    return this.renderTarget.renderingToScreen;
  }
  /**
   * Measurements of the screen. (0, 0, screenWidth, screenHeight).
   *
   * Its safe to use as filterArea or hitArea for the whole stage.
   */
  get screen() {
    return this.view.screen;
  }
  /**
   * Create a bunch of runners based of a collection of ids
   * @param runnerIds - the runner ids to add
   */
  _addRunners(...t) {
    t.forEach((e) => {
      this.runners[e] = new kp(e);
    });
  }
  _addSystems(t) {
    let e;
    for (e in t) {
      const r = t[e];
      this._addSystem(r.value, r.name);
    }
  }
  /**
   * Add a new system to the renderer.
   * @param ClassRef - Class reference
   * @param name - Property name for system, if not specified
   *        will use a static `name` property on the class itself. This
   *        name will be assigned as s property on the Renderer so make
   *        sure it doesn't collide with properties on Renderer.
   * @returns Return instance of renderer
   */
  _addSystem(t, e) {
    const r = new t(this);
    if (this[e])
      throw new Error(`Whoops! The name "${e}" is already in use`);
    this[e] = r, this._systemsHash[e] = r;
    for (const s in this.runners)
      this.runners[s].add(r);
    return this;
  }
  _addPipes(t, e) {
    const r = e.reduce((s, n) => (s[n.name] = n.value, s), {});
    t.forEach((s) => {
      const n = s.value, o = s.name, a = r[o];
      this.renderPipes[o] = new n(
        this,
        a ? new a() : null
      );
    });
  }
  destroy(t = !1) {
    this.runners.destroy.items.reverse(), this.runners.destroy.emit(t), Object.values(this.runners).forEach((e) => {
      e.destroy();
    }), this._systemsHash = null, this.renderPipes = null;
  }
  /**
   * Generate a texture from a container.
   * @param options - options or container target to use when generating the texture
   * @returns a texture
   */
  generateTexture(t) {
    return this.textureGenerator.generateTexture(t);
  }
  /**
   * Whether the renderer will round coordinates to whole pixels when rendering.
   * Can be overridden on a per scene item basis.
   */
  get roundPixels() {
    return !!this._roundPixels;
  }
  /**
   * Overridable function by `pixi.js/unsafe-eval` to silence
   * throwing an error if platform doesn't support unsafe-evals.
   * @private
   * @ignore
   */
  _unsafeEvalCheck() {
    if (!lp())
      throw new Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.");
  }
};
zl.defaultOptions = {
  /**
   * Default resolution / device pixel ratio of the renderer.
   * @default 1
   */
  resolution: 1,
  /**
   * Should the `failIfMajorPerformanceCaveat` flag be enabled as a context option used in the `isWebGLSupported`
   * function. If set to true, a WebGL renderer can fail to be created if the browser thinks there could be
   * performance issues when using WebGL.
   *
   * In PixiJS v6 this has changed from true to false by default, to allow WebGL to work in as many
   * scenarios as possible. However, some users may have a poor experience, for example, if a user has a gpu or
   * driver version blacklisted by the
   * browser.
   *
   * If your application requires high performance rendering, you may wish to set this to false.
   * We recommend one of two options if you decide to set this flag to false:
   *
   * 1: Use the Canvas renderer as a fallback in case high performance WebGL is
   *    not supported.
   *
   * 2: Call `isWebGLSupported` (which if found in the utils package) in your code before attempting to create a
   *    PixiJS renderer, and show an error message to the user if the function returns false, explaining that their
   *    device & browser combination does not support high performance WebGL.
   *    This is a much better strategy than trying to create a PixiJS renderer and finding it then fails.
   * @default false
   */
  failIfMajorPerformanceCaveat: !1,
  /**
   * Should round pixels be forced when rendering?
   * @default false
   */
  roundPixels: !1
};
let Ul = zl, fs;
function Tp(i) {
  return fs !== void 0 || (fs = (() => {
    var t;
    const e = {
      stencil: !0,
      failIfMajorPerformanceCaveat: i ?? Ul.defaultOptions.failIfMajorPerformanceCaveat
    };
    try {
      if (!at.get().getWebGLRenderingContext())
        return !1;
      let r = at.get().createCanvas().getContext("webgl", e);
      const s = !!((t = r == null ? void 0 : r.getContextAttributes()) != null && t.stencil);
      if (r) {
        const n = r.getExtension("WEBGL_lose_context");
        n && n.loseContext();
      }
      return r = null, s;
    } catch {
      return !1;
    }
  })()), fs;
}
let ms;
async function Ep(i = {}) {
  return ms !== void 0 || (ms = await (async () => {
    const t = at.get().getNavigator().gpu;
    if (!t)
      return !1;
    try {
      return await (await t.requestAdapter(i)).requestDevice(), !0;
    } catch {
      return !1;
    }
  })()), ms;
}
const Ya = ["webgl", "webgpu", "canvas"];
async function Bp(i) {
  let t = [];
  i.preference ? (t.push(i.preference), Ya.forEach((n) => {
    n !== i.preference && t.push(n);
  })) : t = Ya.slice();
  let e, r = {};
  for (let n = 0; n < t.length; n++) {
    const o = t[n];
    if (o === "webgpu" && await Ep()) {
      const { WebGPURenderer: a } = await import("./WebGPURenderer-BwjPFywh-DeKC1Fa4.js");
      e = a, r = { ...i, ...i.webgpu };
      break;
    } else if (o === "webgl" && Tp(
      i.failIfMajorPerformanceCaveat ?? Ul.defaultOptions.failIfMajorPerformanceCaveat
    )) {
      const { WebGLRenderer: a } = await import("./WebGLRenderer-BlqA6CD3-C28jCoEQ.js");
      e = a, r = { ...i, ...i.webgl };
      break;
    } else if (o === "canvas")
      throw r = { ...i }, new Error("CanvasRenderer is not yet implemented");
  }
  if (delete r.webgpu, delete r.webgl, !e)
    throw new Error("No available renderer for the current environment");
  const s = new e();
  return await s.init(r), s;
}
const Gl = "8.5.2";
class Vl {
  static init() {
    var t;
    (t = globalThis.__PIXI_APP_INIT__) == null || t.call(globalThis, this, Gl);
  }
  static destroy() {
  }
}
Vl.extension = D.Application;
class Rp {
  constructor(t) {
    this._renderer = t;
  }
  init() {
    var t;
    (t = globalThis.__PIXI_RENDERER_INIT__) == null || t.call(globalThis, this._renderer, Gl);
  }
  destroy() {
    this._renderer = null;
  }
}
Rp.extension = {
  type: [
    D.WebGLSystem,
    D.WebGPUSystem
  ],
  name: "initHook",
  priority: -10
};
const Hl = class Qs {
  /** @ignore */
  constructor(...t) {
    this.stage = new Ot(), t[0] !== void 0 && X(q, "Application constructor options are deprecated, please use Application.init() instead.");
  }
  /**
   * @param options - The optional application and renderer parameters.
   */
  async init(t) {
    t = { ...t }, this.renderer = await Bp(t), Qs._plugins.forEach((e) => {
      e.init.call(this, t);
    });
  }
  /** Render the current stage. */
  render() {
    this.renderer.render({ container: this.stage });
  }
  /**
   * Reference to the renderer's canvas element.
   * @readonly
   * @member {HTMLCanvasElement}
   */
  get canvas() {
    return this.renderer.canvas;
  }
  /**
   * Reference to the renderer's canvas element.
   * @member {HTMLCanvasElement}
   * @deprecated since 8.0.0
   */
  get view() {
    return X(q, "Application.view is deprecated, please use Application.canvas instead."), this.renderer.canvas;
  }
  /**
   * Reference to the renderer's screen rectangle. Its safe to use as `filterArea` or `hitArea` for the whole screen.
   * @readonly
   */
  get screen() {
    return this.renderer.screen;
  }
  /**
   * Destroys the application and all of its resources.
   * @param {object|boolean}[rendererDestroyOptions=false] - The options for destroying the renderer.
   * @param {boolean}[rendererDestroyOptions.removeView=false] - Removes the Canvas element from the DOM.
   * @param {object|boolean} [options=false] - The options for destroying the stage.
   * @param {boolean} [options.children=false] - If set to true, all the children will have their destroy method
   * called as well. `options` will be passed on to those calls.
   * @param {boolean} [options.texture=false] - Only used for children with textures e.g. Sprites.
   * If options.children is set to true,
   * it should destroy the texture of the child sprite.
   * @param {boolean} [options.textureSource=false] - Only used for children with textures e.g. Sprites.
   *  If options.children is set to true,
   * it should destroy the texture source of the child sprite.
   * @param {boolean} [options.context=false] - Only used for children with graphicsContexts e.g. Graphics.
   * If options.children is set to true,
   * it should destroy the context of the child graphics.
   */
  destroy(t = !1, e = !1) {
    const r = Qs._plugins.slice(0);
    r.reverse(), r.forEach((s) => {
      s.destroy.call(this);
    }), this.stage.destroy(e), this.stage = null, this.renderer.destroy(t), this.renderer = null;
  }
};
Hl._plugins = [];
let jl = Hl;
Mt.handleByList(D.Application, jl._plugins);
Mt.add(Vl);
class Nl extends Bt {
  constructor() {
    super(...arguments), this.chars = /* @__PURE__ */ Object.create(null), this.lineHeight = 0, this.fontFamily = "", this.fontMetrics = { fontSize: 0, ascent: 0, descent: 0 }, this.baseLineOffset = 0, this.distanceField = { type: "none", range: 0 }, this.pages = [], this.applyFillAsTint = !0, this.baseMeasurementFontSize = 100, this.baseRenderedFontSize = 100;
  }
  /**
   * The name of the font face.
   * @deprecated since 8.0.0 Use `fontFamily` instead.
   */
  get font() {
    return X(q, "BitmapFont.font is deprecated, please use BitmapFont.fontFamily instead."), this.fontFamily;
  }
  /**
   * The map of base page textures (i.e., sheets of glyphs).
   * @deprecated since 8.0.0 Use `pages` instead.
   */
  get pageTextures() {
    return X(q, "BitmapFont.pageTextures is deprecated, please use BitmapFont.pages instead."), this.pages;
  }
  /**
   * The size of the font face in pixels.
   * @deprecated since 8.0.0 Use `fontMetrics.fontSize` instead.
   */
  get size() {
    return X(q, "BitmapFont.size is deprecated, please use BitmapFont.fontMetrics.fontSize instead."), this.fontMetrics.fontSize;
  }
  /**
   * The kind of distance field for this font or "none".
   * @deprecated since 8.0.0 Use `distanceField.type` instead.
   */
  get distanceFieldRange() {
    return X(q, "BitmapFont.distanceFieldRange is deprecated, please use BitmapFont.distanceField.range instead."), this.distanceField.range;
  }
  /**
   * The range of the distance field in pixels.
   * @deprecated since 8.0.0 Use `distanceField.range` instead.
   */
  get distanceFieldType() {
    return X(q, "BitmapFont.distanceFieldType is deprecated, please use BitmapFont.distanceField.type instead."), this.distanceField.type;
  }
  destroy(t = !1) {
    var e;
    this.emit("destroy", this), this.removeAllListeners();
    for (const r in this.chars)
      (e = this.chars[r].texture) == null || e.destroy();
    this.chars = null, t && (this.pages.forEach((r) => r.texture.destroy(!0)), this.pages = null);
  }
}
const Wl = class Js {
  constructor(t, e, r, s) {
    this.uid = vt("fillGradient"), this.type = "linear", this.gradientStops = [], this._styleKey = null, this.x0 = t, this.y0 = e, this.x1 = r, this.y1 = s;
  }
  addColorStop(t, e) {
    return this.gradientStops.push({ offset: t, color: gt.shared.setValue(e).toHexa() }), this._styleKey = null, this;
  }
  // TODO move to the system!
  buildLinearGradient() {
    const t = Js.defaultTextureSize, { gradientStops: e } = this, r = at.get().createCanvas();
    r.width = t, r.height = t;
    const s = r.getContext("2d"), n = s.createLinearGradient(0, 0, Js.defaultTextureSize, 1);
    for (let m = 0; m < e.length; m++) {
      const g = e[m];
      n.addColorStop(g.offset, g.color);
    }
    s.fillStyle = n, s.fillRect(0, 0, t, t), this.texture = new H({
      source: new Ni({
        resource: r,
        addressModeU: "clamp-to-edge",
        addressModeV: "repeat"
      })
    });
    const { x0: o, y0: a, x1: h, y1: c } = this, l = new K(), f = h - o, p = c - a, u = Math.sqrt(f * f + p * p), d = Math.atan2(p, f);
    l.translate(-o, -a), l.scale(1 / t, 1 / t), l.rotate(-d), l.scale(256 / u, 1), this.transform = l, this._styleKey = null;
  }
  get styleKey() {
    if (this._styleKey)
      return this._styleKey;
    const t = this.gradientStops.map((s) => `${s.offset}-${s.color}`).join("-"), e = this.texture.uid, r = this.transform.toArray().join("-");
    return `fill-gradient-${this.uid}-${t}-${e}-${r}-${this.x0}-${this.y0}-${this.x1}-${this.y1}`;
  }
};
Wl.defaultTextureSize = 256;
let Sr = Wl;
const Xa = {
  repeat: {
    addressModeU: "repeat",
    addressModeV: "repeat"
  },
  "repeat-x": {
    addressModeU: "repeat",
    addressModeV: "clamp-to-edge"
  },
  "repeat-y": {
    addressModeU: "clamp-to-edge",
    addressModeV: "repeat"
  },
  "no-repeat": {
    addressModeU: "clamp-to-edge",
    addressModeV: "clamp-to-edge"
  }
};
class Tn {
  constructor(t, e) {
    this.uid = vt("fillPattern"), this.transform = new K(), this._styleKey = null, this.texture = t, this.transform.scale(
      1 / t.frame.width,
      1 / t.frame.height
    ), e && (t.source.style.addressModeU = Xa[e].addressModeU, t.source.style.addressModeV = Xa[e].addressModeV);
  }
  setTransform(t) {
    const e = this.texture;
    this.transform.copyFrom(t), this.transform.invert(), this.transform.scale(
      1 / e.frame.width,
      1 / e.frame.height
    ), this._styleKey = null;
  }
  get styleKey() {
    return this._styleKey ? this._styleKey : (this._styleKey = `fill-pattern-${this.uid}-${this.texture.uid}-${this.transform.toArray().join("-")}`, this._styleKey);
  }
}
var Ip = Fp, gs = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0 }, Op = /([astvzqmhlc])([^astvzqmhlc]*)/ig;
function Fp(i) {
  var t = [];
  return i.replace(Op, function(e, r, s) {
    var n = r.toLowerCase();
    for (s = zp(s), n == "m" && s.length > 2 && (t.push([r].concat(s.splice(0, 2))), n = "l", r = r == "m" ? "l" : "L"); ; ) {
      if (s.length == gs[n])
        return s.unshift(r), t.push(s);
      if (s.length < gs[n]) throw new Error("malformed path data");
      t.push([r].concat(s.splice(0, gs[n])));
    }
  }), t;
}
var Lp = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig;
function zp(i) {
  var t = i.match(Lp);
  return t ? t.map(Number) : [];
}
const Dp = /* @__PURE__ */ Co(Ip);
function Up(i, t) {
  const e = Dp(i), r = [];
  let s = null, n = 0, o = 0;
  for (let a = 0; a < e.length; a++) {
    const h = e[a], c = h[0], l = h;
    switch (c) {
      case "M":
        n = l[1], o = l[2], t.moveTo(n, o);
        break;
      case "m":
        n += l[1], o += l[2], t.moveTo(n, o);
        break;
      case "H":
        n = l[1], t.lineTo(n, o);
        break;
      case "h":
        n += l[1], t.lineTo(n, o);
        break;
      case "V":
        o = l[1], t.lineTo(n, o);
        break;
      case "v":
        o += l[1], t.lineTo(n, o);
        break;
      case "L":
        n = l[1], o = l[2], t.lineTo(n, o);
        break;
      case "l":
        n += l[1], o += l[2], t.lineTo(n, o);
        break;
      case "C":
        n = l[5], o = l[6], t.bezierCurveTo(
          l[1],
          l[2],
          l[3],
          l[4],
          n,
          o
        );
        break;
      case "c":
        t.bezierCurveTo(
          n + l[1],
          o + l[2],
          n + l[3],
          o + l[4],
          n + l[5],
          o + l[6]
        ), n += l[5], o += l[6];
        break;
      case "S":
        n = l[3], o = l[4], t.bezierCurveToShort(
          l[1],
          l[2],
          n,
          o
        );
        break;
      case "s":
        t.bezierCurveToShort(
          n + l[1],
          o + l[2],
          n + l[3],
          o + l[4]
        ), n += l[3], o += l[4];
        break;
      case "Q":
        n = l[3], o = l[4], t.quadraticCurveTo(
          l[1],
          l[2],
          n,
          o
        );
        break;
      case "q":
        t.quadraticCurveTo(
          n + l[1],
          o + l[2],
          n + l[3],
          o + l[4]
        ), n += l[3], o += l[4];
        break;
      case "T":
        n = l[1], o = l[2], t.quadraticCurveToShort(
          n,
          o
        );
        break;
      case "t":
        n += l[1], o += l[2], t.quadraticCurveToShort(
          n,
          o
        );
        break;
      case "A":
        n = l[6], o = l[7], t.arcToSvg(
          l[1],
          l[2],
          l[3],
          l[4],
          l[5],
          n,
          o
        );
        break;
      case "a":
        n += l[6], o += l[7], t.arcToSvg(
          l[1],
          l[2],
          l[3],
          l[4],
          l[5],
          n,
          o
        );
        break;
      case "Z":
      case "z":
        t.closePath(), r.length > 0 && (s = r.pop(), s ? (n = s.startX, o = s.startY) : (n = 0, o = 0)), s = null;
        break;
      default:
        dt(`Unknown SVG path command: ${c}`);
    }
    c !== "Z" && c !== "z" && s === null && (s = { startX: n, startY: o }, r.push(s));
  }
  return t;
}
class En {
  /**
   * @param x - The X coordinate of the center of this circle
   * @param y - The Y coordinate of the center of this circle
   * @param radius - The radius of the circle
   */
  constructor(t = 0, e = 0, r = 0) {
    this.type = "circle", this.x = t, this.y = e, this.radius = r;
  }
  /**
   * Creates a clone of this Circle instance
   * @returns A copy of the Circle
   */
  clone() {
    return new En(this.x, this.y, this.radius);
  }
  /**
   * Checks whether the x and y coordinates given are contained within this circle
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coordinates are within this Circle
   */
  contains(t, e) {
    if (this.radius <= 0)
      return !1;
    const r = this.radius * this.radius;
    let s = this.x - t, n = this.y - e;
    return s *= s, n *= n, s + n <= r;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this circle including the stroke.
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @param width - The width of the line to check
   * @returns Whether the x/y coordinates are within this Circle
   */
  strokeContains(t, e, r) {
    if (this.radius === 0)
      return !1;
    const s = this.x - t, n = this.y - e, o = this.radius, a = r / 2, h = Math.sqrt(s * s + n * n);
    return h < o + a && h > o - a;
  }
  /**
   * Returns the framing rectangle of the circle as a Rectangle object
   * @param out
   * @returns The framing rectangle
   */
  getBounds(t) {
    return t = t || new mt(), t.x = this.x - this.radius, t.y = this.y - this.radius, t.width = this.radius * 2, t.height = this.radius * 2, t;
  }
  /**
   * Copies another circle to this one.
   * @param circle - The circle to copy from.
   * @returns Returns itself.
   */
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.radius = t.radius, this;
  }
  /**
   * Copies this circle to another one.
   * @param circle - The circle to copy to.
   * @returns Returns given parameter.
   */
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  toString() {
    return `[pixi.js/math:Circle x=${this.x} y=${this.y} radius=${this.radius}]`;
  }
}
class Bo {
  /**
   * @param x - The X coordinate of the center of this ellipse
   * @param y - The Y coordinate of the center of this ellipse
   * @param halfWidth - The half width of this ellipse
   * @param halfHeight - The half height of this ellipse
   */
  constructor(t = 0, e = 0, r = 0, s = 0) {
    this.type = "ellipse", this.x = t, this.y = e, this.halfWidth = r, this.halfHeight = s;
  }
  /**
   * Creates a clone of this Ellipse instance
   * @returns {Ellipse} A copy of the ellipse
   */
  clone() {
    return new Bo(this.x, this.y, this.halfWidth, this.halfHeight);
  }
  /**
   * Checks whether the x and y coordinates given are contained within this ellipse
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coords are within this ellipse
   */
  contains(t, e) {
    if (this.halfWidth <= 0 || this.halfHeight <= 0)
      return !1;
    let r = (t - this.x) / this.halfWidth, s = (e - this.y) / this.halfHeight;
    return r *= r, s *= s, r + s <= 1;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this ellipse including stroke
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @param width
   * @returns Whether the x/y coords are within this ellipse
   */
  strokeContains(t, e, r) {
    const { halfWidth: s, halfHeight: n } = this;
    if (s <= 0 || n <= 0)
      return !1;
    const o = r / 2, a = s - o, h = n - o, c = s + o, l = n + o, f = t - this.x, p = e - this.y, u = f * f / (a * a) + p * p / (h * h), d = f * f / (c * c) + p * p / (l * l);
    return u > 1 && d <= 1;
  }
  /**
   * Returns the framing rectangle of the ellipse as a Rectangle object
   * @param out
   * @returns The framing rectangle
   */
  getBounds(t) {
    return t = t || new mt(), t.x = this.x - this.halfWidth, t.y = this.y - this.halfHeight, t.width = this.halfWidth * 2, t.height = this.halfHeight * 2, t;
  }
  /**
   * Copies another ellipse to this one.
   * @param ellipse - The ellipse to copy from.
   * @returns Returns itself.
   */
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.halfWidth = t.halfWidth, this.halfHeight = t.halfHeight, this;
  }
  /**
   * Copies this ellipse to another one.
   * @param ellipse - The ellipse to copy to.
   * @returns Returns given parameter.
   */
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  toString() {
    return `[pixi.js/math:Ellipse x=${this.x} y=${this.y} halfWidth=${this.halfWidth} halfHeight=${this.halfHeight}]`;
  }
}
function Gp(i, t, e, r, s, n) {
  const o = i - e, a = t - r, h = s - e, c = n - r, l = o * h + a * c, f = h * h + c * c;
  let p = -1;
  f !== 0 && (p = l / f);
  let u, d;
  p < 0 ? (u = e, d = r) : p > 1 ? (u = s, d = n) : (u = e + p * h, d = r + p * c);
  const m = i - u, g = t - d;
  return m * m + g * g;
}
class Ti {
  /**
   * @param points - This can be an array of Points
   *  that form the polygon, a flat array of numbers that will be interpreted as [x,y, x,y, ...], or
   *  the arguments passed can be all the points of the polygon e.g.
   *  `new Polygon(new Point(), new Point(), ...)`, or the arguments passed can be flat
   *  x,y values e.g. `new Polygon(x,y, x,y, x,y, ...)` where `x` and `y` are Numbers.
   */
  constructor(...t) {
    this.type = "polygon";
    let e = Array.isArray(t[0]) ? t[0] : t;
    if (typeof e[0] != "number") {
      const r = [];
      for (let s = 0, n = e.length; s < n; s++)
        r.push(e[s].x, e[s].y);
      e = r;
    }
    this.points = e, this.closePath = !0;
  }
  /**
   * Creates a clone of this polygon.
   * @returns - A copy of the polygon.
   */
  clone() {
    const t = this.points.slice(), e = new Ti(t);
    return e.closePath = this.closePath, e;
  }
  /**
   * Checks whether the x and y coordinates passed to this function are contained within this polygon.
   * @param x - The X coordinate of the point to test.
   * @param y - The Y coordinate of the point to test.
   * @returns - Whether the x/y coordinates are within this polygon.
   */
  contains(t, e) {
    let r = !1;
    const s = this.points.length / 2;
    for (let n = 0, o = s - 1; n < s; o = n++) {
      const a = this.points[n * 2], h = this.points[n * 2 + 1], c = this.points[o * 2], l = this.points[o * 2 + 1];
      h > e != l > e && t < (c - a) * ((e - h) / (l - h)) + a && (r = !r);
    }
    return r;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this polygon including the stroke.
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @param strokeWidth - The width of the line to check
   * @returns Whether the x/y coordinates are within this polygon
   */
  strokeContains(t, e, r) {
    const s = r / 2, n = s * s, { points: o } = this, a = o.length - (this.closePath ? 0 : 2);
    for (let h = 0; h < a; h += 2) {
      const c = o[h], l = o[h + 1], f = o[(h + 2) % o.length], p = o[(h + 3) % o.length];
      if (Gp(t, e, c, l, f, p) <= n)
        return !0;
    }
    return !1;
  }
  /**
   * Returns the framing rectangle of the polygon as a Rectangle object
   * @param out - optional rectangle to store the result
   * @returns The framing rectangle
   */
  getBounds(t) {
    t = t || new mt();
    const e = this.points;
    let r = 1 / 0, s = -1 / 0, n = 1 / 0, o = -1 / 0;
    for (let a = 0, h = e.length; a < h; a += 2) {
      const c = e[a], l = e[a + 1];
      r = c < r ? c : r, s = c > s ? c : s, n = l < n ? l : n, o = l > o ? l : o;
    }
    return t.x = r, t.width = s - r, t.y = n, t.height = o - n, t;
  }
  /**
   * Copies another polygon to this one.
   * @param polygon - The polygon to copy from.
   * @returns Returns itself.
   */
  copyFrom(t) {
    return this.points = t.points.slice(), this.closePath = t.closePath, this;
  }
  /**
   * Copies this polygon to another one.
   * @param polygon - The polygon to copy to.
   * @returns Returns given parameter.
   */
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  toString() {
    return `[pixi.js/math:PolygoncloseStroke=${this.closePath}points=${this.points.reduce((t, e) => `${t}, ${e}`, "")}]`;
  }
  /**
   * Get the last X coordinate of the polygon
   * @readonly
   */
  get lastX() {
    return this.points[this.points.length - 2];
  }
  /**
   * Get the last Y coordinate of the polygon
   * @readonly
   */
  get lastY() {
    return this.points[this.points.length - 1];
  }
  /**
   * Get the first X coordinate of the polygon
   * @readonly
   */
  get x() {
    return this.points[this.points.length - 2];
  }
  /**
   * Get the first Y coordinate of the polygon
   * @readonly
   */
  get y() {
    return this.points[this.points.length - 1];
  }
}
const Kr = (i, t, e, r, s, n) => {
  const o = i - e, a = t - r, h = Math.sqrt(o * o + a * a);
  return h >= s - n && h <= s + n;
};
class Bn {
  /**
   * @param x - The X coordinate of the upper-left corner of the rounded rectangle
   * @param y - The Y coordinate of the upper-left corner of the rounded rectangle
   * @param width - The overall width of this rounded rectangle
   * @param height - The overall height of this rounded rectangle
   * @param radius - Controls the radius of the rounded corners
   */
  constructor(t = 0, e = 0, r = 0, s = 0, n = 20) {
    this.type = "roundedRectangle", this.x = t, this.y = e, this.width = r, this.height = s, this.radius = n;
  }
  /**
   * Returns the framing rectangle of the rounded rectangle as a Rectangle object
   * @param out - optional rectangle to store the result
   * @returns The framing rectangle
   */
  getBounds(t) {
    return t = t || new mt(), t.x = this.x, t.y = this.y, t.width = this.width, t.height = this.height, t;
  }
  /**
   * Creates a clone of this Rounded Rectangle.
   * @returns - A copy of the rounded rectangle.
   */
  clone() {
    return new Bn(this.x, this.y, this.width, this.height, this.radius);
  }
  /**
   * Copies another rectangle to this one.
   * @param rectangle - The rectangle to copy from.
   * @returns Returns itself.
   */
  copyFrom(t) {
    return this.x = t.x, this.y = t.y, this.width = t.width, this.height = t.height, this;
  }
  /**
   * Copies this rectangle to another one.
   * @param rectangle - The rectangle to copy to.
   * @returns Returns given parameter.
   */
  copyTo(t) {
    return t.copyFrom(this), t;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this Rounded Rectangle
   * @param x - The X coordinate of the point to test.
   * @param y - The Y coordinate of the point to test.
   * @returns - Whether the x/y coordinates are within this Rounded Rectangle.
   */
  contains(t, e) {
    if (this.width <= 0 || this.height <= 0)
      return !1;
    if (t >= this.x && t <= this.x + this.width && e >= this.y && e <= this.y + this.height) {
      const r = Math.max(0, Math.min(this.radius, Math.min(this.width, this.height) / 2));
      if (e >= this.y + r && e <= this.y + this.height - r || t >= this.x + r && t <= this.x + this.width - r)
        return !0;
      let s = t - (this.x + r), n = e - (this.y + r);
      const o = r * r;
      if (s * s + n * n <= o || (s = t - (this.x + this.width - r), s * s + n * n <= o) || (n = e - (this.y + this.height - r), s * s + n * n <= o) || (s = t - (this.x + r), s * s + n * n <= o))
        return !0;
    }
    return !1;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this rectangle including the stroke.
   * @param pX - The X coordinate of the point to test
   * @param pY - The Y coordinate of the point to test
   * @param strokeWidth - The width of the line to check
   * @returns Whether the x/y coordinates are within this rectangle
   */
  strokeContains(t, e, r) {
    const { x: s, y: n, width: o, height: a, radius: h } = this, c = r / 2, l = s + h, f = n + h, p = o - h * 2, u = a - h * 2, d = s + o, m = n + a;
    return (t >= s - c && t <= s + c || t >= d - c && t <= d + c) && e >= f && e <= f + u || (e >= n - c && e <= n + c || e >= m - c && e <= m + c) && t >= l && t <= l + p ? !0 : (
      // Top-left
      t < l && e < f && Kr(t, e, l, f, h, c) || t > d - h && e < f && Kr(t, e, d - h, f, h, c) || t > d - h && e > m - h && Kr(t, e, d - h, m - h, h, c) || t < l && e > m - h && Kr(t, e, l, m - h, h, c)
    );
  }
  toString() {
    return `[pixi.js/math:RoundedRectangle x=${this.x} y=${this.y}width=${this.width} height=${this.height} radius=${this.radius}]`;
  }
}
const Vp = [
  "precision mediump float;",
  "void main(void){",
  "float test = 0.1;",
  "%forloop%",
  "gl_FragColor = vec4(0.0);",
  "}"
].join(`
`);
function Hp(i) {
  let t = "";
  for (let e = 0; e < i; ++e)
    e > 0 && (t += `
else `), e < i - 1 && (t += `if(test == ${e}.0){}`);
  return t;
}
function jp(i, t) {
  if (i === 0)
    throw new Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");
  const e = t.createShader(t.FRAGMENT_SHADER);
  try {
    for (; ; ) {
      const r = Vp.replace(/%forloop%/gi, Hp(i));
      if (t.shaderSource(e, r), t.compileShader(e), !t.getShaderParameter(e, t.COMPILE_STATUS))
        i = i / 2 | 0;
      else
        break;
    }
  } finally {
    t.deleteShader(e);
  }
  return i;
}
let bi = null;
function Yl() {
  var i;
  if (bi)
    return bi;
  const t = Pl();
  return bi = t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS), bi = jp(
    bi,
    t
  ), (i = t.getExtension("WEBGL_lose_context")) == null || i.loseContext(), bi;
}
const Xl = {};
function Np(i, t) {
  let e = 2166136261;
  for (let r = 0; r < t; r++)
    e ^= i[r].uid, e = Math.imul(e, 16777619), e >>>= 0;
  return Xl[e] || Wp(i, t, e);
}
let ys = 0;
function Wp(i, t, e) {
  const r = {};
  let s = 0;
  ys || (ys = Yl());
  for (let o = 0; o < ys; o++) {
    const a = o < t ? i[o] : H.EMPTY.source;
    r[s++] = a.source, r[s++] = a.style;
  }
  const n = new en(r);
  return Xl[e] = n, n;
}
class qa {
  constructor(t) {
    typeof t == "number" ? this.rawBinaryData = new ArrayBuffer(t) : t instanceof Uint8Array ? this.rawBinaryData = t.buffer : this.rawBinaryData = t, this.uint32View = new Uint32Array(this.rawBinaryData), this.float32View = new Float32Array(this.rawBinaryData), this.size = this.rawBinaryData.byteLength;
  }
  /** View on the raw binary data as a `Int8Array`. */
  get int8View() {
    return this._int8View || (this._int8View = new Int8Array(this.rawBinaryData)), this._int8View;
  }
  /** View on the raw binary data as a `Uint8Array`. */
  get uint8View() {
    return this._uint8View || (this._uint8View = new Uint8Array(this.rawBinaryData)), this._uint8View;
  }
  /**  View on the raw binary data as a `Int16Array`. */
  get int16View() {
    return this._int16View || (this._int16View = new Int16Array(this.rawBinaryData)), this._int16View;
  }
  /** View on the raw binary data as a `Int32Array`. */
  get int32View() {
    return this._int32View || (this._int32View = new Int32Array(this.rawBinaryData)), this._int32View;
  }
  /** View on the raw binary data as a `Float64Array`. */
  get float64View() {
    return this._float64Array || (this._float64Array = new Float64Array(this.rawBinaryData)), this._float64Array;
  }
  /** View on the raw binary data as a `BigUint64Array`. */
  get bigUint64View() {
    return this._bigUint64Array || (this._bigUint64Array = new BigUint64Array(this.rawBinaryData)), this._bigUint64Array;
  }
  /**
   * Returns the view of the given type.
   * @param type - One of `int8`, `uint8`, `int16`,
   *    `uint16`, `int32`, `uint32`, and `float32`.
   * @returns - typed array of given type
   */
  view(t) {
    return this[`${t}View`];
  }
  /** Destroys all buffer references. Do not use after calling this. */
  destroy() {
    this.rawBinaryData = null, this._int8View = null, this._uint8View = null, this._int16View = null, this.uint16View = null, this._int32View = null, this.uint32View = null, this.float32View = null;
  }
  /**
   * Returns the size of the given type in bytes.
   * @param type - One of `int8`, `uint8`, `int16`,
   *   `uint16`, `int32`, `uint32`, and `float32`.
   * @returns - size of the type in bytes
   */
  static sizeOf(t) {
    switch (t) {
      case "int8":
      case "uint8":
        return 1;
      case "int16":
      case "uint16":
        return 2;
      case "int32":
      case "uint32":
      case "float32":
        return 4;
      default:
        throw new Error(`${t} isn't a valid view type`);
    }
  }
}
function Ka(i, t) {
  const e = i.byteLength / 8 | 0, r = new Float64Array(i, 0, e);
  new Float64Array(t, 0, e).set(r);
  const s = i.byteLength - e * 8;
  if (s > 0) {
    const n = new Uint8Array(i, e * 8, s);
    new Uint8Array(t, e * 8, s).set(n);
  }
}
const Yp = {
  normal: "normal-npm",
  add: "add-npm",
  screen: "screen-npm"
};
var Xp = /* @__PURE__ */ ((i) => (i[i.DISABLED = 0] = "DISABLED", i[i.RENDERING_MASK_ADD = 1] = "RENDERING_MASK_ADD", i[i.MASK_ACTIVE = 2] = "MASK_ACTIVE", i[i.INVERSE_MASK_ACTIVE = 3] = "INVERSE_MASK_ACTIVE", i[i.RENDERING_MASK_REMOVE = 4] = "RENDERING_MASK_REMOVE", i[i.NONE = 5] = "NONE", i))(Xp || {});
function Qa(i, t) {
  return t.alphaMode === "no-premultiply-alpha" && Yp[i] || i;
}
class qp {
  constructor() {
    this.ids = /* @__PURE__ */ Object.create(null), this.textures = [], this.count = 0;
  }
  /** Clear the textures and their locations. */
  clear() {
    for (let t = 0; t < this.count; t++) {
      const e = this.textures[t];
      this.textures[t] = null, this.ids[e.uid] = null;
    }
    this.count = 0;
  }
}
class Kp {
  constructor() {
    this.renderPipeId = "batch", this.action = "startBatch", this.start = 0, this.size = 0, this.textures = new qp(), this.blendMode = "normal", this.canBundle = !0;
  }
  destroy() {
    this.textures = null, this.gpuBindGroup = null, this.bindGroup = null, this.batcher = null;
  }
}
const ql = [];
let Zs = 0;
function Ja() {
  return Zs > 0 ? ql[--Zs] : new Kp();
}
function Za(i) {
  ql[Zs++] = i;
}
let ir = 0;
const Kl = class rn {
  constructor(t = {}) {
    this.uid = vt("batcher"), this.dirty = !0, this.batchIndex = 0, this.batches = [], this._elements = [], rn.defaultOptions.maxTextures = rn.defaultOptions.maxTextures ?? Yl(), t = { ...rn.defaultOptions, ...t };
    const { maxTextures: e, attributesInitialSize: r, indicesInitialSize: s } = t;
    this.attributeBuffer = new qa(r * 4), this.indexBuffer = new Uint16Array(s), this.maxTextures = e;
  }
  begin() {
    this.elementSize = 0, this.elementStart = 0, this.indexSize = 0, this.attributeSize = 0;
    for (let t = 0; t < this.batchIndex; t++)
      Za(this.batches[t]);
    this.batchIndex = 0, this._batchIndexStart = 0, this._batchIndexSize = 0, this.dirty = !0;
  }
  add(t) {
    this._elements[this.elementSize++] = t, t._indexStart = this.indexSize, t._attributeStart = this.attributeSize, t._batcher = this, this.indexSize += t.indexSize, this.attributeSize += t.attributeSize * this.vertexSize;
  }
  checkAndUpdateTexture(t, e) {
    const r = t._batch.textures.ids[e._source.uid];
    return !r && r !== 0 ? !1 : (t._textureId = r, t.texture = e, !0);
  }
  updateElement(t) {
    this.dirty = !0;
    const e = this.attributeBuffer;
    t.packAsQuad ? this.packQuadAttributes(
      t,
      e.float32View,
      e.uint32View,
      t._attributeStart,
      t._textureId
    ) : this.packAttributes(
      t,
      e.float32View,
      e.uint32View,
      t._attributeStart,
      t._textureId
    );
  }
  /**
   * breaks the batcher. This happens when a batch gets too big,
   * or we need to switch to a different type of rendering (a filter for example)
   * @param instructionSet
   */
  break(t) {
    const e = this._elements;
    if (!e[this.elementStart])
      return;
    let r = Ja(), s = r.textures;
    s.clear();
    const n = e[this.elementStart];
    let o = Qa(n.blendMode, n.texture._source);
    this.attributeSize * 4 > this.attributeBuffer.size && this._resizeAttributeBuffer(this.attributeSize * 4), this.indexSize > this.indexBuffer.length && this._resizeIndexBuffer(this.indexSize);
    const a = this.attributeBuffer.float32View, h = this.attributeBuffer.uint32View, c = this.indexBuffer;
    let l = this._batchIndexSize, f = this._batchIndexStart, p = "startBatch";
    const u = this.maxTextures;
    for (let d = this.elementStart; d < this.elementSize; ++d) {
      const m = e[d];
      e[d] = null;
      const g = m.texture._source, y = Qa(m.blendMode, g), v = o !== y;
      if (g._batchTick === ir && !v) {
        m._textureId = g._textureBindLocation, l += m.indexSize, m.packAsQuad ? (this.packQuadAttributes(
          m,
          a,
          h,
          m._attributeStart,
          m._textureId
        ), this.packQuadIndex(
          c,
          m._indexStart,
          m._attributeStart / this.vertexSize
        )) : (this.packAttributes(
          m,
          a,
          h,
          m._attributeStart,
          m._textureId
        ), this.packIndex(
          m,
          c,
          m._indexStart,
          m._attributeStart / this.vertexSize
        )), m._batch = r;
        continue;
      }
      g._batchTick = ir, (s.count >= u || v) && (this._finishBatch(
        r,
        f,
        l - f,
        s,
        o,
        t,
        p
      ), p = "renderBatch", f = l, o = y, r = Ja(), s = r.textures, s.clear(), ++ir), m._textureId = g._textureBindLocation = s.count, s.ids[g.uid] = s.count, s.textures[s.count++] = g, m._batch = r, l += m.indexSize, m.packAsQuad ? (this.packQuadAttributes(
        m,
        a,
        h,
        m._attributeStart,
        m._textureId
      ), this.packQuadIndex(
        c,
        m._indexStart,
        m._attributeStart / this.vertexSize
      )) : (this.packAttributes(
        m,
        a,
        h,
        m._attributeStart,
        m._textureId
      ), this.packIndex(
        m,
        c,
        m._indexStart,
        m._attributeStart / this.vertexSize
      ));
    }
    s.count > 0 && (this._finishBatch(
      r,
      f,
      l - f,
      s,
      o,
      t,
      p
    ), f = l, ++ir), this.elementStart = this.elementSize, this._batchIndexStart = f, this._batchIndexSize = l;
  }
  _finishBatch(t, e, r, s, n, o, a) {
    t.gpuBindGroup = null, t.bindGroup = null, t.action = a, t.batcher = this, t.textures = s, t.blendMode = n, t.start = e, t.size = r, ++ir, this.batches[this.batchIndex++] = t, o.add(t);
  }
  finish(t) {
    this.break(t);
  }
  /**
   * Resizes the attribute buffer to the given size (1 = 1 float32)
   * @param size - the size in vertices to ensure (not bytes!)
   */
  ensureAttributeBuffer(t) {
    t * 4 <= this.attributeBuffer.size || this._resizeAttributeBuffer(t * 4);
  }
  /**
   * Resizes the index buffer to the given size (1 = 1 float32)
   * @param size - the size in vertices to ensure (not bytes!)
   */
  ensureIndexBuffer(t) {
    t <= this.indexBuffer.length || this._resizeIndexBuffer(t);
  }
  _resizeAttributeBuffer(t) {
    const e = Math.max(t, this.attributeBuffer.size * 2), r = new qa(e);
    Ka(this.attributeBuffer.rawBinaryData, r.rawBinaryData), this.attributeBuffer = r;
  }
  _resizeIndexBuffer(t) {
    const e = this.indexBuffer;
    let r = Math.max(t, e.length * 1.5);
    r += r % 2;
    const s = r > 65535 ? new Uint32Array(r) : new Uint16Array(r);
    if (s.BYTES_PER_ELEMENT !== e.BYTES_PER_ELEMENT)
      for (let n = 0; n < e.length; n++)
        s[n] = e[n];
    else
      Ka(e.buffer, s.buffer);
    this.indexBuffer = s;
  }
  packQuadIndex(t, e, r) {
    t[e] = r + 0, t[e + 1] = r + 1, t[e + 2] = r + 2, t[e + 3] = r + 0, t[e + 4] = r + 2, t[e + 5] = r + 3;
  }
  packIndex(t, e, r, s) {
    const n = t.indices, o = t.indexSize, a = t.indexOffset, h = t.attributeOffset;
    for (let c = 0; c < o; c++)
      e[r++] = s + n[c + a] - h;
  }
  destroy() {
    for (let t = 0; t < this.batches.length; t++)
      Za(this.batches[t]);
    this.batches = null;
    for (let t = 0; t < this._elements.length; t++)
      this._elements[t]._batch = null;
    this._elements = null, this.indexBuffer = null, this.attributeBuffer.destroy(), this.attributeBuffer = null;
  }
};
Kl.defaultOptions = {
  maxTextures: null,
  attributesInitialSize: 4,
  indicesInitialSize: 6
};
let Qp = Kl;
var ft = /* @__PURE__ */ ((i) => (i[i.MAP_READ = 1] = "MAP_READ", i[i.MAP_WRITE = 2] = "MAP_WRITE", i[i.COPY_SRC = 4] = "COPY_SRC", i[i.COPY_DST = 8] = "COPY_DST", i[i.INDEX = 16] = "INDEX", i[i.VERTEX = 32] = "VERTEX", i[i.UNIFORM = 64] = "UNIFORM", i[i.STORAGE = 128] = "STORAGE", i[i.INDIRECT = 256] = "INDIRECT", i[i.QUERY_RESOLVE = 512] = "QUERY_RESOLVE", i[i.STATIC = 1024] = "STATIC", i))(ft || {});
class Ve extends Bt {
  /**
   * Creates a new Buffer with the given options
   * @param options - the options for the buffer
   */
  constructor(t) {
    let { data: e, size: r } = t;
    const { usage: s, label: n, shrinkToFit: o } = t;
    super(), this.uid = vt("buffer"), this._resourceType = "buffer", this._resourceId = vt("resource"), this._touched = 0, this._updateID = 1, this.shrinkToFit = !0, this.destroyed = !1, e instanceof Array && (e = new Float32Array(e)), this._data = e, r = r ?? (e == null ? void 0 : e.byteLength);
    const a = !!e;
    this.descriptor = {
      size: r,
      usage: s,
      mappedAtCreation: a,
      label: n
    }, this.shrinkToFit = o ?? !0;
  }
  /** the data in the buffer */
  get data() {
    return this._data;
  }
  set data(t) {
    this.setDataWithSize(t, t.length, !0);
  }
  /** whether the buffer is static or not */
  get static() {
    return !!(this.descriptor.usage & ft.STATIC);
  }
  set static(t) {
    t ? this.descriptor.usage |= ft.STATIC : this.descriptor.usage &= ~ft.STATIC;
  }
  /**
   * Sets the data in the buffer to the given value. This will immediately update the buffer on the GPU.
   * If you only want to update a subset of the buffer, you can pass in the size of the data.
   * @param value - the data to set
   * @param size - the size of the data in bytes
   * @param syncGPU - should the buffer be updated on the GPU immediately?
   */
  setDataWithSize(t, e, r) {
    if (this._updateID++, this._updateSize = e * t.BYTES_PER_ELEMENT, this._data === t) {
      r && this.emit("update", this);
      return;
    }
    const s = this._data;
    if (this._data = t, s.length !== t.length) {
      !this.shrinkToFit && t.byteLength < s.byteLength ? r && this.emit("update", this) : (this.descriptor.size = t.byteLength, this._resourceId = vt("resource"), this.emit("change", this));
      return;
    }
    r && this.emit("update", this);
  }
  /**
   * updates the buffer on the GPU to reflect the data in the buffer.
   * By default it will update the entire buffer. If you only want to update a subset of the buffer,
   * you can pass in the size of the buffer to update.
   * @param sizeInBytes - the new size of the buffer in bytes
   */
  update(t) {
    this._updateSize = t ?? this._updateSize, this._updateID++, this.emit("update", this);
  }
  /** Destroys the buffer */
  destroy() {
    this.destroyed = !0, this.emit("destroy", this), this.emit("change", this), this._data = null, this.descriptor = null, this.removeAllListeners();
  }
}
function Ql(i, t) {
  if (!(i instanceof Ve)) {
    let e = t ? ft.INDEX : ft.VERTEX;
    i instanceof Array && (t ? (i = new Uint32Array(i), e = ft.INDEX | ft.COPY_DST) : (i = new Float32Array(i), e = ft.VERTEX | ft.COPY_DST)), i = new Ve({
      data: i,
      label: t ? "index-mesh-buffer" : "vertex-mesh-buffer",
      usage: e
    });
  }
  return i;
}
function Jp(i, t, e) {
  const r = i.getAttribute(t);
  if (!r)
    return e.minX = 0, e.minY = 0, e.maxX = 0, e.maxY = 0, e;
  const s = r.buffer.data;
  let n = 1 / 0, o = 1 / 0, a = -1 / 0, h = -1 / 0;
  const c = s.BYTES_PER_ELEMENT, l = (r.offset || 0) / c, f = (r.stride || 2 * 4) / c;
  for (let p = l; p < s.length; p += f) {
    const u = s[p], d = s[p + 1];
    u > a && (a = u), d > h && (h = d), u < n && (n = u), d < o && (o = d);
  }
  return e.minX = n, e.minY = o, e.maxX = a, e.maxY = h, e;
}
function Zp(i) {
  return (i instanceof Ve || Array.isArray(i) || i.BYTES_PER_ELEMENT) && (i = {
    buffer: i
  }), i.buffer = Ql(i.buffer, !1), i;
}
class Jl extends Bt {
  /**
   * Create a new instance of a geometry
   * @param options - The options for the geometry.
   */
  constructor(t = {}) {
    super(), this.uid = vt("geometry"), this._layoutKey = 0, this.instanceCount = 1, this._bounds = new _e(), this._boundsDirty = !0;
    const { attributes: e, indexBuffer: r, topology: s } = t;
    if (this.buffers = [], this.attributes = {}, e)
      for (const n in e)
        this.addAttribute(n, e[n]);
    this.instanceCount = t.instanceCount || 1, r && this.addIndex(r), this.topology = s || "triangle-list";
  }
  onBufferUpdate() {
    this._boundsDirty = !0, this.emit("update", this);
  }
  /**
   * Returns the requested attribute.
   * @param id - The name of the attribute required
   * @returns - The attribute requested.
   */
  getAttribute(t) {
    return this.attributes[t];
  }
  /**
   * Returns the index buffer
   * @returns - The index buffer.
   */
  getIndex() {
    return this.indexBuffer;
  }
  /**
   * Returns the requested buffer.
   * @param id - The name of the buffer required.
   * @returns - The buffer requested.
   */
  getBuffer(t) {
    return this.getAttribute(t).buffer;
  }
  /**
   * Used to figure out how many vertices there are in this geometry
   * @returns the number of vertices in the geometry
   */
  getSize() {
    for (const t in this.attributes) {
      const e = this.attributes[t];
      return e.buffer.data.length / (e.stride / 4 || e.size);
    }
    return 0;
  }
  /**
   * Adds an attribute to the geometry.
   * @param name - The name of the attribute to add.
   * @param attributeOption - The attribute option to add.
   */
  addAttribute(t, e) {
    const r = Zp(e);
    this.buffers.indexOf(r.buffer) === -1 && (this.buffers.push(r.buffer), r.buffer.on("update", this.onBufferUpdate, this), r.buffer.on("change", this.onBufferUpdate, this)), this.attributes[t] = r;
  }
  /**
   * Adds an index buffer to the geometry.
   * @param indexBuffer - The index buffer to add. Can be a Buffer, TypedArray, or an array of numbers.
   */
  addIndex(t) {
    this.indexBuffer = Ql(t, !0), this.buffers.push(this.indexBuffer);
  }
  /** Returns the bounds of the geometry. */
  get bounds() {
    return this._boundsDirty ? (this._boundsDirty = !1, Jp(this, "aPosition", this._bounds)) : this._bounds;
  }
  /**
   * destroys the geometry.
   * @param destroyBuffers - destroy the buffers associated with this geometry
   */
  destroy(t = !1) {
    this.emit("destroy", this), this.removeAllListeners(), t && this.buffers.forEach((e) => e.destroy()), this.attributes = null, this.buffers = null, this.indexBuffer = null, this._bounds = null;
  }
}
const $p = new Float32Array(1), tf = new Uint32Array(1);
class ef extends Jl {
  constructor() {
    const t = new Ve({
      data: $p,
      label: "attribute-batch-buffer",
      usage: ft.VERTEX | ft.COPY_DST,
      shrinkToFit: !1
    }), e = new Ve({
      data: tf,
      label: "index-batch-buffer",
      usage: ft.INDEX | ft.COPY_DST,
      // | BufferUsage.STATIC,
      shrinkToFit: !1
    }), r = 6 * 4;
    super({
      attributes: {
        aPosition: {
          buffer: t,
          format: "float32x2",
          stride: r,
          offset: 0
        },
        aUV: {
          buffer: t,
          format: "float32x2",
          stride: r,
          offset: 2 * 4
        },
        aColor: {
          buffer: t,
          format: "unorm8x4",
          stride: r,
          offset: 4 * 4
        },
        aTextureIdAndRound: {
          buffer: t,
          format: "uint16x2",
          stride: r,
          offset: 5 * 4
        }
      },
      indexBuffer: e
    });
  }
}
function $a(i, t, e) {
  if (i)
    for (const r in i) {
      const s = r.toLocaleLowerCase(), n = t[s];
      if (n) {
        let o = i[r];
        r === "header" && (o = o.replace(/@in\s+[^;]+;\s*/g, "").replace(/@out\s+[^;]+;\s*/g, "")), e && n.push(`//----${e}----//`), n.push(o);
      } else
        dt(`${r} placement hook does not exist in shader`);
    }
}
const rf = /\{\{(.*?)\}\}/g;
function th(i) {
  var t;
  const e = {};
  return (((t = i.match(rf)) == null ? void 0 : t.map((r) => r.replace(/[{()}]/g, ""))) ?? []).forEach((r) => {
    e[r] = [];
  }), e;
}
function eh(i, t) {
  let e;
  const r = /@in\s+([^;]+);/g;
  for (; (e = r.exec(i)) !== null; )
    t.push(e[1]);
}
function ih(i, t, e = !1) {
  const r = [];
  eh(t, r), i.forEach((a) => {
    a.header && eh(a.header, r);
  });
  const s = r;
  e && s.sort();
  const n = s.map((a, h) => `       @location(${h}) ${a},`).join(`
`);
  let o = t.replace(/@in\s+[^;]+;\s*/g, "");
  return o = o.replace("{{in}}", `
${n}
`), o;
}
function rh(i, t) {
  let e;
  const r = /@out\s+([^;]+);/g;
  for (; (e = r.exec(i)) !== null; )
    t.push(e[1]);
}
function nf(i) {
  const t = /\b(\w+)\s*:/g.exec(i);
  return t ? t[1] : "";
}
function sf(i) {
  const t = /@.*?\s+/g;
  return i.replace(t, "");
}
function of(i, t) {
  const e = [];
  rh(t, e), i.forEach((h) => {
    h.header && rh(h.header, e);
  });
  let r = 0;
  const s = e.sort().map((h) => h.indexOf("builtin") > -1 ? h : `@location(${r++}) ${h}`).join(`,
`), n = e.sort().map((h) => `       var ${sf(h)};`).join(`
`), o = `return VSOutput(
                ${e.sort().map((h) => ` ${nf(h)}`).join(`,
`)});`;
  let a = t.replace(/@out\s+[^;]+;\s*/g, "");
  return a = a.replace("{{struct}}", `
${s}
`), a = a.replace("{{start}}", `
${n}
`), a = a.replace("{{return}}", `
${o}
`), a;
}
function nh(i, t) {
  let e = i;
  for (const r in t) {
    const s = t[r];
    s.join(`
`).length ? e = e.replace(`{{${r}}}`, `//-----${r} START-----//
${s.join(`
`)}
//----${r} FINISH----//`) : e = e.replace(`{{${r}}}`, "");
  }
  return e;
}
const ri = /* @__PURE__ */ Object.create(null), xs = /* @__PURE__ */ new Map();
let af = 0;
function hf({
  template: i,
  bits: t
}) {
  const e = Zl(i, t);
  if (ri[e])
    return ri[e];
  const { vertex: r, fragment: s } = cf(i, t);
  return ri[e] = $l(r, s, t), ri[e];
}
function lf({
  template: i,
  bits: t
}) {
  const e = Zl(i, t);
  return ri[e] || (ri[e] = $l(i.vertex, i.fragment, t)), ri[e];
}
function cf(i, t) {
  const e = t.map((o) => o.vertex).filter((o) => !!o), r = t.map((o) => o.fragment).filter((o) => !!o);
  let s = ih(e, i.vertex, !0);
  s = of(e, s);
  const n = ih(r, i.fragment, !0);
  return {
    vertex: s,
    fragment: n
  };
}
function Zl(i, t) {
  return t.map((e) => (xs.has(e) || xs.set(e, af++), xs.get(e))).sort((e, r) => e - r).join("-") + i.vertex + i.fragment;
}
function $l(i, t, e) {
  const r = th(i), s = th(t);
  return e.forEach((n) => {
    $a(n.vertex, r, n.name), $a(n.fragment, s, n.name);
  }), {
    vertex: nh(i, r),
    fragment: nh(t, s)
  };
}
const uf = (
  /* wgsl */
  `
    @in aPosition: vec2<f32>;
    @in aUV: vec2<f32>;

    @out @builtin(position) vPosition: vec4<f32>;
    @out vUV : vec2<f32>;
    @out vColor : vec4<f32>;

    {{header}}

    struct VSOutput {
        {{struct}}
    };

    @vertex
    fn main( {{in}} ) -> VSOutput {

        var worldTransformMatrix = globalUniforms.uWorldTransformMatrix;
        var modelMatrix = mat3x3<f32>(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        var position = aPosition;
        var uv = aUV;

        {{start}}
        
        vColor = vec4<f32>(1., 1., 1., 1.);

        {{main}}

        vUV = uv;

        var modelViewProjectionMatrix = globalUniforms.uProjectionMatrix * worldTransformMatrix * modelMatrix;

        vPosition =  vec4<f32>((modelViewProjectionMatrix *  vec3<f32>(position, 1.0)).xy, 0.0, 1.0);
       
        vColor *= globalUniforms.uWorldColorAlpha;

        {{end}}

        {{return}}
    };
`
), df = (
  /* wgsl */
  `
    @in vUV : vec2<f32>;
    @in vColor : vec4<f32>;
   
    {{header}}

    @fragment
    fn main(
        {{in}}
      ) -> @location(0) vec4<f32> {
        
        {{start}}

        var outColor:vec4<f32>;
      
        {{main}}
        
        var finalColor:vec4<f32> = outColor * vColor;

        {{end}}

        return finalColor;
      };
`
), pf = (
  /* glsl */
  `
    in vec2 aPosition;
    in vec2 aUV;

    out vec4 vColor;
    out vec2 vUV;

    {{header}}

    void main(void){

        mat3 worldTransformMatrix = uWorldTransformMatrix;
        mat3 modelMatrix = mat3(
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0
          );
        vec2 position = aPosition;
        vec2 uv = aUV;
        
        {{start}}
        
        vColor = vec4(1.);
        
        {{main}}
        
        vUV = uv;
        
        mat3 modelViewProjectionMatrix = uProjectionMatrix * worldTransformMatrix * modelMatrix;

        gl_Position = vec4((modelViewProjectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);

        vColor *= uWorldColorAlpha;

        {{end}}
    }
`
), ff = (
  /* glsl */
  `
   
    in vec4 vColor;
    in vec2 vUV;

    out vec4 finalColor;

    {{header}}

    void main(void) {
        
        {{start}}

        vec4 outColor;
      
        {{main}}
        
        finalColor = outColor * vColor;
        
        {{end}}
    }
`
), mf = {
  name: "global-uniforms-bit",
  vertex: {
    header: (
      /* wgsl */
      `
        struct GlobalUniforms {
            uProjectionMatrix:mat3x3<f32>,
            uWorldTransformMatrix:mat3x3<f32>,
            uWorldColorAlpha: vec4<f32>,
            uResolution: vec2<f32>,
        }

        @group(0) @binding(0) var<uniform> globalUniforms : GlobalUniforms;
        `
    )
  }
}, gf = {
  name: "global-uniforms-bit",
  vertex: {
    header: (
      /* glsl */
      `
          uniform mat3 uProjectionMatrix;
          uniform mat3 uWorldTransformMatrix;
          uniform vec4 uWorldColorAlpha;
          uniform vec2 uResolution;
        `
    )
  }
};
function yf({ bits: i, name: t }) {
  const e = hf({
    template: {
      fragment: df,
      vertex: uf
    },
    bits: [
      mf,
      ...i
    ]
  });
  return Pn.from({
    name: t,
    vertex: {
      source: e.vertex,
      entryPoint: "main"
    },
    fragment: {
      source: e.fragment,
      entryPoint: "main"
    }
  });
}
function xf({ bits: i, name: t }) {
  return new Ml({
    name: t,
    ...lf({
      template: {
        vertex: pf,
        fragment: ff
      },
      bits: [
        gf,
        ...i
      ]
    })
  });
}
const vf = {
  name: "color-bit",
  vertex: {
    header: (
      /* wgsl */
      `
            @in aColor: vec4<f32>;
        `
    ),
    main: (
      /* wgsl */
      `
            vColor *= vec4<f32>(aColor.rgb * aColor.a, aColor.a);
        `
    )
  }
}, bf = {
  name: "color-bit",
  vertex: {
    header: (
      /* glsl */
      `
            in vec4 aColor;
        `
    ),
    main: (
      /* glsl */
      `
            vColor *= vec4(aColor.rgb * aColor.a, aColor.a);
        `
    )
  }
}, vs = {};
function _f(i) {
  const t = [];
  if (i === 1)
    t.push("@group(1) @binding(0) var textureSource1: texture_2d<f32>;"), t.push("@group(1) @binding(1) var textureSampler1: sampler;");
  else {
    let e = 0;
    for (let r = 0; r < i; r++)
      t.push(`@group(1) @binding(${e++}) var textureSource${r + 1}: texture_2d<f32>;`), t.push(`@group(1) @binding(${e++}) var textureSampler${r + 1}: sampler;`);
  }
  return t.join(`
`);
}
function wf(i) {
  const t = [];
  if (i === 1)
    t.push("outColor = textureSampleGrad(textureSource1, textureSampler1, vUV, uvDx, uvDy);");
  else {
    t.push("switch vTextureId {");
    for (let e = 0; e < i; e++)
      e === i - 1 ? t.push("  default:{") : t.push(`  case ${e}:{`), t.push(`      outColor = textureSampleGrad(textureSource${e + 1}, textureSampler${e + 1}, vUV, uvDx, uvDy);`), t.push("      break;}");
    t.push("}");
  }
  return t.join(`
`);
}
function Af(i) {
  return vs[i] || (vs[i] = {
    name: "texture-batch-bit",
    vertex: {
      header: `
                @in aTextureIdAndRound: vec2<u32>;
                @out @interpolate(flat) vTextureId : u32;
            `,
      main: `
                vTextureId = aTextureIdAndRound.y;
            `,
      end: `
                if(aTextureIdAndRound.x == 1)
                {
                    vPosition = vec4<f32>(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
                }
            `
    },
    fragment: {
      header: `
                @in @interpolate(flat) vTextureId: u32;

                ${_f(i)}
            `,
      main: `
                var uvDx = dpdx(vUV);
                var uvDy = dpdy(vUV);

                ${wf(i)}
            `
    }
  }), vs[i];
}
const bs = {};
function Sf(i) {
  const t = [];
  for (let e = 0; e < i; e++)
    e > 0 && t.push("else"), e < i - 1 && t.push(`if(vTextureId < ${e}.5)`), t.push("{"), t.push(`	outColor = texture(uTextures[${e}], vUV);`), t.push("}");
  return t.join(`
`);
}
function Cf(i) {
  return bs[i] || (bs[i] = {
    name: "texture-batch-bit",
    vertex: {
      header: `
                in vec2 aTextureIdAndRound;
                out float vTextureId;

            `,
      main: `
                vTextureId = aTextureIdAndRound.y;
            `,
      end: `
                if(aTextureIdAndRound.x == 1.)
                {
                    gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
                }
            `
    },
    fragment: {
      header: `
                in float vTextureId;

                uniform sampler2D uTextures[${i}];

            `,
      main: `

                ${Sf(i)}
            `
    }
  }), bs[i];
}
const Pf = {
  name: "round-pixels-bit",
  vertex: {
    header: (
      /* wgsl */
      `
            fn roundPixels(position: vec2<f32>, targetSize: vec2<f32>) -> vec2<f32> 
            {
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `
    )
  }
}, kf = {
  name: "round-pixels-bit",
  vertex: {
    header: (
      /* glsl */
      `   
            vec2 roundPixels(vec2 position, vec2 targetSize)
            {       
                return (floor(((position * 0.5 + 0.5) * targetSize) + 0.5) / targetSize) * 2.0 - 1.0;
            }
        `
    )
  }
}, sh = {};
function Mf(i) {
  let t = sh[i];
  if (t)
    return t;
  const e = new Int32Array(i);
  for (let r = 0; r < i; r++)
    e[r] = r;
  return t = sh[i] = new Rl({
    uTextures: { value: e, type: "i32", size: i }
  }, { isStatic: !0 }), t;
}
class Tf extends To {
  constructor(t) {
    const e = xf({
      name: "batch",
      bits: [
        bf,
        Cf(t),
        kf
      ]
    }), r = yf({
      name: "batch",
      bits: [
        vf,
        Af(t),
        Pf
      ]
    });
    super({
      glProgram: e,
      gpuProgram: r,
      resources: {
        batchSamplers: Mf(t)
      }
    });
  }
}
let oh = null;
const tc = class ec extends Qp {
  constructor() {
    super(...arguments), this.geometry = new ef(), this.shader = oh || (oh = new Tf(this.maxTextures)), this.name = ec.extension.name, this.vertexSize = 6;
  }
  /**
   * Packs the attributes of a DefaultBatchableMeshElement into the provided views.
   * @param element - The DefaultBatchableMeshElement to pack.
   * @param float32View - The Float32Array view to pack into.
   * @param uint32View - The Uint32Array view to pack into.
   * @param index - The starting index in the views.
   * @param textureId - The texture ID to use.
   */
  packAttributes(t, e, r, s, n) {
    const o = n << 16 | t.roundPixels & 65535, a = t.transform, h = a.a, c = a.b, l = a.c, f = a.d, p = a.tx, u = a.ty, { positions: d, uvs: m } = t, g = t.color, y = t.attributeOffset, v = y + t.attributeSize;
    for (let _ = y; _ < v; _++) {
      const w = _ * 2, x = d[w], A = d[w + 1];
      e[s++] = h * x + l * A + p, e[s++] = f * A + c * x + u, e[s++] = m[w], e[s++] = m[w + 1], r[s++] = g, r[s++] = o;
    }
  }
  /**
   * Packs the attributes of a DefaultBatchableQuadElement into the provided views.
   * @param element - The DefaultBatchableQuadElement to pack.
   * @param float32View - The Float32Array view to pack into.
   * @param uint32View - The Uint32Array view to pack into.
   * @param index - The starting index in the views.
   * @param textureId - The texture ID to use.
   */
  packQuadAttributes(t, e, r, s, n) {
    const o = t.texture, a = t.transform, h = a.a, c = a.b, l = a.c, f = a.d, p = a.tx, u = a.ty, d = t.bounds, m = d.maxX, g = d.minX, y = d.maxY, v = d.minY, _ = o.uvs, w = t.color, x = n << 16 | t.roundPixels & 65535;
    e[s + 0] = h * g + l * v + p, e[s + 1] = f * v + c * g + u, e[s + 2] = _.x0, e[s + 3] = _.y0, r[s + 4] = w, r[s + 5] = x, e[s + 6] = h * m + l * v + p, e[s + 7] = f * v + c * m + u, e[s + 8] = _.x1, e[s + 9] = _.y1, r[s + 10] = w, r[s + 11] = x, e[s + 12] = h * m + l * y + p, e[s + 13] = f * y + c * m + u, e[s + 14] = _.x2, e[s + 15] = _.y2, r[s + 16] = w, r[s + 17] = x, e[s + 18] = h * g + l * y + p, e[s + 19] = f * y + c * g + u, e[s + 20] = _.x3, e[s + 21] = _.y3, r[s + 22] = w, r[s + 23] = x;
  }
};
tc.extension = {
  type: [
    D.Batcher
  ],
  name: "default"
};
let Ef = tc;
function Bf(i, t, e, r, s, n, o, a = null) {
  let h = 0;
  e *= t, s *= n;
  const c = a.a, l = a.b, f = a.c, p = a.d, u = a.tx, d = a.ty;
  for (; h < o; ) {
    const m = i[e], g = i[e + 1];
    r[s] = c * m + f * g + u, r[s + 1] = l * m + p * g + d, s += n, e += t, h++;
  }
}
function Rf(i, t, e, r) {
  let s = 0;
  for (t *= e; s < r; )
    i[t] = 0, i[t + 1] = 0, t += e, s++;
}
function ic(i, t, e, r, s) {
  const n = t.a, o = t.b, a = t.c, h = t.d, c = t.tx, l = t.ty;
  e = e || 0, r = r || 2, s = s || i.length / r - e;
  let f = e * r;
  for (let p = 0; p < s; p++) {
    const u = i[f], d = i[f + 1];
    i[f] = n * u + a * d + c, i[f + 1] = o * u + h * d + l, f += r;
  }
}
function If(i, t) {
  if (i === 16777215 || !t)
    return t;
  if (t === 16777215 || !i)
    return i;
  const e = i >> 16 & 255, r = i >> 8 & 255, s = i & 255, n = t >> 16 & 255, o = t >> 8 & 255, a = t & 255, h = e * n / 255, c = r * o / 255, l = s * a / 255;
  return (h << 16) + (c << 8) + l;
}
const Of = new K();
class rc {
  constructor() {
    this.packAsQuad = !1, this.batcherName = "default", this.applyTransform = !0, this.roundPixels = 0, this._batcher = null, this._batch = null;
  }
  get uvs() {
    return this.geometryData.uvs;
  }
  get positions() {
    return this.geometryData.vertices;
  }
  get indices() {
    return this.geometryData.indices;
  }
  get blendMode() {
    return this.applyTransform ? this.renderable.groupBlendMode : "normal";
  }
  get color() {
    const t = this.baseColor, e = t >> 16 | t & 65280 | (t & 255) << 16, r = this.renderable;
    return r ? If(e, r.groupColor) + (this.alpha * r.groupAlpha * 255 << 24) : e + (this.alpha * 255 << 24);
  }
  get transform() {
    var t;
    return ((t = this.renderable) == null ? void 0 : t.groupTransform) || Of;
  }
  copyTo(t) {
    t.indexOffset = this.indexOffset, t.indexSize = this.indexSize, t.attributeOffset = this.attributeOffset, t.attributeSize = this.attributeSize, t.baseColor = this.baseColor, t.alpha = this.alpha, t.texture = this.texture, t.geometryData = this.geometryData;
  }
  reset() {
    this.applyTransform = !0, this.renderable = null;
  }
}
const Cr = {
  extension: {
    type: D.ShapeBuilder,
    name: "circle"
  },
  build(i, t) {
    let e, r, s, n, o, a;
    if (i.type === "circle") {
      const w = i;
      e = w.x, r = w.y, o = a = w.radius, s = n = 0;
    } else if (i.type === "ellipse") {
      const w = i;
      e = w.x, r = w.y, o = w.halfWidth, a = w.halfHeight, s = n = 0;
    } else {
      const w = i, x = w.width / 2, A = w.height / 2;
      e = w.x + x, r = w.y + A, o = a = Math.max(0, Math.min(w.radius, Math.min(x, A))), s = x - o, n = A - a;
    }
    if (!(o >= 0 && a >= 0 && s >= 0 && n >= 0))
      return t;
    const h = Math.ceil(2.3 * Math.sqrt(o + a)), c = h * 8 + (s ? 4 : 0) + (n ? 4 : 0);
    if (c === 0)
      return t;
    if (h === 0)
      return t[0] = t[6] = e + s, t[1] = t[3] = r + n, t[2] = t[4] = e - s, t[5] = t[7] = r - n, t;
    let l = 0, f = h * 4 + (s ? 2 : 0) + 2, p = f, u = c, d = s + o, m = n, g = e + d, y = e - d, v = r + m;
    if (t[l++] = g, t[l++] = v, t[--f] = v, t[--f] = y, n) {
      const w = r - m;
      t[p++] = y, t[p++] = w, t[--u] = w, t[--u] = g;
    }
    for (let w = 1; w < h; w++) {
      const x = Math.PI / 2 * (w / h), A = s + Math.cos(x) * o, S = n + Math.sin(x) * a, b = e + A, C = e - A, P = r + S, k = r - S;
      t[l++] = b, t[l++] = P, t[--f] = P, t[--f] = C, t[p++] = C, t[p++] = k, t[--u] = k, t[--u] = b;
    }
    d = s, m = n + a, g = e + d, y = e - d, v = r + m;
    const _ = r - m;
    return t[l++] = g, t[l++] = v, t[--u] = _, t[--u] = g, s && (t[l++] = y, t[l++] = v, t[--u] = _, t[--u] = y), t;
  },
  triangulate(i, t, e, r, s, n) {
    if (i.length === 0)
      return;
    let o = 0, a = 0;
    for (let l = 0; l < i.length; l += 2)
      o += i[l], a += i[l + 1];
    o /= i.length / 2, a /= i.length / 2;
    let h = r;
    t[h * e] = o, t[h * e + 1] = a;
    const c = h++;
    for (let l = 0; l < i.length; l += 2)
      t[h * e] = i[l], t[h * e + 1] = i[l + 1], l > 0 && (s[n++] = h, s[n++] = c, s[n++] = h - 1), h++;
    s[n++] = c + 1, s[n++] = c, s[n++] = h - 1;
  }
}, Ff = { ...Cr, extension: { ...Cr.extension, name: "ellipse" } }, Lf = { ...Cr, extension: { ...Cr.extension, name: "roundedRectangle" } }, zf = 1e-4, ah = 1e-4;
function Df(i) {
  const t = i.length;
  if (t < 6)
    return 1;
  let e = 0;
  for (let r = 0, s = i[t - 2], n = i[t - 1]; r < t; r += 2) {
    const o = i[r], a = i[r + 1];
    e += (o - s) * (a + n), s = o, n = a;
  }
  return e < 0 ? -1 : 1;
}
function hh(i, t, e, r, s, n, o, a) {
  const h = i - e * s, c = t - r * s, l = i + e * n, f = t + r * n;
  let p, u;
  o ? (p = r, u = -e) : (p = -r, u = e);
  const d = h + p, m = c + u, g = l + p, y = f + u;
  return a.push(d, m), a.push(g, y), 2;
}
function qe(i, t, e, r, s, n, o, a) {
  const h = e - i, c = r - t;
  let l = Math.atan2(h, c), f = Math.atan2(s - i, n - t);
  a && l < f ? l += Math.PI * 2 : !a && l > f && (f += Math.PI * 2);
  let p = l;
  const u = f - l, d = Math.abs(u), m = Math.sqrt(h * h + c * c), g = (15 * d * Math.sqrt(m) / Math.PI >> 0) + 1, y = u / g;
  if (p += y, a) {
    o.push(i, t), o.push(e, r);
    for (let v = 1, _ = p; v < g; v++, _ += y)
      o.push(i, t), o.push(
        i + Math.sin(_) * m,
        t + Math.cos(_) * m
      );
    o.push(i, t), o.push(s, n);
  } else {
    o.push(e, r), o.push(i, t);
    for (let v = 1, _ = p; v < g; v++, _ += y)
      o.push(
        i + Math.sin(_) * m,
        t + Math.cos(_) * m
      ), o.push(i, t);
    o.push(s, n), o.push(i, t);
  }
  return g * 2;
}
function Uf(i, t, e, r, s, n, o, a, h) {
  const c = zf;
  if (i.length === 0)
    return;
  const l = t;
  let f = l.alignment;
  if (t.alignment !== 0.5) {
    let G = Df(i);
    f = (f - 0.5) * G + 0.5;
  }
  const p = new kt(i[0], i[1]), u = new kt(i[i.length - 2], i[i.length - 1]), d = r, m = Math.abs(p.x - u.x) < c && Math.abs(p.y - u.y) < c;
  if (d) {
    i = i.slice(), m && (i.pop(), i.pop(), u.set(i[i.length - 2], i[i.length - 1]));
    const G = (p.x + u.x) * 0.5, Y = (u.y + p.y) * 0.5;
    i.unshift(G, Y), i.push(G, Y);
  }
  const g = s, y = i.length / 2;
  let v = i.length;
  const _ = g.length / 2, w = l.width / 2, x = w * w, A = l.miterLimit * l.miterLimit;
  let S = i[0], b = i[1], C = i[2], P = i[3], k = 0, M = 0, T = -(b - P), E = S - C, B = 0, R = 0, I = Math.sqrt(T * T + E * E);
  T /= I, E /= I, T *= w, E *= w;
  const U = f, O = (1 - U) * 2, F = U * 2;
  d || (l.cap === "round" ? v += qe(
    S - T * (O - F) * 0.5,
    b - E * (O - F) * 0.5,
    S - T * O,
    b - E * O,
    S + T * F,
    b + E * F,
    g,
    !0
  ) + 2 : l.cap === "square" && (v += hh(S, b, T, E, O, F, !0, g))), g.push(
    S - T * O,
    b - E * O
  ), g.push(
    S + T * F,
    b + E * F
  );
  for (let G = 1; G < y - 1; ++G) {
    S = i[(G - 1) * 2], b = i[(G - 1) * 2 + 1], C = i[G * 2], P = i[G * 2 + 1], k = i[(G + 1) * 2], M = i[(G + 1) * 2 + 1], T = -(b - P), E = S - C, I = Math.sqrt(T * T + E * E), T /= I, E /= I, T *= w, E *= w, B = -(P - M), R = C - k, I = Math.sqrt(B * B + R * R), B /= I, R /= I, B *= w, R *= w;
    const Y = C - S, ht = b - P, St = C - k, j = M - P, Ft = Y * St + ht * j, ct = ht * St - j * Y, ne = ct < 0;
    if (Math.abs(ct) < 1e-3 * Math.abs(Ft)) {
      g.push(
        C - T * O,
        P - E * O
      ), g.push(
        C + T * F,
        P + E * F
      ), Ft >= 0 && (l.join === "round" ? v += qe(
        C,
        P,
        C - T * O,
        P - E * O,
        C - B * O,
        P - R * O,
        g,
        !1
      ) + 4 : v += 2, g.push(
        C - B * F,
        P - R * F
      ), g.push(
        C + B * O,
        P + R * O
      ));
      continue;
    }
    const Ht = (-T + S) * (-E + P) - (-T + C) * (-E + b), jt = (-B + k) * (-R + P) - (-B + C) * (-R + M), yt = (Y * jt - St * Ht) / ct, xi = (j * Ht - ht * jt) / ct, Qi = (yt - C) * (yt - C) + (xi - P) * (xi - P), Se = C + (yt - C) * O, de = P + (xi - P) * O, pe = C - (yt - C) * F, se = P - (xi - P) * F, oe = Math.min(Y * Y + ht * ht, St * St + j * j), Ji = ne ? O : F, Zi = oe + Ji * Ji * x;
    Qi <= Zi ? l.join === "bevel" || Qi / x > A ? (ne ? (g.push(Se, de), g.push(C + T * F, P + E * F), g.push(Se, de), g.push(C + B * F, P + R * F)) : (g.push(C - T * O, P - E * O), g.push(pe, se), g.push(C - B * O, P - R * O), g.push(pe, se)), v += 2) : l.join === "round" ? ne ? (g.push(Se, de), g.push(C + T * F, P + E * F), v += qe(
      C,
      P,
      C + T * F,
      P + E * F,
      C + B * F,
      P + R * F,
      g,
      !0
    ) + 4, g.push(Se, de), g.push(C + B * F, P + R * F)) : (g.push(C - T * O, P - E * O), g.push(pe, se), v += qe(
      C,
      P,
      C - T * O,
      P - E * O,
      C - B * O,
      P - R * O,
      g,
      !1
    ) + 4, g.push(C - B * O, P - R * O), g.push(pe, se)) : (g.push(Se, de), g.push(pe, se)) : (g.push(C - T * O, P - E * O), g.push(C + T * F, P + E * F), l.join === "round" ? ne ? v += qe(
      C,
      P,
      C + T * F,
      P + E * F,
      C + B * F,
      P + R * F,
      g,
      !0
    ) + 2 : v += qe(
      C,
      P,
      C - T * O,
      P - E * O,
      C - B * O,
      P - R * O,
      g,
      !1
    ) + 2 : l.join === "miter" && Qi / x <= A && (ne ? (g.push(pe, se), g.push(pe, se)) : (g.push(Se, de), g.push(Se, de)), v += 2), g.push(C - B * O, P - R * O), g.push(C + B * F, P + R * F), v += 2);
  }
  S = i[(y - 2) * 2], b = i[(y - 2) * 2 + 1], C = i[(y - 1) * 2], P = i[(y - 1) * 2 + 1], T = -(b - P), E = S - C, I = Math.sqrt(T * T + E * E), T /= I, E /= I, T *= w, E *= w, g.push(C - T * O, P - E * O), g.push(C + T * F, P + E * F), d || (l.cap === "round" ? v += qe(
    C - T * (O - F) * 0.5,
    P - E * (O - F) * 0.5,
    C - T * O,
    P - E * O,
    C + T * F,
    P + E * F,
    g,
    !1
  ) + 2 : l.cap === "square" && (v += hh(C, P, T, E, O, F, !1, g)));
  const J = ah * ah;
  for (let G = _; G < v + _ - 2; ++G)
    S = g[G * 2], b = g[G * 2 + 1], C = g[(G + 1) * 2], P = g[(G + 1) * 2 + 1], k = g[(G + 2) * 2], M = g[(G + 2) * 2 + 1], !(Math.abs(S * (P - M) + C * (M - b) + k * (b - P)) < J) && a.push(G, G + 1, G + 2);
}
function nc(i, t, e, r, s, n, o) {
  const a = Pp(i, t, 2);
  if (!a)
    return;
  for (let c = 0; c < a.length; c += 3)
    n[o++] = a[c] + s, n[o++] = a[c + 1] + s, n[o++] = a[c + 2] + s;
  let h = s * r;
  for (let c = 0; c < i.length; c += 2)
    e[h] = i[c], e[h + 1] = i[c + 1], h += r;
}
const Gf = [], Vf = {
  extension: {
    type: D.ShapeBuilder,
    name: "polygon"
  },
  build(i, t) {
    for (let e = 0; e < i.points.length; e++)
      t[e] = i.points[e];
    return t;
  },
  triangulate(i, t, e, r, s, n) {
    nc(i, Gf, t, e, r, s, n);
  }
}, Hf = {
  extension: {
    type: D.ShapeBuilder,
    name: "rectangle"
  },
  build(i, t) {
    const e = i, r = e.x, s = e.y, n = e.width, o = e.height;
    return n >= 0 && o >= 0 && (t[0] = r, t[1] = s, t[2] = r + n, t[3] = s, t[4] = r + n, t[5] = s + o, t[6] = r, t[7] = s + o), t;
  },
  triangulate(i, t, e, r, s, n) {
    let o = 0;
    r *= e, t[r + o] = i[0], t[r + o + 1] = i[1], o += e, t[r + o] = i[2], t[r + o + 1] = i[3], o += e, t[r + o] = i[6], t[r + o + 1] = i[7], o += e, t[r + o] = i[4], t[r + o + 1] = i[5], o += e;
    const a = r / e;
    s[n++] = a, s[n++] = a + 1, s[n++] = a + 2, s[n++] = a + 1, s[n++] = a + 3, s[n++] = a + 2;
  }
}, jf = {
  extension: {
    type: D.ShapeBuilder,
    name: "triangle"
  },
  build(i, t) {
    return t[0] = i.x, t[1] = i.y, t[2] = i.x2, t[3] = i.y2, t[4] = i.x3, t[5] = i.y3, t;
  },
  triangulate(i, t, e, r, s, n) {
    let o = 0;
    r *= e, t[r + o] = i[0], t[r + o + 1] = i[1], o += e, t[r + o] = i[2], t[r + o + 1] = i[3], o += e, t[r + o] = i[4], t[r + o + 1] = i[5];
    const a = r / e;
    s[n++] = a, s[n++] = a + 1, s[n++] = a + 2;
  }
}, Rn = {};
Mt.handleByMap(D.ShapeBuilder, Rn);
Mt.add(Hf, Vf, jf, Cr, Ff, Lf);
const Nf = new mt();
function Wf(i, t) {
  const { geometryData: e, batches: r } = t;
  r.length = 0, e.indices.length = 0, e.vertices.length = 0, e.uvs.length = 0;
  for (let s = 0; s < i.instructions.length; s++) {
    const n = i.instructions[s];
    if (n.action === "texture")
      Yf(n.data, r, e);
    else if (n.action === "fill" || n.action === "stroke") {
      const o = n.action === "stroke", a = n.data.path.shapePath, h = n.data.style, c = n.data.hole;
      o && c && lh(c.shapePath, h, null, !0, r, e), lh(a, h, c, o, r, e);
    }
  }
}
function Yf(i, t, e) {
  const { vertices: r, uvs: s, indices: n } = e, o = n.length, a = r.length / 2, h = [], c = Rn.rectangle, l = Nf, f = i.image;
  l.x = i.dx, l.y = i.dy, l.width = i.dw, l.height = i.dh;
  const p = i.transform;
  c.build(l, h), p && ic(h, p), c.triangulate(h, r, 2, a, n, o);
  const u = f.uvs;
  s.push(
    u.x0,
    u.y0,
    u.x1,
    u.y1,
    u.x3,
    u.y3,
    u.x2,
    u.y2
  );
  const d = Ee.get(rc);
  d.indexOffset = o, d.indexSize = n.length - o, d.attributeOffset = a, d.attributeSize = r.length / 2 - a, d.baseColor = i.style, d.alpha = i.alpha, d.texture = f, d.geometryData = e, t.push(d);
}
function lh(i, t, e, r, s, n) {
  const { vertices: o, uvs: a, indices: h } = n, c = i.shapePrimitives.length - 1;
  i.shapePrimitives.forEach(({ shape: l, transform: f }, p) => {
    const u = h.length, d = o.length / 2, m = [], g = Rn[l.type];
    if (g.build(l, m), f && ic(m, f), r) {
      const w = l.closePath ?? !0;
      Uf(m, t, !1, w, o, 2, d, h);
    } else if (e && c === p) {
      c !== 0 && console.warn("[Pixi Graphics] only the last shape have be cut out");
      const w = [], x = m.slice();
      Xf(e.shapePath).forEach((A) => {
        w.push(x.length / 2), x.push(...A);
      }), nc(x, w, o, 2, d, h, u);
    } else
      g.triangulate(m, o, 2, d, h, u);
    const y = a.length / 2, v = t.texture;
    if (v !== H.WHITE) {
      const w = t.matrix;
      w && (f && w.append(f.clone().invert()), Bf(o, 2, d, a, y, 2, o.length / 2 - d, w));
    } else
      Rf(a, y, 2, o.length / 2 - d);
    const _ = Ee.get(rc);
    _.indexOffset = u, _.indexSize = h.length - u, _.attributeOffset = d, _.attributeSize = o.length / 2 - d, _.baseColor = t.color, _.alpha = t.alpha, _.texture = v, _.geometryData = n, s.push(_);
  });
}
function Xf(i) {
  if (!i)
    return [];
  const t = i.shapePrimitives, e = [];
  for (let r = 0; r < t.length; r++) {
    const s = t[r].shape, n = [];
    Rn[s.type].build(s, n), e.push(n);
  }
  return e;
}
class qf {
  constructor() {
    this.batches = [], this.geometryData = {
      vertices: [],
      uvs: [],
      indices: []
    };
  }
}
class Kf {
  constructor() {
    this.batcher = new Ef(), this.instructions = new ul();
  }
  init() {
    this.instructions.reset();
  }
  /**
   * @deprecated since version 8.0.0
   * Use `batcher.geometry` instead.
   * @see {Batcher#geometry}
   */
  get geometry() {
    return X(td, "GraphicsContextRenderData#geometry is deprecated, please use batcher.geometry instead."), this.batcher.geometry;
  }
}
const Ro = class $s {
  constructor(t) {
    this._gpuContextHash = {}, this._graphicsDataContextHash = /* @__PURE__ */ Object.create(null), t.renderableGC.addManagedHash(this, "_gpuContextHash"), t.renderableGC.addManagedHash(this, "_graphicsDataContextHash");
  }
  /**
   * Runner init called, update the default options
   * @ignore
   */
  init(t) {
    $s.defaultOptions.bezierSmoothness = (t == null ? void 0 : t.bezierSmoothness) ?? $s.defaultOptions.bezierSmoothness;
  }
  getContextRenderData(t) {
    return this._graphicsDataContextHash[t.uid] || this._initContextRenderData(t);
  }
  // Context management functions
  updateGpuContext(t) {
    let e = this._gpuContextHash[t.uid] || this._initContext(t);
    if (t.dirty) {
      e ? this._cleanGraphicsContextData(t) : e = this._initContext(t), Wf(t, e);
      const r = t.batchMode;
      t.customShader || r === "no-batch" ? e.isBatchable = !1 : r === "auto" && (e.isBatchable = e.geometryData.vertices.length < 400), t.dirty = !1;
    }
    return e;
  }
  getGpuContext(t) {
    return this._gpuContextHash[t.uid] || this._initContext(t);
  }
  _initContextRenderData(t) {
    const e = Ee.get(Kf), { batches: r, geometryData: s } = this._gpuContextHash[t.uid], n = s.vertices.length, o = s.indices.length;
    for (let l = 0; l < r.length; l++)
      r[l].applyTransform = !1;
    const a = e.batcher;
    a.ensureAttributeBuffer(n), a.ensureIndexBuffer(o), a.begin();
    for (let l = 0; l < r.length; l++) {
      const f = r[l];
      a.add(f);
    }
    a.finish(e.instructions);
    const h = a.geometry;
    h.indexBuffer.setDataWithSize(a.indexBuffer, a.indexSize, !0), h.buffers[0].setDataWithSize(a.attributeBuffer.float32View, a.attributeSize, !0);
    const c = a.batches;
    for (let l = 0; l < c.length; l++) {
      const f = c[l];
      f.bindGroup = Np(f.textures.textures, f.textures.count);
    }
    return this._graphicsDataContextHash[t.uid] = e, e;
  }
  _initContext(t) {
    const e = new qf();
    return e.context = t, this._gpuContextHash[t.uid] = e, t.on("destroy", this.onGraphicsContextDestroy, this), this._gpuContextHash[t.uid];
  }
  onGraphicsContextDestroy(t) {
    this._cleanGraphicsContextData(t), t.off("destroy", this.onGraphicsContextDestroy, this), this._gpuContextHash[t.uid] = null;
  }
  _cleanGraphicsContextData(t) {
    const e = this._gpuContextHash[t.uid];
    e.isBatchable || this._graphicsDataContextHash[t.uid] && (Ee.return(this.getContextRenderData(t)), this._graphicsDataContextHash[t.uid] = null), e.batches && e.batches.forEach((r) => {
      Ee.return(r);
    });
  }
  destroy() {
    for (const t in this._gpuContextHash)
      this._gpuContextHash[t] && this.onGraphicsContextDestroy(this._gpuContextHash[t].context);
  }
};
Ro.extension = {
  type: [
    D.WebGLSystem,
    D.WebGPUSystem,
    D.CanvasSystem
  ],
  name: "graphicsContext"
};
Ro.defaultOptions = {
  /**
   * A value from 0 to 1 that controls the smoothness of bezier curves (the higher the smoother)
   * @default 0.5
   */
  bezierSmoothness: 0.5
};
let sc = Ro;
const Qf = 8, Qr = 11920929e-14, Jf = 1;
function oc(i, t, e, r, s, n, o, a, h, c) {
  const l = Math.min(
    0.99,
    // a value of 1.0 actually inverts smoothing, so we cap it at 0.99
    Math.max(0, c ?? sc.defaultOptions.bezierSmoothness)
  );
  let f = (Jf - l) / 1;
  return f *= f, Zf(t, e, r, s, n, o, a, h, i, f), i;
}
function Zf(i, t, e, r, s, n, o, a, h, c) {
  to(i, t, e, r, s, n, o, a, h, c, 0), h.push(o, a);
}
function to(i, t, e, r, s, n, o, a, h, c, l) {
  if (l > Qf)
    return;
  const f = (i + e) / 2, p = (t + r) / 2, u = (e + s) / 2, d = (r + n) / 2, m = (s + o) / 2, g = (n + a) / 2, y = (f + u) / 2, v = (p + d) / 2, _ = (u + m) / 2, w = (d + g) / 2, x = (y + _) / 2, A = (v + w) / 2;
  if (l > 0) {
    let S = o - i, b = a - t;
    const C = Math.abs((e - o) * b - (r - a) * S), P = Math.abs((s - o) * b - (n - a) * S);
    if (C > Qr && P > Qr) {
      if ((C + P) * (C + P) <= c * (S * S + b * b)) {
        h.push(x, A);
        return;
      }
    } else if (C > Qr) {
      if (C * C <= c * (S * S + b * b)) {
        h.push(x, A);
        return;
      }
    } else if (P > Qr) {
      if (P * P <= c * (S * S + b * b)) {
        h.push(x, A);
        return;
      }
    } else if (S = x - (i + o) / 2, b = A - (t + a) / 2, S * S + b * b <= c) {
      h.push(x, A);
      return;
    }
  }
  to(i, t, f, p, y, v, x, A, h, c, l + 1), to(x, A, _, w, m, g, o, a, h, c, l + 1);
}
const $f = 8, tm = 11920929e-14, em = 1;
function im(i, t, e, r, s, n, o, a) {
  const h = Math.min(
    0.99,
    // a value of 1.0 actually inverts smoothing, so we cap it at 0.99
    Math.max(0, a ?? sc.defaultOptions.bezierSmoothness)
  );
  let c = (em - h) / 1;
  return c *= c, rm(t, e, r, s, n, o, i, c), i;
}
function rm(i, t, e, r, s, n, o, a) {
  eo(o, i, t, e, r, s, n, a, 0), o.push(s, n);
}
function eo(i, t, e, r, s, n, o, a, h) {
  if (h > $f)
    return;
  const c = (t + r) / 2, l = (e + s) / 2, f = (r + n) / 2, p = (s + o) / 2, u = (c + f) / 2, d = (l + p) / 2;
  let m = n - t, g = o - e;
  const y = Math.abs((r - n) * g - (s - o) * m);
  if (y > tm) {
    if (y * y <= a * (m * m + g * g)) {
      i.push(u, d);
      return;
    }
  } else if (m = u - (t + n) / 2, g = d - (e + o) / 2, m * m + g * g <= a) {
    i.push(u, d);
    return;
  }
  eo(i, t, e, c, l, u, d, a, h + 1), eo(i, u, d, f, p, n, o, a, h + 1);
}
function ac(i, t, e, r, s, n, o, a) {
  let h = Math.abs(s - n);
  (!o && s > n || o && n > s) && (h = 2 * Math.PI - h), a = a || Math.max(6, Math.floor(6 * Math.pow(r, 1 / 3) * (h / Math.PI))), a = Math.max(a, 3);
  let c = h / a, l = s;
  c *= o ? -1 : 1;
  for (let f = 0; f < a + 1; f++) {
    const p = Math.cos(l), u = Math.sin(l), d = t + p * r, m = e + u * r;
    i.push(d, m), l += c;
  }
}
function nm(i, t, e, r, s, n) {
  const o = i[i.length - 2], a = i[i.length - 1] - e, h = o - t, c = s - e, l = r - t, f = Math.abs(a * l - h * c);
  if (f < 1e-8 || n === 0) {
    (i[i.length - 2] !== t || i[i.length - 1] !== e) && i.push(t, e);
    return;
  }
  const p = a * a + h * h, u = c * c + l * l, d = a * c + h * l, m = n * Math.sqrt(p) / f, g = n * Math.sqrt(u) / f, y = m * d / p, v = g * d / u, _ = m * l + g * h, w = m * c + g * a, x = h * (g + y), A = a * (g + y), S = l * (m + v), b = c * (m + v), C = Math.atan2(A - w, x - _), P = Math.atan2(b - w, S - _);
  ac(
    i,
    _ + t,
    w + e,
    n,
    C,
    P,
    h * c > l * a
  );
}
const mr = Math.PI * 2, _s = {
  centerX: 0,
  centerY: 0,
  ang1: 0,
  ang2: 0
}, ws = ({ x: i, y: t }, e, r, s, n, o, a, h) => {
  i *= e, t *= r;
  const c = s * i - n * t, l = n * i + s * t;
  return h.x = c + o, h.y = l + a, h;
};
function sm(i, t) {
  const e = t === -1.5707963267948966 ? -0.551915024494 : 1.3333333333333333 * Math.tan(t / 4), r = t === 1.5707963267948966 ? 0.551915024494 : e, s = Math.cos(i), n = Math.sin(i), o = Math.cos(i + t), a = Math.sin(i + t);
  return [
    {
      x: s - n * r,
      y: n + s * r
    },
    {
      x: o + a * r,
      y: a - o * r
    },
    {
      x: o,
      y: a
    }
  ];
}
const ch = (i, t, e, r) => {
  const s = i * r - t * e < 0 ? -1 : 1;
  let n = i * e + t * r;
  return n > 1 && (n = 1), n < -1 && (n = -1), s * Math.acos(n);
}, om = (i, t, e, r, s, n, o, a, h, c, l, f, p) => {
  const u = Math.pow(s, 2), d = Math.pow(n, 2), m = Math.pow(l, 2), g = Math.pow(f, 2);
  let y = u * d - u * g - d * m;
  y < 0 && (y = 0), y /= u * g + d * m, y = Math.sqrt(y) * (o === a ? -1 : 1);
  const v = y * s / n * f, _ = y * -n / s * l, w = c * v - h * _ + (i + e) / 2, x = h * v + c * _ + (t + r) / 2, A = (l - v) / s, S = (f - _) / n, b = (-l - v) / s, C = (-f - _) / n, P = ch(1, 0, A, S);
  let k = ch(A, S, b, C);
  a === 0 && k > 0 && (k -= mr), a === 1 && k < 0 && (k += mr), p.centerX = w, p.centerY = x, p.ang1 = P, p.ang2 = k;
};
function am(i, t, e, r, s, n, o, a = 0, h = 0, c = 0) {
  if (n === 0 || o === 0)
    return;
  const l = Math.sin(a * mr / 360), f = Math.cos(a * mr / 360), p = f * (t - r) / 2 + l * (e - s) / 2, u = -l * (t - r) / 2 + f * (e - s) / 2;
  if (p === 0 && u === 0)
    return;
  n = Math.abs(n), o = Math.abs(o);
  const d = Math.pow(p, 2) / Math.pow(n, 2) + Math.pow(u, 2) / Math.pow(o, 2);
  d > 1 && (n *= Math.sqrt(d), o *= Math.sqrt(d)), om(
    t,
    e,
    r,
    s,
    n,
    o,
    h,
    c,
    l,
    f,
    p,
    u,
    _s
  );
  let { ang1: m, ang2: g } = _s;
  const { centerX: y, centerY: v } = _s;
  let _ = Math.abs(g) / (mr / 4);
  Math.abs(1 - _) < 1e-7 && (_ = 1);
  const w = Math.max(Math.ceil(_), 1);
  g /= w;
  let x = i[i.length - 2], A = i[i.length - 1];
  const S = { x: 0, y: 0 };
  for (let b = 0; b < w; b++) {
    const C = sm(m, g), { x: P, y: k } = ws(C[0], n, o, f, l, y, v, S), { x: M, y: T } = ws(C[1], n, o, f, l, y, v, S), { x: E, y: B } = ws(C[2], n, o, f, l, y, v, S);
    oc(
      i,
      x,
      A,
      P,
      k,
      M,
      T,
      E,
      B
    ), x = E, A = B, m += g;
  }
}
function hm(i, t, e) {
  const r = (o, a) => {
    const h = a.x - o.x, c = a.y - o.y, l = Math.sqrt(h * h + c * c), f = h / l, p = c / l;
    return { len: l, nx: f, ny: p };
  }, s = (o, a) => {
    o === 0 ? i.moveTo(a.x, a.y) : i.lineTo(a.x, a.y);
  };
  let n = t[t.length - 1];
  for (let o = 0; o < t.length; o++) {
    const a = t[o % t.length], h = a.radius ?? e;
    if (h <= 0) {
      s(o, a), n = a;
      continue;
    }
    const c = t[(o + 1) % t.length], l = r(a, n), f = r(a, c);
    if (l.len < 1e-4 || f.len < 1e-4) {
      s(o, a), n = a;
      continue;
    }
    let p = Math.asin(l.nx * f.ny - l.ny * f.nx), u = 1, d = !1;
    l.nx * f.nx - l.ny * -f.ny < 0 ? p < 0 ? p = Math.PI + p : (p = Math.PI - p, u = -1, d = !0) : p > 0 && (u = -1, d = !0);
    const m = p / 2;
    let g, y = Math.abs(
      Math.cos(m) * h / Math.sin(m)
    );
    y > Math.min(l.len / 2, f.len / 2) ? (y = Math.min(l.len / 2, f.len / 2), g = Math.abs(y * Math.sin(m) / Math.cos(m))) : g = h;
    const v = a.x + f.nx * y + -f.ny * g * u, _ = a.y + f.ny * y + f.nx * g * u, w = Math.atan2(l.ny, l.nx) + Math.PI / 2 * u, x = Math.atan2(f.ny, f.nx) - Math.PI / 2 * u;
    o === 0 && i.moveTo(
      v + Math.cos(w) * g,
      _ + Math.sin(w) * g
    ), i.arc(v, _, g, w, x, d), n = a;
  }
}
function lm(i, t, e, r) {
  const s = (a, h) => Math.sqrt((a.x - h.x) ** 2 + (a.y - h.y) ** 2), n = (a, h, c) => ({
    x: a.x + (h.x - a.x) * c,
    y: a.y + (h.y - a.y) * c
  }), o = t.length;
  for (let a = 0; a < o; a++) {
    const h = t[(a + 1) % o], c = h.radius ?? e;
    if (c <= 0) {
      a === 0 ? i.moveTo(h.x, h.y) : i.lineTo(h.x, h.y);
      continue;
    }
    const l = t[a], f = t[(a + 2) % o], p = s(l, h);
    let u;
    if (p < 1e-4)
      u = h;
    else {
      const g = Math.min(p / 2, c);
      u = n(
        h,
        l,
        g / p
      );
    }
    const d = s(f, h);
    let m;
    if (d < 1e-4)
      m = h;
    else {
      const g = Math.min(d / 2, c);
      m = n(
        h,
        f,
        g / d
      );
    }
    a === 0 ? i.moveTo(u.x, u.y) : i.lineTo(u.x, u.y), i.quadraticCurveTo(h.x, h.y, m.x, m.y, r);
  }
}
const cm = new mt();
class um {
  constructor(t) {
    this.shapePrimitives = [], this._currentPoly = null, this._bounds = new _e(), this._graphicsPath2D = t;
  }
  /**
   * Sets the starting point for a new sub-path. Any subsequent drawing commands are considered part of this path.
   * @param x - The x-coordinate for the starting point.
   * @param y - The y-coordinate for the starting point.
   * @returns The instance of the current object for chaining.
   */
  moveTo(t, e) {
    return this.startPoly(t, e), this;
  }
  /**
   * Connects the current point to a new point with a straight line. This method updates the current path.
   * @param x - The x-coordinate of the new point to connect to.
   * @param y - The y-coordinate of the new point to connect to.
   * @returns The instance of the current object for chaining.
   */
  lineTo(t, e) {
    this._ensurePoly();
    const r = this._currentPoly.points, s = r[r.length - 2], n = r[r.length - 1];
    return (s !== t || n !== e) && r.push(t, e), this;
  }
  /**
   * Adds an arc to the path. The arc is centered at (x, y)
   *  position with radius `radius` starting at `startAngle` and ending at `endAngle`.
   * @param x - The x-coordinate of the arc's center.
   * @param y - The y-coordinate of the arc's center.
   * @param radius - The radius of the arc.
   * @param startAngle - The starting angle of the arc, in radians.
   * @param endAngle - The ending angle of the arc, in radians.
   * @param counterclockwise - Specifies whether the arc should be drawn in the anticlockwise direction. False by default.
   * @returns The instance of the current object for chaining.
   */
  arc(t, e, r, s, n, o) {
    this._ensurePoly(!1);
    const a = this._currentPoly.points;
    return ac(a, t, e, r, s, n, o), this;
  }
  /**
   * Adds an arc to the path with the arc tangent to the line joining two specified points.
   * The arc radius is specified by `radius`.
   * @param x1 - The x-coordinate of the first point.
   * @param y1 - The y-coordinate of the first point.
   * @param x2 - The x-coordinate of the second point.
   * @param y2 - The y-coordinate of the second point.
   * @param radius - The radius of the arc.
   * @returns The instance of the current object for chaining.
   */
  arcTo(t, e, r, s, n) {
    this._ensurePoly();
    const o = this._currentPoly.points;
    return nm(o, t, e, r, s, n), this;
  }
  /**
   * Adds an SVG-style arc to the path, allowing for elliptical arcs based on the SVG spec.
   * @param rx - The x-radius of the ellipse.
   * @param ry - The y-radius of the ellipse.
   * @param xAxisRotation - The rotation of the ellipse's x-axis relative
   * to the x-axis of the coordinate system, in degrees.
   * @param largeArcFlag - Determines if the arc should be greater than or less than 180 degrees.
   * @param sweepFlag - Determines if the arc should be swept in a positive angle direction.
   * @param x - The x-coordinate of the arc's end point.
   * @param y - The y-coordinate of the arc's end point.
   * @returns The instance of the current object for chaining.
   */
  arcToSvg(t, e, r, s, n, o, a) {
    const h = this._currentPoly.points;
    return am(
      h,
      this._currentPoly.lastX,
      this._currentPoly.lastY,
      o,
      a,
      t,
      e,
      r,
      s,
      n
    ), this;
  }
  /**
   * Adds a cubic Bezier curve to the path.
   * It requires three points: the first two are control points and the third one is the end point.
   * The starting point is the last point in the current path.
   * @param cp1x - The x-coordinate of the first control point.
   * @param cp1y - The y-coordinate of the first control point.
   * @param cp2x - The x-coordinate of the second control point.
   * @param cp2y - The y-coordinate of the second control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothness - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  bezierCurveTo(t, e, r, s, n, o, a) {
    this._ensurePoly();
    const h = this._currentPoly;
    return oc(
      this._currentPoly.points,
      h.lastX,
      h.lastY,
      t,
      e,
      r,
      s,
      n,
      o,
      a
    ), this;
  }
  /**
   * Adds a quadratic curve to the path. It requires two points: the control point and the end point.
   * The starting point is the last point in the current path.
   * @param cp1x - The x-coordinate of the control point.
   * @param cp1y - The y-coordinate of the control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothing - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  quadraticCurveTo(t, e, r, s, n) {
    this._ensurePoly();
    const o = this._currentPoly;
    return im(
      this._currentPoly.points,
      o.lastX,
      o.lastY,
      t,
      e,
      r,
      s,
      n
    ), this;
  }
  /**
   * Closes the current path by drawing a straight line back to the start.
   * If the shape is already closed or there are no points in the path, this method does nothing.
   * @returns The instance of the current object for chaining.
   */
  closePath() {
    return this.endPoly(!0), this;
  }
  /**
   * Adds another path to the current path. This method allows for the combination of multiple paths into one.
   * @param path - The `GraphicsPath` object representing the path to add.
   * @param transform - An optional `Matrix` object to apply a transformation to the path before adding it.
   * @returns The instance of the current object for chaining.
   */
  addPath(t, e) {
    this.endPoly(), e && !e.isIdentity() && (t = t.clone(!0), t.transform(e));
    for (let r = 0; r < t.instructions.length; r++) {
      const s = t.instructions[r];
      this[s.action](...s.data);
    }
    return this;
  }
  /**
   * Finalizes the drawing of the current path. Optionally, it can close the path.
   * @param closePath - A boolean indicating whether to close the path after finishing. False by default.
   */
  finish(t = !1) {
    this.endPoly(t);
  }
  /**
   * Draws a rectangle shape. This method adds a new rectangle path to the current drawing.
   * @param x - The x-coordinate of the top-left corner of the rectangle.
   * @param y - The y-coordinate of the top-left corner of the rectangle.
   * @param w - The width of the rectangle.
   * @param h - The height of the rectangle.
   * @param transform - An optional `Matrix` object to apply a transformation to the rectangle.
   * @returns The instance of the current object for chaining.
   */
  rect(t, e, r, s, n) {
    return this.drawShape(new mt(t, e, r, s), n), this;
  }
  /**
   * Draws a circle shape. This method adds a new circle path to the current drawing.
   * @param x - The x-coordinate of the center of the circle.
   * @param y - The y-coordinate of the center of the circle.
   * @param radius - The radius of the circle.
   * @param transform - An optional `Matrix` object to apply a transformation to the circle.
   * @returns The instance of the current object for chaining.
   */
  circle(t, e, r, s) {
    return this.drawShape(new En(t, e, r), s), this;
  }
  /**
   * Draws a polygon shape. This method allows for the creation of complex polygons by specifying a sequence of points.
   * @param points - An array of numbers, or or an array of PointData objects eg [{x,y}, {x,y}, {x,y}]
   * representing the x and y coordinates of the polygon's vertices, in sequence.
   * @param close - A boolean indicating whether to close the polygon path. True by default.
   * @param transform - An optional `Matrix` object to apply a transformation to the polygon.
   * @returns The instance of the current object for chaining.
   */
  poly(t, e, r) {
    const s = new Ti(t);
    return s.closePath = e, this.drawShape(s, r), this;
  }
  /**
   * Draws a regular polygon with a specified number of sides. All sides and angles are equal.
   * @param x - The x-coordinate of the center of the polygon.
   * @param y - The y-coordinate of the center of the polygon.
   * @param radius - The radius of the circumscribed circle of the polygon.
   * @param sides - The number of sides of the polygon. Must be 3 or more.
   * @param rotation - The rotation angle of the polygon, in radians. Zero by default.
   * @param transform - An optional `Matrix` object to apply a transformation to the polygon.
   * @returns The instance of the current object for chaining.
   */
  regularPoly(t, e, r, s, n = 0, o) {
    s = Math.max(s | 0, 3);
    const a = -1 * Math.PI / 2 + n, h = Math.PI * 2 / s, c = [];
    for (let l = 0; l < s; l++) {
      const f = l * h + a;
      c.push(
        t + r * Math.cos(f),
        e + r * Math.sin(f)
      );
    }
    return this.poly(c, !0, o), this;
  }
  /**
   * Draws a polygon with rounded corners.
   * Similar to `regularPoly` but with the ability to round the corners of the polygon.
   * @param x - The x-coordinate of the center of the polygon.
   * @param y - The y-coordinate of the center of the polygon.
   * @param radius - The radius of the circumscribed circle of the polygon.
   * @param sides - The number of sides of the polygon. Must be 3 or more.
   * @param corner - The radius of the rounding of the corners.
   * @param rotation - The rotation angle of the polygon, in radians. Zero by default.
   * @param smoothness - Optional parameter to adjust the smoothness of the rounding.
   * @returns The instance of the current object for chaining.
   */
  roundPoly(t, e, r, s, n, o = 0, a) {
    if (s = Math.max(s | 0, 3), n <= 0)
      return this.regularPoly(t, e, r, s, o);
    const h = r * Math.sin(Math.PI / s) - 1e-3;
    n = Math.min(n, h);
    const c = -1 * Math.PI / 2 + o, l = Math.PI * 2 / s, f = (s - 2) * Math.PI / s / 2;
    for (let p = 0; p < s; p++) {
      const u = p * l + c, d = t + r * Math.cos(u), m = e + r * Math.sin(u), g = u + Math.PI + f, y = u - Math.PI - f, v = d + n * Math.cos(g), _ = m + n * Math.sin(g), w = d + n * Math.cos(y), x = m + n * Math.sin(y);
      p === 0 ? this.moveTo(v, _) : this.lineTo(v, _), this.quadraticCurveTo(d, m, w, x, a);
    }
    return this.closePath();
  }
  /**
   * Draws a shape with rounded corners. This function supports custom radius for each corner of the shape.
   * Optionally, corners can be rounded using a quadratic curve instead of an arc, providing a different aesthetic.
   * @param points - An array of `RoundedPoint` representing the corners of the shape to draw.
   * A minimum of 3 points is required.
   * @param radius - The default radius for the corners.
   * This radius is applied to all corners unless overridden in `points`.
   * @param useQuadratic - If set to true, rounded corners are drawn using a quadraticCurve
   *  method instead of an arc method. Defaults to false.
   * @param smoothness - Specifies the smoothness of the curve when `useQuadratic` is true.
   * Higher values make the curve smoother.
   * @returns The instance of the current object for chaining.
   */
  roundShape(t, e, r = !1, s) {
    return t.length < 3 ? this : (r ? lm(this, t, e, s) : hm(this, t, e), this.closePath());
  }
  /**
   * Draw Rectangle with fillet corners. This is much like rounded rectangle
   * however it support negative numbers as well for the corner radius.
   * @param x - Upper left corner of rect
   * @param y - Upper right corner of rect
   * @param width - Width of rect
   * @param height - Height of rect
   * @param fillet - accept negative or positive values
   */
  filletRect(t, e, r, s, n) {
    if (n === 0)
      return this.rect(t, e, r, s);
    const o = Math.min(r, s) / 2, a = Math.min(o, Math.max(-o, n)), h = t + r, c = e + s, l = a < 0 ? -a : 0, f = Math.abs(a);
    return this.moveTo(t, e + f).arcTo(t + l, e + l, t + f, e, f).lineTo(h - f, e).arcTo(h - l, e + l, h, e + f, f).lineTo(h, c - f).arcTo(h - l, c - l, t + r - f, c, f).lineTo(t + f, c).arcTo(t + l, c - l, t, c - f, f).closePath();
  }
  /**
   * Draw Rectangle with chamfer corners. These are angled corners.
   * @param x - Upper left corner of rect
   * @param y - Upper right corner of rect
   * @param width - Width of rect
   * @param height - Height of rect
   * @param chamfer - non-zero real number, size of corner cutout
   * @param transform
   */
  chamferRect(t, e, r, s, n, o) {
    if (n <= 0)
      return this.rect(t, e, r, s);
    const a = Math.min(n, Math.min(r, s) / 2), h = t + r, c = e + s, l = [
      t + a,
      e,
      h - a,
      e,
      h,
      e + a,
      h,
      c - a,
      h - a,
      c,
      t + a,
      c,
      t,
      c - a,
      t,
      e + a
    ];
    for (let f = l.length - 1; f >= 2; f -= 2)
      l[f] === l[f - 2] && l[f - 1] === l[f - 3] && l.splice(f - 1, 2);
    return this.poly(l, !0, o);
  }
  /**
   * Draws an ellipse at the specified location and with the given x and y radii.
   * An optional transformation can be applied, allowing for rotation, scaling, and translation.
   * @param x - The x-coordinate of the center of the ellipse.
   * @param y - The y-coordinate of the center of the ellipse.
   * @param radiusX - The horizontal radius of the ellipse.
   * @param radiusY - The vertical radius of the ellipse.
   * @param transform - An optional `Matrix` object to apply a transformation to the ellipse. This can include rotations.
   * @returns The instance of the current object for chaining.
   */
  ellipse(t, e, r, s, n) {
    return this.drawShape(new Bo(t, e, r, s), n), this;
  }
  /**
   * Draws a rectangle with rounded corners.
   * The corner radius can be specified to determine how rounded the corners should be.
   * An optional transformation can be applied, which allows for rotation, scaling, and translation of the rectangle.
   * @param x - The x-coordinate of the top-left corner of the rectangle.
   * @param y - The y-coordinate of the top-left corner of the rectangle.
   * @param w - The width of the rectangle.
   * @param h - The height of the rectangle.
   * @param radius - The radius of the rectangle's corners. If not specified, corners will be sharp.
   * @param transform - An optional `Matrix` object to apply a transformation to the rectangle.
   * @returns The instance of the current object for chaining.
   */
  roundRect(t, e, r, s, n, o) {
    return this.drawShape(new Bn(t, e, r, s, n), o), this;
  }
  /**
   * Draws a given shape on the canvas.
   * This is a generic method that can draw any type of shape specified by the `ShapePrimitive` parameter.
   * An optional transformation matrix can be applied to the shape, allowing for complex transformations.
   * @param shape - The shape to draw, defined as a `ShapePrimitive` object.
   * @param matrix - An optional `Matrix` for transforming the shape. This can include rotations,
   * scaling, and translations.
   * @returns The instance of the current object for chaining.
   */
  drawShape(t, e) {
    return this.endPoly(), this.shapePrimitives.push({ shape: t, transform: e }), this;
  }
  /**
   * Starts a new polygon path from the specified starting point.
   * This method initializes a new polygon or ends the current one if it exists.
   * @param x - The x-coordinate of the starting point of the new polygon.
   * @param y - The y-coordinate of the starting point of the new polygon.
   * @returns The instance of the current object for chaining.
   */
  startPoly(t, e) {
    let r = this._currentPoly;
    return r && this.endPoly(), r = new Ti(), r.points.push(t, e), this._currentPoly = r, this;
  }
  /**
   * Ends the current polygon path. If `closePath` is set to true,
   * the path is closed by connecting the last point to the first one.
   * This method finalizes the current polygon and prepares it for drawing or adding to the shape primitives.
   * @param closePath - A boolean indicating whether to close the polygon by connecting the last point
   *  back to the starting point. False by default.
   * @returns The instance of the current object for chaining.
   */
  endPoly(t = !1) {
    const e = this._currentPoly;
    return e && e.points.length > 2 && (e.closePath = t, this.shapePrimitives.push({ shape: e })), this._currentPoly = null, this;
  }
  _ensurePoly(t = !0) {
    if (!this._currentPoly && (this._currentPoly = new Ti(), t)) {
      const e = this.shapePrimitives[this.shapePrimitives.length - 1];
      if (e) {
        let r = e.shape.x, s = e.shape.y;
        if (e.transform && !e.transform.isIdentity()) {
          const n = e.transform, o = r;
          r = n.a * r + n.c * s + n.tx, s = n.b * o + n.d * s + n.ty;
        }
        this._currentPoly.points.push(r, s);
      } else
        this._currentPoly.points.push(0, 0);
    }
  }
  /** Builds the path. */
  buildPath() {
    const t = this._graphicsPath2D;
    this.shapePrimitives.length = 0, this._currentPoly = null;
    for (let e = 0; e < t.instructions.length; e++) {
      const r = t.instructions[e];
      this[r.action](...r.data);
    }
    this.finish();
  }
  /** Gets the bounds of the path. */
  get bounds() {
    const t = this._bounds;
    t.clear();
    const e = this.shapePrimitives;
    for (let r = 0; r < e.length; r++) {
      const s = e[r], n = s.shape.getBounds(cm);
      s.transform ? t.addRect(n, s.transform) : t.addRect(n);
    }
    return t;
  }
}
class Di {
  /**
   * Creates a `GraphicsPath` instance optionally from an SVG path string or an array of `PathInstruction`.
   * @param instructions - An SVG path string or an array of `PathInstruction` objects.
   */
  constructor(t) {
    this.instructions = [], this.uid = vt("graphicsPath"), this._dirty = !0, typeof t == "string" ? Up(t, this) : this.instructions = (t == null ? void 0 : t.slice()) ?? [];
  }
  /**
   * Provides access to the internal shape path, ensuring it is up-to-date with the current instructions.
   * @returns The `ShapePath` instance associated with this `GraphicsPath`.
   */
  get shapePath() {
    return this._shapePath || (this._shapePath = new um(this)), this._dirty && (this._dirty = !1, this._shapePath.buildPath()), this._shapePath;
  }
  /**
   * Adds another `GraphicsPath` to this path, optionally applying a transformation.
   * @param path - The `GraphicsPath` to add.
   * @param transform - An optional transformation to apply to the added path.
   * @returns The instance of the current object for chaining.
   */
  addPath(t, e) {
    return t = t.clone(), this.instructions.push({ action: "addPath", data: [t, e] }), this._dirty = !0, this;
  }
  arc(...t) {
    return this.instructions.push({ action: "arc", data: t }), this._dirty = !0, this;
  }
  arcTo(...t) {
    return this.instructions.push({ action: "arcTo", data: t }), this._dirty = !0, this;
  }
  arcToSvg(...t) {
    return this.instructions.push({ action: "arcToSvg", data: t }), this._dirty = !0, this;
  }
  bezierCurveTo(...t) {
    return this.instructions.push({ action: "bezierCurveTo", data: t }), this._dirty = !0, this;
  }
  /**
   * Adds a cubic Bezier curve to the path.
   * It requires two points: the second control point and the end point. The first control point is assumed to be
   * The starting point is the last point in the current path.
   * @param cp2x - The x-coordinate of the second control point.
   * @param cp2y - The y-coordinate of the second control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothness - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  bezierCurveToShort(t, e, r, s, n) {
    const o = this.instructions[this.instructions.length - 1], a = this.getLastPoint(kt.shared);
    let h = 0, c = 0;
    if (!o || o.action !== "bezierCurveTo")
      h = a.x, c = a.y;
    else {
      h = o.data[2], c = o.data[3];
      const l = a.x, f = a.y;
      h = l + (l - h), c = f + (f - c);
    }
    return this.instructions.push({ action: "bezierCurveTo", data: [h, c, t, e, r, s, n] }), this._dirty = !0, this;
  }
  /**
   * Closes the current path by drawing a straight line back to the start.
   * If the shape is already closed or there are no points in the path, this method does nothing.
   * @returns The instance of the current object for chaining.
   */
  closePath() {
    return this.instructions.push({ action: "closePath", data: [] }), this._dirty = !0, this;
  }
  ellipse(...t) {
    return this.instructions.push({ action: "ellipse", data: t }), this._dirty = !0, this;
  }
  lineTo(...t) {
    return this.instructions.push({ action: "lineTo", data: t }), this._dirty = !0, this;
  }
  moveTo(...t) {
    return this.instructions.push({ action: "moveTo", data: t }), this;
  }
  quadraticCurveTo(...t) {
    return this.instructions.push({ action: "quadraticCurveTo", data: t }), this._dirty = !0, this;
  }
  /**
   * Adds a quadratic curve to the path. It uses the previous point as the control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothness - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  quadraticCurveToShort(t, e, r) {
    const s = this.instructions[this.instructions.length - 1], n = this.getLastPoint(kt.shared);
    let o = 0, a = 0;
    if (!s || s.action !== "quadraticCurveTo")
      o = n.x, a = n.y;
    else {
      o = s.data[0], a = s.data[1];
      const h = n.x, c = n.y;
      o = h + (h - o), a = c + (c - a);
    }
    return this.instructions.push({ action: "quadraticCurveTo", data: [o, a, t, e, r] }), this._dirty = !0, this;
  }
  /**
   * Draws a rectangle shape. This method adds a new rectangle path to the current drawing.
   * @param x - The x-coordinate of the top-left corner of the rectangle.
   * @param y - The y-coordinate of the top-left corner of the rectangle.
   * @param w - The width of the rectangle.
   * @param h - The height of the rectangle.
   * @param transform - An optional `Matrix` object to apply a transformation to the rectangle.
   * @returns The instance of the current object for chaining.
   */
  rect(t, e, r, s, n) {
    return this.instructions.push({ action: "rect", data: [t, e, r, s, n] }), this._dirty = !0, this;
  }
  /**
   * Draws a circle shape. This method adds a new circle path to the current drawing.
   * @param x - The x-coordinate of the center of the circle.
   * @param y - The y-coordinate of the center of the circle.
   * @param radius - The radius of the circle.
   * @param transform - An optional `Matrix` object to apply a transformation to the circle.
   * @returns The instance of the current object for chaining.
   */
  circle(t, e, r, s) {
    return this.instructions.push({ action: "circle", data: [t, e, r, s] }), this._dirty = !0, this;
  }
  roundRect(...t) {
    return this.instructions.push({ action: "roundRect", data: t }), this._dirty = !0, this;
  }
  poly(...t) {
    return this.instructions.push({ action: "poly", data: t }), this._dirty = !0, this;
  }
  regularPoly(...t) {
    return this.instructions.push({ action: "regularPoly", data: t }), this._dirty = !0, this;
  }
  roundPoly(...t) {
    return this.instructions.push({ action: "roundPoly", data: t }), this._dirty = !0, this;
  }
  roundShape(...t) {
    return this.instructions.push({ action: "roundShape", data: t }), this._dirty = !0, this;
  }
  filletRect(...t) {
    return this.instructions.push({ action: "filletRect", data: t }), this._dirty = !0, this;
  }
  chamferRect(...t) {
    return this.instructions.push({ action: "chamferRect", data: t }), this._dirty = !0, this;
  }
  /**
   * Draws a star shape centered at a specified location. This method allows for the creation
   *  of stars with a variable number of points, outer radius, optional inner radius, and rotation.
   * The star is drawn as a closed polygon with alternating outer and inner vertices to create the star's points.
   * An optional transformation can be applied to scale, rotate, or translate the star as needed.
   * @param x - The x-coordinate of the center of the star.
   * @param y - The y-coordinate of the center of the star.
   * @param points - The number of points of the star.
   * @param radius - The outer radius of the star (distance from the center to the outer points).
   * @param innerRadius - Optional. The inner radius of the star
   * (distance from the center to the inner points between the outer points).
   * If not provided, defaults to half of the `radius`.
   * @param rotation - Optional. The rotation of the star in radians, where 0 is aligned with the y-axis.
   * Defaults to 0, meaning one point is directly upward.
   * @param transform - An optional `Matrix` object to apply a transformation to the star.
   * This can include rotations, scaling, and translations.
   * @returns The instance of the current object for chaining further drawing commands.
   */
  // eslint-disable-next-line max-len
  star(t, e, r, s, n, o, a) {
    n = n || s / 2;
    const h = -1 * Math.PI / 2 + o, c = r * 2, l = Math.PI * 2 / c, f = [];
    for (let p = 0; p < c; p++) {
      const u = p % 2 ? n : s, d = p * l + h;
      f.push(
        t + u * Math.cos(d),
        e + u * Math.sin(d)
      );
    }
    return this.poly(f, !0, a), this;
  }
  /**
   * Creates a copy of the current `GraphicsPath` instance. This method supports both shallow and deep cloning.
   * A shallow clone copies the reference of the instructions array, while a deep clone creates a new array and
   * copies each instruction individually, ensuring that modifications to the instructions of the cloned `GraphicsPath`
   * do not affect the original `GraphicsPath` and vice versa.
   * @param deep - A boolean flag indicating whether the clone should be deep.
   * @returns A new `GraphicsPath` instance that is a clone of the current instance.
   */
  clone(t = !1) {
    const e = new Di();
    if (!t)
      e.instructions = this.instructions.slice();
    else
      for (let r = 0; r < this.instructions.length; r++) {
        const s = this.instructions[r];
        e.instructions.push({ action: s.action, data: s.data.slice() });
      }
    return e;
  }
  clear() {
    return this.instructions.length = 0, this._dirty = !0, this;
  }
  /**
   * Applies a transformation matrix to all drawing instructions within the `GraphicsPath`.
   * This method enables the modification of the path's geometry according to the provided
   * transformation matrix, which can include translations, rotations, scaling, and skewing.
   *
   * Each drawing instruction in the path is updated to reflect the transformation,
   * ensuring the visual representation of the path is consistent with the applied matrix.
   *
   * Note: The transformation is applied directly to the coordinates and control points of the drawing instructions,
   * not to the path as a whole. This means the transformation's effects are baked into the individual instructions,
   * allowing for fine-grained control over the path's appearance.
   * @param matrix - A `Matrix` object representing the transformation to apply.
   * @returns The instance of the current object for chaining further operations.
   */
  transform(t) {
    if (t.isIdentity())
      return this;
    const e = t.a, r = t.b, s = t.c, n = t.d, o = t.tx, a = t.ty;
    let h = 0, c = 0, l = 0, f = 0, p = 0, u = 0, d = 0, m = 0;
    for (let g = 0; g < this.instructions.length; g++) {
      const y = this.instructions[g], v = y.data;
      switch (y.action) {
        case "moveTo":
        case "lineTo":
          h = v[0], c = v[1], v[0] = e * h + s * c + o, v[1] = r * h + n * c + a;
          break;
        case "bezierCurveTo":
          l = v[0], f = v[1], p = v[2], u = v[3], h = v[4], c = v[5], v[0] = e * l + s * f + o, v[1] = r * l + n * f + a, v[2] = e * p + s * u + o, v[3] = r * p + n * u + a, v[4] = e * h + s * c + o, v[5] = r * h + n * c + a;
          break;
        case "quadraticCurveTo":
          l = v[0], f = v[1], h = v[2], c = v[3], v[0] = e * l + s * f + o, v[1] = r * l + n * f + a, v[2] = e * h + s * c + o, v[3] = r * h + n * c + a;
          break;
        case "arcToSvg":
          h = v[5], c = v[6], d = v[0], m = v[1], v[0] = e * d + s * m, v[1] = r * d + n * m, v[5] = e * h + s * c + o, v[6] = r * h + n * c + a;
          break;
        case "circle":
          v[4] = rr(v[3], t);
          break;
        case "rect":
          v[4] = rr(v[4], t);
          break;
        case "ellipse":
          v[8] = rr(v[8], t);
          break;
        case "roundRect":
          v[5] = rr(v[5], t);
          break;
        case "addPath":
          v[0].transform(t);
          break;
        case "poly":
          v[2] = rr(v[2], t);
          break;
        default:
          dt("unknown transform action", y.action);
          break;
      }
    }
    return this._dirty = !0, this;
  }
  get bounds() {
    return this.shapePath.bounds;
  }
  /**
   * Retrieves the last point from the current drawing instructions in the `GraphicsPath`.
   * This method is useful for operations that depend on the path's current endpoint,
   * such as connecting subsequent shapes or paths. It supports various drawing instructions,
   * ensuring the last point's position is accurately determined regardless of the path's complexity.
   *
   * If the last instruction is a `closePath`, the method iterates backward through the instructions
   *  until it finds an actionable instruction that defines a point (e.g., `moveTo`, `lineTo`,
   * `quadraticCurveTo`, etc.). For compound paths added via `addPath`, it recursively retrieves
   * the last point from the nested path.
   * @param out - A `Point` object where the last point's coordinates will be stored.
   * This object is modified directly to contain the result.
   * @returns The `Point` object containing the last point's coordinates.
   */
  getLastPoint(t) {
    let e = this.instructions.length - 1, r = this.instructions[e];
    if (!r)
      return t.x = 0, t.y = 0, t;
    for (; r.action === "closePath"; ) {
      if (e--, e < 0)
        return t.x = 0, t.y = 0, t;
      r = this.instructions[e];
    }
    switch (r.action) {
      case "moveTo":
      case "lineTo":
        t.x = r.data[0], t.y = r.data[1];
        break;
      case "quadraticCurveTo":
        t.x = r.data[2], t.y = r.data[3];
        break;
      case "bezierCurveTo":
        t.x = r.data[4], t.y = r.data[5];
        break;
      case "arc":
      case "arcToSvg":
        t.x = r.data[5], t.y = r.data[6];
        break;
      case "addPath":
        r.data[0].getLastPoint(t);
        break;
    }
    return t;
  }
}
function rr(i, t) {
  return i ? i.prepend(t) : t.clone();
}
function dm(i, t) {
  if (typeof i == "string") {
    const r = document.createElement("div");
    r.innerHTML = i.trim(), i = r.querySelector("svg");
  }
  const e = {
    context: t,
    path: new Di()
  };
  return hc(i, e, null, null), t;
}
function hc(i, t, e, r) {
  const s = i.children, { fillStyle: n, strokeStyle: o } = pm(i);
  n && e ? e = { ...e, ...n } : n && (e = n), o && r ? r = { ...r, ...o } : o && (r = o), t.context.fillStyle = e, t.context.strokeStyle = r;
  let a, h, c, l, f, p, u, d, m, g, y, v, _, w, x, A, S;
  switch (i.nodeName.toLowerCase()) {
    case "path":
      w = i.getAttribute("d"), x = new Di(w), t.context.path(x), e && t.context.fill(), r && t.context.stroke();
      break;
    case "circle":
      u = bt(i, "cx", 0), d = bt(i, "cy", 0), m = bt(i, "r", 0), t.context.ellipse(u, d, m, m), e && t.context.fill(), r && t.context.stroke();
      break;
    case "rect":
      a = bt(i, "x", 0), h = bt(i, "y", 0), A = bt(i, "width", 0), S = bt(i, "height", 0), g = bt(i, "rx", 0), y = bt(i, "ry", 0), g || y ? t.context.roundRect(a, h, A, S, g || y) : t.context.rect(a, h, A, S), e && t.context.fill(), r && t.context.stroke();
      break;
    case "ellipse":
      u = bt(i, "cx", 0), d = bt(i, "cy", 0), g = bt(i, "rx", 0), y = bt(i, "ry", 0), t.context.beginPath(), t.context.ellipse(u, d, g, y), e && t.context.fill(), r && t.context.stroke();
      break;
    case "line":
      c = bt(i, "x1", 0), l = bt(i, "y1", 0), f = bt(i, "x2", 0), p = bt(i, "y2", 0), t.context.beginPath(), t.context.moveTo(c, l), t.context.lineTo(f, p), r && t.context.stroke();
      break;
    case "polygon":
      _ = i.getAttribute("points"), v = _.match(/\d+/g).map((b) => parseInt(b, 10)), t.context.poly(v, !0), e && t.context.fill(), r && t.context.stroke();
      break;
    case "polyline":
      _ = i.getAttribute("points"), v = _.match(/\d+/g).map((b) => parseInt(b, 10)), t.context.poly(v, !1), r && t.context.stroke();
      break;
    case "g":
    case "svg":
      break;
    default: {
      console.info(`[SVG parser] <${i.nodeName}> elements unsupported`);
      break;
    }
  }
  for (let b = 0; b < s.length; b++)
    hc(s[b], t, e, r);
}
function bt(i, t, e) {
  const r = i.getAttribute(t);
  return r ? Number(r) : e;
}
function pm(i) {
  const t = i.getAttribute("style"), e = {}, r = {};
  let s = !1, n = !1;
  if (t) {
    const o = t.split(";");
    for (let a = 0; a < o.length; a++) {
      const h = o[a], [c, l] = h.split(":");
      switch (c) {
        case "stroke":
          l !== "none" && (e.color = gt.shared.setValue(l).toNumber(), n = !0);
          break;
        case "stroke-width":
          e.width = Number(l);
          break;
        case "fill":
          l !== "none" && (s = !0, r.color = gt.shared.setValue(l).toNumber());
          break;
        case "fill-opacity":
          r.alpha = Number(l);
          break;
        case "stroke-opacity":
          e.alpha = Number(l);
          break;
        case "opacity":
          r.alpha = Number(l), e.alpha = Number(l);
          break;
      }
    }
  } else {
    const o = i.getAttribute("stroke");
    o && o !== "none" && (n = !0, e.color = gt.shared.setValue(o).toNumber(), e.width = bt(i, "stroke-width", 1));
    const a = i.getAttribute("fill");
    a && a !== "none" && (s = !0, r.color = gt.shared.setValue(a).toNumber());
  }
  return {
    strokeStyle: n ? e : null,
    fillStyle: s ? r : null
  };
}
function fm(i) {
  return gt.isColorLike(i);
}
function uh(i) {
  return i instanceof Tn;
}
function dh(i) {
  return i instanceof Sr;
}
function mm(i, t, e) {
  const r = gt.shared.setValue(t ?? 0);
  return i.color = r.toNumber(), i.alpha = r.alpha === 1 ? e.alpha : r.alpha, i.texture = H.WHITE, { ...e, ...i };
}
function ph(i, t, e) {
  return i.fill = t, i.color = 16777215, i.texture = t.texture, i.matrix = t.transform, { ...e, ...i };
}
function fh(i, t, e) {
  return t.buildLinearGradient(), i.fill = t, i.color = 16777215, i.texture = t.texture, i.matrix = t.transform, { ...e, ...i };
}
function gm(i, t) {
  var e;
  const r = { ...t, ...i };
  if (r.texture) {
    if (r.texture !== H.WHITE) {
      const o = ((e = r.matrix) == null ? void 0 : e.invert()) || new K();
      o.translate(r.texture.frame.x, r.texture.frame.y), o.scale(1 / r.texture.source.width, 1 / r.texture.source.height), r.matrix = o;
    }
    const n = r.texture.source.style;
    n.addressMode === "clamp-to-edge" && (n.addressMode = "repeat", n.update());
  }
  const s = gt.shared.setValue(r.color);
  return r.alpha *= s.alpha, r.color = s.toNumber(), r.matrix = r.matrix ? r.matrix.clone() : null, r;
}
function ni(i, t) {
  if (i == null)
    return null;
  const e = {}, r = i;
  return fm(i) ? mm(e, i, t) : uh(i) ? ph(e, i, t) : dh(i) ? fh(e, i, t) : r.fill && uh(r.fill) ? ph(r, r.fill, t) : r.fill && dh(r.fill) ? fh(r, r.fill, t) : gm(r, t);
}
function un(i, t) {
  const { width: e, alignment: r, miterLimit: s, cap: n, join: o, ...a } = t, h = ni(i, a);
  return h ? {
    width: e,
    alignment: r,
    miterLimit: s,
    cap: n,
    join: o,
    ...h
  } : null;
}
const ym = new kt(), mh = new K(), Io = class me extends Bt {
  constructor() {
    super(...arguments), this.uid = vt("graphicsContext"), this.dirty = !0, this.batchMode = "auto", this.instructions = [], this._activePath = new Di(), this._transform = new K(), this._fillStyle = { ...me.defaultFillStyle }, this._strokeStyle = { ...me.defaultStrokeStyle }, this._stateStack = [], this._tick = 0, this._bounds = new _e(), this._boundsDirty = !0;
  }
  /**
   * Creates a new GraphicsContext object that is a clone of this instance, copying all properties,
   * including the current drawing state, transformations, styles, and instructions.
   * @returns A new GraphicsContext instance with the same properties and state as this one.
   */
  clone() {
    const t = new me();
    return t.batchMode = this.batchMode, t.instructions = this.instructions.slice(), t._activePath = this._activePath.clone(), t._transform = this._transform.clone(), t._fillStyle = { ...this._fillStyle }, t._strokeStyle = { ...this._strokeStyle }, t._stateStack = this._stateStack.slice(), t._bounds = this._bounds.clone(), t._boundsDirty = !0, t;
  }
  /**
   * The current fill style of the graphics context. This can be a color, gradient, pattern, or a more complex style defined by a FillStyle object.
   */
  get fillStyle() {
    return this._fillStyle;
  }
  set fillStyle(t) {
    this._fillStyle = ni(t, me.defaultFillStyle);
  }
  /**
   * The current stroke style of the graphics context. Similar to fill styles, stroke styles can encompass colors, gradients, patterns, or more detailed configurations via a StrokeStyle object.
   */
  get strokeStyle() {
    return this._strokeStyle;
  }
  set strokeStyle(t) {
    this._strokeStyle = un(t, me.defaultStrokeStyle);
  }
  /**
   * Sets the current fill style of the graphics context. The fill style can be a color, gradient,
   * pattern, or a more complex style defined by a FillStyle object.
   * @param style - The fill style to apply. This can be a simple color, a gradient or pattern object,
   *                or a FillStyle or ConvertedFillStyle object.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  setFillStyle(t) {
    return this._fillStyle = ni(t, me.defaultFillStyle), this;
  }
  /**
   * Sets the current stroke style of the graphics context. Similar to fill styles, stroke styles can
   * encompass colors, gradients, patterns, or more detailed configurations via a StrokeStyle object.
   * @param style - The stroke style to apply. Can be defined as a color, a gradient or pattern,
   *                or a StrokeStyle or ConvertedStrokeStyle object.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  setStrokeStyle(t) {
    return this._strokeStyle = ni(t, me.defaultStrokeStyle), this;
  }
  texture(t, e, r, s, n, o) {
    return this.instructions.push({
      action: "texture",
      data: {
        image: t,
        dx: r || 0,
        dy: s || 0,
        dw: n || t.frame.width,
        dh: o || t.frame.height,
        transform: this._transform.clone(),
        alpha: this._fillStyle.alpha,
        style: e ? gt.shared.setValue(e).toNumber() : 16777215
      }
    }), this.onUpdate(), this;
  }
  /**
   * Resets the current path. Any previous path and its commands are discarded and a new path is
   * started. This is typically called before beginning a new shape or series of drawing commands.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  beginPath() {
    return this._activePath = new Di(), this;
  }
  fill(t, e) {
    let r;
    const s = this.instructions[this.instructions.length - 1];
    return this._tick === 0 && s && s.action === "stroke" ? r = s.data.path : r = this._activePath.clone(), r ? (t != null && (e !== void 0 && typeof t == "number" && (X(q, "GraphicsContext.fill(color, alpha) is deprecated, use GraphicsContext.fill({ color, alpha }) instead"), t = { color: t, alpha: e }), this._fillStyle = ni(t, me.defaultFillStyle)), this.instructions.push({
      action: "fill",
      // TODO copy fill style!
      data: { style: this.fillStyle, path: r }
    }), this.onUpdate(), this._initNextPathLocation(), this._tick = 0, this) : this;
  }
  _initNextPathLocation() {
    const { x: t, y: e } = this._activePath.getLastPoint(kt.shared);
    this._activePath.clear(), this._activePath.moveTo(t, e);
  }
  /**
   * Strokes the current path with the current stroke style. This method can take an optional
   * FillInput parameter to define the stroke's appearance, including its color, width, and other properties.
   * @param style - (Optional) The stroke style to apply. Can be defined as a simple color or a more complex style object. If omitted, uses the current stroke style.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  stroke(t) {
    let e;
    const r = this.instructions[this.instructions.length - 1];
    return this._tick === 0 && r && r.action === "fill" ? e = r.data.path : e = this._activePath.clone(), e ? (t != null && (this._strokeStyle = un(t, me.defaultStrokeStyle)), this.instructions.push({
      action: "stroke",
      // TODO copy fill style!
      data: { style: this.strokeStyle, path: e }
    }), this.onUpdate(), this._initNextPathLocation(), this._tick = 0, this) : this;
  }
  /**
   * Applies a cutout to the last drawn shape. This is used to create holes or complex shapes by
   * subtracting a path from the previously drawn path. If a hole is not completely in a shape, it will
   * fail to cut correctly!
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  cut() {
    for (let t = 0; t < 2; t++) {
      const e = this.instructions[this.instructions.length - 1 - t], r = this._activePath.clone();
      if (e && (e.action === "stroke" || e.action === "fill"))
        if (e.data.hole)
          e.data.hole.addPath(r);
        else {
          e.data.hole = r;
          break;
        }
    }
    return this._initNextPathLocation(), this;
  }
  /**
   * Adds an arc to the current path, which is centered at (x, y) with the specified radius,
   * starting and ending angles, and direction.
   * @param x - The x-coordinate of the arc's center.
   * @param y - The y-coordinate of the arc's center.
   * @param radius - The arc's radius.
   * @param startAngle - The starting angle, in radians.
   * @param endAngle - The ending angle, in radians.
   * @param counterclockwise - (Optional) Specifies whether the arc is drawn counterclockwise (true) or clockwise (false). Defaults to false.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  arc(t, e, r, s, n, o) {
    this._tick++;
    const a = this._transform;
    return this._activePath.arc(
      a.a * t + a.c * e + a.tx,
      a.b * t + a.d * e + a.ty,
      r,
      s,
      n,
      o
    ), this;
  }
  /**
   * Adds an arc to the current path with the given control points and radius, connected to the previous point
   * by a straight line if necessary.
   * @param x1 - The x-coordinate of the first control point.
   * @param y1 - The y-coordinate of the first control point.
   * @param x2 - The x-coordinate of the second control point.
   * @param y2 - The y-coordinate of the second control point.
   * @param radius - The arc's radius.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  arcTo(t, e, r, s, n) {
    this._tick++;
    const o = this._transform;
    return this._activePath.arcTo(
      o.a * t + o.c * e + o.tx,
      o.b * t + o.d * e + o.ty,
      o.a * r + o.c * s + o.tx,
      o.b * r + o.d * s + o.ty,
      n
    ), this;
  }
  /**
   * Adds an SVG-style arc to the path, allowing for elliptical arcs based on the SVG spec.
   * @param rx - The x-radius of the ellipse.
   * @param ry - The y-radius of the ellipse.
   * @param xAxisRotation - The rotation of the ellipse's x-axis relative
   * to the x-axis of the coordinate system, in degrees.
   * @param largeArcFlag - Determines if the arc should be greater than or less than 180 degrees.
   * @param sweepFlag - Determines if the arc should be swept in a positive angle direction.
   * @param x - The x-coordinate of the arc's end point.
   * @param y - The y-coordinate of the arc's end point.
   * @returns The instance of the current object for chaining.
   */
  arcToSvg(t, e, r, s, n, o, a) {
    this._tick++;
    const h = this._transform;
    return this._activePath.arcToSvg(
      t,
      e,
      r,
      // should we rotate this with transform??
      s,
      n,
      h.a * o + h.c * a + h.tx,
      h.b * o + h.d * a + h.ty
    ), this;
  }
  /**
   * Adds a cubic Bezier curve to the path.
   * It requires three points: the first two are control points and the third one is the end point.
   * The starting point is the last point in the current path.
   * @param cp1x - The x-coordinate of the first control point.
   * @param cp1y - The y-coordinate of the first control point.
   * @param cp2x - The x-coordinate of the second control point.
   * @param cp2y - The y-coordinate of the second control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothness - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  bezierCurveTo(t, e, r, s, n, o, a) {
    this._tick++;
    const h = this._transform;
    return this._activePath.bezierCurveTo(
      h.a * t + h.c * e + h.tx,
      h.b * t + h.d * e + h.ty,
      h.a * r + h.c * s + h.tx,
      h.b * r + h.d * s + h.ty,
      h.a * n + h.c * o + h.tx,
      h.b * n + h.d * o + h.ty,
      a
    ), this;
  }
  /**
   * Closes the current path by drawing a straight line back to the start.
   * If the shape is already closed or there are no points in the path, this method does nothing.
   * @returns The instance of the current object for chaining.
   */
  closePath() {
    var t;
    return this._tick++, (t = this._activePath) == null || t.closePath(), this;
  }
  /**
   * Draws an ellipse at the specified location and with the given x and y radii.
   * An optional transformation can be applied, allowing for rotation, scaling, and translation.
   * @param x - The x-coordinate of the center of the ellipse.
   * @param y - The y-coordinate of the center of the ellipse.
   * @param radiusX - The horizontal radius of the ellipse.
   * @param radiusY - The vertical radius of the ellipse.
   * @returns The instance of the current object for chaining.
   */
  ellipse(t, e, r, s) {
    return this._tick++, this._activePath.ellipse(t, e, r, s, this._transform.clone()), this;
  }
  /**
   * Draws a circle shape. This method adds a new circle path to the current drawing.
   * @param x - The x-coordinate of the center of the circle.
   * @param y - The y-coordinate of the center of the circle.
   * @param radius - The radius of the circle.
   * @returns The instance of the current object for chaining.
   */
  circle(t, e, r) {
    return this._tick++, this._activePath.circle(t, e, r, this._transform.clone()), this;
  }
  /**
   * Adds another `GraphicsPath` to this path, optionally applying a transformation.
   * @param path - The `GraphicsPath` to add.
   * @returns The instance of the current object for chaining.
   */
  path(t) {
    return this._tick++, this._activePath.addPath(t, this._transform.clone()), this;
  }
  /**
   * Connects the current point to a new point with a straight line. This method updates the current path.
   * @param x - The x-coordinate of the new point to connect to.
   * @param y - The y-coordinate of the new point to connect to.
   * @returns The instance of the current object for chaining.
   */
  lineTo(t, e) {
    this._tick++;
    const r = this._transform;
    return this._activePath.lineTo(
      r.a * t + r.c * e + r.tx,
      r.b * t + r.d * e + r.ty
    ), this;
  }
  /**
   * Sets the starting point for a new sub-path. Any subsequent drawing commands are considered part of this path.
   * @param x - The x-coordinate for the starting point.
   * @param y - The y-coordinate for the starting point.
   * @returns The instance of the current object for chaining.
   */
  moveTo(t, e) {
    this._tick++;
    const r = this._transform, s = this._activePath.instructions, n = r.a * t + r.c * e + r.tx, o = r.b * t + r.d * e + r.ty;
    return s.length === 1 && s[0].action === "moveTo" ? (s[0].data[0] = n, s[0].data[1] = o, this) : (this._activePath.moveTo(
      n,
      o
    ), this);
  }
  /**
   * Adds a quadratic curve to the path. It requires two points: the control point and the end point.
   * The starting point is the last point in the current path.
   * @param cpx - The x-coordinate of the control point.
   * @param cpy - The y-coordinate of the control point.
   * @param x - The x-coordinate of the end point.
   * @param y - The y-coordinate of the end point.
   * @param smoothness - Optional parameter to adjust the smoothness of the curve.
   * @returns The instance of the current object for chaining.
   */
  quadraticCurveTo(t, e, r, s, n) {
    this._tick++;
    const o = this._transform;
    return this._activePath.quadraticCurveTo(
      o.a * t + o.c * e + o.tx,
      o.b * t + o.d * e + o.ty,
      o.a * r + o.c * s + o.tx,
      o.b * r + o.d * s + o.ty,
      n
    ), this;
  }
  /**
   * Draws a rectangle shape. This method adds a new rectangle path to the current drawing.
   * @param x - The x-coordinate of the top-left corner of the rectangle.
   * @param y - The y-coordinate of the top-left corner of the rectangle.
   * @param w - The width of the rectangle.
   * @param h - The height of the rectangle.
   * @returns The instance of the current object for chaining.
   */
  rect(t, e, r, s) {
    return this._tick++, this._activePath.rect(t, e, r, s, this._transform.clone()), this;
  }
  /**
   * Draws a rectangle with rounded corners.
   * The corner radius can be specified to determine how rounded the corners should be.
   * An optional transformation can be applied, which allows for rotation, scaling, and translation of the rectangle.
   * @param x - The x-coordinate of the top-left corner of the rectangle.
   * @param y - The y-coordinate of the top-left corner of the rectangle.
   * @param w - The width of the rectangle.
   * @param h - The height of the rectangle.
   * @param radius - The radius of the rectangle's corners. If not specified, corners will be sharp.
   * @returns The instance of the current object for chaining.
   */
  roundRect(t, e, r, s, n) {
    return this._tick++, this._activePath.roundRect(t, e, r, s, n, this._transform.clone()), this;
  }
  /**
   * Draws a polygon shape by specifying a sequence of points. This method allows for the creation of complex polygons,
   * which can be both open and closed. An optional transformation can be applied, enabling the polygon to be scaled,
   * rotated, or translated as needed.
   * @param points - An array of numbers, or an array of PointData objects eg [{x,y}, {x,y}, {x,y}]
   * representing the x and y coordinates, of the polygon's vertices, in sequence.
   * @param close - A boolean indicating whether to close the polygon path. True by default.
   */
  poly(t, e) {
    return this._tick++, this._activePath.poly(t, e, this._transform.clone()), this;
  }
  /**
   * Draws a regular polygon with a specified number of sides. All sides and angles are equal.
   * @param x - The x-coordinate of the center of the polygon.
   * @param y - The y-coordinate of the center of the polygon.
   * @param radius - The radius of the circumscribed circle of the polygon.
   * @param sides - The number of sides of the polygon. Must be 3 or more.
   * @param rotation - The rotation angle of the polygon, in radians. Zero by default.
   * @param transform - An optional `Matrix` object to apply a transformation to the polygon.
   * @returns The instance of the current object for chaining.
   */
  regularPoly(t, e, r, s, n = 0, o) {
    return this._tick++, this._activePath.regularPoly(t, e, r, s, n, o), this;
  }
  /**
   * Draws a polygon with rounded corners.
   * Similar to `regularPoly` but with the ability to round the corners of the polygon.
   * @param x - The x-coordinate of the center of the polygon.
   * @param y - The y-coordinate of the center of the polygon.
   * @param radius - The radius of the circumscribed circle of the polygon.
   * @param sides - The number of sides of the polygon. Must be 3 or more.
   * @param corner - The radius of the rounding of the corners.
   * @param rotation - The rotation angle of the polygon, in radians. Zero by default.
   * @returns The instance of the current object for chaining.
   */
  roundPoly(t, e, r, s, n, o) {
    return this._tick++, this._activePath.roundPoly(t, e, r, s, n, o), this;
  }
  /**
   * Draws a shape with rounded corners. This function supports custom radius for each corner of the shape.
   * Optionally, corners can be rounded using a quadratic curve instead of an arc, providing a different aesthetic.
   * @param points - An array of `RoundedPoint` representing the corners of the shape to draw.
   * A minimum of 3 points is required.
   * @param radius - The default radius for the corners.
   * This radius is applied to all corners unless overridden in `points`.
   * @param useQuadratic - If set to true, rounded corners are drawn using a quadraticCurve
   *  method instead of an arc method. Defaults to false.
   * @param smoothness - Specifies the smoothness of the curve when `useQuadratic` is true.
   * Higher values make the curve smoother.
   * @returns The instance of the current object for chaining.
   */
  roundShape(t, e, r, s) {
    return this._tick++, this._activePath.roundShape(t, e, r, s), this;
  }
  /**
   * Draw Rectangle with fillet corners. This is much like rounded rectangle
   * however it support negative numbers as well for the corner radius.
   * @param x - Upper left corner of rect
   * @param y - Upper right corner of rect
   * @param width - Width of rect
   * @param height - Height of rect
   * @param fillet - accept negative or positive values
   */
  filletRect(t, e, r, s, n) {
    return this._tick++, this._activePath.filletRect(t, e, r, s, n), this;
  }
  /**
   * Draw Rectangle with chamfer corners. These are angled corners.
   * @param x - Upper left corner of rect
   * @param y - Upper right corner of rect
   * @param width - Width of rect
   * @param height - Height of rect
   * @param chamfer - non-zero real number, size of corner cutout
   * @param transform
   */
  chamferRect(t, e, r, s, n, o) {
    return this._tick++, this._activePath.chamferRect(t, e, r, s, n, o), this;
  }
  /**
   * Draws a star shape centered at a specified location. This method allows for the creation
   *  of stars with a variable number of points, outer radius, optional inner radius, and rotation.
   * The star is drawn as a closed polygon with alternating outer and inner vertices to create the star's points.
   * An optional transformation can be applied to scale, rotate, or translate the star as needed.
   * @param x - The x-coordinate of the center of the star.
   * @param y - The y-coordinate of the center of the star.
   * @param points - The number of points of the star.
   * @param radius - The outer radius of the star (distance from the center to the outer points).
   * @param innerRadius - Optional. The inner radius of the star
   * (distance from the center to the inner points between the outer points).
   * If not provided, defaults to half of the `radius`.
   * @param rotation - Optional. The rotation of the star in radians, where 0 is aligned with the y-axis.
   * Defaults to 0, meaning one point is directly upward.
   * @returns The instance of the current object for chaining further drawing commands.
   */
  star(t, e, r, s, n = 0, o = 0) {
    return this._tick++, this._activePath.star(t, e, r, s, n, o, this._transform.clone()), this;
  }
  /**
   * Parses and renders an SVG string into the graphics context. This allows for complex shapes and paths
   * defined in SVG format to be drawn within the graphics context.
   * @param svg - The SVG string to be parsed and rendered.
   */
  svg(t) {
    return this._tick++, dm(t, this), this;
  }
  /**
   * Restores the most recently saved graphics state by popping the top of the graphics state stack.
   * This includes transformations, fill styles, and stroke styles.
   */
  restore() {
    const t = this._stateStack.pop();
    return t && (this._transform = t.transform, this._fillStyle = t.fillStyle, this._strokeStyle = t.strokeStyle), this;
  }
  /** Saves the current graphics state, including transformations, fill styles, and stroke styles, onto a stack. */
  save() {
    return this._stateStack.push({
      transform: this._transform.clone(),
      fillStyle: { ...this._fillStyle },
      strokeStyle: { ...this._strokeStyle }
    }), this;
  }
  /**
   * Returns the current transformation matrix of the graphics context.
   * @returns The current transformation matrix.
   */
  getTransform() {
    return this._transform;
  }
  /**
   * Resets the current transformation matrix to the identity matrix, effectively removing any transformations (rotation, scaling, translation) previously applied.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  resetTransform() {
    return this._transform.identity(), this;
  }
  /**
   * Applies a rotation transformation to the graphics context around the current origin.
   * @param angle - The angle of rotation in radians.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  rotate(t) {
    return this._transform.rotate(t), this;
  }
  /**
   * Applies a scaling transformation to the graphics context, scaling drawings by x horizontally and by y vertically.
   * @param x - The scale factor in the horizontal direction.
   * @param y - (Optional) The scale factor in the vertical direction. If not specified, the x value is used for both directions.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  scale(t, e = t) {
    return this._transform.scale(t, e), this;
  }
  setTransform(t, e, r, s, n, o) {
    return t instanceof K ? (this._transform.set(t.a, t.b, t.c, t.d, t.tx, t.ty), this) : (this._transform.set(t, e, r, s, n, o), this);
  }
  transform(t, e, r, s, n, o) {
    return t instanceof K ? (this._transform.append(t), this) : (mh.set(t, e, r, s, n, o), this._transform.append(mh), this);
  }
  /**
   * Applies a translation transformation to the graphics context, moving the origin by the specified amounts.
   * @param x - The amount to translate in the horizontal direction.
   * @param y - (Optional) The amount to translate in the vertical direction. If not specified, the x value is used for both directions.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  translate(t, e = t) {
    return this._transform.translate(t, e), this;
  }
  /**
   * Clears all drawing commands from the graphics context, effectively resetting it. This includes clearing the path,
   * and optionally resetting transformations to the identity matrix.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  clear() {
    return this._activePath.clear(), this.instructions.length = 0, this.resetTransform(), this.onUpdate(), this;
  }
  onUpdate() {
    this.dirty || (this.emit("update", this, 16), this.dirty = !0, this._boundsDirty = !0);
  }
  /** The bounds of the graphic shape. */
  get bounds() {
    if (!this._boundsDirty)
      return this._bounds;
    const t = this._bounds;
    t.clear();
    for (let e = 0; e < this.instructions.length; e++) {
      const r = this.instructions[e], s = r.action;
      if (s === "fill") {
        const n = r.data;
        t.addBounds(n.path.bounds);
      } else if (s === "texture") {
        const n = r.data;
        t.addFrame(n.dx, n.dy, n.dx + n.dw, n.dy + n.dh, n.transform);
      }
      if (s === "stroke") {
        const n = r.data, o = n.style.width / 2, a = n.path.bounds;
        t.addFrame(
          a.minX - o,
          a.minY - o,
          a.maxX + o,
          a.maxY + o
        );
      }
    }
    return t;
  }
  /**
   * Check to see if a point is contained within this geometry.
   * @param point - Point to check if it's contained.
   * @returns {boolean} `true` if the point is contained within geometry.
   */
  containsPoint(t) {
    var e;
    if (!this.bounds.containsPoint(t.x, t.y))
      return !1;
    const r = this.instructions;
    let s = !1;
    for (let n = 0; n < r.length; n++) {
      const o = r[n], a = o.data, h = a.path;
      if (!o.action || !h)
        continue;
      const c = a.style, l = h.shapePath.shapePrimitives;
      for (let f = 0; f < l.length; f++) {
        const p = l[f].shape;
        if (!c || !p)
          continue;
        const u = l[f].transform, d = u ? u.applyInverse(t, ym) : t;
        o.action === "fill" ? s = p.contains(d.x, d.y) : s = p.strokeContains(d.x, d.y, c.width);
        const m = a.hole;
        if (m) {
          const g = (e = m.shapePath) == null ? void 0 : e.shapePrimitives;
          if (g)
            for (let y = 0; y < g.length; y++)
              g[y].shape.contains(d.x, d.y) && (s = !1);
        }
        if (s)
          return !0;
      }
    }
    return s;
  }
  /**
   * Destroys the GraphicsData object.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.texture=false] - Should it destroy the current texture of the fill/stroke style?
   * @param {boolean} [options.textureSource=false] - Should it destroy the texture source of the fill/stroke style?
   */
  destroy(t = !1) {
    if (this._stateStack.length = 0, this._transform = null, this.emit("destroy", this), this.removeAllListeners(), typeof t == "boolean" ? t : t == null ? void 0 : t.texture) {
      const e = typeof t == "boolean" ? t : t == null ? void 0 : t.textureSource;
      this._fillStyle.texture && this._fillStyle.texture.destroy(e), this._strokeStyle.texture && this._strokeStyle.texture.destroy(e);
    }
    this._fillStyle = null, this._strokeStyle = null, this.instructions = null, this._activePath = null, this._bounds = null, this._stateStack = null, this.customShader = null, this._transform = null;
  }
};
Io.defaultFillStyle = {
  /** The color to use for the fill. */
  color: 16777215,
  /** The alpha value to use for the fill. */
  alpha: 1,
  /** The texture to use for the fill. */
  texture: H.WHITE,
  /** The matrix to apply. */
  matrix: null,
  /** The fill pattern to use. */
  fill: null
};
Io.defaultStrokeStyle = {
  /** The width of the stroke. */
  width: 1,
  /** The color to use for the stroke. */
  color: 16777215,
  /** The alpha value to use for the stroke. */
  alpha: 1,
  /** The alignment of the stroke. */
  alignment: 0.5,
  /** The miter limit to use. */
  miterLimit: 10,
  /** The line cap style to use. */
  cap: "butt",
  /** The line join style to use. */
  join: "miter",
  /** The texture to use for the fill. */
  texture: H.WHITE,
  /** The matrix to apply. */
  matrix: null,
  /** The fill pattern to use. */
  fill: null
};
let Zt = Io;
const gh = [
  "align",
  "breakWords",
  "cssOverrides",
  "fontVariant",
  "fontWeight",
  "leading",
  "letterSpacing",
  "lineHeight",
  "padding",
  "textBaseline",
  "trim",
  "whiteSpace",
  "wordWrap",
  "wordWrapWidth",
  "fontFamily",
  "fontStyle",
  "fontSize"
];
function xm(i) {
  const t = [];
  let e = 0;
  for (let r = 0; r < gh.length; r++) {
    const s = `_${gh[r]}`;
    t[e++] = i[s];
  }
  return e = lc(i._fill, t, e), e = vm(i._stroke, t, e), e = bm(i.dropShadow, t, e), t.join("-");
}
function lc(i, t, e) {
  var r;
  return i && (t[e++] = i.color, t[e++] = i.alpha, t[e++] = (r = i.fill) == null ? void 0 : r.styleKey), e;
}
function vm(i, t, e) {
  return i && (e = lc(i, t, e), t[e++] = i.width, t[e++] = i.alignment, t[e++] = i.cap, t[e++] = i.join, t[e++] = i.miterLimit), e;
}
function bm(i, t, e) {
  return i && (t[e++] = i.alpha, t[e++] = i.angle, t[e++] = i.blur, t[e++] = i.distance, t[e++] = gt.shared.setValue(i.color).toNumber()), e;
}
const Oo = class Ai extends Bt {
  constructor(t = {}) {
    super(), _m(t);
    const e = { ...Ai.defaultTextStyle, ...t };
    for (const r in e) {
      const s = r;
      this[s] = e[r];
    }
    this.update();
  }
  /**
   * Alignment for multiline text, does not affect single line text.
   * @member {'left'|'center'|'right'|'justify'}
   */
  get align() {
    return this._align;
  }
  set align(t) {
    this._align = t, this.update();
  }
  /** Indicates if lines can be wrapped within words, it needs wordWrap to be set to true. */
  get breakWords() {
    return this._breakWords;
  }
  set breakWords(t) {
    this._breakWords = t, this.update();
  }
  /** Set a drop shadow for the text. */
  get dropShadow() {
    return this._dropShadow;
  }
  set dropShadow(t) {
    t !== null && typeof t == "object" ? this._dropShadow = this._createProxy({ ...Ai.defaultDropShadow, ...t }) : this._dropShadow = t ? this._createProxy({ ...Ai.defaultDropShadow }) : null, this.update();
  }
  /** The font family, can be a single font name, or a list of names where the first is the preferred font. */
  get fontFamily() {
    return this._fontFamily;
  }
  set fontFamily(t) {
    this._fontFamily = t, this.update();
  }
  /** The font size (as a number it converts to px, but as a string, equivalents are '26px','20pt','160%' or '1.6em') */
  get fontSize() {
    return this._fontSize;
  }
  set fontSize(t) {
    typeof t == "string" ? this._fontSize = parseInt(t, 10) : this._fontSize = t, this.update();
  }
  /**
   * The font style.
   * @member {'normal'|'italic'|'oblique'}
   */
  get fontStyle() {
    return this._fontStyle;
  }
  set fontStyle(t) {
    this._fontStyle = t.toLowerCase(), this.update();
  }
  /**
   * The font variant.
   * @member {'normal'|'small-caps'}
   */
  get fontVariant() {
    return this._fontVariant;
  }
  set fontVariant(t) {
    this._fontVariant = t, this.update();
  }
  /**
   * The font weight.
   * @member {'normal'|'bold'|'bolder'|'lighter'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'}
   */
  get fontWeight() {
    return this._fontWeight;
  }
  set fontWeight(t) {
    this._fontWeight = t, this.update();
  }
  /** The space between lines. */
  get leading() {
    return this._leading;
  }
  set leading(t) {
    this._leading = t, this.update();
  }
  /** The amount of spacing between letters, default is 0. */
  get letterSpacing() {
    return this._letterSpacing;
  }
  set letterSpacing(t) {
    this._letterSpacing = t, this.update();
  }
  /** The line height, a number that represents the vertical space that a letter uses. */
  get lineHeight() {
    return this._lineHeight;
  }
  set lineHeight(t) {
    this._lineHeight = t, this.update();
  }
  /**
   * Occasionally some fonts are cropped. Adding some padding will prevent this from happening
   * by adding padding to all sides of the text.
   */
  get padding() {
    return this._padding;
  }
  set padding(t) {
    this._padding = t, this.update();
  }
  /** Trim transparent borders. This is an expensive operation so only use this if you have to! */
  get trim() {
    return this._trim;
  }
  set trim(t) {
    this._trim = t, this.update();
  }
  /**
   * The baseline of the text that is rendered.
   * @member {'alphabetic'|'top'|'hanging'|'middle'|'ideographic'|'bottom'}
   */
  get textBaseline() {
    return this._textBaseline;
  }
  set textBaseline(t) {
    this._textBaseline = t, this.update();
  }
  /**
   * How newlines and spaces should be handled.
   * Default is 'pre' (preserve, preserve).
   *
   *  value       | New lines     |   Spaces
   *  ---         | ---           |   ---
   * 'normal'     | Collapse      |   Collapse
   * 'pre'        | Preserve      |   Preserve
   * 'pre-line'   | Preserve      |   Collapse
   * @member {'normal'|'pre'|'pre-line'}
   */
  get whiteSpace() {
    return this._whiteSpace;
  }
  set whiteSpace(t) {
    this._whiteSpace = t, this.update();
  }
  /** Indicates if word wrap should be used. */
  get wordWrap() {
    return this._wordWrap;
  }
  set wordWrap(t) {
    this._wordWrap = t, this.update();
  }
  /** The width at which text will wrap, it needs wordWrap to be set to true. */
  get wordWrapWidth() {
    return this._wordWrapWidth;
  }
  set wordWrapWidth(t) {
    this._wordWrapWidth = t, this.update();
  }
  /** A fillstyle that will be used on the text e.g., 'red', '#00FF00'. */
  get fill() {
    return this._originalFill;
  }
  set fill(t) {
    t !== this._originalFill && (this._originalFill = t, this._isFillStyle(t) && (this._originalFill = this._createProxy({ ...Zt.defaultFillStyle, ...t }, () => {
      this._fill = ni(
        { ...this._originalFill },
        Zt.defaultFillStyle
      );
    })), this._fill = ni(
      t === 0 ? "black" : t,
      Zt.defaultFillStyle
    ), this.update());
  }
  /** A fillstyle that will be used on the text stroke, e.g., 'blue', '#FCFF00'. */
  get stroke() {
    return this._originalStroke;
  }
  set stroke(t) {
    t !== this._originalStroke && (this._originalStroke = t, this._isFillStyle(t) && (this._originalStroke = this._createProxy({ ...Zt.defaultStrokeStyle, ...t }, () => {
      this._stroke = un(
        { ...this._originalStroke },
        Zt.defaultStrokeStyle
      );
    })), this._stroke = un(t, Zt.defaultStrokeStyle), this.update());
  }
  _generateKey() {
    return this._styleKey = xm(this), this._styleKey;
  }
  update() {
    this._styleKey = null, this.emit("update", this);
  }
  /** Resets all properties to the default values */
  reset() {
    const t = Ai.defaultTextStyle;
    for (const e in t)
      this[e] = t[e];
  }
  get styleKey() {
    return this._styleKey || this._generateKey();
  }
  /**
   * Creates a new TextStyle object with the same values as this one.
   * @returns New cloned TextStyle object
   */
  clone() {
    return new Ai({
      align: this.align,
      breakWords: this.breakWords,
      dropShadow: this._dropShadow ? { ...this._dropShadow } : null,
      fill: this._fill,
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      fontStyle: this.fontStyle,
      fontVariant: this.fontVariant,
      fontWeight: this.fontWeight,
      leading: this.leading,
      letterSpacing: this.letterSpacing,
      lineHeight: this.lineHeight,
      padding: this.padding,
      stroke: this._stroke,
      textBaseline: this.textBaseline,
      whiteSpace: this.whiteSpace,
      wordWrap: this.wordWrap,
      wordWrapWidth: this.wordWrapWidth
    });
  }
  /**
   * Destroys this text style.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.texture=false] - Should it destroy the texture of the this style
   * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the this style
   */
  destroy(t = !1) {
    var e, r, s, n;
    if (this.removeAllListeners(), typeof t == "boolean" ? t : t == null ? void 0 : t.texture) {
      const o = typeof t == "boolean" ? t : t == null ? void 0 : t.textureSource;
      (e = this._fill) != null && e.texture && this._fill.texture.destroy(o), (r = this._originalFill) != null && r.texture && this._originalFill.texture.destroy(o), (s = this._stroke) != null && s.texture && this._stroke.texture.destroy(o), (n = this._originalStroke) != null && n.texture && this._originalStroke.texture.destroy(o);
    }
    this._fill = null, this._stroke = null, this.dropShadow = null, this._originalStroke = null, this._originalFill = null;
  }
  _createProxy(t, e) {
    return new Proxy(t, {
      set: (r, s, n) => (r[s] = n, e == null || e(s, n), this.update(), !0)
    });
  }
  _isFillStyle(t) {
    return (t ?? null) !== null && !(gt.isColorLike(t) || t instanceof Sr || t instanceof Tn);
  }
};
Oo.defaultDropShadow = {
  /** Set alpha for the drop shadow */
  alpha: 1,
  /** Set a angle of the drop shadow */
  angle: Math.PI / 6,
  /** Set a shadow blur radius */
  blur: 0,
  /** A fill style to be used on the  e.g., 'red', '#00FF00' */
  color: "black",
  /** Set a distance of the drop shadow */
  distance: 5
};
Oo.defaultTextStyle = {
  /**
   * See {@link TextStyle.align}
   * @type {'left'|'center'|'right'|'justify'}
   */
  align: "left",
  /** See {@link TextStyle.breakWords} */
  breakWords: !1,
  /** See {@link TextStyle.dropShadow} */
  dropShadow: null,
  /**
   * See {@link TextStyle.fill}
   * @type {string|string[]|number|number[]|CanvasGradient|CanvasPattern}
   */
  fill: "black",
  /**
   * See {@link TextStyle.fontFamily}
   * @type {string|string[]}
   */
  fontFamily: "Arial",
  /**
   * See {@link TextStyle.fontSize}
   * @type {number|string}
   */
  fontSize: 26,
  /**
   * See {@link TextStyle.fontStyle}
   * @type {'normal'|'italic'|'oblique'}
   */
  fontStyle: "normal",
  /**
   * See {@link TextStyle.fontVariant}
   * @type {'normal'|'small-caps'}
   */
  fontVariant: "normal",
  /**
   * See {@link TextStyle.fontWeight}
   * @type {'normal'|'bold'|'bolder'|'lighter'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'}
   */
  fontWeight: "normal",
  /** See {@link TextStyle.leading} */
  leading: 0,
  /** See {@link TextStyle.letterSpacing} */
  letterSpacing: 0,
  /** See {@link TextStyle.lineHeight} */
  lineHeight: 0,
  /** See {@link TextStyle.padding} */
  padding: 0,
  /**
   * See {@link TextStyle.stroke}
   * @type {string|number}
   */
  stroke: null,
  /**
   * See {@link TextStyle.textBaseline}
   * @type {'alphabetic'|'top'|'hanging'|'middle'|'ideographic'|'bottom'}
   */
  textBaseline: "alphabetic",
  /** See {@link TextStyle.trim} */
  trim: !1,
  /**
   * See {@link TextStyle.whiteSpace}
   * @type {'normal'|'pre'|'pre-line'}
   */
  whiteSpace: "pre",
  /** See {@link TextStyle.wordWrap} */
  wordWrap: !1,
  /** See {@link TextStyle.wordWrapWidth} */
  wordWrapWidth: 100
};
let pi = Oo;
function _m(i) {
  const t = i;
  if (typeof t.dropShadow == "boolean" && t.dropShadow) {
    const e = pi.defaultDropShadow;
    i.dropShadow = {
      alpha: t.dropShadowAlpha ?? e.alpha,
      angle: t.dropShadowAngle ?? e.angle,
      blur: t.dropShadowBlur ?? e.blur,
      color: t.dropShadowColor ?? e.color,
      distance: t.dropShadowDistance ?? e.distance
    };
  }
  if (t.strokeThickness !== void 0) {
    X(q, "strokeThickness is now a part of stroke");
    const e = t.stroke;
    let r = {};
    if (gt.isColorLike(e))
      r.color = e;
    else if (e instanceof Sr || e instanceof Tn)
      r.fill = e;
    else if (Object.hasOwnProperty.call(e, "color") || Object.hasOwnProperty.call(e, "fill"))
      r = e;
    else
      throw new Error("Invalid stroke value.");
    i.stroke = {
      ...r,
      width: t.strokeThickness
    };
  }
  if (Array.isArray(t.fillGradientStops)) {
    X(q, "gradient fill is now a fill pattern: `new FillGradient(...)`");
    let e;
    i.fontSize == null ? i.fontSize = pi.defaultTextStyle.fontSize : typeof i.fontSize == "string" ? e = parseInt(i.fontSize, 10) : e = i.fontSize;
    const r = new Sr(0, 0, 0, e * 1.7), s = t.fillGradientStops.map((n) => gt.shared.setValue(n).toNumber());
    s.forEach((n, o) => {
      const a = o / (s.length - 1);
      r.addColorStop(a, n);
    }), i.fill = {
      fill: r
    };
  }
}
class wm {
  constructor(t) {
    this._canvasPool = /* @__PURE__ */ Object.create(null), this.canvasOptions = t || {}, this.enableFullScreen = !1;
  }
  /**
   * Creates texture with params that were specified in pool constructor.
   * @param pixelWidth - Width of texture in pixels.
   * @param pixelHeight - Height of texture in pixels.
   */
  _createCanvasAndContext(t, e) {
    const r = at.get().createCanvas();
    r.width = t, r.height = e;
    const s = r.getContext("2d");
    return { canvas: r, context: s };
  }
  /**
   * Gets a Power-of-Two render texture or fullScreen texture
   * @param minWidth - The minimum width of the render texture.
   * @param minHeight - The minimum height of the render texture.
   * @param resolution - The resolution of the render texture.
   * @returns The new render texture.
   */
  getOptimalCanvasAndContext(t, e, r = 1) {
    t = Math.ceil(t * r - 1e-6), e = Math.ceil(e * r - 1e-6), t = fa(t), e = fa(e);
    const s = (t << 17) + (e << 1);
    this._canvasPool[s] || (this._canvasPool[s] = []);
    let n = this._canvasPool[s].pop();
    return n || (n = this._createCanvasAndContext(t, e)), n;
  }
  /**
   * Place a render texture back into the pool.
   * @param canvasAndContext
   */
  returnCanvasAndContext(t) {
    const e = t.canvas, { width: r, height: s } = e, n = (r << 17) + (s << 1);
    t.context.clearRect(0, 0, r, s), this._canvasPool[n].push(t);
  }
  clear() {
    this._canvasPool = {};
  }
}
const yh = new wm(), Am = [
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui"
];
function io(i) {
  const t = typeof i.fontSize == "number" ? `${i.fontSize}px` : i.fontSize;
  let e = i.fontFamily;
  Array.isArray(i.fontFamily) || (e = i.fontFamily.split(","));
  for (let r = e.length - 1; r >= 0; r--) {
    let s = e[r].trim();
    !/([\"\'])[^\'\"]+\1/.test(s) && !Am.includes(s) && (s = `"${s}"`), e[r] = s;
  }
  return `${i.fontStyle} ${i.fontVariant} ${i.fontWeight} ${t} ${e.join(",")}`;
}
const As = {
  // TextMetrics requires getImageData readback for measuring fonts.
  willReadFrequently: !0
}, ue = class z {
  /**
   * Checking that we can use modern canvas 2D API.
   *
   * Note: This is an unstable API, Chrome < 94 use `textLetterSpacing`, later versions use `letterSpacing`.
   * @see TextMetrics.experimentalLetterSpacing
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ICanvasRenderingContext2D/letterSpacing
   * @see https://developer.chrome.com/origintrials/#/view_trial/3585991203293757441
   */
  static get experimentalLetterSpacingSupported() {
    let t = z._experimentalLetterSpacingSupported;
    if (t !== void 0) {
      const e = at.get().getCanvasRenderingContext2D().prototype;
      t = z._experimentalLetterSpacingSupported = "letterSpacing" in e || "textLetterSpacing" in e;
    }
    return t;
  }
  /**
   * @param text - the text that was measured
   * @param style - the style that was measured
   * @param width - the measured width of the text
   * @param height - the measured height of the text
   * @param lines - an array of the lines of text broken by new lines and wrapping if specified in style
   * @param lineWidths - an array of the line widths for each line matched to `lines`
   * @param lineHeight - the measured line height for this style
   * @param maxLineWidth - the maximum line width for all measured lines
   * @param {FontMetrics} fontProperties - the font properties object from TextMetrics.measureFont
   */
  constructor(t, e, r, s, n, o, a, h, c) {
    this.text = t, this.style = e, this.width = r, this.height = s, this.lines = n, this.lineWidths = o, this.lineHeight = a, this.maxLineWidth = h, this.fontProperties = c;
  }
  /**
   * Measures the supplied string of text and returns a Rectangle.
   * @param text - The text to measure.
   * @param style - The text style to use for measuring
   * @param canvas - optional specification of the canvas to use for measuring.
   * @param wordWrap
   * @returns Measured width and height of the text.
   */
  static measureText(t = " ", e, r = z._canvas, s = e.wordWrap) {
    var n;
    const o = `${t}:${e.styleKey}`;
    if (z._measurementCache[o])
      return z._measurementCache[o];
    const a = io(e), h = z.measureFont(a);
    h.fontSize === 0 && (h.fontSize = e.fontSize, h.ascent = e.fontSize);
    const c = z.__context;
    c.font = a;
    const l = (s ? z._wordWrap(t, e, r) : t).split(/(?:\r\n|\r|\n)/), f = new Array(l.length);
    let p = 0;
    for (let y = 0; y < l.length; y++) {
      const v = z._measureText(l[y], e.letterSpacing, c);
      f[y] = v, p = Math.max(p, v);
    }
    const u = ((n = e._stroke) == null ? void 0 : n.width) || 0;
    let d = p + u;
    e.dropShadow && (d += e.dropShadow.distance);
    const m = e.lineHeight || h.fontSize;
    let g = Math.max(m, h.fontSize + u) + (l.length - 1) * (m + e.leading);
    return e.dropShadow && (g += e.dropShadow.distance), new z(
      t,
      e,
      d,
      g,
      l,
      f,
      m + e.leading,
      p,
      h
    );
  }
  static _measureText(t, e, r) {
    let s = !1;
    z.experimentalLetterSpacingSupported && (z.experimentalLetterSpacing ? (r.letterSpacing = `${e}px`, r.textLetterSpacing = `${e}px`, s = !0) : (r.letterSpacing = "0px", r.textLetterSpacing = "0px"));
    const n = r.measureText(t);
    let o = n.width;
    const a = -n.actualBoundingBoxLeft;
    let h = n.actualBoundingBoxRight - a;
    if (o > 0)
      if (s)
        o -= e, h -= e;
      else {
        const c = (z.graphemeSegmenter(t).length - 1) * e;
        o += c, h += c;
      }
    return Math.max(o, h);
  }
  /**
   * Applies newlines to a string to have it optimally fit into the horizontal
   * bounds set by the Text object's wordWrapWidth property.
   * @param text - String to apply word wrapping to
   * @param style - the style to use when wrapping
   * @param canvas - optional specification of the canvas to use for measuring.
   * @returns New string with new lines applied where required
   */
  static _wordWrap(t, e, r = z._canvas) {
    const s = r.getContext("2d", As);
    let n = 0, o = "", a = "";
    const h = /* @__PURE__ */ Object.create(null), { letterSpacing: c, whiteSpace: l } = e, f = z._collapseSpaces(l), p = z._collapseNewlines(l);
    let u = !f;
    const d = e.wordWrapWidth + c, m = z._tokenize(t);
    for (let g = 0; g < m.length; g++) {
      let y = m[g];
      if (z._isNewline(y)) {
        if (!p) {
          a += z._addLine(o), u = !f, o = "", n = 0;
          continue;
        }
        y = " ";
      }
      if (f) {
        const _ = z.isBreakingSpace(y), w = z.isBreakingSpace(o[o.length - 1]);
        if (_ && w)
          continue;
      }
      const v = z._getFromCache(y, c, h, s);
      if (v > d)
        if (o !== "" && (a += z._addLine(o), o = "", n = 0), z.canBreakWords(y, e.breakWords)) {
          const _ = z.wordWrapSplit(y);
          for (let w = 0; w < _.length; w++) {
            let x = _[w], A = x, S = 1;
            for (; _[w + S]; ) {
              const C = _[w + S];
              if (!z.canBreakChars(A, C, y, w, e.breakWords))
                x += C;
              else
                break;
              A = C, S++;
            }
            w += S - 1;
            const b = z._getFromCache(x, c, h, s);
            b + n > d && (a += z._addLine(o), u = !1, o = "", n = 0), o += x, n += b;
          }
        } else {
          o.length > 0 && (a += z._addLine(o), o = "", n = 0);
          const _ = g === m.length - 1;
          a += z._addLine(y, !_), u = !1, o = "", n = 0;
        }
      else
        v + n > d && (u = !1, a += z._addLine(o), o = "", n = 0), (o.length > 0 || !z.isBreakingSpace(y) || u) && (o += y, n += v);
    }
    return a += z._addLine(o, !1), a;
  }
  /**
   * Convenience function for logging each line added during the wordWrap method.
   * @param line    - The line of text to add
   * @param newLine - Add new line character to end
   * @returns A formatted line
   */
  static _addLine(t, e = !0) {
    return t = z._trimRight(t), t = e ? `${t}
` : t, t;
  }
  /**
   * Gets & sets the widths of calculated characters in a cache object
   * @param key            - The key
   * @param letterSpacing  - The letter spacing
   * @param cache          - The cache
   * @param context        - The canvas context
   * @returns The from cache.
   */
  static _getFromCache(t, e, r, s) {
    let n = r[t];
    return typeof n != "number" && (n = z._measureText(t, e, s) + e, r[t] = n), n;
  }
  /**
   * Determines whether we should collapse breaking spaces.
   * @param whiteSpace - The TextStyle property whiteSpace
   * @returns Should collapse
   */
  static _collapseSpaces(t) {
    return t === "normal" || t === "pre-line";
  }
  /**
   * Determines whether we should collapse newLine chars.
   * @param whiteSpace - The white space
   * @returns should collapse
   */
  static _collapseNewlines(t) {
    return t === "normal";
  }
  /**
   * Trims breaking whitespaces from string.
   * @param text - The text
   * @returns Trimmed string
   */
  static _trimRight(t) {
    if (typeof t != "string")
      return "";
    for (let e = t.length - 1; e >= 0; e--) {
      const r = t[e];
      if (!z.isBreakingSpace(r))
        break;
      t = t.slice(0, -1);
    }
    return t;
  }
  /**
   * Determines if char is a newline.
   * @param char - The character
   * @returns True if newline, False otherwise.
   */
  static _isNewline(t) {
    return typeof t != "string" ? !1 : z._newlines.includes(t.charCodeAt(0));
  }
  /**
   * Determines if char is a breaking whitespace.
   *
   * It allows one to determine whether char should be a breaking whitespace
   * For example certain characters in CJK langs or numbers.
   * It must return a boolean.
   * @param char - The character
   * @param [_nextChar] - The next character
   * @returns True if whitespace, False otherwise.
   */
  static isBreakingSpace(t, e) {
    return typeof t != "string" ? !1 : z._breakingSpaces.includes(t.charCodeAt(0));
  }
  /**
   * Splits a string into words, breaking-spaces and newLine characters
   * @param text - The text
   * @returns A tokenized array
   */
  static _tokenize(t) {
    const e = [];
    let r = "";
    if (typeof t != "string")
      return e;
    for (let s = 0; s < t.length; s++) {
      const n = t[s], o = t[s + 1];
      if (z.isBreakingSpace(n, o) || z._isNewline(n)) {
        r !== "" && (e.push(r), r = ""), e.push(n);
        continue;
      }
      r += n;
    }
    return r !== "" && e.push(r), e;
  }
  /**
   * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
   *
   * It allows one to customise which words should break
   * Examples are if the token is CJK or numbers.
   * It must return a boolean.
   * @param _token - The token
   * @param breakWords - The style attr break words
   * @returns Whether to break word or not
   */
  static canBreakWords(t, e) {
    return e;
  }
  /**
   * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
   *
   * It allows one to determine whether a pair of characters
   * should be broken by newlines
   * For example certain characters in CJK langs or numbers.
   * It must return a boolean.
   * @param _char - The character
   * @param _nextChar - The next character
   * @param _token - The token/word the characters are from
   * @param _index - The index in the token of the char
   * @param _breakWords - The style attr break words
   * @returns whether to break word or not
   */
  static canBreakChars(t, e, r, s, n) {
    return !0;
  }
  /**
   * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
   *
   * It is called when a token (usually a word) has to be split into separate pieces
   * in order to determine the point to break a word.
   * It must return an array of characters.
   * @param token - The token to split
   * @returns The characters of the token
   * @see CanvasTextMetrics.graphemeSegmenter
   */
  static wordWrapSplit(t) {
    return z.graphemeSegmenter(t);
  }
  /**
   * Calculates the ascent, descent and fontSize of a given font-style
   * @param font - String representing the style of the font
   * @returns Font properties object
   */
  static measureFont(t) {
    if (z._fonts[t])
      return z._fonts[t];
    const e = z._context;
    e.font = t;
    const r = e.measureText(z.METRICS_STRING + z.BASELINE_SYMBOL), s = {
      ascent: r.actualBoundingBoxAscent,
      descent: r.actualBoundingBoxDescent,
      fontSize: r.actualBoundingBoxAscent + r.actualBoundingBoxDescent
    };
    return z._fonts[t] = s, s;
  }
  /**
   * Clear font metrics in metrics cache.
   * @param {string} [font] - font name. If font name not set then clear cache for all fonts.
   */
  static clearMetrics(t = "") {
    t ? delete z._fonts[t] : z._fonts = {};
  }
  /**
   * Cached canvas element for measuring text
   * TODO: this should be private, but isn't because of backward compat, will fix later.
   * @ignore
   */
  static get _canvas() {
    if (!z.__canvas) {
      let t;
      try {
        const e = new OffscreenCanvas(0, 0), r = e.getContext("2d", As);
        if (r != null && r.measureText)
          return z.__canvas = e, e;
        t = at.get().createCanvas();
      } catch {
        t = at.get().createCanvas();
      }
      t.width = t.height = 10, z.__canvas = t;
    }
    return z.__canvas;
  }
  /**
   * TODO: this should be private, but isn't because of backward compat, will fix later.
   * @ignore
   */
  static get _context() {
    return z.__context || (z.__context = z._canvas.getContext("2d", As)), z.__context;
  }
};
ue.METRICS_STRING = "|ÉqÅ";
ue.BASELINE_SYMBOL = "M";
ue.BASELINE_MULTIPLIER = 1.4;
ue.HEIGHT_MULTIPLIER = 2;
ue.graphemeSegmenter = (() => {
  if (typeof (Intl == null ? void 0 : Intl.Segmenter) == "function") {
    const i = new Intl.Segmenter();
    return (t) => [...i.segment(t)].map((e) => e.segment);
  }
  return (i) => [...i];
})();
ue.experimentalLetterSpacing = !1;
ue._fonts = {};
ue._newlines = [
  10,
  // line feed
  13
  // carriage return
];
ue._breakingSpaces = [
  9,
  // character tabulation
  32,
  // space
  8192,
  // en quad
  8193,
  // em quad
  8194,
  // en space
  8195,
  // em space
  8196,
  // three-per-em space
  8197,
  // four-per-em space
  8198,
  // six-per-em space
  8200,
  // punctuation space
  8201,
  // thin space
  8202,
  // hair space
  8287,
  // medium mathematical space
  12288
  // ideographic space
];
ue._measurementCache = {};
let ro = ue;
function xh(i, t) {
  if (i.texture === H.WHITE && !i.fill)
    return gt.shared.setValue(i.color).setAlpha(i.alpha ?? 1).toHexa();
  if (i.fill) {
    if (i.fill instanceof Tn) {
      const e = i.fill, r = t.createPattern(e.texture.source.resource, "repeat"), s = e.transform.copyTo(K.shared);
      return s.scale(
        e.texture.frame.width,
        e.texture.frame.height
      ), r.setTransform(s), r;
    } else if (i.fill instanceof Sr) {
      const e = i.fill;
      if (e.type === "linear") {
        const r = t.createLinearGradient(
          e.x0,
          e.y0,
          e.x1,
          e.y1
        );
        return e.gradientStops.forEach((s) => {
          r.addColorStop(s.offset, gt.shared.setValue(s.color).toHex());
        }), r;
      }
    }
  } else {
    const e = t.createPattern(i.texture.source.resource, "repeat"), r = i.matrix.copyTo(K.shared);
    return r.scale(i.texture.frame.width, i.texture.frame.height), e.setTransform(r), e;
  }
  return dt("FillStyle not recognised", i), "red";
}
function cc(i) {
  if (i === "")
    return [];
  typeof i == "string" && (i = [i]);
  const t = [];
  for (let e = 0, r = i.length; e < r; e++) {
    const s = i[e];
    if (Array.isArray(s)) {
      if (s.length !== 2)
        throw new Error(`[BitmapFont]: Invalid character range length, expecting 2 got ${s.length}.`);
      if (s[0].length === 0 || s[1].length === 0)
        throw new Error("[BitmapFont]: Invalid character delimiter.");
      const n = s[0].charCodeAt(0), o = s[1].charCodeAt(0);
      if (o < n)
        throw new Error("[BitmapFont]: Invalid character range.");
      for (let a = n, h = o; a <= h; a++)
        t.push(String.fromCharCode(a));
    } else
      t.push(...Array.from(s));
  }
  if (t.length === 0)
    throw new Error("[BitmapFont]: Empty set when resolving characters.");
  return t;
}
const uc = class dc extends Nl {
  /**
   * @param options - The options for the dynamic bitmap font.
   */
  constructor(t) {
    super(), this.resolution = 1, this.pages = [], this._padding = 0, this._measureCache = /* @__PURE__ */ Object.create(null), this._currentChars = [], this._currentX = 0, this._currentY = 0, this._currentPageIndex = -1, this._skipKerning = !1;
    const e = { ...dc.defaultOptions, ...t };
    this._textureSize = e.textureSize, this._mipmap = e.mipmap;
    const r = e.style.clone();
    e.overrideFill && (r._fill.color = 16777215, r._fill.alpha = 1, r._fill.texture = H.WHITE, r._fill.fill = null), this.applyFillAsTint = e.overrideFill;
    const s = r.fontSize;
    r.fontSize = this.baseMeasurementFontSize;
    const n = io(r);
    e.overrideSize ? r._stroke && (r._stroke.width *= this.baseRenderedFontSize / s) : r.fontSize = this.baseRenderedFontSize = s, this._style = r, this._skipKerning = e.skipKerning ?? !1, this.resolution = e.resolution ?? 1, this._padding = e.padding ?? 4, this.fontMetrics = ro.measureFont(n), this.lineHeight = r.lineHeight || this.fontMetrics.fontSize || r.fontSize;
  }
  ensureCharacters(t) {
    var e, r;
    const s = cc(t).filter((g) => !this._currentChars.includes(g)).filter((g, y, v) => v.indexOf(g) === y);
    if (!s.length)
      return;
    this._currentChars = [...this._currentChars, ...s];
    let n;
    this._currentPageIndex === -1 ? n = this._nextPage() : n = this.pages[this._currentPageIndex];
    let { canvas: o, context: a } = n.canvasAndContext, h = n.texture.source;
    const c = this._style;
    let l = this._currentX, f = this._currentY;
    const p = this.baseRenderedFontSize / this.baseMeasurementFontSize, u = this._padding * p;
    let d = 0, m = !1;
    for (let g = 0; g < s.length; g++) {
      const y = s[g], v = ro.measureText(y, c, o, !1), _ = Math.ceil((c.fontStyle === "italic" ? 2 : 1) * v.width);
      v.lineHeight = v.height;
      const w = v.width * p, x = v.height * p, A = _ + u * 2, S = x + u * 2;
      if (m = !1, y !== `
` && y !== "\r" && y !== "	" && y !== " " && (m = !0, d = Math.ceil(Math.max(S, d))), l + A > this._textureSize && (f += d, d = S, l = 0, f + d > this._textureSize)) {
        h.update();
        const C = this._nextPage();
        o = C.canvasAndContext.canvas, a = C.canvasAndContext.context, h = C.texture.source, f = 0;
      }
      const b = w / p - (((e = c.dropShadow) == null ? void 0 : e.distance) ?? 0) - (((r = c._stroke) == null ? void 0 : r.width) ?? 0);
      if (this.chars[y] = {
        id: y.codePointAt(0),
        xOffset: -this._padding,
        yOffset: -this._padding,
        xAdvance: b,
        kerning: {}
      }, m) {
        this._drawGlyph(
          a,
          v,
          l + u,
          f + u,
          p,
          c
        );
        const C = h.width * p, P = h.height * p, k = new mt(
          l / C * h.width,
          f / P * h.height,
          A / C * h.width,
          S / P * h.height
        );
        this.chars[y].texture = new H({
          source: h,
          frame: k
        }), l += Math.ceil(A);
      }
    }
    h.update(), this._currentX = l, this._currentY = f, this._skipKerning && this._applyKerning(s, a);
  }
  /**
   * @deprecated since 8.0.0
   * The map of base page textures (i.e., sheets of glyphs).
   */
  get pageTextures() {
    return X(q, "BitmapFont.pageTextures is deprecated, please use BitmapFont.pages instead."), this.pages;
  }
  _applyKerning(t, e) {
    const r = this._measureCache;
    for (let s = 0; s < t.length; s++) {
      const n = t[s];
      for (let o = 0; o < this._currentChars.length; o++) {
        const a = this._currentChars[o];
        let h = r[n];
        h || (h = r[n] = e.measureText(n).width);
        let c = r[a];
        c || (c = r[a] = e.measureText(a).width);
        let l = e.measureText(n + a).width, f = l - (h + c);
        f && (this.chars[n].kerning[a] = f), l = e.measureText(n + a).width, f = l - (h + c), f && (this.chars[a].kerning[n] = f);
      }
    }
  }
  _nextPage() {
    this._currentPageIndex++;
    const t = this.resolution, e = yh.getOptimalCanvasAndContext(
      this._textureSize,
      this._textureSize,
      t
    );
    this._setupContext(e.context, this._style, t);
    const r = t * (this.baseRenderedFontSize / this.baseMeasurementFontSize), s = new H({
      source: new Ni({
        resource: e.canvas,
        resolution: r,
        alphaMode: "premultiply-alpha-on-upload",
        autoGenerateMipmaps: this._mipmap
      })
    }), n = {
      canvasAndContext: e,
      texture: s
    };
    return this.pages[this._currentPageIndex] = n, n;
  }
  // canvas style!
  _setupContext(t, e, r) {
    e.fontSize = this.baseRenderedFontSize, t.scale(r, r), t.font = io(e), e.fontSize = this.baseMeasurementFontSize, t.textBaseline = e.textBaseline;
    const s = e._stroke, n = (s == null ? void 0 : s.width) ?? 0;
    if (s && (t.lineWidth = n, t.lineJoin = s.join, t.miterLimit = s.miterLimit, t.strokeStyle = xh(s, t)), e._fill && (t.fillStyle = xh(e._fill, t)), e.dropShadow) {
      const o = e.dropShadow, a = gt.shared.setValue(o.color).toArray(), h = o.blur * r, c = o.distance * r;
      t.shadowColor = `rgba(${a[0] * 255},${a[1] * 255},${a[2] * 255},${o.alpha})`, t.shadowBlur = h, t.shadowOffsetX = Math.cos(o.angle) * c, t.shadowOffsetY = Math.sin(o.angle) * c;
    } else
      t.shadowColor = "black", t.shadowBlur = 0, t.shadowOffsetX = 0, t.shadowOffsetY = 0;
  }
  _drawGlyph(t, e, r, s, n, o) {
    const a = e.text, h = e.fontProperties, c = o._stroke, l = ((c == null ? void 0 : c.width) ?? 0) * n, f = r + l / 2, p = s - l / 2, u = h.descent * n, d = e.lineHeight * n;
    o.stroke && l && t.strokeText(a, f, p + d - u), o._fill && t.fillText(a, f, p + d - u);
  }
  destroy() {
    super.destroy();
    for (let t = 0; t < this.pages.length; t++) {
      const { canvasAndContext: e, texture: r } = this.pages[t];
      yh.returnCanvasAndContext(e), r.destroy(!0);
    }
    this.pages = null;
  }
};
uc.defaultOptions = {
  textureSize: 512,
  style: new pi(),
  mipmap: !0
};
let vh = uc;
function Sm(i, t, e, r) {
  const s = {
    width: 0,
    height: 0,
    offsetY: 0,
    scale: t.fontSize / e.baseMeasurementFontSize,
    lines: [{
      width: 0,
      charPositions: [],
      spaceWidth: 0,
      spacesIndex: [],
      chars: []
    }]
  };
  s.offsetY = e.baseLineOffset;
  let n = s.lines[0], o = null, a = !0;
  const h = {
    spaceWord: !1,
    width: 0,
    start: 0,
    index: 0,
    // use index to not modify the array as we use it a lot!
    positions: [],
    chars: []
  }, c = (d) => {
    const m = n.width;
    for (let g = 0; g < h.index; g++) {
      const y = d.positions[g];
      n.chars.push(d.chars[g]), n.charPositions.push(y + m);
    }
    n.width += d.width, a = !1, h.width = 0, h.index = 0, h.chars.length = 0;
  }, l = () => {
    let d = n.chars.length - 1;
    if (r) {
      let m = n.chars[d];
      for (; m === " "; )
        n.width -= e.chars[m].xAdvance, m = n.chars[--d];
    }
    s.width = Math.max(s.width, n.width), n = {
      width: 0,
      charPositions: [],
      chars: [],
      spaceWidth: 0,
      spacesIndex: []
    }, a = !0, s.lines.push(n), s.height += e.lineHeight;
  }, f = e.baseMeasurementFontSize / t.fontSize, p = t.letterSpacing * f, u = t.wordWrapWidth * f;
  for (let d = 0; d < i.length + 1; d++) {
    let m;
    const g = d === i.length;
    g || (m = i[d]);
    const y = e.chars[m] || e.chars[" "];
    if (/(?:\s)/.test(m) || m === "\r" || m === `
` || g) {
      if (!a && t.wordWrap && n.width + h.width - p > u ? (l(), c(h), g || n.charPositions.push(0)) : (h.start = n.width, c(h), g || n.charPositions.push(0)), m === "\r" || m === `
`)
        n.width !== 0 && l();
      else if (!g) {
        const v = y.xAdvance + (y.kerning[o] || 0) + p;
        n.width += v, n.spaceWidth = v, n.spacesIndex.push(n.charPositions.length), n.chars.push(m);
      }
    } else {
      const v = y.kerning[o] || 0, _ = y.xAdvance + v + p;
      h.positions[h.index++] = h.width + v, h.chars.push(m), h.width += _;
    }
    o = m;
  }
  return l(), t.align === "center" ? Cm(s) : t.align === "right" ? Pm(s) : t.align === "justify" && km(s), s;
}
function Cm(i) {
  for (let t = 0; t < i.lines.length; t++) {
    const e = i.lines[t], r = i.width / 2 - e.width / 2;
    for (let s = 0; s < e.charPositions.length; s++)
      e.charPositions[s] += r;
  }
}
function Pm(i) {
  for (let t = 0; t < i.lines.length; t++) {
    const e = i.lines[t], r = i.width - e.width;
    for (let s = 0; s < e.charPositions.length; s++)
      e.charPositions[s] += r;
  }
}
function km(i) {
  const t = i.width;
  for (let e = 0; e < i.lines.length; e++) {
    const r = i.lines[e];
    let s = 0, n = r.spacesIndex[s++], o = 0;
    const a = r.spacesIndex.length, h = (t - r.width) / a;
    for (let c = 0; c < r.charPositions.length; c++)
      c === n && (n = r.spacesIndex[s++], o += h), r.charPositions[c] += o;
  }
}
let Jr = 0;
class Mm {
  constructor() {
    this.ALPHA = [["a", "z"], ["A", "Z"], " "], this.NUMERIC = [["0", "9"]], this.ALPHANUMERIC = [["a", "z"], ["A", "Z"], ["0", "9"], " "], this.ASCII = [[" ", "~"]], this.defaultOptions = {
      chars: this.ALPHANUMERIC,
      resolution: 1,
      padding: 4,
      skipKerning: !1
    };
  }
  /**
   * Get a font for the specified text and style.
   * @param text - The text to get the font for
   * @param style - The style to use
   */
  getFont(t, e) {
    var r;
    let s = `${e.fontFamily}-bitmap`, n = !0;
    if (e._fill.fill && !e._stroke)
      s += e._fill.fill.styleKey, n = !1;
    else if (e._stroke || e.dropShadow) {
      let a = e.styleKey;
      a = a.substring(0, a.lastIndexOf("-")), s = `${a}-bitmap`, n = !1;
    }
    if (!nt.has(s)) {
      const a = new vh({
        style: e,
        overrideFill: n,
        overrideSize: !0,
        ...this.defaultOptions
      });
      Jr++, Jr > 50 && dt("BitmapText", `You have dynamically created ${Jr} bitmap fonts, this can be inefficient. Try pre installing your font styles using \`BitmapFont.install({name:"style1", style})\``), a.once("destroy", () => {
        Jr--, nt.remove(s);
      }), nt.set(
        s,
        a
      );
    }
    const o = nt.get(s);
    return (r = o.ensureCharacters) == null || r.call(o, t), o;
  }
  /**
   * Get the layout of a text for the specified style.
   * @param text - The text to get the layout for
   * @param style - The style to use
   * @param trimEnd - Whether to ignore whitespaces at the end of each line
   */
  getLayout(t, e, r = !0) {
    const s = this.getFont(t, e);
    return Sm([...t], e, s, r);
  }
  /**
   * Measure the text using the specified style.
   * @param text - The text to measure
   * @param style - The style to use
   * @param trimEnd - Whether to ignore whitespaces at the end of each line
   */
  measureText(t, e, r = !0) {
    return this.getLayout(t, e, r);
  }
  // eslint-disable-next-line max-len
  install(...t) {
    var e, r, s, n;
    let o = t[0];
    typeof o == "string" && (o = {
      name: o,
      style: t[1],
      chars: (e = t[2]) == null ? void 0 : e.chars,
      resolution: (r = t[2]) == null ? void 0 : r.resolution,
      padding: (s = t[2]) == null ? void 0 : s.padding,
      skipKerning: (n = t[2]) == null ? void 0 : n.skipKerning
    }, X(q, "BitmapFontManager.install(name, style, options) is deprecated, use BitmapFontManager.install({name, style, ...options})"));
    const a = o == null ? void 0 : o.name;
    if (!a)
      throw new Error("[BitmapFontManager] Property `name` is required.");
    o = { ...this.defaultOptions, ...o };
    const h = o.style, c = h instanceof pi ? h : new pi(h), l = c._fill.fill !== null && c._fill.fill !== void 0, f = new vh({
      style: c,
      overrideFill: l,
      skipKerning: o.skipKerning,
      padding: o.padding,
      resolution: o.resolution,
      overrideSize: !1
    }), p = cc(o.chars);
    return f.ensureCharacters(p.join("")), nt.set(`${a}-bitmap`, f), f.once("destroy", () => nt.remove(`${a}-bitmap`)), f;
  }
  /**
   * Uninstalls a bitmap font from the cache.
   * @param {string} name - The name of the bitmap font to uninstall.
   */
  uninstall(t) {
    const e = `${t}-bitmap`, r = nt.get(e);
    r && r.destroy();
  }
}
const no = new Mm();
class pc extends Nl {
  constructor(t, e) {
    super();
    const { textures: r, data: s } = t;
    Object.keys(s.pages).forEach((n) => {
      const o = s.pages[parseInt(n, 10)], a = r[o.id];
      this.pages.push({ texture: a });
    }), Object.keys(s.chars).forEach((n) => {
      const o = s.chars[n], {
        frame: a,
        source: h
      } = r[o.page], c = new mt(
        o.x + a.x,
        o.y + a.y,
        o.width,
        o.height
      ), l = new H({
        source: h,
        frame: c
      });
      this.chars[n] = {
        id: n.codePointAt(0),
        xOffset: o.xOffset,
        yOffset: o.yOffset,
        xAdvance: o.xAdvance,
        kerning: o.kerning ?? {},
        texture: l
      };
    }), this.baseRenderedFontSize = s.fontSize, this.baseMeasurementFontSize = s.fontSize, this.fontMetrics = {
      ascent: 0,
      descent: 0,
      fontSize: s.fontSize
    }, this.baseLineOffset = s.baseLineOffset, this.lineHeight = s.lineHeight, this.fontFamily = s.fontFamily, this.distanceField = s.distanceField ?? {
      type: "none",
      range: 0
    }, this.url = e;
  }
  /** Destroys the BitmapFont object. */
  destroy() {
    super.destroy();
    for (let t = 0; t < this.pages.length; t++) {
      const { texture: e } = this.pages[t];
      e.destroy(!0);
    }
    this.pages = null;
  }
  /**
   * Generates a bitmap-font for the given style and character set
   * @param options - Setup options for font generation.
   * @returns Font generated by style options.
   * @example
   * import { BitmapFont, BitmapText } from 'pixi.js';
   *
   * BitmapFont.install('TitleFont', {
   *     fontFamily: 'Arial',
   *     fontSize: 12,
   *     strokeThickness: 2,
   *     fill: 'purple',
   * });
   *
   * const title = new BitmapText({ text: 'This is the title', fontFamily: 'TitleFont' });
   */
  static install(t) {
    no.install(t);
  }
  /**
   * Uninstalls a bitmap font from the cache.
   * @param {string} name - The name of the bitmap font to uninstall.
   */
  static uninstall(t) {
    no.uninstall(t);
  }
}
const Ss = {
  test(i) {
    return typeof i == "string" && i.startsWith("info face=");
  },
  parse(i) {
    const t = i.match(/^[a-z]+\s+.+$/gm), e = {
      info: [],
      common: [],
      page: [],
      char: [],
      chars: [],
      kerning: [],
      kernings: [],
      distanceField: []
    };
    for (const f in t) {
      const p = t[f].match(/^[a-z]+/gm)[0], u = t[f].match(/[a-zA-Z]+=([^\s"']+|"([^"]*)")/gm), d = {};
      for (const m in u) {
        const g = u[m].split("="), y = g[0], v = g[1].replace(/"/gm, ""), _ = parseFloat(v), w = isNaN(_) ? v : _;
        d[y] = w;
      }
      e[p].push(d);
    }
    const r = {
      chars: {},
      pages: [],
      lineHeight: 0,
      fontSize: 0,
      fontFamily: "",
      distanceField: null,
      baseLineOffset: 0
    }, [s] = e.info, [n] = e.common, [o] = e.distanceField ?? [];
    o && (r.distanceField = {
      range: parseInt(o.distanceRange, 10),
      type: o.fieldType
    }), r.fontSize = parseInt(s.size, 10), r.fontFamily = s.face, r.lineHeight = parseInt(n.lineHeight, 10);
    const a = e.page;
    for (let f = 0; f < a.length; f++)
      r.pages.push({
        id: parseInt(a[f].id, 10) || 0,
        file: a[f].file
      });
    const h = {};
    r.baseLineOffset = r.lineHeight - parseInt(n.base, 10);
    const c = e.char;
    for (let f = 0; f < c.length; f++) {
      const p = c[f], u = parseInt(p.id, 10);
      let d = p.letter ?? p.char ?? String.fromCharCode(u);
      d === "space" && (d = " "), h[u] = d, r.chars[d] = {
        id: u,
        // texture deets..
        page: parseInt(p.page, 10) || 0,
        x: parseInt(p.x, 10),
        y: parseInt(p.y, 10),
        width: parseInt(p.width, 10),
        height: parseInt(p.height, 10),
        xOffset: parseInt(p.xoffset, 10),
        yOffset: parseInt(p.yoffset, 10),
        xAdvance: parseInt(p.xadvance, 10),
        kerning: {}
      };
    }
    const l = e.kerning || [];
    for (let f = 0; f < l.length; f++) {
      const p = parseInt(l[f].first, 10), u = parseInt(l[f].second, 10), d = parseInt(l[f].amount, 10);
      r.chars[h[u]].kerning[h[p]] = d;
    }
    return r;
  }
}, bh = {
  test(i) {
    const t = i;
    return typeof t != "string" && "getElementsByTagName" in t && t.getElementsByTagName("page").length && t.getElementsByTagName("info")[0].getAttribute("face") !== null;
  },
  parse(i) {
    const t = {
      chars: {},
      pages: [],
      lineHeight: 0,
      fontSize: 0,
      fontFamily: "",
      distanceField: null,
      baseLineOffset: 0
    }, e = i.getElementsByTagName("info")[0], r = i.getElementsByTagName("common")[0], s = i.getElementsByTagName("distanceField")[0];
    s && (t.distanceField = {
      type: s.getAttribute("fieldType"),
      range: parseInt(s.getAttribute("distanceRange"), 10)
    });
    const n = i.getElementsByTagName("page"), o = i.getElementsByTagName("char"), a = i.getElementsByTagName("kerning");
    t.fontSize = parseInt(e.getAttribute("size"), 10), t.fontFamily = e.getAttribute("face"), t.lineHeight = parseInt(r.getAttribute("lineHeight"), 10);
    for (let c = 0; c < n.length; c++)
      t.pages.push({
        id: parseInt(n[c].getAttribute("id"), 10) || 0,
        file: n[c].getAttribute("file")
      });
    const h = {};
    t.baseLineOffset = t.lineHeight - parseInt(r.getAttribute("base"), 10);
    for (let c = 0; c < o.length; c++) {
      const l = o[c], f = parseInt(l.getAttribute("id"), 10);
      let p = l.getAttribute("letter") ?? l.getAttribute("char") ?? String.fromCharCode(f);
      p === "space" && (p = " "), h[f] = p, t.chars[p] = {
        id: f,
        // texture deets..
        page: parseInt(l.getAttribute("page"), 10) || 0,
        x: parseInt(l.getAttribute("x"), 10),
        y: parseInt(l.getAttribute("y"), 10),
        width: parseInt(l.getAttribute("width"), 10),
        height: parseInt(l.getAttribute("height"), 10),
        // render deets..
        xOffset: parseInt(l.getAttribute("xoffset"), 10),
        yOffset: parseInt(l.getAttribute("yoffset"), 10),
        // + baseLineOffset,
        xAdvance: parseInt(l.getAttribute("xadvance"), 10),
        kerning: {}
      };
    }
    for (let c = 0; c < a.length; c++) {
      const l = parseInt(a[c].getAttribute("first"), 10), f = parseInt(a[c].getAttribute("second"), 10), p = parseInt(a[c].getAttribute("amount"), 10);
      t.chars[h[f]].kerning[h[l]] = p;
    }
    return t;
  }
}, _h = {
  test(i) {
    return typeof i == "string" && i.includes("<font>") ? bh.test(at.get().parseXML(i)) : !1;
  },
  parse(i) {
    return bh.parse(at.get().parseXML(i));
  }
}, Tm = [".xml", ".fnt"], Em = {
  extension: {
    type: D.CacheParser,
    name: "cacheBitmapFont"
  },
  test: (i) => i instanceof pc,
  getCacheableAssets(i, t) {
    const e = {};
    return i.forEach((r) => {
      e[r] = t, e[`${r}-bitmap`] = t;
    }), e[`${t.fontFamily}-bitmap`] = t, e;
  }
}, Bm = {
  extension: {
    type: D.LoadParser,
    priority: Fe.Normal
  },
  name: "loadBitmapFont",
  test(i) {
    return Tm.includes(Ct.extname(i).toLowerCase());
  },
  async testParse(i) {
    return Ss.test(i) || _h.test(i);
  },
  async parse(i, t, e) {
    const r = Ss.test(i) ? Ss.parse(i) : _h.parse(i), { src: s } = t, { pages: n } = r, o = [], a = r.distanceField ? {
      scaleMode: "linear",
      alphaMode: "premultiply-alpha-on-upload",
      autoGenerateMipmaps: !1,
      resolution: 1
    } : {};
    for (let l = 0; l < n.length; ++l) {
      const f = n[l].file;
      let p = Ct.join(Ct.dirname(s), f);
      p = js(p, s), o.push({
        src: p,
        data: a
      });
    }
    const h = await e.load(o), c = o.map((l) => h[l.src]);
    return new pc({
      data: r,
      textures: c
    }, s);
  },
  async load(i, t) {
    return await (await at.get().fetch(i)).text();
  },
  async unload(i, t, e) {
    await Promise.all(i.pages.map((r) => e.unload(r.texture.source._sourceOrigin))), i.destroy();
  }
};
class Rm {
  /**
   * @param loader
   * @param verbose - should the loader log to the console
   */
  constructor(t, e = !1) {
    this._loader = t, this._assetList = [], this._isLoading = !1, this._maxConcurrent = 1, this.verbose = e;
  }
  /**
   * Adds an array of assets to load.
   * @param assetUrls - assets to load
   */
  add(t) {
    t.forEach((e) => {
      this._assetList.push(e);
    }), this.verbose && console.log("[BackgroundLoader] assets: ", this._assetList), this._isActive && !this._isLoading && this._next();
  }
  /**
   * Loads the next set of assets. Will try to load as many assets as it can at the same time.
   *
   * The max assets it will try to load at one time will be 4.
   */
  async _next() {
    if (this._assetList.length && this._isActive) {
      this._isLoading = !0;
      const t = [], e = Math.min(this._assetList.length, this._maxConcurrent);
      for (let r = 0; r < e; r++)
        t.push(this._assetList.pop());
      await this._loader.load(t), this._isLoading = !1, this._next();
    }
  }
  /**
   * Activate/Deactivate the loading. If set to true then it will immediately continue to load the next asset.
   * @returns whether the class is active
   */
  get active() {
    return this._isActive;
  }
  set active(t) {
    this._isActive !== t && (this._isActive = t, t && !this._isLoading && this._next());
  }
}
const Im = {
  extension: {
    type: D.CacheParser,
    name: "cacheTextureArray"
  },
  test: (i) => Array.isArray(i) && i.every((t) => t instanceof H),
  getCacheableAssets: (i, t) => {
    const e = {};
    return i.forEach((r) => {
      t.forEach((s, n) => {
        e[r + (n === 0 ? "" : n + 1)] = s;
      });
    }), e;
  }
};
async function fc(i) {
  if ("Image" in globalThis)
    return new Promise((t) => {
      const e = new Image();
      e.onload = () => {
        t(!0);
      }, e.onerror = () => {
        t(!1);
      }, e.src = i;
    });
  if ("createImageBitmap" in globalThis && "fetch" in globalThis) {
    try {
      const t = await (await fetch(i)).blob();
      await createImageBitmap(t);
    } catch {
      return !1;
    }
    return !0;
  }
  return !1;
}
const Om = {
  extension: {
    type: D.DetectionParser,
    priority: 1
  },
  test: async () => fc(
    // eslint-disable-next-line max-len
    "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A="
  ),
  add: async (i) => [...i, "avif"],
  remove: async (i) => i.filter((t) => t !== "avif")
}, wh = ["png", "jpg", "jpeg"], Fm = {
  extension: {
    type: D.DetectionParser,
    priority: -1
  },
  test: () => Promise.resolve(!0),
  add: async (i) => [...i, ...wh],
  remove: async (i) => i.filter((t) => !wh.includes(t))
}, Lm = "WorkerGlobalScope" in globalThis && globalThis instanceof globalThis.WorkerGlobalScope;
function Fo(i) {
  return Lm ? !1 : document.createElement("video").canPlayType(i) !== "";
}
const zm = {
  extension: {
    type: D.DetectionParser,
    priority: 0
  },
  test: async () => Fo("video/mp4"),
  add: async (i) => [...i, "mp4", "m4v"],
  remove: async (i) => i.filter((t) => t !== "mp4" && t !== "m4v")
}, Dm = {
  extension: {
    type: D.DetectionParser,
    priority: 0
  },
  test: async () => Fo("video/ogg"),
  add: async (i) => [...i, "ogv"],
  remove: async (i) => i.filter((t) => t !== "ogv")
}, Um = {
  extension: {
    type: D.DetectionParser,
    priority: 0
  },
  test: async () => Fo("video/webm"),
  add: async (i) => [...i, "webm"],
  remove: async (i) => i.filter((t) => t !== "webm")
}, Gm = {
  extension: {
    type: D.DetectionParser,
    priority: 0
  },
  test: async () => fc(
    "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA="
  ),
  add: async (i) => [...i, "webp"],
  remove: async (i) => i.filter((t) => t !== "webp")
};
class Vm {
  constructor() {
    this._parsers = [], this._parsersValidated = !1, this.parsers = new Proxy(this._parsers, {
      set: (t, e, r) => (this._parsersValidated = !1, t[e] = r, !0)
    }), this.promiseCache = {};
  }
  /** function used for testing */
  reset() {
    this._parsersValidated = !1, this.promiseCache = {};
  }
  /**
   * Used internally to generate a promise for the asset to be loaded.
   * @param url - The URL to be loaded
   * @param data - any custom additional information relevant to the asset being loaded
   * @returns - a promise that will resolve to an Asset for example a Texture of a JSON object
   */
  _getLoadPromiseAndParser(t, e) {
    const r = {
      promise: null,
      parser: null
    };
    return r.promise = (async () => {
      var s, n;
      let o = null, a = null;
      if (e.loadParser && (a = this._parserHash[e.loadParser], a || dt(`[Assets] specified load parser "${e.loadParser}" not found while loading ${t}`)), !a) {
        for (let h = 0; h < this.parsers.length; h++) {
          const c = this.parsers[h];
          if (c.load && (s = c.test) != null && s.call(c, t, e, this)) {
            a = c;
            break;
          }
        }
        if (!a)
          return dt(`[Assets] ${t} could not be loaded as we don't know how to parse it, ensure the correct parser has been added`), null;
      }
      o = await a.load(t, e, this), r.parser = a;
      for (let h = 0; h < this.parsers.length; h++) {
        const c = this.parsers[h];
        c.parse && c.parse && await ((n = c.testParse) == null ? void 0 : n.call(c, o, e, this)) && (o = await c.parse(o, e, this) || o, r.parser = c);
      }
      return o;
    })(), r;
  }
  async load(t, e) {
    this._parsersValidated || this._validateParsers();
    let r = 0;
    const s = {}, n = cn(t), o = he(t, (c) => ({
      alias: [c],
      src: c,
      data: {}
    })), a = o.length, h = o.map(async (c) => {
      const l = Ct.toAbsolute(c.src);
      if (!s[c.src])
        try {
          this.promiseCache[l] || (this.promiseCache[l] = this._getLoadPromiseAndParser(l, c)), s[c.src] = await this.promiseCache[l].promise, e && e(++r / a);
        } catch (f) {
          throw delete this.promiseCache[l], delete s[c.src], new Error(`[Loader.load] Failed to load ${l}.
${f}`);
        }
    });
    return await Promise.all(h), n ? s[o[0].src] : s;
  }
  /**
   * Unloads one or more assets. Any unloaded assets will be destroyed, freeing up memory for your app.
   * The parser that created the asset, will be the one that unloads it.
   * @example
   * // Single asset:
   * const asset = await Loader.load('cool.png');
   *
   * await Loader.unload('cool.png');
   *
   * console.log(asset.destroyed); // true
   * @param assetsToUnloadIn - urls that you want to unload, or a single one!
   */
  async unload(t) {
    const e = he(t, (r) => ({
      alias: [r],
      src: r
    })).map(async (r) => {
      var s, n;
      const o = Ct.toAbsolute(r.src), a = this.promiseCache[o];
      if (a) {
        const h = await a.promise;
        delete this.promiseCache[o], await ((n = (s = a.parser) == null ? void 0 : s.unload) == null ? void 0 : n.call(s, h, r, this));
      }
    });
    await Promise.all(e);
  }
  /** validates our parsers, right now it only checks for name conflicts but we can add more here as required! */
  _validateParsers() {
    this._parsersValidated = !0, this._parserHash = this._parsers.filter((t) => t.name).reduce((t, e) => (e.name ? t[e.name] && dt(`[Assets] loadParser name conflict "${e.name}"`) : dt("[Assets] loadParser should have a name"), { ...t, [e.name]: e }), {});
  }
}
function Yi(i, t) {
  if (Array.isArray(t)) {
    for (const e of t)
      if (i.startsWith(`data:${e}`))
        return !0;
    return !1;
  }
  return i.startsWith(`data:${t}`);
}
function Xi(i, t) {
  const e = i.split("?")[0], r = Ct.extname(e).toLowerCase();
  return Array.isArray(t) ? t.includes(r) : r === t;
}
const Hm = ".json", jm = "application/json", Nm = {
  extension: {
    type: D.LoadParser,
    priority: Fe.Low
  },
  name: "loadJson",
  test(i) {
    return Yi(i, jm) || Xi(i, Hm);
  },
  async load(i) {
    return await (await at.get().fetch(i)).json();
  }
}, Wm = ".txt", Ym = "text/plain", Xm = {
  name: "loadTxt",
  extension: {
    type: D.LoadParser,
    priority: Fe.Low,
    name: "loadTxt"
  },
  test(i) {
    return Yi(i, Ym) || Xi(i, Wm);
  },
  async load(i) {
    return await (await at.get().fetch(i)).text();
  }
}, qm = [
  "normal",
  "bold",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900"
], Km = [".ttf", ".otf", ".woff", ".woff2"], Qm = [
  "font/ttf",
  "font/otf",
  "font/woff",
  "font/woff2"
], Jm = /^(--|-?[A-Z_])[0-9A-Z_-]*$/i;
function Zm(i) {
  const t = Ct.extname(i), e = Ct.basename(i, t).replace(/(-|_)/g, " ").toLowerCase().split(" ").map((n) => n.charAt(0).toUpperCase() + n.slice(1));
  let r = e.length > 0;
  for (const n of e)
    if (!n.match(Jm)) {
      r = !1;
      break;
    }
  let s = e.join(" ");
  return r || (s = `"${s.replace(/[\\"]/g, "\\$&")}"`), s;
}
const $m = /^[0-9A-Za-z%:/?#\[\]@!\$&'()\*\+,;=\-._~]*$/;
function tg(i) {
  return $m.test(i) ? i : encodeURI(i);
}
const eg = {
  extension: {
    type: D.LoadParser,
    priority: Fe.Low
  },
  name: "loadWebFont",
  test(i) {
    return Yi(i, Qm) || Xi(i, Km);
  },
  async load(i, t) {
    var e, r, s;
    const n = at.get().getFontFaceSet();
    if (n) {
      const o = [], a = ((e = t.data) == null ? void 0 : e.family) ?? Zm(i), h = ((s = (r = t.data) == null ? void 0 : r.weights) == null ? void 0 : s.filter((l) => qm.includes(l))) ?? ["normal"], c = t.data ?? {};
      for (let l = 0; l < h.length; l++) {
        const f = h[l], p = new FontFace(a, `url(${tg(i)})`, {
          ...c,
          weight: f
        });
        await p.load(), n.add(p), o.push(p);
      }
      return nt.set(`${a}-and-url`, {
        url: i,
        fontFaces: o
      }), o.length === 1 ? o[0] : o;
    }
    return dt("[loadWebFont] FontFace API is not supported. Skipping loading font"), null;
  },
  unload(i) {
    (Array.isArray(i) ? i : [i]).forEach((t) => {
      nt.remove(t.family), at.get().getFontFaceSet().delete(t);
    });
  }
};
function Lo(i, t = 1) {
  var e;
  const r = (e = Wi.RETINA_PREFIX) == null ? void 0 : e.exec(i);
  return r ? parseFloat(r[1]) : t;
}
function zo(i, t, e) {
  i.label = e, i._sourceOrigin = e;
  const r = new H({
    source: i,
    label: e
  }), s = () => {
    delete t.promiseCache[e], nt.has(e) && nt.remove(e);
  };
  return r.source.once("destroy", () => {
    t.promiseCache[e] && (dt("[Assets] A TextureSource managed by Assets was destroyed instead of unloaded! Use Assets.unload() instead of destroying the TextureSource."), s());
  }), r.once("destroy", () => {
    i.destroyed || (dt("[Assets] A Texture managed by Assets was destroyed instead of unloaded! Use Assets.unload() instead of destroying the Texture."), s());
  }), r;
}
const ig = ".svg", rg = "image/svg+xml", ng = {
  extension: {
    type: D.LoadParser,
    priority: Fe.Low,
    name: "loadSVG"
  },
  name: "loadSVG",
  config: {
    crossOrigin: "anonymous",
    parseAsGraphicsContext: !1
  },
  test(i) {
    return Yi(i, rg) || Xi(i, ig);
  },
  async load(i, t, e) {
    return t.data.parseAsGraphicsContext ?? this.config.parseAsGraphicsContext ? og(i) : sg(i, t, e, this.config.crossOrigin);
  },
  unload(i) {
    i.destroy(!0);
  }
};
async function sg(i, t, e, r) {
  var s, n, o;
  const a = await (await at.get().fetch(i)).blob(), h = URL.createObjectURL(a), c = new Image();
  c.src = h, c.crossOrigin = r, await c.decode(), URL.revokeObjectURL(h);
  const l = document.createElement("canvas"), f = l.getContext("2d"), p = ((s = t.data) == null ? void 0 : s.resolution) || Lo(i), u = ((n = t.data) == null ? void 0 : n.width) ?? c.width, d = ((o = t.data) == null ? void 0 : o.height) ?? c.height;
  l.width = u * p, l.height = d * p, f.drawImage(c, 0, 0, u * p, d * p);
  const { parseAsGraphicsContext: m, ...g } = t.data, y = new Ni({
    resource: l,
    alphaMode: "premultiply-alpha-on-upload",
    resolution: p,
    ...g
  });
  return zo(y, e, i);
}
async function og(i) {
  const t = await (await at.get().fetch(i)).text(), e = new Zt();
  return e.svg(t), e;
}
const ag = `(function () {
    'use strict';

    const WHITE_PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=";
    async function checkImageBitmap() {
      try {
        if (typeof createImageBitmap !== "function")
          return false;
        const response = await fetch(WHITE_PNG);
        const imageBlob = await response.blob();
        const imageBitmap = await createImageBitmap(imageBlob);
        return imageBitmap.width === 1 && imageBitmap.height === 1;
      } catch (e) {
        return false;
      }
    }
    void checkImageBitmap().then((result) => {
      self.postMessage(result);
    });

})();
`;
let Ei = null, so = class {
  constructor() {
    Ei || (Ei = URL.createObjectURL(new Blob([ag], { type: "application/javascript" }))), this.worker = new Worker(Ei);
  }
};
so.revokeObjectURL = function() {
  Ei && (URL.revokeObjectURL(Ei), Ei = null);
};
const hg = `(function () {
    'use strict';

    async function loadImageBitmap(url, alphaMode) {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(\`[WorkerManager.loadImageBitmap] Failed to fetch \${url}: \${response.status} \${response.statusText}\`);
      }
      const imageBlob = await response.blob();
      return alphaMode === "premultiplied-alpha" ? createImageBitmap(imageBlob, { premultiplyAlpha: "none" }) : createImageBitmap(imageBlob);
    }
    self.onmessage = async (event) => {
      try {
        const imageBitmap = await loadImageBitmap(event.data.data[0], event.data.data[1]);
        self.postMessage({
          data: imageBitmap,
          uuid: event.data.uuid,
          id: event.data.id
        }, [imageBitmap]);
      } catch (e) {
        self.postMessage({
          error: e,
          uuid: event.data.uuid,
          id: event.data.id
        });
      }
    };

})();
`;
let Bi = null;
class mc {
  constructor() {
    Bi || (Bi = URL.createObjectURL(new Blob([hg], { type: "application/javascript" }))), this.worker = new Worker(Bi);
  }
}
mc.revokeObjectURL = function() {
  Bi && (URL.revokeObjectURL(Bi), Bi = null);
};
let Ah = 0, Cs;
class lg {
  constructor() {
    this._initialized = !1, this._createdWorkers = 0, this._workerPool = [], this._queue = [], this._resolveHash = {};
  }
  isImageBitmapSupported() {
    return this._isImageBitmapSupported !== void 0 ? this._isImageBitmapSupported : (this._isImageBitmapSupported = new Promise((t) => {
      const { worker: e } = new so();
      e.addEventListener("message", (r) => {
        e.terminate(), so.revokeObjectURL(), t(r.data);
      });
    }), this._isImageBitmapSupported);
  }
  loadImageBitmap(t, e) {
    var r;
    return this._run("loadImageBitmap", [t, (r = e == null ? void 0 : e.data) == null ? void 0 : r.alphaMode]);
  }
  async _initWorkers() {
    this._initialized || (this._initialized = !0);
  }
  _getWorker() {
    Cs === void 0 && (Cs = navigator.hardwareConcurrency || 4);
    let t = this._workerPool.pop();
    return !t && this._createdWorkers < Cs && (this._createdWorkers++, t = new mc().worker, t.addEventListener("message", (e) => {
      this._complete(e.data), this._returnWorker(e.target), this._next();
    })), t;
  }
  _returnWorker(t) {
    this._workerPool.push(t);
  }
  _complete(t) {
    t.error !== void 0 ? this._resolveHash[t.uuid].reject(t.error) : this._resolveHash[t.uuid].resolve(t.data), this._resolveHash[t.uuid] = null;
  }
  async _run(t, e) {
    await this._initWorkers();
    const r = new Promise((s, n) => {
      this._queue.push({ id: t, arguments: e, resolve: s, reject: n });
    });
    return this._next(), r;
  }
  _next() {
    if (!this._queue.length)
      return;
    const t = this._getWorker();
    if (!t)
      return;
    const e = this._queue.pop(), r = e.id;
    this._resolveHash[Ah] = { resolve: e.resolve, reject: e.reject }, t.postMessage({
      data: e.arguments,
      uuid: Ah++,
      id: r
    });
  }
}
const Sh = new lg(), cg = [".jpeg", ".jpg", ".png", ".webp", ".avif"], ug = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif"
];
async function dg(i, t) {
  var e;
  const r = await at.get().fetch(i);
  if (!r.ok)
    throw new Error(`[loadImageBitmap] Failed to fetch ${i}: ${r.status} ${r.statusText}`);
  const s = await r.blob();
  return ((e = t == null ? void 0 : t.data) == null ? void 0 : e.alphaMode) === "premultiplied-alpha" ? createImageBitmap(s, { premultiplyAlpha: "none" }) : createImageBitmap(s);
}
const gc = {
  name: "loadTextures",
  extension: {
    type: D.LoadParser,
    priority: Fe.High,
    name: "loadTextures"
  },
  config: {
    preferWorkers: !0,
    preferCreateImageBitmap: !0,
    crossOrigin: "anonymous"
  },
  test(i) {
    return Yi(i, ug) || Xi(i, cg);
  },
  async load(i, t, e) {
    var r;
    let s = null;
    globalThis.createImageBitmap && this.config.preferCreateImageBitmap ? this.config.preferWorkers && await Sh.isImageBitmapSupported() ? s = await Sh.loadImageBitmap(i, t) : s = await dg(i, t) : s = await new Promise((o) => {
      s = new Image(), s.crossOrigin = this.config.crossOrigin, s.src = i, s.complete ? o(s) : s.onload = () => {
        o(s);
      };
    });
    const n = new Ni({
      resource: s,
      alphaMode: "premultiply-alpha-on-upload",
      resolution: ((r = t.data) == null ? void 0 : r.resolution) || Lo(i),
      ...t.data
    });
    return zo(n, e, i);
  },
  unload(i) {
    i.destroy(!0);
  }
}, yc = [".mp4", ".m4v", ".webm", ".ogg", ".ogv", ".h264", ".avi", ".mov"], pg = yc.map((i) => `video/${i.substring(1)}`);
function fg(i, t, e) {
  e === void 0 && !t.startsWith("data:") ? i.crossOrigin = gg(t) : e !== !1 && (i.crossOrigin = typeof e == "string" ? e : "anonymous");
}
function mg(i) {
  return new Promise((t, e) => {
    i.addEventListener("canplaythrough", r), i.addEventListener("error", s), i.load();
    function r() {
      n(), t();
    }
    function s(o) {
      n(), e(o);
    }
    function n() {
      i.removeEventListener("canplaythrough", r), i.removeEventListener("error", s);
    }
  });
}
function gg(i, t = globalThis.location) {
  if (i.startsWith("data:"))
    return "";
  t = t || globalThis.location;
  const e = new URL(i, document.baseURI);
  return e.hostname !== t.hostname || e.port !== t.port || e.protocol !== t.protocol ? "anonymous" : "";
}
const yg = {
  name: "loadVideo",
  extension: {
    type: D.LoadParser,
    name: "loadVideo"
  },
  test(i) {
    const t = Yi(i, pg), e = Xi(i, yc);
    return t || e;
  },
  async load(i, t, e) {
    var r, s;
    const n = {
      ...tn.defaultOptions,
      resolution: ((r = t.data) == null ? void 0 : r.resolution) || Lo(i),
      alphaMode: ((s = t.data) == null ? void 0 : s.alphaMode) || await bl(),
      ...t.data
    }, o = document.createElement("video"), a = {
      preload: n.autoLoad !== !1 ? "auto" : void 0,
      "webkit-playsinline": n.playsinline !== !1 ? "" : void 0,
      playsinline: n.playsinline !== !1 ? "" : void 0,
      muted: n.muted === !0 ? "" : void 0,
      loop: n.loop === !0 ? "" : void 0,
      autoplay: n.autoPlay !== !1 ? "" : void 0
    };
    Object.keys(a).forEach((l) => {
      const f = a[l];
      f !== void 0 && o.setAttribute(l, f);
    }), n.muted === !0 && (o.muted = !0), fg(o, i, n.crossorigin);
    const h = document.createElement("source");
    let c;
    if (i.startsWith("data:"))
      c = i.slice(5, i.indexOf(";"));
    else if (!i.startsWith("blob:")) {
      const l = i.split("?")[0].slice(i.lastIndexOf(".") + 1).toLowerCase();
      c = tn.MIME_TYPES[l] || `video/${l}`;
    }
    return h.src = i, c && (h.type = c), new Promise((l) => {
      const f = async () => {
        const p = new tn({ ...n, resource: o });
        o.removeEventListener("canplay", f), t.data.preload && await mg(o), l(zo(p, e, i));
      };
      o.addEventListener("canplay", f), o.appendChild(h);
    });
  },
  unload(i) {
    i.destroy(!0);
  }
}, xc = {
  extension: {
    type: D.ResolveParser,
    name: "resolveTexture"
  },
  test: gc.test,
  parse: (i) => {
    var t;
    return {
      resolution: parseFloat(((t = Wi.RETINA_PREFIX.exec(i)) == null ? void 0 : t[1]) ?? "1"),
      format: i.split(".").pop(),
      src: i
    };
  }
}, xg = {
  extension: {
    type: D.ResolveParser,
    priority: -2,
    name: "resolveJson"
  },
  test: (i) => Wi.RETINA_PREFIX.test(i) && i.endsWith(".json"),
  parse: xc.parse
};
class vg {
  constructor() {
    this._detections = [], this._initialized = !1, this.resolver = new Wi(), this.loader = new Vm(), this.cache = nt, this._backgroundLoader = new Rm(this.loader), this._backgroundLoader.active = !0, this.reset();
  }
  /**
   * Best practice is to call this function before any loading commences
   * Initiating is the best time to add any customization to the way things are loaded.
   *
   * you do not need to call this for the Assets class to work, only if you want to set any initial properties
   * @param options - options to initialize the Assets manager with
   */
  async init(t = {}) {
    var e, r;
    if (this._initialized) {
      dt("[Assets]AssetManager already initialized, did you load before calling this Assets.init()?");
      return;
    }
    if (this._initialized = !0, t.defaultSearchParams && this.resolver.setDefaultSearchParams(t.defaultSearchParams), t.basePath && (this.resolver.basePath = t.basePath), t.bundleIdentifier && this.resolver.setBundleIdentifier(t.bundleIdentifier), t.manifest) {
      let a = t.manifest;
      typeof a == "string" && (a = await this.load(a)), this.resolver.addManifest(a);
    }
    const s = ((e = t.texturePreference) == null ? void 0 : e.resolution) ?? 1, n = typeof s == "number" ? [s] : s, o = await this._detectFormats({
      preferredFormats: (r = t.texturePreference) == null ? void 0 : r.format,
      skipDetections: t.skipDetections,
      detections: this._detections
    });
    this.resolver.prefer({
      params: {
        format: o,
        resolution: n
      }
    }), t.preferences && this.setPreferences(t.preferences);
  }
  /**
   * Allows you to specify how to resolve any assets load requests.
   * There are a few ways to add things here as shown below:
   * @example
   * import { Assets } from 'pixi.js';
   *
   * // Simple
   * Assets.add({alias: 'bunnyBooBoo', src: 'bunny.png'});
   * const bunny = await Assets.load('bunnyBooBoo');
   *
   * // Multiple keys:
   * Assets.add({alias: ['burger', 'chicken'], src: 'bunny.png'});
   *
   * const bunny = await Assets.load('burger');
   * const bunny2 = await Assets.load('chicken');
   *
   * // passing options to to the object
   * Assets.add({
   *     alias: 'bunnyBooBooSmooth',
   *     src: 'bunny{png,webp}',
   *     data: { scaleMode: SCALE_MODES.NEAREST }, // Base texture options
   * });
   *
   * // Multiple assets
   *
   * // The following all do the same thing:
   *
   * Assets.add({alias: 'bunnyBooBoo', src: 'bunny{png,webp}'});
   *
   * Assets.add({
   *     alias: 'bunnyBooBoo',
   *     src: [
   *         'bunny.png',
   *         'bunny.webp',
   *    ],
   * });
   *
   * const bunny = await Assets.load('bunnyBooBoo'); // Will try to load WebP if available
   * @param assets - the unresolved assets to add to the resolver
   */
  add(t) {
    this.resolver.add(t);
  }
  async load(t, e) {
    this._initialized || await this.init();
    const r = cn(t), s = he(t).map((a) => {
      if (typeof a != "string") {
        const h = this.resolver.getAlias(a);
        return h.some((c) => !this.resolver.hasKey(c)) && this.add(a), Array.isArray(h) ? h[0] : h;
      }
      return this.resolver.hasKey(a) || this.add({ alias: a, src: a }), a;
    }), n = this.resolver.resolve(s), o = await this._mapLoadToResolve(n, e);
    return r ? o[s[0]] : o;
  }
  /**
   * This adds a bundle of assets in one go so that you can load them as a group.
   * For example you could add a bundle for each screen in you pixi app
   * @example
   * import { Assets } from 'pixi.js';
   *
   * Assets.addBundle('animals', [
   *  { alias: 'bunny', src: 'bunny.png' },
   *  { alias: 'chicken', src: 'chicken.png' },
   *  { alias: 'thumper', src: 'thumper.png' },
   * ]);
   * // or
   * Assets.addBundle('animals', {
   *     bunny: 'bunny.png',
   *     chicken: 'chicken.png',
   *     thumper: 'thumper.png',
   * });
   *
   * const assets = await Assets.loadBundle('animals');
   * @param bundleId - the id of the bundle to add
   * @param assets - a record of the asset or assets that will be chosen from when loading via the specified key
   */
  addBundle(t, e) {
    this.resolver.addBundle(t, e);
  }
  /**
   * Bundles are a way to load multiple assets at once.
   * If a manifest has been provided to the init function then you can load a bundle, or bundles.
   * you can also add bundles via `addBundle`
   * @example
   * import { Assets } from 'pixi.js';
   *
   * // Manifest Example
   * const manifest = {
   *     bundles: [
   *         {
   *             name: 'load-screen',
   *             assets: [
   *                 {
   *                     alias: 'background',
   *                     src: 'sunset.png',
   *                 },
   *                 {
   *                     alias: 'bar',
   *                     src: 'load-bar.{png,webp}',
   *                 },
   *             ],
   *         },
   *         {
   *             name: 'game-screen',
   *             assets: [
   *                 {
   *                     alias: 'character',
   *                     src: 'robot.png',
   *                 },
   *                 {
   *                     alias: 'enemy',
   *                     src: 'bad-guy.png',
   *                 },
   *             ],
   *         },
   *     ]
   * };
   *
   * await Assets.init({ manifest });
   *
   * // Load a bundle...
   * loadScreenAssets = await Assets.loadBundle('load-screen');
   * // Load another bundle...
   * gameScreenAssets = await Assets.loadBundle('game-screen');
   * @param bundleIds - the bundle id or ids to load
   * @param onProgress - Optional function that is called when progress on asset loading is made.
   * The function is passed a single parameter, `progress`, which represents the percentage (0.0 - 1.0)
   * of the assets loaded. Do not use this function to detect when assets are complete and available,
   * instead use the Promise returned by this function.
   * @returns all the bundles assets or a hash of assets for each bundle specified
   */
  async loadBundle(t, e) {
    this._initialized || await this.init();
    let r = !1;
    typeof t == "string" && (r = !0, t = [t]);
    const s = this.resolver.resolveBundle(t), n = {}, o = Object.keys(s);
    let a = 0, h = 0;
    const c = () => {
      e == null || e(++a / h);
    }, l = o.map((f) => {
      const p = s[f];
      return h += Object.keys(p).length, this._mapLoadToResolve(p, c).then((u) => {
        n[f] = u;
      });
    });
    return await Promise.all(l), r ? n[t[0]] : n;
  }
  /**
   * Initiate a background load of some assets. It will passively begin to load these assets in the background.
   * So when you actually come to loading them you will get a promise that resolves to the loaded assets immediately
   *
   * An example of this might be that you would background load game assets after your initial load.
   * then when you got to actually load your game screen assets when a player goes to the game - the loading
   * would already have stared or may even be complete, saving you having to show an interim load bar.
   * @example
   * import { Assets } from 'pixi.js';
   *
   * Assets.backgroundLoad('bunny.png');
   *
   * // later on in your app...
   * await Assets.loadBundle('bunny.png'); // Will resolve quicker as loading may have completed!
   * @param urls - the url / urls you want to background load
   */
  async backgroundLoad(t) {
    this._initialized || await this.init(), typeof t == "string" && (t = [t]);
    const e = this.resolver.resolve(t);
    this._backgroundLoader.add(Object.values(e));
  }
  /**
   * Initiate a background of a bundle, works exactly like backgroundLoad but for bundles.
   * this can only be used if the loader has been initiated with a manifest
   * @example
   * import { Assets } from 'pixi.js';
   *
   * await Assets.init({
   *     manifest: {
   *         bundles: [
   *             {
   *                 name: 'load-screen',
   *                 assets: [...],
   *             },
   *             ...
   *         ],
   *     },
   * });
   *
   * Assets.backgroundLoadBundle('load-screen');
   *
   * // Later on in your app...
   * await Assets.loadBundle('load-screen'); // Will resolve quicker as loading may have completed!
   * @param bundleIds - the bundleId / bundleIds you want to background load
   */
  async backgroundLoadBundle(t) {
    this._initialized || await this.init(), typeof t == "string" && (t = [t]);
    const e = this.resolver.resolveBundle(t);
    Object.values(e).forEach((r) => {
      this._backgroundLoader.add(Object.values(r));
    });
  }
  /**
   * Only intended for development purposes.
   * This will wipe the resolver and caches.
   * You will need to reinitialize the Asset
   */
  reset() {
    this.resolver.reset(), this.loader.reset(), this.cache.reset(), this._initialized = !1;
  }
  get(t) {
    if (typeof t == "string")
      return nt.get(t);
    const e = {};
    for (let r = 0; r < t.length; r++)
      e[r] = nt.get(t[r]);
    return e;
  }
  /**
   * helper function to map resolved assets back to loaded assets
   * @param resolveResults - the resolve results from the resolver
   * @param onProgress - the progress callback
   */
  async _mapLoadToResolve(t, e) {
    const r = [...new Set(Object.values(t))];
    this._backgroundLoader.active = !1;
    const s = await this.loader.load(r, e);
    this._backgroundLoader.active = !0;
    const n = {};
    return r.forEach((o) => {
      const a = s[o.src], h = [o.src];
      o.alias && h.push(...o.alias), h.forEach((c) => {
        n[c] = a;
      }), nt.set(h, a);
    }), n;
  }
  /**
   * Unload an asset or assets. As the Assets class is responsible for creating the assets via the `load` function
   * this will make sure to destroy any assets and release them from memory.
   * Once unloaded, you will need to load the asset again.
   *
   * Use this to help manage assets if you find that you have a large app and you want to free up memory.
   *
   * - it's up to you as the developer to make sure that textures are not actively being used when you unload them,
   * Pixi won't break but you will end up with missing assets. Not a good look for the user!
   * @example
   * import { Assets } from 'pixi.js';
   *
   * // Load a URL:
   * const myImageTexture = await Assets.load('http://some.url.com/image.png'); // => returns a texture
   *
   * await Assets.unload('http://some.url.com/image.png')
   *
   * // myImageTexture will be destroyed now.
   *
   * // Unload multiple assets:
   * const textures = await Assets.unload(['thumper', 'chicko']);
   * @param urls - the urls to unload
   */
  async unload(t) {
    this._initialized || await this.init();
    const e = he(t).map((s) => typeof s != "string" ? s.src : s), r = this.resolver.resolve(e);
    await this._unloadFromResolved(r);
  }
  /**
   * Bundles are a way to manage multiple assets at once.
   * this will unload all files in a bundle.
   *
   * once a bundle has been unloaded, you need to load it again to have access to the assets.
   * @example
   * import { Assets } from 'pixi.js';
   *
   * Assets.addBundle({
   *     'thumper': 'http://some.url.com/thumper.png',
   * })
   *
   * const assets = await Assets.loadBundle('thumper');
   *
   * // Now to unload...
   *
   * await Assets.unloadBundle('thumper');
   *
   * // All assets in the assets object will now have been destroyed and purged from the cache
   * @param bundleIds - the bundle id or ids to unload
   */
  async unloadBundle(t) {
    this._initialized || await this.init(), t = he(t);
    const e = this.resolver.resolveBundle(t), r = Object.keys(e).map((s) => this._unloadFromResolved(e[s]));
    await Promise.all(r);
  }
  async _unloadFromResolved(t) {
    const e = Object.values(t);
    e.forEach((r) => {
      nt.remove(r.src);
    }), await this.loader.unload(e);
  }
  /**
   * Detects the supported formats for the browser, and returns an array of supported formats, respecting
   * the users preferred formats order.
   * @param options - the options to use when detecting formats
   * @param options.preferredFormats - the preferred formats to use
   * @param options.skipDetections - if we should skip the detections altogether
   * @param options.detections - the detections to use
   * @returns - the detected formats
   */
  async _detectFormats(t) {
    let e = [];
    t.preferredFormats && (e = Array.isArray(t.preferredFormats) ? t.preferredFormats : [t.preferredFormats]);
    for (const r of t.detections)
      t.skipDetections || await r.test() ? e = await r.add(e) : t.skipDetections || (e = await r.remove(e));
    return e = e.filter((r, s) => e.indexOf(r) === s), e;
  }
  /** All the detection parsers currently added to the Assets class. */
  get detections() {
    return this._detections;
  }
  /**
   * General setter for preferences. This is a helper function to set preferences on all parsers.
   * @param preferences - the preferences to set
   */
  setPreferences(t) {
    this.loader.parsers.forEach((e) => {
      e.config && Object.keys(e.config).filter((r) => r in t).forEach((r) => {
        e.config[r] = t[r];
      });
    });
  }
}
const xe = new vg();
Mt.handleByList(D.LoadParser, xe.loader.parsers).handleByList(D.ResolveParser, xe.resolver.parsers).handleByList(D.CacheParser, xe.cache.parsers).handleByList(D.DetectionParser, xe.detections);
Mt.add(
  Im,
  Fm,
  Om,
  Gm,
  zm,
  Dm,
  Um,
  Nm,
  Xm,
  eg,
  ng,
  gc,
  yg,
  Bm,
  Em,
  xc,
  xg
);
const Ch = {
  loader: D.LoadParser,
  resolver: D.ResolveParser,
  cache: D.CacheParser,
  detection: D.DetectionParser
};
Mt.handle(D.Asset, (i) => {
  const t = i.ref;
  Object.entries(Ch).filter(([e]) => !!t[e]).forEach(([e, r]) => Mt.add(Object.assign(
    t[e],
    // Allow the function to optionally define it's own
    // ExtensionMetadata, the use cases here is priority for LoaderParsers
    { extension: t[e].extension ?? r }
  )));
}, (i) => {
  const t = i.ref;
  Object.keys(Ch).filter((e) => !!t[e]).forEach((e) => Mt.remove(t[e]));
});
class si extends Lr {
  /**
   * @param options - Options for the Graphics.
   */
  constructor(t) {
    t instanceof Zt && (t = { context: t });
    const { context: e, roundPixels: r, ...s } = t || {};
    super({
      label: "Graphics",
      ...s
    }), this.renderPipeId = "graphics", e ? this._context = e : this._context = this._ownedContext = new Zt(), this._context.on("update", this.onViewUpdate, this), this.allowChildren = !1, this.roundPixels = r ?? !1;
  }
  set context(t) {
    t !== this._context && (this._context.off("update", this.onViewUpdate, this), this._context = t, this._context.on("update", this.onViewUpdate, this), this.onViewUpdate());
  }
  get context() {
    return this._context;
  }
  /**
   * The local bounds of the graphic.
   * @type {rendering.Bounds}
   */
  get bounds() {
    return this._context.bounds;
  }
  /**
   * Adds the bounds of this object to the bounds object.
   * @param bounds - The output bounds object.
   */
  addBounds(t) {
    t.addBounds(this._context.bounds);
  }
  /**
   * Checks if the object contains the given point.
   * @param point - The point to check
   */
  containsPoint(t) {
    return this._context.containsPoint(t);
  }
  /**
   * Destroys this graphics renderable and optionally its context.
   * @param options - Options parameter. A boolean will act as if all options
   *
   * If the context was created by this graphics and `destroy(false)` or `destroy()` is called
   * then the context will still be destroyed.
   *
   * If you want to explicitly not destroy this context that this graphics created,
   * then you should pass destroy({ context: false })
   *
   * If the context was passed in as an argument to the constructor then it will not be destroyed
   * @param {boolean} [options.texture=false] - Should destroy the texture of the graphics context
   * @param {boolean} [options.textureSource=false] - Should destroy the texture source of the graphics context
   * @param {boolean} [options.context=false] - Should destroy the context
   */
  destroy(t) {
    this._ownedContext && !t ? this._ownedContext.destroy(t) : (t === !0 || (t == null ? void 0 : t.context) === !0) && this._context.destroy(t), this._ownedContext = null, this._context = null, super.destroy(t);
  }
  _callContextMethod(t, e) {
    return this.context[t](...e), this;
  }
  // --------------------------------------- GraphicsContext methods ---------------------------------------
  /**
   * Sets the current fill style of the graphics context. The fill style can be a color, gradient,
   * pattern, or a more complex style defined by a FillStyle object.
   * @param {FillInput} args - The fill style to apply. This can be a simple color, a gradient or
   * pattern object, or a FillStyle or ConvertedFillStyle object.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  setFillStyle(...t) {
    return this._callContextMethod("setFillStyle", t);
  }
  /**
   * Sets the current stroke style of the graphics context. Similar to fill styles, stroke styles can
   * encompass colors, gradients, patterns, or more detailed configurations via a StrokeStyle object.
   * @param {StrokeInput} args - The stroke style to apply. Can be defined as a color, a gradient or pattern,
   * or a StrokeStyle or ConvertedStrokeStyle object.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  setStrokeStyle(...t) {
    return this._callContextMethod("setStrokeStyle", t);
  }
  fill(...t) {
    return this._callContextMethod("fill", t);
  }
  /**
   * Strokes the current path with the current stroke style. This method can take an optional
   * FillStyle parameter to define the stroke's appearance, including its color, width, and other properties.
   * @param {FillStyle} args - (Optional) The stroke style to apply. Can be defined as a simple color or a more
   * complex style object. If omitted, uses the current stroke style.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  stroke(...t) {
    return this._callContextMethod("stroke", t);
  }
  texture(...t) {
    return this._callContextMethod("texture", t);
  }
  /**
   * Resets the current path. Any previous path and its commands are discarded and a new path is
   * started. This is typically called before beginning a new shape or series of drawing commands.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  beginPath() {
    return this._callContextMethod("beginPath", []);
  }
  /**
   * Applies a cutout to the last drawn shape. This is used to create holes or complex shapes by
   * subtracting a path from the previously drawn path. If a hole is not completely in a shape, it will
   * fail to cut correctly!
   */
  cut() {
    return this._callContextMethod("cut", []);
  }
  arc(...t) {
    return this._callContextMethod("arc", t);
  }
  arcTo(...t) {
    return this._callContextMethod("arcTo", t);
  }
  arcToSvg(...t) {
    return this._callContextMethod("arcToSvg", t);
  }
  bezierCurveTo(...t) {
    return this._callContextMethod("bezierCurveTo", t);
  }
  /**
   * Closes the current path by drawing a straight line back to the start.
   * If the shape is already closed or there are no points in the path, this method does nothing.
   * @returns The instance of the current object for chaining.
   */
  closePath() {
    return this._callContextMethod("closePath", []);
  }
  ellipse(...t) {
    return this._callContextMethod("ellipse", t);
  }
  circle(...t) {
    return this._callContextMethod("circle", t);
  }
  path(...t) {
    return this._callContextMethod("path", t);
  }
  lineTo(...t) {
    return this._callContextMethod("lineTo", t);
  }
  moveTo(...t) {
    return this._callContextMethod("moveTo", t);
  }
  quadraticCurveTo(...t) {
    return this._callContextMethod("quadraticCurveTo", t);
  }
  rect(...t) {
    return this._callContextMethod("rect", t);
  }
  roundRect(...t) {
    return this._callContextMethod("roundRect", t);
  }
  poly(...t) {
    return this._callContextMethod("poly", t);
  }
  regularPoly(...t) {
    return this._callContextMethod("regularPoly", t);
  }
  roundPoly(...t) {
    return this._callContextMethod("roundPoly", t);
  }
  roundShape(...t) {
    return this._callContextMethod("roundShape", t);
  }
  filletRect(...t) {
    return this._callContextMethod("filletRect", t);
  }
  chamferRect(...t) {
    return this._callContextMethod("chamferRect", t);
  }
  star(...t) {
    return this._callContextMethod("star", t);
  }
  svg(...t) {
    return this._callContextMethod("svg", t);
  }
  restore(...t) {
    return this._callContextMethod("restore", t);
  }
  /** Saves the current graphics state, including transformations, fill styles, and stroke styles, onto a stack. */
  save() {
    return this._callContextMethod("save", []);
  }
  /**
   * Returns the current transformation matrix of the graphics context.
   * @returns The current transformation matrix.
   */
  getTransform() {
    return this.context.getTransform();
  }
  /**
   * Resets the current transformation matrix to the identity matrix, effectively removing
   * any transformations (rotation, scaling, translation) previously applied.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  resetTransform() {
    return this._callContextMethod("resetTransform", []);
  }
  rotateTransform(...t) {
    return this._callContextMethod("rotate", t);
  }
  scaleTransform(...t) {
    return this._callContextMethod("scale", t);
  }
  setTransform(...t) {
    return this._callContextMethod("setTransform", t);
  }
  transform(...t) {
    return this._callContextMethod("transform", t);
  }
  translateTransform(...t) {
    return this._callContextMethod("translate", t);
  }
  /**
   * Clears all drawing commands from the graphics context, effectively resetting it. This includes clearing the path,
   * and optionally resetting transformations to the identity matrix.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  clear() {
    return this._callContextMethod("clear", []);
  }
  /**
   * The fill style to use.
   * @type {ConvertedFillStyle}
   */
  get fillStyle() {
    return this._context.fillStyle;
  }
  set fillStyle(t) {
    this._context.fillStyle = t;
  }
  /**
   * The stroke style to use.
   * @type {ConvertedStrokeStyle}
   */
  get strokeStyle() {
    return this._context.strokeStyle;
  }
  set strokeStyle(t) {
    this._context.strokeStyle = t;
  }
  /**
   * Creates a new Graphics object.
   * Note that only the context of the object is cloned, not its transform (position,scale,etc)
   * @param deep - Whether to create a deep clone of the graphics object. If false, the context
   * will be shared between the two objects (default false). If true, the context will be
   * cloned (recommended if you need to modify the context in any way).
   * @returns - A clone of the graphics object
   */
  clone(t = !1) {
    return t ? new si(this._context.clone()) : (this._ownedContext = null, new si(this._context));
  }
  // -------- v7 deprecations ---------
  /**
   * @param width
   * @param color
   * @param alpha
   * @deprecated since 8.0.0 Use {@link Graphics#setStrokeStyle} instead
   */
  lineStyle(t, e, r) {
    X(q, "Graphics#lineStyle is no longer needed. Use Graphics#setStrokeStyle to set the stroke style.");
    const s = {};
    return t && (s.width = t), e && (s.color = e), r && (s.alpha = r), this.context.strokeStyle = s, this;
  }
  /**
   * @param color
   * @param alpha
   * @deprecated since 8.0.0 Use {@link Graphics#fill} instead
   */
  beginFill(t, e) {
    X(q, "Graphics#beginFill is no longer needed. Use Graphics#fill to fill the shape with the desired style.");
    const r = {};
    return t && (r.color = t), e && (r.alpha = e), this.context.fillStyle = r, this;
  }
  /**
   * @deprecated since 8.0.0 Use {@link Graphics#fill} instead
   */
  endFill() {
    X(q, "Graphics#endFill is no longer needed. Use Graphics#fill to fill the shape with the desired style."), this.context.fill();
    const t = this.context.strokeStyle;
    return (t.width !== Zt.defaultStrokeStyle.width || t.color !== Zt.defaultStrokeStyle.color || t.alpha !== Zt.defaultStrokeStyle.alpha) && this.context.stroke(), this;
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#circle} instead
   */
  drawCircle(...t) {
    return X(q, "Graphics#drawCircle has been renamed to Graphics#circle"), this._callContextMethod("circle", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#ellipse} instead
   */
  drawEllipse(...t) {
    return X(q, "Graphics#drawEllipse has been renamed to Graphics#ellipse"), this._callContextMethod("ellipse", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#poly} instead
   */
  drawPolygon(...t) {
    return X(q, "Graphics#drawPolygon has been renamed to Graphics#poly"), this._callContextMethod("poly", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#rect} instead
   */
  drawRect(...t) {
    return X(q, "Graphics#drawRect has been renamed to Graphics#rect"), this._callContextMethod("rect", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#roundRect} instead
   */
  drawRoundedRect(...t) {
    return X(q, "Graphics#drawRoundedRect has been renamed to Graphics#roundRect"), this._callContextMethod("roundRect", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#star} instead
   */
  drawStar(...t) {
    return X(q, "Graphics#drawStar has been renamed to Graphics#star"), this._callContextMethod("star", t);
  }
}
const vc = class bc extends Jl {
  constructor(...t) {
    let e = t[0] ?? {};
    e instanceof Float32Array && (X(q, "use new MeshGeometry({ positions, uvs, indices }) instead"), e = {
      positions: e,
      uvs: t[1],
      indices: t[2]
    }), e = { ...bc.defaultOptions, ...e };
    const r = e.positions || new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), s = e.uvs || new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), n = e.indices || new Uint32Array([0, 1, 2, 0, 2, 3]), o = e.shrinkBuffersToFit, a = new Ve({
      data: r,
      label: "attribute-mesh-positions",
      shrinkToFit: o,
      usage: ft.VERTEX | ft.COPY_DST
    }), h = new Ve({
      data: s,
      label: "attribute-mesh-uvs",
      shrinkToFit: o,
      usage: ft.VERTEX | ft.COPY_DST
    }), c = new Ve({
      data: n,
      label: "index-mesh-buffer",
      shrinkToFit: o,
      usage: ft.INDEX | ft.COPY_DST
    });
    super({
      attributes: {
        aPosition: {
          buffer: a,
          format: "float32x2",
          stride: 2 * 4,
          offset: 0
        },
        aUV: {
          buffer: h,
          format: "float32x2",
          stride: 2 * 4,
          offset: 0
        }
      },
      indexBuffer: c,
      topology: e.topology
    }), this.batchMode = "auto";
  }
  /** The positions of the mesh. */
  get positions() {
    return this.attributes.aPosition.buffer.data;
  }
  set positions(t) {
    this.attributes.aPosition.buffer.data = t;
  }
  /** The UVs of the mesh. */
  get uvs() {
    return this.attributes.aUV.buffer.data;
  }
  set uvs(t) {
    this.attributes.aUV.buffer.data = t;
  }
  /** The indices of the mesh. */
  get indices() {
    return this.indexBuffer.data;
  }
  set indices(t) {
    this.indexBuffer.data = t;
  }
};
vc.defaultOptions = {
  topology: "triangle-list",
  shrinkBuffersToFit: !1
};
let bg = vc;
class _g {
  /**
   * @param options - Options for the transform.
   * @param options.matrix - The matrix to use.
   * @param options.observer - The observer to use.
   */
  constructor({ matrix: t, observer: e } = {}) {
    this.dirty = !0, this._matrix = t ?? new K(), this.observer = e, this.position = new xt(this, 0, 0), this.scale = new xt(this, 1, 1), this.pivot = new xt(this, 0, 0), this.skew = new xt(this, 0, 0), this._rotation = 0, this._cx = 1, this._sx = 0, this._cy = 0, this._sy = 1;
  }
  /**
   * This matrix is computed by combining this Transforms position, scale, rotation, skew, and pivot
   * properties into a single matrix.
   * @readonly
   */
  get matrix() {
    const t = this._matrix;
    return this.dirty && (t.a = this._cx * this.scale.x, t.b = this._sx * this.scale.x, t.c = this._cy * this.scale.y, t.d = this._sy * this.scale.y, t.tx = this.position.x - (this.pivot.x * t.a + this.pivot.y * t.c), t.ty = this.position.y - (this.pivot.x * t.b + this.pivot.y * t.d), this.dirty = !1), t;
  }
  /**
   * Called when a value changes.
   * @param point
   * @internal
   * @private
   */
  _onUpdate(t) {
    var e;
    this.dirty = !0, t === this.skew && this.updateSkew(), (e = this.observer) == null || e._onUpdate(this);
  }
  /** Called when the skew or the rotation changes. */
  updateSkew() {
    this._cx = Math.cos(this._rotation + this.skew.y), this._sx = Math.sin(this._rotation + this.skew.y), this._cy = -Math.sin(this._rotation - this.skew.x), this._sy = Math.cos(this._rotation - this.skew.x), this.dirty = !0;
  }
  toString() {
    return `[pixi.js/math:Transform position=(${this.position.x}, ${this.position.y}) rotation=${this.rotation} scale=(${this.scale.x}, ${this.scale.y}) skew=(${this.skew.x}, ${this.skew.y}) ]`;
  }
  /**
   * Decomposes a matrix and sets the transforms properties based on it.
   * @param matrix - The matrix to decompose
   */
  setFromMatrix(t) {
    t.decompose(this), this.dirty = !0;
  }
  /** The rotation of the object in radians. */
  get rotation() {
    return this._rotation;
  }
  set rotation(t) {
    this._rotation !== t && (this._rotation = t, this._onUpdate(this.skew));
  }
}
const _c = class nn extends Lr {
  constructor(...t) {
    let e = t[0] || {};
    e instanceof H && (e = { texture: e }), t.length > 1 && (X(q, "use new TilingSprite({ texture, width:100, height:100 }) instead"), e.width = t[1], e.height = t[2]), e = { ...nn.defaultOptions, ...e };
    const {
      texture: r,
      anchor: s,
      tilePosition: n,
      tileScale: o,
      tileRotation: a,
      width: h,
      height: c,
      applyAnchorToTexture: l,
      roundPixels: f,
      ...p
    } = e ?? {};
    super({
      label: "TilingSprite",
      ...p
    }), this.renderPipeId = "tilingSprite", this.batched = !0, this.allowChildren = !1, this._anchor = new xt(
      {
        _onUpdate: () => {
          this.onViewUpdate();
        }
      }
    ), this._applyAnchorToTexture = l, this.texture = r, this._width = h ?? r.width, this._height = c ?? r.height, this._tileTransform = new _g({
      observer: {
        _onUpdate: () => this.onViewUpdate()
      }
    }), s && (this.anchor = s), this.tilePosition = n, this.tileScale = o, this.tileRotation = a, this.roundPixels = f ?? !1;
  }
  /**
   * Creates a new tiling sprite.
   * @param source - The source to create the texture from.
   * @param options - The options for creating the tiling sprite.
   * @returns A new tiling sprite.
   */
  static from(t, e = {}) {
    return typeof t == "string" ? new nn({
      texture: nt.get(t),
      ...e
    }) : new nn({
      texture: t,
      ...e
    });
  }
  /**
   * Changes frame clamping in corresponding textureMatrix
   * Change to -0.5 to add a pixel to the edge, recommended for transparent trimmed textures in atlas
   * @default 0.5
   * @member {number}
   */
  get clampMargin() {
    return this._texture.textureMatrix.clampMargin;
  }
  set clampMargin(t) {
    this._texture.textureMatrix.clampMargin = t;
  }
  /**
   * The anchor sets the origin point of the sprite. The default value is taken from the {@link Texture}
   * and passed to the constructor.
   *
   * The default is `(0,0)`, this means the sprite's origin is the top left.
   *
   * Setting the anchor to `(0.5,0.5)` means the sprite's origin is centered.
   *
   * Setting the anchor to `(1,1)` would mean the sprite's origin point will be the bottom right corner.
   *
   * If you pass only single parameter, it will set both x and y to the same value as shown in the example below.
   * @example
   * import { TilingSprite } from 'pixi.js';
   *
   * const sprite = new TilingSprite({texture: Texture.WHITE});
   * sprite.anchor.set(0.5); // This will set the origin to center. (0.5) is same as (0.5, 0.5).
   */
  get anchor() {
    return this._anchor;
  }
  set anchor(t) {
    typeof t == "number" ? this._anchor.set(t) : this._anchor.copyFrom(t);
  }
  /** The offset of the image that is being tiled. */
  get tilePosition() {
    return this._tileTransform.position;
  }
  set tilePosition(t) {
    this._tileTransform.position.copyFrom(t);
  }
  /** The scaling of the image that is being tiled. */
  get tileScale() {
    return this._tileTransform.scale;
  }
  set tileScale(t) {
    typeof t == "number" ? this._tileTransform.scale.set(t) : this._tileTransform.scale.copyFrom(t);
  }
  set tileRotation(t) {
    this._tileTransform.rotation = t;
  }
  /** The rotation of the image that is being tiled. */
  get tileRotation() {
    return this._tileTransform.rotation;
  }
  /** The transform of the image that is being tiled. */
  get tileTransform() {
    return this._tileTransform;
  }
  /**
   * The local bounds of the sprite.
   * @type {rendering.Bounds}
   */
  get bounds() {
    return this._boundsDirty && (this._updateBounds(), this._boundsDirty = !1), this._bounds;
  }
  set texture(t) {
    t || (t = H.EMPTY);
    const e = this._texture;
    e !== t && (e && e.dynamic && e.off("update", this.onViewUpdate, this), t.dynamic && t.on("update", this.onViewUpdate, this), this._texture = t, this.onViewUpdate());
  }
  /** The texture that the sprite is using. */
  get texture() {
    return this._texture;
  }
  /** The width of the tiling area. */
  set width(t) {
    this._width = t, this.onViewUpdate();
  }
  get width() {
    return this._width;
  }
  set height(t) {
    this._height = t, this.onViewUpdate();
  }
  /** The height of the tiling area. */
  get height() {
    return this._height;
  }
  /**
   * Sets the size of the TilingSprite to the specified width and height.
   * This is faster than setting the width and height separately.
   * @param value - This can be either a number or a [Size]{@link Size} object.
   * @param height - The height to set. Defaults to the value of `width` if not provided.
   */
  setSize(t, e) {
    typeof t == "object" && (e = t.height ?? t.width, t = t.width), this._width = t, this._height = e ?? t, this.onViewUpdate();
  }
  /**
   * Retrieves the size of the TilingSprite as a [Size]{@link Size} object.
   * This is faster than get the width and height separately.
   * @param out - Optional object to store the size in.
   * @returns - The size of the TilingSprite.
   */
  getSize(t) {
    return t || (t = {}), t.width = this._width, t.height = this._height, t;
  }
  _updateBounds() {
    const t = this._bounds, e = this._anchor, r = this._width, s = this._height;
    t.maxX = -e._x * r, t.minX = t.maxX + r, t.maxY = -e._y * s, t.minY = t.maxY + s;
  }
  /**
   * Adds the bounds of this object to the bounds object.
   * @param bounds - The output bounds object.
   */
  addBounds(t) {
    const e = this.bounds;
    t.addFrame(
      e.minX,
      e.minY,
      e.maxX,
      e.maxY
    );
  }
  /**
   * Checks if the object contains the given point.
   * @param point - The point to check
   */
  containsPoint(t) {
    const e = this._width, r = this._height, s = -e * this._anchor._x;
    let n = 0;
    return t.x >= s && t.x <= s + e && (n = -r * this._anchor._y, t.y >= n && t.y <= n + r);
  }
  onViewUpdate() {
    this._boundsDirty = !0, super.onViewUpdate();
  }
  /**
   * Destroys this sprite renderable and optionally its texture.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.texture=false] - Should it destroy the current texture of the renderable as well
   * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the renderable as well
   */
  destroy(t = !1) {
    if (super.destroy(t), this._anchor = null, this._tileTransform = null, this._bounds = null, typeof t == "boolean" ? t : t == null ? void 0 : t.texture) {
      const e = typeof t == "boolean" ? t : t == null ? void 0 : t.textureSource;
      this._texture.destroy(e);
    }
    this._texture = null;
  }
};
_c.defaultOptions = {
  /** The texture to use for the sprite. */
  texture: H.EMPTY,
  /** The anchor point of the sprite */
  anchor: { x: 0, y: 0 },
  /** The offset of the image that is being tiled. */
  tilePosition: { x: 0, y: 0 },
  /** Scaling of the image that is being tiled. */
  tileScale: { x: 1, y: 1 },
  /** The rotation of the image that is being tiled. */
  tileRotation: 0,
  /** TODO */
  applyAnchorToTexture: !1
};
let wg = _c;
class wc extends Lr {
  constructor(t, e) {
    const { text: r, resolution: s, style: n, anchor: o, width: a, height: h, roundPixels: c, ...l } = t;
    super({
      ...l
    }), this.batched = !0, this._resolution = null, this._autoResolution = !0, this._didTextUpdate = !0, this._styleClass = e, this.text = r ?? "", this.style = n, this.resolution = s ?? null, this.allowChildren = !1, this._anchor = new xt(
      {
        _onUpdate: () => {
          this.onViewUpdate();
        }
      }
    ), o && (this.anchor = o), this.roundPixels = c ?? !1, a !== void 0 && (this.width = a), h !== void 0 && (this.height = h);
  }
  /**
   * The anchor sets the origin point of the text.
   * The default is `(0,0)`, this means the text's origin is the top left.
   *
   * Setting the anchor to `(0.5,0.5)` means the text's origin is centered.
   *
   * Setting the anchor to `(1,1)` would mean the text's origin point will be the bottom right corner.
   *
   * If you pass only single parameter, it will set both x and y to the same value as shown in the example below.
   * @example
   * import { Text } from 'pixi.js';
   *
   * const text = new Text('hello world');
   * text.anchor.set(0.5); // This will set the origin to center. (0.5) is same as (0.5, 0.5).
   */
  get anchor() {
    return this._anchor;
  }
  set anchor(t) {
    typeof t == "number" ? this._anchor.set(t) : this._anchor.copyFrom(t);
  }
  /** Set the copy for the text object. To split a line you can use '\n'. */
  set text(t) {
    t = t.toString(), this._text !== t && (this._text = t, this.onViewUpdate());
  }
  get text() {
    return this._text;
  }
  /**
   * The resolution / device pixel ratio of the canvas.
   * @default 1
   */
  set resolution(t) {
    this._autoResolution = t === null, this._resolution = t, this.onViewUpdate();
  }
  get resolution() {
    return this._resolution;
  }
  get style() {
    return this._style;
  }
  /**
   * Set the style of the text.
   *
   * Set up an event listener to listen for changes on the style object and mark the text as dirty.
   *
   * If setting the `style` can also be partial {@link AnyTextStyleOptions}.
   * @type {
   * text.TextStyle |
   * Partial<text.TextStyle> |
   * text.TextStyleOptions |
   * text.HTMLTextStyle |
   * Partial<text.HTMLTextStyle> |
   * text.HTMLTextStyleOptions
   * }
   */
  set style(t) {
    var e;
    t = t || {}, (e = this._style) == null || e.off("update", this.onViewUpdate, this), t instanceof this._styleClass ? this._style = t : this._style = new this._styleClass(t), this._style.on("update", this.onViewUpdate, this), this.onViewUpdate();
  }
  /**
   * The local bounds of the Text.
   * @type {rendering.Bounds}
   */
  get bounds() {
    return this._boundsDirty && (this._updateBounds(), this._boundsDirty = !1), this._bounds;
  }
  /** The width of the sprite, setting this will actually modify the scale to achieve the value set. */
  get width() {
    return Math.abs(this.scale.x) * this.bounds.width;
  }
  set width(t) {
    this._setWidth(t, this.bounds.width);
  }
  /** The height of the sprite, setting this will actually modify the scale to achieve the value set. */
  get height() {
    return Math.abs(this.scale.y) * this.bounds.height;
  }
  set height(t) {
    this._setHeight(t, this.bounds.height);
  }
  /**
   * Retrieves the size of the Text as a [Size]{@link Size} object.
   * This is faster than get the width and height separately.
   * @param out - Optional object to store the size in.
   * @returns - The size of the Text.
   */
  getSize(t) {
    return t || (t = {}), t.width = Math.abs(this.scale.x) * this.bounds.width, t.height = Math.abs(this.scale.y) * this.bounds.height, t;
  }
  /**
   * Sets the size of the Text to the specified width and height.
   * This is faster than setting the width and height separately.
   * @param value - This can be either a number or a [Size]{@link Size} object.
   * @param height - The height to set. Defaults to the value of `width` if not provided.
   */
  setSize(t, e) {
    typeof t == "object" ? (e = t.height ?? t.width, t = t.width) : e ?? (e = t), t !== void 0 && this._setWidth(t, this.bounds.width), e !== void 0 && this._setHeight(e, this.bounds.height);
  }
  /**
   * Adds the bounds of this text to the bounds object.
   * @param bounds - The output bounds object.
   */
  addBounds(t) {
    const e = this.bounds;
    t.addFrame(
      e.minX,
      e.minY,
      e.maxX,
      e.maxY
    );
  }
  /**
   * Checks if the text contains the given point.
   * @param point - The point to check
   */
  containsPoint(t) {
    const e = this.bounds.width, r = this.bounds.height, s = -e * this.anchor.x;
    let n = 0;
    return t.x >= s && t.x <= s + e && (n = -r * this.anchor.y, t.y >= n && t.y <= n + r);
  }
  onViewUpdate() {
    this._boundsDirty = !0, this.didViewUpdate || (this._didTextUpdate = !0), super.onViewUpdate();
  }
  _getKey() {
    return `${this.text}:${this._style.styleKey}:${this._resolution}`;
  }
  /**
   * Destroys this text renderable and optionally its style texture.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.texture=false] - Should it destroy the texture of the text style
   * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the text style
   * @param {boolean} [options.style=false] - Should it destroy the style of the text
   */
  destroy(t = !1) {
    super.destroy(t), this.owner = null, this._bounds = null, this._anchor = null, (typeof t == "boolean" ? t : t != null && t.style) && this._style.destroy(t), this._style = null, this._text = null;
  }
}
function Ac(i, t) {
  let e = i[0] ?? {};
  return (typeof e == "string" || i[1]) && (X(q, `use new ${t}({ text: "hi!", style }) instead`), e = {
    text: e,
    style: i[1]
  }), e;
}
class Ag extends wc {
  constructor(...t) {
    const e = Ac(t, "Text");
    super(e, pi), this.renderPipeId = "text";
  }
  _updateBounds() {
    const t = this._bounds, e = this._anchor, r = ro.measureText(
      this._text,
      this._style
    ), { width: s, height: n } = r;
    t.minX = -e._x * s, t.maxX = t.minX + s, t.minY = -e._y * n, t.maxY = t.minY + n;
  }
}
class Sg extends wc {
  constructor(...t) {
    var e;
    const r = Ac(t, "BitmapText");
    r.style ?? (r.style = r.style || {}), (e = r.style).fill ?? (e.fill = 16777215), super(r, pi), this.renderPipeId = "bitmapText";
  }
  _updateBounds() {
    const t = this._bounds, e = this._anchor, r = no.measureText(this.text, this._style), s = r.scale, n = r.offsetY * s;
    let o = r.width * s, a = r.height * s;
    const h = this._style._stroke;
    h && (o += h.width, a += h.width), t.minX = -e._x * o, t.maxX = t.minX + o, t.minY = -e._y * (a + n), t.maxY = t.minY + a;
  }
  /**
   * The resolution / device pixel ratio of the canvas.
   * @default 1
   */
  set resolution(t) {
    t !== null && dt(
      // eslint-disable-next-line max-len
      "[BitmapText] dynamically updating the resolution is not supported. Resolution should be managed by the BitmapFont."
    );
  }
  get resolution() {
    return this._resolution;
  }
}
class Do extends H {
  static create(t) {
    return new Do({
      source: new Ae(t)
    });
  }
  /**
   * Resizes the render texture.
   * @param width - The new width of the render texture.
   * @param height - The new height of the render texture.
   * @param resolution - The new resolution of the render texture.
   * @returns This texture.
   */
  resize(t, e, r) {
    return this.source.resize(t, e, r), this;
  }
}
const Sc = class Cc extends bg {
  constructor(...t) {
    super({});
    let e = t[0] ?? {};
    typeof e == "number" && (X(q, "PlaneGeometry constructor changed please use { width, height, verticesX, verticesY } instead"), e = {
      width: e,
      height: t[1],
      verticesX: t[2],
      verticesY: t[3]
    }), this.build(e);
  }
  /**
   * Refreshes plane coordinates
   * @param options - Options to be applied to plane geometry
   */
  build(t) {
    t = { ...Cc.defaultOptions, ...t }, this.verticesX = this.verticesX ?? t.verticesX, this.verticesY = this.verticesY ?? t.verticesY, this.width = this.width ?? t.width, this.height = this.height ?? t.height;
    const e = this.verticesX * this.verticesY, r = [], s = [], n = [], o = this.verticesX - 1, a = this.verticesY - 1, h = this.width / o, c = this.height / a;
    for (let f = 0; f < e; f++) {
      const p = f % this.verticesX, u = f / this.verticesX | 0;
      r.push(p * h, u * c), s.push(p / o, u / a);
    }
    const l = o * a;
    for (let f = 0; f < l; f++) {
      const p = f % o, u = f / o | 0, d = u * this.verticesX + p, m = u * this.verticesX + p + 1, g = (u + 1) * this.verticesX + p, y = (u + 1) * this.verticesX + p + 1;
      n.push(
        d,
        m,
        g,
        m,
        y,
        g
      );
    }
    this.buffers[0].data = new Float32Array(r), this.buffers[1].data = new Float32Array(s), this.indexBuffer.data = new Uint32Array(n), this.buffers[0].update(), this.buffers[1].update(), this.indexBuffer.update();
  }
};
Sc.defaultOptions = {
  width: 100,
  height: 100,
  verticesX: 10,
  verticesY: 10
};
let Cg = Sc;
const Pc = class kc extends Cg {
  constructor(t = {}) {
    t = { ...kc.defaultOptions, ...t }, super({
      width: t.width,
      height: t.height,
      verticesX: 4,
      verticesY: 4
    }), this.update(t);
  }
  /**
   * Updates the NineSliceGeometry with the options.
   * @param options - The options of the NineSliceGeometry.
   */
  update(t) {
    this.width = t.width ?? this.width, this.height = t.height ?? this.height, this._originalWidth = t.originalWidth ?? this._originalWidth, this._originalHeight = t.originalHeight ?? this._originalHeight, this._leftWidth = t.leftWidth ?? this._leftWidth, this._rightWidth = t.rightWidth ?? this._rightWidth, this._topHeight = t.topHeight ?? this._topHeight, this._bottomHeight = t.bottomHeight ?? this._bottomHeight, this.updateUvs(), this.updatePositions();
  }
  /** Updates the positions of the vertices. */
  updatePositions() {
    const t = this.positions, e = this._leftWidth + this._rightWidth, r = this.width > e ? 1 : this.width / e, s = this._topHeight + this._bottomHeight, n = this.height > s ? 1 : this.height / s, o = Math.min(r, n);
    t[9] = t[11] = t[13] = t[15] = this._topHeight * o, t[17] = t[19] = t[21] = t[23] = this.height - this._bottomHeight * o, t[25] = t[27] = t[29] = t[31] = this.height, t[2] = t[10] = t[18] = t[26] = this._leftWidth * o, t[4] = t[12] = t[20] = t[28] = this.width - this._rightWidth * o, t[6] = t[14] = t[22] = t[30] = this.width, this.getBuffer("aPosition").update();
  }
  /** Updates the UVs of the vertices. */
  updateUvs() {
    const t = this.uvs;
    t[0] = t[8] = t[16] = t[24] = 0, t[1] = t[3] = t[5] = t[7] = 0, t[6] = t[14] = t[22] = t[30] = 1, t[25] = t[27] = t[29] = t[31] = 1;
    const e = 1 / this._originalWidth, r = 1 / this._originalHeight;
    t[2] = t[10] = t[18] = t[26] = e * this._leftWidth, t[9] = t[11] = t[13] = t[15] = r * this._topHeight, t[4] = t[12] = t[20] = t[28] = 1 - e * this._rightWidth, t[17] = t[19] = t[21] = t[23] = 1 - r * this._bottomHeight, this.getBuffer("aUV").update();
  }
};
Pc.defaultOptions = {
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
let _i = Pc;
const Pg = class Mc extends Lr {
  /**
   * @param {scene.NineSliceSpriteOptions|Texture} options - Options to use
   * @param options.texture - The texture to use on the NineSliceSprite.
   * @param options.leftWidth - Width of the left vertical bar (A)
   * @param options.topHeight - Height of the top horizontal bar (C)
   * @param options.rightWidth - Width of the right vertical bar (B)
   * @param options.bottomHeight - Height of the bottom horizontal bar (D)
   * @param options.width - Width of the NineSliceSprite,
   * setting this will actually modify the vertices and not the UV's of this plane.
   * @param options.height - Height of the NineSliceSprite,
   * setting this will actually modify the vertices and not UV's of this plane.
   */
  constructor(t) {
    var e, r, s, n;
    t instanceof H && (t = { texture: t });
    const {
      width: o,
      height: a,
      leftWidth: h,
      rightWidth: c,
      topHeight: l,
      bottomHeight: f,
      texture: p,
      roundPixels: u,
      ...d
    } = t;
    super({
      label: "NineSliceSprite",
      ...d
    }), this.renderPipeId = "nineSliceSprite", this.batched = !0, this._leftWidth = h ?? ((e = p == null ? void 0 : p.defaultBorders) == null ? void 0 : e.left) ?? _i.defaultOptions.leftWidth, this._topHeight = l ?? ((r = p == null ? void 0 : p.defaultBorders) == null ? void 0 : r.top) ?? _i.defaultOptions.topHeight, this._rightWidth = c ?? ((s = p == null ? void 0 : p.defaultBorders) == null ? void 0 : s.right) ?? _i.defaultOptions.rightWidth, this._bottomHeight = f ?? ((n = p == null ? void 0 : p.defaultBorders) == null ? void 0 : n.bottom) ?? _i.defaultOptions.bottomHeight, this.bounds.maxX = this._width = o ?? p.width ?? _i.defaultOptions.width, this.bounds.maxY = this._height = a ?? p.height ?? _i.defaultOptions.height, this.allowChildren = !1, this.texture = p ?? Mc.defaultOptions.texture, this.roundPixels = u ?? !1;
  }
  /** The local bounds of the view. */
  get bounds() {
    return this._bounds;
  }
  /** The width of the NineSliceSprite, setting this will actually modify the vertices and UV's of this plane. */
  get width() {
    return this._width;
  }
  set width(t) {
    this.bounds.maxX = this._width = t, this.onViewUpdate();
  }
  /** The height of the NineSliceSprite, setting this will actually modify the vertices and UV's of this plane. */
  get height() {
    return this._height;
  }
  set height(t) {
    this.bounds.maxY = this._height = t, this.onViewUpdate();
  }
  /**
   * Sets the size of the NiceSliceSprite to the specified width and height.
   * setting this will actually modify the vertices and UV's of this plane
   * This is faster than setting the width and height separately.
   * @param value - This can be either a number or a [Size]{@link Size} object.
   * @param height - The height to set. Defaults to the value of `width` if not provided.
   */
  setSize(t, e) {
    typeof t == "object" && (e = t.height ?? t.width, t = t.width), this.bounds.maxX = this._width = t, this.bounds.maxY = this._height = e ?? t, this.onViewUpdate();
  }
  /**
   * Retrieves the size of the NineSliceSprite as a [Size]{@link Size} object.
   * This is faster than get the width and height separately.
   * @param out - Optional object to store the size in.
   * @returns - The size of the NineSliceSprite.
   */
  getSize(t) {
    return t || (t = {}), t.width = this._width, t.height = this._height, t;
  }
  /** The width of the left column (a) of the NineSliceSprite. */
  get leftWidth() {
    return this._leftWidth;
  }
  set leftWidth(t) {
    this._leftWidth = t, this.onViewUpdate();
  }
  /** The width of the right column (b) of the NineSliceSprite. */
  get topHeight() {
    return this._topHeight;
  }
  set topHeight(t) {
    this._topHeight = t, this.onViewUpdate();
  }
  /** The width of the right column (b) of the NineSliceSprite. */
  get rightWidth() {
    return this._rightWidth;
  }
  set rightWidth(t) {
    this._rightWidth = t, this.onViewUpdate();
  }
  /** The width of the right column (b) of the NineSliceSprite. */
  get bottomHeight() {
    return this._bottomHeight;
  }
  set bottomHeight(t) {
    this._bottomHeight = t, this.onViewUpdate();
  }
  /** The texture that the NineSliceSprite is using. */
  get texture() {
    return this._texture;
  }
  set texture(t) {
    t || (t = H.EMPTY);
    const e = this._texture;
    e !== t && (e && e.dynamic && e.off("update", this.onViewUpdate, this), t.dynamic && t.on("update", this.onViewUpdate, this), this._texture = t, this.onViewUpdate());
  }
  /** The original width of the texture */
  get originalWidth() {
    return this._texture.width;
  }
  /** The original height of the texture */
  get originalHeight() {
    return this._texture.height;
  }
  /**
   * Adds the bounds of this object to the bounds object.
   * @param bounds - The output bounds object.
   */
  addBounds(t) {
    const e = this.bounds;
    t.addFrame(e.minX, e.minY, e.maxX, e.maxY);
  }
  /**
   * Destroys this sprite renderable and optionally its texture.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.texture=false] - Should it destroy the current texture of the renderable as well
   * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the renderable as well
   */
  destroy(t) {
    if (super.destroy(t), typeof t == "boolean" ? t : t == null ? void 0 : t.texture) {
      const e = typeof t == "boolean" ? t : t == null ? void 0 : t.textureSource;
      this._texture.destroy(e);
    }
    this._texture = null;
  }
};
Pg.defaultOptions = {
  /** @default Texture.EMPTY */
  texture: H.EMPTY
};
Mt.add(Wu, Yu);
var Tc = {}, In = {};
Object.defineProperty(In, "__esModule", { value: !0 });
In.MiniSignal = void 0;
const oo = Symbol("SIGNAL");
function kg(i) {
  return typeof i == "object" && oo in i;
}
class Mg {
  constructor() {
    this._symbol = Symbol("MiniSignal"), this._refMap = /* @__PURE__ */ new WeakMap(), this._head = void 0, this._tail = void 0, this._dispatching = !1;
  }
  hasListeners() {
    return this._head != null;
  }
  /**
   * Dispatches a signal to all registered listeners.
   */
  dispatch(...t) {
    if (this._dispatching)
      throw new Error("MiniSignal#dispatch(): Signal already dispatching.");
    let e = this._head;
    if (e == null)
      return !1;
    for (this._dispatching = !0; e != null; )
      e.fn(...t), e = e.next;
    return this._dispatching = !1, !0;
  }
  /**
   * Register a new listener.
   */
  add(t) {
    if (typeof t != "function")
      throw new Error("MiniSignal#add(): First arg must be a Function.");
    return this._createRef(this._addNode({ fn: t }));
  }
  /**
   * Remove binding object.
   */
  detach(t) {
    if (!kg(t))
      throw new Error("MiniSignal#detach(): First arg must be a MiniSignal listener reference.");
    if (t[oo] !== this._symbol)
      throw new Error("MiniSignal#detach(): MiniSignal listener does not belong to this MiniSignal.");
    const e = this._refMap.get(t);
    return e ? (this._refMap.delete(t), this._disconnectNode(e), this._destroyNode(e), this) : this;
  }
  /**
   * Detach all listeners.
   */
  detachAll() {
    let t = this._head;
    if (t == null)
      return this;
    for (this._head = this._tail = void 0, this._refMap = /* @__PURE__ */ new WeakMap(); t != null; )
      this._destroyNode(t), t = t.next;
    return this;
  }
  _destroyNode(t) {
    t.fn = void 0, t.prev = void 0;
  }
  _disconnectNode(t) {
    t === this._head ? (this._head = t.next, t.next == null && (this._tail = void 0)) : t === this._tail && (this._tail = t.prev, this._tail != null && (this._tail.next = void 0)), t.prev != null && (t.prev.next = t.next), t.next != null && (t.next.prev = t.prev);
  }
  _addNode(t) {
    return this._head == null ? (this._head = t, this._tail = t) : (this._tail.next = t, t.prev = this._tail, this._tail = t), t;
  }
  _createRef(t) {
    const e = { [oo]: this._symbol };
    return this._refMap.set(e, t), e;
  }
  _getRef(t) {
    return this._refMap.get(t);
  }
}
In.MiniSignal = Mg;
(function(i) {
  var t = ii && ii.__createBinding || (Object.create ? function(r, s, n, o) {
    o === void 0 && (o = n);
    var a = Object.getOwnPropertyDescriptor(s, n);
    (!a || ("get" in a ? !s.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return s[n];
    } }), Object.defineProperty(r, o, a);
  } : function(r, s, n, o) {
    o === void 0 && (o = n), r[o] = s[n];
  }), e = ii && ii.__exportStar || function(r, s) {
    for (var n in r) n !== "default" && !Object.prototype.hasOwnProperty.call(s, n) && t(s, r, n);
  };
  Object.defineProperty(i, "__esModule", { value: !0 }), e(In, i);
})(Tc);
const dn = /* @__PURE__ */ new Map(), hr = (i, t) => {
  let e = dn.get(i);
  return e || (e = new Tc.MiniSignal(), dn.set(i, e)), { name: i, binding: e.add(t) };
}, pn = (i, t) => {
  const e = dn.get(i);
  e && e.detach(t);
}, Lt = (i, ...t) => {
  const e = dn.get(i);
  e && e.dispatch(...t);
};
function ke(i) {
  if (i === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return i;
}
function Ec(i, t) {
  i.prototype = Object.create(t.prototype), i.prototype.constructor = i, i.__proto__ = t;
}
/*!
 * GSAP 3.12.5
 * https://gsap.com
 *
 * @license Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/
var qt = {
  autoSleep: 120,
  force3D: "auto",
  nullTargetWarn: 1,
  units: {
    lineHeight: ""
  }
}, Ui = {
  duration: 0.5,
  overwrite: !1,
  delay: 0
}, Uo, Tt, et, ee = 1e8, tt = 1 / ee, ao = Math.PI * 2, Tg = ao / 4, Eg = 0, Bc = Math.sqrt, Bg = Math.cos, Rg = Math.sin, At = function(i) {
  return typeof i == "string";
}, lt = function(i) {
  return typeof i == "function";
}, Ie = function(i) {
  return typeof i == "number";
}, Go = function(i) {
  return typeof i > "u";
}, we = function(i) {
  return typeof i == "object";
}, zt = function(i) {
  return i !== !1;
}, Vo = function() {
  return typeof window < "u";
}, Zr = function(i) {
  return lt(i) || At(i);
}, Rc = typeof ArrayBuffer == "function" && ArrayBuffer.isView || function() {
}, Et = Array.isArray, ho = /(?:-?\.?\d|\.)+/gi, Ic = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g, Pi = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g, Ps = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi, Oc = /[+-]=-?[.\d]+/, Fc = /[^,'"\[\]\s]+/gi, Ig = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i, rt, ge, lo, Ho, Qt = {}, fn = {}, Lc, zc = function(i) {
  return (fn = fi(i, Qt)) && Vt;
}, jo = function(i, t) {
  return console.warn("Invalid property", i, "set to", t, "Missing plugin? gsap.registerPlugin()");
}, Pr = function(i, t) {
  return !t && console.warn(i);
}, Dc = function(i, t) {
  return i && (Qt[i] = t) && fn && (fn[i] = t) || Qt;
}, kr = function() {
  return 0;
}, Og = {
  suppressEvents: !0,
  isStart: !0,
  kill: !1
}, sn = {
  suppressEvents: !0,
  kill: !1
}, Fg = {
  suppressEvents: !0
}, No = {}, He = [], co = {}, Uc, Wt = {}, ks = {}, Ph = 30, on = [], Wo = "", Yo = function(i) {
  var t = i[0], e, r;
  if (we(t) || lt(t) || (i = [i]), !(e = (t._gsap || {}).harness)) {
    for (r = on.length; r-- && !on[r].targetTest(t); )
      ;
    e = on[r];
  }
  for (r = i.length; r--; )
    i[r] && (i[r]._gsap || (i[r]._gsap = new lu(i[r], e))) || i.splice(r, 1);
  return i;
}, hi = function(i) {
  return i._gsap || Yo(ie(i))[0]._gsap;
}, Gc = function(i, t, e) {
  return (e = i[t]) && lt(e) ? i[t]() : Go(e) && i.getAttribute && i.getAttribute(t) || e;
}, Dt = function(i, t) {
  return (i = i.split(",")).forEach(t) || i;
}, ut = function(i) {
  return Math.round(i * 1e5) / 1e5 || 0;
}, wt = function(i) {
  return Math.round(i * 1e7) / 1e7 || 0;
}, Ri = function(i, t) {
  var e = t.charAt(0), r = parseFloat(t.substr(2));
  return i = parseFloat(i), e === "+" ? i + r : e === "-" ? i - r : e === "*" ? i * r : i / r;
}, Lg = function(i, t) {
  for (var e = t.length, r = 0; i.indexOf(t[r]) < 0 && ++r < e; )
    ;
  return r < e;
}, mn = function() {
  var i = He.length, t = He.slice(0), e, r;
  for (co = {}, He.length = 0, e = 0; e < i; e++)
    r = t[e], r && r._lazy && (r.render(r._lazy[0], r._lazy[1], !0)._lazy = 0);
}, Vc = function(i, t, e, r) {
  He.length && !Tt && mn(), i.render(t, e, Tt && t < 0 && (i._initted || i._startAt)), He.length && !Tt && mn();
}, Hc = function(i) {
  var t = parseFloat(i);
  return (t || t === 0) && (i + "").match(Fc).length < 2 ? t : At(i) ? i.trim() : i;
}, jc = function(i) {
  return i;
}, re = function(i, t) {
  for (var e in t)
    e in i || (i[e] = t[e]);
  return i;
}, zg = function(i) {
  return function(t, e) {
    for (var r in e)
      r in t || r === "duration" && i || r === "ease" || (t[r] = e[r]);
  };
}, fi = function(i, t) {
  for (var e in t)
    i[e] = t[e];
  return i;
}, kh = function i(t, e) {
  for (var r in e)
    r !== "__proto__" && r !== "constructor" && r !== "prototype" && (t[r] = we(e[r]) ? i(t[r] || (t[r] = {}), e[r]) : e[r]);
  return t;
}, gn = function(i, t) {
  var e = {}, r;
  for (r in i)
    r in t || (e[r] = i[r]);
  return e;
}, gr = function(i) {
  var t = i.parent || rt, e = i.keyframes ? zg(Et(i.keyframes)) : re;
  if (zt(i.inherit))
    for (; t; )
      e(i, t.vars.defaults), t = t.parent || t._dp;
  return i;
}, Dg = function(i, t) {
  for (var e = i.length, r = e === t.length; r && e-- && i[e] === t[e]; )
    ;
  return e < 0;
}, Nc = function(i, t, e, r, s) {
  var n = i[r], o;
  if (s)
    for (o = t[s]; n && n[s] > o; )
      n = n._prev;
  return n ? (t._next = n._next, n._next = t) : (t._next = i[e], i[e] = t), t._next ? t._next._prev = t : i[r] = t, t._prev = n, t.parent = t._dp = i, t;
}, On = function(i, t, e, r) {
  e === void 0 && (e = "_first"), r === void 0 && (r = "_last");
  var s = t._prev, n = t._next;
  s ? s._next = n : i[e] === t && (i[e] = n), n ? n._prev = s : i[r] === t && (i[r] = s), t._next = t._prev = t.parent = null;
}, Ne = function(i, t) {
  i.parent && (!t || i.parent.autoRemoveChildren) && i.parent.remove && i.parent.remove(i), i._act = 0;
}, li = function(i, t) {
  if (i && (!t || t._end > i._dur || t._start < 0))
    for (var e = i; e; )
      e._dirty = 1, e = e.parent;
  return i;
}, Ug = function(i) {
  for (var t = i.parent; t && t.parent; )
    t._dirty = 1, t.totalDuration(), t = t.parent;
  return i;
}, uo = function(i, t, e, r) {
  return i._startAt && (Tt ? i._startAt.revert(sn) : i.vars.immediateRender && !i.vars.autoRevert || i._startAt.render(t, !0, r));
}, Gg = function i(t) {
  return !t || t._ts && i(t.parent);
}, Mh = function(i) {
  return i._repeat ? Gi(i._tTime, i = i.duration() + i._rDelay) * i : 0;
}, Gi = function(i, t) {
  var e = Math.floor(i /= t);
  return i && e === i ? e - 1 : e;
}, yn = function(i, t) {
  return (i - t._start) * t._ts + (t._ts >= 0 ? 0 : t._dirty ? t.totalDuration() : t._tDur);
}, Fn = function(i) {
  return i._end = wt(i._start + (i._tDur / Math.abs(i._ts || i._rts || tt) || 0));
}, Ln = function(i, t) {
  var e = i._dp;
  return e && e.smoothChildTiming && i._ts && (i._start = wt(e._time - (i._ts > 0 ? t / i._ts : ((i._dirty ? i.totalDuration() : i._tDur) - t) / -i._ts)), Fn(i), e._dirty || li(e, i)), i;
}, Wc = function(i, t) {
  var e;
  if ((t._time || !t._dur && t._initted || t._start < i._time && (t._dur || !t.add)) && (e = yn(i.rawTime(), t), (!t._dur || zr(0, t.totalDuration(), e) - t._tTime > tt) && t.render(e, !0)), li(i, t)._dp && i._initted && i._time >= i._dur && i._ts) {
    if (i._dur < i.duration())
      for (e = i; e._dp; )
        e.rawTime() >= 0 && e.totalTime(e._tTime), e = e._dp;
    i._zTime = -tt;
  }
}, ye = function(i, t, e, r) {
  return t.parent && Ne(t), t._start = wt((Ie(e) ? e : e || i !== rt ? Jt(i, e, t) : i._time) + t._delay), t._end = wt(t._start + (t.totalDuration() / Math.abs(t.timeScale()) || 0)), Nc(i, t, "_first", "_last", i._sort ? "_start" : 0), po(t) || (i._recent = t), r || Wc(i, t), i._ts < 0 && Ln(i, i._tTime), i;
}, Yc = function(i, t) {
  return (Qt.ScrollTrigger || jo("scrollTrigger", t)) && Qt.ScrollTrigger.create(t, i);
}, Xc = function(i, t, e, r, s) {
  if (qo(i, t, s), !i._initted)
    return 1;
  if (!e && i._pt && !Tt && (i._dur && i.vars.lazy !== !1 || !i._dur && i.vars.lazy) && Uc !== Yt.frame)
    return He.push(i), i._lazy = [s, r], 1;
}, Vg = function i(t) {
  var e = t.parent;
  return e && e._ts && e._initted && !e._lock && (e.rawTime() < 0 || i(e));
}, po = function(i) {
  var t = i.data;
  return t === "isFromStart" || t === "isStart";
}, Hg = function(i, t, e, r) {
  var s = i.ratio, n = t < 0 || !t && (!i._start && Vg(i) && !(!i._initted && po(i)) || (i._ts < 0 || i._dp._ts < 0) && !po(i)) ? 0 : 1, o = i._rDelay, a = 0, h, c, l;
  if (o && i._repeat && (a = zr(0, i._tDur, t), c = Gi(a, o), i._yoyo && c & 1 && (n = 1 - n), c !== Gi(i._tTime, o) && (s = 1 - n, i.vars.repeatRefresh && i._initted && i.invalidate())), n !== s || Tt || r || i._zTime === tt || !t && i._zTime) {
    if (!i._initted && Xc(i, t, r, e, a))
      return;
    for (l = i._zTime, i._zTime = t || (e ? tt : 0), e || (e = t && !l), i.ratio = n, i._from && (n = 1 - n), i._time = 0, i._tTime = a, h = i._pt; h; )
      h.r(n, h.d), h = h._next;
    t < 0 && uo(i, t, e, !0), i._onUpdate && !e && Xt(i, "onUpdate"), a && i._repeat && !e && i.parent && Xt(i, "onRepeat"), (t >= i._tDur || t < 0) && i.ratio === n && (n && Ne(i, 1), !e && !Tt && (Xt(i, n ? "onComplete" : "onReverseComplete", !0), i._prom && i._prom()));
  } else i._zTime || (i._zTime = t);
}, jg = function(i, t, e) {
  var r;
  if (e > t)
    for (r = i._first; r && r._start <= e; ) {
      if (r.data === "isPause" && r._start > t)
        return r;
      r = r._next;
    }
  else
    for (r = i._last; r && r._start >= e; ) {
      if (r.data === "isPause" && r._start < t)
        return r;
      r = r._prev;
    }
}, Vi = function(i, t, e, r) {
  var s = i._repeat, n = wt(t) || 0, o = i._tTime / i._tDur;
  return o && !r && (i._time *= n / i._dur), i._dur = n, i._tDur = s ? s < 0 ? 1e10 : wt(n * (s + 1) + i._rDelay * s) : n, o > 0 && !r && Ln(i, i._tTime = i._tDur * o), i.parent && Fn(i), e || li(i.parent, i), i;
}, Th = function(i) {
  return i instanceof It ? li(i) : Vi(i, i._dur);
}, Ng = {
  _start: 0,
  endTime: kr,
  totalDuration: kr
}, Jt = function i(t, e, r) {
  var s = t.labels, n = t._recent || Ng, o = t.duration() >= ee ? n.endTime(!1) : t._dur, a, h, c;
  return At(e) && (isNaN(e) || e in s) ? (h = e.charAt(0), c = e.substr(-1) === "%", a = e.indexOf("="), h === "<" || h === ">" ? (a >= 0 && (e = e.replace(/=/, "")), (h === "<" ? n._start : n.endTime(n._repeat >= 0)) + (parseFloat(e.substr(1)) || 0) * (c ? (a < 0 ? n : r).totalDuration() / 100 : 1)) : a < 0 ? (e in s || (s[e] = o), s[e]) : (h = parseFloat(e.charAt(a - 1) + e.substr(a + 1)), c && r && (h = h / 100 * (Et(r) ? r[0] : r).totalDuration()), a > 1 ? i(t, e.substr(0, a - 1), r) + h : o + h)) : e == null ? o : +e;
}, yr = function(i, t, e) {
  var r = Ie(t[1]), s = (r ? 2 : 1) + (i < 2 ? 0 : 1), n = t[s], o, a;
  if (r && (n.duration = t[1]), n.parent = e, i) {
    for (o = n, a = e; a && !("immediateRender" in o); )
      o = a.vars.defaults || {}, a = zt(a.vars.inherit) && a.parent;
    n.immediateRender = zt(o.immediateRender), i < 2 ? n.runBackwards = 1 : n.startAt = t[s - 1];
  }
  return new pt(t[0], n, t[s + 1]);
}, Ye = function(i, t) {
  return i || i === 0 ? t(i) : t;
}, zr = function(i, t, e) {
  return e < i ? i : e > t ? t : e;
}, Pt = function(i, t) {
  return !At(i) || !(t = Ig.exec(i)) ? "" : t[1];
}, Wg = function(i, t, e) {
  return Ye(e, function(r) {
    return zr(i, t, r);
  });
}, fo = [].slice, qc = function(i, t) {
  return i && we(i) && "length" in i && (!t && !i.length || i.length - 1 in i && we(i[0])) && !i.nodeType && i !== ge;
}, Yg = function(i, t, e) {
  return e === void 0 && (e = []), i.forEach(function(r) {
    var s;
    return At(r) && !t || qc(r, 1) ? (s = e).push.apply(s, ie(r)) : e.push(r);
  }) || e;
}, ie = function(i, t, e) {
  return et && !t && et.selector ? et.selector(i) : At(i) && !e && (lo || !Hi()) ? fo.call((t || Ho).querySelectorAll(i), 0) : Et(i) ? Yg(i, e) : qc(i) ? fo.call(i, 0) : i ? [i] : [];
}, mo = function(i) {
  return i = ie(i)[0] || Pr("Invalid scope") || {}, function(t) {
    var e = i.current || i.nativeElement || i;
    return ie(t, e.querySelectorAll ? e : e === i ? Pr("Invalid scope") || Ho.createElement("div") : i);
  };
}, Kc = function(i) {
  return i.sort(function() {
    return 0.5 - Math.random();
  });
}, Qc = function(i) {
  if (lt(i))
    return i;
  var t = we(i) ? i : {
    each: i
  }, e = ci(t.ease), r = t.from || 0, s = parseFloat(t.base) || 0, n = {}, o = r > 0 && r < 1, a = isNaN(r) || o, h = t.axis, c = r, l = r;
  return At(r) ? c = l = {
    center: 0.5,
    edges: 0.5,
    end: 1
  }[r] || 0 : !o && a && (c = r[0], l = r[1]), function(f, p, u) {
    var d = (u || t).length, m = n[d], g, y, v, _, w, x, A, S, b;
    if (!m) {
      if (b = t.grid === "auto" ? 0 : (t.grid || [1, ee])[1], !b) {
        for (A = -ee; A < (A = u[b++].getBoundingClientRect().left) && b < d; )
          ;
        b < d && b--;
      }
      for (m = n[d] = [], g = a ? Math.min(b, d) * c - 0.5 : r % b, y = b === ee ? 0 : a ? d * l / b - 0.5 : r / b | 0, A = 0, S = ee, x = 0; x < d; x++)
        v = x % b - g, _ = y - (x / b | 0), m[x] = w = h ? Math.abs(h === "y" ? _ : v) : Bc(v * v + _ * _), w > A && (A = w), w < S && (S = w);
      r === "random" && Kc(m), m.max = A - S, m.min = S, m.v = d = (parseFloat(t.amount) || parseFloat(t.each) * (b > d ? d - 1 : h ? h === "y" ? d / b : b : Math.max(b, d / b)) || 0) * (r === "edges" ? -1 : 1), m.b = d < 0 ? s - d : s, m.u = Pt(t.amount || t.each) || 0, e = e && d < 0 ? ou(e) : e;
    }
    return d = (m[f] - m.min) / m.max || 0, wt(m.b + (e ? e(d) : d) * m.v) + m.u;
  };
}, go = function(i) {
  var t = Math.pow(10, ((i + "").split(".")[1] || "").length);
  return function(e) {
    var r = wt(Math.round(parseFloat(e) / i) * i * t);
    return (r - r % 1) / t + (Ie(e) ? 0 : Pt(e));
  };
}, Jc = function(i, t) {
  var e = Et(i), r, s;
  return !e && we(i) && (r = e = i.radius || ee, i.values ? (i = ie(i.values), (s = !Ie(i[0])) && (r *= r)) : i = go(i.increment)), Ye(t, e ? lt(i) ? function(n) {
    return s = i(n), Math.abs(s - n) <= r ? s : n;
  } : function(n) {
    for (var o = parseFloat(s ? n.x : n), a = parseFloat(s ? n.y : 0), h = ee, c = 0, l = i.length, f, p; l--; )
      s ? (f = i[l].x - o, p = i[l].y - a, f = f * f + p * p) : f = Math.abs(i[l] - o), f < h && (h = f, c = l);
    return c = !r || h <= r ? i[c] : n, s || c === n || Ie(n) ? c : c + Pt(n);
  } : go(i));
}, Zc = function(i, t, e, r) {
  return Ye(Et(i) ? !t : e === !0 ? !!(e = 0) : !r, function() {
    return Et(i) ? i[~~(Math.random() * i.length)] : (e = e || 1e-5) && (r = e < 1 ? Math.pow(10, (e + "").length - 2) : 1) && Math.floor(Math.round((i - e / 2 + Math.random() * (t - i + e * 0.99)) / e) * e * r) / r;
  });
}, Xg = function() {
  for (var i = arguments.length, t = new Array(i), e = 0; e < i; e++)
    t[e] = arguments[e];
  return function(r) {
    return t.reduce(function(s, n) {
      return n(s);
    }, r);
  };
}, qg = function(i, t) {
  return function(e) {
    return i(parseFloat(e)) + (t || Pt(e));
  };
}, Kg = function(i, t, e) {
  return tu(i, t, 0, 1, e);
}, $c = function(i, t, e) {
  return Ye(e, function(r) {
    return i[~~t(r)];
  });
}, Qg = function i(t, e, r) {
  var s = e - t;
  return Et(t) ? $c(t, i(0, t.length), e) : Ye(r, function(n) {
    return (s + (n - t) % s) % s + t;
  });
}, Jg = function i(t, e, r) {
  var s = e - t, n = s * 2;
  return Et(t) ? $c(t, i(0, t.length - 1), e) : Ye(r, function(o) {
    return o = (n + (o - t) % n) % n || 0, t + (o > s ? n - o : o);
  });
}, Mr = function(i) {
  for (var t = 0, e = "", r, s, n, o; ~(r = i.indexOf("random(", t)); )
    n = i.indexOf(")", r), o = i.charAt(r + 7) === "[", s = i.substr(r + 7, n - r - 7).match(o ? Fc : ho), e += i.substr(t, r - t) + Zc(o ? s : +s[0], o ? 0 : +s[1], +s[2] || 1e-5), t = n + 1;
  return e + i.substr(t, i.length - t);
}, tu = function(i, t, e, r, s) {
  var n = t - i, o = r - e;
  return Ye(s, function(a) {
    return e + ((a - i) / n * o || 0);
  });
}, Zg = function i(t, e, r, s) {
  var n = isNaN(t + e) ? 0 : function(u) {
    return (1 - u) * t + u * e;
  };
  if (!n) {
    var o = At(t), a = {}, h, c, l, f, p;
    if (r === !0 && (s = 1) && (r = null), o)
      t = {
        p: t
      }, e = {
        p: e
      };
    else if (Et(t) && !Et(e)) {
      for (l = [], f = t.length, p = f - 2, c = 1; c < f; c++)
        l.push(i(t[c - 1], t[c]));
      f--, n = function(u) {
        u *= f;
        var d = Math.min(p, ~~u);
        return l[d](u - d);
      }, r = e;
    } else s || (t = fi(Et(t) ? [] : {}, t));
    if (!l) {
      for (h in e)
        Xo.call(a, t, h, "get", e[h]);
      n = function(u) {
        return Jo(u, a) || (o ? t.p : t);
      };
    }
  }
  return Ye(r, n);
}, Eh = function(i, t, e) {
  var r = i.labels, s = ee, n, o, a;
  for (n in r)
    o = r[n] - t, o < 0 == !!e && o && s > (o = Math.abs(o)) && (a = n, s = o);
  return a;
}, Xt = function(i, t, e) {
  var r = i.vars, s = r[t], n = et, o = i._ctx, a, h, c;
  if (s)
    return a = r[t + "Params"], h = r.callbackScope || i, e && He.length && mn(), o && (et = o), c = a ? s.apply(h, a) : s.call(h), et = n, c;
}, lr = function(i) {
  return Ne(i), i.scrollTrigger && i.scrollTrigger.kill(!!Tt), i.progress() < 1 && Xt(i, "onInterrupt"), i;
}, ki, eu = [], iu = function(i) {
  if (i)
    if (i = !i.name && i.default || i, Vo() || i.headless) {
      var t = i.name, e = lt(i), r = t && !e && i.init ? function() {
        this._props = [];
      } : i, s = {
        init: kr,
        render: Jo,
        add: Xo,
        kill: f0,
        modifier: p0,
        rawVars: 0
      }, n = {
        targetTest: 0,
        get: 0,
        getSetter: Qo,
        aliases: {},
        register: 0
      };
      if (Hi(), i !== r) {
        if (Wt[t])
          return;
        re(r, re(gn(i, s), n)), fi(r.prototype, fi(s, gn(i, n))), Wt[r.prop = t] = r, i.targetTest && (on.push(r), No[t] = 1), t = (t === "css" ? "CSS" : t.charAt(0).toUpperCase() + t.substr(1)) + "Plugin";
      }
      Dc(t, r), i.register && i.register(Vt, r, Ut);
    } else
      eu.push(i);
}, Z = 255, cr = {
  aqua: [0, Z, Z],
  lime: [0, Z, 0],
  silver: [192, 192, 192],
  black: [0, 0, 0],
  maroon: [128, 0, 0],
  teal: [0, 128, 128],
  blue: [0, 0, Z],
  navy: [0, 0, 128],
  white: [Z, Z, Z],
  olive: [128, 128, 0],
  yellow: [Z, Z, 0],
  orange: [Z, 165, 0],
  gray: [128, 128, 128],
  purple: [128, 0, 128],
  green: [0, 128, 0],
  red: [Z, 0, 0],
  pink: [Z, 192, 203],
  cyan: [0, Z, Z],
  transparent: [Z, Z, Z, 0]
}, Ms = function(i, t, e) {
  return i += i < 0 ? 1 : i > 1 ? -1 : 0, (i * 6 < 1 ? t + (e - t) * i * 6 : i < 0.5 ? e : i * 3 < 2 ? t + (e - t) * (2 / 3 - i) * 6 : t) * Z + 0.5 | 0;
}, ru = function(i, t, e) {
  var r = i ? Ie(i) ? [i >> 16, i >> 8 & Z, i & Z] : 0 : cr.black, s, n, o, a, h, c, l, f, p, u;
  if (!r) {
    if (i.substr(-1) === "," && (i = i.substr(0, i.length - 1)), cr[i])
      r = cr[i];
    else if (i.charAt(0) === "#") {
      if (i.length < 6 && (s = i.charAt(1), n = i.charAt(2), o = i.charAt(3), i = "#" + s + s + n + n + o + o + (i.length === 5 ? i.charAt(4) + i.charAt(4) : "")), i.length === 9)
        return r = parseInt(i.substr(1, 6), 16), [r >> 16, r >> 8 & Z, r & Z, parseInt(i.substr(7), 16) / 255];
      i = parseInt(i.substr(1), 16), r = [i >> 16, i >> 8 & Z, i & Z];
    } else if (i.substr(0, 3) === "hsl") {
      if (r = u = i.match(ho), !t)
        a = +r[0] % 360 / 360, h = +r[1] / 100, c = +r[2] / 100, n = c <= 0.5 ? c * (h + 1) : c + h - c * h, s = c * 2 - n, r.length > 3 && (r[3] *= 1), r[0] = Ms(a + 1 / 3, s, n), r[1] = Ms(a, s, n), r[2] = Ms(a - 1 / 3, s, n);
      else if (~i.indexOf("="))
        return r = i.match(Ic), e && r.length < 4 && (r[3] = 1), r;
    } else
      r = i.match(ho) || cr.transparent;
    r = r.map(Number);
  }
  return t && !u && (s = r[0] / Z, n = r[1] / Z, o = r[2] / Z, l = Math.max(s, n, o), f = Math.min(s, n, o), c = (l + f) / 2, l === f ? a = h = 0 : (p = l - f, h = c > 0.5 ? p / (2 - l - f) : p / (l + f), a = l === s ? (n - o) / p + (n < o ? 6 : 0) : l === n ? (o - s) / p + 2 : (s - n) / p + 4, a *= 60), r[0] = ~~(a + 0.5), r[1] = ~~(h * 100 + 0.5), r[2] = ~~(c * 100 + 0.5)), e && r.length < 4 && (r[3] = 1), r;
}, nu = function(i) {
  var t = [], e = [], r = -1;
  return i.split(je).forEach(function(s) {
    var n = s.match(Pi) || [];
    t.push.apply(t, n), e.push(r += n.length + 1);
  }), t.c = e, t;
}, Bh = function(i, t, e) {
  var r = "", s = (i + r).match(je), n = t ? "hsla(" : "rgba(", o = 0, a, h, c, l;
  if (!s)
    return i;
  if (s = s.map(function(f) {
    return (f = ru(f, t, 1)) && n + (t ? f[0] + "," + f[1] + "%," + f[2] + "%," + f[3] : f.join(",")) + ")";
  }), e && (c = nu(i), a = e.c, a.join(r) !== c.c.join(r)))
    for (h = i.replace(je, "1").split(Pi), l = h.length - 1; o < l; o++)
      r += h[o] + (~a.indexOf(o) ? s.shift() || n + "0,0,0,0)" : (c.length ? c : s.length ? s : e).shift());
  if (!h)
    for (h = i.split(je), l = h.length - 1; o < l; o++)
      r += h[o] + s[o];
  return r + h[l];
}, je = function() {
  var i = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b", t;
  for (t in cr)
    i += "|" + t + "\\b";
  return new RegExp(i + ")", "gi");
}(), $g = /hsl[a]?\(/, su = function(i) {
  var t = i.join(" "), e;
  if (je.lastIndex = 0, je.test(t))
    return e = $g.test(t), i[1] = Bh(i[1], e), i[0] = Bh(i[0], e, nu(i[1])), !0;
}, Tr, Yt = function() {
  var i = Date.now, t = 500, e = 33, r = i(), s = r, n = 1e3 / 240, o = n, a = [], h, c, l, f, p, u, d = function m(g) {
    var y = i() - s, v = g === !0, _, w, x, A;
    if ((y > t || y < 0) && (r += y - e), s += y, x = s - r, _ = x - o, (_ > 0 || v) && (A = ++f.frame, p = x - f.time * 1e3, f.time = x = x / 1e3, o += _ + (_ >= n ? 4 : n - _), w = 1), v || (h = c(m)), w)
      for (u = 0; u < a.length; u++)
        a[u](x, p, A, g);
  };
  return f = {
    time: 0,
    frame: 0,
    tick: function() {
      d(!0);
    },
    deltaRatio: function(m) {
      return p / (1e3 / (m || 60));
    },
    wake: function() {
      Lc && (!lo && Vo() && (ge = lo = window, Ho = ge.document || {}, Qt.gsap = Vt, (ge.gsapVersions || (ge.gsapVersions = [])).push(Vt.version), zc(fn || ge.GreenSockGlobals || !ge.gsap && ge || {}), eu.forEach(iu)), l = typeof requestAnimationFrame < "u" && requestAnimationFrame, h && f.sleep(), c = l || function(m) {
        return setTimeout(m, o - f.time * 1e3 + 1 | 0);
      }, Tr = 1, d(2));
    },
    sleep: function() {
      (l ? cancelAnimationFrame : clearTimeout)(h), Tr = 0, c = kr;
    },
    lagSmoothing: function(m, g) {
      t = m || 1 / 0, e = Math.min(g || 33, t);
    },
    fps: function(m) {
      n = 1e3 / (m || 240), o = f.time * 1e3 + n;
    },
    add: function(m, g, y) {
      var v = g ? function(_, w, x, A) {
        m(_, w, x, A), f.remove(v);
      } : m;
      return f.remove(m), a[y ? "unshift" : "push"](v), Hi(), v;
    },
    remove: function(m, g) {
      ~(g = a.indexOf(m)) && a.splice(g, 1) && u >= g && u--;
    },
    _listeners: a
  }, f;
}(), Hi = function() {
  return !Tr && Yt.wake();
}, W = {}, t0 = /^[\d.\-M][\d.\-,\s]/, e0 = /["']/g, i0 = function(i) {
  for (var t = {}, e = i.substr(1, i.length - 3).split(":"), r = e[0], s = 1, n = e.length, o, a, h; s < n; s++)
    a = e[s], o = s !== n - 1 ? a.lastIndexOf(",") : a.length, h = a.substr(0, o), t[r] = isNaN(h) ? h.replace(e0, "").trim() : +h, r = a.substr(o + 1).trim();
  return t;
}, r0 = function(i) {
  var t = i.indexOf("(") + 1, e = i.indexOf(")"), r = i.indexOf("(", t);
  return i.substring(t, ~r && r < e ? i.indexOf(")", e + 1) : e);
}, n0 = function(i) {
  var t = (i + "").split("("), e = W[t[0]];
  return e && t.length > 1 && e.config ? e.config.apply(null, ~i.indexOf("{") ? [i0(t[1])] : r0(i).split(",").map(Hc)) : W._CE && t0.test(i) ? W._CE("", i) : e;
}, ou = function(i) {
  return function(t) {
    return 1 - i(1 - t);
  };
}, au = function i(t, e) {
  for (var r = t._first, s; r; )
    r instanceof It ? i(r, e) : r.vars.yoyoEase && (!r._yoyo || !r._repeat) && r._yoyo !== e && (r.timeline ? i(r.timeline, e) : (s = r._ease, r._ease = r._yEase, r._yEase = s, r._yoyo = e)), r = r._next;
}, ci = function(i, t) {
  return i && (lt(i) ? i : W[i] || n0(i)) || t;
}, gi = function(i, t, e, r) {
  e === void 0 && (e = function(o) {
    return 1 - t(1 - o);
  }), r === void 0 && (r = function(o) {
    return o < 0.5 ? t(o * 2) / 2 : 1 - t((1 - o) * 2) / 2;
  });
  var s = {
    easeIn: t,
    easeOut: e,
    easeInOut: r
  }, n;
  return Dt(i, function(o) {
    W[o] = Qt[o] = s, W[n = o.toLowerCase()] = e;
    for (var a in s)
      W[n + (a === "easeIn" ? ".in" : a === "easeOut" ? ".out" : ".inOut")] = W[o + "." + a] = s[a];
  }), s;
}, hu = function(i) {
  return function(t) {
    return t < 0.5 ? (1 - i(1 - t * 2)) / 2 : 0.5 + i((t - 0.5) * 2) / 2;
  };
}, Ts = function i(t, e, r) {
  var s = e >= 1 ? e : 1, n = (r || (t ? 0.3 : 0.45)) / (e < 1 ? e : 1), o = n / ao * (Math.asin(1 / s) || 0), a = function(c) {
    return c === 1 ? 1 : s * Math.pow(2, -10 * c) * Rg((c - o) * n) + 1;
  }, h = t === "out" ? a : t === "in" ? function(c) {
    return 1 - a(1 - c);
  } : hu(a);
  return n = ao / n, h.config = function(c, l) {
    return i(t, c, l);
  }, h;
}, Es = function i(t, e) {
  e === void 0 && (e = 1.70158);
  var r = function(n) {
    return n ? --n * n * ((e + 1) * n + e) + 1 : 0;
  }, s = t === "out" ? r : t === "in" ? function(n) {
    return 1 - r(1 - n);
  } : hu(r);
  return s.config = function(n) {
    return i(t, n);
  }, s;
};
Dt("Linear,Quad,Cubic,Quart,Quint,Strong", function(i, t) {
  var e = t < 5 ? t + 1 : t;
  gi(i + ",Power" + (e - 1), t ? function(r) {
    return Math.pow(r, e);
  } : function(r) {
    return r;
  }, function(r) {
    return 1 - Math.pow(1 - r, e);
  }, function(r) {
    return r < 0.5 ? Math.pow(r * 2, e) / 2 : 1 - Math.pow((1 - r) * 2, e) / 2;
  });
});
W.Linear.easeNone = W.none = W.Linear.easeIn;
gi("Elastic", Ts("in"), Ts("out"), Ts());
(function(i, t) {
  var e = 1 / t, r = 2 * e, s = 2.5 * e, n = function(o) {
    return o < e ? i * o * o : o < r ? i * Math.pow(o - 1.5 / t, 2) + 0.75 : o < s ? i * (o -= 2.25 / t) * o + 0.9375 : i * Math.pow(o - 2.625 / t, 2) + 0.984375;
  };
  gi("Bounce", function(o) {
    return 1 - n(1 - o);
  }, n);
})(7.5625, 2.75);
gi("Expo", function(i) {
  return i ? Math.pow(2, 10 * (i - 1)) : 0;
});
gi("Circ", function(i) {
  return -(Bc(1 - i * i) - 1);
});
gi("Sine", function(i) {
  return i === 1 ? 1 : -Bg(i * Tg) + 1;
});
gi("Back", Es("in"), Es("out"), Es());
W.SteppedEase = W.steps = Qt.SteppedEase = {
  config: function(i, t) {
    i === void 0 && (i = 1);
    var e = 1 / i, r = i + (t ? 0 : 1), s = t ? 1 : 0, n = 1 - tt;
    return function(o) {
      return ((r * zr(0, n, o) | 0) + s) * e;
    };
  }
};
Ui.ease = W["quad.out"];
Dt("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function(i) {
  return Wo += i + "," + i + "Params,";
});
var lu = function(i, t) {
  this.id = Eg++, i._gsap = this, this.target = i, this.harness = t, this.get = t ? t.get : Gc, this.set = t ? t.getSetter : Qo;
}, Er = /* @__PURE__ */ function() {
  function i(e) {
    this.vars = e, this._delay = +e.delay || 0, (this._repeat = e.repeat === 1 / 0 ? -2 : e.repeat || 0) && (this._rDelay = e.repeatDelay || 0, this._yoyo = !!e.yoyo || !!e.yoyoEase), this._ts = 1, Vi(this, +e.duration, 1, 1), this.data = e.data, et && (this._ctx = et, et.data.push(this)), Tr || Yt.wake();
  }
  var t = i.prototype;
  return t.delay = function(e) {
    return e || e === 0 ? (this.parent && this.parent.smoothChildTiming && this.startTime(this._start + e - this._delay), this._delay = e, this) : this._delay;
  }, t.duration = function(e) {
    return arguments.length ? this.totalDuration(this._repeat > 0 ? e + (e + this._rDelay) * this._repeat : e) : this.totalDuration() && this._dur;
  }, t.totalDuration = function(e) {
    return arguments.length ? (this._dirty = 0, Vi(this, this._repeat < 0 ? e : (e - this._repeat * this._rDelay) / (this._repeat + 1))) : this._tDur;
  }, t.totalTime = function(e, r) {
    if (Hi(), !arguments.length)
      return this._tTime;
    var s = this._dp;
    if (s && s.smoothChildTiming && this._ts) {
      for (Ln(this, e), !s._dp || s.parent || Wc(s, this); s && s.parent; )
        s.parent._time !== s._start + (s._ts >= 0 ? s._tTime / s._ts : (s.totalDuration() - s._tTime) / -s._ts) && s.totalTime(s._tTime, !0), s = s.parent;
      !this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && e < this._tDur || this._ts < 0 && e > 0 || !this._tDur && !e) && ye(this._dp, this, this._start - this._delay);
    }
    return (this._tTime !== e || !this._dur && !r || this._initted && Math.abs(this._zTime) === tt || !e && !this._initted && (this.add || this._ptLookup)) && (this._ts || (this._pTime = e), Vc(this, e, r)), this;
  }, t.time = function(e, r) {
    return arguments.length ? this.totalTime(Math.min(this.totalDuration(), e + Mh(this)) % (this._dur + this._rDelay) || (e ? this._dur : 0), r) : this._time;
  }, t.totalProgress = function(e, r) {
    return arguments.length ? this.totalTime(this.totalDuration() * e, r) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() > 0 ? 1 : 0;
  }, t.progress = function(e, r) {
    return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - e : e) + Mh(this), r) : this.duration() ? Math.min(1, this._time / this._dur) : this.rawTime() > 0 ? 1 : 0;
  }, t.iteration = function(e, r) {
    var s = this.duration() + this._rDelay;
    return arguments.length ? this.totalTime(this._time + (e - 1) * s, r) : this._repeat ? Gi(this._tTime, s) + 1 : 1;
  }, t.timeScale = function(e, r) {
    if (!arguments.length)
      return this._rts === -tt ? 0 : this._rts;
    if (this._rts === e)
      return this;
    var s = this.parent && this._ts ? yn(this.parent._time, this) : this._tTime;
    return this._rts = +e || 0, this._ts = this._ps || e === -tt ? 0 : this._rts, this.totalTime(zr(-Math.abs(this._delay), this._tDur, s), r !== !1), Fn(this), Ug(this);
  }, t.paused = function(e) {
    return arguments.length ? (this._ps !== e && (this._ps = e, e ? (this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()), this._ts = this._act = 0) : (Hi(), this._ts = this._rts, this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== tt && (this._tTime -= tt)))), this) : this._ps;
  }, t.startTime = function(e) {
    if (arguments.length) {
      this._start = e;
      var r = this.parent || this._dp;
      return r && (r._sort || !this.parent) && ye(r, this, e - this._delay), this;
    }
    return this._start;
  }, t.endTime = function(e) {
    return this._start + (zt(e) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
  }, t.rawTime = function(e) {
    var r = this.parent || this._dp;
    return r ? e && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : this._ts ? yn(r.rawTime(e), this) : this._tTime : this._tTime;
  }, t.revert = function(e) {
    e === void 0 && (e = Fg);
    var r = Tt;
    return Tt = e, (this._initted || this._startAt) && (this.timeline && this.timeline.revert(e), this.totalTime(-0.01, e.suppressEvents)), this.data !== "nested" && e.kill !== !1 && this.kill(), Tt = r, this;
  }, t.globalTime = function(e) {
    for (var r = this, s = arguments.length ? e : r.rawTime(); r; )
      s = r._start + s / (Math.abs(r._ts) || 1), r = r._dp;
    return !this.parent && this._sat ? this._sat.globalTime(e) : s;
  }, t.repeat = function(e) {
    return arguments.length ? (this._repeat = e === 1 / 0 ? -2 : e, Th(this)) : this._repeat === -2 ? 1 / 0 : this._repeat;
  }, t.repeatDelay = function(e) {
    if (arguments.length) {
      var r = this._time;
      return this._rDelay = e, Th(this), r ? this.time(r) : this;
    }
    return this._rDelay;
  }, t.yoyo = function(e) {
    return arguments.length ? (this._yoyo = e, this) : this._yoyo;
  }, t.seek = function(e, r) {
    return this.totalTime(Jt(this, e), zt(r));
  }, t.restart = function(e, r) {
    return this.play().totalTime(e ? -this._delay : 0, zt(r));
  }, t.play = function(e, r) {
    return e != null && this.seek(e, r), this.reversed(!1).paused(!1);
  }, t.reverse = function(e, r) {
    return e != null && this.seek(e || this.totalDuration(), r), this.reversed(!0).paused(!1);
  }, t.pause = function(e, r) {
    return e != null && this.seek(e, r), this.paused(!0);
  }, t.resume = function() {
    return this.paused(!1);
  }, t.reversed = function(e) {
    return arguments.length ? (!!e !== this.reversed() && this.timeScale(-this._rts || (e ? -tt : 0)), this) : this._rts < 0;
  }, t.invalidate = function() {
    return this._initted = this._act = 0, this._zTime = -tt, this;
  }, t.isActive = function() {
    var e = this.parent || this._dp, r = this._start, s;
    return !!(!e || this._ts && this._initted && e.isActive() && (s = e.rawTime(!0)) >= r && s < this.endTime(!0) - tt);
  }, t.eventCallback = function(e, r, s) {
    var n = this.vars;
    return arguments.length > 1 ? (r ? (n[e] = r, s && (n[e + "Params"] = s), e === "onUpdate" && (this._onUpdate = r)) : delete n[e], this) : n[e];
  }, t.then = function(e) {
    var r = this;
    return new Promise(function(s) {
      var n = lt(e) ? e : jc, o = function() {
        var a = r.then;
        r.then = null, lt(n) && (n = n(r)) && (n.then || n === r) && (r.then = a), s(n), r.then = a;
      };
      r._initted && r.totalProgress() === 1 && r._ts >= 0 || !r._tTime && r._ts < 0 ? o() : r._prom = o;
    });
  }, t.kill = function() {
    lr(this);
  }, i;
}();
re(Er.prototype, {
  _time: 0,
  _start: 0,
  _end: 0,
  _tTime: 0,
  _tDur: 0,
  _dirty: 0,
  _repeat: 0,
  _yoyo: !1,
  parent: null,
  _initted: !1,
  _rDelay: 0,
  _ts: 1,
  _dp: 0,
  ratio: 0,
  _zTime: -tt,
  _prom: 0,
  _ps: !1,
  _rts: 1
});
var It = /* @__PURE__ */ function(i) {
  Ec(t, i);
  function t(r, s) {
    var n;
    return r === void 0 && (r = {}), n = i.call(this, r) || this, n.labels = {}, n.smoothChildTiming = !!r.smoothChildTiming, n.autoRemoveChildren = !!r.autoRemoveChildren, n._sort = zt(r.sortChildren), rt && ye(r.parent || rt, ke(n), s), r.reversed && n.reverse(), r.paused && n.paused(!0), r.scrollTrigger && Yc(ke(n), r.scrollTrigger), n;
  }
  var e = t.prototype;
  return e.to = function(r, s, n) {
    return yr(0, arguments, this), this;
  }, e.from = function(r, s, n) {
    return yr(1, arguments, this), this;
  }, e.fromTo = function(r, s, n, o) {
    return yr(2, arguments, this), this;
  }, e.set = function(r, s, n) {
    return s.duration = 0, s.parent = this, gr(s).repeatDelay || (s.repeat = 0), s.immediateRender = !!s.immediateRender, new pt(r, s, Jt(this, n), 1), this;
  }, e.call = function(r, s, n) {
    return ye(this, pt.delayedCall(0, r, s), n);
  }, e.staggerTo = function(r, s, n, o, a, h, c) {
    return n.duration = s, n.stagger = n.stagger || o, n.onComplete = h, n.onCompleteParams = c, n.parent = this, new pt(r, n, Jt(this, a)), this;
  }, e.staggerFrom = function(r, s, n, o, a, h, c) {
    return n.runBackwards = 1, gr(n).immediateRender = zt(n.immediateRender), this.staggerTo(r, s, n, o, a, h, c);
  }, e.staggerFromTo = function(r, s, n, o, a, h, c, l) {
    return o.startAt = n, gr(o).immediateRender = zt(o.immediateRender), this.staggerTo(r, s, o, a, h, c, l);
  }, e.render = function(r, s, n) {
    var o = this._time, a = this._dirty ? this.totalDuration() : this._tDur, h = this._dur, c = r <= 0 ? 0 : wt(r), l = this._zTime < 0 != r < 0 && (this._initted || !h), f, p, u, d, m, g, y, v, _, w, x, A;
    if (this !== rt && c > a && r >= 0 && (c = a), c !== this._tTime || n || l) {
      if (o !== this._time && h && (c += this._time - o, r += this._time - o), f = c, _ = this._start, v = this._ts, g = !v, l && (h || (o = this._zTime), (r || !s) && (this._zTime = r)), this._repeat) {
        if (x = this._yoyo, m = h + this._rDelay, this._repeat < -1 && r < 0)
          return this.totalTime(m * 100 + r, s, n);
        if (f = wt(c % m), c === a ? (d = this._repeat, f = h) : (d = ~~(c / m), d && d === c / m && (f = h, d--), f > h && (f = h)), w = Gi(this._tTime, m), !o && this._tTime && w !== d && this._tTime - w * m - this._dur <= 0 && (w = d), x && d & 1 && (f = h - f, A = 1), d !== w && !this._lock) {
          var S = x && w & 1, b = S === (x && d & 1);
          if (d < w && (S = !S), o = S ? 0 : c % h ? h : c, this._lock = 1, this.render(o || (A ? 0 : wt(d * m)), s, !h)._lock = 0, this._tTime = c, !s && this.parent && Xt(this, "onRepeat"), this.vars.repeatRefresh && !A && (this.invalidate()._lock = 1), o && o !== this._time || g !== !this._ts || this.vars.onRepeat && !this.parent && !this._act)
            return this;
          if (h = this._dur, a = this._tDur, b && (this._lock = 2, o = S ? h : -1e-4, this.render(o, !0), this.vars.repeatRefresh && !A && this.invalidate()), this._lock = 0, !this._ts && !g)
            return this;
          au(this, A);
        }
      }
      if (this._hasPause && !this._forcing && this._lock < 2 && (y = jg(this, wt(o), wt(f)), y && (c -= f - (f = y._start))), this._tTime = c, this._time = f, this._act = !v, this._initted || (this._onUpdate = this.vars.onUpdate, this._initted = 1, this._zTime = r, o = 0), !o && f && !s && !d && (Xt(this, "onStart"), this._tTime !== c))
        return this;
      if (f >= o && r >= 0)
        for (p = this._first; p; ) {
          if (u = p._next, (p._act || f >= p._start) && p._ts && y !== p) {
            if (p.parent !== this)
              return this.render(r, s, n);
            if (p.render(p._ts > 0 ? (f - p._start) * p._ts : (p._dirty ? p.totalDuration() : p._tDur) + (f - p._start) * p._ts, s, n), f !== this._time || !this._ts && !g) {
              y = 0, u && (c += this._zTime = -tt);
              break;
            }
          }
          p = u;
        }
      else {
        p = this._last;
        for (var C = r < 0 ? r : f; p; ) {
          if (u = p._prev, (p._act || C <= p._end) && p._ts && y !== p) {
            if (p.parent !== this)
              return this.render(r, s, n);
            if (p.render(p._ts > 0 ? (C - p._start) * p._ts : (p._dirty ? p.totalDuration() : p._tDur) + (C - p._start) * p._ts, s, n || Tt && (p._initted || p._startAt)), f !== this._time || !this._ts && !g) {
              y = 0, u && (c += this._zTime = C ? -tt : tt);
              break;
            }
          }
          p = u;
        }
      }
      if (y && !s && (this.pause(), y.render(f >= o ? 0 : -tt)._zTime = f >= o ? 1 : -1, this._ts))
        return this._start = _, Fn(this), this.render(r, s, n);
      this._onUpdate && !s && Xt(this, "onUpdate", !0), (c === a && this._tTime >= this.totalDuration() || !c && o) && (_ === this._start || Math.abs(v) !== Math.abs(this._ts)) && (this._lock || ((r || !h) && (c === a && this._ts > 0 || !c && this._ts < 0) && Ne(this, 1), !s && !(r < 0 && !o) && (c || o || !a) && (Xt(this, c === a && r >= 0 ? "onComplete" : "onReverseComplete", !0), this._prom && !(c < a && this.timeScale() > 0) && this._prom())));
    }
    return this;
  }, e.add = function(r, s) {
    var n = this;
    if (Ie(s) || (s = Jt(this, s, r)), !(r instanceof Er)) {
      if (Et(r))
        return r.forEach(function(o) {
          return n.add(o, s);
        }), this;
      if (At(r))
        return this.addLabel(r, s);
      if (lt(r))
        r = pt.delayedCall(0, r);
      else
        return this;
    }
    return this !== r ? ye(this, r, s) : this;
  }, e.getChildren = function(r, s, n, o) {
    r === void 0 && (r = !0), s === void 0 && (s = !0), n === void 0 && (n = !0), o === void 0 && (o = -ee);
    for (var a = [], h = this._first; h; )
      h._start >= o && (h instanceof pt ? s && a.push(h) : (n && a.push(h), r && a.push.apply(a, h.getChildren(!0, s, n)))), h = h._next;
    return a;
  }, e.getById = function(r) {
    for (var s = this.getChildren(1, 1, 1), n = s.length; n--; )
      if (s[n].vars.id === r)
        return s[n];
  }, e.remove = function(r) {
    return At(r) ? this.removeLabel(r) : lt(r) ? this.killTweensOf(r) : (On(this, r), r === this._recent && (this._recent = this._last), li(this));
  }, e.totalTime = function(r, s) {
    return arguments.length ? (this._forcing = 1, !this._dp && this._ts && (this._start = wt(Yt.time - (this._ts > 0 ? r / this._ts : (this.totalDuration() - r) / -this._ts))), i.prototype.totalTime.call(this, r, s), this._forcing = 0, this) : this._tTime;
  }, e.addLabel = function(r, s) {
    return this.labels[r] = Jt(this, s), this;
  }, e.removeLabel = function(r) {
    return delete this.labels[r], this;
  }, e.addPause = function(r, s, n) {
    var o = pt.delayedCall(0, s || kr, n);
    return o.data = "isPause", this._hasPause = 1, ye(this, o, Jt(this, r));
  }, e.removePause = function(r) {
    var s = this._first;
    for (r = Jt(this, r); s; )
      s._start === r && s.data === "isPause" && Ne(s), s = s._next;
  }, e.killTweensOf = function(r, s, n) {
    for (var o = this.getTweensOf(r, n), a = o.length; a--; )
      De !== o[a] && o[a].kill(r, s);
    return this;
  }, e.getTweensOf = function(r, s) {
    for (var n = [], o = ie(r), a = this._first, h = Ie(s), c; a; )
      a instanceof pt ? Lg(a._targets, o) && (h ? (!De || a._initted && a._ts) && a.globalTime(0) <= s && a.globalTime(a.totalDuration()) > s : !s || a.isActive()) && n.push(a) : (c = a.getTweensOf(o, s)).length && n.push.apply(n, c), a = a._next;
    return n;
  }, e.tweenTo = function(r, s) {
    s = s || {};
    var n = this, o = Jt(n, r), a = s, h = a.startAt, c = a.onStart, l = a.onStartParams, f = a.immediateRender, p, u = pt.to(n, re({
      ease: s.ease || "none",
      lazy: !1,
      immediateRender: !1,
      time: o,
      overwrite: "auto",
      duration: s.duration || Math.abs((o - (h && "time" in h ? h.time : n._time)) / n.timeScale()) || tt,
      onStart: function() {
        if (n.pause(), !p) {
          var d = s.duration || Math.abs((o - (h && "time" in h ? h.time : n._time)) / n.timeScale());
          u._dur !== d && Vi(u, d, 0, 1).render(u._time, !0, !0), p = 1;
        }
        c && c.apply(u, l || []);
      }
    }, s));
    return f ? u.render(0) : u;
  }, e.tweenFromTo = function(r, s, n) {
    return this.tweenTo(s, re({
      startAt: {
        time: Jt(this, r)
      }
    }, n));
  }, e.recent = function() {
    return this._recent;
  }, e.nextLabel = function(r) {
    return r === void 0 && (r = this._time), Eh(this, Jt(this, r));
  }, e.previousLabel = function(r) {
    return r === void 0 && (r = this._time), Eh(this, Jt(this, r), 1);
  }, e.currentLabel = function(r) {
    return arguments.length ? this.seek(r, !0) : this.previousLabel(this._time + tt);
  }, e.shiftChildren = function(r, s, n) {
    n === void 0 && (n = 0);
    for (var o = this._first, a = this.labels, h; o; )
      o._start >= n && (o._start += r, o._end += r), o = o._next;
    if (s)
      for (h in a)
        a[h] >= n && (a[h] += r);
    return li(this);
  }, e.invalidate = function(r) {
    var s = this._first;
    for (this._lock = 0; s; )
      s.invalidate(r), s = s._next;
    return i.prototype.invalidate.call(this, r);
  }, e.clear = function(r) {
    r === void 0 && (r = !0);
    for (var s = this._first, n; s; )
      n = s._next, this.remove(s), s = n;
    return this._dp && (this._time = this._tTime = this._pTime = 0), r && (this.labels = {}), li(this);
  }, e.totalDuration = function(r) {
    var s = 0, n = this, o = n._last, a = ee, h, c, l;
    if (arguments.length)
      return n.timeScale((n._repeat < 0 ? n.duration() : n.totalDuration()) / (n.reversed() ? -r : r));
    if (n._dirty) {
      for (l = n.parent; o; )
        h = o._prev, o._dirty && o.totalDuration(), c = o._start, c > a && n._sort && o._ts && !n._lock ? (n._lock = 1, ye(n, o, c - o._delay, 1)._lock = 0) : a = c, c < 0 && o._ts && (s -= c, (!l && !n._dp || l && l.smoothChildTiming) && (n._start += c / n._ts, n._time -= c, n._tTime -= c), n.shiftChildren(-c, !1, -1 / 0), a = 0), o._end > s && o._ts && (s = o._end), o = h;
      Vi(n, n === rt && n._time > s ? n._time : s, 1, 1), n._dirty = 0;
    }
    return n._tDur;
  }, t.updateRoot = function(r) {
    if (rt._ts && (Vc(rt, yn(r, rt)), Uc = Yt.frame), Yt.frame >= Ph) {
      Ph += qt.autoSleep || 120;
      var s = rt._first;
      if ((!s || !s._ts) && qt.autoSleep && Yt._listeners.length < 2) {
        for (; s && !s._ts; )
          s = s._next;
        s || Yt.sleep();
      }
    }
  }, t;
}(Er);
re(It.prototype, {
  _lock: 0,
  _hasPause: 0,
  _forcing: 0
});
var s0 = function(i, t, e, r, s, n, o) {
  var a = new Ut(this._pt, i, t, 0, 1, mu, null, s), h = 0, c = 0, l, f, p, u, d, m, g, y;
  for (a.b = e, a.e = r, e += "", r += "", (g = ~r.indexOf("random(")) && (r = Mr(r)), n && (y = [e, r], n(y, i, t), e = y[0], r = y[1]), f = e.match(Ps) || []; l = Ps.exec(r); )
    u = l[0], d = r.substring(h, l.index), p ? p = (p + 1) % 5 : d.substr(-5) === "rgba(" && (p = 1), u !== f[c++] && (m = parseFloat(f[c - 1]) || 0, a._pt = {
      _next: a._pt,
      p: d || c === 1 ? d : ",",
      //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
      s: m,
      c: u.charAt(1) === "=" ? Ri(m, u) - m : parseFloat(u) - m,
      m: p && p < 4 ? Math.round : 0
    }, h = Ps.lastIndex);
  return a.c = h < r.length ? r.substring(h, r.length) : "", a.fp = o, (Oc.test(r) || g) && (a.e = 0), this._pt = a, a;
}, Xo = function(i, t, e, r, s, n, o, a, h, c) {
  lt(r) && (r = r(s || 0, i, n));
  var l = i[t], f = e !== "get" ? e : lt(l) ? h ? i[t.indexOf("set") || !lt(i["get" + t.substr(3)]) ? t : "get" + t.substr(3)](h) : i[t]() : l, p = lt(l) ? h ? c0 : pu : Ko, u;
  if (At(r) && (~r.indexOf("random(") && (r = Mr(r)), r.charAt(1) === "=" && (u = Ri(f, r) + (Pt(f) || 0), (u || u === 0) && (r = u))), !c || f !== r || yo)
    return !isNaN(f * r) && r !== "" ? (u = new Ut(this._pt, i, t, +f || 0, r - (f || 0), typeof l == "boolean" ? d0 : fu, 0, p), h && (u.fp = h), o && u.modifier(o, this, i), this._pt = u) : (!l && !(t in i) && jo(t, r), s0.call(this, i, t, f, r, p, a || qt.stringFilter, h));
}, o0 = function(i, t, e, r, s) {
  if (lt(i) && (i = xr(i, s, t, e, r)), !we(i) || i.style && i.nodeType || Et(i) || Rc(i))
    return At(i) ? xr(i, s, t, e, r) : i;
  var n = {}, o;
  for (o in i)
    n[o] = xr(i[o], s, t, e, r);
  return n;
}, cu = function(i, t, e, r, s, n) {
  var o, a, h, c;
  if (Wt[i] && (o = new Wt[i]()).init(s, o.rawVars ? t[i] : o0(t[i], r, s, n, e), e, r, n) !== !1 && (e._pt = a = new Ut(e._pt, s, i, 0, 1, o.render, o, 0, o.priority), e !== ki))
    for (h = e._ptLookup[e._targets.indexOf(s)], c = o._props.length; c--; )
      h[o._props[c]] = a;
  return o;
}, De, yo, qo = function i(t, e, r) {
  var s = t.vars, n = s.ease, o = s.startAt, a = s.immediateRender, h = s.lazy, c = s.onUpdate, l = s.runBackwards, f = s.yoyoEase, p = s.keyframes, u = s.autoRevert, d = t._dur, m = t._startAt, g = t._targets, y = t.parent, v = y && y.data === "nested" ? y.vars.targets : g, _ = t._overwrite === "auto" && !Uo, w = t.timeline, x, A, S, b, C, P, k, M, T, E, B, R, I;
  if (w && (!p || !n) && (n = "none"), t._ease = ci(n, Ui.ease), t._yEase = f ? ou(ci(f === !0 ? n : f, Ui.ease)) : 0, f && t._yoyo && !t._repeat && (f = t._yEase, t._yEase = t._ease, t._ease = f), t._from = !w && !!s.runBackwards, !w || p && !s.stagger) {
    if (M = g[0] ? hi(g[0]).harness : 0, R = M && s[M.prop], x = gn(s, No), m && (m._zTime < 0 && m.progress(1), e < 0 && l && a && !u ? m.render(-1, !0) : m.revert(l && d ? sn : Og), m._lazy = 0), o) {
      if (Ne(t._startAt = pt.set(g, re({
        data: "isStart",
        overwrite: !1,
        parent: y,
        immediateRender: !0,
        lazy: !m && zt(h),
        startAt: null,
        delay: 0,
        onUpdate: c && function() {
          return Xt(t, "onUpdate");
        },
        stagger: 0
      }, o))), t._startAt._dp = 0, t._startAt._sat = t, e < 0 && (Tt || !a && !u) && t._startAt.revert(sn), a && d && e <= 0 && r <= 0) {
        e && (t._zTime = e);
        return;
      }
    } else if (l && d && !m) {
      if (e && (a = !1), S = re({
        overwrite: !1,
        data: "isFromStart",
        //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
        lazy: a && !m && zt(h),
        immediateRender: a,
        //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
        stagger: 0,
        parent: y
        //ensures that nested tweens that had a stagger are handled properly, like gsap.from(".class", {y: gsap.utils.wrap([-100,100]), stagger: 0.5})
      }, x), R && (S[M.prop] = R), Ne(t._startAt = pt.set(g, S)), t._startAt._dp = 0, t._startAt._sat = t, e < 0 && (Tt ? t._startAt.revert(sn) : t._startAt.render(-1, !0)), t._zTime = e, !a)
        i(t._startAt, tt, tt);
      else if (!e)
        return;
    }
    for (t._pt = t._ptCache = 0, h = d && zt(h) || h && !d, A = 0; A < g.length; A++) {
      if (C = g[A], k = C._gsap || Yo(g)[A]._gsap, t._ptLookup[A] = E = {}, co[k.id] && He.length && mn(), B = v === g ? A : v.indexOf(C), M && (T = new M()).init(C, R || x, t, B, v) !== !1 && (t._pt = b = new Ut(t._pt, C, T.name, 0, 1, T.render, T, 0, T.priority), T._props.forEach(function(U) {
        E[U] = b;
      }), T.priority && (P = 1)), !M || R)
        for (S in x)
          Wt[S] && (T = cu(S, x, t, B, C, v)) ? T.priority && (P = 1) : E[S] = b = Xo.call(t, C, S, "get", x[S], B, v, 0, s.stringFilter);
      t._op && t._op[A] && t.kill(C, t._op[A]), _ && t._pt && (De = t, rt.killTweensOf(C, E, t.globalTime(e)), I = !t.parent, De = 0), t._pt && h && (co[k.id] = 1);
    }
    P && gu(t), t._onInit && t._onInit(t);
  }
  t._onUpdate = c, t._initted = (!t._op || t._pt) && !I, p && e <= 0 && w.render(ee, !0, !0);
}, a0 = function(i, t, e, r, s, n, o, a) {
  var h = (i._pt && i._ptCache || (i._ptCache = {}))[t], c, l, f, p;
  if (!h)
    for (h = i._ptCache[t] = [], f = i._ptLookup, p = i._targets.length; p--; ) {
      if (c = f[p][t], c && c.d && c.d._pt)
        for (c = c.d._pt; c && c.p !== t && c.fp !== t; )
          c = c._next;
      if (!c)
        return yo = 1, i.vars[t] = "+=0", qo(i, o), yo = 0, a ? Pr(t + " not eligible for reset") : 1;
      h.push(c);
    }
  for (p = h.length; p--; )
    l = h[p], c = l._pt || l, c.s = (r || r === 0) && !s ? r : c.s + (r || 0) + n * c.c, c.c = e - c.s, l.e && (l.e = ut(e) + Pt(l.e)), l.b && (l.b = c.s + Pt(l.b));
}, h0 = function(i, t) {
  var e = i[0] ? hi(i[0]).harness : 0, r = e && e.aliases, s, n, o, a;
  if (!r)
    return t;
  s = fi({}, t);
  for (n in r)
    if (n in s)
      for (a = r[n].split(","), o = a.length; o--; )
        s[a[o]] = s[n];
  return s;
}, l0 = function(i, t, e, r) {
  var s = t.ease || r || "power1.inOut", n, o;
  if (Et(t))
    o = e[i] || (e[i] = []), t.forEach(function(a, h) {
      return o.push({
        t: h / (t.length - 1) * 100,
        v: a,
        e: s
      });
    });
  else
    for (n in t)
      o = e[n] || (e[n] = []), n === "ease" || o.push({
        t: parseFloat(i),
        v: t[n],
        e: s
      });
}, xr = function(i, t, e, r, s) {
  return lt(i) ? i.call(t, e, r, s) : At(i) && ~i.indexOf("random(") ? Mr(i) : i;
}, uu = Wo + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert", du = {};
Dt(uu + ",id,stagger,delay,duration,paused,scrollTrigger", function(i) {
  return du[i] = 1;
});
var pt = /* @__PURE__ */ function(i) {
  Ec(t, i);
  function t(r, s, n, o) {
    var a;
    typeof s == "number" && (n.duration = s, s = n, n = null), a = i.call(this, o ? s : gr(s)) || this;
    var h = a.vars, c = h.duration, l = h.delay, f = h.immediateRender, p = h.stagger, u = h.overwrite, d = h.keyframes, m = h.defaults, g = h.scrollTrigger, y = h.yoyoEase, v = s.parent || rt, _ = (Et(r) || Rc(r) ? Ie(r[0]) : "length" in s) ? [r] : ie(r), w, x, A, S, b, C, P, k;
    if (a._targets = _.length ? Yo(_) : Pr("GSAP target " + r + " not found. https://gsap.com", !qt.nullTargetWarn) || [], a._ptLookup = [], a._overwrite = u, d || p || Zr(c) || Zr(l)) {
      if (s = a.vars, w = a.timeline = new It({
        data: "nested",
        defaults: m || {},
        targets: v && v.data === "nested" ? v.vars.targets : _
      }), w.kill(), w.parent = w._dp = ke(a), w._start = 0, p || Zr(c) || Zr(l)) {
        if (S = _.length, P = p && Qc(p), we(p))
          for (b in p)
            ~uu.indexOf(b) && (k || (k = {}), k[b] = p[b]);
        for (x = 0; x < S; x++)
          A = gn(s, du), A.stagger = 0, y && (A.yoyoEase = y), k && fi(A, k), C = _[x], A.duration = +xr(c, ke(a), x, C, _), A.delay = (+xr(l, ke(a), x, C, _) || 0) - a._delay, !p && S === 1 && A.delay && (a._delay = l = A.delay, a._start += l, A.delay = 0), w.to(C, A, P ? P(x, C, _) : 0), w._ease = W.none;
        w.duration() ? c = l = 0 : a.timeline = 0;
      } else if (d) {
        gr(re(w.vars.defaults, {
          ease: "none"
        })), w._ease = ci(d.ease || s.ease || "none");
        var M = 0, T, E, B;
        if (Et(d))
          d.forEach(function(R) {
            return w.to(_, R, ">");
          }), w.duration();
        else {
          A = {};
          for (b in d)
            b === "ease" || b === "easeEach" || l0(b, d[b], A, d.easeEach);
          for (b in A)
            for (T = A[b].sort(function(R, I) {
              return R.t - I.t;
            }), M = 0, x = 0; x < T.length; x++)
              E = T[x], B = {
                ease: E.e,
                duration: (E.t - (x ? T[x - 1].t : 0)) / 100 * c
              }, B[b] = E.v, w.to(_, B, M), M += B.duration;
          w.duration() < c && w.to({}, {
            duration: c - w.duration()
          });
        }
      }
      c || a.duration(c = w.duration());
    } else
      a.timeline = 0;
    return u === !0 && !Uo && (De = ke(a), rt.killTweensOf(_), De = 0), ye(v, ke(a), n), s.reversed && a.reverse(), s.paused && a.paused(!0), (f || !c && !d && a._start === wt(v._time) && zt(f) && Gg(ke(a)) && v.data !== "nested") && (a._tTime = -tt, a.render(Math.max(0, -l) || 0)), g && Yc(ke(a), g), a;
  }
  var e = t.prototype;
  return e.render = function(r, s, n) {
    var o = this._time, a = this._tDur, h = this._dur, c = r < 0, l = r > a - tt && !c ? a : r < tt ? 0 : r, f, p, u, d, m, g, y, v, _;
    if (!h)
      Hg(this, r, s, n);
    else if (l !== this._tTime || !r || n || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== c) {
      if (f = l, v = this.timeline, this._repeat) {
        if (d = h + this._rDelay, this._repeat < -1 && c)
          return this.totalTime(d * 100 + r, s, n);
        if (f = wt(l % d), l === a ? (u = this._repeat, f = h) : (u = ~~(l / d), u && u === wt(l / d) && (f = h, u--), f > h && (f = h)), g = this._yoyo && u & 1, g && (_ = this._yEase, f = h - f), m = Gi(this._tTime, d), f === o && !n && this._initted && u === m)
          return this._tTime = l, this;
        u !== m && (v && this._yEase && au(v, g), this.vars.repeatRefresh && !g && !this._lock && this._time !== d && this._initted && (this._lock = n = 1, this.render(wt(d * u), !0).invalidate()._lock = 0));
      }
      if (!this._initted) {
        if (Xc(this, c ? r : f, n, s, l))
          return this._tTime = 0, this;
        if (o !== this._time && !(n && this.vars.repeatRefresh && u !== m))
          return this;
        if (h !== this._dur)
          return this.render(r, s, n);
      }
      if (this._tTime = l, this._time = f, !this._act && this._ts && (this._act = 1, this._lazy = 0), this.ratio = y = (_ || this._ease)(f / h), this._from && (this.ratio = y = 1 - y), f && !o && !s && !u && (Xt(this, "onStart"), this._tTime !== l))
        return this;
      for (p = this._pt; p; )
        p.r(y, p.d), p = p._next;
      v && v.render(r < 0 ? r : v._dur * v._ease(f / this._dur), s, n) || this._startAt && (this._zTime = r), this._onUpdate && !s && (c && uo(this, r, s, n), Xt(this, "onUpdate")), this._repeat && u !== m && this.vars.onRepeat && !s && this.parent && Xt(this, "onRepeat"), (l === this._tDur || !l) && this._tTime === l && (c && !this._onUpdate && uo(this, r, !0, !0), (r || !h) && (l === this._tDur && this._ts > 0 || !l && this._ts < 0) && Ne(this, 1), !s && !(c && !o) && (l || o || g) && (Xt(this, l === a ? "onComplete" : "onReverseComplete", !0), this._prom && !(l < a && this.timeScale() > 0) && this._prom()));
    }
    return this;
  }, e.targets = function() {
    return this._targets;
  }, e.invalidate = function(r) {
    return (!r || !this.vars.runBackwards) && (this._startAt = 0), this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0, this._ptLookup = [], this.timeline && this.timeline.invalidate(r), i.prototype.invalidate.call(this, r);
  }, e.resetTo = function(r, s, n, o, a) {
    Tr || Yt.wake(), this._ts || this.play();
    var h = Math.min(this._dur, (this._dp._time - this._start) * this._ts), c;
    return this._initted || qo(this, h), c = this._ease(h / this._dur), a0(this, r, s, n, o, c, h, a) ? this.resetTo(r, s, n, o, 1) : (Ln(this, 0), this.parent || Nc(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0), this.render(0));
  }, e.kill = function(r, s) {
    if (s === void 0 && (s = "all"), !r && (!s || s === "all"))
      return this._lazy = this._pt = 0, this.parent ? lr(this) : this;
    if (this.timeline) {
      var n = this.timeline.totalDuration();
      return this.timeline.killTweensOf(r, s, De && De.vars.overwrite !== !0)._first || lr(this), this.parent && n !== this.timeline.totalDuration() && Vi(this, this._dur * this.timeline._tDur / n, 0, 1), this;
    }
    var o = this._targets, a = r ? ie(r) : o, h = this._ptLookup, c = this._pt, l, f, p, u, d, m, g;
    if ((!s || s === "all") && Dg(o, a))
      return s === "all" && (this._pt = 0), lr(this);
    for (l = this._op = this._op || [], s !== "all" && (At(s) && (d = {}, Dt(s, function(y) {
      return d[y] = 1;
    }), s = d), s = h0(o, s)), g = o.length; g--; )
      if (~a.indexOf(o[g])) {
        f = h[g], s === "all" ? (l[g] = s, u = f, p = {}) : (p = l[g] = l[g] || {}, u = s);
        for (d in u)
          m = f && f[d], m && ((!("kill" in m.d) || m.d.kill(d) === !0) && On(this, m, "_pt"), delete f[d]), p !== "all" && (p[d] = 1);
      }
    return this._initted && !this._pt && c && lr(this), this;
  }, t.to = function(r, s) {
    return new t(r, s, arguments[2]);
  }, t.from = function(r, s) {
    return yr(1, arguments);
  }, t.delayedCall = function(r, s, n, o) {
    return new t(s, 0, {
      immediateRender: !1,
      lazy: !1,
      overwrite: !1,
      delay: r,
      onComplete: s,
      onReverseComplete: s,
      onCompleteParams: n,
      onReverseCompleteParams: n,
      callbackScope: o
    });
  }, t.fromTo = function(r, s, n) {
    return yr(2, arguments);
  }, t.set = function(r, s) {
    return s.duration = 0, s.repeatDelay || (s.repeat = 0), new t(r, s);
  }, t.killTweensOf = function(r, s, n) {
    return rt.killTweensOf(r, s, n);
  }, t;
}(Er);
re(pt.prototype, {
  _targets: [],
  _lazy: 0,
  _startAt: 0,
  _op: 0,
  _onInit: 0
});
Dt("staggerTo,staggerFrom,staggerFromTo", function(i) {
  pt[i] = function() {
    var t = new It(), e = fo.call(arguments, 0);
    return e.splice(i === "staggerFromTo" ? 5 : 4, 0, 0), t[i].apply(t, e);
  };
});
var Ko = function(i, t, e) {
  return i[t] = e;
}, pu = function(i, t, e) {
  return i[t](e);
}, c0 = function(i, t, e, r) {
  return i[t](r.fp, e);
}, u0 = function(i, t, e) {
  return i.setAttribute(t, e);
}, Qo = function(i, t) {
  return lt(i[t]) ? pu : Go(i[t]) && i.setAttribute ? u0 : Ko;
}, fu = function(i, t) {
  return t.set(t.t, t.p, Math.round((t.s + t.c * i) * 1e6) / 1e6, t);
}, d0 = function(i, t) {
  return t.set(t.t, t.p, !!(t.s + t.c * i), t);
}, mu = function(i, t) {
  var e = t._pt, r = "";
  if (!i && t.b)
    r = t.b;
  else if (i === 1 && t.e)
    r = t.e;
  else {
    for (; e; )
      r = e.p + (e.m ? e.m(e.s + e.c * i) : Math.round((e.s + e.c * i) * 1e4) / 1e4) + r, e = e._next;
    r += t.c;
  }
  t.set(t.t, t.p, r, t);
}, Jo = function(i, t) {
  for (var e = t._pt; e; )
    e.r(i, e.d), e = e._next;
}, p0 = function(i, t, e, r) {
  for (var s = this._pt, n; s; )
    n = s._next, s.p === r && s.modifier(i, t, e), s = n;
}, f0 = function(i) {
  for (var t = this._pt, e, r; t; )
    r = t._next, t.p === i && !t.op || t.op === i ? On(this, t, "_pt") : t.dep || (e = 1), t = r;
  return !e;
}, m0 = function(i, t, e, r) {
  r.mSet(i, t, r.m.call(r.tween, e, r.mt), r);
}, gu = function(i) {
  for (var t = i._pt, e, r, s, n; t; ) {
    for (e = t._next, r = s; r && r.pr > t.pr; )
      r = r._next;
    (t._prev = r ? r._prev : n) ? t._prev._next = t : s = t, (t._next = r) ? r._prev = t : n = t, t = e;
  }
  i._pt = s;
}, Ut = /* @__PURE__ */ function() {
  function i(e, r, s, n, o, a, h, c, l) {
    this.t = r, this.s = n, this.c = o, this.p = s, this.r = a || fu, this.d = h || this, this.set = c || Ko, this.pr = l || 0, this._next = e, e && (e._prev = this);
  }
  var t = i.prototype;
  return t.modifier = function(e, r, s) {
    this.mSet = this.mSet || this.set, this.set = m0, this.m = e, this.mt = s, this.tween = r;
  }, i;
}();
Dt(Wo + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", function(i) {
  return No[i] = 1;
});
Qt.TweenMax = Qt.TweenLite = pt;
Qt.TimelineLite = Qt.TimelineMax = It;
rt = new It({
  sortChildren: !1,
  defaults: Ui,
  autoRemoveChildren: !0,
  id: "root",
  smoothChildTiming: !0
});
qt.stringFilter = su;
var ui = [], an = {}, g0 = [], Rh = 0, y0 = 0, Bs = function(i) {
  return (an[i] || g0).map(function(t) {
    return t();
  });
}, xo = function() {
  var i = Date.now(), t = [];
  i - Rh > 2 && (Bs("matchMediaInit"), ui.forEach(function(e) {
    var r = e.queries, s = e.conditions, n, o, a, h;
    for (o in r)
      n = ge.matchMedia(r[o]).matches, n && (a = 1), n !== s[o] && (s[o] = n, h = 1);
    h && (e.revert(), a && t.push(e));
  }), Bs("matchMediaRevert"), t.forEach(function(e) {
    return e.onMatch(e, function(r) {
      return e.add(null, r);
    });
  }), Rh = i, Bs("matchMedia"));
}, yu = /* @__PURE__ */ function() {
  function i(e, r) {
    this.selector = r && mo(r), this.data = [], this._r = [], this.isReverted = !1, this.id = y0++, e && this.add(e);
  }
  var t = i.prototype;
  return t.add = function(e, r, s) {
    lt(e) && (s = r, r = e, e = lt);
    var n = this, o = function() {
      var a = et, h = n.selector, c;
      return a && a !== n && a.data.push(n), s && (n.selector = mo(s)), et = n, c = r.apply(n, arguments), lt(c) && n._r.push(c), et = a, n.selector = h, n.isReverted = !1, c;
    };
    return n.last = o, e === lt ? o(n, function(a) {
      return n.add(null, a);
    }) : e ? n[e] = o : o;
  }, t.ignore = function(e) {
    var r = et;
    et = null, e(this), et = r;
  }, t.getTweens = function() {
    var e = [];
    return this.data.forEach(function(r) {
      return r instanceof i ? e.push.apply(e, r.getTweens()) : r instanceof pt && !(r.parent && r.parent.data === "nested") && e.push(r);
    }), e;
  }, t.clear = function() {
    this._r.length = this.data.length = 0;
  }, t.kill = function(e, r) {
    var s = this;
    if (e ? function() {
      for (var o = s.getTweens(), a = s.data.length, h; a--; )
        h = s.data[a], h.data === "isFlip" && (h.revert(), h.getChildren(!0, !0, !1).forEach(function(c) {
          return o.splice(o.indexOf(c), 1);
        }));
      for (o.map(function(c) {
        return {
          g: c._dur || c._delay || c._sat && !c._sat.vars.immediateRender ? c.globalTime(0) : -1 / 0,
          t: c
        };
      }).sort(function(c, l) {
        return l.g - c.g || -1 / 0;
      }).forEach(function(c) {
        return c.t.revert(e);
      }), a = s.data.length; a--; )
        h = s.data[a], h instanceof It ? h.data !== "nested" && (h.scrollTrigger && h.scrollTrigger.revert(), h.kill()) : !(h instanceof pt) && h.revert && h.revert(e);
      s._r.forEach(function(c) {
        return c(e, s);
      }), s.isReverted = !0;
    }() : this.data.forEach(function(o) {
      return o.kill && o.kill();
    }), this.clear(), r)
      for (var n = ui.length; n--; )
        ui[n].id === this.id && ui.splice(n, 1);
  }, t.revert = function(e) {
    this.kill(e || {});
  }, i;
}(), x0 = /* @__PURE__ */ function() {
  function i(e) {
    this.contexts = [], this.scope = e, et && et.data.push(this);
  }
  var t = i.prototype;
  return t.add = function(e, r, s) {
    we(e) || (e = {
      matches: e
    });
    var n = new yu(0, s || this.scope), o = n.conditions = {}, a, h, c;
    et && !n.selector && (n.selector = et.selector), this.contexts.push(n), r = n.add("onMatch", r), n.queries = e;
    for (h in e)
      h === "all" ? c = 1 : (a = ge.matchMedia(e[h]), a && (ui.indexOf(n) < 0 && ui.push(n), (o[h] = a.matches) && (c = 1), a.addListener ? a.addListener(xo) : a.addEventListener("change", xo)));
    return c && r(n, function(l) {
      return n.add(null, l);
    }), this;
  }, t.revert = function(e) {
    this.kill(e || {});
  }, t.kill = function(e) {
    this.contexts.forEach(function(r) {
      return r.kill(e, !0);
    });
  }, i;
}(), xn = {
  registerPlugin: function() {
    for (var i = arguments.length, t = new Array(i), e = 0; e < i; e++)
      t[e] = arguments[e];
    t.forEach(function(r) {
      return iu(r);
    });
  },
  timeline: function(i) {
    return new It(i);
  },
  getTweensOf: function(i, t) {
    return rt.getTweensOf(i, t);
  },
  getProperty: function(i, t, e, r) {
    At(i) && (i = ie(i)[0]);
    var s = hi(i || {}).get, n = e ? jc : Hc;
    return e === "native" && (e = ""), i && (t ? n((Wt[t] && Wt[t].get || s)(i, t, e, r)) : function(o, a, h) {
      return n((Wt[o] && Wt[o].get || s)(i, o, a, h));
    });
  },
  quickSetter: function(i, t, e) {
    if (i = ie(i), i.length > 1) {
      var r = i.map(function(c) {
        return Vt.quickSetter(c, t, e);
      }), s = r.length;
      return function(c) {
        for (var l = s; l--; )
          r[l](c);
      };
    }
    i = i[0] || {};
    var n = Wt[t], o = hi(i), a = o.harness && (o.harness.aliases || {})[t] || t, h = n ? function(c) {
      var l = new n();
      ki._pt = 0, l.init(i, e ? c + e : c, ki, 0, [i]), l.render(1, l), ki._pt && Jo(1, ki);
    } : o.set(i, a);
    return n ? h : function(c) {
      return h(i, a, e ? c + e : c, o, 1);
    };
  },
  quickTo: function(i, t, e) {
    var r, s = Vt.to(i, fi((r = {}, r[t] = "+=0.1", r.paused = !0, r), e || {})), n = function(o, a, h) {
      return s.resetTo(t, o, a, h);
    };
    return n.tween = s, n;
  },
  isTweening: function(i) {
    return rt.getTweensOf(i, !0).length > 0;
  },
  defaults: function(i) {
    return i && i.ease && (i.ease = ci(i.ease, Ui.ease)), kh(Ui, i || {});
  },
  config: function(i) {
    return kh(qt, i || {});
  },
  registerEffect: function(i) {
    var t = i.name, e = i.effect, r = i.plugins, s = i.defaults, n = i.extendTimeline;
    (r || "").split(",").forEach(function(o) {
      return o && !Wt[o] && !Qt[o] && Pr(t + " effect requires " + o + " plugin.");
    }), ks[t] = function(o, a, h) {
      return e(ie(o), re(a || {}, s), h);
    }, n && (It.prototype[t] = function(o, a, h) {
      return this.add(ks[t](o, we(a) ? a : (h = a) && {}, this), h);
    });
  },
  registerEase: function(i, t) {
    W[i] = ci(t);
  },
  parseEase: function(i, t) {
    return arguments.length ? ci(i, t) : W;
  },
  getById: function(i) {
    return rt.getById(i);
  },
  exportRoot: function(i, t) {
    i === void 0 && (i = {});
    var e = new It(i), r, s;
    for (e.smoothChildTiming = zt(i.smoothChildTiming), rt.remove(e), e._dp = 0, e._time = e._tTime = rt._time, r = rt._first; r; )
      s = r._next, (t || !(!r._dur && r instanceof pt && r.vars.onComplete === r._targets[0])) && ye(e, r, r._start - r._delay), r = s;
    return ye(rt, e, 0), e;
  },
  context: function(i, t) {
    return i ? new yu(i, t) : et;
  },
  matchMedia: function(i) {
    return new x0(i);
  },
  matchMediaRefresh: function() {
    return ui.forEach(function(i) {
      var t = i.conditions, e, r;
      for (r in t)
        t[r] && (t[r] = !1, e = 1);
      e && i.revert();
    }) || xo();
  },
  addEventListener: function(i, t) {
    var e = an[i] || (an[i] = []);
    ~e.indexOf(t) || e.push(t);
  },
  removeEventListener: function(i, t) {
    var e = an[i], r = e && e.indexOf(t);
    r >= 0 && e.splice(r, 1);
  },
  utils: {
    wrap: Qg,
    wrapYoyo: Jg,
    distribute: Qc,
    random: Zc,
    snap: Jc,
    normalize: Kg,
    getUnit: Pt,
    clamp: Wg,
    splitColor: ru,
    toArray: ie,
    selector: mo,
    mapRange: tu,
    pipe: Xg,
    unitize: qg,
    interpolate: Zg,
    shuffle: Kc
  },
  install: zc,
  effects: ks,
  ticker: Yt,
  updateRoot: It.updateRoot,
  plugins: Wt,
  globalTimeline: rt,
  core: {
    PropTween: Ut,
    globals: Dc,
    Tween: pt,
    Timeline: It,
    Animation: Er,
    getCache: hi,
    _removeLinkedListItem: On,
    reverting: function() {
      return Tt;
    },
    context: function(i) {
      return i && et && (et.data.push(i), i._ctx = et), et;
    },
    suppressOverwrites: function(i) {
      return Uo = i;
    }
  }
};
Dt("to,from,fromTo,delayedCall,set,killTweensOf", function(i) {
  return xn[i] = pt[i];
});
Yt.add(It.updateRoot);
ki = xn.to({}, {
  duration: 0
});
var v0 = function(i, t) {
  for (var e = i._pt; e && e.p !== t && e.op !== t && e.fp !== t; )
    e = e._next;
  return e;
}, b0 = function(i, t) {
  var e = i._targets, r, s, n;
  for (r in t)
    for (s = e.length; s--; )
      n = i._ptLookup[s][r], n && (n = n.d) && (n._pt && (n = v0(n, r)), n && n.modifier && n.modifier(t[r], i, e[s], r));
}, Rs = function(i, t) {
  return {
    name: i,
    rawVars: 1,
    //don't pre-process function-based values or "random()" strings.
    init: function(e, r, s) {
      s._onInit = function(n) {
        var o, a;
        if (At(r) && (o = {}, Dt(r, function(h) {
          return o[h] = 1;
        }), r = o), t) {
          o = {};
          for (a in r)
            o[a] = t(r[a]);
          r = o;
        }
        b0(n, r);
      };
    }
  };
}, Vt = xn.registerPlugin({
  name: "attr",
  init: function(i, t, e, r, s) {
    var n, o, a;
    this.tween = e;
    for (n in t)
      a = i.getAttribute(n) || "", o = this.add(i, "setAttribute", (a || 0) + "", t[n], r, s, 0, 0, n), o.op = n, o.b = a, this._props.push(n);
  },
  render: function(i, t) {
    for (var e = t._pt; e; )
      Tt ? e.set(e.t, e.p, e.b, e) : e.r(i, e.d), e = e._next;
  }
}, {
  name: "endArray",
  init: function(i, t) {
    for (var e = t.length; e--; )
      this.add(i, e, i[e] || 0, t[e], 0, 0, 0, 0, 0, 1);
  }
}, Rs("roundProps", go), Rs("modifiers"), Rs("snap", Jc)) || xn;
pt.version = It.version = Vt.version = "3.12.5";
Lc = 1;
Vo() && Hi();
W.Power0;
W.Power1;
W.Power2;
W.Power3;
W.Power4;
W.Linear;
W.Quad;
W.Cubic;
W.Quart;
W.Quint;
W.Strong;
W.Elastic;
W.Back;
W.SteppedEase;
W.Bounce;
W.Sine;
W.Expo;
W.Circ;
/*!
 * CSSPlugin 3.12.5
 * https://gsap.com
 *
 * Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/
var Ih, Ue, Ii, Zo, oi, Oh, $o, _0 = function() {
  return typeof window < "u";
}, Oe = {}, ei = 180 / Math.PI, Oi = Math.PI / 180, wi = Math.atan2, Fh = 1e8, ta = /([A-Z])/g, w0 = /(left|right|width|margin|padding|x)/i, A0 = /[\s,\(]\S/, ve = {
  autoAlpha: "opacity,visibility",
  scale: "scaleX,scaleY",
  alpha: "opacity"
}, vo = function(i, t) {
  return t.set(t.t, t.p, Math.round((t.s + t.c * i) * 1e4) / 1e4 + t.u, t);
}, S0 = function(i, t) {
  return t.set(t.t, t.p, i === 1 ? t.e : Math.round((t.s + t.c * i) * 1e4) / 1e4 + t.u, t);
}, C0 = function(i, t) {
  return t.set(t.t, t.p, i ? Math.round((t.s + t.c * i) * 1e4) / 1e4 + t.u : t.b, t);
}, P0 = function(i, t) {
  var e = t.s + t.c * i;
  t.set(t.t, t.p, ~~(e + (e < 0 ? -0.5 : 0.5)) + t.u, t);
}, xu = function(i, t) {
  return t.set(t.t, t.p, i ? t.e : t.b, t);
}, vu = function(i, t) {
  return t.set(t.t, t.p, i !== 1 ? t.b : t.e, t);
}, k0 = function(i, t, e) {
  return i.style[t] = e;
}, M0 = function(i, t, e) {
  return i.style.setProperty(t, e);
}, T0 = function(i, t, e) {
  return i._gsap[t] = e;
}, E0 = function(i, t, e) {
  return i._gsap.scaleX = i._gsap.scaleY = e;
}, B0 = function(i, t, e, r, s) {
  var n = i._gsap;
  n.scaleX = n.scaleY = e, n.renderTransform(s, n);
}, R0 = function(i, t, e, r, s) {
  var n = i._gsap;
  n[t] = e, n.renderTransform(s, n);
}, ot = "transform", Gt = ot + "Origin", I0 = function i(t, e) {
  var r = this, s = this.target, n = s.style, o = s._gsap;
  if (t in Oe && n) {
    if (this.tfm = this.tfm || {}, t !== "transform")
      t = ve[t] || t, ~t.indexOf(",") ? t.split(",").forEach(function(a) {
        return r.tfm[a] = Me(s, a);
      }) : this.tfm[t] = o.x ? o[t] : Me(s, t), t === Gt && (this.tfm.zOrigin = o.zOrigin);
    else
      return ve.transform.split(",").forEach(function(a) {
        return i.call(r, a, e);
      });
    if (this.props.indexOf(ot) >= 0)
      return;
    o.svg && (this.svgo = s.getAttribute("data-svg-origin"), this.props.push(Gt, e, "")), t = ot;
  }
  (n || e) && this.props.push(t, e, n[t]);
}, bu = function(i) {
  i.translate && (i.removeProperty("translate"), i.removeProperty("scale"), i.removeProperty("rotate"));
}, O0 = function() {
  var i = this.props, t = this.target, e = t.style, r = t._gsap, s, n;
  for (s = 0; s < i.length; s += 3)
    i[s + 1] ? t[i[s]] = i[s + 2] : i[s + 2] ? e[i[s]] = i[s + 2] : e.removeProperty(i[s].substr(0, 2) === "--" ? i[s] : i[s].replace(ta, "-$1").toLowerCase());
  if (this.tfm) {
    for (n in this.tfm)
      r[n] = this.tfm[n];
    r.svg && (r.renderTransform(), t.setAttribute("data-svg-origin", this.svgo || "")), s = $o(), (!s || !s.isStart) && !e[ot] && (bu(e), r.zOrigin && e[Gt] && (e[Gt] += " " + r.zOrigin + "px", r.zOrigin = 0, r.renderTransform()), r.uncache = 1);
  }
}, _u = function(i, t) {
  var e = {
    target: i,
    props: [],
    revert: O0,
    save: I0
  };
  return i._gsap || Vt.core.getCache(i), t && t.split(",").forEach(function(r) {
    return e.save(r);
  }), e;
}, wu, bo = function(i, t) {
  var e = Ue.createElementNS ? Ue.createElementNS((t || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), i) : Ue.createElement(i);
  return e && e.style ? e : Ue.createElement(i);
}, be = function i(t, e, r) {
  var s = getComputedStyle(t);
  return s[e] || s.getPropertyValue(e.replace(ta, "-$1").toLowerCase()) || s.getPropertyValue(e) || !r && i(t, ji(e) || e, 1) || "";
}, Lh = "O,Moz,ms,Ms,Webkit".split(","), ji = function(i, t, e) {
  var r = t || oi, s = r.style, n = 5;
  if (i in s && !e)
    return i;
  for (i = i.charAt(0).toUpperCase() + i.substr(1); n-- && !(Lh[n] + i in s); )
    ;
  return n < 0 ? null : (n === 3 ? "ms" : n >= 0 ? Lh[n] : "") + i;
}, _o = function() {
  _0() && window.document && (Ih = window, Ue = Ih.document, Ii = Ue.documentElement, oi = bo("div") || {
    style: {}
  }, bo("div"), ot = ji(ot), Gt = ot + "Origin", oi.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0", wu = !!ji("perspective"), $o = Vt.core.reverting, Zo = 1);
}, Is = function i(t) {
  var e = bo("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"), r = this.parentNode, s = this.nextSibling, n = this.style.cssText, o;
  if (Ii.appendChild(e), e.appendChild(this), this.style.display = "block", t)
    try {
      o = this.getBBox(), this._gsapBBox = this.getBBox, this.getBBox = i;
    } catch {
    }
  else this._gsapBBox && (o = this._gsapBBox());
  return r && (s ? r.insertBefore(this, s) : r.appendChild(this)), Ii.removeChild(e), this.style.cssText = n, o;
}, zh = function(i, t) {
  for (var e = t.length; e--; )
    if (i.hasAttribute(t[e]))
      return i.getAttribute(t[e]);
}, Au = function(i) {
  var t;
  try {
    t = i.getBBox();
  } catch {
    t = Is.call(i, !0);
  }
  return t && (t.width || t.height) || i.getBBox === Is || (t = Is.call(i, !0)), t && !t.width && !t.x && !t.y ? {
    x: +zh(i, ["x", "cx", "x1"]) || 0,
    y: +zh(i, ["y", "cy", "y1"]) || 0,
    width: 0,
    height: 0
  } : t;
}, Su = function(i) {
  return !!(i.getCTM && (!i.parentNode || i.ownerSVGElement) && Au(i));
}, mi = function(i, t) {
  if (t) {
    var e = i.style, r;
    t in Oe && t !== Gt && (t = ot), e.removeProperty ? (r = t.substr(0, 2), (r === "ms" || t.substr(0, 6) === "webkit") && (t = "-" + t), e.removeProperty(r === "--" ? t : t.replace(ta, "-$1").toLowerCase())) : e.removeAttribute(t);
  }
}, Ge = function(i, t, e, r, s, n) {
  var o = new Ut(i._pt, t, e, 0, 1, n ? vu : xu);
  return i._pt = o, o.b = r, o.e = s, i._props.push(e), o;
}, Dh = {
  deg: 1,
  rad: 1,
  turn: 1
}, F0 = {
  grid: 1,
  flex: 1
}, We = function i(t, e, r, s) {
  var n = parseFloat(r) || 0, o = (r + "").trim().substr((n + "").length) || "px", a = oi.style, h = w0.test(e), c = t.tagName.toLowerCase() === "svg", l = (c ? "client" : "offset") + (h ? "Width" : "Height"), f = 100, p = s === "px", u = s === "%", d, m, g, y;
  if (s === o || !n || Dh[s] || Dh[o])
    return n;
  if (o !== "px" && !p && (n = i(t, e, r, "px")), y = t.getCTM && Su(t), (u || o === "%") && (Oe[e] || ~e.indexOf("adius")))
    return d = y ? t.getBBox()[h ? "width" : "height"] : t[l], ut(u ? n / d * f : n / 100 * d);
  if (a[h ? "width" : "height"] = f + (p ? o : s), m = ~e.indexOf("adius") || s === "em" && t.appendChild && !c ? t : t.parentNode, y && (m = (t.ownerSVGElement || {}).parentNode), (!m || m === Ue || !m.appendChild) && (m = Ue.body), g = m._gsap, g && u && g.width && h && g.time === Yt.time && !g.uncache)
    return ut(n / g.width * f);
  if (u && (e === "height" || e === "width")) {
    var v = t.style[e];
    t.style[e] = f + s, d = t[l], v ? t.style[e] = v : mi(t, e);
  } else
    (u || o === "%") && !F0[be(m, "display")] && (a.position = be(t, "position")), m === t && (a.position = "static"), m.appendChild(oi), d = oi[l], m.removeChild(oi), a.position = "absolute";
  return h && u && (g = hi(m), g.time = Yt.time, g.width = m[l]), ut(p ? d * n / f : d && n ? f / d * n : 0);
}, Me = function(i, t, e, r) {
  var s;
  return Zo || _o(), t in ve && t !== "transform" && (t = ve[t], ~t.indexOf(",") && (t = t.split(",")[0])), Oe[t] && t !== "transform" ? (s = Rr(i, r), s = t !== "transformOrigin" ? s[t] : s.svg ? s.origin : bn(be(i, Gt)) + " " + s.zOrigin + "px") : (s = i.style[t], (!s || s === "auto" || r || ~(s + "").indexOf("calc(")) && (s = vn[t] && vn[t](i, t, e) || be(i, t) || Gc(i, t) || (t === "opacity" ? 1 : 0))), e && !~(s + "").trim().indexOf(" ") ? We(i, t, s, e) + e : s;
}, L0 = function(i, t, e, r) {
  if (!e || e === "none") {
    var s = ji(t, i, 1), n = s && be(i, s, 1);
    n && n !== e ? (t = s, e = n) : t === "borderColor" && (e = be(i, "borderTopColor"));
  }
  var o = new Ut(this._pt, i.style, t, 0, 1, mu), a = 0, h = 0, c, l, f, p, u, d, m, g, y, v, _, w;
  if (o.b = e, o.e = r, e += "", r += "", r === "auto" && (d = i.style[t], i.style[t] = r, r = be(i, t) || r, d ? i.style[t] = d : mi(i, t)), c = [e, r], su(c), e = c[0], r = c[1], f = e.match(Pi) || [], w = r.match(Pi) || [], w.length) {
    for (; l = Pi.exec(r); )
      m = l[0], y = r.substring(a, l.index), u ? u = (u + 1) % 5 : (y.substr(-5) === "rgba(" || y.substr(-5) === "hsla(") && (u = 1), m !== (d = f[h++] || "") && (p = parseFloat(d) || 0, _ = d.substr((p + "").length), m.charAt(1) === "=" && (m = Ri(p, m) + _), g = parseFloat(m), v = m.substr((g + "").length), a = Pi.lastIndex - v.length, v || (v = v || qt.units[t] || _, a === r.length && (r += v, o.e += v)), _ !== v && (p = We(i, t, d, v) || 0), o._pt = {
        _next: o._pt,
        p: y || h === 1 ? y : ",",
        //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
        s: p,
        c: g - p,
        m: u && u < 4 || t === "zIndex" ? Math.round : 0
      });
    o.c = a < r.length ? r.substring(a, r.length) : "";
  } else
    o.r = t === "display" && r === "none" ? vu : xu;
  return Oc.test(r) && (o.e = 0), this._pt = o, o;
}, Uh = {
  top: "0%",
  bottom: "100%",
  left: "0%",
  right: "100%",
  center: "50%"
}, z0 = function(i) {
  var t = i.split(" "), e = t[0], r = t[1] || "50%";
  return (e === "top" || e === "bottom" || r === "left" || r === "right") && (i = e, e = r, r = i), t[0] = Uh[e] || e, t[1] = Uh[r] || r, t.join(" ");
}, D0 = function(i, t) {
  if (t.tween && t.tween._time === t.tween._dur) {
    var e = t.t, r = e.style, s = t.u, n = e._gsap, o, a, h;
    if (s === "all" || s === !0)
      r.cssText = "", a = 1;
    else
      for (s = s.split(","), h = s.length; --h > -1; )
        o = s[h], Oe[o] && (a = 1, o = o === "transformOrigin" ? Gt : ot), mi(e, o);
    a && (mi(e, ot), n && (n.svg && e.removeAttribute("transform"), Rr(e, 1), n.uncache = 1, bu(r)));
  }
}, vn = {
  clearProps: function(i, t, e, r, s) {
    if (s.data !== "isFromStart") {
      var n = i._pt = new Ut(i._pt, t, e, 0, 0, D0);
      return n.u = r, n.pr = -10, n.tween = s, i._props.push(e), 1;
    }
  }
  /* className feature (about 0.4kb gzipped).
  , className(plugin, target, property, endValue, tween) {
  	let _renderClassName = (ratio, data) => {
  			data.css.render(ratio, data.css);
  			if (!ratio || ratio === 1) {
  				let inline = data.rmv,
  					target = data.t,
  					p;
  				target.setAttribute("class", ratio ? data.e : data.b);
  				for (p in inline) {
  					_removeProperty(target, p);
  				}
  			}
  		},
  		_getAllStyles = (target) => {
  			let styles = {},
  				computed = getComputedStyle(target),
  				p;
  			for (p in computed) {
  				if (isNaN(p) && p !== "cssText" && p !== "length") {
  					styles[p] = computed[p];
  				}
  			}
  			_setDefaults(styles, _parseTransform(target, 1));
  			return styles;
  		},
  		startClassList = target.getAttribute("class"),
  		style = target.style,
  		cssText = style.cssText,
  		cache = target._gsap,
  		classPT = cache.classPT,
  		inlineToRemoveAtEnd = {},
  		data = {t:target, plugin:plugin, rmv:inlineToRemoveAtEnd, b:startClassList, e:(endValue.charAt(1) !== "=") ? endValue : startClassList.replace(new RegExp("(?:\\s|^)" + endValue.substr(2) + "(?![\\w-])"), "") + ((endValue.charAt(0) === "+") ? " " + endValue.substr(2) : "")},
  		changingVars = {},
  		startVars = _getAllStyles(target),
  		transformRelated = /(transform|perspective)/i,
  		endVars, p;
  	if (classPT) {
  		classPT.r(1, classPT.d);
  		_removeLinkedListItem(classPT.d.plugin, classPT, "_pt");
  	}
  	target.setAttribute("class", data.e);
  	endVars = _getAllStyles(target, true);
  	target.setAttribute("class", startClassList);
  	for (p in endVars) {
  		if (endVars[p] !== startVars[p] && !transformRelated.test(p)) {
  			changingVars[p] = endVars[p];
  			if (!style[p] && style[p] !== "0") {
  				inlineToRemoveAtEnd[p] = 1;
  			}
  		}
  	}
  	cache.classPT = plugin._pt = new PropTween(plugin._pt, target, "className", 0, 0, _renderClassName, data, 0, -11);
  	if (style.cssText !== cssText) { //only apply if things change. Otherwise, in cases like a background-image that's pulled dynamically, it could cause a refresh. See https://gsap.com/forums/topic/20368-possible-gsap-bug-switching-classnames-in-chrome/.
  		style.cssText = cssText; //we recorded cssText before we swapped classes and ran _getAllStyles() because in cases when a className tween is overwritten, we remove all the related tweening properties from that class change (otherwise class-specific stuff can't override properties we've directly set on the target's style object due to specificity).
  	}
  	_parseTransform(target, true); //to clear the caching of transforms
  	data.css = new gsap.plugins.css();
  	data.css.init(target, changingVars, tween);
  	plugin._props.push(...data.css._props);
  	return 1;
  }
  */
}, Br = [1, 0, 0, 1, 0, 0], Cu = {}, Pu = function(i) {
  return i === "matrix(1, 0, 0, 1, 0, 0)" || i === "none" || !i;
}, Gh = function(i) {
  var t = be(i, ot);
  return Pu(t) ? Br : t.substr(7).match(Ic).map(ut);
}, ea = function(i, t) {
  var e = i._gsap || hi(i), r = i.style, s = Gh(i), n, o, a, h;
  return e.svg && i.getAttribute("transform") ? (a = i.transform.baseVal.consolidate().matrix, s = [a.a, a.b, a.c, a.d, a.e, a.f], s.join(",") === "1,0,0,1,0,0" ? Br : s) : (s === Br && !i.offsetParent && i !== Ii && !e.svg && (a = r.display, r.display = "block", n = i.parentNode, (!n || !i.offsetParent) && (h = 1, o = i.nextElementSibling, Ii.appendChild(i)), s = Gh(i), a ? r.display = a : mi(i, "display"), h && (o ? n.insertBefore(i, o) : n ? n.appendChild(i) : Ii.removeChild(i))), t && s.length > 6 ? [s[0], s[1], s[4], s[5], s[12], s[13]] : s);
}, wo = function(i, t, e, r, s, n) {
  var o = i._gsap, a = s || ea(i, !0), h = o.xOrigin || 0, c = o.yOrigin || 0, l = o.xOffset || 0, f = o.yOffset || 0, p = a[0], u = a[1], d = a[2], m = a[3], g = a[4], y = a[5], v = t.split(" "), _ = parseFloat(v[0]) || 0, w = parseFloat(v[1]) || 0, x, A, S, b;
  e ? a !== Br && (A = p * m - u * d) && (S = _ * (m / A) + w * (-d / A) + (d * y - m * g) / A, b = _ * (-u / A) + w * (p / A) - (p * y - u * g) / A, _ = S, w = b) : (x = Au(i), _ = x.x + (~v[0].indexOf("%") ? _ / 100 * x.width : _), w = x.y + (~(v[1] || v[0]).indexOf("%") ? w / 100 * x.height : w)), r || r !== !1 && o.smooth ? (g = _ - h, y = w - c, o.xOffset = l + (g * p + y * d) - g, o.yOffset = f + (g * u + y * m) - y) : o.xOffset = o.yOffset = 0, o.xOrigin = _, o.yOrigin = w, o.smooth = !!r, o.origin = t, o.originIsAbsolute = !!e, i.style[Gt] = "0px 0px", n && (Ge(n, o, "xOrigin", h, _), Ge(n, o, "yOrigin", c, w), Ge(n, o, "xOffset", l, o.xOffset), Ge(n, o, "yOffset", f, o.yOffset)), i.setAttribute("data-svg-origin", _ + " " + w);
}, Rr = function(i, t) {
  var e = i._gsap || new lu(i);
  if ("x" in e && !t && !e.uncache)
    return e;
  var r = i.style, s = e.scaleX < 0, n = "px", o = "deg", a = getComputedStyle(i), h = be(i, Gt) || "0", c, l, f, p, u, d, m, g, y, v, _, w, x, A, S, b, C, P, k, M, T, E, B, R, I, U, O, F, J, G, Y, ht;
  return c = l = f = d = m = g = y = v = _ = 0, p = u = 1, e.svg = !!(i.getCTM && Su(i)), a.translate && ((a.translate !== "none" || a.scale !== "none" || a.rotate !== "none") && (r[ot] = (a.translate !== "none" ? "translate3d(" + (a.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + (a.rotate !== "none" ? "rotate(" + a.rotate + ") " : "") + (a.scale !== "none" ? "scale(" + a.scale.split(" ").join(",") + ") " : "") + (a[ot] !== "none" ? a[ot] : "")), r.scale = r.rotate = r.translate = "none"), A = ea(i, e.svg), e.svg && (e.uncache ? (I = i.getBBox(), h = e.xOrigin - I.x + "px " + (e.yOrigin - I.y) + "px", R = "") : R = !t && i.getAttribute("data-svg-origin"), wo(i, R || h, !!R || e.originIsAbsolute, e.smooth !== !1, A)), w = e.xOrigin || 0, x = e.yOrigin || 0, A !== Br && (P = A[0], k = A[1], M = A[2], T = A[3], c = E = A[4], l = B = A[5], A.length === 6 ? (p = Math.sqrt(P * P + k * k), u = Math.sqrt(T * T + M * M), d = P || k ? wi(k, P) * ei : 0, y = M || T ? wi(M, T) * ei + d : 0, y && (u *= Math.abs(Math.cos(y * Oi))), e.svg && (c -= w - (w * P + x * M), l -= x - (w * k + x * T))) : (ht = A[6], G = A[7], O = A[8], F = A[9], J = A[10], Y = A[11], c = A[12], l = A[13], f = A[14], S = wi(ht, J), m = S * ei, S && (b = Math.cos(-S), C = Math.sin(-S), R = E * b + O * C, I = B * b + F * C, U = ht * b + J * C, O = E * -C + O * b, F = B * -C + F * b, J = ht * -C + J * b, Y = G * -C + Y * b, E = R, B = I, ht = U), S = wi(-M, J), g = S * ei, S && (b = Math.cos(-S), C = Math.sin(-S), R = P * b - O * C, I = k * b - F * C, U = M * b - J * C, Y = T * C + Y * b, P = R, k = I, M = U), S = wi(k, P), d = S * ei, S && (b = Math.cos(S), C = Math.sin(S), R = P * b + k * C, I = E * b + B * C, k = k * b - P * C, B = B * b - E * C, P = R, E = I), m && Math.abs(m) + Math.abs(d) > 359.9 && (m = d = 0, g = 180 - g), p = ut(Math.sqrt(P * P + k * k + M * M)), u = ut(Math.sqrt(B * B + ht * ht)), S = wi(E, B), y = Math.abs(S) > 2e-4 ? S * ei : 0, _ = Y ? 1 / (Y < 0 ? -Y : Y) : 0), e.svg && (R = i.getAttribute("transform"), e.forceCSS = i.setAttribute("transform", "") || !Pu(be(i, ot)), R && i.setAttribute("transform", R))), Math.abs(y) > 90 && Math.abs(y) < 270 && (s ? (p *= -1, y += d <= 0 ? 180 : -180, d += d <= 0 ? 180 : -180) : (u *= -1, y += y <= 0 ? 180 : -180)), t = t || e.uncache, e.x = c - ((e.xPercent = c && (!t && e.xPercent || (Math.round(i.offsetWidth / 2) === Math.round(-c) ? -50 : 0))) ? i.offsetWidth * e.xPercent / 100 : 0) + n, e.y = l - ((e.yPercent = l && (!t && e.yPercent || (Math.round(i.offsetHeight / 2) === Math.round(-l) ? -50 : 0))) ? i.offsetHeight * e.yPercent / 100 : 0) + n, e.z = f + n, e.scaleX = ut(p), e.scaleY = ut(u), e.rotation = ut(d) + o, e.rotationX = ut(m) + o, e.rotationY = ut(g) + o, e.skewX = y + o, e.skewY = v + o, e.transformPerspective = _ + n, (e.zOrigin = parseFloat(h.split(" ")[2]) || !t && e.zOrigin || 0) && (r[Gt] = bn(h)), e.xOffset = e.yOffset = 0, e.force3D = qt.force3D, e.renderTransform = e.svg ? G0 : wu ? ku : U0, e.uncache = 0, e;
}, bn = function(i) {
  return (i = i.split(" "))[0] + " " + i[1];
}, Os = function(i, t, e) {
  var r = Pt(t);
  return ut(parseFloat(t) + parseFloat(We(i, "x", e + "px", r))) + r;
}, U0 = function(i, t) {
  t.z = "0px", t.rotationY = t.rotationX = "0deg", t.force3D = 0, ku(i, t);
}, Ke = "0deg", nr = "0px", Qe = ") ", ku = function(i, t) {
  var e = t || this, r = e.xPercent, s = e.yPercent, n = e.x, o = e.y, a = e.z, h = e.rotation, c = e.rotationY, l = e.rotationX, f = e.skewX, p = e.skewY, u = e.scaleX, d = e.scaleY, m = e.transformPerspective, g = e.force3D, y = e.target, v = e.zOrigin, _ = "", w = g === "auto" && i && i !== 1 || g === !0;
  if (v && (l !== Ke || c !== Ke)) {
    var x = parseFloat(c) * Oi, A = Math.sin(x), S = Math.cos(x), b;
    x = parseFloat(l) * Oi, b = Math.cos(x), n = Os(y, n, A * b * -v), o = Os(y, o, -Math.sin(x) * -v), a = Os(y, a, S * b * -v + v);
  }
  m !== nr && (_ += "perspective(" + m + Qe), (r || s) && (_ += "translate(" + r + "%, " + s + "%) "), (w || n !== nr || o !== nr || a !== nr) && (_ += a !== nr || w ? "translate3d(" + n + ", " + o + ", " + a + ") " : "translate(" + n + ", " + o + Qe), h !== Ke && (_ += "rotate(" + h + Qe), c !== Ke && (_ += "rotateY(" + c + Qe), l !== Ke && (_ += "rotateX(" + l + Qe), (f !== Ke || p !== Ke) && (_ += "skew(" + f + ", " + p + Qe), (u !== 1 || d !== 1) && (_ += "scale(" + u + ", " + d + Qe), y.style[ot] = _ || "translate(0, 0)";
}, G0 = function(i, t) {
  var e = t || this, r = e.xPercent, s = e.yPercent, n = e.x, o = e.y, a = e.rotation, h = e.skewX, c = e.skewY, l = e.scaleX, f = e.scaleY, p = e.target, u = e.xOrigin, d = e.yOrigin, m = e.xOffset, g = e.yOffset, y = e.forceCSS, v = parseFloat(n), _ = parseFloat(o), w, x, A, S, b;
  a = parseFloat(a), h = parseFloat(h), c = parseFloat(c), c && (c = parseFloat(c), h += c, a += c), a || h ? (a *= Oi, h *= Oi, w = Math.cos(a) * l, x = Math.sin(a) * l, A = Math.sin(a - h) * -f, S = Math.cos(a - h) * f, h && (c *= Oi, b = Math.tan(h - c), b = Math.sqrt(1 + b * b), A *= b, S *= b, c && (b = Math.tan(c), b = Math.sqrt(1 + b * b), w *= b, x *= b)), w = ut(w), x = ut(x), A = ut(A), S = ut(S)) : (w = l, S = f, x = A = 0), (v && !~(n + "").indexOf("px") || _ && !~(o + "").indexOf("px")) && (v = We(p, "x", n, "px"), _ = We(p, "y", o, "px")), (u || d || m || g) && (v = ut(v + u - (u * w + d * A) + m), _ = ut(_ + d - (u * x + d * S) + g)), (r || s) && (b = p.getBBox(), v = ut(v + r / 100 * b.width), _ = ut(_ + s / 100 * b.height)), b = "matrix(" + w + "," + x + "," + A + "," + S + "," + v + "," + _ + ")", p.setAttribute("transform", b), y && (p.style[ot] = b);
}, V0 = function(i, t, e, r, s) {
  var n = 360, o = At(s), a = parseFloat(s) * (o && ~s.indexOf("rad") ? ei : 1), h = a - r, c = r + h + "deg", l, f;
  return o && (l = s.split("_")[1], l === "short" && (h %= n, h !== h % (n / 2) && (h += h < 0 ? n : -n)), l === "cw" && h < 0 ? h = (h + n * Fh) % n - ~~(h / n) * n : l === "ccw" && h > 0 && (h = (h - n * Fh) % n - ~~(h / n) * n)), i._pt = f = new Ut(i._pt, t, e, r, h, S0), f.e = c, f.u = "deg", i._props.push(e), f;
}, Vh = function(i, t) {
  for (var e in t)
    i[e] = t[e];
  return i;
}, H0 = function(i, t, e) {
  var r = Vh({}, e._gsap), s = "perspective,force3D,transformOrigin,svgOrigin", n = e.style, o, a, h, c, l, f, p, u;
  r.svg ? (h = e.getAttribute("transform"), e.setAttribute("transform", ""), n[ot] = t, o = Rr(e, 1), mi(e, ot), e.setAttribute("transform", h)) : (h = getComputedStyle(e)[ot], n[ot] = t, o = Rr(e, 1), n[ot] = h);
  for (a in Oe)
    h = r[a], c = o[a], h !== c && s.indexOf(a) < 0 && (p = Pt(h), u = Pt(c), l = p !== u ? We(e, a, h, u) : parseFloat(h), f = parseFloat(c), i._pt = new Ut(i._pt, o, a, l, f - l, vo), i._pt.u = u || 0, i._props.push(a));
  Vh(o, r);
};
Dt("padding,margin,Width,Radius", function(i, t) {
  var e = "Top", r = "Right", s = "Bottom", n = "Left", o = (t < 3 ? [e, r, s, n] : [e + n, e + r, s + r, s + n]).map(function(a) {
    return t < 2 ? i + a : "border" + a + i;
  });
  vn[t > 1 ? "border" + i : i] = function(a, h, c, l, f) {
    var p, u;
    if (arguments.length < 4)
      return p = o.map(function(d) {
        return Me(a, d, c);
      }), u = p.join(" "), u.split(p[0]).length === 5 ? p[0] : u;
    p = (l + "").split(" "), u = {}, o.forEach(function(d, m) {
      return u[d] = p[m] = p[m] || p[(m - 1) / 2 | 0];
    }), a.init(h, u, f);
  };
});
var Mu = {
  name: "css",
  register: _o,
  targetTest: function(i) {
    return i.style && i.nodeType;
  },
  init: function(i, t, e, r, s) {
    var n = this._props, o = i.style, a = e.vars.startAt, h, c, l, f, p, u, d, m, g, y, v, _, w, x, A, S;
    Zo || _o(), this.styles = this.styles || _u(i), S = this.styles.props, this.tween = e;
    for (d in t)
      if (d !== "autoRound" && (c = t[d], !(Wt[d] && cu(d, t, e, r, i, s)))) {
        if (p = typeof c, u = vn[d], p === "function" && (c = c.call(e, r, i, s), p = typeof c), p === "string" && ~c.indexOf("random(") && (c = Mr(c)), u)
          u(this, i, d, c, e) && (A = 1);
        else if (d.substr(0, 2) === "--")
          h = (getComputedStyle(i).getPropertyValue(d) + "").trim(), c += "", je.lastIndex = 0, je.test(h) || (m = Pt(h), g = Pt(c)), g ? m !== g && (h = We(i, d, h, g) + g) : m && (c += m), this.add(o, "setProperty", h, c, r, s, 0, 0, d), n.push(d), S.push(d, 0, o[d]);
        else if (p !== "undefined") {
          if (a && d in a ? (h = typeof a[d] == "function" ? a[d].call(e, r, i, s) : a[d], At(h) && ~h.indexOf("random(") && (h = Mr(h)), Pt(h + "") || h === "auto" || (h += qt.units[d] || Pt(Me(i, d)) || ""), (h + "").charAt(1) === "=" && (h = Me(i, d))) : h = Me(i, d), f = parseFloat(h), y = p === "string" && c.charAt(1) === "=" && c.substr(0, 2), y && (c = c.substr(2)), l = parseFloat(c), d in ve && (d === "autoAlpha" && (f === 1 && Me(i, "visibility") === "hidden" && l && (f = 0), S.push("visibility", 0, o.visibility), Ge(this, o, "visibility", f ? "inherit" : "hidden", l ? "inherit" : "hidden", !l)), d !== "scale" && d !== "transform" && (d = ve[d], ~d.indexOf(",") && (d = d.split(",")[0]))), v = d in Oe, v) {
            if (this.styles.save(d), _ || (w = i._gsap, w.renderTransform && !t.parseTransform || Rr(i, t.parseTransform), x = t.smoothOrigin !== !1 && w.smooth, _ = this._pt = new Ut(this._pt, o, ot, 0, 1, w.renderTransform, w, 0, -1), _.dep = 1), d === "scale")
              this._pt = new Ut(this._pt, w, "scaleY", w.scaleY, (y ? Ri(w.scaleY, y + l) : l) - w.scaleY || 0, vo), this._pt.u = 0, n.push("scaleY", d), d += "X";
            else if (d === "transformOrigin") {
              S.push(Gt, 0, o[Gt]), c = z0(c), w.svg ? wo(i, c, 0, x, 0, this) : (g = parseFloat(c.split(" ")[2]) || 0, g !== w.zOrigin && Ge(this, w, "zOrigin", w.zOrigin, g), Ge(this, o, d, bn(h), bn(c)));
              continue;
            } else if (d === "svgOrigin") {
              wo(i, c, 1, x, 0, this);
              continue;
            } else if (d in Cu) {
              V0(this, w, d, f, y ? Ri(f, y + c) : c);
              continue;
            } else if (d === "smoothOrigin") {
              Ge(this, w, "smooth", w.smooth, c);
              continue;
            } else if (d === "force3D") {
              w[d] = c;
              continue;
            } else if (d === "transform") {
              H0(this, c, i);
              continue;
            }
          } else d in o || (d = ji(d) || d);
          if (v || (l || l === 0) && (f || f === 0) && !A0.test(c) && d in o)
            m = (h + "").substr((f + "").length), l || (l = 0), g = Pt(c) || (d in qt.units ? qt.units[d] : m), m !== g && (f = We(i, d, h, g)), this._pt = new Ut(this._pt, v ? w : o, d, f, (y ? Ri(f, y + l) : l) - f, !v && (g === "px" || d === "zIndex") && t.autoRound !== !1 ? P0 : vo), this._pt.u = g || 0, m !== g && g !== "%" && (this._pt.b = h, this._pt.r = C0);
          else if (d in o)
            L0.call(this, i, d, h, y ? y + c : c);
          else if (d in i)
            this.add(i, d, h || i[d], y ? y + c : c, r, s);
          else if (d !== "parseTransform") {
            jo(d, c);
            continue;
          }
          v || (d in o ? S.push(d, 0, o[d]) : S.push(d, 1, h || i[d])), n.push(d);
        }
      }
    A && gu(this);
  },
  render: function(i, t) {
    if (t.tween._time || !$o())
      for (var e = t._pt; e; )
        e.r(i, e.d), e = e._next;
    else
      t.styles.revert();
  },
  get: Me,
  aliases: ve,
  getSetter: function(i, t, e) {
    var r = ve[t];
    return r && r.indexOf(",") < 0 && (t = r), t in Oe && t !== Gt && (i._gsap.x || Me(i, "x")) ? e && Oh === e ? t === "scale" ? E0 : T0 : (Oh = e || {}) && (t === "scale" ? B0 : R0) : i.style && !Go(i.style[t]) ? k0 : ~t.indexOf("-") ? M0 : Qo(i, t);
  },
  core: {
    _removeProperty: mi,
    _getMatrix: ea
  }
};
Vt.utils.checkPrefix = ji;
Vt.core.getStyleSaver = _u;
(function(i, t, e, r) {
  var s = Dt(i + "," + t + "," + e, function(n) {
    Oe[n] = 1;
  });
  Dt(t, function(n) {
    qt.units[n] = "deg", Cu[n] = 1;
  }), ve[s[13]] = i + "," + t, Dt(r, function(n) {
    var o = n.split(":");
    ve[o[1]] = s[o[0]];
  });
})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");
Dt("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function(i) {
  qt.units[i] = "px";
});
Vt.registerPlugin(Mu);
var ur = Vt.registerPlugin(Mu) || Vt;
ur.core.Tween;
class qi {
  constructor(t) {
    $t(this, "_options"), $t(this, "_tween", null), this._options = t;
  }
  get options() {
    return this._options;
  }
  get name() {
    return this._options.name;
  }
  start(t) {
    return new Promise((e) => {
      this._tween = ur.fromTo(t, this.options.from, {
        ...this.options.to,
        onComplete: () => e(),
        duration: this.options.duration,
        repeat: this.options.repeat,
        yoyo: this.options.revert,
        ease: this.options.ease,
        delay: this.options.delay,
        repeatDelay: this.options.repeatDelay
      }), this._tween.play();
    });
  }
  stop() {
    var t;
    (t = this._tween) == null || t.kill();
  }
  pause() {
    var t;
    (t = this._tween) == null || t.pause();
  }
  resume() {
    var t;
    (t = this._tween) == null || t.resume();
  }
  finish() {
    var t;
    (t = this._tween) == null || t.progress(1);
  }
  static initEngine() {
    ur.ticker.remove(ur.updateRoot);
  }
  static updateEngine(t) {
    this._rootTimeMs += t, ur.updateRoot(this._rootTimeMs / 1e3);
  }
}
$t(qi, "_rootTimeMs", 0);
var Tu = { exports: {} };
/*!
 * matter-js 0.20.0 by @liabru
 * http://brm.io/matter-js/
 * License MIT
 * 
 * The MIT License (MIT)
 * 
 * Copyright (c) Liam Brummitt and contributors.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function(i, t) {
  (function(e, r) {
    i.exports = r();
  })(ii, function() {
    return (
      /******/
      function(e) {
        var r = {};
        function s(n) {
          if (r[n])
            return r[n].exports;
          var o = r[n] = {
            /******/
            i: n,
            /******/
            l: !1,
            /******/
            exports: {}
            /******/
          };
          return e[n].call(o.exports, o, o.exports, s), o.l = !0, o.exports;
        }
        return s.m = e, s.c = r, s.d = function(n, o, a) {
          s.o(n, o) || Object.defineProperty(n, o, { enumerable: !0, get: a });
        }, s.r = function(n) {
          typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(n, "__esModule", { value: !0 });
        }, s.t = function(n, o) {
          if (o & 1 && (n = s(n)), o & 8 || o & 4 && typeof n == "object" && n && n.__esModule) return n;
          var a = /* @__PURE__ */ Object.create(null);
          if (s.r(a), Object.defineProperty(a, "default", { enumerable: !0, value: n }), o & 2 && typeof n != "string") for (var h in n) s.d(a, h, (function(c) {
            return n[c];
          }).bind(null, h));
          return a;
        }, s.n = function(n) {
          var o = n && n.__esModule ? (
            /******/
            function() {
              return n.default;
            }
          ) : (
            /******/
            function() {
              return n;
            }
          );
          return s.d(o, "a", o), o;
        }, s.o = function(n, o) {
          return Object.prototype.hasOwnProperty.call(n, o);
        }, s.p = "", s(s.s = 20);
      }([
        /* 0 */
        /***/
        function(e, r) {
          var s = {};
          e.exports = s, function() {
            s._baseDelta = 1e3 / 60, s._nextId = 0, s._seed = 0, s._nowStartTime = +/* @__PURE__ */ new Date(), s._warnedOnce = {}, s._decomp = null, s.extend = function(o, a) {
              var h, c;
              typeof a == "boolean" ? (h = 2, c = a) : (h = 1, c = !0);
              for (var l = h; l < arguments.length; l++) {
                var f = arguments[l];
                if (f)
                  for (var p in f)
                    c && f[p] && f[p].constructor === Object && (!o[p] || o[p].constructor === Object) ? (o[p] = o[p] || {}, s.extend(o[p], c, f[p])) : o[p] = f[p];
              }
              return o;
            }, s.clone = function(o, a) {
              return s.extend({}, a, o);
            }, s.keys = function(o) {
              if (Object.keys)
                return Object.keys(o);
              var a = [];
              for (var h in o)
                a.push(h);
              return a;
            }, s.values = function(o) {
              var a = [];
              if (Object.keys) {
                for (var h = Object.keys(o), c = 0; c < h.length; c++)
                  a.push(o[h[c]]);
                return a;
              }
              for (var l in o)
                a.push(o[l]);
              return a;
            }, s.get = function(o, a, h, c) {
              a = a.split(".").slice(h, c);
              for (var l = 0; l < a.length; l += 1)
                o = o[a[l]];
              return o;
            }, s.set = function(o, a, h, c, l) {
              var f = a.split(".").slice(c, l);
              return s.get(o, a, 0, -1)[f[f.length - 1]] = h, h;
            }, s.shuffle = function(o) {
              for (var a = o.length - 1; a > 0; a--) {
                var h = Math.floor(s.random() * (a + 1)), c = o[a];
                o[a] = o[h], o[h] = c;
              }
              return o;
            }, s.choose = function(o) {
              return o[Math.floor(s.random() * o.length)];
            }, s.isElement = function(o) {
              return typeof HTMLElement < "u" ? o instanceof HTMLElement : !!(o && o.nodeType && o.nodeName);
            }, s.isArray = function(o) {
              return Object.prototype.toString.call(o) === "[object Array]";
            }, s.isFunction = function(o) {
              return typeof o == "function";
            }, s.isPlainObject = function(o) {
              return typeof o == "object" && o.constructor === Object;
            }, s.isString = function(o) {
              return toString.call(o) === "[object String]";
            }, s.clamp = function(o, a, h) {
              return o < a ? a : o > h ? h : o;
            }, s.sign = function(o) {
              return o < 0 ? -1 : 1;
            }, s.now = function() {
              if (typeof window < "u" && window.performance) {
                if (window.performance.now)
                  return window.performance.now();
                if (window.performance.webkitNow)
                  return window.performance.webkitNow();
              }
              return Date.now ? Date.now() : /* @__PURE__ */ new Date() - s._nowStartTime;
            }, s.random = function(o, a) {
              return o = typeof o < "u" ? o : 0, a = typeof a < "u" ? a : 1, o + n() * (a - o);
            };
            var n = function() {
              return s._seed = (s._seed * 9301 + 49297) % 233280, s._seed / 233280;
            };
            s.colorToNumber = function(o) {
              return o = o.replace("#", ""), o.length == 3 && (o = o.charAt(0) + o.charAt(0) + o.charAt(1) + o.charAt(1) + o.charAt(2) + o.charAt(2)), parseInt(o, 16);
            }, s.logLevel = 1, s.log = function() {
              console && s.logLevel > 0 && s.logLevel <= 3 && console.log.apply(console, ["matter-js:"].concat(Array.prototype.slice.call(arguments)));
            }, s.info = function() {
              console && s.logLevel > 0 && s.logLevel <= 2 && console.info.apply(console, ["matter-js:"].concat(Array.prototype.slice.call(arguments)));
            }, s.warn = function() {
              console && s.logLevel > 0 && s.logLevel <= 3 && console.warn.apply(console, ["matter-js:"].concat(Array.prototype.slice.call(arguments)));
            }, s.warnOnce = function() {
              var o = Array.prototype.slice.call(arguments).join(" ");
              s._warnedOnce[o] || (s.warn(o), s._warnedOnce[o] = !0);
            }, s.deprecated = function(o, a, h) {
              o[a] = s.chain(function() {
                s.warnOnce("🔅 deprecated 🔅", h);
              }, o[a]);
            }, s.nextId = function() {
              return s._nextId++;
            }, s.indexOf = function(o, a) {
              if (o.indexOf)
                return o.indexOf(a);
              for (var h = 0; h < o.length; h++)
                if (o[h] === a)
                  return h;
              return -1;
            }, s.map = function(o, a) {
              if (o.map)
                return o.map(a);
              for (var h = [], c = 0; c < o.length; c += 1)
                h.push(a(o[c]));
              return h;
            }, s.topologicalSort = function(o) {
              var a = [], h = [], c = [];
              for (var l in o)
                !h[l] && !c[l] && s._topologicalSort(l, h, c, o, a);
              return a;
            }, s._topologicalSort = function(o, a, h, c, l) {
              var f = c[o] || [];
              h[o] = !0;
              for (var p = 0; p < f.length; p += 1) {
                var u = f[p];
                h[u] || a[u] || s._topologicalSort(u, a, h, c, l);
              }
              h[o] = !1, a[o] = !0, l.push(o);
            }, s.chain = function() {
              for (var o = [], a = 0; a < arguments.length; a += 1) {
                var h = arguments[a];
                h._chained ? o.push.apply(o, h._chained) : o.push(h);
              }
              var c = function() {
                for (var l, f = new Array(arguments.length), p = 0, u = arguments.length; p < u; p++)
                  f[p] = arguments[p];
                for (p = 0; p < o.length; p += 1) {
                  var d = o[p].apply(l, f);
                  typeof d < "u" && (l = d);
                }
                return l;
              };
              return c._chained = o, c;
            }, s.chainPathBefore = function(o, a, h) {
              return s.set(o, a, s.chain(
                h,
                s.get(o, a)
              ));
            }, s.chainPathAfter = function(o, a, h) {
              return s.set(o, a, s.chain(
                s.get(o, a),
                h
              ));
            }, s.setDecomp = function(o) {
              s._decomp = o;
            }, s.getDecomp = function() {
              var o = s._decomp;
              try {
                !o && typeof window < "u" && (o = window.decomp), !o && typeof ii < "u" && (o = ii.decomp);
              } catch {
                o = null;
              }
              return o;
            };
          }();
        },
        /* 1 */
        /***/
        function(e, r) {
          var s = {};
          e.exports = s, function() {
            s.create = function(n) {
              var o = {
                min: { x: 0, y: 0 },
                max: { x: 0, y: 0 }
              };
              return n && s.update(o, n), o;
            }, s.update = function(n, o, a) {
              n.min.x = 1 / 0, n.max.x = -1 / 0, n.min.y = 1 / 0, n.max.y = -1 / 0;
              for (var h = 0; h < o.length; h++) {
                var c = o[h];
                c.x > n.max.x && (n.max.x = c.x), c.x < n.min.x && (n.min.x = c.x), c.y > n.max.y && (n.max.y = c.y), c.y < n.min.y && (n.min.y = c.y);
              }
              a && (a.x > 0 ? n.max.x += a.x : n.min.x += a.x, a.y > 0 ? n.max.y += a.y : n.min.y += a.y);
            }, s.contains = function(n, o) {
              return o.x >= n.min.x && o.x <= n.max.x && o.y >= n.min.y && o.y <= n.max.y;
            }, s.overlaps = function(n, o) {
              return n.min.x <= o.max.x && n.max.x >= o.min.x && n.max.y >= o.min.y && n.min.y <= o.max.y;
            }, s.translate = function(n, o) {
              n.min.x += o.x, n.max.x += o.x, n.min.y += o.y, n.max.y += o.y;
            }, s.shift = function(n, o) {
              var a = n.max.x - n.min.x, h = n.max.y - n.min.y;
              n.min.x = o.x, n.max.x = o.x + a, n.min.y = o.y, n.max.y = o.y + h;
            };
          }();
        },
        /* 2 */
        /***/
        function(e, r) {
          var s = {};
          e.exports = s, function() {
            s.create = function(n, o) {
              return { x: n || 0, y: o || 0 };
            }, s.clone = function(n) {
              return { x: n.x, y: n.y };
            }, s.magnitude = function(n) {
              return Math.sqrt(n.x * n.x + n.y * n.y);
            }, s.magnitudeSquared = function(n) {
              return n.x * n.x + n.y * n.y;
            }, s.rotate = function(n, o, a) {
              var h = Math.cos(o), c = Math.sin(o);
              a || (a = {});
              var l = n.x * h - n.y * c;
              return a.y = n.x * c + n.y * h, a.x = l, a;
            }, s.rotateAbout = function(n, o, a, h) {
              var c = Math.cos(o), l = Math.sin(o);
              h || (h = {});
              var f = a.x + ((n.x - a.x) * c - (n.y - a.y) * l);
              return h.y = a.y + ((n.x - a.x) * l + (n.y - a.y) * c), h.x = f, h;
            }, s.normalise = function(n) {
              var o = s.magnitude(n);
              return o === 0 ? { x: 0, y: 0 } : { x: n.x / o, y: n.y / o };
            }, s.dot = function(n, o) {
              return n.x * o.x + n.y * o.y;
            }, s.cross = function(n, o) {
              return n.x * o.y - n.y * o.x;
            }, s.cross3 = function(n, o, a) {
              return (o.x - n.x) * (a.y - n.y) - (o.y - n.y) * (a.x - n.x);
            }, s.add = function(n, o, a) {
              return a || (a = {}), a.x = n.x + o.x, a.y = n.y + o.y, a;
            }, s.sub = function(n, o, a) {
              return a || (a = {}), a.x = n.x - o.x, a.y = n.y - o.y, a;
            }, s.mult = function(n, o) {
              return { x: n.x * o, y: n.y * o };
            }, s.div = function(n, o) {
              return { x: n.x / o, y: n.y / o };
            }, s.perp = function(n, o) {
              return o = o === !0 ? -1 : 1, { x: o * -n.y, y: o * n.x };
            }, s.neg = function(n) {
              return { x: -n.x, y: -n.y };
            }, s.angle = function(n, o) {
              return Math.atan2(o.y - n.y, o.x - n.x);
            }, s._temp = [
              s.create(),
              s.create(),
              s.create(),
              s.create(),
              s.create(),
              s.create()
            ];
          }();
        },
        /* 3 */
        /***/
        function(e, r, s) {
          var n = {};
          e.exports = n;
          var o = s(2), a = s(0);
          (function() {
            n.create = function(h, c) {
              for (var l = [], f = 0; f < h.length; f++) {
                var p = h[f], u = {
                  x: p.x,
                  y: p.y,
                  index: f,
                  body: c,
                  isInternal: !1
                };
                l.push(u);
              }
              return l;
            }, n.fromPath = function(h, c) {
              var l = /L?\s*([-\d.e]+)[\s,]*([-\d.e]+)*/ig, f = [];
              return h.replace(l, function(p, u, d) {
                f.push({ x: parseFloat(u), y: parseFloat(d) });
              }), n.create(f, c);
            }, n.centre = function(h) {
              for (var c = n.area(h, !0), l = { x: 0, y: 0 }, f, p, u, d = 0; d < h.length; d++)
                u = (d + 1) % h.length, f = o.cross(h[d], h[u]), p = o.mult(o.add(h[d], h[u]), f), l = o.add(l, p);
              return o.div(l, 6 * c);
            }, n.mean = function(h) {
              for (var c = { x: 0, y: 0 }, l = 0; l < h.length; l++)
                c.x += h[l].x, c.y += h[l].y;
              return o.div(c, h.length);
            }, n.area = function(h, c) {
              for (var l = 0, f = h.length - 1, p = 0; p < h.length; p++)
                l += (h[f].x - h[p].x) * (h[f].y + h[p].y), f = p;
              return c ? l / 2 : Math.abs(l) / 2;
            }, n.inertia = function(h, c) {
              for (var l = 0, f = 0, p = h, u, d, m = 0; m < p.length; m++)
                d = (m + 1) % p.length, u = Math.abs(o.cross(p[d], p[m])), l += u * (o.dot(p[d], p[d]) + o.dot(p[d], p[m]) + o.dot(p[m], p[m])), f += u;
              return c / 6 * (l / f);
            }, n.translate = function(h, c, l) {
              l = typeof l < "u" ? l : 1;
              var f = h.length, p = c.x * l, u = c.y * l, d;
              for (d = 0; d < f; d++)
                h[d].x += p, h[d].y += u;
              return h;
            }, n.rotate = function(h, c, l) {
              if (c !== 0) {
                var f = Math.cos(c), p = Math.sin(c), u = l.x, d = l.y, m = h.length, g, y, v, _;
                for (_ = 0; _ < m; _++)
                  g = h[_], y = g.x - u, v = g.y - d, g.x = u + (y * f - v * p), g.y = d + (y * p + v * f);
                return h;
              }
            }, n.contains = function(h, c) {
              for (var l = c.x, f = c.y, p = h.length, u = h[p - 1], d, m = 0; m < p; m++) {
                if (d = h[m], (l - u.x) * (d.y - u.y) + (f - u.y) * (u.x - d.x) > 0)
                  return !1;
                u = d;
              }
              return !0;
            }, n.scale = function(h, c, l, f) {
              if (c === 1 && l === 1)
                return h;
              f = f || n.centre(h);
              for (var p, u, d = 0; d < h.length; d++)
                p = h[d], u = o.sub(p, f), h[d].x = f.x + u.x * c, h[d].y = f.y + u.y * l;
              return h;
            }, n.chamfer = function(h, c, l, f, p) {
              typeof c == "number" ? c = [c] : c = c || [8], l = typeof l < "u" ? l : -1, f = f || 2, p = p || 14;
              for (var u = [], d = 0; d < h.length; d++) {
                var m = h[d - 1 >= 0 ? d - 1 : h.length - 1], g = h[d], y = h[(d + 1) % h.length], v = c[d < c.length ? d : c.length - 1];
                if (v === 0) {
                  u.push(g);
                  continue;
                }
                var _ = o.normalise({
                  x: g.y - m.y,
                  y: m.x - g.x
                }), w = o.normalise({
                  x: y.y - g.y,
                  y: g.x - y.x
                }), x = Math.sqrt(2 * Math.pow(v, 2)), A = o.mult(a.clone(_), v), S = o.normalise(o.mult(o.add(_, w), 0.5)), b = o.sub(g, o.mult(S, x)), C = l;
                l === -1 && (C = Math.pow(v, 0.32) * 1.75), C = a.clamp(C, f, p), C % 2 === 1 && (C += 1);
                for (var P = Math.acos(o.dot(_, w)), k = P / C, M = 0; M < C; M++)
                  u.push(o.add(o.rotate(A, k * M), b));
              }
              return u;
            }, n.clockwiseSort = function(h) {
              var c = n.mean(h);
              return h.sort(function(l, f) {
                return o.angle(c, l) - o.angle(c, f);
              }), h;
            }, n.isConvex = function(h) {
              var c = 0, l = h.length, f, p, u, d;
              if (l < 3)
                return null;
              for (f = 0; f < l; f++)
                if (p = (f + 1) % l, u = (f + 2) % l, d = (h[p].x - h[f].x) * (h[u].y - h[p].y), d -= (h[p].y - h[f].y) * (h[u].x - h[p].x), d < 0 ? c |= 1 : d > 0 && (c |= 2), c === 3)
                  return !1;
              return c !== 0 ? !0 : null;
            }, n.hull = function(h) {
              var c = [], l = [], f, p;
              for (h = h.slice(0), h.sort(function(u, d) {
                var m = u.x - d.x;
                return m !== 0 ? m : u.y - d.y;
              }), p = 0; p < h.length; p += 1) {
                for (f = h[p]; l.length >= 2 && o.cross3(l[l.length - 2], l[l.length - 1], f) <= 0; )
                  l.pop();
                l.push(f);
              }
              for (p = h.length - 1; p >= 0; p -= 1) {
                for (f = h[p]; c.length >= 2 && o.cross3(c[c.length - 2], c[c.length - 1], f) <= 0; )
                  c.pop();
                c.push(f);
              }
              return c.pop(), l.pop(), c.concat(l);
            };
          })();
        },
        /* 4 */
        /***/
        function(e, r, s) {
          var n = {};
          e.exports = n;
          var o = s(3), a = s(2), h = s(7), c = s(0), l = s(1), f = s(11);
          (function() {
            n._timeCorrection = !0, n._inertiaScale = 4, n._nextCollidingGroupId = 1, n._nextNonCollidingGroupId = -1, n._nextCategory = 1, n._baseDelta = 1e3 / 60, n.create = function(u) {
              var d = {
                id: c.nextId(),
                type: "body",
                label: "Body",
                parts: [],
                plugin: {},
                angle: 0,
                vertices: o.fromPath("L 0 0 L 40 0 L 40 40 L 0 40"),
                position: { x: 0, y: 0 },
                force: { x: 0, y: 0 },
                torque: 0,
                positionImpulse: { x: 0, y: 0 },
                constraintImpulse: { x: 0, y: 0, angle: 0 },
                totalContacts: 0,
                speed: 0,
                angularSpeed: 0,
                velocity: { x: 0, y: 0 },
                angularVelocity: 0,
                isSensor: !1,
                isStatic: !1,
                isSleeping: !1,
                motion: 0,
                sleepThreshold: 60,
                density: 1e-3,
                restitution: 0,
                friction: 0.1,
                frictionStatic: 0.5,
                frictionAir: 0.01,
                collisionFilter: {
                  category: 1,
                  mask: 4294967295,
                  group: 0
                },
                slop: 0.05,
                timeScale: 1,
                render: {
                  visible: !0,
                  opacity: 1,
                  strokeStyle: null,
                  fillStyle: null,
                  lineWidth: null,
                  sprite: {
                    xScale: 1,
                    yScale: 1,
                    xOffset: 0,
                    yOffset: 0
                  }
                },
                events: null,
                bounds: null,
                chamfer: null,
                circleRadius: 0,
                positionPrev: null,
                anglePrev: 0,
                parent: null,
                axes: null,
                area: 0,
                mass: 0,
                inertia: 0,
                deltaTime: 16.666666666666668,
                _original: null
              }, m = c.extend(d, u);
              return p(m, u), m;
            }, n.nextGroup = function(u) {
              return u ? n._nextNonCollidingGroupId-- : n._nextCollidingGroupId++;
            }, n.nextCategory = function() {
              return n._nextCategory = n._nextCategory << 1, n._nextCategory;
            };
            var p = function(u, d) {
              d = d || {}, n.set(u, {
                bounds: u.bounds || l.create(u.vertices),
                positionPrev: u.positionPrev || a.clone(u.position),
                anglePrev: u.anglePrev || u.angle,
                vertices: u.vertices,
                parts: u.parts || [u],
                isStatic: u.isStatic,
                isSleeping: u.isSleeping,
                parent: u.parent || u
              }), o.rotate(u.vertices, u.angle, u.position), f.rotate(u.axes, u.angle), l.update(u.bounds, u.vertices, u.velocity), n.set(u, {
                axes: d.axes || u.axes,
                area: d.area || u.area,
                mass: d.mass || u.mass,
                inertia: d.inertia || u.inertia
              });
              var m = u.isStatic ? "#14151f" : c.choose(["#f19648", "#f5d259", "#f55a3c", "#063e7b", "#ececd1"]), g = u.isStatic ? "#555" : "#ccc", y = u.isStatic && u.render.fillStyle === null ? 1 : 0;
              u.render.fillStyle = u.render.fillStyle || m, u.render.strokeStyle = u.render.strokeStyle || g, u.render.lineWidth = u.render.lineWidth || y, u.render.sprite.xOffset += -(u.bounds.min.x - u.position.x) / (u.bounds.max.x - u.bounds.min.x), u.render.sprite.yOffset += -(u.bounds.min.y - u.position.y) / (u.bounds.max.y - u.bounds.min.y);
            };
            n.set = function(u, d, m) {
              var g;
              typeof d == "string" && (g = d, d = {}, d[g] = m);
              for (g in d)
                if (Object.prototype.hasOwnProperty.call(d, g))
                  switch (m = d[g], g) {
                    case "isStatic":
                      n.setStatic(u, m);
                      break;
                    case "isSleeping":
                      h.set(u, m);
                      break;
                    case "mass":
                      n.setMass(u, m);
                      break;
                    case "density":
                      n.setDensity(u, m);
                      break;
                    case "inertia":
                      n.setInertia(u, m);
                      break;
                    case "vertices":
                      n.setVertices(u, m);
                      break;
                    case "position":
                      n.setPosition(u, m);
                      break;
                    case "angle":
                      n.setAngle(u, m);
                      break;
                    case "velocity":
                      n.setVelocity(u, m);
                      break;
                    case "angularVelocity":
                      n.setAngularVelocity(u, m);
                      break;
                    case "speed":
                      n.setSpeed(u, m);
                      break;
                    case "angularSpeed":
                      n.setAngularSpeed(u, m);
                      break;
                    case "parts":
                      n.setParts(u, m);
                      break;
                    case "centre":
                      n.setCentre(u, m);
                      break;
                    default:
                      u[g] = m;
                  }
            }, n.setStatic = function(u, d) {
              for (var m = 0; m < u.parts.length; m++) {
                var g = u.parts[m];
                d ? (g.isStatic || (g._original = {
                  restitution: g.restitution,
                  friction: g.friction,
                  mass: g.mass,
                  inertia: g.inertia,
                  density: g.density,
                  inverseMass: g.inverseMass,
                  inverseInertia: g.inverseInertia
                }), g.restitution = 0, g.friction = 1, g.mass = g.inertia = g.density = 1 / 0, g.inverseMass = g.inverseInertia = 0, g.positionPrev.x = g.position.x, g.positionPrev.y = g.position.y, g.anglePrev = g.angle, g.angularVelocity = 0, g.speed = 0, g.angularSpeed = 0, g.motion = 0) : g._original && (g.restitution = g._original.restitution, g.friction = g._original.friction, g.mass = g._original.mass, g.inertia = g._original.inertia, g.density = g._original.density, g.inverseMass = g._original.inverseMass, g.inverseInertia = g._original.inverseInertia, g._original = null), g.isStatic = d;
              }
            }, n.setMass = function(u, d) {
              var m = u.inertia / (u.mass / 6);
              u.inertia = m * (d / 6), u.inverseInertia = 1 / u.inertia, u.mass = d, u.inverseMass = 1 / u.mass, u.density = u.mass / u.area;
            }, n.setDensity = function(u, d) {
              n.setMass(u, d * u.area), u.density = d;
            }, n.setInertia = function(u, d) {
              u.inertia = d, u.inverseInertia = 1 / u.inertia;
            }, n.setVertices = function(u, d) {
              d[0].body === u ? u.vertices = d : u.vertices = o.create(d, u), u.axes = f.fromVertices(u.vertices), u.area = o.area(u.vertices), n.setMass(u, u.density * u.area);
              var m = o.centre(u.vertices);
              o.translate(u.vertices, m, -1), n.setInertia(u, n._inertiaScale * o.inertia(u.vertices, u.mass)), o.translate(u.vertices, u.position), l.update(u.bounds, u.vertices, u.velocity);
            }, n.setParts = function(u, d, m) {
              var g;
              for (d = d.slice(0), u.parts.length = 0, u.parts.push(u), u.parent = u, g = 0; g < d.length; g++) {
                var y = d[g];
                y !== u && (y.parent = u, u.parts.push(y));
              }
              if (u.parts.length !== 1) {
                if (m = typeof m < "u" ? m : !0, m) {
                  var v = [];
                  for (g = 0; g < d.length; g++)
                    v = v.concat(d[g].vertices);
                  o.clockwiseSort(v);
                  var _ = o.hull(v), w = o.centre(_);
                  n.setVertices(u, _), o.translate(u.vertices, w);
                }
                var x = n._totalProperties(u);
                u.area = x.area, u.parent = u, u.position.x = x.centre.x, u.position.y = x.centre.y, u.positionPrev.x = x.centre.x, u.positionPrev.y = x.centre.y, n.setMass(u, x.mass), n.setInertia(u, x.inertia), n.setPosition(u, x.centre);
              }
            }, n.setCentre = function(u, d, m) {
              m ? (u.positionPrev.x += d.x, u.positionPrev.y += d.y, u.position.x += d.x, u.position.y += d.y) : (u.positionPrev.x = d.x - (u.position.x - u.positionPrev.x), u.positionPrev.y = d.y - (u.position.y - u.positionPrev.y), u.position.x = d.x, u.position.y = d.y);
            }, n.setPosition = function(u, d, m) {
              var g = a.sub(d, u.position);
              m ? (u.positionPrev.x = u.position.x, u.positionPrev.y = u.position.y, u.velocity.x = g.x, u.velocity.y = g.y, u.speed = a.magnitude(g)) : (u.positionPrev.x += g.x, u.positionPrev.y += g.y);
              for (var y = 0; y < u.parts.length; y++) {
                var v = u.parts[y];
                v.position.x += g.x, v.position.y += g.y, o.translate(v.vertices, g), l.update(v.bounds, v.vertices, u.velocity);
              }
            }, n.setAngle = function(u, d, m) {
              var g = d - u.angle;
              m ? (u.anglePrev = u.angle, u.angularVelocity = g, u.angularSpeed = Math.abs(g)) : u.anglePrev += g;
              for (var y = 0; y < u.parts.length; y++) {
                var v = u.parts[y];
                v.angle += g, o.rotate(v.vertices, g, u.position), f.rotate(v.axes, g), l.update(v.bounds, v.vertices, u.velocity), y > 0 && a.rotateAbout(v.position, g, u.position, v.position);
              }
            }, n.setVelocity = function(u, d) {
              var m = u.deltaTime / n._baseDelta;
              u.positionPrev.x = u.position.x - d.x * m, u.positionPrev.y = u.position.y - d.y * m, u.velocity.x = (u.position.x - u.positionPrev.x) / m, u.velocity.y = (u.position.y - u.positionPrev.y) / m, u.speed = a.magnitude(u.velocity);
            }, n.getVelocity = function(u) {
              var d = n._baseDelta / u.deltaTime;
              return {
                x: (u.position.x - u.positionPrev.x) * d,
                y: (u.position.y - u.positionPrev.y) * d
              };
            }, n.getSpeed = function(u) {
              return a.magnitude(n.getVelocity(u));
            }, n.setSpeed = function(u, d) {
              n.setVelocity(u, a.mult(a.normalise(n.getVelocity(u)), d));
            }, n.setAngularVelocity = function(u, d) {
              var m = u.deltaTime / n._baseDelta;
              u.anglePrev = u.angle - d * m, u.angularVelocity = (u.angle - u.anglePrev) / m, u.angularSpeed = Math.abs(u.angularVelocity);
            }, n.getAngularVelocity = function(u) {
              return (u.angle - u.anglePrev) * n._baseDelta / u.deltaTime;
            }, n.getAngularSpeed = function(u) {
              return Math.abs(n.getAngularVelocity(u));
            }, n.setAngularSpeed = function(u, d) {
              n.setAngularVelocity(u, c.sign(n.getAngularVelocity(u)) * d);
            }, n.translate = function(u, d, m) {
              n.setPosition(u, a.add(u.position, d), m);
            }, n.rotate = function(u, d, m, g) {
              if (!m)
                n.setAngle(u, u.angle + d, g);
              else {
                var y = Math.cos(d), v = Math.sin(d), _ = u.position.x - m.x, w = u.position.y - m.y;
                n.setPosition(u, {
                  x: m.x + (_ * y - w * v),
                  y: m.y + (_ * v + w * y)
                }, g), n.setAngle(u, u.angle + d, g);
              }
            }, n.scale = function(u, d, m, g) {
              var y = 0, v = 0;
              g = g || u.position;
              for (var _ = 0; _ < u.parts.length; _++) {
                var w = u.parts[_];
                o.scale(w.vertices, d, m, g), w.axes = f.fromVertices(w.vertices), w.area = o.area(w.vertices), n.setMass(w, u.density * w.area), o.translate(w.vertices, { x: -w.position.x, y: -w.position.y }), n.setInertia(w, n._inertiaScale * o.inertia(w.vertices, w.mass)), o.translate(w.vertices, { x: w.position.x, y: w.position.y }), _ > 0 && (y += w.area, v += w.inertia), w.position.x = g.x + (w.position.x - g.x) * d, w.position.y = g.y + (w.position.y - g.y) * m, l.update(w.bounds, w.vertices, u.velocity);
              }
              u.parts.length > 1 && (u.area = y, u.isStatic || (n.setMass(u, u.density * y), n.setInertia(u, v))), u.circleRadius && (d === m ? u.circleRadius *= d : u.circleRadius = null);
            }, n.update = function(u, d) {
              d = (typeof d < "u" ? d : 1e3 / 60) * u.timeScale;
              var m = d * d, g = n._timeCorrection ? d / (u.deltaTime || d) : 1, y = 1 - u.frictionAir * (d / c._baseDelta), v = (u.position.x - u.positionPrev.x) * g, _ = (u.position.y - u.positionPrev.y) * g;
              u.velocity.x = v * y + u.force.x / u.mass * m, u.velocity.y = _ * y + u.force.y / u.mass * m, u.positionPrev.x = u.position.x, u.positionPrev.y = u.position.y, u.position.x += u.velocity.x, u.position.y += u.velocity.y, u.deltaTime = d, u.angularVelocity = (u.angle - u.anglePrev) * y * g + u.torque / u.inertia * m, u.anglePrev = u.angle, u.angle += u.angularVelocity;
              for (var w = 0; w < u.parts.length; w++) {
                var x = u.parts[w];
                o.translate(x.vertices, u.velocity), w > 0 && (x.position.x += u.velocity.x, x.position.y += u.velocity.y), u.angularVelocity !== 0 && (o.rotate(x.vertices, u.angularVelocity, u.position), f.rotate(x.axes, u.angularVelocity), w > 0 && a.rotateAbout(x.position, u.angularVelocity, u.position, x.position)), l.update(x.bounds, x.vertices, u.velocity);
              }
            }, n.updateVelocities = function(u) {
              var d = n._baseDelta / u.deltaTime, m = u.velocity;
              m.x = (u.position.x - u.positionPrev.x) * d, m.y = (u.position.y - u.positionPrev.y) * d, u.speed = Math.sqrt(m.x * m.x + m.y * m.y), u.angularVelocity = (u.angle - u.anglePrev) * d, u.angularSpeed = Math.abs(u.angularVelocity);
            }, n.applyForce = function(u, d, m) {
              var g = { x: d.x - u.position.x, y: d.y - u.position.y };
              u.force.x += m.x, u.force.y += m.y, u.torque += g.x * m.y - g.y * m.x;
            }, n._totalProperties = function(u) {
              for (var d = {
                mass: 0,
                area: 0,
                inertia: 0,
                centre: { x: 0, y: 0 }
              }, m = u.parts.length === 1 ? 0 : 1; m < u.parts.length; m++) {
                var g = u.parts[m], y = g.mass !== 1 / 0 ? g.mass : 1;
                d.mass += y, d.area += g.area, d.inertia += g.inertia, d.centre = a.add(d.centre, a.mult(g.position, y));
              }
              return d.centre = a.div(d.centre, d.mass), d;
            };
          })();
        },
        /* 5 */
        /***/
        function(e, r, s) {
          var n = {};
          e.exports = n;
          var o = s(0);
          (function() {
            n.on = function(a, h, c) {
              for (var l = h.split(" "), f, p = 0; p < l.length; p++)
                f = l[p], a.events = a.events || {}, a.events[f] = a.events[f] || [], a.events[f].push(c);
              return c;
            }, n.off = function(a, h, c) {
              if (!h) {
                a.events = {};
                return;
              }
              typeof h == "function" && (c = h, h = o.keys(a.events).join(" "));
              for (var l = h.split(" "), f = 0; f < l.length; f++) {
                var p = a.events[l[f]], u = [];
                if (c && p)
                  for (var d = 0; d < p.length; d++)
                    p[d] !== c && u.push(p[d]);
                a.events[l[f]] = u;
              }
            }, n.trigger = function(a, h, c) {
              var l, f, p, u, d = a.events;
              if (d && o.keys(d).length > 0) {
                c || (c = {}), l = h.split(" ");
                for (var m = 0; m < l.length; m++)
                  if (f = l[m], p = d[f], p) {
                    u = o.clone(c, !1), u.name = f, u.source = a;
                    for (var g = 0; g < p.length; g++)
                      p[g].apply(a, [u]);
                  }
              }
            };
          })();
        },
        /* 6 */
        /***/
        function(e, r, s) {
          var n = {};
          e.exports = n;
          var o = s(5), a = s(0), h = s(1), c = s(4);
          (function() {
            n.create = function(l) {
              return a.extend({
                id: a.nextId(),
                type: "composite",
                parent: null,
                isModified: !1,
                bodies: [],
                constraints: [],
                composites: [],
                label: "Composite",
                plugin: {},
                cache: {
                  allBodies: null,
                  allConstraints: null,
                  allComposites: null
                }
              }, l);
            }, n.setModified = function(l, f, p, u) {
              if (l.isModified = f, f && l.cache && (l.cache.allBodies = null, l.cache.allConstraints = null, l.cache.allComposites = null), p && l.parent && n.setModified(l.parent, f, p, u), u)
                for (var d = 0; d < l.composites.length; d++) {
                  var m = l.composites[d];
                  n.setModified(m, f, p, u);
                }
            }, n.add = function(l, f) {
              var p = [].concat(f);
              o.trigger(l, "beforeAdd", { object: f });
              for (var u = 0; u < p.length; u++) {
                var d = p[u];
                switch (d.type) {
                  case "body":
                    if (d.parent !== d) {
                      a.warn("Composite.add: skipped adding a compound body part (you must add its parent instead)");
                      break;
                    }
                    n.addBody(l, d);
                    break;
                  case "constraint":
                    n.addConstraint(l, d);
                    break;
                  case "composite":
                    n.addComposite(l, d);
                    break;
                  case "mouseConstraint":
                    n.addConstraint(l, d.constraint);
                    break;
                }
              }
              return o.trigger(l, "afterAdd", { object: f }), l;
            }, n.remove = function(l, f, p) {
              var u = [].concat(f);
              o.trigger(l, "beforeRemove", { object: f });
              for (var d = 0; d < u.length; d++) {
                var m = u[d];
                switch (m.type) {
                  case "body":
                    n.removeBody(l, m, p);
                    break;
                  case "constraint":
                    n.removeConstraint(l, m, p);
                    break;
                  case "composite":
                    n.removeComposite(l, m, p);
                    break;
                  case "mouseConstraint":
                    n.removeConstraint(l, m.constraint);
                    break;
                }
              }
              return o.trigger(l, "afterRemove", { object: f }), l;
            }, n.addComposite = function(l, f) {
              return l.composites.push(f), f.parent = l, n.setModified(l, !0, !0, !1), l;
            }, n.removeComposite = function(l, f, p) {
              var u = a.indexOf(l.composites, f);
              if (u !== -1) {
                var d = n.allBodies(f);
                n.removeCompositeAt(l, u);
                for (var m = 0; m < d.length; m++)
                  d[m].sleepCounter = 0;
              }
              if (p)
                for (var m = 0; m < l.composites.length; m++)
                  n.removeComposite(l.composites[m], f, !0);
              return l;
            }, n.removeCompositeAt = function(l, f) {
              return l.composites.splice(f, 1), n.setModified(l, !0, !0, !1), l;
            }, n.addBody = function(l, f) {
              return l.bodies.push(f), n.setModified(l, !0, !0, !1), l;
            }, n.removeBody = function(l, f, p) {
              var u = a.indexOf(l.bodies, f);
              if (u !== -1 && (n.removeBodyAt(l, u), f.sleepCounter = 0), p)
                for (var d = 0; d < l.composites.length; d++)
                  n.removeBody(l.composites[d], f, !0);
              return l;
            }, n.removeBodyAt = function(l, f) {
              return l.bodies.splice(f, 1), n.setModified(l, !0, !0, !1), l;
            }, n.addConstraint = function(l, f) {
              return l.constraints.push(f), n.setModified(l, !0, !0, !1), l;
            }, n.removeConstraint = function(l, f, p) {
              var u = a.indexOf(l.constraints, f);
              if (u !== -1 && n.removeConstraintAt(l, u), p)
                for (var d = 0; d < l.composites.length; d++)
                  n.removeConstraint(l.composites[d], f, !0);
              return l;
            }, n.removeConstraintAt = function(l, f) {
              return l.constraints.splice(f, 1), n.setModified(l, !0, !0, !1), l;
            }, n.clear = function(l, f, p) {
              if (p)
                for (var u = 0; u < l.composites.length; u++)
                  n.clear(l.composites[u], f, !0);
              return f ? l.bodies = l.bodies.filter(function(d) {
                return d.isStatic;
              }) : l.bodies.length = 0, l.constraints.length = 0, l.composites.length = 0, n.setModified(l, !0, !0, !1), l;
            }, n.allBodies = function(l) {
              if (l.cache && l.cache.allBodies)
                return l.cache.allBodies;
              for (var f = [].concat(l.bodies), p = 0; p < l.composites.length; p++)
                f = f.concat(n.allBodies(l.composites[p]));
              return l.cache && (l.cache.allBodies = f), f;
            }, n.allConstraints = function(l) {
              if (l.cache && l.cache.allConstraints)
                return l.cache.allConstraints;
              for (var f = [].concat(l.constraints), p = 0; p < l.composites.length; p++)
                f = f.concat(n.allConstraints(l.composites[p]));
              return l.cache && (l.cache.allConstraints = f), f;
            }, n.allComposites = function(l) {
              if (l.cache && l.cache.allComposites)
                return l.cache.allComposites;
              for (var f = [].concat(l.composites), p = 0; p < l.composites.length; p++)
                f = f.concat(n.allComposites(l.composites[p]));
              return l.cache && (l.cache.allComposites = f), f;
            }, n.get = function(l, f, p) {
              var u, d;
              switch (p) {
                case "body":
                  u = n.allBodies(l);
                  break;
                case "constraint":
                  u = n.allConstraints(l);
                  break;
                case "composite":
                  u = n.allComposites(l).concat(l);
                  break;
              }
              return u ? (d = u.filter(function(m) {
                return m.id.toString() === f.toString();
              }), d.length === 0 ? null : d[0]) : null;
            }, n.move = function(l, f, p) {
              return n.remove(l, f), n.add(p, f), l;
            }, n.rebase = function(l) {
              for (var f = n.allBodies(l).concat(n.allConstraints(l)).concat(n.allComposites(l)), p = 0; p < f.length; p++)
                f[p].id = a.nextId();
              return l;
            }, n.translate = function(l, f, p) {
              for (var u = p ? n.allBodies(l) : l.bodies, d = 0; d < u.length; d++)
                c.translate(u[d], f);
              return l;
            }, n.rotate = function(l, f, p, u) {
              for (var d = Math.cos(f), m = Math.sin(f), g = u ? n.allBodies(l) : l.bodies, y = 0; y < g.length; y++) {
                var v = g[y], _ = v.position.x - p.x, w = v.position.y - p.y;
                c.setPosition(v, {
                  x: p.x + (_ * d - w * m),
                  y: p.y + (_ * m + w * d)
                }), c.rotate(v, f);
              }
              return l;
            }, n.scale = function(l, f, p, u, d) {
              for (var m = d ? n.allBodies(l) : l.bodies, g = 0; g < m.length; g++) {
                var y = m[g], v = y.position.x - u.x, _ = y.position.y - u.y;
                c.setPosition(y, {
                  x: u.x + v * f,
                  y: u.y + _ * p
                }), c.scale(y, f, p);
              }
              return l;
            }, n.bounds = function(l) {
              for (var f = n.allBodies(l), p = [], u = 0; u < f.length; u += 1) {
                var d = f[u];
                p.push(d.bounds.min, d.bounds.max);
              }
              return h.create(p);
            };
          })();
        },
        /* 7 */
        /***/
        function(e, r, s) {
          var n = {};
          e.exports = n;
          var o = s(4), a = s(5), h = s(0);
          (function() {
            n._motionWakeThreshold = 0.18, n._motionSleepThreshold = 0.08, n._minBias = 0.9, n.update = function(c, l) {
              for (var f = l / h._baseDelta, p = n._motionSleepThreshold, u = 0; u < c.length; u++) {
                var d = c[u], m = o.getSpeed(d), g = o.getAngularSpeed(d), y = m * m + g * g;
                if (d.force.x !== 0 || d.force.y !== 0) {
                  n.set(d, !1);
                  continue;
                }
                var v = Math.min(d.motion, y), _ = Math.max(d.motion, y);
                d.motion = n._minBias * v + (1 - n._minBias) * _, d.sleepThreshold > 0 && d.motion < p ? (d.sleepCounter += 1, d.sleepCounter >= d.sleepThreshold / f && n.set(d, !0)) : d.sleepCounter > 0 && (d.sleepCounter -= 1);
              }
            }, n.afterCollisions = function(c) {
              for (var l = n._motionSleepThreshold, f = 0; f < c.length; f++) {
                var p = c[f];
                if (p.isActive) {
                  var u = p.collision, d = u.bodyA.parent, m = u.bodyB.parent;
                  if (!(d.isSleeping && m.isSleeping || d.isStatic || m.isStatic) && (d.isSleeping || m.isSleeping)) {
                    var g = d.isSleeping && !d.isStatic ? d : m, y = g === d ? m : d;
                    !g.isStatic && y.motion > l && n.set(g, !1);
                  }
                }
              }
            }, n.set = function(c, l) {
              var f = c.isSleeping;
              l ? (c.isSleeping = !0, c.sleepCounter = c.sleepThreshold, c.positionImpulse.x = 0, c.positionImpulse.y = 0, c.positionPrev.x = c.position.x, c.positionPrev.y = c.position.y, c.anglePrev = c.angle, c.speed = 0, c.angularSpeed = 0, c.motion = 0, f || a.trigger(c, "sleepStart")) : (c.isSleeping = !1, c.sleepCounter = 0, f && a.trigger(c, "sleepEnd"));
            };
          })();
        },
        /* 8 */
        /***/
        function(e, r, s) {
          var n = {};
          e.exports = n;
          var o = s(3), a = s(9);
          (function() {
            var h = [], c = {
              overlap: 0,
              axis: null
            }, l = {
              overlap: 0,
              axis: null
            };
            n.create = function(f, p) {
              return {
                pair: null,
                collided: !1,
                bodyA: f,
                bodyB: p,
                parentA: f.parent,
                parentB: p.parent,
                depth: 0,
                normal: { x: 0, y: 0 },
                tangent: { x: 0, y: 0 },
                penetration: { x: 0, y: 0 },
                supports: [null, null],
                supportCount: 0
              };
            }, n.collides = function(f, p, u) {
              if (n._overlapAxes(c, f.vertices, p.vertices, f.axes), c.overlap <= 0 || (n._overlapAxes(l, p.vertices, f.vertices, p.axes), l.overlap <= 0))
                return null;
              var d = u && u.table[a.id(f, p)], m;
              d ? m = d.collision : (m = n.create(f, p), m.collided = !0, m.bodyA = f.id < p.id ? f : p, m.bodyB = f.id < p.id ? p : f, m.parentA = m.bodyA.parent, m.parentB = m.bodyB.parent), f = m.bodyA, p = m.bodyB;
              var g;
              c.overlap < l.overlap ? g = c : g = l;
              var y = m.normal, v = m.tangent, _ = m.penetration, w = m.supports, x = g.overlap, A = g.axis, S = A.x, b = A.y, C = p.position.x - f.position.x, P = p.position.y - f.position.y;
              S * C + b * P >= 0 && (S = -S, b = -b), y.x = S, y.y = b, v.x = -b, v.y = S, _.x = S * x, _.y = b * x, m.depth = x;
              var k = n._findSupports(f, p, y, 1), M = 0;
              if (o.contains(f.vertices, k[0]) && (w[M++] = k[0]), o.contains(f.vertices, k[1]) && (w[M++] = k[1]), M < 2) {
                var T = n._findSupports(p, f, y, -1);
                o.contains(p.vertices, T[0]) && (w[M++] = T[0]), M < 2 && o.contains(p.vertices, T[1]) && (w[M++] = T[1]);
              }
              return M === 0 && (w[M++] = k[0]), m.supportCount = M, m;
            }, n._overlapAxes = function(f, p, u, d) {
              var m = p.length, g = u.length, y = p[0].x, v = p[0].y, _ = u[0].x, w = u[0].y, x = d.length, A = Number.MAX_VALUE, S = 0, b, C, P, k, M, T;
              for (M = 0; M < x; M++) {
                var E = d[M], B = E.x, R = E.y, I = y * B + v * R, U = _ * B + w * R, O = I, F = U;
                for (T = 1; T < m; T += 1)
                  k = p[T].x * B + p[T].y * R, k > O ? O = k : k < I && (I = k);
                for (T = 1; T < g; T += 1)
                  k = u[T].x * B + u[T].y * R, k > F ? F = k : k < U && (U = k);
                if (C = O - U, P = F - I, b = C < P ? C : P, b < A && (A = b, S = M, b <= 0))
                  break;
              }
              f.axis = d[S], f.overlap = A;
            }, n._findSupports = function(f, p, u, d) {
              var m = p.vertices, g = m.length, y = f.position.x, v = f.position.y, _ = u.x * d, w = u.y * d, x = m[0], A = x, S = _ * (y - A.x) + w * (v - A.y), b, C, P;
              for (P = 1; P < g; P += 1)
                A = m[P], C = _ * (y - A.x) + w * (v - A.y), C < S && (S = C, x = A);
              return b = m[(g + x.index - 1) % g], S = _ * (y - b.x) + w * (v - b.y), A = m[(x.index + 1) % g], _ * (y - A.x) + w * (v - A.y) < S ? (h[0] = x, h[1] = A, h) : (h[0] = x, h[1] = b, h);
            };
          })();
        },
        /* 9 */
        /***/
        function(e, r, s) {
          var n = {};
          e.exports = n;
          var o = s(16);
          (function() {
            n.create = function(a, h) {
              var c = a.bodyA, l = a.bodyB, f = {
                id: n.id(c, l),
                bodyA: c,
                bodyB: l,
                collision: a,
                contacts: [o.create(), o.create()],
                contactCount: 0,
                separation: 0,
                isActive: !0,
                isSensor: c.isSensor || l.isSensor,
                timeCreated: h,
                timeUpdated: h,
                inverseMass: 0,
                friction: 0,
                frictionStatic: 0,
                restitution: 0,
                slop: 0
              };
              return n.update(f, a, h), f;
            }, n.update = function(a, h, c) {
              var l = h.supports, f = h.supportCount, p = a.contacts, u = h.parentA, d = h.parentB;
              a.isActive = !0, a.timeUpdated = c, a.collision = h, a.separation = h.depth, a.inverseMass = u.inverseMass + d.inverseMass, a.friction = u.friction < d.friction ? u.friction : d.friction, a.frictionStatic = u.frictionStatic > d.frictionStatic ? u.frictionStatic : d.frictionStatic, a.restitution = u.restitution > d.restitution ? u.restitution : d.restitution, a.slop = u.slop > d.slop ? u.slop : d.slop, a.contactCount = f, h.pair = a;
              var m = l[0], g = p[0], y = l[1], v = p[1];
              (v.vertex === m || g.vertex === y) && (p[1] = g, p[0] = g = v, v = p[1]), g.vertex = m, v.vertex = y;
            }, n.setActive = function(a, h, c) {
              h ? (a.isActive = !0, a.timeUpdated = c) : (a.isActive = !1, a.contactCount = 0);
            }, n.id = function(a, h) {
              return a.id < h.id ? a.id.toString(36) + ":" + h.id.toString(36) : h.id.toString(36) + ":" + a.id.toString(36);
            };
          })();
        },
        /* 10 */
        /***/
        function(e, r, s) {
          var n = {};
          e.exports = n;
          var o = s(3), a = s(2), h = s(7), c = s(1), l = s(11), f = s(0);
          (function() {
            n._warming = 0.4, n._torqueDampen = 1, n._minLength = 1e-6, n.create = function(p) {
              var u = p;
              u.bodyA && !u.pointA && (u.pointA = { x: 0, y: 0 }), u.bodyB && !u.pointB && (u.pointB = { x: 0, y: 0 });
              var d = u.bodyA ? a.add(u.bodyA.position, u.pointA) : u.pointA, m = u.bodyB ? a.add(u.bodyB.position, u.pointB) : u.pointB, g = a.magnitude(a.sub(d, m));
              u.length = typeof u.length < "u" ? u.length : g, u.id = u.id || f.nextId(), u.label = u.label || "Constraint", u.type = "constraint", u.stiffness = u.stiffness || (u.length > 0 ? 1 : 0.7), u.damping = u.damping || 0, u.angularStiffness = u.angularStiffness || 0, u.angleA = u.bodyA ? u.bodyA.angle : u.angleA, u.angleB = u.bodyB ? u.bodyB.angle : u.angleB, u.plugin = {};
              var y = {
                visible: !0,
                lineWidth: 2,
                strokeStyle: "#ffffff",
                type: "line",
                anchors: !0
              };
              return u.length === 0 && u.stiffness > 0.1 ? (y.type = "pin", y.anchors = !1) : u.stiffness < 0.9 && (y.type = "spring"), u.render = f.extend(y, u.render), u;
            }, n.preSolveAll = function(p) {
              for (var u = 0; u < p.length; u += 1) {
                var d = p[u], m = d.constraintImpulse;
                d.isStatic || m.x === 0 && m.y === 0 && m.angle === 0 || (d.position.x += m.x, d.position.y += m.y, d.angle += m.angle);
              }
            }, n.solveAll = function(p, u) {
              for (var d = f.clamp(u / f._baseDelta, 0, 1), m = 0; m < p.length; m += 1) {
                var g = p[m], y = !g.bodyA || g.bodyA && g.bodyA.isStatic, v = !g.bodyB || g.bodyB && g.bodyB.isStatic;
                (y || v) && n.solve(p[m], d);
              }
              for (m = 0; m < p.length; m += 1)
                g = p[m], y = !g.bodyA || g.bodyA && g.bodyA.isStatic, v = !g.bodyB || g.bodyB && g.bodyB.isStatic, !y && !v && n.solve(p[m], d);
            }, n.solve = function(p, u) {
              var d = p.bodyA, m = p.bodyB, g = p.pointA, y = p.pointB;
              if (!(!d && !m)) {
                d && !d.isStatic && (a.rotate(g, d.angle - p.angleA, g), p.angleA = d.angle), m && !m.isStatic && (a.rotate(y, m.angle - p.angleB, y), p.angleB = m.angle);
                var v = g, _ = y;
                if (d && (v = a.add(d.position, g)), m && (_ = a.add(m.position, y)), !(!v || !_)) {
                  var w = a.sub(v, _), x = a.magnitude(w);
                  x < n._minLength && (x = n._minLength);
                  var A = (x - p.length) / x, S = p.stiffness >= 1 || p.length === 0, b = S ? p.stiffness * u : p.stiffness * u * u, C = p.damping * u, P = a.mult(w, A * b), k = (d ? d.inverseMass : 0) + (m ? m.inverseMass : 0), M = (d ? d.inverseInertia : 0) + (m ? m.inverseInertia : 0), T = k + M, E, B, R, I, U;
                  if (C > 0) {
                    var O = a.create();
                    R = a.div(w, x), U = a.sub(
                      m && a.sub(m.position, m.positionPrev) || O,
                      d && a.sub(d.position, d.positionPrev) || O
                    ), I = a.dot(R, U);
                  }
                  d && !d.isStatic && (B = d.inverseMass / k, d.constraintImpulse.x -= P.x * B, d.constraintImpulse.y -= P.y * B, d.position.x -= P.x * B, d.position.y -= P.y * B, C > 0 && (d.positionPrev.x -= C * R.x * I * B, d.positionPrev.y -= C * R.y * I * B), E = a.cross(g, P) / T * n._torqueDampen * d.inverseInertia * (1 - p.angularStiffness), d.constraintImpulse.angle -= E, d.angle -= E), m && !m.isStatic && (B = m.inverseMass / k, m.constraintImpulse.x += P.x * B, m.constraintImpulse.y += P.y * B, m.position.x += P.x * B, m.position.y += P.y * B, C > 0 && (m.positionPrev.x += C * R.x * I * B, m.positionPrev.y += C * R.y * I * B), E = a.cross(y, P) / T * n._torqueDampen * m.inverseInertia * (1 - p.angularStiffness), m.constraintImpulse.angle += E, m.angle += E);
                }
              }
            }, n.postSolveAll = function(p) {
              for (var u = 0; u < p.length; u++) {
                var d = p[u], m = d.constraintImpulse;
                if (!(d.isStatic || m.x === 0 && m.y === 0 && m.angle === 0)) {
                  h.set(d, !1);
                  for (var g = 0; g < d.parts.length; g++) {
                    var y = d.parts[g];
                    o.translate(y.vertices, m), g > 0 && (y.position.x += m.x, y.position.y += m.y), m.angle !== 0 && (o.rotate(y.vertices, m.angle, d.position), l.rotate(y.axes, m.angle), g > 0 && a.rotateAbout(y.position, m.angle, d.position, y.position)), c.update(y.bounds, y.vertices, d.velocity);
                  }
                  m.angle *= n._warming, m.x *= n._warming, m.y *= n._warming;
                }
              }
            }, n.pointAWorld = function(p) {
              return {
                x: (p.bodyA ? p.bodyA.position.x : 0) + (p.pointA ? p.pointA.x : 0),
                y: (p.bodyA ? p.bodyA.position.y : 0) + (p.pointA ? p.pointA.y : 0)
              };
            }, n.pointBWorld = function(p) {
              return {
                x: (p.bodyB ? p.bodyB.position.x : 0) + (p.pointB ? p.pointB.x : 0),
                y: (p.bodyB ? p.bodyB.position.y : 0) + (p.pointB ? p.pointB.y : 0)
              };
            }, n.currentLength = function(p) {
              var u = (p.bodyA ? p.bodyA.position.x : 0) + (p.pointA ? p.pointA.x : 0), d = (p.bodyA ? p.bodyA.position.y : 0) + (p.pointA ? p.pointA.y : 0), m = (p.bodyB ? p.bodyB.position.x : 0) + (p.pointB ? p.pointB.x : 0), g = (p.bodyB ? p.bodyB.position.y : 0) + (p.pointB ? p.pointB.y : 0), y = u - m, v = d - g;
              return Math.sqrt(y * y + v * v);
            };
          })();
        },
        /* 11 */
        /***/
        function(e, r, s) {
          var n = {};
          e.exports = n;
          var o = s(2), a = s(0);
          (function() {
            n.fromVertices = function(h) {
              for (var c = {}, l = 0; l < h.length; l++) {
                var f = (l + 1) % h.length, p = o.normalise({
                  x: h[f].y - h[l].y,
                  y: h[l].x - h[f].x
                }), u = p.y === 0 ? 1 / 0 : p.x / p.y;
                u = u.toFixed(3).toString(), c[u] = p;
              }
              return a.values(c);
            }, n.rotate = function(h, c) {
              if (c !== 0)
                for (var l = Math.cos(c), f = Math.sin(c), p = 0; p < h.length; p++) {
                  var u = h[p], d;
                  d = u.x * l - u.y * f, u.y = u.x * f + u.y * l, u.x = d;
                }
            };
          })();
        },
        /* 12 */
        /***/
        function(e, r, s) {
          var n = {};
          e.exports = n;
          var o = s(3), a = s(0), h = s(4), c = s(1), l = s(2);
          (function() {
            n.rectangle = function(f, p, u, d, m) {
              m = m || {};
              var g = {
                label: "Rectangle Body",
                position: { x: f, y: p },
                vertices: o.fromPath("L 0 0 L " + u + " 0 L " + u + " " + d + " L 0 " + d)
              };
              if (m.chamfer) {
                var y = m.chamfer;
                g.vertices = o.chamfer(
                  g.vertices,
                  y.radius,
                  y.quality,
                  y.qualityMin,
                  y.qualityMax
                ), delete m.chamfer;
              }
              return h.create(a.extend({}, g, m));
            }, n.trapezoid = function(f, p, u, d, m, g) {
              g = g || {}, m >= 1 && a.warn("Bodies.trapezoid: slope parameter must be < 1."), m *= 0.5;
              var y = (1 - m * 2) * u, v = u * m, _ = v + y, w = _ + v, x;
              m < 0.5 ? x = "L 0 0 L " + v + " " + -d + " L " + _ + " " + -d + " L " + w + " 0" : x = "L 0 0 L " + _ + " " + -d + " L " + w + " 0";
              var A = {
                label: "Trapezoid Body",
                position: { x: f, y: p },
                vertices: o.fromPath(x)
              };
              if (g.chamfer) {
                var S = g.chamfer;
                A.vertices = o.chamfer(
                  A.vertices,
                  S.radius,
                  S.quality,
                  S.qualityMin,
                  S.qualityMax
                ), delete g.chamfer;
              }
              return h.create(a.extend({}, A, g));
            }, n.circle = function(f, p, u, d, m) {
              d = d || {};
              var g = {
                label: "Circle Body",
                circleRadius: u
              };
              m = m || 25;
              var y = Math.ceil(Math.max(10, Math.min(m, u)));
              return y % 2 === 1 && (y += 1), n.polygon(f, p, y, u, a.extend({}, g, d));
            }, n.polygon = function(f, p, u, d, m) {
              if (m = m || {}, u < 3)
                return n.circle(f, p, d, m);
              for (var g = 2 * Math.PI / u, y = "", v = g * 0.5, _ = 0; _ < u; _ += 1) {
                var w = v + _ * g, x = Math.cos(w) * d, A = Math.sin(w) * d;
                y += "L " + x.toFixed(3) + " " + A.toFixed(3) + " ";
              }
              var S = {
                label: "Polygon Body",
                position: { x: f, y: p },
                vertices: o.fromPath(y)
              };
              if (m.chamfer) {
                var b = m.chamfer;
                S.vertices = o.chamfer(
                  S.vertices,
                  b.radius,
                  b.quality,
                  b.qualityMin,
                  b.qualityMax
                ), delete m.chamfer;
              }
              return h.create(a.extend({}, S, m));
            }, n.fromVertices = function(f, p, u, d, m, g, y, v) {
              var _ = a.getDecomp(), w, x, A, S, b, C, P, k, M, T, E;
              for (w = !!(_ && _.quickDecomp), d = d || {}, A = [], m = typeof m < "u" ? m : !1, g = typeof g < "u" ? g : 0.01, y = typeof y < "u" ? y : 10, v = typeof v < "u" ? v : 0.01, a.isArray(u[0]) || (u = [u]), T = 0; T < u.length; T += 1)
                if (C = u[T], S = o.isConvex(C), b = !S, b && !w && a.warnOnce(
                  "Bodies.fromVertices: Install the 'poly-decomp' library and use Common.setDecomp or provide 'decomp' as a global to decompose concave vertices."
                ), S || !w)
                  S ? C = o.clockwiseSort(C) : C = o.hull(C), A.push({
                    position: { x: f, y: p },
                    vertices: C
                  });
                else {
                  var B = C.map(function(j) {
                    return [j.x, j.y];
                  });
                  _.makeCCW(B), g !== !1 && _.removeCollinearPoints(B, g), v !== !1 && _.removeDuplicatePoints && _.removeDuplicatePoints(B, v);
                  var R = _.quickDecomp(B);
                  for (P = 0; P < R.length; P++) {
                    var I = R[P], U = I.map(function(j) {
                      return {
                        x: j[0],
                        y: j[1]
                      };
                    });
                    y > 0 && o.area(U) < y || A.push({
                      position: o.centre(U),
                      vertices: U
                    });
                  }
                }
              for (P = 0; P < A.length; P++)
                A[P] = h.create(a.extend(A[P], d));
              if (m) {
                var O = 5;
                for (P = 0; P < A.length; P++) {
                  var F = A[P];
                  for (k = P + 1; k < A.length; k++) {
                    var J = A[k];
                    if (c.overlaps(F.bounds, J.bounds)) {
                      var G = F.vertices, Y = J.vertices;
                      for (M = 0; M < F.vertices.length; M++)
                        for (E = 0; E < J.vertices.length; E++) {
                          var ht = l.magnitudeSquared(l.sub(G[(M + 1) % G.length], Y[E])), St = l.magnitudeSquared(l.sub(G[M], Y[(E + 1) % Y.length]));
                          ht < O && St < O && (G[M].isInternal = !0, Y[E].isInternal = !0);
                        }
                    }
                  }
                }
              }
              return A.length > 1 ? (x = h.create(a.extend({ parts: A.slice(0) }, d)), h.setPosition(x, { x: f, y: p }), x) : A[0];
            };
          })();
        },
        /* 13 */
        /***/
        function(e, r, s) {
          var n = {};
          e.exports = n;
          var o = s(0), a = s(8);
          (function() {
            n.create = function(h) {
              var c = {
                bodies: [],
                collisions: [],
                pairs: null
              };
              return o.extend(c, h);
            }, n.setBodies = function(h, c) {
              h.bodies = c.slice(0);
            }, n.clear = function(h) {
              h.bodies = [], h.collisions = [];
            }, n.collisions = function(h) {
              var c = h.pairs, l = h.bodies, f = l.length, p = n.canCollide, u = a.collides, d = h.collisions, m = 0, g, y;
              for (l.sort(n._compareBoundsX), g = 0; g < f; g++) {
                var v = l[g], _ = v.bounds, w = v.bounds.max.x, x = v.bounds.max.y, A = v.bounds.min.y, S = v.isStatic || v.isSleeping, b = v.parts.length, C = b === 1;
                for (y = g + 1; y < f; y++) {
                  var P = l[y], k = P.bounds;
                  if (k.min.x > w)
                    break;
                  if (!(x < k.min.y || A > k.max.y) && !(S && (P.isStatic || P.isSleeping)) && p(v.collisionFilter, P.collisionFilter)) {
                    var M = P.parts.length;
                    if (C && M === 1) {
                      var T = u(v, P, c);
                      T && (d[m++] = T);
                    } else
                      for (var E = b > 1 ? 1 : 0, B = M > 1 ? 1 : 0, R = E; R < b; R++)
                        for (var I = v.parts[R], _ = I.bounds, U = B; U < M; U++) {
                          var O = P.parts[U], k = O.bounds;
                          if (!(_.min.x > k.max.x || _.max.x < k.min.x || _.max.y < k.min.y || _.min.y > k.max.y)) {
                            var T = u(I, O, c);
                            T && (d[m++] = T);
                          }
                        }
                  }
                }
              }
              return d.length !== m && (d.length = m), d;
            }, n.canCollide = function(h, c) {
              return h.group === c.group && h.group !== 0 ? h.group > 0 : (h.mask & c.category) !== 0 && (c.mask & h.category) !== 0;
            }, n._compareBoundsX = function(h, c) {
              return h.bounds.min.x - c.bounds.min.x;
            };
          })();
        },
        /* 14 */
        /***/
        function(e, r, s) {
          var n = {};
          e.exports = n;
          var o = s(0);
          (function() {
            n.create = function(a) {
              var h = {};
              return a || o.log("Mouse.create: element was undefined, defaulting to document.body", "warn"), h.element = a || document.body, h.absolute = { x: 0, y: 0 }, h.position = { x: 0, y: 0 }, h.mousedownPosition = { x: 0, y: 0 }, h.mouseupPosition = { x: 0, y: 0 }, h.offset = { x: 0, y: 0 }, h.scale = { x: 1, y: 1 }, h.wheelDelta = 0, h.button = -1, h.pixelRatio = parseInt(h.element.getAttribute("data-pixel-ratio"), 10) || 1, h.sourceEvents = {
                mousemove: null,
                mousedown: null,
                mouseup: null,
                mousewheel: null
              }, h.mousemove = function(c) {
                var l = n._getRelativeMousePosition(c, h.element, h.pixelRatio), f = c.changedTouches;
                f && (h.button = 0, c.preventDefault()), h.absolute.x = l.x, h.absolute.y = l.y, h.position.x = h.absolute.x * h.scale.x + h.offset.x, h.position.y = h.absolute.y * h.scale.y + h.offset.y, h.sourceEvents.mousemove = c;
              }, h.mousedown = function(c) {
                var l = n._getRelativeMousePosition(c, h.element, h.pixelRatio), f = c.changedTouches;
                f ? (h.button = 0, c.preventDefault()) : h.button = c.button, h.absolute.x = l.x, h.absolute.y = l.y, h.position.x = h.absolute.x * h.scale.x + h.offset.x, h.position.y = h.absolute.y * h.scale.y + h.offset.y, h.mousedownPosition.x = h.position.x, h.mousedownPosition.y = h.position.y, h.sourceEvents.mousedown = c;
              }, h.mouseup = function(c) {
                var l = n._getRelativeMousePosition(c, h.element, h.pixelRatio), f = c.changedTouches;
                f && c.preventDefault(), h.button = -1, h.absolute.x = l.x, h.absolute.y = l.y, h.position.x = h.absolute.x * h.scale.x + h.offset.x, h.position.y = h.absolute.y * h.scale.y + h.offset.y, h.mouseupPosition.x = h.position.x, h.mouseupPosition.y = h.position.y, h.sourceEvents.mouseup = c;
              }, h.mousewheel = function(c) {
                h.wheelDelta = Math.max(-1, Math.min(1, c.wheelDelta || -c.detail)), c.preventDefault(), h.sourceEvents.mousewheel = c;
              }, n.setElement(h, h.element), h;
            }, n.setElement = function(a, h) {
              a.element = h, h.addEventListener("mousemove", a.mousemove, { passive: !0 }), h.addEventListener("mousedown", a.mousedown, { passive: !0 }), h.addEventListener("mouseup", a.mouseup, { passive: !0 }), h.addEventListener("wheel", a.mousewheel, { passive: !1 }), h.addEventListener("touchmove", a.mousemove, { passive: !1 }), h.addEventListener("touchstart", a.mousedown, { passive: !1 }), h.addEventListener("touchend", a.mouseup, { passive: !1 });
            }, n.clearSourceEvents = function(a) {
              a.sourceEvents.mousemove = null, a.sourceEvents.mousedown = null, a.sourceEvents.mouseup = null, a.sourceEvents.mousewheel = null, a.wheelDelta = 0;
            }, n.setOffset = function(a, h) {
              a.offset.x = h.x, a.offset.y = h.y, a.position.x = a.absolute.x * a.scale.x + a.offset.x, a.position.y = a.absolute.y * a.scale.y + a.offset.y;
            }, n.setScale = function(a, h) {
              a.scale.x = h.x, a.scale.y = h.y, a.position.x = a.absolute.x * a.scale.x + a.offset.x, a.position.y = a.absolute.y * a.scale.y + a.offset.y;
            }, n._getRelativeMousePosition = function(a, h, c) {
              var l = h.getBoundingClientRect(), f = document.documentElement || document.body.parentNode || document.body, p = window.pageXOffset !== void 0 ? window.pageXOffset : f.scrollLeft, u = window.pageYOffset !== void 0 ? window.pageYOffset : f.scrollTop, d = a.changedTouches, m, g;
              return d ? (m = d[0].pageX - l.left - p, g = d[0].pageY - l.top - u) : (m = a.pageX - l.left - p, g = a.pageY - l.top - u), {
                x: m / (h.clientWidth / (h.width || h.clientWidth) * c),
                y: g / (h.clientHeight / (h.height || h.clientHeight) * c)
              };
            };
          })();
        },
        /* 15 */
        /***/
        function(e, r, s) {
          var n = {};
          e.exports = n;
          var o = s(0);
          (function() {
            n._registry = {}, n.register = function(a) {
              if (n.isPlugin(a) || o.warn("Plugin.register:", n.toString(a), "does not implement all required fields."), a.name in n._registry) {
                var h = n._registry[a.name], c = n.versionParse(a.version).number, l = n.versionParse(h.version).number;
                c > l ? (o.warn("Plugin.register:", n.toString(h), "was upgraded to", n.toString(a)), n._registry[a.name] = a) : c < l ? o.warn("Plugin.register:", n.toString(h), "can not be downgraded to", n.toString(a)) : a !== h && o.warn("Plugin.register:", n.toString(a), "is already registered to different plugin object");
              } else
                n._registry[a.name] = a;
              return a;
            }, n.resolve = function(a) {
              return n._registry[n.dependencyParse(a).name];
            }, n.toString = function(a) {
              return typeof a == "string" ? a : (a.name || "anonymous") + "@" + (a.version || a.range || "0.0.0");
            }, n.isPlugin = function(a) {
              return a && a.name && a.version && a.install;
            }, n.isUsed = function(a, h) {
              return a.used.indexOf(h) > -1;
            }, n.isFor = function(a, h) {
              var c = a.for && n.dependencyParse(a.for);
              return !a.for || h.name === c.name && n.versionSatisfies(h.version, c.range);
            }, n.use = function(a, h) {
              if (a.uses = (a.uses || []).concat(h || []), a.uses.length === 0) {
                o.warn("Plugin.use:", n.toString(a), "does not specify any dependencies to install.");
                return;
              }
              for (var c = n.dependencies(a), l = o.topologicalSort(c), f = [], p = 0; p < l.length; p += 1)
                if (l[p] !== a.name) {
                  var u = n.resolve(l[p]);
                  if (!u) {
                    f.push("❌ " + l[p]);
                    continue;
                  }
                  n.isUsed(a, u.name) || (n.isFor(u, a) || (o.warn("Plugin.use:", n.toString(u), "is for", u.for, "but installed on", n.toString(a) + "."), u._warned = !0), u.install ? u.install(a) : (o.warn("Plugin.use:", n.toString(u), "does not specify an install function."), u._warned = !0), u._warned ? (f.push("🔶 " + n.toString(u)), delete u._warned) : f.push("✅ " + n.toString(u)), a.used.push(u.name));
                }
              f.length > 0 && o.info(f.join("  "));
            }, n.dependencies = function(a, h) {
              var c = n.dependencyParse(a), l = c.name;
              if (h = h || {}, !(l in h)) {
                a = n.resolve(a) || a, h[l] = o.map(a.uses || [], function(p) {
                  n.isPlugin(p) && n.register(p);
                  var u = n.dependencyParse(p), d = n.resolve(p);
                  return d && !n.versionSatisfies(d.version, u.range) ? (o.warn(
                    "Plugin.dependencies:",
                    n.toString(d),
                    "does not satisfy",
                    n.toString(u),
                    "used by",
                    n.toString(c) + "."
                  ), d._warned = !0, a._warned = !0) : d || (o.warn(
                    "Plugin.dependencies:",
                    n.toString(p),
                    "used by",
                    n.toString(c),
                    "could not be resolved."
                  ), a._warned = !0), u.name;
                });
                for (var f = 0; f < h[l].length; f += 1)
                  n.dependencies(h[l][f], h);
                return h;
              }
            }, n.dependencyParse = function(a) {
              if (o.isString(a)) {
                var h = /^[\w-]+(@(\*|[\^~]?\d+\.\d+\.\d+(-[0-9A-Za-z-+]+)?))?$/;
                return h.test(a) || o.warn("Plugin.dependencyParse:", a, "is not a valid dependency string."), {
                  name: a.split("@")[0],
                  range: a.split("@")[1] || "*"
                };
              }
              return {
                name: a.name,
                range: a.range || a.version
              };
            }, n.versionParse = function(a) {
              var h = /^(\*)|(\^|~|>=|>)?\s*((\d+)\.(\d+)\.(\d+))(-[0-9A-Za-z-+]+)?$/;
              h.test(a) || o.warn("Plugin.versionParse:", a, "is not a valid version or range.");
              var c = h.exec(a), l = Number(c[4]), f = Number(c[5]), p = Number(c[6]);
              return {
                isRange: !!(c[1] || c[2]),
                version: c[3],
                range: a,
                operator: c[1] || c[2] || "",
                major: l,
                minor: f,
                patch: p,
                parts: [l, f, p],
                prerelease: c[7],
                number: l * 1e8 + f * 1e4 + p
              };
            }, n.versionSatisfies = function(a, h) {
              h = h || "*";
              var c = n.versionParse(h), l = n.versionParse(a);
              if (c.isRange) {
                if (c.operator === "*" || a === "*")
                  return !0;
                if (c.operator === ">")
                  return l.number > c.number;
                if (c.operator === ">=")
                  return l.number >= c.number;
                if (c.operator === "~")
                  return l.major === c.major && l.minor === c.minor && l.patch >= c.patch;
                if (c.operator === "^")
                  return c.major > 0 ? l.major === c.major && l.number >= c.number : c.minor > 0 ? l.minor === c.minor && l.patch >= c.patch : l.patch === c.patch;
              }
              return a === h || a === "*";
            };
          })();
        },
        /* 16 */
        /***/
        function(e, r) {
          var s = {};
          e.exports = s, function() {
            s.create = function(n) {
              return {
                vertex: n,
                normalImpulse: 0,
                tangentImpulse: 0
              };
            };
          }();
        },
        /* 17 */
        /***/
        function(e, r, s) {
          var n = {};
          e.exports = n;
          var o = s(7), a = s(18), h = s(13), c = s(19), l = s(5), f = s(6), p = s(10), u = s(0), d = s(4);
          (function() {
            n._deltaMax = 1e3 / 60, n.create = function(m) {
              m = m || {};
              var g = {
                positionIterations: 6,
                velocityIterations: 4,
                constraintIterations: 2,
                enableSleeping: !1,
                events: [],
                plugin: {},
                gravity: {
                  x: 0,
                  y: 1,
                  scale: 1e-3
                },
                timing: {
                  timestamp: 0,
                  timeScale: 1,
                  lastDelta: 0,
                  lastElapsed: 0,
                  lastUpdatesPerFrame: 0
                }
              }, y = u.extend(g, m);
              return y.world = m.world || f.create({ label: "World" }), y.pairs = m.pairs || c.create(), y.detector = m.detector || h.create(), y.detector.pairs = y.pairs, y.grid = { buckets: [] }, y.world.gravity = y.gravity, y.broadphase = y.grid, y.metrics = {}, y;
            }, n.update = function(m, g) {
              var y = u.now(), v = m.world, _ = m.detector, w = m.pairs, x = m.timing, A = x.timestamp, S;
              g > n._deltaMax && u.warnOnce(
                "Matter.Engine.update: delta argument is recommended to be less than or equal to",
                n._deltaMax.toFixed(3),
                "ms."
              ), g = typeof g < "u" ? g : u._baseDelta, g *= x.timeScale, x.timestamp += g, x.lastDelta = g;
              var b = {
                timestamp: x.timestamp,
                delta: g
              };
              l.trigger(m, "beforeUpdate", b);
              var C = f.allBodies(v), P = f.allConstraints(v);
              for (v.isModified && (h.setBodies(_, C), f.setModified(v, !1, !1, !0)), m.enableSleeping && o.update(C, g), n._bodiesApplyGravity(C, m.gravity), g > 0 && n._bodiesUpdate(C, g), l.trigger(m, "beforeSolve", b), p.preSolveAll(C), S = 0; S < m.constraintIterations; S++)
                p.solveAll(P, g);
              p.postSolveAll(C);
              var k = h.collisions(_);
              c.update(w, k, A), m.enableSleeping && o.afterCollisions(w.list), w.collisionStart.length > 0 && l.trigger(m, "collisionStart", {
                pairs: w.collisionStart,
                timestamp: x.timestamp,
                delta: g
              });
              var M = u.clamp(20 / m.positionIterations, 0, 1);
              for (a.preSolvePosition(w.list), S = 0; S < m.positionIterations; S++)
                a.solvePosition(w.list, g, M);
              for (a.postSolvePosition(C), p.preSolveAll(C), S = 0; S < m.constraintIterations; S++)
                p.solveAll(P, g);
              for (p.postSolveAll(C), a.preSolveVelocity(w.list), S = 0; S < m.velocityIterations; S++)
                a.solveVelocity(w.list, g);
              return n._bodiesUpdateVelocities(C), w.collisionActive.length > 0 && l.trigger(m, "collisionActive", {
                pairs: w.collisionActive,
                timestamp: x.timestamp,
                delta: g
              }), w.collisionEnd.length > 0 && l.trigger(m, "collisionEnd", {
                pairs: w.collisionEnd,
                timestamp: x.timestamp,
                delta: g
              }), n._bodiesClearForces(C), l.trigger(m, "afterUpdate", b), m.timing.lastElapsed = u.now() - y, m;
            }, n.merge = function(m, g) {
              if (u.extend(m, g), g.world) {
                m.world = g.world, n.clear(m);
                for (var y = f.allBodies(m.world), v = 0; v < y.length; v++) {
                  var _ = y[v];
                  o.set(_, !1), _.id = u.nextId();
                }
              }
            }, n.clear = function(m) {
              c.clear(m.pairs), h.clear(m.detector);
            }, n._bodiesClearForces = function(m) {
              for (var g = m.length, y = 0; y < g; y++) {
                var v = m[y];
                v.force.x = 0, v.force.y = 0, v.torque = 0;
              }
            }, n._bodiesApplyGravity = function(m, g) {
              var y = typeof g.scale < "u" ? g.scale : 1e-3, v = m.length;
              if (!(g.x === 0 && g.y === 0 || y === 0))
                for (var _ = 0; _ < v; _++) {
                  var w = m[_];
                  w.isStatic || w.isSleeping || (w.force.y += w.mass * g.y * y, w.force.x += w.mass * g.x * y);
                }
            }, n._bodiesUpdate = function(m, g) {
              for (var y = m.length, v = 0; v < y; v++) {
                var _ = m[v];
                _.isStatic || _.isSleeping || d.update(_, g);
              }
            }, n._bodiesUpdateVelocities = function(m) {
              for (var g = m.length, y = 0; y < g; y++)
                d.updateVelocities(m[y]);
            };
          })();
        },
        /* 18 */
        /***/
        function(e, r, s) {
          var n = {};
          e.exports = n;
          var o = s(3), a = s(0), h = s(1);
          (function() {
            n._restingThresh = 2, n._restingThreshTangent = Math.sqrt(6), n._positionDampen = 0.9, n._positionWarming = 0.8, n._frictionNormalMultiplier = 5, n._frictionMaxStatic = Number.MAX_VALUE, n.preSolvePosition = function(c) {
              var l, f, p, u = c.length;
              for (l = 0; l < u; l++)
                f = c[l], f.isActive && (p = f.contactCount, f.collision.parentA.totalContacts += p, f.collision.parentB.totalContacts += p);
            }, n.solvePosition = function(c, l, f) {
              var p, u, d, m, g, y, v, _, w = n._positionDampen * (f || 1), x = a.clamp(l / a._baseDelta, 0, 1), A = c.length;
              for (p = 0; p < A; p++)
                u = c[p], !(!u.isActive || u.isSensor) && (d = u.collision, m = d.parentA, g = d.parentB, y = d.normal, u.separation = d.depth + y.x * (g.positionImpulse.x - m.positionImpulse.x) + y.y * (g.positionImpulse.y - m.positionImpulse.y));
              for (p = 0; p < A; p++)
                u = c[p], !(!u.isActive || u.isSensor) && (d = u.collision, m = d.parentA, g = d.parentB, y = d.normal, _ = u.separation - u.slop * x, (m.isStatic || g.isStatic) && (_ *= 2), m.isStatic || m.isSleeping || (v = w / m.totalContacts, m.positionImpulse.x += y.x * _ * v, m.positionImpulse.y += y.y * _ * v), g.isStatic || g.isSleeping || (v = w / g.totalContacts, g.positionImpulse.x -= y.x * _ * v, g.positionImpulse.y -= y.y * _ * v));
            }, n.postSolvePosition = function(c) {
              for (var l = n._positionWarming, f = c.length, p = o.translate, u = h.update, d = 0; d < f; d++) {
                var m = c[d], g = m.positionImpulse, y = g.x, v = g.y, _ = m.velocity;
                if (m.totalContacts = 0, y !== 0 || v !== 0) {
                  for (var w = 0; w < m.parts.length; w++) {
                    var x = m.parts[w];
                    p(x.vertices, g), u(x.bounds, x.vertices, _), x.position.x += y, x.position.y += v;
                  }
                  m.positionPrev.x += y, m.positionPrev.y += v, y * _.x + v * _.y < 0 ? (g.x = 0, g.y = 0) : (g.x *= l, g.y *= l);
                }
              }
            }, n.preSolveVelocity = function(c) {
              var l = c.length, f, p;
              for (f = 0; f < l; f++) {
                var u = c[f];
                if (!(!u.isActive || u.isSensor)) {
                  var d = u.contacts, m = u.contactCount, g = u.collision, y = g.parentA, v = g.parentB, _ = g.normal, w = g.tangent;
                  for (p = 0; p < m; p++) {
                    var x = d[p], A = x.vertex, S = x.normalImpulse, b = x.tangentImpulse;
                    if (S !== 0 || b !== 0) {
                      var C = _.x * S + w.x * b, P = _.y * S + w.y * b;
                      y.isStatic || y.isSleeping || (y.positionPrev.x += C * y.inverseMass, y.positionPrev.y += P * y.inverseMass, y.anglePrev += y.inverseInertia * ((A.x - y.position.x) * P - (A.y - y.position.y) * C)), v.isStatic || v.isSleeping || (v.positionPrev.x -= C * v.inverseMass, v.positionPrev.y -= P * v.inverseMass, v.anglePrev -= v.inverseInertia * ((A.x - v.position.x) * P - (A.y - v.position.y) * C));
                    }
                  }
                }
              }
            }, n.solveVelocity = function(c, l) {
              var f = l / a._baseDelta, p = f * f, u = p * f, d = -n._restingThresh * f, m = n._restingThreshTangent, g = n._frictionNormalMultiplier * f, y = n._frictionMaxStatic, v = c.length, _, w, x, A;
              for (x = 0; x < v; x++) {
                var S = c[x];
                if (!(!S.isActive || S.isSensor)) {
                  var b = S.collision, C = b.parentA, P = b.parentB, k = b.normal.x, M = b.normal.y, T = b.tangent.x, E = b.tangent.y, B = S.inverseMass, R = S.friction * S.frictionStatic * g, I = S.contacts, U = S.contactCount, O = 1 / U, F = C.position.x - C.positionPrev.x, J = C.position.y - C.positionPrev.y, G = C.angle - C.anglePrev, Y = P.position.x - P.positionPrev.x, ht = P.position.y - P.positionPrev.y, St = P.angle - P.anglePrev;
                  for (A = 0; A < U; A++) {
                    var j = I[A], Ft = j.vertex, ct = Ft.x - C.position.x, ne = Ft.y - C.position.y, Ht = Ft.x - P.position.x, jt = Ft.y - P.position.y, yt = F - ne * G, xi = J + ct * G, Qi = Y - jt * St, Se = ht + Ht * St, de = yt - Qi, pe = xi - Se, se = k * de + M * pe, oe = T * de + E * pe, Ji = S.separation + se, Zi = Math.min(Ji, 1);
                    Zi = Ji < 0 ? 0 : Zi;
                    var la = Zi * R;
                    oe < -la || oe > la ? (w = oe > 0 ? oe : -oe, _ = S.friction * (oe > 0 ? 1 : -1) * u, _ < -w ? _ = -w : _ > w && (_ = w)) : (_ = oe, w = y);
                    var ca = ct * M - ne * k, ua = Ht * M - jt * k, da = O / (B + C.inverseInertia * ca * ca + P.inverseInertia * ua * ua), Dr = (1 + S.restitution) * se * da;
                    if (_ *= da, se < d)
                      j.normalImpulse = 0;
                    else {
                      var Uu = j.normalImpulse;
                      j.normalImpulse += Dr, j.normalImpulse > 0 && (j.normalImpulse = 0), Dr = j.normalImpulse - Uu;
                    }
                    if (oe < -m || oe > m)
                      j.tangentImpulse = 0;
                    else {
                      var Gu = j.tangentImpulse;
                      j.tangentImpulse += _, j.tangentImpulse < -w && (j.tangentImpulse = -w), j.tangentImpulse > w && (j.tangentImpulse = w), _ = j.tangentImpulse - Gu;
                    }
                    var Ur = k * Dr + T * _, Gr = M * Dr + E * _;
                    C.isStatic || C.isSleeping || (C.positionPrev.x += Ur * C.inverseMass, C.positionPrev.y += Gr * C.inverseMass, C.anglePrev += (ct * Gr - ne * Ur) * C.inverseInertia), P.isStatic || P.isSleeping || (P.positionPrev.x -= Ur * P.inverseMass, P.positionPrev.y -= Gr * P.inverseMass, P.anglePrev -= (Ht * Gr - jt * Ur) * P.inverseInertia);
                  }
                }
              }
            };
          })();
        },
        /* 19 */
        /***/
        function(e, r, s) {
          var n = {};
          e.exports = n;
          var o = s(9), a = s(0);
          (function() {
            n.create = function(h) {
              return a.extend({
                table: {},
                list: [],
                collisionStart: [],
                collisionActive: [],
                collisionEnd: []
              }, h);
            }, n.update = function(h, c, l) {
              var f = o.update, p = o.create, u = o.setActive, d = h.table, m = h.list, g = m.length, y = g, v = h.collisionStart, _ = h.collisionEnd, w = h.collisionActive, x = c.length, A = 0, S = 0, b = 0, C, P, k;
              for (k = 0; k < x; k++)
                C = c[k], P = C.pair, P ? (P.isActive && (w[b++] = P), f(P, C, l)) : (P = p(C, l), d[P.id] = P, v[A++] = P, m[y++] = P);
              for (y = 0, g = m.length, k = 0; k < g; k++)
                P = m[k], P.timeUpdated >= l ? m[y++] = P : (u(P, !1, l), P.collision.bodyA.sleepCounter > 0 && P.collision.bodyB.sleepCounter > 0 ? m[y++] = P : (_[S++] = P, delete d[P.id]));
              m.length !== y && (m.length = y), v.length !== A && (v.length = A), _.length !== S && (_.length = S), w.length !== b && (w.length = b);
            }, n.clear = function(h) {
              return h.table = {}, h.list.length = 0, h.collisionStart.length = 0, h.collisionActive.length = 0, h.collisionEnd.length = 0, h;
            };
          })();
        },
        /* 20 */
        /***/
        function(e, r, s) {
          var n = e.exports = s(21);
          n.Axes = s(11), n.Bodies = s(12), n.Body = s(4), n.Bounds = s(1), n.Collision = s(8), n.Common = s(0), n.Composite = s(6), n.Composites = s(22), n.Constraint = s(10), n.Contact = s(16), n.Detector = s(13), n.Engine = s(17), n.Events = s(5), n.Grid = s(23), n.Mouse = s(14), n.MouseConstraint = s(24), n.Pair = s(9), n.Pairs = s(19), n.Plugin = s(15), n.Query = s(25), n.Render = s(26), n.Resolver = s(18), n.Runner = s(27), n.SAT = s(28), n.Sleeping = s(7), n.Svg = s(29), n.Vector = s(2), n.Vertices = s(3), n.World = s(30), n.Engine.run = n.Runner.run, n.Common.deprecated(n.Engine, "run", "Engine.run ➤ use Matter.Runner.run(engine) instead");
        },
        /* 21 */
        /***/
        function(e, r, s) {
          var n = {};
          e.exports = n;
          var o = s(15), a = s(0);
          (function() {
            n.name = "matter-js", n.version = "0.20.0", n.uses = [], n.used = [], n.use = function() {
              o.use(n, Array.prototype.slice.call(arguments));
            }, n.before = function(h, c) {
              return h = h.replace(/^Matter./, ""), a.chainPathBefore(n, h, c);
            }, n.after = function(h, c) {
              return h = h.replace(/^Matter./, ""), a.chainPathAfter(n, h, c);
            };
          })();
        },
        /* 22 */
        /***/
        function(e, r, s) {
          var n = {};
          e.exports = n;
          var o = s(6), a = s(10), h = s(0), c = s(4), l = s(12), f = h.deprecated;
          (function() {
            n.stack = function(p, u, d, m, g, y, v) {
              for (var _ = o.create({ label: "Stack" }), w = p, x = u, A, S = 0, b = 0; b < m; b++) {
                for (var C = 0, P = 0; P < d; P++) {
                  var k = v(w, x, P, b, A, S);
                  if (k) {
                    var M = k.bounds.max.y - k.bounds.min.y, T = k.bounds.max.x - k.bounds.min.x;
                    M > C && (C = M), c.translate(k, { x: T * 0.5, y: M * 0.5 }), w = k.bounds.max.x + g, o.addBody(_, k), A = k, S += 1;
                  } else
                    w += g;
                }
                x += C + y, w = p;
              }
              return _;
            }, n.chain = function(p, u, d, m, g, y) {
              for (var v = p.bodies, _ = 1; _ < v.length; _++) {
                var w = v[_ - 1], x = v[_], A = w.bounds.max.y - w.bounds.min.y, S = w.bounds.max.x - w.bounds.min.x, b = x.bounds.max.y - x.bounds.min.y, C = x.bounds.max.x - x.bounds.min.x, P = {
                  bodyA: w,
                  pointA: { x: S * u, y: A * d },
                  bodyB: x,
                  pointB: { x: C * m, y: b * g }
                }, k = h.extend(P, y);
                o.addConstraint(p, a.create(k));
              }
              return p.label += " Chain", p;
            }, n.mesh = function(p, u, d, m, g) {
              var y = p.bodies, v, _, w, x, A;
              for (v = 0; v < d; v++) {
                for (_ = 1; _ < u; _++)
                  w = y[_ - 1 + v * u], x = y[_ + v * u], o.addConstraint(p, a.create(h.extend({ bodyA: w, bodyB: x }, g)));
                if (v > 0)
                  for (_ = 0; _ < u; _++)
                    w = y[_ + (v - 1) * u], x = y[_ + v * u], o.addConstraint(p, a.create(h.extend({ bodyA: w, bodyB: x }, g))), m && _ > 0 && (A = y[_ - 1 + (v - 1) * u], o.addConstraint(p, a.create(h.extend({ bodyA: A, bodyB: x }, g)))), m && _ < u - 1 && (A = y[_ + 1 + (v - 1) * u], o.addConstraint(p, a.create(h.extend({ bodyA: A, bodyB: x }, g))));
              }
              return p.label += " Mesh", p;
            }, n.pyramid = function(p, u, d, m, g, y, v) {
              return n.stack(p, u, d, m, g, y, function(_, w, x, A, S, b) {
                var C = Math.min(m, Math.ceil(d / 2)), P = S ? S.bounds.max.x - S.bounds.min.x : 0;
                if (!(A > C)) {
                  A = C - A;
                  var k = A, M = d - 1 - A;
                  if (!(x < k || x > M)) {
                    b === 1 && c.translate(S, { x: (x + (d % 2 === 1 ? 1 : -1)) * P, y: 0 });
                    var T = S ? x * P : 0;
                    return v(p + T + x * g, w, x, A, S, b);
                  }
                }
              });
            }, n.newtonsCradle = function(p, u, d, m, g) {
              for (var y = o.create({ label: "Newtons Cradle" }), v = 0; v < d; v++) {
                var _ = 1.9, w = l.circle(
                  p + v * (m * _),
                  u + g,
                  m,
                  { inertia: 1 / 0, restitution: 1, friction: 0, frictionAir: 1e-4, slop: 1 }
                ), x = a.create({ pointA: { x: p + v * (m * _), y: u }, bodyB: w });
                o.addBody(y, w), o.addConstraint(y, x);
              }
              return y;
            }, f(n, "newtonsCradle", "Composites.newtonsCradle ➤ moved to newtonsCradle example"), n.car = function(p, u, d, m, g) {
              var y = c.nextGroup(!0), v = 20, _ = -d * 0.5 + v, w = d * 0.5 - v, x = 0, A = o.create({ label: "Car" }), S = l.rectangle(p, u, d, m, {
                collisionFilter: {
                  group: y
                },
                chamfer: {
                  radius: m * 0.5
                },
                density: 2e-4
              }), b = l.circle(p + _, u + x, g, {
                collisionFilter: {
                  group: y
                },
                friction: 0.8
              }), C = l.circle(p + w, u + x, g, {
                collisionFilter: {
                  group: y
                },
                friction: 0.8
              }), P = a.create({
                bodyB: S,
                pointB: { x: _, y: x },
                bodyA: b,
                stiffness: 1,
                length: 0
              }), k = a.create({
                bodyB: S,
                pointB: { x: w, y: x },
                bodyA: C,
                stiffness: 1,
                length: 0
              });
              return o.addBody(A, S), o.addBody(A, b), o.addBody(A, C), o.addConstraint(A, P), o.addConstraint(A, k), A;
            }, f(n, "car", "Composites.car ➤ moved to car example"), n.softBody = function(p, u, d, m, g, y, v, _, w, x) {
              w = h.extend({ inertia: 1 / 0 }, w), x = h.extend({ stiffness: 0.2, render: { type: "line", anchors: !1 } }, x);
              var A = n.stack(p, u, d, m, g, y, function(S, b) {
                return l.circle(S, b, _, w);
              });
              return n.mesh(A, d, m, v, x), A.label = "Soft Body", A;
            }, f(n, "softBody", "Composites.softBody ➤ moved to softBody and cloth examples");
          })();
        },
        /* 23 */
        /***/
        function(e, r, s) {
          var n = {};
          e.exports = n;
          var o = s(9), a = s(0), h = a.deprecated;
          (function() {
            n.create = function(c) {
              var l = {
                buckets: {},
                pairs: {},
                pairsList: [],
                bucketWidth: 48,
                bucketHeight: 48
              };
              return a.extend(l, c);
            }, n.update = function(c, l, f, p) {
              var u, d, m, g = f.world, y = c.buckets, v, _, w = !1;
              for (u = 0; u < l.length; u++) {
                var x = l[u];
                if (!(x.isSleeping && !p) && !(g.bounds && (x.bounds.max.x < g.bounds.min.x || x.bounds.min.x > g.bounds.max.x || x.bounds.max.y < g.bounds.min.y || x.bounds.min.y > g.bounds.max.y))) {
                  var A = n._getRegion(c, x);
                  if (!x.region || A.id !== x.region.id || p) {
                    (!x.region || p) && (x.region = A);
                    var S = n._regionUnion(A, x.region);
                    for (d = S.startCol; d <= S.endCol; d++)
                      for (m = S.startRow; m <= S.endRow; m++) {
                        _ = n._getBucketId(d, m), v = y[_];
                        var b = d >= A.startCol && d <= A.endCol && m >= A.startRow && m <= A.endRow, C = d >= x.region.startCol && d <= x.region.endCol && m >= x.region.startRow && m <= x.region.endRow;
                        !b && C && C && v && n._bucketRemoveBody(c, v, x), (x.region === A || b && !C || p) && (v || (v = n._createBucket(y, _)), n._bucketAddBody(c, v, x));
                      }
                    x.region = A, w = !0;
                  }
                }
              }
              w && (c.pairsList = n._createActivePairsList(c));
            }, h(n, "update", "Grid.update ➤ replaced by Matter.Detector"), n.clear = function(c) {
              c.buckets = {}, c.pairs = {}, c.pairsList = [];
            }, h(n, "clear", "Grid.clear ➤ replaced by Matter.Detector"), n._regionUnion = function(c, l) {
              var f = Math.min(c.startCol, l.startCol), p = Math.max(c.endCol, l.endCol), u = Math.min(c.startRow, l.startRow), d = Math.max(c.endRow, l.endRow);
              return n._createRegion(f, p, u, d);
            }, n._getRegion = function(c, l) {
              var f = l.bounds, p = Math.floor(f.min.x / c.bucketWidth), u = Math.floor(f.max.x / c.bucketWidth), d = Math.floor(f.min.y / c.bucketHeight), m = Math.floor(f.max.y / c.bucketHeight);
              return n._createRegion(p, u, d, m);
            }, n._createRegion = function(c, l, f, p) {
              return {
                id: c + "," + l + "," + f + "," + p,
                startCol: c,
                endCol: l,
                startRow: f,
                endRow: p
              };
            }, n._getBucketId = function(c, l) {
              return "C" + c + "R" + l;
            }, n._createBucket = function(c, l) {
              var f = c[l] = [];
              return f;
            }, n._bucketAddBody = function(c, l, f) {
              var p = c.pairs, u = o.id, d = l.length, m;
              for (m = 0; m < d; m++) {
                var g = l[m];
                if (!(f.id === g.id || f.isStatic && g.isStatic)) {
                  var y = u(f, g), v = p[y];
                  v ? v[2] += 1 : p[y] = [f, g, 1];
                }
              }
              l.push(f);
            }, n._bucketRemoveBody = function(c, l, f) {
              var p = c.pairs, u = o.id, d;
              l.splice(a.indexOf(l, f), 1);
              var m = l.length;
              for (d = 0; d < m; d++) {
                var g = p[u(f, l[d])];
                g && (g[2] -= 1);
              }
            }, n._createActivePairsList = function(c) {
              var l, f = c.pairs, p = a.keys(f), u = p.length, d = [], m;
              for (m = 0; m < u; m++)
                l = f[p[m]], l[2] > 0 ? d.push(l) : delete f[p[m]];
              return d;
            };
          })();
        },
        /* 24 */
        /***/
        function(e, r, s) {
          var n = {};
          e.exports = n;
          var o = s(3), a = s(7), h = s(14), c = s(5), l = s(13), f = s(10), p = s(6), u = s(0), d = s(1);
          (function() {
            n.create = function(m, g) {
              var y = (m ? m.mouse : null) || (g ? g.mouse : null);
              y || (m && m.render && m.render.canvas ? y = h.create(m.render.canvas) : g && g.element ? y = h.create(g.element) : (y = h.create(), u.warn("MouseConstraint.create: options.mouse was undefined, options.element was undefined, may not function as expected")));
              var v = f.create({
                label: "Mouse Constraint",
                pointA: y.position,
                pointB: { x: 0, y: 0 },
                length: 0.01,
                stiffness: 0.1,
                angularStiffness: 1,
                render: {
                  strokeStyle: "#90EE90",
                  lineWidth: 3
                }
              }), _ = {
                type: "mouseConstraint",
                mouse: y,
                element: null,
                body: null,
                constraint: v,
                collisionFilter: {
                  category: 1,
                  mask: 4294967295,
                  group: 0
                }
              }, w = u.extend(_, g);
              return c.on(m, "beforeUpdate", function() {
                var x = p.allBodies(m.world);
                n.update(w, x), n._triggerEvents(w);
              }), w;
            }, n.update = function(m, g) {
              var y = m.mouse, v = m.constraint, _ = m.body;
              if (y.button === 0) {
                if (v.bodyB)
                  a.set(v.bodyB, !1), v.pointA = y.position;
                else
                  for (var w = 0; w < g.length; w++)
                    if (_ = g[w], d.contains(_.bounds, y.position) && l.canCollide(_.collisionFilter, m.collisionFilter))
                      for (var x = _.parts.length > 1 ? 1 : 0; x < _.parts.length; x++) {
                        var A = _.parts[x];
                        if (o.contains(A.vertices, y.position)) {
                          v.pointA = y.position, v.bodyB = m.body = _, v.pointB = { x: y.position.x - _.position.x, y: y.position.y - _.position.y }, v.angleB = _.angle, a.set(_, !1), c.trigger(m, "startdrag", { mouse: y, body: _ });
                          break;
                        }
                      }
              } else
                v.bodyB = m.body = null, v.pointB = null, _ && c.trigger(m, "enddrag", { mouse: y, body: _ });
            }, n._triggerEvents = function(m) {
              var g = m.mouse, y = g.sourceEvents;
              y.mousemove && c.trigger(m, "mousemove", { mouse: g }), y.mousedown && c.trigger(m, "mousedown", { mouse: g }), y.mouseup && c.trigger(m, "mouseup", { mouse: g }), h.clearSourceEvents(g);
            };
          })();
        },
        /* 25 */
        /***/
        function(e, r, s) {
          var n = {};
          e.exports = n;
          var o = s(2), a = s(8), h = s(1), c = s(12), l = s(3);
          (function() {
            n.collides = function(f, p) {
              for (var u = [], d = p.length, m = f.bounds, g = a.collides, y = h.overlaps, v = 0; v < d; v++) {
                var _ = p[v], w = _.parts.length, x = w === 1 ? 0 : 1;
                if (y(_.bounds, m))
                  for (var A = x; A < w; A++) {
                    var S = _.parts[A];
                    if (y(S.bounds, m)) {
                      var b = g(S, f);
                      if (b) {
                        u.push(b);
                        break;
                      }
                    }
                  }
              }
              return u;
            }, n.ray = function(f, p, u, d) {
              d = d || 1e-100;
              for (var m = o.angle(p, u), g = o.magnitude(o.sub(p, u)), y = (u.x + p.x) * 0.5, v = (u.y + p.y) * 0.5, _ = c.rectangle(y, v, g, d, { angle: m }), w = n.collides(_, f), x = 0; x < w.length; x += 1) {
                var A = w[x];
                A.body = A.bodyB = A.bodyA;
              }
              return w;
            }, n.region = function(f, p, u) {
              for (var d = [], m = 0; m < f.length; m++) {
                var g = f[m], y = h.overlaps(g.bounds, p);
                (y && !u || !y && u) && d.push(g);
              }
              return d;
            }, n.point = function(f, p) {
              for (var u = [], d = 0; d < f.length; d++) {
                var m = f[d];
                if (h.contains(m.bounds, p))
                  for (var g = m.parts.length === 1 ? 0 : 1; g < m.parts.length; g++) {
                    var y = m.parts[g];
                    if (h.contains(y.bounds, p) && l.contains(y.vertices, p)) {
                      u.push(m);
                      break;
                    }
                  }
              }
              return u;
            };
          })();
        },
        /* 26 */
        /***/
        function(e, r, s) {
          var n = {};
          e.exports = n;
          var o = s(4), a = s(0), h = s(6), c = s(1), l = s(5), f = s(2), p = s(14);
          (function() {
            var u, d;
            typeof window < "u" && (u = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function(x) {
              window.setTimeout(function() {
                x(a.now());
              }, 1e3 / 60);
            }, d = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame), n._goodFps = 30, n._goodDelta = 1e3 / 60, n.create = function(x) {
              var A = {
                engine: null,
                element: null,
                canvas: null,
                mouse: null,
                frameRequestId: null,
                timing: {
                  historySize: 60,
                  delta: 0,
                  deltaHistory: [],
                  lastTime: 0,
                  lastTimestamp: 0,
                  lastElapsed: 0,
                  timestampElapsed: 0,
                  timestampElapsedHistory: [],
                  engineDeltaHistory: [],
                  engineElapsedHistory: [],
                  engineUpdatesHistory: [],
                  elapsedHistory: []
                },
                options: {
                  width: 800,
                  height: 600,
                  pixelRatio: 1,
                  background: "#14151f",
                  wireframeBackground: "#14151f",
                  wireframeStrokeStyle: "#bbb",
                  hasBounds: !!x.bounds,
                  enabled: !0,
                  wireframes: !0,
                  showSleeping: !0,
                  showDebug: !1,
                  showStats: !1,
                  showPerformance: !1,
                  showBounds: !1,
                  showVelocity: !1,
                  showCollisions: !1,
                  showSeparations: !1,
                  showAxes: !1,
                  showPositions: !1,
                  showAngleIndicator: !1,
                  showIds: !1,
                  showVertexNumbers: !1,
                  showConvexHulls: !1,
                  showInternalEdges: !1,
                  showMousePosition: !1
                }
              }, S = a.extend(A, x);
              return S.canvas && (S.canvas.width = S.options.width || S.canvas.width, S.canvas.height = S.options.height || S.canvas.height), S.mouse = x.mouse, S.engine = x.engine, S.canvas = S.canvas || y(S.options.width, S.options.height), S.context = S.canvas.getContext("2d"), S.textures = {}, S.bounds = S.bounds || {
                min: {
                  x: 0,
                  y: 0
                },
                max: {
                  x: S.canvas.width,
                  y: S.canvas.height
                }
              }, S.controller = n, S.options.showBroadphase = !1, S.options.pixelRatio !== 1 && n.setPixelRatio(S, S.options.pixelRatio), a.isElement(S.element) && S.element.appendChild(S.canvas), S;
            }, n.run = function(x) {
              (function A(S) {
                x.frameRequestId = u(A), m(x, S), n.world(x, S), x.context.setTransform(x.options.pixelRatio, 0, 0, x.options.pixelRatio, 0, 0), (x.options.showStats || x.options.showDebug) && n.stats(x, x.context, S), (x.options.showPerformance || x.options.showDebug) && n.performance(x, x.context, S), x.context.setTransform(1, 0, 0, 1, 0, 0);
              })();
            }, n.stop = function(x) {
              d(x.frameRequestId);
            }, n.setPixelRatio = function(x, A) {
              var S = x.options, b = x.canvas;
              A === "auto" && (A = v(b)), S.pixelRatio = A, b.setAttribute("data-pixel-ratio", A), b.width = S.width * A, b.height = S.height * A, b.style.width = S.width + "px", b.style.height = S.height + "px";
            }, n.setSize = function(x, A, S) {
              x.options.width = A, x.options.height = S, x.bounds.max.x = x.bounds.min.x + A, x.bounds.max.y = x.bounds.min.y + S, x.options.pixelRatio !== 1 ? n.setPixelRatio(x, x.options.pixelRatio) : (x.canvas.width = A, x.canvas.height = S);
            }, n.lookAt = function(x, A, S, b) {
              b = typeof b < "u" ? b : !0, A = a.isArray(A) ? A : [A], S = S || {
                x: 0,
                y: 0
              };
              for (var C = {
                min: { x: 1 / 0, y: 1 / 0 },
                max: { x: -1 / 0, y: -1 / 0 }
              }, P = 0; P < A.length; P += 1) {
                var k = A[P], M = k.bounds ? k.bounds.min : k.min || k.position || k, T = k.bounds ? k.bounds.max : k.max || k.position || k;
                M && T && (M.x < C.min.x && (C.min.x = M.x), T.x > C.max.x && (C.max.x = T.x), M.y < C.min.y && (C.min.y = M.y), T.y > C.max.y && (C.max.y = T.y));
              }
              var E = C.max.x - C.min.x + 2 * S.x, B = C.max.y - C.min.y + 2 * S.y, R = x.canvas.height, I = x.canvas.width, U = I / R, O = E / B, F = 1, J = 1;
              O > U ? J = O / U : F = U / O, x.options.hasBounds = !0, x.bounds.min.x = C.min.x, x.bounds.max.x = C.min.x + E * F, x.bounds.min.y = C.min.y, x.bounds.max.y = C.min.y + B * J, b && (x.bounds.min.x += E * 0.5 - E * F * 0.5, x.bounds.max.x += E * 0.5 - E * F * 0.5, x.bounds.min.y += B * 0.5 - B * J * 0.5, x.bounds.max.y += B * 0.5 - B * J * 0.5), x.bounds.min.x -= S.x, x.bounds.max.x -= S.x, x.bounds.min.y -= S.y, x.bounds.max.y -= S.y, x.mouse && (p.setScale(x.mouse, {
                x: (x.bounds.max.x - x.bounds.min.x) / x.canvas.width,
                y: (x.bounds.max.y - x.bounds.min.y) / x.canvas.height
              }), p.setOffset(x.mouse, x.bounds.min));
            }, n.startViewTransform = function(x) {
              var A = x.bounds.max.x - x.bounds.min.x, S = x.bounds.max.y - x.bounds.min.y, b = A / x.options.width, C = S / x.options.height;
              x.context.setTransform(
                x.options.pixelRatio / b,
                0,
                0,
                x.options.pixelRatio / C,
                0,
                0
              ), x.context.translate(-x.bounds.min.x, -x.bounds.min.y);
            }, n.endViewTransform = function(x) {
              x.context.setTransform(x.options.pixelRatio, 0, 0, x.options.pixelRatio, 0, 0);
            }, n.world = function(x, A) {
              var S = a.now(), b = x.engine, C = b.world, P = x.canvas, k = x.context, M = x.options, T = x.timing, E = h.allBodies(C), B = h.allConstraints(C), R = M.wireframes ? M.wireframeBackground : M.background, I = [], U = [], O, F = {
                timestamp: b.timing.timestamp
              };
              if (l.trigger(x, "beforeRender", F), x.currentBackground !== R && w(x, R), k.globalCompositeOperation = "source-in", k.fillStyle = "transparent", k.fillRect(0, 0, P.width, P.height), k.globalCompositeOperation = "source-over", M.hasBounds) {
                for (O = 0; O < E.length; O++) {
                  var J = E[O];
                  c.overlaps(J.bounds, x.bounds) && I.push(J);
                }
                for (O = 0; O < B.length; O++) {
                  var G = B[O], Y = G.bodyA, ht = G.bodyB, St = G.pointA, j = G.pointB;
                  Y && (St = f.add(Y.position, G.pointA)), ht && (j = f.add(ht.position, G.pointB)), !(!St || !j) && (c.contains(x.bounds, St) || c.contains(x.bounds, j)) && U.push(G);
                }
                n.startViewTransform(x), x.mouse && (p.setScale(x.mouse, {
                  x: (x.bounds.max.x - x.bounds.min.x) / x.options.width,
                  y: (x.bounds.max.y - x.bounds.min.y) / x.options.height
                }), p.setOffset(x.mouse, x.bounds.min));
              } else
                U = B, I = E, x.options.pixelRatio !== 1 && x.context.setTransform(x.options.pixelRatio, 0, 0, x.options.pixelRatio, 0, 0);
              !M.wireframes || b.enableSleeping && M.showSleeping ? n.bodies(x, I, k) : (M.showConvexHulls && n.bodyConvexHulls(x, I, k), n.bodyWireframes(x, I, k)), M.showBounds && n.bodyBounds(x, I, k), (M.showAxes || M.showAngleIndicator) && n.bodyAxes(x, I, k), M.showPositions && n.bodyPositions(x, I, k), M.showVelocity && n.bodyVelocity(x, I, k), M.showIds && n.bodyIds(x, I, k), M.showSeparations && n.separations(x, b.pairs.list, k), M.showCollisions && n.collisions(x, b.pairs.list, k), M.showVertexNumbers && n.vertexNumbers(x, I, k), M.showMousePosition && n.mousePosition(x, x.mouse, k), n.constraints(U, k), M.hasBounds && n.endViewTransform(x), l.trigger(x, "afterRender", F), T.lastElapsed = a.now() - S;
            }, n.stats = function(x, A, S) {
              for (var b = x.engine, C = b.world, P = h.allBodies(C), k = 0, M = 55, T = 44, E = 0, B = 0, R = 0; R < P.length; R += 1)
                k += P[R].parts.length;
              var I = {
                Part: k,
                Body: P.length,
                Cons: h.allConstraints(C).length,
                Comp: h.allComposites(C).length,
                Pair: b.pairs.list.length
              };
              A.fillStyle = "#0e0f19", A.fillRect(E, B, M * 5.5, T), A.font = "12px Arial", A.textBaseline = "top", A.textAlign = "right";
              for (var U in I) {
                var O = I[U];
                A.fillStyle = "#aaa", A.fillText(U, E + M, B + 8), A.fillStyle = "#eee", A.fillText(O, E + M, B + 26), E += M;
              }
            }, n.performance = function(x, A) {
              var S = x.engine, b = x.timing, C = b.deltaHistory, P = b.elapsedHistory, k = b.timestampElapsedHistory, M = b.engineDeltaHistory, T = b.engineUpdatesHistory, E = b.engineElapsedHistory, B = S.timing.lastUpdatesPerFrame, R = S.timing.lastDelta, I = g(C), U = g(P), O = g(M), F = g(T), J = g(E), G = g(k), Y = G / I || 0, ht = Math.round(I / R), St = 1e3 / I || 0, j = 4, Ft = 12, ct = 60, ne = 34, Ht = 10, jt = 69;
              A.fillStyle = "#0e0f19", A.fillRect(0, 50, Ft * 5 + ct * 6 + 22, ne), n.status(
                A,
                Ht,
                jt,
                ct,
                j,
                C.length,
                Math.round(St) + " fps",
                St / n._goodFps,
                function(yt) {
                  return C[yt] / I - 1;
                }
              ), n.status(
                A,
                Ht + Ft + ct,
                jt,
                ct,
                j,
                M.length,
                R.toFixed(2) + " dt",
                n._goodDelta / R,
                function(yt) {
                  return M[yt] / O - 1;
                }
              ), n.status(
                A,
                Ht + (Ft + ct) * 2,
                jt,
                ct,
                j,
                T.length,
                B + " upf",
                Math.pow(a.clamp(F / ht || 1, 0, 1), 4),
                function(yt) {
                  return T[yt] / F - 1;
                }
              ), n.status(
                A,
                Ht + (Ft + ct) * 3,
                jt,
                ct,
                j,
                E.length,
                J.toFixed(2) + " ut",
                1 - B * J / n._goodFps,
                function(yt) {
                  return E[yt] / J - 1;
                }
              ), n.status(
                A,
                Ht + (Ft + ct) * 4,
                jt,
                ct,
                j,
                P.length,
                U.toFixed(2) + " rt",
                1 - U / n._goodFps,
                function(yt) {
                  return P[yt] / U - 1;
                }
              ), n.status(
                A,
                Ht + (Ft + ct) * 5,
                jt,
                ct,
                j,
                k.length,
                Y.toFixed(2) + " x",
                Y * Y * Y,
                function(yt) {
                  return (k[yt] / C[yt] / Y || 0) - 1;
                }
              );
            }, n.status = function(x, A, S, b, C, P, k, M, T) {
              x.strokeStyle = "#888", x.fillStyle = "#444", x.lineWidth = 1, x.fillRect(A, S + 7, b, 1), x.beginPath(), x.moveTo(A, S + 7 - C * a.clamp(0.4 * T(0), -2, 2));
              for (var E = 0; E < b; E += 1)
                x.lineTo(A + E, S + 7 - (E < P ? C * a.clamp(0.4 * T(E), -2, 2) : 0));
              x.stroke(), x.fillStyle = "hsl(" + a.clamp(25 + 95 * M, 0, 120) + ",100%,60%)", x.fillRect(A, S - 7, 4, 4), x.font = "12px Arial", x.textBaseline = "middle", x.textAlign = "right", x.fillStyle = "#eee", x.fillText(k, A + b, S - 5);
            }, n.constraints = function(x, A) {
              for (var S = A, b = 0; b < x.length; b++) {
                var C = x[b];
                if (!(!C.render.visible || !C.pointA || !C.pointB)) {
                  var P = C.bodyA, k = C.bodyB, M, T;
                  if (P ? M = f.add(P.position, C.pointA) : M = C.pointA, C.render.type === "pin")
                    S.beginPath(), S.arc(M.x, M.y, 3, 0, 2 * Math.PI), S.closePath();
                  else {
                    if (k ? T = f.add(k.position, C.pointB) : T = C.pointB, S.beginPath(), S.moveTo(M.x, M.y), C.render.type === "spring")
                      for (var E = f.sub(T, M), B = f.perp(f.normalise(E)), R = Math.ceil(a.clamp(C.length / 5, 12, 20)), I, U = 1; U < R; U += 1)
                        I = U % 2 === 0 ? 1 : -1, S.lineTo(
                          M.x + E.x * (U / R) + B.x * I * 4,
                          M.y + E.y * (U / R) + B.y * I * 4
                        );
                    S.lineTo(T.x, T.y);
                  }
                  C.render.lineWidth && (S.lineWidth = C.render.lineWidth, S.strokeStyle = C.render.strokeStyle, S.stroke()), C.render.anchors && (S.fillStyle = C.render.strokeStyle, S.beginPath(), S.arc(M.x, M.y, 3, 0, 2 * Math.PI), S.arc(T.x, T.y, 3, 0, 2 * Math.PI), S.closePath(), S.fill());
                }
              }
            }, n.bodies = function(x, A, S) {
              var b = S;
              x.engine;
              var C = x.options, P = C.showInternalEdges || !C.wireframes, k, M, T, E;
              for (T = 0; T < A.length; T++)
                if (k = A[T], !!k.render.visible) {
                  for (E = k.parts.length > 1 ? 1 : 0; E < k.parts.length; E++)
                    if (M = k.parts[E], !!M.render.visible) {
                      if (C.showSleeping && k.isSleeping ? b.globalAlpha = 0.5 * M.render.opacity : M.render.opacity !== 1 && (b.globalAlpha = M.render.opacity), M.render.sprite && M.render.sprite.texture && !C.wireframes) {
                        var B = M.render.sprite, R = _(x, B.texture);
                        b.translate(M.position.x, M.position.y), b.rotate(M.angle), b.drawImage(
                          R,
                          R.width * -B.xOffset * B.xScale,
                          R.height * -B.yOffset * B.yScale,
                          R.width * B.xScale,
                          R.height * B.yScale
                        ), b.rotate(-M.angle), b.translate(-M.position.x, -M.position.y);
                      } else {
                        if (M.circleRadius)
                          b.beginPath(), b.arc(M.position.x, M.position.y, M.circleRadius, 0, 2 * Math.PI);
                        else {
                          b.beginPath(), b.moveTo(M.vertices[0].x, M.vertices[0].y);
                          for (var I = 1; I < M.vertices.length; I++)
                            !M.vertices[I - 1].isInternal || P ? b.lineTo(M.vertices[I].x, M.vertices[I].y) : b.moveTo(M.vertices[I].x, M.vertices[I].y), M.vertices[I].isInternal && !P && b.moveTo(M.vertices[(I + 1) % M.vertices.length].x, M.vertices[(I + 1) % M.vertices.length].y);
                          b.lineTo(M.vertices[0].x, M.vertices[0].y), b.closePath();
                        }
                        C.wireframes ? (b.lineWidth = 1, b.strokeStyle = x.options.wireframeStrokeStyle, b.stroke()) : (b.fillStyle = M.render.fillStyle, M.render.lineWidth && (b.lineWidth = M.render.lineWidth, b.strokeStyle = M.render.strokeStyle, b.stroke()), b.fill());
                      }
                      b.globalAlpha = 1;
                    }
                }
            }, n.bodyWireframes = function(x, A, S) {
              var b = S, C = x.options.showInternalEdges, P, k, M, T, E;
              for (b.beginPath(), M = 0; M < A.length; M++)
                if (P = A[M], !!P.render.visible)
                  for (E = P.parts.length > 1 ? 1 : 0; E < P.parts.length; E++) {
                    for (k = P.parts[E], b.moveTo(k.vertices[0].x, k.vertices[0].y), T = 1; T < k.vertices.length; T++)
                      !k.vertices[T - 1].isInternal || C ? b.lineTo(k.vertices[T].x, k.vertices[T].y) : b.moveTo(k.vertices[T].x, k.vertices[T].y), k.vertices[T].isInternal && !C && b.moveTo(k.vertices[(T + 1) % k.vertices.length].x, k.vertices[(T + 1) % k.vertices.length].y);
                    b.lineTo(k.vertices[0].x, k.vertices[0].y);
                  }
              b.lineWidth = 1, b.strokeStyle = x.options.wireframeStrokeStyle, b.stroke();
            }, n.bodyConvexHulls = function(x, A, S) {
              var b = S, C, P, k;
              for (b.beginPath(), P = 0; P < A.length; P++)
                if (C = A[P], !(!C.render.visible || C.parts.length === 1)) {
                  for (b.moveTo(C.vertices[0].x, C.vertices[0].y), k = 1; k < C.vertices.length; k++)
                    b.lineTo(C.vertices[k].x, C.vertices[k].y);
                  b.lineTo(C.vertices[0].x, C.vertices[0].y);
                }
              b.lineWidth = 1, b.strokeStyle = "rgba(255,255,255,0.2)", b.stroke();
            }, n.vertexNumbers = function(x, A, S) {
              var b = S, C, P, k;
              for (C = 0; C < A.length; C++) {
                var M = A[C].parts;
                for (k = M.length > 1 ? 1 : 0; k < M.length; k++) {
                  var T = M[k];
                  for (P = 0; P < T.vertices.length; P++)
                    b.fillStyle = "rgba(255,255,255,0.2)", b.fillText(C + "_" + P, T.position.x + (T.vertices[P].x - T.position.x) * 0.8, T.position.y + (T.vertices[P].y - T.position.y) * 0.8);
                }
              }
            }, n.mousePosition = function(x, A, S) {
              var b = S;
              b.fillStyle = "rgba(255,255,255,0.8)", b.fillText(A.position.x + "  " + A.position.y, A.position.x + 5, A.position.y - 5);
            }, n.bodyBounds = function(x, A, S) {
              var b = S;
              x.engine;
              var C = x.options;
              b.beginPath();
              for (var P = 0; P < A.length; P++) {
                var k = A[P];
                if (k.render.visible)
                  for (var M = A[P].parts, T = M.length > 1 ? 1 : 0; T < M.length; T++) {
                    var E = M[T];
                    b.rect(E.bounds.min.x, E.bounds.min.y, E.bounds.max.x - E.bounds.min.x, E.bounds.max.y - E.bounds.min.y);
                  }
              }
              C.wireframes ? b.strokeStyle = "rgba(255,255,255,0.08)" : b.strokeStyle = "rgba(0,0,0,0.1)", b.lineWidth = 1, b.stroke();
            }, n.bodyAxes = function(x, A, S) {
              var b = S;
              x.engine;
              var C = x.options, P, k, M, T;
              for (b.beginPath(), k = 0; k < A.length; k++) {
                var E = A[k], B = E.parts;
                if (E.render.visible)
                  if (C.showAxes)
                    for (M = B.length > 1 ? 1 : 0; M < B.length; M++)
                      for (P = B[M], T = 0; T < P.axes.length; T++) {
                        var R = P.axes[T];
                        b.moveTo(P.position.x, P.position.y), b.lineTo(P.position.x + R.x * 20, P.position.y + R.y * 20);
                      }
                  else
                    for (M = B.length > 1 ? 1 : 0; M < B.length; M++)
                      for (P = B[M], T = 0; T < P.axes.length; T++)
                        b.moveTo(P.position.x, P.position.y), b.lineTo(
                          (P.vertices[0].x + P.vertices[P.vertices.length - 1].x) / 2,
                          (P.vertices[0].y + P.vertices[P.vertices.length - 1].y) / 2
                        );
              }
              C.wireframes ? (b.strokeStyle = "indianred", b.lineWidth = 1) : (b.strokeStyle = "rgba(255, 255, 255, 0.4)", b.globalCompositeOperation = "overlay", b.lineWidth = 2), b.stroke(), b.globalCompositeOperation = "source-over";
            }, n.bodyPositions = function(x, A, S) {
              var b = S;
              x.engine;
              var C = x.options, P, k, M, T;
              for (b.beginPath(), M = 0; M < A.length; M++)
                if (P = A[M], !!P.render.visible)
                  for (T = 0; T < P.parts.length; T++)
                    k = P.parts[T], b.arc(k.position.x, k.position.y, 3, 0, 2 * Math.PI, !1), b.closePath();
              for (C.wireframes ? b.fillStyle = "indianred" : b.fillStyle = "rgba(0,0,0,0.5)", b.fill(), b.beginPath(), M = 0; M < A.length; M++)
                P = A[M], P.render.visible && (b.arc(P.positionPrev.x, P.positionPrev.y, 2, 0, 2 * Math.PI, !1), b.closePath());
              b.fillStyle = "rgba(255,165,0,0.8)", b.fill();
            }, n.bodyVelocity = function(x, A, S) {
              var b = S;
              b.beginPath();
              for (var C = 0; C < A.length; C++) {
                var P = A[C];
                if (P.render.visible) {
                  var k = o.getVelocity(P);
                  b.moveTo(P.position.x, P.position.y), b.lineTo(P.position.x + k.x, P.position.y + k.y);
                }
              }
              b.lineWidth = 3, b.strokeStyle = "cornflowerblue", b.stroke();
            }, n.bodyIds = function(x, A, S) {
              var b = S, C, P;
              for (C = 0; C < A.length; C++)
                if (A[C].render.visible) {
                  var k = A[C].parts;
                  for (P = k.length > 1 ? 1 : 0; P < k.length; P++) {
                    var M = k[P];
                    b.font = "12px Arial", b.fillStyle = "rgba(255,255,255,0.5)", b.fillText(M.id, M.position.x + 10, M.position.y - 10);
                  }
                }
            }, n.collisions = function(x, A, S) {
              var b = S, C = x.options, P, k, M, T;
              for (b.beginPath(), M = 0; M < A.length; M++)
                if (P = A[M], !!P.isActive)
                  for (k = P.collision, T = 0; T < P.contactCount; T++) {
                    var E = P.contacts[T], B = E.vertex;
                    b.rect(B.x - 1.5, B.y - 1.5, 3.5, 3.5);
                  }
              for (C.wireframes ? b.fillStyle = "rgba(255,255,255,0.7)" : b.fillStyle = "orange", b.fill(), b.beginPath(), M = 0; M < A.length; M++)
                if (P = A[M], !!P.isActive && (k = P.collision, P.contactCount > 0)) {
                  var R = P.contacts[0].vertex.x, I = P.contacts[0].vertex.y;
                  P.contactCount === 2 && (R = (P.contacts[0].vertex.x + P.contacts[1].vertex.x) / 2, I = (P.contacts[0].vertex.y + P.contacts[1].vertex.y) / 2), k.bodyB === k.supports[0].body || k.bodyA.isStatic === !0 ? b.moveTo(R - k.normal.x * 8, I - k.normal.y * 8) : b.moveTo(R + k.normal.x * 8, I + k.normal.y * 8), b.lineTo(R, I);
                }
              C.wireframes ? b.strokeStyle = "rgba(255,165,0,0.7)" : b.strokeStyle = "orange", b.lineWidth = 1, b.stroke();
            }, n.separations = function(x, A, S) {
              var b = S, C = x.options, P, k, M, T, E;
              for (b.beginPath(), E = 0; E < A.length; E++)
                if (P = A[E], !!P.isActive) {
                  k = P.collision, M = k.bodyA, T = k.bodyB;
                  var B = 1;
                  !T.isStatic && !M.isStatic && (B = 0.5), T.isStatic && (B = 0), b.moveTo(T.position.x, T.position.y), b.lineTo(T.position.x - k.penetration.x * B, T.position.y - k.penetration.y * B), B = 1, !T.isStatic && !M.isStatic && (B = 0.5), M.isStatic && (B = 0), b.moveTo(M.position.x, M.position.y), b.lineTo(M.position.x + k.penetration.x * B, M.position.y + k.penetration.y * B);
                }
              C.wireframes ? b.strokeStyle = "rgba(255,165,0,0.5)" : b.strokeStyle = "orange", b.stroke();
            }, n.inspector = function(x, A) {
              x.engine;
              var S = x.selected, b = x.render, C = b.options, P;
              if (C.hasBounds) {
                var k = b.bounds.max.x - b.bounds.min.x, M = b.bounds.max.y - b.bounds.min.y, T = k / b.options.width, E = M / b.options.height;
                A.scale(1 / T, 1 / E), A.translate(-b.bounds.min.x, -b.bounds.min.y);
              }
              for (var B = 0; B < S.length; B++) {
                var R = S[B].data;
                switch (A.translate(0.5, 0.5), A.lineWidth = 1, A.strokeStyle = "rgba(255,165,0,0.9)", A.setLineDash([1, 2]), R.type) {
                  case "body":
                    P = R.bounds, A.beginPath(), A.rect(
                      Math.floor(P.min.x - 3),
                      Math.floor(P.min.y - 3),
                      Math.floor(P.max.x - P.min.x + 6),
                      Math.floor(P.max.y - P.min.y + 6)
                    ), A.closePath(), A.stroke();
                    break;
                  case "constraint":
                    var I = R.pointA;
                    R.bodyA && (I = R.pointB), A.beginPath(), A.arc(I.x, I.y, 10, 0, 2 * Math.PI), A.closePath(), A.stroke();
                    break;
                }
                A.setLineDash([]), A.translate(-0.5, -0.5);
              }
              x.selectStart !== null && (A.translate(0.5, 0.5), A.lineWidth = 1, A.strokeStyle = "rgba(255,165,0,0.6)", A.fillStyle = "rgba(255,165,0,0.1)", P = x.selectBounds, A.beginPath(), A.rect(
                Math.floor(P.min.x),
                Math.floor(P.min.y),
                Math.floor(P.max.x - P.min.x),
                Math.floor(P.max.y - P.min.y)
              ), A.closePath(), A.stroke(), A.fill(), A.translate(-0.5, -0.5)), C.hasBounds && A.setTransform(1, 0, 0, 1, 0, 0);
            };
            var m = function(x, A) {
              var S = x.engine, b = x.timing, C = b.historySize, P = S.timing.timestamp;
              b.delta = A - b.lastTime || n._goodDelta, b.lastTime = A, b.timestampElapsed = P - b.lastTimestamp || 0, b.lastTimestamp = P, b.deltaHistory.unshift(b.delta), b.deltaHistory.length = Math.min(b.deltaHistory.length, C), b.engineDeltaHistory.unshift(S.timing.lastDelta), b.engineDeltaHistory.length = Math.min(b.engineDeltaHistory.length, C), b.timestampElapsedHistory.unshift(b.timestampElapsed), b.timestampElapsedHistory.length = Math.min(b.timestampElapsedHistory.length, C), b.engineUpdatesHistory.unshift(S.timing.lastUpdatesPerFrame), b.engineUpdatesHistory.length = Math.min(b.engineUpdatesHistory.length, C), b.engineElapsedHistory.unshift(S.timing.lastElapsed), b.engineElapsedHistory.length = Math.min(b.engineElapsedHistory.length, C), b.elapsedHistory.unshift(b.lastElapsed), b.elapsedHistory.length = Math.min(b.elapsedHistory.length, C);
            }, g = function(x) {
              for (var A = 0, S = 0; S < x.length; S += 1)
                A += x[S];
              return A / x.length || 0;
            }, y = function(x, A) {
              var S = document.createElement("canvas");
              return S.width = x, S.height = A, S.oncontextmenu = function() {
                return !1;
              }, S.onselectstart = function() {
                return !1;
              }, S;
            }, v = function(x) {
              var A = x.getContext("2d"), S = window.devicePixelRatio || 1, b = A.webkitBackingStorePixelRatio || A.mozBackingStorePixelRatio || A.msBackingStorePixelRatio || A.oBackingStorePixelRatio || A.backingStorePixelRatio || 1;
              return S / b;
            }, _ = function(x, A) {
              var S = x.textures[A];
              return S || (S = x.textures[A] = new Image(), S.src = A, S);
            }, w = function(x, A) {
              var S = A;
              /(jpg|gif|png)$/.test(A) && (S = "url(" + A + ")"), x.canvas.style.background = S, x.canvas.style.backgroundSize = "contain", x.currentBackground = A;
            };
          })();
        },
        /* 27 */
        /***/
        function(e, r, s) {
          var n = {};
          e.exports = n;
          var o = s(5), a = s(17), h = s(0);
          (function() {
            n._maxFrameDelta = 1e3 / 15, n._frameDeltaFallback = 1e3 / 60, n._timeBufferMargin = 1.5, n._elapsedNextEstimate = 1, n._smoothingLowerBound = 0.1, n._smoothingUpperBound = 0.9, n.create = function(l) {
              var f = {
                delta: 16.666666666666668,
                frameDelta: null,
                frameDeltaSmoothing: !0,
                frameDeltaSnapping: !0,
                frameDeltaHistory: [],
                frameDeltaHistorySize: 100,
                frameRequestId: null,
                timeBuffer: 0,
                timeLastTick: null,
                maxUpdates: null,
                maxFrameTime: 33.333333333333336,
                lastUpdatesDeferred: 0,
                enabled: !0
              }, p = h.extend(f, l);
              return p.fps = 0, p;
            }, n.run = function(l, f) {
              return l.timeBuffer = n._frameDeltaFallback, function p(u) {
                l.frameRequestId = n._onNextFrame(l, p), u && l.enabled && n.tick(l, f, u);
              }(), l;
            }, n.tick = function(l, f, p) {
              var u = h.now(), d = l.delta, m = 0, g = p - l.timeLastTick;
              if ((!g || !l.timeLastTick || g > Math.max(n._maxFrameDelta, l.maxFrameTime)) && (g = l.frameDelta || n._frameDeltaFallback), l.frameDeltaSmoothing) {
                l.frameDeltaHistory.push(g), l.frameDeltaHistory = l.frameDeltaHistory.slice(-l.frameDeltaHistorySize);
                var y = l.frameDeltaHistory.slice(0).sort(), v = l.frameDeltaHistory.slice(
                  y.length * n._smoothingLowerBound,
                  y.length * n._smoothingUpperBound
                ), _ = c(v);
                g = _ || g;
              }
              l.frameDeltaSnapping && (g = 1e3 / Math.round(1e3 / g)), l.frameDelta = g, l.timeLastTick = p, l.timeBuffer += l.frameDelta, l.timeBuffer = h.clamp(
                l.timeBuffer,
                0,
                l.frameDelta + d * n._timeBufferMargin
              ), l.lastUpdatesDeferred = 0;
              var w = l.maxUpdates || Math.ceil(l.maxFrameTime / d), x = {
                timestamp: f.timing.timestamp
              };
              o.trigger(l, "beforeTick", x), o.trigger(l, "tick", x);
              for (var A = h.now(); d > 0 && l.timeBuffer >= d * n._timeBufferMargin; ) {
                o.trigger(l, "beforeUpdate", x), a.update(f, d), o.trigger(l, "afterUpdate", x), l.timeBuffer -= d, m += 1;
                var S = h.now() - u, b = h.now() - A, C = S + n._elapsedNextEstimate * b / m;
                if (m >= w || C > l.maxFrameTime) {
                  l.lastUpdatesDeferred = Math.round(Math.max(0, l.timeBuffer / d - n._timeBufferMargin));
                  break;
                }
              }
              f.timing.lastUpdatesPerFrame = m, o.trigger(l, "afterTick", x), l.frameDeltaHistory.length >= 100 && (l.lastUpdatesDeferred && Math.round(l.frameDelta / d) > w ? h.warnOnce("Matter.Runner: runner reached runner.maxUpdates, see docs.") : l.lastUpdatesDeferred && h.warnOnce("Matter.Runner: runner reached runner.maxFrameTime, see docs."), typeof l.isFixed < "u" && h.warnOnce("Matter.Runner: runner.isFixed is now redundant, see docs."), (l.deltaMin || l.deltaMax) && h.warnOnce("Matter.Runner: runner.deltaMin and runner.deltaMax were removed, see docs."), l.fps !== 0 && h.warnOnce("Matter.Runner: runner.fps was replaced by runner.delta, see docs."));
            }, n.stop = function(l) {
              n._cancelNextFrame(l);
            }, n._onNextFrame = function(l, f) {
              if (typeof window < "u" && window.requestAnimationFrame)
                l.frameRequestId = window.requestAnimationFrame(f);
              else
                throw new Error("Matter.Runner: missing required global window.requestAnimationFrame.");
              return l.frameRequestId;
            }, n._cancelNextFrame = function(l) {
              if (typeof window < "u" && window.cancelAnimationFrame)
                window.cancelAnimationFrame(l.frameRequestId);
              else
                throw new Error("Matter.Runner: missing required global window.cancelAnimationFrame.");
            };
            var c = function(l) {
              for (var f = 0, p = l.length, u = 0; u < p; u += 1)
                f += l[u];
              return f / p || 0;
            };
          })();
        },
        /* 28 */
        /***/
        function(e, r, s) {
          var n = {};
          e.exports = n;
          var o = s(8), a = s(0), h = a.deprecated;
          (function() {
            n.collides = function(c, l) {
              return o.collides(c, l);
            }, h(n, "collides", "SAT.collides ➤ replaced by Collision.collides");
          })();
        },
        /* 29 */
        /***/
        function(e, r, s) {
          var n = {};
          e.exports = n, s(1);
          var o = s(0);
          (function() {
            n.pathToVertices = function(a, h) {
              typeof window < "u" && !("SVGPathSeg" in window) && o.warn("Svg.pathToVertices: SVGPathSeg not defined, a polyfill is required.");
              var c, l, f, p, u, d, m, g, y, v, _ = [], w, x, A = 0, S = 0, b = 0;
              h = h || 15;
              var C = function(k, M, T) {
                var E = T % 2 === 1 && T > 1;
                if (!y || k != y.x || M != y.y) {
                  y && E ? (w = y.x, x = y.y) : (w = 0, x = 0);
                  var B = {
                    x: w + k,
                    y: x + M
                  };
                  (E || !y) && (y = B), _.push(B), S = w + k, b = x + M;
                }
              }, P = function(k) {
                var M = k.pathSegTypeAsLetter.toUpperCase();
                if (M !== "Z") {
                  switch (M) {
                    case "M":
                    case "L":
                    case "T":
                    case "C":
                    case "S":
                    case "Q":
                      S = k.x, b = k.y;
                      break;
                    case "H":
                      S = k.x;
                      break;
                    case "V":
                      b = k.y;
                      break;
                  }
                  C(S, b, k.pathSegType);
                }
              };
              for (n._svgPathToAbsolute(a), f = a.getTotalLength(), d = [], c = 0; c < a.pathSegList.numberOfItems; c += 1)
                d.push(a.pathSegList.getItem(c));
              for (m = d.concat(); A < f; ) {
                if (v = a.getPathSegAtLength(A), u = d[v], u != g) {
                  for (; m.length && m[0] != u; )
                    P(m.shift());
                  g = u;
                }
                switch (u.pathSegTypeAsLetter.toUpperCase()) {
                  case "C":
                  case "T":
                  case "S":
                  case "Q":
                  case "A":
                    p = a.getPointAtLength(A), C(p.x, p.y, 0);
                    break;
                }
                A += h;
              }
              for (c = 0, l = m.length; c < l; ++c)
                P(m[c]);
              return _;
            }, n._svgPathToAbsolute = function(a) {
              for (var h, c, l, f, p, u, d = a.pathSegList, m = 0, g = 0, y = d.numberOfItems, v = 0; v < y; ++v) {
                var _ = d.getItem(v), w = _.pathSegTypeAsLetter;
                if (/[MLHVCSQTA]/.test(w))
                  "x" in _ && (m = _.x), "y" in _ && (g = _.y);
                else
                  switch ("x1" in _ && (l = m + _.x1), "x2" in _ && (p = m + _.x2), "y1" in _ && (f = g + _.y1), "y2" in _ && (u = g + _.y2), "x" in _ && (m += _.x), "y" in _ && (g += _.y), w) {
                    case "m":
                      d.replaceItem(a.createSVGPathSegMovetoAbs(m, g), v);
                      break;
                    case "l":
                      d.replaceItem(a.createSVGPathSegLinetoAbs(m, g), v);
                      break;
                    case "h":
                      d.replaceItem(a.createSVGPathSegLinetoHorizontalAbs(m), v);
                      break;
                    case "v":
                      d.replaceItem(a.createSVGPathSegLinetoVerticalAbs(g), v);
                      break;
                    case "c":
                      d.replaceItem(a.createSVGPathSegCurvetoCubicAbs(m, g, l, f, p, u), v);
                      break;
                    case "s":
                      d.replaceItem(a.createSVGPathSegCurvetoCubicSmoothAbs(m, g, p, u), v);
                      break;
                    case "q":
                      d.replaceItem(a.createSVGPathSegCurvetoQuadraticAbs(m, g, l, f), v);
                      break;
                    case "t":
                      d.replaceItem(a.createSVGPathSegCurvetoQuadraticSmoothAbs(m, g), v);
                      break;
                    case "a":
                      d.replaceItem(a.createSVGPathSegArcAbs(m, g, _.r1, _.r2, _.angle, _.largeArcFlag, _.sweepFlag), v);
                      break;
                    case "z":
                    case "Z":
                      m = h, g = c;
                      break;
                  }
                (w == "M" || w == "m") && (h = m, c = g);
              }
            };
          })();
        },
        /* 30 */
        /***/
        function(e, r, s) {
          var n = {};
          e.exports = n;
          var o = s(6);
          s(0), function() {
            n.create = o.create, n.add = o.add, n.remove = o.remove, n.clear = o.clear, n.addComposite = o.addComposite, n.addBody = o.addBody, n.addConstraint = o.addConstraint;
          }();
        }
        /******/
      ])
    );
  });
})(Tu);
var le = Tu.exports;
let ai;
const Mi = /* @__PURE__ */ new Map(), hn = /* @__PURE__ */ new Map(), ia = /* @__PURE__ */ new Map();
let $r = 0;
const j0 = () => {
  ai = le.Engine.create(), le.Events.on(ai, "collisionStart", (i) => {
    i.pairs.forEach((t) => {
      var e, r;
      const { bodyA: s, bodyB: n } = t, o = Mi.get(s.label), a = Mi.get(n.label);
      if (!o || !a) return;
      const h = [o, a].find((l) => l.surface), c = [o, a].find((l) => !l.surface);
      c && (h ? hn.set(
        c.target.matterBody.label,
        Math.floor(Nh(h).y1)
      ) : ((e = o.onCollision) == null || e.call(o, a.target), (r = a.onCollision) == null || r.call(a, o.target)));
    });
  }), le.Events.on(ai, "collisionEnd", (i) => {
    i.pairs.forEach((t) => {
      const { bodyA: e, bodyB: r } = t, s = Mi.get(e.label), n = Mi.get(r.label);
      if (!s || !n) return;
      const o = [s, n].find((h) => h.surface), a = [s, n].find((h) => !h.surface);
      a && o && hn.delete(a.target.matterBody.label);
    });
  }), le.Events.on(ai, "afterUpdate", () => {
    ia.forEach((i) => {
      var t;
      if (!i.target.matterBody) return;
      const e = Nh(i), r = (hn.get(i.target.matterBody.label) ?? -1 / 0) >= Math.floor(e.y2);
      (t = i.onUpdatePosition) == null || t.call(i, e.x1, e.y1, r);
    });
  });
}, N0 = (i) => {
  le.Engine.update(ai, i);
}, zn = (i) => {
  if (i.rectangle)
    i.target.matterBody = le.Bodies.rectangle(
      i.rectangle.x + i.rectangle.width / 2,
      i.rectangle.y + i.rectangle.height / 2,
      i.rectangle.width,
      i.rectangle.height,
      jh(i)
    );
  else if (i.circle)
    i.target.matterBody = le.Bodies.circle(
      i.circle.x,
      i.circle.y,
      i.circle.radius,
      jh(i)
    );
  else
    throw new Error("No body specification provided");
  Mi.set(i.target.matterBody.label, i), i.onUpdatePosition && ia.set(i.target.matterBody.label, i), le.Composite.add(ai.world, i.target.matterBody), i.movement && ra(i.target, i.movement);
}, W0 = (i) => {
  i.matterBody && (le.Composite.remove(ai.world, i.matterBody), Mi.delete(i.matterBody.label), hn.delete(i.matterBody.label), ia.delete(i.matterBody.label));
}, ra = (i, t) => {
  i.matterBody && t.linearMovement && le.Body.setVelocity(i.matterBody, t.linearMovement.velocity);
}, Hh = (i, t, e) => {
  i.matterBody && le.Body.setPosition(i.matterBody, {
    x: i.matterBody.position.x + t,
    y: i.matterBody.position.y + e
  });
}, jh = (i) => {
  var t;
  return $r++, i.surface ? {
    isStatic: !0,
    label: $r.toString(),
    inertia: 1 / 0,
    inverseInertia: 0,
    restitution: 0
  } : (t = i.movement) != null && t.linearMovement ? {
    friction: 0,
    frictionAir: 0,
    frictionStatic: 0,
    inertia: 1 / 0,
    inverseInertia: 0,
    restitution: 0,
    label: $r.toString()
  } : {
    isStatic: !0,
    friction: 0,
    frictionAir: 0,
    frictionStatic: 0,
    restitution: 0,
    isSensor: !0,
    label: $r.toString()
  };
}, Nh = (i) => i.target.matterBody ? i.rectangle ? {
  x1: i.target.matterBody.position.x - i.rectangle.width / 2,
  y1: i.target.matterBody.position.y - i.rectangle.height / 2,
  x2: i.target.matterBody.position.x + i.rectangle.width / 2,
  y2: i.target.matterBody.position.y + i.rectangle.height / 2
} : i.circle ? {
  x1: i.target.matterBody.position.x - i.circle.radius,
  y1: i.target.matterBody.position.y - i.circle.radius,
  x2: i.target.matterBody.position.x + i.circle.radius,
  y2: i.target.matterBody.position.y + i.circle.radius
} : { x1: 0, y1: 0, x2: 0, y2: 0 } : { x1: 0, y1: 0, x2: 0, y2: 0 };
class Dn {
  constructor(t, e) {
    $t(this, "_props"), $t(this, "_object"), $t(this, "_parent", null), $t(this, "_bindings", []), $t(this, "_animations", []), this._props = e, this._object = t, this.hitArea = this.props.hitArea, this._createEvents(), this._setOrientationProperties(), this._positionToScreen(), (this.props.animations ?? []).forEach((r) => this.animate(r));
  }
  _registerToSignal(t, e) {
    this._bindings.push(hr(t, e.bind(this)));
  }
  _unregisterFromSignal(t) {
    for (let e = 0; e < this._bindings.length; e++)
      this._bindings[e].name === t && (pn(t, this._bindings[e].binding), this._bindings.splice(e, 1), e--);
  }
  get props() {
    return this._props;
  }
  get object() {
    return this._object;
  }
  get x() {
    return this.object.x;
  }
  set x(t) {
    this.object.x = t;
  }
  get y() {
    return this.object.y;
  }
  set y(t) {
    this.object.y = t;
  }
  get position() {
    return this.object.position;
  }
  set position(t) {
    this.object.position = t;
  }
  get globalPosition() {
    return this.object.toGlobal(this.position);
  }
  set scale(t) {
    this.object.scale = t;
  }
  get scale() {
    return this.object.scale;
  }
  get scaleX() {
    return this.object.scale.x;
  }
  set scaleX(t) {
    this.object.scale.x = t;
  }
  get scaleY() {
    return this.object.scale.y;
  }
  set scaleY(t) {
    this.object.scale.y = t;
  }
  get width() {
    return this.object.width;
  }
  set width(t) {
    this.object.width = t;
  }
  get height() {
    return this.object.height;
  }
  set height(t) {
    this.object.height = t;
  }
  get alpha() {
    return this.object.alpha;
  }
  set alpha(t) {
    this.object.alpha = t;
  }
  get visible() {
    return this.object.visible;
  }
  set visible(t) {
    this.object.visible = t;
  }
  get label() {
    return this.object.label;
  }
  get parent() {
    return this._parent;
  }
  set parent(t) {
    this._parent = t;
  }
  get interactive() {
    return this.object.interactive ?? !1;
  }
  set interactive(t) {
    this.object.interactive = t;
  }
  get rotation() {
    return this.object.rotation;
  }
  set rotation(t) {
    this.object.rotation = t;
  }
  get tint() {
    return this.object.tint;
  }
  set tint(t) {
    this.object.tint = t;
  }
  get zIndex() {
    return this.object.zIndex;
  }
  set zIndex(t) {
    this.object.zIndex = t;
  }
  set hitArea(t) {
    t != null && t.circle ? this.object.hitArea = new En(
      t.circle.x,
      t.circle.y,
      t.circle.radius
    ) : t != null && t.roundedRectangle ? this.object.hitArea = new Bn(
      t.roundedRectangle.x,
      t.roundedRectangle.y,
      t.roundedRectangle.width,
      t.roundedRectangle.height,
      t.roundedRectangle.borderRadius
    ) : t != null && t.rectangle ? this.object.hitArea = new mt(
      t.rectangle.x,
      t.rectangle.y,
      t.rectangle.width,
      t.rectangle.height
    ) : t != null && t.polygon ? this.object.hitArea = new Ti(t.polygon.points) : this.object.hitArea = null;
  }
  animate(t) {
    return this._createAnimation(this, t);
  }
  getAnimation(t) {
    return this._animations.find((e) => e.name === t);
  }
  stopAnimations() {
    this._animations.forEach((t) => t.stop()), this._animations = [];
  }
  finishAnimations() {
    this._animations.forEach((t) => t.finish());
  }
  delay(t) {
    return this._createAnimation(
      { x: 0 },
      {
        from: { x: 0 },
        to: { x: 1 },
        duration: t
      }
    );
  }
  destroy() {
    if (this.parent) {
      this.parent.removeComponent(this);
      return;
    }
    W0(this), this._bindings.forEach(
      ({ name: t, binding: e }) => pn(t, e)
    ), this._bindings = [], this.stopAnimations(), this.parent = null, this.object.destroy();
  }
  _positionToScreen() {
    var t, e, r, s;
    this.props.horizontalAlignment === "center" ? this.x = V.screen.width / 2 + (((t = this.props.margin) == null ? void 0 : t.x) ?? 0) : this.props.horizontalAlignment === "right" && (this.x = V.screen.width + (((e = this.props.margin) == null ? void 0 : e.x) ?? 0)), this.props.verticalAlignment === "center" ? this.y = V.screen.height / 2 + (((r = this.props.margin) == null ? void 0 : r.y) ?? 0) : this.props.verticalAlignment === "bottom" && (this.y = V.screen.height + (((s = this.props.margin) == null ? void 0 : s.y) ?? 0));
  }
  _setOrientationProperties() {
    if (!this.props.landscape && !this.props.portrait) return;
    const t = this.props[V.screen.orientation];
    for (const e in t)
      this[e] = t[e];
  }
  async _createAnimation(t, e) {
    const r = new qi(e);
    this._animations.push(r), await r.start(t);
    const s = this._animations.indexOf(r);
    this._animations.splice(s, 1);
  }
  _createEvents() {
    var t, e, r;
    const s = [
      this.props.horizontalAlignment || this.props.verticalAlignment ? this._positionToScreen.bind(this) : null,
      this.props.onResize,
      (t = this._onResize) == null ? void 0 : t.bind(this)
    ].filter(Boolean);
    s.length > 0 && this._registerToSignal(L.signals.onResize, () => {
      s.forEach((a) => a(this));
    });
    const n = [
      this.props.landscape || this.props.portrait ? this._setOrientationProperties.bind(this) : null,
      this.props.onOrientationChange,
      (e = this._onOrientationChange) == null ? void 0 : e.bind(this)
    ].filter(Boolean);
    n.length > 0 && this._registerToSignal(L.signals.onOrientationChange, () => {
      n.forEach((a) => a(this));
    });
    const o = [
      this.props.onTick,
      (r = this._onTick) == null ? void 0 : r.bind(this)
    ].filter(Boolean);
    o.length > 0 && this._registerToSignal(L.signals.onTick, () => {
      o.forEach((a) => a(this));
    }), (this._onClick || this.props.onClick) && this.object.on("pointerdown", (a) => {
      var h, c;
      a.stopImmediatePropagation(), (c = (h = this.props).onClick) == null || c.call(h, this), this._onClick();
    }), (this._onPointerUp || this.props.onPointerUp) && this.object.on("pointerup", (a) => {
      var h, c;
      a.stopImmediatePropagation(), (c = (h = this.props).onPointerUp) == null || c.call(h, this), this._onPointerUp();
    }), (this._onPointerEnter || this.props.onPointerEnter) && this.object.on("pointerenter", (a) => {
      var h, c;
      a.stopImmediatePropagation(), (c = (h = this.props).onPointerEnter) == null || c.call(h, this), this._onPointerEnter();
    }), (this._onPointerOut || this.props.onPointerOut) && this.object.on("pointerout", (a) => {
      var h, c;
      a.stopImmediatePropagation(), (c = (h = this.props).onPointerOut) == null || c.call(h, this), this._onPointerOut();
    });
  }
}
let vr;
const Re = /* @__PURE__ */ new Map(), Y0 = () => {
  vr = xe.get("audio/sounds.mp3");
  const i = xe.get("audio/sounds.json");
  vr.muted = V.muted, vr.addSprites(i);
}, yi = async (i, t = {}) => {
  const { loop: e = !1, volume: r = 1 } = t, s = await vr.play({
    sprite: i,
    loop: e,
    volume: r,
    complete: () => Re.delete(i)
  });
  Re.set(i, s);
}, na = async (i, t) => {
  const {
    fromVolume: e = 0.1,
    toVolume: r = 1,
    fadeDuration: s,
    loop: n = !1
  } = t;
  await yi(i, { loop: n, volume: r }), await new qi({
    duration: s,
    from: { volume: e },
    to: { volume: r }
  }).start(Re.get(i));
}, X0 = (i) => {
  var t, e;
  (t = Re.get(i)) == null || t.stop(), (e = Re.get(i)) == null || e.destroy(), Re.delete(i);
}, sa = async (i, t) => {
  const e = Re.get(i);
  if (!e) return;
  const { fadeDuration: r } = t;
  await new qi({
    duration: r,
    from: { volume: e.volume },
    to: { volume: 0 }
  }).start(e), X0(i);
}, q0 = (i) => {
  vr.muted = i;
}, K0 = () => {
  for (const [i, t] of Re)
    t.paused = !0;
}, Q0 = () => {
  for (const [i, t] of Re)
    t.paused = !1;
}, Un = (i) => ({
  label: i.label,
  position: i.position,
  anchor: i.anchor,
  scale: i.scale,
  rotation: i.rotation,
  width: i.width,
  height: i.height,
  alpha: i.alpha,
  interactive: i.interactive,
  cursor: i.cursor,
  visible: i.visible,
  tint: i.tint,
  zIndex: i.zIndex
});
let Eu;
const Wh = /* @__PURE__ */ new Map(), J0 = (i) => {
  Eu = i;
}, Z0 = (i) => {
  let t;
  if (i.rectangle)
    t = new si().rect(
      i.rectangle.x,
      i.rectangle.y,
      i.rectangle.width,
      i.rectangle.height
    );
  else if (i.roundedRectangle)
    t = new si().roundRect(
      i.roundedRectangle.x,
      i.roundedRectangle.y,
      i.roundedRectangle.width,
      i.roundedRectangle.height,
      i.roundedRectangle.borderRadius
    );
  else if (i.circle)
    t = new si().circle(
      i.circle.x,
      i.circle.y,
      i.circle.radius
    );
  else if (i.polygon)
    t = new si().poly(i.polygon.points);
  else
    throw new Error("Invalid shape type");
  return t = t.fill(i.fillColor), i.strokeColor != null && (t = t.stroke({
    color: i.strokeColor,
    width: i.strokeWidth ?? 0
  })), t;
}, _n = (i) => {
  const t = JSON.stringify(i);
  let e = Wh.get(t);
  if (e) return e;
  if (typeof i == "string") return H.from(i);
  const r = Z0(i);
  return e = Do.create({
    width: r.width,
    height: r.height
  }), Eu.render({ container: r, target: e }), Wh.set(t, e), e;
};
class ce extends Dn {
  constructor(t) {
    super(
      new zi({
        ...Un(t),
        texture: _n(t.resource)
      }),
      t
    );
  }
  get anchor() {
    return this.object.anchor;
  }
  set anchor(t) {
    this.object.anchor = t;
  }
  get originalWidth() {
    return this.object.texture.width;
  }
  get originalHeight() {
    return this.object.texture.height;
  }
  set texture(t) {
    this.object.texture = _n(t);
  }
}
class oa extends ce {
  constructor(t) {
    super(t), $t(this, "_pointerOver", !1), $t(this, "_enabled", !0);
  }
  get props() {
    return super.props;
  }
  get enabled() {
    return this._enabled;
  }
  set enabled(t) {
    this._enabled !== t && (this._enabled = t, this._setCurrentTexture());
  }
  get pointerOver() {
    return this._pointerOver;
  }
  _onPointerEnter() {
    this._pointerOver = !0, this._setCurrentTexture();
  }
  _onPointerOut() {
    this._pointerOver = !1, this._setCurrentTexture();
  }
  async _onClick() {
    yi(L.sounds.click), this.texture = this.enabled ? this.props.resource : this.props.disabledResource, await this.delay(0.1), this._setCurrentTexture();
  }
  _setCurrentTexture() {
    this.enabled ? this.pointerOver ? this.texture = this.props.hoverResource : this.texture = this.props.resource : this.texture = this.props.disabledResource;
  }
}
class Le extends Dn {
  constructor(t) {
    super(
      new Ot({
        ...Un(t),
        sortableChildren: t.sortableChildren
      }),
      t
    ), $t(this, "_components", []), this.addComponents(t.components ?? []);
  }
  get components() {
    return this._components;
  }
  get sortableChildren() {
    return this.object.sortableChildren;
  }
  set sortableChildren(t) {
    this.object.sortableChildren = t;
  }
  addComponent(t) {
    return this.components.push(t), this.object.addChild(t.object), t.parent = this, t;
  }
  addComponents(t) {
    t.forEach((e) => this.addComponent(e));
  }
  getComponent(t) {
    return this.components.find((e) => e.label === t);
  }
  removeComponent(t) {
    const e = this.components.indexOf(t);
    e >= 0 && (this.components[e].parent = null, this.components[e].destroy(), this.components.splice(e, 1));
  }
  removeComponents() {
    this.components.forEach((t) => {
      t.parent = null, t.destroy();
    }), this._components = [];
  }
  destroy() {
    this.removeComponents(), super.destroy();
  }
  _positionToScreen() {
    var t, e, r, s;
    this.props.horizontalAlignment === "center" ? this.x = (V.screen.width - (this.props.width ?? 0)) / 2 + (((t = this.props.margin) == null ? void 0 : t.x) ?? 0) : this.props.horizontalAlignment === "right" && (this.x = V.screen.width - (this.props.width ?? 0) + (((e = this.props.margin) == null ? void 0 : e.x) ?? 0)), this.props.verticalAlignment === "center" ? this.y = (V.screen.height - (this.props.height ?? 0)) / 2 + (((r = this.props.margin) == null ? void 0 : r.y) ?? 0) : this.props.verticalAlignment === "bottom" && (this.y = V.screen.height - (this.props.height ?? 0) + (((s = this.props.margin) == null ? void 0 : s.y) ?? 0));
  }
}
class $0 extends oa {
  constructor(t) {
    super(t);
  }
  get props() {
    return super.props;
  }
  async _onClick() {
    super._onClick(), window.location.href = this.props.url;
  }
}
class Ir extends Dn {
  constructor(t) {
    super(
      new wg({
        ...Un(t),
        texture: _n(t.resource),
        anchor: typeof t.anchor == "number" ? { x: t.anchor, y: t.anchor } : t.anchor
      }),
      t
    );
  }
  get anchor() {
    return this.object.anchor;
  }
  set anchor(t) {
    this.object.anchor = t;
  }
  get originalWidth() {
    return this.object.texture.width;
  }
  get originalHeight() {
    return this.object.texture.height;
  }
  get tileScale() {
    return this.object.tileScale;
  }
  set tileScale(t) {
    this.object.tileScale = t;
  }
  get tilePosition() {
    return this.object.tilePosition;
  }
  set tilePosition(t) {
    this.object.tilePosition = t;
  }
  set texture(t) {
    this.object.texture = _n(t);
  }
}
class Bu extends Ir {
  constructor(t) {
    super(t), this._onResize();
  }
  _onResize() {
    this.width = V.screen.width, this.height = V.screen.height;
    const t = V.screen.height / this.originalHeight;
    this.tileScale = { x: t, y: t };
  }
}
class Ru extends Bu {
  _onTick() {
    this.tilePosition.x--;
  }
}
class Kt extends Dn {
  constructor(t) {
    const e = {
      ...Un(t),
      text: t.text,
      style: {
        fontFamily: t.fontFamily,
        fontSize: t.fontSize,
        fill: t.textColor,
        lineHeight: t.lineHeight,
        wordWrap: t.wordWrap,
        wordWrapWidth: t.wordWrapWidth,
        align: t.align,
        fontWeight: t.fontWeight ?? "normal",
        fontStyle: t.fontStyle ?? "normal",
        stroke: t.strokeColor && {
          color: t.strokeColor,
          width: t.strokeWidth
        }
      }
    };
    super(t.bitmap ? new Sg(e) : new Ag(e), t);
  }
  get anchor() {
    return this.object.anchor;
  }
  set anchor(t) {
    this.object.anchor = t;
  }
  get fontSize() {
    return this.object.style.fontSize;
  }
  set fontSize(t) {
    this.object.style.fontSize = t;
  }
  get wordWrapWidth() {
    return this.object.style.wordWrapWidth;
  }
  set wordWrapWidth(t) {
    this.object.style.wordWrapWidth = t;
  }
  get fontWeight() {
    return this.object.style.fontWeight;
  }
  set fontWeight(t) {
    this.object.style.fontWeight = t;
  }
  get fontStyle() {
    return this.object.style.fontStyle;
  }
  set fontStyle(t) {
    this.object.style.fontStyle = t;
  }
  get align() {
    return this.object.style.align;
  }
  set align(t) {
    this.object.style.align = t;
  }
  get text() {
    return this.object.text;
  }
  set text(t) {
    this.object.text = t;
  }
}
class ty extends oa {
  constructor(t) {
    super(t), $t(this, "_originalProps"), this._originalProps = structuredClone(t), this._setResources();
  }
  get props() {
    return super.props;
  }
  async _onClick() {
    localStorage.setItem("muted", V.muted ? "false" : "true"), V.muted = !V.muted, q0(V.muted), this._setResources(), super._onClick();
  }
  _setResources() {
    V.muted ? (this.props.resource = this._originalProps.mutedResource, this.props.hoverResource = this._originalProps.mutedHoverResource, this.props.disabledResource = this._originalProps.mutedDisabledResource) : (this.props.resource = this._originalProps.resource, this.props.hoverResource = this._originalProps.hoverResource, this.props.disabledResource = this._originalProps.disabledResource), this._setCurrentTexture();
  }
}
var ey = {}, Xe = {};
Object.defineProperty(Xe, "__esModule", { value: !0 });
Xe.Collector = void 0;
class iy {
  /**
   * Create a new collector.
   *
   * @param signal The signal to emit.
   */
  constructor(t) {
    this.emit = (...e) => {
      t.emitCollecting(this, e);
    };
  }
}
Xe.Collector = iy;
var Gn = {};
Object.defineProperty(Gn, "__esModule", { value: !0 });
Gn.CollectorArray = void 0;
const ry = Xe;
class ny extends ry.Collector {
  constructor() {
    super(...arguments), this.result = [];
  }
  handleResult(t) {
    return this.result.push(t), !0;
  }
  /**
   * Get the list of results from the signal handlers.
   */
  getResult() {
    return this.result;
  }
  /**
   * Reset the result
   */
  reset() {
    this.result.length = 0;
  }
}
Gn.CollectorArray = ny;
var Vn = {};
Object.defineProperty(Vn, "__esModule", { value: !0 });
Vn.CollectorLast = void 0;
const sy = Xe;
class oy extends sy.Collector {
  handleResult(t) {
    return this.result = t, !0;
  }
  /**
   * Get the result of the last signal handler.
   */
  getResult() {
    return this.result;
  }
  /**
   * Reset the result
   */
  reset() {
    delete this.result;
  }
}
Vn.CollectorLast = oy;
var Hn = {};
Object.defineProperty(Hn, "__esModule", { value: !0 });
Hn.CollectorUntil0 = void 0;
const ay = Xe;
class hy extends ay.Collector {
  constructor() {
    super(...arguments), this.result = !1;
  }
  handleResult(t) {
    return this.result = t, this.result;
  }
  /**
   * Get the result of the last signal handler.
   */
  getResult() {
    return this.result;
  }
  /**
   * Reset the result
   */
  reset() {
    this.result = !1;
  }
}
Hn.CollectorUntil0 = hy;
var jn = {};
Object.defineProperty(jn, "__esModule", { value: !0 });
jn.CollectorWhile0 = void 0;
const ly = Xe;
class cy extends ly.Collector {
  constructor() {
    super(...arguments), this.result = !1;
  }
  handleResult(t) {
    return this.result = t, !this.result;
  }
  /**
   * Get the result of the last signal handler.
   */
  getResult() {
    return this.result;
  }
  /**
   * Reset the result
   */
  reset() {
    this.result = !1;
  }
}
jn.CollectorWhile0 = cy;
var Nn = {}, Wn = {};
Object.defineProperty(Wn, "__esModule", { value: !0 });
Wn.SignalConnectionImpl = void 0;
class uy {
  /**
   * @param link The actual link of the connection.
   * @param parentCleanup Callback to cleanup the parent signal when a connection is disconnected
   */
  constructor(t, e) {
    this.link = t, this.parentCleanup = e;
  }
  disconnect() {
    return this.link !== null ? (this.link.unlink(), this.link = null, this.parentCleanup(), this.parentCleanup = null, !0) : !1;
  }
  set enabled(t) {
    this.link && this.link.setEnabled(t);
  }
  get enabled() {
    return this.link !== null && this.link.isEnabled();
  }
}
Wn.SignalConnectionImpl = uy;
var Yn = {};
Object.defineProperty(Yn, "__esModule", { value: !0 });
Yn.SignalLink = void 0;
class aa {
  constructor(t = null, e = null, r = 0) {
    this.enabled = !0, this.newLink = !1, this.callback = null, this.prev = t ?? this, this.next = e ?? this, this.order = r;
  }
  isEnabled() {
    return this.enabled && !this.newLink;
  }
  setEnabled(t) {
    this.enabled = t;
  }
  unlink() {
    this.callback = null, this.next.prev = this.prev, this.prev.next = this.next;
  }
  insert(t, e) {
    let r = this.prev;
    for (; r !== this && !(r.order <= e); )
      r = r.prev;
    const s = new aa(r, r.next, e);
    return s.callback = t, r.next = s, s.next.prev = s, s;
  }
}
Yn.SignalLink = aa;
Object.defineProperty(Nn, "__esModule", { value: !0 });
Nn.Signal = void 0;
const dy = Wn, py = Yn;
class fy {
  constructor() {
    this.head = new py.SignalLink(), this.hasNewLinks = !1, this.emitDepth = 0, this.connectionsCount = 0;
  }
  /**
   * @returns The number of connections on this signal.
   */
  getConnectionsCount() {
    return this.connectionsCount;
  }
  /**
   * @returns true if this signal has connections.
   */
  hasConnections() {
    return this.connectionsCount > 0;
  }
  /**
   * Subscribe to this signal.
   *
   * @param callback This callback will be run when emit() is called.
   * @param order Handlers with a higher order value will be called later.
   */
  connect(t, e = 0) {
    this.connectionsCount++;
    const r = this.head.insert(t, e);
    return this.emitDepth > 0 && (this.hasNewLinks = !0, r.newLink = !0), new dy.SignalConnectionImpl(r, () => this.decrementConnectionCount());
  }
  decrementConnectionCount() {
    this.connectionsCount--;
  }
  /**
   * Unsubscribe from this signal with the original callback instance.
   * While you can use this method, the SignalConnection returned by connect() will not be updated!
   *
   * @param callback The callback you passed to connect().
   */
  disconnect(t) {
    for (let e = this.head.next; e !== this.head; e = e.next)
      if (e.callback === t)
        return this.decrementConnectionCount(), e.unlink(), !0;
    return !1;
  }
  /**
   * Disconnect all handlers from this signal event.
   */
  disconnectAll() {
    for (; this.head.next !== this.head; )
      this.head.next.unlink();
    this.connectionsCount = 0;
  }
  /**
   * Publish this signal event (call all handlers).
   */
  emit(...t) {
    this.emitDepth++;
    for (let e = this.head.next; e !== this.head; e = e.next)
      e.isEnabled() && e.callback && e.callback.apply(null, t);
    this.emitDepth--, this.unsetNewLink();
  }
  emitCollecting(t, e) {
    this.emitDepth++;
    for (let r = this.head.next; r !== this.head; r = r.next)
      if (r.isEnabled() && r.callback) {
        const s = r.callback.apply(null, e);
        if (!t.handleResult(s))
          break;
      }
    this.emitDepth--, this.unsetNewLink();
  }
  unsetNewLink() {
    if (this.hasNewLinks && this.emitDepth === 0) {
      for (let t = this.head.next; t !== this.head; t = t.next)
        t.newLink = !1;
      this.hasNewLinks = !1;
    }
  }
}
Nn.Signal = fy;
var Xn = {};
Object.defineProperty(Xn, "__esModule", { value: !0 });
Xn.SignalConnections = void 0;
class my {
  constructor() {
    this.list = [];
  }
  /**
   * Add a connection to the list.
   * @param connection
   */
  add(t) {
    this.list.push(t);
  }
  /**
   * Disconnect all connections in the list and empty the list.
   */
  disconnectAll() {
    for (const t of this.list)
      t.disconnect();
    this.list = [];
  }
  /**
   * @returns The number of connections in this list.
   */
  getCount() {
    return this.list.length;
  }
  /**
   * @returns true if this list is empty.
   */
  isEmpty() {
    return this.list.length === 0;
  }
}
Xn.SignalConnections = my;
(function(i) {
  Object.defineProperty(i, "__esModule", { value: !0 }), i.SignalConnections = i.Signal = i.CollectorWhile0 = i.CollectorUntil0 = i.CollectorLast = i.CollectorArray = i.Collector = void 0;
  var t = Xe;
  Object.defineProperty(i, "Collector", { enumerable: !0, get: function() {
    return t.Collector;
  } });
  var e = Gn;
  Object.defineProperty(i, "CollectorArray", { enumerable: !0, get: function() {
    return e.CollectorArray;
  } });
  var r = Vn;
  Object.defineProperty(i, "CollectorLast", { enumerable: !0, get: function() {
    return r.CollectorLast;
  } });
  var s = Hn;
  Object.defineProperty(i, "CollectorUntil0", { enumerable: !0, get: function() {
    return s.CollectorUntil0;
  } });
  var n = jn;
  Object.defineProperty(i, "CollectorWhile0", { enumerable: !0, get: function() {
    return n.CollectorWhile0;
  } });
  var o = Nn;
  Object.defineProperty(i, "Signal", { enumerable: !0, get: function() {
    return o.Signal;
  } });
  var a = Xn;
  Object.defineProperty(i, "SignalConnections", { enumerable: !0, get: function() {
    return a.SignalConnections;
  } });
})(ey);
class Ki extends Le {
  constructor(t = "Scene") {
    super({ label: t });
  }
  async init() {
  }
}
class gy extends Ki {
  async init() {
    this.addComponent(
      new Kt({
        label: "loading-text",
        text: L.loadingScene.text,
        anchor: { x: 0.5, y: 0.5 },
        fontFamily: L.loadingScene.fontFamily,
        fontSize: L.loadingScene.fontSize,
        textColor: L.loadingScene.textColor,
        horizontalAlignment: "center",
        verticalAlignment: "center"
      })
    );
  }
}
const ha = (i, t, e = 500, r = 1e3) => {
  let s = null, n = !1;
  return { start: () => {
    s != null && clearTimeout(s), s = setTimeout(() => {
      n = !0, s = null, i();
    }, e);
  }, cancel: () => {
    s != null && (clearTimeout(s), s = null), n ? s = setTimeout(() => {
      n = !1, s = null, t();
    }, r) : t();
  } };
}, yy = (i, t, e, r) => {
  const s = i.clientWidth, n = i.clientHeight;
  if (s < n) {
    const p = e;
    e = r, r = p;
  }
  const o = Math.min(
    s / e,
    n / r
  ), a = Math.floor(o * e), h = Math.floor(o * r), c = (s - a) / 2, l = (n - h) / 2;
  t.style.width = `${a}px`, t.style.height = `${h}px`, t.style.left = `${c}px`, t.style.top = `${l}px`, t.width = e, t.height = r;
  const f = e < r ? "portrait" : "landscape";
  return {
    width: e,
    height: r,
    orientation: f
  };
};
let Iu;
function xy(i) {
  return Iu = i, i;
}
function Or() {
  return Iu;
}
class Ao {
  /**
   * Dezippering is removed in the future Web Audio API, instead
   * we use the `setValueAtTime` method, however, this is not available
   * in all environments (e.g., Android webview), so we fallback to the `value` setter.
   * @param param - AudioNode parameter object
   * @param value - Value to set
   * @return The value set
   */
  static setParamValue(t, e) {
    if (t.setValueAtTime) {
      const r = Or().context;
      t.setValueAtTime(e, r.audioContext.currentTime);
    } else
      t.value = e;
    return e;
  }
}
class vy extends Bt {
  constructor() {
    super(...arguments), this.speed = 1, this.muted = !1, this.volume = 1, this.paused = !1;
  }
  /** Internal trigger when volume, mute or speed changes */
  refresh() {
    this.emit("refresh");
  }
  /** Internal trigger paused changes */
  refreshPaused() {
    this.emit("refreshPaused");
  }
  /**
   * HTML Audio does not support filters, this is non-functional API.
   */
  get filters() {
    return console.warn("HTML Audio does not support filters"), null;
  }
  set filters(t) {
    console.warn("HTML Audio does not support filters");
  }
  /**
   * HTML Audio does not support `audioContext`
   * @readonly
   * @type {AudioContext}
   */
  get audioContext() {
    return console.warn("HTML Audio does not support audioContext"), null;
  }
  /**
   * Toggles the muted state.
   * @return The current muted state.
   */
  toggleMute() {
    return this.muted = !this.muted, this.refresh(), this.muted;
  }
  /**
   * Toggles the paused state.
   * @return The current paused state.
   */
  togglePause() {
    return this.paused = !this.paused, this.refreshPaused(), this.paused;
  }
  /** Destroy and don't use after this */
  destroy() {
    this.removeAllListeners();
  }
}
let by = 0;
const So = class extends Bt {
  /** @param parent - Parent element */
  constructor(i) {
    super(), this.id = by++, this.init(i);
  }
  /**
   * Set a property by name, this makes it easy to chain values
   * @param name - Name of the property to set
   * @param value - Value to set property to
   */
  set(i, t) {
    if (this[i] === void 0)
      throw new Error(`Property with name ${i} does not exist.`);
    switch (i) {
      case "speed":
        this.speed = t;
        break;
      case "volume":
        this.volume = t;
        break;
      case "paused":
        this.paused = t;
        break;
      case "loop":
        this.loop = t;
        break;
      case "muted":
        this.muted = t;
        break;
    }
    return this;
  }
  /** The current playback progress from 0 to 1. */
  get progress() {
    const { currentTime: i } = this._source;
    return i / this._duration;
  }
  /** Pauses the sound. */
  get paused() {
    return this._paused;
  }
  set paused(i) {
    this._paused = i, this.refreshPaused();
  }
  /**
   * Reference: http://stackoverflow.com/a/40370077
   * @private
   */
  _onPlay() {
    this._playing = !0;
  }
  /**
   * Reference: http://stackoverflow.com/a/40370077
   * @private
   */
  _onPause() {
    this._playing = !1;
  }
  /**
   * Initialize the instance.
   * @param {htmlaudio.HTMLAudioMedia} media - Same as constructor
   */
  init(i) {
    this._playing = !1, this._duration = i.source.duration;
    const t = this._source = i.source.cloneNode(!1);
    t.src = i.parent.url, t.onplay = this._onPlay.bind(this), t.onpause = this._onPause.bind(this), i.context.on("refresh", this.refresh, this), i.context.on("refreshPaused", this.refreshPaused, this), this._media = i;
  }
  /**
   * Stop the sound playing
   * @private
   */
  _internalStop() {
    this._source && this._playing && (this._source.onended = null, this._source.pause());
  }
  /** Stop the sound playing */
  stop() {
    this._internalStop(), this._source && this.emit("stop");
  }
  /** Set the instance speed from 0 to 1 */
  get speed() {
    return this._speed;
  }
  set speed(i) {
    this._speed = i, this.refresh();
  }
  /** Get the set the volume for this instance from 0 to 1 */
  get volume() {
    return this._volume;
  }
  set volume(i) {
    this._volume = i, this.refresh();
  }
  /** If the sound instance should loop playback */
  get loop() {
    return this._loop;
  }
  set loop(i) {
    this._loop = i, this.refresh();
  }
  /** `true` if the sound is muted */
  get muted() {
    return this._muted;
  }
  set muted(i) {
    this._muted = i, this.refresh();
  }
  /**
   * HTML Audio does not support filters, this is non-functional API.
   */
  get filters() {
    return console.warn("HTML Audio does not support filters"), null;
  }
  set filters(i) {
    console.warn("HTML Audio does not support filters");
  }
  /** Call whenever the loop, speed or volume changes */
  refresh() {
    const i = this._media.context, t = this._media.parent;
    this._source.loop = this._loop || t.loop;
    const e = i.volume * (i.muted ? 0 : 1), r = t.volume * (t.muted ? 0 : 1), s = this._volume * (this._muted ? 0 : 1);
    this._source.volume = s * e * r, this._source.playbackRate = this._speed * i.speed * t.speed;
  }
  /** Handle changes in paused state, either globally or sound or instance */
  refreshPaused() {
    const i = this._media.context, t = this._media.parent, e = this._paused || t.paused || i.paused;
    e !== this._pausedReal && (this._pausedReal = e, e ? (this._internalStop(), this.emit("paused")) : (this.emit("resumed"), this.play({
      start: this._source.currentTime,
      end: this._end,
      volume: this._volume,
      speed: this._speed,
      loop: this._loop
    })), this.emit("pause", e));
  }
  /** Start playing the sound/ */
  play(i) {
    const { start: t, end: e, speed: r, loop: s, volume: n, muted: o } = i;
    e && console.assert(e > t, "End time is before start time"), this._speed = r, this._volume = n, this._loop = !!s, this._muted = o, this.refresh(), this.loop && e !== null && (console.warn('Looping not support when specifying an "end" time'), this.loop = !1), this._start = t, this._end = e || this._duration, this._start = Math.max(0, this._start - So.PADDING), this._end = Math.min(this._end + So.PADDING, this._duration), this._source.onloadedmetadata = () => {
      this._source && (this._source.currentTime = t, this._source.onloadedmetadata = null, this.emit("progress", t / this._duration, this._duration), Te.shared.add(this._onUpdate, this));
    }, this._source.onended = this._onComplete.bind(this), this._source.play(), this.emit("start");
  }
  /**
   * Handle time update on sound.
   * @private
   */
  _onUpdate() {
    this.emit("progress", this.progress, this._duration), this._source.currentTime >= this._end && !this._source.loop && this._onComplete();
  }
  /**
   * Callback when completed.
   * @private
   */
  _onComplete() {
    Te.shared.remove(this._onUpdate, this), this._internalStop(), this.emit("progress", 1, this._duration), this.emit("end", this);
  }
  /** Don't use after this. */
  destroy() {
    Te.shared.remove(this._onUpdate, this), this.removeAllListeners();
    const i = this._source;
    i && (i.onended = null, i.onplay = null, i.onpause = null, this._internalStop()), this._source = null, this._speed = 1, this._volume = 1, this._loop = !1, this._end = null, this._start = 0, this._duration = 0, this._playing = !1, this._pausedReal = !1, this._paused = !1, this._muted = !1, this._media && (this._media.context.off("refresh", this.refresh, this), this._media.context.off("refreshPaused", this.refreshPaused, this), this._media = null);
  }
  /**
   * To string method for instance.
   * @return The string representation of instance.
   */
  toString() {
    return `[HTMLAudioInstance id=${this.id}]`;
  }
};
let Ou = So;
Ou.PADDING = 0.1;
class _y extends Bt {
  init(t) {
    this.parent = t, this._source = t.options.source || new Audio(), t.url && (this._source.src = t.url);
  }
  // Implement create
  create() {
    return new Ou(this);
  }
  /**
   * If the audio media is playable (ready).
   * @readonly
   */
  get isPlayable() {
    return !!this._source && this._source.readyState === 4;
  }
  /**
   * THe duration of the media in seconds.
   * @readonly
   */
  get duration() {
    return this._source.duration;
  }
  /**
   * Reference to the context.
   * @readonly
   */
  get context() {
    return this.parent.context;
  }
  /** The collection of filters, does not apply to HTML Audio. */
  get filters() {
    return null;
  }
  set filters(t) {
    console.warn("HTML Audio does not support filters");
  }
  // Override the destroy
  destroy() {
    this.removeAllListeners(), this.parent = null, this._source && (this._source.src = "", this._source.load(), this._source = null);
  }
  /**
   * Get the audio source element.
   * @type {HTMLAudioElement}
   * @readonly
   */
  get source() {
    return this._source;
  }
  // Implement the method to being preloading
  load(t) {
    const e = this._source, r = this.parent;
    if (e.readyState === 4) {
      r.isLoaded = !0;
      const h = r.autoPlayStart();
      t && setTimeout(() => {
        t(null, r, h);
      }, 0);
      return;
    }
    if (!r.url) {
      t(new Error("sound.url or sound.source must be set"));
      return;
    }
    e.src = r.url;
    const s = () => {
      a(), r.isLoaded = !0;
      const h = r.autoPlayStart();
      t && t(null, r, h);
    }, n = () => {
      a(), t && t(new Error("Sound loading has been aborted"));
    }, o = () => {
      a();
      const h = `Failed to load audio element (code: ${e.error.code})`;
      t ? t(new Error(h)) : console.error(h);
    }, a = () => {
      e.removeEventListener("canplaythrough", s), e.removeEventListener("load", s), e.removeEventListener("abort", n), e.removeEventListener("error", o);
    };
    e.addEventListener("canplaythrough", s, !1), e.addEventListener("load", s, !1), e.addEventListener("abort", n, !1), e.addEventListener("error", o, !1), e.load();
  }
}
class wy {
  /**
   * @param parent - The parent sound
   * @param options - Data associated with object.
   */
  constructor(t, e) {
    this.parent = t, Object.assign(this, e), this.duration = this.end - this.start, console.assert(this.duration > 0, "End time must be after start time");
  }
  /**
   * Play the sound sprite.
   * @param {Function} [complete] - Function call when complete
   * @return Sound instance being played.
   */
  play(t) {
    return this.parent.play({
      complete: t,
      speed: this.speed || this.parent.speed,
      end: this.end,
      start: this.start,
      loop: this.loop
    });
  }
  /** Destroy and don't use after this */
  destroy() {
    this.parent = null;
  }
}
const wn = [
  "ogg",
  "oga",
  "opus",
  "m4a",
  "mp3",
  "mpeg",
  "wav",
  "aiff",
  "wma",
  "mid",
  "caf"
], Ay = [
  "audio/mpeg",
  "audio/ogg"
], An = {};
function Sy(i) {
  const t = {
    m4a: "audio/mp4",
    oga: "audio/ogg",
    opus: 'audio/ogg; codecs="opus"',
    caf: 'audio/x-caf; codecs="opus"'
  }, e = document.createElement("audio"), r = {}, s = /^no$/;
  wn.forEach((n) => {
    const o = e.canPlayType(`audio/${n}`).replace(s, ""), a = t[n] ? e.canPlayType(t[n]).replace(s, "") : "";
    r[n] = !!o || !!a;
  }), Object.assign(An, r);
}
Sy();
let Cy = 0;
class Py extends Bt {
  constructor(t) {
    super(), this.id = Cy++, this._media = null, this._paused = !1, this._muted = !1, this._elapsed = 0, this.init(t);
  }
  /**
   * Set a property by name, this makes it easy to chain values
   * @param name - Name of the property to set.
   * @param value - Value to set property to.
   */
  set(t, e) {
    if (this[t] === void 0)
      throw new Error(`Property with name ${t} does not exist.`);
    switch (t) {
      case "speed":
        this.speed = e;
        break;
      case "volume":
        this.volume = e;
        break;
      case "muted":
        this.muted = e;
        break;
      case "loop":
        this.loop = e;
        break;
      case "paused":
        this.paused = e;
        break;
    }
    return this;
  }
  /** Stops the instance, don't use after this. */
  stop() {
    this._source && (this._internalStop(), this.emit("stop"));
  }
  /** Set the instance speed from 0 to 1 */
  get speed() {
    return this._speed;
  }
  set speed(t) {
    this._speed = t, this.refresh(), this._update(!0);
  }
  /** Get the set the volume for this instance from 0 to 1 */
  get volume() {
    return this._volume;
  }
  set volume(t) {
    this._volume = t, this.refresh();
  }
  /** `true` if the sound is muted */
  get muted() {
    return this._muted;
  }
  set muted(t) {
    this._muted = t, this.refresh();
  }
  /** If the sound instance should loop playback */
  get loop() {
    return this._loop;
  }
  set loop(t) {
    this._loop = t, this.refresh();
  }
  /** The collection of filters. */
  get filters() {
    return this._filters;
  }
  set filters(t) {
    var e;
    this._filters && ((e = this._filters) == null || e.filter((r) => r).forEach((r) => r.disconnect()), this._filters = null, this._source.connect(this._gain)), this._filters = t != null && t.length ? t.slice(0) : null, this.refresh();
  }
  /** Refresh loop, volume and speed based on changes to parent */
  refresh() {
    if (!this._source)
      return;
    const t = this._media.context, e = this._media.parent;
    this._source.loop = this._loop || e.loop;
    const r = t.volume * (t.muted ? 0 : 1), s = e.volume * (e.muted ? 0 : 1), n = this._volume * (this._muted ? 0 : 1);
    Ao.setParamValue(this._gain.gain, n * s * r), Ao.setParamValue(this._source.playbackRate, this._speed * e.speed * t.speed), this.applyFilters();
  }
  /** Connect filters nodes to audio context */
  applyFilters() {
    var t;
    if ((t = this._filters) != null && t.length) {
      this._source.disconnect();
      let e = this._source;
      this._filters.forEach((r) => {
        e.connect(r.destination), e = r;
      }), e.connect(this._gain);
    }
  }
  /** Handle changes in paused state, either globally or sound or instance */
  refreshPaused() {
    const t = this._media.context, e = this._media.parent, r = this._paused || e.paused || t.paused;
    r !== this._pausedReal && (this._pausedReal = r, r ? (this._internalStop(), this.emit("paused")) : (this.emit("resumed"), this.play({
      start: this._elapsed % this._duration,
      end: this._end,
      speed: this._speed,
      loop: this._loop,
      volume: this._volume
    })), this.emit("pause", r));
  }
  /**
   * Plays the sound.
   * @param options - Play options.
   */
  play(t) {
    const { start: e, end: r, speed: s, loop: n, volume: o, muted: a, filters: h } = t;
    r && console.assert(r > e, "End time is before start time"), this._paused = !1;
    const { source: c, gain: l } = this._media.nodes.cloneBufferSource();
    this._source = c, this._gain = l, this._speed = s, this._volume = o, this._loop = !!n, this._muted = a, this._filters = h, this.refresh();
    const f = this._source.buffer.duration;
    this._duration = f, this._end = r, this._lastUpdate = this._now(), this._elapsed = e, this._source.onended = this._onComplete.bind(this), this._loop ? (this._source.loopEnd = r, this._source.loopStart = e, this._source.start(0, e)) : r ? this._source.start(0, e, r - e) : this._source.start(0, e), this.emit("start"), this._update(!0), this.enableTicker(!0);
  }
  /** Start the update progress. */
  enableTicker(t) {
    Te.shared.remove(this._updateListener, this), t && Te.shared.add(this._updateListener, this);
  }
  /** The current playback progress from 0 to 1. */
  get progress() {
    return this._progress;
  }
  /** Pauses the sound. */
  get paused() {
    return this._paused;
  }
  set paused(t) {
    this._paused = t, this.refreshPaused();
  }
  /** Don't use after this. */
  destroy() {
    var t;
    this.removeAllListeners(), this._internalStop(), this._gain && (this._gain.disconnect(), this._gain = null), this._media && (this._media.context.events.off("refresh", this.refresh, this), this._media.context.events.off("refreshPaused", this.refreshPaused, this), this._media = null), (t = this._filters) == null || t.forEach((e) => e.disconnect()), this._filters = null, this._end = null, this._speed = 1, this._volume = 1, this._loop = !1, this._elapsed = 0, this._duration = 0, this._paused = !1, this._muted = !1, this._pausedReal = !1;
  }
  /**
   * To string method for instance.
   * @return The string representation of instance.
   */
  toString() {
    return `[WebAudioInstance id=${this.id}]`;
  }
  /**
   * Get the current time in seconds.
   * @return Seconds since start of context
   */
  _now() {
    return this._media.context.audioContext.currentTime;
  }
  /** Callback for update listener */
  _updateListener() {
    this._update();
  }
  /** Internal update the progress. */
  _update(t = !1) {
    if (this._source) {
      const e = this._now(), r = e - this._lastUpdate;
      if (r > 0 || t) {
        const s = this._source.playbackRate.value;
        this._elapsed += r * s, this._lastUpdate = e;
        const n = this._duration;
        let o;
        if (this._source.loopStart) {
          const a = this._source.loopEnd - this._source.loopStart;
          o = (this._source.loopStart + this._elapsed % a) / n;
        } else
          o = this._elapsed % n / n;
        this._progress = o, this.emit("progress", this._progress, n);
      }
    }
  }
  /** Initializes the instance. */
  init(t) {
    this._media = t, t.context.events.on("refresh", this.refresh, this), t.context.events.on("refreshPaused", this.refreshPaused, this);
  }
  /** Stops the instance. */
  _internalStop() {
    if (this._source) {
      this.enableTicker(!1), this._source.onended = null, this._source.stop(0), this._source.disconnect();
      try {
        this._source.buffer = null;
      } catch (t) {
        console.warn("Failed to set AudioBufferSourceNode.buffer to null:", t);
      }
      this._source = null;
    }
  }
  /** Callback when completed. */
  _onComplete() {
    if (this._source) {
      this.enableTicker(!1), this._source.onended = null, this._source.disconnect();
      try {
        this._source.buffer = null;
      } catch (t) {
        console.warn("Failed to set AudioBufferSourceNode.buffer to null:", t);
      }
    }
    this._source = null, this._progress = 1, this.emit("progress", 1, this._duration), this.emit("end", this);
  }
}
class Fu {
  /**
   * @param input - The source audio node
   * @param output - The output audio node
   */
  constructor(t, e) {
    this._output = e, this._input = t;
  }
  /** The destination output audio node */
  get destination() {
    return this._input;
  }
  /** The collection of filters. */
  get filters() {
    return this._filters;
  }
  set filters(t) {
    if (this._filters && (this._filters.forEach((e) => {
      e && e.disconnect();
    }), this._filters = null, this._input.connect(this._output)), t && t.length) {
      this._filters = t.slice(0), this._input.disconnect();
      let e = null;
      t.forEach((r) => {
        e === null ? this._input.connect(r.destination) : e.connect(r.destination), e = r;
      }), e.connect(this._output);
    }
  }
  /** Cleans up. */
  destroy() {
    this.filters = null, this._input = null, this._output = null;
  }
}
const Lu = class extends Fu {
  /**
   * @param context - The audio context.
   */
  constructor(i) {
    const t = i.audioContext, e = t.createBufferSource(), r = t.createGain(), s = t.createAnalyser();
    e.connect(s), s.connect(r), r.connect(i.destination), super(s, r), this.context = i, this.bufferSource = e, this.gain = r, this.analyser = s;
  }
  /**
   * Get the script processor node.
   * @readonly
   */
  get script() {
    return this._script || (this._script = this.context.audioContext.createScriptProcessor(Lu.BUFFER_SIZE), this._script.connect(this.context.destination)), this._script;
  }
  /** Cleans up. */
  destroy() {
    super.destroy(), this.bufferSource.disconnect(), this._script && this._script.disconnect(), this.gain.disconnect(), this.analyser.disconnect(), this.bufferSource = null, this._script = null, this.gain = null, this.analyser = null, this.context = null;
  }
  /**
   * Clones the bufferSource. Used just before playing a sound.
   * @returns {SourceClone} The clone AudioBufferSourceNode.
   */
  cloneBufferSource() {
    const i = this.bufferSource, t = this.context.audioContext.createBufferSource();
    t.buffer = i.buffer, Ao.setParamValue(t.playbackRate, i.playbackRate.value), t.loop = i.loop;
    const e = this.context.audioContext.createGain();
    return t.connect(e), e.connect(this.destination), { source: t, gain: e };
  }
  /**
   * Get buffer size of `ScriptProcessorNode`.
   * @readonly
   */
  get bufferSize() {
    return this.script.bufferSize;
  }
};
let zu = Lu;
zu.BUFFER_SIZE = 0;
class ky {
  /**
   * Re-initialize without constructing.
   * @param parent - - Instance of parent Sound container
   */
  init(t) {
    this.parent = t, this._nodes = new zu(this.context), this._source = this._nodes.bufferSource, this.source = t.options.source;
  }
  /** Destructor, safer to use `SoundLibrary.remove(alias)` to remove this sound. */
  destroy() {
    this.parent = null, this._nodes.destroy(), this._nodes = null;
    try {
      this._source.buffer = null;
    } catch (t) {
      console.warn("Failed to set AudioBufferSourceNode.buffer to null:", t);
    }
    this._source = null, this.source = null;
  }
  // Implement create
  create() {
    return new Py(this);
  }
  // Implement context
  get context() {
    return this.parent.context;
  }
  // Implement isPlayable
  get isPlayable() {
    return !!this._source && !!this._source.buffer;
  }
  // Implement filters
  get filters() {
    return this._nodes.filters;
  }
  set filters(t) {
    this._nodes.filters = t;
  }
  // Implements duration
  get duration() {
    return console.assert(this.isPlayable, "Sound not yet playable, no duration"), this._source.buffer.duration;
  }
  /** Gets and sets the buffer. */
  get buffer() {
    return this._source.buffer;
  }
  set buffer(t) {
    this._source.buffer = t;
  }
  /** Get the current chained nodes object */
  get nodes() {
    return this._nodes;
  }
  // Implements load
  load(t) {
    this.source ? this._decode(this.source, t) : this.parent.url ? this._loadUrl(t) : t ? t(new Error("sound.url or sound.source must be set")) : console.error("sound.url or sound.source must be set");
  }
  /** Loads a sound using XHMLHttpRequest object. */
  async _loadUrl(t) {
    const e = this.parent.url, r = await at.get().fetch(e);
    this._decode(await r.arrayBuffer(), t);
  }
  /**
   * Decodes the array buffer.
   * @param arrayBuffer - From load.
   * @param {Function} callback - Callback optional
   */
  _decode(t, e) {
    const r = (s, n) => {
      if (s)
        e && e(s);
      else {
        this.parent.isLoaded = !0, this.buffer = n;
        const o = this.parent.autoPlayStart();
        e && e(null, this.parent, o);
      }
    };
    t instanceof AudioBuffer ? r(null, t) : this.parent.context.decode(t, r);
  }
}
const Si = class {
  /**
   * Create a new sound instance from source.
   * @param source - Either the path or url to the source file.
   *        or the object of options to use.
   * @return Created sound instance.
   */
  static from(i) {
    let t = {};
    typeof i == "string" ? t.url = i : i instanceof ArrayBuffer || i instanceof AudioBuffer || i instanceof HTMLAudioElement ? t.source = i : Array.isArray(i) ? t.url = i : t = i, t = {
      autoPlay: !1,
      singleInstance: !1,
      url: null,
      source: null,
      preload: !1,
      volume: 1,
      speed: 1,
      complete: null,
      loaded: null,
      loop: !1,
      ...t
    }, Object.freeze(t);
    const e = Or().useLegacy ? new _y() : new ky();
    return new Si(e, t);
  }
  /**
   * Use `Sound.from`
   * @ignore
   */
  constructor(i, t) {
    this.media = i, this.options = t, this._instances = [], this._sprites = {}, this.media.init(this);
    const e = t.complete;
    this._autoPlayOptions = e ? { complete: e } : null, this.isLoaded = !1, this._preloadQueue = null, this.isPlaying = !1, this.autoPlay = t.autoPlay, this.singleInstance = t.singleInstance, this.preload = t.preload || this.autoPlay, this.url = Array.isArray(t.url) ? this.preferUrl(t.url) : t.url, this.speed = t.speed, this.volume = t.volume, this.loop = t.loop, t.sprites && this.addSprites(t.sprites), this.preload && this._preload(t.loaded);
  }
  /**
   * Internal help for resolving which file to use if there are multiple provide
   * this is especially helpful for working with bundlers (non Assets loading).
   */
  preferUrl(i) {
    const [t] = i.map((e) => ({ url: e, ext: Ct.extname(e).slice(1) })).filter(({ ext: e }) => An[e]).sort((e, r) => wn.indexOf(e.ext) - wn.indexOf(r.ext));
    if (!t)
      throw new Error("No supported file type found");
    return t.url;
  }
  /** Instance of the media context. */
  get context() {
    return Or().context;
  }
  /** Stops all the instances of this sound from playing. */
  pause() {
    return this.isPlaying = !1, this.paused = !0, this;
  }
  /** Resuming all the instances of this sound from playing */
  resume() {
    return this.isPlaying = this._instances.length > 0, this.paused = !1, this;
  }
  /** Stops all the instances of this sound from playing. */
  get paused() {
    return this._paused;
  }
  set paused(i) {
    this._paused = i, this.refreshPaused();
  }
  /** The playback rate. */
  get speed() {
    return this._speed;
  }
  set speed(i) {
    this._speed = i, this.refresh();
  }
  /** Set the filters. Only supported with WebAudio. */
  get filters() {
    return this.media.filters;
  }
  set filters(i) {
    this.media.filters = i;
  }
  /**
   * @ignore
   */
  addSprites(i, t) {
    if (typeof i == "object") {
      const r = {};
      for (const s in i)
        r[s] = this.addSprites(s, i[s]);
      return r;
    }
    console.assert(!this._sprites[i], `Alias ${i} is already taken`);
    const e = new wy(this, t);
    return this._sprites[i] = e, e;
  }
  /** Destructor, safer to use `SoundLibrary.remove(alias)` to remove this sound. */
  destroy() {
    this._removeInstances(), this.removeSprites(), this.media.destroy(), this.media = null, this._sprites = null, this._instances = null;
  }
  /**
   * Remove a sound sprite.
   * @param alias - The unique name of the sound sprite, if alias is omitted, removes all sprites.
   */
  removeSprites(i) {
    if (i) {
      const t = this._sprites[i];
      t !== void 0 && (t.destroy(), delete this._sprites[i]);
    } else
      for (const t in this._sprites)
        this.removeSprites(t);
    return this;
  }
  /** If the current sound is playable (loaded). */
  get isPlayable() {
    return this.isLoaded && this.media && this.media.isPlayable;
  }
  /** Stops all the instances of this sound from playing. */
  stop() {
    if (!this.isPlayable)
      return this.autoPlay = !1, this._autoPlayOptions = null, this;
    this.isPlaying = !1;
    for (let i = this._instances.length - 1; i >= 0; i--)
      this._instances[i].stop();
    return this;
  }
  // Overloaded function
  play(i, t) {
    let e;
    if (typeof i == "string" ? e = { sprite: i, loop: this.loop, complete: t } : typeof i == "function" ? (e = {}, e.complete = i) : e = i, e = {
      complete: null,
      loaded: null,
      sprite: null,
      end: null,
      start: 0,
      volume: 1,
      speed: 1,
      muted: !1,
      loop: !1,
      ...e || {}
    }, e.sprite) {
      const s = e.sprite;
      console.assert(!!this._sprites[s], `Alias ${s} is not available`);
      const n = this._sprites[s];
      e.start = n.start + (e.start || 0), e.end = n.end, e.speed = n.speed || 1, e.loop = n.loop || e.loop, delete e.sprite;
    }
    if (e.offset && (e.start = e.offset), !this.isLoaded)
      return this._preloadQueue ? new Promise((s) => {
        this._preloadQueue.push(() => {
          s(this.play(e));
        });
      }) : (this._preloadQueue = [], this.autoPlay = !0, this._autoPlayOptions = e, new Promise((s, n) => {
        this._preload((o, a, h) => {
          this._preloadQueue.forEach((c) => c()), this._preloadQueue = null, o ? n(o) : (e.loaded && e.loaded(o, a, h), s(h));
        });
      }));
    (this.singleInstance || e.singleInstance) && this._removeInstances();
    const r = this._createInstance();
    return this._instances.push(r), this.isPlaying = !0, r.once("end", () => {
      e.complete && e.complete(this), this._onComplete(r);
    }), r.once("stop", () => {
      this._onComplete(r);
    }), r.play(e), r;
  }
  /** Internal only, speed, loop, volume change occured. */
  refresh() {
    const i = this._instances.length;
    for (let t = 0; t < i; t++)
      this._instances[t].refresh();
  }
  /** Handle changes in paused state. Internal only. */
  refreshPaused() {
    const i = this._instances.length;
    for (let t = 0; t < i; t++)
      this._instances[t].refreshPaused();
  }
  /** Gets and sets the volume. */
  get volume() {
    return this._volume;
  }
  set volume(i) {
    this._volume = i, this.refresh();
  }
  /** Gets and sets the muted flag. */
  get muted() {
    return this._muted;
  }
  set muted(i) {
    this._muted = i, this.refresh();
  }
  /** Gets and sets the looping. */
  get loop() {
    return this._loop;
  }
  set loop(i) {
    this._loop = i, this.refresh();
  }
  /** Starts the preloading of sound. */
  _preload(i) {
    this.media.load(i);
  }
  /** Gets the list of instances that are currently being played of this sound. */
  get instances() {
    return this._instances;
  }
  /** Get the map of sprites. */
  get sprites() {
    return this._sprites;
  }
  /** Get the duration of the audio in seconds. */
  get duration() {
    return this.media.duration;
  }
  /** Auto play the first instance. */
  autoPlayStart() {
    let i;
    return this.autoPlay && (i = this.play(this._autoPlayOptions)), i;
  }
  /** Removes all instances. */
  _removeInstances() {
    for (let i = this._instances.length - 1; i >= 0; i--)
      this._poolInstance(this._instances[i]);
    this._instances.length = 0;
  }
  /**
   * Sound instance completed.
   * @param instance
   */
  _onComplete(i) {
    if (this._instances) {
      const t = this._instances.indexOf(i);
      t > -1 && this._instances.splice(t, 1), this.isPlaying = this._instances.length > 0;
    }
    this._poolInstance(i);
  }
  /** Create a new instance. */
  _createInstance() {
    if (Si._pool.length > 0) {
      const i = Si._pool.pop();
      return i.init(this.media), i;
    }
    return this.media.create();
  }
  /**
   * Destroy/recycling the instance object.
   * @param instance - Instance to recycle
   */
  _poolInstance(i) {
    i.destroy(), Si._pool.indexOf(i) < 0 && Si._pool.push(i);
  }
};
let Sn = Si;
Sn._pool = [];
class Fr extends Fu {
  constructor() {
    const t = window, e = new Fr.AudioContext(), r = e.createDynamicsCompressor(), s = e.createAnalyser();
    s.connect(r), r.connect(e.destination), super(s, r), this.autoPause = !0, this._ctx = e, this._offlineCtx = new Fr.OfflineAudioContext(
      1,
      2,
      t.OfflineAudioContext ? Math.max(8e3, Math.min(96e3, e.sampleRate)) : 44100
    ), this.compressor = r, this.analyser = s, this.events = new Bt(), this.volume = 1, this.speed = 1, this.muted = !1, this.paused = !1, this._locked = e.state === "suspended" && ("ontouchstart" in globalThis || "onclick" in globalThis), this._locked && (this._unlock(), this._unlock = this._unlock.bind(this), document.addEventListener("mousedown", this._unlock, !0), document.addEventListener("touchstart", this._unlock, !0), document.addEventListener("touchend", this._unlock, !0)), this.onFocus = this.onFocus.bind(this), this.onBlur = this.onBlur.bind(this), globalThis.addEventListener("focus", this.onFocus), globalThis.addEventListener("blur", this.onBlur);
  }
  /** Handle mobile WebAudio context resume */
  onFocus() {
    if (!this.autoPause)
      return;
    const t = this._ctx.state;
    (t === "suspended" || t === "interrupted" || !this._locked) && (this.paused = this._pausedOnBlur, this.refreshPaused());
  }
  /** Handle mobile WebAudio context suspend */
  onBlur() {
    this.autoPause && (this._locked || (this._pausedOnBlur = this._paused, this.paused = !0, this.refreshPaused()));
  }
  /**
   * Try to unlock audio on iOS. This is triggered from either WebAudio plugin setup (which will work if inside of
   * a `mousedown` or `touchend` event stack), or the first document touchend/mousedown event. If it fails (touchend
   * will fail if the user presses for too long, indicating a scroll event instead of a click event.
   *
   * Note that earlier versions of iOS supported `touchstart` for this, but iOS9 removed this functionality. Adding
   * a `touchstart` event to support older platforms may preclude a `mousedown` even from getting fired on iOS9, so we
   * stick with `mousedown` and `touchend`.
   */
  _unlock() {
    this._locked && (this.playEmptySound(), this._ctx.state === "running" && (document.removeEventListener("mousedown", this._unlock, !0), document.removeEventListener("touchend", this._unlock, !0), document.removeEventListener("touchstart", this._unlock, !0), this._locked = !1));
  }
  /**
   * Plays an empty sound in the web audio context.  This is used to enable web audio on iOS devices, as they
   * require the first sound to be played inside of a user initiated event (touch/click).
   */
  playEmptySound() {
    const t = this._ctx.createBufferSource();
    t.buffer = this._ctx.createBuffer(1, 1, 22050), t.connect(this._ctx.destination), t.start(0, 0, 0), t.context.state === "suspended" && t.context.resume();
  }
  /**
   * Get AudioContext class, if not supported returns `null`
   * @type {AudioContext}
   * @readonly
   */
  static get AudioContext() {
    const t = window;
    return t.AudioContext || t.webkitAudioContext || null;
  }
  /**
   * Get OfflineAudioContext class, if not supported returns `null`
   * @type {OfflineAudioContext}
   * @readonly
   */
  static get OfflineAudioContext() {
    const t = window;
    return t.OfflineAudioContext || t.webkitOfflineAudioContext || null;
  }
  /** Destroy this context. */
  destroy() {
    super.destroy();
    const t = this._ctx;
    typeof t.close < "u" && t.close(), globalThis.removeEventListener("focus", this.onFocus), globalThis.removeEventListener("blur", this.onBlur), this.events.removeAllListeners(), this.analyser.disconnect(), this.compressor.disconnect(), this.analyser = null, this.compressor = null, this.events = null, this._offlineCtx = null, this._ctx = null;
  }
  /**
   * The WebAudio API AudioContext object.
   * @readonly
   * @type {AudioContext}
   */
  get audioContext() {
    return this._ctx;
  }
  /**
   * The WebAudio API OfflineAudioContext object.
   * @readonly
   * @type {OfflineAudioContext}
   */
  get offlineContext() {
    return this._offlineCtx;
  }
  /**
   * Pauses all sounds, even though we handle this at the instance
   * level, we'll also pause the audioContext so that the
   * time used to compute progress isn't messed up.
   * @default false
   */
  set paused(t) {
    t && this._ctx.state === "running" ? this._ctx.suspend() : !t && this._ctx.state === "suspended" && this._ctx.resume(), this._paused = t;
  }
  get paused() {
    return this._paused;
  }
  /** Emit event when muted, volume or speed changes */
  refresh() {
    this.events.emit("refresh");
  }
  /** Emit event when muted, volume or speed changes */
  refreshPaused() {
    this.events.emit("refreshPaused");
  }
  /**
   * Toggles the muted state.
   * @return The current muted state.
   */
  toggleMute() {
    return this.muted = !this.muted, this.refresh(), this.muted;
  }
  /**
   * Toggles the paused state.
   * @return The current muted state.
   */
  togglePause() {
    return this.paused = !this.paused, this.refreshPaused(), this._paused;
  }
  /**
   * Decode the audio data
   * @param arrayBuffer - Buffer from loader
   * @param callback - When completed, error and audioBuffer are parameters.
   */
  decode(t, e) {
    const r = (n) => {
      e(new Error((n == null ? void 0 : n.message) || "Unable to decode file"));
    }, s = this._offlineCtx.decodeAudioData(
      t,
      (n) => {
        e(null, n);
      },
      r
    );
    s && s.catch(r);
  }
}
class My {
  constructor() {
    this.init();
  }
  /**
   * Re-initialize the sound library, this will
   * recreate the AudioContext. If there's a hardware-failure
   * call `close` and then `init`.
   * @return Sound instance
   */
  init() {
    return this.supported && (this._webAudioContext = new Fr()), this._htmlAudioContext = new vy(), this._sounds = {}, this.useLegacy = !this.supported, this;
  }
  /**
   * The global context to use.
   * @readonly
   */
  get context() {
    return this._context;
  }
  /**
   * Apply filters to all sounds. Can be useful
   * for setting global planning or global effects.
   * **Only supported with WebAudio.**
   * @example
   * import { sound, filters } from '@pixi/sound';
   * // Adds a filter to pan all output left
   * sound.filtersAll = [
   *     new filters.StereoFilter(-1)
   * ];
   */
  get filtersAll() {
    return this.useLegacy ? [] : this._context.filters;
  }
  set filtersAll(t) {
    this.useLegacy || (this._context.filters = t);
  }
  /**
   * `true` if WebAudio is supported on the current browser.
   */
  get supported() {
    return Fr.AudioContext !== null;
  }
  /**
   * @ignore
   */
  add(t, e) {
    if (typeof t == "object") {
      const n = {};
      for (const o in t) {
        const a = this._getOptions(
          t[o],
          e
        );
        n[o] = this.add(o, a);
      }
      return n;
    }
    if (console.assert(!this._sounds[t], `Sound with alias ${t} already exists.`), e instanceof Sn)
      return this._sounds[t] = e, e;
    const r = this._getOptions(e), s = Sn.from(r);
    return this._sounds[t] = s, s;
  }
  /**
   * Internal methods for getting the options object
   * @private
   * @param source - The source options
   * @param overrides - Override default options
   * @return The construction options
   */
  _getOptions(t, e) {
    let r;
    return typeof t == "string" ? r = { url: t } : Array.isArray(t) ? r = { url: t } : t instanceof ArrayBuffer || t instanceof AudioBuffer || t instanceof HTMLAudioElement ? r = { source: t } : r = t, r = { ...r, ...e || {} }, r;
  }
  /**
   * Do not use WebAudio, force the use of legacy. This **must** be called before loading any files.
   */
  get useLegacy() {
    return this._useLegacy;
  }
  set useLegacy(t) {
    this._useLegacy = t, this._context = !t && this.supported ? this._webAudioContext : this._htmlAudioContext;
  }
  /**
   * This disables auto-pause all playback when the window blurs (WebAudio only).
   * This is helpful to keep from playing sounds when the user switches tabs.
   * However, if you're running content within an iframe, this may be undesirable
   * and you should disable (set to `true`) this behavior.
   * @default false
   */
  get disableAutoPause() {
    return !this._webAudioContext.autoPause;
  }
  set disableAutoPause(t) {
    this._webAudioContext.autoPause = !t;
  }
  /**
   * Removes a sound by alias.
   * @param alias - The sound alias reference.
   * @return Instance for chaining.
   */
  remove(t) {
    return this.exists(t, !0), this._sounds[t].destroy(), delete this._sounds[t], this;
  }
  /**
   * Set the global volume for all sounds. To set per-sound volume see {@link SoundLibrary#volume}.
   */
  get volumeAll() {
    return this._context.volume;
  }
  set volumeAll(t) {
    this._context.volume = t, this._context.refresh();
  }
  /**
   * Set the global speed for all sounds. To set per-sound speed see {@link SoundLibrary#speed}.
   */
  get speedAll() {
    return this._context.speed;
  }
  set speedAll(t) {
    this._context.speed = t, this._context.refresh();
  }
  /**
   * Toggle paused property for all sounds.
   * @return `true` if all sounds are paused.
   */
  togglePauseAll() {
    return this._context.togglePause();
  }
  /**
   * Pauses any playing sounds.
   * @return Instance for chaining.
   */
  pauseAll() {
    return this._context.paused = !0, this._context.refreshPaused(), this;
  }
  /**
   * Resumes any sounds.
   * @return Instance for chaining.
   */
  resumeAll() {
    return this._context.paused = !1, this._context.refreshPaused(), this;
  }
  /**
   * Toggle muted property for all sounds.
   * @return `true` if all sounds are muted.
   */
  toggleMuteAll() {
    return this._context.toggleMute();
  }
  /**
   * Mutes all playing sounds.
   * @return Instance for chaining.
   */
  muteAll() {
    return this._context.muted = !0, this._context.refresh(), this;
  }
  /**
   * Unmutes all playing sounds.
   * @return Instance for chaining.
   */
  unmuteAll() {
    return this._context.muted = !1, this._context.refresh(), this;
  }
  /**
   * Stops and removes all sounds. They cannot be used after this.
   * @return Instance for chaining.
   */
  removeAll() {
    for (const t in this._sounds)
      this._sounds[t].destroy(), delete this._sounds[t];
    return this;
  }
  /**
   * Stops all sounds.
   * @return Instance for chaining.
   */
  stopAll() {
    for (const t in this._sounds)
      this._sounds[t].stop();
    return this;
  }
  /**
   * Checks if a sound by alias exists.
   * @param alias - Check for alias.
   * @param assert - Whether enable console.assert.
   * @return true if the sound exists.
   */
  exists(t, e = !1) {
    const r = !!this._sounds[t];
    return e && console.assert(r, `No sound matching alias '${t}'.`), r;
  }
  /**
   * Convenience function to check to see if any sound is playing.
   * @returns `true` if any sound is currently playing.
   */
  isPlaying() {
    for (const t in this._sounds)
      if (this._sounds[t].isPlaying)
        return !0;
    return !1;
  }
  /**
   * Find a sound by alias.
   * @param alias - The sound alias reference.
   * @return Sound object.
   */
  find(t) {
    return this.exists(t, !0), this._sounds[t];
  }
  /**
   * Plays a sound.
   * @method play
   * @instance
   * @param {string} alias - The sound alias reference.
   * @param {string} sprite - The alias of the sprite to play.
   * @return {IMediaInstance|null} The sound instance, this cannot be reused
   *         after it is done playing. Returns `null` if the sound has not yet loaded.
   */
  /**
   * Plays a sound.
   * @param alias - The sound alias reference.
   * @param {PlayOptions|Function} options - The options or callback when done.
   * @return The sound instance,
   *        this cannot be reused after it is done playing. Returns a Promise if the sound
   *        has not yet loaded.
   */
  play(t, e) {
    return this.find(t).play(e);
  }
  /**
   * Stops a sound.
   * @param alias - The sound alias reference.
   * @return Sound object.
   */
  stop(t) {
    return this.find(t).stop();
  }
  /**
   * Pauses a sound.
   * @param alias - The sound alias reference.
   * @return Sound object.
   */
  pause(t) {
    return this.find(t).pause();
  }
  /**
   * Resumes a sound.
   * @param alias - The sound alias reference.
   * @return Instance for chaining.
   */
  resume(t) {
    return this.find(t).resume();
  }
  /**
   * Get or set the volume for a sound.
   * @param alias - The sound alias reference.
   * @param volume - Optional current volume to set.
   * @return The current volume.
   */
  volume(t, e) {
    const r = this.find(t);
    return e !== void 0 && (r.volume = e), r.volume;
  }
  /**
   * Get or set the speed for a sound.
   * @param alias - The sound alias reference.
   * @param speed - Optional current speed to set.
   * @return The current speed.
   */
  speed(t, e) {
    const r = this.find(t);
    return e !== void 0 && (r.speed = e), r.speed;
  }
  /**
   * Get the length of a sound in seconds.
   * @param alias - The sound alias reference.
   * @return The current duration in seconds.
   */
  duration(t) {
    return this.find(t).duration;
  }
  /**
   * Closes the sound library. This will release/destroy
   * the AudioContext(s). Can be used safely if you want to
   * initialize the sound library later. Use `init` method.
   */
  close() {
    return this.removeAll(), this._sounds = null, this._webAudioContext && (this._webAudioContext.destroy(), this._webAudioContext = null), this._htmlAudioContext && (this._htmlAudioContext.destroy(), this._htmlAudioContext = null), this._context = null, this;
  }
}
const Yh = (i) => {
  var t;
  const e = i.src;
  let r = (t = i == null ? void 0 : i.alias) == null ? void 0 : t[0];
  return (!r || i.src === r) && (r = Ct.basename(e, Ct.extname(e))), r;
}, Ty = {
  extension: D.Asset,
  detection: {
    test: async () => !0,
    add: async (i) => [...i, ...wn.filter((t) => An[t])],
    remove: async (i) => i.filter((t) => i.includes(t))
  },
  loader: {
    name: "sound",
    extension: {
      type: [D.LoadParser],
      priority: Fe.High
    },
    /** Should we attempt to load this file? */
    test(i) {
      const t = Ct.extname(i).slice(1);
      return !!An[t] || Ay.some((e) => i.startsWith(`data:${e}`));
    },
    /** Load the sound file, this is mostly handled by Sound.from() */
    async load(i, t) {
      const e = await new Promise((r, s) => Sn.from({
        ...t.data,
        url: i,
        preload: !0,
        loaded(n, o) {
          var a, h;
          n ? s(n) : r(o), (h = (a = t.data) == null ? void 0 : a.loaded) == null || h.call(a, n, o);
        }
      }));
      return Or().add(Yh(t), e), e;
    },
    /** Remove the sound from the library */
    async unload(i, t) {
      Or().remove(Yh(t));
    }
  }
};
Mt.add(Ty);
xy(new My());
class Ey extends Ki {
  constructor() {
    super("Pause"), this.visible = !1, this.zIndex = 1e3;
  }
  async init() {
    this.addComponent(
      new ce({
        label: "overlay",
        resource: {
          fillColor: L.pauseScene.overlayColor,
          rectangle: {
            x: 0,
            y: 0,
            width: L.screen.width,
            height: L.screen.width
          }
        },
        alpha: L.pauseScene.overlayAlpha
      })
    ), this.addComponent(
      new Kt({
        label: "title",
        text: L.pauseScene.title,
        fontFamily: L.pauseScene.fontFamily,
        fontSize: L.pauseScene.titleFontSize,
        textColor: L.pauseScene.textColor,
        anchor: { x: 0.5, y: 0.5 },
        horizontalAlignment: "center",
        verticalAlignment: "center",
        margin: { x: 0, y: -50 }
      })
    ), this.addComponent(
      new Kt({
        label: "subtitle",
        text: L.pauseScene.subTitle,
        fontFamily: L.pauseScene.fontFamily,
        fontSize: L.pauseScene.subTitleFontSize,
        textColor: L.pauseScene.textColor,
        anchor: { x: 0.5, y: 0.5 },
        horizontalAlignment: "center",
        verticalAlignment: "center",
        margin: { x: 0, y: 50 }
      })
    );
  }
}
let Rt, dr = !1, br;
const Du = () => L.screen.width * 1 / L.screen.aspectRatio, Xh = () => {
  const { width: i, height: t, orientation: e } = yy(
    L.gameContainer,
    Rt.canvas,
    L.screen.width,
    Du()
  );
  (i !== V.screen.width || t !== V.screen.height) && (V.screen.width = i, V.screen.height = t, Rt.renderer.resize(i, t), Lt(L.signals.onResize));
  const r = V.screen.orientation !== e;
  V.screen.orientation = e, r && Lt(L.signals.onOrientationChange);
}, By = () => {
  const { start: i } = ha(
    () => {
      Xh();
    },
    () => {
    },
    100
  );
  new ResizeObserver(() => {
    i();
  }).observe(L.gameContainer), Xh();
}, Ry = () => {
  let i = 0, t = 0, e = 0;
  L.debug && setInterval(() => {
    console.log(
      t === 0 ? 0 : Math.floor(e / t)
    ), t = 0, e = 0;
  }, 1e3), Rt.ticker.maxFPS = L.maxFPS, Rt.ticker.add((r) => {
    if (L.debug && (e += Math.floor(r.FPS), t++), !dr)
      for (i += r.deltaMS; i >= L.tickIntervalMillis; )
        Lt(L.signals.onTick), qi.updateEngine(L.tickIntervalMillis), N0(L.tickIntervalMillis), i -= L.tickIntervalMillis;
  });
}, Iy = () => {
  let i = !1;
  const { start: t, cancel: e } = ha(
    () => {
      Rt.stage.eventMode = "passive";
    },
    () => {
    },
    100,
    0
  ), r = () => {
    dr && (dr = !1, br.visible = !1, Q0(), t());
  }, s = () => {
    dr || !i || (dr = !0, br.visible = !0, Rt.stage.eventMode = "none", K0(), e());
  };
  window.addEventListener(
    "focus",
    () => {
      i = !0;
    },
    { once: !0 }
  ), document.addEventListener("click", () => {
    i = !0, r();
  }), window.addEventListener("blur", () => {
    s();
  }), document.addEventListener("visibilitychange", () => {
    document.hidden && s();
  });
}, pr = async (i) => {
  V.scene && (V.scene.destroy(), Rt.stage.removeChild(V.scene.object)), V.scene = i, Rt.stage.addChild(V.scene.object), await i.init();
}, Oy = async () => {
  L.gameContainer.style.backgroundColor = L.colors.backgroundColor, Rt = new jl(), await Rt.init({
    backgroundColor: L.colors.backgroundColor,
    width: L.screen.width,
    height: Du()
  }), L.debug && (globalThis.__PIXI_APP__ = Rt), L.gameContainer.appendChild(Rt.canvas), Rt.canvas.style.position = "absolute", J0(Rt.renderer), br = new Ey(), await br.init(), Rt.stage.addChild(br.object), pr(new gy()), By(), j0(), qi.initEngine(), Ry(), Iy(), await Promise.all([
    new Promise(
      (i) => setTimeout(i, L.loadingScene.keepAliveTimeMS)
    ),
    (async () => {
      await xe.init({
        basePath: L.assets.basePath,
        manifest: L.assets.manifest
      }), xe.addBundle("extra", L.assets.extra), await Promise.all([
        xe.loadBundle("default"),
        xe.loadBundle("extra")
      ]), Y0();
    })()
  ]), Lt(L.signals.destroyLoadingScene);
}, ze = (i, t) => Math.floor(Math.random() * (t - i) + i), N = {
  sounds: {
    mainLoop: "main-loop",
    menuLoop: "menu-loop",
    gameOver: "game-over",
    coin: "coin",
    playerHit: "player-hit"
  },
  signals: {
    goToIntro: "goToIntro",
    goToGame: "goToGame",
    chooseCharacter: "chooseCharacter",
    loseLifePoints: "loseLifePoints",
    gameOver: "gameOver",
    moveScreen: "moveScreen",
    updateScore: "updateScore"
  },
  lifePoints: 3,
  creditsUrl: ""
};
class Fy extends Kt {
  constructor() {
    super({
      label: "cta",
      text: "Click to play",
      fontFamily: "PressStart2P",
      fontSize: 24,
      textColor: 13421772,
      anchor: { x: 0.5, y: 0.5 },
      alpha: 0,
      horizontalAlignment: "center",
      verticalAlignment: "center",
      animations: [
        {
          from: { alpha: 0 },
          to: { alpha: 1 },
          duration: 0.5,
          repeat: -1,
          revert: !0,
          delay: 1.5
        }
      ]
    });
  }
}
class Ly extends Kt {
  constructor() {
    super({
      label: "logo",
      text: "COUPLES RUN",
      textColor: 16763904,
      fontSize: 128,
      fontFamily: "Lobster",
      anchor: { x: 0.5, y: 0 },
      position: { x: 0, y: 50 },
      strokeColor: 16711680,
      strokeWidth: 7,
      alpha: 0,
      horizontalAlignment: "center",
      landscape: {
        fontSize: 128
      },
      portrait: {
        fontSize: 86
      },
      animations: [
        {
          duration: 1,
          from: { alpha: 0, y: 0 },
          to: { alpha: 1, y: 50 },
          ease: "back.out(2)"
        }
      ]
    });
  }
  _onOrientationChange() {
    this.finishAnimations();
  }
}
const zy = 8, Dy = 5;
class Uy extends ce {
  constructor() {
    super({
      label: "moving-boy",
      resource: "boy/run/boy-run-1.png",
      anchor: { x: 0, y: 1 },
      position: { x: 130, y: 0 },
      scale: 2,
      verticalAlignment: "bottom",
      margin: { x: 0, y: -55 }
    });
    $(this, "_runSprite", 0);
    $(this, "_moveFrame", 0);
  }
  _onTick() {
    this._moveFrame++, this._moveFrame % Dy === 0 && (this._moveFrame = 0, this._runSprite = (this._runSprite + 1) % zy, this.texture = `boy/run/boy-run-${this._runSprite + 1}.png`);
  }
}
const Gy = 8, Vy = 5;
class Hy extends ce {
  constructor() {
    super({
      label: "moving-girl",
      resource: "girl/run/girl-run-1.png",
      anchor: { x: 0, y: 1 },
      position: { x: 200, y: 0 },
      scale: 2,
      verticalAlignment: "bottom",
      margin: { x: 0, y: -55 }
    });
    $(this, "_runSprite", 0);
    $(this, "_moveFrame", 0);
  }
  _onTick() {
    this._moveFrame++, this._moveFrame % Vy === 0 && (this._moveFrame = 0, this._runSprite = (this._runSprite + 1) % Gy, this.texture = `girl/run/girl-run-${this._runSprite + 1}.png`);
  }
}
const jy = 2;
class Ny extends Le {
  constructor() {
    super({
      label: "moving-platform",
      components: [
        new Ir({
          label: "moving-platform-top",
          resource: "platform-top.png",
          onTick: (t) => (t.tilePosition.x--, 1)
        }),
        new Ir({
          label: "moving-platform-middle",
          resource: "platform-middle.png",
          onTick: (t) => {
            t.tilePosition.x--;
          }
        })
      ]
    }), this._onResize();
  }
  _onResize() {
    const t = this.getComponent(
      "moving-platform-top"
    ), e = this.getComponent(
      "moving-platform-middle"
    );
    e.width = V.screen.width, e.height = e.originalHeight * jy, e.position.y = V.screen.height - e.height, t.width = V.screen.width, t.position.y = V.screen.height - e.height - t.height;
  }
}
class Wy extends $0 {
  constructor() {
    super({
      label: "credits-button",
      url: N.creditsUrl,
      resource: "credits-button.png",
      hoverResource: "credits-button-hover.png",
      disabledResource: "credits-button.png",
      interactive: !0,
      cursor: "pointer",
      position: { x: 155, y: 24 },
      alpha: 0,
      anchor: 0.5,
      scale: 0,
      animations: [
        {
          from: { alpha: 0, scaleX: 0, scaleY: 0 },
          to: { alpha: 1, scaleX: 1, scaleY: 1 },
          duration: 0.5,
          delay: 1.7
        }
      ]
    });
  }
}
class Yy extends ty {
  constructor() {
    super({
      label: "volume-button",
      resource: "volume-on.png",
      hoverResource: "volume-on-hover.png",
      disabledResource: "volume-on.png",
      mutedResource: "volume-off.png",
      mutedHoverResource: "volume-off-hover.png",
      mutedDisabledResource: "volume-off.png",
      interactive: !0,
      cursor: "pointer",
      alpha: 0,
      position: { x: 24, y: 24 },
      scale: 0,
      anchor: 0.5,
      animations: [
        {
          from: { alpha: 0, scaleX: 0, scaleY: 0 },
          to: { alpha: 1, scaleX: 1, scaleY: 1 },
          duration: 0.5,
          delay: 1.5
        }
      ]
    });
  }
}
class Xy extends Le {
  constructor() {
    super({
      label: "settings",
      horizontalAlignment: "center",
      verticalAlignment: "bottom",
      width: 230,
      height: 48,
      margin: { x: 0, y: -200 },
      components: [new Yy(), new Wy()]
    });
  }
}
class qy extends Ki {
  constructor() {
    super(...arguments);
    $(this, "_canContinue", !1);
  }
  async init() {
    this.interactive = !0, this.addComponent(
      new Ru({
        label: "city-bg",
        resource: "city-bg.png"
      })
    ), this.addComponent(new Ny()), this.addComponent(new Hy()), this.addComponent(new Uy()), this.addComponent(new Ly()), this.addComponent(new Fy()), this.addComponent(new Xy()), na(N.sounds.mainLoop, {
      loop: !0,
      toVolume: 0.3,
      fadeDuration: 0.5
    }), this.delay(2).then(() => {
      this._canContinue = !0;
    });
  }
  async _onClick() {
    this._canContinue && (this.interactive = !1, await Promise.all([
      yi(L.sounds.click),
      sa(N.sounds.mainLoop, { fadeDuration: 2 }),
      this.animate({
        from: { alpha: 1 },
        to: { alpha: 0 },
        duration: 2
      })
    ]), Lt(N.signals.goToIntro));
  }
}
const Ky = "data:font/woff2;base64,d09GMgABAAAAAIRoABEAAAABkwgAAIQFAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGiwbiRYcjV4GYACFFAiBRgmabREICoXHdIT/XguFHgABNgIkA4o4BCAFhDwHi1MMgTxbKWtxgG3TGubdDkBctrpsONi28EF38Ff0BRCw6EDtdqAI1N2fZf//JyYTOewS/bsm2hpg27xPqdJGRsXM1jNH9qW11l7z2hBmi33BSIQZqFHp1GOsuSNRo4bOa8zTOxto98XQefm0o5rLjftPbGVOrNisIDpvOcSiSZ9T2Giqx8lH4G1Dbufkm1M76AmHcMnwy8sR+JGt+spZQTPM7xeXl8WeFNPS9H+bGvI6XaIXv7HQtnkGrYo9RffDO013HjkPg47KrwLKsTk1kpVuPfke4LbuNjYiRSysiY2NjdiNn2Wh8lHVfDRvFhbkQY4WyRkF8CPyK8///37/m2ufW39GtGSaxzeIeCNBpkJkEE1KIBMyzbtHr6wBWJspcNDHcRHNVcF1cNQRR6V0iQiYKGAkThGzZ/XCZbn5E7ehv+kCC//5Nv/ftdFcAgQLEYJYIE6c+Ln6JDWxyaD9s1Hr0z8s/89zsvv+gKMMh51sYNNAOQu4nzWNHtCUyaQIqNFojMJ7IGpK00xmi78djocts58x4KZJZ15Egjvsf+pKKwCk5is/uJYdoAOHtHQIUlC69W2ZSXnpUmbUVU9HkK393oD3lxThM6a6Quc1O93OTwH4VGwydwpQniRVfaz5QQHBgm3+NUiETCoSiphMmQkztXK5hN7VUTIXSs4o9iNR6K/AeBAKYUB4lENKfCUAc5Y7tswyZxmdI3xd4VV1yc0agtg0V4e5rzIfYsGCKURUy1WPye5JEmRQv2Ai/UZeIEwuDkAyPde8eUr9/7n1hi7v+9oSmP/hm/sLL39CxVfdi65h1wM+44h4YGDEM+SFVHylq2576vc2tcs8hMYfxUi4VsQmuLSW09aufyZ/7p6Ibb6q6aH+IcZEdHHNEpvaIUJ3FUK8cIDc3/n//03L33sfuPeWPARGNaFacoNC3J4KgUOa0oC78pU4ee9Tqx7YVzXLEqiyqjQygaYndl4LSG0CrX3X2zLqgOKv0JEP5Wb/hgoVRKyyQg08NjGDYNW0vmqnf7h8BoMxuTY8/y37Zd+t1z2R1B8ZQhBukCEJiVBopruH+jU1RYpxgmmJ/AeHQ6KSI2+2WciVqFVujeSvtVf7dj/LOAAUOsJF6BhzENi3d5m5TfHul2DvlwJETpRsZw7K7AKqoKqiqlhoV9X/v9dZbe8TYAt31xlcrumhPInOVEfcYS8ExtWzSsuQtpN36L379aT/v77gSwJbwqGEcQCcJJwwdulHC+kjwMY4VeqUbVd29emmoE1Vge0KVJqQs90xhNW4d7WcbUibZW+nZzWL7Sx22zm9nPFlPzEfJODEVcu1aBUwcmv837Kf9hfsGMtrKUaKGDFa2uOt+Xdz8Od6aqIwldHdva/XKalSWiAdAhK9/b2T1N7/ia4HFLwKSUjW3f/+mp9o0HewvplvoTskuUoVFGQNJDupM4s5reUBfXfHMYTBTgokx9I8gADsvr8AAgQi6mgRiUkMRCDYsIFRR4eEAHiybECeOZehhaD7zzAduHzCiHKQYQEAk4kRKJxoQ8TCdoB30bg3rg8rh6R2mu8VIaZSWrZc2E0ACKShlJyH6FtCVDLiYItRBOgBQByom25QFAGaNzcMORkR7KZFA3Zo1sKWtwf2dpWwe6P7J+Y0GsAFcIoj7GPHxU0IyNEZADpWEjt2WP5uxIIdrg0IoAuEicGCWlDHAcHlgABtZv75A5rtPLLBBnHLaqAQyH9pJeQCwKHWc8ebZ/2mRarXbD1EdU4R3XgCJxB1dFhBzlziATuBc8tmiro5Cw+BwU4P4o213XRDY5Q3GdWlWf75r1JVBuCZfyifTdok5Uz/vyEcZf7Lo2xJeWJi6btzlhhHS41A+ugngCbNeDp0EKB97G++9JyvbeNbG/neF/xsG1wf28EnEp+5MKB86TO+Eglon7uRHwjUdryIUFUUxkSM5yzKEAmvUlOFuNLOClkVddHMT04oOMiEX8G1psSmSuZcME5MUO1P4VbaVunPSl9X+nNbf6PaX5+mNXWt5k7V0ZVmRZRaryKFqmLjgAR7J9BJG3yoYZbajhKCADQsUPjVdiZGBJghQAxVlNJFitV5oeb+E/sa0/Cg4MGGgxA2PDGvYieN8CAQR7xdrayb7QgRvMOUJhJQHR5U2x7Xt5G5JpC4T5rH619FCAdACAsL+Jg5eQFtvCCZ3wJSgVu5FzkQ2+A5AX3yUiID5Wesdsvqd+ZZea+PpxhIuBrZIddcuuERlKYGhxk5JtaQTcKGY0OamDWHhhQRK/YNWYQs2Y0kCViwDYSt+WStecx/plxSTnevTA+dy0G6n/fGWoXmjfbmC/uDccbIQB38VIO+0xf6aME7ABBXOcpWntLwR7JgAAf+GKKIt9pty9YvxmSFhmsOTV/qJQsTPrNWIsPbz9Iv+IZWrLib4KQvRB6thrHvJ5EYCpNNMdU0080w0yyzzTHXPPMtsNAiiy2x1DLLrbDSKk8989wLL73y2htvvTN9kEa1vda5NKxf5CEBPXy9DOdF6uAk9XJJQQ4Z6eehvvoHUYgJ7w1B+JlESeyCVGY/H2WuH9bqZaIsDxk8e0E8/8ziReppbNG6uR4F/6ZcH33Z60/P0TCr+FnvHW3pybQCUogWI0WaDJny5NPqoqdeWvf3N8Agg+nt/zHcCOOMt95G2+x30CHHXHLNw3r8xiaGbLwB5W2M+ZqS5CQk1ICzCCp9d8oSk+j0kMIXSUaE4wnCJI8RxnmEoEMQoD084kE8xt9H6b0c9G7jHb2ttz7F4sCSBM/Nlru2TdO7gTw4yfX2+XEobpIFrUkJXNVL7qI6nOQKMr6c+iUXwiRber54zrqeLZ450tONp/SkOWE50ON6jJ5be0n1qB7xh9n5Z0J6RfrpJkeKGGpBfHlQsHOgNe9+hOH2JcMcWravgwja0j+Vay9SX5PsWSfj7HbaI7vQsvNirmFlwvi+ZXit48UdLuj24jbQrWGLU2rJxsN6m1k0myxWN5j12Z11MVqyFE8cypXXNF2tUAFh/N0QK/L7JiiHDlUYLsO6UeonLYtpoedLUViCKDFEdFiXaK31+c4i945b1qiW1Tru1WYs2Qg0FmSD727JijcyJHy0Bx+POnlZggLEvekGIB3GxWtUcQEAZSKEWQGmnPrOiYUrQPEgZ0sDyB/5C/BJf/2/YwTAhCEJ1neXIeFM1kyRNMFWsgssv3V+wk1iwmVS58LcmnfzYSHJIrmk83EZI2ccGAXjxgQyaiaBRtABXimkCguTCTTPyvCntuVr/XP+rkAuknN3c8aasfv2VEz4nzH2bwAOAgCTCwDQeVudWklUgc4jAcN/YHhneP6FNnwy7N9YNho2Ej5PnztAAABhALQ+AHyadSbNeL9rAn5rSK0BaI9duOFlMXKRB3Vx0hwhdISEphDoHlroOuODRUBIXJ8JK9ZfLfxSMpw4c+HGl78AKoGChFOLoBFVBNSHg6EJw2TPxUBakqsJoot1yr03McbYUPr/HpsUhcEJR8+gtEUefDAhRBZBLAnwPmJUBoiq2BIUJqP/iY9X+BqS4J8PkahRrZYJFoXGw8bFJ2JBypyMA1t27Em4UnLnwZtnFF7CBAsRKpKfoeLFiJUoToIkqXJkypKthy666ibdQEUGG6JEYS6KjTbCSKNMUGYiH6XaqTAIvVCJm1B1XQ9EW9jZJPiFZ05yiX859tSrl7S19Nts0yv/N7JTe1RlQmWDObR3Zqcz1z6b2NXgI2cCvunYy/Bn730h5mS6R4EpAV+1bUc0vgt9dhzS/ovFRqJ0vk/xqxYch72GqmSHHq9IpYBvAs/cWgdl8KYACSLfL8AJ1YRPNQj2y3opmmj32pC8VeDZzX21ipWM3yB8YebjYebkG60v1s5RQp4MNUrVEVNytOIVCj7tRX2Kn4R3UNCfeCTnypbuYGd5Nz1agmMo6AFfssAdCsKCVDToH4yHXSPrKT13RZU5VwcHcn01Br5gV7e9AC/UJggcaoKIGQvRGEjGSKUcKCkgCCtWVCcxMyTV3DMlXW15GGLSnAS/UYnDoDh/9N+FS9XJHIKdtX5Ghjln2SlHYPMW5GRJtNtWabIokJGvg+MVJCarE0yAlQFc1mc8NIchbhpHFspnXxW9XUFlaXVwmHewz7eiezVkXW4otE1D1RQ8zK05UzFgk+PYnSCwp3ZMA9Xs9sCrASUcl2AMDQLPHFqX30wzrUBWQLBgA1StMN7rzVreWyVZuYaiUZokLufxE0GzArqAEnI0jKVVP2WMcdBj5EtEH1igJQSjPHaddgV1iGlAC57iDwgtY7iAoccXbBKOLfcA2onXCph6fNaOz58QUjURu7qlE4zmIjO2caDUoOVcYTIcm6T1iD4KNGICzz1PJdcfApv4CWV5Ut8oftK5N6UKOHXVB9JBQ7dWlBqZp5oWU3mPTMCaWyAA13XSut9j66+WPml7wcJgQ22oxqBpICaGPCjdsq4JtLOtiT9I1qkJ/pbL+66AoxPsvEBbJ1qDSznoUB66VIAeFaFPJfCoDAPaAJ8+HBtp5jwQUjK+YJlKUHhzKPXq8ZmcshudGyflYXR5rQOdoTvXCAmIIGKIBCKFyCByiCFEAVFCKqenmqprFGZ9PSxPTd4bzWpkNPCpn46aa8xyzBqmZKGJugvX4CkOAxw+F6/k0nGo2junklr3XhaGRSOJeti2z52D5rJsFq8+vdL0hvTRtc5gA28vDXI0FpQ9FO4mADz7wANpJdpu3pSNpoq61CXwHAboFm11ebsqsEtmgaLq3dF7nTg1ekilcYD0DpGj8ZMuz5lAdkU+yY42Zn0naHijoa2vW2vAhYlGgReWZH5S1H7EB+Srcc5EVazh5RCl0tQyCMYg44QfhJEJ2azd4GbHI7nB2eN9Z0JrRwMUU3QDd9odCrhFRR/e8JPPCBx8zeARauvbNQZJog9tuviJAxNBsNwJA5LRQOcTU6QBCzv11JA5iAYERytigchh1U0Qh2AdkjgHbvYYPDPsBJxTjjwEKRITLcznauB6+imChirQAc2Q1qBylrOCIMv1pypfsSVVrCTvikQpJJxtlPjQa/RLBKxAQ08Xakrk6125jBnzwkD0X0foFtdfve1XzVQyWL9eu9m0M3LOWapcmebCyTPVb992Ts7kZ3qm0U/yo0adZ9b9SeOQx4gq/xpirJOtAwEl5hqeI3B9U7aszw9QWiw2HQb4fhuVPGA6/UWnRoEN2Hw93yG6HkzdoSHscSsekMpXYspRhNdFqHNGgm+H+i6muCk4wotP3sntW15dx90duB5zbxq1eb/ig06gXSO2FPiYD+5f4T4e3DZTSZ2YBqbUz+iruRGoON/XkbnHCBJMR1EMiloDoBkUPSFIxDAoZg2AZfB6m3ucAGIZR1HcOgBPUfwhAiRQlLAOIFJsx/aIN0kqJK0ByAxKnhAkURiUsgagMuhrSsRpQ5y2xOmAOB1ySkfE6ZhTOiHu6pR7lNSV57vY9iNCHc0Q2/MSzwTS8OIyQC3LGLqKIeu9FGGQTRTBNopo7yAfsW+N5BBDjjFc78oaTpGGc6ThEmm4tkBuMeQewz1QjuQZRfKKInlHkXxaIN8Y8otxx1/+YlnEV7PDpr2TGfwq1OX82qfnhwtA2AV3vrWX3VIAxEtA3Kqon9W0H0NEe+LEdw4vIv8VYtbO5yOFLZE9HtgKAiuzctFAvG33WuwFK82gj+GRUjg7sAY6RrTwg8lmuHzdktuhlsX0OtZLoZ9mu83lwiq35NhS69KWWCmJ3UW74JjdWib61YWhBSv1nQzCoF5+Bk9zYWhbW0CgN7IcbbbZPSQqKx047dY2yQt6b1RH5BCD4NiqNSQg67lyZs1tK+5TX/SjKkZXj3kdkxb68CKa9POw1UI+l83FFIsYwNZFrsjG93pBbtzVolSjSERARFGqkM9QxlYUVZSoKKBRAQnI9e5zwn+qba3sqKykBcQ+ILpfTdaVjBAEFIgAgKp7AdpIQCGvMPAxjbJRRhNA7AO2J9KuyNKLNdkkoT3tZXLmpdikpmgCple1Owgl6WZAKG1JUbVyUaUlnSp4HBYJ8cRiqOrWH4eBT3vJmGKDGr0Kf2wGp1qwVyWrlua/GVlzKkcrmbaSNjyUTMzhlENt+R3Hlt9IPsqPMgy4yz0FeXnigvUYU2hLU9IWM4Zneerbb2Mb2gPrMOq337P+TZNBIn2+dTc9yXS3xlgz5KKtpy9jyFeuWN6okZnLgww1x4xR7+4W+Mc8npXnHucvvVaiWwRa8NQi7ylvMctTh+AwpZCouEgI8QAiQooojl03mSQVEXETZp0iZo4z2GQoDYfSE5R1ahu8DeTeb1mp6adkzlNKU1NLylIGcKgoDsYjkY0SZEg2ppEf3rB4r0drZ9d0fLZq9u92PJpEjpCEQFjLhEAiew9C5SrTxXWbhVoT8j9DFML18QXB1CVvJjozBqsbyKASlFndpS5eRzWDq0zl6Ldgw2clypV7nyGAh+QXrA9N3eB/wisSmdZBjXRvd8a2d0ra7k/Rcg9JrKDIwJLC7kDhxoK9uiSV5b35p+gB1rUgc2KqalynNr3ln2T6wEbPsW7hUIcRwPpMVrmeiVLgBu2G35boOg1hP1MVGWQnD0TwzseBHmOiYKepqVTlH9DC5LJNUtA7UU89myT7g1nkROKg8jRe35VSzy/QoybNr/UjjXrbo+PTkJ5OPb3k8KNFpAxKm8+N8CYxh/NCG5ggTQBESArnT5jrszng8Ss53nc/krEPEVdN7XbSBFpugRrfdZv5sq0pcGjz2MzQ/sxt7gymDrMNpxSknrGNnGcsplKVLG+R9ld+NtU6AiQ1UD9Ukt0E3lOdKlULuqZHIy44/vLV6bN4F48cagEHViqZs8pjGGzgr4O+iOVVbfEmMVdRbkgv1EFOv2+qlM1E+YGW723NLOgLsLCP6p6bqJgglbap4XH78H0FWv3Cb0ZUFr13xrriyiyukauJe2fgtKcs9bZSg4LHZ4tKldTHbEiQveRWyYBQs6r5TdYDfCO4KDpz1GjpMkkkvp4NzabUk5NWaK4O1F2lwvzpeYjTg88rm6BxKG28mhple29q4/uiNhDYHW5x5LeyO9BWmFaOIWKQCJnfZOjkVGfbd2NbBmDQuXnxvtVTucLuFsOIMPynFYRXleSACF+UutoIARVYz5llY0JwegsA3jK9x/+2tIvP9QWvUD03sEV2eq4BR5/EF5nqUwsU6hMg2kE0h/T1U83dvQb5tChJgVqiSivNaJHAip7bV2/V1UKQhEZQopZlfaUNuQZaLXKmtIFKFJ3qSQB1h3Br5ZAQnMwuPsVASgRkuTsgJr0ZyuRJII7IsorGOdsOVJNcbd/N7HnXVVl0tuftTaEfVArsqKc/eyVHkH350xkk7peCxPeTA/tVZcCiu21hxn5miSRxi1l+r5W9ZZ3WWxzIVaZxkHqnvJ9jmVqG8Iq3DcKCth3RKLJki1GKlu1E7xF62QuzAQSwAo1jY9/Vyfr4FOyAwgVIyC/RwbFraiO5r/cIxPz+2MZqCzoywibtu7VmAvvF5Sduf7SMtDW3Ih3XBBt1/kqLKIgpJtG+OBPPCk7bwuGVBQadBoHgqEMoS4mZkiHJafDNBVVHzWdnjGT3MLEkzfF5UNvIAQ34Ngs49aoEZ06pmeiaA2EGMRPcRUOGpJE03wvHuFWn4Y14O0kcJuVDZBtOM7ZiClmmfgro4G+E0C+87uJyW2mHIMdagUAutXg1zZnmsZAbrUCI1FJcqI7flK4tfeB1OVMsGFWCeQBbyI6ZoYWubxeQElq+mqMopxGlHTxoWeSo1jhJMFzJZsv4jl4jRJqWOCIjOwoc2LtinC81rXSvdNUtwqSlRZL8le/nvyJ1s2EW9my+1aupzuzDCpqpWxhnZR9fareR1I9I1KWDidCHSthrmpKdPqA4/Z9NNuOGLd5+n1kK4E6eIHAOdP1YTxgJ/Xo2Ytb+i/XMXq5LztMRbXbOH/NRrdzvlFPHl3OCBtIQODm2rwqygs0FtCGeIVUtbwjRDp3KW7VVd0DDe4YUiBzXLzZBcoG1fjUtuNaxuQBbhoz0uKVuFzmPARvoC47dQLK1HWQoQbEsPc/YjXrVegl+kIuTKpG/uHZx9cRt6SINxaoqtqyWJf2eiMpeRgiWHeCkHMZYl9CpeY6BdyPOQjmDKqb44e1+hqonWVNmrHC4TF/lUG11vnu7i8fkcJCEAmudwC43ZP12AkEUbpShrR5AFIc0wgrk7b3NQfJ7ZFbrvo4zZ9k2VRYr0Ins1ds3XVp6JW9VAjF51IyFIwI1Ho0hVIKiYuLFfnB9xGJoMr6zioITzvrVHLdZJWPTzBoKGtmgIQouZtu7n/rQDwlp42YbIyErqg7WVjCgaSxhWiXJoe/TrJyomm2QxdVlnBuM96tghhpCM6x7G2MJSPu4kA/oZjrRXhY9HYgP2MHW7fjJN5ZvrWweqcHhiIxsYtQODalaO8SuLbIO2/un8+TWeTHyUZ6wzYRqniY++lYiQa/r8tTT0OfDkX6+rDgaObfMYMFy4N+B/y11OOjZc6KmGtbUOOEF3ELQZNhmnrHKklDJcFgvrW42yrdueOt3+3lbO9azw3c6oVsRg2yaTxCGq+70oGhGqWZBwauqiFA9c4NoGUpXreanClVc6ARUkokBresDXLhtYOokOadguPtpDcZYidTkJKP1khT4ej4X9a51S2iLFC2uuNbn9CNfJFlnEKKu1uJt9tG2cGjSVSRKJFjMv2VXOEhSdINHPs3k5tsElgi7+Ho4VIqBCiYzxW/glPVRuOBKSZy9w4GAYR8lzwwy3vY/um/+MOrad12tB5qX7knmd7tCTGyZ4S11uv2nws3GtL7oBSRh5pt123xCujXZsblnonhSL5FVt4OJnnerxpp2VX3i75eJnhKaKdh8mhGtqCjEo0TlPzNl3Bhsm8UWmkvuHssgse9ddv+9troU0Gaef+afrD+F6IlO3rCRcQGksIvO5PQQ7IZLYrtjZYMUi0SFlp8NcybdOkMCUxS8HXD4iEORHx/zAliFEIwH+tx+For7kpa+M9ArVWwS2QFukhwkvtf27jYsajyAy/SGSNjRkcbgtdOetDs4MTOcG7O9mEZMHTrEt3FjvWij8ZDCPLLbWLX5EisD+Q3/4ZZJIcbpajCu1bhrEdGzH+Qvx7Aat35jq+goszsNXUXG5ibN22fC8WunGznmf2FcviKRy1Bet+w1fUfoKuH0fkjnpCgV2MxyOin/CtHNcVsXxLy6nnIhbiSXXv6Sc86aRL0FmWlyJtCxHuy1fX3rD7d/6SLCtt84H2a/0dzrnVkhhawhVXNWQvT2lSi8kRd+wxJRJ3XNEPuiMEynXcJgnz22UhEbbTZNWWxXBb0kUjYbtc8USguZU1hoTHy5vCxr8gUPNtgpA130VfzH86WlOp3bbbHb0teZBmM4liEAzbVFnmzSYTf03M5j2QSbDIxg1dBTekFOk83VR9nKgJaY9vdq7LmeUzEeX+qGTs30Y2Hz9+uo3TYH/ewsSrYO8inBeXXwTMrFBTH3Vx6FEtXcFXz1BQy76IKBJo0kbMfu2hqp9X6YaJonsakJsP5xwO4toqs79SkkoFrUyv1ESNk3eBIPY3eH77jJzZrFZ073EVmemBb7m3tRzrTgY3+Lt00SQd7JkfRhpvO3n0GwTqO5M7ofNvUhnH8z+2J/12ieJuDvzb+ZB8bWE2Frm7S22duvwNYVie5nL3yw87agtu/SI2zD9CXdrlCPzTX4dcBAHAxmCJ3QMw9sGg9I878doqp9zp+UHTaqZ10uzQh9v6SYDnPmRb9LEEGNfHRhhs0CvVAguQuv4WJr+c8nUgNpL+MrkUwMpx1RJRJEOum157ephtlBRvP54s3Etk6TeRGXiVVlmkpRY37cWzMlDRpH+aw1aftSBgOOnTwLhzXI0Y1BPLlSTtjgtNtWSxAUj7BuxoA7J0EdHYxjnbARG3cz6ucIWdIX2I3pGwVTt0V0zmi8B9cne4PIMMHF8GqE3MZ3OZLTjiFeCuhiFq4D+QRhv54IaeBYCfYPtPmP6e4hGr2mzcffS5RoVcW2SyuBcVLp0K4c8NfSsNYWGq76EsHvyHuXzmsaSVIYca+fqdLnnVruzR//dAFkJzg03K631YcPVrm1rM0nDdn3WnRSqhmcTjoVbiS6hSuBUNzJ4CThWIW9J3oeMSzf6uUM+UACyHorYXlYLjey3BXyFr/R1/pt2sgTPk2xTd68i312Alae06QMk2+BpiRX3y0HUC8s7yaxEsmoetJbQvaGuYyGj91FklXom6nFyiJwBUyjDCA0B1EXWWav+aUNm8j+D8RgZ7nB6VVRXSWFtiy/ct9R+4settdQ0VLvAGTxh0fs6zX7vzshKkVAs3zZXgHZRdS7ujijUDA9Ggf9rtQkCbfy2Mct0rW/6qKsYsIGrm9iYNYWInLCpwlWEYQwnSCuhLIj3Lxx87u+iWYBV8N28KbprIocIOOZeFaox7UnqrXUJB9pDvxxMOIYmc43xWsEbBVVMd4eBxLI4+5xdfzlLdUXExOt3M8StVJK6jYaCsGP160wegQe+hjmqLRJBJcqzbNYorW0LijSqVVYDav+73QE0AO3vLsVc1tNH0sIMe0g5S2gTRHxMzwXcegcnqblIX9Lv1jTPdlQDNi1dvdY658KSGzMY9WAI3+vmOZkQOccFhrV2n3nNKCEhQnLc90zIkHw7T6hRKHMBE39yPMrz6pIz7249DTOOPjs4vMSyPmnqnzklx3iVY+TfNCE94Xq+hyTbP5jvqvqWSGie6eTMzS5uzZ67xrJNeENLqp4f6bBILLzgah1KUe14DK+4D0GNKMrjYeGtyjKIZEON7J4WwOsgzcHVTu5DBOlLTQw6ElQOpXxQMzDOoPyKeNDIen/qf3oaCvNpSeqEPARliIkwmQ4aSSmFxx5hrmnJjwH6dTN/JM4GVDj5G0jhwDuhRkRMBWaI3aIwnmBJv3BDLxbvwPAWnm5NExUy47j1x7gsG0AuJ/S4c98iHEOoTpLjSIcAZckXqvIiA8cFLz3mVMTeyQXZZlc3F11W3bOHNQ6NqrwE84H7xT3BEU9sm8QHjw5ttEMzreTB2fVE6+G9/MGuLUczNViIqq1Rq3Fsp7kdqOkuyHjqkD8plqu380NdlZqXq4vc1mqNEw+Rr26qDjVW2E/SL/a64/rOfStqH1BsZ71OFrSQtXjVfO59aEVzA6EFOPqsyLm4U6aClKRK2RSSPeI9ic31GU2bJvoB0B2B3SY1TOM2gsgtaUCLA+G3DKFNKI9KFoWaksIZZm1LM2kYMgPSksnazogmEyLyXczEybQbxavSmqO06o7D7s94uKoKkZZjophmre4mqegPlglksFc6IBwCKw6deQULlJQngMuzRybYXlJWg2r4hI58B2+/+hphw2FrVdf4/bvvWiUlyIKdve3kuNNGCAGZ4b4cqesMUlgcO0XSRIM4Zp8dbr6rtxlpwkDW9Qbnt24Xbwk7msgU5Cs7fNdR1H2D/u6zu+2//ew882D9e+zcQ2Gf8W43fiRlq3r14FF2tthYixsNTLRqVZIjrKog327J1nsmGETBGyGgNPBkDRw/qmGrtUCo++hvgG8cSRsMAb8AonFYcnWIFEJ+zll4MyeVMHcth/HXFW6H8mKTtsiN/1jyKeovbndnIA1DtrAGp+tbL/oRI5vp/Hybph9chaWdJGU5N3q5YIpbK59DX5cDkajKGikGIUWITeTw0wxClVfX2hEyn6mz+e244tnK7EXnfAblbvhg5QmciaeeIFFcZCpR7nvlMNh52HIQjit2m3FZ6O32/YzKOLN+8uZYNq9lL50oRI9MnIEzyzzWYBmHA1nnGZ7HccP1bo0Ip3vB319yPL9T/+v44TPCUggEZ+WRRCjQ1IGz+5NxUc2WZDqRhhY/zcd993aRunrrRD7RtHTn6CVDa4qM14XJu+0vfXQPgqBfIo8G+zmBEyxJU+yQVMs9APIM7BIUGfqy8eQU3rHhrvGIbzvw+l6AcNB5+nURnWTzFbjoX0XIs0Wmko7ZhxBSz6HZ+XwxOkvLygDaiV7qKjAfas7vrJhWaXlz22HOpw5ehMHRKXakadxmGtEaf6Y6tsyl9hrSioWayvXFKbW0UUjD77+/jABHh+xFxMXiwKBKFCw+Ra1rCqkqGGAwZSI/rEcV6QRAdGIxFaV4Ik49rO2et+oNsFJnDJjkP9eRZEr2+xsVRlrHDxDUj3JAXvx6MCu3kbXd30rbY3of6XtAQbETkn8ahwi+sMLsTsl8ydxisxB/r1iE8x/UZHSoTTUOGnfhchcEl1F+26Hnwjsc/3SN2pbUZyQW+yScZekpvT87weKRFFcolFrvfok7rt4jAo2icG9ROBmUTqKQGjjslPciWX8xMcC0RLZjkp6+q7S3GJ06ty98IDFahbxDtQvX0CEbf0ZTqm9PwEiJ3+5UANRW35deIiTdrqJNfE3hHc3xomr17Xl8daHhpyG4fiiZjU3b7K2Iput4Xipk/l6BT3JB2bdXh9vX+9rG1sYbP8w4FDTtZ/R6P8jIA+vnEvAZxKJViwF977wu7BpF4OnylTzGl21+admykvTi+w6zjgZEn8EswyDJxJV1WX66Rwn35Mo8zcgl7QssnkJE80rg5tezBgwtjovR6wArtOyxpfKYzt+H/O2jR/OWNbTvQa0rdYH4Us9G5VXPvQ6NMw50tjbewzrjz8SouILy9CYbDy+lEi8CTTvfjpJnLyFaGpeWrMFGTpb2XbRJR1kG/Ei+AAIsN2JCeIJZsd9KgcP7wykcQgX18InSuKahs0Jmd7tdAY/dLl0Mr1Xwalgg9PxW0AkJ56yHo0MmTix7R4/rL3uzZE5eQvV2dbVUlEKMsLvXvwhTo82JSc897aPjfXquzOdsGy0c3rRYVqiqV2Ei9M96P0WijDCr9IvLp7PEBkkCIvAT+LE10+cqtrr4Js/OHNgg46cQxUl1kXYZKms1RifzGun54jkp0TSWzLxDemU7ogT6W9Mp38bWp2jyeue8DhoNXDgt8Cxih/HtFffvToKub73uq//r0NGhKXMTvzsqu6m3JLSvtLqR8Ay2+B1+MJ3fl/R9KzhWf4y4qc64+yoTbsmGCL9rf/3PiAvvzJL+33n9jR85nnfLuEdt+wSXliwSvN5sQbqaBG7BzWeZjdmU4iIwTXX91xwl/fUDbdXex/vnepMxg/KnwsrliJksIcNb0x2W1gqnfPkgYqTCwtarKaayAX/kuy2qF+q9plHCxwQkpKTXZSqftA67kPJRv6CO3tVzhobakOIAMrSL2k5aSsB1U9Jzm6i3sjR3R3eVJQANEu637UsY8+4ZfF6fyNJGbXCsSHxjKV43oQ/aS9cWJAmZSULXc4TF9X+7HdK0Xc2QkfHq+eXaomOIYi9L96o7FrzAlo5uNhKeSv5X9c4xOJ+7nMm1smS1U5N50hfk+jcQm+lVBSQ6S1dg54MQDJ2LP9zYbeqSoMeXaDKLbafQjaMQxA11YDamhSUN2Uc9cjY/U/FaU5Bo1yldO5K6Sn4tB7Uf/sDQVornmPBCQgFOpEt0lt/ruqGV5qDtS9949MNHZzwP4lhlEPvvhTSQDe+ItcqHDcolNkMzxbBr5EMvZTqY/Cq5Ob+5JylHKGNw1cGcdk/05XPJ93O0wn5HLFHwqVan9Apf+VJvuBzxBypySLji1OTgrKAVKL0l/J1KQVOHXucTK9NDKKI6SQmk8tMNAE648g+vs5S3pnk7GBPxmYVBXTaHweDM+alSCdZrPteTZw/ODowNroglRTk878unUyH5zdbhNuVj8X6itbD1kJyWscHwMR8Tz37g+IPVhd8QFi/bbJDSBqf2x9wz0UBr1eFnyQNgozEQT8s2JpF/zZUmi00V3UcsRfAJzhTsnuUzfzE1zRhhWQdZcogWa2Xk2fsZ/pyatWU3S+7LaKJznkyoj4FFxbihoZqwodKBbsNCKnaYST9e8CCdtf7zcDTLrLs42ILbHZsqKClL7I4/9kU8/rS67H1eqc9D+nViv2g6X3LDDl4a6dkfmxePZIpzm99HzujdLzIcO2UXjzVT20aul0Z/+f7L8+uirOwq/W58PCjILwDjmlEsvQaZWbgEPYnHdu2KuIICJ+ERA8g0X/vplVu/Z/TnepQvdNcn8LqQkTsGbOmahI4LOzgeTa1eolLzua57lpEwqwC4Aj/YZwCxtTmUpaKRO/BFrZ452qyW07LsBf/y3NTqF9yGTwqb4FfJPPPbik1sItDvpybOP3zabPOw88cY0W5W1746vP2ijpF0XH+7pdg2j19XbpQhRoZKf8HQl+ukwEtOBpLQ/N/2c7rADalLdDmLqM+d3GIXxDYmcsvkq8xKT7EQZfmEU+mza1UnIRFS7/A8x6flpHrzuzpQAW7/5LZFhv4TBsDPgmkGboTfO/tyAa6C6KFV5i4z0BvgTqA1aDGV1W9GIfwfzqmArceNEu2ddYVZRRIXYRGKfMsKt5WIXvDieFJZSZAistvlk23tweTKUzK54gEzDE05HMgPqmQtlIhBNNlLuEn5Npze5ZsWB8+2czGhBgH9gZpKxtIWMtl8MIirl87TPC/cUgjxr4BoEQ4du1ZdvKJVSxO1kabWBgoiFkOEDxaSowSBfITRWuyk3MDSgY/O/Z2TDOdbG4nnGgmQo9nEPJHavF3ClDd1sQ9ot+pXuTjh7HKnu9EAUcWftj0F1Q63dGeV1ug0AYrFSdx0S0W6Z08lp3FQlFNPUCvVilww7ZZhjHAkyxkhaMQDSljs2ANG9nAIlKwXZgKN37jG+Mcmbck8zlnzcR17SpIfoldzT++0yFIfBgAlAKCNa8CeezljkYMpKDQpgYFQO57+jX02GaQpX/+T74yx2SBn6KblUM8YfjusaIHC5s1bHQgx78DaCW6Qg0+bX5Q9EesQPx+iQt/syK3kCKMg4AWhjkAhU4Am9gFb4wzwsRUdOM5o25sbGYcIn2FMIrPKnFxluu99xOgMDhehWVTawockg1DrO9JpB8WeLrZHKmJfzAZ1faAzsh1oEQ4DrSXn5Qml1JLS42w7w3wUJJkRQOUn42lIyHEIL142DzHhnLTAF8IR50l+UA60pa6p2yETWOolEXsXkzgz4WPOLjnf/ILd4ur/h2YZoB7GAY19dA8/+BxGsH5t4/Oo0wuVQJeypE5rQKogAoiFYn/Gd+b5Mi/urH4zopfwDK5XgwT7NIDaYyPVvW5zpMjR5XbDhoxX8sptEPqzFdXIJMF/lz4K2crmIbF0TEYGQ4jw0jIHLW5LcCJ4+KxS8+H54jK52O7mdYAMF2WlsZh+X7lSiQxlZy3SYFiXTmcGA2l38IFiTU03ek3yae72vP6pxYTI0npZOaKD3PZFRHZ+uFyu1qb9Q8lr2OayvoD9B+UpM6nDYkFPpw+aVoP+yYJ5gCfiOsLjyUeUsZKaTbsCB2rSMEJMSj8wYp8xObuXymnFBi3tWRZOWSNTZNdEZuSbd/Uk+3w3L2heSJM9rF68IduL5YkmCsdzMKRXRdWIBeiF90SvUMc9s+TbfjKdVwHsDoDLZYdbU5bFjwtObW4v0JpDlSIaQwI718ySk++GJrIy1jXnCU08/59k8rjeN9auSwLBfYXhK7vAvvvbZfURPthdgi8TY5SQjnJJbhhPptEXCh2IsfiHWijQm9P8yZO1dRn64zi5xsoAocmC9stSxWB7V+oEK34D1q+HYfoSWHRJq0qJbNAt60uYCGc6Id7JROkBh9rwBwUQhVfarksF/DdpwK6aUdfEbJzbOO99lz4tFtTkn8aSFv4f0l/GJ+PfYCrIxKdBFwOGf5IzM2JhF0t8XaNefQAPfUlkfRTNt2sXIPyj0PC+mImnBiE5rflbK09IPowDcsJ82CE+PSoBjrCo6ipRkBWQ2C51GtEtXwrbl3T6uwkozhRpemKrFDVKYRcb4CvZaxAxmxY3vkemMFxykS0APn/rHR8AUXCAJ9CZYC8K4Y3UDgbxoskCUlqI+FGxyGk7cltyVrO1pGlqAnpvDgWHtt77gvHJQzNbcnhe+AOBkNmX0nD9K7s7weYU9ZPoRz/MiTngVUzTGaDhkjWubVSqKtG1za06FRJSGvG17xhbDEkMs/TxN+pgqZFJvAhyDkC6SN6tvr9vrX5GSljeyhem//7PwTCr0flqRklSkByKjBrdMZ275f4uvrFcVA4rxbkZmOHGy/lygQWb6TzKMuE/jgUlYdClePQX1C5SQFPWqQ5/zZmxLahlNf5FAsHqxHH459+cJYgcOPJQXefMltalGQr4oUWSeFoGFJge4YuNFCoXOm7leq3lxTY6eiQPfHol3DIXhjsgZe8+MXe8D8hUI64f0sU6Bs0PAuO/LieGrWETrKSPruATZnddBYxJzk3QJciEH/ow35ZNrC5+HP0P6IawqL+Aoe8uoJhYejFXEQfEaUmYwzESfT4+iK4j9X55B9xmBWjSX5/RsGtXVqov5MPjeD8amGRqRrsmw3o8fWMRTVx3DfF1AvyJLNhhS0nq85+9xa4j5Cwa1S+pSXWdRgh7xUQ0n4dF/3ZSAKnVV+9GLmg30mPbX4cFwmwEHB3D2T1SYvrW3gJv8SRQ/4bnBX4jiUhvwp64q8HyVcBsL4ycJ3g26LjZb/7khYWeDFyP8XxwSUDeG7on9JOLEwyPrtq8NOLQXEz8dsBKEzFozrLbtyF0VO/IONaREmYaAaQfvHM0j0d7fmtkcvT4LPE6W1gQFC3utyldWVp22Iy26mMi4RICCkpj7rcEEc00sQP6zrJICfuinaJqNXubBK/kW2VOB0nRmdrOdWoYyi8GpT2/Gw2x1Ep4EZlJlG2pWJ+jwJ6BBJ9msgmueAOBpNn9XDMyE69JNRSgMIPzN5yfzwpz9gYY1vL1N8WjjLd6Y91NjSjYX+LjGLewsiSlfNItrKsAqOaCSQslsucuj6+Mi3rqHEKkkK+vEs9JUxYTTj+QJiKiQqx6Kjw/5BEIUNgqHV6BsL2bIc171dKvUvBxyRYPWc86QvWV1tjDLbsZgH3LQx11ueP4jjN4Bi9MiCj9tb2VrHv9Mbbe31tY+sAdGofC9Y3SP/moupO47bh94+N9JAL4latGVuzMS+0MqvWSLnF2bL9JQKqi2wFGTIYv5Mw9bAalgnDX+lT7g4DxJVe6N5rNtiy5mhNCm4XUaZPpCE8olsj3WONbuUhbPbP/dxYLocekEYoVavpX8YLEq9y5dAA52GXOlgbLFaUYSm50Zx2HJOtO2eNWLVhbcSkMTZ9bAHdaCjxo7XsulTJoIuQ6FM5lexTWAkbfAFa/VrcxpHvSvDBqHxAsak8gA8zK1e1Fub4C2KJ+SmvsKgHmd1gpqsv1SYuGxiBHY+UCyL28kooMoB99dsamuTTAy4Cx6W5WfnoZ5f7baovEKn+ZgF2ujjbiWftgtMNKPSk66V72tvzKvkJLOcXlyr7k/5WSJPzAoUhg3DU10iygC7Q17j8/VfP9XUumSg/3v70oCPlKTjY5/s3qG7D3KGgNviaojH2+3Hf5qcBCt3pBunujo4Kf1m7EQkuLlEO2HYudYLr8iFnKggPXKLm/njXuc+hQ2F+nOGDzr0EGQsXjqpwSUuxK7WlZHK76cIlAtnS5EdWW1+qh6FNcOw46vTGCcDRL0bFOrAUt72onB1fW9WNpACZdjK5Ta2hOaIg+iOhQg43YiDBQqeK3vUE4N05R9kPZ8bBUlbBqtaDPKsr7kHoQ+XxKVFXMzalZ80wPoHkwJcEEsCZQzMJvTG34sLaz+t3oKBfXsrovClZzP7bTCisjUN39WSnOMuFevZtMhqJgyTGRyyydyiutx+U4mvzNYy23trnW5IRnRva0wmVS8uWzCqU4QPvZbNq2KO/vwXQdp5/jAA/HrcgMr+zseeQqTBLCjxAOTVy7trYs7jvnpqIsERB1zSV/1aKNcG2YAOmmgopd3Z5RO4LK7GhigtEuvSclwOCU0XO47y2Nr+E0bLPTq1myYQHfSyRmfsa06cKhvJ0MtJ9rFR+8OeUW9ECM7YsBxcZS93mGP39z4T6COeNNcKzNEJiNEuI/QZNApD4gYa9jK9bxvSI280L/OnI05j13jR3fLvgeok3MXl4LsWsrfofhCLPaYIdPaTC+2hEyXcCUrloPfeTS0TyKmEWaJHvt7wPxAk0OdheOcO0XCe5908fm3gTyj0cWJOlt8HPES6OKp6OCt9fX26uk4uXyRZ2QJvGAgXa7FhDSHs5BEcW/ChhdvCBHbur+j6yNyy8sytiqPHZtLD3xT5vNzfz9zknuZ2j/dtWZP5+M9rNaplLShpd3X7W7Pi/7sOFy6MyW2+DV72cECiinFlzNYDdtYZldLcw0Nw3o6eIsXqW1oUplS/GIQ2Y+EcQPVMUpVRdLLtjyK23kGW7oveY/gQH0NLqyxCbS8mRRmb8GVGbYK9c7hUvsLv4wlSENGwLYwh/gZbo/Dlx/wXYFI7pR4RffCyLidXRw35nR1i+bk2FW+vo/V8Vu0M3vNZFwexUqcQGaR5xah4mnpN/1ohSlpXlKp28jwT5mYbna+7e/SslP2uazf4NCwczBS9xd8PWxNh1nB+42J+hb8M+AOD6E7EsKcACcvSjZXaNMxe3b9G259DAFmLUpsnRtsoSHlG7oe5D7du/JzJhz+5bqAkY+6HCzOR5p4/TLWj57Ri2bV8PZkuyzQ6PyDGMljvUjgOcZ5C+RdtCY3DtalRwzYsa/6EEO2Zo7N8IkZCzPdGFSZ7mH/JzWc5jvbIxvrSj/E/EQpTUjiJJ85fuvP+jsNthVy/SbzosgCTIqN2rDF3NvccTqe1pKvNanoVOH4be/di1Ljn1M4IHaBqKE3ROLbbgHLY58XTMV/rmQjAklpRNGuDkIlk+BaE2L/HOen9Sw/00P+PYznkNP1qYu1nd+U2baunP+pt5sFfATxrvKG2FmaIoEThNy9HefZvhZQt0qsq8W6H4AJ1KgchR4ba1H7OlBiOIdJargjehAg3GQn2IBAKCsIhlk9/rWZun4FCfZWsrn699h2n5jXYoGfnz7cb0bfO8i2FnMH3V0N/B1KGUHfh/aJ+Y0f6ihdTqu0O+d/UMUXAgOPvA3Q9Y51TyEzm871MRI23z5wDJFKDvB6bQmhgoJSBhKyxrYf7PAtovMfZHnmDGHd+PB+Rky/q6nbhbOogw+XFHKJBzMolzrS/giZZJc7+l93Y8nlTywPL+9kEhEwjgtCLpqai7fxq2JIzAgUhPuXwFyLIb/Q+LKecnEVi/rcMLTeSlss6GosKgsPBw0pHrUN5ZFWcbS0hcsx8M00LtNDp5V9rH+wR5Gfl6eGxMzDcniyBoOsiGRuihKJxO9SgBuAIY0xZzBkrJbn45C2W6NmBH6qNyhppXpP++ZVVxQUFffZ3xr4kDjUmO1LWih01anB/Ly1wnf1izwcDdVJd/Sd6C8/F3/D4mocbsn3XMoxW5YZkINtunNqYtN3v4eRIlVU+nXCaT9zjD4hsghGEBW+DOF+ozqwrSZbIcr9Ug0gvdVusdElJeIrgLxnyxknQTRbH8QFk5FNZnLtFr3CrTerKXxSFQidM0t1xtqNDDPW4dw0OlLaFRD1CQLKqeQVjFTJSZgjRVUiqDrWdKzMUG0iNNhlJjae13+o3fgd+d5Xyw0vEFrfNrtGEizAIo62y6kYXvs+ASQfRET2dje3UIPBqOMscM+GZ1gsfc46RXmJolYUGnRWt1qdTrly2at5GispenmJUOidTNvevqrI+V5/gxsBhJXTJi/tayccYpHT7Jn1ebn2Lp6jeleRrDirpXLs/9aefSAoNHLWZMEBKOB/+NByOmUCxPunpDXC4Rl8JXmFNzfQ7rYLvPInBbSHkK2Tu0xun13u7+UKlOkZzU46lS2zAHIFBEPNoh2A/DfVlNfJ8odWrU8NaZ/86iFR5oKILnF3mSct3LlBNaCZhMqV61hkVxcDSWina1TVciUGQoLTkVhZxDPA9PpPSX8NXSVApPxyxa79UC6RxqnkjHSWVQmATVkM4q5EtTxAuiXJlCbOBIckKqPcIkHnxNPQtMgK2s7upMl2+MAR+xfPWs3dXb53TkBpctHc78cfPS3KXtSYUZfXZSNzFfLE0hHoJNOqU9uTaFSulwOGQ9QbuiPdGO6bAwP05ACRz4Ng0nAsL9DKDcAsE+C0uMJXeueMi38zEECKQDEv/FnpDhrGjIRhjiQhVN9CObJdPXuA+cuQEDtZbEo63EwgTcNH4Be3t8IpShp5YkQvv+gqCOYim8rLKQTO7HgWj+d/SDVPx4JlOYOhmF16tYjdPQWDAhPoLpSWeTAlPplM98ufpo66uG1Jc8Sg4eqC2U1CIQPRCchM0WvQhb9S8V5QInZEGJVSGNEPhBOM0sEfKv08mQrWHln9IoRyxUVt3tP91ZUZH0zLZzud3M2boZxNj1S3D4FVRUaC/THENGJ8zrSwKxOK0MeAd5XfYMhqgEQAywTLE3GPxEVxxYQGula1lztjjjrA1y9EAbk9kOGNnHMBMfGzjCCN4D/c9618EntMXEHv/hh+NxMXfnOFcnSFSS+ZaWmWhXKCL7/t7zszH4h7/ZDB2LTAf/0ZVIp/ektBWeX2Fxpzuf2xGpP+1AduYBXfm0C/ZFGugGKveBygsoSy+nnHJQTw2IQCEaDvbz4H575r8VqAoE1jUcdpRtE3IIRNKHFPSWrDBCIZi4hsaXOYMcVUrQrmOQdKR1t8RUC9cQ/fhtbsQ53T03huTCb9rnGdkOPZOs0+66bqCauGo+xtEcdoVjE3H4RNIlCnprVhihAUKsZfBkzgJ2knnLs8qax5bHj5cy4mBPyMpXF9t5azF7MdoPlfL7RurJA3nyiV3zbq0cl+BEYxOsWCgBQXyHQPlnsR4wQp9I0To4DeK78J7YzaL1lrlGHHzm2qdxdgIn5JdtOLH8juguojdm0/UIGXNLcYi912bjTBUBRw0uY0mwIV7fnEVYTzx9lD4+mfD+s8/31cWcrK0793kS/8z2nWHfF3GUn75I+nXK92Frb/aTmfM1kjvuxI7zxucD+bS93thw483DhMPpxaTuPVcjDadyCxFAvkIYAcDdafeuGTI3Iprc8P+2a/nnqCO7FyQSu/1Z/rW25X9PTvO7flc0xUgs7B9p5bWmc+HY0WdN11Zewv5N1oaHu8wtsRGHF9c3/0IJGThCGYGhy009ATzRAhtcvOn19Ey+3ccXCLkOdMGaETtF5KfOD6b5px5UmnedQ9Fg4ro6qidAkARIetOfkQR4ZROE65LogZh2Ebb/qqHI6dQN1WYZYlANYmTN0fZXLt9v6qXus6Y7bbfEklsjqW2rReLcNnHZlxLRV2XislyJpKftUspmNnv2R8OwQx1EIXVy+fOKCiDRnag1VjZpLNhuEbbPGZMVNCepnULSCxdbwKRsNxkY0EX50mypROEv5mtC4MViRMUBg1Xyn4H/GQ4CjNzb5luMtI5n8r8fyw2C6dD/PDY9j2NiJ0SP3q6FYEqgikA/vPyTjz8Qq+9/fAW+o47qxN8JSWlNSWkK7m9zfawj+jQfq1GZxWsGfdaJH3a/TxI6VXryjsAdjNQOHelh23cyLhR8HCRtA2e0FvvkBomAVkgC9WV3nQbBHsWJsUOkbWs+XokfK3j1gPJZI5R4QfcEgf+y+t6Z1cUfF8TphpHrLuzJrJisMNy4MPhx/8mHDtzqqdKdT5wjJGzjrknwrMGt8PVjrAd5xvFrfRWKLk9dm/1HaWlZ2aZufnl5u19RWjJaVuL2DP/hzM2r3lahBnZ99bh7UvHBenhdA6RsOTE5bur7ptN5MBd024hvf3j43IPshX2G3x2wqg6IzqEhlkfpwC+Rxn3/6sFhV4nmG/Ahu3njSY1r0FcoNtclz8pED2ygZPeULm8Z6ar95FJPY83y1lpH8lCRT07qx0ltavqESCVtTnVy47s+jHREJB4NewCKG4iBSvW0CqXHlWJN37wk91hB0JvuV1fy/zv9BMpwSKpRQu3bh0uEF/dHI7mkTAYbc2x8JIbi7g5DRKb5+4csqflL8v1yQVWamxf2ZDNHpsorUSSZMt3JrBrz3xN0DRp7BYn+F2ugiaSm38Nm/SZBkVii5HFS+Unpk/CWwkbi4dIkIPlv1dnQxc1lP10JeVra/z3BGududOiUrQ0Oj7/Mm47r7PXl+bpgy1z1ee/uht/g/5wL5RRbM5hLpCVSt0xqYmPY4TeEdGY6l75TqBTa/5toZfEV1oe2BIXaU0CT8v00JTUZD38WSYchLmOZ+RxMVfx80sE5llodzAnNbCwu+18ok3RqOSdy8jEHgXamRKssu+p/cdaZdM1mi66l1mjQ1xr1zRaLvsVXrcyWSwqTkiSFA6Sy+H2VMq+BRbew2AyDkc58aJBsfOi//QmalcdNrGEihvdc9OootLxPPBT/gkZdM3TxFpGTch2HiZmf0XX/6nwH+w4KeQonyqrRtV39jRQrW0zEkbCSwusR6D0ZkMgmSD/rOuf6x0P79Yf5tO846K2araxBxlLkc3fLsCqJXmhXCDkVikRKicGUuIzX4MWPxccbsMZkBESPUXzzNPgkCNmu4HrQG/wqSAAYaD+tSKvmKtvn5ZA/zHpV0TGN6vlyYsUrrBoqarxuvwOiN+mAdj3xvCiwBwwfSgA3I0hHN0fnYhJ3Uii7Pm1PGv21mb3a0jcoMudjorq3HNwdh+RhMCE4hjT9IGJXKxwlfHLiN7zjoRUQ/X0dBH4GDCqCoLrEirXvUHNQEFIxHqt9j2L+9JqcZV9MMUJO/6FvQRmMFiIdSiFVUugf0EHUuA9jgFBwzAexirdXqT+9fjzyru+AAa5ATyHYk5BSMlxcP6kez7/jbWDdHMiTRQj/4jYCLqZNFAf2Em+9GEE0lIHBObWXdvO/0xjIXQ3/qKQ2DeYJBvYfZU3VSgi1iwuOTFs5+8I3NFcItFE+Qhu7fJv0TWnfr+UcKRjrBGtqY10Kr9G4Gb6hIOaMbF7VLVD4B8BZlacASL+zFSSQzPqThcX/T4tH0feSv0VC+Zd2aYogue3KUhPZEM3iiFnb59/a52nzZwLiM6hmkCfqh9JJvwoqqfrMnsqt9rDIpXL2lBePMjHVS90BcAld0PBIH9kZm9U2FkbaHwszbqDxl+fGfh59ax6Xk6vLYpfwTYqX9+dgeeOTbTR9KlvstQfdaERY//bv+cI3WAyCgz4F4XGNABJGbE8T4otwDTWsfjWU6QdAidLSaOPZ7m+jGdPE6Ufrye/0MmXWOAHD1fuGgldYKcspKVmuCWSukYqnCZ2L8hpIWHVXZgjxJ+HTHPzMtjz42MNtbAsk7lDlyy+N57g/sZjno2h6DpHJI8aKeZmyWmpVqWAeVtpZPmVR2ZUUVvXdfZvylGfVFwHBZYs9Ora5pV1+9uzEJ79xy8pt9HOZQfTqUaem1XYdMbPOWMCx1hundOVbF7VtWFi9Z6gs6SbLm0CXddl+97idj7U5FMsn8fESkCa6O/1+VFu5RqxfXIACvBiYxVkfnLi5oV1++vTIJ9c33HhZ0zsC7GkxVtaRxRiyWQN5mtHZNnRu8wj98349dRaLfT8oPhKH17OoWGiozJK4lTuQeIWgK8DjKmnFrqgUVUO6tqfC8T4H3aRyfzFIB24KsNxPtrGb0Ngj5d/X+uF1Dvm8UQFVMqFOllpoPNG17vZ2yV0bhVne3ObdKnwg/tLeuduGoy2aa7iq1a0UhDyMTGgH9qeC1cT6TeYAOOG4unIegg45S5d7vBVlXX1hX3pxE039eFRSsiZJzcAHCS9YGs/h1j2etEgA5CEp5UXl3MoJRONdmPqG5DtmZS+I+N4oX2moq6wQxBhjj12OqIU2Bk4EjtQcSM2vmCluIsFPwkSbkDAAzO6w+eC5vwgV7MtGIOtm5uVu7KCbf3Vl1SDaL0KKJDeA0/10GzsJrXz+mU2sqb4PEhs5hrSUPcQsqal+6mtivQQcBU4MhKIRdmxsX9PJNawiTS/y3uxV4z5mrGqKtweeus7bR6zkFZcyvpUStP7c423UC5qSNBJUON1S8KKMPeln8JIDzO8gYwgiXhTXQPBYwhpN44NlSHNEECemN1S+zSCJMAG3XhZVOFlyMsQLOuvA1nLHqGhD0dqLBlhA9VjCGttdPsUkvy/FJefieZB2iHq6V9Pwmnkuwqi8wmJa1I2rnbKvPppFwuiHSr3u0iQebjER14CkZlJziDJfGJR8OVywMosjv4KnFojaCjW7mm/2Bo48mO9BdzyBxBElXnxxq6S/KCMz7rIlkeFdJxU2SJmBnWKcd4gm9Tn8FTod31RDnrKuvr91SGizcbV3Kn/67Bj4E41Wxpx7wgY6a0YHRy7tPqUOVa0vTEH+AlKdmcsR/gqD6tJQZN4r3nffPbGLdo2BVxKNh0AZ9iY100SmBiBnCmVHoiqn9e3s16QzmVFlBvBu8HZGBju9C7JEvrlhJN6b3OWqf0AKRt8R52IlX9SSoAv+lkCSe3I+uOFhPmIKiXVE7gr6ptFYc55FpBCC+UXUp8U2n3KZUbzAZmbWfEWzJWvZMTAUG1HHpvbVFNkUoAHyBbIbB9aoCjZ94pdVbsGYRUSw3s9MkVWp4gNcCHE0IVzxxiKfJsmywGwRLgkalXnqKhBne7gxA7uCRChCakBY5BwZqBeD/3kkepbL5HZ7Kupj4KGY9WemEUmVCCSIkLIwga9CUpLczDjeKK4lWRvlCwXI2cxsyLrqDGadGCpw3kFMNhGrJHOTa9ZO5orwfNz/XbnhwWT3tx9HgvLXL3N6u3Rkc7JxUWjTubA6orKH5dEIHkz3oJKhUHZRSVJWrUBoXXfzheiwMwlzwFFp4LCXLaRB9mGveQcDyMCLbjAqME7GHZUT9o6i+kGu4B1upQikP/2t5MMax+4hxhjlDgwQ/3S0q8u1w9jvEvnZYIZPYyeDwvW3rCjdEnCBEORIOijwD6fmy8hFkpGCRNVF8jdRDzED6mJHybz+Ulf4jrQqVljGEBG1VH0B9YbUPvAmw7Q2wAVf4R7ABsCp/lzoAl6wXcRRhFHqSl1BcBGiKRCcxPvKkBZoeUWqJSkgqKGG+ogQOdaoegyPYcsgWQ7D4VesW0kBoX9GJF7P8do5EuQVnltXX9fHtRudkEHv0KB+In5myT/ZB7ge4Wqox9MkBpktnFbDwq+xjbkcWIkqjvdYuAQkEhWZJr1XvjR+K5aseWO0ATLCJiNVBwnq4LWXkWsmG2sQ+J+5vxDjye4r1kr2ZBeUeGjc+5FSlP76iEu+iVAfhFPILGixI1HCyxRIi4OQZZPoVmdbrJlZ0i9l9DDtJkF9e43MBarFsWsbA0th12LjQ4MG9v0j2nmfvmOWe8mWu8sRi5f1X1Uh9hLdlRUerhBrAyh7t7xL2sq2JrBOccGX4QsGIeMWindFv8E7TFP/7ioVkWEp9vo+uBuiZVjkTx6v26zWdX3Fqjyvvqbk9ytt/M2Ixtl3xwYTWWK3KUQqXxWwBcGdt004zfnSfb6eh+fl5HUvP7dWt42XFYASvEhGeYxI/qwT5bmccwnmPWZPTBDJ/GIQhRGAZ3RRvOAzey2OYzkDyk84krYUTN9TAlWv+XpNnlZ1XzM3StBFnYpVUOU3QJUF1m8oZ5YoZnpzQ9iofpPJ1N8ArghlwrVVaxOL1tX2ppkxz+b39+CWZzfb9qjZbJkZnQ2/lM4Odv6B0cJQKOZn0993HFWNvIV9vsQ+5xX2VtvbW0dVkfPxk/qCoOYZ6ZmiYj959ZWkbvvkXQDv+ev5y/PT7ZpESkkDcb14div2gPgO4ekwNNoXtoEPQ1gukIVCdINmuwj16r9m8oxlJYge8G2JAGMMvKqo8E0XotqfiLUuzlWV6VxzTHGmA39Rfq1z7h+y1Y8fckd9mQvtWxrRQ3OjTwRf3PUaYPSpKOX/EWpTtVMiMYgsFaooBnG9QQ+uBNfX68sTww84dxGtw44Kr7s1jmtPRepvE/mZtVQhCHK+s8Bpak8cSgAGsAgwip9w3FBDsNHPSUrQ758UAlHWiYMC3EEFtVv+L5dyW6KTEWxQ2cXKr3FCxU0f/IB6CC0IM3uLLPJWSUAeztCMNiNUXjr1grPLkTY2nOYjsj8xn4/uv4/vY71XCOW249yeCGS/0AKLccy3m4NjAEQILcSdQ3cVjv1PydgvXmJejD0Ea7aRv+yTncVFfyoTEMc63+TrlymxIOb6gu2WiJ8Th8Qp+dl5yAYsc0VyRmctFsUtdVsNIt/hmH/7fvNOjq33Q6nborcCsZig879+c4TAdx01UV8lJ0HoL+ZRJs7hOGu9EHnt8iLjdMFW2+q/p43o76cVaNBOGKz1g4kldhkdnx5w0N/8m7jg7T7ZTLEkLtg17it4sTPvCS80lwMrdv7GWUgkVtXde4yffOPvRPh9B/XLN1gSjWg3upppTtVRgYsYf9lzFJR9pMR+czkHvYM5BDErJqcV+awEgVtb7FOz7rcAuNgvXVa0i39WlQrsUwJtiFuXgUNAl5QjfCcAfkMhlpvNAKyPnKPtQkyxZRR1VdYqoJjOf2XDKtgSIppUb5i4Rc5DMutHd2kzSGF/edDvXFVJwKfSNHonBgHs7g+VlFoiFYrRcTJCqqkqDNjVDetGxGQGpXcBIofOlWCtxWhmS9RWcpmAcyLm0tD1UZXwQBBODy2QSn4iIERlf0jG7Vl1T9W5xIs2gzT213Tjp7MuQBDYUdVrSFt2Dw/9te2vUrORxE2USjGOjyWcmpb9gJLmAeeBiD2P0PI00Km1HKLBCcRDYFfMFtsSOCfyj/ZE3VT7uf1Rn5vafzu89bLc8GA5D6dgCSTepcMe6nZLpY+5USbpeMp052O/qOLo4q7XLVrGV5Wj2eCYxdVWxj9Ra8V4skZS07I/UNa84LwQcbUTdHk60KnryhANTsAfCrsRtsSXwDmRnwcm6w3NbO59MbdjO3uvevclIHjRao/Eftxbp3/LdM91edFmkBn7yyP4uN98yF12Jaee7xmJwQAWd5zdUqse8VYnxy0xNYrxZI2kpmV/oKx5wboWP/kAM6ezc6fZrA7R4AT8obAbYUvFEjgn8o97y3g/OMqvxP3L/vl6TvrkeT0fu6YG7fuBaftrgfBUQj76JDYXY3TzF7vLqGvWtYjJHlpJs0vm5zkRnVKXk9RvnP5N052KOc/wA3LD/+Jg+q6M7S1z4xgK0LetsJsntCLy26/cecd5J2LyCLMaZ7aoAqev5DYrhOiuP/g20u5593Q5bZ/bx6XZsHVWqyL/0J5jrr0V2+0Wnf5t0x3eU4J3DAvITJs6PTgv5bpu9UMDBxd6em9IaSnrXevRC1sMalr2P+ox7znvB1Gu/YY5NHCemMYlrtUTzKrPGK95ds5k6OyNgnbKGlPhAOMbkNWvNCWoX+uX2yUd0v4GOG6KUBaki042SRufPumb2y6l3h0F1b3DU6o970eG10OYiHPcIPme596tQdMxGycdPDsfM1J1b9yyt1eGbmsJv7g7a53GXCzvAKjJHYAv87wPjX0gXsTRoj6DDfLBTy4+fV+vBKfX0wu7LN/X96snFRaxhEiZYzc+Gm8tU2Af4ExSjlHdRWYcnGMCt31pEpghL5KYGGg9LPej7WciRc9JBclF6kNk986FpfYi2AL+6FYIwgzVpxgDA3HL1YciFN3j6j0+4LKmFnI5vSMXqMplmM8TO0xsgZf3nrFj53oFa64Y9Sk8ZqxpipvZ7biR/cT+47sdV1yOr0YHYaQnur2TCBzeS1na4CypEoMLhhir6L8raJQibYg783kLqqaqIGBWJ6wTkTibgiAGf2HwAqz7MGC9rQR5mKPt02mJRXPg4WfimbS0kAjCrD8SFvtsl2zjaKFe7h7J9LBwiwXXckyJGQYBzJEYo3hfFgKs6oJ1IRJnYxCE2E9/UFAfBmT1pdC5o1jAYX+7kBmMTFxX85CCV8AZPEXTlCRoyXG4FkEaINx77h4lZZGTDlx/GxuYrPvWzhTMLXwqKiyqjQB7plgtZt8nhiw6yoGBn6OHHFTpvwjPrXrx098rf/koWeZGwfE8PGOqGjybj+sP3CxARRopomMcDmczfz5Y1LPX1Su/ANu9e+V8FxMZJadJhyhdjC2fLUOjRxNxpqcTQxdFd6u1ZkNVzxerfyTn5JSQcSfj+3bjisfmxlc8p9RuFMbcGrfN8unn2pAZQxRxWlxHY4J4VNUkQmhKCN3HvkIl26LFu2PHx6WQzw28HxnVxR2G8OQQR7cKDga5DSv4ZM/Y3xUe+pS/4Gu9LDBKqGPWqZvYApEJLzs5BhnnUodXXZSaGhMO6qxOzpIYkROi/ZwVpcqaYL869El0rhACDG73UGFJ5+eGoRC5cMmXwvhyOjraDEKOVYLxg5UorAZkk3KGIBPJOA5Z7AJy2UUpyDIenfJjqPP4+iJLt4JPclc9aQEOhDhBA21nVCICwzgKgA3LwmgiU5SdStC7GU3wNsXSWC74J+HxgjEPapfzOv8FsfK5heZJ6rYJe57rxKocVM8gC9A0vpMYJ0EVj7LLeRXztvgyXYQ7r1c8SZraoi72r9Bt347KtcZFiWCp7eIf/FATrnT8QNq0nvXw2hDIQbmTWsntXfalavwnR2/puradtHbaXPcvTdOyF9nl9fIyPjffz8flnLikbqNrSr4lNjtIGscCXifS4IGJ6uGQ5hHC4mCWr+Or47i1rqZs5c7ayJ5x4w4q0c9dOs2utU1ge3JHLJhONN2Pt7G5mxmM/UJI5ijBCzLQIG1p9xr13QQ/aJzbWM4Xx1NU3y3tHnmfBmz1lRDC+hBD5FatQumOpNDZIVPgqI3ftM64X239FsWXGiMS0lHQIGOoY6vfbcCzbeR6lPLPUZ/BY6L0FA0U1EcoQjgUBcttpnBTGrO2E+cv4Bp5eQrNn6QRuqrXEpaFn8ReJSInIuvo1VchfWipyg5bq1GKz5CN/KMSBauoEWIfDX9tskbX25AvQ+GjOm0w9emx4qOJMrFBcWYnRQ/QK39MSfRceDtDhYS8v8Ort+qnyzybq2PbWt0XJ8q19RlAheTEJjFJ6ubgK6An6FbounVL9pFVW7FRCwXPZR759usv79epa1xtQb25Vid0DdZrtAOhAq4Ex5Ps6AMusp8VE+/pEHTKrVUlcdF2cDY7enw2sZa2OAkkFTQFv1AFyW1aZu9kLCwm8fwc7rPWgP88PNuFaYY+tRvT77Y39rwZZMmNBw+sZBQjnW4j7jFDoAKe5FAwm5MPxcnZ2avqpd04c7H75bth6a1zakO9vpJaok4lb2+nTQmqriWHymPRzUL6PosWbHF7v5JTcrQbXX2vjz3AW/6YJrG5HEO/PUulXz6rQmjZ3cUHgddjQaz0SmehQ4OLIiMIr8s+g8lccy4dYXERM/B4ykkxOl83wQ6KOC6g0PE+zoUROO8CxRHjjHELuTB7OynZF4mjKgA+mEVNpciWXJv5BAWck5nAiSsL+EDvVRu2i4e05vxeq+YN6vAPV+Mh9ckLGumzeAVMTbEstsNdWrfLjlqUa7rOVYsX+Csc7uNbpIAkQQyjBYHzQ1BH671gW2nExY20bKJdOhqb7UHDy4qO/081mp8ACOZsfnu/rhc4wrF1JEWSSKdw/dDqUTIa36Jc/UyvRUL2QpHA6OaLIpeRbWSdCYR+vtdlH8Fgrmgem03vBm2a0rNgV6MKDjfeQpejcEjWO6RZL3C2JDYoy/XVZQtrf6EtvMBr5RxktaUZHKx3g7pMGxdi7xAmUzyuRNqHsIy8Hr8VS1iAqh2QgxH6QSOltHlel30A4Vyw1h7AvKVaTgpkHSJsZtKGWIHIj3lSw39QsJEHyVrK40ErGQJpmM0PUy+9M9APllU9llR4l6y0o+HCOHM5Hx9kuvIAu/f1fpa9SdpYJF10bDHdD7exDOMPy9ifJ77Wz+JCnPwDVS+Nt8rnrM6tQp5ZUGy1RZBiAbTpEf5dCcBD/+u55NFNXUe0yJ6AcE4WA4xd5HsQK/VECpuT9U+iEqKKp4zGuOY/SsuUNnlWZGWZJwnmY9FDrcczEvfD+/ih+AmSE3wvIO7Tuoz9Ucbcik+BV/PKpFxktkhp9CxKy6PqI+Dr2CPlG32tpiO43FoSRePq7YzFXRrU6jmU7qfk3T9u1/PRRtIurlyDfGukfuMebRKbC3u61QXygUc5pEnygMXIQGjOTUBxRNBm4+NvZw0RZAiR8JBz2RNqgW5TwHGf4N5vzCNzm+7piwPOAMojlE4e/r9CxOeY+cUTEiIwptGlsXuHE4vapUcRV+cwz6KedylPlhRYLoRsEjMCi3Mt761VAu/LwqOcumfdi6SPK+C7i77J4lyAgVF9KXiBwRwTS1RWDVZJkCI0wpsnCXqkwZMSiq4JgcLOiv1SAHvPY8nWfbqoWizsiQyROzOi+oTGr4aK5AsreQFWt7nlIxkaUYxD8qwlay1ba3yi0+o6P/Hz+Et78z8OHzEUnWDC4dX8Yh2w5I+k9WH1RkZ93ExPOGnN2PRNrJPuESnu0Ye311fB27vbW/ea/Dr0t+upq60qvbnpzUBi334GwL/4JIQfb5mYC8sAbtMjxGKj4Ww1Ddo4Uy8eUVsGxJO3GgZuOExxwLJ+vPOk0Dcu7UOMPkJMJSgxSUpTNO9d39YU9A3kc8e58X2zAMSTlI9IUPS4/f3I/njvQJEBvBTDCkYoi9F7Ft05YSknylf03XTjQbjoOVqAAad9U0u6nZRaDQQddmCOBWMqbU0nBQRwHbLOvAM2ydRiOwnykRFL9to6ceXn5vvqWBv/zfBGxZQLZDqVgZScUpj3oaRBuURZqU01mWsWVTH8EgeUOX0MMgCcTqn1cMUfEH2faNLQYG8QiONyIem4O+TNmo+2+Zc1BX3CZi5oFpMV12jOICcYjPJaV4xNe+pwPi635TYVE1HYT4VHCjj4RoL6fNQdl8AN4iLfkTacNCS76PsOZXTTMyswLzbewljn3ROxjSRoov19Pwd3O1UW/rPw9P6WtS1mf9Nsq7oKCxGPCdgbDwnR0hSCs7DSbbEtC6RQkdHVhsjsRkehTVfrkwIBsI5YJ46zAo8QCxyTCSv+je+XdZYRlMv6ktnMVAfSR8/BevHvoMV1YOg2Q2qZUH/BKx6IJ9bz30QeyxN8G4RR0iNiZk/mGGAYHyJXw7BA3HfqTOAOHvSSdJEUOJJJUoRqhcXH8eW2tBp1YxHxOsWJacQIi8UUF/yj8FCuwE4W/CFS/FuO1IKNkE05OVoTD8YHm58kVeY86U6tWyUo3Gi6uVckPJv2bH9r+uZ5u25Lx0keBjT50l4IkfExgRvqvh7IWr0krZZPCyM7uYXaUAkQjn3VpIXm3AEdHDZuQ3Fr8uSp8EAzQsg6UXNZPOdcaZYoMBT3N84GPT2thTOAmtoxdwG+vZTnm+27rAzUB8FgeDiicJc8SQ/13+nHeZMMLFCPE7sGcy7hEDJx4fv02wbZraedNvezg4s2WPPpGxcDWWkm4VyQ4s3uFgH0bHp3IU/4NUa8/M18S+a85PExYaJ5tj78Uz/erDspZvZMYe7eclKcLNRFLonxgcxaH4O+XKaukdMHnrdh7t7bTfn0JbGqVM6xgEzKOMnSRVQ/IPXsEbtYQAjJVnsuoTrs5ovzIdLXXRqwn1KL2Q2IaS6tnFwtBvMzHhO70vgkpH+iFiPJ7h8rZPaTUgASxMvAYca9jim9LOYTTtFeEoqWzc5g3tUFvxfee5hUNnyMO9toqk8yEmFPRpCQP3CDCfE2XAvgT8uspq52UlCA1ynrVCR9mwVBGPFu+QvzAox9SeifeBFj4QJzxG7A/KPMduYtJdk60QEJWzJJVrveLXC/UU4QllQ3is61pPlY67htyvzRZqqmVeO3UlXZVdoTmJ4TkfJIj5SNErXktC1qhsG1wHbG27byM1gXGG1DzJWFBbyBhNhC167rbrVonm4y3yV2Jr54nrGz7qsNKiOJM8pX+P/jZ60R/M/29Fe2nGO3chjTcStHRpgtjjb6mS27NnGUbOXurs4u8qKHDx+5wcPRNWw9SWqnUo5trRxdIVSDL5VnhNIFIJkHT0GYZ6ykms3m3TXCkjkrvZvmZgAD9I/79RxzHmmNUK52x9DfdLxvbAHFeosqB0hhkdYeNPgJyytaFTwfwFEEWCpGPDnVQbiprawvKdQFu5FTRGlk1BZ7SavPheAFeObXR7exUQg8DJtVyQmZsF+eNalZKvhxMa4k7s4HVBpFHBf5t7gsIslp6GOS1N0hCNOSFA+3zXsy503puq24qh7VXWAcokKoPg02nlvVfqDjJ+c6oT/uX/Ym8nuCHDI1X3hW9plXZBYW8hj//NIIidMeBdF1JQLTGgKo2JFoTBSb3hZecYvkNrlSzS7Wbnlote7ZRi8rtsaUABkN3RdaP6ZQEkWAOBFdQ8MD3Gffqm1pbYW4KQuwm+YnUHhRD5i+jcqFM4bSbhDCl+PzmjFLHyEoUMYvpIV2lSpMwStgvJVzSi/MdMMTfIrltIfNavvqicwVnXoiFM7bfkNMLAl6vIRxihBp2ErsdWA68pOqKkCdqzPHUiSOed6Xi1b2nCOymfL4sRskh0d8iNlPEXxHiIwz046+JZU968jbvASgwn0UiX8SJxrqtz+eYvbpXYaAcRlHU3ALh6YGyJ0I5R3tfwJ2JPgjifSXf+3CUqO9R+Pre4Gi75DiY8AvaBTUwvU5jYEa00I+IPJWwBaJ9q53yalznnqtQqbNiSmWn/5+Bjz/e/77/St+xk/ny9m09bp2xcuvgm7ol2A/iAZnSbNfbgW8zS0jP8b5XEK38T3p8eXVYzWqoqOZW/NyJ/NJSWJK3kPAnXjLm5a3ctRT7zjXQXme0CzyinfNBfVo1dM0SqsTta6O7DOE3M70vAy0cf7kG74P8L/73z68u7lazh1LUwSuf5A1Vk0NjQtG0UeMRRDp4lXmBT5goUjBKElB6HLgojQDsrUf9ZN1582xE3nkMTbb2LrfOeUxReZvuHYMlDl4RXm2RWoFwGVI+qihu4GQbpwzTmqZQ+P9dMNksbJ2mFRKbxORskDEvC/yLh9yUBQs4g0uqJGYmVXLm1gJ9jehPuaw5j5Eg6xKEiEZikhepzvygHOGohYr0SUEFwz4FyCLoXo0C0c0l1YISPWJ1TAfkdSxHillKTB5BRttaG0vkOqDMH2BIm064wzP2/VycrYsRL9Fq4oMrXLymdW3ON5gLmOJJ1nIqKQShu5AzwJ0rbgtRCbQctNSztUCQ5hNFDP2y04oLpv2IblzoE2VFthfCFhlXiVR3EYfDU2y3myMnlE5v4qXneQ0g6rCQ5QqWtMDCYP25wxHnsmmIAZekCMxbYb+WMkrmzMDYDGZyAYoornQZCD0XeP8MCKpQzni/osG8goy2tDZHgDVB1a1pJoftoA20yG+vH+curbqkMRCddf6+IkS7XYe9w8UvidK/apiAsEBnZp8R0v0IFutZx24dL67GhKqXkjZjeRm6mjXCZGcYzpv6LML0wbVQ2rOQVNTWpGk9fDorWSb+vpf7s+98WvojNdEhgfBqPmmF0KYcL/LPcpPXwdKWX8KTOUFcWCDLJa/WPIGaZncB6OGYjayyLlsc3m1KXuVyOuYkYqYaVqH3+yE6+Y2S02T5TSfl4/IBkcpRQ4OEvSRy7UCygJdKGgN8oYrPVkuLYtl73eC5e3StxbW3NBZdS6XaIfp/urJCstmpHRMEsrFZUPWKziVo5U+udXzuv4odf9JpkHG8ZFHypp+gimIK1Pdg1XqyO+YXUN77KmodQ2zoKDnDlWZckVC8KlGLDarKC0WQ0qS5TSdl8TsqGRP9MFmZeQBIHvN7a7vQL84St/c3R0cENx9uHt/cHvgX54vF7OpplB20N+vx44MkTv3xMGFY8+fRDFHke6qeVUsPpU+fpWp0fELqRcnJO3q7kGMQv8Cxb+q7ai5yLrYs4hcxI7oGX2Xx6JGNxnx4fVe5nnJSvmxQickPpziPyoT7kOSO8jL6qocTBwcrFKCnOfUWlcb+I0OXtkZj4+bPH5+/PRwd3XRP8ttU5GYkX3Z4XELppKWw5mU0yeRZ3wL2nfS96ny4o90MrKhYUXbmlJ+lrrrcYwWyqAo4pKF0sAwQ+vQ2lFkLjnpAYBNeLs7X6gV0S7t5szngPnN/Bpf4UvXsS1dbfWr8v7k5OaXKisSvij8HVgfSIuvpCcdXyylSVRlgvDqUcXaox/qDkzHLORIhprdjz0yaW6IcgSmrTD9MwfsaBOtDW66oNuVYk0Dndq6V6ufzOpudbucu7YqC9yrPx/JFJO4tNq6oAa4H98cJsY1qTRaFsUiznykTUQ4tYYQRTXUXJb4tbsfVZ9e7TQNQYe9fze3ucv5SEYoW1jVrcXQVd93SchTicGl/m2ekrp0JDMFqz0zefKYD+VIYqoPU69zV+tR9+lTGSDbsoVHeMhzr96YjVooipsKcez4RDjKfJeHUpe1tMFVOez4Uz+Li4nbRVh0fcLILjdIGvi9JDPW+ZByJvNEzcaalceFezwQV+E3D0+t+6FRG+pSKZC95D+aF3rfiyrx25Uvlt7Am5q6IguP8OERdzp6cs9v0J9LbdkrFQ0tcZFIjWpY3PbbiLkzqVcK1WZWRbxUjxWtrduOVNgCBqXWHo7CyAdj+zX0LVjpJtzntZFULgmmETJGK0KXCYy7q820pJi+lKAXVjJ32xwTHA/Pg3lhalxaJawLkOEZJVcULPCyEnatZ+ZnElecIf585KqtGqpXVzP8uCZS1PfLFEbgkf9fReDsMkI8lp+LoMxVAe52WyZsEnJsMQhsiig7M8Cuq8N+xdnnKefpIKtIySa6oFErDPHc6uoG1AazFdRONyCSYov2ggiXBRUSspdSLYeQ/vuTp/uWRfmTC4E1t2aawpvUPOEuvwxPssA8hcoluYnPmsmEhQQVHDel1He5x7wxlNorYREk7bdek31RM3ExfVavUwwiSAEUqtRDdGQGmy3J1sqsnwlHeGK+QBVrU125y5mEO6RjLMGwIJapNWQS09d21lYrTeuBx9CW2mLi4CmetMKz0ym0ggHE5EkqOFA5x6sj+DeX3XmNVHz543W/rl7YN7UhWnhECn16YleiStTdviSIVBHS9qYF7ke8GGCtdpVjHoJP4wWwvAAgqdHA4qRHlSaGwzqUrXRqN7Aqr3oegzGhd+VdylN5YuoSZUb3qxft2D7T+XIFY12dlHde6H0cusPAwDHYNVASVMeSO23XIOayacJT1L867qP2133m69U/WodVniU2z6W934pkg5p+iMtFwTzeJMzQZg1UHsDUwqk8lIOfM65KChiJ0D5kLty/QjG4XPLCOX52E5YMrCHQi+6iyjzbPzh83ASNr3vMDtPCC71eoJUQDND8BStEjAHSFGpJ7eGC3Ao3v92ZnGTMg2UYSRZkyAkuJwvSYxMeae4sKcbWkT0xzTWUmcFCQGlfvSsch80P03btj2Dgh73y68LN8mvmuZa37nu7sPVc7jB/W9hzaUPGFpTfL9qllTgyk2SD4/uWMrd2TH2m3LZRFFdxQv+0v+8MfxF2i9qoIk2kOLiG40QvqVzaM48n0pZfP8oaN0zwbK8pOn/Ja2l1SsL4WNuH6WVoV9oSxTwfU7REk/Kj4XpuHags1RDkwTOVW/E1K10GStK1NCUgBamaS2mr1rYOwCoFBrRBx/G09NrYRkzK7o/REezUA1PgMRDVmHL2LGAmZZHg6TpkgsMtAWSONSGqB/0xl4M5OibiPHV5RR5NcKxmrj7gs4HGHPavZ2d1le8kNz50Na74+OX5tVOvwfekajxao9xVBYfWNaFAlq0BYDKVyjs6IzwYbuahs5gkOj8jQE1DRkb6aup96EsgH/ui1T581KZUErmNuF4GNhjckhKAK7xazr2pa0uUHUqnz8hmUbc2V6ZFbt4yKBd5fyHRZfxAqu6lCkVCh+yN3Zczd3iTdt6B5HrhmAf+6jDQGk7TGGXXHwqEmlOB9I4afTpwYTILhdKESSHEE4bRKQBVMrDyhvJJ+derhWvrKuUHTxNSVwDZazE6DeyY5C1FcJdHJFRhIUOCZ0UKpFRIASnpZjSlnFqMJkBMcwY4OKqOUMEpOat8Skgndbvglwy0YUIhZeLoqsD52Gp21nyVrASdmKnsU+RvPpZjPqBhg/vElyt5flFzrdmlizD8DJaKjsKrqAhblrH8tQdEDQ62K9LAotm2d4TIsw/EfJxSZDmxeblTmGhIyQi5J2PZp7lz5lFaTK3bYQuDLDEs6mzxODHpLRa7HAh2L/Xz6YzQZhW+69u7O8eRJGF9j6cH59bxL1aKnQnxEA84RkKkDdago1bnt/Arl2EaN08YaEO0cwrKeIbICzQgFPYwQDDcAyAFcEuEzIgcL5NMGFV3KlGMwSg3BwQDfaCJQu82R4FjqzUssUh/EtVDKvHbTkD9pxednA96QcJ3oQzz1HvYOL6tRZdVobaODnXw77AUSXJ1iMc6n5HuuV2iw4JYhLh8M8fqD4UEn4/0wabFVIMI10fQwekltEMHOih4D9/uFqJ31AvbZIwsFhsjumwE7L6/vzn3P+6/f/qA15gWs+nEsVpqsZRFflO3Kt91M174j+EY9aUM+Fiyhd5Zv+y3Urh6qKjXPHOHSupyAFkUXlHGHzOrjUY578IrvNK+z+mIoFjY/KkPhxTrx4mbl5eAy4+XH54eLlbexNBW6u0iNvBfpd9O8SYkpjbf3m2jqRbjB3IQ1P20Zmnyhz46PSyZLRLpa1EYKwPdLRatCwf7TN2Kg1ftcEcRCWRlwyd0aJx1IGjWjEMO4BF5GTC+C5L2CUTsrSvFf83A8S80ZBi8daSmqVSFJMfSciS0JbBYrcRoyTSZYQCMK+NyMcNzPMsxsPWQWn2FV9h/b4nhw/0Bz7sXjHyJ45LKOhGr5Enp1BnEFOZTpPoF9+x5dtLxKUU1kYioKqz98ajFp3cZX24nxlLliRp2LgHsXWuxfOb1f75V8LK8Do/QP5Mpfy5hWariw6sfsSSLF6ZrsWh0kV7clWVupKg/eLU6lCfIckpOc80hnZLiK2GgLvA9pAiiR6Yh1odD8JNTuuf76+GP//0v71/0xZb5l8OlEvjnoJx9vBK6hUkXU+m0kqWLUkKfSJar1iJt+qGPTo9ofB12c8+N+NtYbW2gEVX9ZRH5uO+Vs4rv4XvKTKh15g81nehaiQJQihQz45ADEES1VdgMDSn1CURcGzGYd85P1l/gcDyT5ZAvbN5sHkgzOLSgNaQttYTeEXd37aw4znpgWnqsJ/ffS41n2xalM0YhelWKD2nFM+dzFclz1Hgc70kTRJZVGDQxsWaHJKfUvxaspAEkTT4P5MoSlaQx0bbqm0Gq+UQ1fTSHH7Rbe5n/SofKaBFK5oGwF3f6wEfwqmP3fz3Y8dCTLTbdrZSRjbp3stW2QBIlnHLmTelG4WL+D4RMaAcx0z9oyCRc7aLXmcE+qfxtoszsB1hDpFPYPzgVSfXOrssOz2YCGFi1Gj3y/h0AR6O5DhYDxbV93gH0/PlhWkwEP7/JQeHuLiOCjkK9nNE5SYByo/yA8sapnSkBM2zcb8dDgUCYCZ5r4x4uvfv1cup0tU9DSfB21ZyYDRA+luLIUumZJyYuY8EcnvRjcKhI/kEJJnHBC4siqmnRor4T5s2GhnGBM2YZB7XblBV+dBuyDdPbQKfXfi30FFMfD+9X383JIo+klSHZRenZJLFeuWKD80SNxvJ8X3zrwbKmE193GzKMZwAW55wcEoWnPxXNZIjRN6wPNw4ZWpaxU2m+c9cukAb9LeS5rYxHK/+YJ6lRt6snTPK8ImwVyQUAZ1hasRGT7FlCSVYxwCxOK0XnGmsCFwDYS44DoM7afny9IE0W2fHj9r9wCedunbgmGi20lMoEV4lg/8iTJIQuNF4PauvEffwkj9OmcHVtIkWgTb7ce6mWI2KVsSkZkShNz0AChnE6wwxeB2YCTH0fBxqmpX/cl1HpTmJELYTtcjOhe1RMvNC7MB5JgyxzAQT0K1qkDHhlMCfEIdElhwFQoeIJ5VEpUG+bo5Xh321L1mjiRyVBeSId8HiRxPPxiacLL5N0IKD8n7Iklb0U8U4+nzOsFNgES8KndUQ2zdqd//aROTwmxkXSnW5CJMB4qOBCFMsUr1nBt0hYu4Hdl4mrojjoEYimaHDMcxxQgRyVAlOrUXGzHu2+Wy+80MeSRWGW0uei3CAgD8Kr3TiICDbbExT0FApHk7y1AfbSXmDES1GQlFLw8Ho/SbZJTS8JcoQYD9ItmyfNpx7JX7zxAQgQ8yICFe0wo6fwTq7QTB2O+EjCJABX7yBUHpBbx63VQG9BD10H6J4+1ZY/6/Xc1NWBYAGR98kQk9ZwCx72T+zGU5LbnJ5mpf24JNknXpCr3eWWdnyv4ho3I9yl+aY1wV20EGTvydfNpmyir7LwWgjgBuhmY60f094e1eYtVcZdnJu6bsKCjv2xb9pBMrg9WDLZMSZ2zUozIDCarhS7VPHPCoiuPYsgEl+jT691CbpaVxU4952iRTxD0/Jgq7z6QXqGvH2oE0hIaFTWpNuyWh5E1OM56aZnwzSSZAPxgc89+moYiXOawJEa+8uGJlu7bztr5Il0blZHzekOWLyI78PTSkGncWxqxTMTNrZKlmSKFxeyAPp0rvVakRNIV2u33nEV0nLxemI+84g0yl5XsSg2hUjl2OQTTR0VwTzMbmLUaz69Ovp6JCNpJJq2utal80oavwP1QjU+VFBJkeBFUCuIhloBhtEVXGwTtPvHp66ka/ECuGz/st9NWHEEdpT81bklNtU1BINDux/v/X4971tXVO/7fNTQJS5fBJi7x/mYAGJQ57w3OlolzHm2NGaBe/fkACf0RHi/hGvkUx2/ixHWu3XGvFxDA0nEOKcXKssIOCf0YSA55BVVqcU3NMbAfa17kCv/dmWenbKT1Vhj5PfXU5ZMUO+zHYjEagHlwt7ZNzBnV1hxNoKn4YG/J+eua4YZvAzcQm19CQ85RtfqVve4JBIjwEvBFcvvAaNp/5DspfovsrDNjEVoNjom/XFFSHoSuw5PUBRifG5mg7cgJ3SLdcvXUqgyd383YT/fQVmQHrrpU8DHSRFojPtOxnvXW08LMmMeTOfDl9ez/fGt6C38d9QgYq+qEDNwbGKxNRb+GVRKOSd8sFD+ayChOccYDdHA9MwazROiNQbqnobr1w+GZ4eSaNi7W+5H218em8G2+gEBjrggNMP/8KOZmXWbQZnl0Rfg26Kl8sKE9+YywBkcg4uVIGYghaUeIh+7RBFOUm5Vii4nxlifwEL/g8QUW+0YOmMwb3kgDaGCZskHFXTDnbnpgH+4Xfv4esB+7z5fhTYLgakJR9dVL6fBUKl02vA5gI1WnNUlgFu/ftSAvK33nGL3KD4CFRLeD/KZxSlSEJmICi5C5jbaD7HAfIgAJqKMmFXCDe6tDE23bWxEWoyVQM9ceBMr1I0VIT/2lLst8NQ1ZwwtjNW6YzWCT3Zz9mM9VoIXf8QFNAeKGKgSU43iXLpsrMtzzjHLrG6ne8TlrMrWMbF3QGqxVvshdyc5U+Z5fa9vuc1NZ6xIXJGy6KgksqUHOBKXiWaRPRJlmEm6hlqAUpSGJV4bhHKsSLzMaOry3FjQtFVPBq/dvT+OdtA/2wmiYnanPD6i9QGdMfhc9Fh5ND5cav47DYa8/lWobH28ucEPhJFM1mPDg9eC33nGok2iLfuheS3Q8p12BR7DjQDJMX5quZr1mxglqiQO607NjymOuT2TyN6SEyG8gZQa5Yf+/6Up0QZTkYqhSPNmIyjMjr9pchnO44+RSJB9xjMEXePw+fL1N661U3nnJwWRM007pycl5EHTX6QMpiWM65xzz9mLW/dLPx/JOUrrhvVsx2CthxhZ4chOyoZMBuNrnCuuv8B3Fg2WOGP3m3snFDJzBY6wxy4zrYXZWYX+KTU/ZPnji4D4ryLENBME25nBcb0hvzf8HyYs9FDscGKrhqYMTB7UDf8NVu3679Ng/caU3C5n4sO7Qyo+VaAHZDnQuxN92EN6BnHe9DSv7Lk8mwJa5x2xiFEGRc7ZWYg47dcw6Q92AMwwzc5NoxE/OBV2G3oAEefG5zrAX4NxqTtfKwyYKoIpvojZOIJY0mS//sgE8HOXm/5/gL9cJCk2YqNTrtZiGaMJAe76cdNEFbkUacYaIyLOAOGqexdmxXkwF/wdf/vuIsbw++sj6nrUkdJ3dAFtzwtXkN4I48WvTh56YBgJ62t/TS6mqXcpddNa1bqsLhAG+5x48Pppso2jUPIvasxbcfOCRjrjlZrSLiKR45zUClrSggXXeHU4OZYTzZtFAXkFcRd4nq7mZq+4w7qeLTZ+KsjOvv3ST8VsTvEZOEkMnS5/rNP41b5R5TaWnEydvzEYZoHlFAl82kg4owatYv7qJCVlkFlrSmyT1ysIw2qY9kf4+hlry7j+KG58VX75f8AruAoo+EigHgICMWIb7uE0Ag7UElg1H6G5beWxpB7BIBvXaQCEAeExLoxRqzIOg8lMzmT3btvTYqfQxdPWBlYnTPaFE8uDmP53nykHKpUeBgAA+FqzXPnXnFxupJpJ/anxv3V/ektp6Wd2acm/grgmJo62zkb3gtcC+MuRoGWldB3hIE0+OhJnluzSD0ZId6XChh0ZVgX870GnBmMeqUDQxQVaBiSxUc/TTtH+kv+yKzPH8y34cLexcDwxE0wsR2SCTbgvOYqIS2J+jWBepuzhrqZnztaGRrxRTtuhadoOhc3FHr9ARN8mshHUXI8CRY8btR0/v3Pc9Js1XfigVXTTwVHo0azvlXA22oyvHYOuAJV6YDDKTNjO9c23zj0O50nSv/9LTaP8wVHLg11vm6EMj1NIRY4IFL8g9iVvziZZEDoNw05YyQEmng/uLlKlOgOiBEXu82kphOHF+qNSE5xPE8inrLKrvVLHfL2mi8wrIz0u0AMJRPICkGutVBK++MUEscfRZSY/kg6KL1FhmFq7tgIUF3PUwuq+b1XuEaS98hcQ0zIuI6tUM10UDUQjlxe7MRvzcxoLKDM8Nm2b2Jb/qJxq6tpEkOE5ypNOYcPXjHqhevoydUfjv47msYalEn9Sr/BgsVWilcP1a3qTsBEdcYHOSF20K/POsFqozFBdLjEj+FR0NXpo/7002I2PN13JRcLZ0jKb/ug7PCDzwVFXrQD9UUW4P3cJ4lc6E/2qB6xxfwQ34n/l6HmW1YCkS0ioBGkkws+HNoipHr9eGAQ2a9ricHN7WHfVSkjDjzVS1x9dm/Avu1d3MKGj85t3P2GO1D8pJOIyUe1dSv6x0sFmUZZfkitDriHmtKWU9vCLLlGVKWOLUTlFzwqkzf4bWGuCCQ5wsndwwHJRUDFthF8uT5VElAtrKEuPUL2uHxw2N8NqRlNstQVzDLQVEFfW2/umm8XsTtcJzGCfe2s/XHCpr5zizjn+BnGTeSMCoiFGjOrpsrE2bjHhHLPFdb5gKPgR/nqwJa8bqjyXaICoBiWUdU/23+3D9f3L0xY5NqgRl7N/TBBT+y8vmd7Y9xQWwoyNSS9uy5OHF+wChCN2SA4zcNI5GvE+gQKDZA67Ny/Xo4Gjjgr25o25R413SFPvmEjjl+psy20nzKM8jEx3Lqqngi7y23sNnzqQY2p2VIH18oMaHhBOfWY63ByHD8TcnPHT4mixOjR+DSr9y4e6bfw+Or0CnEMEcacn6M46V2TMmGlnnGd1SDGP//pI1LKS0bn8vi+rvTbBIZjzvaKFt+91rGYynyf40YRSnih/ymHmvsFwvlgxgzl6o5asY1XgUfyiLIpKUZ6xmZ/wdn3qz70BrapyXxLjb/9+XOK79j6FfSy4HTH6oSLDAsmHoVONMidFp8fkCBd0oQKCW1AsQA51jMAsNrkuFha/DITzst3K85BLDKLfIa2J7PGUjtKP8vggeBiJq4RgceO45JQZNVfZZ1qRL3LslOs9D4fnO4HZZDipyz/QYIW+EEPZyBVIkI5Ugv+96mLQO32tHsUTBcelamyTPnfbG0z1mAcW9HlkaRQR/6f9/ab1kMaoVFIzCpwOAIH0+Co5f+H5jWOwXwK4cDNQ3pqfCHOBPdXFOJb/y1gTtpoBcEyjvW2yyPpPdvJI30lwdvwegHDfkURiVkUPLBXyqVei5lmWajiG+QN8HB/NG/sH0+v/hcbw04enwb8R9/TMEG+Fk5380AyeqXRqUpbJUO8YBEWiV9re3idPde0cwdPbp4/1Y812W3d39+uZlChSLmyFdnz+4mc0UOn4qeR7R2RSf/0xUNv0IzDV9+WB9fvwMLORVpA20g4vVhxDabxYKCh/ZDgAFrS3UIpOqzBBV7gjgikHi7PuUuallPSHJSg7KD7S/4/ZmPbhRErfXl97niQBrp+vn2yk1YnrnnJnQ4u8hgVZDhiCctHc+1i5wu3WyKYvngcCffMuMMjVqqQTbUhN7oNZIr5OM8BOflXt4iS7G+bP/WYh7jYtdp3whKbUBFksYp4VsPV6WZz0nhBrVwc9OlmgCxyZFH2666HnadpwaDW+iTbVJoo8FOeuPEv22DWXFfklUE7OV1v8HxAAceCZ03NgZRyv+RfJJn8DgFf7NnHzXG95TP+rUwLeONld2QjQguD1D22kPmfg0d6AJj1wt5SAuNB1w9vvGvESl7Tf51SC1DCfvY3o7yz3sRdwJy6/ajNBRmNyjBbrjDWzZQUyfs7e6GUufhvgkK8kt0TE1xOL0sMTVOflZAzVrzRqih4+4nnQtnlFIXpdO/vofugc8Edker7pvDZ7oS1O0aVOcQlxry9W8k0CX2FmS985+w+gbTbVDYkVjoP+jVWrUIuYdbq1X3e0xgGdAz0LPq1uiy+6M2/h/mydY6QDJ9WgofvNbNQi5KY2tdJfNR4AfpM9+ADAt63zYf9bUKMfglveWisUGiBv9i1PJdo8qeE+vKyfX/Udj9vYRS28BfwlJb+aa2pQ1lbv6yDrAb7RzzF77HmFu+6j5zd6TZeJzVMljm35GJhVrboah6LWGMq0f3NrJjDxt7QBG1E4FtgBJKPWWJhJ0EYGj+lxfCDHCbr5/NY2us1N7Fr31Te4qqq0V0vj2/hBfffBKrlhvR7b+knl1nVlyQ/vs/zWzDywkTHrI7yY9swkEtGitfh1Df3WTYy90tatb/PKQc6RQjJGlYve5/Cf935Rf39sgL/VrwpketTaKLK+4ZPanVd2ypFZpGbRH62PADof2hkF4tST9JHwnrfTP4QZT5WNqgKqh9N+8ImbvuNqmrth/lTbHJ/DFLpQKKiEshPGzF+cD57esN5lji0GxvtebTlNEcr7PN/Ots7+ctyASIYXkePnApcK+FTQy1nSFoy94Umr2tgLcTBXESV7zE02B3EKfarAt3ymjR7Uu33KPNVbpd4+tJG3AO/gpF7CXIjSxrw7hONL22+Ar4nzmns7KNvJfaHAVIWdIdj5zLKjAuxu53xPLzuqHWtT+4jGQcoccCZd4FgUdfWPaq6Dei88spPKDUkVVNmg82fKlA2aVOcDeJ8y2W9xCt+tVGN8GmN8Q8UV4F1h7rLusiQbAD7g1uv6VSUX+xVAgDuzsI3FRgiRYj6AF3tlWBAAxxAk3LgA0O7dvgKJPCBE7FIFKci8ChYHugqKXB7SsVgQinoXoMiIuURPza/vcAMNU3zEESHL13DUeayIYGHOzZYkY7YrDIA9wuCY6yPP4B5HirC/4V0kutbfqlCOoeIrgD//VgvM7OhHiZAqU45YEXbmxubDYTzSemNd4YUu6jQi/jZDe4LB89OxcwwDlhyMgWg71kifLlLhznGGB1vdw9tY2GtKe6QBGgeK7lzGT7Eyev3paGEx2u2t7+OOkcTS5BE8eWOMNtXBjTFcjaP08UEY1EBGlv7KyK+naA9Q8EWYtGU6SeW7xB3AAQLJxV23DXDQQIcs4crNIO7+8DDYHffc50nJi3eh8MBDjzzmw5dfYeAvwBAqTzxV6LmlDjsi0H9BgoUIFeaFl4q8ev1eX+2fSAmKldIpUa7MFolODUz2Vwo9y/+7Q6VKky7DayOMMjoKRkZDZmzIkh0HcuQaI89Y400wzlYTHZWvklaBLubqqptJpphqsu566KkXo3NOJ7YtlTbWeZwghSKxrURqJ5PbKxyUKooGkGHVnEarc3RydnF1c/fw1EdTK4OXL2/ffvGr3/xuJJLIFCqNzmCy2ByuiSnPzNzC0sq5C5euXLvhu3Xn3oNHkA+w0SbmZCxeLdl/NTlbdhVnUAZnSApTlOKUuKBeg0ZC0a6bzZ7Yfizb0cwobEPhcSAVp49+osTgEzjuGEnV9trnkstuOuGkU067EZ0ZLmKnzEyrKidSpdoZDCeOlutvRxU4nHHNMct88yww3S+c7zd9FdTQQAsd9DDACBPMsBwW+sFX1jB653tf18MGu/zx//YmPb/IbwF3Bh3zOj//+3mVKNX6ks7X4ZTyaLDiHsPawHRdv+/C3T7FXxaqgQ/PNIQaa6JUpoMqpc1caKa5Floafsbky2mrnfaFPtLJzB/Eu5jwQRD+iWSdRuiKaZ4FPdEqm7p02Dw6P4bvQi9hR897M7UtErPrNkchBRafg+QO44KuX6dOGIsqWycLktBunS7R6jejpC7V5OQUFMPlcI3Mwg3RHWwVJqXsuDDi0BY/VXTttiz9AxM286Zc2jbqSddU0xbsxTB1wllU2XrcorkpOyc1T7QQwvhQJPpDakQ9k+/WSNFhZMfOrpUu6lP/OH09z3rreBCN/FR2+nw+KCEWBbEqGu3em2CHQH4XQ7LR4Wt/nHCXVH0Drjvq61CdtV689WbyY7tung4UnpGrfDuhozxoIR4deQlz5nqMOmkH3L0h1XZ0+Howrs8ZpCjCxRH/Wn5I76Rd/N+wifTdgd7O0p/5nSCbbXxn9C2fxObgNz5dKDzmO6s+Oz7bOyNWHn+iOMs6ZTklPhWffPhp1fzv/nU+Xe4/96RlYlZlMU+DZf3TDN7PqyBl4q+zFuzfNw5yNMNr9hvXjE60B368YM87N6XG5049pTuVeGrwvsZml/5vnLilY5kbN8TjqUVBCwA=", Qy = "data:font/woff2;base64,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", Jy = `The night has fallen deep and the young(?) couple is ready to get married, but a tragedy happens. They're out of drinks in the party. They go out to get more drinks for the guests and they engage into a zombie apocalypse.

Collect as many drinks as you can to increase your score. You lose a life point each time an enemy touches you. It's game over if you lose 3 life points or you fall into a pit. Jump to avoid enemies and pits.`;
class Zy extends Le {
  constructor() {
    super({
      label: "introduction-screen",
      alpha: 0
    });
    const t = this.addComponent(
      new Kt({
        label: "text",
        text: Jy,
        fontFamily: "PressStart2P",
        fontSize: 24,
        textColor: 13421772,
        position: { x: 20, y: 20 },
        wordWrap: !0,
        wordWrapWidth: V.screen.width - 40,
        align: "justify",
        lineHeight: 40
      })
    ), e = this.addComponent(
      new oa({
        label: "continue-button",
        resource: "continue-button.png",
        hoverResource: "continue-button-hover.png",
        disabledResource: "continue-button.png",
        position: { x: 0, y: t.y + t.height + 40 },
        horizontalAlignment: "center",
        interactive: !1,
        cursor: "pointer",
        anchor: { x: 0.5, y: 0 },
        onClick: async () => {
          e.interactive = !1, await this.animate({
            from: { alpha: 1 },
            to: { alpha: 0 },
            duration: 1
          }), this.parent.showCharacterSelectionScreen();
        }
      })
    );
    this.animate({
      from: { alpha: 0 },
      to: { alpha: 1 },
      duration: 1
    }).then(() => {
      e.interactive = !0;
    });
  }
  _onResize() {
    const t = this.components[0];
    t.wordWrapWidth = V.screen.width - 40;
    const e = this.components[1];
    e.y = t.y + t.height + 40;
  }
}
const Q = {
  selectedCharacter: "girl",
  started: !1,
  speed: 3,
  originalSpeed: 3,
  score: 0
};
let $y = class extends ce {
  constructor() {
    super({
      label: "boy",
      resource: "boy/boy-selection.png",
      position: { x: 224, y: 79.5 },
      anchor: { x: 0.5, y: 0.5 },
      interactive: !0,
      cursor: "pointer"
    }), this._registerToSignal(
      N.signals.chooseCharacter,
      this._onCharacterSelection
    );
  }
  _onClick() {
    this.interactive = !1, Q.selectedCharacter = "boy", Lt(N.signals.chooseCharacter);
  }
  _onCharacterSelection() {
    Q.selectedCharacter !== "boy" ? this.animate({
      from: { scaleX: 1, scaleY: 1 },
      to: { scaleX: 0, scaleY: 0 },
      duration: 0.2
    }) : this.animate({
      from: { scaleX: 1, scaleY: 1 },
      to: { scaleX: 1.1, scaleY: 1.1 },
      duration: 0.2,
      revert: !0,
      repeat: 1
    });
  }
}, tx = class extends ce {
  constructor() {
    super({
      label: "girl",
      resource: "girl/girl-selection.png",
      position: { x: 64, y: 79.5 },
      anchor: { x: 0.5, y: 0.5 },
      interactive: !0,
      cursor: "pointer"
    }), this._registerToSignal(
      N.signals.chooseCharacter,
      this._onCharacterSelection
    );
  }
  _onClick() {
    this.interactive = !1, Q.selectedCharacter = "girl", Lt(N.signals.chooseCharacter);
  }
  _onCharacterSelection() {
    Q.selectedCharacter !== "girl" ? this.animate({
      from: { scaleX: 1, scaleY: 1 },
      to: { scaleX: 0, scaleY: 0 },
      duration: 0.2
    }) : this.animate({
      from: { scaleX: 1, scaleY: 1 },
      to: { scaleX: 1.1, scaleY: 1.1 },
      duration: 0.2,
      revert: !0,
      repeat: 1
    });
  }
};
class ex extends Le {
  constructor() {
    super({
      label: "character-selection",
      horizontalAlignment: "center",
      width: 288,
      height: 159,
      anchor: { x: 0.5, y: 0 }
    }), this.addComponent(new tx()), this.addComponent(new $y());
  }
}
const ix = "You can make both characters jump by clicking/tapping on the screen. Anastasia can reduce her speed if you click/tap on the screen and hold it for a while. She then jumps higher when you release it. Nikos can perform a double jump if you click/tap on the screen again while jumping.";
class rx extends Le {
  constructor() {
    super({
      label: "character-selection-screen",
      alpha: 0
    });
    const t = this.addComponent(
      new Kt({
        label: "text",
        text: ix,
        fontFamily: "PressStart2P",
        fontSize: 24,
        textColor: 13421772,
        position: { x: 20, y: 20 },
        wordWrap: !0,
        wordWrapWidth: V.screen.width - 40,
        align: "justify",
        lineHeight: 40
      })
    ), e = this.addComponent(
      new Kt({
        label: "choose-character",
        text: "Choose Character",
        fontFamily: "PressStart2P",
        fontSize: 24,
        textColor: 16763904,
        anchor: { x: 0.5, y: 0 },
        position: {
          x: 0,
          y: t.y + t.height + 40
        },
        horizontalAlignment: "center"
      })
    ), r = this.addComponent(new ex());
    r.y = e.y + e.height + 40, this.animate({
      from: { alpha: 0 },
      to: { alpha: 1 },
      duration: 1
    });
  }
  _onResize() {
    const t = this.components[0], e = this.components[1], r = this.components[2];
    t.wordWrapWidth = V.screen.width - 40, e.y = t.y + t.height + 40, r.y = e.y + e.height + 40;
  }
}
class nx extends Ki {
  get _introComponent() {
    return this.components[1];
  }
  get _characterExplanationComponent() {
    return this.components[1];
  }
  get _chooseCharacterComponent() {
    return this.components[2];
  }
  get _selectionComponent() {
    return this.components[3];
  }
  async init() {
    this.alpha = 0, this.addComponent(
      new Ru({
        label: "city-bg",
        resource: "city-bg.png"
      })
    ), await Promise.all([
      this.animate({ from: { alpha: 0 }, to: { alpha: 1 }, duration: 2 }),
      na(N.sounds.menuLoop, {
        toVolume: 0.3,
        fadeDuration: 0.5,
        loop: !0
      })
    ]), this.addComponent(new Zy()), this._registerToSignal(
      N.signals.chooseCharacter,
      this._onCharacterSelection
    );
  }
  showCharacterSelectionScreen() {
    this.components[1].destroy(), this.addComponent(new rx());
  }
  _onResize() {
    this._introComponent && (this._introComponent.wordWrapWidth = V.screen.width - 40), this._characterExplanationComponent && (this._characterExplanationComponent.wordWrapWidth = V.screen.width - 40), this._chooseCharacterComponent && (this._chooseCharacterComponent.y = this._characterExplanationComponent.y + this._characterExplanationComponent.height + 40, this._selectionComponent.y = this._chooseCharacterComponent.y + 40);
  }
  async _onCharacterSelection() {
    await Promise.all([
      yi(L.sounds.click),
      sa(N.sounds.menuLoop, { fadeDuration: 2 }),
      this.animate({
        from: { alpha: 1 },
        to: { alpha: 0 },
        duration: 2
      })
    ]), Lt(N.signals.goToGame);
  }
}
class sx extends Bu {
  constructor() {
    super({
      label: "background",
      resource: "city-bg.png"
    }), this._registerToSignal(N.signals.moveScreen, this._move);
  }
  _move(t) {
    this.tilePosition.x = -t;
  }
}
class ox extends Le {
  constructor() {
    super({
      label: "info",
      position: { x: 20, y: 20 }
    });
    $(this, "_totalLifePoints");
    let e = this.addComponent(
      new Kt({
        label: "life-points-indicator",
        text: "Life Points:",
        fontFamily: "PressStart2P",
        fontSize: 16,
        textColor: 13421772,
        position: { x: 0, y: 3 }
      })
    ).width + 10;
    for (let r = 0; r < N.lifePoints; r++)
      e += this.addComponent(
        new ce({
          label: `life-point-${r}`,
          resource: "life.png",
          position: { x: e, y: 0 }
        })
      ).width + 5;
    e += this.addComponent(
      new ce({
        label: "separator",
        resource: "separator.png",
        position: { x: e + 10, y: 0 }
      })
    ).width + 25, e += this.addComponent(
      new Kt({
        label: "score-indicator",
        text: "Score:",
        fontFamily: "PressStart2P",
        fontSize: 16,
        textColor: 13421772,
        position: { x: e, y: 3 }
      })
    ).width + 10, this.addComponent(
      new Kt({
        label: "score",
        text: Q.score.toString(),
        fontFamily: "PressStart2P",
        fontSize: 16,
        textColor: 13421772,
        position: { x: e, y: 3 },
        bitmap: !0
      })
    ), this._totalLifePoints = N.lifePoints, this._registerToSignal(
      N.signals.loseLifePoints,
      this._removeLifePoints
    ), this._registerToSignal(N.signals.updateScore, this._updateScore);
  }
  get _score() {
    return this.components[this.components.length - 1];
  }
  async _removeLifePoints(e) {
    for (let r = this.components.length - 1; r >= 0 && e > 0; r--)
      if (this.components[r].label.startsWith("life-point-") && (this.removeComponent(this.components[r]), r++, this._totalLifePoints--, e--, this._totalLifePoints === 0)) {
        Q.started = !1, sa(N.sounds.mainLoop, { fadeDuration: 0.5 }), yi(N.sounds.gameOver), await this.delay(4), Lt(N.signals.gameOver);
        break;
      }
  }
  _updateScore() {
    this._score.text = Q.score.toString();
  }
}
const Fs = {
  run: (i, t) => `${i}/run/${i}-run-${t % 8 + 1}.png`,
  jump: (i, t) => t <= 6 ? `${i}/${i}-jump.png` : `${i}/${i}-idle.png`,
  idle: (i, t) => `${i}/${i}-idle.png`
}, ax = 5;
class qn extends ce {
  constructor(e) {
    super({
      label: "character",
      resource: Fs.idle(e, 0),
      scale: { x: 2, y: 2 },
      position: { x: 130, y: -100 }
    });
    $(this, "_resourceType");
    $(this, "_moveFrame", 0);
    $(this, "_moveSprite", 0);
    $(this, "_moveState", "idle");
    $(this, "_onGround", !1);
    $(this, "_currentJump", 0);
    $(this, "_pressing", !1);
    $(this, "_pressed", !1);
    $(this, "_nextIncreaseSpeedMilestone", 0);
    $(this, "_canDamage", !0);
    this._resourceType = e, zn({
      target: this,
      rectangle: {
        x: this.x + 49,
        y: this.y + 40,
        width: 46,
        height: 64
      },
      movement: {
        linearMovement: {
          velocity: { x: 0, y: 0 }
        }
      },
      onUpdatePosition: this._updatePosition.bind(this)
    });
  }
  jump() {
    this._canJump() && (this._currentJump++, this._changeState("jump"));
  }
  press() {
    !this.hasPressAndRelease || !this._canJump() || (this._pressing = !0, this._setVelocity());
  }
  release() {
    !this.hasPressAndRelease || !this._pressing || !Q.started || (this._pressing = !1, this._pressed = !0, this._currentJump++, this._changeState("jump"));
  }
  async damage() {
    if (!this._canDamage || !Q.started) return;
    this._canDamage = !1, yi(N.sounds.playerHit, { volume: 2 }), Lt(N.signals.loseLifePoints, 1);
    const e = this.tint;
    await this.animate({
      from: { tint: 16763904 },
      to: { tint: 16711680 },
      duration: 0.2,
      repeat: 10,
      revert: !0
    }), this.tint = e, this._canDamage = !0;
  }
  _onTick() {
    Q.started && (this._moveState === "idle" && this._changeState("run"), this._moveFrame++, this._moveFrame % ax === 0 && (this._moveFrame = 0, this._moveSprite++, this.texture = Fs[this._moveState](
      this._resourceType,
      this._moveSprite
    )));
  }
  _changeState(e) {
    this._moveState = e, this._moveFrame = 0, this._moveSprite = 0, this.texture = Fs[this._moveState](
      this._resourceType,
      this._moveSprite + 1
    ), this._setVelocity();
  }
  _updatePosition(e, r, s) {
    if (!(!Q.started && this._moveState !== "idle")) {
      if (this.x = e - 49, this.y = r - 40, this._onGround = s, this.y > V.screen.height + 100) {
        Lt(N.signals.loseLifePoints, N.lifePoints);
        return;
      }
      Lt(N.signals.moveScreen, this.x - 130), s && this._moveState !== "run" && Q.started && (this._pressed = !1, this._currentJump = 0, this._changeState("run")), this._canIncreaseSpeed() && (this._nextIncreaseSpeedMilestone > 0 && Q.speed++, this._nextIncreaseSpeedMilestone = this.x + this._increaseSpeedMilestone);
    }
  }
  _canIncreaseSpeed() {
    return this.x >= this._nextIncreaseSpeedMilestone;
  }
  _canJump() {
    return Q.started ? this._moveState === "jump" && this._currentJump < this._totalAllowedJumps ? !0 : this._moveState === "run" && this._onGround : !1;
  }
  _setVelocity() {
    const { x: e, y: r } = this._getNewVelocity();
    ra(this, {
      linearMovement: {
        velocity: { x: e, y: r }
      }
    });
  }
  _getNewVelocity() {
    return this._moveState === "jump" ? {
      x: Q.speed,
      y: this._pressed ? -15 : -10
    } : this._moveState === "run" ? {
      x: this._pressing ? Q.speed / 2 : Q.speed,
      y: 0
    } : { x: 0, y: 0 };
  }
}
class hx extends ce {
  constructor(t, e) {
    super({
      label: `drink-${t.x}-${t.y}`,
      resource: "drink.png",
      position: t,
      scale: { x: 3, y: 3 }
    }), zn({
      target: this,
      rectangle: {
        x: e + this.x,
        y: this.y,
        width: this.width,
        height: this.height
      },
      onCollision: async (r) => {
        Q.started && r instanceof qn && (Q.score += 10, Lt(N.signals.updateScore), yi(N.sounds.coin, { volume: 2 }), this.destroy());
      }
    }), this.animate({
      from: { y: this.y },
      to: { y: this.y - 5 },
      duration: 1,
      repeat: -1,
      revert: !0
    });
  }
}
const lx = 5;
class cx extends ce {
  constructor(e, r) {
    super({
      label: `position-${e.x}-${e.y}`,
      resource: "zombie/walk/zombie-walk-1.png",
      position: e,
      scale: { x: 0.2, y: 0.2 }
    });
    $(this, "_started", !1);
    $(this, "_distance", 0);
    $(this, "_moveFrame", 0);
    $(this, "_moveSprite", 0);
    $(this, "_acceleration", 0);
    this._distance = r, zn({
      target: this,
      rectangle: {
        x: this._distance + this.x,
        y: this.y,
        width: this.width,
        height: this.height
      },
      onUpdatePosition: this._updatePosition.bind(this),
      onCollision: this._onCollision.bind(this)
    }), this._registerToSignal(N.signals.moveScreen, this._onMoveScreen);
  }
  _onTick() {
    !this._started || !Q.started || (this.x + this.width >= 0 ? Hh(this, -1, 0) : (this._acceleration++, Hh(this, 0, this._acceleration)), this._moveFrame++, this._moveFrame % lx === 0 && (this._moveFrame = 0, this._moveSprite++, this.texture = `zombie/walk/zombie-walk-${this._moveSprite % 10 + 1}.png`));
  }
  _updatePosition(e, r) {
    this.x = e - this._distance, this.y = r;
  }
  _onCollision(e) {
    Q.started && e instanceof qn && e.damage();
  }
  _onMoveScreen(e) {
    Q.started && e + V.screen.width >= this._distance + this.x && (this._started = !0, ra(this, {
      linearMovement: {
        velocity: { x: -1, y: 0 }
      }
    }), this._unregisterFromSignal(N.signals.moveScreen));
  }
}
class qh extends Le {
  constructor(e, r, s) {
    super({
      label: `platform-${s}`,
      position: { x: s, y: 0 }
    });
    $(this, "_topOffset", 0);
    this._topOffset = (8 - e) * 32;
    let n = this._topOffset;
    n += this.addComponent(
      new Ir({
        label: "platform-top",
        resource: "platform-top.png",
        width: r,
        position: { x: 0, y: n }
      })
    ).height;
    for (let o = 0; o < e; o++)
      n += this.addComponent(
        new Ir({
          label: `platform-middle-${o}`,
          resource: "platform-middle.png",
          width: r,
          position: { x: 0, y: n }
        })
      ).height;
    zn({
      target: this,
      rectangle: {
        x: this.x,
        y: this.components[0].position.y + 4,
        width: this.width,
        height: this.height - 4
      },
      surface: !0
    }), this._createDrinks(s), this._createZombies(s);
  }
  _createDrinks(e) {
    let r = e === 0 ? 200 : 0;
    const s = 37, n = 49, o = 5, a = 5;
    for (; r + s <= this.width; ) {
      r += ze(0, this.width - s);
      const h = this._topOffset - n - ze(0, o) * n, c = ze(0, a);
      for (let l = 0; l < c && r + s <= this.width; l++)
        this.addComponent(new hx({ x: r, y: h }, e)), r += s;
      r += 20;
    }
  }
  _createZombies(e) {
    if (e === 0) return;
    const r = 40, s = 61.6;
    let n = ze(0, 1e3);
    const o = this._topOffset - s;
    for (; n + r <= this.width; )
      this.addComponent(new cx({ x: n, y: o }, e)), n += 300 + ze(0, this.width - r);
  }
}
class ux extends qn {
  constructor() {
    super("girl");
  }
  get hasPressAndRelease() {
    return !0;
  }
  get _increaseSpeedMilestone() {
    return 2e4;
  }
  get _totalAllowedJumps() {
    return 1;
  }
}
class dx extends qn {
  constructor() {
    super("boy");
  }
  get hasPressAndRelease() {
    return !1;
  }
  get _increaseSpeedMilestone() {
    return 1e4;
  }
  get _totalAllowedJumps() {
    return 2;
  }
}
class px extends Le {
  constructor() {
    super({
      label: "platforms",
      verticalAlignment: "bottom",
      height: 292
    });
    $(this, "_limit", 0);
    this.addComponent(
      Q.selectedCharacter === "girl" ? new ux() : new dx()
    ), this._limit = this.addComponent(new qh(2, 1e3, 0)).width, this._createPlatforms(), this._registerToSignal(N.signals.moveScreen, this._move);
  }
  get character() {
    return this.components[0];
  }
  _move(e) {
    this.x = -e, this._deleteExpiredPlatforms(), this._createPlatforms();
  }
  _createPlatforms() {
    for (; this._limit + this.x <= L.screen.width + 1e3; ) {
      const e = ze(1, 8), r = ze(200, 1500), s = ze(100, 200);
      this.addComponent(
        new qh(e, r, this._limit + s)
      ), this._limit += s + r;
    }
  }
  _deleteExpiredPlatforms() {
    for (; ; ) {
      const e = this.components[1];
      if (e.x + e.width + 100 < -this.x)
        e.destroy();
      else
        break;
    }
  }
}
class Kh extends Ki {
  constructor() {
    super(...arguments);
    $(this, "_cancelClickDebounce", null);
    $(this, "_keepingClick", !1);
  }
  get _platforms() {
    return this.components[2];
  }
  async init() {
    Q.speed = Q.originalSpeed, Q.score = 0, this.alpha = 0, this.interactive = !0, this.addComponent(new sx()), this.addComponent(new ox()), this.addComponent(new px()), await Promise.all([
      this.animate({
        from: { alpha: 0 },
        to: { alpha: 1 },
        duration: 1
      }),
      na(N.sounds.mainLoop, {
        toVolume: 0.3,
        fadeDuration: 0.5,
        loop: !0
      })
    ]), await this.delay(1), Q.started = !0;
  }
  _onClick() {
    if (!Q.started) return;
    if (!this._platforms.character.hasPressAndRelease) {
      this._platforms.character.jump();
      return;
    }
    this._keepingClick = !1;
    const { start: e, cancel: r } = ha(
      () => {
        this._keepingClick = !0, this._platforms.character.press();
      },
      () => {
      },
      300,
      0
    );
    this._cancelClickDebounce = r, e();
  }
  _onPointerUp() {
    var e;
    !Q.started || !this._platforms.character.hasPressAndRelease || ((e = this._cancelClickDebounce) == null || e.call(this), this._cancelClickDebounce = null, this._keepingClick ? this._platforms.character.release() : this._platforms.character.jump());
  }
}
const fx = [
  {
    name: "default",
    assets: [
      {
        alias: [
          "audio/sounds.json"
        ],
        src: [
          "audio/sounds-EgVUtQ.json"
        ],
        data: {
          tags: {}
        }
      },
      {
        alias: [
          "audio/sounds.mp3"
        ],
        src: [
          "audio/sounds-wkfo.mp3",
          "audio/sounds-r-WDeQ.ogg"
        ],
        data: {
          tags: {}
        }
      },
      {
        alias: [
          "default"
        ],
        src: [
          "default-YXsikQ.webp.json",
          "default-ywsHNg.avif.json",
          "default-qcXbTg@0.5x.avif.json",
          "default-mXuFNw.png.json",
          "default-aN1TZA@0.5x.png.json",
          "default-5xZ_gw@0.5x.webp.json"
        ],
        data: {
          tags: {
            tps: !0
          }
        }
      }
    ]
  }
], mx = {
  bundles: fx
};
class gx extends Ki {
  async init() {
    this.addComponent(
      new Kt({
        label: "game-over",
        text: "Game Over",
        fontFamily: L.loadingScene.fontFamily,
        fontSize: 48,
        textColor: L.loadingScene.textColor,
        anchor: { x: 0.5, y: 0.5 },
        horizontalAlignment: "center",
        verticalAlignment: "center",
        margin: { x: 0, y: -50 }
      })
    ), this.addComponent(
      new Kt({
        label: "score",
        text: `Your score is ${Q.score}`,
        fontFamily: L.loadingScene.fontFamily,
        fontSize: 28,
        textColor: L.loadingScene.textColor,
        anchor: { x: 0.5, y: 0.5 },
        horizontalAlignment: "center",
        verticalAlignment: "center",
        margin: { x: 0, y: 50 }
      })
    ), this.delay(2).then(() => Lt(N.signals.goToGame));
  }
}
const _x = (i) => {
  const t = new URLSearchParams(window.location.search ?? ""), e = hr(
    L.signals.destroyLoadingScene,
    () => {
      pn(
        e.name,
        e.binding
      ), pr(
        t.has("character") ? new Kh() : new qy()
      );
    }
  ), r = hr(N.signals.goToIntro, () => {
    pn(r.name, r.binding), pr(new nx());
  });
  hr(N.signals.goToGame, () => {
    pr(new Kh());
  }), hr(N.signals.gameOver, () => {
    pr(new gx());
  }), L.gameName = "couples-run", L.assets.basePath = i.assetsBasePath, L.maxFPS = Number(t.get("maxFPS")) || 60, L.debug = !!t.get("debug"), L.assets.manifest = mx, L.assets.extra = [
    { alias: "Lobster", src: Ky, data: { family: "Lobster" } },
    {
      alias: "PressStart2P",
      src: Qy,
      data: { family: "PressStart2P" }
    }
  ], N.creditsUrl = i.creditsUrl, Q.selectedCharacter = t.get("character") === "boy" ? "boy" : "girl", Oy();
};
export {
  no as $,
  Af as A,
  xx as B,
  kt as C,
  D,
  Ot as E,
  Jl as F,
  H as G,
  ro as H,
  Li as I,
  Pf as J,
  en as K,
  bf as L,
  Cf as M,
  io as N,
  kf as O,
  Mt as P,
  Mf as Q,
  Qa as R,
  at as S,
  Vs as T,
  mt as U,
  sc as V,
  rc as W,
  tp as X,
  qa as Y,
  fa as Z,
  Ve as _,
  Ws as a,
  ft as a0,
  Ml as a1,
  Pn as a2,
  rd as a3,
  Ul as a4,
  Np as a5,
  Ka as a6,
  Xp as a7,
  Mo as a8,
  Ll as a9,
  xl as aa,
  Ae as ab,
  Ef as ac,
  ol as ad,
  Pa as ae,
  hl as af,
  Do as ag,
  q as ah,
  Rp as ai,
  zi as aj,
  lp as ak,
  kp as al,
  vt as am,
  Ma as an,
  Bd as ao,
  ns as ap,
  Gl as aq,
  nd as ar,
  _x as as,
  Ee as b,
  Sm as c,
  si as d,
  nt as e,
  sd as f,
  Rl as g,
  X as h,
  pi as i,
  K as j,
  Bt as k,
  gt as l,
  _i as m,
  xh as n,
  bg as o,
  Te as p,
  xm as q,
  To as r,
  yd as s,
  yh as t,
  dt as u,
  yf as v,
  xf as w,
  _e as x,
  Yl as y,
  vf as z
};
