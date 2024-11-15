var tu = Object.defineProperty;
var eu = (i, t, e) => t in i ? tu(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e;
var $ = (i, t, e) => eu(i, typeof t != "symbol" ? t + "" : t, e);
var iu = Object.defineProperty, su = (i, t, e) => t in i ? iu(i, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : i[t] = e, fe = (i, t, e) => su(i, typeof t != "symbol" ? t + "" : t, e);
const D = {
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
    keepAliveTimeMS: 2e3
  },
  signals: {
    onResize: "onResize",
    onOrientationChange: "onOrientationChange",
    onTick: "onTick",
    destroyLoadingScene: "destroyLoadingScene",
    showCredits: "showCredits"
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
var Ze = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ro(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
var gl = {}, yr = {};
Object.defineProperty(yr, "__esModule", { value: !0 });
yr.MiniSignal = void 0;
const gn = Symbol("SIGNAL");
function ru(i) {
  return typeof i == "object" && gn in i;
}
class nu {
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
    if (!ru(t))
      throw new Error("MiniSignal#detach(): First arg must be a MiniSignal listener reference.");
    if (t[gn] !== this._symbol)
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
    const e = { [gn]: this._symbol };
    return this._refMap.set(e, t), e;
  }
  _getRef(t) {
    return this._refMap.get(t);
  }
}
yr.MiniSignal = nu;
(function(i) {
  var t = Ze && Ze.__createBinding || (Object.create ? function(s, n, r, o) {
    o === void 0 && (o = r);
    var a = Object.getOwnPropertyDescriptor(n, r);
    (!a || ("get" in a ? !n.__esModule : a.writable || a.configurable)) && (a = { enumerable: !0, get: function() {
      return n[r];
    } }), Object.defineProperty(s, o, a);
  } : function(s, n, r, o) {
    o === void 0 && (o = r), s[o] = n[r];
  }), e = Ze && Ze.__exportStar || function(s, n) {
    for (var r in s) r !== "default" && !Object.prototype.hasOwnProperty.call(n, r) && t(n, s, r);
  };
  Object.defineProperty(i, "__esModule", { value: !0 }), e(yr, i);
})(gl);
const ir = /* @__PURE__ */ new Map(), gi = (i, t) => {
  let e = ir.get(i);
  return e || (e = new gl.MiniSignal(), ir.set(i, e)), { name: i, binding: e.add(t) };
}, ns = (i, t) => {
  const e = ir.get(i);
  e && e.detach(t);
}, Rt = (i, ...t) => {
  const e = ir.get(i);
  e && e.dispatch(...t);
};
function Se(i) {
  if (i === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return i;
}
function yl(i, t) {
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
var Xt = {
  autoSleep: 120,
  force3D: "auto",
  nullTargetWarn: 1,
  units: {
    lineHeight: ""
  }
}, Ti = {
  duration: 0.5,
  overwrite: !1,
  delay: 0
}, no, Mt, et, Zt = 1e8, tt = 1 / Zt, yn = Math.PI * 2, ou = yn / 4, au = 0, xl = Math.sqrt, lu = Math.cos, hu = Math.sin, wt = function(i) {
  return typeof i == "string";
}, ht = function(i) {
  return typeof i == "function";
}, ke = function(i) {
  return typeof i == "number";
}, oo = function(i) {
  return typeof i > "u";
}, be = function(i) {
  return typeof i == "object";
}, Lt = function(i) {
  return i !== !1;
}, ao = function() {
  return typeof window < "u";
}, Ls = function(i) {
  return ht(i) || wt(i);
}, vl = typeof ArrayBuffer == "function" && ArrayBuffer.isView || function() {
}, Tt = Array.isArray, xn = /(?:-?\.?\d|\.)+/gi, bl = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g, vi = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g, Er = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi, _l = /[+-]=-?[.\d]+/, wl = /[^,'"\[\]\s]+/gi, cu = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i, st, pe, vn, lo, qt = {}, sr = {}, Al, Sl = function(i) {
  return (sr = oi(i, qt)) && Gt;
}, ho = function(i, t) {
  return console.warn("Invalid property", i, "set to", t, "Missing plugin? gsap.registerPlugin()");
}, ps = function(i, t) {
  return !t && console.warn(i);
}, Cl = function(i, t) {
  return i && (qt[i] = t) && sr && (sr[i] = t) || qt;
}, fs = function() {
  return 0;
}, uu = {
  suppressEvents: !0,
  isStart: !0,
  kill: !1
}, qs = {
  suppressEvents: !0,
  kill: !1
}, du = {
  suppressEvents: !0
}, co = {}, ze = [], bn = {}, Pl, jt = {}, Br = {}, Yo = 30, Ks = [], uo = "", po = function(i) {
  var t = i[0], e, s;
  if (be(t) || ht(t) || (i = [i]), !(e = (t._gsap || {}).harness)) {
    for (s = Ks.length; s-- && !Ks[s].targetTest(t); )
      ;
    e = Ks[s];
  }
  for (s = i.length; s--; )
    i[s] && (i[s]._gsap || (i[s]._gsap = new Ql(i[s], e))) || i.splice(s, 1);
  return i;
}, ii = function(i) {
  return i._gsap || po(Jt(i))[0]._gsap;
}, Ml = function(i, t, e) {
  return (e = i[t]) && ht(e) ? i[t]() : oo(e) && i.getAttribute && i.getAttribute(t) || e;
}, zt = function(i, t) {
  return (i = i.split(",")).forEach(t) || i;
}, ut = function(i) {
  return Math.round(i * 1e5) / 1e5 || 0;
}, _t = function(i) {
  return Math.round(i * 1e7) / 1e7 || 0;
}, Ai = function(i, t) {
  var e = t.charAt(0), s = parseFloat(t.substr(2));
  return i = parseFloat(i), e === "+" ? i + s : e === "-" ? i - s : e === "*" ? i * s : i / s;
}, pu = function(i, t) {
  for (var e = t.length, s = 0; i.indexOf(t[s]) < 0 && ++s < e; )
    ;
  return s < e;
}, rr = function() {
  var i = ze.length, t = ze.slice(0), e, s;
  for (bn = {}, ze.length = 0, e = 0; e < i; e++)
    s = t[e], s && s._lazy && (s.render(s._lazy[0], s._lazy[1], !0)._lazy = 0);
}, Tl = function(i, t, e, s) {
  ze.length && !Mt && rr(), i.render(t, e, Mt && t < 0 && (i._initted || i._startAt)), ze.length && !Mt && rr();
}, kl = function(i) {
  var t = parseFloat(i);
  return (t || t === 0) && (i + "").match(wl).length < 2 ? t : wt(i) ? i.trim() : i;
}, El = function(i) {
  return i;
}, te = function(i, t) {
  for (var e in t)
    e in i || (i[e] = t[e]);
  return i;
}, fu = function(i) {
  return function(t, e) {
    for (var s in e)
      s in t || s === "duration" && i || s === "ease" || (t[s] = e[s]);
  };
}, oi = function(i, t) {
  for (var e in t)
    i[e] = t[e];
  return i;
}, Wo = function i(t, e) {
  for (var s in e)
    s !== "__proto__" && s !== "constructor" && s !== "prototype" && (t[s] = be(e[s]) ? i(t[s] || (t[s] = {}), e[s]) : e[s]);
  return t;
}, nr = function(i, t) {
  var e = {}, s;
  for (s in i)
    s in t || (e[s] = i[s]);
  return e;
}, os = function(i) {
  var t = i.parent || st, e = i.keyframes ? fu(Tt(i.keyframes)) : te;
  if (Lt(i.inherit))
    for (; t; )
      e(i, t.vars.defaults), t = t.parent || t._dp;
  return i;
}, mu = function(i, t) {
  for (var e = i.length, s = e === t.length; s && e-- && i[e] === t[e]; )
    ;
  return e < 0;
}, Bl = function(i, t, e, s, n) {
  var r = i[s], o;
  if (n)
    for (o = t[n]; r && r[n] > o; )
      r = r._prev;
  return r ? (t._next = r._next, r._next = t) : (t._next = i[e], i[e] = t), t._next ? t._next._prev = t : i[s] = t, t._prev = r, t.parent = t._dp = i, t;
}, xr = function(i, t, e, s) {
  e === void 0 && (e = "_first"), s === void 0 && (s = "_last");
  var n = t._prev, r = t._next;
  n ? n._next = r : i[e] === t && (i[e] = r), r ? r._prev = n : i[s] === t && (i[s] = n), t._next = t._prev = t.parent = null;
}, Ue = function(i, t) {
  i.parent && (!t || i.parent.autoRemoveChildren) && i.parent.remove && i.parent.remove(i), i._act = 0;
}, si = function(i, t) {
  if (i && (!t || t._end > i._dur || t._start < 0))
    for (var e = i; e; )
      e._dirty = 1, e = e.parent;
  return i;
}, gu = function(i) {
  for (var t = i.parent; t && t.parent; )
    t._dirty = 1, t.totalDuration(), t = t.parent;
  return i;
}, _n = function(i, t, e, s) {
  return i._startAt && (Mt ? i._startAt.revert(qs) : i.vars.immediateRender && !i.vars.autoRevert || i._startAt.render(t, !0, s));
}, yu = function i(t) {
  return !t || t._ts && i(t.parent);
}, Xo = function(i) {
  return i._repeat ? ki(i._tTime, i = i.duration() + i._rDelay) * i : 0;
}, ki = function(i, t) {
  var e = Math.floor(i /= t);
  return i && e === i ? e - 1 : e;
}, or = function(i, t) {
  return (i - t._start) * t._ts + (t._ts >= 0 ? 0 : t._dirty ? t.totalDuration() : t._tDur);
}, vr = function(i) {
  return i._end = _t(i._start + (i._tDur / Math.abs(i._ts || i._rts || tt) || 0));
}, br = function(i, t) {
  var e = i._dp;
  return e && e.smoothChildTiming && i._ts && (i._start = _t(e._time - (i._ts > 0 ? t / i._ts : ((i._dirty ? i.totalDuration() : i._tDur) - t) / -i._ts)), vr(i), e._dirty || si(e, i)), i;
}, Rl = function(i, t) {
  var e;
  if ((t._time || !t._dur && t._initted || t._start < i._time && (t._dur || !t.add)) && (e = or(i.rawTime(), t), (!t._dur || ks(0, t.totalDuration(), e) - t._tTime > tt) && t.render(e, !0)), si(i, t)._dp && i._initted && i._time >= i._dur && i._ts) {
    if (i._dur < i.duration())
      for (e = i; e._dp; )
        e.rawTime() >= 0 && e.totalTime(e._tTime), e = e._dp;
    i._zTime = -tt;
  }
}, me = function(i, t, e, s) {
  return t.parent && Ue(t), t._start = _t((ke(e) ? e : e || i !== st ? Kt(i, e, t) : i._time) + t._delay), t._end = _t(t._start + (t.totalDuration() / Math.abs(t.timeScale()) || 0)), Bl(i, t, "_first", "_last", i._sort ? "_start" : 0), wn(t) || (i._recent = t), s || Rl(i, t), i._ts < 0 && br(i, i._tTime), i;
}, Il = function(i, t) {
  return (qt.ScrollTrigger || ho("scrollTrigger", t)) && qt.ScrollTrigger.create(t, i);
}, Ol = function(i, t, e, s, n) {
  if (mo(i, t, n), !i._initted)
    return 1;
  if (!e && i._pt && !Mt && (i._dur && i.vars.lazy !== !1 || !i._dur && i.vars.lazy) && Pl !== Yt.frame)
    return ze.push(i), i._lazy = [n, s], 1;
}, xu = function i(t) {
  var e = t.parent;
  return e && e._ts && e._initted && !e._lock && (e.rawTime() < 0 || i(e));
}, wn = function(i) {
  var t = i.data;
  return t === "isFromStart" || t === "isStart";
}, vu = function(i, t, e, s) {
  var n = i.ratio, r = t < 0 || !t && (!i._start && xu(i) && !(!i._initted && wn(i)) || (i._ts < 0 || i._dp._ts < 0) && !wn(i)) ? 0 : 1, o = i._rDelay, a = 0, l, c, h;
  if (o && i._repeat && (a = ks(0, i._tDur, t), c = ki(a, o), i._yoyo && c & 1 && (r = 1 - r), c !== ki(i._tTime, o) && (n = 1 - r, i.vars.repeatRefresh && i._initted && i.invalidate())), r !== n || Mt || s || i._zTime === tt || !t && i._zTime) {
    if (!i._initted && Ol(i, t, s, e, a))
      return;
    for (h = i._zTime, i._zTime = t || (e ? tt : 0), e || (e = t && !h), i.ratio = r, i._from && (r = 1 - r), i._time = 0, i._tTime = a, l = i._pt; l; )
      l.r(r, l.d), l = l._next;
    t < 0 && _n(i, t, e, !0), i._onUpdate && !e && Wt(i, "onUpdate"), a && i._repeat && !e && i.parent && Wt(i, "onRepeat"), (t >= i._tDur || t < 0) && i.ratio === r && (r && Ue(i, 1), !e && !Mt && (Wt(i, r ? "onComplete" : "onReverseComplete", !0), i._prom && i._prom()));
  } else i._zTime || (i._zTime = t);
}, bu = function(i, t, e) {
  var s;
  if (e > t)
    for (s = i._first; s && s._start <= e; ) {
      if (s.data === "isPause" && s._start > t)
        return s;
      s = s._next;
    }
  else
    for (s = i._last; s && s._start >= e; ) {
      if (s.data === "isPause" && s._start < t)
        return s;
      s = s._prev;
    }
}, Ei = function(i, t, e, s) {
  var n = i._repeat, r = _t(t) || 0, o = i._tTime / i._tDur;
  return o && !s && (i._time *= r / i._dur), i._dur = r, i._tDur = n ? n < 0 ? 1e10 : _t(r * (n + 1) + i._rDelay * n) : r, o > 0 && !s && br(i, i._tTime = i._tDur * o), i.parent && vr(i), e || si(i.parent, i), i;
}, qo = function(i) {
  return i instanceof Bt ? si(i) : Ei(i, i._dur);
}, _u = {
  _start: 0,
  endTime: fs,
  totalDuration: fs
}, Kt = function i(t, e, s) {
  var n = t.labels, r = t._recent || _u, o = t.duration() >= Zt ? r.endTime(!1) : t._dur, a, l, c;
  return wt(e) && (isNaN(e) || e in n) ? (l = e.charAt(0), c = e.substr(-1) === "%", a = e.indexOf("="), l === "<" || l === ">" ? (a >= 0 && (e = e.replace(/=/, "")), (l === "<" ? r._start : r.endTime(r._repeat >= 0)) + (parseFloat(e.substr(1)) || 0) * (c ? (a < 0 ? r : s).totalDuration() / 100 : 1)) : a < 0 ? (e in n || (n[e] = o), n[e]) : (l = parseFloat(e.charAt(a - 1) + e.substr(a + 1)), c && s && (l = l / 100 * (Tt(s) ? s[0] : s).totalDuration()), a > 1 ? i(t, e.substr(0, a - 1), s) + l : o + l)) : e == null ? o : +e;
}, as = function(i, t, e) {
  var s = ke(t[1]), n = (s ? 2 : 1) + (i < 2 ? 0 : 1), r = t[n], o, a;
  if (s && (r.duration = t[1]), r.parent = e, i) {
    for (o = r, a = e; a && !("immediateRender" in o); )
      o = a.vars.defaults || {}, a = Lt(a.vars.inherit) && a.parent;
    r.immediateRender = Lt(o.immediateRender), i < 2 ? r.runBackwards = 1 : r.startAt = t[n - 1];
  }
  return new pt(t[0], r, t[n + 1]);
}, Ve = function(i, t) {
  return i || i === 0 ? t(i) : t;
}, ks = function(i, t, e) {
  return e < i ? i : e > t ? t : e;
}, Ct = function(i, t) {
  return !wt(i) || !(t = cu.exec(i)) ? "" : t[1];
}, wu = function(i, t, e) {
  return Ve(e, function(s) {
    return ks(i, t, s);
  });
}, An = [].slice, Fl = function(i, t) {
  return i && be(i) && "length" in i && (!t && !i.length || i.length - 1 in i && be(i[0])) && !i.nodeType && i !== pe;
}, Au = function(i, t, e) {
  return e === void 0 && (e = []), i.forEach(function(s) {
    var n;
    return wt(s) && !t || Fl(s, 1) ? (n = e).push.apply(n, Jt(s)) : e.push(s);
  }) || e;
}, Jt = function(i, t, e) {
  return et && !t && et.selector ? et.selector(i) : wt(i) && !e && (vn || !Bi()) ? An.call((t || lo).querySelectorAll(i), 0) : Tt(i) ? Au(i, e) : Fl(i) ? An.call(i, 0) : i ? [i] : [];
}, Sn = function(i) {
  return i = Jt(i)[0] || ps("Invalid scope") || {}, function(t) {
    var e = i.current || i.nativeElement || i;
    return Jt(t, e.querySelectorAll ? e : e === i ? ps("Invalid scope") || lo.createElement("div") : i);
  };
}, Ll = function(i) {
  return i.sort(function() {
    return 0.5 - Math.random();
  });
}, zl = function(i) {
  if (ht(i))
    return i;
  var t = be(i) ? i : {
    each: i
  }, e = ri(t.ease), s = t.from || 0, n = parseFloat(t.base) || 0, r = {}, o = s > 0 && s < 1, a = isNaN(s) || o, l = t.axis, c = s, h = s;
  return wt(s) ? c = h = {
    center: 0.5,
    edges: 0.5,
    end: 1
  }[s] || 0 : !o && a && (c = s[0], h = s[1]), function(f, p, u) {
    var d = (u || t).length, m = r[d], g, y, v, _, w, x, A, S, b;
    if (!m) {
      if (b = t.grid === "auto" ? 0 : (t.grid || [1, Zt])[1], !b) {
        for (A = -Zt; A < (A = u[b++].getBoundingClientRect().left) && b < d; )
          ;
        b < d && b--;
      }
      for (m = r[d] = [], g = a ? Math.min(b, d) * c - 0.5 : s % b, y = b === Zt ? 0 : a ? d * h / b - 0.5 : s / b | 0, A = 0, S = Zt, x = 0; x < d; x++)
        v = x % b - g, _ = y - (x / b | 0), m[x] = w = l ? Math.abs(l === "y" ? _ : v) : xl(v * v + _ * _), w > A && (A = w), w < S && (S = w);
      s === "random" && Ll(m), m.max = A - S, m.min = S, m.v = d = (parseFloat(t.amount) || parseFloat(t.each) * (b > d ? d - 1 : l ? l === "y" ? d / b : b : Math.max(b, d / b)) || 0) * (s === "edges" ? -1 : 1), m.b = d < 0 ? n - d : n, m.u = Ct(t.amount || t.each) || 0, e = e && d < 0 ? Xl(e) : e;
    }
    return d = (m[f] - m.min) / m.max || 0, _t(m.b + (e ? e(d) : d) * m.v) + m.u;
  };
}, Cn = function(i) {
  var t = Math.pow(10, ((i + "").split(".")[1] || "").length);
  return function(e) {
    var s = _t(Math.round(parseFloat(e) / i) * i * t);
    return (s - s % 1) / t + (ke(e) ? 0 : Ct(e));
  };
}, Dl = function(i, t) {
  var e = Tt(i), s, n;
  return !e && be(i) && (s = e = i.radius || Zt, i.values ? (i = Jt(i.values), (n = !ke(i[0])) && (s *= s)) : i = Cn(i.increment)), Ve(t, e ? ht(i) ? function(r) {
    return n = i(r), Math.abs(n - r) <= s ? n : r;
  } : function(r) {
    for (var o = parseFloat(n ? r.x : r), a = parseFloat(n ? r.y : 0), l = Zt, c = 0, h = i.length, f, p; h--; )
      n ? (f = i[h].x - o, p = i[h].y - a, f = f * f + p * p) : f = Math.abs(i[h] - o), f < l && (l = f, c = h);
    return c = !s || l <= s ? i[c] : r, n || c === r || ke(r) ? c : c + Ct(r);
  } : Cn(i));
}, Ul = function(i, t, e, s) {
  return Ve(Tt(i) ? !t : e === !0 ? !!(e = 0) : !s, function() {
    return Tt(i) ? i[~~(Math.random() * i.length)] : (e = e || 1e-5) && (s = e < 1 ? Math.pow(10, (e + "").length - 2) : 1) && Math.floor(Math.round((i - e / 2 + Math.random() * (t - i + e * 0.99)) / e) * e * s) / s;
  });
}, Su = function() {
  for (var i = arguments.length, t = new Array(i), e = 0; e < i; e++)
    t[e] = arguments[e];
  return function(s) {
    return t.reduce(function(n, r) {
      return r(n);
    }, s);
  };
}, Cu = function(i, t) {
  return function(e) {
    return i(parseFloat(e)) + (t || Ct(e));
  };
}, Pu = function(i, t, e) {
  return Vl(i, t, 0, 1, e);
}, Gl = function(i, t, e) {
  return Ve(e, function(s) {
    return i[~~t(s)];
  });
}, Mu = function i(t, e, s) {
  var n = e - t;
  return Tt(t) ? Gl(t, i(0, t.length), e) : Ve(s, function(r) {
    return (n + (r - t) % n) % n + t;
  });
}, Tu = function i(t, e, s) {
  var n = e - t, r = n * 2;
  return Tt(t) ? Gl(t, i(0, t.length - 1), e) : Ve(s, function(o) {
    return o = (r + (o - t) % r) % r || 0, t + (o > n ? r - o : o);
  });
}, ms = function(i) {
  for (var t = 0, e = "", s, n, r, o; ~(s = i.indexOf("random(", t)); )
    r = i.indexOf(")", s), o = i.charAt(s + 7) === "[", n = i.substr(s + 7, r - s - 7).match(o ? wl : xn), e += i.substr(t, s - t) + Ul(o ? n : +n[0], o ? 0 : +n[1], +n[2] || 1e-5), t = r + 1;
  return e + i.substr(t, i.length - t);
}, Vl = function(i, t, e, s, n) {
  var r = t - i, o = s - e;
  return Ve(n, function(a) {
    return e + ((a - i) / r * o || 0);
  });
}, ku = function i(t, e, s, n) {
  var r = isNaN(t + e) ? 0 : function(u) {
    return (1 - u) * t + u * e;
  };
  if (!r) {
    var o = wt(t), a = {}, l, c, h, f, p;
    if (s === !0 && (n = 1) && (s = null), o)
      t = {
        p: t
      }, e = {
        p: e
      };
    else if (Tt(t) && !Tt(e)) {
      for (h = [], f = t.length, p = f - 2, c = 1; c < f; c++)
        h.push(i(t[c - 1], t[c]));
      f--, r = function(u) {
        u *= f;
        var d = Math.min(p, ~~u);
        return h[d](u - d);
      }, s = e;
    } else n || (t = oi(Tt(t) ? [] : {}, t));
    if (!h) {
      for (l in e)
        fo.call(a, t, l, "get", e[l]);
      r = function(u) {
        return xo(u, a) || (o ? t.p : t);
      };
    }
  }
  return Ve(s, r);
}, Ko = function(i, t, e) {
  var s = i.labels, n = Zt, r, o, a;
  for (r in s)
    o = s[r] - t, o < 0 == !!e && o && n > (o = Math.abs(o)) && (a = r, n = o);
  return a;
}, Wt = function(i, t, e) {
  var s = i.vars, n = s[t], r = et, o = i._ctx, a, l, c;
  if (n)
    return a = s[t + "Params"], l = s.callbackScope || i, e && ze.length && rr(), o && (et = o), c = a ? n.apply(l, a) : n.call(l), et = r, c;
}, Ji = function(i) {
  return Ue(i), i.scrollTrigger && i.scrollTrigger.kill(!!Mt), i.progress() < 1 && Wt(i, "onInterrupt"), i;
}, bi, Nl = [], Hl = function(i) {
  if (i)
    if (i = !i.name && i.default || i, ao() || i.headless) {
      var t = i.name, e = ht(i), s = t && !e && i.init ? function() {
        this._props = [];
      } : i, n = {
        init: fs,
        render: xo,
        add: fo,
        kill: Yu,
        modifier: ju,
        rawVars: 0
      }, r = {
        targetTest: 0,
        get: 0,
        getSetter: yo,
        aliases: {},
        register: 0
      };
      if (Bi(), i !== s) {
        if (jt[t])
          return;
        te(s, te(nr(i, n), r)), oi(s.prototype, oi(n, nr(i, r))), jt[s.prop = t] = s, i.targetTest && (Ks.push(s), co[t] = 1), t = (t === "css" ? "CSS" : t.charAt(0).toUpperCase() + t.substr(1)) + "Plugin";
      }
      Cl(t, s), i.register && i.register(Gt, s, Dt);
    } else
      Nl.push(i);
}, J = 255, $i = {
  aqua: [0, J, J],
  lime: [0, J, 0],
  silver: [192, 192, 192],
  black: [0, 0, 0],
  maroon: [128, 0, 0],
  teal: [0, 128, 128],
  blue: [0, 0, J],
  navy: [0, 0, 128],
  white: [J, J, J],
  olive: [128, 128, 0],
  yellow: [J, J, 0],
  orange: [J, 165, 0],
  gray: [128, 128, 128],
  purple: [128, 0, 128],
  green: [0, 128, 0],
  red: [J, 0, 0],
  pink: [J, 192, 203],
  cyan: [0, J, J],
  transparent: [J, J, J, 0]
}, Rr = function(i, t, e) {
  return i += i < 0 ? 1 : i > 1 ? -1 : 0, (i * 6 < 1 ? t + (e - t) * i * 6 : i < 0.5 ? e : i * 3 < 2 ? t + (e - t) * (2 / 3 - i) * 6 : t) * J + 0.5 | 0;
}, jl = function(i, t, e) {
  var s = i ? ke(i) ? [i >> 16, i >> 8 & J, i & J] : 0 : $i.black, n, r, o, a, l, c, h, f, p, u;
  if (!s) {
    if (i.substr(-1) === "," && (i = i.substr(0, i.length - 1)), $i[i])
      s = $i[i];
    else if (i.charAt(0) === "#") {
      if (i.length < 6 && (n = i.charAt(1), r = i.charAt(2), o = i.charAt(3), i = "#" + n + n + r + r + o + o + (i.length === 5 ? i.charAt(4) + i.charAt(4) : "")), i.length === 9)
        return s = parseInt(i.substr(1, 6), 16), [s >> 16, s >> 8 & J, s & J, parseInt(i.substr(7), 16) / 255];
      i = parseInt(i.substr(1), 16), s = [i >> 16, i >> 8 & J, i & J];
    } else if (i.substr(0, 3) === "hsl") {
      if (s = u = i.match(xn), !t)
        a = +s[0] % 360 / 360, l = +s[1] / 100, c = +s[2] / 100, r = c <= 0.5 ? c * (l + 1) : c + l - c * l, n = c * 2 - r, s.length > 3 && (s[3] *= 1), s[0] = Rr(a + 1 / 3, n, r), s[1] = Rr(a, n, r), s[2] = Rr(a - 1 / 3, n, r);
      else if (~i.indexOf("="))
        return s = i.match(bl), e && s.length < 4 && (s[3] = 1), s;
    } else
      s = i.match(xn) || $i.transparent;
    s = s.map(Number);
  }
  return t && !u && (n = s[0] / J, r = s[1] / J, o = s[2] / J, h = Math.max(n, r, o), f = Math.min(n, r, o), c = (h + f) / 2, h === f ? a = l = 0 : (p = h - f, l = c > 0.5 ? p / (2 - h - f) : p / (h + f), a = h === n ? (r - o) / p + (r < o ? 6 : 0) : h === r ? (o - n) / p + 2 : (n - r) / p + 4, a *= 60), s[0] = ~~(a + 0.5), s[1] = ~~(l * 100 + 0.5), s[2] = ~~(c * 100 + 0.5)), e && s.length < 4 && (s[3] = 1), s;
}, Yl = function(i) {
  var t = [], e = [], s = -1;
  return i.split(De).forEach(function(n) {
    var r = n.match(vi) || [];
    t.push.apply(t, r), e.push(s += r.length + 1);
  }), t.c = e, t;
}, Qo = function(i, t, e) {
  var s = "", n = (i + s).match(De), r = t ? "hsla(" : "rgba(", o = 0, a, l, c, h;
  if (!n)
    return i;
  if (n = n.map(function(f) {
    return (f = jl(f, t, 1)) && r + (t ? f[0] + "," + f[1] + "%," + f[2] + "%," + f[3] : f.join(",")) + ")";
  }), e && (c = Yl(i), a = e.c, a.join(s) !== c.c.join(s)))
    for (l = i.replace(De, "1").split(vi), h = l.length - 1; o < h; o++)
      s += l[o] + (~a.indexOf(o) ? n.shift() || r + "0,0,0,0)" : (c.length ? c : n.length ? n : e).shift());
  if (!l)
    for (l = i.split(De), h = l.length - 1; o < h; o++)
      s += l[o] + n[o];
  return s + l[h];
}, De = function() {
  var i = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b", t;
  for (t in $i)
    i += "|" + t + "\\b";
  return new RegExp(i + ")", "gi");
}(), Eu = /hsl[a]?\(/, Wl = function(i) {
  var t = i.join(" "), e;
  if (De.lastIndex = 0, De.test(t))
    return e = Eu.test(t), i[1] = Qo(i[1], e), i[0] = Qo(i[0], e, Yl(i[1])), !0;
}, gs, Yt = function() {
  var i = Date.now, t = 500, e = 33, s = i(), n = s, r = 1e3 / 240, o = r, a = [], l, c, h, f, p, u, d = function m(g) {
    var y = i() - n, v = g === !0, _, w, x, A;
    if ((y > t || y < 0) && (s += y - e), n += y, x = n - s, _ = x - o, (_ > 0 || v) && (A = ++f.frame, p = x - f.time * 1e3, f.time = x = x / 1e3, o += _ + (_ >= r ? 4 : r - _), w = 1), v || (l = c(m)), w)
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
      Al && (!vn && ao() && (pe = vn = window, lo = pe.document || {}, qt.gsap = Gt, (pe.gsapVersions || (pe.gsapVersions = [])).push(Gt.version), Sl(sr || pe.GreenSockGlobals || !pe.gsap && pe || {}), Nl.forEach(Hl)), h = typeof requestAnimationFrame < "u" && requestAnimationFrame, l && f.sleep(), c = h || function(m) {
        return setTimeout(m, o - f.time * 1e3 + 1 | 0);
      }, gs = 1, d(2));
    },
    sleep: function() {
      (h ? cancelAnimationFrame : clearTimeout)(l), gs = 0, c = fs;
    },
    lagSmoothing: function(m, g) {
      t = m || 1 / 0, e = Math.min(g || 33, t);
    },
    fps: function(m) {
      r = 1e3 / (m || 240), o = f.time * 1e3 + r;
    },
    add: function(m, g, y) {
      var v = g ? function(_, w, x, A) {
        m(_, w, x, A), f.remove(v);
      } : m;
      return f.remove(m), a[y ? "unshift" : "push"](v), Bi(), v;
    },
    remove: function(m, g) {
      ~(g = a.indexOf(m)) && a.splice(g, 1) && u >= g && u--;
    },
    _listeners: a
  }, f;
}(), Bi = function() {
  return !gs && Yt.wake();
}, Y = {}, Bu = /^[\d.\-M][\d.\-,\s]/, Ru = /["']/g, Iu = function(i) {
  for (var t = {}, e = i.substr(1, i.length - 3).split(":"), s = e[0], n = 1, r = e.length, o, a, l; n < r; n++)
    a = e[n], o = n !== r - 1 ? a.lastIndexOf(",") : a.length, l = a.substr(0, o), t[s] = isNaN(l) ? l.replace(Ru, "").trim() : +l, s = a.substr(o + 1).trim();
  return t;
}, Ou = function(i) {
  var t = i.indexOf("(") + 1, e = i.indexOf(")"), s = i.indexOf("(", t);
  return i.substring(t, ~s && s < e ? i.indexOf(")", e + 1) : e);
}, Fu = function(i) {
  var t = (i + "").split("("), e = Y[t[0]];
  return e && t.length > 1 && e.config ? e.config.apply(null, ~i.indexOf("{") ? [Iu(t[1])] : Ou(i).split(",").map(kl)) : Y._CE && Bu.test(i) ? Y._CE("", i) : e;
}, Xl = function(i) {
  return function(t) {
    return 1 - i(1 - t);
  };
}, ql = function i(t, e) {
  for (var s = t._first, n; s; )
    s instanceof Bt ? i(s, e) : s.vars.yoyoEase && (!s._yoyo || !s._repeat) && s._yoyo !== e && (s.timeline ? i(s.timeline, e) : (n = s._ease, s._ease = s._yEase, s._yEase = n, s._yoyo = e)), s = s._next;
}, ri = function(i, t) {
  return i && (ht(i) ? i : Y[i] || Fu(i)) || t;
}, ci = function(i, t, e, s) {
  e === void 0 && (e = function(o) {
    return 1 - t(1 - o);
  }), s === void 0 && (s = function(o) {
    return o < 0.5 ? t(o * 2) / 2 : 1 - t((1 - o) * 2) / 2;
  });
  var n = {
    easeIn: t,
    easeOut: e,
    easeInOut: s
  }, r;
  return zt(i, function(o) {
    Y[o] = qt[o] = n, Y[r = o.toLowerCase()] = e;
    for (var a in n)
      Y[r + (a === "easeIn" ? ".in" : a === "easeOut" ? ".out" : ".inOut")] = Y[o + "." + a] = n[a];
  }), n;
}, Kl = function(i) {
  return function(t) {
    return t < 0.5 ? (1 - i(1 - t * 2)) / 2 : 0.5 + i((t - 0.5) * 2) / 2;
  };
}, Ir = function i(t, e, s) {
  var n = e >= 1 ? e : 1, r = (s || (t ? 0.3 : 0.45)) / (e < 1 ? e : 1), o = r / yn * (Math.asin(1 / n) || 0), a = function(c) {
    return c === 1 ? 1 : n * Math.pow(2, -10 * c) * hu((c - o) * r) + 1;
  }, l = t === "out" ? a : t === "in" ? function(c) {
    return 1 - a(1 - c);
  } : Kl(a);
  return r = yn / r, l.config = function(c, h) {
    return i(t, c, h);
  }, l;
}, Or = function i(t, e) {
  e === void 0 && (e = 1.70158);
  var s = function(r) {
    return r ? --r * r * ((e + 1) * r + e) + 1 : 0;
  }, n = t === "out" ? s : t === "in" ? function(r) {
    return 1 - s(1 - r);
  } : Kl(s);
  return n.config = function(r) {
    return i(t, r);
  }, n;
};
zt("Linear,Quad,Cubic,Quart,Quint,Strong", function(i, t) {
  var e = t < 5 ? t + 1 : t;
  ci(i + ",Power" + (e - 1), t ? function(s) {
    return Math.pow(s, e);
  } : function(s) {
    return s;
  }, function(s) {
    return 1 - Math.pow(1 - s, e);
  }, function(s) {
    return s < 0.5 ? Math.pow(s * 2, e) / 2 : 1 - Math.pow((1 - s) * 2, e) / 2;
  });
});
Y.Linear.easeNone = Y.none = Y.Linear.easeIn;
ci("Elastic", Ir("in"), Ir("out"), Ir());
(function(i, t) {
  var e = 1 / t, s = 2 * e, n = 2.5 * e, r = function(o) {
    return o < e ? i * o * o : o < s ? i * Math.pow(o - 1.5 / t, 2) + 0.75 : o < n ? i * (o -= 2.25 / t) * o + 0.9375 : i * Math.pow(o - 2.625 / t, 2) + 0.984375;
  };
  ci("Bounce", function(o) {
    return 1 - r(1 - o);
  }, r);
})(7.5625, 2.75);
ci("Expo", function(i) {
  return i ? Math.pow(2, 10 * (i - 1)) : 0;
});
ci("Circ", function(i) {
  return -(xl(1 - i * i) - 1);
});
ci("Sine", function(i) {
  return i === 1 ? 1 : -lu(i * ou) + 1;
});
ci("Back", Or("in"), Or("out"), Or());
Y.SteppedEase = Y.steps = qt.SteppedEase = {
  config: function(i, t) {
    i === void 0 && (i = 1);
    var e = 1 / i, s = i + (t ? 0 : 1), n = t ? 1 : 0, r = 1 - tt;
    return function(o) {
      return ((s * ks(0, r, o) | 0) + n) * e;
    };
  }
};
Ti.ease = Y["quad.out"];
zt("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function(i) {
  return uo += i + "," + i + "Params,";
});
var Ql = function(i, t) {
  this.id = au++, i._gsap = this, this.target = i, this.harness = t, this.get = t ? t.get : Ml, this.set = t ? t.getSetter : yo;
}, ys = /* @__PURE__ */ function() {
  function i(e) {
    this.vars = e, this._delay = +e.delay || 0, (this._repeat = e.repeat === 1 / 0 ? -2 : e.repeat || 0) && (this._rDelay = e.repeatDelay || 0, this._yoyo = !!e.yoyo || !!e.yoyoEase), this._ts = 1, Ei(this, +e.duration, 1, 1), this.data = e.data, et && (this._ctx = et, et.data.push(this)), gs || Yt.wake();
  }
  var t = i.prototype;
  return t.delay = function(e) {
    return e || e === 0 ? (this.parent && this.parent.smoothChildTiming && this.startTime(this._start + e - this._delay), this._delay = e, this) : this._delay;
  }, t.duration = function(e) {
    return arguments.length ? this.totalDuration(this._repeat > 0 ? e + (e + this._rDelay) * this._repeat : e) : this.totalDuration() && this._dur;
  }, t.totalDuration = function(e) {
    return arguments.length ? (this._dirty = 0, Ei(this, this._repeat < 0 ? e : (e - this._repeat * this._rDelay) / (this._repeat + 1))) : this._tDur;
  }, t.totalTime = function(e, s) {
    if (Bi(), !arguments.length)
      return this._tTime;
    var n = this._dp;
    if (n && n.smoothChildTiming && this._ts) {
      for (br(this, e), !n._dp || n.parent || Rl(n, this); n && n.parent; )
        n.parent._time !== n._start + (n._ts >= 0 ? n._tTime / n._ts : (n.totalDuration() - n._tTime) / -n._ts) && n.totalTime(n._tTime, !0), n = n.parent;
      !this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && e < this._tDur || this._ts < 0 && e > 0 || !this._tDur && !e) && me(this._dp, this, this._start - this._delay);
    }
    return (this._tTime !== e || !this._dur && !s || this._initted && Math.abs(this._zTime) === tt || !e && !this._initted && (this.add || this._ptLookup)) && (this._ts || (this._pTime = e), Tl(this, e, s)), this;
  }, t.time = function(e, s) {
    return arguments.length ? this.totalTime(Math.min(this.totalDuration(), e + Xo(this)) % (this._dur + this._rDelay) || (e ? this._dur : 0), s) : this._time;
  }, t.totalProgress = function(e, s) {
    return arguments.length ? this.totalTime(this.totalDuration() * e, s) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() > 0 ? 1 : 0;
  }, t.progress = function(e, s) {
    return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - e : e) + Xo(this), s) : this.duration() ? Math.min(1, this._time / this._dur) : this.rawTime() > 0 ? 1 : 0;
  }, t.iteration = function(e, s) {
    var n = this.duration() + this._rDelay;
    return arguments.length ? this.totalTime(this._time + (e - 1) * n, s) : this._repeat ? ki(this._tTime, n) + 1 : 1;
  }, t.timeScale = function(e, s) {
    if (!arguments.length)
      return this._rts === -tt ? 0 : this._rts;
    if (this._rts === e)
      return this;
    var n = this.parent && this._ts ? or(this.parent._time, this) : this._tTime;
    return this._rts = +e || 0, this._ts = this._ps || e === -tt ? 0 : this._rts, this.totalTime(ks(-Math.abs(this._delay), this._tDur, n), s !== !1), vr(this), gu(this);
  }, t.paused = function(e) {
    return arguments.length ? (this._ps !== e && (this._ps = e, e ? (this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()), this._ts = this._act = 0) : (Bi(), this._ts = this._rts, this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== tt && (this._tTime -= tt)))), this) : this._ps;
  }, t.startTime = function(e) {
    if (arguments.length) {
      this._start = e;
      var s = this.parent || this._dp;
      return s && (s._sort || !this.parent) && me(s, this, e - this._delay), this;
    }
    return this._start;
  }, t.endTime = function(e) {
    return this._start + (Lt(e) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
  }, t.rawTime = function(e) {
    var s = this.parent || this._dp;
    return s ? e && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : this._ts ? or(s.rawTime(e), this) : this._tTime : this._tTime;
  }, t.revert = function(e) {
    e === void 0 && (e = du);
    var s = Mt;
    return Mt = e, (this._initted || this._startAt) && (this.timeline && this.timeline.revert(e), this.totalTime(-0.01, e.suppressEvents)), this.data !== "nested" && e.kill !== !1 && this.kill(), Mt = s, this;
  }, t.globalTime = function(e) {
    for (var s = this, n = arguments.length ? e : s.rawTime(); s; )
      n = s._start + n / (Math.abs(s._ts) || 1), s = s._dp;
    return !this.parent && this._sat ? this._sat.globalTime(e) : n;
  }, t.repeat = function(e) {
    return arguments.length ? (this._repeat = e === 1 / 0 ? -2 : e, qo(this)) : this._repeat === -2 ? 1 / 0 : this._repeat;
  }, t.repeatDelay = function(e) {
    if (arguments.length) {
      var s = this._time;
      return this._rDelay = e, qo(this), s ? this.time(s) : this;
    }
    return this._rDelay;
  }, t.yoyo = function(e) {
    return arguments.length ? (this._yoyo = e, this) : this._yoyo;
  }, t.seek = function(e, s) {
    return this.totalTime(Kt(this, e), Lt(s));
  }, t.restart = function(e, s) {
    return this.play().totalTime(e ? -this._delay : 0, Lt(s));
  }, t.play = function(e, s) {
    return e != null && this.seek(e, s), this.reversed(!1).paused(!1);
  }, t.reverse = function(e, s) {
    return e != null && this.seek(e || this.totalDuration(), s), this.reversed(!0).paused(!1);
  }, t.pause = function(e, s) {
    return e != null && this.seek(e, s), this.paused(!0);
  }, t.resume = function() {
    return this.paused(!1);
  }, t.reversed = function(e) {
    return arguments.length ? (!!e !== this.reversed() && this.timeScale(-this._rts || (e ? -tt : 0)), this) : this._rts < 0;
  }, t.invalidate = function() {
    return this._initted = this._act = 0, this._zTime = -tt, this;
  }, t.isActive = function() {
    var e = this.parent || this._dp, s = this._start, n;
    return !!(!e || this._ts && this._initted && e.isActive() && (n = e.rawTime(!0)) >= s && n < this.endTime(!0) - tt);
  }, t.eventCallback = function(e, s, n) {
    var r = this.vars;
    return arguments.length > 1 ? (s ? (r[e] = s, n && (r[e + "Params"] = n), e === "onUpdate" && (this._onUpdate = s)) : delete r[e], this) : r[e];
  }, t.then = function(e) {
    var s = this;
    return new Promise(function(n) {
      var r = ht(e) ? e : El, o = function() {
        var a = s.then;
        s.then = null, ht(r) && (r = r(s)) && (r.then || r === s) && (s.then = a), n(r), s.then = a;
      };
      s._initted && s.totalProgress() === 1 && s._ts >= 0 || !s._tTime && s._ts < 0 ? o() : s._prom = o;
    });
  }, t.kill = function() {
    Ji(this);
  }, i;
}();
te(ys.prototype, {
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
var Bt = /* @__PURE__ */ function(i) {
  yl(t, i);
  function t(s, n) {
    var r;
    return s === void 0 && (s = {}), r = i.call(this, s) || this, r.labels = {}, r.smoothChildTiming = !!s.smoothChildTiming, r.autoRemoveChildren = !!s.autoRemoveChildren, r._sort = Lt(s.sortChildren), st && me(s.parent || st, Se(r), n), s.reversed && r.reverse(), s.paused && r.paused(!0), s.scrollTrigger && Il(Se(r), s.scrollTrigger), r;
  }
  var e = t.prototype;
  return e.to = function(s, n, r) {
    return as(0, arguments, this), this;
  }, e.from = function(s, n, r) {
    return as(1, arguments, this), this;
  }, e.fromTo = function(s, n, r, o) {
    return as(2, arguments, this), this;
  }, e.set = function(s, n, r) {
    return n.duration = 0, n.parent = this, os(n).repeatDelay || (n.repeat = 0), n.immediateRender = !!n.immediateRender, new pt(s, n, Kt(this, r), 1), this;
  }, e.call = function(s, n, r) {
    return me(this, pt.delayedCall(0, s, n), r);
  }, e.staggerTo = function(s, n, r, o, a, l, c) {
    return r.duration = n, r.stagger = r.stagger || o, r.onComplete = l, r.onCompleteParams = c, r.parent = this, new pt(s, r, Kt(this, a)), this;
  }, e.staggerFrom = function(s, n, r, o, a, l, c) {
    return r.runBackwards = 1, os(r).immediateRender = Lt(r.immediateRender), this.staggerTo(s, n, r, o, a, l, c);
  }, e.staggerFromTo = function(s, n, r, o, a, l, c, h) {
    return o.startAt = r, os(o).immediateRender = Lt(o.immediateRender), this.staggerTo(s, n, o, a, l, c, h);
  }, e.render = function(s, n, r) {
    var o = this._time, a = this._dirty ? this.totalDuration() : this._tDur, l = this._dur, c = s <= 0 ? 0 : _t(s), h = this._zTime < 0 != s < 0 && (this._initted || !l), f, p, u, d, m, g, y, v, _, w, x, A;
    if (this !== st && c > a && s >= 0 && (c = a), c !== this._tTime || r || h) {
      if (o !== this._time && l && (c += this._time - o, s += this._time - o), f = c, _ = this._start, v = this._ts, g = !v, h && (l || (o = this._zTime), (s || !n) && (this._zTime = s)), this._repeat) {
        if (x = this._yoyo, m = l + this._rDelay, this._repeat < -1 && s < 0)
          return this.totalTime(m * 100 + s, n, r);
        if (f = _t(c % m), c === a ? (d = this._repeat, f = l) : (d = ~~(c / m), d && d === c / m && (f = l, d--), f > l && (f = l)), w = ki(this._tTime, m), !o && this._tTime && w !== d && this._tTime - w * m - this._dur <= 0 && (w = d), x && d & 1 && (f = l - f, A = 1), d !== w && !this._lock) {
          var S = x && w & 1, b = S === (x && d & 1);
          if (d < w && (S = !S), o = S ? 0 : c % l ? l : c, this._lock = 1, this.render(o || (A ? 0 : _t(d * m)), n, !l)._lock = 0, this._tTime = c, !n && this.parent && Wt(this, "onRepeat"), this.vars.repeatRefresh && !A && (this.invalidate()._lock = 1), o && o !== this._time || g !== !this._ts || this.vars.onRepeat && !this.parent && !this._act)
            return this;
          if (l = this._dur, a = this._tDur, b && (this._lock = 2, o = S ? l : -1e-4, this.render(o, !0), this.vars.repeatRefresh && !A && this.invalidate()), this._lock = 0, !this._ts && !g)
            return this;
          ql(this, A);
        }
      }
      if (this._hasPause && !this._forcing && this._lock < 2 && (y = bu(this, _t(o), _t(f)), y && (c -= f - (f = y._start))), this._tTime = c, this._time = f, this._act = !v, this._initted || (this._onUpdate = this.vars.onUpdate, this._initted = 1, this._zTime = s, o = 0), !o && f && !n && !d && (Wt(this, "onStart"), this._tTime !== c))
        return this;
      if (f >= o && s >= 0)
        for (p = this._first; p; ) {
          if (u = p._next, (p._act || f >= p._start) && p._ts && y !== p) {
            if (p.parent !== this)
              return this.render(s, n, r);
            if (p.render(p._ts > 0 ? (f - p._start) * p._ts : (p._dirty ? p.totalDuration() : p._tDur) + (f - p._start) * p._ts, n, r), f !== this._time || !this._ts && !g) {
              y = 0, u && (c += this._zTime = -tt);
              break;
            }
          }
          p = u;
        }
      else {
        p = this._last;
        for (var C = s < 0 ? s : f; p; ) {
          if (u = p._prev, (p._act || C <= p._end) && p._ts && y !== p) {
            if (p.parent !== this)
              return this.render(s, n, r);
            if (p.render(p._ts > 0 ? (C - p._start) * p._ts : (p._dirty ? p.totalDuration() : p._tDur) + (C - p._start) * p._ts, n, r || Mt && (p._initted || p._startAt)), f !== this._time || !this._ts && !g) {
              y = 0, u && (c += this._zTime = C ? -tt : tt);
              break;
            }
          }
          p = u;
        }
      }
      if (y && !n && (this.pause(), y.render(f >= o ? 0 : -tt)._zTime = f >= o ? 1 : -1, this._ts))
        return this._start = _, vr(this), this.render(s, n, r);
      this._onUpdate && !n && Wt(this, "onUpdate", !0), (c === a && this._tTime >= this.totalDuration() || !c && o) && (_ === this._start || Math.abs(v) !== Math.abs(this._ts)) && (this._lock || ((s || !l) && (c === a && this._ts > 0 || !c && this._ts < 0) && Ue(this, 1), !n && !(s < 0 && !o) && (c || o || !a) && (Wt(this, c === a && s >= 0 ? "onComplete" : "onReverseComplete", !0), this._prom && !(c < a && this.timeScale() > 0) && this._prom())));
    }
    return this;
  }, e.add = function(s, n) {
    var r = this;
    if (ke(n) || (n = Kt(this, n, s)), !(s instanceof ys)) {
      if (Tt(s))
        return s.forEach(function(o) {
          return r.add(o, n);
        }), this;
      if (wt(s))
        return this.addLabel(s, n);
      if (ht(s))
        s = pt.delayedCall(0, s);
      else
        return this;
    }
    return this !== s ? me(this, s, n) : this;
  }, e.getChildren = function(s, n, r, o) {
    s === void 0 && (s = !0), n === void 0 && (n = !0), r === void 0 && (r = !0), o === void 0 && (o = -Zt);
    for (var a = [], l = this._first; l; )
      l._start >= o && (l instanceof pt ? n && a.push(l) : (r && a.push(l), s && a.push.apply(a, l.getChildren(!0, n, r)))), l = l._next;
    return a;
  }, e.getById = function(s) {
    for (var n = this.getChildren(1, 1, 1), r = n.length; r--; )
      if (n[r].vars.id === s)
        return n[r];
  }, e.remove = function(s) {
    return wt(s) ? this.removeLabel(s) : ht(s) ? this.killTweensOf(s) : (xr(this, s), s === this._recent && (this._recent = this._last), si(this));
  }, e.totalTime = function(s, n) {
    return arguments.length ? (this._forcing = 1, !this._dp && this._ts && (this._start = _t(Yt.time - (this._ts > 0 ? s / this._ts : (this.totalDuration() - s) / -this._ts))), i.prototype.totalTime.call(this, s, n), this._forcing = 0, this) : this._tTime;
  }, e.addLabel = function(s, n) {
    return this.labels[s] = Kt(this, n), this;
  }, e.removeLabel = function(s) {
    return delete this.labels[s], this;
  }, e.addPause = function(s, n, r) {
    var o = pt.delayedCall(0, n || fs, r);
    return o.data = "isPause", this._hasPause = 1, me(this, o, Kt(this, s));
  }, e.removePause = function(s) {
    var n = this._first;
    for (s = Kt(this, s); n; )
      n._start === s && n.data === "isPause" && Ue(n), n = n._next;
  }, e.killTweensOf = function(s, n, r) {
    for (var o = this.getTweensOf(s, r), a = o.length; a--; )
      Oe !== o[a] && o[a].kill(s, n);
    return this;
  }, e.getTweensOf = function(s, n) {
    for (var r = [], o = Jt(s), a = this._first, l = ke(n), c; a; )
      a instanceof pt ? pu(a._targets, o) && (l ? (!Oe || a._initted && a._ts) && a.globalTime(0) <= n && a.globalTime(a.totalDuration()) > n : !n || a.isActive()) && r.push(a) : (c = a.getTweensOf(o, n)).length && r.push.apply(r, c), a = a._next;
    return r;
  }, e.tweenTo = function(s, n) {
    n = n || {};
    var r = this, o = Kt(r, s), a = n, l = a.startAt, c = a.onStart, h = a.onStartParams, f = a.immediateRender, p, u = pt.to(r, te({
      ease: n.ease || "none",
      lazy: !1,
      immediateRender: !1,
      time: o,
      overwrite: "auto",
      duration: n.duration || Math.abs((o - (l && "time" in l ? l.time : r._time)) / r.timeScale()) || tt,
      onStart: function() {
        if (r.pause(), !p) {
          var d = n.duration || Math.abs((o - (l && "time" in l ? l.time : r._time)) / r.timeScale());
          u._dur !== d && Ei(u, d, 0, 1).render(u._time, !0, !0), p = 1;
        }
        c && c.apply(u, h || []);
      }
    }, n));
    return f ? u.render(0) : u;
  }, e.tweenFromTo = function(s, n, r) {
    return this.tweenTo(n, te({
      startAt: {
        time: Kt(this, s)
      }
    }, r));
  }, e.recent = function() {
    return this._recent;
  }, e.nextLabel = function(s) {
    return s === void 0 && (s = this._time), Ko(this, Kt(this, s));
  }, e.previousLabel = function(s) {
    return s === void 0 && (s = this._time), Ko(this, Kt(this, s), 1);
  }, e.currentLabel = function(s) {
    return arguments.length ? this.seek(s, !0) : this.previousLabel(this._time + tt);
  }, e.shiftChildren = function(s, n, r) {
    r === void 0 && (r = 0);
    for (var o = this._first, a = this.labels, l; o; )
      o._start >= r && (o._start += s, o._end += s), o = o._next;
    if (n)
      for (l in a)
        a[l] >= r && (a[l] += s);
    return si(this);
  }, e.invalidate = function(s) {
    var n = this._first;
    for (this._lock = 0; n; )
      n.invalidate(s), n = n._next;
    return i.prototype.invalidate.call(this, s);
  }, e.clear = function(s) {
    s === void 0 && (s = !0);
    for (var n = this._first, r; n; )
      r = n._next, this.remove(n), n = r;
    return this._dp && (this._time = this._tTime = this._pTime = 0), s && (this.labels = {}), si(this);
  }, e.totalDuration = function(s) {
    var n = 0, r = this, o = r._last, a = Zt, l, c, h;
    if (arguments.length)
      return r.timeScale((r._repeat < 0 ? r.duration() : r.totalDuration()) / (r.reversed() ? -s : s));
    if (r._dirty) {
      for (h = r.parent; o; )
        l = o._prev, o._dirty && o.totalDuration(), c = o._start, c > a && r._sort && o._ts && !r._lock ? (r._lock = 1, me(r, o, c - o._delay, 1)._lock = 0) : a = c, c < 0 && o._ts && (n -= c, (!h && !r._dp || h && h.smoothChildTiming) && (r._start += c / r._ts, r._time -= c, r._tTime -= c), r.shiftChildren(-c, !1, -1 / 0), a = 0), o._end > n && o._ts && (n = o._end), o = l;
      Ei(r, r === st && r._time > n ? r._time : n, 1, 1), r._dirty = 0;
    }
    return r._tDur;
  }, t.updateRoot = function(s) {
    if (st._ts && (Tl(st, or(s, st)), Pl = Yt.frame), Yt.frame >= Yo) {
      Yo += Xt.autoSleep || 120;
      var n = st._first;
      if ((!n || !n._ts) && Xt.autoSleep && Yt._listeners.length < 2) {
        for (; n && !n._ts; )
          n = n._next;
        n || Yt.sleep();
      }
    }
  }, t;
}(ys);
te(Bt.prototype, {
  _lock: 0,
  _hasPause: 0,
  _forcing: 0
});
var Lu = function(i, t, e, s, n, r, o) {
  var a = new Dt(this._pt, i, t, 0, 1, ih, null, n), l = 0, c = 0, h, f, p, u, d, m, g, y;
  for (a.b = e, a.e = s, e += "", s += "", (g = ~s.indexOf("random(")) && (s = ms(s)), r && (y = [e, s], r(y, i, t), e = y[0], s = y[1]), f = e.match(Er) || []; h = Er.exec(s); )
    u = h[0], d = s.substring(l, h.index), p ? p = (p + 1) % 5 : d.substr(-5) === "rgba(" && (p = 1), u !== f[c++] && (m = parseFloat(f[c - 1]) || 0, a._pt = {
      _next: a._pt,
      p: d || c === 1 ? d : ",",
      //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
      s: m,
      c: u.charAt(1) === "=" ? Ai(m, u) - m : parseFloat(u) - m,
      m: p && p < 4 ? Math.round : 0
    }, l = Er.lastIndex);
  return a.c = l < s.length ? s.substring(l, s.length) : "", a.fp = o, (_l.test(s) || g) && (a.e = 0), this._pt = a, a;
}, fo = function(i, t, e, s, n, r, o, a, l, c) {
  ht(s) && (s = s(n || 0, i, r));
  var h = i[t], f = e !== "get" ? e : ht(h) ? l ? i[t.indexOf("set") || !ht(i["get" + t.substr(3)]) ? t : "get" + t.substr(3)](l) : i[t]() : h, p = ht(h) ? l ? Vu : th : go, u;
  if (wt(s) && (~s.indexOf("random(") && (s = ms(s)), s.charAt(1) === "=" && (u = Ai(f, s) + (Ct(f) || 0), (u || u === 0) && (s = u))), !c || f !== s || Pn)
    return !isNaN(f * s) && s !== "" ? (u = new Dt(this._pt, i, t, +f || 0, s - (f || 0), typeof h == "boolean" ? Hu : eh, 0, p), l && (u.fp = l), o && u.modifier(o, this, i), this._pt = u) : (!h && !(t in i) && ho(t, s), Lu.call(this, i, t, f, s, p, a || Xt.stringFilter, l));
}, zu = function(i, t, e, s, n) {
  if (ht(i) && (i = ls(i, n, t, e, s)), !be(i) || i.style && i.nodeType || Tt(i) || vl(i))
    return wt(i) ? ls(i, n, t, e, s) : i;
  var r = {}, o;
  for (o in i)
    r[o] = ls(i[o], n, t, e, s);
  return r;
}, Zl = function(i, t, e, s, n, r) {
  var o, a, l, c;
  if (jt[i] && (o = new jt[i]()).init(n, o.rawVars ? t[i] : zu(t[i], s, n, r, e), e, s, r) !== !1 && (e._pt = a = new Dt(e._pt, n, i, 0, 1, o.render, o, 0, o.priority), e !== bi))
    for (l = e._ptLookup[e._targets.indexOf(n)], c = o._props.length; c--; )
      l[o._props[c]] = a;
  return o;
}, Oe, Pn, mo = function i(t, e, s) {
  var n = t.vars, r = n.ease, o = n.startAt, a = n.immediateRender, l = n.lazy, c = n.onUpdate, h = n.runBackwards, f = n.yoyoEase, p = n.keyframes, u = n.autoRevert, d = t._dur, m = t._startAt, g = t._targets, y = t.parent, v = y && y.data === "nested" ? y.vars.targets : g, _ = t._overwrite === "auto" && !no, w = t.timeline, x, A, S, b, C, P, M, T, k, E, B, R, I;
  if (w && (!p || !r) && (r = "none"), t._ease = ri(r, Ti.ease), t._yEase = f ? Xl(ri(f === !0 ? r : f, Ti.ease)) : 0, f && t._yoyo && !t._repeat && (f = t._yEase, t._yEase = t._ease, t._ease = f), t._from = !w && !!n.runBackwards, !w || p && !n.stagger) {
    if (T = g[0] ? ii(g[0]).harness : 0, R = T && n[T.prop], x = nr(n, co), m && (m._zTime < 0 && m.progress(1), e < 0 && h && a && !u ? m.render(-1, !0) : m.revert(h && d ? qs : uu), m._lazy = 0), o) {
      if (Ue(t._startAt = pt.set(g, te({
        data: "isStart",
        overwrite: !1,
        parent: y,
        immediateRender: !0,
        lazy: !m && Lt(l),
        startAt: null,
        delay: 0,
        onUpdate: c && function() {
          return Wt(t, "onUpdate");
        },
        stagger: 0
      }, o))), t._startAt._dp = 0, t._startAt._sat = t, e < 0 && (Mt || !a && !u) && t._startAt.revert(qs), a && d && e <= 0 && s <= 0) {
        e && (t._zTime = e);
        return;
      }
    } else if (h && d && !m) {
      if (e && (a = !1), S = te({
        overwrite: !1,
        data: "isFromStart",
        //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
        lazy: a && !m && Lt(l),
        immediateRender: a,
        //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
        stagger: 0,
        parent: y
        //ensures that nested tweens that had a stagger are handled properly, like gsap.from(".class", {y: gsap.utils.wrap([-100,100]), stagger: 0.5})
      }, x), R && (S[T.prop] = R), Ue(t._startAt = pt.set(g, S)), t._startAt._dp = 0, t._startAt._sat = t, e < 0 && (Mt ? t._startAt.revert(qs) : t._startAt.render(-1, !0)), t._zTime = e, !a)
        i(t._startAt, tt, tt);
      else if (!e)
        return;
    }
    for (t._pt = t._ptCache = 0, l = d && Lt(l) || l && !d, A = 0; A < g.length; A++) {
      if (C = g[A], M = C._gsap || po(g)[A]._gsap, t._ptLookup[A] = E = {}, bn[M.id] && ze.length && rr(), B = v === g ? A : v.indexOf(C), T && (k = new T()).init(C, R || x, t, B, v) !== !1 && (t._pt = b = new Dt(t._pt, C, k.name, 0, 1, k.render, k, 0, k.priority), k._props.forEach(function(U) {
        E[U] = b;
      }), k.priority && (P = 1)), !T || R)
        for (S in x)
          jt[S] && (k = Zl(S, x, t, B, C, v)) ? k.priority && (P = 1) : E[S] = b = fo.call(t, C, S, "get", x[S], B, v, 0, n.stringFilter);
      t._op && t._op[A] && t.kill(C, t._op[A]), _ && t._pt && (Oe = t, st.killTweensOf(C, E, t.globalTime(e)), I = !t.parent, Oe = 0), t._pt && l && (bn[M.id] = 1);
    }
    P && sh(t), t._onInit && t._onInit(t);
  }
  t._onUpdate = c, t._initted = (!t._op || t._pt) && !I, p && e <= 0 && w.render(Zt, !0, !0);
}, Du = function(i, t, e, s, n, r, o, a) {
  var l = (i._pt && i._ptCache || (i._ptCache = {}))[t], c, h, f, p;
  if (!l)
    for (l = i._ptCache[t] = [], f = i._ptLookup, p = i._targets.length; p--; ) {
      if (c = f[p][t], c && c.d && c.d._pt)
        for (c = c.d._pt; c && c.p !== t && c.fp !== t; )
          c = c._next;
      if (!c)
        return Pn = 1, i.vars[t] = "+=0", mo(i, o), Pn = 0, a ? ps(t + " not eligible for reset") : 1;
      l.push(c);
    }
  for (p = l.length; p--; )
    h = l[p], c = h._pt || h, c.s = (s || s === 0) && !n ? s : c.s + (s || 0) + r * c.c, c.c = e - c.s, h.e && (h.e = ut(e) + Ct(h.e)), h.b && (h.b = c.s + Ct(h.b));
}, Uu = function(i, t) {
  var e = i[0] ? ii(i[0]).harness : 0, s = e && e.aliases, n, r, o, a;
  if (!s)
    return t;
  n = oi({}, t);
  for (r in s)
    if (r in n)
      for (a = s[r].split(","), o = a.length; o--; )
        n[a[o]] = n[r];
  return n;
}, Gu = function(i, t, e, s) {
  var n = t.ease || s || "power1.inOut", r, o;
  if (Tt(t))
    o = e[i] || (e[i] = []), t.forEach(function(a, l) {
      return o.push({
        t: l / (t.length - 1) * 100,
        v: a,
        e: n
      });
    });
  else
    for (r in t)
      o = e[r] || (e[r] = []), r === "ease" || o.push({
        t: parseFloat(i),
        v: t[r],
        e: n
      });
}, ls = function(i, t, e, s, n) {
  return ht(i) ? i.call(t, e, s, n) : wt(i) && ~i.indexOf("random(") ? ms(i) : i;
}, Jl = uo + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert", $l = {};
zt(Jl + ",id,stagger,delay,duration,paused,scrollTrigger", function(i) {
  return $l[i] = 1;
});
var pt = /* @__PURE__ */ function(i) {
  yl(t, i);
  function t(s, n, r, o) {
    var a;
    typeof n == "number" && (r.duration = n, n = r, r = null), a = i.call(this, o ? n : os(n)) || this;
    var l = a.vars, c = l.duration, h = l.delay, f = l.immediateRender, p = l.stagger, u = l.overwrite, d = l.keyframes, m = l.defaults, g = l.scrollTrigger, y = l.yoyoEase, v = n.parent || st, _ = (Tt(s) || vl(s) ? ke(s[0]) : "length" in n) ? [s] : Jt(s), w, x, A, S, b, C, P, M;
    if (a._targets = _.length ? po(_) : ps("GSAP target " + s + " not found. https://gsap.com", !Xt.nullTargetWarn) || [], a._ptLookup = [], a._overwrite = u, d || p || Ls(c) || Ls(h)) {
      if (n = a.vars, w = a.timeline = new Bt({
        data: "nested",
        defaults: m || {},
        targets: v && v.data === "nested" ? v.vars.targets : _
      }), w.kill(), w.parent = w._dp = Se(a), w._start = 0, p || Ls(c) || Ls(h)) {
        if (S = _.length, P = p && zl(p), be(p))
          for (b in p)
            ~Jl.indexOf(b) && (M || (M = {}), M[b] = p[b]);
        for (x = 0; x < S; x++)
          A = nr(n, $l), A.stagger = 0, y && (A.yoyoEase = y), M && oi(A, M), C = _[x], A.duration = +ls(c, Se(a), x, C, _), A.delay = (+ls(h, Se(a), x, C, _) || 0) - a._delay, !p && S === 1 && A.delay && (a._delay = h = A.delay, a._start += h, A.delay = 0), w.to(C, A, P ? P(x, C, _) : 0), w._ease = Y.none;
        w.duration() ? c = h = 0 : a.timeline = 0;
      } else if (d) {
        os(te(w.vars.defaults, {
          ease: "none"
        })), w._ease = ri(d.ease || n.ease || "none");
        var T = 0, k, E, B;
        if (Tt(d))
          d.forEach(function(R) {
            return w.to(_, R, ">");
          }), w.duration();
        else {
          A = {};
          for (b in d)
            b === "ease" || b === "easeEach" || Gu(b, d[b], A, d.easeEach);
          for (b in A)
            for (k = A[b].sort(function(R, I) {
              return R.t - I.t;
            }), T = 0, x = 0; x < k.length; x++)
              E = k[x], B = {
                ease: E.e,
                duration: (E.t - (x ? k[x - 1].t : 0)) / 100 * c
              }, B[b] = E.v, w.to(_, B, T), T += B.duration;
          w.duration() < c && w.to({}, {
            duration: c - w.duration()
          });
        }
      }
      c || a.duration(c = w.duration());
    } else
      a.timeline = 0;
    return u === !0 && !no && (Oe = Se(a), st.killTweensOf(_), Oe = 0), me(v, Se(a), r), n.reversed && a.reverse(), n.paused && a.paused(!0), (f || !c && !d && a._start === _t(v._time) && Lt(f) && yu(Se(a)) && v.data !== "nested") && (a._tTime = -tt, a.render(Math.max(0, -h) || 0)), g && Il(Se(a), g), a;
  }
  var e = t.prototype;
  return e.render = function(s, n, r) {
    var o = this._time, a = this._tDur, l = this._dur, c = s < 0, h = s > a - tt && !c ? a : s < tt ? 0 : s, f, p, u, d, m, g, y, v, _;
    if (!l)
      vu(this, s, n, r);
    else if (h !== this._tTime || !s || r || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== c) {
      if (f = h, v = this.timeline, this._repeat) {
        if (d = l + this._rDelay, this._repeat < -1 && c)
          return this.totalTime(d * 100 + s, n, r);
        if (f = _t(h % d), h === a ? (u = this._repeat, f = l) : (u = ~~(h / d), u && u === _t(h / d) && (f = l, u--), f > l && (f = l)), g = this._yoyo && u & 1, g && (_ = this._yEase, f = l - f), m = ki(this._tTime, d), f === o && !r && this._initted && u === m)
          return this._tTime = h, this;
        u !== m && (v && this._yEase && ql(v, g), this.vars.repeatRefresh && !g && !this._lock && this._time !== d && this._initted && (this._lock = r = 1, this.render(_t(d * u), !0).invalidate()._lock = 0));
      }
      if (!this._initted) {
        if (Ol(this, c ? s : f, r, n, h))
          return this._tTime = 0, this;
        if (o !== this._time && !(r && this.vars.repeatRefresh && u !== m))
          return this;
        if (l !== this._dur)
          return this.render(s, n, r);
      }
      if (this._tTime = h, this._time = f, !this._act && this._ts && (this._act = 1, this._lazy = 0), this.ratio = y = (_ || this._ease)(f / l), this._from && (this.ratio = y = 1 - y), f && !o && !n && !u && (Wt(this, "onStart"), this._tTime !== h))
        return this;
      for (p = this._pt; p; )
        p.r(y, p.d), p = p._next;
      v && v.render(s < 0 ? s : v._dur * v._ease(f / this._dur), n, r) || this._startAt && (this._zTime = s), this._onUpdate && !n && (c && _n(this, s, n, r), Wt(this, "onUpdate")), this._repeat && u !== m && this.vars.onRepeat && !n && this.parent && Wt(this, "onRepeat"), (h === this._tDur || !h) && this._tTime === h && (c && !this._onUpdate && _n(this, s, !0, !0), (s || !l) && (h === this._tDur && this._ts > 0 || !h && this._ts < 0) && Ue(this, 1), !n && !(c && !o) && (h || o || g) && (Wt(this, h === a ? "onComplete" : "onReverseComplete", !0), this._prom && !(h < a && this.timeScale() > 0) && this._prom()));
    }
    return this;
  }, e.targets = function() {
    return this._targets;
  }, e.invalidate = function(s) {
    return (!s || !this.vars.runBackwards) && (this._startAt = 0), this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0, this._ptLookup = [], this.timeline && this.timeline.invalidate(s), i.prototype.invalidate.call(this, s);
  }, e.resetTo = function(s, n, r, o, a) {
    gs || Yt.wake(), this._ts || this.play();
    var l = Math.min(this._dur, (this._dp._time - this._start) * this._ts), c;
    return this._initted || mo(this, l), c = this._ease(l / this._dur), Du(this, s, n, r, o, c, l, a) ? this.resetTo(s, n, r, o, 1) : (br(this, 0), this.parent || Bl(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0), this.render(0));
  }, e.kill = function(s, n) {
    if (n === void 0 && (n = "all"), !s && (!n || n === "all"))
      return this._lazy = this._pt = 0, this.parent ? Ji(this) : this;
    if (this.timeline) {
      var r = this.timeline.totalDuration();
      return this.timeline.killTweensOf(s, n, Oe && Oe.vars.overwrite !== !0)._first || Ji(this), this.parent && r !== this.timeline.totalDuration() && Ei(this, this._dur * this.timeline._tDur / r, 0, 1), this;
    }
    var o = this._targets, a = s ? Jt(s) : o, l = this._ptLookup, c = this._pt, h, f, p, u, d, m, g;
    if ((!n || n === "all") && mu(o, a))
      return n === "all" && (this._pt = 0), Ji(this);
    for (h = this._op = this._op || [], n !== "all" && (wt(n) && (d = {}, zt(n, function(y) {
      return d[y] = 1;
    }), n = d), n = Uu(o, n)), g = o.length; g--; )
      if (~a.indexOf(o[g])) {
        f = l[g], n === "all" ? (h[g] = n, u = f, p = {}) : (p = h[g] = h[g] || {}, u = n);
        for (d in u)
          m = f && f[d], m && ((!("kill" in m.d) || m.d.kill(d) === !0) && xr(this, m, "_pt"), delete f[d]), p !== "all" && (p[d] = 1);
      }
    return this._initted && !this._pt && c && Ji(this), this;
  }, t.to = function(s, n) {
    return new t(s, n, arguments[2]);
  }, t.from = function(s, n) {
    return as(1, arguments);
  }, t.delayedCall = function(s, n, r, o) {
    return new t(n, 0, {
      immediateRender: !1,
      lazy: !1,
      overwrite: !1,
      delay: s,
      onComplete: n,
      onReverseComplete: n,
      onCompleteParams: r,
      onReverseCompleteParams: r,
      callbackScope: o
    });
  }, t.fromTo = function(s, n, r) {
    return as(2, arguments);
  }, t.set = function(s, n) {
    return n.duration = 0, n.repeatDelay || (n.repeat = 0), new t(s, n);
  }, t.killTweensOf = function(s, n, r) {
    return st.killTweensOf(s, n, r);
  }, t;
}(ys);
te(pt.prototype, {
  _targets: [],
  _lazy: 0,
  _startAt: 0,
  _op: 0,
  _onInit: 0
});
zt("staggerTo,staggerFrom,staggerFromTo", function(i) {
  pt[i] = function() {
    var t = new Bt(), e = An.call(arguments, 0);
    return e.splice(i === "staggerFromTo" ? 5 : 4, 0, 0), t[i].apply(t, e);
  };
});
var go = function(i, t, e) {
  return i[t] = e;
}, th = function(i, t, e) {
  return i[t](e);
}, Vu = function(i, t, e, s) {
  return i[t](s.fp, e);
}, Nu = function(i, t, e) {
  return i.setAttribute(t, e);
}, yo = function(i, t) {
  return ht(i[t]) ? th : oo(i[t]) && i.setAttribute ? Nu : go;
}, eh = function(i, t) {
  return t.set(t.t, t.p, Math.round((t.s + t.c * i) * 1e6) / 1e6, t);
}, Hu = function(i, t) {
  return t.set(t.t, t.p, !!(t.s + t.c * i), t);
}, ih = function(i, t) {
  var e = t._pt, s = "";
  if (!i && t.b)
    s = t.b;
  else if (i === 1 && t.e)
    s = t.e;
  else {
    for (; e; )
      s = e.p + (e.m ? e.m(e.s + e.c * i) : Math.round((e.s + e.c * i) * 1e4) / 1e4) + s, e = e._next;
    s += t.c;
  }
  t.set(t.t, t.p, s, t);
}, xo = function(i, t) {
  for (var e = t._pt; e; )
    e.r(i, e.d), e = e._next;
}, ju = function(i, t, e, s) {
  for (var n = this._pt, r; n; )
    r = n._next, n.p === s && n.modifier(i, t, e), n = r;
}, Yu = function(i) {
  for (var t = this._pt, e, s; t; )
    s = t._next, t.p === i && !t.op || t.op === i ? xr(this, t, "_pt") : t.dep || (e = 1), t = s;
  return !e;
}, Wu = function(i, t, e, s) {
  s.mSet(i, t, s.m.call(s.tween, e, s.mt), s);
}, sh = function(i) {
  for (var t = i._pt, e, s, n, r; t; ) {
    for (e = t._next, s = n; s && s.pr > t.pr; )
      s = s._next;
    (t._prev = s ? s._prev : r) ? t._prev._next = t : n = t, (t._next = s) ? s._prev = t : r = t, t = e;
  }
  i._pt = n;
}, Dt = /* @__PURE__ */ function() {
  function i(e, s, n, r, o, a, l, c, h) {
    this.t = s, this.s = r, this.c = o, this.p = n, this.r = a || eh, this.d = l || this, this.set = c || go, this.pr = h || 0, this._next = e, e && (e._prev = this);
  }
  var t = i.prototype;
  return t.modifier = function(e, s, n) {
    this.mSet = this.mSet || this.set, this.set = Wu, this.m = e, this.mt = n, this.tween = s;
  }, i;
}();
zt(uo + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", function(i) {
  return co[i] = 1;
});
qt.TweenMax = qt.TweenLite = pt;
qt.TimelineLite = qt.TimelineMax = Bt;
st = new Bt({
  sortChildren: !1,
  defaults: Ti,
  autoRemoveChildren: !0,
  id: "root",
  smoothChildTiming: !0
});
Xt.stringFilter = Wl;
var ni = [], Qs = {}, Xu = [], Zo = 0, qu = 0, Fr = function(i) {
  return (Qs[i] || Xu).map(function(t) {
    return t();
  });
}, Mn = function() {
  var i = Date.now(), t = [];
  i - Zo > 2 && (Fr("matchMediaInit"), ni.forEach(function(e) {
    var s = e.queries, n = e.conditions, r, o, a, l;
    for (o in s)
      r = pe.matchMedia(s[o]).matches, r && (a = 1), r !== n[o] && (n[o] = r, l = 1);
    l && (e.revert(), a && t.push(e));
  }), Fr("matchMediaRevert"), t.forEach(function(e) {
    return e.onMatch(e, function(s) {
      return e.add(null, s);
    });
  }), Zo = i, Fr("matchMedia"));
}, rh = /* @__PURE__ */ function() {
  function i(e, s) {
    this.selector = s && Sn(s), this.data = [], this._r = [], this.isReverted = !1, this.id = qu++, e && this.add(e);
  }
  var t = i.prototype;
  return t.add = function(e, s, n) {
    ht(e) && (n = s, s = e, e = ht);
    var r = this, o = function() {
      var a = et, l = r.selector, c;
      return a && a !== r && a.data.push(r), n && (r.selector = Sn(n)), et = r, c = s.apply(r, arguments), ht(c) && r._r.push(c), et = a, r.selector = l, r.isReverted = !1, c;
    };
    return r.last = o, e === ht ? o(r, function(a) {
      return r.add(null, a);
    }) : e ? r[e] = o : o;
  }, t.ignore = function(e) {
    var s = et;
    et = null, e(this), et = s;
  }, t.getTweens = function() {
    var e = [];
    return this.data.forEach(function(s) {
      return s instanceof i ? e.push.apply(e, s.getTweens()) : s instanceof pt && !(s.parent && s.parent.data === "nested") && e.push(s);
    }), e;
  }, t.clear = function() {
    this._r.length = this.data.length = 0;
  }, t.kill = function(e, s) {
    var n = this;
    if (e ? function() {
      for (var o = n.getTweens(), a = n.data.length, l; a--; )
        l = n.data[a], l.data === "isFlip" && (l.revert(), l.getChildren(!0, !0, !1).forEach(function(c) {
          return o.splice(o.indexOf(c), 1);
        }));
      for (o.map(function(c) {
        return {
          g: c._dur || c._delay || c._sat && !c._sat.vars.immediateRender ? c.globalTime(0) : -1 / 0,
          t: c
        };
      }).sort(function(c, h) {
        return h.g - c.g || -1 / 0;
      }).forEach(function(c) {
        return c.t.revert(e);
      }), a = n.data.length; a--; )
        l = n.data[a], l instanceof Bt ? l.data !== "nested" && (l.scrollTrigger && l.scrollTrigger.revert(), l.kill()) : !(l instanceof pt) && l.revert && l.revert(e);
      n._r.forEach(function(c) {
        return c(e, n);
      }), n.isReverted = !0;
    }() : this.data.forEach(function(o) {
      return o.kill && o.kill();
    }), this.clear(), s)
      for (var r = ni.length; r--; )
        ni[r].id === this.id && ni.splice(r, 1);
  }, t.revert = function(e) {
    this.kill(e || {});
  }, i;
}(), Ku = /* @__PURE__ */ function() {
  function i(e) {
    this.contexts = [], this.scope = e, et && et.data.push(this);
  }
  var t = i.prototype;
  return t.add = function(e, s, n) {
    be(e) || (e = {
      matches: e
    });
    var r = new rh(0, n || this.scope), o = r.conditions = {}, a, l, c;
    et && !r.selector && (r.selector = et.selector), this.contexts.push(r), s = r.add("onMatch", s), r.queries = e;
    for (l in e)
      l === "all" ? c = 1 : (a = pe.matchMedia(e[l]), a && (ni.indexOf(r) < 0 && ni.push(r), (o[l] = a.matches) && (c = 1), a.addListener ? a.addListener(Mn) : a.addEventListener("change", Mn)));
    return c && s(r, function(h) {
      return r.add(null, h);
    }), this;
  }, t.revert = function(e) {
    this.kill(e || {});
  }, t.kill = function(e) {
    this.contexts.forEach(function(s) {
      return s.kill(e, !0);
    });
  }, i;
}(), ar = {
  registerPlugin: function() {
    for (var i = arguments.length, t = new Array(i), e = 0; e < i; e++)
      t[e] = arguments[e];
    t.forEach(function(s) {
      return Hl(s);
    });
  },
  timeline: function(i) {
    return new Bt(i);
  },
  getTweensOf: function(i, t) {
    return st.getTweensOf(i, t);
  },
  getProperty: function(i, t, e, s) {
    wt(i) && (i = Jt(i)[0]);
    var n = ii(i || {}).get, r = e ? El : kl;
    return e === "native" && (e = ""), i && (t ? r((jt[t] && jt[t].get || n)(i, t, e, s)) : function(o, a, l) {
      return r((jt[o] && jt[o].get || n)(i, o, a, l));
    });
  },
  quickSetter: function(i, t, e) {
    if (i = Jt(i), i.length > 1) {
      var s = i.map(function(c) {
        return Gt.quickSetter(c, t, e);
      }), n = s.length;
      return function(c) {
        for (var h = n; h--; )
          s[h](c);
      };
    }
    i = i[0] || {};
    var r = jt[t], o = ii(i), a = o.harness && (o.harness.aliases || {})[t] || t, l = r ? function(c) {
      var h = new r();
      bi._pt = 0, h.init(i, e ? c + e : c, bi, 0, [i]), h.render(1, h), bi._pt && xo(1, bi);
    } : o.set(i, a);
    return r ? l : function(c) {
      return l(i, a, e ? c + e : c, o, 1);
    };
  },
  quickTo: function(i, t, e) {
    var s, n = Gt.to(i, oi((s = {}, s[t] = "+=0.1", s.paused = !0, s), e || {})), r = function(o, a, l) {
      return n.resetTo(t, o, a, l);
    };
    return r.tween = n, r;
  },
  isTweening: function(i) {
    return st.getTweensOf(i, !0).length > 0;
  },
  defaults: function(i) {
    return i && i.ease && (i.ease = ri(i.ease, Ti.ease)), Wo(Ti, i || {});
  },
  config: function(i) {
    return Wo(Xt, i || {});
  },
  registerEffect: function(i) {
    var t = i.name, e = i.effect, s = i.plugins, n = i.defaults, r = i.extendTimeline;
    (s || "").split(",").forEach(function(o) {
      return o && !jt[o] && !qt[o] && ps(t + " effect requires " + o + " plugin.");
    }), Br[t] = function(o, a, l) {
      return e(Jt(o), te(a || {}, n), l);
    }, r && (Bt.prototype[t] = function(o, a, l) {
      return this.add(Br[t](o, be(a) ? a : (l = a) && {}, this), l);
    });
  },
  registerEase: function(i, t) {
    Y[i] = ri(t);
  },
  parseEase: function(i, t) {
    return arguments.length ? ri(i, t) : Y;
  },
  getById: function(i) {
    return st.getById(i);
  },
  exportRoot: function(i, t) {
    i === void 0 && (i = {});
    var e = new Bt(i), s, n;
    for (e.smoothChildTiming = Lt(i.smoothChildTiming), st.remove(e), e._dp = 0, e._time = e._tTime = st._time, s = st._first; s; )
      n = s._next, (t || !(!s._dur && s instanceof pt && s.vars.onComplete === s._targets[0])) && me(e, s, s._start - s._delay), s = n;
    return me(st, e, 0), e;
  },
  context: function(i, t) {
    return i ? new rh(i, t) : et;
  },
  matchMedia: function(i) {
    return new Ku(i);
  },
  matchMediaRefresh: function() {
    return ni.forEach(function(i) {
      var t = i.conditions, e, s;
      for (s in t)
        t[s] && (t[s] = !1, e = 1);
      e && i.revert();
    }) || Mn();
  },
  addEventListener: function(i, t) {
    var e = Qs[i] || (Qs[i] = []);
    ~e.indexOf(t) || e.push(t);
  },
  removeEventListener: function(i, t) {
    var e = Qs[i], s = e && e.indexOf(t);
    s >= 0 && e.splice(s, 1);
  },
  utils: {
    wrap: Mu,
    wrapYoyo: Tu,
    distribute: zl,
    random: Ul,
    snap: Dl,
    normalize: Pu,
    getUnit: Ct,
    clamp: wu,
    splitColor: jl,
    toArray: Jt,
    selector: Sn,
    mapRange: Vl,
    pipe: Su,
    unitize: Cu,
    interpolate: ku,
    shuffle: Ll
  },
  install: Sl,
  effects: Br,
  ticker: Yt,
  updateRoot: Bt.updateRoot,
  plugins: jt,
  globalTimeline: st,
  core: {
    PropTween: Dt,
    globals: Cl,
    Tween: pt,
    Timeline: Bt,
    Animation: ys,
    getCache: ii,
    _removeLinkedListItem: xr,
    reverting: function() {
      return Mt;
    },
    context: function(i) {
      return i && et && (et.data.push(i), i._ctx = et), et;
    },
    suppressOverwrites: function(i) {
      return no = i;
    }
  }
};
zt("to,from,fromTo,delayedCall,set,killTweensOf", function(i) {
  return ar[i] = pt[i];
});
Yt.add(Bt.updateRoot);
bi = ar.to({}, {
  duration: 0
});
var Qu = function(i, t) {
  for (var e = i._pt; e && e.p !== t && e.op !== t && e.fp !== t; )
    e = e._next;
  return e;
}, Zu = function(i, t) {
  var e = i._targets, s, n, r;
  for (s in t)
    for (n = e.length; n--; )
      r = i._ptLookup[n][s], r && (r = r.d) && (r._pt && (r = Qu(r, s)), r && r.modifier && r.modifier(t[s], i, e[n], s));
}, Lr = function(i, t) {
  return {
    name: i,
    rawVars: 1,
    //don't pre-process function-based values or "random()" strings.
    init: function(e, s, n) {
      n._onInit = function(r) {
        var o, a;
        if (wt(s) && (o = {}, zt(s, function(l) {
          return o[l] = 1;
        }), s = o), t) {
          o = {};
          for (a in s)
            o[a] = t(s[a]);
          s = o;
        }
        Zu(r, s);
      };
    }
  };
}, Gt = ar.registerPlugin({
  name: "attr",
  init: function(i, t, e, s, n) {
    var r, o, a;
    this.tween = e;
    for (r in t)
      a = i.getAttribute(r) || "", o = this.add(i, "setAttribute", (a || 0) + "", t[r], s, n, 0, 0, r), o.op = r, o.b = a, this._props.push(r);
  },
  render: function(i, t) {
    for (var e = t._pt; e; )
      Mt ? e.set(e.t, e.p, e.b, e) : e.r(i, e.d), e = e._next;
  }
}, {
  name: "endArray",
  init: function(i, t) {
    for (var e = t.length; e--; )
      this.add(i, e, i[e] || 0, t[e], 0, 0, 0, 0, 0, 1);
  }
}, Lr("roundProps", Cn), Lr("modifiers"), Lr("snap", Dl)) || ar;
pt.version = Bt.version = Gt.version = "3.12.5";
Al = 1;
ao() && Bi();
Y.Power0;
Y.Power1;
Y.Power2;
Y.Power3;
Y.Power4;
Y.Linear;
Y.Quad;
Y.Cubic;
Y.Quart;
Y.Quint;
Y.Strong;
Y.Elastic;
Y.Back;
Y.SteppedEase;
Y.Bounce;
Y.Sine;
Y.Expo;
Y.Circ;
/*!
 * CSSPlugin 3.12.5
 * https://gsap.com
 *
 * Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/
var Jo, Fe, Si, vo, Je, $o, bo, Ju = function() {
  return typeof window < "u";
}, Ee = {}, We = 180 / Math.PI, Ci = Math.PI / 180, fi = Math.atan2, ta = 1e8, _o = /([A-Z])/g, $u = /(left|right|width|margin|padding|x)/i, td = /[\s,\(]\S/, ge = {
  autoAlpha: "opacity,visibility",
  scale: "scaleX,scaleY",
  alpha: "opacity"
}, Tn = function(i, t) {
  return t.set(t.t, t.p, Math.round((t.s + t.c * i) * 1e4) / 1e4 + t.u, t);
}, ed = function(i, t) {
  return t.set(t.t, t.p, i === 1 ? t.e : Math.round((t.s + t.c * i) * 1e4) / 1e4 + t.u, t);
}, id = function(i, t) {
  return t.set(t.t, t.p, i ? Math.round((t.s + t.c * i) * 1e4) / 1e4 + t.u : t.b, t);
}, sd = function(i, t) {
  var e = t.s + t.c * i;
  t.set(t.t, t.p, ~~(e + (e < 0 ? -0.5 : 0.5)) + t.u, t);
}, nh = function(i, t) {
  return t.set(t.t, t.p, i ? t.e : t.b, t);
}, oh = function(i, t) {
  return t.set(t.t, t.p, i !== 1 ? t.b : t.e, t);
}, rd = function(i, t, e) {
  return i.style[t] = e;
}, nd = function(i, t, e) {
  return i.style.setProperty(t, e);
}, od = function(i, t, e) {
  return i._gsap[t] = e;
}, ad = function(i, t, e) {
  return i._gsap.scaleX = i._gsap.scaleY = e;
}, ld = function(i, t, e, s, n) {
  var r = i._gsap;
  r.scaleX = r.scaleY = e, r.renderTransform(n, r);
}, hd = function(i, t, e, s, n) {
  var r = i._gsap;
  r[t] = e, r.renderTransform(n, r);
}, nt = "transform", Ut = nt + "Origin", cd = function i(t, e) {
  var s = this, n = this.target, r = n.style, o = n._gsap;
  if (t in Ee && r) {
    if (this.tfm = this.tfm || {}, t !== "transform")
      t = ge[t] || t, ~t.indexOf(",") ? t.split(",").forEach(function(a) {
        return s.tfm[a] = Ce(n, a);
      }) : this.tfm[t] = o.x ? o[t] : Ce(n, t), t === Ut && (this.tfm.zOrigin = o.zOrigin);
    else
      return ge.transform.split(",").forEach(function(a) {
        return i.call(s, a, e);
      });
    if (this.props.indexOf(nt) >= 0)
      return;
    o.svg && (this.svgo = n.getAttribute("data-svg-origin"), this.props.push(Ut, e, "")), t = nt;
  }
  (r || e) && this.props.push(t, e, r[t]);
}, ah = function(i) {
  i.translate && (i.removeProperty("translate"), i.removeProperty("scale"), i.removeProperty("rotate"));
}, ud = function() {
  var i = this.props, t = this.target, e = t.style, s = t._gsap, n, r;
  for (n = 0; n < i.length; n += 3)
    i[n + 1] ? t[i[n]] = i[n + 2] : i[n + 2] ? e[i[n]] = i[n + 2] : e.removeProperty(i[n].substr(0, 2) === "--" ? i[n] : i[n].replace(_o, "-$1").toLowerCase());
  if (this.tfm) {
    for (r in this.tfm)
      s[r] = this.tfm[r];
    s.svg && (s.renderTransform(), t.setAttribute("data-svg-origin", this.svgo || "")), n = bo(), (!n || !n.isStart) && !e[nt] && (ah(e), s.zOrigin && e[Ut] && (e[Ut] += " " + s.zOrigin + "px", s.zOrigin = 0, s.renderTransform()), s.uncache = 1);
  }
}, lh = function(i, t) {
  var e = {
    target: i,
    props: [],
    revert: ud,
    save: cd
  };
  return i._gsap || Gt.core.getCache(i), t && t.split(",").forEach(function(s) {
    return e.save(s);
  }), e;
}, hh, kn = function(i, t) {
  var e = Fe.createElementNS ? Fe.createElementNS((t || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), i) : Fe.createElement(i);
  return e && e.style ? e : Fe.createElement(i);
}, xe = function i(t, e, s) {
  var n = getComputedStyle(t);
  return n[e] || n.getPropertyValue(e.replace(_o, "-$1").toLowerCase()) || n.getPropertyValue(e) || !s && i(t, Ri(e) || e, 1) || "";
}, ea = "O,Moz,ms,Ms,Webkit".split(","), Ri = function(i, t, e) {
  var s = t || Je, n = s.style, r = 5;
  if (i in n && !e)
    return i;
  for (i = i.charAt(0).toUpperCase() + i.substr(1); r-- && !(ea[r] + i in n); )
    ;
  return r < 0 ? null : (r === 3 ? "ms" : r >= 0 ? ea[r] : "") + i;
}, En = function() {
  Ju() && window.document && (Jo = window, Fe = Jo.document, Si = Fe.documentElement, Je = kn("div") || {
    style: {}
  }, kn("div"), nt = Ri(nt), Ut = nt + "Origin", Je.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0", hh = !!Ri("perspective"), bo = Gt.core.reverting, vo = 1);
}, zr = function i(t) {
  var e = kn("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"), s = this.parentNode, n = this.nextSibling, r = this.style.cssText, o;
  if (Si.appendChild(e), e.appendChild(this), this.style.display = "block", t)
    try {
      o = this.getBBox(), this._gsapBBox = this.getBBox, this.getBBox = i;
    } catch {
    }
  else this._gsapBBox && (o = this._gsapBBox());
  return s && (n ? s.insertBefore(this, n) : s.appendChild(this)), Si.removeChild(e), this.style.cssText = r, o;
}, ia = function(i, t) {
  for (var e = t.length; e--; )
    if (i.hasAttribute(t[e]))
      return i.getAttribute(t[e]);
}, ch = function(i) {
  var t;
  try {
    t = i.getBBox();
  } catch {
    t = zr.call(i, !0);
  }
  return t && (t.width || t.height) || i.getBBox === zr || (t = zr.call(i, !0)), t && !t.width && !t.x && !t.y ? {
    x: +ia(i, ["x", "cx", "x1"]) || 0,
    y: +ia(i, ["y", "cy", "y1"]) || 0,
    width: 0,
    height: 0
  } : t;
}, uh = function(i) {
  return !!(i.getCTM && (!i.parentNode || i.ownerSVGElement) && ch(i));
}, ai = function(i, t) {
  if (t) {
    var e = i.style, s;
    t in Ee && t !== Ut && (t = nt), e.removeProperty ? (s = t.substr(0, 2), (s === "ms" || t.substr(0, 6) === "webkit") && (t = "-" + t), e.removeProperty(s === "--" ? t : t.replace(_o, "-$1").toLowerCase())) : e.removeAttribute(t);
  }
}, Le = function(i, t, e, s, n, r) {
  var o = new Dt(i._pt, t, e, 0, 1, r ? oh : nh);
  return i._pt = o, o.b = s, o.e = n, i._props.push(e), o;
}, sa = {
  deg: 1,
  rad: 1,
  turn: 1
}, dd = {
  grid: 1,
  flex: 1
}, Ge = function i(t, e, s, n) {
  var r = parseFloat(s) || 0, o = (s + "").trim().substr((r + "").length) || "px", a = Je.style, l = $u.test(e), c = t.tagName.toLowerCase() === "svg", h = (c ? "client" : "offset") + (l ? "Width" : "Height"), f = 100, p = n === "px", u = n === "%", d, m, g, y;
  if (n === o || !r || sa[n] || sa[o])
    return r;
  if (o !== "px" && !p && (r = i(t, e, s, "px")), y = t.getCTM && uh(t), (u || o === "%") && (Ee[e] || ~e.indexOf("adius")))
    return d = y ? t.getBBox()[l ? "width" : "height"] : t[h], ut(u ? r / d * f : r / 100 * d);
  if (a[l ? "width" : "height"] = f + (p ? o : n), m = ~e.indexOf("adius") || n === "em" && t.appendChild && !c ? t : t.parentNode, y && (m = (t.ownerSVGElement || {}).parentNode), (!m || m === Fe || !m.appendChild) && (m = Fe.body), g = m._gsap, g && u && g.width && l && g.time === Yt.time && !g.uncache)
    return ut(r / g.width * f);
  if (u && (e === "height" || e === "width")) {
    var v = t.style[e];
    t.style[e] = f + n, d = t[h], v ? t.style[e] = v : ai(t, e);
  } else
    (u || o === "%") && !dd[xe(m, "display")] && (a.position = xe(t, "position")), m === t && (a.position = "static"), m.appendChild(Je), d = Je[h], m.removeChild(Je), a.position = "absolute";
  return l && u && (g = ii(m), g.time = Yt.time, g.width = m[h]), ut(p ? d * r / f : d && r ? f / d * r : 0);
}, Ce = function(i, t, e, s) {
  var n;
  return vo || En(), t in ge && t !== "transform" && (t = ge[t], ~t.indexOf(",") && (t = t.split(",")[0])), Ee[t] && t !== "transform" ? (n = vs(i, s), n = t !== "transformOrigin" ? n[t] : n.svg ? n.origin : hr(xe(i, Ut)) + " " + n.zOrigin + "px") : (n = i.style[t], (!n || n === "auto" || s || ~(n + "").indexOf("calc(")) && (n = lr[t] && lr[t](i, t, e) || xe(i, t) || Ml(i, t) || (t === "opacity" ? 1 : 0))), e && !~(n + "").trim().indexOf(" ") ? Ge(i, t, n, e) + e : n;
}, pd = function(i, t, e, s) {
  if (!e || e === "none") {
    var n = Ri(t, i, 1), r = n && xe(i, n, 1);
    r && r !== e ? (t = n, e = r) : t === "borderColor" && (e = xe(i, "borderTopColor"));
  }
  var o = new Dt(this._pt, i.style, t, 0, 1, ih), a = 0, l = 0, c, h, f, p, u, d, m, g, y, v, _, w;
  if (o.b = e, o.e = s, e += "", s += "", s === "auto" && (d = i.style[t], i.style[t] = s, s = xe(i, t) || s, d ? i.style[t] = d : ai(i, t)), c = [e, s], Wl(c), e = c[0], s = c[1], f = e.match(vi) || [], w = s.match(vi) || [], w.length) {
    for (; h = vi.exec(s); )
      m = h[0], y = s.substring(a, h.index), u ? u = (u + 1) % 5 : (y.substr(-5) === "rgba(" || y.substr(-5) === "hsla(") && (u = 1), m !== (d = f[l++] || "") && (p = parseFloat(d) || 0, _ = d.substr((p + "").length), m.charAt(1) === "=" && (m = Ai(p, m) + _), g = parseFloat(m), v = m.substr((g + "").length), a = vi.lastIndex - v.length, v || (v = v || Xt.units[t] || _, a === s.length && (s += v, o.e += v)), _ !== v && (p = Ge(i, t, d, v) || 0), o._pt = {
        _next: o._pt,
        p: y || l === 1 ? y : ",",
        //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
        s: p,
        c: g - p,
        m: u && u < 4 || t === "zIndex" ? Math.round : 0
      });
    o.c = a < s.length ? s.substring(a, s.length) : "";
  } else
    o.r = t === "display" && s === "none" ? oh : nh;
  return _l.test(s) && (o.e = 0), this._pt = o, o;
}, ra = {
  top: "0%",
  bottom: "100%",
  left: "0%",
  right: "100%",
  center: "50%"
}, fd = function(i) {
  var t = i.split(" "), e = t[0], s = t[1] || "50%";
  return (e === "top" || e === "bottom" || s === "left" || s === "right") && (i = e, e = s, s = i), t[0] = ra[e] || e, t[1] = ra[s] || s, t.join(" ");
}, md = function(i, t) {
  if (t.tween && t.tween._time === t.tween._dur) {
    var e = t.t, s = e.style, n = t.u, r = e._gsap, o, a, l;
    if (n === "all" || n === !0)
      s.cssText = "", a = 1;
    else
      for (n = n.split(","), l = n.length; --l > -1; )
        o = n[l], Ee[o] && (a = 1, o = o === "transformOrigin" ? Ut : nt), ai(e, o);
    a && (ai(e, nt), r && (r.svg && e.removeAttribute("transform"), vs(e, 1), r.uncache = 1, ah(s)));
  }
}, lr = {
  clearProps: function(i, t, e, s, n) {
    if (n.data !== "isFromStart") {
      var r = i._pt = new Dt(i._pt, t, e, 0, 0, md);
      return r.u = s, r.pr = -10, r.tween = n, i._props.push(e), 1;
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
}, xs = [1, 0, 0, 1, 0, 0], dh = {}, ph = function(i) {
  return i === "matrix(1, 0, 0, 1, 0, 0)" || i === "none" || !i;
}, na = function(i) {
  var t = xe(i, nt);
  return ph(t) ? xs : t.substr(7).match(bl).map(ut);
}, wo = function(i, t) {
  var e = i._gsap || ii(i), s = i.style, n = na(i), r, o, a, l;
  return e.svg && i.getAttribute("transform") ? (a = i.transform.baseVal.consolidate().matrix, n = [a.a, a.b, a.c, a.d, a.e, a.f], n.join(",") === "1,0,0,1,0,0" ? xs : n) : (n === xs && !i.offsetParent && i !== Si && !e.svg && (a = s.display, s.display = "block", r = i.parentNode, (!r || !i.offsetParent) && (l = 1, o = i.nextElementSibling, Si.appendChild(i)), n = na(i), a ? s.display = a : ai(i, "display"), l && (o ? r.insertBefore(i, o) : r ? r.appendChild(i) : Si.removeChild(i))), t && n.length > 6 ? [n[0], n[1], n[4], n[5], n[12], n[13]] : n);
}, Bn = function(i, t, e, s, n, r) {
  var o = i._gsap, a = n || wo(i, !0), l = o.xOrigin || 0, c = o.yOrigin || 0, h = o.xOffset || 0, f = o.yOffset || 0, p = a[0], u = a[1], d = a[2], m = a[3], g = a[4], y = a[5], v = t.split(" "), _ = parseFloat(v[0]) || 0, w = parseFloat(v[1]) || 0, x, A, S, b;
  e ? a !== xs && (A = p * m - u * d) && (S = _ * (m / A) + w * (-d / A) + (d * y - m * g) / A, b = _ * (-u / A) + w * (p / A) - (p * y - u * g) / A, _ = S, w = b) : (x = ch(i), _ = x.x + (~v[0].indexOf("%") ? _ / 100 * x.width : _), w = x.y + (~(v[1] || v[0]).indexOf("%") ? w / 100 * x.height : w)), s || s !== !1 && o.smooth ? (g = _ - l, y = w - c, o.xOffset = h + (g * p + y * d) - g, o.yOffset = f + (g * u + y * m) - y) : o.xOffset = o.yOffset = 0, o.xOrigin = _, o.yOrigin = w, o.smooth = !!s, o.origin = t, o.originIsAbsolute = !!e, i.style[Ut] = "0px 0px", r && (Le(r, o, "xOrigin", l, _), Le(r, o, "yOrigin", c, w), Le(r, o, "xOffset", h, o.xOffset), Le(r, o, "yOffset", f, o.yOffset)), i.setAttribute("data-svg-origin", _ + " " + w);
}, vs = function(i, t) {
  var e = i._gsap || new Ql(i);
  if ("x" in e && !t && !e.uncache)
    return e;
  var s = i.style, n = e.scaleX < 0, r = "px", o = "deg", a = getComputedStyle(i), l = xe(i, Ut) || "0", c, h, f, p, u, d, m, g, y, v, _, w, x, A, S, b, C, P, M, T, k, E, B, R, I, U, O, F, Z, G, W, lt;
  return c = h = f = d = m = g = y = v = _ = 0, p = u = 1, e.svg = !!(i.getCTM && uh(i)), a.translate && ((a.translate !== "none" || a.scale !== "none" || a.rotate !== "none") && (s[nt] = (a.translate !== "none" ? "translate3d(" + (a.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + (a.rotate !== "none" ? "rotate(" + a.rotate + ") " : "") + (a.scale !== "none" ? "scale(" + a.scale.split(" ").join(",") + ") " : "") + (a[nt] !== "none" ? a[nt] : "")), s.scale = s.rotate = s.translate = "none"), A = wo(i, e.svg), e.svg && (e.uncache ? (I = i.getBBox(), l = e.xOrigin - I.x + "px " + (e.yOrigin - I.y) + "px", R = "") : R = !t && i.getAttribute("data-svg-origin"), Bn(i, R || l, !!R || e.originIsAbsolute, e.smooth !== !1, A)), w = e.xOrigin || 0, x = e.yOrigin || 0, A !== xs && (P = A[0], M = A[1], T = A[2], k = A[3], c = E = A[4], h = B = A[5], A.length === 6 ? (p = Math.sqrt(P * P + M * M), u = Math.sqrt(k * k + T * T), d = P || M ? fi(M, P) * We : 0, y = T || k ? fi(T, k) * We + d : 0, y && (u *= Math.abs(Math.cos(y * Ci))), e.svg && (c -= w - (w * P + x * T), h -= x - (w * M + x * k))) : (lt = A[6], G = A[7], O = A[8], F = A[9], Z = A[10], W = A[11], c = A[12], h = A[13], f = A[14], S = fi(lt, Z), m = S * We, S && (b = Math.cos(-S), C = Math.sin(-S), R = E * b + O * C, I = B * b + F * C, U = lt * b + Z * C, O = E * -C + O * b, F = B * -C + F * b, Z = lt * -C + Z * b, W = G * -C + W * b, E = R, B = I, lt = U), S = fi(-T, Z), g = S * We, S && (b = Math.cos(-S), C = Math.sin(-S), R = P * b - O * C, I = M * b - F * C, U = T * b - Z * C, W = k * C + W * b, P = R, M = I, T = U), S = fi(M, P), d = S * We, S && (b = Math.cos(S), C = Math.sin(S), R = P * b + M * C, I = E * b + B * C, M = M * b - P * C, B = B * b - E * C, P = R, E = I), m && Math.abs(m) + Math.abs(d) > 359.9 && (m = d = 0, g = 180 - g), p = ut(Math.sqrt(P * P + M * M + T * T)), u = ut(Math.sqrt(B * B + lt * lt)), S = fi(E, B), y = Math.abs(S) > 2e-4 ? S * We : 0, _ = W ? 1 / (W < 0 ? -W : W) : 0), e.svg && (R = i.getAttribute("transform"), e.forceCSS = i.setAttribute("transform", "") || !ph(xe(i, nt)), R && i.setAttribute("transform", R))), Math.abs(y) > 90 && Math.abs(y) < 270 && (n ? (p *= -1, y += d <= 0 ? 180 : -180, d += d <= 0 ? 180 : -180) : (u *= -1, y += y <= 0 ? 180 : -180)), t = t || e.uncache, e.x = c - ((e.xPercent = c && (!t && e.xPercent || (Math.round(i.offsetWidth / 2) === Math.round(-c) ? -50 : 0))) ? i.offsetWidth * e.xPercent / 100 : 0) + r, e.y = h - ((e.yPercent = h && (!t && e.yPercent || (Math.round(i.offsetHeight / 2) === Math.round(-h) ? -50 : 0))) ? i.offsetHeight * e.yPercent / 100 : 0) + r, e.z = f + r, e.scaleX = ut(p), e.scaleY = ut(u), e.rotation = ut(d) + o, e.rotationX = ut(m) + o, e.rotationY = ut(g) + o, e.skewX = y + o, e.skewY = v + o, e.transformPerspective = _ + r, (e.zOrigin = parseFloat(l.split(" ")[2]) || !t && e.zOrigin || 0) && (s[Ut] = hr(l)), e.xOffset = e.yOffset = 0, e.force3D = Xt.force3D, e.renderTransform = e.svg ? yd : hh ? fh : gd, e.uncache = 0, e;
}, hr = function(i) {
  return (i = i.split(" "))[0] + " " + i[1];
}, Dr = function(i, t, e) {
  var s = Ct(t);
  return ut(parseFloat(t) + parseFloat(Ge(i, "x", e + "px", s))) + s;
}, gd = function(i, t) {
  t.z = "0px", t.rotationY = t.rotationX = "0deg", t.force3D = 0, fh(i, t);
}, He = "0deg", Wi = "0px", je = ") ", fh = function(i, t) {
  var e = t || this, s = e.xPercent, n = e.yPercent, r = e.x, o = e.y, a = e.z, l = e.rotation, c = e.rotationY, h = e.rotationX, f = e.skewX, p = e.skewY, u = e.scaleX, d = e.scaleY, m = e.transformPerspective, g = e.force3D, y = e.target, v = e.zOrigin, _ = "", w = g === "auto" && i && i !== 1 || g === !0;
  if (v && (h !== He || c !== He)) {
    var x = parseFloat(c) * Ci, A = Math.sin(x), S = Math.cos(x), b;
    x = parseFloat(h) * Ci, b = Math.cos(x), r = Dr(y, r, A * b * -v), o = Dr(y, o, -Math.sin(x) * -v), a = Dr(y, a, S * b * -v + v);
  }
  m !== Wi && (_ += "perspective(" + m + je), (s || n) && (_ += "translate(" + s + "%, " + n + "%) "), (w || r !== Wi || o !== Wi || a !== Wi) && (_ += a !== Wi || w ? "translate3d(" + r + ", " + o + ", " + a + ") " : "translate(" + r + ", " + o + je), l !== He && (_ += "rotate(" + l + je), c !== He && (_ += "rotateY(" + c + je), h !== He && (_ += "rotateX(" + h + je), (f !== He || p !== He) && (_ += "skew(" + f + ", " + p + je), (u !== 1 || d !== 1) && (_ += "scale(" + u + ", " + d + je), y.style[nt] = _ || "translate(0, 0)";
}, yd = function(i, t) {
  var e = t || this, s = e.xPercent, n = e.yPercent, r = e.x, o = e.y, a = e.rotation, l = e.skewX, c = e.skewY, h = e.scaleX, f = e.scaleY, p = e.target, u = e.xOrigin, d = e.yOrigin, m = e.xOffset, g = e.yOffset, y = e.forceCSS, v = parseFloat(r), _ = parseFloat(o), w, x, A, S, b;
  a = parseFloat(a), l = parseFloat(l), c = parseFloat(c), c && (c = parseFloat(c), l += c, a += c), a || l ? (a *= Ci, l *= Ci, w = Math.cos(a) * h, x = Math.sin(a) * h, A = Math.sin(a - l) * -f, S = Math.cos(a - l) * f, l && (c *= Ci, b = Math.tan(l - c), b = Math.sqrt(1 + b * b), A *= b, S *= b, c && (b = Math.tan(c), b = Math.sqrt(1 + b * b), w *= b, x *= b)), w = ut(w), x = ut(x), A = ut(A), S = ut(S)) : (w = h, S = f, x = A = 0), (v && !~(r + "").indexOf("px") || _ && !~(o + "").indexOf("px")) && (v = Ge(p, "x", r, "px"), _ = Ge(p, "y", o, "px")), (u || d || m || g) && (v = ut(v + u - (u * w + d * A) + m), _ = ut(_ + d - (u * x + d * S) + g)), (s || n) && (b = p.getBBox(), v = ut(v + s / 100 * b.width), _ = ut(_ + n / 100 * b.height)), b = "matrix(" + w + "," + x + "," + A + "," + S + "," + v + "," + _ + ")", p.setAttribute("transform", b), y && (p.style[nt] = b);
}, xd = function(i, t, e, s, n) {
  var r = 360, o = wt(n), a = parseFloat(n) * (o && ~n.indexOf("rad") ? We : 1), l = a - s, c = s + l + "deg", h, f;
  return o && (h = n.split("_")[1], h === "short" && (l %= r, l !== l % (r / 2) && (l += l < 0 ? r : -r)), h === "cw" && l < 0 ? l = (l + r * ta) % r - ~~(l / r) * r : h === "ccw" && l > 0 && (l = (l - r * ta) % r - ~~(l / r) * r)), i._pt = f = new Dt(i._pt, t, e, s, l, ed), f.e = c, f.u = "deg", i._props.push(e), f;
}, oa = function(i, t) {
  for (var e in t)
    i[e] = t[e];
  return i;
}, vd = function(i, t, e) {
  var s = oa({}, e._gsap), n = "perspective,force3D,transformOrigin,svgOrigin", r = e.style, o, a, l, c, h, f, p, u;
  s.svg ? (l = e.getAttribute("transform"), e.setAttribute("transform", ""), r[nt] = t, o = vs(e, 1), ai(e, nt), e.setAttribute("transform", l)) : (l = getComputedStyle(e)[nt], r[nt] = t, o = vs(e, 1), r[nt] = l);
  for (a in Ee)
    l = s[a], c = o[a], l !== c && n.indexOf(a) < 0 && (p = Ct(l), u = Ct(c), h = p !== u ? Ge(e, a, l, u) : parseFloat(l), f = parseFloat(c), i._pt = new Dt(i._pt, o, a, h, f - h, Tn), i._pt.u = u || 0, i._props.push(a));
  oa(o, s);
};
zt("padding,margin,Width,Radius", function(i, t) {
  var e = "Top", s = "Right", n = "Bottom", r = "Left", o = (t < 3 ? [e, s, n, r] : [e + r, e + s, n + s, n + r]).map(function(a) {
    return t < 2 ? i + a : "border" + a + i;
  });
  lr[t > 1 ? "border" + i : i] = function(a, l, c, h, f) {
    var p, u;
    if (arguments.length < 4)
      return p = o.map(function(d) {
        return Ce(a, d, c);
      }), u = p.join(" "), u.split(p[0]).length === 5 ? p[0] : u;
    p = (h + "").split(" "), u = {}, o.forEach(function(d, m) {
      return u[d] = p[m] = p[m] || p[(m - 1) / 2 | 0];
    }), a.init(l, u, f);
  };
});
var mh = {
  name: "css",
  register: En,
  targetTest: function(i) {
    return i.style && i.nodeType;
  },
  init: function(i, t, e, s, n) {
    var r = this._props, o = i.style, a = e.vars.startAt, l, c, h, f, p, u, d, m, g, y, v, _, w, x, A, S;
    vo || En(), this.styles = this.styles || lh(i), S = this.styles.props, this.tween = e;
    for (d in t)
      if (d !== "autoRound" && (c = t[d], !(jt[d] && Zl(d, t, e, s, i, n)))) {
        if (p = typeof c, u = lr[d], p === "function" && (c = c.call(e, s, i, n), p = typeof c), p === "string" && ~c.indexOf("random(") && (c = ms(c)), u)
          u(this, i, d, c, e) && (A = 1);
        else if (d.substr(0, 2) === "--")
          l = (getComputedStyle(i).getPropertyValue(d) + "").trim(), c += "", De.lastIndex = 0, De.test(l) || (m = Ct(l), g = Ct(c)), g ? m !== g && (l = Ge(i, d, l, g) + g) : m && (c += m), this.add(o, "setProperty", l, c, s, n, 0, 0, d), r.push(d), S.push(d, 0, o[d]);
        else if (p !== "undefined") {
          if (a && d in a ? (l = typeof a[d] == "function" ? a[d].call(e, s, i, n) : a[d], wt(l) && ~l.indexOf("random(") && (l = ms(l)), Ct(l + "") || l === "auto" || (l += Xt.units[d] || Ct(Ce(i, d)) || ""), (l + "").charAt(1) === "=" && (l = Ce(i, d))) : l = Ce(i, d), f = parseFloat(l), y = p === "string" && c.charAt(1) === "=" && c.substr(0, 2), y && (c = c.substr(2)), h = parseFloat(c), d in ge && (d === "autoAlpha" && (f === 1 && Ce(i, "visibility") === "hidden" && h && (f = 0), S.push("visibility", 0, o.visibility), Le(this, o, "visibility", f ? "inherit" : "hidden", h ? "inherit" : "hidden", !h)), d !== "scale" && d !== "transform" && (d = ge[d], ~d.indexOf(",") && (d = d.split(",")[0]))), v = d in Ee, v) {
            if (this.styles.save(d), _ || (w = i._gsap, w.renderTransform && !t.parseTransform || vs(i, t.parseTransform), x = t.smoothOrigin !== !1 && w.smooth, _ = this._pt = new Dt(this._pt, o, nt, 0, 1, w.renderTransform, w, 0, -1), _.dep = 1), d === "scale")
              this._pt = new Dt(this._pt, w, "scaleY", w.scaleY, (y ? Ai(w.scaleY, y + h) : h) - w.scaleY || 0, Tn), this._pt.u = 0, r.push("scaleY", d), d += "X";
            else if (d === "transformOrigin") {
              S.push(Ut, 0, o[Ut]), c = fd(c), w.svg ? Bn(i, c, 0, x, 0, this) : (g = parseFloat(c.split(" ")[2]) || 0, g !== w.zOrigin && Le(this, w, "zOrigin", w.zOrigin, g), Le(this, o, d, hr(l), hr(c)));
              continue;
            } else if (d === "svgOrigin") {
              Bn(i, c, 1, x, 0, this);
              continue;
            } else if (d in dh) {
              xd(this, w, d, f, y ? Ai(f, y + c) : c);
              continue;
            } else if (d === "smoothOrigin") {
              Le(this, w, "smooth", w.smooth, c);
              continue;
            } else if (d === "force3D") {
              w[d] = c;
              continue;
            } else if (d === "transform") {
              vd(this, c, i);
              continue;
            }
          } else d in o || (d = Ri(d) || d);
          if (v || (h || h === 0) && (f || f === 0) && !td.test(c) && d in o)
            m = (l + "").substr((f + "").length), h || (h = 0), g = Ct(c) || (d in Xt.units ? Xt.units[d] : m), m !== g && (f = Ge(i, d, l, g)), this._pt = new Dt(this._pt, v ? w : o, d, f, (y ? Ai(f, y + h) : h) - f, !v && (g === "px" || d === "zIndex") && t.autoRound !== !1 ? sd : Tn), this._pt.u = g || 0, m !== g && g !== "%" && (this._pt.b = l, this._pt.r = id);
          else if (d in o)
            pd.call(this, i, d, l, y ? y + c : c);
          else if (d in i)
            this.add(i, d, l || i[d], y ? y + c : c, s, n);
          else if (d !== "parseTransform") {
            ho(d, c);
            continue;
          }
          v || (d in o ? S.push(d, 0, o[d]) : S.push(d, 1, l || i[d])), r.push(d);
        }
      }
    A && sh(this);
  },
  render: function(i, t) {
    if (t.tween._time || !bo())
      for (var e = t._pt; e; )
        e.r(i, e.d), e = e._next;
    else
      t.styles.revert();
  },
  get: Ce,
  aliases: ge,
  getSetter: function(i, t, e) {
    var s = ge[t];
    return s && s.indexOf(",") < 0 && (t = s), t in Ee && t !== Ut && (i._gsap.x || Ce(i, "x")) ? e && $o === e ? t === "scale" ? ad : od : ($o = e || {}) && (t === "scale" ? ld : hd) : i.style && !oo(i.style[t]) ? rd : ~t.indexOf("-") ? nd : yo(i, t);
  },
  core: {
    _removeProperty: ai,
    _getMatrix: wo
  }
};
Gt.utils.checkPrefix = Ri;
Gt.core.getStyleSaver = lh;
(function(i, t, e, s) {
  var n = zt(i + "," + t + "," + e, function(r) {
    Ee[r] = 1;
  });
  zt(t, function(r) {
    Xt.units[r] = "deg", dh[r] = 1;
  }), ge[n[13]] = i + "," + t, zt(s, function(r) {
    var o = r.split(":");
    ge[o[1]] = n[o[0]];
  });
})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");
zt("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function(i) {
  Xt.units[i] = "px";
});
Gt.registerPlugin(mh);
var ts = Gt.registerPlugin(mh) || Gt;
ts.core.Tween;
class Di {
  constructor(t) {
    fe(this, "_options"), fe(this, "_tween", null), this._options = t;
  }
  get options() {
    return this._options;
  }
  start(t) {
    return new Promise((e) => {
      this._tween = ts.fromTo(t, this.options.from, {
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
  static initEngine() {
    ts.ticker.remove(ts.updateRoot);
  }
  static updateEngine(t) {
    this.rootTimeMs += t, ts.updateRoot(this.rootTimeMs / 1e3);
  }
}
fe(Di, "rootTimeMs", 0);
var gh = { exports: {} };
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
  (function(e, s) {
    i.exports = s();
  })(Ze, function() {
    return (
      /******/
      function(e) {
        var s = {};
        function n(r) {
          if (s[r])
            return s[r].exports;
          var o = s[r] = {
            /******/
            i: r,
            /******/
            l: !1,
            /******/
            exports: {}
            /******/
          };
          return e[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports;
        }
        return n.m = e, n.c = s, n.d = function(r, o, a) {
          n.o(r, o) || Object.defineProperty(r, o, { enumerable: !0, get: a });
        }, n.r = function(r) {
          typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(r, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(r, "__esModule", { value: !0 });
        }, n.t = function(r, o) {
          if (o & 1 && (r = n(r)), o & 8 || o & 4 && typeof r == "object" && r && r.__esModule) return r;
          var a = /* @__PURE__ */ Object.create(null);
          if (n.r(a), Object.defineProperty(a, "default", { enumerable: !0, value: r }), o & 2 && typeof r != "string") for (var l in r) n.d(a, l, (function(c) {
            return r[c];
          }).bind(null, l));
          return a;
        }, n.n = function(r) {
          var o = r && r.__esModule ? (
            /******/
            function() {
              return r.default;
            }
          ) : (
            /******/
            function() {
              return r;
            }
          );
          return n.d(o, "a", o), o;
        }, n.o = function(r, o) {
          return Object.prototype.hasOwnProperty.call(r, o);
        }, n.p = "", n(n.s = 20);
      }([
        /* 0 */
        /***/
        function(e, s) {
          var n = {};
          e.exports = n, function() {
            n._baseDelta = 1e3 / 60, n._nextId = 0, n._seed = 0, n._nowStartTime = +/* @__PURE__ */ new Date(), n._warnedOnce = {}, n._decomp = null, n.extend = function(o, a) {
              var l, c;
              typeof a == "boolean" ? (l = 2, c = a) : (l = 1, c = !0);
              for (var h = l; h < arguments.length; h++) {
                var f = arguments[h];
                if (f)
                  for (var p in f)
                    c && f[p] && f[p].constructor === Object && (!o[p] || o[p].constructor === Object) ? (o[p] = o[p] || {}, n.extend(o[p], c, f[p])) : o[p] = f[p];
              }
              return o;
            }, n.clone = function(o, a) {
              return n.extend({}, a, o);
            }, n.keys = function(o) {
              if (Object.keys)
                return Object.keys(o);
              var a = [];
              for (var l in o)
                a.push(l);
              return a;
            }, n.values = function(o) {
              var a = [];
              if (Object.keys) {
                for (var l = Object.keys(o), c = 0; c < l.length; c++)
                  a.push(o[l[c]]);
                return a;
              }
              for (var h in o)
                a.push(o[h]);
              return a;
            }, n.get = function(o, a, l, c) {
              a = a.split(".").slice(l, c);
              for (var h = 0; h < a.length; h += 1)
                o = o[a[h]];
              return o;
            }, n.set = function(o, a, l, c, h) {
              var f = a.split(".").slice(c, h);
              return n.get(o, a, 0, -1)[f[f.length - 1]] = l, l;
            }, n.shuffle = function(o) {
              for (var a = o.length - 1; a > 0; a--) {
                var l = Math.floor(n.random() * (a + 1)), c = o[a];
                o[a] = o[l], o[l] = c;
              }
              return o;
            }, n.choose = function(o) {
              return o[Math.floor(n.random() * o.length)];
            }, n.isElement = function(o) {
              return typeof HTMLElement < "u" ? o instanceof HTMLElement : !!(o && o.nodeType && o.nodeName);
            }, n.isArray = function(o) {
              return Object.prototype.toString.call(o) === "[object Array]";
            }, n.isFunction = function(o) {
              return typeof o == "function";
            }, n.isPlainObject = function(o) {
              return typeof o == "object" && o.constructor === Object;
            }, n.isString = function(o) {
              return toString.call(o) === "[object String]";
            }, n.clamp = function(o, a, l) {
              return o < a ? a : o > l ? l : o;
            }, n.sign = function(o) {
              return o < 0 ? -1 : 1;
            }, n.now = function() {
              if (typeof window < "u" && window.performance) {
                if (window.performance.now)
                  return window.performance.now();
                if (window.performance.webkitNow)
                  return window.performance.webkitNow();
              }
              return Date.now ? Date.now() : /* @__PURE__ */ new Date() - n._nowStartTime;
            }, n.random = function(o, a) {
              return o = typeof o < "u" ? o : 0, a = typeof a < "u" ? a : 1, o + r() * (a - o);
            };
            var r = function() {
              return n._seed = (n._seed * 9301 + 49297) % 233280, n._seed / 233280;
            };
            n.colorToNumber = function(o) {
              return o = o.replace("#", ""), o.length == 3 && (o = o.charAt(0) + o.charAt(0) + o.charAt(1) + o.charAt(1) + o.charAt(2) + o.charAt(2)), parseInt(o, 16);
            }, n.logLevel = 1, n.log = function() {
              console && n.logLevel > 0 && n.logLevel <= 3 && console.log.apply(console, ["matter-js:"].concat(Array.prototype.slice.call(arguments)));
            }, n.info = function() {
              console && n.logLevel > 0 && n.logLevel <= 2 && console.info.apply(console, ["matter-js:"].concat(Array.prototype.slice.call(arguments)));
            }, n.warn = function() {
              console && n.logLevel > 0 && n.logLevel <= 3 && console.warn.apply(console, ["matter-js:"].concat(Array.prototype.slice.call(arguments)));
            }, n.warnOnce = function() {
              var o = Array.prototype.slice.call(arguments).join(" ");
              n._warnedOnce[o] || (n.warn(o), n._warnedOnce[o] = !0);
            }, n.deprecated = function(o, a, l) {
              o[a] = n.chain(function() {
                n.warnOnce("🔅 deprecated 🔅", l);
              }, o[a]);
            }, n.nextId = function() {
              return n._nextId++;
            }, n.indexOf = function(o, a) {
              if (o.indexOf)
                return o.indexOf(a);
              for (var l = 0; l < o.length; l++)
                if (o[l] === a)
                  return l;
              return -1;
            }, n.map = function(o, a) {
              if (o.map)
                return o.map(a);
              for (var l = [], c = 0; c < o.length; c += 1)
                l.push(a(o[c]));
              return l;
            }, n.topologicalSort = function(o) {
              var a = [], l = [], c = [];
              for (var h in o)
                !l[h] && !c[h] && n._topologicalSort(h, l, c, o, a);
              return a;
            }, n._topologicalSort = function(o, a, l, c, h) {
              var f = c[o] || [];
              l[o] = !0;
              for (var p = 0; p < f.length; p += 1) {
                var u = f[p];
                l[u] || a[u] || n._topologicalSort(u, a, l, c, h);
              }
              l[o] = !1, a[o] = !0, h.push(o);
            }, n.chain = function() {
              for (var o = [], a = 0; a < arguments.length; a += 1) {
                var l = arguments[a];
                l._chained ? o.push.apply(o, l._chained) : o.push(l);
              }
              var c = function() {
                for (var h, f = new Array(arguments.length), p = 0, u = arguments.length; p < u; p++)
                  f[p] = arguments[p];
                for (p = 0; p < o.length; p += 1) {
                  var d = o[p].apply(h, f);
                  typeof d < "u" && (h = d);
                }
                return h;
              };
              return c._chained = o, c;
            }, n.chainPathBefore = function(o, a, l) {
              return n.set(o, a, n.chain(
                l,
                n.get(o, a)
              ));
            }, n.chainPathAfter = function(o, a, l) {
              return n.set(o, a, n.chain(
                n.get(o, a),
                l
              ));
            }, n.setDecomp = function(o) {
              n._decomp = o;
            }, n.getDecomp = function() {
              var o = n._decomp;
              try {
                !o && typeof window < "u" && (o = window.decomp), !o && typeof Ze < "u" && (o = Ze.decomp);
              } catch {
                o = null;
              }
              return o;
            };
          }();
        },
        /* 1 */
        /***/
        function(e, s) {
          var n = {};
          e.exports = n, function() {
            n.create = function(r) {
              var o = {
                min: { x: 0, y: 0 },
                max: { x: 0, y: 0 }
              };
              return r && n.update(o, r), o;
            }, n.update = function(r, o, a) {
              r.min.x = 1 / 0, r.max.x = -1 / 0, r.min.y = 1 / 0, r.max.y = -1 / 0;
              for (var l = 0; l < o.length; l++) {
                var c = o[l];
                c.x > r.max.x && (r.max.x = c.x), c.x < r.min.x && (r.min.x = c.x), c.y > r.max.y && (r.max.y = c.y), c.y < r.min.y && (r.min.y = c.y);
              }
              a && (a.x > 0 ? r.max.x += a.x : r.min.x += a.x, a.y > 0 ? r.max.y += a.y : r.min.y += a.y);
            }, n.contains = function(r, o) {
              return o.x >= r.min.x && o.x <= r.max.x && o.y >= r.min.y && o.y <= r.max.y;
            }, n.overlaps = function(r, o) {
              return r.min.x <= o.max.x && r.max.x >= o.min.x && r.max.y >= o.min.y && r.min.y <= o.max.y;
            }, n.translate = function(r, o) {
              r.min.x += o.x, r.max.x += o.x, r.min.y += o.y, r.max.y += o.y;
            }, n.shift = function(r, o) {
              var a = r.max.x - r.min.x, l = r.max.y - r.min.y;
              r.min.x = o.x, r.max.x = o.x + a, r.min.y = o.y, r.max.y = o.y + l;
            };
          }();
        },
        /* 2 */
        /***/
        function(e, s) {
          var n = {};
          e.exports = n, function() {
            n.create = function(r, o) {
              return { x: r || 0, y: o || 0 };
            }, n.clone = function(r) {
              return { x: r.x, y: r.y };
            }, n.magnitude = function(r) {
              return Math.sqrt(r.x * r.x + r.y * r.y);
            }, n.magnitudeSquared = function(r) {
              return r.x * r.x + r.y * r.y;
            }, n.rotate = function(r, o, a) {
              var l = Math.cos(o), c = Math.sin(o);
              a || (a = {});
              var h = r.x * l - r.y * c;
              return a.y = r.x * c + r.y * l, a.x = h, a;
            }, n.rotateAbout = function(r, o, a, l) {
              var c = Math.cos(o), h = Math.sin(o);
              l || (l = {});
              var f = a.x + ((r.x - a.x) * c - (r.y - a.y) * h);
              return l.y = a.y + ((r.x - a.x) * h + (r.y - a.y) * c), l.x = f, l;
            }, n.normalise = function(r) {
              var o = n.magnitude(r);
              return o === 0 ? { x: 0, y: 0 } : { x: r.x / o, y: r.y / o };
            }, n.dot = function(r, o) {
              return r.x * o.x + r.y * o.y;
            }, n.cross = function(r, o) {
              return r.x * o.y - r.y * o.x;
            }, n.cross3 = function(r, o, a) {
              return (o.x - r.x) * (a.y - r.y) - (o.y - r.y) * (a.x - r.x);
            }, n.add = function(r, o, a) {
              return a || (a = {}), a.x = r.x + o.x, a.y = r.y + o.y, a;
            }, n.sub = function(r, o, a) {
              return a || (a = {}), a.x = r.x - o.x, a.y = r.y - o.y, a;
            }, n.mult = function(r, o) {
              return { x: r.x * o, y: r.y * o };
            }, n.div = function(r, o) {
              return { x: r.x / o, y: r.y / o };
            }, n.perp = function(r, o) {
              return o = o === !0 ? -1 : 1, { x: o * -r.y, y: o * r.x };
            }, n.neg = function(r) {
              return { x: -r.x, y: -r.y };
            }, n.angle = function(r, o) {
              return Math.atan2(o.y - r.y, o.x - r.x);
            }, n._temp = [
              n.create(),
              n.create(),
              n.create(),
              n.create(),
              n.create(),
              n.create()
            ];
          }();
        },
        /* 3 */
        /***/
        function(e, s, n) {
          var r = {};
          e.exports = r;
          var o = n(2), a = n(0);
          (function() {
            r.create = function(l, c) {
              for (var h = [], f = 0; f < l.length; f++) {
                var p = l[f], u = {
                  x: p.x,
                  y: p.y,
                  index: f,
                  body: c,
                  isInternal: !1
                };
                h.push(u);
              }
              return h;
            }, r.fromPath = function(l, c) {
              var h = /L?\s*([-\d.e]+)[\s,]*([-\d.e]+)*/ig, f = [];
              return l.replace(h, function(p, u, d) {
                f.push({ x: parseFloat(u), y: parseFloat(d) });
              }), r.create(f, c);
            }, r.centre = function(l) {
              for (var c = r.area(l, !0), h = { x: 0, y: 0 }, f, p, u, d = 0; d < l.length; d++)
                u = (d + 1) % l.length, f = o.cross(l[d], l[u]), p = o.mult(o.add(l[d], l[u]), f), h = o.add(h, p);
              return o.div(h, 6 * c);
            }, r.mean = function(l) {
              for (var c = { x: 0, y: 0 }, h = 0; h < l.length; h++)
                c.x += l[h].x, c.y += l[h].y;
              return o.div(c, l.length);
            }, r.area = function(l, c) {
              for (var h = 0, f = l.length - 1, p = 0; p < l.length; p++)
                h += (l[f].x - l[p].x) * (l[f].y + l[p].y), f = p;
              return c ? h / 2 : Math.abs(h) / 2;
            }, r.inertia = function(l, c) {
              for (var h = 0, f = 0, p = l, u, d, m = 0; m < p.length; m++)
                d = (m + 1) % p.length, u = Math.abs(o.cross(p[d], p[m])), h += u * (o.dot(p[d], p[d]) + o.dot(p[d], p[m]) + o.dot(p[m], p[m])), f += u;
              return c / 6 * (h / f);
            }, r.translate = function(l, c, h) {
              h = typeof h < "u" ? h : 1;
              var f = l.length, p = c.x * h, u = c.y * h, d;
              for (d = 0; d < f; d++)
                l[d].x += p, l[d].y += u;
              return l;
            }, r.rotate = function(l, c, h) {
              if (c !== 0) {
                var f = Math.cos(c), p = Math.sin(c), u = h.x, d = h.y, m = l.length, g, y, v, _;
                for (_ = 0; _ < m; _++)
                  g = l[_], y = g.x - u, v = g.y - d, g.x = u + (y * f - v * p), g.y = d + (y * p + v * f);
                return l;
              }
            }, r.contains = function(l, c) {
              for (var h = c.x, f = c.y, p = l.length, u = l[p - 1], d, m = 0; m < p; m++) {
                if (d = l[m], (h - u.x) * (d.y - u.y) + (f - u.y) * (u.x - d.x) > 0)
                  return !1;
                u = d;
              }
              return !0;
            }, r.scale = function(l, c, h, f) {
              if (c === 1 && h === 1)
                return l;
              f = f || r.centre(l);
              for (var p, u, d = 0; d < l.length; d++)
                p = l[d], u = o.sub(p, f), l[d].x = f.x + u.x * c, l[d].y = f.y + u.y * h;
              return l;
            }, r.chamfer = function(l, c, h, f, p) {
              typeof c == "number" ? c = [c] : c = c || [8], h = typeof h < "u" ? h : -1, f = f || 2, p = p || 14;
              for (var u = [], d = 0; d < l.length; d++) {
                var m = l[d - 1 >= 0 ? d - 1 : l.length - 1], g = l[d], y = l[(d + 1) % l.length], v = c[d < c.length ? d : c.length - 1];
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
                }), x = Math.sqrt(2 * Math.pow(v, 2)), A = o.mult(a.clone(_), v), S = o.normalise(o.mult(o.add(_, w), 0.5)), b = o.sub(g, o.mult(S, x)), C = h;
                h === -1 && (C = Math.pow(v, 0.32) * 1.75), C = a.clamp(C, f, p), C % 2 === 1 && (C += 1);
                for (var P = Math.acos(o.dot(_, w)), M = P / C, T = 0; T < C; T++)
                  u.push(o.add(o.rotate(A, M * T), b));
              }
              return u;
            }, r.clockwiseSort = function(l) {
              var c = r.mean(l);
              return l.sort(function(h, f) {
                return o.angle(c, h) - o.angle(c, f);
              }), l;
            }, r.isConvex = function(l) {
              var c = 0, h = l.length, f, p, u, d;
              if (h < 3)
                return null;
              for (f = 0; f < h; f++)
                if (p = (f + 1) % h, u = (f + 2) % h, d = (l[p].x - l[f].x) * (l[u].y - l[p].y), d -= (l[p].y - l[f].y) * (l[u].x - l[p].x), d < 0 ? c |= 1 : d > 0 && (c |= 2), c === 3)
                  return !1;
              return c !== 0 ? !0 : null;
            }, r.hull = function(l) {
              var c = [], h = [], f, p;
              for (l = l.slice(0), l.sort(function(u, d) {
                var m = u.x - d.x;
                return m !== 0 ? m : u.y - d.y;
              }), p = 0; p < l.length; p += 1) {
                for (f = l[p]; h.length >= 2 && o.cross3(h[h.length - 2], h[h.length - 1], f) <= 0; )
                  h.pop();
                h.push(f);
              }
              for (p = l.length - 1; p >= 0; p -= 1) {
                for (f = l[p]; c.length >= 2 && o.cross3(c[c.length - 2], c[c.length - 1], f) <= 0; )
                  c.pop();
                c.push(f);
              }
              return c.pop(), h.pop(), c.concat(h);
            };
          })();
        },
        /* 4 */
        /***/
        function(e, s, n) {
          var r = {};
          e.exports = r;
          var o = n(3), a = n(2), l = n(7), c = n(0), h = n(1), f = n(11);
          (function() {
            r._timeCorrection = !0, r._inertiaScale = 4, r._nextCollidingGroupId = 1, r._nextNonCollidingGroupId = -1, r._nextCategory = 1, r._baseDelta = 1e3 / 60, r.create = function(u) {
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
            }, r.nextGroup = function(u) {
              return u ? r._nextNonCollidingGroupId-- : r._nextCollidingGroupId++;
            }, r.nextCategory = function() {
              return r._nextCategory = r._nextCategory << 1, r._nextCategory;
            };
            var p = function(u, d) {
              d = d || {}, r.set(u, {
                bounds: u.bounds || h.create(u.vertices),
                positionPrev: u.positionPrev || a.clone(u.position),
                anglePrev: u.anglePrev || u.angle,
                vertices: u.vertices,
                parts: u.parts || [u],
                isStatic: u.isStatic,
                isSleeping: u.isSleeping,
                parent: u.parent || u
              }), o.rotate(u.vertices, u.angle, u.position), f.rotate(u.axes, u.angle), h.update(u.bounds, u.vertices, u.velocity), r.set(u, {
                axes: d.axes || u.axes,
                area: d.area || u.area,
                mass: d.mass || u.mass,
                inertia: d.inertia || u.inertia
              });
              var m = u.isStatic ? "#14151f" : c.choose(["#f19648", "#f5d259", "#f55a3c", "#063e7b", "#ececd1"]), g = u.isStatic ? "#555" : "#ccc", y = u.isStatic && u.render.fillStyle === null ? 1 : 0;
              u.render.fillStyle = u.render.fillStyle || m, u.render.strokeStyle = u.render.strokeStyle || g, u.render.lineWidth = u.render.lineWidth || y, u.render.sprite.xOffset += -(u.bounds.min.x - u.position.x) / (u.bounds.max.x - u.bounds.min.x), u.render.sprite.yOffset += -(u.bounds.min.y - u.position.y) / (u.bounds.max.y - u.bounds.min.y);
            };
            r.set = function(u, d, m) {
              var g;
              typeof d == "string" && (g = d, d = {}, d[g] = m);
              for (g in d)
                if (Object.prototype.hasOwnProperty.call(d, g))
                  switch (m = d[g], g) {
                    case "isStatic":
                      r.setStatic(u, m);
                      break;
                    case "isSleeping":
                      l.set(u, m);
                      break;
                    case "mass":
                      r.setMass(u, m);
                      break;
                    case "density":
                      r.setDensity(u, m);
                      break;
                    case "inertia":
                      r.setInertia(u, m);
                      break;
                    case "vertices":
                      r.setVertices(u, m);
                      break;
                    case "position":
                      r.setPosition(u, m);
                      break;
                    case "angle":
                      r.setAngle(u, m);
                      break;
                    case "velocity":
                      r.setVelocity(u, m);
                      break;
                    case "angularVelocity":
                      r.setAngularVelocity(u, m);
                      break;
                    case "speed":
                      r.setSpeed(u, m);
                      break;
                    case "angularSpeed":
                      r.setAngularSpeed(u, m);
                      break;
                    case "parts":
                      r.setParts(u, m);
                      break;
                    case "centre":
                      r.setCentre(u, m);
                      break;
                    default:
                      u[g] = m;
                  }
            }, r.setStatic = function(u, d) {
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
            }, r.setMass = function(u, d) {
              var m = u.inertia / (u.mass / 6);
              u.inertia = m * (d / 6), u.inverseInertia = 1 / u.inertia, u.mass = d, u.inverseMass = 1 / u.mass, u.density = u.mass / u.area;
            }, r.setDensity = function(u, d) {
              r.setMass(u, d * u.area), u.density = d;
            }, r.setInertia = function(u, d) {
              u.inertia = d, u.inverseInertia = 1 / u.inertia;
            }, r.setVertices = function(u, d) {
              d[0].body === u ? u.vertices = d : u.vertices = o.create(d, u), u.axes = f.fromVertices(u.vertices), u.area = o.area(u.vertices), r.setMass(u, u.density * u.area);
              var m = o.centre(u.vertices);
              o.translate(u.vertices, m, -1), r.setInertia(u, r._inertiaScale * o.inertia(u.vertices, u.mass)), o.translate(u.vertices, u.position), h.update(u.bounds, u.vertices, u.velocity);
            }, r.setParts = function(u, d, m) {
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
                  r.setVertices(u, _), o.translate(u.vertices, w);
                }
                var x = r._totalProperties(u);
                u.area = x.area, u.parent = u, u.position.x = x.centre.x, u.position.y = x.centre.y, u.positionPrev.x = x.centre.x, u.positionPrev.y = x.centre.y, r.setMass(u, x.mass), r.setInertia(u, x.inertia), r.setPosition(u, x.centre);
              }
            }, r.setCentre = function(u, d, m) {
              m ? (u.positionPrev.x += d.x, u.positionPrev.y += d.y, u.position.x += d.x, u.position.y += d.y) : (u.positionPrev.x = d.x - (u.position.x - u.positionPrev.x), u.positionPrev.y = d.y - (u.position.y - u.positionPrev.y), u.position.x = d.x, u.position.y = d.y);
            }, r.setPosition = function(u, d, m) {
              var g = a.sub(d, u.position);
              m ? (u.positionPrev.x = u.position.x, u.positionPrev.y = u.position.y, u.velocity.x = g.x, u.velocity.y = g.y, u.speed = a.magnitude(g)) : (u.positionPrev.x += g.x, u.positionPrev.y += g.y);
              for (var y = 0; y < u.parts.length; y++) {
                var v = u.parts[y];
                v.position.x += g.x, v.position.y += g.y, o.translate(v.vertices, g), h.update(v.bounds, v.vertices, u.velocity);
              }
            }, r.setAngle = function(u, d, m) {
              var g = d - u.angle;
              m ? (u.anglePrev = u.angle, u.angularVelocity = g, u.angularSpeed = Math.abs(g)) : u.anglePrev += g;
              for (var y = 0; y < u.parts.length; y++) {
                var v = u.parts[y];
                v.angle += g, o.rotate(v.vertices, g, u.position), f.rotate(v.axes, g), h.update(v.bounds, v.vertices, u.velocity), y > 0 && a.rotateAbout(v.position, g, u.position, v.position);
              }
            }, r.setVelocity = function(u, d) {
              var m = u.deltaTime / r._baseDelta;
              u.positionPrev.x = u.position.x - d.x * m, u.positionPrev.y = u.position.y - d.y * m, u.velocity.x = (u.position.x - u.positionPrev.x) / m, u.velocity.y = (u.position.y - u.positionPrev.y) / m, u.speed = a.magnitude(u.velocity);
            }, r.getVelocity = function(u) {
              var d = r._baseDelta / u.deltaTime;
              return {
                x: (u.position.x - u.positionPrev.x) * d,
                y: (u.position.y - u.positionPrev.y) * d
              };
            }, r.getSpeed = function(u) {
              return a.magnitude(r.getVelocity(u));
            }, r.setSpeed = function(u, d) {
              r.setVelocity(u, a.mult(a.normalise(r.getVelocity(u)), d));
            }, r.setAngularVelocity = function(u, d) {
              var m = u.deltaTime / r._baseDelta;
              u.anglePrev = u.angle - d * m, u.angularVelocity = (u.angle - u.anglePrev) / m, u.angularSpeed = Math.abs(u.angularVelocity);
            }, r.getAngularVelocity = function(u) {
              return (u.angle - u.anglePrev) * r._baseDelta / u.deltaTime;
            }, r.getAngularSpeed = function(u) {
              return Math.abs(r.getAngularVelocity(u));
            }, r.setAngularSpeed = function(u, d) {
              r.setAngularVelocity(u, c.sign(r.getAngularVelocity(u)) * d);
            }, r.translate = function(u, d, m) {
              r.setPosition(u, a.add(u.position, d), m);
            }, r.rotate = function(u, d, m, g) {
              if (!m)
                r.setAngle(u, u.angle + d, g);
              else {
                var y = Math.cos(d), v = Math.sin(d), _ = u.position.x - m.x, w = u.position.y - m.y;
                r.setPosition(u, {
                  x: m.x + (_ * y - w * v),
                  y: m.y + (_ * v + w * y)
                }, g), r.setAngle(u, u.angle + d, g);
              }
            }, r.scale = function(u, d, m, g) {
              var y = 0, v = 0;
              g = g || u.position;
              for (var _ = 0; _ < u.parts.length; _++) {
                var w = u.parts[_];
                o.scale(w.vertices, d, m, g), w.axes = f.fromVertices(w.vertices), w.area = o.area(w.vertices), r.setMass(w, u.density * w.area), o.translate(w.vertices, { x: -w.position.x, y: -w.position.y }), r.setInertia(w, r._inertiaScale * o.inertia(w.vertices, w.mass)), o.translate(w.vertices, { x: w.position.x, y: w.position.y }), _ > 0 && (y += w.area, v += w.inertia), w.position.x = g.x + (w.position.x - g.x) * d, w.position.y = g.y + (w.position.y - g.y) * m, h.update(w.bounds, w.vertices, u.velocity);
              }
              u.parts.length > 1 && (u.area = y, u.isStatic || (r.setMass(u, u.density * y), r.setInertia(u, v))), u.circleRadius && (d === m ? u.circleRadius *= d : u.circleRadius = null);
            }, r.update = function(u, d) {
              d = (typeof d < "u" ? d : 1e3 / 60) * u.timeScale;
              var m = d * d, g = r._timeCorrection ? d / (u.deltaTime || d) : 1, y = 1 - u.frictionAir * (d / c._baseDelta), v = (u.position.x - u.positionPrev.x) * g, _ = (u.position.y - u.positionPrev.y) * g;
              u.velocity.x = v * y + u.force.x / u.mass * m, u.velocity.y = _ * y + u.force.y / u.mass * m, u.positionPrev.x = u.position.x, u.positionPrev.y = u.position.y, u.position.x += u.velocity.x, u.position.y += u.velocity.y, u.deltaTime = d, u.angularVelocity = (u.angle - u.anglePrev) * y * g + u.torque / u.inertia * m, u.anglePrev = u.angle, u.angle += u.angularVelocity;
              for (var w = 0; w < u.parts.length; w++) {
                var x = u.parts[w];
                o.translate(x.vertices, u.velocity), w > 0 && (x.position.x += u.velocity.x, x.position.y += u.velocity.y), u.angularVelocity !== 0 && (o.rotate(x.vertices, u.angularVelocity, u.position), f.rotate(x.axes, u.angularVelocity), w > 0 && a.rotateAbout(x.position, u.angularVelocity, u.position, x.position)), h.update(x.bounds, x.vertices, u.velocity);
              }
            }, r.updateVelocities = function(u) {
              var d = r._baseDelta / u.deltaTime, m = u.velocity;
              m.x = (u.position.x - u.positionPrev.x) * d, m.y = (u.position.y - u.positionPrev.y) * d, u.speed = Math.sqrt(m.x * m.x + m.y * m.y), u.angularVelocity = (u.angle - u.anglePrev) * d, u.angularSpeed = Math.abs(u.angularVelocity);
            }, r.applyForce = function(u, d, m) {
              var g = { x: d.x - u.position.x, y: d.y - u.position.y };
              u.force.x += m.x, u.force.y += m.y, u.torque += g.x * m.y - g.y * m.x;
            }, r._totalProperties = function(u) {
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
        function(e, s, n) {
          var r = {};
          e.exports = r;
          var o = n(0);
          (function() {
            r.on = function(a, l, c) {
              for (var h = l.split(" "), f, p = 0; p < h.length; p++)
                f = h[p], a.events = a.events || {}, a.events[f] = a.events[f] || [], a.events[f].push(c);
              return c;
            }, r.off = function(a, l, c) {
              if (!l) {
                a.events = {};
                return;
              }
              typeof l == "function" && (c = l, l = o.keys(a.events).join(" "));
              for (var h = l.split(" "), f = 0; f < h.length; f++) {
                var p = a.events[h[f]], u = [];
                if (c && p)
                  for (var d = 0; d < p.length; d++)
                    p[d] !== c && u.push(p[d]);
                a.events[h[f]] = u;
              }
            }, r.trigger = function(a, l, c) {
              var h, f, p, u, d = a.events;
              if (d && o.keys(d).length > 0) {
                c || (c = {}), h = l.split(" ");
                for (var m = 0; m < h.length; m++)
                  if (f = h[m], p = d[f], p) {
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
        function(e, s, n) {
          var r = {};
          e.exports = r;
          var o = n(5), a = n(0), l = n(1), c = n(4);
          (function() {
            r.create = function(h) {
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
              }, h);
            }, r.setModified = function(h, f, p, u) {
              if (h.isModified = f, f && h.cache && (h.cache.allBodies = null, h.cache.allConstraints = null, h.cache.allComposites = null), p && h.parent && r.setModified(h.parent, f, p, u), u)
                for (var d = 0; d < h.composites.length; d++) {
                  var m = h.composites[d];
                  r.setModified(m, f, p, u);
                }
            }, r.add = function(h, f) {
              var p = [].concat(f);
              o.trigger(h, "beforeAdd", { object: f });
              for (var u = 0; u < p.length; u++) {
                var d = p[u];
                switch (d.type) {
                  case "body":
                    if (d.parent !== d) {
                      a.warn("Composite.add: skipped adding a compound body part (you must add its parent instead)");
                      break;
                    }
                    r.addBody(h, d);
                    break;
                  case "constraint":
                    r.addConstraint(h, d);
                    break;
                  case "composite":
                    r.addComposite(h, d);
                    break;
                  case "mouseConstraint":
                    r.addConstraint(h, d.constraint);
                    break;
                }
              }
              return o.trigger(h, "afterAdd", { object: f }), h;
            }, r.remove = function(h, f, p) {
              var u = [].concat(f);
              o.trigger(h, "beforeRemove", { object: f });
              for (var d = 0; d < u.length; d++) {
                var m = u[d];
                switch (m.type) {
                  case "body":
                    r.removeBody(h, m, p);
                    break;
                  case "constraint":
                    r.removeConstraint(h, m, p);
                    break;
                  case "composite":
                    r.removeComposite(h, m, p);
                    break;
                  case "mouseConstraint":
                    r.removeConstraint(h, m.constraint);
                    break;
                }
              }
              return o.trigger(h, "afterRemove", { object: f }), h;
            }, r.addComposite = function(h, f) {
              return h.composites.push(f), f.parent = h, r.setModified(h, !0, !0, !1), h;
            }, r.removeComposite = function(h, f, p) {
              var u = a.indexOf(h.composites, f);
              if (u !== -1) {
                var d = r.allBodies(f);
                r.removeCompositeAt(h, u);
                for (var m = 0; m < d.length; m++)
                  d[m].sleepCounter = 0;
              }
              if (p)
                for (var m = 0; m < h.composites.length; m++)
                  r.removeComposite(h.composites[m], f, !0);
              return h;
            }, r.removeCompositeAt = function(h, f) {
              return h.composites.splice(f, 1), r.setModified(h, !0, !0, !1), h;
            }, r.addBody = function(h, f) {
              return h.bodies.push(f), r.setModified(h, !0, !0, !1), h;
            }, r.removeBody = function(h, f, p) {
              var u = a.indexOf(h.bodies, f);
              if (u !== -1 && (r.removeBodyAt(h, u), f.sleepCounter = 0), p)
                for (var d = 0; d < h.composites.length; d++)
                  r.removeBody(h.composites[d], f, !0);
              return h;
            }, r.removeBodyAt = function(h, f) {
              return h.bodies.splice(f, 1), r.setModified(h, !0, !0, !1), h;
            }, r.addConstraint = function(h, f) {
              return h.constraints.push(f), r.setModified(h, !0, !0, !1), h;
            }, r.removeConstraint = function(h, f, p) {
              var u = a.indexOf(h.constraints, f);
              if (u !== -1 && r.removeConstraintAt(h, u), p)
                for (var d = 0; d < h.composites.length; d++)
                  r.removeConstraint(h.composites[d], f, !0);
              return h;
            }, r.removeConstraintAt = function(h, f) {
              return h.constraints.splice(f, 1), r.setModified(h, !0, !0, !1), h;
            }, r.clear = function(h, f, p) {
              if (p)
                for (var u = 0; u < h.composites.length; u++)
                  r.clear(h.composites[u], f, !0);
              return f ? h.bodies = h.bodies.filter(function(d) {
                return d.isStatic;
              }) : h.bodies.length = 0, h.constraints.length = 0, h.composites.length = 0, r.setModified(h, !0, !0, !1), h;
            }, r.allBodies = function(h) {
              if (h.cache && h.cache.allBodies)
                return h.cache.allBodies;
              for (var f = [].concat(h.bodies), p = 0; p < h.composites.length; p++)
                f = f.concat(r.allBodies(h.composites[p]));
              return h.cache && (h.cache.allBodies = f), f;
            }, r.allConstraints = function(h) {
              if (h.cache && h.cache.allConstraints)
                return h.cache.allConstraints;
              for (var f = [].concat(h.constraints), p = 0; p < h.composites.length; p++)
                f = f.concat(r.allConstraints(h.composites[p]));
              return h.cache && (h.cache.allConstraints = f), f;
            }, r.allComposites = function(h) {
              if (h.cache && h.cache.allComposites)
                return h.cache.allComposites;
              for (var f = [].concat(h.composites), p = 0; p < h.composites.length; p++)
                f = f.concat(r.allComposites(h.composites[p]));
              return h.cache && (h.cache.allComposites = f), f;
            }, r.get = function(h, f, p) {
              var u, d;
              switch (p) {
                case "body":
                  u = r.allBodies(h);
                  break;
                case "constraint":
                  u = r.allConstraints(h);
                  break;
                case "composite":
                  u = r.allComposites(h).concat(h);
                  break;
              }
              return u ? (d = u.filter(function(m) {
                return m.id.toString() === f.toString();
              }), d.length === 0 ? null : d[0]) : null;
            }, r.move = function(h, f, p) {
              return r.remove(h, f), r.add(p, f), h;
            }, r.rebase = function(h) {
              for (var f = r.allBodies(h).concat(r.allConstraints(h)).concat(r.allComposites(h)), p = 0; p < f.length; p++)
                f[p].id = a.nextId();
              return h;
            }, r.translate = function(h, f, p) {
              for (var u = p ? r.allBodies(h) : h.bodies, d = 0; d < u.length; d++)
                c.translate(u[d], f);
              return h;
            }, r.rotate = function(h, f, p, u) {
              for (var d = Math.cos(f), m = Math.sin(f), g = u ? r.allBodies(h) : h.bodies, y = 0; y < g.length; y++) {
                var v = g[y], _ = v.position.x - p.x, w = v.position.y - p.y;
                c.setPosition(v, {
                  x: p.x + (_ * d - w * m),
                  y: p.y + (_ * m + w * d)
                }), c.rotate(v, f);
              }
              return h;
            }, r.scale = function(h, f, p, u, d) {
              for (var m = d ? r.allBodies(h) : h.bodies, g = 0; g < m.length; g++) {
                var y = m[g], v = y.position.x - u.x, _ = y.position.y - u.y;
                c.setPosition(y, {
                  x: u.x + v * f,
                  y: u.y + _ * p
                }), c.scale(y, f, p);
              }
              return h;
            }, r.bounds = function(h) {
              for (var f = r.allBodies(h), p = [], u = 0; u < f.length; u += 1) {
                var d = f[u];
                p.push(d.bounds.min, d.bounds.max);
              }
              return l.create(p);
            };
          })();
        },
        /* 7 */
        /***/
        function(e, s, n) {
          var r = {};
          e.exports = r;
          var o = n(4), a = n(5), l = n(0);
          (function() {
            r._motionWakeThreshold = 0.18, r._motionSleepThreshold = 0.08, r._minBias = 0.9, r.update = function(c, h) {
              for (var f = h / l._baseDelta, p = r._motionSleepThreshold, u = 0; u < c.length; u++) {
                var d = c[u], m = o.getSpeed(d), g = o.getAngularSpeed(d), y = m * m + g * g;
                if (d.force.x !== 0 || d.force.y !== 0) {
                  r.set(d, !1);
                  continue;
                }
                var v = Math.min(d.motion, y), _ = Math.max(d.motion, y);
                d.motion = r._minBias * v + (1 - r._minBias) * _, d.sleepThreshold > 0 && d.motion < p ? (d.sleepCounter += 1, d.sleepCounter >= d.sleepThreshold / f && r.set(d, !0)) : d.sleepCounter > 0 && (d.sleepCounter -= 1);
              }
            }, r.afterCollisions = function(c) {
              for (var h = r._motionSleepThreshold, f = 0; f < c.length; f++) {
                var p = c[f];
                if (p.isActive) {
                  var u = p.collision, d = u.bodyA.parent, m = u.bodyB.parent;
                  if (!(d.isSleeping && m.isSleeping || d.isStatic || m.isStatic) && (d.isSleeping || m.isSleeping)) {
                    var g = d.isSleeping && !d.isStatic ? d : m, y = g === d ? m : d;
                    !g.isStatic && y.motion > h && r.set(g, !1);
                  }
                }
              }
            }, r.set = function(c, h) {
              var f = c.isSleeping;
              h ? (c.isSleeping = !0, c.sleepCounter = c.sleepThreshold, c.positionImpulse.x = 0, c.positionImpulse.y = 0, c.positionPrev.x = c.position.x, c.positionPrev.y = c.position.y, c.anglePrev = c.angle, c.speed = 0, c.angularSpeed = 0, c.motion = 0, f || a.trigger(c, "sleepStart")) : (c.isSleeping = !1, c.sleepCounter = 0, f && a.trigger(c, "sleepEnd"));
            };
          })();
        },
        /* 8 */
        /***/
        function(e, s, n) {
          var r = {};
          e.exports = r;
          var o = n(3), a = n(9);
          (function() {
            var l = [], c = {
              overlap: 0,
              axis: null
            }, h = {
              overlap: 0,
              axis: null
            };
            r.create = function(f, p) {
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
            }, r.collides = function(f, p, u) {
              if (r._overlapAxes(c, f.vertices, p.vertices, f.axes), c.overlap <= 0 || (r._overlapAxes(h, p.vertices, f.vertices, p.axes), h.overlap <= 0))
                return null;
              var d = u && u.table[a.id(f, p)], m;
              d ? m = d.collision : (m = r.create(f, p), m.collided = !0, m.bodyA = f.id < p.id ? f : p, m.bodyB = f.id < p.id ? p : f, m.parentA = m.bodyA.parent, m.parentB = m.bodyB.parent), f = m.bodyA, p = m.bodyB;
              var g;
              c.overlap < h.overlap ? g = c : g = h;
              var y = m.normal, v = m.tangent, _ = m.penetration, w = m.supports, x = g.overlap, A = g.axis, S = A.x, b = A.y, C = p.position.x - f.position.x, P = p.position.y - f.position.y;
              S * C + b * P >= 0 && (S = -S, b = -b), y.x = S, y.y = b, v.x = -b, v.y = S, _.x = S * x, _.y = b * x, m.depth = x;
              var M = r._findSupports(f, p, y, 1), T = 0;
              if (o.contains(f.vertices, M[0]) && (w[T++] = M[0]), o.contains(f.vertices, M[1]) && (w[T++] = M[1]), T < 2) {
                var k = r._findSupports(p, f, y, -1);
                o.contains(p.vertices, k[0]) && (w[T++] = k[0]), T < 2 && o.contains(p.vertices, k[1]) && (w[T++] = k[1]);
              }
              return T === 0 && (w[T++] = M[0]), m.supportCount = T, m;
            }, r._overlapAxes = function(f, p, u, d) {
              var m = p.length, g = u.length, y = p[0].x, v = p[0].y, _ = u[0].x, w = u[0].y, x = d.length, A = Number.MAX_VALUE, S = 0, b, C, P, M, T, k;
              for (T = 0; T < x; T++) {
                var E = d[T], B = E.x, R = E.y, I = y * B + v * R, U = _ * B + w * R, O = I, F = U;
                for (k = 1; k < m; k += 1)
                  M = p[k].x * B + p[k].y * R, M > O ? O = M : M < I && (I = M);
                for (k = 1; k < g; k += 1)
                  M = u[k].x * B + u[k].y * R, M > F ? F = M : M < U && (U = M);
                if (C = O - U, P = F - I, b = C < P ? C : P, b < A && (A = b, S = T, b <= 0))
                  break;
              }
              f.axis = d[S], f.overlap = A;
            }, r._findSupports = function(f, p, u, d) {
              var m = p.vertices, g = m.length, y = f.position.x, v = f.position.y, _ = u.x * d, w = u.y * d, x = m[0], A = x, S = _ * (y - A.x) + w * (v - A.y), b, C, P;
              for (P = 1; P < g; P += 1)
                A = m[P], C = _ * (y - A.x) + w * (v - A.y), C < S && (S = C, x = A);
              return b = m[(g + x.index - 1) % g], S = _ * (y - b.x) + w * (v - b.y), A = m[(x.index + 1) % g], _ * (y - A.x) + w * (v - A.y) < S ? (l[0] = x, l[1] = A, l) : (l[0] = x, l[1] = b, l);
            };
          })();
        },
        /* 9 */
        /***/
        function(e, s, n) {
          var r = {};
          e.exports = r;
          var o = n(16);
          (function() {
            r.create = function(a, l) {
              var c = a.bodyA, h = a.bodyB, f = {
                id: r.id(c, h),
                bodyA: c,
                bodyB: h,
                collision: a,
                contacts: [o.create(), o.create()],
                contactCount: 0,
                separation: 0,
                isActive: !0,
                isSensor: c.isSensor || h.isSensor,
                timeCreated: l,
                timeUpdated: l,
                inverseMass: 0,
                friction: 0,
                frictionStatic: 0,
                restitution: 0,
                slop: 0
              };
              return r.update(f, a, l), f;
            }, r.update = function(a, l, c) {
              var h = l.supports, f = l.supportCount, p = a.contacts, u = l.parentA, d = l.parentB;
              a.isActive = !0, a.timeUpdated = c, a.collision = l, a.separation = l.depth, a.inverseMass = u.inverseMass + d.inverseMass, a.friction = u.friction < d.friction ? u.friction : d.friction, a.frictionStatic = u.frictionStatic > d.frictionStatic ? u.frictionStatic : d.frictionStatic, a.restitution = u.restitution > d.restitution ? u.restitution : d.restitution, a.slop = u.slop > d.slop ? u.slop : d.slop, a.contactCount = f, l.pair = a;
              var m = h[0], g = p[0], y = h[1], v = p[1];
              (v.vertex === m || g.vertex === y) && (p[1] = g, p[0] = g = v, v = p[1]), g.vertex = m, v.vertex = y;
            }, r.setActive = function(a, l, c) {
              l ? (a.isActive = !0, a.timeUpdated = c) : (a.isActive = !1, a.contactCount = 0);
            }, r.id = function(a, l) {
              return a.id < l.id ? a.id.toString(36) + ":" + l.id.toString(36) : l.id.toString(36) + ":" + a.id.toString(36);
            };
          })();
        },
        /* 10 */
        /***/
        function(e, s, n) {
          var r = {};
          e.exports = r;
          var o = n(3), a = n(2), l = n(7), c = n(1), h = n(11), f = n(0);
          (function() {
            r._warming = 0.4, r._torqueDampen = 1, r._minLength = 1e-6, r.create = function(p) {
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
            }, r.preSolveAll = function(p) {
              for (var u = 0; u < p.length; u += 1) {
                var d = p[u], m = d.constraintImpulse;
                d.isStatic || m.x === 0 && m.y === 0 && m.angle === 0 || (d.position.x += m.x, d.position.y += m.y, d.angle += m.angle);
              }
            }, r.solveAll = function(p, u) {
              for (var d = f.clamp(u / f._baseDelta, 0, 1), m = 0; m < p.length; m += 1) {
                var g = p[m], y = !g.bodyA || g.bodyA && g.bodyA.isStatic, v = !g.bodyB || g.bodyB && g.bodyB.isStatic;
                (y || v) && r.solve(p[m], d);
              }
              for (m = 0; m < p.length; m += 1)
                g = p[m], y = !g.bodyA || g.bodyA && g.bodyA.isStatic, v = !g.bodyB || g.bodyB && g.bodyB.isStatic, !y && !v && r.solve(p[m], d);
            }, r.solve = function(p, u) {
              var d = p.bodyA, m = p.bodyB, g = p.pointA, y = p.pointB;
              if (!(!d && !m)) {
                d && !d.isStatic && (a.rotate(g, d.angle - p.angleA, g), p.angleA = d.angle), m && !m.isStatic && (a.rotate(y, m.angle - p.angleB, y), p.angleB = m.angle);
                var v = g, _ = y;
                if (d && (v = a.add(d.position, g)), m && (_ = a.add(m.position, y)), !(!v || !_)) {
                  var w = a.sub(v, _), x = a.magnitude(w);
                  x < r._minLength && (x = r._minLength);
                  var A = (x - p.length) / x, S = p.stiffness >= 1 || p.length === 0, b = S ? p.stiffness * u : p.stiffness * u * u, C = p.damping * u, P = a.mult(w, A * b), M = (d ? d.inverseMass : 0) + (m ? m.inverseMass : 0), T = (d ? d.inverseInertia : 0) + (m ? m.inverseInertia : 0), k = M + T, E, B, R, I, U;
                  if (C > 0) {
                    var O = a.create();
                    R = a.div(w, x), U = a.sub(
                      m && a.sub(m.position, m.positionPrev) || O,
                      d && a.sub(d.position, d.positionPrev) || O
                    ), I = a.dot(R, U);
                  }
                  d && !d.isStatic && (B = d.inverseMass / M, d.constraintImpulse.x -= P.x * B, d.constraintImpulse.y -= P.y * B, d.position.x -= P.x * B, d.position.y -= P.y * B, C > 0 && (d.positionPrev.x -= C * R.x * I * B, d.positionPrev.y -= C * R.y * I * B), E = a.cross(g, P) / k * r._torqueDampen * d.inverseInertia * (1 - p.angularStiffness), d.constraintImpulse.angle -= E, d.angle -= E), m && !m.isStatic && (B = m.inverseMass / M, m.constraintImpulse.x += P.x * B, m.constraintImpulse.y += P.y * B, m.position.x += P.x * B, m.position.y += P.y * B, C > 0 && (m.positionPrev.x += C * R.x * I * B, m.positionPrev.y += C * R.y * I * B), E = a.cross(y, P) / k * r._torqueDampen * m.inverseInertia * (1 - p.angularStiffness), m.constraintImpulse.angle += E, m.angle += E);
                }
              }
            }, r.postSolveAll = function(p) {
              for (var u = 0; u < p.length; u++) {
                var d = p[u], m = d.constraintImpulse;
                if (!(d.isStatic || m.x === 0 && m.y === 0 && m.angle === 0)) {
                  l.set(d, !1);
                  for (var g = 0; g < d.parts.length; g++) {
                    var y = d.parts[g];
                    o.translate(y.vertices, m), g > 0 && (y.position.x += m.x, y.position.y += m.y), m.angle !== 0 && (o.rotate(y.vertices, m.angle, d.position), h.rotate(y.axes, m.angle), g > 0 && a.rotateAbout(y.position, m.angle, d.position, y.position)), c.update(y.bounds, y.vertices, d.velocity);
                  }
                  m.angle *= r._warming, m.x *= r._warming, m.y *= r._warming;
                }
              }
            }, r.pointAWorld = function(p) {
              return {
                x: (p.bodyA ? p.bodyA.position.x : 0) + (p.pointA ? p.pointA.x : 0),
                y: (p.bodyA ? p.bodyA.position.y : 0) + (p.pointA ? p.pointA.y : 0)
              };
            }, r.pointBWorld = function(p) {
              return {
                x: (p.bodyB ? p.bodyB.position.x : 0) + (p.pointB ? p.pointB.x : 0),
                y: (p.bodyB ? p.bodyB.position.y : 0) + (p.pointB ? p.pointB.y : 0)
              };
            }, r.currentLength = function(p) {
              var u = (p.bodyA ? p.bodyA.position.x : 0) + (p.pointA ? p.pointA.x : 0), d = (p.bodyA ? p.bodyA.position.y : 0) + (p.pointA ? p.pointA.y : 0), m = (p.bodyB ? p.bodyB.position.x : 0) + (p.pointB ? p.pointB.x : 0), g = (p.bodyB ? p.bodyB.position.y : 0) + (p.pointB ? p.pointB.y : 0), y = u - m, v = d - g;
              return Math.sqrt(y * y + v * v);
            };
          })();
        },
        /* 11 */
        /***/
        function(e, s, n) {
          var r = {};
          e.exports = r;
          var o = n(2), a = n(0);
          (function() {
            r.fromVertices = function(l) {
              for (var c = {}, h = 0; h < l.length; h++) {
                var f = (h + 1) % l.length, p = o.normalise({
                  x: l[f].y - l[h].y,
                  y: l[h].x - l[f].x
                }), u = p.y === 0 ? 1 / 0 : p.x / p.y;
                u = u.toFixed(3).toString(), c[u] = p;
              }
              return a.values(c);
            }, r.rotate = function(l, c) {
              if (c !== 0)
                for (var h = Math.cos(c), f = Math.sin(c), p = 0; p < l.length; p++) {
                  var u = l[p], d;
                  d = u.x * h - u.y * f, u.y = u.x * f + u.y * h, u.x = d;
                }
            };
          })();
        },
        /* 12 */
        /***/
        function(e, s, n) {
          var r = {};
          e.exports = r;
          var o = n(3), a = n(0), l = n(4), c = n(1), h = n(2);
          (function() {
            r.rectangle = function(f, p, u, d, m) {
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
              return l.create(a.extend({}, g, m));
            }, r.trapezoid = function(f, p, u, d, m, g) {
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
              return l.create(a.extend({}, A, g));
            }, r.circle = function(f, p, u, d, m) {
              d = d || {};
              var g = {
                label: "Circle Body",
                circleRadius: u
              };
              m = m || 25;
              var y = Math.ceil(Math.max(10, Math.min(m, u)));
              return y % 2 === 1 && (y += 1), r.polygon(f, p, y, u, a.extend({}, g, d));
            }, r.polygon = function(f, p, u, d, m) {
              if (m = m || {}, u < 3)
                return r.circle(f, p, d, m);
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
              return l.create(a.extend({}, S, m));
            }, r.fromVertices = function(f, p, u, d, m, g, y, v) {
              var _ = a.getDecomp(), w, x, A, S, b, C, P, M, T, k, E;
              for (w = !!(_ && _.quickDecomp), d = d || {}, A = [], m = typeof m < "u" ? m : !1, g = typeof g < "u" ? g : 0.01, y = typeof y < "u" ? y : 10, v = typeof v < "u" ? v : 0.01, a.isArray(u[0]) || (u = [u]), k = 0; k < u.length; k += 1)
                if (C = u[k], S = o.isConvex(C), b = !S, b && !w && a.warnOnce(
                  "Bodies.fromVertices: Install the 'poly-decomp' library and use Common.setDecomp or provide 'decomp' as a global to decompose concave vertices."
                ), S || !w)
                  S ? C = o.clockwiseSort(C) : C = o.hull(C), A.push({
                    position: { x: f, y: p },
                    vertices: C
                  });
                else {
                  var B = C.map(function(N) {
                    return [N.x, N.y];
                  });
                  _.makeCCW(B), g !== !1 && _.removeCollinearPoints(B, g), v !== !1 && _.removeDuplicatePoints && _.removeDuplicatePoints(B, v);
                  var R = _.quickDecomp(B);
                  for (P = 0; P < R.length; P++) {
                    var I = R[P], U = I.map(function(N) {
                      return {
                        x: N[0],
                        y: N[1]
                      };
                    });
                    y > 0 && o.area(U) < y || A.push({
                      position: o.centre(U),
                      vertices: U
                    });
                  }
                }
              for (P = 0; P < A.length; P++)
                A[P] = l.create(a.extend(A[P], d));
              if (m) {
                var O = 5;
                for (P = 0; P < A.length; P++) {
                  var F = A[P];
                  for (M = P + 1; M < A.length; M++) {
                    var Z = A[M];
                    if (c.overlaps(F.bounds, Z.bounds)) {
                      var G = F.vertices, W = Z.vertices;
                      for (T = 0; T < F.vertices.length; T++)
                        for (E = 0; E < Z.vertices.length; E++) {
                          var lt = h.magnitudeSquared(h.sub(G[(T + 1) % G.length], W[E])), At = h.magnitudeSquared(h.sub(G[T], W[(E + 1) % W.length]));
                          lt < O && At < O && (G[T].isInternal = !0, W[E].isInternal = !0);
                        }
                    }
                  }
                }
              }
              return A.length > 1 ? (x = l.create(a.extend({ parts: A.slice(0) }, d)), l.setPosition(x, { x: f, y: p }), x) : A[0];
            };
          })();
        },
        /* 13 */
        /***/
        function(e, s, n) {
          var r = {};
          e.exports = r;
          var o = n(0), a = n(8);
          (function() {
            r.create = function(l) {
              var c = {
                bodies: [],
                collisions: [],
                pairs: null
              };
              return o.extend(c, l);
            }, r.setBodies = function(l, c) {
              l.bodies = c.slice(0);
            }, r.clear = function(l) {
              l.bodies = [], l.collisions = [];
            }, r.collisions = function(l) {
              var c = l.pairs, h = l.bodies, f = h.length, p = r.canCollide, u = a.collides, d = l.collisions, m = 0, g, y;
              for (h.sort(r._compareBoundsX), g = 0; g < f; g++) {
                var v = h[g], _ = v.bounds, w = v.bounds.max.x, x = v.bounds.max.y, A = v.bounds.min.y, S = v.isStatic || v.isSleeping, b = v.parts.length, C = b === 1;
                for (y = g + 1; y < f; y++) {
                  var P = h[y], M = P.bounds;
                  if (M.min.x > w)
                    break;
                  if (!(x < M.min.y || A > M.max.y) && !(S && (P.isStatic || P.isSleeping)) && p(v.collisionFilter, P.collisionFilter)) {
                    var T = P.parts.length;
                    if (C && T === 1) {
                      var k = u(v, P, c);
                      k && (d[m++] = k);
                    } else
                      for (var E = b > 1 ? 1 : 0, B = T > 1 ? 1 : 0, R = E; R < b; R++)
                        for (var I = v.parts[R], _ = I.bounds, U = B; U < T; U++) {
                          var O = P.parts[U], M = O.bounds;
                          if (!(_.min.x > M.max.x || _.max.x < M.min.x || _.max.y < M.min.y || _.min.y > M.max.y)) {
                            var k = u(I, O, c);
                            k && (d[m++] = k);
                          }
                        }
                  }
                }
              }
              return d.length !== m && (d.length = m), d;
            }, r.canCollide = function(l, c) {
              return l.group === c.group && l.group !== 0 ? l.group > 0 : (l.mask & c.category) !== 0 && (c.mask & l.category) !== 0;
            }, r._compareBoundsX = function(l, c) {
              return l.bounds.min.x - c.bounds.min.x;
            };
          })();
        },
        /* 14 */
        /***/
        function(e, s, n) {
          var r = {};
          e.exports = r;
          var o = n(0);
          (function() {
            r.create = function(a) {
              var l = {};
              return a || o.log("Mouse.create: element was undefined, defaulting to document.body", "warn"), l.element = a || document.body, l.absolute = { x: 0, y: 0 }, l.position = { x: 0, y: 0 }, l.mousedownPosition = { x: 0, y: 0 }, l.mouseupPosition = { x: 0, y: 0 }, l.offset = { x: 0, y: 0 }, l.scale = { x: 1, y: 1 }, l.wheelDelta = 0, l.button = -1, l.pixelRatio = parseInt(l.element.getAttribute("data-pixel-ratio"), 10) || 1, l.sourceEvents = {
                mousemove: null,
                mousedown: null,
                mouseup: null,
                mousewheel: null
              }, l.mousemove = function(c) {
                var h = r._getRelativeMousePosition(c, l.element, l.pixelRatio), f = c.changedTouches;
                f && (l.button = 0, c.preventDefault()), l.absolute.x = h.x, l.absolute.y = h.y, l.position.x = l.absolute.x * l.scale.x + l.offset.x, l.position.y = l.absolute.y * l.scale.y + l.offset.y, l.sourceEvents.mousemove = c;
              }, l.mousedown = function(c) {
                var h = r._getRelativeMousePosition(c, l.element, l.pixelRatio), f = c.changedTouches;
                f ? (l.button = 0, c.preventDefault()) : l.button = c.button, l.absolute.x = h.x, l.absolute.y = h.y, l.position.x = l.absolute.x * l.scale.x + l.offset.x, l.position.y = l.absolute.y * l.scale.y + l.offset.y, l.mousedownPosition.x = l.position.x, l.mousedownPosition.y = l.position.y, l.sourceEvents.mousedown = c;
              }, l.mouseup = function(c) {
                var h = r._getRelativeMousePosition(c, l.element, l.pixelRatio), f = c.changedTouches;
                f && c.preventDefault(), l.button = -1, l.absolute.x = h.x, l.absolute.y = h.y, l.position.x = l.absolute.x * l.scale.x + l.offset.x, l.position.y = l.absolute.y * l.scale.y + l.offset.y, l.mouseupPosition.x = l.position.x, l.mouseupPosition.y = l.position.y, l.sourceEvents.mouseup = c;
              }, l.mousewheel = function(c) {
                l.wheelDelta = Math.max(-1, Math.min(1, c.wheelDelta || -c.detail)), c.preventDefault(), l.sourceEvents.mousewheel = c;
              }, r.setElement(l, l.element), l;
            }, r.setElement = function(a, l) {
              a.element = l, l.addEventListener("mousemove", a.mousemove, { passive: !0 }), l.addEventListener("mousedown", a.mousedown, { passive: !0 }), l.addEventListener("mouseup", a.mouseup, { passive: !0 }), l.addEventListener("wheel", a.mousewheel, { passive: !1 }), l.addEventListener("touchmove", a.mousemove, { passive: !1 }), l.addEventListener("touchstart", a.mousedown, { passive: !1 }), l.addEventListener("touchend", a.mouseup, { passive: !1 });
            }, r.clearSourceEvents = function(a) {
              a.sourceEvents.mousemove = null, a.sourceEvents.mousedown = null, a.sourceEvents.mouseup = null, a.sourceEvents.mousewheel = null, a.wheelDelta = 0;
            }, r.setOffset = function(a, l) {
              a.offset.x = l.x, a.offset.y = l.y, a.position.x = a.absolute.x * a.scale.x + a.offset.x, a.position.y = a.absolute.y * a.scale.y + a.offset.y;
            }, r.setScale = function(a, l) {
              a.scale.x = l.x, a.scale.y = l.y, a.position.x = a.absolute.x * a.scale.x + a.offset.x, a.position.y = a.absolute.y * a.scale.y + a.offset.y;
            }, r._getRelativeMousePosition = function(a, l, c) {
              var h = l.getBoundingClientRect(), f = document.documentElement || document.body.parentNode || document.body, p = window.pageXOffset !== void 0 ? window.pageXOffset : f.scrollLeft, u = window.pageYOffset !== void 0 ? window.pageYOffset : f.scrollTop, d = a.changedTouches, m, g;
              return d ? (m = d[0].pageX - h.left - p, g = d[0].pageY - h.top - u) : (m = a.pageX - h.left - p, g = a.pageY - h.top - u), {
                x: m / (l.clientWidth / (l.width || l.clientWidth) * c),
                y: g / (l.clientHeight / (l.height || l.clientHeight) * c)
              };
            };
          })();
        },
        /* 15 */
        /***/
        function(e, s, n) {
          var r = {};
          e.exports = r;
          var o = n(0);
          (function() {
            r._registry = {}, r.register = function(a) {
              if (r.isPlugin(a) || o.warn("Plugin.register:", r.toString(a), "does not implement all required fields."), a.name in r._registry) {
                var l = r._registry[a.name], c = r.versionParse(a.version).number, h = r.versionParse(l.version).number;
                c > h ? (o.warn("Plugin.register:", r.toString(l), "was upgraded to", r.toString(a)), r._registry[a.name] = a) : c < h ? o.warn("Plugin.register:", r.toString(l), "can not be downgraded to", r.toString(a)) : a !== l && o.warn("Plugin.register:", r.toString(a), "is already registered to different plugin object");
              } else
                r._registry[a.name] = a;
              return a;
            }, r.resolve = function(a) {
              return r._registry[r.dependencyParse(a).name];
            }, r.toString = function(a) {
              return typeof a == "string" ? a : (a.name || "anonymous") + "@" + (a.version || a.range || "0.0.0");
            }, r.isPlugin = function(a) {
              return a && a.name && a.version && a.install;
            }, r.isUsed = function(a, l) {
              return a.used.indexOf(l) > -1;
            }, r.isFor = function(a, l) {
              var c = a.for && r.dependencyParse(a.for);
              return !a.for || l.name === c.name && r.versionSatisfies(l.version, c.range);
            }, r.use = function(a, l) {
              if (a.uses = (a.uses || []).concat(l || []), a.uses.length === 0) {
                o.warn("Plugin.use:", r.toString(a), "does not specify any dependencies to install.");
                return;
              }
              for (var c = r.dependencies(a), h = o.topologicalSort(c), f = [], p = 0; p < h.length; p += 1)
                if (h[p] !== a.name) {
                  var u = r.resolve(h[p]);
                  if (!u) {
                    f.push("❌ " + h[p]);
                    continue;
                  }
                  r.isUsed(a, u.name) || (r.isFor(u, a) || (o.warn("Plugin.use:", r.toString(u), "is for", u.for, "but installed on", r.toString(a) + "."), u._warned = !0), u.install ? u.install(a) : (o.warn("Plugin.use:", r.toString(u), "does not specify an install function."), u._warned = !0), u._warned ? (f.push("🔶 " + r.toString(u)), delete u._warned) : f.push("✅ " + r.toString(u)), a.used.push(u.name));
                }
              f.length > 0 && o.info(f.join("  "));
            }, r.dependencies = function(a, l) {
              var c = r.dependencyParse(a), h = c.name;
              if (l = l || {}, !(h in l)) {
                a = r.resolve(a) || a, l[h] = o.map(a.uses || [], function(p) {
                  r.isPlugin(p) && r.register(p);
                  var u = r.dependencyParse(p), d = r.resolve(p);
                  return d && !r.versionSatisfies(d.version, u.range) ? (o.warn(
                    "Plugin.dependencies:",
                    r.toString(d),
                    "does not satisfy",
                    r.toString(u),
                    "used by",
                    r.toString(c) + "."
                  ), d._warned = !0, a._warned = !0) : d || (o.warn(
                    "Plugin.dependencies:",
                    r.toString(p),
                    "used by",
                    r.toString(c),
                    "could not be resolved."
                  ), a._warned = !0), u.name;
                });
                for (var f = 0; f < l[h].length; f += 1)
                  r.dependencies(l[h][f], l);
                return l;
              }
            }, r.dependencyParse = function(a) {
              if (o.isString(a)) {
                var l = /^[\w-]+(@(\*|[\^~]?\d+\.\d+\.\d+(-[0-9A-Za-z-+]+)?))?$/;
                return l.test(a) || o.warn("Plugin.dependencyParse:", a, "is not a valid dependency string."), {
                  name: a.split("@")[0],
                  range: a.split("@")[1] || "*"
                };
              }
              return {
                name: a.name,
                range: a.range || a.version
              };
            }, r.versionParse = function(a) {
              var l = /^(\*)|(\^|~|>=|>)?\s*((\d+)\.(\d+)\.(\d+))(-[0-9A-Za-z-+]+)?$/;
              l.test(a) || o.warn("Plugin.versionParse:", a, "is not a valid version or range.");
              var c = l.exec(a), h = Number(c[4]), f = Number(c[5]), p = Number(c[6]);
              return {
                isRange: !!(c[1] || c[2]),
                version: c[3],
                range: a,
                operator: c[1] || c[2] || "",
                major: h,
                minor: f,
                patch: p,
                parts: [h, f, p],
                prerelease: c[7],
                number: h * 1e8 + f * 1e4 + p
              };
            }, r.versionSatisfies = function(a, l) {
              l = l || "*";
              var c = r.versionParse(l), h = r.versionParse(a);
              if (c.isRange) {
                if (c.operator === "*" || a === "*")
                  return !0;
                if (c.operator === ">")
                  return h.number > c.number;
                if (c.operator === ">=")
                  return h.number >= c.number;
                if (c.operator === "~")
                  return h.major === c.major && h.minor === c.minor && h.patch >= c.patch;
                if (c.operator === "^")
                  return c.major > 0 ? h.major === c.major && h.number >= c.number : c.minor > 0 ? h.minor === c.minor && h.patch >= c.patch : h.patch === c.patch;
              }
              return a === l || a === "*";
            };
          })();
        },
        /* 16 */
        /***/
        function(e, s) {
          var n = {};
          e.exports = n, function() {
            n.create = function(r) {
              return {
                vertex: r,
                normalImpulse: 0,
                tangentImpulse: 0
              };
            };
          }();
        },
        /* 17 */
        /***/
        function(e, s, n) {
          var r = {};
          e.exports = r;
          var o = n(7), a = n(18), l = n(13), c = n(19), h = n(5), f = n(6), p = n(10), u = n(0), d = n(4);
          (function() {
            r._deltaMax = 1e3 / 60, r.create = function(m) {
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
              return y.world = m.world || f.create({ label: "World" }), y.pairs = m.pairs || c.create(), y.detector = m.detector || l.create(), y.detector.pairs = y.pairs, y.grid = { buckets: [] }, y.world.gravity = y.gravity, y.broadphase = y.grid, y.metrics = {}, y;
            }, r.update = function(m, g) {
              var y = u.now(), v = m.world, _ = m.detector, w = m.pairs, x = m.timing, A = x.timestamp, S;
              g > r._deltaMax && u.warnOnce(
                "Matter.Engine.update: delta argument is recommended to be less than or equal to",
                r._deltaMax.toFixed(3),
                "ms."
              ), g = typeof g < "u" ? g : u._baseDelta, g *= x.timeScale, x.timestamp += g, x.lastDelta = g;
              var b = {
                timestamp: x.timestamp,
                delta: g
              };
              h.trigger(m, "beforeUpdate", b);
              var C = f.allBodies(v), P = f.allConstraints(v);
              for (v.isModified && (l.setBodies(_, C), f.setModified(v, !1, !1, !0)), m.enableSleeping && o.update(C, g), r._bodiesApplyGravity(C, m.gravity), g > 0 && r._bodiesUpdate(C, g), h.trigger(m, "beforeSolve", b), p.preSolveAll(C), S = 0; S < m.constraintIterations; S++)
                p.solveAll(P, g);
              p.postSolveAll(C);
              var M = l.collisions(_);
              c.update(w, M, A), m.enableSleeping && o.afterCollisions(w.list), w.collisionStart.length > 0 && h.trigger(m, "collisionStart", {
                pairs: w.collisionStart,
                timestamp: x.timestamp,
                delta: g
              });
              var T = u.clamp(20 / m.positionIterations, 0, 1);
              for (a.preSolvePosition(w.list), S = 0; S < m.positionIterations; S++)
                a.solvePosition(w.list, g, T);
              for (a.postSolvePosition(C), p.preSolveAll(C), S = 0; S < m.constraintIterations; S++)
                p.solveAll(P, g);
              for (p.postSolveAll(C), a.preSolveVelocity(w.list), S = 0; S < m.velocityIterations; S++)
                a.solveVelocity(w.list, g);
              return r._bodiesUpdateVelocities(C), w.collisionActive.length > 0 && h.trigger(m, "collisionActive", {
                pairs: w.collisionActive,
                timestamp: x.timestamp,
                delta: g
              }), w.collisionEnd.length > 0 && h.trigger(m, "collisionEnd", {
                pairs: w.collisionEnd,
                timestamp: x.timestamp,
                delta: g
              }), r._bodiesClearForces(C), h.trigger(m, "afterUpdate", b), m.timing.lastElapsed = u.now() - y, m;
            }, r.merge = function(m, g) {
              if (u.extend(m, g), g.world) {
                m.world = g.world, r.clear(m);
                for (var y = f.allBodies(m.world), v = 0; v < y.length; v++) {
                  var _ = y[v];
                  o.set(_, !1), _.id = u.nextId();
                }
              }
            }, r.clear = function(m) {
              c.clear(m.pairs), l.clear(m.detector);
            }, r._bodiesClearForces = function(m) {
              for (var g = m.length, y = 0; y < g; y++) {
                var v = m[y];
                v.force.x = 0, v.force.y = 0, v.torque = 0;
              }
            }, r._bodiesApplyGravity = function(m, g) {
              var y = typeof g.scale < "u" ? g.scale : 1e-3, v = m.length;
              if (!(g.x === 0 && g.y === 0 || y === 0))
                for (var _ = 0; _ < v; _++) {
                  var w = m[_];
                  w.isStatic || w.isSleeping || (w.force.y += w.mass * g.y * y, w.force.x += w.mass * g.x * y);
                }
            }, r._bodiesUpdate = function(m, g) {
              for (var y = m.length, v = 0; v < y; v++) {
                var _ = m[v];
                _.isStatic || _.isSleeping || d.update(_, g);
              }
            }, r._bodiesUpdateVelocities = function(m) {
              for (var g = m.length, y = 0; y < g; y++)
                d.updateVelocities(m[y]);
            };
          })();
        },
        /* 18 */
        /***/
        function(e, s, n) {
          var r = {};
          e.exports = r;
          var o = n(3), a = n(0), l = n(1);
          (function() {
            r._restingThresh = 2, r._restingThreshTangent = Math.sqrt(6), r._positionDampen = 0.9, r._positionWarming = 0.8, r._frictionNormalMultiplier = 5, r._frictionMaxStatic = Number.MAX_VALUE, r.preSolvePosition = function(c) {
              var h, f, p, u = c.length;
              for (h = 0; h < u; h++)
                f = c[h], f.isActive && (p = f.contactCount, f.collision.parentA.totalContacts += p, f.collision.parentB.totalContacts += p);
            }, r.solvePosition = function(c, h, f) {
              var p, u, d, m, g, y, v, _, w = r._positionDampen * (f || 1), x = a.clamp(h / a._baseDelta, 0, 1), A = c.length;
              for (p = 0; p < A; p++)
                u = c[p], !(!u.isActive || u.isSensor) && (d = u.collision, m = d.parentA, g = d.parentB, y = d.normal, u.separation = d.depth + y.x * (g.positionImpulse.x - m.positionImpulse.x) + y.y * (g.positionImpulse.y - m.positionImpulse.y));
              for (p = 0; p < A; p++)
                u = c[p], !(!u.isActive || u.isSensor) && (d = u.collision, m = d.parentA, g = d.parentB, y = d.normal, _ = u.separation - u.slop * x, (m.isStatic || g.isStatic) && (_ *= 2), m.isStatic || m.isSleeping || (v = w / m.totalContacts, m.positionImpulse.x += y.x * _ * v, m.positionImpulse.y += y.y * _ * v), g.isStatic || g.isSleeping || (v = w / g.totalContacts, g.positionImpulse.x -= y.x * _ * v, g.positionImpulse.y -= y.y * _ * v));
            }, r.postSolvePosition = function(c) {
              for (var h = r._positionWarming, f = c.length, p = o.translate, u = l.update, d = 0; d < f; d++) {
                var m = c[d], g = m.positionImpulse, y = g.x, v = g.y, _ = m.velocity;
                if (m.totalContacts = 0, y !== 0 || v !== 0) {
                  for (var w = 0; w < m.parts.length; w++) {
                    var x = m.parts[w];
                    p(x.vertices, g), u(x.bounds, x.vertices, _), x.position.x += y, x.position.y += v;
                  }
                  m.positionPrev.x += y, m.positionPrev.y += v, y * _.x + v * _.y < 0 ? (g.x = 0, g.y = 0) : (g.x *= h, g.y *= h);
                }
              }
            }, r.preSolveVelocity = function(c) {
              var h = c.length, f, p;
              for (f = 0; f < h; f++) {
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
            }, r.solveVelocity = function(c, h) {
              var f = h / a._baseDelta, p = f * f, u = p * f, d = -r._restingThresh * f, m = r._restingThreshTangent, g = r._frictionNormalMultiplier * f, y = r._frictionMaxStatic, v = c.length, _, w, x, A;
              for (x = 0; x < v; x++) {
                var S = c[x];
                if (!(!S.isActive || S.isSensor)) {
                  var b = S.collision, C = b.parentA, P = b.parentB, M = b.normal.x, T = b.normal.y, k = b.tangent.x, E = b.tangent.y, B = S.inverseMass, R = S.friction * S.frictionStatic * g, I = S.contacts, U = S.contactCount, O = 1 / U, F = C.position.x - C.positionPrev.x, Z = C.position.y - C.positionPrev.y, G = C.angle - C.anglePrev, W = P.position.x - P.positionPrev.x, lt = P.position.y - P.positionPrev.y, At = P.angle - P.anglePrev;
                  for (A = 0; A < U; A++) {
                    var N = I[A], Ot = N.vertex, ct = Ot.x - C.position.x, ee = Ot.y - C.position.y, Vt = Ot.x - P.position.x, Nt = Ot.y - P.position.y, mt = F - ee * G, pi = Z + ct * G, Hi = W - Nt * At, we = lt + Vt * At, he = mt - Hi, ce = pi - we, ie = M * he + T * ce, se = k * he + E * ce, ji = S.separation + ie, Yi = Math.min(ji, 1);
                    Yi = ji < 0 ? 0 : Yi;
                    var Vo = Yi * R;
                    se < -Vo || se > Vo ? (w = se > 0 ? se : -se, _ = S.friction * (se > 0 ? 1 : -1) * u, _ < -w ? _ = -w : _ > w && (_ = w)) : (_ = se, w = y);
                    var No = ct * T - ee * M, Ho = Vt * T - Nt * M, jo = O / (B + C.inverseInertia * No * No + P.inverseInertia * Ho * Ho), Is = (1 + S.restitution) * ie * jo;
                    if (_ *= jo, ie < d)
                      N.normalImpulse = 0;
                    else {
                      var Jc = N.normalImpulse;
                      N.normalImpulse += Is, N.normalImpulse > 0 && (N.normalImpulse = 0), Is = N.normalImpulse - Jc;
                    }
                    if (se < -m || se > m)
                      N.tangentImpulse = 0;
                    else {
                      var $c = N.tangentImpulse;
                      N.tangentImpulse += _, N.tangentImpulse < -w && (N.tangentImpulse = -w), N.tangentImpulse > w && (N.tangentImpulse = w), _ = N.tangentImpulse - $c;
                    }
                    var Os = M * Is + k * _, Fs = T * Is + E * _;
                    C.isStatic || C.isSleeping || (C.positionPrev.x += Os * C.inverseMass, C.positionPrev.y += Fs * C.inverseMass, C.anglePrev += (ct * Fs - ee * Os) * C.inverseInertia), P.isStatic || P.isSleeping || (P.positionPrev.x -= Os * P.inverseMass, P.positionPrev.y -= Fs * P.inverseMass, P.anglePrev -= (Vt * Fs - Nt * Os) * P.inverseInertia);
                  }
                }
              }
            };
          })();
        },
        /* 19 */
        /***/
        function(e, s, n) {
          var r = {};
          e.exports = r;
          var o = n(9), a = n(0);
          (function() {
            r.create = function(l) {
              return a.extend({
                table: {},
                list: [],
                collisionStart: [],
                collisionActive: [],
                collisionEnd: []
              }, l);
            }, r.update = function(l, c, h) {
              var f = o.update, p = o.create, u = o.setActive, d = l.table, m = l.list, g = m.length, y = g, v = l.collisionStart, _ = l.collisionEnd, w = l.collisionActive, x = c.length, A = 0, S = 0, b = 0, C, P, M;
              for (M = 0; M < x; M++)
                C = c[M], P = C.pair, P ? (P.isActive && (w[b++] = P), f(P, C, h)) : (P = p(C, h), d[P.id] = P, v[A++] = P, m[y++] = P);
              for (y = 0, g = m.length, M = 0; M < g; M++)
                P = m[M], P.timeUpdated >= h ? m[y++] = P : (u(P, !1, h), P.collision.bodyA.sleepCounter > 0 && P.collision.bodyB.sleepCounter > 0 ? m[y++] = P : (_[S++] = P, delete d[P.id]));
              m.length !== y && (m.length = y), v.length !== A && (v.length = A), _.length !== S && (_.length = S), w.length !== b && (w.length = b);
            }, r.clear = function(l) {
              return l.table = {}, l.list.length = 0, l.collisionStart.length = 0, l.collisionActive.length = 0, l.collisionEnd.length = 0, l;
            };
          })();
        },
        /* 20 */
        /***/
        function(e, s, n) {
          var r = e.exports = n(21);
          r.Axes = n(11), r.Bodies = n(12), r.Body = n(4), r.Bounds = n(1), r.Collision = n(8), r.Common = n(0), r.Composite = n(6), r.Composites = n(22), r.Constraint = n(10), r.Contact = n(16), r.Detector = n(13), r.Engine = n(17), r.Events = n(5), r.Grid = n(23), r.Mouse = n(14), r.MouseConstraint = n(24), r.Pair = n(9), r.Pairs = n(19), r.Plugin = n(15), r.Query = n(25), r.Render = n(26), r.Resolver = n(18), r.Runner = n(27), r.SAT = n(28), r.Sleeping = n(7), r.Svg = n(29), r.Vector = n(2), r.Vertices = n(3), r.World = n(30), r.Engine.run = r.Runner.run, r.Common.deprecated(r.Engine, "run", "Engine.run ➤ use Matter.Runner.run(engine) instead");
        },
        /* 21 */
        /***/
        function(e, s, n) {
          var r = {};
          e.exports = r;
          var o = n(15), a = n(0);
          (function() {
            r.name = "matter-js", r.version = "0.20.0", r.uses = [], r.used = [], r.use = function() {
              o.use(r, Array.prototype.slice.call(arguments));
            }, r.before = function(l, c) {
              return l = l.replace(/^Matter./, ""), a.chainPathBefore(r, l, c);
            }, r.after = function(l, c) {
              return l = l.replace(/^Matter./, ""), a.chainPathAfter(r, l, c);
            };
          })();
        },
        /* 22 */
        /***/
        function(e, s, n) {
          var r = {};
          e.exports = r;
          var o = n(6), a = n(10), l = n(0), c = n(4), h = n(12), f = l.deprecated;
          (function() {
            r.stack = function(p, u, d, m, g, y, v) {
              for (var _ = o.create({ label: "Stack" }), w = p, x = u, A, S = 0, b = 0; b < m; b++) {
                for (var C = 0, P = 0; P < d; P++) {
                  var M = v(w, x, P, b, A, S);
                  if (M) {
                    var T = M.bounds.max.y - M.bounds.min.y, k = M.bounds.max.x - M.bounds.min.x;
                    T > C && (C = T), c.translate(M, { x: k * 0.5, y: T * 0.5 }), w = M.bounds.max.x + g, o.addBody(_, M), A = M, S += 1;
                  } else
                    w += g;
                }
                x += C + y, w = p;
              }
              return _;
            }, r.chain = function(p, u, d, m, g, y) {
              for (var v = p.bodies, _ = 1; _ < v.length; _++) {
                var w = v[_ - 1], x = v[_], A = w.bounds.max.y - w.bounds.min.y, S = w.bounds.max.x - w.bounds.min.x, b = x.bounds.max.y - x.bounds.min.y, C = x.bounds.max.x - x.bounds.min.x, P = {
                  bodyA: w,
                  pointA: { x: S * u, y: A * d },
                  bodyB: x,
                  pointB: { x: C * m, y: b * g }
                }, M = l.extend(P, y);
                o.addConstraint(p, a.create(M));
              }
              return p.label += " Chain", p;
            }, r.mesh = function(p, u, d, m, g) {
              var y = p.bodies, v, _, w, x, A;
              for (v = 0; v < d; v++) {
                for (_ = 1; _ < u; _++)
                  w = y[_ - 1 + v * u], x = y[_ + v * u], o.addConstraint(p, a.create(l.extend({ bodyA: w, bodyB: x }, g)));
                if (v > 0)
                  for (_ = 0; _ < u; _++)
                    w = y[_ + (v - 1) * u], x = y[_ + v * u], o.addConstraint(p, a.create(l.extend({ bodyA: w, bodyB: x }, g))), m && _ > 0 && (A = y[_ - 1 + (v - 1) * u], o.addConstraint(p, a.create(l.extend({ bodyA: A, bodyB: x }, g)))), m && _ < u - 1 && (A = y[_ + 1 + (v - 1) * u], o.addConstraint(p, a.create(l.extend({ bodyA: A, bodyB: x }, g))));
              }
              return p.label += " Mesh", p;
            }, r.pyramid = function(p, u, d, m, g, y, v) {
              return r.stack(p, u, d, m, g, y, function(_, w, x, A, S, b) {
                var C = Math.min(m, Math.ceil(d / 2)), P = S ? S.bounds.max.x - S.bounds.min.x : 0;
                if (!(A > C)) {
                  A = C - A;
                  var M = A, T = d - 1 - A;
                  if (!(x < M || x > T)) {
                    b === 1 && c.translate(S, { x: (x + (d % 2 === 1 ? 1 : -1)) * P, y: 0 });
                    var k = S ? x * P : 0;
                    return v(p + k + x * g, w, x, A, S, b);
                  }
                }
              });
            }, r.newtonsCradle = function(p, u, d, m, g) {
              for (var y = o.create({ label: "Newtons Cradle" }), v = 0; v < d; v++) {
                var _ = 1.9, w = h.circle(
                  p + v * (m * _),
                  u + g,
                  m,
                  { inertia: 1 / 0, restitution: 1, friction: 0, frictionAir: 1e-4, slop: 1 }
                ), x = a.create({ pointA: { x: p + v * (m * _), y: u }, bodyB: w });
                o.addBody(y, w), o.addConstraint(y, x);
              }
              return y;
            }, f(r, "newtonsCradle", "Composites.newtonsCradle ➤ moved to newtonsCradle example"), r.car = function(p, u, d, m, g) {
              var y = c.nextGroup(!0), v = 20, _ = -d * 0.5 + v, w = d * 0.5 - v, x = 0, A = o.create({ label: "Car" }), S = h.rectangle(p, u, d, m, {
                collisionFilter: {
                  group: y
                },
                chamfer: {
                  radius: m * 0.5
                },
                density: 2e-4
              }), b = h.circle(p + _, u + x, g, {
                collisionFilter: {
                  group: y
                },
                friction: 0.8
              }), C = h.circle(p + w, u + x, g, {
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
              }), M = a.create({
                bodyB: S,
                pointB: { x: w, y: x },
                bodyA: C,
                stiffness: 1,
                length: 0
              });
              return o.addBody(A, S), o.addBody(A, b), o.addBody(A, C), o.addConstraint(A, P), o.addConstraint(A, M), A;
            }, f(r, "car", "Composites.car ➤ moved to car example"), r.softBody = function(p, u, d, m, g, y, v, _, w, x) {
              w = l.extend({ inertia: 1 / 0 }, w), x = l.extend({ stiffness: 0.2, render: { type: "line", anchors: !1 } }, x);
              var A = r.stack(p, u, d, m, g, y, function(S, b) {
                return h.circle(S, b, _, w);
              });
              return r.mesh(A, d, m, v, x), A.label = "Soft Body", A;
            }, f(r, "softBody", "Composites.softBody ➤ moved to softBody and cloth examples");
          })();
        },
        /* 23 */
        /***/
        function(e, s, n) {
          var r = {};
          e.exports = r;
          var o = n(9), a = n(0), l = a.deprecated;
          (function() {
            r.create = function(c) {
              var h = {
                buckets: {},
                pairs: {},
                pairsList: [],
                bucketWidth: 48,
                bucketHeight: 48
              };
              return a.extend(h, c);
            }, r.update = function(c, h, f, p) {
              var u, d, m, g = f.world, y = c.buckets, v, _, w = !1;
              for (u = 0; u < h.length; u++) {
                var x = h[u];
                if (!(x.isSleeping && !p) && !(g.bounds && (x.bounds.max.x < g.bounds.min.x || x.bounds.min.x > g.bounds.max.x || x.bounds.max.y < g.bounds.min.y || x.bounds.min.y > g.bounds.max.y))) {
                  var A = r._getRegion(c, x);
                  if (!x.region || A.id !== x.region.id || p) {
                    (!x.region || p) && (x.region = A);
                    var S = r._regionUnion(A, x.region);
                    for (d = S.startCol; d <= S.endCol; d++)
                      for (m = S.startRow; m <= S.endRow; m++) {
                        _ = r._getBucketId(d, m), v = y[_];
                        var b = d >= A.startCol && d <= A.endCol && m >= A.startRow && m <= A.endRow, C = d >= x.region.startCol && d <= x.region.endCol && m >= x.region.startRow && m <= x.region.endRow;
                        !b && C && C && v && r._bucketRemoveBody(c, v, x), (x.region === A || b && !C || p) && (v || (v = r._createBucket(y, _)), r._bucketAddBody(c, v, x));
                      }
                    x.region = A, w = !0;
                  }
                }
              }
              w && (c.pairsList = r._createActivePairsList(c));
            }, l(r, "update", "Grid.update ➤ replaced by Matter.Detector"), r.clear = function(c) {
              c.buckets = {}, c.pairs = {}, c.pairsList = [];
            }, l(r, "clear", "Grid.clear ➤ replaced by Matter.Detector"), r._regionUnion = function(c, h) {
              var f = Math.min(c.startCol, h.startCol), p = Math.max(c.endCol, h.endCol), u = Math.min(c.startRow, h.startRow), d = Math.max(c.endRow, h.endRow);
              return r._createRegion(f, p, u, d);
            }, r._getRegion = function(c, h) {
              var f = h.bounds, p = Math.floor(f.min.x / c.bucketWidth), u = Math.floor(f.max.x / c.bucketWidth), d = Math.floor(f.min.y / c.bucketHeight), m = Math.floor(f.max.y / c.bucketHeight);
              return r._createRegion(p, u, d, m);
            }, r._createRegion = function(c, h, f, p) {
              return {
                id: c + "," + h + "," + f + "," + p,
                startCol: c,
                endCol: h,
                startRow: f,
                endRow: p
              };
            }, r._getBucketId = function(c, h) {
              return "C" + c + "R" + h;
            }, r._createBucket = function(c, h) {
              var f = c[h] = [];
              return f;
            }, r._bucketAddBody = function(c, h, f) {
              var p = c.pairs, u = o.id, d = h.length, m;
              for (m = 0; m < d; m++) {
                var g = h[m];
                if (!(f.id === g.id || f.isStatic && g.isStatic)) {
                  var y = u(f, g), v = p[y];
                  v ? v[2] += 1 : p[y] = [f, g, 1];
                }
              }
              h.push(f);
            }, r._bucketRemoveBody = function(c, h, f) {
              var p = c.pairs, u = o.id, d;
              h.splice(a.indexOf(h, f), 1);
              var m = h.length;
              for (d = 0; d < m; d++) {
                var g = p[u(f, h[d])];
                g && (g[2] -= 1);
              }
            }, r._createActivePairsList = function(c) {
              var h, f = c.pairs, p = a.keys(f), u = p.length, d = [], m;
              for (m = 0; m < u; m++)
                h = f[p[m]], h[2] > 0 ? d.push(h) : delete f[p[m]];
              return d;
            };
          })();
        },
        /* 24 */
        /***/
        function(e, s, n) {
          var r = {};
          e.exports = r;
          var o = n(3), a = n(7), l = n(14), c = n(5), h = n(13), f = n(10), p = n(6), u = n(0), d = n(1);
          (function() {
            r.create = function(m, g) {
              var y = (m ? m.mouse : null) || (g ? g.mouse : null);
              y || (m && m.render && m.render.canvas ? y = l.create(m.render.canvas) : g && g.element ? y = l.create(g.element) : (y = l.create(), u.warn("MouseConstraint.create: options.mouse was undefined, options.element was undefined, may not function as expected")));
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
                r.update(w, x), r._triggerEvents(w);
              }), w;
            }, r.update = function(m, g) {
              var y = m.mouse, v = m.constraint, _ = m.body;
              if (y.button === 0) {
                if (v.bodyB)
                  a.set(v.bodyB, !1), v.pointA = y.position;
                else
                  for (var w = 0; w < g.length; w++)
                    if (_ = g[w], d.contains(_.bounds, y.position) && h.canCollide(_.collisionFilter, m.collisionFilter))
                      for (var x = _.parts.length > 1 ? 1 : 0; x < _.parts.length; x++) {
                        var A = _.parts[x];
                        if (o.contains(A.vertices, y.position)) {
                          v.pointA = y.position, v.bodyB = m.body = _, v.pointB = { x: y.position.x - _.position.x, y: y.position.y - _.position.y }, v.angleB = _.angle, a.set(_, !1), c.trigger(m, "startdrag", { mouse: y, body: _ });
                          break;
                        }
                      }
              } else
                v.bodyB = m.body = null, v.pointB = null, _ && c.trigger(m, "enddrag", { mouse: y, body: _ });
            }, r._triggerEvents = function(m) {
              var g = m.mouse, y = g.sourceEvents;
              y.mousemove && c.trigger(m, "mousemove", { mouse: g }), y.mousedown && c.trigger(m, "mousedown", { mouse: g }), y.mouseup && c.trigger(m, "mouseup", { mouse: g }), l.clearSourceEvents(g);
            };
          })();
        },
        /* 25 */
        /***/
        function(e, s, n) {
          var r = {};
          e.exports = r;
          var o = n(2), a = n(8), l = n(1), c = n(12), h = n(3);
          (function() {
            r.collides = function(f, p) {
              for (var u = [], d = p.length, m = f.bounds, g = a.collides, y = l.overlaps, v = 0; v < d; v++) {
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
            }, r.ray = function(f, p, u, d) {
              d = d || 1e-100;
              for (var m = o.angle(p, u), g = o.magnitude(o.sub(p, u)), y = (u.x + p.x) * 0.5, v = (u.y + p.y) * 0.5, _ = c.rectangle(y, v, g, d, { angle: m }), w = r.collides(_, f), x = 0; x < w.length; x += 1) {
                var A = w[x];
                A.body = A.bodyB = A.bodyA;
              }
              return w;
            }, r.region = function(f, p, u) {
              for (var d = [], m = 0; m < f.length; m++) {
                var g = f[m], y = l.overlaps(g.bounds, p);
                (y && !u || !y && u) && d.push(g);
              }
              return d;
            }, r.point = function(f, p) {
              for (var u = [], d = 0; d < f.length; d++) {
                var m = f[d];
                if (l.contains(m.bounds, p))
                  for (var g = m.parts.length === 1 ? 0 : 1; g < m.parts.length; g++) {
                    var y = m.parts[g];
                    if (l.contains(y.bounds, p) && h.contains(y.vertices, p)) {
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
        function(e, s, n) {
          var r = {};
          e.exports = r;
          var o = n(4), a = n(0), l = n(6), c = n(1), h = n(5), f = n(2), p = n(14);
          (function() {
            var u, d;
            typeof window < "u" && (u = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function(x) {
              window.setTimeout(function() {
                x(a.now());
              }, 1e3 / 60);
            }, d = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame), r._goodFps = 30, r._goodDelta = 1e3 / 60, r.create = function(x) {
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
              }, S.controller = r, S.options.showBroadphase = !1, S.options.pixelRatio !== 1 && r.setPixelRatio(S, S.options.pixelRatio), a.isElement(S.element) && S.element.appendChild(S.canvas), S;
            }, r.run = function(x) {
              (function A(S) {
                x.frameRequestId = u(A), m(x, S), r.world(x, S), x.context.setTransform(x.options.pixelRatio, 0, 0, x.options.pixelRatio, 0, 0), (x.options.showStats || x.options.showDebug) && r.stats(x, x.context, S), (x.options.showPerformance || x.options.showDebug) && r.performance(x, x.context, S), x.context.setTransform(1, 0, 0, 1, 0, 0);
              })();
            }, r.stop = function(x) {
              d(x.frameRequestId);
            }, r.setPixelRatio = function(x, A) {
              var S = x.options, b = x.canvas;
              A === "auto" && (A = v(b)), S.pixelRatio = A, b.setAttribute("data-pixel-ratio", A), b.width = S.width * A, b.height = S.height * A, b.style.width = S.width + "px", b.style.height = S.height + "px";
            }, r.setSize = function(x, A, S) {
              x.options.width = A, x.options.height = S, x.bounds.max.x = x.bounds.min.x + A, x.bounds.max.y = x.bounds.min.y + S, x.options.pixelRatio !== 1 ? r.setPixelRatio(x, x.options.pixelRatio) : (x.canvas.width = A, x.canvas.height = S);
            }, r.lookAt = function(x, A, S, b) {
              b = typeof b < "u" ? b : !0, A = a.isArray(A) ? A : [A], S = S || {
                x: 0,
                y: 0
              };
              for (var C = {
                min: { x: 1 / 0, y: 1 / 0 },
                max: { x: -1 / 0, y: -1 / 0 }
              }, P = 0; P < A.length; P += 1) {
                var M = A[P], T = M.bounds ? M.bounds.min : M.min || M.position || M, k = M.bounds ? M.bounds.max : M.max || M.position || M;
                T && k && (T.x < C.min.x && (C.min.x = T.x), k.x > C.max.x && (C.max.x = k.x), T.y < C.min.y && (C.min.y = T.y), k.y > C.max.y && (C.max.y = k.y));
              }
              var E = C.max.x - C.min.x + 2 * S.x, B = C.max.y - C.min.y + 2 * S.y, R = x.canvas.height, I = x.canvas.width, U = I / R, O = E / B, F = 1, Z = 1;
              O > U ? Z = O / U : F = U / O, x.options.hasBounds = !0, x.bounds.min.x = C.min.x, x.bounds.max.x = C.min.x + E * F, x.bounds.min.y = C.min.y, x.bounds.max.y = C.min.y + B * Z, b && (x.bounds.min.x += E * 0.5 - E * F * 0.5, x.bounds.max.x += E * 0.5 - E * F * 0.5, x.bounds.min.y += B * 0.5 - B * Z * 0.5, x.bounds.max.y += B * 0.5 - B * Z * 0.5), x.bounds.min.x -= S.x, x.bounds.max.x -= S.x, x.bounds.min.y -= S.y, x.bounds.max.y -= S.y, x.mouse && (p.setScale(x.mouse, {
                x: (x.bounds.max.x - x.bounds.min.x) / x.canvas.width,
                y: (x.bounds.max.y - x.bounds.min.y) / x.canvas.height
              }), p.setOffset(x.mouse, x.bounds.min));
            }, r.startViewTransform = function(x) {
              var A = x.bounds.max.x - x.bounds.min.x, S = x.bounds.max.y - x.bounds.min.y, b = A / x.options.width, C = S / x.options.height;
              x.context.setTransform(
                x.options.pixelRatio / b,
                0,
                0,
                x.options.pixelRatio / C,
                0,
                0
              ), x.context.translate(-x.bounds.min.x, -x.bounds.min.y);
            }, r.endViewTransform = function(x) {
              x.context.setTransform(x.options.pixelRatio, 0, 0, x.options.pixelRatio, 0, 0);
            }, r.world = function(x, A) {
              var S = a.now(), b = x.engine, C = b.world, P = x.canvas, M = x.context, T = x.options, k = x.timing, E = l.allBodies(C), B = l.allConstraints(C), R = T.wireframes ? T.wireframeBackground : T.background, I = [], U = [], O, F = {
                timestamp: b.timing.timestamp
              };
              if (h.trigger(x, "beforeRender", F), x.currentBackground !== R && w(x, R), M.globalCompositeOperation = "source-in", M.fillStyle = "transparent", M.fillRect(0, 0, P.width, P.height), M.globalCompositeOperation = "source-over", T.hasBounds) {
                for (O = 0; O < E.length; O++) {
                  var Z = E[O];
                  c.overlaps(Z.bounds, x.bounds) && I.push(Z);
                }
                for (O = 0; O < B.length; O++) {
                  var G = B[O], W = G.bodyA, lt = G.bodyB, At = G.pointA, N = G.pointB;
                  W && (At = f.add(W.position, G.pointA)), lt && (N = f.add(lt.position, G.pointB)), !(!At || !N) && (c.contains(x.bounds, At) || c.contains(x.bounds, N)) && U.push(G);
                }
                r.startViewTransform(x), x.mouse && (p.setScale(x.mouse, {
                  x: (x.bounds.max.x - x.bounds.min.x) / x.options.width,
                  y: (x.bounds.max.y - x.bounds.min.y) / x.options.height
                }), p.setOffset(x.mouse, x.bounds.min));
              } else
                U = B, I = E, x.options.pixelRatio !== 1 && x.context.setTransform(x.options.pixelRatio, 0, 0, x.options.pixelRatio, 0, 0);
              !T.wireframes || b.enableSleeping && T.showSleeping ? r.bodies(x, I, M) : (T.showConvexHulls && r.bodyConvexHulls(x, I, M), r.bodyWireframes(x, I, M)), T.showBounds && r.bodyBounds(x, I, M), (T.showAxes || T.showAngleIndicator) && r.bodyAxes(x, I, M), T.showPositions && r.bodyPositions(x, I, M), T.showVelocity && r.bodyVelocity(x, I, M), T.showIds && r.bodyIds(x, I, M), T.showSeparations && r.separations(x, b.pairs.list, M), T.showCollisions && r.collisions(x, b.pairs.list, M), T.showVertexNumbers && r.vertexNumbers(x, I, M), T.showMousePosition && r.mousePosition(x, x.mouse, M), r.constraints(U, M), T.hasBounds && r.endViewTransform(x), h.trigger(x, "afterRender", F), k.lastElapsed = a.now() - S;
            }, r.stats = function(x, A, S) {
              for (var b = x.engine, C = b.world, P = l.allBodies(C), M = 0, T = 55, k = 44, E = 0, B = 0, R = 0; R < P.length; R += 1)
                M += P[R].parts.length;
              var I = {
                Part: M,
                Body: P.length,
                Cons: l.allConstraints(C).length,
                Comp: l.allComposites(C).length,
                Pair: b.pairs.list.length
              };
              A.fillStyle = "#0e0f19", A.fillRect(E, B, T * 5.5, k), A.font = "12px Arial", A.textBaseline = "top", A.textAlign = "right";
              for (var U in I) {
                var O = I[U];
                A.fillStyle = "#aaa", A.fillText(U, E + T, B + 8), A.fillStyle = "#eee", A.fillText(O, E + T, B + 26), E += T;
              }
            }, r.performance = function(x, A) {
              var S = x.engine, b = x.timing, C = b.deltaHistory, P = b.elapsedHistory, M = b.timestampElapsedHistory, T = b.engineDeltaHistory, k = b.engineUpdatesHistory, E = b.engineElapsedHistory, B = S.timing.lastUpdatesPerFrame, R = S.timing.lastDelta, I = g(C), U = g(P), O = g(T), F = g(k), Z = g(E), G = g(M), W = G / I || 0, lt = Math.round(I / R), At = 1e3 / I || 0, N = 4, Ot = 12, ct = 60, ee = 34, Vt = 10, Nt = 69;
              A.fillStyle = "#0e0f19", A.fillRect(0, 50, Ot * 5 + ct * 6 + 22, ee), r.status(
                A,
                Vt,
                Nt,
                ct,
                N,
                C.length,
                Math.round(At) + " fps",
                At / r._goodFps,
                function(mt) {
                  return C[mt] / I - 1;
                }
              ), r.status(
                A,
                Vt + Ot + ct,
                Nt,
                ct,
                N,
                T.length,
                R.toFixed(2) + " dt",
                r._goodDelta / R,
                function(mt) {
                  return T[mt] / O - 1;
                }
              ), r.status(
                A,
                Vt + (Ot + ct) * 2,
                Nt,
                ct,
                N,
                k.length,
                B + " upf",
                Math.pow(a.clamp(F / lt || 1, 0, 1), 4),
                function(mt) {
                  return k[mt] / F - 1;
                }
              ), r.status(
                A,
                Vt + (Ot + ct) * 3,
                Nt,
                ct,
                N,
                E.length,
                Z.toFixed(2) + " ut",
                1 - B * Z / r._goodFps,
                function(mt) {
                  return E[mt] / Z - 1;
                }
              ), r.status(
                A,
                Vt + (Ot + ct) * 4,
                Nt,
                ct,
                N,
                P.length,
                U.toFixed(2) + " rt",
                1 - U / r._goodFps,
                function(mt) {
                  return P[mt] / U - 1;
                }
              ), r.status(
                A,
                Vt + (Ot + ct) * 5,
                Nt,
                ct,
                N,
                M.length,
                W.toFixed(2) + " x",
                W * W * W,
                function(mt) {
                  return (M[mt] / C[mt] / W || 0) - 1;
                }
              );
            }, r.status = function(x, A, S, b, C, P, M, T, k) {
              x.strokeStyle = "#888", x.fillStyle = "#444", x.lineWidth = 1, x.fillRect(A, S + 7, b, 1), x.beginPath(), x.moveTo(A, S + 7 - C * a.clamp(0.4 * k(0), -2, 2));
              for (var E = 0; E < b; E += 1)
                x.lineTo(A + E, S + 7 - (E < P ? C * a.clamp(0.4 * k(E), -2, 2) : 0));
              x.stroke(), x.fillStyle = "hsl(" + a.clamp(25 + 95 * T, 0, 120) + ",100%,60%)", x.fillRect(A, S - 7, 4, 4), x.font = "12px Arial", x.textBaseline = "middle", x.textAlign = "right", x.fillStyle = "#eee", x.fillText(M, A + b, S - 5);
            }, r.constraints = function(x, A) {
              for (var S = A, b = 0; b < x.length; b++) {
                var C = x[b];
                if (!(!C.render.visible || !C.pointA || !C.pointB)) {
                  var P = C.bodyA, M = C.bodyB, T, k;
                  if (P ? T = f.add(P.position, C.pointA) : T = C.pointA, C.render.type === "pin")
                    S.beginPath(), S.arc(T.x, T.y, 3, 0, 2 * Math.PI), S.closePath();
                  else {
                    if (M ? k = f.add(M.position, C.pointB) : k = C.pointB, S.beginPath(), S.moveTo(T.x, T.y), C.render.type === "spring")
                      for (var E = f.sub(k, T), B = f.perp(f.normalise(E)), R = Math.ceil(a.clamp(C.length / 5, 12, 20)), I, U = 1; U < R; U += 1)
                        I = U % 2 === 0 ? 1 : -1, S.lineTo(
                          T.x + E.x * (U / R) + B.x * I * 4,
                          T.y + E.y * (U / R) + B.y * I * 4
                        );
                    S.lineTo(k.x, k.y);
                  }
                  C.render.lineWidth && (S.lineWidth = C.render.lineWidth, S.strokeStyle = C.render.strokeStyle, S.stroke()), C.render.anchors && (S.fillStyle = C.render.strokeStyle, S.beginPath(), S.arc(T.x, T.y, 3, 0, 2 * Math.PI), S.arc(k.x, k.y, 3, 0, 2 * Math.PI), S.closePath(), S.fill());
                }
              }
            }, r.bodies = function(x, A, S) {
              var b = S;
              x.engine;
              var C = x.options, P = C.showInternalEdges || !C.wireframes, M, T, k, E;
              for (k = 0; k < A.length; k++)
                if (M = A[k], !!M.render.visible) {
                  for (E = M.parts.length > 1 ? 1 : 0; E < M.parts.length; E++)
                    if (T = M.parts[E], !!T.render.visible) {
                      if (C.showSleeping && M.isSleeping ? b.globalAlpha = 0.5 * T.render.opacity : T.render.opacity !== 1 && (b.globalAlpha = T.render.opacity), T.render.sprite && T.render.sprite.texture && !C.wireframes) {
                        var B = T.render.sprite, R = _(x, B.texture);
                        b.translate(T.position.x, T.position.y), b.rotate(T.angle), b.drawImage(
                          R,
                          R.width * -B.xOffset * B.xScale,
                          R.height * -B.yOffset * B.yScale,
                          R.width * B.xScale,
                          R.height * B.yScale
                        ), b.rotate(-T.angle), b.translate(-T.position.x, -T.position.y);
                      } else {
                        if (T.circleRadius)
                          b.beginPath(), b.arc(T.position.x, T.position.y, T.circleRadius, 0, 2 * Math.PI);
                        else {
                          b.beginPath(), b.moveTo(T.vertices[0].x, T.vertices[0].y);
                          for (var I = 1; I < T.vertices.length; I++)
                            !T.vertices[I - 1].isInternal || P ? b.lineTo(T.vertices[I].x, T.vertices[I].y) : b.moveTo(T.vertices[I].x, T.vertices[I].y), T.vertices[I].isInternal && !P && b.moveTo(T.vertices[(I + 1) % T.vertices.length].x, T.vertices[(I + 1) % T.vertices.length].y);
                          b.lineTo(T.vertices[0].x, T.vertices[0].y), b.closePath();
                        }
                        C.wireframes ? (b.lineWidth = 1, b.strokeStyle = x.options.wireframeStrokeStyle, b.stroke()) : (b.fillStyle = T.render.fillStyle, T.render.lineWidth && (b.lineWidth = T.render.lineWidth, b.strokeStyle = T.render.strokeStyle, b.stroke()), b.fill());
                      }
                      b.globalAlpha = 1;
                    }
                }
            }, r.bodyWireframes = function(x, A, S) {
              var b = S, C = x.options.showInternalEdges, P, M, T, k, E;
              for (b.beginPath(), T = 0; T < A.length; T++)
                if (P = A[T], !!P.render.visible)
                  for (E = P.parts.length > 1 ? 1 : 0; E < P.parts.length; E++) {
                    for (M = P.parts[E], b.moveTo(M.vertices[0].x, M.vertices[0].y), k = 1; k < M.vertices.length; k++)
                      !M.vertices[k - 1].isInternal || C ? b.lineTo(M.vertices[k].x, M.vertices[k].y) : b.moveTo(M.vertices[k].x, M.vertices[k].y), M.vertices[k].isInternal && !C && b.moveTo(M.vertices[(k + 1) % M.vertices.length].x, M.vertices[(k + 1) % M.vertices.length].y);
                    b.lineTo(M.vertices[0].x, M.vertices[0].y);
                  }
              b.lineWidth = 1, b.strokeStyle = x.options.wireframeStrokeStyle, b.stroke();
            }, r.bodyConvexHulls = function(x, A, S) {
              var b = S, C, P, M;
              for (b.beginPath(), P = 0; P < A.length; P++)
                if (C = A[P], !(!C.render.visible || C.parts.length === 1)) {
                  for (b.moveTo(C.vertices[0].x, C.vertices[0].y), M = 1; M < C.vertices.length; M++)
                    b.lineTo(C.vertices[M].x, C.vertices[M].y);
                  b.lineTo(C.vertices[0].x, C.vertices[0].y);
                }
              b.lineWidth = 1, b.strokeStyle = "rgba(255,255,255,0.2)", b.stroke();
            }, r.vertexNumbers = function(x, A, S) {
              var b = S, C, P, M;
              for (C = 0; C < A.length; C++) {
                var T = A[C].parts;
                for (M = T.length > 1 ? 1 : 0; M < T.length; M++) {
                  var k = T[M];
                  for (P = 0; P < k.vertices.length; P++)
                    b.fillStyle = "rgba(255,255,255,0.2)", b.fillText(C + "_" + P, k.position.x + (k.vertices[P].x - k.position.x) * 0.8, k.position.y + (k.vertices[P].y - k.position.y) * 0.8);
                }
              }
            }, r.mousePosition = function(x, A, S) {
              var b = S;
              b.fillStyle = "rgba(255,255,255,0.8)", b.fillText(A.position.x + "  " + A.position.y, A.position.x + 5, A.position.y - 5);
            }, r.bodyBounds = function(x, A, S) {
              var b = S;
              x.engine;
              var C = x.options;
              b.beginPath();
              for (var P = 0; P < A.length; P++) {
                var M = A[P];
                if (M.render.visible)
                  for (var T = A[P].parts, k = T.length > 1 ? 1 : 0; k < T.length; k++) {
                    var E = T[k];
                    b.rect(E.bounds.min.x, E.bounds.min.y, E.bounds.max.x - E.bounds.min.x, E.bounds.max.y - E.bounds.min.y);
                  }
              }
              C.wireframes ? b.strokeStyle = "rgba(255,255,255,0.08)" : b.strokeStyle = "rgba(0,0,0,0.1)", b.lineWidth = 1, b.stroke();
            }, r.bodyAxes = function(x, A, S) {
              var b = S;
              x.engine;
              var C = x.options, P, M, T, k;
              for (b.beginPath(), M = 0; M < A.length; M++) {
                var E = A[M], B = E.parts;
                if (E.render.visible)
                  if (C.showAxes)
                    for (T = B.length > 1 ? 1 : 0; T < B.length; T++)
                      for (P = B[T], k = 0; k < P.axes.length; k++) {
                        var R = P.axes[k];
                        b.moveTo(P.position.x, P.position.y), b.lineTo(P.position.x + R.x * 20, P.position.y + R.y * 20);
                      }
                  else
                    for (T = B.length > 1 ? 1 : 0; T < B.length; T++)
                      for (P = B[T], k = 0; k < P.axes.length; k++)
                        b.moveTo(P.position.x, P.position.y), b.lineTo(
                          (P.vertices[0].x + P.vertices[P.vertices.length - 1].x) / 2,
                          (P.vertices[0].y + P.vertices[P.vertices.length - 1].y) / 2
                        );
              }
              C.wireframes ? (b.strokeStyle = "indianred", b.lineWidth = 1) : (b.strokeStyle = "rgba(255, 255, 255, 0.4)", b.globalCompositeOperation = "overlay", b.lineWidth = 2), b.stroke(), b.globalCompositeOperation = "source-over";
            }, r.bodyPositions = function(x, A, S) {
              var b = S;
              x.engine;
              var C = x.options, P, M, T, k;
              for (b.beginPath(), T = 0; T < A.length; T++)
                if (P = A[T], !!P.render.visible)
                  for (k = 0; k < P.parts.length; k++)
                    M = P.parts[k], b.arc(M.position.x, M.position.y, 3, 0, 2 * Math.PI, !1), b.closePath();
              for (C.wireframes ? b.fillStyle = "indianred" : b.fillStyle = "rgba(0,0,0,0.5)", b.fill(), b.beginPath(), T = 0; T < A.length; T++)
                P = A[T], P.render.visible && (b.arc(P.positionPrev.x, P.positionPrev.y, 2, 0, 2 * Math.PI, !1), b.closePath());
              b.fillStyle = "rgba(255,165,0,0.8)", b.fill();
            }, r.bodyVelocity = function(x, A, S) {
              var b = S;
              b.beginPath();
              for (var C = 0; C < A.length; C++) {
                var P = A[C];
                if (P.render.visible) {
                  var M = o.getVelocity(P);
                  b.moveTo(P.position.x, P.position.y), b.lineTo(P.position.x + M.x, P.position.y + M.y);
                }
              }
              b.lineWidth = 3, b.strokeStyle = "cornflowerblue", b.stroke();
            }, r.bodyIds = function(x, A, S) {
              var b = S, C, P;
              for (C = 0; C < A.length; C++)
                if (A[C].render.visible) {
                  var M = A[C].parts;
                  for (P = M.length > 1 ? 1 : 0; P < M.length; P++) {
                    var T = M[P];
                    b.font = "12px Arial", b.fillStyle = "rgba(255,255,255,0.5)", b.fillText(T.id, T.position.x + 10, T.position.y - 10);
                  }
                }
            }, r.collisions = function(x, A, S) {
              var b = S, C = x.options, P, M, T, k;
              for (b.beginPath(), T = 0; T < A.length; T++)
                if (P = A[T], !!P.isActive)
                  for (M = P.collision, k = 0; k < P.contactCount; k++) {
                    var E = P.contacts[k], B = E.vertex;
                    b.rect(B.x - 1.5, B.y - 1.5, 3.5, 3.5);
                  }
              for (C.wireframes ? b.fillStyle = "rgba(255,255,255,0.7)" : b.fillStyle = "orange", b.fill(), b.beginPath(), T = 0; T < A.length; T++)
                if (P = A[T], !!P.isActive && (M = P.collision, P.contactCount > 0)) {
                  var R = P.contacts[0].vertex.x, I = P.contacts[0].vertex.y;
                  P.contactCount === 2 && (R = (P.contacts[0].vertex.x + P.contacts[1].vertex.x) / 2, I = (P.contacts[0].vertex.y + P.contacts[1].vertex.y) / 2), M.bodyB === M.supports[0].body || M.bodyA.isStatic === !0 ? b.moveTo(R - M.normal.x * 8, I - M.normal.y * 8) : b.moveTo(R + M.normal.x * 8, I + M.normal.y * 8), b.lineTo(R, I);
                }
              C.wireframes ? b.strokeStyle = "rgba(255,165,0,0.7)" : b.strokeStyle = "orange", b.lineWidth = 1, b.stroke();
            }, r.separations = function(x, A, S) {
              var b = S, C = x.options, P, M, T, k, E;
              for (b.beginPath(), E = 0; E < A.length; E++)
                if (P = A[E], !!P.isActive) {
                  M = P.collision, T = M.bodyA, k = M.bodyB;
                  var B = 1;
                  !k.isStatic && !T.isStatic && (B = 0.5), k.isStatic && (B = 0), b.moveTo(k.position.x, k.position.y), b.lineTo(k.position.x - M.penetration.x * B, k.position.y - M.penetration.y * B), B = 1, !k.isStatic && !T.isStatic && (B = 0.5), T.isStatic && (B = 0), b.moveTo(T.position.x, T.position.y), b.lineTo(T.position.x + M.penetration.x * B, T.position.y + M.penetration.y * B);
                }
              C.wireframes ? b.strokeStyle = "rgba(255,165,0,0.5)" : b.strokeStyle = "orange", b.stroke();
            }, r.inspector = function(x, A) {
              x.engine;
              var S = x.selected, b = x.render, C = b.options, P;
              if (C.hasBounds) {
                var M = b.bounds.max.x - b.bounds.min.x, T = b.bounds.max.y - b.bounds.min.y, k = M / b.options.width, E = T / b.options.height;
                A.scale(1 / k, 1 / E), A.translate(-b.bounds.min.x, -b.bounds.min.y);
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
              b.delta = A - b.lastTime || r._goodDelta, b.lastTime = A, b.timestampElapsed = P - b.lastTimestamp || 0, b.lastTimestamp = P, b.deltaHistory.unshift(b.delta), b.deltaHistory.length = Math.min(b.deltaHistory.length, C), b.engineDeltaHistory.unshift(S.timing.lastDelta), b.engineDeltaHistory.length = Math.min(b.engineDeltaHistory.length, C), b.timestampElapsedHistory.unshift(b.timestampElapsed), b.timestampElapsedHistory.length = Math.min(b.timestampElapsedHistory.length, C), b.engineUpdatesHistory.unshift(S.timing.lastUpdatesPerFrame), b.engineUpdatesHistory.length = Math.min(b.engineUpdatesHistory.length, C), b.engineElapsedHistory.unshift(S.timing.lastElapsed), b.engineElapsedHistory.length = Math.min(b.engineElapsedHistory.length, C), b.elapsedHistory.unshift(b.lastElapsed), b.elapsedHistory.length = Math.min(b.elapsedHistory.length, C);
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
        function(e, s, n) {
          var r = {};
          e.exports = r;
          var o = n(5), a = n(17), l = n(0);
          (function() {
            r._maxFrameDelta = 1e3 / 15, r._frameDeltaFallback = 1e3 / 60, r._timeBufferMargin = 1.5, r._elapsedNextEstimate = 1, r._smoothingLowerBound = 0.1, r._smoothingUpperBound = 0.9, r.create = function(h) {
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
              }, p = l.extend(f, h);
              return p.fps = 0, p;
            }, r.run = function(h, f) {
              return h.timeBuffer = r._frameDeltaFallback, function p(u) {
                h.frameRequestId = r._onNextFrame(h, p), u && h.enabled && r.tick(h, f, u);
              }(), h;
            }, r.tick = function(h, f, p) {
              var u = l.now(), d = h.delta, m = 0, g = p - h.timeLastTick;
              if ((!g || !h.timeLastTick || g > Math.max(r._maxFrameDelta, h.maxFrameTime)) && (g = h.frameDelta || r._frameDeltaFallback), h.frameDeltaSmoothing) {
                h.frameDeltaHistory.push(g), h.frameDeltaHistory = h.frameDeltaHistory.slice(-h.frameDeltaHistorySize);
                var y = h.frameDeltaHistory.slice(0).sort(), v = h.frameDeltaHistory.slice(
                  y.length * r._smoothingLowerBound,
                  y.length * r._smoothingUpperBound
                ), _ = c(v);
                g = _ || g;
              }
              h.frameDeltaSnapping && (g = 1e3 / Math.round(1e3 / g)), h.frameDelta = g, h.timeLastTick = p, h.timeBuffer += h.frameDelta, h.timeBuffer = l.clamp(
                h.timeBuffer,
                0,
                h.frameDelta + d * r._timeBufferMargin
              ), h.lastUpdatesDeferred = 0;
              var w = h.maxUpdates || Math.ceil(h.maxFrameTime / d), x = {
                timestamp: f.timing.timestamp
              };
              o.trigger(h, "beforeTick", x), o.trigger(h, "tick", x);
              for (var A = l.now(); d > 0 && h.timeBuffer >= d * r._timeBufferMargin; ) {
                o.trigger(h, "beforeUpdate", x), a.update(f, d), o.trigger(h, "afterUpdate", x), h.timeBuffer -= d, m += 1;
                var S = l.now() - u, b = l.now() - A, C = S + r._elapsedNextEstimate * b / m;
                if (m >= w || C > h.maxFrameTime) {
                  h.lastUpdatesDeferred = Math.round(Math.max(0, h.timeBuffer / d - r._timeBufferMargin));
                  break;
                }
              }
              f.timing.lastUpdatesPerFrame = m, o.trigger(h, "afterTick", x), h.frameDeltaHistory.length >= 100 && (h.lastUpdatesDeferred && Math.round(h.frameDelta / d) > w ? l.warnOnce("Matter.Runner: runner reached runner.maxUpdates, see docs.") : h.lastUpdatesDeferred && l.warnOnce("Matter.Runner: runner reached runner.maxFrameTime, see docs."), typeof h.isFixed < "u" && l.warnOnce("Matter.Runner: runner.isFixed is now redundant, see docs."), (h.deltaMin || h.deltaMax) && l.warnOnce("Matter.Runner: runner.deltaMin and runner.deltaMax were removed, see docs."), h.fps !== 0 && l.warnOnce("Matter.Runner: runner.fps was replaced by runner.delta, see docs."));
            }, r.stop = function(h) {
              r._cancelNextFrame(h);
            }, r._onNextFrame = function(h, f) {
              if (typeof window < "u" && window.requestAnimationFrame)
                h.frameRequestId = window.requestAnimationFrame(f);
              else
                throw new Error("Matter.Runner: missing required global window.requestAnimationFrame.");
              return h.frameRequestId;
            }, r._cancelNextFrame = function(h) {
              if (typeof window < "u" && window.cancelAnimationFrame)
                window.cancelAnimationFrame(h.frameRequestId);
              else
                throw new Error("Matter.Runner: missing required global window.cancelAnimationFrame.");
            };
            var c = function(h) {
              for (var f = 0, p = h.length, u = 0; u < p; u += 1)
                f += h[u];
              return f / p || 0;
            };
          })();
        },
        /* 28 */
        /***/
        function(e, s, n) {
          var r = {};
          e.exports = r;
          var o = n(8), a = n(0), l = a.deprecated;
          (function() {
            r.collides = function(c, h) {
              return o.collides(c, h);
            }, l(r, "collides", "SAT.collides ➤ replaced by Collision.collides");
          })();
        },
        /* 29 */
        /***/
        function(e, s, n) {
          var r = {};
          e.exports = r, n(1);
          var o = n(0);
          (function() {
            r.pathToVertices = function(a, l) {
              typeof window < "u" && !("SVGPathSeg" in window) && o.warn("Svg.pathToVertices: SVGPathSeg not defined, a polyfill is required.");
              var c, h, f, p, u, d, m, g, y, v, _ = [], w, x, A = 0, S = 0, b = 0;
              l = l || 15;
              var C = function(M, T, k) {
                var E = k % 2 === 1 && k > 1;
                if (!y || M != y.x || T != y.y) {
                  y && E ? (w = y.x, x = y.y) : (w = 0, x = 0);
                  var B = {
                    x: w + M,
                    y: x + T
                  };
                  (E || !y) && (y = B), _.push(B), S = w + M, b = x + T;
                }
              }, P = function(M) {
                var T = M.pathSegTypeAsLetter.toUpperCase();
                if (T !== "Z") {
                  switch (T) {
                    case "M":
                    case "L":
                    case "T":
                    case "C":
                    case "S":
                    case "Q":
                      S = M.x, b = M.y;
                      break;
                    case "H":
                      S = M.x;
                      break;
                    case "V":
                      b = M.y;
                      break;
                  }
                  C(S, b, M.pathSegType);
                }
              };
              for (r._svgPathToAbsolute(a), f = a.getTotalLength(), d = [], c = 0; c < a.pathSegList.numberOfItems; c += 1)
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
                A += l;
              }
              for (c = 0, h = m.length; c < h; ++c)
                P(m[c]);
              return _;
            }, r._svgPathToAbsolute = function(a) {
              for (var l, c, h, f, p, u, d = a.pathSegList, m = 0, g = 0, y = d.numberOfItems, v = 0; v < y; ++v) {
                var _ = d.getItem(v), w = _.pathSegTypeAsLetter;
                if (/[MLHVCSQTA]/.test(w))
                  "x" in _ && (m = _.x), "y" in _ && (g = _.y);
                else
                  switch ("x1" in _ && (h = m + _.x1), "x2" in _ && (p = m + _.x2), "y1" in _ && (f = g + _.y1), "y2" in _ && (u = g + _.y2), "x" in _ && (m += _.x), "y" in _ && (g += _.y), w) {
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
                      d.replaceItem(a.createSVGPathSegCurvetoCubicAbs(m, g, h, f, p, u), v);
                      break;
                    case "s":
                      d.replaceItem(a.createSVGPathSegCurvetoCubicSmoothAbs(m, g, p, u), v);
                      break;
                    case "q":
                      d.replaceItem(a.createSVGPathSegCurvetoQuadraticAbs(m, g, h, f), v);
                      break;
                    case "t":
                      d.replaceItem(a.createSVGPathSegCurvetoQuadraticSmoothAbs(m, g), v);
                      break;
                    case "a":
                      d.replaceItem(a.createSVGPathSegArcAbs(m, g, _.r1, _.r2, _.angle, _.largeArcFlag, _.sweepFlag), v);
                      break;
                    case "z":
                    case "Z":
                      m = l, g = c;
                      break;
                  }
                (w == "M" || w == "m") && (l = m, c = g);
              }
            };
          })();
        },
        /* 30 */
        /***/
        function(e, s, n) {
          var r = {};
          e.exports = r;
          var o = n(6);
          n(0), function() {
            r.create = o.create, r.add = o.add, r.remove = o.remove, r.clear = o.clear, r.addComposite = o.addComposite, r.addBody = o.addBody, r.addConstraint = o.addConstraint;
          }();
        }
        /******/
      ])
    );
  });
})(gh);
var ae = gh.exports;
let $e;
const _i = /* @__PURE__ */ new Map(), Zs = /* @__PURE__ */ new Map(), Ao = /* @__PURE__ */ new Map();
let zs = 0;
const bd = () => {
  $e = ae.Engine.create(), ae.Events.on($e, "collisionStart", (i) => {
    i.pairs.forEach((t) => {
      var e, s;
      const { bodyA: n, bodyB: r } = t, o = _i.get(n.label), a = _i.get(r.label);
      if (!o || !a) return;
      const l = [o, a].find((h) => h.surface), c = [o, a].find((h) => !h.surface);
      c && (l ? Zs.set(
        c.target.matterBody.label,
        Math.floor(ha(l).y1)
      ) : ((e = o.onCollision) == null || e.call(o, a.target), (s = a.onCollision) == null || s.call(a, o.target)));
    });
  }), ae.Events.on($e, "collisionEnd", (i) => {
    i.pairs.forEach((t) => {
      const { bodyA: e, bodyB: s } = t, n = _i.get(e.label), r = _i.get(s.label);
      if (!n || !r) return;
      const o = [n, r].find((l) => l.surface), a = [n, r].find((l) => !l.surface);
      a && o && Zs.delete(a.target.matterBody.label);
    });
  }), ae.Events.on($e, "afterUpdate", () => {
    Ao.forEach((i) => {
      var t;
      if (!i.target.matterBody) return;
      const e = ha(i), s = (Zs.get(i.target.matterBody.label) ?? -1 / 0) >= Math.floor(e.y2);
      (t = i.onUpdatePosition) == null || t.call(i, e.x1, e.y1, s);
    });
  });
}, _d = (i) => {
  ae.Engine.update($e, i);
}, _r = (i) => {
  if (i.rectangle)
    i.target.matterBody = ae.Bodies.rectangle(
      i.rectangle.x + i.rectangle.width / 2,
      i.rectangle.y + i.rectangle.height / 2,
      i.rectangle.width,
      i.rectangle.height,
      la(i)
    );
  else if (i.circle)
    i.target.matterBody = ae.Bodies.circle(
      i.circle.x,
      i.circle.y,
      i.circle.radius,
      la(i)
    );
  else
    throw new Error("No body specification provided");
  _i.set(i.target.matterBody.label, i), i.onUpdatePosition && Ao.set(i.target.matterBody.label, i), ae.Composite.add($e.world, i.target.matterBody), i.movement && So(i.target, i.movement);
}, wd = (i) => {
  i.matterBody && (ae.Composite.remove($e.world, i.matterBody), _i.delete(i.matterBody.label), Zs.delete(i.matterBody.label), Ao.delete(i.matterBody.label));
}, So = (i, t) => {
  i.matterBody && t.linearMovement && ae.Body.setVelocity(i.matterBody, t.linearMovement.velocity);
}, aa = (i, t, e) => {
  i.matterBody && ae.Body.setPosition(i.matterBody, {
    x: i.matterBody.position.x + t,
    y: i.matterBody.position.y + e
  });
}, la = (i) => {
  var t;
  return zs++, i.surface ? {
    isStatic: !0,
    label: zs.toString(),
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
    label: zs.toString()
  } : {
    isStatic: !0,
    friction: 0,
    frictionAir: 0,
    frictionStatic: 0,
    restitution: 0,
    isSensor: !0,
    label: zs.toString()
  };
}, ha = (i) => i.target.matterBody ? i.rectangle ? {
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
class Es {
  constructor(t, e) {
    fe(this, "_props"), fe(this, "_object"), fe(this, "_parent", null), fe(this, "_bindings", []), fe(this, "_animations", []), this._props = e, this._object = t, (this.props.horizontalAlignment || this.props.verticalAlignment) && this.registerToSignal(D.signals.onResize, this.positionToScreen), this.onResize && this.registerToSignal(D.signals.onResize, this.onResize), this.onOrientationChange && this.registerToSignal(
      D.signals.onOrientationChange,
      this.onOrientationChange
    ), this.onTick && this.registerToSignal(D.signals.onTick, this.onTick), this.onClick && this.object.on("pointerdown", (s) => {
      s.stopImmediatePropagation(), this.onClick();
    }), this.onPointerUp && this.object.on("pointerup", (s) => {
      s.stopImmediatePropagation(), this.onPointerUp();
    }), this.onPointerEnter && this.object.on("pointerenter", () => {
      this.onPointerEnter();
    }), this.onPointerOut && this.object.on("pointerout", () => {
      this.onPointerOut();
    }), this.positionToScreen();
  }
  registerToSignal(t, e) {
    this._bindings.push(gi(t, e.bind(this)));
  }
  unregisterFromSignal(t) {
    for (let e = 0; e < this._bindings.length; e++)
      this._bindings[e].name === t && (ns(t, this._bindings[e].binding), this._bindings.splice(e, 1), e--);
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
  animate(t) {
    return this._createAnimation(this, t);
  }
  stopAnimations() {
    this._animations.forEach((t) => t.stop()), this._animations = [];
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
    wd(this), this._bindings.forEach(
      ({ name: t, binding: e }) => ns(t, e)
    ), this._bindings = [], this.stopAnimations(), this.parent = null, this.object.destroy();
  }
  positionToScreen() {
    var t, e, s, n;
    this.props.horizontalAlignment === "center" ? this.x = V.screen.width / 2 + (((t = this.props.margin) == null ? void 0 : t.x) ?? 0) : this.props.horizontalAlignment === "right" && (this.x = V.screen.width + (((e = this.props.margin) == null ? void 0 : e.x) ?? 0)), this.props.verticalAlignment === "center" ? this.y = V.screen.height / 2 + (((s = this.props.margin) == null ? void 0 : s.y) ?? 0) : this.props.verticalAlignment === "bottom" && (this.y = V.screen.height + (((n = this.props.margin) == null ? void 0 : n.y) ?? 0));
  }
  async _createAnimation(t, e) {
    const s = new Di(e);
    this._animations.push(s), await s.start(t);
    const n = this._animations.indexOf(s);
    this._animations.splice(n, 1);
  }
}
var z = /* @__PURE__ */ ((i) => (i.Application = "application", i.WebGLPipes = "webgl-pipes", i.WebGLPipesAdaptor = "webgl-pipes-adaptor", i.WebGLSystem = "webgl-system", i.WebGPUPipes = "webgpu-pipes", i.WebGPUPipesAdaptor = "webgpu-pipes-adaptor", i.WebGPUSystem = "webgpu-system", i.CanvasSystem = "canvas-system", i.CanvasPipesAdaptor = "canvas-pipes-adaptor", i.CanvasPipes = "canvas-pipes", i.Asset = "asset", i.LoadParser = "load-parser", i.ResolveParser = "resolve-parser", i.CacheParser = "cache-parser", i.DetectionParser = "detection-parser", i.MaskEffect = "mask-effect", i.BlendMode = "blend-mode", i.TextureSource = "texture-source", i.Environment = "environment", i.ShapeBuilder = "shape-builder", i.Batcher = "batcher", i))(z || {});
const Rn = (i) => {
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
}, Ds = (i, t) => Rn(i).priority ?? t, kt = {
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
    return i.map(Rn).forEach((t) => {
      t.type.forEach((e) => {
        var s, n;
        return (n = (s = this._removeHandlers)[e]) == null ? void 0 : n.call(s, t);
      });
    }), this;
  },
  /**
   * Register new extensions with PixiJS.
   * @param extensions - The spread of extensions to add to PixiJS.
   * @returns {extensions} For chaining.
   */
  add(...i) {
    return i.map(Rn).forEach((t) => {
      t.type.forEach((e) => {
        var s, n;
        const r = this._addHandlers, o = this._queue;
        r[e] ? (n = r[e]) == null || n.call(r, t) : (o[e] = o[e] || [], (s = o[e]) == null || s.push(t));
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
    var s;
    const n = this._addHandlers, r = this._removeHandlers;
    if (n[i] || r[i])
      throw new Error(`Extension type ${i} already has a handler`);
    n[i] = t, r[i] = e;
    const o = this._queue;
    return o[i] && ((s = o[i]) == null || s.forEach((a) => t(a)), delete o[i]), this;
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
      (s) => {
        t.findIndex((n) => n.name === s.name) >= 0 || (t.push({ name: s.name, value: s.ref }), t.sort((n, r) => Ds(r.value, e) - Ds(n.value, e)));
      },
      (s) => {
        const n = t.findIndex((r) => r.name === s.name);
        n !== -1 && t.splice(n, 1);
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
      (s) => {
        t.includes(s.ref) || (t.push(s.ref), t.sort((n, r) => Ds(r, e) - Ds(n, e)));
      },
      (s) => {
        const n = t.indexOf(s.ref);
        n !== -1 && t.splice(n, 1);
      }
    );
  }
}, Ad = {
  extension: {
    type: z.Environment,
    name: "browser",
    priority: -1
  },
  test: () => !0,
  load: async () => {
    await import("./browserAll-VLSZTgZD-gyFB3ZpT.js");
  }
}, Sd = {
  extension: {
    type: z.Environment,
    name: "webworker",
    priority: 0
  },
  test: () => typeof self < "u" && self.WorkerGlobalScope !== void 0,
  load: async () => {
    await import("./webworkerAll-RkqKgEa5-BycScuTK.js");
  }
};
class gt {
  /**
   * Creates a new `ObservablePoint`
   * @param observer - Observer to pass to listen for change events.
   * @param {number} [x=0] - position of the point on the x axis
   * @param {number} [y=0] - position of the point on the y axis
   */
  constructor(t, e, s) {
    this._x = e || 0, this._y = s || 0, this._observer = t;
  }
  /**
   * Creates a clone of this point.
   * @param observer - Optional observer to pass to the new observable point.
   * @returns a copy of this observable point
   */
  clone(t) {
    return new gt(t ?? this._observer, this._x, this._y);
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
var yh = { exports: {} };
(function(i) {
  var t = Object.prototype.hasOwnProperty, e = "~";
  function s() {
  }
  Object.create && (s.prototype = /* @__PURE__ */ Object.create(null), new s().__proto__ || (e = !1));
  function n(l, c, h) {
    this.fn = l, this.context = c, this.once = h || !1;
  }
  function r(l, c, h, f, p) {
    if (typeof h != "function")
      throw new TypeError("The listener must be a function");
    var u = new n(h, f || l, p), d = e ? e + c : c;
    return l._events[d] ? l._events[d].fn ? l._events[d] = [l._events[d], u] : l._events[d].push(u) : (l._events[d] = u, l._eventsCount++), l;
  }
  function o(l, c) {
    --l._eventsCount === 0 ? l._events = new s() : delete l._events[c];
  }
  function a() {
    this._events = new s(), this._eventsCount = 0;
  }
  a.prototype.eventNames = function() {
    var l = [], c, h;
    if (this._eventsCount === 0) return l;
    for (h in c = this._events)
      t.call(c, h) && l.push(e ? h.slice(1) : h);
    return Object.getOwnPropertySymbols ? l.concat(Object.getOwnPropertySymbols(c)) : l;
  }, a.prototype.listeners = function(l) {
    var c = e ? e + l : l, h = this._events[c];
    if (!h) return [];
    if (h.fn) return [h.fn];
    for (var f = 0, p = h.length, u = new Array(p); f < p; f++)
      u[f] = h[f].fn;
    return u;
  }, a.prototype.listenerCount = function(l) {
    var c = e ? e + l : l, h = this._events[c];
    return h ? h.fn ? 1 : h.length : 0;
  }, a.prototype.emit = function(l, c, h, f, p, u) {
    var d = e ? e + l : l;
    if (!this._events[d]) return !1;
    var m = this._events[d], g = arguments.length, y, v;
    if (m.fn) {
      switch (m.once && this.removeListener(l, m.fn, void 0, !0), g) {
        case 1:
          return m.fn.call(m.context), !0;
        case 2:
          return m.fn.call(m.context, c), !0;
        case 3:
          return m.fn.call(m.context, c, h), !0;
        case 4:
          return m.fn.call(m.context, c, h, f), !0;
        case 5:
          return m.fn.call(m.context, c, h, f, p), !0;
        case 6:
          return m.fn.call(m.context, c, h, f, p, u), !0;
      }
      for (v = 1, y = new Array(g - 1); v < g; v++)
        y[v - 1] = arguments[v];
      m.fn.apply(m.context, y);
    } else {
      var _ = m.length, w;
      for (v = 0; v < _; v++)
        switch (m[v].once && this.removeListener(l, m[v].fn, void 0, !0), g) {
          case 1:
            m[v].fn.call(m[v].context);
            break;
          case 2:
            m[v].fn.call(m[v].context, c);
            break;
          case 3:
            m[v].fn.call(m[v].context, c, h);
            break;
          case 4:
            m[v].fn.call(m[v].context, c, h, f);
            break;
          default:
            if (!y) for (w = 1, y = new Array(g - 1); w < g; w++)
              y[w - 1] = arguments[w];
            m[v].fn.apply(m[v].context, y);
        }
    }
    return !0;
  }, a.prototype.on = function(l, c, h) {
    return r(this, l, c, h, !1);
  }, a.prototype.once = function(l, c, h) {
    return r(this, l, c, h, !0);
  }, a.prototype.removeListener = function(l, c, h, f) {
    var p = e ? e + l : l;
    if (!this._events[p]) return this;
    if (!c)
      return o(this, p), this;
    var u = this._events[p];
    if (u.fn)
      u.fn === c && (!f || u.once) && (!h || u.context === h) && o(this, p);
    else {
      for (var d = 0, m = [], g = u.length; d < g; d++)
        (u[d].fn !== c || f && !u[d].once || h && u[d].context !== h) && m.push(u[d]);
      m.length ? this._events[p] = m.length === 1 ? m[0] : m : o(this, p);
    }
    return this;
  }, a.prototype.removeAllListeners = function(l) {
    var c;
    return l ? (c = e ? e + l : l, this._events[c] && o(this, c)) : (this._events = new s(), this._eventsCount = 0), this;
  }, a.prototype.off = a.prototype.removeListener, a.prototype.addListener = a.prototype.on, a.prefixed = e, a.EventEmitter = a, i.exports = a;
})(yh);
var Cd = yh.exports;
const Et = /* @__PURE__ */ ro(Cd), Pd = Math.PI * 2, Md = 180 / Math.PI, Td = Math.PI / 180;
class Pt {
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
    return new Pt(this.x, this.y);
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
    return Ur.x = 0, Ur.y = 0, Ur;
  }
}
const Ur = new Pt();
class X {
  /**
   * @param a - x scale
   * @param b - y skew
   * @param c - x skew
   * @param d - y scale
   * @param tx - x translation
   * @param ty - y translation
   */
  constructor(t = 1, e = 0, s = 0, n = 1, r = 0, o = 0) {
    this.array = null, this.a = t, this.b = e, this.c = s, this.d = n, this.tx = r, this.ty = o;
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
  set(t, e, s, n, r, o) {
    return this.a = t, this.b = e, this.c = s, this.d = n, this.tx = r, this.ty = o, this;
  }
  /**
   * Creates an array from the current Matrix object.
   * @param transpose - Whether we need to transpose the matrix or not
   * @param [out=new Float32Array(9)] - If provided the array will be assigned to out
   * @returns The newly created array which contains the matrix
   */
  toArray(t, e) {
    this.array || (this.array = new Float32Array(9));
    const s = e || this.array;
    return t ? (s[0] = this.a, s[1] = this.b, s[2] = 0, s[3] = this.c, s[4] = this.d, s[5] = 0, s[6] = this.tx, s[7] = this.ty, s[8] = 1) : (s[0] = this.a, s[1] = this.c, s[2] = this.tx, s[3] = this.b, s[4] = this.d, s[5] = this.ty, s[6] = 0, s[7] = 0, s[8] = 1), s;
  }
  /**
   * Get a new position with the current transformation applied.
   * Can be used to go from a child's coordinate space to the world coordinate space. (e.g. rendering)
   * @param pos - The origin
   * @param {Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
   * @returns {Point} The new point, transformed through this matrix
   */
  apply(t, e) {
    e = e || new Pt();
    const s = t.x, n = t.y;
    return e.x = this.a * s + this.c * n + this.tx, e.y = this.b * s + this.d * n + this.ty, e;
  }
  /**
   * Get a new position with the inverse of the current transformation applied.
   * Can be used to go from the world coordinate space to a child's coordinate space. (e.g. input)
   * @param pos - The origin
   * @param {Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
   * @returns {Point} The new point, inverse-transformed through this matrix
   */
  applyInverse(t, e) {
    e = e || new Pt();
    const s = this.a, n = this.b, r = this.c, o = this.d, a = this.tx, l = this.ty, c = 1 / (s * o + r * -n), h = t.x, f = t.y;
    return e.x = o * c * h + -r * c * f + (l * r - a * o) * c, e.y = s * c * f + -n * c * h + (-l * s + a * n) * c, e;
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
    const e = Math.cos(t), s = Math.sin(t), n = this.a, r = this.c, o = this.tx;
    return this.a = n * e - this.b * s, this.b = n * s + this.b * e, this.c = r * e - this.d * s, this.d = r * s + this.d * e, this.tx = o * e - this.ty * s, this.ty = o * s + this.ty * e, this;
  }
  /**
   * Appends the given Matrix to this Matrix.
   * @param matrix - The matrix to append.
   * @returns This matrix. Good for chaining method calls.
   */
  append(t) {
    const e = this.a, s = this.b, n = this.c, r = this.d;
    return this.a = t.a * e + t.b * n, this.b = t.a * s + t.b * r, this.c = t.c * e + t.d * n, this.d = t.c * s + t.d * r, this.tx = t.tx * e + t.ty * n + this.tx, this.ty = t.tx * s + t.ty * r + this.ty, this;
  }
  /**
   * Appends two matrix's and sets the result to this matrix. AB = A * B
   * @param a - The matrix to append.
   * @param b - The matrix to append.
   * @returns This matrix. Good for chaining method calls.
   */
  appendFrom(t, e) {
    const s = t.a, n = t.b, r = t.c, o = t.d, a = t.tx, l = t.ty, c = e.a, h = e.b, f = e.c, p = e.d;
    return this.a = s * c + n * f, this.b = s * h + n * p, this.c = r * c + o * f, this.d = r * h + o * p, this.tx = a * c + l * f + e.tx, this.ty = a * h + l * p + e.ty, this;
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
  setTransform(t, e, s, n, r, o, a, l, c) {
    return this.a = Math.cos(a + c) * r, this.b = Math.sin(a + c) * r, this.c = -Math.sin(a - l) * o, this.d = Math.cos(a - l) * o, this.tx = t - (s * this.a + n * this.c), this.ty = e - (s * this.b + n * this.d), this;
  }
  /**
   * Prepends the given Matrix to this Matrix.
   * @param matrix - The matrix to prepend
   * @returns This matrix. Good for chaining method calls.
   */
  prepend(t) {
    const e = this.tx;
    if (t.a !== 1 || t.b !== 0 || t.c !== 0 || t.d !== 1) {
      const s = this.a, n = this.c;
      this.a = s * t.a + this.b * t.c, this.b = s * t.b + this.b * t.d, this.c = n * t.a + this.d * t.c, this.d = n * t.b + this.d * t.d;
    }
    return this.tx = e * t.a + this.ty * t.c + t.tx, this.ty = e * t.b + this.ty * t.d + t.ty, this;
  }
  /**
   * Decomposes the matrix (x, y, scaleX, scaleY, and rotation) and sets the properties on to a transform.
   * @param transform - The transform to apply the properties to.
   * @returns The transform with the newly applied properties
   */
  decompose(t) {
    const e = this.a, s = this.b, n = this.c, r = this.d, o = t.pivot, a = -Math.atan2(-n, r), l = Math.atan2(s, e), c = Math.abs(a + l);
    return c < 1e-5 || Math.abs(Pd - c) < 1e-5 ? (t.rotation = l, t.skew.x = t.skew.y = 0) : (t.rotation = 0, t.skew.x = a, t.skew.y = l), t.scale.x = Math.sqrt(e * e + s * s), t.scale.y = Math.sqrt(n * n + r * r), t.position.x = this.tx + (o.x * e + o.y * n), t.position.y = this.ty + (o.x * s + o.y * r), t;
  }
  /**
   * Inverts this matrix
   * @returns This matrix. Good for chaining method calls.
   */
  invert() {
    const t = this.a, e = this.b, s = this.c, n = this.d, r = this.tx, o = t * n - e * s;
    return this.a = n / o, this.b = -e / o, this.c = -s / o, this.d = t / o, this.tx = (s * this.ty - n * r) / o, this.ty = -(t * this.ty - e * r) / o, this;
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
    const t = new X();
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
    return Ed.identity();
  }
  /**
   * A static Matrix that can be used to avoid creating new objects.
   * Will always ensure the matrix is reset to identity when requested.
   * Use this object for fast but temporary calculations, as it may be mutated later on.
   * This is a different object to the `IDENTITY` object and so can be modified without changing `IDENTITY`.
   * @readonly
   */
  static get shared() {
    return kd.identity();
  }
}
const kd = new X(), Ed = new X(), Xe = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1], qe = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1], Ke = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1], Qe = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1], In = [], xh = [], Us = Math.sign;
function Bd() {
  for (let i = 0; i < 16; i++) {
    const t = [];
    In.push(t);
    for (let e = 0; e < 16; e++) {
      const s = Us(Xe[i] * Xe[e] + Ke[i] * qe[e]), n = Us(qe[i] * Xe[e] + Qe[i] * qe[e]), r = Us(Xe[i] * Ke[e] + Ke[i] * Qe[e]), o = Us(qe[i] * Ke[e] + Qe[i] * Qe[e]);
      for (let a = 0; a < 16; a++)
        if (Xe[a] === s && qe[a] === n && Ke[a] === r && Qe[a] === o) {
          t.push(a);
          break;
        }
    }
  }
  for (let i = 0; i < 16; i++) {
    const t = new X();
    t.set(Xe[i], qe[i], Ke[i], Qe[i], 0, 0), xh.push(t);
  }
}
Bd();
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
  uX: (i) => Xe[i],
  /**
   * @memberof maths.groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The Y-component of the U-axis
   *    after rotating the axes.
   */
  uY: (i) => qe[i],
  /**
   * @memberof maths.groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The X-component of the V-axis
   *    after rotating the axes.
   */
  vX: (i) => Ke[i],
  /**
   * @memberof maths.groupD8
   * @param {GD8Symmetry} ind - sprite rotation angle.
   * @returns {GD8Symmetry} The Y-component of the V-axis
   *    after rotating the axes.
   */
  vY: (i) => Qe[i],
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
  add: (i, t) => In[i][t],
  /**
   * Reverse of `add`.
   * @memberof maths.groupD8
   * @param {GD8Symmetry} rotationSecond - Second operation
   * @param {GD8Symmetry} rotationFirst - First operation
   * @returns {GD8Symmetry} Result
   */
  sub: (i, t) => In[i][it.inv(t)],
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
  matrixAppendRotationInv: (i, t, e = 0, s = 0) => {
    const n = xh[it.inv(t)];
    n.tx = e, n.ty = s, i.append(n);
  }
}, Gs = [new Pt(), new Pt(), new Pt(), new Pt()];
class yt {
  /**
   * @param x - The X coordinate of the upper-left corner of the rectangle
   * @param y - The Y coordinate of the upper-left corner of the rectangle
   * @param width - The overall width of the rectangle
   * @param height - The overall height of the rectangle
   */
  constructor(t = 0, e = 0, s = 0, n = 0) {
    this.type = "rectangle", this.x = Number(t), this.y = Number(e), this.width = Number(s), this.height = Number(n);
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
    return new yt(0, 0, 0, 0);
  }
  /**
   * Creates a clone of this Rectangle
   * @returns a copy of the rectangle
   */
  clone() {
    return new yt(this.x, this.y, this.width, this.height);
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
  strokeContains(t, e, s) {
    const { width: n, height: r } = this;
    if (n <= 0 || r <= 0)
      return !1;
    const o = this.x, a = this.y, l = o - s / 2, c = o + n + s / 2, h = a - s / 2, f = a + r + s / 2, p = o + s / 2, u = o + n - s / 2, d = a + s / 2, m = a + r - s / 2;
    return t >= l && t <= c && e >= h && e <= f && !(t > p && t < u && e > d && e < m);
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
    const s = this.left, n = this.right, r = this.top, o = this.bottom;
    if (n <= s || o <= r)
      return !1;
    const a = Gs[0].set(t.left, t.top), l = Gs[1].set(t.left, t.bottom), c = Gs[2].set(t.right, t.top), h = Gs[3].set(t.right, t.bottom);
    if (c.x <= a.x || l.y <= a.y)
      return !1;
    const f = Math.sign(e.a * e.d - e.b * e.c);
    if (f === 0 || (e.apply(a, a), e.apply(l, l), e.apply(c, c), e.apply(h, h), Math.max(a.x, l.x, c.x, h.x) <= s || Math.min(a.x, l.x, c.x, h.x) >= n || Math.max(a.y, l.y, c.y, h.y) <= r || Math.min(a.y, l.y, c.y, h.y) >= o))
      return !1;
    const p = f * (l.y - a.y), u = f * (a.x - l.x), d = p * s + u * r, m = p * n + u * r, g = p * s + u * o, y = p * n + u * o;
    if (Math.max(d, m, g, y) <= p * a.x + u * a.y || Math.min(d, m, g, y) >= p * h.x + u * h.y)
      return !1;
    const v = f * (a.y - c.y), _ = f * (c.x - a.x), w = v * s + _ * r, x = v * n + _ * r, A = v * s + _ * o, S = v * n + _ * o;
    return !(Math.max(w, x, A, S) <= v * a.x + _ * a.y || Math.min(w, x, A, S) >= v * h.x + _ * h.y);
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
    const e = Math.max(this.x, t.x), s = Math.min(this.x + this.width, t.x + t.width), n = Math.max(this.y, t.y), r = Math.min(this.y + this.height, t.y + t.height);
    return this.x = e, this.width = Math.max(s - e, 0), this.y = n, this.height = Math.max(r - n, 0), this;
  }
  /**
   * Enlarges rectangle that way its corners lie on grid
   * @param resolution - resolution
   * @param eps - precision
   * @returns Returns itself.
   */
  ceil(t = 1, e = 1e-3) {
    const s = Math.ceil((this.x + this.width - e) * t) / t, n = Math.ceil((this.y + this.height - e) * t) / t;
    return this.x = Math.floor((this.x + e) * t) / t, this.y = Math.floor((this.y + e) * t) / t, this.width = s - this.x, this.height = n - this.y, this;
  }
  /**
   * Enlarges this rectangle to include the passed rectangle.
   * @param rectangle - The rectangle to include.
   * @returns Returns itself.
   */
  enlarge(t) {
    const e = Math.min(this.x, t.x), s = Math.max(this.x + this.width, t.x + t.width), n = Math.min(this.y, t.y), r = Math.max(this.y + this.height, t.y + t.height);
    return this.x = e, this.width = s - e, this.y = n, this.height = r - n, this;
  }
  /**
   * Returns the framing rectangle of the rectangle as a Rectangle object
   * @param out - optional rectangle to store the result
   * @returns The framing rectangle
   */
  getBounds(t) {
    return t = t || new yt(), t.copyFrom(this), t;
  }
  toString() {
    return `[pixi.js/math:Rectangle x=${this.x} y=${this.y} width=${this.width} height=${this.height}]`;
  }
}
const Gr = {
  default: -1
};
function xt(i = "default") {
  return Gr[i] === void 0 && (Gr[i] = -1), ++Gr[i];
}
const ca = {}, Q = "8.0.0", Rd = "8.3.4";
function K(i, t, e = 3) {
  if (ca[t])
    return;
  let s = new Error().stack;
  typeof s > "u" ? console.warn("PixiJS Deprecation Warning: ", `${t}
Deprecated since v${i}`) : (s = s.split(`
`).splice(e).join(`
`), console.groupCollapsed ? (console.groupCollapsed(
    "%cPixiJS Deprecation Warning: %c%s",
    "color:#614108;background:#fffbe6",
    "font-weight:normal;color:#614108;background:#fffbe6",
    `${t}
Deprecated since v${i}`
  ), console.warn(s), console.groupEnd()) : (console.warn("PixiJS Deprecation Warning: ", `${t}
Deprecated since v${i}`), console.warn(s))), ca[t] = !0;
}
const vh = () => {
};
function ua(i) {
  return i += i === 0 ? 1 : 0, --i, i |= i >>> 1, i |= i >>> 2, i |= i >>> 4, i |= i >>> 8, i |= i >>> 16, i + 1;
}
function da(i) {
  return !(i & i - 1) && !!i;
}
function Id(i) {
  const t = {};
  for (const e in i)
    i[e] !== void 0 && (t[e] = i[e]);
  return t;
}
const pa = /* @__PURE__ */ Object.create(null);
function Od(i) {
  const t = pa[i];
  return t === void 0 && (pa[i] = xt("resource")), t;
}
const bh = class _h extends Et {
  /**
   * @param options - options for the style
   */
  constructor(t = {}) {
    super(), this._resourceType = "textureSampler", this._touched = 0, this._maxAnisotropy = 1, this.destroyed = !1, t = { ..._h.defaultOptions, ...t }, this.addressMode = t.addressMode, this.addressModeU = t.addressModeU ?? this.addressModeU, this.addressModeV = t.addressModeV ?? this.addressModeV, this.addressModeW = t.addressModeW ?? this.addressModeW, this.scaleMode = t.scaleMode, this.magFilter = t.magFilter ?? this.magFilter, this.minFilter = t.minFilter ?? this.minFilter, this.mipmapFilter = t.mipmapFilter ?? this.mipmapFilter, this.lodMinClamp = t.lodMinClamp, this.lodMaxClamp = t.lodMaxClamp, this.compare = t.compare, this.maxAnisotropy = t.maxAnisotropy ?? 1;
  }
  set addressMode(t) {
    this.addressModeU = t, this.addressModeV = t, this.addressModeW = t;
  }
  /** setting this will set wrapModeU,wrapModeV and wrapModeW all at once! */
  get addressMode() {
    return this.addressModeU;
  }
  set wrapMode(t) {
    K(Q, "TextureStyle.wrapMode is now TextureStyle.addressMode"), this.addressMode = t;
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
    return this._sharedResourceId = Od(t), this._resourceId;
  }
  /** Destroys the style */
  destroy() {
    this.destroyed = !0, this.emit("destroy", this), this.emit("change", this), this.removeAllListeners();
  }
};
bh.defaultOptions = {
  addressMode: "clamp-to-edge",
  scaleMode: "linear"
};
let Fd = bh;
const wh = class Ah extends Et {
  /**
   * @param options - options for creating a new TextureSource
   */
  constructor(t = {}) {
    super(), this.options = t, this.uid = xt("textureSource"), this._resourceType = "textureSource", this._resourceId = xt("resource"), this.uploadMethodId = "unknown", this._resolution = 1, this.pixelWidth = 1, this.pixelHeight = 1, this.width = 1, this.height = 1, this.sampleCount = 1, this.mipLevelCount = 1, this.autoGenerateMipmaps = !1, this.format = "rgba8unorm", this.dimension = "2d", this.antialias = !1, this._touched = 0, this._batchTick = -1, this._textureBindLocation = -1, t = { ...Ah.defaultOptions, ...t }, this.label = t.label ?? "", this.resource = t.resource, this.autoGarbageCollect = t.autoGarbageCollect, this._resolution = t.resolution, t.width ? this.pixelWidth = t.width * this._resolution : this.pixelWidth = this.resource ? this.resourceWidth ?? 1 : 1, t.height ? this.pixelHeight = t.height * this._resolution : this.pixelHeight = this.resource ? this.resourceHeight ?? 1 : 1, this.width = this.pixelWidth / this._resolution, this.height = this.pixelHeight / this._resolution, this.format = t.format, this.dimension = t.dimensions, this.mipLevelCount = t.mipLevelCount, this.autoGenerateMipmaps = t.autoGenerateMipmaps, this.sampleCount = t.sampleCount, this.antialias = t.antialias, this.alphaMode = t.alphaMode, this.style = new Fd(Id(t)), this.destroyed = !1, this._refreshPOT();
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
    var e, s;
    this.style !== t && ((e = this._style) == null || e.off("change", this._onStyleChange, this), this._style = t, (s = this._style) == null || s.on("change", this._onStyleChange, this), this._onStyleChange());
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
    this._resourceId = xt("resource"), this.emit("change", this), this.emit("unload", this);
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
  resize(t, e, s) {
    s = s || this._resolution, t = t || this.width, e = e || this.height;
    const n = Math.round(t * s), r = Math.round(e * s);
    return this.width = n / s, this.height = r / s, this._resolution = s, this.pixelWidth === n && this.pixelHeight === r ? !1 : (this._refreshPOT(), this.pixelWidth = n, this.pixelHeight = r, this.emit("resize", this), this._resourceId = xt("resource"), this.emit("change", this), !0);
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
    this.isPowerOfTwo = da(this.pixelWidth) && da(this.pixelHeight);
  }
  static test(t) {
    throw new Error("Unimplemented");
  }
};
wh.defaultOptions = {
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
let Be = wh;
class Co extends Be {
  constructor(t) {
    const e = t.resource || new Float32Array(t.width * t.height * 4);
    let s = t.format;
    s || (e instanceof Float32Array ? s = "rgba32float" : e instanceof Int32Array || e instanceof Uint32Array ? s = "rgba32uint" : e instanceof Int16Array || e instanceof Uint16Array ? s = "rgba16uint" : s = "bgra8unorm"), super({
      ...t,
      resource: e,
      format: s
    }), this.uploadMethodId = "buffer";
  }
  static test(t) {
    return t instanceof Int8Array || t instanceof Uint8Array || t instanceof Uint8ClampedArray || t instanceof Int16Array || t instanceof Uint16Array || t instanceof Int32Array || t instanceof Uint32Array || t instanceof Float32Array;
  }
}
Co.extension = z.TextureSource;
const fa = new X();
class Ld {
  /**
   * @param texture - observed texture
   * @param clampMargin - Changes frame clamping, 0.5 by default. Use -0.5 for extra border.
   */
  constructor(t, e) {
    this.mapCoord = new X(), this.uClampFrame = new Float32Array(4), this.uClampOffset = new Float32Array(2), this._textureID = -1, this._updateID = 0, this.clampOffset = 0, typeof e > "u" ? this.clampMargin = t.width < 10 ? 0 : 0.5 : this.clampMargin = e, this.isSimple = !1, this.texture = t;
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
    const s = this.mapCoord;
    for (let n = 0; n < t.length; n += 2) {
      const r = t[n], o = t[n + 1];
      e[n] = r * s.a + o * s.c + s.tx, e[n + 1] = r * s.b + o * s.d + s.ty;
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
    const s = t.orig, n = t.trim;
    n && (fa.set(
      s.width / n.width,
      0,
      0,
      s.height / n.height,
      -n.x / n.width,
      -n.y / n.height
    ), this.mapCoord.append(fa));
    const r = t.source, o = this.uClampFrame, a = this.clampMargin / r._resolution, l = this.clampOffset / r._resolution;
    return o[0] = (t.frame.x + a + l) / r.width, o[1] = (t.frame.y + a + l) / r.height, o[2] = (t.frame.x + t.frame.width - a + l) / r.width, o[3] = (t.frame.y + t.frame.height - a + l) / r.height, this.uClampOffset[0] = this.clampOffset / r.pixelWidth, this.uClampOffset[1] = this.clampOffset / r.pixelHeight, this.isSimple = t.frame.width === r.width && t.frame.height === r.height && t.rotate === 0, !0;
  }
}
class H extends Et {
  /**
   * @param {rendering.TextureOptions} options - Options for the texture
   */
  constructor({
    source: t,
    label: e,
    frame: s,
    orig: n,
    trim: r,
    defaultAnchor: o,
    defaultBorders: a,
    rotate: l,
    dynamic: c
  } = {}) {
    if (super(), this.uid = xt("texture"), this.uvs = { x0: 0, y0: 0, x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0 }, this.frame = new yt(), this.noFrame = !1, this.dynamic = !1, this.isTexture = !0, this.label = e, this.source = (t == null ? void 0 : t.source) ?? new Be(), this.noFrame = !s, s)
      this.frame.copyFrom(s);
    else {
      const { width: h, height: f } = this._source;
      this.frame.width = h, this.frame.height = f;
    }
    this.orig = n || this.frame, this.trim = r, this.rotate = l ?? 0, this.defaultAnchor = o, this.defaultBorders = a, this.destroyed = !1, this.dynamic = c || !1, this.updateUvs();
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
    return this._textureMatrix || (this._textureMatrix = new Ld(this)), this._textureMatrix;
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
    const { uvs: t, frame: e } = this, { width: s, height: n } = this._source, r = e.x / s, o = e.y / n, a = e.width / s, l = e.height / n;
    let c = this.rotate;
    if (c) {
      const h = a / 2, f = l / 2, p = r + h, u = o + f;
      c = it.add(c, it.NW), t.x0 = p + h * it.uX(c), t.y0 = u + f * it.uY(c), c = it.add(c, 2), t.x1 = p + h * it.uX(c), t.y1 = u + f * it.uY(c), c = it.add(c, 2), t.x2 = p + h * it.uX(c), t.y2 = u + f * it.uY(c), c = it.add(c, 2), t.x3 = p + h * it.uX(c), t.y3 = u + f * it.uY(c);
    } else
      t.x0 = r, t.y0 = o, t.x1 = r + a, t.y1 = o, t.x2 = r + a, t.y2 = o + l, t.x3 = r, t.y3 = o + l;
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
    return K(Q, "Texture.baseTexture is now Texture.source"), this._source;
  }
}
H.EMPTY = new H({
  label: "EMPTY",
  source: new Be({
    label: "EMPTY"
  })
});
H.EMPTY.destroy = vh;
H.WHITE = new H({
  source: new Co({
    resource: new Uint8Array([255, 255, 255, 255]),
    width: 1,
    height: 1,
    alphaMode: "premultiply-alpha-on-upload",
    label: "WHITE"
  }),
  label: "WHITE"
});
H.WHITE.destroy = vh;
function zd(i, t, e, s) {
  const { width: n, height: r } = e.orig, o = e.trim;
  if (o) {
    const a = o.width, l = o.height;
    i.minX = o.x - t._x * n - s, i.maxX = i.minX + a, i.minY = o.y - t._y * r - s, i.maxY = i.minY + l;
  } else
    i.minX = -t._x * n - s, i.maxX = i.minX + n, i.minY = -t._y * r - s, i.maxY = i.minY + r;
}
const ma = new X();
class _e {
  constructor(t = 1 / 0, e = 1 / 0, s = -1 / 0, n = -1 / 0) {
    this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0, this.matrix = ma, this.minX = t, this.minY = e, this.maxX = s, this.maxY = n;
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
    this._rectangle || (this._rectangle = new yt());
    const t = this._rectangle;
    return this.minX > this.maxX || this.minY > this.maxY ? (t.x = 0, t.y = 0, t.width = 0, t.height = 0) : t.copyFromBounds(this), t;
  }
  /** Clears the bounds and resets. */
  clear() {
    return this.minX = 1 / 0, this.minY = 1 / 0, this.maxX = -1 / 0, this.maxY = -1 / 0, this.matrix = ma, this;
  }
  /**
   * Sets the bounds.
   * @param x0 - left X of frame
   * @param y0 - top Y of frame
   * @param x1 - right X of frame
   * @param y1 - bottom Y of frame
   */
  set(t, e, s, n) {
    this.minX = t, this.minY = e, this.maxX = s, this.maxY = n;
  }
  /**
   * Adds sprite frame
   * @param x0 - left X of frame
   * @param y0 - top Y of frame
   * @param x1 - right X of frame
   * @param y1 - bottom Y of frame
   * @param matrix
   */
  addFrame(t, e, s, n, r) {
    r || (r = this.matrix);
    const o = r.a, a = r.b, l = r.c, c = r.d, h = r.tx, f = r.ty;
    let p = this.minX, u = this.minY, d = this.maxX, m = this.maxY, g = o * t + l * e + h, y = a * t + c * e + f;
    g < p && (p = g), y < u && (u = y), g > d && (d = g), y > m && (m = y), g = o * s + l * e + h, y = a * s + c * e + f, g < p && (p = g), y < u && (u = y), g > d && (d = g), y > m && (m = y), g = o * t + l * n + h, y = a * t + c * n + f, g < p && (p = g), y < u && (u = y), g > d && (d = g), y > m && (m = y), g = o * s + l * n + h, y = a * s + c * n + f, g < p && (p = g), y < u && (u = y), g > d && (d = g), y > m && (m = y), this.minX = p, this.minY = u, this.maxX = d, this.maxY = m;
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
    const e = this.minX, s = this.minY, n = this.maxX, r = this.maxY, { a: o, b: a, c: l, d: c, tx: h, ty: f } = t;
    let p = o * e + l * s + h, u = a * e + c * s + f;
    this.minX = p, this.minY = u, this.maxX = p, this.maxY = u, p = o * n + l * s + h, u = a * n + c * s + f, this.minX = p < this.minX ? p : this.minX, this.minY = u < this.minY ? u : this.minY, this.maxX = p > this.maxX ? p : this.maxX, this.maxY = u > this.maxY ? u : this.maxY, p = o * e + l * r + h, u = a * e + c * r + f, this.minX = p < this.minX ? p : this.minX, this.minY = u < this.minY ? u : this.minY, this.maxX = p > this.maxX ? p : this.maxX, this.maxY = u > this.maxY ? u : this.maxY, p = o * n + l * r + h, u = a * n + c * r + f, this.minX = p < this.minX ? p : this.minX, this.minY = u < this.minY ? u : this.minY, this.maxX = p > this.maxX ? p : this.maxX, this.maxY = u > this.maxY ? u : this.maxY;
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
  fitBounds(t, e, s, n) {
    return this.minX < t && (this.minX = t), this.maxX > e && (this.maxX = e), this.minY < s && (this.minY = s), this.maxY > n && (this.maxY = n), this;
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
  addVertexData(t, e, s, n) {
    let r = this.minX, o = this.minY, a = this.maxX, l = this.maxY;
    n || (n = this.matrix);
    const c = n.a, h = n.b, f = n.c, p = n.d, u = n.tx, d = n.ty;
    for (let m = e; m < s; m += 2) {
      const g = t[m], y = t[m + 1], v = c * g + f * y + u, _ = h * g + p * y + d;
      r = v < r ? v : r, o = _ < o ? _ : o, a = v > a ? v : a, l = _ > l ? _ : l;
    }
    this.minX = r, this.minY = o, this.maxX = a, this.maxY = l;
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
var Dd = { grad: 0.9, turn: 360, rad: 360 / (2 * Math.PI) }, Ae = function(i) {
  return typeof i == "string" ? i.length > 0 : typeof i == "number";
}, bt = function(i, t, e) {
  return t === void 0 && (t = 0), e === void 0 && (e = Math.pow(10, t)), Math.round(e * i) / e + 0;
}, $t = function(i, t, e) {
  return t === void 0 && (t = 0), e === void 0 && (e = 1), i > e ? e : i > t ? i : t;
}, Sh = function(i) {
  return (i = isFinite(i) ? i % 360 : 0) > 0 ? i : i + 360;
}, ga = function(i) {
  return { r: $t(i.r, 0, 255), g: $t(i.g, 0, 255), b: $t(i.b, 0, 255), a: $t(i.a) };
}, Vr = function(i) {
  return { r: bt(i.r), g: bt(i.g), b: bt(i.b), a: bt(i.a, 3) };
}, Ud = /^#([0-9a-f]{3,8})$/i, Vs = function(i) {
  var t = i.toString(16);
  return t.length < 2 ? "0" + t : t;
}, Ch = function(i) {
  var t = i.r, e = i.g, s = i.b, n = i.a, r = Math.max(t, e, s), o = r - Math.min(t, e, s), a = o ? r === t ? (e - s) / o : r === e ? 2 + (s - t) / o : 4 + (t - e) / o : 0;
  return { h: 60 * (a < 0 ? a + 6 : a), s: r ? o / r * 100 : 0, v: r / 255 * 100, a: n };
}, Ph = function(i) {
  var t = i.h, e = i.s, s = i.v, n = i.a;
  t = t / 360 * 6, e /= 100, s /= 100;
  var r = Math.floor(t), o = s * (1 - e), a = s * (1 - (t - r) * e), l = s * (1 - (1 - t + r) * e), c = r % 6;
  return { r: 255 * [s, a, o, o, l, s][c], g: 255 * [l, s, s, a, o, o][c], b: 255 * [o, o, l, s, s, a][c], a: n };
}, ya = function(i) {
  return { h: Sh(i.h), s: $t(i.s, 0, 100), l: $t(i.l, 0, 100), a: $t(i.a) };
}, xa = function(i) {
  return { h: bt(i.h), s: bt(i.s), l: bt(i.l), a: bt(i.a, 3) };
}, va = function(i) {
  return Ph((e = (t = i).s, { h: t.h, s: (e *= ((s = t.l) < 50 ? s : 100 - s) / 100) > 0 ? 2 * e / (s + e) * 100 : 0, v: s + e, a: t.a }));
  var t, e, s;
}, hs = function(i) {
  return { h: (t = Ch(i)).h, s: (n = (200 - (e = t.s)) * (s = t.v) / 100) > 0 && n < 200 ? e * s / 100 / (n <= 100 ? n : 200 - n) * 100 : 0, l: n / 2, a: t.a };
  var t, e, s, n;
}, Gd = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, Vd = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, Nd = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, Hd = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i, On = { string: [[function(i) {
  var t = Ud.exec(i);
  return t ? (i = t[1]).length <= 4 ? { r: parseInt(i[0] + i[0], 16), g: parseInt(i[1] + i[1], 16), b: parseInt(i[2] + i[2], 16), a: i.length === 4 ? bt(parseInt(i[3] + i[3], 16) / 255, 2) : 1 } : i.length === 6 || i.length === 8 ? { r: parseInt(i.substr(0, 2), 16), g: parseInt(i.substr(2, 2), 16), b: parseInt(i.substr(4, 2), 16), a: i.length === 8 ? bt(parseInt(i.substr(6, 2), 16) / 255, 2) : 1 } : null : null;
}, "hex"], [function(i) {
  var t = Nd.exec(i) || Hd.exec(i);
  return t ? t[2] !== t[4] || t[4] !== t[6] ? null : ga({ r: Number(t[1]) / (t[2] ? 100 / 255 : 1), g: Number(t[3]) / (t[4] ? 100 / 255 : 1), b: Number(t[5]) / (t[6] ? 100 / 255 : 1), a: t[7] === void 0 ? 1 : Number(t[7]) / (t[8] ? 100 : 1) }) : null;
}, "rgb"], [function(i) {
  var t = Gd.exec(i) || Vd.exec(i);
  if (!t) return null;
  var e, s, n = ya({ h: (e = t[1], s = t[2], s === void 0 && (s = "deg"), Number(e) * (Dd[s] || 1)), s: Number(t[3]), l: Number(t[4]), a: t[5] === void 0 ? 1 : Number(t[5]) / (t[6] ? 100 : 1) });
  return va(n);
}, "hsl"]], object: [[function(i) {
  var t = i.r, e = i.g, s = i.b, n = i.a, r = n === void 0 ? 1 : n;
  return Ae(t) && Ae(e) && Ae(s) ? ga({ r: Number(t), g: Number(e), b: Number(s), a: Number(r) }) : null;
}, "rgb"], [function(i) {
  var t = i.h, e = i.s, s = i.l, n = i.a, r = n === void 0 ? 1 : n;
  if (!Ae(t) || !Ae(e) || !Ae(s)) return null;
  var o = ya({ h: Number(t), s: Number(e), l: Number(s), a: Number(r) });
  return va(o);
}, "hsl"], [function(i) {
  var t = i.h, e = i.s, s = i.v, n = i.a, r = n === void 0 ? 1 : n;
  if (!Ae(t) || !Ae(e) || !Ae(s)) return null;
  var o = function(a) {
    return { h: Sh(a.h), s: $t(a.s, 0, 100), v: $t(a.v, 0, 100), a: $t(a.a) };
  }({ h: Number(t), s: Number(e), v: Number(s), a: Number(r) });
  return Ph(o);
}, "hsv"]] }, ba = function(i, t) {
  for (var e = 0; e < t.length; e++) {
    var s = t[e][0](i);
    if (s) return [s, t[e][1]];
  }
  return [null, void 0];
}, jd = function(i) {
  return typeof i == "string" ? ba(i.trim(), On.string) : typeof i == "object" && i !== null ? ba(i, On.object) : [null, void 0];
}, Nr = function(i, t) {
  var e = hs(i);
  return { h: e.h, s: $t(e.s + 100 * t, 0, 100), l: e.l, a: e.a };
}, Hr = function(i) {
  return (299 * i.r + 587 * i.g + 114 * i.b) / 1e3 / 255;
}, _a = function(i, t) {
  var e = hs(i);
  return { h: e.h, s: e.s, l: $t(e.l + 100 * t, 0, 100), a: e.a };
}, Fn = function() {
  function i(t) {
    this.parsed = jd(t)[0], this.rgba = this.parsed || { r: 0, g: 0, b: 0, a: 1 };
  }
  return i.prototype.isValid = function() {
    return this.parsed !== null;
  }, i.prototype.brightness = function() {
    return bt(Hr(this.rgba), 2);
  }, i.prototype.isDark = function() {
    return Hr(this.rgba) < 0.5;
  }, i.prototype.isLight = function() {
    return Hr(this.rgba) >= 0.5;
  }, i.prototype.toHex = function() {
    return t = Vr(this.rgba), e = t.r, s = t.g, n = t.b, o = (r = t.a) < 1 ? Vs(bt(255 * r)) : "", "#" + Vs(e) + Vs(s) + Vs(n) + o;
    var t, e, s, n, r, o;
  }, i.prototype.toRgb = function() {
    return Vr(this.rgba);
  }, i.prototype.toRgbString = function() {
    return t = Vr(this.rgba), e = t.r, s = t.g, n = t.b, (r = t.a) < 1 ? "rgba(" + e + ", " + s + ", " + n + ", " + r + ")" : "rgb(" + e + ", " + s + ", " + n + ")";
    var t, e, s, n, r;
  }, i.prototype.toHsl = function() {
    return xa(hs(this.rgba));
  }, i.prototype.toHslString = function() {
    return t = xa(hs(this.rgba)), e = t.h, s = t.s, n = t.l, (r = t.a) < 1 ? "hsla(" + e + ", " + s + "%, " + n + "%, " + r + ")" : "hsl(" + e + ", " + s + "%, " + n + "%)";
    var t, e, s, n, r;
  }, i.prototype.toHsv = function() {
    return t = Ch(this.rgba), { h: bt(t.h), s: bt(t.s), v: bt(t.v), a: bt(t.a, 3) };
    var t;
  }, i.prototype.invert = function() {
    return ue({ r: 255 - (t = this.rgba).r, g: 255 - t.g, b: 255 - t.b, a: t.a });
    var t;
  }, i.prototype.saturate = function(t) {
    return t === void 0 && (t = 0.1), ue(Nr(this.rgba, t));
  }, i.prototype.desaturate = function(t) {
    return t === void 0 && (t = 0.1), ue(Nr(this.rgba, -t));
  }, i.prototype.grayscale = function() {
    return ue(Nr(this.rgba, -1));
  }, i.prototype.lighten = function(t) {
    return t === void 0 && (t = 0.1), ue(_a(this.rgba, t));
  }, i.prototype.darken = function(t) {
    return t === void 0 && (t = 0.1), ue(_a(this.rgba, -t));
  }, i.prototype.rotate = function(t) {
    return t === void 0 && (t = 15), this.hue(this.hue() + t);
  }, i.prototype.alpha = function(t) {
    return typeof t == "number" ? ue({ r: (e = this.rgba).r, g: e.g, b: e.b, a: t }) : bt(this.rgba.a, 3);
    var e;
  }, i.prototype.hue = function(t) {
    var e = hs(this.rgba);
    return typeof t == "number" ? ue({ h: t, s: e.s, l: e.l, a: e.a }) : bt(e.h);
  }, i.prototype.isEqual = function(t) {
    return this.toHex() === ue(t).toHex();
  }, i;
}(), ue = function(i) {
  return i instanceof Fn ? i : new Fn(i);
}, wa = [], Yd = function(i) {
  i.forEach(function(t) {
    wa.indexOf(t) < 0 && (t(Fn, On), wa.push(t));
  });
};
function Wd(i, t) {
  var e = { white: "#ffffff", bisque: "#ffe4c4", blue: "#0000ff", cadetblue: "#5f9ea0", chartreuse: "#7fff00", chocolate: "#d2691e", coral: "#ff7f50", antiquewhite: "#faebd7", aqua: "#00ffff", azure: "#f0ffff", whitesmoke: "#f5f5f5", papayawhip: "#ffefd5", plum: "#dda0dd", blanchedalmond: "#ffebcd", black: "#000000", gold: "#ffd700", goldenrod: "#daa520", gainsboro: "#dcdcdc", cornsilk: "#fff8dc", cornflowerblue: "#6495ed", burlywood: "#deb887", aquamarine: "#7fffd4", beige: "#f5f5dc", crimson: "#dc143c", cyan: "#00ffff", darkblue: "#00008b", darkcyan: "#008b8b", darkgoldenrod: "#b8860b", darkkhaki: "#bdb76b", darkgray: "#a9a9a9", darkgreen: "#006400", darkgrey: "#a9a9a9", peachpuff: "#ffdab9", darkmagenta: "#8b008b", darkred: "#8b0000", darkorchid: "#9932cc", darkorange: "#ff8c00", darkslateblue: "#483d8b", gray: "#808080", darkslategray: "#2f4f4f", darkslategrey: "#2f4f4f", deeppink: "#ff1493", deepskyblue: "#00bfff", wheat: "#f5deb3", firebrick: "#b22222", floralwhite: "#fffaf0", ghostwhite: "#f8f8ff", darkviolet: "#9400d3", magenta: "#ff00ff", green: "#008000", dodgerblue: "#1e90ff", grey: "#808080", honeydew: "#f0fff0", hotpink: "#ff69b4", blueviolet: "#8a2be2", forestgreen: "#228b22", lawngreen: "#7cfc00", indianred: "#cd5c5c", indigo: "#4b0082", fuchsia: "#ff00ff", brown: "#a52a2a", maroon: "#800000", mediumblue: "#0000cd", lightcoral: "#f08080", darkturquoise: "#00ced1", lightcyan: "#e0ffff", ivory: "#fffff0", lightyellow: "#ffffe0", lightsalmon: "#ffa07a", lightseagreen: "#20b2aa", linen: "#faf0e6", mediumaquamarine: "#66cdaa", lemonchiffon: "#fffacd", lime: "#00ff00", khaki: "#f0e68c", mediumseagreen: "#3cb371", limegreen: "#32cd32", mediumspringgreen: "#00fa9a", lightskyblue: "#87cefa", lightblue: "#add8e6", midnightblue: "#191970", lightpink: "#ffb6c1", mistyrose: "#ffe4e1", moccasin: "#ffe4b5", mintcream: "#f5fffa", lightslategray: "#778899", lightslategrey: "#778899", navajowhite: "#ffdead", navy: "#000080", mediumvioletred: "#c71585", powderblue: "#b0e0e6", palegoldenrod: "#eee8aa", oldlace: "#fdf5e6", paleturquoise: "#afeeee", mediumturquoise: "#48d1cc", mediumorchid: "#ba55d3", rebeccapurple: "#663399", lightsteelblue: "#b0c4de", mediumslateblue: "#7b68ee", thistle: "#d8bfd8", tan: "#d2b48c", orchid: "#da70d6", mediumpurple: "#9370db", purple: "#800080", pink: "#ffc0cb", skyblue: "#87ceeb", springgreen: "#00ff7f", palegreen: "#98fb98", red: "#ff0000", yellow: "#ffff00", slateblue: "#6a5acd", lavenderblush: "#fff0f5", peru: "#cd853f", palevioletred: "#db7093", violet: "#ee82ee", teal: "#008080", slategray: "#708090", slategrey: "#708090", aliceblue: "#f0f8ff", darkseagreen: "#8fbc8f", darkolivegreen: "#556b2f", greenyellow: "#adff2f", seagreen: "#2e8b57", seashell: "#fff5ee", tomato: "#ff6347", silver: "#c0c0c0", sienna: "#a0522d", lavender: "#e6e6fa", lightgreen: "#90ee90", orange: "#ffa500", orangered: "#ff4500", steelblue: "#4682b4", royalblue: "#4169e1", turquoise: "#40e0d0", yellowgreen: "#9acd32", salmon: "#fa8072", saddlebrown: "#8b4513", sandybrown: "#f4a460", rosybrown: "#bc8f8f", darksalmon: "#e9967a", lightgoldenrodyellow: "#fafad2", snow: "#fffafa", lightgrey: "#d3d3d3", lightgray: "#d3d3d3", dimgray: "#696969", dimgrey: "#696969", olivedrab: "#6b8e23", olive: "#808000" }, s = {};
  for (var n in e) s[e[n]] = n;
  var r = {};
  i.prototype.toName = function(o) {
    if (!(this.rgba.a || this.rgba.r || this.rgba.g || this.rgba.b)) return "transparent";
    var a, l, c = s[this.toHex()];
    if (c) return c;
    if (o != null && o.closest) {
      var h = this.toRgb(), f = 1 / 0, p = "black";
      if (!r.length) for (var u in e) r[u] = new i(e[u]).toRgb();
      for (var d in e) {
        var m = (a = h, l = r[d], Math.pow(a.r - l.r, 2) + Math.pow(a.g - l.g, 2) + Math.pow(a.b - l.b, 2));
        m < f && (f = m, p = d);
      }
      return p;
    }
  }, t.string.push([function(o) {
    var a = o.toLowerCase(), l = a === "transparent" ? "#0000" : e[a];
    return l ? new i(l).toRgb() : null;
  }, "name"]);
}
Yd([Wd]);
const Ii = class es {
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
    if (t instanceof es)
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
    const s = typeof t;
    if (s !== typeof e)
      return !1;
    if (s === "number" || s === "string" || t instanceof Number)
      return t === e;
    if (Array.isArray(t) && Array.isArray(e) || ArrayBuffer.isView(t) && ArrayBuffer.isView(e))
      return t.length !== e.length ? !1 : t.every((n, r) => n === e[r]);
    if (t !== null && e !== null) {
      const n = Object.keys(t), r = Object.keys(e);
      return n.length !== r.length ? !1 : n.every((o) => t[o] === e[o]);
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
    const [t, e, s, n] = this._components;
    return { r: t, g: e, b: s, a: n };
  }
  /**
   * Convert to a RGB color object.
   * @example
   * import { Color } from 'pixi.js';
   * new Color('white').toRgb(); // returns { r: 1, g: 1, b: 1 }
   */
  toRgb() {
    const [t, e, s] = this._components;
    return { r: t, g: e, b: s };
  }
  /** Convert to a CSS-style rgba string: `rgba(255,255,255,1.0)`. */
  toRgbaString() {
    const [t, e, s] = this.toUint8RgbArray();
    return `rgba(${t},${e},${s},${this.alpha})`;
  }
  toUint8RgbArray(t) {
    const [e, s, n] = this._components;
    return this._arrayRgb || (this._arrayRgb = []), t = t || this._arrayRgb, t[0] = Math.round(e * 255), t[1] = Math.round(s * 255), t[2] = Math.round(n * 255), t;
  }
  toArray(t) {
    this._arrayRgba || (this._arrayRgba = []), t = t || this._arrayRgba;
    const [e, s, n, r] = this._components;
    return t[0] = e, t[1] = s, t[2] = n, t[3] = r, t;
  }
  toRgbArray(t) {
    this._arrayRgb || (this._arrayRgb = []), t = t || this._arrayRgb;
    const [e, s, n] = this._components;
    return t[0] = e, t[1] = s, t[2] = n, t;
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
    const [t, e, s] = this.toUint8RgbArray();
    return (s << 16) + (e << 8) + t;
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
    const [e, s, n, r] = es._temp.setValue(t)._components;
    return this._components[0] *= e, this._components[1] *= s, this._components[2] *= n, this._components[3] *= r, this._refreshInt(), this._value = null, this;
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
    let s = this._int >> 16 & 255, n = this._int >> 8 & 255, r = this._int & 255;
    return e && (s = s * t + 0.5 | 0, n = n * t + 0.5 | 0, r = r * t + 0.5 | 0), (t * 255 << 24) + (s << 16) + (n << 8) + r;
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
    let e, s, n, r;
    if ((typeof t == "number" || t instanceof Number) && t >= 0 && t <= 16777215) {
      const o = t;
      e = (o >> 16 & 255) / 255, s = (o >> 8 & 255) / 255, n = (o & 255) / 255, r = 1;
    } else if ((Array.isArray(t) || t instanceof Float32Array) && t.length >= 3 && t.length <= 4)
      t = this._clamp(t), [e, s, n, r = 1] = t;
    else if ((t instanceof Uint8Array || t instanceof Uint8ClampedArray) && t.length >= 3 && t.length <= 4)
      t = this._clamp(t, 0, 255), [e, s, n, r = 255] = t, e /= 255, s /= 255, n /= 255, r /= 255;
    else if (typeof t == "string" || typeof t == "object") {
      if (typeof t == "string") {
        const a = es.HEX_PATTERN.exec(t);
        a && (t = `#${a[2]}`);
      }
      const o = ue(t);
      o.isValid() && ({ r: e, g: s, b: n, a: r } = o.rgba, e /= 255, s /= 255, n /= 255);
    }
    if (e !== void 0)
      this._components[0] = e, this._components[1] = s, this._components[2] = n, this._components[3] = r, this._refreshInt();
    else
      throw new Error(`Unable to convert color ${t}`);
  }
  /** Refresh the internal color rgb number */
  _refreshInt() {
    this._clamp(this._components);
    const [t, e, s] = this._components;
    this._int = (t * 255 << 16) + (e * 255 << 8) + (s * 255 | 0);
  }
  /**
   * Clamps values to a range. Will override original values
   * @param value - Value(s) to clamp
   * @param min - Minimum value
   * @param max - Maximum value
   */
  _clamp(t, e = 0, s = 1) {
    return typeof t == "number" ? Math.min(Math.max(t, e), s) : (t.forEach((n, r) => {
      t[r] = Math.min(Math.max(n, e), s);
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
    return typeof t == "number" || typeof t == "string" || t instanceof Number || t instanceof es || Array.isArray(t) || t instanceof Uint8Array || t instanceof Uint8ClampedArray || t instanceof Float32Array || t.r !== void 0 && t.g !== void 0 && t.b !== void 0 || t.r !== void 0 && t.g !== void 0 && t.b !== void 0 && t.a !== void 0 || t.h !== void 0 && t.s !== void 0 && t.l !== void 0 || t.h !== void 0 && t.s !== void 0 && t.l !== void 0 && t.a !== void 0 || t.h !== void 0 && t.s !== void 0 && t.v !== void 0 || t.h !== void 0 && t.s !== void 0 && t.v !== void 0 && t.a !== void 0;
  }
};
Ii.shared = new Ii();
Ii._temp = new Ii();
Ii.HEX_PATTERN = /^(#|0x)?(([a-f0-9]{3}){1,2}([a-f0-9]{2})?)$/i;
let ft = Ii;
const Xd = {
  cullArea: null,
  cullable: !1,
  cullableChildren: !0
};
class Po {
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
    let s;
    return this._index > 0 ? s = this._pool[--this._index] : s = new this._classType(), (e = s.init) == null || e.call(s, t), s;
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
class qd {
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
    return this._poolsByClass.has(t) || this._poolsByClass.set(t, new Po(t)), this._poolsByClass.get(t);
  }
  /** gets the usage stats of each pool in the system */
  stats() {
    const t = {};
    return this._poolsByClass.forEach((e) => {
      const s = t[e._classType.name] ? e._classType.name + e._classType.ID : e._classType.name;
      t[s] = {
        free: e.totalFree,
        used: e.totalUsed,
        size: e.totalSize
      };
    }), t;
  }
}
const Me = new qd();
function Kd(i, t, e) {
  const s = i.length;
  let n;
  if (t >= s || e === 0)
    return;
  e = t + e > s ? s - t : e;
  const r = s - e;
  for (n = t; n < r; ++n)
    i[n] = i[n + e];
  i.length = r;
}
const Qd = {
  allowChildren: !0,
  /**
   * Removes all children from this container that are within the begin and end indexes.
   * @param beginIndex - The beginning position.
   * @param endIndex - The ending position. Default value is size of the container.
   * @returns - List of removed children
   * @memberof scene.Container#
   */
  removeChildren(i = 0, t) {
    const e = t ?? this.children.length, s = e - i, n = [];
    if (s > 0 && s <= e) {
      for (let o = e - 1; o >= i; o--) {
        const a = this.children[o];
        a && (n.push(a), a.parent = null);
      }
      Kd(this.children, i, e);
      const r = this.renderGroup || this.parentRenderGroup;
      r && r.removeChildren(n);
      for (let o = 0; o < n.length; ++o)
        this.emit("childRemoved", n[o], this, o), n[o].emit("removed", this);
      return n;
    } else if (s === 0 && this.children.length === 0)
      return n;
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
    this.allowChildren || K(Q, "addChildAt: Only Containers will be allowed to add children in v8.0.0");
    const { children: e } = this;
    if (t < 0 || t > e.length)
      throw new Error(`${i}addChildAt: The index ${t} supplied is out of bounds ${e.length}`);
    if (i.parent) {
      const n = i.parent.children.indexOf(i);
      if (i.parent === this && n === t)
        return i;
      n !== -1 && i.parent.children.splice(n, 1);
    }
    t === e.length ? e.push(i) : e.splice(t, 0, i), i.parent = this, i.didChange = !0, i._updateFlags = 15;
    const s = this.renderGroup || this.parentRenderGroup;
    return s && s.addChild(i), this.sortableChildren && (this.sortDirty = !0), this.emit("childAdded", i, this, t), i.emit("added", this), i;
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
    const e = this.getChildIndex(i), s = this.getChildIndex(t);
    this.children[e] = t, this.children[s] = i;
    const n = this.renderGroup || this.parentRenderGroup;
    n && (n.structureDidChange = !0), this._didContainerChangeTick++;
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
    const s = this.worldTransform.clone();
    return s.invert(), e.prepend(s), i.setFromMatrix(e), i;
  }
};
class Aa {
  constructor() {
    this.pipe = "filter", this.priority = 1;
  }
  destroy() {
    for (let t = 0; t < this.filters.length; t++)
      this.filters[t].destroy();
    this.filters = null, this.filterArea = null;
  }
}
class Zd {
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
      const s = this._tests[e];
      if (s.test(t))
        return Me.get(s.maskClass, t);
    }
    return t;
  }
  returnMaskEffect(t) {
    Me.return(t);
  }
}
const Ln = new Zd();
kt.handleByList(z.MaskEffect, Ln._effectClasses);
const Jd = {
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
    this.effects.push(i), this.effects.sort((e, s) => e.priority - s.priority);
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
    (t == null ? void 0 : t.mask) !== i && (t && (this.removeEffect(t), Ln.returnMaskEffect(t), this._maskEffect = null), i != null && (this._maskEffect = Ln.getMaskEffect(i), this.addEffect(this._maskEffect)));
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
    const e = this._filterEffect || (this._filterEffect = new Aa());
    i = i;
    const s = (i == null ? void 0 : i.length) > 0, n = ((t = e.filters) == null ? void 0 : t.length) > 0, r = s !== n;
    i = Array.isArray(i) ? i.slice(0) : i, e.filters = Object.freeze(i), r && (s ? this.addEffect(e) : (this.removeEffect(e), e.filters = i ?? null));
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
    this._filterEffect || (this._filterEffect = new Aa()), this._filterEffect.filterArea = i;
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
}, $d = {
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
    return K(Q, "Container.name property has been removed, use Container.label instead"), this.label;
  },
  set name(i) {
    K(Q, "Container.name property has been removed, use Container.label instead"), this.label = i;
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
    for (let s = 0; s < e.length; s++) {
      const n = e[s];
      if (n.label === i || i instanceof RegExp && i.test(n.label))
        return n;
    }
    if (t)
      for (let s = 0; s < e.length; s++) {
        const n = e[s].getChildByLabel(i, !0);
        if (n)
          return n;
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
    const s = this.children;
    for (let n = 0; n < s.length; n++) {
      const r = s[n];
      (r.label === i || i instanceof RegExp && i.test(r.label)) && e.push(r);
    }
    if (t)
      for (let n = 0; n < s.length; n++)
        s[n].getChildrenByLabel(i, !0, e);
    return e;
  }
}, Te = new Po(X), Oi = new Po(_e);
function Mh(i, t, e) {
  e.clear();
  let s, n;
  return i.parent ? t ? s = i.parent.worldTransform : (n = Te.get().identity(), s = cr(i, n)) : s = X.IDENTITY, Th(i, e, s, t), n && Te.return(n), e.isValid || e.set(0, 0, 0, 0), e;
}
function Th(i, t, e, s) {
  var n, r;
  if (!i.visible || !i.measurable)
    return;
  let o;
  s ? o = i.worldTransform : (i.updateLocalTransform(), o = Te.get(), o.appendFrom(i.localTransform, e));
  const a = t, l = !!i.effects.length;
  if (l && (t = Oi.get().clear()), i.boundsArea)
    t.addRect(i.boundsArea, o);
  else {
    i.addBounds && (t.matrix = o, i.addBounds(t));
    for (let c = 0; c < i.children.length; c++)
      Th(i.children[c], t, o, s);
  }
  if (l) {
    for (let c = 0; c < i.effects.length; c++)
      (r = (n = i.effects[c]).addBounds) == null || r.call(n, t);
    a.addBounds(t, X.IDENTITY), Oi.return(t);
  }
  s || Te.return(o);
}
function cr(i, t) {
  const e = i.parent;
  return e && (cr(e, t), e.updateLocalTransform(), t.append(e.localTransform)), t;
}
let jr = 0;
const Sa = 500;
function dt(...i) {
  jr !== Sa && (jr++, jr === Sa ? console.warn("PixiJS Warning: too many warnings, no more warnings will be reported to the console by PixiJS.") : console.warn("PixiJS Warning: ", ...i));
}
function kh(i, t, e) {
  return t.clear(), e || (e = X.IDENTITY), Eh(i, t, e, i, !0), t.isValid || t.set(0, 0, 0, 0), t;
}
function Eh(i, t, e, s, n) {
  var r, o;
  let a;
  if (n)
    a = Te.get(), a = e.copyTo(a);
  else {
    if (!i.visible || !i.measurable)
      return;
    i.updateLocalTransform();
    const h = i.localTransform;
    a = Te.get(), a.appendFrom(h, e);
  }
  const l = t, c = !!i.effects.length;
  if (c && (t = Oi.get().clear()), i.boundsArea)
    t.addRect(i.boundsArea, a);
  else {
    i.renderPipeId && (t.matrix = a, i.addBounds(t));
    const h = i.children;
    for (let f = 0; f < h.length; f++)
      Eh(h[f], t, a, s, !1);
  }
  if (c) {
    for (let h = 0; h < i.effects.length; h++)
      (o = (r = i.effects[h]).addLocalBounds) == null || o.call(r, t, s);
    l.addBounds(t, X.IDENTITY), Oi.return(t);
  }
  Te.return(a);
}
function Bh(i, t) {
  const e = i.children;
  for (let s = 0; s < e.length; s++) {
    const n = e[s], r = n.uid, o = (n._didViewChangeTick & 65535) << 16 | n._didContainerChangeTick & 65535, a = t.index;
    (t.data[a] !== r || t.data[a + 1] !== o) && (t.data[t.index] = r, t.data[t.index + 1] = o, t.didChange = !0), t.index = a + 2, n.children.length && Bh(n, t);
  }
  return t.didChange;
}
const tp = new X(), ep = {
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
    return i.index = 1, i.didChange = !1, i.data[0] !== this._didViewChangeTick && (i.didChange = !0, i.data[0] = this._didViewChangeTick), Bh(this, i), i.didChange && kh(this, i.localBounds, tp), i.localBounds;
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
    return Mh(this, i, t || new _e());
  }
}, ip = {
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
}, sp = {
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
    this.sortDirty && (this.sortDirty = !1, this.children.sort(rp));
  }
};
function rp(i, t) {
  return i._zIndex - t._zIndex;
}
const np = {
  /**
   * Returns the global position of the container.
   * @param point - The optional point to write the global value to.
   * @param skipUpdate - Should we skip the update transform.
   * @returns - The updated point.
   * @memberof scene.Container#
   */
  getGlobalPosition(i = new Pt(), t = !1) {
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
      const s = cr(this, new X());
      return s.append(this.localTransform), s.apply(i, t);
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
  toLocal(i, t, e, s) {
    if (t && (i = t.toGlobal(i, e, s)), !s) {
      this.updateLocalTransform();
      const n = cr(this, new X());
      return n.append(this.localTransform), n.applyInverse(i, e);
    }
    return this.worldTransform.applyInverse(i, e);
  }
};
let op = 0;
class Rh {
  constructor() {
    this.uid = xt("instructionSet"), this.instructions = [], this.instructionSize = 0, this.renderables = [], this.tick = 0;
  }
  /** reset the instruction set so it can be reused set size back to 0 */
  reset() {
    this.instructionSize = 0, this.tick = op++;
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
class ap {
  constructor() {
    this.renderPipeId = "renderGroup", this.root = null, this.canBundle = !1, this.renderGroupParent = null, this.renderGroupChildren = [], this.worldTransform = new X(), this.worldColorAlpha = 4294967295, this.worldColor = 16777215, this.worldAlpha = 1, this.childrenToUpdate = /* @__PURE__ */ Object.create(null), this.updateTick = 0, this.childrenRenderablesToUpdate = { list: [], index: 0 }, this.structureDidChange = !0, this.instructionSet = new Rh(), this._onRenderContainers = [];
  }
  init(t) {
    this.root = t, t._onRender && this.addOnRender(t), t.didChange = !0;
    const e = t.children;
    for (let s = 0; s < e.length; s++)
      this.addChild(e[s]);
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
    for (let s = 0; s < e.length; s++)
      this.addChild(e[s]);
  }
  removeChild(t) {
    if (this.structureDidChange = !0, t._onRender && (t.renderGroup || this.removeOnRender(t)), t.parentRenderGroup = null, t.renderGroup) {
      this._removeRenderGroupChild(t.renderGroup);
      return;
    }
    const e = t.children;
    for (let s = 0; s < e.length; s++)
      this.removeChild(e[s]);
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
    for (let s = 0; s < e.length; s++)
      this._getChildren(e[s], t);
    return t;
  }
  _getChildren(t, e = []) {
    if (e.push(t), t.renderGroup)
      return e;
    const s = t.children;
    for (let n = 0; n < s.length; n++)
      this._getChildren(s[n], e);
    return e;
  }
}
function lp(i, t, e = {}) {
  for (const s in t)
    !e[s] && t[s] !== void 0 && (i[s] = t[s]);
}
const Yr = new gt(null), Wr = new gt(null), Xr = new gt(null, 1, 1), Ca = 1, hp = 2, qr = 4;
class It extends Et {
  constructor(t = {}) {
    var e, s;
    super(), this.uid = xt("renderable"), this._updateFlags = 15, this.renderGroup = null, this.parentRenderGroup = null, this.parentRenderGroupIndex = 0, this.didChange = !1, this.didViewUpdate = !1, this.relativeRenderGroupDepth = 0, this.children = [], this.parent = null, this.includeInBuild = !0, this.measurable = !0, this.isSimple = !0, this.updateTick = -1, this.localTransform = new X(), this.relativeGroupTransform = new X(), this.groupTransform = this.relativeGroupTransform, this.destroyed = !1, this._position = new gt(this, 0, 0), this._scale = Xr, this._pivot = Wr, this._skew = Yr, this._cx = 1, this._sx = 0, this._cy = 0, this._sy = 1, this._rotation = 0, this.localColor = 16777215, this.localAlpha = 1, this.groupAlpha = 1, this.groupColor = 16777215, this.groupColorAlpha = 4294967295, this.localBlendMode = "inherit", this.groupBlendMode = "normal", this.localDisplayStatus = 7, this.globalDisplayStatus = 7, this._didContainerChangeTick = 0, this._didViewChangeTick = 0, this._didLocalTransformChangeId = -1, this.effects = [], lp(this, t, {
      children: !0,
      parent: !0,
      effects: !0
    }), (e = t.children) == null || e.forEach((n) => this.addChild(n)), (s = t.parent) == null || s.addChild(this);
  }
  /**
   * Mixes all enumerable properties and methods from a source object to Container.
   * @param source - The source of properties and methods to mix in.
   */
  static mixin(t) {
    Object.defineProperties(It.prototype, Object.getOwnPropertyDescriptors(t));
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
    if (this.allowChildren || K(Q, "addChild: Only Containers will be allowed to add children in v8.0.0"), t.length > 1) {
      for (let n = 0; n < t.length; n++)
        this.addChild(t[n]);
      return t[0];
    }
    const e = t[0];
    if (e.parent === this)
      return this.children.splice(this.children.indexOf(e), 1), this.children.push(e), this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), e;
    e.parent && e.parent.removeChild(e), this.children.push(e), this.sortableChildren && (this.sortDirty = !0), e.parent = this, e.didChange = !0, e._updateFlags = 15;
    const s = this.renderGroup || this.parentRenderGroup;
    return s && s.addChild(e), this.emit("childAdded", e, this, this.children.length - 1), e.emit("added", this), this._didViewChangeTick++, e._zIndex !== 0 && e.depthOfChildModified(), e;
  }
  /**
   * Removes one or more children from the container.
   * @param {...Container} children - The Container(s) to remove
   * @returns {Container} The first child that was removed.
   */
  removeChild(...t) {
    if (t.length > 1) {
      for (let n = 0; n < t.length; n++)
        this.removeChild(t[n]);
      return t[0];
    }
    const e = t[0], s = this.children.indexOf(e);
    return s > -1 && (this._didViewChangeTick++, this.children.splice(s, 1), this.renderGroup ? this.renderGroup.removeChild(e) : this.parentRenderGroup && this.parentRenderGroup.removeChild(e), e.parent = null, this.emit("childRemoved", e, this, s), e.emit("removed", this)), e;
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
    t == null || t.removeChild(this), this.renderGroup = Me.get(ap, this), this.groupTransform = X.IDENTITY, t == null || t.addChild(this), this._updateIsSimple();
  }
  /** This will disable the render group for this container. */
  disableRenderGroup() {
    if (!this.renderGroup)
      return;
    const t = this.parentRenderGroup;
    t == null || t.removeChild(this), Me.return(this.renderGroup), this.renderGroup = null, this.groupTransform = this.relativeGroupTransform, t == null || t.addChild(this), this._updateIsSimple();
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
    return this._worldTransform || (this._worldTransform = new X()), this.renderGroup ? this._worldTransform.copyFrom(this.renderGroup.worldTransform) : this.parentRenderGroup && this._worldTransform.appendFrom(this.relativeGroupTransform, this.parentRenderGroup.worldTransform), this._worldTransform;
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
    return this.rotation * Md;
  }
  set angle(t) {
    this.rotation = t * Td;
  }
  /**
   * The center of rotation, scaling, and skewing for this display object in its local space. The `position`
   * is the projection of `pivot` in the parent's local space.
   *
   * By default, the pivot is the origin (0, 0).
   * @since 4.0.0
   */
  get pivot() {
    return this._pivot === Wr && (this._pivot = new gt(this, 0, 0)), this._pivot;
  }
  set pivot(t) {
    this._pivot === Wr && (this._pivot = new gt(this, 0, 0)), typeof t == "number" ? this._pivot.set(t) : this._pivot.copyFrom(t);
  }
  /**
   * The skew factor for the object in radians.
   * @since 4.0.0
   */
  get skew() {
    return this._skew === Yr && (this._skew = new gt(this, 0, 0)), this._skew;
  }
  set skew(t) {
    this._skew === Yr && (this._skew = new gt(this, 0, 0)), this._skew.copyFrom(t);
  }
  /**
   * The scale factors of this object along the local coordinate axes.
   *
   * The default scale is (1, 1).
   * @since 4.0.0
   */
  get scale() {
    return this._scale === Xr && (this._scale = new gt(this, 1, 1)), this._scale;
  }
  set scale(t) {
    this._scale === Xr && (this._scale = new gt(this, 0, 0)), typeof t == "number" ? this._scale.set(t) : this._scale.copyFrom(t);
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
    const s = this.getLocalBounds();
    typeof t == "object" ? (e = t.height ?? t.width, t = t.width) : e ?? (e = t), t !== void 0 && this._setWidth(t, s.width), e !== void 0 && this._setHeight(e, s.height);
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
    const e = this.localTransform, s = this._scale, n = this._pivot, r = this._position, o = s._x, a = s._y, l = n._x, c = n._y;
    e.a = this._cx * o, e.b = this._sx * o, e.c = this._cy * a, e.d = this._sy * a, e.tx = r._x - (l * e.a + c * e.c), e.ty = r._y - (l * e.b + c * e.d);
  }
  // / ///// color related stuff
  set alpha(t) {
    t !== this.localAlpha && (this.localAlpha = t, this._updateFlags |= Ca, this._onUpdate());
  }
  /** The opacity of the object. */
  get alpha() {
    return this.localAlpha;
  }
  set tint(t) {
    const e = ft.shared.setValue(t ?? 16777215).toBgrNumber();
    e !== this.localColor && (this.localColor = e, this._updateFlags |= Ca, this._onUpdate());
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
    this.localBlendMode !== t && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= hp, this.localBlendMode = t, this._onUpdate());
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
    (this.localDisplayStatus & 2) !== e && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= qr, this.localDisplayStatus ^= 2, this._onUpdate());
  }
  /** @ignore */
  get culled() {
    return !(this.localDisplayStatus & 4);
  }
  /** @ignore */
  set culled(t) {
    const e = t ? 0 : 4;
    (this.localDisplayStatus & 4) !== e && (this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._updateFlags |= qr, this.localDisplayStatus ^= 4, this._onUpdate());
  }
  /** Can this object be rendered, if false the object will not be drawn but the transform will still be updated. */
  get renderable() {
    return !!(this.localDisplayStatus & 1);
  }
  set renderable(t) {
    const e = t ? 1 : 0;
    (this.localDisplayStatus & 1) !== e && (this._updateFlags |= qr, this.localDisplayStatus ^= 1, this.parentRenderGroup && (this.parentRenderGroup.structureDidChange = !0), this._onUpdate());
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
    let s;
    if (this.children.length && (s = this.removeChildren(0, this.children.length)), this.removeFromParent(), this.parent = null, this._maskEffect = null, this._filterEffect = null, this.effects = null, this._position = null, this._scale = null, this._pivot = null, this._skew = null, this.emit("destroyed", this), this.removeAllListeners(), (typeof t == "boolean" ? t : t == null ? void 0 : t.children) && s)
      for (let n = 0; n < s.length; ++n)
        s[n].destroy(t);
    (e = this.renderGroup) == null || e.destroy(), this.renderGroup = null;
  }
}
It.mixin(Qd);
It.mixin(np);
It.mixin(ip);
It.mixin(ep);
It.mixin(Jd);
It.mixin($d);
It.mixin(sp);
It.mixin(Xd);
class wr extends It {
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
    const e = this.bounds, { x: s, y: n } = t;
    return s >= e.minX && s <= e.maxX && n >= e.minY && n <= e.maxY;
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
class Fi extends wr {
  /**
   * @param options - The options for creating the sprite.
   */
  constructor(t = H.EMPTY) {
    t instanceof H && (t = { texture: t });
    const { texture: e = H.EMPTY, anchor: s, roundPixels: n, width: r, height: o, ...a } = t;
    super({
      label: "Sprite",
      ...a
    }), this.renderPipeId = "sprite", this.batched = !0, this._sourceBounds = { minX: 0, maxX: 1, minY: 0, maxY: 0 }, this._sourceBoundsDirty = !0, this._anchor = new gt(
      {
        _onUpdate: () => {
          this.onViewUpdate();
        }
      }
    ), s ? this.anchor = s : e.defaultAnchor && (this.anchor = e.defaultAnchor), this.texture = e, this.allowChildren = !1, this.roundPixels = n ?? !1, r !== void 0 && (this.width = r), o !== void 0 && (this.height = o);
  }
  /**
   * Helper function that creates a new sprite based on the source you provide.
   * The source can be - frame id, image, video, canvas element, video element, texture
   * @param source - Source to create texture from
   * @param [skipCache] - Whether to skip the cache or not
   * @returns The newly created sprite
   */
  static from(t, e = !1) {
    return t instanceof H ? new Fi(t) : new Fi(H.from(t, e));
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
    zd(this._bounds, this._anchor, this._texture, 0);
  }
  _updateSourceBounds() {
    const t = this._anchor, e = this._texture, s = this._sourceBounds, { width: n, height: r } = e.orig;
    s.maxX = -t._x * n, s.minX = s.maxX + n, s.maxY = -t._y * r, s.minY = s.maxY + r;
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
const cp = new _e();
function Ih(i, t, e) {
  const s = cp;
  i.measurable = !0, Mh(i, e, s), t.addBoundsMask(s), i.measurable = !1;
}
function Oh(i, t, e) {
  const s = Oi.get();
  i.measurable = !0;
  const n = Te.get().identity(), r = Fh(i, e, n);
  kh(i, s, r), i.measurable = !1, t.addBoundsMask(s), Te.return(n), Oi.return(s);
}
function Fh(i, t, e) {
  return i ? (i !== t && (Fh(i.parent, t, e), i.updateLocalTransform(), e.append(i.localTransform)), e) : (dt("Mask bounds, renderable is not inside the root container"), e);
}
class Lh {
  constructor(t) {
    this.priority = 0, this.inverse = !1, this.pipe = "alphaMask", t != null && t.mask && this.init(t.mask);
  }
  init(t) {
    this.mask = t, this.renderMaskToTexture = !(t instanceof Fi), this.mask.renderable = this.renderMaskToTexture, this.mask.includeInBuild = !this.renderMaskToTexture, this.mask.measurable = !1;
  }
  reset() {
    this.mask.measurable = !0, this.mask = null;
  }
  addBounds(t, e) {
    this.inverse || Ih(this.mask, t, e);
  }
  addLocalBounds(t, e) {
    Oh(this.mask, t, e);
  }
  containsPoint(t, e) {
    const s = this.mask;
    return e(s, t);
  }
  destroy() {
    this.reset();
  }
  static test(t) {
    return t instanceof Fi;
  }
}
Lh.extension = z.MaskEffect;
class zh {
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
zh.extension = z.MaskEffect;
class Dh {
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
    Ih(this.mask, t, e);
  }
  addLocalBounds(t, e) {
    Oh(this.mask, t, e);
  }
  containsPoint(t, e) {
    const s = this.mask;
    return e(s, t);
  }
  destroy() {
    this.reset();
  }
  static test(t) {
    return t instanceof It;
  }
}
Dh.extension = z.MaskEffect;
const up = {
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
let Pa = up;
const at = {
  /**
   * Returns the current adapter.
   * @returns {environment.Adapter} The current adapter.
   */
  get() {
    return Pa;
  },
  /**
   * Sets the current adapter.
   * @param adapter - The new adapter.
   */
  set(i) {
    Pa = i;
  }
};
class Uh extends Be {
  constructor(t) {
    t.resource || (t.resource = at.get().createCanvas()), t.width || (t.width = t.resource.width, t.autoDensity || (t.width /= t.resolution)), t.height || (t.height = t.resource.height, t.autoDensity || (t.height /= t.resolution)), super(t), this.uploadMethodId = "image", this.autoDensity = t.autoDensity;
    const e = t.resource;
    (this.pixelWidth !== e.width || this.pixelWidth !== e.height) && this.resizeCanvas(), this.transparent = !!t.transparent;
  }
  resizeCanvas() {
    this.autoDensity && (this.resource.style.width = `${this.width}px`, this.resource.style.height = `${this.height}px`), (this.resource.width !== this.pixelWidth || this.resource.height !== this.pixelHeight) && (this.resource.width = this.pixelWidth, this.resource.height = this.pixelHeight);
  }
  resize(t = this.width, e = this.height, s = this._resolution) {
    const n = super.resize(t, e, s);
    return n && this.resizeCanvas(), n;
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
Uh.extension = z.TextureSource;
class Ui extends Be {
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
Ui.extension = z.TextureSource;
var zn = /* @__PURE__ */ ((i) => (i[i.INTERACTION = 50] = "INTERACTION", i[i.HIGH = 25] = "HIGH", i[i.NORMAL = 0] = "NORMAL", i[i.LOW = -25] = "LOW", i[i.UTILITY = -50] = "UTILITY", i))(zn || {});
class Kr {
  /**
   * Constructor
   * @private
   * @param fn - The listener function to be added for one update
   * @param context - The listener context
   * @param priority - The priority for emitting
   * @param once - If the handler should fire once
   */
  constructor(t, e = null, s = 0, n = !1) {
    this.next = null, this.previous = null, this._destroyed = !1, this._fn = t, this._context = e, this.priority = s, this._once = n;
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
const Gh = class Ht {
  constructor() {
    this.autoStart = !1, this.deltaTime = 1, this.lastTime = -1, this.speed = 1, this.started = !1, this._requestId = null, this._maxElapsedMS = 100, this._minElapsedMS = 0, this._protected = !1, this._lastFrame = -1, this._head = new Kr(null, null, 1 / 0), this.deltaMS = 1 / Ht.targetFPMS, this.elapsedMS = 1 / Ht.targetFPMS, this._tick = (t) => {
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
  add(t, e, s = zn.NORMAL) {
    return this._addListener(new Kr(t, e, s));
  }
  /**
   * Add a handler for the tick event which is only execute once.
   * @param fn - The listener function to be added for one update
   * @param context - The listener context
   * @param {number} [priority=UPDATE_PRIORITY.NORMAL] - The priority for emitting
   * @returns This instance of a ticker
   */
  addOnce(t, e, s = zn.NORMAL) {
    return this._addListener(new Kr(t, e, s, !0));
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
    let e = this._head.next, s = this._head;
    if (!e)
      t.connect(s);
    else {
      for (; e; ) {
        if (t.priority > e.priority) {
          t.connect(s);
          break;
        }
        s = e, e = e.next;
      }
      t.previous || t.connect(s);
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
    let s = this._head.next;
    for (; s; )
      s.match(t, e) ? s = s.destroy() : s = s.next;
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
        const r = t - this._lastFrame | 0;
        if (r < this._minElapsedMS)
          return;
        this._lastFrame = t - r % this._minElapsedMS;
      }
      this.deltaMS = e, this.deltaTime = this.deltaMS * Ht.targetFPMS;
      const s = this._head;
      let n = s.next;
      for (; n; )
        n = n.emit(this);
      s.next || this._cancelIfNeeded();
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
    const e = Math.min(this.maxFPS, t), s = Math.min(Math.max(0, e) / 1e3, Ht.targetFPMS);
    this._maxElapsedMS = 1 / s;
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
    if (!Ht._shared) {
      const t = Ht._shared = new Ht();
      t.autoStart = !0, t._protected = !0;
    }
    return Ht._shared;
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
    if (!Ht._system) {
      const t = Ht._system = new Ht();
      t.autoStart = !0, t._protected = !0;
    }
    return Ht._system;
  }
};
Gh.targetFPMS = 0.06;
let Pe = Gh, Qr;
async function Vh() {
  return Qr ?? (Qr = (async () => {
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
    const s = t.createTexture();
    t.bindTexture(t.TEXTURE_2D, s);
    const n = t.createFramebuffer();
    t.bindFramebuffer(t.FRAMEBUFFER, n), t.framebufferTexture2D(
      t.FRAMEBUFFER,
      t.COLOR_ATTACHMENT0,
      t.TEXTURE_2D,
      s,
      0
    ), t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL, t.NONE), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, t.RGBA, t.UNSIGNED_BYTE, e);
    const r = new Uint8Array(4);
    return t.readPixels(0, 0, 1, 1, t.RGBA, t.UNSIGNED_BYTE, r), t.deleteFramebuffer(n), t.deleteTexture(s), (i = t.getExtension("WEBGL_lose_context")) == null || i.loseContext(), r[0] <= r[3] ? "premultiplied-alpha" : "premultiply-alpha-on-upload";
  })()), Qr;
}
const Ar = class Nh extends Be {
  constructor(t) {
    super(t), this.isReady = !1, this.uploadMethodId = "video", t = {
      ...Nh.defaultOptions,
      ...t
    }, this._autoUpdate = !0, this._isConnectedToTicker = !1, this._updateFPS = t.updateFPS || 0, this._msToNextUpdate = 0, this.autoPlay = t.autoPlay !== !1, this.alphaMode = t.alphaMode ?? "premultiply-alpha-on-upload", this._videoFrameRequestCallback = this._videoFrameRequestCallback.bind(this), this._videoFrameRequestCallbackHandle = null, this._load = null, this._resolve = null, this._reject = null, this._onCanPlay = this._onCanPlay.bind(this), this._onCanPlayThrough = this._onCanPlayThrough.bind(this), this._onError = this._onError.bind(this), this._onPlayStart = this._onPlayStart.bind(this), this._onPlayStop = this._onPlayStop.bind(this), this._onSeeked = this._onSeeked.bind(this), t.autoLoad !== !1 && this.load();
  }
  /** Update the video frame if the source is not destroyed and meets certain conditions. */
  updateFrame() {
    if (!this.destroyed) {
      if (this._updateFPS) {
        const t = Pe.shared.elapsedMS * this.resource.playbackRate;
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
    return (t.readyState === t.HAVE_ENOUGH_DATA || t.readyState === t.HAVE_FUTURE_DATA) && t.width && t.height && (t.complete = !0), t.addEventListener("play", this._onPlayStart), t.addEventListener("pause", this._onPlayStop), t.addEventListener("seeked", this._onSeeked), this._isSourceReady() ? this._mediaReady() : (e.preload || t.addEventListener("canplay", this._onCanPlay), t.addEventListener("canplaythrough", this._onCanPlayThrough), t.addEventListener("error", this._onError, !0)), this.alphaMode = await Vh(), this._load = new Promise((s, n) => {
      this.isValid ? s(this) : (this._resolve = s, this._reject = n, e.preloadTimeoutMs !== void 0 && (this._preloadTimeout = setTimeout(() => {
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
    this._autoUpdate && this._isSourcePlaying() ? !this._updateFPS && this.resource.requestVideoFrameCallback ? (this._isConnectedToTicker && (Pe.shared.remove(this.updateFrame, this), this._isConnectedToTicker = !1, this._msToNextUpdate = 0), this._videoFrameRequestCallbackHandle === null && (this._videoFrameRequestCallbackHandle = this.resource.requestVideoFrameCallback(
      this._videoFrameRequestCallback
    ))) : (this._videoFrameRequestCallbackHandle !== null && (this.resource.cancelVideoFrameCallback(this._videoFrameRequestCallbackHandle), this._videoFrameRequestCallbackHandle = null), this._isConnectedToTicker || (Pe.shared.add(this.updateFrame, this), this._isConnectedToTicker = !0, this._msToNextUpdate = 0)) : (this._videoFrameRequestCallbackHandle !== null && (this.resource.cancelVideoFrameCallback(this._videoFrameRequestCallbackHandle), this._videoFrameRequestCallbackHandle = null), this._isConnectedToTicker && (Pe.shared.remove(this.updateFrame, this), this._isConnectedToTicker = !1, this._msToNextUpdate = 0));
  }
  static test(t) {
    return globalThis.HTMLVideoElement && t instanceof HTMLVideoElement;
  }
};
Ar.extension = z.TextureSource;
Ar.defaultOptions = {
  ...Be.defaultOptions,
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
Ar.MIME_TYPES = {
  ogv: "video/ogg",
  mov: "video/quicktime",
  m4v: "video/mp4"
};
let Js = Ar;
const ne = (i, t, e = !1) => (Array.isArray(i) || (i = [i]), t ? i.map((s) => typeof s == "string" || e ? t(s) : s) : i);
class dp {
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
    const s = ne(t);
    let n;
    for (let l = 0; l < this.parsers.length; l++) {
      const c = this.parsers[l];
      if (c.test(e)) {
        n = c.getCacheableAssets(s, e);
        break;
      }
    }
    const r = new Map(Object.entries(n || {}));
    n || s.forEach((l) => {
      r.set(l, e);
    });
    const o = [...r.keys()], a = {
      cacheKeys: o,
      keys: s
    };
    s.forEach((l) => {
      this._cacheMap.set(l, a);
    }), o.forEach((l) => {
      const c = n ? n[l] : e;
      this._cache.has(l) && this._cache.get(l) !== c && dt("[Cache] already has key:", l), this._cache.set(l, r.get(l));
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
    e.cacheKeys.forEach((s) => {
      this._cache.delete(s);
    }), e.keys.forEach((s) => {
      this._cacheMap.delete(s);
    });
  }
  /** All loader parsers registered */
  get parsers() {
    return this._parsers;
  }
}
const rt = new dp(), Dn = [];
kt.handleByList(z.TextureSource, Dn);
function Hh(i = {}) {
  const t = i && i.resource, e = t ? i.resource : i, s = t ? i : { resource: i };
  for (let n = 0; n < Dn.length; n++) {
    const r = Dn[n];
    if (r.test(e))
      return new r(s);
  }
  throw new Error(`Could not find a source type for resource: ${s.resource}`);
}
function pp(i = {}, t = !1) {
  const e = i && i.resource, s = e ? i.resource : i, n = e ? i : { resource: i };
  if (!t && rt.has(s))
    return rt.get(s);
  const r = new H({ source: Hh(n) });
  return r.on("destroy", () => {
    rt.has(s) && rt.remove(s);
  }), t || rt.set(s, r), r;
}
function fp(i, t = !1) {
  return typeof i == "string" ? rt.get(i) : i instanceof Be ? new H({ source: i }) : pp(i, t);
}
H.from = fp;
Be.from = Hh;
kt.add(Lh, zh, Dh, Js, Ui, Uh, Co);
var Re = /* @__PURE__ */ ((i) => (i[i.Low = 0] = "Low", i[i.Normal = 1] = "Normal", i[i.High = 2] = "High", i))(Re || {});
function re(i) {
  if (typeof i != "string")
    throw new TypeError(`Path must be a string. Received ${JSON.stringify(i)}`);
}
function Xi(i) {
  return i.split("?")[0].split("#")[0];
}
function mp(i) {
  return i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function gp(i, t, e) {
  return i.replace(new RegExp(mp(t), "g"), e);
}
function yp(i, t) {
  let e = "", s = 0, n = -1, r = 0, o = -1;
  for (let a = 0; a <= i.length; ++a) {
    if (a < i.length)
      o = i.charCodeAt(a);
    else {
      if (o === 47)
        break;
      o = 47;
    }
    if (o === 47) {
      if (!(n === a - 1 || r === 1)) if (n !== a - 1 && r === 2) {
        if (e.length < 2 || s !== 2 || e.charCodeAt(e.length - 1) !== 46 || e.charCodeAt(e.length - 2) !== 46) {
          if (e.length > 2) {
            const l = e.lastIndexOf("/");
            if (l !== e.length - 1) {
              l === -1 ? (e = "", s = 0) : (e = e.slice(0, l), s = e.length - 1 - e.lastIndexOf("/")), n = a, r = 0;
              continue;
            }
          } else if (e.length === 2 || e.length === 1) {
            e = "", s = 0, n = a, r = 0;
            continue;
          }
        }
      } else
        e.length > 0 ? e += `/${i.slice(n + 1, a)}` : e = i.slice(n + 1, a), s = a - n - 1;
      n = a, r = 0;
    } else o === 46 && r !== -1 ? ++r : r = -1;
  }
  return e;
}
const St = {
  /**
   * Converts a path to posix format.
   * @param path - The path to convert to posix
   */
  toPosix(i) {
    return gp(i, "\\", "/");
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
    re(i), i = this.toPosix(i);
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
    if (re(i), this.isDataUrl(i) || this.isBlobUrl(i))
      return i;
    const s = Xi(this.toPosix(t ?? at.get().getBaseUrl())), n = Xi(this.toPosix(e ?? this.rootname(s)));
    return i = this.toPosix(i), i.startsWith("/") ? St.join(n, i.slice(1)) : this.isAbsolute(i) ? i : this.join(s, i);
  },
  /**
   * Normalizes the given path, resolving '..' and '.' segments
   * @param path - The path to normalize
   */
  normalize(i) {
    if (re(i), i.length === 0)
      return ".";
    if (this.isDataUrl(i) || this.isBlobUrl(i))
      return i;
    i = this.toPosix(i);
    let t = "";
    const e = i.startsWith("/");
    this.hasProtocol(i) && (t = this.rootname(i), i = i.slice(t.length));
    const s = i.endsWith("/");
    return i = yp(i), i.length > 0 && s && (i += "/"), e ? `/${i}` : t + i;
  },
  /**
   * Determines if path is an absolute path.
   * Absolute paths can be urls, data urls, or paths on disk
   * @param path - The path to test
   */
  isAbsolute(i) {
    return re(i), i = this.toPosix(i), this.hasProtocol(i) ? !0 : i.startsWith("/");
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
      const s = i[e];
      if (re(s), s.length > 0)
        if (t === void 0)
          t = s;
        else {
          const n = i[e - 1] ?? "";
          this.joinExtensions.includes(this.extname(n).toLowerCase()) ? t += `/../${s}` : t += `/${s}`;
        }
    }
    return t === void 0 ? "." : this.normalize(t);
  },
  /**
   * Returns the directory name of a path
   * @param path - The path to parse
   */
  dirname(i) {
    if (re(i), i.length === 0)
      return ".";
    i = this.toPosix(i);
    let t = i.charCodeAt(0);
    const e = t === 47;
    let s = -1, n = !0;
    const r = this.getProtocol(i), o = i;
    i = i.slice(r.length);
    for (let a = i.length - 1; a >= 1; --a)
      if (t = i.charCodeAt(a), t === 47) {
        if (!n) {
          s = a;
          break;
        }
      } else
        n = !1;
    return s === -1 ? e ? "/" : this.isUrl(o) ? r + i : r : e && s === 1 ? "//" : r + i.slice(0, s);
  },
  /**
   * Returns the root of the path e.g. /, C:/, file:///, http://domain.com/
   * @param path - The path to parse
   */
  rootname(i) {
    re(i), i = this.toPosix(i);
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
    re(i), t && re(t), i = Xi(this.toPosix(i));
    let e = 0, s = -1, n = !0, r;
    if (t !== void 0 && t.length > 0 && t.length <= i.length) {
      if (t.length === i.length && t === i)
        return "";
      let o = t.length - 1, a = -1;
      for (r = i.length - 1; r >= 0; --r) {
        const l = i.charCodeAt(r);
        if (l === 47) {
          if (!n) {
            e = r + 1;
            break;
          }
        } else
          a === -1 && (n = !1, a = r + 1), o >= 0 && (l === t.charCodeAt(o) ? --o === -1 && (s = r) : (o = -1, s = a));
      }
      return e === s ? s = a : s === -1 && (s = i.length), i.slice(e, s);
    }
    for (r = i.length - 1; r >= 0; --r)
      if (i.charCodeAt(r) === 47) {
        if (!n) {
          e = r + 1;
          break;
        }
      } else s === -1 && (n = !1, s = r + 1);
    return s === -1 ? "" : i.slice(e, s);
  },
  /**
   * Returns the extension of the path, from the last occurrence of the . (period) character to end of string in the last
   * portion of the path. If there is no . in the last portion of the path, or if there are no . characters other than
   * the first character of the basename of path, an empty string is returned.
   * @param path - The path to parse
   */
  extname(i) {
    re(i), i = Xi(this.toPosix(i));
    let t = -1, e = 0, s = -1, n = !0, r = 0;
    for (let o = i.length - 1; o >= 0; --o) {
      const a = i.charCodeAt(o);
      if (a === 47) {
        if (!n) {
          e = o + 1;
          break;
        }
        continue;
      }
      s === -1 && (n = !1, s = o + 1), a === 46 ? t === -1 ? t = o : r !== 1 && (r = 1) : t !== -1 && (r = -1);
    }
    return t === -1 || s === -1 || r === 0 || r === 1 && t === s - 1 && t === e + 1 ? "" : i.slice(t, s);
  },
  /**
   * Parses a path into an object containing the 'root', `dir`, `base`, `ext`, and `name` properties.
   * @param path - The path to parse
   */
  parse(i) {
    re(i);
    const t = { root: "", dir: "", base: "", ext: "", name: "" };
    if (i.length === 0)
      return t;
    i = Xi(this.toPosix(i));
    let e = i.charCodeAt(0);
    const s = this.isAbsolute(i);
    let n;
    t.root = this.rootname(i), s || this.hasProtocol(i) ? n = 1 : n = 0;
    let r = -1, o = 0, a = -1, l = !0, c = i.length - 1, h = 0;
    for (; c >= n; --c) {
      if (e = i.charCodeAt(c), e === 47) {
        if (!l) {
          o = c + 1;
          break;
        }
        continue;
      }
      a === -1 && (l = !1, a = c + 1), e === 46 ? r === -1 ? r = c : h !== 1 && (h = 1) : r !== -1 && (h = -1);
    }
    return r === -1 || a === -1 || h === 0 || h === 1 && r === a - 1 && r === o + 1 ? a !== -1 && (o === 0 && s ? t.base = t.name = i.slice(1, a) : t.base = t.name = i.slice(o, a)) : (o === 0 && s ? (t.name = i.slice(1, r), t.base = i.slice(1, a)) : (t.name = i.slice(o, r), t.base = i.slice(o, a)), t.ext = i.slice(r, a)), t.dir = this.dirname(i), t;
  },
  sep: "/",
  delimiter: ":",
  joinExtensions: [".html"]
};
function jh(i, t, e, s, n) {
  const r = t[e];
  for (let o = 0; o < r.length; o++) {
    const a = r[o];
    e < t.length - 1 ? jh(i.replace(s[e], a), t, e + 1, s, n) : n.push(i.replace(s[e], a));
  }
}
function xp(i) {
  const t = /\{(.*?)\}/g, e = i.match(t), s = [];
  if (e) {
    const n = [];
    e.forEach((r) => {
      const o = r.substring(1, r.length - 1).split(",");
      n.push(o);
    }), jh(i, n, 0, e, s);
  } else
    s.push(i);
  return s;
}
const ur = (i) => !Array.isArray(i);
class Gi {
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
      this._defaultSearchParams = Object.keys(e).map((s) => `${encodeURIComponent(s)}=${encodeURIComponent(e[s])}`).join("&");
    }
  }
  /**
   * Returns the aliases for a given asset
   * @param asset - the asset to get the aliases for
   */
  getAlias(t) {
    const { alias: e, src: s } = t;
    return ne(
      e || s,
      (n) => typeof n == "string" ? n : Array.isArray(n) ? n.map((r) => (r == null ? void 0 : r.src) ?? r) : n != null && n.src ? n.src : n,
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
    const s = [];
    let n = e;
    Array.isArray(e) || (n = Object.entries(e).map(([r, o]) => typeof o == "string" || Array.isArray(o) ? { alias: r, src: o } : { alias: r, ...o })), n.forEach((r) => {
      const o = r.src, a = r.alias;
      let l;
      if (typeof a == "string") {
        const c = this._createBundleAssetId(t, a);
        s.push(c), l = [a, c];
      } else {
        const c = a.map((h) => this._createBundleAssetId(t, h));
        s.push(...c), l = [...a, ...c];
      }
      this.add({
        ...r,
        alias: l,
        src: o
      });
    }), this._bundles[t] = s;
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
    let s;
    s = (n) => {
      this.hasKey(n) && dt(`[Resolver] already has key: ${n} overwriting`);
    }, ne(e).forEach((n) => {
      const { src: r } = n;
      let { data: o, format: a, loadParser: l } = n;
      const c = ne(r).map((p) => typeof p == "string" ? xp(p) : Array.isArray(p) ? p : [p]), h = this.getAlias(n);
      Array.isArray(h) ? h.forEach(s) : s(h);
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
            o = u.data ?? o, a = u.format ?? a, l = u.loadParser ?? l, d = {
              ...d,
              ...u
            };
          if (!h)
            throw new Error(`[Resolver] alias is undefined for this asset: ${d.src}`);
          d = this._buildResolvedAsset(d, {
            aliases: h,
            data: o,
            format: a,
            loadParser: l
          }), f.push(d);
        });
      }), h.forEach((p) => {
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
    const e = ur(t);
    t = ne(t);
    const s = {};
    return t.forEach((n) => {
      const r = this._bundles[n];
      if (r) {
        const o = this.resolve(r), a = {};
        for (const l in o) {
          const c = o[l];
          a[this._extractAssetIdFromBundle(n, l)] = c;
        }
        s[n] = a;
      }
    }), e ? s[t[0]] : s;
  }
  /**
   * Does exactly what resolve does, but returns just the URL rather than the whole asset object
   * @param key - The key or keys to resolve
   * @returns - The URLs associated with the key(s)
   */
  resolveUrl(t) {
    const e = this.resolve(t);
    if (typeof t != "string") {
      const s = {};
      for (const n in e)
        s[n] = e[n].src;
      return s;
    }
    return e.src;
  }
  resolve(t) {
    const e = ur(t);
    t = ne(t);
    const s = {};
    return t.forEach((n) => {
      if (!this._resolverHash[n])
        if (this._assetMap[n]) {
          let r = this._assetMap[n];
          const o = this._getPreferredOrder(r);
          o == null || o.priority.forEach((a) => {
            o.params[a].forEach((l) => {
              const c = r.filter((h) => h[a] ? h[a] === l : !1);
              c.length && (r = c);
            });
          }), this._resolverHash[n] = r[0];
        } else
          this._resolverHash[n] = this._buildResolvedAsset({
            alias: [n],
            src: n
          }, {});
      s[n] = this._resolverHash[n];
    }), e ? s[t[0]] : s;
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
      const s = t[0], n = this._preferredOrder.find((r) => r.params.format.includes(s.format));
      if (n)
        return n;
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
    const { aliases: s, data: n, loadParser: r, format: o } = e;
    return (this._basePath || this._rootPath) && (t.src = St.toAbsolute(t.src, this._basePath, this._rootPath)), t.alias = s ?? t.alias ?? [t.src], t.src = this._appendDefaultSearchParams(t.src), t.data = { ...n || {}, ...t.data }, t.loadParser = r ?? t.loadParser, t.format = o ?? t.format ?? vp(t.src), t;
  }
}
Gi.RETINA_PREFIX = /@([0-9\.]+)x/;
function vp(i) {
  return i.split(".").pop().split("?").shift().split("#").shift();
}
const Un = (i, t) => {
  const e = t.split("?")[1];
  return e && (i += `?${e}`), i;
}, Yh = class is {
  /**
   * @param texture - Reference to the source BaseTexture object.
   * @param {object} data - Spritesheet image data.
   */
  constructor(t, e) {
    this.linkedSheets = [], this._texture = t instanceof H ? t : null, this.textureSource = t.source, this.textures = {}, this.animations = {}, this.data = e;
    const s = parseFloat(e.meta.scale);
    s ? (this.resolution = s, t.source.resolution = this.resolution) : this.resolution = t.source._resolution, this._frames = this.data.frames, this._frameKeys = Object.keys(this._frames), this._batchIndex = 0, this._callback = null;
  }
  /**
   * Parser spritesheet from loaded data. This is done asynchronously
   * to prevent creating too many Texture within a single process.
   */
  parse() {
    return new Promise((t) => {
      this._callback = t, this._batchIndex = 0, this._frameKeys.length <= is.BATCH_SIZE ? (this._processFrames(0), this._processAnimations(), this._parseComplete()) : this._nextBatch();
    });
  }
  /**
   * Process a batch of frames
   * @param initialFrameIndex - The index of frame to start.
   */
  _processFrames(t) {
    let e = t;
    const s = is.BATCH_SIZE;
    for (; e - t < s && e < this._frameKeys.length; ) {
      const n = this._frameKeys[e], r = this._frames[n], o = r.frame;
      if (o) {
        let a = null, l = null;
        const c = r.trimmed !== !1 && r.sourceSize ? r.sourceSize : r.frame, h = new yt(
          0,
          0,
          Math.floor(c.w) / this.resolution,
          Math.floor(c.h) / this.resolution
        );
        r.rotated ? a = new yt(
          Math.floor(o.x) / this.resolution,
          Math.floor(o.y) / this.resolution,
          Math.floor(o.h) / this.resolution,
          Math.floor(o.w) / this.resolution
        ) : a = new yt(
          Math.floor(o.x) / this.resolution,
          Math.floor(o.y) / this.resolution,
          Math.floor(o.w) / this.resolution,
          Math.floor(o.h) / this.resolution
        ), r.trimmed !== !1 && r.spriteSourceSize && (l = new yt(
          Math.floor(r.spriteSourceSize.x) / this.resolution,
          Math.floor(r.spriteSourceSize.y) / this.resolution,
          Math.floor(o.w) / this.resolution,
          Math.floor(o.h) / this.resolution
        )), this.textures[n] = new H({
          source: this.textureSource,
          frame: a,
          orig: h,
          trim: l,
          rotate: r.rotated ? 2 : 0,
          defaultAnchor: r.anchor,
          defaultBorders: r.borders,
          label: n.toString()
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
      for (let s = 0; s < t[e].length; s++) {
        const n = t[e][s];
        this.animations[e].push(this.textures[n]);
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
    this._processFrames(this._batchIndex * is.BATCH_SIZE), this._batchIndex++, setTimeout(() => {
      this._batchIndex * is.BATCH_SIZE < this._frameKeys.length ? this._nextBatch() : (this._processAnimations(), this._parseComplete());
    }, 0);
  }
  /**
   * Destroy Spritesheet and don't use after this.
   * @param {boolean} [destroyBase=false] - Whether to destroy the base texture as well
   */
  destroy(t = !1) {
    var e;
    for (const s in this.textures)
      this.textures[s].destroy();
    this._frames = null, this._frameKeys = null, this.data = null, this.textures = null, t && ((e = this._texture) == null || e.destroy(), this.textureSource.destroy()), this._texture = null, this.textureSource = null, this.linkedSheets = [];
  }
};
Yh.BATCH_SIZE = 1e3;
let Ma = Yh;
const bp = [
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
function Wh(i, t, e) {
  const s = {};
  if (i.forEach((n) => {
    s[n] = t;
  }), Object.keys(t.textures).forEach((n) => {
    s[n] = t.textures[n];
  }), !e) {
    const n = St.dirname(i[0]);
    t.linkedSheets.forEach((r, o) => {
      const a = Wh([`${n}/${t.data.meta.related_multi_packs[o]}`], r, !0);
      Object.assign(s, a);
    });
  }
  return s;
}
const _p = {
  extension: z.Asset,
  /** Handle the caching of the related Spritesheet Textures */
  cache: {
    test: (i) => i instanceof Ma,
    getCacheableAssets: (i, t) => Wh(i, t, !1)
  },
  /** Resolve the resolution of the asset. */
  resolver: {
    extension: {
      type: z.ResolveParser,
      name: "resolveSpritesheet"
    },
    test: (i) => {
      const t = i.split("?")[0].split("."), e = t.pop(), s = t.pop();
      return e === "json" && bp.includes(s);
    },
    parse: (i) => {
      var t;
      const e = i.split(".");
      return {
        resolution: parseFloat(((t = Gi.RETINA_PREFIX.exec(i)) == null ? void 0 : t[1]) ?? "1"),
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
      type: z.LoadParser,
      priority: Re.Normal,
      name: "spritesheetLoader"
    },
    async testParse(i, t) {
      return St.extname(t.src).toLowerCase() === ".json" && !!i.frames;
    },
    async parse(i, t, e) {
      var s, n;
      const {
        texture: r,
        // if user need to use preloaded texture
        imageFilename: o
        // if user need to use custom filename (not from jsonFile.meta.image)
      } = (t == null ? void 0 : t.data) ?? {};
      let a = St.dirname(t.src);
      a && a.lastIndexOf("/") !== a.length - 1 && (a += "/");
      let l;
      if (r instanceof H)
        l = r;
      else {
        const f = Un(a + (o ?? i.meta.image), t.src);
        l = (await e.load([f]))[f];
      }
      const c = new Ma(
        l.source,
        i
      );
      await c.parse();
      const h = (s = i == null ? void 0 : i.meta) == null ? void 0 : s.related_multi_packs;
      if (Array.isArray(h)) {
        const f = [];
        for (const u of h) {
          if (typeof u != "string")
            continue;
          let d = a + u;
          (n = t.data) != null && n.ignoreMultiPack || (d = Un(d, t.src), f.push(e.load({
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
kt.add(_p);
const Zr = /* @__PURE__ */ Object.create(null), Ta = /* @__PURE__ */ Object.create(null);
function Mo(i, t) {
  let e = Ta[i];
  return e === void 0 && (Zr[t] === void 0 && (Zr[t] = 1), Ta[i] = e = Zr[t]++), e;
}
let qi;
function Xh() {
  return (!qi || qi != null && qi.isContextLost()) && (qi = at.get().createCanvas().getContext("webgl", {})), qi;
}
let Ns;
function wp() {
  if (!Ns) {
    Ns = "mediump";
    const i = Xh();
    i && i.getShaderPrecisionFormat && (Ns = i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.HIGH_FLOAT).precision ? "highp" : "mediump");
  }
  return Ns;
}
function Ap(i, t, e) {
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
function Sp(i, t, e) {
  const s = e ? t.maxSupportedFragmentPrecision : t.maxSupportedVertexPrecision;
  if (i.substring(0, 9) !== "precision") {
    let n = e ? t.requestedFragmentPrecision : t.requestedVertexPrecision;
    return n === "highp" && s !== "highp" && (n = "mediump"), `precision ${n} float;
${i}`;
  } else if (s !== "highp" && i.substring(0, 15) === "precision highp")
    return i.replace("precision highp", "precision mediump");
  return i;
}
function Cp(i, t) {
  return t ? `#version 300 es
${i}` : i;
}
const Pp = {}, Mp = {};
function Tp(i, { name: t = "pixi-program" }, e = !0) {
  t = t.replace(/\s+/g, "-"), t += e ? "-fragment" : "-vertex";
  const s = e ? Pp : Mp;
  return s[t] ? (s[t]++, t += `-${s[t]}`) : s[t] = 1, i.indexOf("#define SHADER_NAME") !== -1 ? i : `${`#define SHADER_NAME ${t}`}
${i}`;
}
function kp(i, t) {
  return t ? i.replace("#version 300 es", "") : i;
}
const Jr = {
  // strips any version headers..
  stripVersion: kp,
  // adds precision string if not already present
  ensurePrecision: Sp,
  // add some defines if WebGL1 to make it more compatible with WebGL2 shaders
  addProgramDefines: Ap,
  // add the program name to the shader
  setProgramName: Tp,
  // add the version string to the shader header
  insertVersion: Cp
}, $r = /* @__PURE__ */ Object.create(null), qh = class Gn {
  /**
   * Creates a shiny new GlProgram. Used by WebGL renderer.
   * @param options - The options for the program.
   */
  constructor(t) {
    t = { ...Gn.defaultOptions, ...t };
    const e = t.fragment.indexOf("#version 300 es") !== -1, s = {
      stripVersion: e,
      ensurePrecision: {
        requestedFragmentPrecision: t.preferredFragmentPrecision,
        requestedVertexPrecision: t.preferredVertexPrecision,
        maxSupportedVertexPrecision: "highp",
        maxSupportedFragmentPrecision: wp()
      },
      setProgramName: {
        name: t.name
      },
      addProgramDefines: e,
      insertVersion: e
    };
    let n = t.fragment, r = t.vertex;
    Object.keys(Jr).forEach((o) => {
      const a = s[o];
      n = Jr[o](n, a, !0), r = Jr[o](r, a, !1);
    }), this.fragment = n, this.vertex = r, this._key = Mo(`${this.vertex}:${this.fragment}`, "gl-program");
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
    return $r[e] || ($r[e] = new Gn(t)), $r[e];
  }
};
qh.defaultOptions = {
  preferredVertexPrecision: "highp",
  preferredFragmentPrecision: "mediump"
};
let Kh = qh;
const ka = {
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
function Ep(i) {
  return ka[i] ?? ka.float32;
}
const Bp = {
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
function Rp({ source: i, entryPoint: t }) {
  const e = {}, s = i.indexOf(`fn ${t}`);
  if (s !== -1) {
    const n = i.indexOf("->", s);
    if (n !== -1) {
      const r = i.substring(s, n), o = /@location\((\d+)\)\s+([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z0-9_<>]+)(?:,|\s|$)/g;
      let a;
      for (; (a = o.exec(r)) !== null; ) {
        const l = Bp[a[3]] ?? "float32";
        e[a[2]] = {
          location: parseInt(a[1], 10),
          format: l,
          stride: Ep(l).stride,
          offset: 0,
          instance: !1,
          start: 0
        };
      }
    }
  }
  return e;
}
function tn(i) {
  var t, e;
  const s = /(^|[^/])@(group|binding)\(\d+\)[^;]+;/g, n = /@group\((\d+)\)/, r = /@binding\((\d+)\)/, o = /var(<[^>]+>)? (\w+)/, a = /:\s*(\w+)/, l = /struct\s+(\w+)\s*{([^}]+)}/g, c = /(\w+)\s*:\s*([\w\<\>]+)/g, h = /struct\s+(\w+)/, f = (t = i.match(s)) == null ? void 0 : t.map((u) => ({
    group: parseInt(u.match(n)[1], 10),
    binding: parseInt(u.match(r)[1], 10),
    name: u.match(o)[2],
    isUniform: u.match(o)[1] === "<uniform>",
    type: u.match(a)[1]
  }));
  if (!f)
    return {
      groups: [],
      structs: []
    };
  const p = ((e = i.match(l)) == null ? void 0 : e.map((u) => {
    const d = u.match(h)[1], m = u.match(c).reduce((g, y) => {
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
var ss = /* @__PURE__ */ ((i) => (i[i.VERTEX = 1] = "VERTEX", i[i.FRAGMENT = 2] = "FRAGMENT", i[i.COMPUTE = 4] = "COMPUTE", i))(ss || {});
function Ip({ groups: i }) {
  const t = [];
  for (let e = 0; e < i.length; e++) {
    const s = i[e];
    t[s.group] || (t[s.group] = []), s.isUniform ? t[s.group].push({
      binding: s.binding,
      visibility: ss.VERTEX | ss.FRAGMENT,
      buffer: {
        type: "uniform"
      }
    }) : s.type === "sampler" ? t[s.group].push({
      binding: s.binding,
      visibility: ss.FRAGMENT,
      sampler: {
        type: "filtering"
      }
    }) : s.type === "texture_2d" && t[s.group].push({
      binding: s.binding,
      visibility: ss.FRAGMENT,
      texture: {
        sampleType: "float",
        viewDimension: "2d",
        multisampled: !1
      }
    });
  }
  return t;
}
function Op({ groups: i }) {
  const t = [];
  for (let e = 0; e < i.length; e++) {
    const s = i[e];
    t[s.group] || (t[s.group] = {}), t[s.group][s.name] = s.binding;
  }
  return t;
}
function Fp(i, t) {
  const e = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), n = [...i.structs, ...t.structs].filter((o) => e.has(o.name) ? !1 : (e.add(o.name), !0)), r = [...i.groups, ...t.groups].filter((o) => {
    const a = `${o.name}-${o.binding}`;
    return s.has(a) ? !1 : (s.add(a), !0);
  });
  return { structs: n, groups: r };
}
const en = /* @__PURE__ */ Object.create(null);
class Sr {
  /**
   * Create a new GpuProgram
   * @param options - The options for the gpu program
   */
  constructor(t) {
    var e, s;
    this._layoutKey = 0, this._attributeLocationsKey = 0;
    const { fragment: n, vertex: r, layout: o, gpuLayout: a, name: l } = t;
    if (this.name = l, this.fragment = n, this.vertex = r, n.source === r.source) {
      const c = tn(n.source);
      this.structsAndGroups = c;
    } else {
      const c = tn(r.source), h = tn(n.source);
      this.structsAndGroups = Fp(c, h);
    }
    this.layout = o ?? Op(this.structsAndGroups), this.gpuLayout = a ?? Ip(this.structsAndGroups), this.autoAssignGlobalUniforms = ((e = this.layout[0]) == null ? void 0 : e.globalUniforms) !== void 0, this.autoAssignLocalUniforms = ((s = this.layout[1]) == null ? void 0 : s.localUniforms) !== void 0, this._generateProgramKey();
  }
  // TODO maker this pure
  _generateProgramKey() {
    const { vertex: t, fragment: e } = this, s = t.source + e.source + t.entryPoint + e.entryPoint;
    this._layoutKey = Mo(s, "program");
  }
  get attributeData() {
    return this._attributeData ?? (this._attributeData = Rp(this.vertex)), this._attributeData;
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
    return en[e] || (en[e] = new Sr(t)), en[e];
  }
}
const Qh = [
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
], Lp = Qh.reduce((i, t) => (i[t] = !0, i), {});
function zp(i, t) {
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
const Zh = class Jh {
  /**
   * Create a new Uniform group
   * @param uniformStructures - The structures of the uniform group
   * @param options - The optional parameters of this uniform group
   */
  constructor(t, e) {
    this._touched = 0, this.uid = xt("uniform"), this._resourceType = "uniformGroup", this._resourceId = xt("resource"), this.isUniformGroup = !0, this._dirtyId = 0, this.destroyed = !1, e = { ...Jh.defaultOptions, ...e }, this.uniformStructures = t;
    const s = {};
    for (const n in t) {
      const r = t[n];
      if (r.name = n, r.size = r.size ?? 1, !Lp[r.type])
        throw new Error(`Uniform type ${r.type} is not supported. Supported uniform types are: ${Qh.join(", ")}`);
      r.value ?? (r.value = zp(r.type, r.size)), s[n] = r.value;
    }
    this.uniforms = s, this._dirtyId = 1, this.ubo = e.ubo, this.isStatic = e.isStatic, this._signature = Mo(Object.keys(s).map(
      (n) => `${n}-${t[n].type}`
    ).join("-"), "uniform-group");
  }
  /** Call this if you want the uniform groups data to be uploaded to the GPU only useful if `isStatic` is true. */
  update() {
    this._dirtyId++;
  }
};
Zh.defaultOptions = {
  /** if true the UniformGroup is handled as an Uniform buffer object. */
  ubo: !1,
  /** if true, then you are responsible for when the data is uploaded to the GPU by calling `update()` */
  isStatic: !1
};
let $h = Zh;
class $s {
  /**
   * Create a new instance eof the Bind Group.
   * @param resources - The resources that are bound together for use by a shader.
   */
  constructor(t) {
    this.resources = /* @__PURE__ */ Object.create(null), this._dirty = !0;
    let e = 0;
    for (const s in t) {
      const n = t[s];
      this.setResource(n, e++);
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
    for (const s in this.resources)
      t[e++] = this.resources[s]._resourceId;
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
    var s, n;
    const r = this.resources[e];
    t !== r && (r && ((s = t.off) == null || s.call(t, "change", this.onResourceChange, this)), (n = t.on) == null || n.call(t, "change", this.onResourceChange, this), this.resources[e] = t, this._dirty = !0);
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
    for (const s in e)
      e[s]._touched = t;
  }
  /** Destroys this bind group and removes all listeners. */
  destroy() {
    var t;
    const e = this.resources;
    for (const s in e) {
      const n = e[s];
      (t = n.off) == null || t.call(n, "change", this.onResourceChange, this);
    }
    this.resources = null;
  }
  onResourceChange(t) {
    if (this._dirty = !0, t.destroyed) {
      const e = this.resources;
      for (const s in e)
        e[s] === t && (e[s] = null);
    } else
      this._updateKey();
  }
}
var Vn = /* @__PURE__ */ ((i) => (i[i.WEBGL = 1] = "WEBGL", i[i.WEBGPU = 2] = "WEBGPU", i[i.BOTH = 3] = "BOTH", i))(Vn || {});
class To extends Et {
  constructor(t) {
    super(), this._uniformBindMap = /* @__PURE__ */ Object.create(null), this._ownedBindGroups = [];
    let {
      gpuProgram: e,
      glProgram: s,
      groups: n,
      resources: r,
      compatibleRenderers: o,
      groupMap: a
    } = t;
    this.gpuProgram = e, this.glProgram = s, o === void 0 && (o = 0, e && (o |= Vn.WEBGPU), s && (o |= Vn.WEBGL)), this.compatibleRenderers = o;
    const l = {};
    if (!r && !n && (r = {}), r && n)
      throw new Error("[Shader] Cannot have both resources and groups");
    if (!e && n && !a)
      throw new Error("[Shader] No group map or WebGPU shader provided - consider using resources instead.");
    if (!e && n && a)
      for (const c in a)
        for (const h in a[c]) {
          const f = a[c][h];
          l[f] = {
            group: c,
            binding: h,
            name: f
          };
        }
    else if (e && n && !a) {
      const c = e.structsAndGroups.groups;
      a = {}, c.forEach((h) => {
        a[h.group] = a[h.group] || {}, a[h.group][h.binding] = h.name, l[h.name] = h;
      });
    } else if (r) {
      n = {}, a = {}, e && e.structsAndGroups.groups.forEach((h) => {
        a[h.group] = a[h.group] || {}, a[h.group][h.binding] = h.name, l[h.name] = h;
      });
      let c = 0;
      for (const h in r)
        l[h] || (n[99] || (n[99] = new $s(), this._ownedBindGroups.push(n[99])), l[h] = { group: 99, binding: c, name: h }, a[99] = a[99] || {}, a[99][c] = h, c++);
      for (const h in r) {
        const f = h;
        let p = r[h];
        !p.source && !p._resourceType && (p = new $h(p));
        const u = l[f];
        u && (n[u.group] || (n[u.group] = new $s(), this._ownedBindGroups.push(n[u.group])), n[u.group].setResource(p, u.binding));
      }
    }
    this.groups = n, this._uniformBindMap = a, this.resources = this._buildResourceAccessor(n, l);
  }
  /**
   * Sometimes a resource group will be provided later (for example global uniforms)
   * In such cases, this method can be used to let the shader know about the group.
   * @param name - the name of the resource group
   * @param groupIndex - the index of the group (should match the webGPU shader group location)
   * @param bindIndex - the index of the bind point (should match the webGPU shader bind point)
   */
  addResource(t, e, s) {
    var n, r;
    (n = this._uniformBindMap)[e] || (n[e] = {}), (r = this._uniformBindMap[e])[s] || (r[s] = t), this.groups[e] || (this.groups[e] = new $s(), this._ownedBindGroups.push(this.groups[e]));
  }
  _buildResourceAccessor(t, e) {
    const s = {};
    for (const n in e) {
      const r = e[n];
      Object.defineProperty(s, r.name, {
        get() {
          return t[r.group].getResource(r.binding);
        },
        set(o) {
          t[r.group].setResource(o, r.binding);
        }
      });
    }
    return s;
  }
  /**
   * Use to destroy the shader when its not longer needed.
   * It will destroy the resources and remove listeners.
   * @param destroyPrograms - if the programs should be destroyed as well.
   * Make sure its not being used by other shaders!
   */
  destroy(t = !1) {
    var e, s;
    this.emit("destroy", this), t && ((e = this.gpuProgram) == null || e.destroy(), (s = this.glProgram) == null || s.destroy()), this.gpuProgram = null, this.glProgram = null, this.removeAllListeners(), this._uniformBindMap = null, this._ownedBindGroups.forEach((n) => {
      n.destroy();
    }), this._ownedBindGroups = null, this.resources = null, this.groups = null;
  }
  static from(t) {
    const { gpu: e, gl: s, ...n } = t;
    let r, o;
    return e && (r = Sr.from(e)), s && (o = Kh.from(s)), new To({
      gpuProgram: r,
      glProgram: o,
      ...n
    });
  }
}
const Nn = [];
kt.handleByNamedList(z.Environment, Nn);
async function Dp(i) {
  if (!i)
    for (let t = 0; t < Nn.length; t++) {
      const e = Nn[t];
      if (e.value.test()) {
        await e.value.load();
        return;
      }
    }
}
let Ki;
function Up() {
  if (typeof Ki == "boolean")
    return Ki;
  try {
    Ki = new Function("param1", "param2", "param3", "return param1[param2] === param3;")({ a: "b" }, "a", "b") === !0;
  } catch {
    Ki = !1;
  }
  return Ki;
}
var ko = { exports: {} };
ko.exports = Cr;
ko.exports.default = Cr;
function Cr(i, t, e) {
  e = e || 2;
  var s = t && t.length, n = s ? t[0] * e : i.length, r = tc(i, 0, n, e, !0), o = [];
  if (!r || r.next === r.prev) return o;
  var a, l, c, h, f, p, u;
  if (s && (r = jp(i, t, r, e)), i.length > 80 * e) {
    a = c = i[0], l = h = i[1];
    for (var d = e; d < n; d += e)
      f = i[d], p = i[d + 1], f < a && (a = f), p < l && (l = p), f > c && (c = f), p > h && (h = p);
    u = Math.max(c - a, h - l), u = u !== 0 ? 32767 / u : 0;
  }
  return bs(r, o, e, a, l, u, 0), o;
}
function tc(i, t, e, s, n) {
  var r, o;
  if (n === Yn(i, t, e, s) > 0)
    for (r = t; r < e; r += s) o = Ea(r, i[r], i[r + 1], o);
  else
    for (r = e - s; r >= t; r -= s) o = Ea(r, i[r], i[r + 1], o);
  return o && Pr(o, o.next) && (ws(o), o = o.next), o;
}
function li(i, t) {
  if (!i) return i;
  t || (t = i);
  var e = i, s;
  do
    if (s = !1, !e.steiner && (Pr(e, e.next) || ot(e.prev, e, e.next) === 0)) {
      if (ws(e), e = t = e.prev, e === e.next) break;
      s = !0;
    } else
      e = e.next;
  while (s || e !== t);
  return t;
}
function bs(i, t, e, s, n, r, o) {
  if (i) {
    !o && r && Kp(i, s, n, r);
    for (var a = i, l, c; i.prev !== i.next; ) {
      if (l = i.prev, c = i.next, r ? Vp(i, s, n, r) : Gp(i)) {
        t.push(l.i / e | 0), t.push(i.i / e | 0), t.push(c.i / e | 0), ws(i), i = c.next, a = c.next;
        continue;
      }
      if (i = c, i === a) {
        o ? o === 1 ? (i = Np(li(i), t, e), bs(i, t, e, s, n, r, 2)) : o === 2 && Hp(i, t, e, s, n, r) : bs(li(i), t, e, s, n, r, 1);
        break;
      }
    }
  }
}
function Gp(i) {
  var t = i.prev, e = i, s = i.next;
  if (ot(t, e, s) >= 0) return !1;
  for (var n = t.x, r = e.x, o = s.x, a = t.y, l = e.y, c = s.y, h = n < r ? n < o ? n : o : r < o ? r : o, f = a < l ? a < c ? a : c : l < c ? l : c, p = n > r ? n > o ? n : o : r > o ? r : o, u = a > l ? a > c ? a : c : l > c ? l : c, d = s.next; d !== t; ) {
    if (d.x >= h && d.x <= p && d.y >= f && d.y <= u && wi(n, a, r, l, o, c, d.x, d.y) && ot(d.prev, d, d.next) >= 0) return !1;
    d = d.next;
  }
  return !0;
}
function Vp(i, t, e, s) {
  var n = i.prev, r = i, o = i.next;
  if (ot(n, r, o) >= 0) return !1;
  for (var a = n.x, l = r.x, c = o.x, h = n.y, f = r.y, p = o.y, u = a < l ? a < c ? a : c : l < c ? l : c, d = h < f ? h < p ? h : p : f < p ? f : p, m = a > l ? a > c ? a : c : l > c ? l : c, g = h > f ? h > p ? h : p : f > p ? f : p, y = Hn(u, d, t, e, s), v = Hn(m, g, t, e, s), _ = i.prevZ, w = i.nextZ; _ && _.z >= y && w && w.z <= v; ) {
    if (_.x >= u && _.x <= m && _.y >= d && _.y <= g && _ !== n && _ !== o && wi(a, h, l, f, c, p, _.x, _.y) && ot(_.prev, _, _.next) >= 0 || (_ = _.prevZ, w.x >= u && w.x <= m && w.y >= d && w.y <= g && w !== n && w !== o && wi(a, h, l, f, c, p, w.x, w.y) && ot(w.prev, w, w.next) >= 0)) return !1;
    w = w.nextZ;
  }
  for (; _ && _.z >= y; ) {
    if (_.x >= u && _.x <= m && _.y >= d && _.y <= g && _ !== n && _ !== o && wi(a, h, l, f, c, p, _.x, _.y) && ot(_.prev, _, _.next) >= 0) return !1;
    _ = _.prevZ;
  }
  for (; w && w.z <= v; ) {
    if (w.x >= u && w.x <= m && w.y >= d && w.y <= g && w !== n && w !== o && wi(a, h, l, f, c, p, w.x, w.y) && ot(w.prev, w, w.next) >= 0) return !1;
    w = w.nextZ;
  }
  return !0;
}
function Np(i, t, e) {
  var s = i;
  do {
    var n = s.prev, r = s.next.next;
    !Pr(n, r) && ec(n, s, s.next, r) && _s(n, r) && _s(r, n) && (t.push(n.i / e | 0), t.push(s.i / e | 0), t.push(r.i / e | 0), ws(s), ws(s.next), s = i = r), s = s.next;
  } while (s !== i);
  return li(s);
}
function Hp(i, t, e, s, n, r) {
  var o = i;
  do {
    for (var a = o.next.next; a !== o.prev; ) {
      if (o.i !== a.i && Jp(o, a)) {
        var l = ic(o, a);
        o = li(o, o.next), l = li(l, l.next), bs(o, t, e, s, n, r, 0), bs(l, t, e, s, n, r, 0);
        return;
      }
      a = a.next;
    }
    o = o.next;
  } while (o !== i);
}
function jp(i, t, e, s) {
  var n = [], r, o, a, l, c;
  for (r = 0, o = t.length; r < o; r++)
    a = t[r] * s, l = r < o - 1 ? t[r + 1] * s : i.length, c = tc(i, a, l, s, !1), c === c.next && (c.steiner = !0), n.push(Zp(c));
  for (n.sort(Yp), r = 0; r < n.length; r++)
    e = Wp(n[r], e);
  return e;
}
function Yp(i, t) {
  return i.x - t.x;
}
function Wp(i, t) {
  var e = Xp(i, t);
  if (!e)
    return t;
  var s = ic(e, i);
  return li(s, s.next), li(e, e.next);
}
function Xp(i, t) {
  var e = t, s = i.x, n = i.y, r = -1 / 0, o;
  do {
    if (n <= e.y && n >= e.next.y && e.next.y !== e.y) {
      var a = e.x + (n - e.y) * (e.next.x - e.x) / (e.next.y - e.y);
      if (a <= s && a > r && (r = a, o = e.x < e.next.x ? e : e.next, a === s))
        return o;
    }
    e = e.next;
  } while (e !== t);
  if (!o) return null;
  var l = o, c = o.x, h = o.y, f = 1 / 0, p;
  e = o;
  do
    s >= e.x && e.x >= c && s !== e.x && wi(n < h ? s : r, n, c, h, n < h ? r : s, n, e.x, e.y) && (p = Math.abs(n - e.y) / (s - e.x), _s(e, i) && (p < f || p === f && (e.x > o.x || e.x === o.x && qp(o, e))) && (o = e, f = p)), e = e.next;
  while (e !== l);
  return o;
}
function qp(i, t) {
  return ot(i.prev, i, t.prev) < 0 && ot(t.next, i, i.next) < 0;
}
function Kp(i, t, e, s) {
  var n = i;
  do
    n.z === 0 && (n.z = Hn(n.x, n.y, t, e, s)), n.prevZ = n.prev, n.nextZ = n.next, n = n.next;
  while (n !== i);
  n.prevZ.nextZ = null, n.prevZ = null, Qp(n);
}
function Qp(i) {
  var t, e, s, n, r, o, a, l, c = 1;
  do {
    for (e = i, i = null, r = null, o = 0; e; ) {
      for (o++, s = e, a = 0, t = 0; t < c && (a++, s = s.nextZ, !!s); t++)
        ;
      for (l = c; a > 0 || l > 0 && s; )
        a !== 0 && (l === 0 || !s || e.z <= s.z) ? (n = e, e = e.nextZ, a--) : (n = s, s = s.nextZ, l--), r ? r.nextZ = n : i = n, n.prevZ = r, r = n;
      e = s;
    }
    r.nextZ = null, c *= 2;
  } while (o > 1);
  return i;
}
function Hn(i, t, e, s, n) {
  return i = (i - e) * n | 0, t = (t - s) * n | 0, i = (i | i << 8) & 16711935, i = (i | i << 4) & 252645135, i = (i | i << 2) & 858993459, i = (i | i << 1) & 1431655765, t = (t | t << 8) & 16711935, t = (t | t << 4) & 252645135, t = (t | t << 2) & 858993459, t = (t | t << 1) & 1431655765, i | t << 1;
}
function Zp(i) {
  var t = i, e = i;
  do
    (t.x < e.x || t.x === e.x && t.y < e.y) && (e = t), t = t.next;
  while (t !== i);
  return e;
}
function wi(i, t, e, s, n, r, o, a) {
  return (n - o) * (t - a) >= (i - o) * (r - a) && (i - o) * (s - a) >= (e - o) * (t - a) && (e - o) * (r - a) >= (n - o) * (s - a);
}
function Jp(i, t) {
  return i.next.i !== t.i && i.prev.i !== t.i && !$p(i, t) && // dones't intersect other edges
  (_s(i, t) && _s(t, i) && tf(i, t) && // locally visible
  (ot(i.prev, i, t.prev) || ot(i, t.prev, t)) || // does not create opposite-facing sectors
  Pr(i, t) && ot(i.prev, i, i.next) > 0 && ot(t.prev, t, t.next) > 0);
}
function ot(i, t, e) {
  return (t.y - i.y) * (e.x - t.x) - (t.x - i.x) * (e.y - t.y);
}
function Pr(i, t) {
  return i.x === t.x && i.y === t.y;
}
function ec(i, t, e, s) {
  var n = js(ot(i, t, e)), r = js(ot(i, t, s)), o = js(ot(e, s, i)), a = js(ot(e, s, t));
  return !!(n !== r && o !== a || n === 0 && Hs(i, e, t) || r === 0 && Hs(i, s, t) || o === 0 && Hs(e, i, s) || a === 0 && Hs(e, t, s));
}
function Hs(i, t, e) {
  return t.x <= Math.max(i.x, e.x) && t.x >= Math.min(i.x, e.x) && t.y <= Math.max(i.y, e.y) && t.y >= Math.min(i.y, e.y);
}
function js(i) {
  return i > 0 ? 1 : i < 0 ? -1 : 0;
}
function $p(i, t) {
  var e = i;
  do {
    if (e.i !== i.i && e.next.i !== i.i && e.i !== t.i && e.next.i !== t.i && ec(e, e.next, i, t)) return !0;
    e = e.next;
  } while (e !== i);
  return !1;
}
function _s(i, t) {
  return ot(i.prev, i, i.next) < 0 ? ot(i, t, i.next) >= 0 && ot(i, i.prev, t) >= 0 : ot(i, t, i.prev) < 0 || ot(i, i.next, t) < 0;
}
function tf(i, t) {
  var e = i, s = !1, n = (i.x + t.x) / 2, r = (i.y + t.y) / 2;
  do
    e.y > r != e.next.y > r && e.next.y !== e.y && n < (e.next.x - e.x) * (r - e.y) / (e.next.y - e.y) + e.x && (s = !s), e = e.next;
  while (e !== i);
  return s;
}
function ic(i, t) {
  var e = new jn(i.i, i.x, i.y), s = new jn(t.i, t.x, t.y), n = i.next, r = t.prev;
  return i.next = t, t.prev = i, e.next = n, n.prev = e, s.next = e, e.prev = s, r.next = s, s.prev = r, s;
}
function Ea(i, t, e, s) {
  var n = new jn(i, t, e);
  return s ? (n.next = s.next, n.prev = s, s.next.prev = n, s.next = n) : (n.prev = n, n.next = n), n;
}
function ws(i) {
  i.next.prev = i.prev, i.prev.next = i.next, i.prevZ && (i.prevZ.nextZ = i.nextZ), i.nextZ && (i.nextZ.prevZ = i.prevZ);
}
function jn(i, t, e) {
  this.i = i, this.x = t, this.y = e, this.prev = null, this.next = null, this.z = 0, this.prevZ = null, this.nextZ = null, this.steiner = !1;
}
Cr.deviation = function(i, t, e, s) {
  var n = t && t.length, r = n ? t[0] * e : i.length, o = Math.abs(Yn(i, 0, r, e));
  if (n)
    for (var a = 0, l = t.length; a < l; a++) {
      var c = t[a] * e, h = a < l - 1 ? t[a + 1] * e : i.length;
      o -= Math.abs(Yn(i, c, h, e));
    }
  var f = 0;
  for (a = 0; a < s.length; a += 3) {
    var p = s[a] * e, u = s[a + 1] * e, d = s[a + 2] * e;
    f += Math.abs(
      (i[p] - i[d]) * (i[u + 1] - i[p + 1]) - (i[p] - i[u]) * (i[d + 1] - i[p + 1])
    );
  }
  return o === 0 && f === 0 ? 0 : Math.abs((f - o) / o);
};
function Yn(i, t, e, s) {
  for (var n = 0, r = t, o = e - s; r < e; r += s)
    n += (i[o] - i[r]) * (i[r + 1] + i[o + 1]), o = r;
  return n;
}
Cr.flatten = function(i) {
  for (var t = i[0][0].length, e = { vertices: [], holes: [], dimensions: t }, s = 0, n = 0; n < i.length; n++) {
    for (var r = 0; r < i[n].length; r++)
      for (var o = 0; o < t; o++) e.vertices.push(i[n][r][o]);
    n > 0 && (s += i[n - 1].length, e.holes.push(s));
  }
  return e;
};
var ef = ko.exports;
const sf = /* @__PURE__ */ ro(ef);
var sc = /* @__PURE__ */ ((i) => (i[i.NONE = 0] = "NONE", i[i.COLOR = 16384] = "COLOR", i[i.STENCIL = 1024] = "STENCIL", i[i.DEPTH = 256] = "DEPTH", i[i.COLOR_DEPTH = 16640] = "COLOR_DEPTH", i[i.COLOR_STENCIL = 17408] = "COLOR_STENCIL", i[i.DEPTH_STENCIL = 1280] = "DEPTH_STENCIL", i[i.ALL = 17664] = "ALL", i))(sc || {});
class rf {
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
  emit(t, e, s, n, r, o, a, l) {
    const { name: c, items: h } = this;
    for (let f = 0, p = h.length; f < p; f++)
      h[f][c](t, e, s, n, r, o, a, l);
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
const nf = [
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
], rc = class nc extends Et {
  /**
   * Set up a system with a collection of SystemClasses and runners.
   * Systems are attached dynamically to this class when added.
   * @param config - the config for the system manager
   */
  constructor(t) {
    super(), this.runners = /* @__PURE__ */ Object.create(null), this.renderPipes = /* @__PURE__ */ Object.create(null), this._initOptions = {}, this._systemsHash = /* @__PURE__ */ Object.create(null), this.type = t.type, this.name = t.name, this.config = t;
    const e = [...nf, ...this.config.runners ?? []];
    this._addRunners(...e), this._unsafeEvalCheck();
  }
  /**
   * Initialize the renderer.
   * @param options - The options to use to create the renderer.
   */
  async init(t = {}) {
    const e = t.skipExtensionImports === !0 ? !0 : t.manageImports === !1;
    await Dp(e), this._addSystems(this.config.systems), this._addPipes(this.config.renderPipes, this.config.renderPipeAdaptors);
    for (const s in this._systemsHash)
      t = { ...this._systemsHash[s].constructor.defaultOptions, ...t };
    t = { ...nc.defaultOptions, ...t }, this._roundPixels = t.roundPixels ? 1 : 0;
    for (let s = 0; s < this.runners.init.items.length; s++)
      await this.runners.init.items[s].init(t);
    this._initOptions = t;
  }
  render(t, e) {
    let s = t;
    if (s instanceof It && (s = { container: s }, e && (K(Q, "passing a second argument is deprecated, please use render options instead"), s.target = e.renderTexture)), s.target || (s.target = this.view.renderTarget), s.target === this.view.renderTarget && (this._lastObjectRendered = s.container, s.clearColor = this.background.colorRgba), s.clearColor) {
      const n = Array.isArray(s.clearColor) && s.clearColor.length === 4;
      s.clearColor = n ? s.clearColor : ft.shared.setValue(s.clearColor).toArray();
    }
    s.transform || (s.container.updateLocalTransform(), s.transform = s.container.localTransform), this.runners.prerender.emit(s), this.runners.renderStart.emit(s), this.runners.render.emit(s), this.runners.renderEnd.emit(s), this.runners.postrender.emit(s);
  }
  /**
   * Resizes the WebGL view to the specified width and height.
   * @param desiredScreenWidth - The desired width of the screen.
   * @param desiredScreenHeight - The desired height of the screen.
   * @param resolution - The resolution / device pixel ratio of the renderer.
   */
  resize(t, e, s) {
    const n = this.view.resolution;
    this.view.resize(t, e, s), this.emit("resize", this.view.screen.width, this.view.screen.height, this.view.resolution), s !== void 0 && s !== n && this.runners.resolutionChange.emit(s);
  }
  clear(t = {}) {
    const e = this;
    t.target || (t.target = e.renderTarget.renderTarget), t.clearColor || (t.clearColor = this.background.colorRgba), t.clear ?? (t.clear = sc.ALL);
    const { clear: s, clearColor: n, target: r } = t;
    ft.shared.setValue(n ?? this.background.colorRgba), e.renderTarget.clear(r, s, ft.shared.toArray());
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
      this.runners[e] = new rf(e);
    });
  }
  _addSystems(t) {
    let e;
    for (e in t) {
      const s = t[e];
      this._addSystem(s.value, s.name);
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
    const s = new t(this);
    if (this[e])
      throw new Error(`Whoops! The name "${e}" is already in use`);
    this[e] = s, this._systemsHash[e] = s;
    for (const n in this.runners)
      this.runners[n].add(s);
    return this;
  }
  _addPipes(t, e) {
    const s = e.reduce((n, r) => (n[r.name] = r.value, n), {});
    t.forEach((n) => {
      const r = n.value, o = n.name, a = s[o];
      this.renderPipes[o] = new r(
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
    if (!Up())
      throw new Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.");
  }
};
rc.defaultOptions = {
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
let oc = rc, sn;
function of(i) {
  return sn !== void 0 || (sn = (() => {
    var t;
    const e = {
      stencil: !0,
      failIfMajorPerformanceCaveat: i ?? oc.defaultOptions.failIfMajorPerformanceCaveat
    };
    try {
      if (!at.get().getWebGLRenderingContext())
        return !1;
      let s = at.get().createCanvas().getContext("webgl", e);
      const n = !!((t = s == null ? void 0 : s.getContextAttributes()) != null && t.stencil);
      if (s) {
        const r = s.getExtension("WEBGL_lose_context");
        r && r.loseContext();
      }
      return s = null, n;
    } catch {
      return !1;
    }
  })()), sn;
}
let rn;
async function af(i = {}) {
  return rn !== void 0 || (rn = await (async () => {
    const t = at.get().getNavigator().gpu;
    if (!t)
      return !1;
    try {
      return await (await t.requestAdapter(i)).requestDevice(), !0;
    } catch {
      return !1;
    }
  })()), rn;
}
const Ba = ["webgl", "webgpu", "canvas"];
async function lf(i) {
  let t = [];
  i.preference ? (t.push(i.preference), Ba.forEach((r) => {
    r !== i.preference && t.push(r);
  })) : t = Ba.slice();
  let e, s = {};
  for (let r = 0; r < t.length; r++) {
    const o = t[r];
    if (o === "webgpu" && await af()) {
      const { WebGPURenderer: a } = await import("./WebGPURenderer-DAsg-VJu-BzQf1-bn.js");
      e = a, s = { ...i, ...i.webgpu };
      break;
    } else if (o === "webgl" && of(
      i.failIfMajorPerformanceCaveat ?? oc.defaultOptions.failIfMajorPerformanceCaveat
    )) {
      const { WebGLRenderer: a } = await import("./WebGLRenderer-Btb-saB4-B8WzfHI6.js");
      e = a, s = { ...i, ...i.webgl };
      break;
    } else if (o === "canvas")
      throw s = { ...i }, new Error("CanvasRenderer is not yet implemented");
  }
  if (delete s.webgpu, delete s.webgl, !e)
    throw new Error("No available renderer for the current environment");
  const n = new e();
  return await n.init(s), n;
}
const ac = "8.5.2";
class lc {
  static init() {
    var t;
    (t = globalThis.__PIXI_APP_INIT__) == null || t.call(globalThis, this, ac);
  }
  static destroy() {
  }
}
lc.extension = z.Application;
class hf {
  constructor(t) {
    this._renderer = t;
  }
  init() {
    var t;
    (t = globalThis.__PIXI_RENDERER_INIT__) == null || t.call(globalThis, this._renderer, ac);
  }
  destroy() {
    this._renderer = null;
  }
}
hf.extension = {
  type: [
    z.WebGLSystem,
    z.WebGPUSystem
  ],
  name: "initHook",
  priority: -10
};
const hc = class Wn {
  /** @ignore */
  constructor(...t) {
    this.stage = new It(), t[0] !== void 0 && K(Q, "Application constructor options are deprecated, please use Application.init() instead.");
  }
  /**
   * @param options - The optional application and renderer parameters.
   */
  async init(t) {
    t = { ...t }, this.renderer = await lf(t), Wn._plugins.forEach((e) => {
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
    return K(Q, "Application.view is deprecated, please use Application.canvas instead."), this.renderer.canvas;
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
    const s = Wn._plugins.slice(0);
    s.reverse(), s.forEach((n) => {
      n.destroy.call(this);
    }), this.stage.destroy(e), this.stage = null, this.renderer.destroy(t), this.renderer = null;
  }
};
hc._plugins = [];
let cc = hc;
kt.handleByList(z.Application, cc._plugins);
kt.add(lc);
class uc extends Et {
  constructor() {
    super(...arguments), this.chars = /* @__PURE__ */ Object.create(null), this.lineHeight = 0, this.fontFamily = "", this.fontMetrics = { fontSize: 0, ascent: 0, descent: 0 }, this.baseLineOffset = 0, this.distanceField = { type: "none", range: 0 }, this.pages = [], this.applyFillAsTint = !0, this.baseMeasurementFontSize = 100, this.baseRenderedFontSize = 100;
  }
  /**
   * The name of the font face.
   * @deprecated since 8.0.0 Use `fontFamily` instead.
   */
  get font() {
    return K(Q, "BitmapFont.font is deprecated, please use BitmapFont.fontFamily instead."), this.fontFamily;
  }
  /**
   * The map of base page textures (i.e., sheets of glyphs).
   * @deprecated since 8.0.0 Use `pages` instead.
   */
  get pageTextures() {
    return K(Q, "BitmapFont.pageTextures is deprecated, please use BitmapFont.pages instead."), this.pages;
  }
  /**
   * The size of the font face in pixels.
   * @deprecated since 8.0.0 Use `fontMetrics.fontSize` instead.
   */
  get size() {
    return K(Q, "BitmapFont.size is deprecated, please use BitmapFont.fontMetrics.fontSize instead."), this.fontMetrics.fontSize;
  }
  /**
   * The kind of distance field for this font or "none".
   * @deprecated since 8.0.0 Use `distanceField.type` instead.
   */
  get distanceFieldRange() {
    return K(Q, "BitmapFont.distanceFieldRange is deprecated, please use BitmapFont.distanceField.range instead."), this.distanceField.range;
  }
  /**
   * The range of the distance field in pixels.
   * @deprecated since 8.0.0 Use `distanceField.range` instead.
   */
  get distanceFieldType() {
    return K(Q, "BitmapFont.distanceFieldType is deprecated, please use BitmapFont.distanceField.type instead."), this.distanceField.type;
  }
  destroy(t = !1) {
    var e;
    this.emit("destroy", this), this.removeAllListeners();
    for (const s in this.chars)
      (e = this.chars[s].texture) == null || e.destroy();
    this.chars = null, t && (this.pages.forEach((s) => s.texture.destroy(!0)), this.pages = null);
  }
}
const dc = class Xn {
  constructor(t, e, s, n) {
    this.uid = xt("fillGradient"), this.type = "linear", this.gradientStops = [], this._styleKey = null, this.x0 = t, this.y0 = e, this.x1 = s, this.y1 = n;
  }
  addColorStop(t, e) {
    return this.gradientStops.push({ offset: t, color: ft.shared.setValue(e).toHexa() }), this._styleKey = null, this;
  }
  // TODO move to the system!
  buildLinearGradient() {
    const t = Xn.defaultTextureSize, { gradientStops: e } = this, s = at.get().createCanvas();
    s.width = t, s.height = t;
    const n = s.getContext("2d"), r = n.createLinearGradient(0, 0, Xn.defaultTextureSize, 1);
    for (let m = 0; m < e.length; m++) {
      const g = e[m];
      r.addColorStop(g.offset, g.color);
    }
    n.fillStyle = r, n.fillRect(0, 0, t, t), this.texture = new H({
      source: new Ui({
        resource: s,
        addressModeU: "clamp-to-edge",
        addressModeV: "repeat"
      })
    });
    const { x0: o, y0: a, x1: l, y1: c } = this, h = new X(), f = l - o, p = c - a, u = Math.sqrt(f * f + p * p), d = Math.atan2(p, f);
    h.translate(-o, -a), h.scale(1 / t, 1 / t), h.rotate(-d), h.scale(256 / u, 1), this.transform = h, this._styleKey = null;
  }
  get styleKey() {
    if (this._styleKey)
      return this._styleKey;
    const t = this.gradientStops.map((n) => `${n.offset}-${n.color}`).join("-"), e = this.texture.uid, s = this.transform.toArray().join("-");
    return `fill-gradient-${this.uid}-${t}-${e}-${s}-${this.x0}-${this.y0}-${this.x1}-${this.y1}`;
  }
};
dc.defaultTextureSize = 256;
let As = dc;
const Ra = {
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
class Mr {
  constructor(t, e) {
    this.uid = xt("fillPattern"), this.transform = new X(), this._styleKey = null, this.texture = t, this.transform.scale(
      1 / t.frame.width,
      1 / t.frame.height
    ), e && (t.source.style.addressModeU = Ra[e].addressModeU, t.source.style.addressModeV = Ra[e].addressModeV);
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
var cf = df, nn = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0 }, uf = /([astvzqmhlc])([^astvzqmhlc]*)/ig;
function df(i) {
  var t = [];
  return i.replace(uf, function(e, s, n) {
    var r = s.toLowerCase();
    for (n = ff(n), r == "m" && n.length > 2 && (t.push([s].concat(n.splice(0, 2))), r = "l", s = s == "m" ? "l" : "L"); ; ) {
      if (n.length == nn[r])
        return n.unshift(s), t.push(n);
      if (n.length < nn[r]) throw new Error("malformed path data");
      t.push([s].concat(n.splice(0, nn[r])));
    }
  }), t;
}
var pf = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig;
function ff(i) {
  var t = i.match(pf);
  return t ? t.map(Number) : [];
}
const mf = /* @__PURE__ */ ro(cf);
function gf(i, t) {
  const e = mf(i), s = [];
  let n = null, r = 0, o = 0;
  for (let a = 0; a < e.length; a++) {
    const l = e[a], c = l[0], h = l;
    switch (c) {
      case "M":
        r = h[1], o = h[2], t.moveTo(r, o);
        break;
      case "m":
        r += h[1], o += h[2], t.moveTo(r, o);
        break;
      case "H":
        r = h[1], t.lineTo(r, o);
        break;
      case "h":
        r += h[1], t.lineTo(r, o);
        break;
      case "V":
        o = h[1], t.lineTo(r, o);
        break;
      case "v":
        o += h[1], t.lineTo(r, o);
        break;
      case "L":
        r = h[1], o = h[2], t.lineTo(r, o);
        break;
      case "l":
        r += h[1], o += h[2], t.lineTo(r, o);
        break;
      case "C":
        r = h[5], o = h[6], t.bezierCurveTo(
          h[1],
          h[2],
          h[3],
          h[4],
          r,
          o
        );
        break;
      case "c":
        t.bezierCurveTo(
          r + h[1],
          o + h[2],
          r + h[3],
          o + h[4],
          r + h[5],
          o + h[6]
        ), r += h[5], o += h[6];
        break;
      case "S":
        r = h[3], o = h[4], t.bezierCurveToShort(
          h[1],
          h[2],
          r,
          o
        );
        break;
      case "s":
        t.bezierCurveToShort(
          r + h[1],
          o + h[2],
          r + h[3],
          o + h[4]
        ), r += h[3], o += h[4];
        break;
      case "Q":
        r = h[3], o = h[4], t.quadraticCurveTo(
          h[1],
          h[2],
          r,
          o
        );
        break;
      case "q":
        t.quadraticCurveTo(
          r + h[1],
          o + h[2],
          r + h[3],
          o + h[4]
        ), r += h[3], o += h[4];
        break;
      case "T":
        r = h[1], o = h[2], t.quadraticCurveToShort(
          r,
          o
        );
        break;
      case "t":
        r += h[1], o += h[2], t.quadraticCurveToShort(
          r,
          o
        );
        break;
      case "A":
        r = h[6], o = h[7], t.arcToSvg(
          h[1],
          h[2],
          h[3],
          h[4],
          h[5],
          r,
          o
        );
        break;
      case "a":
        r += h[6], o += h[7], t.arcToSvg(
          h[1],
          h[2],
          h[3],
          h[4],
          h[5],
          r,
          o
        );
        break;
      case "Z":
      case "z":
        t.closePath(), s.length > 0 && (n = s.pop(), n ? (r = n.startX, o = n.startY) : (r = 0, o = 0)), n = null;
        break;
      default:
        dt(`Unknown SVG path command: ${c}`);
    }
    c !== "Z" && c !== "z" && n === null && (n = { startX: r, startY: o }, s.push(n));
  }
  return t;
}
class Eo {
  /**
   * @param x - The X coordinate of the center of this circle
   * @param y - The Y coordinate of the center of this circle
   * @param radius - The radius of the circle
   */
  constructor(t = 0, e = 0, s = 0) {
    this.type = "circle", this.x = t, this.y = e, this.radius = s;
  }
  /**
   * Creates a clone of this Circle instance
   * @returns A copy of the Circle
   */
  clone() {
    return new Eo(this.x, this.y, this.radius);
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
    const s = this.radius * this.radius;
    let n = this.x - t, r = this.y - e;
    return n *= n, r *= r, n + r <= s;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this circle including the stroke.
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @param width - The width of the line to check
   * @returns Whether the x/y coordinates are within this Circle
   */
  strokeContains(t, e, s) {
    if (this.radius === 0)
      return !1;
    const n = this.x - t, r = this.y - e, o = this.radius, a = s / 2, l = Math.sqrt(n * n + r * r);
    return l < o + a && l > o - a;
  }
  /**
   * Returns the framing rectangle of the circle as a Rectangle object
   * @param out
   * @returns The framing rectangle
   */
  getBounds(t) {
    return t = t || new yt(), t.x = this.x - this.radius, t.y = this.y - this.radius, t.width = this.radius * 2, t.height = this.radius * 2, t;
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
  constructor(t = 0, e = 0, s = 0, n = 0) {
    this.type = "ellipse", this.x = t, this.y = e, this.halfWidth = s, this.halfHeight = n;
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
    let s = (t - this.x) / this.halfWidth, n = (e - this.y) / this.halfHeight;
    return s *= s, n *= n, s + n <= 1;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this ellipse including stroke
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @param width
   * @returns Whether the x/y coords are within this ellipse
   */
  strokeContains(t, e, s) {
    const { halfWidth: n, halfHeight: r } = this;
    if (n <= 0 || r <= 0)
      return !1;
    const o = s / 2, a = n - o, l = r - o, c = n + o, h = r + o, f = t - this.x, p = e - this.y, u = f * f / (a * a) + p * p / (l * l), d = f * f / (c * c) + p * p / (h * h);
    return u > 1 && d <= 1;
  }
  /**
   * Returns the framing rectangle of the ellipse as a Rectangle object
   * @param out
   * @returns The framing rectangle
   */
  getBounds(t) {
    return t = t || new yt(), t.x = this.x - this.halfWidth, t.y = this.y - this.halfHeight, t.width = this.halfWidth * 2, t.height = this.halfHeight * 2, t;
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
function yf(i, t, e, s, n, r) {
  const o = i - e, a = t - s, l = n - e, c = r - s, h = o * l + a * c, f = l * l + c * c;
  let p = -1;
  f !== 0 && (p = h / f);
  let u, d;
  p < 0 ? (u = e, d = s) : p > 1 ? (u = n, d = r) : (u = e + p * l, d = s + p * c);
  const m = i - u, g = t - d;
  return m * m + g * g;
}
class cs {
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
      const s = [];
      for (let n = 0, r = e.length; n < r; n++)
        s.push(e[n].x, e[n].y);
      e = s;
    }
    this.points = e, this.closePath = !0;
  }
  /**
   * Creates a clone of this polygon.
   * @returns - A copy of the polygon.
   */
  clone() {
    const t = this.points.slice(), e = new cs(t);
    return e.closePath = this.closePath, e;
  }
  /**
   * Checks whether the x and y coordinates passed to this function are contained within this polygon.
   * @param x - The X coordinate of the point to test.
   * @param y - The Y coordinate of the point to test.
   * @returns - Whether the x/y coordinates are within this polygon.
   */
  contains(t, e) {
    let s = !1;
    const n = this.points.length / 2;
    for (let r = 0, o = n - 1; r < n; o = r++) {
      const a = this.points[r * 2], l = this.points[r * 2 + 1], c = this.points[o * 2], h = this.points[o * 2 + 1];
      l > e != h > e && t < (c - a) * ((e - l) / (h - l)) + a && (s = !s);
    }
    return s;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this polygon including the stroke.
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @param strokeWidth - The width of the line to check
   * @returns Whether the x/y coordinates are within this polygon
   */
  strokeContains(t, e, s) {
    const n = s / 2, r = n * n, { points: o } = this, a = o.length - (this.closePath ? 0 : 2);
    for (let l = 0; l < a; l += 2) {
      const c = o[l], h = o[l + 1], f = o[(l + 2) % o.length], p = o[(l + 3) % o.length];
      if (yf(t, e, c, h, f, p) <= r)
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
    t = t || new yt();
    const e = this.points;
    let s = 1 / 0, n = -1 / 0, r = 1 / 0, o = -1 / 0;
    for (let a = 0, l = e.length; a < l; a += 2) {
      const c = e[a], h = e[a + 1];
      s = c < s ? c : s, n = c > n ? c : n, r = h < r ? h : r, o = h > o ? h : o;
    }
    return t.x = s, t.width = n - s, t.y = r, t.height = o - r, t;
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
const Ys = (i, t, e, s, n, r) => {
  const o = i - e, a = t - s, l = Math.sqrt(o * o + a * a);
  return l >= n - r && l <= n + r;
};
class Ro {
  /**
   * @param x - The X coordinate of the upper-left corner of the rounded rectangle
   * @param y - The Y coordinate of the upper-left corner of the rounded rectangle
   * @param width - The overall width of this rounded rectangle
   * @param height - The overall height of this rounded rectangle
   * @param radius - Controls the radius of the rounded corners
   */
  constructor(t = 0, e = 0, s = 0, n = 0, r = 20) {
    this.type = "roundedRectangle", this.x = t, this.y = e, this.width = s, this.height = n, this.radius = r;
  }
  /**
   * Returns the framing rectangle of the rounded rectangle as a Rectangle object
   * @param out - optional rectangle to store the result
   * @returns The framing rectangle
   */
  getBounds(t) {
    return t = t || new yt(), t.x = this.x, t.y = this.y, t.width = this.width, t.height = this.height, t;
  }
  /**
   * Creates a clone of this Rounded Rectangle.
   * @returns - A copy of the rounded rectangle.
   */
  clone() {
    return new Ro(this.x, this.y, this.width, this.height, this.radius);
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
      const s = Math.max(0, Math.min(this.radius, Math.min(this.width, this.height) / 2));
      if (e >= this.y + s && e <= this.y + this.height - s || t >= this.x + s && t <= this.x + this.width - s)
        return !0;
      let n = t - (this.x + s), r = e - (this.y + s);
      const o = s * s;
      if (n * n + r * r <= o || (n = t - (this.x + this.width - s), n * n + r * r <= o) || (r = e - (this.y + this.height - s), n * n + r * r <= o) || (n = t - (this.x + s), n * n + r * r <= o))
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
  strokeContains(t, e, s) {
    const { x: n, y: r, width: o, height: a, radius: l } = this, c = s / 2, h = n + l, f = r + l, p = o - l * 2, u = a - l * 2, d = n + o, m = r + a;
    return (t >= n - c && t <= n + c || t >= d - c && t <= d + c) && e >= f && e <= f + u || (e >= r - c && e <= r + c || e >= m - c && e <= m + c) && t >= h && t <= h + p ? !0 : (
      // Top-left
      t < h && e < f && Ys(t, e, h, f, l, c) || t > d - l && e < f && Ys(t, e, d - l, f, l, c) || t > d - l && e > m - l && Ys(t, e, d - l, m - l, l, c) || t < h && e > m - l && Ys(t, e, h, m - l, l, c)
    );
  }
  toString() {
    return `[pixi.js/math:RoundedRectangle x=${this.x} y=${this.y}width=${this.width} height=${this.height} radius=${this.radius}]`;
  }
}
const xf = [
  "precision mediump float;",
  "void main(void){",
  "float test = 0.1;",
  "%forloop%",
  "gl_FragColor = vec4(0.0);",
  "}"
].join(`
`);
function vf(i) {
  let t = "";
  for (let e = 0; e < i; ++e)
    e > 0 && (t += `
else `), e < i - 1 && (t += `if(test == ${e}.0){}`);
  return t;
}
function bf(i, t) {
  if (i === 0)
    throw new Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");
  const e = t.createShader(t.FRAGMENT_SHADER);
  try {
    for (; ; ) {
      const s = xf.replace(/%forloop%/gi, vf(i));
      if (t.shaderSource(e, s), t.compileShader(e), !t.getShaderParameter(e, t.COMPILE_STATUS))
        i = i / 2 | 0;
      else
        break;
    }
  } finally {
    t.deleteShader(e);
  }
  return i;
}
let mi = null;
function pc() {
  var i;
  if (mi)
    return mi;
  const t = Xh();
  return mi = t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS), mi = bf(
    mi,
    t
  ), (i = t.getExtension("WEBGL_lose_context")) == null || i.loseContext(), mi;
}
const fc = {};
function _f(i, t) {
  let e = 2166136261;
  for (let s = 0; s < t; s++)
    e ^= i[s].uid, e = Math.imul(e, 16777619), e >>>= 0;
  return fc[e] || wf(i, t, e);
}
let on = 0;
function wf(i, t, e) {
  const s = {};
  let n = 0;
  on || (on = pc());
  for (let o = 0; o < on; o++) {
    const a = o < t ? i[o] : H.EMPTY.source;
    s[n++] = a.source, s[n++] = a.style;
  }
  const r = new $s(s);
  return fc[e] = r, r;
}
class Ia {
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
function Oa(i, t) {
  const e = i.byteLength / 8 | 0, s = new Float64Array(i, 0, e);
  new Float64Array(t, 0, e).set(s);
  const n = i.byteLength - e * 8;
  if (n > 0) {
    const r = new Uint8Array(i, e * 8, n);
    new Uint8Array(t, e * 8, n).set(r);
  }
}
const Af = {
  normal: "normal-npm",
  add: "add-npm",
  screen: "screen-npm"
};
var Sf = /* @__PURE__ */ ((i) => (i[i.DISABLED = 0] = "DISABLED", i[i.RENDERING_MASK_ADD = 1] = "RENDERING_MASK_ADD", i[i.MASK_ACTIVE = 2] = "MASK_ACTIVE", i[i.INVERSE_MASK_ACTIVE = 3] = "INVERSE_MASK_ACTIVE", i[i.RENDERING_MASK_REMOVE = 4] = "RENDERING_MASK_REMOVE", i[i.NONE = 5] = "NONE", i))(Sf || {});
function Fa(i, t) {
  return t.alphaMode === "no-premultiply-alpha" && Af[i] || i;
}
class Cf {
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
class Pf {
  constructor() {
    this.renderPipeId = "batch", this.action = "startBatch", this.start = 0, this.size = 0, this.textures = new Cf(), this.blendMode = "normal", this.canBundle = !0;
  }
  destroy() {
    this.textures = null, this.gpuBindGroup = null, this.bindGroup = null, this.batcher = null;
  }
}
const mc = [];
let qn = 0;
function La() {
  return qn > 0 ? mc[--qn] : new Pf();
}
function za(i) {
  mc[qn++] = i;
}
let Qi = 0;
const gc = class tr {
  constructor(t = {}) {
    this.uid = xt("batcher"), this.dirty = !0, this.batchIndex = 0, this.batches = [], this._elements = [], tr.defaultOptions.maxTextures = tr.defaultOptions.maxTextures ?? pc(), t = { ...tr.defaultOptions, ...t };
    const { maxTextures: e, attributesInitialSize: s, indicesInitialSize: n } = t;
    this.attributeBuffer = new Ia(s * 4), this.indexBuffer = new Uint16Array(n), this.maxTextures = e;
  }
  begin() {
    this.elementSize = 0, this.elementStart = 0, this.indexSize = 0, this.attributeSize = 0;
    for (let t = 0; t < this.batchIndex; t++)
      za(this.batches[t]);
    this.batchIndex = 0, this._batchIndexStart = 0, this._batchIndexSize = 0, this.dirty = !0;
  }
  add(t) {
    this._elements[this.elementSize++] = t, t._indexStart = this.indexSize, t._attributeStart = this.attributeSize, t._batcher = this, this.indexSize += t.indexSize, this.attributeSize += t.attributeSize * this.vertexSize;
  }
  checkAndUpdateTexture(t, e) {
    const s = t._batch.textures.ids[e._source.uid];
    return !s && s !== 0 ? !1 : (t._textureId = s, t.texture = e, !0);
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
    let s = La(), n = s.textures;
    n.clear();
    const r = e[this.elementStart];
    let o = Fa(r.blendMode, r.texture._source);
    this.attributeSize * 4 > this.attributeBuffer.size && this._resizeAttributeBuffer(this.attributeSize * 4), this.indexSize > this.indexBuffer.length && this._resizeIndexBuffer(this.indexSize);
    const a = this.attributeBuffer.float32View, l = this.attributeBuffer.uint32View, c = this.indexBuffer;
    let h = this._batchIndexSize, f = this._batchIndexStart, p = "startBatch";
    const u = this.maxTextures;
    for (let d = this.elementStart; d < this.elementSize; ++d) {
      const m = e[d];
      e[d] = null;
      const g = m.texture._source, y = Fa(m.blendMode, g), v = o !== y;
      if (g._batchTick === Qi && !v) {
        m._textureId = g._textureBindLocation, h += m.indexSize, m.packAsQuad ? (this.packQuadAttributes(
          m,
          a,
          l,
          m._attributeStart,
          m._textureId
        ), this.packQuadIndex(
          c,
          m._indexStart,
          m._attributeStart / this.vertexSize
        )) : (this.packAttributes(
          m,
          a,
          l,
          m._attributeStart,
          m._textureId
        ), this.packIndex(
          m,
          c,
          m._indexStart,
          m._attributeStart / this.vertexSize
        )), m._batch = s;
        continue;
      }
      g._batchTick = Qi, (n.count >= u || v) && (this._finishBatch(
        s,
        f,
        h - f,
        n,
        o,
        t,
        p
      ), p = "renderBatch", f = h, o = y, s = La(), n = s.textures, n.clear(), ++Qi), m._textureId = g._textureBindLocation = n.count, n.ids[g.uid] = n.count, n.textures[n.count++] = g, m._batch = s, h += m.indexSize, m.packAsQuad ? (this.packQuadAttributes(
        m,
        a,
        l,
        m._attributeStart,
        m._textureId
      ), this.packQuadIndex(
        c,
        m._indexStart,
        m._attributeStart / this.vertexSize
      )) : (this.packAttributes(
        m,
        a,
        l,
        m._attributeStart,
        m._textureId
      ), this.packIndex(
        m,
        c,
        m._indexStart,
        m._attributeStart / this.vertexSize
      ));
    }
    n.count > 0 && (this._finishBatch(
      s,
      f,
      h - f,
      n,
      o,
      t,
      p
    ), f = h, ++Qi), this.elementStart = this.elementSize, this._batchIndexStart = f, this._batchIndexSize = h;
  }
  _finishBatch(t, e, s, n, r, o, a) {
    t.gpuBindGroup = null, t.bindGroup = null, t.action = a, t.batcher = this, t.textures = n, t.blendMode = r, t.start = e, t.size = s, ++Qi, this.batches[this.batchIndex++] = t, o.add(t);
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
    const e = Math.max(t, this.attributeBuffer.size * 2), s = new Ia(e);
    Oa(this.attributeBuffer.rawBinaryData, s.rawBinaryData), this.attributeBuffer = s;
  }
  _resizeIndexBuffer(t) {
    const e = this.indexBuffer;
    let s = Math.max(t, e.length * 1.5);
    s += s % 2;
    const n = s > 65535 ? new Uint32Array(s) : new Uint16Array(s);
    if (n.BYTES_PER_ELEMENT !== e.BYTES_PER_ELEMENT)
      for (let r = 0; r < e.length; r++)
        n[r] = e[r];
    else
      Oa(e.buffer, n.buffer);
    this.indexBuffer = n;
  }
  packQuadIndex(t, e, s) {
    t[e] = s + 0, t[e + 1] = s + 1, t[e + 2] = s + 2, t[e + 3] = s + 0, t[e + 4] = s + 2, t[e + 5] = s + 3;
  }
  packIndex(t, e, s, n) {
    const r = t.indices, o = t.indexSize, a = t.indexOffset, l = t.attributeOffset;
    for (let c = 0; c < o; c++)
      e[s++] = n + r[c + a] - l;
  }
  destroy() {
    for (let t = 0; t < this.batches.length; t++)
      za(this.batches[t]);
    this.batches = null;
    for (let t = 0; t < this._elements.length; t++)
      this._elements[t]._batch = null;
    this._elements = null, this.indexBuffer = null, this.attributeBuffer.destroy(), this.attributeBuffer = null;
  }
};
gc.defaultOptions = {
  maxTextures: null,
  attributesInitialSize: 4,
  indicesInitialSize: 6
};
let Mf = gc;
var Ft = /* @__PURE__ */ ((i) => (i[i.MAP_READ = 1] = "MAP_READ", i[i.MAP_WRITE = 2] = "MAP_WRITE", i[i.COPY_SRC = 4] = "COPY_SRC", i[i.COPY_DST = 8] = "COPY_DST", i[i.INDEX = 16] = "INDEX", i[i.VERTEX = 32] = "VERTEX", i[i.UNIFORM = 64] = "UNIFORM", i[i.STORAGE = 128] = "STORAGE", i[i.INDIRECT = 256] = "INDIRECT", i[i.QUERY_RESOLVE = 512] = "QUERY_RESOLVE", i[i.STATIC = 1024] = "STATIC", i))(Ft || {});
class Ss extends Et {
  /**
   * Creates a new Buffer with the given options
   * @param options - the options for the buffer
   */
  constructor(t) {
    let { data: e, size: s } = t;
    const { usage: n, label: r, shrinkToFit: o } = t;
    super(), this.uid = xt("buffer"), this._resourceType = "buffer", this._resourceId = xt("resource"), this._touched = 0, this._updateID = 1, this.shrinkToFit = !0, this.destroyed = !1, e instanceof Array && (e = new Float32Array(e)), this._data = e, s = s ?? (e == null ? void 0 : e.byteLength);
    const a = !!e;
    this.descriptor = {
      size: s,
      usage: n,
      mappedAtCreation: a,
      label: r
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
    return !!(this.descriptor.usage & Ft.STATIC);
  }
  set static(t) {
    t ? this.descriptor.usage |= Ft.STATIC : this.descriptor.usage &= ~Ft.STATIC;
  }
  /**
   * Sets the data in the buffer to the given value. This will immediately update the buffer on the GPU.
   * If you only want to update a subset of the buffer, you can pass in the size of the data.
   * @param value - the data to set
   * @param size - the size of the data in bytes
   * @param syncGPU - should the buffer be updated on the GPU immediately?
   */
  setDataWithSize(t, e, s) {
    if (this._updateID++, this._updateSize = e * t.BYTES_PER_ELEMENT, this._data === t) {
      s && this.emit("update", this);
      return;
    }
    const n = this._data;
    if (this._data = t, n.length !== t.length) {
      !this.shrinkToFit && t.byteLength < n.byteLength ? s && this.emit("update", this) : (this.descriptor.size = t.byteLength, this._resourceId = xt("resource"), this.emit("change", this));
      return;
    }
    s && this.emit("update", this);
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
function yc(i, t) {
  if (!(i instanceof Ss)) {
    let e = t ? Ft.INDEX : Ft.VERTEX;
    i instanceof Array && (t ? (i = new Uint32Array(i), e = Ft.INDEX | Ft.COPY_DST) : (i = new Float32Array(i), e = Ft.VERTEX | Ft.COPY_DST)), i = new Ss({
      data: i,
      label: t ? "index-mesh-buffer" : "vertex-mesh-buffer",
      usage: e
    });
  }
  return i;
}
function Tf(i, t, e) {
  const s = i.getAttribute(t);
  if (!s)
    return e.minX = 0, e.minY = 0, e.maxX = 0, e.maxY = 0, e;
  const n = s.buffer.data;
  let r = 1 / 0, o = 1 / 0, a = -1 / 0, l = -1 / 0;
  const c = n.BYTES_PER_ELEMENT, h = (s.offset || 0) / c, f = (s.stride || 2 * 4) / c;
  for (let p = h; p < n.length; p += f) {
    const u = n[p], d = n[p + 1];
    u > a && (a = u), d > l && (l = d), u < r && (r = u), d < o && (o = d);
  }
  return e.minX = r, e.minY = o, e.maxX = a, e.maxY = l, e;
}
function kf(i) {
  return (i instanceof Ss || Array.isArray(i) || i.BYTES_PER_ELEMENT) && (i = {
    buffer: i
  }), i.buffer = yc(i.buffer, !1), i;
}
class Ef extends Et {
  /**
   * Create a new instance of a geometry
   * @param options - The options for the geometry.
   */
  constructor(t = {}) {
    super(), this.uid = xt("geometry"), this._layoutKey = 0, this.instanceCount = 1, this._bounds = new _e(), this._boundsDirty = !0;
    const { attributes: e, indexBuffer: s, topology: n } = t;
    if (this.buffers = [], this.attributes = {}, e)
      for (const r in e)
        this.addAttribute(r, e[r]);
    this.instanceCount = t.instanceCount || 1, s && this.addIndex(s), this.topology = n || "triangle-list";
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
    const s = kf(e);
    this.buffers.indexOf(s.buffer) === -1 && (this.buffers.push(s.buffer), s.buffer.on("update", this.onBufferUpdate, this), s.buffer.on("change", this.onBufferUpdate, this)), this.attributes[t] = s;
  }
  /**
   * Adds an index buffer to the geometry.
   * @param indexBuffer - The index buffer to add. Can be a Buffer, TypedArray, or an array of numbers.
   */
  addIndex(t) {
    this.indexBuffer = yc(t, !0), this.buffers.push(this.indexBuffer);
  }
  /** Returns the bounds of the geometry. */
  get bounds() {
    return this._boundsDirty ? (this._boundsDirty = !1, Tf(this, "aPosition", this._bounds)) : this._bounds;
  }
  /**
   * destroys the geometry.
   * @param destroyBuffers - destroy the buffers associated with this geometry
   */
  destroy(t = !1) {
    this.emit("destroy", this), this.removeAllListeners(), t && this.buffers.forEach((e) => e.destroy()), this.attributes = null, this.buffers = null, this.indexBuffer = null, this._bounds = null;
  }
}
const Bf = new Float32Array(1), Rf = new Uint32Array(1);
class If extends Ef {
  constructor() {
    const t = new Ss({
      data: Bf,
      label: "attribute-batch-buffer",
      usage: Ft.VERTEX | Ft.COPY_DST,
      shrinkToFit: !1
    }), e = new Ss({
      data: Rf,
      label: "index-batch-buffer",
      usage: Ft.INDEX | Ft.COPY_DST,
      // | BufferUsage.STATIC,
      shrinkToFit: !1
    }), s = 6 * 4;
    super({
      attributes: {
        aPosition: {
          buffer: t,
          format: "float32x2",
          stride: s,
          offset: 0
        },
        aUV: {
          buffer: t,
          format: "float32x2",
          stride: s,
          offset: 2 * 4
        },
        aColor: {
          buffer: t,
          format: "unorm8x4",
          stride: s,
          offset: 4 * 4
        },
        aTextureIdAndRound: {
          buffer: t,
          format: "uint16x2",
          stride: s,
          offset: 5 * 4
        }
      },
      indexBuffer: e
    });
  }
}
function Da(i, t, e) {
  if (i)
    for (const s in i) {
      const n = s.toLocaleLowerCase(), r = t[n];
      if (r) {
        let o = i[s];
        s === "header" && (o = o.replace(/@in\s+[^;]+;\s*/g, "").replace(/@out\s+[^;]+;\s*/g, "")), e && r.push(`//----${e}----//`), r.push(o);
      } else
        dt(`${s} placement hook does not exist in shader`);
    }
}
const Of = /\{\{(.*?)\}\}/g;
function Ua(i) {
  var t;
  const e = {};
  return (((t = i.match(Of)) == null ? void 0 : t.map((s) => s.replace(/[{()}]/g, ""))) ?? []).forEach((s) => {
    e[s] = [];
  }), e;
}
function Ga(i, t) {
  let e;
  const s = /@in\s+([^;]+);/g;
  for (; (e = s.exec(i)) !== null; )
    t.push(e[1]);
}
function Va(i, t, e = !1) {
  const s = [];
  Ga(t, s), i.forEach((a) => {
    a.header && Ga(a.header, s);
  });
  const n = s;
  e && n.sort();
  const r = n.map((a, l) => `       @location(${l}) ${a},`).join(`
`);
  let o = t.replace(/@in\s+[^;]+;\s*/g, "");
  return o = o.replace("{{in}}", `
${r}
`), o;
}
function Na(i, t) {
  let e;
  const s = /@out\s+([^;]+);/g;
  for (; (e = s.exec(i)) !== null; )
    t.push(e[1]);
}
function Ff(i) {
  const t = /\b(\w+)\s*:/g.exec(i);
  return t ? t[1] : "";
}
function Lf(i) {
  const t = /@.*?\s+/g;
  return i.replace(t, "");
}
function zf(i, t) {
  const e = [];
  Na(t, e), i.forEach((l) => {
    l.header && Na(l.header, e);
  });
  let s = 0;
  const n = e.sort().map((l) => l.indexOf("builtin") > -1 ? l : `@location(${s++}) ${l}`).join(`,
`), r = e.sort().map((l) => `       var ${Lf(l)};`).join(`
`), o = `return VSOutput(
                ${e.sort().map((l) => ` ${Ff(l)}`).join(`,
`)});`;
  let a = t.replace(/@out\s+[^;]+;\s*/g, "");
  return a = a.replace("{{struct}}", `
${n}
`), a = a.replace("{{start}}", `
${r}
`), a = a.replace("{{return}}", `
${o}
`), a;
}
function Ha(i, t) {
  let e = i;
  for (const s in t) {
    const n = t[s];
    n.join(`
`).length ? e = e.replace(`{{${s}}}`, `//-----${s} START-----//
${n.join(`
`)}
//----${s} FINISH----//`) : e = e.replace(`{{${s}}}`, "");
  }
  return e;
}
const ti = /* @__PURE__ */ Object.create(null), an = /* @__PURE__ */ new Map();
let Df = 0;
function Uf({
  template: i,
  bits: t
}) {
  const e = xc(i, t);
  if (ti[e])
    return ti[e];
  const { vertex: s, fragment: n } = Vf(i, t);
  return ti[e] = vc(s, n, t), ti[e];
}
function Gf({
  template: i,
  bits: t
}) {
  const e = xc(i, t);
  return ti[e] || (ti[e] = vc(i.vertex, i.fragment, t)), ti[e];
}
function Vf(i, t) {
  const e = t.map((o) => o.vertex).filter((o) => !!o), s = t.map((o) => o.fragment).filter((o) => !!o);
  let n = Va(e, i.vertex, !0);
  n = zf(e, n);
  const r = Va(s, i.fragment, !0);
  return {
    vertex: n,
    fragment: r
  };
}
function xc(i, t) {
  return t.map((e) => (an.has(e) || an.set(e, Df++), an.get(e))).sort((e, s) => e - s).join("-") + i.vertex + i.fragment;
}
function vc(i, t, e) {
  const s = Ua(i), n = Ua(t);
  return e.forEach((r) => {
    Da(r.vertex, s, r.name), Da(r.fragment, n, r.name);
  }), {
    vertex: Ha(i, s),
    fragment: Ha(t, n)
  };
}
const Nf = (
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
), Hf = (
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
), jf = (
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
), Yf = (
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
), Wf = {
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
}, Xf = {
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
function qf({ bits: i, name: t }) {
  const e = Uf({
    template: {
      fragment: Hf,
      vertex: Nf
    },
    bits: [
      Wf,
      ...i
    ]
  });
  return Sr.from({
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
function Kf({ bits: i, name: t }) {
  return new Kh({
    name: t,
    ...Gf({
      template: {
        vertex: jf,
        fragment: Yf
      },
      bits: [
        Xf,
        ...i
      ]
    })
  });
}
const Qf = {
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
}, Zf = {
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
}, ln = {};
function Jf(i) {
  const t = [];
  if (i === 1)
    t.push("@group(1) @binding(0) var textureSource1: texture_2d<f32>;"), t.push("@group(1) @binding(1) var textureSampler1: sampler;");
  else {
    let e = 0;
    for (let s = 0; s < i; s++)
      t.push(`@group(1) @binding(${e++}) var textureSource${s + 1}: texture_2d<f32>;`), t.push(`@group(1) @binding(${e++}) var textureSampler${s + 1}: sampler;`);
  }
  return t.join(`
`);
}
function $f(i) {
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
function tm(i) {
  return ln[i] || (ln[i] = {
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

                ${Jf(i)}
            `,
      main: `
                var uvDx = dpdx(vUV);
                var uvDy = dpdy(vUV);

                ${$f(i)}
            `
    }
  }), ln[i];
}
const hn = {};
function em(i) {
  const t = [];
  for (let e = 0; e < i; e++)
    e > 0 && t.push("else"), e < i - 1 && t.push(`if(vTextureId < ${e}.5)`), t.push("{"), t.push(`	outColor = texture(uTextures[${e}], vUV);`), t.push("}");
  return t.join(`
`);
}
function im(i) {
  return hn[i] || (hn[i] = {
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

                ${em(i)}
            `
    }
  }), hn[i];
}
const sm = {
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
}, rm = {
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
}, ja = {};
function nm(i) {
  let t = ja[i];
  if (t)
    return t;
  const e = new Int32Array(i);
  for (let s = 0; s < i; s++)
    e[s] = s;
  return t = ja[i] = new $h({
    uTextures: { value: e, type: "i32", size: i }
  }, { isStatic: !0 }), t;
}
class om extends To {
  constructor(t) {
    const e = Kf({
      name: "batch",
      bits: [
        Zf,
        im(t),
        rm
      ]
    }), s = qf({
      name: "batch",
      bits: [
        Qf,
        tm(t),
        sm
      ]
    });
    super({
      glProgram: e,
      gpuProgram: s,
      resources: {
        batchSamplers: nm(t)
      }
    });
  }
}
let Ya = null;
const bc = class _c extends Mf {
  constructor() {
    super(...arguments), this.geometry = new If(), this.shader = Ya || (Ya = new om(this.maxTextures)), this.name = _c.extension.name, this.vertexSize = 6;
  }
  /**
   * Packs the attributes of a DefaultBatchableMeshElement into the provided views.
   * @param element - The DefaultBatchableMeshElement to pack.
   * @param float32View - The Float32Array view to pack into.
   * @param uint32View - The Uint32Array view to pack into.
   * @param index - The starting index in the views.
   * @param textureId - The texture ID to use.
   */
  packAttributes(t, e, s, n, r) {
    const o = r << 16 | t.roundPixels & 65535, a = t.transform, l = a.a, c = a.b, h = a.c, f = a.d, p = a.tx, u = a.ty, { positions: d, uvs: m } = t, g = t.color, y = t.attributeOffset, v = y + t.attributeSize;
    for (let _ = y; _ < v; _++) {
      const w = _ * 2, x = d[w], A = d[w + 1];
      e[n++] = l * x + h * A + p, e[n++] = f * A + c * x + u, e[n++] = m[w], e[n++] = m[w + 1], s[n++] = g, s[n++] = o;
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
  packQuadAttributes(t, e, s, n, r) {
    const o = t.texture, a = t.transform, l = a.a, c = a.b, h = a.c, f = a.d, p = a.tx, u = a.ty, d = t.bounds, m = d.maxX, g = d.minX, y = d.maxY, v = d.minY, _ = o.uvs, w = t.color, x = r << 16 | t.roundPixels & 65535;
    e[n + 0] = l * g + h * v + p, e[n + 1] = f * v + c * g + u, e[n + 2] = _.x0, e[n + 3] = _.y0, s[n + 4] = w, s[n + 5] = x, e[n + 6] = l * m + h * v + p, e[n + 7] = f * v + c * m + u, e[n + 8] = _.x1, e[n + 9] = _.y1, s[n + 10] = w, s[n + 11] = x, e[n + 12] = l * m + h * y + p, e[n + 13] = f * y + c * m + u, e[n + 14] = _.x2, e[n + 15] = _.y2, s[n + 16] = w, s[n + 17] = x, e[n + 18] = l * g + h * y + p, e[n + 19] = f * y + c * g + u, e[n + 20] = _.x3, e[n + 21] = _.y3, s[n + 22] = w, s[n + 23] = x;
  }
};
bc.extension = {
  type: [
    z.Batcher
  ],
  name: "default"
};
let am = bc;
function lm(i, t, e, s, n, r, o, a = null) {
  let l = 0;
  e *= t, n *= r;
  const c = a.a, h = a.b, f = a.c, p = a.d, u = a.tx, d = a.ty;
  for (; l < o; ) {
    const m = i[e], g = i[e + 1];
    s[n] = c * m + f * g + u, s[n + 1] = h * m + p * g + d, n += r, e += t, l++;
  }
}
function hm(i, t, e, s) {
  let n = 0;
  for (t *= e; n < s; )
    i[t] = 0, i[t + 1] = 0, t += e, n++;
}
function wc(i, t, e, s, n) {
  const r = t.a, o = t.b, a = t.c, l = t.d, c = t.tx, h = t.ty;
  e = e || 0, s = s || 2, n = n || i.length / s - e;
  let f = e * s;
  for (let p = 0; p < n; p++) {
    const u = i[f], d = i[f + 1];
    i[f] = r * u + a * d + c, i[f + 1] = o * u + l * d + h, f += s;
  }
}
function cm(i, t) {
  if (i === 16777215 || !t)
    return t;
  if (t === 16777215 || !i)
    return i;
  const e = i >> 16 & 255, s = i >> 8 & 255, n = i & 255, r = t >> 16 & 255, o = t >> 8 & 255, a = t & 255, l = e * r / 255, c = s * o / 255, h = n * a / 255;
  return (l << 16) + (c << 8) + h;
}
const um = new X();
class Ac {
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
    const t = this.baseColor, e = t >> 16 | t & 65280 | (t & 255) << 16, s = this.renderable;
    return s ? cm(e, s.groupColor) + (this.alpha * s.groupAlpha * 255 << 24) : e + (this.alpha * 255 << 24);
  }
  get transform() {
    var t;
    return ((t = this.renderable) == null ? void 0 : t.groupTransform) || um;
  }
  copyTo(t) {
    t.indexOffset = this.indexOffset, t.indexSize = this.indexSize, t.attributeOffset = this.attributeOffset, t.attributeSize = this.attributeSize, t.baseColor = this.baseColor, t.alpha = this.alpha, t.texture = this.texture, t.geometryData = this.geometryData;
  }
  reset() {
    this.applyTransform = !0, this.renderable = null;
  }
}
const Cs = {
  extension: {
    type: z.ShapeBuilder,
    name: "circle"
  },
  build(i, t) {
    let e, s, n, r, o, a;
    if (i.type === "circle") {
      const w = i;
      e = w.x, s = w.y, o = a = w.radius, n = r = 0;
    } else if (i.type === "ellipse") {
      const w = i;
      e = w.x, s = w.y, o = w.halfWidth, a = w.halfHeight, n = r = 0;
    } else {
      const w = i, x = w.width / 2, A = w.height / 2;
      e = w.x + x, s = w.y + A, o = a = Math.max(0, Math.min(w.radius, Math.min(x, A))), n = x - o, r = A - a;
    }
    if (!(o >= 0 && a >= 0 && n >= 0 && r >= 0))
      return t;
    const l = Math.ceil(2.3 * Math.sqrt(o + a)), c = l * 8 + (n ? 4 : 0) + (r ? 4 : 0);
    if (c === 0)
      return t;
    if (l === 0)
      return t[0] = t[6] = e + n, t[1] = t[3] = s + r, t[2] = t[4] = e - n, t[5] = t[7] = s - r, t;
    let h = 0, f = l * 4 + (n ? 2 : 0) + 2, p = f, u = c, d = n + o, m = r, g = e + d, y = e - d, v = s + m;
    if (t[h++] = g, t[h++] = v, t[--f] = v, t[--f] = y, r) {
      const w = s - m;
      t[p++] = y, t[p++] = w, t[--u] = w, t[--u] = g;
    }
    for (let w = 1; w < l; w++) {
      const x = Math.PI / 2 * (w / l), A = n + Math.cos(x) * o, S = r + Math.sin(x) * a, b = e + A, C = e - A, P = s + S, M = s - S;
      t[h++] = b, t[h++] = P, t[--f] = P, t[--f] = C, t[p++] = C, t[p++] = M, t[--u] = M, t[--u] = b;
    }
    d = n, m = r + a, g = e + d, y = e - d, v = s + m;
    const _ = s - m;
    return t[h++] = g, t[h++] = v, t[--u] = _, t[--u] = g, n && (t[h++] = y, t[h++] = v, t[--u] = _, t[--u] = y), t;
  },
  triangulate(i, t, e, s, n, r) {
    if (i.length === 0)
      return;
    let o = 0, a = 0;
    for (let h = 0; h < i.length; h += 2)
      o += i[h], a += i[h + 1];
    o /= i.length / 2, a /= i.length / 2;
    let l = s;
    t[l * e] = o, t[l * e + 1] = a;
    const c = l++;
    for (let h = 0; h < i.length; h += 2)
      t[l * e] = i[h], t[l * e + 1] = i[h + 1], h > 0 && (n[r++] = l, n[r++] = c, n[r++] = l - 1), l++;
    n[r++] = c + 1, n[r++] = c, n[r++] = l - 1;
  }
}, dm = { ...Cs, extension: { ...Cs.extension, name: "ellipse" } }, pm = { ...Cs, extension: { ...Cs.extension, name: "roundedRectangle" } }, fm = 1e-4, Wa = 1e-4;
function mm(i) {
  const t = i.length;
  if (t < 6)
    return 1;
  let e = 0;
  for (let s = 0, n = i[t - 2], r = i[t - 1]; s < t; s += 2) {
    const o = i[s], a = i[s + 1];
    e += (o - n) * (a + r), n = o, r = a;
  }
  return e < 0 ? -1 : 1;
}
function Xa(i, t, e, s, n, r, o, a) {
  const l = i - e * n, c = t - s * n, h = i + e * r, f = t + s * r;
  let p, u;
  o ? (p = s, u = -e) : (p = -s, u = e);
  const d = l + p, m = c + u, g = h + p, y = f + u;
  return a.push(d, m), a.push(g, y), 2;
}
function Ye(i, t, e, s, n, r, o, a) {
  const l = e - i, c = s - t;
  let h = Math.atan2(l, c), f = Math.atan2(n - i, r - t);
  a && h < f ? h += Math.PI * 2 : !a && h > f && (f += Math.PI * 2);
  let p = h;
  const u = f - h, d = Math.abs(u), m = Math.sqrt(l * l + c * c), g = (15 * d * Math.sqrt(m) / Math.PI >> 0) + 1, y = u / g;
  if (p += y, a) {
    o.push(i, t), o.push(e, s);
    for (let v = 1, _ = p; v < g; v++, _ += y)
      o.push(i, t), o.push(
        i + Math.sin(_) * m,
        t + Math.cos(_) * m
      );
    o.push(i, t), o.push(n, r);
  } else {
    o.push(e, s), o.push(i, t);
    for (let v = 1, _ = p; v < g; v++, _ += y)
      o.push(
        i + Math.sin(_) * m,
        t + Math.cos(_) * m
      ), o.push(i, t);
    o.push(n, r), o.push(i, t);
  }
  return g * 2;
}
function gm(i, t, e, s, n, r, o, a, l) {
  const c = fm;
  if (i.length === 0)
    return;
  const h = t;
  let f = h.alignment;
  if (t.alignment !== 0.5) {
    let G = mm(i);
    f = (f - 0.5) * G + 0.5;
  }
  const p = new Pt(i[0], i[1]), u = new Pt(i[i.length - 2], i[i.length - 1]), d = s, m = Math.abs(p.x - u.x) < c && Math.abs(p.y - u.y) < c;
  if (d) {
    i = i.slice(), m && (i.pop(), i.pop(), u.set(i[i.length - 2], i[i.length - 1]));
    const G = (p.x + u.x) * 0.5, W = (u.y + p.y) * 0.5;
    i.unshift(G, W), i.push(G, W);
  }
  const g = n, y = i.length / 2;
  let v = i.length;
  const _ = g.length / 2, w = h.width / 2, x = w * w, A = h.miterLimit * h.miterLimit;
  let S = i[0], b = i[1], C = i[2], P = i[3], M = 0, T = 0, k = -(b - P), E = S - C, B = 0, R = 0, I = Math.sqrt(k * k + E * E);
  k /= I, E /= I, k *= w, E *= w;
  const U = f, O = (1 - U) * 2, F = U * 2;
  d || (h.cap === "round" ? v += Ye(
    S - k * (O - F) * 0.5,
    b - E * (O - F) * 0.5,
    S - k * O,
    b - E * O,
    S + k * F,
    b + E * F,
    g,
    !0
  ) + 2 : h.cap === "square" && (v += Xa(S, b, k, E, O, F, !0, g))), g.push(
    S - k * O,
    b - E * O
  ), g.push(
    S + k * F,
    b + E * F
  );
  for (let G = 1; G < y - 1; ++G) {
    S = i[(G - 1) * 2], b = i[(G - 1) * 2 + 1], C = i[G * 2], P = i[G * 2 + 1], M = i[(G + 1) * 2], T = i[(G + 1) * 2 + 1], k = -(b - P), E = S - C, I = Math.sqrt(k * k + E * E), k /= I, E /= I, k *= w, E *= w, B = -(P - T), R = C - M, I = Math.sqrt(B * B + R * R), B /= I, R /= I, B *= w, R *= w;
    const W = C - S, lt = b - P, At = C - M, N = T - P, Ot = W * At + lt * N, ct = lt * At - N * W, ee = ct < 0;
    if (Math.abs(ct) < 1e-3 * Math.abs(Ot)) {
      g.push(
        C - k * O,
        P - E * O
      ), g.push(
        C + k * F,
        P + E * F
      ), Ot >= 0 && (h.join === "round" ? v += Ye(
        C,
        P,
        C - k * O,
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
    const Vt = (-k + S) * (-E + P) - (-k + C) * (-E + b), Nt = (-B + M) * (-R + P) - (-B + C) * (-R + T), mt = (W * Nt - At * Vt) / ct, pi = (N * Vt - lt * Nt) / ct, Hi = (mt - C) * (mt - C) + (pi - P) * (pi - P), we = C + (mt - C) * O, he = P + (pi - P) * O, ce = C - (mt - C) * F, ie = P - (pi - P) * F, se = Math.min(W * W + lt * lt, At * At + N * N), ji = ee ? O : F, Yi = se + ji * ji * x;
    Hi <= Yi ? h.join === "bevel" || Hi / x > A ? (ee ? (g.push(we, he), g.push(C + k * F, P + E * F), g.push(we, he), g.push(C + B * F, P + R * F)) : (g.push(C - k * O, P - E * O), g.push(ce, ie), g.push(C - B * O, P - R * O), g.push(ce, ie)), v += 2) : h.join === "round" ? ee ? (g.push(we, he), g.push(C + k * F, P + E * F), v += Ye(
      C,
      P,
      C + k * F,
      P + E * F,
      C + B * F,
      P + R * F,
      g,
      !0
    ) + 4, g.push(we, he), g.push(C + B * F, P + R * F)) : (g.push(C - k * O, P - E * O), g.push(ce, ie), v += Ye(
      C,
      P,
      C - k * O,
      P - E * O,
      C - B * O,
      P - R * O,
      g,
      !1
    ) + 4, g.push(C - B * O, P - R * O), g.push(ce, ie)) : (g.push(we, he), g.push(ce, ie)) : (g.push(C - k * O, P - E * O), g.push(C + k * F, P + E * F), h.join === "round" ? ee ? v += Ye(
      C,
      P,
      C + k * F,
      P + E * F,
      C + B * F,
      P + R * F,
      g,
      !0
    ) + 2 : v += Ye(
      C,
      P,
      C - k * O,
      P - E * O,
      C - B * O,
      P - R * O,
      g,
      !1
    ) + 2 : h.join === "miter" && Hi / x <= A && (ee ? (g.push(ce, ie), g.push(ce, ie)) : (g.push(we, he), g.push(we, he)), v += 2), g.push(C - B * O, P - R * O), g.push(C + B * F, P + R * F), v += 2);
  }
  S = i[(y - 2) * 2], b = i[(y - 2) * 2 + 1], C = i[(y - 1) * 2], P = i[(y - 1) * 2 + 1], k = -(b - P), E = S - C, I = Math.sqrt(k * k + E * E), k /= I, E /= I, k *= w, E *= w, g.push(C - k * O, P - E * O), g.push(C + k * F, P + E * F), d || (h.cap === "round" ? v += Ye(
    C - k * (O - F) * 0.5,
    P - E * (O - F) * 0.5,
    C - k * O,
    P - E * O,
    C + k * F,
    P + E * F,
    g,
    !1
  ) + 2 : h.cap === "square" && (v += Xa(C, P, k, E, O, F, !1, g)));
  const Z = Wa * Wa;
  for (let G = _; G < v + _ - 2; ++G)
    S = g[G * 2], b = g[G * 2 + 1], C = g[(G + 1) * 2], P = g[(G + 1) * 2 + 1], M = g[(G + 2) * 2], T = g[(G + 2) * 2 + 1], !(Math.abs(S * (P - T) + C * (T - b) + M * (b - P)) < Z) && a.push(G, G + 1, G + 2);
}
function Sc(i, t, e, s, n, r, o) {
  const a = sf(i, t, 2);
  if (!a)
    return;
  for (let c = 0; c < a.length; c += 3)
    r[o++] = a[c] + n, r[o++] = a[c + 1] + n, r[o++] = a[c + 2] + n;
  let l = n * s;
  for (let c = 0; c < i.length; c += 2)
    e[l] = i[c], e[l + 1] = i[c + 1], l += s;
}
const ym = [], xm = {
  extension: {
    type: z.ShapeBuilder,
    name: "polygon"
  },
  build(i, t) {
    for (let e = 0; e < i.points.length; e++)
      t[e] = i.points[e];
    return t;
  },
  triangulate(i, t, e, s, n, r) {
    Sc(i, ym, t, e, s, n, r);
  }
}, vm = {
  extension: {
    type: z.ShapeBuilder,
    name: "rectangle"
  },
  build(i, t) {
    const e = i, s = e.x, n = e.y, r = e.width, o = e.height;
    return r >= 0 && o >= 0 && (t[0] = s, t[1] = n, t[2] = s + r, t[3] = n, t[4] = s + r, t[5] = n + o, t[6] = s, t[7] = n + o), t;
  },
  triangulate(i, t, e, s, n, r) {
    let o = 0;
    s *= e, t[s + o] = i[0], t[s + o + 1] = i[1], o += e, t[s + o] = i[2], t[s + o + 1] = i[3], o += e, t[s + o] = i[6], t[s + o + 1] = i[7], o += e, t[s + o] = i[4], t[s + o + 1] = i[5], o += e;
    const a = s / e;
    n[r++] = a, n[r++] = a + 1, n[r++] = a + 2, n[r++] = a + 1, n[r++] = a + 3, n[r++] = a + 2;
  }
}, bm = {
  extension: {
    type: z.ShapeBuilder,
    name: "triangle"
  },
  build(i, t) {
    return t[0] = i.x, t[1] = i.y, t[2] = i.x2, t[3] = i.y2, t[4] = i.x3, t[5] = i.y3, t;
  },
  triangulate(i, t, e, s, n, r) {
    let o = 0;
    s *= e, t[s + o] = i[0], t[s + o + 1] = i[1], o += e, t[s + o] = i[2], t[s + o + 1] = i[3], o += e, t[s + o] = i[4], t[s + o + 1] = i[5];
    const a = s / e;
    n[r++] = a, n[r++] = a + 1, n[r++] = a + 2;
  }
}, Tr = {};
kt.handleByMap(z.ShapeBuilder, Tr);
kt.add(vm, xm, bm, Cs, dm, pm);
const _m = new yt();
function wm(i, t) {
  const { geometryData: e, batches: s } = t;
  s.length = 0, e.indices.length = 0, e.vertices.length = 0, e.uvs.length = 0;
  for (let n = 0; n < i.instructions.length; n++) {
    const r = i.instructions[n];
    if (r.action === "texture")
      Am(r.data, s, e);
    else if (r.action === "fill" || r.action === "stroke") {
      const o = r.action === "stroke", a = r.data.path.shapePath, l = r.data.style, c = r.data.hole;
      o && c && qa(c.shapePath, l, null, !0, s, e), qa(a, l, c, o, s, e);
    }
  }
}
function Am(i, t, e) {
  const { vertices: s, uvs: n, indices: r } = e, o = r.length, a = s.length / 2, l = [], c = Tr.rectangle, h = _m, f = i.image;
  h.x = i.dx, h.y = i.dy, h.width = i.dw, h.height = i.dh;
  const p = i.transform;
  c.build(h, l), p && wc(l, p), c.triangulate(l, s, 2, a, r, o);
  const u = f.uvs;
  n.push(
    u.x0,
    u.y0,
    u.x1,
    u.y1,
    u.x3,
    u.y3,
    u.x2,
    u.y2
  );
  const d = Me.get(Ac);
  d.indexOffset = o, d.indexSize = r.length - o, d.attributeOffset = a, d.attributeSize = s.length / 2 - a, d.baseColor = i.style, d.alpha = i.alpha, d.texture = f, d.geometryData = e, t.push(d);
}
function qa(i, t, e, s, n, r) {
  const { vertices: o, uvs: a, indices: l } = r, c = i.shapePrimitives.length - 1;
  i.shapePrimitives.forEach(({ shape: h, transform: f }, p) => {
    const u = l.length, d = o.length / 2, m = [], g = Tr[h.type];
    if (g.build(h, m), f && wc(m, f), s) {
      const w = h.closePath ?? !0;
      gm(m, t, !1, w, o, 2, d, l);
    } else if (e && c === p) {
      c !== 0 && console.warn("[Pixi Graphics] only the last shape have be cut out");
      const w = [], x = m.slice();
      Sm(e.shapePath).forEach((A) => {
        w.push(x.length / 2), x.push(...A);
      }), Sc(x, w, o, 2, d, l, u);
    } else
      g.triangulate(m, o, 2, d, l, u);
    const y = a.length / 2, v = t.texture;
    if (v !== H.WHITE) {
      const w = t.matrix;
      w && (f && w.append(f.clone().invert()), lm(o, 2, d, a, y, 2, o.length / 2 - d, w));
    } else
      hm(a, y, 2, o.length / 2 - d);
    const _ = Me.get(Ac);
    _.indexOffset = u, _.indexSize = l.length - u, _.attributeOffset = d, _.attributeSize = o.length / 2 - d, _.baseColor = t.color, _.alpha = t.alpha, _.texture = v, _.geometryData = r, n.push(_);
  });
}
function Sm(i) {
  if (!i)
    return [];
  const t = i.shapePrimitives, e = [];
  for (let s = 0; s < t.length; s++) {
    const n = t[s].shape, r = [];
    Tr[n.type].build(n, r), e.push(r);
  }
  return e;
}
class Cm {
  constructor() {
    this.batches = [], this.geometryData = {
      vertices: [],
      uvs: [],
      indices: []
    };
  }
}
class Pm {
  constructor() {
    this.batcher = new am(), this.instructions = new Rh();
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
    return K(Rd, "GraphicsContextRenderData#geometry is deprecated, please use batcher.geometry instead."), this.batcher.geometry;
  }
}
const Io = class Kn {
  constructor(t) {
    this._gpuContextHash = {}, this._graphicsDataContextHash = /* @__PURE__ */ Object.create(null), t.renderableGC.addManagedHash(this, "_gpuContextHash"), t.renderableGC.addManagedHash(this, "_graphicsDataContextHash");
  }
  /**
   * Runner init called, update the default options
   * @ignore
   */
  init(t) {
    Kn.defaultOptions.bezierSmoothness = (t == null ? void 0 : t.bezierSmoothness) ?? Kn.defaultOptions.bezierSmoothness;
  }
  getContextRenderData(t) {
    return this._graphicsDataContextHash[t.uid] || this._initContextRenderData(t);
  }
  // Context management functions
  updateGpuContext(t) {
    let e = this._gpuContextHash[t.uid] || this._initContext(t);
    if (t.dirty) {
      e ? this._cleanGraphicsContextData(t) : e = this._initContext(t), wm(t, e);
      const s = t.batchMode;
      t.customShader || s === "no-batch" ? e.isBatchable = !1 : s === "auto" && (e.isBatchable = e.geometryData.vertices.length < 400), t.dirty = !1;
    }
    return e;
  }
  getGpuContext(t) {
    return this._gpuContextHash[t.uid] || this._initContext(t);
  }
  _initContextRenderData(t) {
    const e = Me.get(Pm), { batches: s, geometryData: n } = this._gpuContextHash[t.uid], r = n.vertices.length, o = n.indices.length;
    for (let h = 0; h < s.length; h++)
      s[h].applyTransform = !1;
    const a = e.batcher;
    a.ensureAttributeBuffer(r), a.ensureIndexBuffer(o), a.begin();
    for (let h = 0; h < s.length; h++) {
      const f = s[h];
      a.add(f);
    }
    a.finish(e.instructions);
    const l = a.geometry;
    l.indexBuffer.setDataWithSize(a.indexBuffer, a.indexSize, !0), l.buffers[0].setDataWithSize(a.attributeBuffer.float32View, a.attributeSize, !0);
    const c = a.batches;
    for (let h = 0; h < c.length; h++) {
      const f = c[h];
      f.bindGroup = _f(f.textures.textures, f.textures.count);
    }
    return this._graphicsDataContextHash[t.uid] = e, e;
  }
  _initContext(t) {
    const e = new Cm();
    return e.context = t, this._gpuContextHash[t.uid] = e, t.on("destroy", this.onGraphicsContextDestroy, this), this._gpuContextHash[t.uid];
  }
  onGraphicsContextDestroy(t) {
    this._cleanGraphicsContextData(t), t.off("destroy", this.onGraphicsContextDestroy, this), this._gpuContextHash[t.uid] = null;
  }
  _cleanGraphicsContextData(t) {
    const e = this._gpuContextHash[t.uid];
    e.isBatchable || this._graphicsDataContextHash[t.uid] && (Me.return(this.getContextRenderData(t)), this._graphicsDataContextHash[t.uid] = null), e.batches && e.batches.forEach((s) => {
      Me.return(s);
    });
  }
  destroy() {
    for (const t in this._gpuContextHash)
      this._gpuContextHash[t] && this.onGraphicsContextDestroy(this._gpuContextHash[t].context);
  }
};
Io.extension = {
  type: [
    z.WebGLSystem,
    z.WebGPUSystem,
    z.CanvasSystem
  ],
  name: "graphicsContext"
};
Io.defaultOptions = {
  /**
   * A value from 0 to 1 that controls the smoothness of bezier curves (the higher the smoother)
   * @default 0.5
   */
  bezierSmoothness: 0.5
};
let Cc = Io;
const Mm = 8, Ws = 11920929e-14, Tm = 1;
function Pc(i, t, e, s, n, r, o, a, l, c) {
  const h = Math.min(
    0.99,
    // a value of 1.0 actually inverts smoothing, so we cap it at 0.99
    Math.max(0, c ?? Cc.defaultOptions.bezierSmoothness)
  );
  let f = (Tm - h) / 1;
  return f *= f, km(t, e, s, n, r, o, a, l, i, f), i;
}
function km(i, t, e, s, n, r, o, a, l, c) {
  Qn(i, t, e, s, n, r, o, a, l, c, 0), l.push(o, a);
}
function Qn(i, t, e, s, n, r, o, a, l, c, h) {
  if (h > Mm)
    return;
  const f = (i + e) / 2, p = (t + s) / 2, u = (e + n) / 2, d = (s + r) / 2, m = (n + o) / 2, g = (r + a) / 2, y = (f + u) / 2, v = (p + d) / 2, _ = (u + m) / 2, w = (d + g) / 2, x = (y + _) / 2, A = (v + w) / 2;
  if (h > 0) {
    let S = o - i, b = a - t;
    const C = Math.abs((e - o) * b - (s - a) * S), P = Math.abs((n - o) * b - (r - a) * S);
    if (C > Ws && P > Ws) {
      if ((C + P) * (C + P) <= c * (S * S + b * b)) {
        l.push(x, A);
        return;
      }
    } else if (C > Ws) {
      if (C * C <= c * (S * S + b * b)) {
        l.push(x, A);
        return;
      }
    } else if (P > Ws) {
      if (P * P <= c * (S * S + b * b)) {
        l.push(x, A);
        return;
      }
    } else if (S = x - (i + o) / 2, b = A - (t + a) / 2, S * S + b * b <= c) {
      l.push(x, A);
      return;
    }
  }
  Qn(i, t, f, p, y, v, x, A, l, c, h + 1), Qn(x, A, _, w, m, g, o, a, l, c, h + 1);
}
const Em = 8, Bm = 11920929e-14, Rm = 1;
function Im(i, t, e, s, n, r, o, a) {
  const l = Math.min(
    0.99,
    // a value of 1.0 actually inverts smoothing, so we cap it at 0.99
    Math.max(0, a ?? Cc.defaultOptions.bezierSmoothness)
  );
  let c = (Rm - l) / 1;
  return c *= c, Om(t, e, s, n, r, o, i, c), i;
}
function Om(i, t, e, s, n, r, o, a) {
  Zn(o, i, t, e, s, n, r, a, 0), o.push(n, r);
}
function Zn(i, t, e, s, n, r, o, a, l) {
  if (l > Em)
    return;
  const c = (t + s) / 2, h = (e + n) / 2, f = (s + r) / 2, p = (n + o) / 2, u = (c + f) / 2, d = (h + p) / 2;
  let m = r - t, g = o - e;
  const y = Math.abs((s - r) * g - (n - o) * m);
  if (y > Bm) {
    if (y * y <= a * (m * m + g * g)) {
      i.push(u, d);
      return;
    }
  } else if (m = u - (t + r) / 2, g = d - (e + o) / 2, m * m + g * g <= a) {
    i.push(u, d);
    return;
  }
  Zn(i, t, e, c, h, u, d, a, l + 1), Zn(i, u, d, f, p, r, o, a, l + 1);
}
function Mc(i, t, e, s, n, r, o, a) {
  let l = Math.abs(n - r);
  (!o && n > r || o && r > n) && (l = 2 * Math.PI - l), a = a || Math.max(6, Math.floor(6 * Math.pow(s, 1 / 3) * (l / Math.PI))), a = Math.max(a, 3);
  let c = l / a, h = n;
  c *= o ? -1 : 1;
  for (let f = 0; f < a + 1; f++) {
    const p = Math.cos(h), u = Math.sin(h), d = t + p * s, m = e + u * s;
    i.push(d, m), h += c;
  }
}
function Fm(i, t, e, s, n, r) {
  const o = i[i.length - 2], a = i[i.length - 1] - e, l = o - t, c = n - e, h = s - t, f = Math.abs(a * h - l * c);
  if (f < 1e-8 || r === 0) {
    (i[i.length - 2] !== t || i[i.length - 1] !== e) && i.push(t, e);
    return;
  }
  const p = a * a + l * l, u = c * c + h * h, d = a * c + l * h, m = r * Math.sqrt(p) / f, g = r * Math.sqrt(u) / f, y = m * d / p, v = g * d / u, _ = m * h + g * l, w = m * c + g * a, x = l * (g + y), A = a * (g + y), S = h * (m + v), b = c * (m + v), C = Math.atan2(A - w, x - _), P = Math.atan2(b - w, S - _);
  Mc(
    i,
    _ + t,
    w + e,
    r,
    C,
    P,
    l * c > h * a
  );
}
const us = Math.PI * 2, cn = {
  centerX: 0,
  centerY: 0,
  ang1: 0,
  ang2: 0
}, un = ({ x: i, y: t }, e, s, n, r, o, a, l) => {
  i *= e, t *= s;
  const c = n * i - r * t, h = r * i + n * t;
  return l.x = c + o, l.y = h + a, l;
};
function Lm(i, t) {
  const e = t === -1.5707963267948966 ? -0.551915024494 : 1.3333333333333333 * Math.tan(t / 4), s = t === 1.5707963267948966 ? 0.551915024494 : e, n = Math.cos(i), r = Math.sin(i), o = Math.cos(i + t), a = Math.sin(i + t);
  return [
    {
      x: n - r * s,
      y: r + n * s
    },
    {
      x: o + a * s,
      y: a - o * s
    },
    {
      x: o,
      y: a
    }
  ];
}
const Ka = (i, t, e, s) => {
  const n = i * s - t * e < 0 ? -1 : 1;
  let r = i * e + t * s;
  return r > 1 && (r = 1), r < -1 && (r = -1), n * Math.acos(r);
}, zm = (i, t, e, s, n, r, o, a, l, c, h, f, p) => {
  const u = Math.pow(n, 2), d = Math.pow(r, 2), m = Math.pow(h, 2), g = Math.pow(f, 2);
  let y = u * d - u * g - d * m;
  y < 0 && (y = 0), y /= u * g + d * m, y = Math.sqrt(y) * (o === a ? -1 : 1);
  const v = y * n / r * f, _ = y * -r / n * h, w = c * v - l * _ + (i + e) / 2, x = l * v + c * _ + (t + s) / 2, A = (h - v) / n, S = (f - _) / r, b = (-h - v) / n, C = (-f - _) / r, P = Ka(1, 0, A, S);
  let M = Ka(A, S, b, C);
  a === 0 && M > 0 && (M -= us), a === 1 && M < 0 && (M += us), p.centerX = w, p.centerY = x, p.ang1 = P, p.ang2 = M;
};
function Dm(i, t, e, s, n, r, o, a = 0, l = 0, c = 0) {
  if (r === 0 || o === 0)
    return;
  const h = Math.sin(a * us / 360), f = Math.cos(a * us / 360), p = f * (t - s) / 2 + h * (e - n) / 2, u = -h * (t - s) / 2 + f * (e - n) / 2;
  if (p === 0 && u === 0)
    return;
  r = Math.abs(r), o = Math.abs(o);
  const d = Math.pow(p, 2) / Math.pow(r, 2) + Math.pow(u, 2) / Math.pow(o, 2);
  d > 1 && (r *= Math.sqrt(d), o *= Math.sqrt(d)), zm(
    t,
    e,
    s,
    n,
    r,
    o,
    l,
    c,
    h,
    f,
    p,
    u,
    cn
  );
  let { ang1: m, ang2: g } = cn;
  const { centerX: y, centerY: v } = cn;
  let _ = Math.abs(g) / (us / 4);
  Math.abs(1 - _) < 1e-7 && (_ = 1);
  const w = Math.max(Math.ceil(_), 1);
  g /= w;
  let x = i[i.length - 2], A = i[i.length - 1];
  const S = { x: 0, y: 0 };
  for (let b = 0; b < w; b++) {
    const C = Lm(m, g), { x: P, y: M } = un(C[0], r, o, f, h, y, v, S), { x: T, y: k } = un(C[1], r, o, f, h, y, v, S), { x: E, y: B } = un(C[2], r, o, f, h, y, v, S);
    Pc(
      i,
      x,
      A,
      P,
      M,
      T,
      k,
      E,
      B
    ), x = E, A = B, m += g;
  }
}
function Um(i, t, e) {
  const s = (o, a) => {
    const l = a.x - o.x, c = a.y - o.y, h = Math.sqrt(l * l + c * c), f = l / h, p = c / h;
    return { len: h, nx: f, ny: p };
  }, n = (o, a) => {
    o === 0 ? i.moveTo(a.x, a.y) : i.lineTo(a.x, a.y);
  };
  let r = t[t.length - 1];
  for (let o = 0; o < t.length; o++) {
    const a = t[o % t.length], l = a.radius ?? e;
    if (l <= 0) {
      n(o, a), r = a;
      continue;
    }
    const c = t[(o + 1) % t.length], h = s(a, r), f = s(a, c);
    if (h.len < 1e-4 || f.len < 1e-4) {
      n(o, a), r = a;
      continue;
    }
    let p = Math.asin(h.nx * f.ny - h.ny * f.nx), u = 1, d = !1;
    h.nx * f.nx - h.ny * -f.ny < 0 ? p < 0 ? p = Math.PI + p : (p = Math.PI - p, u = -1, d = !0) : p > 0 && (u = -1, d = !0);
    const m = p / 2;
    let g, y = Math.abs(
      Math.cos(m) * l / Math.sin(m)
    );
    y > Math.min(h.len / 2, f.len / 2) ? (y = Math.min(h.len / 2, f.len / 2), g = Math.abs(y * Math.sin(m) / Math.cos(m))) : g = l;
    const v = a.x + f.nx * y + -f.ny * g * u, _ = a.y + f.ny * y + f.nx * g * u, w = Math.atan2(h.ny, h.nx) + Math.PI / 2 * u, x = Math.atan2(f.ny, f.nx) - Math.PI / 2 * u;
    o === 0 && i.moveTo(
      v + Math.cos(w) * g,
      _ + Math.sin(w) * g
    ), i.arc(v, _, g, w, x, d), r = a;
  }
}
function Gm(i, t, e, s) {
  const n = (a, l) => Math.sqrt((a.x - l.x) ** 2 + (a.y - l.y) ** 2), r = (a, l, c) => ({
    x: a.x + (l.x - a.x) * c,
    y: a.y + (l.y - a.y) * c
  }), o = t.length;
  for (let a = 0; a < o; a++) {
    const l = t[(a + 1) % o], c = l.radius ?? e;
    if (c <= 0) {
      a === 0 ? i.moveTo(l.x, l.y) : i.lineTo(l.x, l.y);
      continue;
    }
    const h = t[a], f = t[(a + 2) % o], p = n(h, l);
    let u;
    if (p < 1e-4)
      u = l;
    else {
      const g = Math.min(p / 2, c);
      u = r(
        l,
        h,
        g / p
      );
    }
    const d = n(f, l);
    let m;
    if (d < 1e-4)
      m = l;
    else {
      const g = Math.min(d / 2, c);
      m = r(
        l,
        f,
        g / d
      );
    }
    a === 0 ? i.moveTo(u.x, u.y) : i.lineTo(u.x, u.y), i.quadraticCurveTo(l.x, l.y, m.x, m.y, s);
  }
}
const Vm = new yt();
class Nm {
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
    const s = this._currentPoly.points, n = s[s.length - 2], r = s[s.length - 1];
    return (n !== t || r !== e) && s.push(t, e), this;
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
  arc(t, e, s, n, r, o) {
    this._ensurePoly(!1);
    const a = this._currentPoly.points;
    return Mc(a, t, e, s, n, r, o), this;
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
  arcTo(t, e, s, n, r) {
    this._ensurePoly();
    const o = this._currentPoly.points;
    return Fm(o, t, e, s, n, r), this;
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
  arcToSvg(t, e, s, n, r, o, a) {
    const l = this._currentPoly.points;
    return Dm(
      l,
      this._currentPoly.lastX,
      this._currentPoly.lastY,
      o,
      a,
      t,
      e,
      s,
      n,
      r
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
  bezierCurveTo(t, e, s, n, r, o, a) {
    this._ensurePoly();
    const l = this._currentPoly;
    return Pc(
      this._currentPoly.points,
      l.lastX,
      l.lastY,
      t,
      e,
      s,
      n,
      r,
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
  quadraticCurveTo(t, e, s, n, r) {
    this._ensurePoly();
    const o = this._currentPoly;
    return Im(
      this._currentPoly.points,
      o.lastX,
      o.lastY,
      t,
      e,
      s,
      n,
      r
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
    for (let s = 0; s < t.instructions.length; s++) {
      const n = t.instructions[s];
      this[n.action](...n.data);
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
  rect(t, e, s, n, r) {
    return this.drawShape(new yt(t, e, s, n), r), this;
  }
  /**
   * Draws a circle shape. This method adds a new circle path to the current drawing.
   * @param x - The x-coordinate of the center of the circle.
   * @param y - The y-coordinate of the center of the circle.
   * @param radius - The radius of the circle.
   * @param transform - An optional `Matrix` object to apply a transformation to the circle.
   * @returns The instance of the current object for chaining.
   */
  circle(t, e, s, n) {
    return this.drawShape(new Eo(t, e, s), n), this;
  }
  /**
   * Draws a polygon shape. This method allows for the creation of complex polygons by specifying a sequence of points.
   * @param points - An array of numbers, or or an array of PointData objects eg [{x,y}, {x,y}, {x,y}]
   * representing the x and y coordinates of the polygon's vertices, in sequence.
   * @param close - A boolean indicating whether to close the polygon path. True by default.
   * @param transform - An optional `Matrix` object to apply a transformation to the polygon.
   * @returns The instance of the current object for chaining.
   */
  poly(t, e, s) {
    const n = new cs(t);
    return n.closePath = e, this.drawShape(n, s), this;
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
  regularPoly(t, e, s, n, r = 0, o) {
    n = Math.max(n | 0, 3);
    const a = -1 * Math.PI / 2 + r, l = Math.PI * 2 / n, c = [];
    for (let h = 0; h < n; h++) {
      const f = h * l + a;
      c.push(
        t + s * Math.cos(f),
        e + s * Math.sin(f)
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
  roundPoly(t, e, s, n, r, o = 0, a) {
    if (n = Math.max(n | 0, 3), r <= 0)
      return this.regularPoly(t, e, s, n, o);
    const l = s * Math.sin(Math.PI / n) - 1e-3;
    r = Math.min(r, l);
    const c = -1 * Math.PI / 2 + o, h = Math.PI * 2 / n, f = (n - 2) * Math.PI / n / 2;
    for (let p = 0; p < n; p++) {
      const u = p * h + c, d = t + s * Math.cos(u), m = e + s * Math.sin(u), g = u + Math.PI + f, y = u - Math.PI - f, v = d + r * Math.cos(g), _ = m + r * Math.sin(g), w = d + r * Math.cos(y), x = m + r * Math.sin(y);
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
  roundShape(t, e, s = !1, n) {
    return t.length < 3 ? this : (s ? Gm(this, t, e, n) : Um(this, t, e), this.closePath());
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
  filletRect(t, e, s, n, r) {
    if (r === 0)
      return this.rect(t, e, s, n);
    const o = Math.min(s, n) / 2, a = Math.min(o, Math.max(-o, r)), l = t + s, c = e + n, h = a < 0 ? -a : 0, f = Math.abs(a);
    return this.moveTo(t, e + f).arcTo(t + h, e + h, t + f, e, f).lineTo(l - f, e).arcTo(l - h, e + h, l, e + f, f).lineTo(l, c - f).arcTo(l - h, c - h, t + s - f, c, f).lineTo(t + f, c).arcTo(t + h, c - h, t, c - f, f).closePath();
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
  chamferRect(t, e, s, n, r, o) {
    if (r <= 0)
      return this.rect(t, e, s, n);
    const a = Math.min(r, Math.min(s, n) / 2), l = t + s, c = e + n, h = [
      t + a,
      e,
      l - a,
      e,
      l,
      e + a,
      l,
      c - a,
      l - a,
      c,
      t + a,
      c,
      t,
      c - a,
      t,
      e + a
    ];
    for (let f = h.length - 1; f >= 2; f -= 2)
      h[f] === h[f - 2] && h[f - 1] === h[f - 3] && h.splice(f - 1, 2);
    return this.poly(h, !0, o);
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
  ellipse(t, e, s, n, r) {
    return this.drawShape(new Bo(t, e, s, n), r), this;
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
  roundRect(t, e, s, n, r, o) {
    return this.drawShape(new Ro(t, e, s, n, r), o), this;
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
    let s = this._currentPoly;
    return s && this.endPoly(), s = new cs(), s.points.push(t, e), this._currentPoly = s, this;
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
    if (!this._currentPoly && (this._currentPoly = new cs(), t)) {
      const e = this.shapePrimitives[this.shapePrimitives.length - 1];
      if (e) {
        let s = e.shape.x, n = e.shape.y;
        if (e.transform && !e.transform.isIdentity()) {
          const r = e.transform, o = s;
          s = r.a * s + r.c * n + r.tx, n = r.b * o + r.d * n + r.ty;
        }
        this._currentPoly.points.push(s, n);
      } else
        this._currentPoly.points.push(0, 0);
    }
  }
  /** Builds the path. */
  buildPath() {
    const t = this._graphicsPath2D;
    this.shapePrimitives.length = 0, this._currentPoly = null;
    for (let e = 0; e < t.instructions.length; e++) {
      const s = t.instructions[e];
      this[s.action](...s.data);
    }
    this.finish();
  }
  /** Gets the bounds of the path. */
  get bounds() {
    const t = this._bounds;
    t.clear();
    const e = this.shapePrimitives;
    for (let s = 0; s < e.length; s++) {
      const n = e[s], r = n.shape.getBounds(Vm);
      n.transform ? t.addRect(r, n.transform) : t.addRect(r);
    }
    return t;
  }
}
class Li {
  /**
   * Creates a `GraphicsPath` instance optionally from an SVG path string or an array of `PathInstruction`.
   * @param instructions - An SVG path string or an array of `PathInstruction` objects.
   */
  constructor(t) {
    this.instructions = [], this.uid = xt("graphicsPath"), this._dirty = !0, typeof t == "string" ? gf(t, this) : this.instructions = (t == null ? void 0 : t.slice()) ?? [];
  }
  /**
   * Provides access to the internal shape path, ensuring it is up-to-date with the current instructions.
   * @returns The `ShapePath` instance associated with this `GraphicsPath`.
   */
  get shapePath() {
    return this._shapePath || (this._shapePath = new Nm(this)), this._dirty && (this._dirty = !1, this._shapePath.buildPath()), this._shapePath;
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
  bezierCurveToShort(t, e, s, n, r) {
    const o = this.instructions[this.instructions.length - 1], a = this.getLastPoint(Pt.shared);
    let l = 0, c = 0;
    if (!o || o.action !== "bezierCurveTo")
      l = a.x, c = a.y;
    else {
      l = o.data[2], c = o.data[3];
      const h = a.x, f = a.y;
      l = h + (h - l), c = f + (f - c);
    }
    return this.instructions.push({ action: "bezierCurveTo", data: [l, c, t, e, s, n, r] }), this._dirty = !0, this;
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
  quadraticCurveToShort(t, e, s) {
    const n = this.instructions[this.instructions.length - 1], r = this.getLastPoint(Pt.shared);
    let o = 0, a = 0;
    if (!n || n.action !== "quadraticCurveTo")
      o = r.x, a = r.y;
    else {
      o = n.data[0], a = n.data[1];
      const l = r.x, c = r.y;
      o = l + (l - o), a = c + (c - a);
    }
    return this.instructions.push({ action: "quadraticCurveTo", data: [o, a, t, e, s] }), this._dirty = !0, this;
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
  rect(t, e, s, n, r) {
    return this.instructions.push({ action: "rect", data: [t, e, s, n, r] }), this._dirty = !0, this;
  }
  /**
   * Draws a circle shape. This method adds a new circle path to the current drawing.
   * @param x - The x-coordinate of the center of the circle.
   * @param y - The y-coordinate of the center of the circle.
   * @param radius - The radius of the circle.
   * @param transform - An optional `Matrix` object to apply a transformation to the circle.
   * @returns The instance of the current object for chaining.
   */
  circle(t, e, s, n) {
    return this.instructions.push({ action: "circle", data: [t, e, s, n] }), this._dirty = !0, this;
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
  star(t, e, s, n, r, o, a) {
    r = r || n / 2;
    const l = -1 * Math.PI / 2 + o, c = s * 2, h = Math.PI * 2 / c, f = [];
    for (let p = 0; p < c; p++) {
      const u = p % 2 ? r : n, d = p * h + l;
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
    const e = new Li();
    if (!t)
      e.instructions = this.instructions.slice();
    else
      for (let s = 0; s < this.instructions.length; s++) {
        const n = this.instructions[s];
        e.instructions.push({ action: n.action, data: n.data.slice() });
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
    const e = t.a, s = t.b, n = t.c, r = t.d, o = t.tx, a = t.ty;
    let l = 0, c = 0, h = 0, f = 0, p = 0, u = 0, d = 0, m = 0;
    for (let g = 0; g < this.instructions.length; g++) {
      const y = this.instructions[g], v = y.data;
      switch (y.action) {
        case "moveTo":
        case "lineTo":
          l = v[0], c = v[1], v[0] = e * l + n * c + o, v[1] = s * l + r * c + a;
          break;
        case "bezierCurveTo":
          h = v[0], f = v[1], p = v[2], u = v[3], l = v[4], c = v[5], v[0] = e * h + n * f + o, v[1] = s * h + r * f + a, v[2] = e * p + n * u + o, v[3] = s * p + r * u + a, v[4] = e * l + n * c + o, v[5] = s * l + r * c + a;
          break;
        case "quadraticCurveTo":
          h = v[0], f = v[1], l = v[2], c = v[3], v[0] = e * h + n * f + o, v[1] = s * h + r * f + a, v[2] = e * l + n * c + o, v[3] = s * l + r * c + a;
          break;
        case "arcToSvg":
          l = v[5], c = v[6], d = v[0], m = v[1], v[0] = e * d + n * m, v[1] = s * d + r * m, v[5] = e * l + n * c + o, v[6] = s * l + r * c + a;
          break;
        case "circle":
          v[4] = Zi(v[3], t);
          break;
        case "rect":
          v[4] = Zi(v[4], t);
          break;
        case "ellipse":
          v[8] = Zi(v[8], t);
          break;
        case "roundRect":
          v[5] = Zi(v[5], t);
          break;
        case "addPath":
          v[0].transform(t);
          break;
        case "poly":
          v[2] = Zi(v[2], t);
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
    let e = this.instructions.length - 1, s = this.instructions[e];
    if (!s)
      return t.x = 0, t.y = 0, t;
    for (; s.action === "closePath"; ) {
      if (e--, e < 0)
        return t.x = 0, t.y = 0, t;
      s = this.instructions[e];
    }
    switch (s.action) {
      case "moveTo":
      case "lineTo":
        t.x = s.data[0], t.y = s.data[1];
        break;
      case "quadraticCurveTo":
        t.x = s.data[2], t.y = s.data[3];
        break;
      case "bezierCurveTo":
        t.x = s.data[4], t.y = s.data[5];
        break;
      case "arc":
      case "arcToSvg":
        t.x = s.data[5], t.y = s.data[6];
        break;
      case "addPath":
        s.data[0].getLastPoint(t);
        break;
    }
    return t;
  }
}
function Zi(i, t) {
  return i ? i.prepend(t) : t.clone();
}
function Hm(i, t) {
  if (typeof i == "string") {
    const s = document.createElement("div");
    s.innerHTML = i.trim(), i = s.querySelector("svg");
  }
  const e = {
    context: t,
    path: new Li()
  };
  return Tc(i, e, null, null), t;
}
function Tc(i, t, e, s) {
  const n = i.children, { fillStyle: r, strokeStyle: o } = jm(i);
  r && e ? e = { ...e, ...r } : r && (e = r), o && s ? s = { ...s, ...o } : o && (s = o), t.context.fillStyle = e, t.context.strokeStyle = s;
  let a, l, c, h, f, p, u, d, m, g, y, v, _, w, x, A, S;
  switch (i.nodeName.toLowerCase()) {
    case "path":
      w = i.getAttribute("d"), x = new Li(w), t.context.path(x), e && t.context.fill(), s && t.context.stroke();
      break;
    case "circle":
      u = vt(i, "cx", 0), d = vt(i, "cy", 0), m = vt(i, "r", 0), t.context.ellipse(u, d, m, m), e && t.context.fill(), s && t.context.stroke();
      break;
    case "rect":
      a = vt(i, "x", 0), l = vt(i, "y", 0), A = vt(i, "width", 0), S = vt(i, "height", 0), g = vt(i, "rx", 0), y = vt(i, "ry", 0), g || y ? t.context.roundRect(a, l, A, S, g || y) : t.context.rect(a, l, A, S), e && t.context.fill(), s && t.context.stroke();
      break;
    case "ellipse":
      u = vt(i, "cx", 0), d = vt(i, "cy", 0), g = vt(i, "rx", 0), y = vt(i, "ry", 0), t.context.beginPath(), t.context.ellipse(u, d, g, y), e && t.context.fill(), s && t.context.stroke();
      break;
    case "line":
      c = vt(i, "x1", 0), h = vt(i, "y1", 0), f = vt(i, "x2", 0), p = vt(i, "y2", 0), t.context.beginPath(), t.context.moveTo(c, h), t.context.lineTo(f, p), s && t.context.stroke();
      break;
    case "polygon":
      _ = i.getAttribute("points"), v = _.match(/\d+/g).map((b) => parseInt(b, 10)), t.context.poly(v, !0), e && t.context.fill(), s && t.context.stroke();
      break;
    case "polyline":
      _ = i.getAttribute("points"), v = _.match(/\d+/g).map((b) => parseInt(b, 10)), t.context.poly(v, !1), s && t.context.stroke();
      break;
    case "g":
    case "svg":
      break;
    default: {
      console.info(`[SVG parser] <${i.nodeName}> elements unsupported`);
      break;
    }
  }
  for (let b = 0; b < n.length; b++)
    Tc(n[b], t, e, s);
}
function vt(i, t, e) {
  const s = i.getAttribute(t);
  return s ? Number(s) : e;
}
function jm(i) {
  const t = i.getAttribute("style"), e = {}, s = {};
  let n = !1, r = !1;
  if (t) {
    const o = t.split(";");
    for (let a = 0; a < o.length; a++) {
      const l = o[a], [c, h] = l.split(":");
      switch (c) {
        case "stroke":
          h !== "none" && (e.color = ft.shared.setValue(h).toNumber(), r = !0);
          break;
        case "stroke-width":
          e.width = Number(h);
          break;
        case "fill":
          h !== "none" && (n = !0, s.color = ft.shared.setValue(h).toNumber());
          break;
        case "fill-opacity":
          s.alpha = Number(h);
          break;
        case "stroke-opacity":
          e.alpha = Number(h);
          break;
        case "opacity":
          s.alpha = Number(h), e.alpha = Number(h);
          break;
      }
    }
  } else {
    const o = i.getAttribute("stroke");
    o && o !== "none" && (r = !0, e.color = ft.shared.setValue(o).toNumber(), e.width = vt(i, "stroke-width", 1));
    const a = i.getAttribute("fill");
    a && a !== "none" && (n = !0, s.color = ft.shared.setValue(a).toNumber());
  }
  return {
    strokeStyle: r ? e : null,
    fillStyle: n ? s : null
  };
}
function Ym(i) {
  return ft.isColorLike(i);
}
function Qa(i) {
  return i instanceof Mr;
}
function Za(i) {
  return i instanceof As;
}
function Wm(i, t, e) {
  const s = ft.shared.setValue(t ?? 0);
  return i.color = s.toNumber(), i.alpha = s.alpha === 1 ? e.alpha : s.alpha, i.texture = H.WHITE, { ...e, ...i };
}
function Ja(i, t, e) {
  return i.fill = t, i.color = 16777215, i.texture = t.texture, i.matrix = t.transform, { ...e, ...i };
}
function $a(i, t, e) {
  return t.buildLinearGradient(), i.fill = t, i.color = 16777215, i.texture = t.texture, i.matrix = t.transform, { ...e, ...i };
}
function Xm(i, t) {
  var e;
  const s = { ...t, ...i };
  if (s.texture) {
    if (s.texture !== H.WHITE) {
      const o = ((e = s.matrix) == null ? void 0 : e.invert()) || new X();
      o.translate(s.texture.frame.x, s.texture.frame.y), o.scale(1 / s.texture.source.width, 1 / s.texture.source.height), s.matrix = o;
    }
    const r = s.texture.source.style;
    r.addressMode === "clamp-to-edge" && (r.addressMode = "repeat", r.update());
  }
  const n = ft.shared.setValue(s.color);
  return s.alpha *= n.alpha, s.color = n.toNumber(), s.matrix = s.matrix ? s.matrix.clone() : null, s;
}
function ei(i, t) {
  if (i == null)
    return null;
  const e = {}, s = i;
  return Ym(i) ? Wm(e, i, t) : Qa(i) ? Ja(e, i, t) : Za(i) ? $a(e, i, t) : s.fill && Qa(s.fill) ? Ja(s, s.fill, t) : s.fill && Za(s.fill) ? $a(s, s.fill, t) : Xm(s, t);
}
function dr(i, t) {
  const { width: e, alignment: s, miterLimit: n, cap: r, join: o, ...a } = t, l = ei(i, a);
  return l ? {
    width: e,
    alignment: s,
    miterLimit: n,
    cap: r,
    join: o,
    ...l
  } : null;
}
const qm = new Pt(), tl = new X(), Oo = class de extends Et {
  constructor() {
    super(...arguments), this.uid = xt("graphicsContext"), this.dirty = !0, this.batchMode = "auto", this.instructions = [], this._activePath = new Li(), this._transform = new X(), this._fillStyle = { ...de.defaultFillStyle }, this._strokeStyle = { ...de.defaultStrokeStyle }, this._stateStack = [], this._tick = 0, this._bounds = new _e(), this._boundsDirty = !0;
  }
  /**
   * Creates a new GraphicsContext object that is a clone of this instance, copying all properties,
   * including the current drawing state, transformations, styles, and instructions.
   * @returns A new GraphicsContext instance with the same properties and state as this one.
   */
  clone() {
    const t = new de();
    return t.batchMode = this.batchMode, t.instructions = this.instructions.slice(), t._activePath = this._activePath.clone(), t._transform = this._transform.clone(), t._fillStyle = { ...this._fillStyle }, t._strokeStyle = { ...this._strokeStyle }, t._stateStack = this._stateStack.slice(), t._bounds = this._bounds.clone(), t._boundsDirty = !0, t;
  }
  /**
   * The current fill style of the graphics context. This can be a color, gradient, pattern, or a more complex style defined by a FillStyle object.
   */
  get fillStyle() {
    return this._fillStyle;
  }
  set fillStyle(t) {
    this._fillStyle = ei(t, de.defaultFillStyle);
  }
  /**
   * The current stroke style of the graphics context. Similar to fill styles, stroke styles can encompass colors, gradients, patterns, or more detailed configurations via a StrokeStyle object.
   */
  get strokeStyle() {
    return this._strokeStyle;
  }
  set strokeStyle(t) {
    this._strokeStyle = dr(t, de.defaultStrokeStyle);
  }
  /**
   * Sets the current fill style of the graphics context. The fill style can be a color, gradient,
   * pattern, or a more complex style defined by a FillStyle object.
   * @param style - The fill style to apply. This can be a simple color, a gradient or pattern object,
   *                or a FillStyle or ConvertedFillStyle object.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  setFillStyle(t) {
    return this._fillStyle = ei(t, de.defaultFillStyle), this;
  }
  /**
   * Sets the current stroke style of the graphics context. Similar to fill styles, stroke styles can
   * encompass colors, gradients, patterns, or more detailed configurations via a StrokeStyle object.
   * @param style - The stroke style to apply. Can be defined as a color, a gradient or pattern,
   *                or a StrokeStyle or ConvertedStrokeStyle object.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  setStrokeStyle(t) {
    return this._strokeStyle = ei(t, de.defaultStrokeStyle), this;
  }
  texture(t, e, s, n, r, o) {
    return this.instructions.push({
      action: "texture",
      data: {
        image: t,
        dx: s || 0,
        dy: n || 0,
        dw: r || t.frame.width,
        dh: o || t.frame.height,
        transform: this._transform.clone(),
        alpha: this._fillStyle.alpha,
        style: e ? ft.shared.setValue(e).toNumber() : 16777215
      }
    }), this.onUpdate(), this;
  }
  /**
   * Resets the current path. Any previous path and its commands are discarded and a new path is
   * started. This is typically called before beginning a new shape or series of drawing commands.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  beginPath() {
    return this._activePath = new Li(), this;
  }
  fill(t, e) {
    let s;
    const n = this.instructions[this.instructions.length - 1];
    return this._tick === 0 && n && n.action === "stroke" ? s = n.data.path : s = this._activePath.clone(), s ? (t != null && (e !== void 0 && typeof t == "number" && (K(Q, "GraphicsContext.fill(color, alpha) is deprecated, use GraphicsContext.fill({ color, alpha }) instead"), t = { color: t, alpha: e }), this._fillStyle = ei(t, de.defaultFillStyle)), this.instructions.push({
      action: "fill",
      // TODO copy fill style!
      data: { style: this.fillStyle, path: s }
    }), this.onUpdate(), this._initNextPathLocation(), this._tick = 0, this) : this;
  }
  _initNextPathLocation() {
    const { x: t, y: e } = this._activePath.getLastPoint(Pt.shared);
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
    const s = this.instructions[this.instructions.length - 1];
    return this._tick === 0 && s && s.action === "fill" ? e = s.data.path : e = this._activePath.clone(), e ? (t != null && (this._strokeStyle = dr(t, de.defaultStrokeStyle)), this.instructions.push({
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
      const e = this.instructions[this.instructions.length - 1 - t], s = this._activePath.clone();
      if (e && (e.action === "stroke" || e.action === "fill"))
        if (e.data.hole)
          e.data.hole.addPath(s);
        else {
          e.data.hole = s;
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
  arc(t, e, s, n, r, o) {
    this._tick++;
    const a = this._transform;
    return this._activePath.arc(
      a.a * t + a.c * e + a.tx,
      a.b * t + a.d * e + a.ty,
      s,
      n,
      r,
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
  arcTo(t, e, s, n, r) {
    this._tick++;
    const o = this._transform;
    return this._activePath.arcTo(
      o.a * t + o.c * e + o.tx,
      o.b * t + o.d * e + o.ty,
      o.a * s + o.c * n + o.tx,
      o.b * s + o.d * n + o.ty,
      r
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
  arcToSvg(t, e, s, n, r, o, a) {
    this._tick++;
    const l = this._transform;
    return this._activePath.arcToSvg(
      t,
      e,
      s,
      // should we rotate this with transform??
      n,
      r,
      l.a * o + l.c * a + l.tx,
      l.b * o + l.d * a + l.ty
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
  bezierCurveTo(t, e, s, n, r, o, a) {
    this._tick++;
    const l = this._transform;
    return this._activePath.bezierCurveTo(
      l.a * t + l.c * e + l.tx,
      l.b * t + l.d * e + l.ty,
      l.a * s + l.c * n + l.tx,
      l.b * s + l.d * n + l.ty,
      l.a * r + l.c * o + l.tx,
      l.b * r + l.d * o + l.ty,
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
  ellipse(t, e, s, n) {
    return this._tick++, this._activePath.ellipse(t, e, s, n, this._transform.clone()), this;
  }
  /**
   * Draws a circle shape. This method adds a new circle path to the current drawing.
   * @param x - The x-coordinate of the center of the circle.
   * @param y - The y-coordinate of the center of the circle.
   * @param radius - The radius of the circle.
   * @returns The instance of the current object for chaining.
   */
  circle(t, e, s) {
    return this._tick++, this._activePath.circle(t, e, s, this._transform.clone()), this;
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
    const s = this._transform;
    return this._activePath.lineTo(
      s.a * t + s.c * e + s.tx,
      s.b * t + s.d * e + s.ty
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
    const s = this._transform, n = this._activePath.instructions, r = s.a * t + s.c * e + s.tx, o = s.b * t + s.d * e + s.ty;
    return n.length === 1 && n[0].action === "moveTo" ? (n[0].data[0] = r, n[0].data[1] = o, this) : (this._activePath.moveTo(
      r,
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
  quadraticCurveTo(t, e, s, n, r) {
    this._tick++;
    const o = this._transform;
    return this._activePath.quadraticCurveTo(
      o.a * t + o.c * e + o.tx,
      o.b * t + o.d * e + o.ty,
      o.a * s + o.c * n + o.tx,
      o.b * s + o.d * n + o.ty,
      r
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
  rect(t, e, s, n) {
    return this._tick++, this._activePath.rect(t, e, s, n, this._transform.clone()), this;
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
  roundRect(t, e, s, n, r) {
    return this._tick++, this._activePath.roundRect(t, e, s, n, r, this._transform.clone()), this;
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
  regularPoly(t, e, s, n, r = 0, o) {
    return this._tick++, this._activePath.regularPoly(t, e, s, n, r, o), this;
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
  roundPoly(t, e, s, n, r, o) {
    return this._tick++, this._activePath.roundPoly(t, e, s, n, r, o), this;
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
  roundShape(t, e, s, n) {
    return this._tick++, this._activePath.roundShape(t, e, s, n), this;
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
  filletRect(t, e, s, n, r) {
    return this._tick++, this._activePath.filletRect(t, e, s, n, r), this;
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
  chamferRect(t, e, s, n, r, o) {
    return this._tick++, this._activePath.chamferRect(t, e, s, n, r, o), this;
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
  star(t, e, s, n, r = 0, o = 0) {
    return this._tick++, this._activePath.star(t, e, s, n, r, o, this._transform.clone()), this;
  }
  /**
   * Parses and renders an SVG string into the graphics context. This allows for complex shapes and paths
   * defined in SVG format to be drawn within the graphics context.
   * @param svg - The SVG string to be parsed and rendered.
   */
  svg(t) {
    return this._tick++, Hm(t, this), this;
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
  setTransform(t, e, s, n, r, o) {
    return t instanceof X ? (this._transform.set(t.a, t.b, t.c, t.d, t.tx, t.ty), this) : (this._transform.set(t, e, s, n, r, o), this);
  }
  transform(t, e, s, n, r, o) {
    return t instanceof X ? (this._transform.append(t), this) : (tl.set(t, e, s, n, r, o), this._transform.append(tl), this);
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
      const s = this.instructions[e], n = s.action;
      if (n === "fill") {
        const r = s.data;
        t.addBounds(r.path.bounds);
      } else if (n === "texture") {
        const r = s.data;
        t.addFrame(r.dx, r.dy, r.dx + r.dw, r.dy + r.dh, r.transform);
      }
      if (n === "stroke") {
        const r = s.data, o = r.style.width / 2, a = r.path.bounds;
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
    const s = this.instructions;
    let n = !1;
    for (let r = 0; r < s.length; r++) {
      const o = s[r], a = o.data, l = a.path;
      if (!o.action || !l)
        continue;
      const c = a.style, h = l.shapePath.shapePrimitives;
      for (let f = 0; f < h.length; f++) {
        const p = h[f].shape;
        if (!c || !p)
          continue;
        const u = h[f].transform, d = u ? u.applyInverse(t, qm) : t;
        o.action === "fill" ? n = p.contains(d.x, d.y) : n = p.strokeContains(d.x, d.y, c.width);
        const m = a.hole;
        if (m) {
          const g = (e = m.shapePath) == null ? void 0 : e.shapePrimitives;
          if (g)
            for (let y = 0; y < g.length; y++)
              g[y].shape.contains(d.x, d.y) && (n = !1);
        }
        if (n)
          return !0;
      }
    }
    return n;
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
Oo.defaultFillStyle = {
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
Oo.defaultStrokeStyle = {
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
let Qt = Oo;
const el = [
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
function Km(i) {
  const t = [];
  let e = 0;
  for (let s = 0; s < el.length; s++) {
    const n = `_${el[s]}`;
    t[e++] = i[n];
  }
  return e = kc(i._fill, t, e), e = Qm(i._stroke, t, e), e = Zm(i.dropShadow, t, e), t.join("-");
}
function kc(i, t, e) {
  var s;
  return i && (t[e++] = i.color, t[e++] = i.alpha, t[e++] = (s = i.fill) == null ? void 0 : s.styleKey), e;
}
function Qm(i, t, e) {
  return i && (e = kc(i, t, e), t[e++] = i.width, t[e++] = i.alignment, t[e++] = i.cap, t[e++] = i.join, t[e++] = i.miterLimit), e;
}
function Zm(i, t, e) {
  return i && (t[e++] = i.alpha, t[e++] = i.angle, t[e++] = i.blur, t[e++] = i.distance, t[e++] = ft.shared.setValue(i.color).toNumber()), e;
}
const Fo = class yi extends Et {
  constructor(t = {}) {
    super(), Jm(t);
    const e = { ...yi.defaultTextStyle, ...t };
    for (const s in e) {
      const n = s;
      this[n] = e[s];
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
    t !== null && typeof t == "object" ? this._dropShadow = this._createProxy({ ...yi.defaultDropShadow, ...t }) : this._dropShadow = t ? this._createProxy({ ...yi.defaultDropShadow }) : null, this.update();
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
    t !== this._originalFill && (this._originalFill = t, this._isFillStyle(t) && (this._originalFill = this._createProxy({ ...Qt.defaultFillStyle, ...t }, () => {
      this._fill = ei(
        { ...this._originalFill },
        Qt.defaultFillStyle
      );
    })), this._fill = ei(
      t === 0 ? "black" : t,
      Qt.defaultFillStyle
    ), this.update());
  }
  /** A fillstyle that will be used on the text stroke, e.g., 'blue', '#FCFF00'. */
  get stroke() {
    return this._originalStroke;
  }
  set stroke(t) {
    t !== this._originalStroke && (this._originalStroke = t, this._isFillStyle(t) && (this._originalStroke = this._createProxy({ ...Qt.defaultStrokeStyle, ...t }, () => {
      this._stroke = dr(
        { ...this._originalStroke },
        Qt.defaultStrokeStyle
      );
    })), this._stroke = dr(t, Qt.defaultStrokeStyle), this.update());
  }
  _generateKey() {
    return this._styleKey = Km(this), this._styleKey;
  }
  update() {
    this._styleKey = null, this.emit("update", this);
  }
  /** Resets all properties to the default values */
  reset() {
    const t = yi.defaultTextStyle;
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
    return new yi({
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
    var e, s, n, r;
    if (this.removeAllListeners(), typeof t == "boolean" ? t : t == null ? void 0 : t.texture) {
      const o = typeof t == "boolean" ? t : t == null ? void 0 : t.textureSource;
      (e = this._fill) != null && e.texture && this._fill.texture.destroy(o), (s = this._originalFill) != null && s.texture && this._originalFill.texture.destroy(o), (n = this._stroke) != null && n.texture && this._stroke.texture.destroy(o), (r = this._originalStroke) != null && r.texture && this._originalStroke.texture.destroy(o);
    }
    this._fill = null, this._stroke = null, this.dropShadow = null, this._originalStroke = null, this._originalFill = null;
  }
  _createProxy(t, e) {
    return new Proxy(t, {
      set: (s, n, r) => (s[n] = r, e == null || e(n, r), this.update(), !0)
    });
  }
  _isFillStyle(t) {
    return (t ?? null) !== null && !(ft.isColorLike(t) || t instanceof As || t instanceof Mr);
  }
};
Fo.defaultDropShadow = {
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
Fo.defaultTextStyle = {
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
let hi = Fo;
function Jm(i) {
  const t = i;
  if (typeof t.dropShadow == "boolean" && t.dropShadow) {
    const e = hi.defaultDropShadow;
    i.dropShadow = {
      alpha: t.dropShadowAlpha ?? e.alpha,
      angle: t.dropShadowAngle ?? e.angle,
      blur: t.dropShadowBlur ?? e.blur,
      color: t.dropShadowColor ?? e.color,
      distance: t.dropShadowDistance ?? e.distance
    };
  }
  if (t.strokeThickness !== void 0) {
    K(Q, "strokeThickness is now a part of stroke");
    const e = t.stroke;
    let s = {};
    if (ft.isColorLike(e))
      s.color = e;
    else if (e instanceof As || e instanceof Mr)
      s.fill = e;
    else if (Object.hasOwnProperty.call(e, "color") || Object.hasOwnProperty.call(e, "fill"))
      s = e;
    else
      throw new Error("Invalid stroke value.");
    i.stroke = {
      ...s,
      width: t.strokeThickness
    };
  }
  if (Array.isArray(t.fillGradientStops)) {
    K(Q, "gradient fill is now a fill pattern: `new FillGradient(...)`");
    let e;
    i.fontSize == null ? i.fontSize = hi.defaultTextStyle.fontSize : typeof i.fontSize == "string" ? e = parseInt(i.fontSize, 10) : e = i.fontSize;
    const s = new As(0, 0, 0, e * 1.7), n = t.fillGradientStops.map((r) => ft.shared.setValue(r).toNumber());
    n.forEach((r, o) => {
      const a = o / (n.length - 1);
      s.addColorStop(a, r);
    }), i.fill = {
      fill: s
    };
  }
}
class $m {
  constructor(t) {
    this._canvasPool = /* @__PURE__ */ Object.create(null), this.canvasOptions = t || {}, this.enableFullScreen = !1;
  }
  /**
   * Creates texture with params that were specified in pool constructor.
   * @param pixelWidth - Width of texture in pixels.
   * @param pixelHeight - Height of texture in pixels.
   */
  _createCanvasAndContext(t, e) {
    const s = at.get().createCanvas();
    s.width = t, s.height = e;
    const n = s.getContext("2d");
    return { canvas: s, context: n };
  }
  /**
   * Gets a Power-of-Two render texture or fullScreen texture
   * @param minWidth - The minimum width of the render texture.
   * @param minHeight - The minimum height of the render texture.
   * @param resolution - The resolution of the render texture.
   * @returns The new render texture.
   */
  getOptimalCanvasAndContext(t, e, s = 1) {
    t = Math.ceil(t * s - 1e-6), e = Math.ceil(e * s - 1e-6), t = ua(t), e = ua(e);
    const n = (t << 17) + (e << 1);
    this._canvasPool[n] || (this._canvasPool[n] = []);
    let r = this._canvasPool[n].pop();
    return r || (r = this._createCanvasAndContext(t, e)), r;
  }
  /**
   * Place a render texture back into the pool.
   * @param canvasAndContext
   */
  returnCanvasAndContext(t) {
    const e = t.canvas, { width: s, height: n } = e, r = (s << 17) + (n << 1);
    t.context.clearRect(0, 0, s, n), this._canvasPool[r].push(t);
  }
  clear() {
    this._canvasPool = {};
  }
}
const il = new $m(), tg = [
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui"
];
function Jn(i) {
  const t = typeof i.fontSize == "number" ? `${i.fontSize}px` : i.fontSize;
  let e = i.fontFamily;
  Array.isArray(i.fontFamily) || (e = i.fontFamily.split(","));
  for (let s = e.length - 1; s >= 0; s--) {
    let n = e[s].trim();
    !/([\"\'])[^\'\"]+\1/.test(n) && !tg.includes(n) && (n = `"${n}"`), e[s] = n;
  }
  return `${i.fontStyle} ${i.fontVariant} ${i.fontWeight} ${t} ${e.join(",")}`;
}
const dn = {
  // TextMetrics requires getImageData readback for measuring fonts.
  willReadFrequently: !0
}, le = class L {
  /**
   * Checking that we can use modern canvas 2D API.
   *
   * Note: This is an unstable API, Chrome < 94 use `textLetterSpacing`, later versions use `letterSpacing`.
   * @see TextMetrics.experimentalLetterSpacing
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ICanvasRenderingContext2D/letterSpacing
   * @see https://developer.chrome.com/origintrials/#/view_trial/3585991203293757441
   */
  static get experimentalLetterSpacingSupported() {
    let t = L._experimentalLetterSpacingSupported;
    if (t !== void 0) {
      const e = at.get().getCanvasRenderingContext2D().prototype;
      t = L._experimentalLetterSpacingSupported = "letterSpacing" in e || "textLetterSpacing" in e;
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
  constructor(t, e, s, n, r, o, a, l, c) {
    this.text = t, this.style = e, this.width = s, this.height = n, this.lines = r, this.lineWidths = o, this.lineHeight = a, this.maxLineWidth = l, this.fontProperties = c;
  }
  /**
   * Measures the supplied string of text and returns a Rectangle.
   * @param text - The text to measure.
   * @param style - The text style to use for measuring
   * @param canvas - optional specification of the canvas to use for measuring.
   * @param wordWrap
   * @returns Measured width and height of the text.
   */
  static measureText(t = " ", e, s = L._canvas, n = e.wordWrap) {
    var r;
    const o = `${t}:${e.styleKey}`;
    if (L._measurementCache[o])
      return L._measurementCache[o];
    const a = Jn(e), l = L.measureFont(a);
    l.fontSize === 0 && (l.fontSize = e.fontSize, l.ascent = e.fontSize);
    const c = L.__context;
    c.font = a;
    const h = (n ? L._wordWrap(t, e, s) : t).split(/(?:\r\n|\r|\n)/), f = new Array(h.length);
    let p = 0;
    for (let y = 0; y < h.length; y++) {
      const v = L._measureText(h[y], e.letterSpacing, c);
      f[y] = v, p = Math.max(p, v);
    }
    const u = ((r = e._stroke) == null ? void 0 : r.width) || 0;
    let d = p + u;
    e.dropShadow && (d += e.dropShadow.distance);
    const m = e.lineHeight || l.fontSize;
    let g = Math.max(m, l.fontSize + u) + (h.length - 1) * (m + e.leading);
    return e.dropShadow && (g += e.dropShadow.distance), new L(
      t,
      e,
      d,
      g,
      h,
      f,
      m + e.leading,
      p,
      l
    );
  }
  static _measureText(t, e, s) {
    let n = !1;
    L.experimentalLetterSpacingSupported && (L.experimentalLetterSpacing ? (s.letterSpacing = `${e}px`, s.textLetterSpacing = `${e}px`, n = !0) : (s.letterSpacing = "0px", s.textLetterSpacing = "0px"));
    const r = s.measureText(t);
    let o = r.width;
    const a = -r.actualBoundingBoxLeft;
    let l = r.actualBoundingBoxRight - a;
    if (o > 0)
      if (n)
        o -= e, l -= e;
      else {
        const c = (L.graphemeSegmenter(t).length - 1) * e;
        o += c, l += c;
      }
    return Math.max(o, l);
  }
  /**
   * Applies newlines to a string to have it optimally fit into the horizontal
   * bounds set by the Text object's wordWrapWidth property.
   * @param text - String to apply word wrapping to
   * @param style - the style to use when wrapping
   * @param canvas - optional specification of the canvas to use for measuring.
   * @returns New string with new lines applied where required
   */
  static _wordWrap(t, e, s = L._canvas) {
    const n = s.getContext("2d", dn);
    let r = 0, o = "", a = "";
    const l = /* @__PURE__ */ Object.create(null), { letterSpacing: c, whiteSpace: h } = e, f = L._collapseSpaces(h), p = L._collapseNewlines(h);
    let u = !f;
    const d = e.wordWrapWidth + c, m = L._tokenize(t);
    for (let g = 0; g < m.length; g++) {
      let y = m[g];
      if (L._isNewline(y)) {
        if (!p) {
          a += L._addLine(o), u = !f, o = "", r = 0;
          continue;
        }
        y = " ";
      }
      if (f) {
        const _ = L.isBreakingSpace(y), w = L.isBreakingSpace(o[o.length - 1]);
        if (_ && w)
          continue;
      }
      const v = L._getFromCache(y, c, l, n);
      if (v > d)
        if (o !== "" && (a += L._addLine(o), o = "", r = 0), L.canBreakWords(y, e.breakWords)) {
          const _ = L.wordWrapSplit(y);
          for (let w = 0; w < _.length; w++) {
            let x = _[w], A = x, S = 1;
            for (; _[w + S]; ) {
              const C = _[w + S];
              if (!L.canBreakChars(A, C, y, w, e.breakWords))
                x += C;
              else
                break;
              A = C, S++;
            }
            w += S - 1;
            const b = L._getFromCache(x, c, l, n);
            b + r > d && (a += L._addLine(o), u = !1, o = "", r = 0), o += x, r += b;
          }
        } else {
          o.length > 0 && (a += L._addLine(o), o = "", r = 0);
          const _ = g === m.length - 1;
          a += L._addLine(y, !_), u = !1, o = "", r = 0;
        }
      else
        v + r > d && (u = !1, a += L._addLine(o), o = "", r = 0), (o.length > 0 || !L.isBreakingSpace(y) || u) && (o += y, r += v);
    }
    return a += L._addLine(o, !1), a;
  }
  /**
   * Convenience function for logging each line added during the wordWrap method.
   * @param line    - The line of text to add
   * @param newLine - Add new line character to end
   * @returns A formatted line
   */
  static _addLine(t, e = !0) {
    return t = L._trimRight(t), t = e ? `${t}
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
  static _getFromCache(t, e, s, n) {
    let r = s[t];
    return typeof r != "number" && (r = L._measureText(t, e, n) + e, s[t] = r), r;
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
      const s = t[e];
      if (!L.isBreakingSpace(s))
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
    return typeof t != "string" ? !1 : L._newlines.includes(t.charCodeAt(0));
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
    return typeof t != "string" ? !1 : L._breakingSpaces.includes(t.charCodeAt(0));
  }
  /**
   * Splits a string into words, breaking-spaces and newLine characters
   * @param text - The text
   * @returns A tokenized array
   */
  static _tokenize(t) {
    const e = [];
    let s = "";
    if (typeof t != "string")
      return e;
    for (let n = 0; n < t.length; n++) {
      const r = t[n], o = t[n + 1];
      if (L.isBreakingSpace(r, o) || L._isNewline(r)) {
        s !== "" && (e.push(s), s = ""), e.push(r);
        continue;
      }
      s += r;
    }
    return s !== "" && e.push(s), e;
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
  static canBreakChars(t, e, s, n, r) {
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
    return L.graphemeSegmenter(t);
  }
  /**
   * Calculates the ascent, descent and fontSize of a given font-style
   * @param font - String representing the style of the font
   * @returns Font properties object
   */
  static measureFont(t) {
    if (L._fonts[t])
      return L._fonts[t];
    const e = L._context;
    e.font = t;
    const s = e.measureText(L.METRICS_STRING + L.BASELINE_SYMBOL), n = {
      ascent: s.actualBoundingBoxAscent,
      descent: s.actualBoundingBoxDescent,
      fontSize: s.actualBoundingBoxAscent + s.actualBoundingBoxDescent
    };
    return L._fonts[t] = n, n;
  }
  /**
   * Clear font metrics in metrics cache.
   * @param {string} [font] - font name. If font name not set then clear cache for all fonts.
   */
  static clearMetrics(t = "") {
    t ? delete L._fonts[t] : L._fonts = {};
  }
  /**
   * Cached canvas element for measuring text
   * TODO: this should be private, but isn't because of backward compat, will fix later.
   * @ignore
   */
  static get _canvas() {
    if (!L.__canvas) {
      let t;
      try {
        const e = new OffscreenCanvas(0, 0), s = e.getContext("2d", dn);
        if (s != null && s.measureText)
          return L.__canvas = e, e;
        t = at.get().createCanvas();
      } catch {
        t = at.get().createCanvas();
      }
      t.width = t.height = 10, L.__canvas = t;
    }
    return L.__canvas;
  }
  /**
   * TODO: this should be private, but isn't because of backward compat, will fix later.
   * @ignore
   */
  static get _context() {
    return L.__context || (L.__context = L._canvas.getContext("2d", dn)), L.__context;
  }
};
le.METRICS_STRING = "|ÉqÅ";
le.BASELINE_SYMBOL = "M";
le.BASELINE_MULTIPLIER = 1.4;
le.HEIGHT_MULTIPLIER = 2;
le.graphemeSegmenter = (() => {
  if (typeof (Intl == null ? void 0 : Intl.Segmenter) == "function") {
    const i = new Intl.Segmenter();
    return (t) => [...i.segment(t)].map((e) => e.segment);
  }
  return (i) => [...i];
})();
le.experimentalLetterSpacing = !1;
le._fonts = {};
le._newlines = [
  10,
  // line feed
  13
  // carriage return
];
le._breakingSpaces = [
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
le._measurementCache = {};
let $n = le;
function sl(i, t) {
  if (i.texture === H.WHITE && !i.fill)
    return ft.shared.setValue(i.color).setAlpha(i.alpha ?? 1).toHexa();
  if (i.fill) {
    if (i.fill instanceof Mr) {
      const e = i.fill, s = t.createPattern(e.texture.source.resource, "repeat"), n = e.transform.copyTo(X.shared);
      return n.scale(
        e.texture.frame.width,
        e.texture.frame.height
      ), s.setTransform(n), s;
    } else if (i.fill instanceof As) {
      const e = i.fill;
      if (e.type === "linear") {
        const s = t.createLinearGradient(
          e.x0,
          e.y0,
          e.x1,
          e.y1
        );
        return e.gradientStops.forEach((n) => {
          s.addColorStop(n.offset, ft.shared.setValue(n.color).toHex());
        }), s;
      }
    }
  } else {
    const e = t.createPattern(i.texture.source.resource, "repeat"), s = i.matrix.copyTo(X.shared);
    return s.scale(i.texture.frame.width, i.texture.frame.height), e.setTransform(s), e;
  }
  return dt("FillStyle not recognised", i), "red";
}
function Ec(i) {
  if (i === "")
    return [];
  typeof i == "string" && (i = [i]);
  const t = [];
  for (let e = 0, s = i.length; e < s; e++) {
    const n = i[e];
    if (Array.isArray(n)) {
      if (n.length !== 2)
        throw new Error(`[BitmapFont]: Invalid character range length, expecting 2 got ${n.length}.`);
      if (n[0].length === 0 || n[1].length === 0)
        throw new Error("[BitmapFont]: Invalid character delimiter.");
      const r = n[0].charCodeAt(0), o = n[1].charCodeAt(0);
      if (o < r)
        throw new Error("[BitmapFont]: Invalid character range.");
      for (let a = r, l = o; a <= l; a++)
        t.push(String.fromCharCode(a));
    } else
      t.push(...Array.from(n));
  }
  if (t.length === 0)
    throw new Error("[BitmapFont]: Empty set when resolving characters.");
  return t;
}
const Bc = class Rc extends uc {
  /**
   * @param options - The options for the dynamic bitmap font.
   */
  constructor(t) {
    super(), this.resolution = 1, this.pages = [], this._padding = 0, this._measureCache = /* @__PURE__ */ Object.create(null), this._currentChars = [], this._currentX = 0, this._currentY = 0, this._currentPageIndex = -1, this._skipKerning = !1;
    const e = { ...Rc.defaultOptions, ...t };
    this._textureSize = e.textureSize, this._mipmap = e.mipmap;
    const s = e.style.clone();
    e.overrideFill && (s._fill.color = 16777215, s._fill.alpha = 1, s._fill.texture = H.WHITE, s._fill.fill = null), this.applyFillAsTint = e.overrideFill;
    const n = s.fontSize;
    s.fontSize = this.baseMeasurementFontSize;
    const r = Jn(s);
    e.overrideSize ? s._stroke && (s._stroke.width *= this.baseRenderedFontSize / n) : s.fontSize = this.baseRenderedFontSize = n, this._style = s, this._skipKerning = e.skipKerning ?? !1, this.resolution = e.resolution ?? 1, this._padding = e.padding ?? 4, this.fontMetrics = $n.measureFont(r), this.lineHeight = s.lineHeight || this.fontMetrics.fontSize || s.fontSize;
  }
  ensureCharacters(t) {
    var e, s;
    const n = Ec(t).filter((g) => !this._currentChars.includes(g)).filter((g, y, v) => v.indexOf(g) === y);
    if (!n.length)
      return;
    this._currentChars = [...this._currentChars, ...n];
    let r;
    this._currentPageIndex === -1 ? r = this._nextPage() : r = this.pages[this._currentPageIndex];
    let { canvas: o, context: a } = r.canvasAndContext, l = r.texture.source;
    const c = this._style;
    let h = this._currentX, f = this._currentY;
    const p = this.baseRenderedFontSize / this.baseMeasurementFontSize, u = this._padding * p;
    let d = 0, m = !1;
    for (let g = 0; g < n.length; g++) {
      const y = n[g], v = $n.measureText(y, c, o, !1), _ = Math.ceil((c.fontStyle === "italic" ? 2 : 1) * v.width);
      v.lineHeight = v.height;
      const w = v.width * p, x = v.height * p, A = _ + u * 2, S = x + u * 2;
      if (m = !1, y !== `
` && y !== "\r" && y !== "	" && y !== " " && (m = !0, d = Math.ceil(Math.max(S, d))), h + A > this._textureSize && (f += d, d = S, h = 0, f + d > this._textureSize)) {
        l.update();
        const C = this._nextPage();
        o = C.canvasAndContext.canvas, a = C.canvasAndContext.context, l = C.texture.source, f = 0;
      }
      const b = w / p - (((e = c.dropShadow) == null ? void 0 : e.distance) ?? 0) - (((s = c._stroke) == null ? void 0 : s.width) ?? 0);
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
          h + u,
          f + u,
          p,
          c
        );
        const C = l.width * p, P = l.height * p, M = new yt(
          h / C * l.width,
          f / P * l.height,
          A / C * l.width,
          S / P * l.height
        );
        this.chars[y].texture = new H({
          source: l,
          frame: M
        }), h += Math.ceil(A);
      }
    }
    l.update(), this._currentX = h, this._currentY = f, this._skipKerning && this._applyKerning(n, a);
  }
  /**
   * @deprecated since 8.0.0
   * The map of base page textures (i.e., sheets of glyphs).
   */
  get pageTextures() {
    return K(Q, "BitmapFont.pageTextures is deprecated, please use BitmapFont.pages instead."), this.pages;
  }
  _applyKerning(t, e) {
    const s = this._measureCache;
    for (let n = 0; n < t.length; n++) {
      const r = t[n];
      for (let o = 0; o < this._currentChars.length; o++) {
        const a = this._currentChars[o];
        let l = s[r];
        l || (l = s[r] = e.measureText(r).width);
        let c = s[a];
        c || (c = s[a] = e.measureText(a).width);
        let h = e.measureText(r + a).width, f = h - (l + c);
        f && (this.chars[r].kerning[a] = f), h = e.measureText(r + a).width, f = h - (l + c), f && (this.chars[a].kerning[r] = f);
      }
    }
  }
  _nextPage() {
    this._currentPageIndex++;
    const t = this.resolution, e = il.getOptimalCanvasAndContext(
      this._textureSize,
      this._textureSize,
      t
    );
    this._setupContext(e.context, this._style, t);
    const s = t * (this.baseRenderedFontSize / this.baseMeasurementFontSize), n = new H({
      source: new Ui({
        resource: e.canvas,
        resolution: s,
        alphaMode: "premultiply-alpha-on-upload",
        autoGenerateMipmaps: this._mipmap
      })
    }), r = {
      canvasAndContext: e,
      texture: n
    };
    return this.pages[this._currentPageIndex] = r, r;
  }
  // canvas style!
  _setupContext(t, e, s) {
    e.fontSize = this.baseRenderedFontSize, t.scale(s, s), t.font = Jn(e), e.fontSize = this.baseMeasurementFontSize, t.textBaseline = e.textBaseline;
    const n = e._stroke, r = (n == null ? void 0 : n.width) ?? 0;
    if (n && (t.lineWidth = r, t.lineJoin = n.join, t.miterLimit = n.miterLimit, t.strokeStyle = sl(n, t)), e._fill && (t.fillStyle = sl(e._fill, t)), e.dropShadow) {
      const o = e.dropShadow, a = ft.shared.setValue(o.color).toArray(), l = o.blur * s, c = o.distance * s;
      t.shadowColor = `rgba(${a[0] * 255},${a[1] * 255},${a[2] * 255},${o.alpha})`, t.shadowBlur = l, t.shadowOffsetX = Math.cos(o.angle) * c, t.shadowOffsetY = Math.sin(o.angle) * c;
    } else
      t.shadowColor = "black", t.shadowBlur = 0, t.shadowOffsetX = 0, t.shadowOffsetY = 0;
  }
  _drawGlyph(t, e, s, n, r, o) {
    const a = e.text, l = e.fontProperties, c = o._stroke, h = ((c == null ? void 0 : c.width) ?? 0) * r, f = s + h / 2, p = n - h / 2, u = l.descent * r, d = e.lineHeight * r;
    o.stroke && h && t.strokeText(a, f, p + d - u), o._fill && t.fillText(a, f, p + d - u);
  }
  destroy() {
    super.destroy();
    for (let t = 0; t < this.pages.length; t++) {
      const { canvasAndContext: e, texture: s } = this.pages[t];
      il.returnCanvasAndContext(e), s.destroy(!0);
    }
    this.pages = null;
  }
};
Bc.defaultOptions = {
  textureSize: 512,
  style: new hi(),
  mipmap: !0
};
let rl = Bc;
function eg(i, t, e, s) {
  const n = {
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
  n.offsetY = e.baseLineOffset;
  let r = n.lines[0], o = null, a = !0;
  const l = {
    spaceWord: !1,
    width: 0,
    start: 0,
    index: 0,
    // use index to not modify the array as we use it a lot!
    positions: [],
    chars: []
  }, c = (d) => {
    const m = r.width;
    for (let g = 0; g < l.index; g++) {
      const y = d.positions[g];
      r.chars.push(d.chars[g]), r.charPositions.push(y + m);
    }
    r.width += d.width, a = !1, l.width = 0, l.index = 0, l.chars.length = 0;
  }, h = () => {
    let d = r.chars.length - 1;
    if (s) {
      let m = r.chars[d];
      for (; m === " "; )
        r.width -= e.chars[m].xAdvance, m = r.chars[--d];
    }
    n.width = Math.max(n.width, r.width), r = {
      width: 0,
      charPositions: [],
      chars: [],
      spaceWidth: 0,
      spacesIndex: []
    }, a = !0, n.lines.push(r), n.height += e.lineHeight;
  }, f = e.baseMeasurementFontSize / t.fontSize, p = t.letterSpacing * f, u = t.wordWrapWidth * f;
  for (let d = 0; d < i.length + 1; d++) {
    let m;
    const g = d === i.length;
    g || (m = i[d]);
    const y = e.chars[m] || e.chars[" "];
    if (/(?:\s)/.test(m) || m === "\r" || m === `
` || g) {
      if (!a && t.wordWrap && r.width + l.width - p > u ? (h(), c(l), g || r.charPositions.push(0)) : (l.start = r.width, c(l), g || r.charPositions.push(0)), m === "\r" || m === `
`)
        r.width !== 0 && h();
      else if (!g) {
        const v = y.xAdvance + (y.kerning[o] || 0) + p;
        r.width += v, r.spaceWidth = v, r.spacesIndex.push(r.charPositions.length), r.chars.push(m);
      }
    } else {
      const v = y.kerning[o] || 0, _ = y.xAdvance + v + p;
      l.positions[l.index++] = l.width + v, l.chars.push(m), l.width += _;
    }
    o = m;
  }
  return h(), t.align === "center" ? ig(n) : t.align === "right" ? sg(n) : t.align === "justify" && rg(n), n;
}
function ig(i) {
  for (let t = 0; t < i.lines.length; t++) {
    const e = i.lines[t], s = i.width / 2 - e.width / 2;
    for (let n = 0; n < e.charPositions.length; n++)
      e.charPositions[n] += s;
  }
}
function sg(i) {
  for (let t = 0; t < i.lines.length; t++) {
    const e = i.lines[t], s = i.width - e.width;
    for (let n = 0; n < e.charPositions.length; n++)
      e.charPositions[n] += s;
  }
}
function rg(i) {
  const t = i.width;
  for (let e = 0; e < i.lines.length; e++) {
    const s = i.lines[e];
    let n = 0, r = s.spacesIndex[n++], o = 0;
    const a = s.spacesIndex.length, l = (t - s.width) / a;
    for (let c = 0; c < s.charPositions.length; c++)
      c === r && (r = s.spacesIndex[n++], o += l), s.charPositions[c] += o;
  }
}
let Xs = 0;
class ng {
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
    var s;
    let n = `${e.fontFamily}-bitmap`, r = !0;
    if (e._fill.fill && !e._stroke)
      n += e._fill.fill.styleKey, r = !1;
    else if (e._stroke || e.dropShadow) {
      let a = e.styleKey;
      a = a.substring(0, a.lastIndexOf("-")), n = `${a}-bitmap`, r = !1;
    }
    if (!rt.has(n)) {
      const a = new rl({
        style: e,
        overrideFill: r,
        overrideSize: !0,
        ...this.defaultOptions
      });
      Xs++, Xs > 50 && dt("BitmapText", `You have dynamically created ${Xs} bitmap fonts, this can be inefficient. Try pre installing your font styles using \`BitmapFont.install({name:"style1", style})\``), a.once("destroy", () => {
        Xs--, rt.remove(n);
      }), rt.set(
        n,
        a
      );
    }
    const o = rt.get(n);
    return (s = o.ensureCharacters) == null || s.call(o, t), o;
  }
  /**
   * Get the layout of a text for the specified style.
   * @param text - The text to get the layout for
   * @param style - The style to use
   * @param trimEnd - Whether to ignore whitespaces at the end of each line
   */
  getLayout(t, e, s = !0) {
    const n = this.getFont(t, e);
    return eg([...t], e, n, s);
  }
  /**
   * Measure the text using the specified style.
   * @param text - The text to measure
   * @param style - The style to use
   * @param trimEnd - Whether to ignore whitespaces at the end of each line
   */
  measureText(t, e, s = !0) {
    return this.getLayout(t, e, s);
  }
  // eslint-disable-next-line max-len
  install(...t) {
    var e, s, n, r;
    let o = t[0];
    typeof o == "string" && (o = {
      name: o,
      style: t[1],
      chars: (e = t[2]) == null ? void 0 : e.chars,
      resolution: (s = t[2]) == null ? void 0 : s.resolution,
      padding: (n = t[2]) == null ? void 0 : n.padding,
      skipKerning: (r = t[2]) == null ? void 0 : r.skipKerning
    }, K(Q, "BitmapFontManager.install(name, style, options) is deprecated, use BitmapFontManager.install({name, style, ...options})"));
    const a = o == null ? void 0 : o.name;
    if (!a)
      throw new Error("[BitmapFontManager] Property `name` is required.");
    o = { ...this.defaultOptions, ...o };
    const l = o.style, c = l instanceof hi ? l : new hi(l), h = c._fill.fill !== null && c._fill.fill !== void 0, f = new rl({
      style: c,
      overrideFill: h,
      skipKerning: o.skipKerning,
      padding: o.padding,
      resolution: o.resolution,
      overrideSize: !1
    }), p = Ec(o.chars);
    return f.ensureCharacters(p.join("")), rt.set(`${a}-bitmap`, f), f.once("destroy", () => rt.remove(`${a}-bitmap`)), f;
  }
  /**
   * Uninstalls a bitmap font from the cache.
   * @param {string} name - The name of the bitmap font to uninstall.
   */
  uninstall(t) {
    const e = `${t}-bitmap`, s = rt.get(e);
    s && s.destroy();
  }
}
const to = new ng();
class Ic extends uc {
  constructor(t, e) {
    super();
    const { textures: s, data: n } = t;
    Object.keys(n.pages).forEach((r) => {
      const o = n.pages[parseInt(r, 10)], a = s[o.id];
      this.pages.push({ texture: a });
    }), Object.keys(n.chars).forEach((r) => {
      const o = n.chars[r], {
        frame: a,
        source: l
      } = s[o.page], c = new yt(
        o.x + a.x,
        o.y + a.y,
        o.width,
        o.height
      ), h = new H({
        source: l,
        frame: c
      });
      this.chars[r] = {
        id: r.codePointAt(0),
        xOffset: o.xOffset,
        yOffset: o.yOffset,
        xAdvance: o.xAdvance,
        kerning: o.kerning ?? {},
        texture: h
      };
    }), this.baseRenderedFontSize = n.fontSize, this.baseMeasurementFontSize = n.fontSize, this.fontMetrics = {
      ascent: 0,
      descent: 0,
      fontSize: n.fontSize
    }, this.baseLineOffset = n.baseLineOffset, this.lineHeight = n.lineHeight, this.fontFamily = n.fontFamily, this.distanceField = n.distanceField ?? {
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
    to.install(t);
  }
  /**
   * Uninstalls a bitmap font from the cache.
   * @param {string} name - The name of the bitmap font to uninstall.
   */
  static uninstall(t) {
    to.uninstall(t);
  }
}
const pn = {
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
    const s = {
      chars: {},
      pages: [],
      lineHeight: 0,
      fontSize: 0,
      fontFamily: "",
      distanceField: null,
      baseLineOffset: 0
    }, [n] = e.info, [r] = e.common, [o] = e.distanceField ?? [];
    o && (s.distanceField = {
      range: parseInt(o.distanceRange, 10),
      type: o.fieldType
    }), s.fontSize = parseInt(n.size, 10), s.fontFamily = n.face, s.lineHeight = parseInt(r.lineHeight, 10);
    const a = e.page;
    for (let f = 0; f < a.length; f++)
      s.pages.push({
        id: parseInt(a[f].id, 10) || 0,
        file: a[f].file
      });
    const l = {};
    s.baseLineOffset = s.lineHeight - parseInt(r.base, 10);
    const c = e.char;
    for (let f = 0; f < c.length; f++) {
      const p = c[f], u = parseInt(p.id, 10);
      let d = p.letter ?? p.char ?? String.fromCharCode(u);
      d === "space" && (d = " "), l[u] = d, s.chars[d] = {
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
    const h = e.kerning || [];
    for (let f = 0; f < h.length; f++) {
      const p = parseInt(h[f].first, 10), u = parseInt(h[f].second, 10), d = parseInt(h[f].amount, 10);
      s.chars[l[u]].kerning[l[p]] = d;
    }
    return s;
  }
}, nl = {
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
    }, e = i.getElementsByTagName("info")[0], s = i.getElementsByTagName("common")[0], n = i.getElementsByTagName("distanceField")[0];
    n && (t.distanceField = {
      type: n.getAttribute("fieldType"),
      range: parseInt(n.getAttribute("distanceRange"), 10)
    });
    const r = i.getElementsByTagName("page"), o = i.getElementsByTagName("char"), a = i.getElementsByTagName("kerning");
    t.fontSize = parseInt(e.getAttribute("size"), 10), t.fontFamily = e.getAttribute("face"), t.lineHeight = parseInt(s.getAttribute("lineHeight"), 10);
    for (let c = 0; c < r.length; c++)
      t.pages.push({
        id: parseInt(r[c].getAttribute("id"), 10) || 0,
        file: r[c].getAttribute("file")
      });
    const l = {};
    t.baseLineOffset = t.lineHeight - parseInt(s.getAttribute("base"), 10);
    for (let c = 0; c < o.length; c++) {
      const h = o[c], f = parseInt(h.getAttribute("id"), 10);
      let p = h.getAttribute("letter") ?? h.getAttribute("char") ?? String.fromCharCode(f);
      p === "space" && (p = " "), l[f] = p, t.chars[p] = {
        id: f,
        // texture deets..
        page: parseInt(h.getAttribute("page"), 10) || 0,
        x: parseInt(h.getAttribute("x"), 10),
        y: parseInt(h.getAttribute("y"), 10),
        width: parseInt(h.getAttribute("width"), 10),
        height: parseInt(h.getAttribute("height"), 10),
        // render deets..
        xOffset: parseInt(h.getAttribute("xoffset"), 10),
        yOffset: parseInt(h.getAttribute("yoffset"), 10),
        // + baseLineOffset,
        xAdvance: parseInt(h.getAttribute("xadvance"), 10),
        kerning: {}
      };
    }
    for (let c = 0; c < a.length; c++) {
      const h = parseInt(a[c].getAttribute("first"), 10), f = parseInt(a[c].getAttribute("second"), 10), p = parseInt(a[c].getAttribute("amount"), 10);
      t.chars[l[f]].kerning[l[h]] = p;
    }
    return t;
  }
}, ol = {
  test(i) {
    return typeof i == "string" && i.includes("<font>") ? nl.test(at.get().parseXML(i)) : !1;
  },
  parse(i) {
    return nl.parse(at.get().parseXML(i));
  }
}, og = [".xml", ".fnt"], ag = {
  extension: {
    type: z.CacheParser,
    name: "cacheBitmapFont"
  },
  test: (i) => i instanceof Ic,
  getCacheableAssets(i, t) {
    const e = {};
    return i.forEach((s) => {
      e[s] = t, e[`${s}-bitmap`] = t;
    }), e[`${t.fontFamily}-bitmap`] = t, e;
  }
}, lg = {
  extension: {
    type: z.LoadParser,
    priority: Re.Normal
  },
  name: "loadBitmapFont",
  test(i) {
    return og.includes(St.extname(i).toLowerCase());
  },
  async testParse(i) {
    return pn.test(i) || ol.test(i);
  },
  async parse(i, t, e) {
    const s = pn.test(i) ? pn.parse(i) : ol.parse(i), { src: n } = t, { pages: r } = s, o = [], a = s.distanceField ? {
      scaleMode: "linear",
      alphaMode: "premultiply-alpha-on-upload",
      autoGenerateMipmaps: !1,
      resolution: 1
    } : {};
    for (let h = 0; h < r.length; ++h) {
      const f = r[h].file;
      let p = St.join(St.dirname(n), f);
      p = Un(p, n), o.push({
        src: p,
        data: a
      });
    }
    const l = await e.load(o), c = o.map((h) => l[h.src]);
    return new Ic({
      data: s,
      textures: c
    }, n);
  },
  async load(i, t) {
    return await (await at.get().fetch(i)).text();
  },
  async unload(i, t, e) {
    await Promise.all(i.pages.map((s) => e.unload(s.texture.source._sourceOrigin))), i.destroy();
  }
};
class hg {
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
      for (let s = 0; s < e; s++)
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
const cg = {
  extension: {
    type: z.CacheParser,
    name: "cacheTextureArray"
  },
  test: (i) => Array.isArray(i) && i.every((t) => t instanceof H),
  getCacheableAssets: (i, t) => {
    const e = {};
    return i.forEach((s) => {
      t.forEach((n, r) => {
        e[s + (r === 0 ? "" : r + 1)] = n;
      });
    }), e;
  }
};
async function Oc(i) {
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
const ug = {
  extension: {
    type: z.DetectionParser,
    priority: 1
  },
  test: async () => Oc(
    // eslint-disable-next-line max-len
    "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A="
  ),
  add: async (i) => [...i, "avif"],
  remove: async (i) => i.filter((t) => t !== "avif")
}, al = ["png", "jpg", "jpeg"], dg = {
  extension: {
    type: z.DetectionParser,
    priority: -1
  },
  test: () => Promise.resolve(!0),
  add: async (i) => [...i, ...al],
  remove: async (i) => i.filter((t) => !al.includes(t))
}, pg = "WorkerGlobalScope" in globalThis && globalThis instanceof globalThis.WorkerGlobalScope;
function Lo(i) {
  return pg ? !1 : document.createElement("video").canPlayType(i) !== "";
}
const fg = {
  extension: {
    type: z.DetectionParser,
    priority: 0
  },
  test: async () => Lo("video/mp4"),
  add: async (i) => [...i, "mp4", "m4v"],
  remove: async (i) => i.filter((t) => t !== "mp4" && t !== "m4v")
}, mg = {
  extension: {
    type: z.DetectionParser,
    priority: 0
  },
  test: async () => Lo("video/ogg"),
  add: async (i) => [...i, "ogv"],
  remove: async (i) => i.filter((t) => t !== "ogv")
}, gg = {
  extension: {
    type: z.DetectionParser,
    priority: 0
  },
  test: async () => Lo("video/webm"),
  add: async (i) => [...i, "webm"],
  remove: async (i) => i.filter((t) => t !== "webm")
}, yg = {
  extension: {
    type: z.DetectionParser,
    priority: 0
  },
  test: async () => Oc(
    "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA="
  ),
  add: async (i) => [...i, "webp"],
  remove: async (i) => i.filter((t) => t !== "webp")
};
class xg {
  constructor() {
    this._parsers = [], this._parsersValidated = !1, this.parsers = new Proxy(this._parsers, {
      set: (t, e, s) => (this._parsersValidated = !1, t[e] = s, !0)
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
    const s = {
      promise: null,
      parser: null
    };
    return s.promise = (async () => {
      var n, r;
      let o = null, a = null;
      if (e.loadParser && (a = this._parserHash[e.loadParser], a || dt(`[Assets] specified load parser "${e.loadParser}" not found while loading ${t}`)), !a) {
        for (let l = 0; l < this.parsers.length; l++) {
          const c = this.parsers[l];
          if (c.load && (n = c.test) != null && n.call(c, t, e, this)) {
            a = c;
            break;
          }
        }
        if (!a)
          return dt(`[Assets] ${t} could not be loaded as we don't know how to parse it, ensure the correct parser has been added`), null;
      }
      o = await a.load(t, e, this), s.parser = a;
      for (let l = 0; l < this.parsers.length; l++) {
        const c = this.parsers[l];
        c.parse && c.parse && await ((r = c.testParse) == null ? void 0 : r.call(c, o, e, this)) && (o = await c.parse(o, e, this) || o, s.parser = c);
      }
      return o;
    })(), s;
  }
  async load(t, e) {
    this._parsersValidated || this._validateParsers();
    let s = 0;
    const n = {}, r = ur(t), o = ne(t, (c) => ({
      alias: [c],
      src: c,
      data: {}
    })), a = o.length, l = o.map(async (c) => {
      const h = St.toAbsolute(c.src);
      if (!n[c.src])
        try {
          this.promiseCache[h] || (this.promiseCache[h] = this._getLoadPromiseAndParser(h, c)), n[c.src] = await this.promiseCache[h].promise, e && e(++s / a);
        } catch (f) {
          throw delete this.promiseCache[h], delete n[c.src], new Error(`[Loader.load] Failed to load ${h}.
${f}`);
        }
    });
    return await Promise.all(l), r ? n[o[0].src] : n;
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
    const e = ne(t, (s) => ({
      alias: [s],
      src: s
    })).map(async (s) => {
      var n, r;
      const o = St.toAbsolute(s.src), a = this.promiseCache[o];
      if (a) {
        const l = await a.promise;
        delete this.promiseCache[o], await ((r = (n = a.parser) == null ? void 0 : n.unload) == null ? void 0 : r.call(n, l, s, this));
      }
    });
    await Promise.all(e);
  }
  /** validates our parsers, right now it only checks for name conflicts but we can add more here as required! */
  _validateParsers() {
    this._parsersValidated = !0, this._parserHash = this._parsers.filter((t) => t.name).reduce((t, e) => (e.name ? t[e.name] && dt(`[Assets] loadParser name conflict "${e.name}"`) : dt("[Assets] loadParser should have a name"), { ...t, [e.name]: e }), {});
  }
}
function Vi(i, t) {
  if (Array.isArray(t)) {
    for (const e of t)
      if (i.startsWith(`data:${e}`))
        return !0;
    return !1;
  }
  return i.startsWith(`data:${t}`);
}
function Ni(i, t) {
  const e = i.split("?")[0], s = St.extname(e).toLowerCase();
  return Array.isArray(t) ? t.includes(s) : s === t;
}
const vg = ".json", bg = "application/json", _g = {
  extension: {
    type: z.LoadParser,
    priority: Re.Low
  },
  name: "loadJson",
  test(i) {
    return Vi(i, bg) || Ni(i, vg);
  },
  async load(i) {
    return await (await at.get().fetch(i)).json();
  }
}, wg = ".txt", Ag = "text/plain", Sg = {
  name: "loadTxt",
  extension: {
    type: z.LoadParser,
    priority: Re.Low,
    name: "loadTxt"
  },
  test(i) {
    return Vi(i, Ag) || Ni(i, wg);
  },
  async load(i) {
    return await (await at.get().fetch(i)).text();
  }
}, Cg = [
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
], Pg = [".ttf", ".otf", ".woff", ".woff2"], Mg = [
  "font/ttf",
  "font/otf",
  "font/woff",
  "font/woff2"
], Tg = /^(--|-?[A-Z_])[0-9A-Z_-]*$/i;
function kg(i) {
  const t = St.extname(i), e = St.basename(i, t).replace(/(-|_)/g, " ").toLowerCase().split(" ").map((r) => r.charAt(0).toUpperCase() + r.slice(1));
  let s = e.length > 0;
  for (const r of e)
    if (!r.match(Tg)) {
      s = !1;
      break;
    }
  let n = e.join(" ");
  return s || (n = `"${n.replace(/[\\"]/g, "\\$&")}"`), n;
}
const Eg = /^[0-9A-Za-z%:/?#\[\]@!\$&'()\*\+,;=\-._~]*$/;
function Bg(i) {
  return Eg.test(i) ? i : encodeURI(i);
}
const Rg = {
  extension: {
    type: z.LoadParser,
    priority: Re.Low
  },
  name: "loadWebFont",
  test(i) {
    return Vi(i, Mg) || Ni(i, Pg);
  },
  async load(i, t) {
    var e, s, n;
    const r = at.get().getFontFaceSet();
    if (r) {
      const o = [], a = ((e = t.data) == null ? void 0 : e.family) ?? kg(i), l = ((n = (s = t.data) == null ? void 0 : s.weights) == null ? void 0 : n.filter((h) => Cg.includes(h))) ?? ["normal"], c = t.data ?? {};
      for (let h = 0; h < l.length; h++) {
        const f = l[h], p = new FontFace(a, `url(${Bg(i)})`, {
          ...c,
          weight: f
        });
        await p.load(), r.add(p), o.push(p);
      }
      return rt.set(`${a}-and-url`, {
        url: i,
        fontFaces: o
      }), o.length === 1 ? o[0] : o;
    }
    return dt("[loadWebFont] FontFace API is not supported. Skipping loading font"), null;
  },
  unload(i) {
    (Array.isArray(i) ? i : [i]).forEach((t) => {
      rt.remove(t.family), at.get().getFontFaceSet().delete(t);
    });
  }
};
function zo(i, t = 1) {
  var e;
  const s = (e = Gi.RETINA_PREFIX) == null ? void 0 : e.exec(i);
  return s ? parseFloat(s[1]) : t;
}
function Do(i, t, e) {
  i.label = e, i._sourceOrigin = e;
  const s = new H({
    source: i,
    label: e
  }), n = () => {
    delete t.promiseCache[e], rt.has(e) && rt.remove(e);
  };
  return s.source.once("destroy", () => {
    t.promiseCache[e] && (dt("[Assets] A TextureSource managed by Assets was destroyed instead of unloaded! Use Assets.unload() instead of destroying the TextureSource."), n());
  }), s.once("destroy", () => {
    i.destroyed || (dt("[Assets] A Texture managed by Assets was destroyed instead of unloaded! Use Assets.unload() instead of destroying the Texture."), n());
  }), s;
}
const Ig = ".svg", Og = "image/svg+xml", Fg = {
  extension: {
    type: z.LoadParser,
    priority: Re.Low,
    name: "loadSVG"
  },
  name: "loadSVG",
  config: {
    crossOrigin: "anonymous",
    parseAsGraphicsContext: !1
  },
  test(i) {
    return Vi(i, Og) || Ni(i, Ig);
  },
  async load(i, t, e) {
    return t.data.parseAsGraphicsContext ?? this.config.parseAsGraphicsContext ? zg(i) : Lg(i, t, e, this.config.crossOrigin);
  },
  unload(i) {
    i.destroy(!0);
  }
};
async function Lg(i, t, e, s) {
  var n, r, o;
  const a = await (await at.get().fetch(i)).blob(), l = URL.createObjectURL(a), c = new Image();
  c.src = l, c.crossOrigin = s, await c.decode(), URL.revokeObjectURL(l);
  const h = document.createElement("canvas"), f = h.getContext("2d"), p = ((n = t.data) == null ? void 0 : n.resolution) || zo(i), u = ((r = t.data) == null ? void 0 : r.width) ?? c.width, d = ((o = t.data) == null ? void 0 : o.height) ?? c.height;
  h.width = u * p, h.height = d * p, f.drawImage(c, 0, 0, u * p, d * p);
  const { parseAsGraphicsContext: m, ...g } = t.data, y = new Ui({
    resource: h,
    alphaMode: "premultiply-alpha-on-upload",
    resolution: p,
    ...g
  });
  return Do(y, e, i);
}
async function zg(i) {
  const t = await (await at.get().fetch(i)).text(), e = new Qt();
  return e.svg(t), e;
}
const Dg = `(function () {
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
let Pi = null, eo = class {
  constructor() {
    Pi || (Pi = URL.createObjectURL(new Blob([Dg], { type: "application/javascript" }))), this.worker = new Worker(Pi);
  }
};
eo.revokeObjectURL = function() {
  Pi && (URL.revokeObjectURL(Pi), Pi = null);
};
const Ug = `(function () {
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
let Mi = null;
class Fc {
  constructor() {
    Mi || (Mi = URL.createObjectURL(new Blob([Ug], { type: "application/javascript" }))), this.worker = new Worker(Mi);
  }
}
Fc.revokeObjectURL = function() {
  Mi && (URL.revokeObjectURL(Mi), Mi = null);
};
let ll = 0, fn;
class Gg {
  constructor() {
    this._initialized = !1, this._createdWorkers = 0, this._workerPool = [], this._queue = [], this._resolveHash = {};
  }
  isImageBitmapSupported() {
    return this._isImageBitmapSupported !== void 0 ? this._isImageBitmapSupported : (this._isImageBitmapSupported = new Promise((t) => {
      const { worker: e } = new eo();
      e.addEventListener("message", (s) => {
        e.terminate(), eo.revokeObjectURL(), t(s.data);
      });
    }), this._isImageBitmapSupported);
  }
  loadImageBitmap(t, e) {
    var s;
    return this._run("loadImageBitmap", [t, (s = e == null ? void 0 : e.data) == null ? void 0 : s.alphaMode]);
  }
  async _initWorkers() {
    this._initialized || (this._initialized = !0);
  }
  _getWorker() {
    fn === void 0 && (fn = navigator.hardwareConcurrency || 4);
    let t = this._workerPool.pop();
    return !t && this._createdWorkers < fn && (this._createdWorkers++, t = new Fc().worker, t.addEventListener("message", (e) => {
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
    const s = new Promise((n, r) => {
      this._queue.push({ id: t, arguments: e, resolve: n, reject: r });
    });
    return this._next(), s;
  }
  _next() {
    if (!this._queue.length)
      return;
    const t = this._getWorker();
    if (!t)
      return;
    const e = this._queue.pop(), s = e.id;
    this._resolveHash[ll] = { resolve: e.resolve, reject: e.reject }, t.postMessage({
      data: e.arguments,
      uuid: ll++,
      id: s
    });
  }
}
const hl = new Gg(), Vg = [".jpeg", ".jpg", ".png", ".webp", ".avif"], Ng = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif"
];
async function Hg(i, t) {
  var e;
  const s = await at.get().fetch(i);
  if (!s.ok)
    throw new Error(`[loadImageBitmap] Failed to fetch ${i}: ${s.status} ${s.statusText}`);
  const n = await s.blob();
  return ((e = t == null ? void 0 : t.data) == null ? void 0 : e.alphaMode) === "premultiplied-alpha" ? createImageBitmap(n, { premultiplyAlpha: "none" }) : createImageBitmap(n);
}
const Lc = {
  name: "loadTextures",
  extension: {
    type: z.LoadParser,
    priority: Re.High,
    name: "loadTextures"
  },
  config: {
    preferWorkers: !0,
    preferCreateImageBitmap: !0,
    crossOrigin: "anonymous"
  },
  test(i) {
    return Vi(i, Ng) || Ni(i, Vg);
  },
  async load(i, t, e) {
    var s;
    let n = null;
    globalThis.createImageBitmap && this.config.preferCreateImageBitmap ? this.config.preferWorkers && await hl.isImageBitmapSupported() ? n = await hl.loadImageBitmap(i, t) : n = await Hg(i, t) : n = await new Promise((o) => {
      n = new Image(), n.crossOrigin = this.config.crossOrigin, n.src = i, n.complete ? o(n) : n.onload = () => {
        o(n);
      };
    });
    const r = new Ui({
      resource: n,
      alphaMode: "premultiply-alpha-on-upload",
      resolution: ((s = t.data) == null ? void 0 : s.resolution) || zo(i),
      ...t.data
    });
    return Do(r, e, i);
  },
  unload(i) {
    i.destroy(!0);
  }
}, zc = [".mp4", ".m4v", ".webm", ".ogg", ".ogv", ".h264", ".avi", ".mov"], jg = zc.map((i) => `video/${i.substring(1)}`);
function Yg(i, t, e) {
  e === void 0 && !t.startsWith("data:") ? i.crossOrigin = Xg(t) : e !== !1 && (i.crossOrigin = typeof e == "string" ? e : "anonymous");
}
function Wg(i) {
  return new Promise((t, e) => {
    i.addEventListener("canplaythrough", s), i.addEventListener("error", n), i.load();
    function s() {
      r(), t();
    }
    function n(o) {
      r(), e(o);
    }
    function r() {
      i.removeEventListener("canplaythrough", s), i.removeEventListener("error", n);
    }
  });
}
function Xg(i, t = globalThis.location) {
  if (i.startsWith("data:"))
    return "";
  t = t || globalThis.location;
  const e = new URL(i, document.baseURI);
  return e.hostname !== t.hostname || e.port !== t.port || e.protocol !== t.protocol ? "anonymous" : "";
}
const qg = {
  name: "loadVideo",
  extension: {
    type: z.LoadParser,
    name: "loadVideo"
  },
  test(i) {
    const t = Vi(i, jg), e = Ni(i, zc);
    return t || e;
  },
  async load(i, t, e) {
    var s, n;
    const r = {
      ...Js.defaultOptions,
      resolution: ((s = t.data) == null ? void 0 : s.resolution) || zo(i),
      alphaMode: ((n = t.data) == null ? void 0 : n.alphaMode) || await Vh(),
      ...t.data
    }, o = document.createElement("video"), a = {
      preload: r.autoLoad !== !1 ? "auto" : void 0,
      "webkit-playsinline": r.playsinline !== !1 ? "" : void 0,
      playsinline: r.playsinline !== !1 ? "" : void 0,
      muted: r.muted === !0 ? "" : void 0,
      loop: r.loop === !0 ? "" : void 0,
      autoplay: r.autoPlay !== !1 ? "" : void 0
    };
    Object.keys(a).forEach((h) => {
      const f = a[h];
      f !== void 0 && o.setAttribute(h, f);
    }), r.muted === !0 && (o.muted = !0), Yg(o, i, r.crossorigin);
    const l = document.createElement("source");
    let c;
    if (i.startsWith("data:"))
      c = i.slice(5, i.indexOf(";"));
    else if (!i.startsWith("blob:")) {
      const h = i.split("?")[0].slice(i.lastIndexOf(".") + 1).toLowerCase();
      c = Js.MIME_TYPES[h] || `video/${h}`;
    }
    return l.src = i, c && (l.type = c), new Promise((h) => {
      const f = async () => {
        const p = new Js({ ...r, resource: o });
        o.removeEventListener("canplay", f), t.data.preload && await Wg(o), h(Do(p, e, i));
      };
      o.addEventListener("canplay", f), o.appendChild(l);
    });
  },
  unload(i) {
    i.destroy(!0);
  }
}, Dc = {
  extension: {
    type: z.ResolveParser,
    name: "resolveTexture"
  },
  test: Lc.test,
  parse: (i) => {
    var t;
    return {
      resolution: parseFloat(((t = Gi.RETINA_PREFIX.exec(i)) == null ? void 0 : t[1]) ?? "1"),
      format: i.split(".").pop(),
      src: i
    };
  }
}, Kg = {
  extension: {
    type: z.ResolveParser,
    priority: -2,
    name: "resolveJson"
  },
  test: (i) => Gi.RETINA_PREFIX.test(i) && i.endsWith(".json"),
  parse: Dc.parse
};
class Qg {
  constructor() {
    this._detections = [], this._initialized = !1, this.resolver = new Gi(), this.loader = new xg(), this.cache = rt, this._backgroundLoader = new hg(this.loader), this._backgroundLoader.active = !0, this.reset();
  }
  /**
   * Best practice is to call this function before any loading commences
   * Initiating is the best time to add any customization to the way things are loaded.
   *
   * you do not need to call this for the Assets class to work, only if you want to set any initial properties
   * @param options - options to initialize the Assets manager with
   */
  async init(t = {}) {
    var e, s;
    if (this._initialized) {
      dt("[Assets]AssetManager already initialized, did you load before calling this Assets.init()?");
      return;
    }
    if (this._initialized = !0, t.defaultSearchParams && this.resolver.setDefaultSearchParams(t.defaultSearchParams), t.basePath && (this.resolver.basePath = t.basePath), t.bundleIdentifier && this.resolver.setBundleIdentifier(t.bundleIdentifier), t.manifest) {
      let a = t.manifest;
      typeof a == "string" && (a = await this.load(a)), this.resolver.addManifest(a);
    }
    const n = ((e = t.texturePreference) == null ? void 0 : e.resolution) ?? 1, r = typeof n == "number" ? [n] : n, o = await this._detectFormats({
      preferredFormats: (s = t.texturePreference) == null ? void 0 : s.format,
      skipDetections: t.skipDetections,
      detections: this._detections
    });
    this.resolver.prefer({
      params: {
        format: o,
        resolution: r
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
    const s = ur(t), n = ne(t).map((a) => {
      if (typeof a != "string") {
        const l = this.resolver.getAlias(a);
        return l.some((c) => !this.resolver.hasKey(c)) && this.add(a), Array.isArray(l) ? l[0] : l;
      }
      return this.resolver.hasKey(a) || this.add({ alias: a, src: a }), a;
    }), r = this.resolver.resolve(n), o = await this._mapLoadToResolve(r, e);
    return s ? o[n[0]] : o;
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
    let s = !1;
    typeof t == "string" && (s = !0, t = [t]);
    const n = this.resolver.resolveBundle(t), r = {}, o = Object.keys(n);
    let a = 0, l = 0;
    const c = () => {
      e == null || e(++a / l);
    }, h = o.map((f) => {
      const p = n[f];
      return l += Object.keys(p).length, this._mapLoadToResolve(p, c).then((u) => {
        r[f] = u;
      });
    });
    return await Promise.all(h), s ? r[t[0]] : r;
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
    Object.values(e).forEach((s) => {
      this._backgroundLoader.add(Object.values(s));
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
      return rt.get(t);
    const e = {};
    for (let s = 0; s < t.length; s++)
      e[s] = rt.get(t[s]);
    return e;
  }
  /**
   * helper function to map resolved assets back to loaded assets
   * @param resolveResults - the resolve results from the resolver
   * @param onProgress - the progress callback
   */
  async _mapLoadToResolve(t, e) {
    const s = [...new Set(Object.values(t))];
    this._backgroundLoader.active = !1;
    const n = await this.loader.load(s, e);
    this._backgroundLoader.active = !0;
    const r = {};
    return s.forEach((o) => {
      const a = n[o.src], l = [o.src];
      o.alias && l.push(...o.alias), l.forEach((c) => {
        r[c] = a;
      }), rt.set(l, a);
    }), r;
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
    const e = ne(t).map((n) => typeof n != "string" ? n.src : n), s = this.resolver.resolve(e);
    await this._unloadFromResolved(s);
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
    this._initialized || await this.init(), t = ne(t);
    const e = this.resolver.resolveBundle(t), s = Object.keys(e).map((n) => this._unloadFromResolved(e[n]));
    await Promise.all(s);
  }
  async _unloadFromResolved(t) {
    const e = Object.values(t);
    e.forEach((s) => {
      rt.remove(s.src);
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
    for (const s of t.detections)
      t.skipDetections || await s.test() ? e = await s.add(e) : t.skipDetections || (e = await s.remove(e));
    return e = e.filter((s, n) => e.indexOf(s) === n), e;
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
      e.config && Object.keys(e.config).filter((s) => s in t).forEach((s) => {
        e.config[s] = t[s];
      });
    });
  }
}
const ye = new Qg();
kt.handleByList(z.LoadParser, ye.loader.parsers).handleByList(z.ResolveParser, ye.resolver.parsers).handleByList(z.CacheParser, ye.cache.parsers).handleByList(z.DetectionParser, ye.detections);
kt.add(
  cg,
  dg,
  ug,
  yg,
  fg,
  mg,
  gg,
  _g,
  Sg,
  Rg,
  Fg,
  Lc,
  qg,
  lg,
  ag,
  Dc,
  Kg
);
const cl = {
  loader: z.LoadParser,
  resolver: z.ResolveParser,
  cache: z.CacheParser,
  detection: z.DetectionParser
};
kt.handle(z.Asset, (i) => {
  const t = i.ref;
  Object.entries(cl).filter(([e]) => !!t[e]).forEach(([e, s]) => kt.add(Object.assign(
    t[e],
    // Allow the function to optionally define it's own
    // ExtensionMetadata, the use cases here is priority for LoaderParsers
    { extension: t[e].extension ?? s }
  )));
}, (i) => {
  const t = i.ref;
  Object.keys(cl).filter((e) => !!t[e]).forEach((e) => kt.remove(t[e]));
});
class pr extends wr {
  /**
   * @param options - Options for the Graphics.
   */
  constructor(t) {
    t instanceof Qt && (t = { context: t });
    const { context: e, roundPixels: s, ...n } = t || {};
    super({
      label: "Graphics",
      ...n
    }), this.renderPipeId = "graphics", e ? this._context = e : this._context = this._ownedContext = new Qt(), this._context.on("update", this.onViewUpdate, this), this.allowChildren = !1, this.roundPixels = s ?? !1;
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
    return t ? new pr(this._context.clone()) : (this._ownedContext = null, new pr(this._context));
  }
  // -------- v7 deprecations ---------
  /**
   * @param width
   * @param color
   * @param alpha
   * @deprecated since 8.0.0 Use {@link Graphics#setStrokeStyle} instead
   */
  lineStyle(t, e, s) {
    K(Q, "Graphics#lineStyle is no longer needed. Use Graphics#setStrokeStyle to set the stroke style.");
    const n = {};
    return t && (n.width = t), e && (n.color = e), s && (n.alpha = s), this.context.strokeStyle = n, this;
  }
  /**
   * @param color
   * @param alpha
   * @deprecated since 8.0.0 Use {@link Graphics#fill} instead
   */
  beginFill(t, e) {
    K(Q, "Graphics#beginFill is no longer needed. Use Graphics#fill to fill the shape with the desired style.");
    const s = {};
    return t && (s.color = t), e && (s.alpha = e), this.context.fillStyle = s, this;
  }
  /**
   * @deprecated since 8.0.0 Use {@link Graphics#fill} instead
   */
  endFill() {
    K(Q, "Graphics#endFill is no longer needed. Use Graphics#fill to fill the shape with the desired style."), this.context.fill();
    const t = this.context.strokeStyle;
    return (t.width !== Qt.defaultStrokeStyle.width || t.color !== Qt.defaultStrokeStyle.color || t.alpha !== Qt.defaultStrokeStyle.alpha) && this.context.stroke(), this;
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#circle} instead
   */
  drawCircle(...t) {
    return K(Q, "Graphics#drawCircle has been renamed to Graphics#circle"), this._callContextMethod("circle", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#ellipse} instead
   */
  drawEllipse(...t) {
    return K(Q, "Graphics#drawEllipse has been renamed to Graphics#ellipse"), this._callContextMethod("ellipse", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#poly} instead
   */
  drawPolygon(...t) {
    return K(Q, "Graphics#drawPolygon has been renamed to Graphics#poly"), this._callContextMethod("poly", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#rect} instead
   */
  drawRect(...t) {
    return K(Q, "Graphics#drawRect has been renamed to Graphics#rect"), this._callContextMethod("rect", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#roundRect} instead
   */
  drawRoundedRect(...t) {
    return K(Q, "Graphics#drawRoundedRect has been renamed to Graphics#roundRect"), this._callContextMethod("roundRect", t);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#star} instead
   */
  drawStar(...t) {
    return K(Q, "Graphics#drawStar has been renamed to Graphics#star"), this._callContextMethod("star", t);
  }
}
class Zg {
  /**
   * @param options - Options for the transform.
   * @param options.matrix - The matrix to use.
   * @param options.observer - The observer to use.
   */
  constructor({ matrix: t, observer: e } = {}) {
    this.dirty = !0, this._matrix = t ?? new X(), this.observer = e, this.position = new gt(this, 0, 0), this.scale = new gt(this, 1, 1), this.pivot = new gt(this, 0, 0), this.skew = new gt(this, 0, 0), this._rotation = 0, this._cx = 1, this._sx = 0, this._cy = 0, this._sy = 1;
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
const Uc = class er extends wr {
  constructor(...t) {
    let e = t[0] || {};
    e instanceof H && (e = { texture: e }), t.length > 1 && (K(Q, "use new TilingSprite({ texture, width:100, height:100 }) instead"), e.width = t[1], e.height = t[2]), e = { ...er.defaultOptions, ...e };
    const {
      texture: s,
      anchor: n,
      tilePosition: r,
      tileScale: o,
      tileRotation: a,
      width: l,
      height: c,
      applyAnchorToTexture: h,
      roundPixels: f,
      ...p
    } = e ?? {};
    super({
      label: "TilingSprite",
      ...p
    }), this.renderPipeId = "tilingSprite", this.batched = !0, this.allowChildren = !1, this._anchor = new gt(
      {
        _onUpdate: () => {
          this.onViewUpdate();
        }
      }
    ), this._applyAnchorToTexture = h, this.texture = s, this._width = l ?? s.width, this._height = c ?? s.height, this._tileTransform = new Zg({
      observer: {
        _onUpdate: () => this.onViewUpdate()
      }
    }), n && (this.anchor = n), this.tilePosition = r, this.tileScale = o, this.tileRotation = a, this.roundPixels = f ?? !1;
  }
  /**
   * Creates a new tiling sprite.
   * @param source - The source to create the texture from.
   * @param options - The options for creating the tiling sprite.
   * @returns A new tiling sprite.
   */
  static from(t, e = {}) {
    return typeof t == "string" ? new er({
      texture: rt.get(t),
      ...e
    }) : new er({
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
    const t = this._bounds, e = this._anchor, s = this._width, n = this._height;
    t.maxX = -e._x * s, t.minX = t.maxX + s, t.maxY = -e._y * n, t.minY = t.maxY + n;
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
    const e = this._width, s = this._height, n = -e * this._anchor._x;
    let r = 0;
    return t.x >= n && t.x <= n + e && (r = -s * this._anchor._y, t.y >= r && t.y <= r + s);
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
Uc.defaultOptions = {
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
let Jg = Uc;
class Gc extends wr {
  constructor(t, e) {
    const { text: s, resolution: n, style: r, anchor: o, width: a, height: l, roundPixels: c, ...h } = t;
    super({
      ...h
    }), this.batched = !0, this._resolution = null, this._autoResolution = !0, this._didTextUpdate = !0, this._styleClass = e, this.text = s ?? "", this.style = r, this.resolution = n ?? null, this.allowChildren = !1, this._anchor = new gt(
      {
        _onUpdate: () => {
          this.onViewUpdate();
        }
      }
    ), o && (this.anchor = o), this.roundPixels = c ?? !1, a !== void 0 && (this.width = a), l !== void 0 && (this.height = l);
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
    const e = this.bounds.width, s = this.bounds.height, n = -e * this.anchor.x;
    let r = 0;
    return t.x >= n && t.x <= n + e && (r = -s * this.anchor.y, t.y >= r && t.y <= r + s);
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
function Vc(i, t) {
  let e = i[0] ?? {};
  return (typeof e == "string" || i[1]) && (K(Q, `use new ${t}({ text: "hi!", style }) instead`), e = {
    text: e,
    style: i[1]
  }), e;
}
class $g extends Gc {
  constructor(...t) {
    const e = Vc(t, "Text");
    super(e, hi), this.renderPipeId = "text";
  }
  _updateBounds() {
    const t = this._bounds, e = this._anchor, s = $n.measureText(
      this._text,
      this._style
    ), { width: n, height: r } = s;
    t.minX = -e._x * n, t.maxX = t.minX + n, t.minY = -e._y * r, t.maxY = t.minY + r;
  }
}
class t0 extends Gc {
  constructor(...t) {
    var e;
    const s = Vc(t, "BitmapText");
    s.style ?? (s.style = s.style || {}), (e = s.style).fill ?? (e.fill = 16777215), super(s, hi), this.renderPipeId = "bitmapText";
  }
  _updateBounds() {
    const t = this._bounds, e = this._anchor, s = to.measureText(this.text, this._style), n = s.scale, r = s.offsetY * n;
    let o = s.width * n, a = s.height * n;
    const l = this._style._stroke;
    l && (o += l.width, a += l.width), t.minX = -e._x * o, t.maxX = t.minX + o, t.minY = -e._y * (a + r), t.maxY = t.minY + a;
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
kt.add(Ad, Sd);
let ds;
const zi = /* @__PURE__ */ new Map(), e0 = () => {
  ds = ye.get("audio/sounds.mp3");
  const i = ye.get("audio/sounds.json");
  ds.muted = V.muted, ds.addSprites(i);
}, ui = async (i, t = {}) => {
  const { loop: e = !1, volume: s = 1 } = t, n = await ds.play({
    sprite: i,
    loop: e,
    volume: s,
    complete: () => zi.delete(i)
  });
  zi.set(i, n);
}, Uo = async (i, t) => {
  const {
    fromVolume: e = 0.1,
    toVolume: s = 1,
    fadeDuration: n,
    loop: r = !1
  } = t;
  await ui(i, { loop: r, volume: s }), await new Di({
    duration: n,
    from: { volume: e },
    to: { volume: s }
  }).start(zi.get(i));
}, i0 = (i) => {
  var t;
  (t = zi.get(i)) == null || t.stop(), zi.delete(i);
}, Go = async (i, t) => {
  const e = zi.get(i);
  if (!e) return;
  const { fadeDuration: s } = t;
  await new Di({
    duration: s,
    from: { volume: e.volume },
    to: { volume: 0 }
  }).start(e), i0(i);
}, s0 = (i) => {
  ds.muted = i;
}, Bs = (i) => ({
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
  tint: i.tint
});
class Ne extends Es {
  constructor(t) {
    super(
      new Fi({
        ...Bs(t),
        texture: H.from(t.resource)
      }),
      t
    );
  }
  get originalWidth() {
    return this.object.texture.width;
  }
  get originalHeight() {
    return this.object.texture.height;
  }
  set texture(t) {
    this.object.texture = H.from(t);
  }
}
class Nc extends Ne {
  constructor(t) {
    super(t), fe(this, "_pointerOver", !1);
  }
  get props() {
    return super.props;
  }
  get defaultResource() {
    return this.props.resource;
  }
  get hoverResource() {
    return this.props.hoverResource;
  }
  onPointerEnter() {
    this.texture = this.hoverResource, this._pointerOver = !0;
  }
  onPointerOut() {
    this.texture = this.defaultResource, this._pointerOver = !1;
  }
  async onClick() {
    ui(D.sounds.click), this.texture = this.defaultResource, await this.delay(0.1), this._pointerOver && (this.texture = this.hoverResource);
  }
}
class di extends Es {
  constructor(t) {
    super(new It(Bs(t)), t), fe(this, "_components", []);
  }
  set components(t) {
    this._components = t;
  }
  get components() {
    return this._components;
  }
  addComponent(t) {
    return this.components.push(t), this.object.addChild(t.object), t.parent = this, t;
  }
  removeComponent(t) {
    const e = this.components.indexOf(t);
    e >= 0 && (this.components[e].parent = null, this.components[e].destroy(), this.components.splice(e, 1));
  }
  removeComponents() {
    this.components.forEach((t) => {
      t.parent = null, t.destroy();
    }), this.components = [];
  }
  destroy() {
    this.removeComponents(), super.destroy();
  }
  positionToScreen() {
    var t, e, s, n;
    this.props.horizontalAlignment === "center" ? this.x = (V.screen.width - (this.props.width ?? 0)) / 2 + (((t = this.props.margin) == null ? void 0 : t.x) ?? 0) : this.props.horizontalAlignment === "right" && (this.x = V.screen.width - (this.props.width ?? 0) + (((e = this.props.margin) == null ? void 0 : e.x) ?? 0)), this.props.verticalAlignment === "center" ? this.y = (V.screen.height - (this.props.height ?? 0)) / 2 + (((s = this.props.margin) == null ? void 0 : s.y) ?? 0) : this.props.verticalAlignment === "bottom" && (this.y = V.screen.height - (this.props.height ?? 0) + (((n = this.props.margin) == null ? void 0 : n.y) ?? 0));
  }
}
class r0 extends Nc {
  async onClick() {
    super.onClick(), Rt(D.signals.showCredits);
  }
}
class Ps extends Es {
  constructor(t) {
    super(
      new Jg({
        ...Bs(t),
        texture: H.from(t.resource)
      }),
      t
    );
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
}
class Hc extends Ps {
  constructor(t) {
    super(t), this.onResize();
  }
  onResize() {
    this.width = V.screen.width, this.height = V.screen.height;
    const t = V.screen.height / this.originalHeight;
    this.tileScale = { x: t, y: t };
  }
}
class jc extends Hc {
  constructor(t) {
    super(t);
  }
  onTick() {
    this.tilePosition.x--;
  }
}
class ul extends Es {
  constructor(t) {
    var e, s;
    const n = Bs(t);
    delete n.position;
    let r = new pr(n).rect(
      ((e = t.position) == null ? void 0 : e.x) ?? 0,
      ((s = t.position) == null ? void 0 : s.y) ?? 0,
      t.width ?? 0,
      t.height ?? 0
    ).fill(t.fillColor);
    t.strokeColor != null && (r = r.stroke({
      color: t.strokeColor,
      width: t.strokeWidth ?? 1
    })), super(r, t);
  }
}
class ve extends Es {
  constructor(t) {
    const e = {
      ...Bs(t),
      text: t.text,
      style: {
        fontFamily: t.fontFamily,
        fontSize: t.fontSize,
        fill: t.textColor,
        lineHeight: t.lineHeight,
        wordWrap: t.wordWrap,
        wordWrapWidth: t.wordWrapWidth,
        align: t.align,
        stroke: t.strokeColor && {
          color: t.strokeColor,
          width: t.strokeWidth
        }
      }
    };
    super(t.bitmap ? new t0(e) : new $g(e), t);
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
  get text() {
    return this.object.text;
  }
  set text(t) {
    this.object.text = t;
  }
}
class n0 extends Nc {
  constructor(t) {
    super(t), V.muted && (this.texture = this.props.mutedResource);
  }
  get props() {
    return super.props;
  }
  get defaultResource() {
    return V.muted ? this.props.mutedResource : super.defaultResource;
  }
  get hoverResource() {
    return V.muted ? this.props.mutedHoverResource : super.hoverResource;
  }
  async onClick() {
    super.onClick(), localStorage.setItem("muted", V.muted ? "false" : "true"), V.muted = !V.muted, s0(V.muted);
  }
}
class Rs extends di {
  constructor() {
    super({ label: "Scene" });
  }
  async init() {
  }
}
class o0 extends Rs {
  async init() {
    this.addComponent(
      new ve({
        label: "loading-text",
        text: "Loading...",
        anchor: { x: 0.5, y: 0.5 },
        fontFamily: D.loadingScene.fontFamily,
        fontSize: D.loadingScene.fontSize,
        textColor: D.loadingScene.textColor,
        horizontalAlignment: "center",
        verticalAlignment: "center"
      })
    );
  }
}
const Yc = (i, t, e = 500, s = 1e3) => {
  let n = null, r = !1;
  return { start: () => {
    n != null && clearTimeout(n), n = setTimeout(() => {
      r = !0, n = null, i();
    }, e);
  }, cancel: () => {
    n != null && (clearTimeout(n), n = null), r ? n = setTimeout(() => {
      r = !1, n = null, t();
    }, s) : t();
  } };
}, a0 = (i, t, e, s) => {
  const n = i.clientWidth, r = i.clientHeight;
  if (n < r) {
    const p = e;
    e = s, s = p;
  }
  const o = Math.min(
    n / e,
    r / s
  ), a = Math.floor(o * e), l = Math.floor(o * s), c = (n - a) / 2, h = (r - l) / 2;
  t.style.width = `${a}px`, t.style.height = `${l}px`, t.style.left = `${c}px`, t.style.top = `${h}px`, t.width = e, t.height = s;
  const f = e < s ? "portrait" : "landscape";
  return {
    width: e,
    height: s,
    orientation: f
  };
};
let Wc;
function l0(i) {
  return Wc = i, i;
}
function Ms() {
  return Wc;
}
class io {
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
      const s = Ms().context;
      t.setValueAtTime(e, s.audioContext.currentTime);
    } else
      t.value = e;
    return e;
  }
}
class h0 extends Et {
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
let c0 = 0;
const so = class extends Et {
  /** @param parent - Parent element */
  constructor(i) {
    super(), this.id = c0++, this.init(i);
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
    const e = i.volume * (i.muted ? 0 : 1), s = t.volume * (t.muted ? 0 : 1), n = this._volume * (this._muted ? 0 : 1);
    this._source.volume = n * e * s, this._source.playbackRate = this._speed * i.speed * t.speed;
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
    const { start: t, end: e, speed: s, loop: n, volume: r, muted: o } = i;
    e && console.assert(e > t, "End time is before start time"), this._speed = s, this._volume = r, this._loop = !!n, this._muted = o, this.refresh(), this.loop && e !== null && (console.warn('Looping not support when specifying an "end" time'), this.loop = !1), this._start = t, this._end = e || this._duration, this._start = Math.max(0, this._start - so.PADDING), this._end = Math.min(this._end + so.PADDING, this._duration), this._source.onloadedmetadata = () => {
      this._source && (this._source.currentTime = t, this._source.onloadedmetadata = null, this.emit("progress", t / this._duration, this._duration), Pe.shared.add(this._onUpdate, this));
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
    Pe.shared.remove(this._onUpdate, this), this._internalStop(), this.emit("progress", 1, this._duration), this.emit("end", this);
  }
  /** Don't use after this. */
  destroy() {
    Pe.shared.remove(this._onUpdate, this), this.removeAllListeners();
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
let Xc = so;
Xc.PADDING = 0.1;
class u0 extends Et {
  init(t) {
    this.parent = t, this._source = t.options.source || new Audio(), t.url && (this._source.src = t.url);
  }
  // Implement create
  create() {
    return new Xc(this);
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
    const e = this._source, s = this.parent;
    if (e.readyState === 4) {
      s.isLoaded = !0;
      const l = s.autoPlayStart();
      t && setTimeout(() => {
        t(null, s, l);
      }, 0);
      return;
    }
    if (!s.url) {
      t(new Error("sound.url or sound.source must be set"));
      return;
    }
    e.src = s.url;
    const n = () => {
      a(), s.isLoaded = !0;
      const l = s.autoPlayStart();
      t && t(null, s, l);
    }, r = () => {
      a(), t && t(new Error("Sound loading has been aborted"));
    }, o = () => {
      a();
      const l = `Failed to load audio element (code: ${e.error.code})`;
      t ? t(new Error(l)) : console.error(l);
    }, a = () => {
      e.removeEventListener("canplaythrough", n), e.removeEventListener("load", n), e.removeEventListener("abort", r), e.removeEventListener("error", o);
    };
    e.addEventListener("canplaythrough", n, !1), e.addEventListener("load", n, !1), e.addEventListener("abort", r, !1), e.addEventListener("error", o, !1), e.load();
  }
}
class d0 {
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
const fr = [
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
], p0 = [
  "audio/mpeg",
  "audio/ogg"
], mr = {};
function f0(i) {
  const t = {
    m4a: "audio/mp4",
    oga: "audio/ogg",
    opus: 'audio/ogg; codecs="opus"',
    caf: 'audio/x-caf; codecs="opus"'
  }, e = document.createElement("audio"), s = {}, n = /^no$/;
  fr.forEach((r) => {
    const o = e.canPlayType(`audio/${r}`).replace(n, ""), a = t[r] ? e.canPlayType(t[r]).replace(n, "") : "";
    s[r] = !!o || !!a;
  }), Object.assign(mr, s);
}
f0();
let m0 = 0;
class g0 extends Et {
  constructor(t) {
    super(), this.id = m0++, this._media = null, this._paused = !1, this._muted = !1, this._elapsed = 0, this.init(t);
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
    this._filters && ((e = this._filters) == null || e.filter((s) => s).forEach((s) => s.disconnect()), this._filters = null, this._source.connect(this._gain)), this._filters = t != null && t.length ? t.slice(0) : null, this.refresh();
  }
  /** Refresh loop, volume and speed based on changes to parent */
  refresh() {
    if (!this._source)
      return;
    const t = this._media.context, e = this._media.parent;
    this._source.loop = this._loop || e.loop;
    const s = t.volume * (t.muted ? 0 : 1), n = e.volume * (e.muted ? 0 : 1), r = this._volume * (this._muted ? 0 : 1);
    io.setParamValue(this._gain.gain, r * n * s), io.setParamValue(this._source.playbackRate, this._speed * e.speed * t.speed), this.applyFilters();
  }
  /** Connect filters nodes to audio context */
  applyFilters() {
    var t;
    if ((t = this._filters) != null && t.length) {
      this._source.disconnect();
      let e = this._source;
      this._filters.forEach((s) => {
        e.connect(s.destination), e = s;
      }), e.connect(this._gain);
    }
  }
  /** Handle changes in paused state, either globally or sound or instance */
  refreshPaused() {
    const t = this._media.context, e = this._media.parent, s = this._paused || e.paused || t.paused;
    s !== this._pausedReal && (this._pausedReal = s, s ? (this._internalStop(), this.emit("paused")) : (this.emit("resumed"), this.play({
      start: this._elapsed % this._duration,
      end: this._end,
      speed: this._speed,
      loop: this._loop,
      volume: this._volume
    })), this.emit("pause", s));
  }
  /**
   * Plays the sound.
   * @param options - Play options.
   */
  play(t) {
    const { start: e, end: s, speed: n, loop: r, volume: o, muted: a, filters: l } = t;
    s && console.assert(s > e, "End time is before start time"), this._paused = !1;
    const { source: c, gain: h } = this._media.nodes.cloneBufferSource();
    this._source = c, this._gain = h, this._speed = n, this._volume = o, this._loop = !!r, this._muted = a, this._filters = l, this.refresh();
    const f = this._source.buffer.duration;
    this._duration = f, this._end = s, this._lastUpdate = this._now(), this._elapsed = e, this._source.onended = this._onComplete.bind(this), this._loop ? (this._source.loopEnd = s, this._source.loopStart = e, this._source.start(0, e)) : s ? this._source.start(0, e, s - e) : this._source.start(0, e), this.emit("start"), this._update(!0), this.enableTicker(!0);
  }
  /** Start the update progress. */
  enableTicker(t) {
    Pe.shared.remove(this._updateListener, this), t && Pe.shared.add(this._updateListener, this);
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
      const e = this._now(), s = e - this._lastUpdate;
      if (s > 0 || t) {
        const n = this._source.playbackRate.value;
        this._elapsed += s * n, this._lastUpdate = e;
        const r = this._duration;
        let o;
        if (this._source.loopStart) {
          const a = this._source.loopEnd - this._source.loopStart;
          o = (this._source.loopStart + this._elapsed % a) / r;
        } else
          o = this._elapsed % r / r;
        this._progress = o, this.emit("progress", this._progress, r);
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
class qc {
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
      t.forEach((s) => {
        e === null ? this._input.connect(s.destination) : e.connect(s.destination), e = s;
      }), e.connect(this._output);
    }
  }
  /** Cleans up. */
  destroy() {
    this.filters = null, this._input = null, this._output = null;
  }
}
const Kc = class extends qc {
  /**
   * @param context - The audio context.
   */
  constructor(i) {
    const t = i.audioContext, e = t.createBufferSource(), s = t.createGain(), n = t.createAnalyser();
    e.connect(n), n.connect(s), s.connect(i.destination), super(n, s), this.context = i, this.bufferSource = e, this.gain = s, this.analyser = n;
  }
  /**
   * Get the script processor node.
   * @readonly
   */
  get script() {
    return this._script || (this._script = this.context.audioContext.createScriptProcessor(Kc.BUFFER_SIZE), this._script.connect(this.context.destination)), this._script;
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
    t.buffer = i.buffer, io.setParamValue(t.playbackRate, i.playbackRate.value), t.loop = i.loop;
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
let Qc = Kc;
Qc.BUFFER_SIZE = 0;
class y0 {
  /**
   * Re-initialize without constructing.
   * @param parent - - Instance of parent Sound container
   */
  init(t) {
    this.parent = t, this._nodes = new Qc(this.context), this._source = this._nodes.bufferSource, this.source = t.options.source;
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
    return new g0(this);
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
    const e = this.parent.url, s = await at.get().fetch(e);
    this._decode(await s.arrayBuffer(), t);
  }
  /**
   * Decodes the array buffer.
   * @param arrayBuffer - From load.
   * @param {Function} callback - Callback optional
   */
  _decode(t, e) {
    const s = (n, r) => {
      if (n)
        e && e(n);
      else {
        this.parent.isLoaded = !0, this.buffer = r;
        const o = this.parent.autoPlayStart();
        e && e(null, this.parent, o);
      }
    };
    t instanceof AudioBuffer ? s(null, t) : this.parent.context.decode(t, s);
  }
}
const xi = class {
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
    const e = Ms().useLegacy ? new u0() : new y0();
    return new xi(e, t);
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
    const [t] = i.map((e) => ({ url: e, ext: St.extname(e).slice(1) })).filter(({ ext: e }) => mr[e]).sort((e, s) => fr.indexOf(e.ext) - fr.indexOf(s.ext));
    if (!t)
      throw new Error("No supported file type found");
    return t.url;
  }
  /** Instance of the media context. */
  get context() {
    return Ms().context;
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
      const s = {};
      for (const n in i)
        s[n] = this.addSprites(n, i[n]);
      return s;
    }
    console.assert(!this._sprites[i], `Alias ${i} is already taken`);
    const e = new d0(this, t);
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
      const n = e.sprite;
      console.assert(!!this._sprites[n], `Alias ${n} is not available`);
      const r = this._sprites[n];
      e.start = r.start + (e.start || 0), e.end = r.end, e.speed = r.speed || 1, e.loop = r.loop || e.loop, delete e.sprite;
    }
    if (e.offset && (e.start = e.offset), !this.isLoaded)
      return this._preloadQueue ? new Promise((n) => {
        this._preloadQueue.push(() => {
          n(this.play(e));
        });
      }) : (this._preloadQueue = [], this.autoPlay = !0, this._autoPlayOptions = e, new Promise((n, r) => {
        this._preload((o, a, l) => {
          this._preloadQueue.forEach((c) => c()), this._preloadQueue = null, o ? r(o) : (e.loaded && e.loaded(o, a, l), n(l));
        });
      }));
    (this.singleInstance || e.singleInstance) && this._removeInstances();
    const s = this._createInstance();
    return this._instances.push(s), this.isPlaying = !0, s.once("end", () => {
      e.complete && e.complete(this), this._onComplete(s);
    }), s.once("stop", () => {
      this._onComplete(s);
    }), s.play(e), s;
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
    if (xi._pool.length > 0) {
      const i = xi._pool.pop();
      return i.init(this.media), i;
    }
    return this.media.create();
  }
  /**
   * Destroy/recycling the instance object.
   * @param instance - Instance to recycle
   */
  _poolInstance(i) {
    i.destroy(), xi._pool.indexOf(i) < 0 && xi._pool.push(i);
  }
};
let gr = xi;
gr._pool = [];
class Ts extends qc {
  constructor() {
    const t = window, e = new Ts.AudioContext(), s = e.createDynamicsCompressor(), n = e.createAnalyser();
    n.connect(s), s.connect(e.destination), super(n, s), this.autoPause = !0, this._ctx = e, this._offlineCtx = new Ts.OfflineAudioContext(
      1,
      2,
      t.OfflineAudioContext ? Math.max(8e3, Math.min(96e3, e.sampleRate)) : 44100
    ), this.compressor = s, this.analyser = n, this.events = new Et(), this.volume = 1, this.speed = 1, this.muted = !1, this.paused = !1, this._locked = e.state === "suspended" && ("ontouchstart" in globalThis || "onclick" in globalThis), this._locked && (this._unlock(), this._unlock = this._unlock.bind(this), document.addEventListener("mousedown", this._unlock, !0), document.addEventListener("touchstart", this._unlock, !0), document.addEventListener("touchend", this._unlock, !0)), this.onFocus = this.onFocus.bind(this), this.onBlur = this.onBlur.bind(this), globalThis.addEventListener("focus", this.onFocus), globalThis.addEventListener("blur", this.onBlur);
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
    const s = (r) => {
      e(new Error((r == null ? void 0 : r.message) || "Unable to decode file"));
    }, n = this._offlineCtx.decodeAudioData(
      t,
      (r) => {
        e(null, r);
      },
      s
    );
    n && n.catch(s);
  }
}
class x0 {
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
    return this.supported && (this._webAudioContext = new Ts()), this._htmlAudioContext = new h0(), this._sounds = {}, this.useLegacy = !this.supported, this;
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
    return Ts.AudioContext !== null;
  }
  /**
   * @ignore
   */
  add(t, e) {
    if (typeof t == "object") {
      const r = {};
      for (const o in t) {
        const a = this._getOptions(
          t[o],
          e
        );
        r[o] = this.add(o, a);
      }
      return r;
    }
    if (console.assert(!this._sounds[t], `Sound with alias ${t} already exists.`), e instanceof gr)
      return this._sounds[t] = e, e;
    const s = this._getOptions(e), n = gr.from(s);
    return this._sounds[t] = n, n;
  }
  /**
   * Internal methods for getting the options object
   * @private
   * @param source - The source options
   * @param overrides - Override default options
   * @return The construction options
   */
  _getOptions(t, e) {
    let s;
    return typeof t == "string" ? s = { url: t } : Array.isArray(t) ? s = { url: t } : t instanceof ArrayBuffer || t instanceof AudioBuffer || t instanceof HTMLAudioElement ? s = { source: t } : s = t, s = { ...s, ...e || {} }, s;
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
    const s = !!this._sounds[t];
    return e && console.assert(s, `No sound matching alias '${t}'.`), s;
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
    const s = this.find(t);
    return e !== void 0 && (s.volume = e), s.volume;
  }
  /**
   * Get or set the speed for a sound.
   * @param alias - The sound alias reference.
   * @param speed - Optional current speed to set.
   * @return The current speed.
   */
  speed(t, e) {
    const s = this.find(t);
    return e !== void 0 && (s.speed = e), s.speed;
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
const dl = (i) => {
  var t;
  const e = i.src;
  let s = (t = i == null ? void 0 : i.alias) == null ? void 0 : t[0];
  return (!s || i.src === s) && (s = St.basename(e, St.extname(e))), s;
}, v0 = {
  extension: z.Asset,
  detection: {
    test: async () => !0,
    add: async (i) => [...i, ...fr.filter((t) => mr[t])],
    remove: async (i) => i.filter((t) => i.includes(t))
  },
  loader: {
    name: "sound",
    extension: {
      type: [z.LoadParser],
      priority: Re.High
    },
    /** Should we attempt to load this file? */
    test(i) {
      const t = St.extname(i).slice(1);
      return !!mr[t] || p0.some((e) => i.startsWith(`data:${e}`));
    },
    /** Load the sound file, this is mostly handled by Sound.from() */
    async load(i, t) {
      const e = await new Promise((s, n) => gr.from({
        ...t.data,
        url: i,
        preload: !0,
        loaded(r, o) {
          var a, l;
          r ? n(r) : s(o), (l = (a = t.data) == null ? void 0 : a.loaded) == null || l.call(a, r, o);
        }
      }));
      return Ms().add(dl(t), e), e;
    },
    /** Remove the sound from the library */
    async unload(i, t) {
      Ms().remove(dl(t));
    }
  }
};
kt.add(v0);
l0(new x0());
let oe;
const Zc = () => D.screen.width * 1 / D.screen.aspectRatio, pl = () => {
  const { width: i, height: t, orientation: e } = a0(
    D.gameContainer,
    oe.canvas,
    D.screen.width,
    Zc()
  );
  (i !== V.screen.width || t !== V.screen.height) && (V.screen.width = i, V.screen.height = t, oe.renderer.resize(i, t), Rt(D.signals.onResize));
  const s = V.screen.orientation !== e;
  V.screen.orientation = e, s && Rt(D.signals.onOrientationChange);
}, b0 = () => {
  const { start: i } = Yc(
    () => {
      pl();
    },
    () => {
    },
    100
  );
  new ResizeObserver(() => {
    i();
  }).observe(D.gameContainer), pl();
}, _0 = () => {
  let i = 0, t = 0, e = 0;
  D.debug && setInterval(() => {
    console.log(
      t === 0 ? 0 : Math.floor(e / t)
    ), t = 0, e = 0;
  }, 1e3), oe.ticker.maxFPS = D.maxFPS, oe.ticker.add((s) => {
    for (D.debug && (e += Math.floor(s.FPS), t++), i += s.deltaMS; i >= D.tickIntervalMillis; )
      Rt(D.signals.onTick), Di.updateEngine(D.tickIntervalMillis), _d(D.tickIntervalMillis), i -= D.tickIntervalMillis;
  });
}, rs = async (i) => {
  V.scene && (V.scene.destroy(), oe.stage.removeChild(V.scene.object)), V.scene = i, oe.stage.addChild(V.scene.object), await i.init();
}, w0 = async () => {
  D.gameContainer.style.backgroundColor = D.colors.backgroundColor, oe = new cc(), await oe.init({
    backgroundColor: D.colors.backgroundColor,
    width: D.screen.width,
    height: Zc()
  }), D.debug && (globalThis.__PIXI_APP__ = oe), D.gameContainer.appendChild(oe.canvas), oe.canvas.style.position = "absolute", rs(new o0()), b0(), bd(), Di.initEngine(), _0(), await Promise.all([
    new Promise(
      (i) => setTimeout(i, D.loadingScene.keepAliveTimeMS)
    ),
    (async () => {
      await ye.init({
        basePath: D.assets.basePath,
        manifest: D.assets.manifest
      }), ye.addBundle("extra", D.assets.extra), await Promise.all([
        ye.loadBundle("default"),
        ye.loadBundle("extra")
      ]), e0();
    })()
  ]), Rt(D.signals.destroyLoadingScene);
}, Ie = (i, t) => Math.floor(Math.random() * (t - i) + i), j = {
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
  hasWatchedIntro: localStorage.getItem("couplesRun_watchedIntro") === "true"
};
class A0 extends ve {
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
      verticalAlignment: "center"
    }), this.enter();
  }
  async enter() {
    this.animate({
      from: { alpha: 0 },
      to: { alpha: 1 },
      duration: 0.5,
      repeat: -1,
      revert: !0,
      delay: 1.5
    });
  }
}
class S0 extends ve {
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
      horizontalAlignment: "center"
    }), this.fontSize = this.desiredFontSize, this.animate({
      duration: 1,
      from: { alpha: 0, y: 0 },
      to: { alpha: 1, y: 50 },
      ease: "back.out(2)"
    });
  }
  get desiredFontSize() {
    return V.screen.orientation === "landscape" ? 128 : 86;
  }
  onOrientationChange() {
    this.stopAnimations(), this.fontSize = this.desiredFontSize, this.y = 50;
  }
}
const C0 = 8, P0 = 5;
class M0 extends Ne {
  constructor() {
    super({
      label: "moving-boy",
      resource: "boy/run/boy-run-1.png",
      anchor: { x: 0, y: 1 },
      position: { x: 130, y: 0 },
      scale: { x: 2, y: 2 },
      verticalAlignment: "bottom",
      margin: { x: 0, y: -55 }
    });
    $(this, "_runSprite", 0);
    $(this, "_moveFrame", 0);
  }
  onTick() {
    this._moveFrame++, this._moveFrame % P0 === 0 && (this._moveFrame = 0, this._runSprite = (this._runSprite + 1) % C0, this.texture = `boy/run/boy-run-${this._runSprite + 1}.png`);
  }
}
const T0 = 8, k0 = 5;
class E0 extends Ne {
  constructor() {
    super({
      label: "moving-girl",
      resource: "girl/run/girl-run-1.png",
      anchor: { x: 0, y: 1 },
      position: { x: 200, y: 0 },
      scale: { x: 2, y: 2 },
      verticalAlignment: "bottom",
      margin: { x: 0, y: -55 }
    });
    $(this, "_runSprite", 0);
    $(this, "_moveFrame", 0);
  }
  onTick() {
    this._moveFrame++, this._moveFrame % k0 === 0 && (this._moveFrame = 0, this._runSprite = (this._runSprite + 1) % T0, this.texture = `girl/run/girl-run-${this._runSprite + 1}.png`);
  }
}
const B0 = 2;
class R0 extends di {
  constructor() {
    super({
      label: "moving-platform"
    }), this.addComponent(
      new Ps({
        label: "moving-platform-top",
        resource: "platform-top.png"
      })
    ), this.addComponent(
      new Ps({
        label: "moving-platform-middle",
        resource: "platform-middle.png"
      })
    ), this.onResize();
  }
  get platformTop() {
    return this.components[0];
  }
  get platformMiddle() {
    return this.components[1];
  }
  onResize() {
    this.platformMiddle.width = V.screen.width, this.platformMiddle.height = this.platformMiddle.originalHeight * B0, this.platformMiddle.position.y = V.screen.height - this.platformMiddle.height, this.platformTop.width = V.screen.width, this.platformTop.position.y = V.screen.height - this.platformMiddle.height - this.platformTop.height;
  }
  onTick() {
    this.platformTop.tilePosition.x--, this.platformMiddle.tilePosition.x--;
  }
}
class I0 extends r0 {
  constructor() {
    super({
      label: "credits-button",
      resource: "credits-button.png",
      hoverResource: "credits-button-hover.png",
      interactive: !0,
      cursor: "pointer",
      position: { x: 155, y: 24 },
      alpha: 0,
      scale: { x: 0.5, y: 0.5 },
      anchor: { x: 0.5, y: 0.5 }
    }), this.animate({
      from: { alpha: 0, scaleX: 0.5, scaleY: 0.5 },
      to: { alpha: 1, scaleX: 1, scaleY: 1 },
      duration: 0.5,
      delay: 1.5
    });
  }
}
class O0 extends n0 {
  constructor() {
    super({
      label: "volume-button",
      resource: "volume-on.png",
      hoverResource: "volume-on-hover.png",
      mutedResource: "volume-off.png",
      mutedHoverResource: "volume-off-hover.png",
      interactive: !0,
      cursor: "pointer",
      alpha: 0,
      position: { x: 24, y: 24 },
      scale: { x: 0.5, y: 0.5 },
      anchor: { x: 0.5, y: 0.5 }
    }), this.animate({
      from: { alpha: 0, scaleX: 0.5, scaleY: 0.5 },
      to: { alpha: 1, scaleX: 1, scaleY: 1 },
      duration: 0.5,
      delay: 1.5
    });
  }
}
class F0 extends di {
  constructor() {
    super({
      label: "settings",
      horizontalAlignment: "center",
      verticalAlignment: "bottom",
      width: 230,
      height: 48,
      margin: { x: 0, y: -200 }
    }), this.addComponent(new O0()), this.addComponent(new I0());
  }
}
class L0 extends Rs {
  constructor() {
    super(...arguments);
    $(this, "_canContinue", !1);
  }
  async init() {
    this.interactive = !0, this.addComponent(
      new jc({
        label: "city-bg",
        resource: "city-bg.png"
      })
    ), this.addComponent(new R0()), this.addComponent(new E0()), this.addComponent(new M0()), this.addComponent(new S0()), this.addComponent(new A0()), this.addComponent(new F0()), Uo(j.sounds.mainLoop, {
      loop: !0,
      toVolume: 0.3,
      fadeDuration: 0.5
    }), this.delay(2).then(() => {
      this._canContinue = !0;
    });
  }
  async onClick() {
    this._canContinue && (this.interactive = !1, await Promise.all([
      ui(D.sounds.click),
      Go(j.sounds.mainLoop, { fadeDuration: 2 }),
      this.animate({
        from: { alpha: 1 },
        to: { alpha: 0 },
        duration: 2
      })
    ]), Rt(j.signals.goToIntro));
  }
}
const z0 = "data:font/woff2;base64,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", D0 = "data:font/woff2;base64,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", q = {
  selectedCharacter: "girl",
  started: !1,
  speed: 3,
  originalSpeed: 3,
  score: 0
};
let U0 = class extends Ne {
  constructor() {
    super({
      label: "boy",
      resource: "boy/boy-selection.png",
      position: { x: 224, y: 79.5 },
      anchor: { x: 0.5, y: 0.5 },
      interactive: !0,
      cursor: "pointer"
    }), this.registerToSignal(
      j.signals.chooseCharacter,
      this._onCharacterSelection
    );
  }
  onClick() {
    this.interactive = !1, q.selectedCharacter = "boy", Rt(j.signals.chooseCharacter);
  }
  _onCharacterSelection() {
    q.selectedCharacter !== "boy" ? this.animate({
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
}, G0 = class extends Ne {
  constructor() {
    super({
      label: "girl",
      resource: "girl/girl-selection.png",
      position: { x: 64, y: 79.5 },
      anchor: { x: 0.5, y: 0.5 },
      interactive: !0,
      cursor: "pointer"
    }), this.registerToSignal(
      j.signals.chooseCharacter,
      this._onCharacterSelection
    );
  }
  onClick() {
    this.interactive = !1, q.selectedCharacter = "girl", Rt(j.signals.chooseCharacter);
  }
  _onCharacterSelection() {
    q.selectedCharacter !== "girl" ? this.animate({
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
class V0 extends di {
  constructor() {
    super({
      label: "character-selection",
      horizontalAlignment: "center",
      width: 288,
      height: 159,
      anchor: { x: 0.5, y: 0 },
      alpha: 0
    }), this.addComponent(new G0()), this.addComponent(new U0());
  }
}
const N0 = `The night has fallen deep and the young(?) couple is ready to get married, but a tragedy happens. They're out of drinks in the party. They go out to get more drinks for the guests and they engage into a zombie apocalypse.

Collect as many drinks as you can to increase your score. You lose a life point each time an enemy touches you. It's game over if you lose 3 life points or you fall into a pit. Jump to avoid enemies and pits.`, H0 = "You can make both characters jump by clicking/tapping on the screen. Anastasia can reduce her speed if you click/tap on the screen and hold it for a while. She then jumps higher when you release it. Nikos can perform a double jump if you click/tap on the screen again while jumping.";
class j0 extends Rs {
  get introComponent() {
    return this.components[1];
  }
  get characterExplanationComponent() {
    return this.components[1];
  }
  get chooseCharacterComponent() {
    return this.components[2];
  }
  get selectionComponent() {
    return this.components[3];
  }
  async init() {
    this.alpha = 0, this.addComponent(
      new jc({
        label: "city-bg",
        resource: "city-bg.png"
      })
    ), await Promise.all([
      this.animate({ from: { alpha: 0 }, to: { alpha: 1 }, duration: 2 }),
      Uo(j.sounds.menuLoop, {
        toVolume: 0.3,
        fadeDuration: 0.5,
        loop: !0
      })
    ]), j.hasWatchedIntro || (await this._createText(N0), await this.delay(15), await this._hideIntro()), localStorage.setItem("couplesRun_watchedIntro", "true"), await this._createText(H0), this.addComponent(
      new ve({
        label: "choose-character",
        text: "Choose Character",
        fontFamily: "PressStart2P",
        fontSize: 24,
        textColor: 16763904,
        anchor: { x: 0.5, y: 0 },
        alpha: 0,
        position: {
          x: 0,
          y: this.characterExplanationComponent.y + this.characterExplanationComponent.height + 40
        },
        horizontalAlignment: "center"
      })
    ), this.addComponent(new V0()), this.selectionComponent.y = this.chooseCharacterComponent.y + this.chooseCharacterComponent.height + 40, this.registerToSignal(
      j.signals.chooseCharacter,
      this._onCharacterSelection
    ), await Promise.all([
      this.chooseCharacterComponent.animate({
        from: { alpha: 0 },
        to: { alpha: 1 },
        duration: 1
      }),
      this.selectionComponent.animate({
        from: { alpha: 0 },
        to: { alpha: 1 },
        duration: 1
      })
    ]);
  }
  onResize() {
    this.introComponent && (this.introComponent.wordWrapWidth = V.screen.width - 40), this.characterExplanationComponent && (this.characterExplanationComponent.wordWrapWidth = V.screen.width - 40), this.chooseCharacterComponent && (this.chooseCharacterComponent.y = this.characterExplanationComponent.y + this.characterExplanationComponent.height + 40, this.selectionComponent.y = this.chooseCharacterComponent.y + 40);
  }
  async _createText(t) {
    await this.addComponent(
      new ve({
        label: "introduction",
        text: t,
        fontFamily: "PressStart2P",
        fontSize: 24,
        textColor: 13421772,
        alpha: 0,
        position: { x: 20, y: 20 },
        wordWrap: !0,
        wordWrapWidth: V.screen.width - 40,
        align: "justify",
        lineHeight: 40
      })
    ).animate({
      from: { alpha: 0 },
      to: { alpha: 1 },
      duration: 3
    });
  }
  async _hideIntro() {
    await this.introComponent.animate({
      from: { alpha: 1 },
      to: { alpha: 0 },
      duration: 3
    }), this.introComponent.destroy();
  }
  async _onCharacterSelection() {
    await Promise.all([
      ui(D.sounds.click),
      Go(j.sounds.menuLoop, { fadeDuration: 2 }),
      this.animate({
        from: { alpha: 1 },
        to: { alpha: 0 },
        duration: 2
      })
    ]), Rt(j.signals.goToGame);
  }
}
class Y0 extends Hc {
  constructor() {
    super({
      label: "background",
      resource: "city-bg.png"
    }), this.registerToSignal(j.signals.moveScreen, this._move);
  }
  _move(t) {
    this.tilePosition.x = -t;
  }
}
class W0 extends di {
  constructor() {
    super({
      label: "info",
      position: { x: 20, y: 20 }
    });
    $(this, "_totalLifePoints");
    let e = this.addComponent(
      new ve({
        label: "life-points-indicator",
        text: "Life Points:",
        fontFamily: "PressStart2P",
        fontSize: 16,
        textColor: 13421772,
        position: { x: 0, y: 3 }
      })
    ).width + 10;
    for (let s = 0; s < j.lifePoints; s++)
      e += this.addComponent(
        new ul({
          label: `life-point-${s}`,
          fillColor: 3145472,
          width: 10,
          height: 20,
          position: { x: e, y: 0 }
        })
      ).width + 15;
    e += this.addComponent(
      new ul({
        label: "separator",
        fillColor: 13421772,
        width: 3,
        height: 20,
        position: { x: e + 10, y: 0 }
      })
    ).width + 25, e += this.addComponent(
      new ve({
        label: "score-indicator",
        text: "Score:",
        fontFamily: "PressStart2P",
        fontSize: 16,
        textColor: 13421772,
        position: { x: e, y: 3 }
      })
    ).width + 10, this.addComponent(
      new ve({
        label: "score",
        text: q.score.toString(),
        fontFamily: "PressStart2P",
        fontSize: 16,
        textColor: 13421772,
        position: { x: e, y: 3 },
        bitmap: !0
      })
    ), this._totalLifePoints = j.lifePoints, this.registerToSignal(
      j.signals.loseLifePoints,
      this._removeLifePoints
    ), this.registerToSignal(j.signals.updateScore, this._updateScore);
  }
  get _score() {
    return this.components[this.components.length - 1];
  }
  async _removeLifePoints(e) {
    for (let s = this.components.length - 1; s >= 0 && e > 0; s--)
      if (this.components[s].label.startsWith("life-point-") && (this.removeComponent(this.components[s]), s++, this._totalLifePoints--, e--, this._totalLifePoints === 0)) {
        q.started = !1, Go(j.sounds.mainLoop, { fadeDuration: 0.5 }), ui(j.sounds.gameOver), await this.delay(4), Rt(j.signals.gameOver);
        break;
      }
  }
  _updateScore() {
    this._score.text = q.score.toString();
  }
}
const mn = {
  run: (i, t) => `${i}/run/${i}-run-${t % 8 + 1}.png`,
  jump: (i, t) => t <= 6 ? `${i}/${i}-jump.png` : `${i}/${i}-idle.png`,
  idle: (i, t) => `${i}/${i}-idle.png`
}, X0 = 5;
class kr extends Ne {
  constructor(e) {
    super({
      label: "character",
      resource: mn.idle(e, 0),
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
    this._resourceType = e, _r({
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
    this._canJump() && (this._currentJump++, this.changeState("jump"));
  }
  press() {
    !this.hasPressAndRelease || !this._canJump() || (this._pressing = !0, this._setVelocity());
  }
  release() {
    !this.hasPressAndRelease || !this._pressing || !q.started || (this._pressing = !1, this._pressed = !0, this._currentJump++, this.changeState("jump"));
  }
  async damage() {
    if (!this._canDamage || !q.started) return;
    this._canDamage = !1, ui(j.sounds.playerHit, { volume: 2 }), Rt(j.signals.loseLifePoints, 1);
    const e = this.tint;
    await this.animate({
      from: { tint: 16763904 },
      to: { tint: 16711680 },
      duration: 0.2,
      repeat: 10,
      revert: !0
    }), this.tint = e, this._canDamage = !0;
  }
  onTick() {
    q.started && (this._moveState === "idle" && this.changeState("run"), this._moveFrame++, this._moveFrame % X0 === 0 && (this._moveFrame = 0, this._moveSprite++, this.texture = mn[this._moveState](
      this._resourceType,
      this._moveSprite
    )));
  }
  changeState(e) {
    this._moveState = e, this._moveFrame = 0, this._moveSprite = 0, this.texture = mn[this._moveState](
      this._resourceType,
      this._moveSprite + 1
    ), this._setVelocity();
  }
  _updatePosition(e, s, n) {
    if (!(!q.started && this._moveState !== "idle")) {
      if (this.x = e - 49, this.y = s - 40, this._onGround = n, this.y > V.screen.height + 100) {
        Rt(j.signals.loseLifePoints, j.lifePoints);
        return;
      }
      Rt(j.signals.moveScreen, this.x - 130), n && this._moveState !== "run" && q.started && (this._pressed = !1, this._currentJump = 0, this.changeState("run")), this._canIncreaseSpeed() && (this._nextIncreaseSpeedMilestone > 0 && q.speed++, this._nextIncreaseSpeedMilestone = this.x + this.increaseSpeedMilestone);
    }
  }
  _canIncreaseSpeed() {
    return this.x >= this._nextIncreaseSpeedMilestone;
  }
  _canJump() {
    return q.started ? this._moveState === "jump" && this._currentJump < this.totalAllowedJumps ? !0 : this._moveState === "run" && this._onGround : !1;
  }
  _setVelocity() {
    const { x: e, y: s } = this._getNewVelocity();
    So(this, {
      linearMovement: {
        velocity: { x: e, y: s }
      }
    });
  }
  _getNewVelocity() {
    return this._moveState === "jump" ? {
      x: q.speed,
      y: this._pressed ? -15 : -10
    } : this._moveState === "run" ? {
      x: this._pressing ? q.speed / 2 : q.speed,
      y: 0
    } : { x: 0, y: 0 };
  }
}
class q0 extends Ne {
  constructor(t, e) {
    super({
      label: `drink-${t.x}-${t.y}`,
      resource: "drink.png",
      position: t,
      scale: { x: 3, y: 3 }
    }), _r({
      target: this,
      rectangle: {
        x: e + this.x,
        y: this.y,
        width: this.width,
        height: this.height
      },
      onCollision: async (s) => {
        q.started && s instanceof kr && (q.score += 10, Rt(j.signals.updateScore), ui(j.sounds.coin, { volume: 2 }), this.destroy());
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
const K0 = 5;
class Q0 extends Ne {
  constructor(e, s) {
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
    this._distance = s, _r({
      target: this,
      rectangle: {
        x: this._distance + this.x,
        y: this.y,
        width: this.width,
        height: this.height
      },
      onUpdatePosition: this._updatePosition.bind(this),
      onCollision: this._onCollision.bind(this)
    }), this.registerToSignal(j.signals.moveScreen, this._onMoveScreen);
  }
  onTick() {
    !this._started || !q.started || (this.x + this.width >= 0 ? aa(this, -1, 0) : (this._acceleration++, aa(this, 0, this._acceleration)), this._moveFrame++, this._moveFrame % K0 === 0 && (this._moveFrame = 0, this._moveSprite++, this.texture = `zombie/walk/zombie-walk-${this._moveSprite % 10 + 1}.png`));
  }
  _updatePosition(e, s) {
    this.x = e - this._distance, this.y = s;
  }
  _onCollision(e) {
    q.started && e instanceof kr && e.damage();
  }
  _onMoveScreen(e) {
    q.started && e + V.screen.width >= this._distance + this.x && (this._started = !0, So(this, {
      linearMovement: {
        velocity: { x: -1, y: 0 }
      }
    }), this.unregisterFromSignal(j.signals.moveScreen));
  }
}
class fl extends di {
  constructor(e, s, n) {
    super({
      label: `platform-${n}`,
      position: { x: n, y: 0 }
    });
    $(this, "_topOffset", 0);
    this._topOffset = (8 - e) * 32;
    let r = this._topOffset;
    r += this.addComponent(
      new Ps({
        label: "platform-top",
        resource: "platform-top.png",
        width: s,
        position: { x: 0, y: r }
      })
    ).height;
    for (let o = 0; o < e; o++)
      r += this.addComponent(
        new Ps({
          label: `platform-middle-${o}`,
          resource: "platform-middle.png",
          width: s,
          position: { x: 0, y: r }
        })
      ).height;
    _r({
      target: this,
      rectangle: {
        x: this.x,
        y: this.components[0].position.y + 4,
        width: this.width,
        height: this.height - 4
      },
      surface: !0
    }), this._createDrinks(n), this._createZombies(n);
  }
  _createDrinks(e) {
    let s = e === 0 ? 200 : 0;
    const n = 37, r = 49, o = 5, a = 5;
    for (; s + n <= this.width; ) {
      s += Ie(0, this.width - n);
      const l = this._topOffset - r - Ie(0, o) * r, c = Ie(0, a);
      for (let h = 0; h < c && s + n <= this.width; h++)
        this.addComponent(new q0({ x: s, y: l }, e)), s += n;
      s += 20;
    }
  }
  _createZombies(e) {
    if (e === 0) return;
    const s = 40, n = 61.6;
    let r = Ie(0, 1e3);
    const o = this._topOffset - n;
    for (; r + s <= this.width; )
      this.addComponent(new Q0({ x: r, y: o }, e)), r += 300 + Ie(0, this.width - s);
  }
}
class Z0 extends kr {
  get increaseSpeedMilestone() {
    return 2e4;
  }
  get hasPressAndRelease() {
    return !0;
  }
  get totalAllowedJumps() {
    return 1;
  }
  constructor() {
    super("girl");
  }
}
class J0 extends kr {
  get increaseSpeedMilestone() {
    return 1e4;
  }
  get hasPressAndRelease() {
    return !1;
  }
  get totalAllowedJumps() {
    return 2;
  }
  constructor() {
    super("boy");
  }
}
class $0 extends di {
  constructor() {
    super({
      label: "platforms",
      verticalAlignment: "bottom",
      height: 292
    });
    $(this, "_limit", 0);
    this.addComponent(
      q.selectedCharacter === "girl" ? new Z0() : new J0()
    ), this._limit = this.addComponent(new fl(2, 1e3, 0)).width, this._createPlatforms(), this.registerToSignal(j.signals.moveScreen, this._move);
  }
  get character() {
    return this.components[0];
  }
  _move(e) {
    this.x = -e, this._deleteExpiredPlatforms(), this._createPlatforms();
  }
  _createPlatforms() {
    for (; this._limit + this.x <= D.screen.width + 1e3; ) {
      const e = Ie(1, 8), s = Ie(200, 1500), n = Ie(100, 200);
      this.addComponent(
        new fl(e, s, this._limit + n)
      ), this._limit += n + s;
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
class ml extends Rs {
  constructor() {
    super(...arguments);
    $(this, "_cancelClickDebounce", null);
    $(this, "_keepingClick", !1);
  }
  get _platforms() {
    return this.components[2];
  }
  async init() {
    q.speed = q.originalSpeed, q.score = 0, this.alpha = 0, this.interactive = !0, this.addComponent(new Y0()), this.addComponent(new W0()), this.addComponent(new $0()), await Promise.all([
      this.animate({
        from: { alpha: 0 },
        to: { alpha: 1 },
        duration: 1
      }),
      Uo(j.sounds.mainLoop, {
        toVolume: 0.3,
        fadeDuration: 0.5,
        loop: !0
      })
    ]), await this.delay(1), q.started = !0;
  }
  onClick() {
    if (!q.started) return;
    if (!this._platforms.character.hasPressAndRelease) {
      this._platforms.character.jump();
      return;
    }
    this._keepingClick = !1;
    const { start: e, cancel: s } = Yc(
      () => {
        this._keepingClick = !0, this._platforms.character.press();
      },
      () => {
      },
      300,
      0
    );
    this._cancelClickDebounce = s, e();
  }
  onPointerUp() {
    var e;
    !q.started || !this._platforms.character.hasPressAndRelease || ((e = this._cancelClickDebounce) == null || e.call(this), this._cancelClickDebounce = null, this._keepingClick ? this._platforms.character.release() : this._platforms.character.jump());
  }
}
const ty = [
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
          "audio/sounds-LAhgQg.ogg"
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
          "default-SuxoWg.png.json",
          "default-ox-MDQ@0.5x.webp.json",
          "default-mbIEuA.avif.json",
          "default-gGh4Ow@0.5x.png.json",
          "default-EZUy6A@0.5x.avif.json",
          "default-_3Vu3Q.webp.json"
        ],
        data: {
          tags: {
            tps: !0
          }
        }
      }
    ]
  }
], ey = {
  bundles: ty
};
class iy extends Rs {
  async init() {
    this.addComponent(
      new ve({
        label: "game-over",
        text: "Game Over",
        fontFamily: D.loadingScene.fontFamily,
        fontSize: 48,
        textColor: D.loadingScene.textColor,
        anchor: { x: 0.5, y: 0.5 },
        horizontalAlignment: "center",
        verticalAlignment: "center",
        margin: { x: 0, y: -50 }
      })
    ), this.addComponent(
      new ve({
        label: "score",
        text: `Your score is ${q.score}`,
        fontFamily: D.loadingScene.fontFamily,
        fontSize: 28,
        textColor: D.loadingScene.textColor,
        anchor: { x: 0.5, y: 0.5 },
        horizontalAlignment: "center",
        verticalAlignment: "center",
        margin: { x: 0, y: 50 }
      })
    ), this.delay(2).then(() => Rt(j.signals.goToGame));
  }
}
const oy = (i = {}) => {
  const t = new URLSearchParams(window.location.search ?? ""), e = gi(
    D.signals.destroyLoadingScene,
    () => {
      ns(
        e.name,
        e.binding
      ), rs(
        t.has("character") ? new ml() : new L0()
      );
    }
  ), s = gi(
    D.signals.showCredits,
    () => {
      var r;
      ns(s.name, s.binding), (r = document.getElementById("credits-link")) == null || r.click();
    }
  ), n = gi(j.signals.goToIntro, () => {
    ns(n.name, n.binding), rs(new j0());
  });
  gi(j.signals.goToGame, () => {
    rs(new ml());
  }), gi(j.signals.gameOver, () => {
    rs(new iy());
  }), D.gameName = "couples-run", i.assetsBasePath && (D.assets.basePath = i.assetsBasePath), D.maxFPS = Number(t.get("maxFPS")) || 60, D.debug = !!t.get("debug"), D.assets.manifest = ey, D.assets.extra = [
    { alias: "Lobster", src: z0, data: { family: "Lobster" } },
    {
      alias: "PressStart2P",
      src: D0,
      data: { family: "PressStart2P" }
    }
  ], q.selectedCharacter = t.get("character") === "boy" ? "boy" : "girl", w0();
};
export {
  K as $,
  qf as A,
  Kf as B,
  Oi as C,
  z as D,
  pc as E,
  Qf as F,
  tm as G,
  X as H,
  $h as I,
  Zf as J,
  im as K,
  rm as L,
  Et as M,
  nm as N,
  at as O,
  kt as P,
  yt as Q,
  sm as R,
  Pt as S,
  ua as T,
  to as U,
  H as V,
  $s as W,
  Ep as X,
  Q as Y,
  Ia as Z,
  Kh as _,
  Kd as a,
  Sr as a0,
  Fd as a1,
  oc as a2,
  _f as a3,
  Oa as a4,
  Sf as a5,
  Mo as a6,
  sc as a7,
  Uh as a8,
  Be as a9,
  am as aa,
  Mh as ab,
  Aa as ac,
  kh as ad,
  hf as ae,
  Fi as af,
  Up as ag,
  rf as ah,
  xt as ai,
  Ca as aj,
  hp as ak,
  qr as al,
  ac as am,
  Ld as an,
  oy as ao,
  zn as b,
  dt as c,
  Ef as d,
  Vn as e,
  Ss as f,
  _e as g,
  Ft as h,
  Me as i,
  Ac as j,
  It as k,
  Fa as l,
  eg as m,
  pr as n,
  rt as o,
  zd as p,
  il as q,
  hi as r,
  Cc as s,
  Jn as t,
  ft as u,
  sl as v,
  Pe as w,
  Km as x,
  To as y,
  $n as z
};
