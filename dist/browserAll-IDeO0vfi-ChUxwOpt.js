import { D as w, A as z, d as J, E as q, S as y, M as Q, c as E, b as B, a as tt } from "./index-CMMBFnDr.js";
import "./webworkerAll-B1DcCDte-BC_dKxyL.js";
class M {
  /**
   * @param manager - The event boundary which manages this event. Propagation can only occur
   *  within the boundary's jurisdiction.
   */
  constructor(t) {
    this.bubbles = !0, this.cancelBubble = !0, this.cancelable = !1, this.composed = !1, this.defaultPrevented = !1, this.eventPhase = M.prototype.NONE, this.propagationStopped = !1, this.propagationImmediatelyStopped = !1, this.layer = new y(), this.page = new y(), this.NONE = 0, this.CAPTURING_PHASE = 1, this.AT_TARGET = 2, this.BUBBLING_PHASE = 3, this.manager = t;
  }
  /** @readonly */
  get layerX() {
    return this.layer.x;
  }
  /** @readonly */
  get layerY() {
    return this.layer.y;
  }
  /** @readonly */
  get pageX() {
    return this.page.x;
  }
  /** @readonly */
  get pageY() {
    return this.page.y;
  }
  /**
   * Fallback for the deprecated @code{InteractionEvent.data}.
   * @deprecated since 7.0.0
   */
  get data() {
    return this;
  }
  /** The propagation path for this event. Alias for {@link EventBoundary.propagationPath}. */
  composedPath() {
    return this.manager && (!this.path || this.path[this.path.length - 1] !== this.target) && (this.path = this.target ? this.manager.propagationPath(this.target) : []), this.path;
  }
  /**
   * Unimplemented method included for implementing the DOM interface {@code Event}. It will throw an {@code Error}.
   * @deprecated
   * @param _type
   * @param _bubbles
   * @param _cancelable
   */
  initEvent(t, e, n) {
    throw new Error("initEvent() is a legacy DOM API. It is not implemented in the Federated Events API.");
  }
  /**
   * Unimplemented method included for implementing the DOM interface {@code UIEvent}. It will throw an {@code Error}.
   * @deprecated
   * @param _typeArg
   * @param _bubblesArg
   * @param _cancelableArg
   * @param _viewArg
   * @param _detailArg
   */
  initUIEvent(t, e, n, i, o) {
    throw new Error("initUIEvent() is a legacy DOM API. It is not implemented in the Federated Events API.");
  }
  /** Prevent default behavior of PixiJS and the user agent. */
  preventDefault() {
    this.nativeEvent instanceof Event && this.nativeEvent.cancelable && this.nativeEvent.preventDefault(), this.defaultPrevented = !0;
  }
  /**
   * Stop this event from propagating to any addition listeners, including on the
   * {@link FederatedEventTarget.currentTarget currentTarget} and also the following
   * event targets on the propagation path.
   */
  stopImmediatePropagation() {
    this.propagationImmediatelyStopped = !0;
  }
  /**
   * Stop this event from propagating to the next {@link FederatedEventTarget}. The rest of the listeners
   * on the {@link FederatedEventTarget.currentTarget currentTarget} will still be notified.
   */
  stopPropagation() {
    this.propagationStopped = !0;
  }
}
var x = /iPhone/i, C = /iPod/i, S = /iPad/i, U = /\biOS-universal(?:.+)Mac\b/i, k = /\bAndroid(?:.+)Mobile\b/i, F = /Android/i, _ = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i, A = /Silk/i, g = /Windows Phone/i, X = /\bWindows(?:.+)ARM\b/i, Y = /BlackBerry/i, $ = /BB10/i, R = /Opera Mini/i, G = /\b(CriOS|Chrome)(?:.+)Mobile/i, H = /Mobile(?:.+)Firefox\b/i, W = function(a) {
  return typeof a < "u" && a.platform === "MacIntel" && typeof a.maxTouchPoints == "number" && a.maxTouchPoints > 1 && typeof MSStream > "u";
};
function et(a) {
  return function(t) {
    return t.test(a);
  };
}
function K(a) {
  var t = {
    userAgent: "",
    platform: "",
    maxTouchPoints: 0
  };
  !a && typeof navigator < "u" ? t = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    maxTouchPoints: navigator.maxTouchPoints || 0
  } : typeof a == "string" ? t.userAgent = a : a && a.userAgent && (t = {
    userAgent: a.userAgent,
    platform: a.platform,
    maxTouchPoints: a.maxTouchPoints || 0
  });
  var e = t.userAgent, n = e.split("[FBAN");
  typeof n[1] < "u" && (e = n[0]), n = e.split("Twitter"), typeof n[1] < "u" && (e = n[0]);
  var i = et(e), o = {
    apple: {
      phone: i(x) && !i(g),
      ipod: i(C),
      tablet: !i(x) && (i(S) || W(t)) && !i(g),
      universal: i(U),
      device: (i(x) || i(C) || i(S) || i(U) || W(t)) && !i(g)
    },
    amazon: {
      phone: i(_),
      tablet: !i(_) && i(A),
      device: i(_) || i(A)
    },
    android: {
      phone: !i(g) && i(_) || !i(g) && i(k),
      tablet: !i(g) && !i(_) && !i(k) && (i(A) || i(F)),
      device: !i(g) && (i(_) || i(A) || i(k) || i(F)) || i(/\bokhttp\b/i)
    },
    windows: {
      phone: i(g),
      tablet: i(X),
      device: i(g) || i(X)
    },
    other: {
      blackberry: i(Y),
      blackberry10: i($),
      opera: i(R),
      firefox: i(H),
      chrome: i(G),
      device: i(Y) || i($) || i(R) || i(H) || i(G)
    },
    any: !1,
    phone: !1,
    tablet: !1
  };
  return o.any = o.apple.device || o.android.device || o.windows.device || o.other.device, o.phone = o.apple.phone || o.android.phone || o.windows.phone, o.tablet = o.apple.tablet || o.android.tablet || o.windows.tablet, o;
}
const nt = K.default ?? K, it = nt(globalThis.navigator), ot = 9, D = 100, st = 0, rt = 0, N = 2, j = 1, at = -1e3, ht = -1e3, lt = 2;
class Z {
  // 2fps
  // eslint-disable-next-line jsdoc/require-param
  /**
   * @param {WebGLRenderer|WebGPURenderer} renderer - A reference to the current renderer
   */
  constructor(t, e = it) {
    this._mobileInfo = e, this.debug = !1, this._isActive = !1, this._isMobileAccessibility = !1, this._pool = [], this._renderId = 0, this._children = [], this._androidUpdateCount = 0, this._androidUpdateFrequency = 500, this._hookDiv = null, (e.tablet || e.phone) && this._createTouchHook();
    const n = document.createElement("div");
    n.style.width = `${D}px`, n.style.height = `${D}px`, n.style.position = "absolute", n.style.top = `${st}px`, n.style.left = `${rt}px`, n.style.zIndex = N.toString(), this._div = n, this._renderer = t, this._onKeyDown = this._onKeyDown.bind(this), this._onMouseMove = this._onMouseMove.bind(this), globalThis.addEventListener("keydown", this._onKeyDown, !1);
  }
  /**
   * Value of `true` if accessibility is currently active and accessibility layers are showing.
   * @member {boolean}
   * @readonly
   */
  get isActive() {
    return this._isActive;
  }
  /**
   * Value of `true` if accessibility is enabled for touch devices.
   * @member {boolean}
   * @readonly
   */
  get isMobileAccessibility() {
    return this._isMobileAccessibility;
  }
  get hookDiv() {
    return this._hookDiv;
  }
  /**
   * Creates the touch hooks.
   * @private
   */
  _createTouchHook() {
    const t = document.createElement("button");
    t.style.width = `${j}px`, t.style.height = `${j}px`, t.style.position = "absolute", t.style.top = `${at}px`, t.style.left = `${ht}px`, t.style.zIndex = lt.toString(), t.style.backgroundColor = "#FF0000", t.title = "select to enable accessibility for this content", t.addEventListener("focus", () => {
      this._isMobileAccessibility = !0, this._activate(), this._destroyTouchHook();
    }), document.body.appendChild(t), this._hookDiv = t;
  }
  /**
   * Destroys the touch hooks.
   * @private
   */
  _destroyTouchHook() {
    this._hookDiv && (document.body.removeChild(this._hookDiv), this._hookDiv = null);
  }
  /**
   * Activating will cause the Accessibility layer to be shown.
   * This is called when a user presses the tab key.
   * @private
   */
  _activate() {
    var t;
    this._isActive || (this._isActive = !0, globalThis.document.addEventListener("mousemove", this._onMouseMove, !0), globalThis.removeEventListener("keydown", this._onKeyDown, !1), this._renderer.runners.postrender.add(this), (t = this._renderer.view.canvas.parentNode) == null || t.appendChild(this._div));
  }
  /**
   * Deactivating will cause the Accessibility layer to be hidden.
   * This is called when a user moves the mouse.
   * @private
   */
  _deactivate() {
    var t;
    !this._isActive || this._isMobileAccessibility || (this._isActive = !1, globalThis.document.removeEventListener("mousemove", this._onMouseMove, !0), globalThis.addEventListener("keydown", this._onKeyDown, !1), this._renderer.runners.postrender.remove(this), (t = this._div.parentNode) == null || t.removeChild(this._div));
  }
  /**
   * This recursive function will run through the scene graph and add any new accessible objects to the DOM layer.
   * @private
   * @param {Container} container - The Container to check.
   */
  _updateAccessibleObjects(t) {
    if (!t.visible || !t.accessibleChildren)
      return;
    t.accessible && t.isInteractive() && (t._accessibleActive || this._addChild(t), t._renderId = this._renderId);
    const e = t.children;
    if (e)
      for (let n = 0; n < e.length; n++)
        this._updateAccessibleObjects(e[n]);
  }
  /**
   * Runner init called, view is available at this point.
   * @ignore
   */
  init(t) {
    this.debug = (t == null ? void 0 : t.debug) ?? this.debug, this._renderer.runners.postrender.remove(this);
  }
  /**
   * Runner postrender was called, ensure that all divs are mapped correctly to their Containers.
   * Only fires while active.
   * @ignore
   */
  postrender() {
    const t = performance.now();
    if (this._mobileInfo.android.device && t < this._androidUpdateCount || (this._androidUpdateCount = t + this._androidUpdateFrequency, !this._renderer.renderingToScreen || !this._renderer.view.canvas))
      return;
    this._renderer.lastObjectRendered && this._updateAccessibleObjects(this._renderer.lastObjectRendered);
    const { x: e, y: n, width: i, height: o } = this._renderer.view.canvas.getBoundingClientRect(), { width: s, height: r, resolution: c } = this._renderer, u = i / s * c, d = o / r * c;
    let l = this._div;
    l.style.left = `${e}px`, l.style.top = `${n}px`, l.style.width = `${s}px`, l.style.height = `${r}px`;
    for (let p = 0; p < this._children.length; p++) {
      const h = this._children[p];
      if (h._renderId !== this._renderId)
        h._accessibleActive = !1, J(this._children, p, 1), this._div.removeChild(h._accessibleDiv), this._pool.push(h._accessibleDiv), h._accessibleDiv = null, p--;
      else {
        l = h._accessibleDiv;
        let v = h.hitArea;
        const b = h.worldTransform;
        h.hitArea ? (l.style.left = `${(b.tx + v.x * b.a) * u}px`, l.style.top = `${(b.ty + v.y * b.d) * d}px`, l.style.width = `${v.width * b.a * u}px`, l.style.height = `${v.height * b.d * d}px`) : (v = h.getBounds().rectangle, this._capHitArea(v), l.style.left = `${v.x * u}px`, l.style.top = `${v.y * d}px`, l.style.width = `${v.width * u}px`, l.style.height = `${v.height * d}px`, l.title !== h.accessibleTitle && h.accessibleTitle !== null && (l.title = h.accessibleTitle || ""), l.getAttribute("aria-label") !== h.accessibleHint && h.accessibleHint !== null && l.setAttribute("aria-label", h.accessibleHint || "")), (h.accessibleTitle !== l.title || h.tabIndex !== l.tabIndex) && (l.title = h.accessibleTitle || "", l.tabIndex = h.tabIndex, this.debug && this._updateDebugHTML(l));
      }
    }
    this._renderId++;
  }
  /**
   * private function that will visually add the information to the
   * accessibility div
   * @param {HTMLElement} div -
   */
  _updateDebugHTML(t) {
    t.innerHTML = `type: ${t.type}</br> title : ${t.title}</br> tabIndex: ${t.tabIndex}`;
  }
  /**
   * Adjust the hit area based on the bounds of a display object
   * @param {Rectangle} hitArea - Bounds of the child
   */
  _capHitArea(t) {
    t.x < 0 && (t.width += t.x, t.x = 0), t.y < 0 && (t.height += t.y, t.y = 0);
    const { width: e, height: n } = this._renderer;
    t.x + t.width > e && (t.width = e - t.x), t.y + t.height > n && (t.height = n - t.y);
  }
  /**
   * Adds a Container to the accessibility manager
   * @private
   * @param {Container} container - The child to make accessible.
   */
  _addChild(t) {
    let e = this._pool.pop();
    e || (e = document.createElement("button"), e.style.width = `${D}px`, e.style.height = `${D}px`, e.style.backgroundColor = this.debug ? "rgba(255,255,255,0.5)" : "transparent", e.style.position = "absolute", e.style.zIndex = N.toString(), e.style.borderStyle = "none", navigator.userAgent.toLowerCase().includes("chrome") ? e.setAttribute("aria-live", "off") : e.setAttribute("aria-live", "polite"), navigator.userAgent.match(/rv:.*Gecko\//) ? e.setAttribute("aria-relevant", "additions") : e.setAttribute("aria-relevant", "text"), e.addEventListener("click", this._onClick.bind(this)), e.addEventListener("focus", this._onFocus.bind(this)), e.addEventListener("focusout", this._onFocusOut.bind(this))), e.style.pointerEvents = t.accessiblePointerEvents, e.type = t.accessibleType, t.accessibleTitle && t.accessibleTitle !== null ? e.title = t.accessibleTitle : (!t.accessibleHint || t.accessibleHint === null) && (e.title = `container ${t.tabIndex}`), t.accessibleHint && t.accessibleHint !== null && e.setAttribute("aria-label", t.accessibleHint), this.debug && this._updateDebugHTML(e), t._accessibleActive = !0, t._accessibleDiv = e, e.container = t, this._children.push(t), this._div.appendChild(t._accessibleDiv), t._accessibleDiv.tabIndex = t.tabIndex;
  }
  /**
   * Dispatch events with the EventSystem.
   * @param e
   * @param type
   * @private
   */
  _dispatchEvent(t, e) {
    const { container: n } = t.target, i = this._renderer.events.rootBoundary, o = Object.assign(new M(i), { target: n });
    i.rootTarget = this._renderer.lastObjectRendered, e.forEach((s) => i.dispatchEvent(o, s));
  }
  /**
   * Maps the div button press to pixi's EventSystem (click)
   * @private
   * @param {MouseEvent} e - The click event.
   */
  _onClick(t) {
    this._dispatchEvent(t, ["click", "pointertap", "tap"]);
  }
  /**
   * Maps the div focus events to pixi's EventSystem (mouseover)
   * @private
   * @param {FocusEvent} e - The focus event.
   */
  _onFocus(t) {
    t.target.getAttribute("aria-live") || t.target.setAttribute("aria-live", "assertive"), this._dispatchEvent(t, ["mouseover"]);
  }
  /**
   * Maps the div focus events to pixi's EventSystem (mouseout)
   * @private
   * @param {FocusEvent} e - The focusout event.
   */
  _onFocusOut(t) {
    t.target.getAttribute("aria-live") || t.target.setAttribute("aria-live", "polite"), this._dispatchEvent(t, ["mouseout"]);
  }
  /**
   * Is called when a key is pressed
   * @private
   * @param {KeyboardEvent} e - The keydown event.
   */
  _onKeyDown(t) {
    t.keyCode === ot && this._activate();
  }
  /**
   * Is called when the mouse moves across the renderer element
   * @private
   * @param {MouseEvent} e - The mouse event.
   */
  _onMouseMove(t) {
    t.movementX === 0 && t.movementY === 0 || this._deactivate();
  }
  /** Destroys the accessibility manager */
  destroy() {
    this._destroyTouchHook(), this._div = null, globalThis.document.removeEventListener("mousemove", this._onMouseMove, !0), globalThis.removeEventListener("keydown", this._onKeyDown), this._pool = null, this._children = null, this._renderer = null;
  }
}
Z.extension = {
  type: [
    w.WebGLSystem,
    w.WebGPUSystem
  ],
  name: "accessibility"
};
const pt = {
  /**
   * Flag for if the object is accessible. If true AccessibilityManager will overlay a
   * shadow div with attributes set
   * @member {boolean}
   * @memberof scene.Container#
   */
  accessible: !1,
  /**
   * Sets the title attribute of the shadow div
   * If accessibleTitle AND accessibleHint has not been this will default to 'container [tabIndex]'
   * @member {string}
   * @memberof scene.Container#
   */
  accessibleTitle: null,
  /**
   * Sets the aria-label attribute of the shadow div
   * @member {string}
   * @memberof scene.Container#
   */
  accessibleHint: null,
  /**
   * @member {number}
   * @memberof scene.Container#
   * @todo Needs docs.
   */
  tabIndex: 0,
  /**
   * @member {boolean}
   * @memberof scene.Container#
   * @private
   */
  _accessibleActive: !1,
  /**
   * @memberof scene.Container#
   * @private
   */
  _accessibleDiv: null,
  /**
   * Specify the type of div the accessible layer is. Screen readers treat the element differently
   * depending on this type. Defaults to button.
   * @member {string}
   * @memberof scene.Container#
   * @default 'button'
   */
  accessibleType: "button",
  /**
   * Specify the pointer-events the accessible div will use
   * Defaults to auto.
   * @type {PointerEvents}
   * @memberof scene.Container#
   * @default 'auto'
   */
  accessiblePointerEvents: "auto",
  /**
   * Setting to false will prevent any children inside this container to
   * be accessible. Defaults to true.
   * @member {boolean}
   * @memberof scene.Container#
   * @default true
   */
  accessibleChildren: !0,
  /**
   * @member {number}
   * @memberof scene.Container#
   * @private
   */
  _renderId: -1
};
class ct {
  constructor() {
    this.interactionFrequency = 10, this._deltaTime = 0, this._didMove = !1, this._tickerAdded = !1, this._pauseUpdate = !0;
  }
  /**
   * Initializes the event ticker.
   * @param events - The event system.
   */
  init(t) {
    this.removeTickerListener(), this.events = t, this.interactionFrequency = 10, this._deltaTime = 0, this._didMove = !1, this._tickerAdded = !1, this._pauseUpdate = !0;
  }
  /** Whether to pause the update checks or not. */
  get pauseUpdate() {
    return this._pauseUpdate;
  }
  set pauseUpdate(t) {
    this._pauseUpdate = t;
  }
  /** Adds the ticker listener. */
  addTickerListener() {
    this._tickerAdded || !this.domElement || (B.system.add(this._tickerUpdate, this, tt.INTERACTION), this._tickerAdded = !0);
  }
  /** Removes the ticker listener. */
  removeTickerListener() {
    this._tickerAdded && (B.system.remove(this._tickerUpdate, this), this._tickerAdded = !1);
  }
  /** Sets flag to not fire extra events when the user has already moved there mouse */
  pointerMoved() {
    this._didMove = !0;
  }
  /** Updates the state of interactive objects. */
  _update() {
    if (!this.domElement || this._pauseUpdate)
      return;
    if (this._didMove) {
      this._didMove = !1;
      return;
    }
    const t = this.events._rootPointerEvent;
    this.events.supportsTouchEvents && t.pointerType === "touch" || globalThis.document.dispatchEvent(new PointerEvent("pointermove", {
      clientX: t.clientX,
      clientY: t.clientY,
      pointerType: t.pointerType,
      pointerId: t.pointerId
    }));
  }
  /**
   * Updates the state of interactive objects if at least {@link interactionFrequency}
   * milliseconds have passed since the last invocation.
   *
   * Invoked by a throttled ticker update from {@link Ticker.system}.
   * @param ticker - The throttled ticker.
   */
  _tickerUpdate(t) {
    this._deltaTime += t.deltaTime, !(this._deltaTime < this.interactionFrequency) && (this._deltaTime = 0, this._update());
  }
}
const f = new ct();
class I extends M {
  constructor() {
    super(...arguments), this.client = new y(), this.movement = new y(), this.offset = new y(), this.global = new y(), this.screen = new y();
  }
  /** @readonly */
  get clientX() {
    return this.client.x;
  }
  /** @readonly */
  get clientY() {
    return this.client.y;
  }
  /**
   * Alias for {@link FederatedMouseEvent.clientX this.clientX}.
   * @readonly
   */
  get x() {
    return this.clientX;
  }
  /**
   * Alias for {@link FederatedMouseEvent.clientY this.clientY}.
   * @readonly
   */
  get y() {
    return this.clientY;
  }
  /** @readonly */
  get movementX() {
    return this.movement.x;
  }
  /** @readonly */
  get movementY() {
    return this.movement.y;
  }
  /** @readonly */
  get offsetX() {
    return this.offset.x;
  }
  /** @readonly */
  get offsetY() {
    return this.offset.y;
  }
  /** @readonly */
  get globalX() {
    return this.global.x;
  }
  /** @readonly */
  get globalY() {
    return this.global.y;
  }
  /**
   * The pointer coordinates in the renderer's screen. Alias for {@code screen.x}.
   * @readonly
   */
  get screenX() {
    return this.screen.x;
  }
  /**
   * The pointer coordinates in the renderer's screen. Alias for {@code screen.y}.
   * @readonly
   */
  get screenY() {
    return this.screen.y;
  }
  /**
   * This will return the local coordinates of the specified container for this InteractionData
   * @param {Container} container - The Container that you would like the local
   *  coords off
   * @param {PointData} point - A Point object in which to store the value, optional (otherwise
   *  will create a new point)
   * @param {PointData} globalPos - A Point object containing your custom global coords, optional
   *  (otherwise will use the current global coords)
   * @returns - A point containing the coordinates of the InteractionData position relative
   *  to the Container
   */
  getLocalPosition(t, e, n) {
    return t.worldTransform.applyInverse(n || this.global, e);
  }
  /**
   * Whether the modifier key was pressed when this event natively occurred.
   * @param key - The modifier key.
   */
  getModifierState(t) {
    return "getModifierState" in this.nativeEvent && this.nativeEvent.getModifierState(t);
  }
  /**
   * Not supported.
   * @param _typeArg
   * @param _canBubbleArg
   * @param _cancelableArg
   * @param _viewArg
   * @param _detailArg
   * @param _screenXArg
   * @param _screenYArg
   * @param _clientXArg
   * @param _clientYArg
   * @param _ctrlKeyArg
   * @param _altKeyArg
   * @param _shiftKeyArg
   * @param _metaKeyArg
   * @param _buttonArg
   * @param _relatedTargetArg
   * @deprecated since 7.0.0
   */
  // eslint-disable-next-line max-params
  initMouseEvent(t, e, n, i, o, s, r, c, u, d, l, p, h, v, b) {
    throw new Error("Method not implemented.");
  }
}
class m extends I {
  constructor() {
    super(...arguments), this.width = 0, this.height = 0, this.isPrimary = !1;
  }
  // Only included for completeness for now
  getCoalescedEvents() {
    return this.type === "pointermove" || this.type === "mousemove" || this.type === "touchmove" ? [this] : [];
  }
  // Only included for completeness for now
  getPredictedEvents() {
    throw new Error("getPredictedEvents is not supported!");
  }
}
class T extends I {
  constructor() {
    super(...arguments), this.DOM_DELTA_PIXEL = 0, this.DOM_DELTA_LINE = 1, this.DOM_DELTA_PAGE = 2;
  }
}
T.DOM_DELTA_PIXEL = 0;
T.DOM_DELTA_LINE = 1;
T.DOM_DELTA_PAGE = 2;
const ut = 2048, dt = new y(), P = new y();
class vt {
  /**
   * @param rootTarget - The holder of the event boundary.
   */
  constructor(t) {
    this.dispatch = new Q(), this.moveOnAll = !1, this.enableGlobalMoveEvents = !0, this.mappingState = {
      trackingData: {}
    }, this.eventPool = /* @__PURE__ */ new Map(), this._allInteractiveElements = [], this._hitElements = [], this._isPointerMoveEvent = !1, this.rootTarget = t, this.hitPruneFn = this.hitPruneFn.bind(this), this.hitTestFn = this.hitTestFn.bind(this), this.mapPointerDown = this.mapPointerDown.bind(this), this.mapPointerMove = this.mapPointerMove.bind(this), this.mapPointerOut = this.mapPointerOut.bind(this), this.mapPointerOver = this.mapPointerOver.bind(this), this.mapPointerUp = this.mapPointerUp.bind(this), this.mapPointerUpOutside = this.mapPointerUpOutside.bind(this), this.mapWheel = this.mapWheel.bind(this), this.mappingTable = {}, this.addEventMapping("pointerdown", this.mapPointerDown), this.addEventMapping("pointermove", this.mapPointerMove), this.addEventMapping("pointerout", this.mapPointerOut), this.addEventMapping("pointerleave", this.mapPointerOut), this.addEventMapping("pointerover", this.mapPointerOver), this.addEventMapping("pointerup", this.mapPointerUp), this.addEventMapping("pointerupoutside", this.mapPointerUpOutside), this.addEventMapping("wheel", this.mapWheel);
  }
  /**
   * Adds an event mapping for the event `type` handled by `fn`.
   *
   * Event mappings can be used to implement additional or custom events. They take an event
   * coming from the upstream scene (or directly from the {@link EventSystem}) and dispatch new downstream events
   * generally trickling down and bubbling up to {@link EventBoundary.rootTarget this.rootTarget}.
   *
   * To modify the semantics of existing events, the built-in mapping methods of EventBoundary should be overridden
   * instead.
   * @param type - The type of upstream event to map.
   * @param fn - The mapping method. The context of this function must be bound manually, if desired.
   */
  addEventMapping(t, e) {
    this.mappingTable[t] || (this.mappingTable[t] = []), this.mappingTable[t].push({
      fn: e,
      priority: 0
    }), this.mappingTable[t].sort((n, i) => n.priority - i.priority);
  }
  /**
   * Dispatches the given event
   * @param e - The event to dispatch.
   * @param type - The type of event to dispatch. Defaults to `e.type`.
   */
  dispatchEvent(t, e) {
    t.propagationStopped = !1, t.propagationImmediatelyStopped = !1, this.propagate(t, e), this.dispatch.emit(e || t.type, t);
  }
  /**
   * Maps the given upstream event through the event boundary and propagates it downstream.
   * @param e - The event to map.
   */
  mapEvent(t) {
    if (!this.rootTarget)
      return;
    const e = this.mappingTable[t.type];
    if (e)
      for (let n = 0, i = e.length; n < i; n++)
        e[n].fn(t);
    else
      E(`[EventBoundary]: Event mapping not defined for ${t.type}`);
  }
  /**
   * Finds the Container that is the target of a event at the given coordinates.
   *
   * The passed (x,y) coordinates are in the world space above this event boundary.
   * @param x - The x coordinate of the event.
   * @param y - The y coordinate of the event.
   */
  hitTest(t, e) {
    f.pauseUpdate = !0;
    const n = this._isPointerMoveEvent && this.enableGlobalMoveEvents ? "hitTestMoveRecursive" : "hitTestRecursive", i = this[n](
      this.rootTarget,
      this.rootTarget.eventMode,
      dt.set(t, e),
      this.hitTestFn,
      this.hitPruneFn
    );
    return i && i[0];
  }
  /**
   * Propagate the passed event from from {@link EventBoundary.rootTarget this.rootTarget} to its
   * target {@code e.target}.
   * @param e - The event to propagate.
   * @param type - The type of event to propagate. Defaults to `e.type`.
   */
  propagate(t, e) {
    if (!t.target)
      return;
    const n = t.composedPath();
    t.eventPhase = t.CAPTURING_PHASE;
    for (let i = 0, o = n.length - 1; i < o; i++)
      if (t.currentTarget = n[i], this.notifyTarget(t, e), t.propagationStopped || t.propagationImmediatelyStopped)
        return;
    if (t.eventPhase = t.AT_TARGET, t.currentTarget = t.target, this.notifyTarget(t, e), !(t.propagationStopped || t.propagationImmediatelyStopped)) {
      t.eventPhase = t.BUBBLING_PHASE;
      for (let i = n.length - 2; i >= 0; i--)
        if (t.currentTarget = n[i], this.notifyTarget(t, e), t.propagationStopped || t.propagationImmediatelyStopped)
          return;
    }
  }
  /**
   * Emits the event {@code e} to all interactive containers. The event is propagated in the bubbling phase always.
   *
   * This is used in the `globalpointermove` event.
   * @param e - The emitted event.
   * @param type - The listeners to notify.
   * @param targets - The targets to notify.
   */
  all(t, e, n = this._allInteractiveElements) {
    if (n.length === 0)
      return;
    t.eventPhase = t.BUBBLING_PHASE;
    const i = Array.isArray(e) ? e : [e];
    for (let o = n.length - 1; o >= 0; o--)
      i.forEach((s) => {
        t.currentTarget = n[o], this.notifyTarget(t, s);
      });
  }
  /**
   * Finds the propagation path from {@link EventBoundary.rootTarget rootTarget} to the passed
   * {@code target}. The last element in the path is {@code target}.
   * @param target - The target to find the propagation path to.
   */
  propagationPath(t) {
    const e = [t];
    for (let n = 0; n < ut && t !== this.rootTarget && t.parent; n++) {
      if (!t.parent)
        throw new Error("Cannot find propagation path to disconnected target");
      e.push(t.parent), t = t.parent;
    }
    return e.reverse(), e;
  }
  hitTestMoveRecursive(t, e, n, i, o, s = !1) {
    let r = !1;
    if (this._interactivePrune(t))
      return null;
    if ((t.eventMode === "dynamic" || e === "dynamic") && (f.pauseUpdate = !1), t.interactiveChildren && t.children) {
      const d = t.children;
      for (let l = d.length - 1; l >= 0; l--) {
        const p = d[l], h = this.hitTestMoveRecursive(
          p,
          this._isInteractive(e) ? e : p.eventMode,
          n,
          i,
          o,
          s || o(t, n)
        );
        if (h) {
          if (h.length > 0 && !h[h.length - 1].parent)
            continue;
          const v = t.isInteractive();
          (h.length > 0 || v) && (v && this._allInteractiveElements.push(t), h.push(t)), this._hitElements.length === 0 && (this._hitElements = h), r = !0;
        }
      }
    }
    const c = this._isInteractive(e), u = t.isInteractive();
    return u && u && this._allInteractiveElements.push(t), s || this._hitElements.length > 0 ? null : r ? this._hitElements : c && !o(t, n) && i(t, n) ? u ? [t] : [] : null;
  }
  /**
   * Recursive implementation for {@link EventBoundary.hitTest hitTest}.
   * @param currentTarget - The Container that is to be hit tested.
   * @param eventMode - The event mode for the `currentTarget` or one of its parents.
   * @param location - The location that is being tested for overlap.
   * @param testFn - Callback that determines whether the target passes hit testing. This callback
   *  can assume that `pruneFn` failed to prune the container.
   * @param pruneFn - Callback that determiness whether the target and all of its children
   *  cannot pass the hit test. It is used as a preliminary optimization to prune entire subtrees
   *  of the scene graph.
   * @returns An array holding the hit testing target and all its ancestors in order. The first element
   *  is the target itself and the last is {@link EventBoundary.rootTarget rootTarget}. This is the opposite
   *  order w.r.t. the propagation path. If no hit testing target is found, null is returned.
   */
  hitTestRecursive(t, e, n, i, o) {
    if (this._interactivePrune(t) || o(t, n))
      return null;
    if ((t.eventMode === "dynamic" || e === "dynamic") && (f.pauseUpdate = !1), t.interactiveChildren && t.children) {
      const c = t.children, u = n;
      for (let d = c.length - 1; d >= 0; d--) {
        const l = c[d], p = this.hitTestRecursive(
          l,
          this._isInteractive(e) ? e : l.eventMode,
          u,
          i,
          o
        );
        if (p) {
          if (p.length > 0 && !p[p.length - 1].parent)
            continue;
          const h = t.isInteractive();
          return (p.length > 0 || h) && p.push(t), p;
        }
      }
    }
    const s = this._isInteractive(e), r = t.isInteractive();
    return s && i(t, n) ? r ? [t] : [] : null;
  }
  _isInteractive(t) {
    return t === "static" || t === "dynamic";
  }
  _interactivePrune(t) {
    return !t || !t.visible || !t.renderable || !t.includeInBuild || !t.measurable || t.eventMode === "none" || t.eventMode === "passive" && !t.interactiveChildren;
  }
  /**
   * Checks whether the container or any of its children cannot pass the hit test at all.
   *
   * {@link EventBoundary}'s implementation uses the {@link Container.hitArea hitArea}
   * and {@link Container._maskEffect} for pruning.
   * @param container - The container to prune.
   * @param location - The location to test for overlap.
   */
  hitPruneFn(t, e) {
    if (t.hitArea && (t.worldTransform.applyInverse(e, P), !t.hitArea.contains(P.x, P.y)))
      return !0;
    if (t.effects && t.effects.length)
      for (let n = 0; n < t.effects.length; n++) {
        const i = t.effects[n];
        if (i.containsPoint && !i.containsPoint(e, this.hitTestFn))
          return !0;
      }
    return !1;
  }
  /**
   * Checks whether the container passes hit testing for the given location.
   * @param container - The container to test.
   * @param location - The location to test for overlap.
   * @returns - Whether `container` passes hit testing for `location`.
   */
  hitTestFn(t, e) {
    return t.hitArea ? !0 : t != null && t.containsPoint ? (t.worldTransform.applyInverse(e, P), t.containsPoint(P)) : !1;
  }
  /**
   * Notify all the listeners to the event's `currentTarget`.
   *
   * If the `currentTarget` contains the property `on<type>`, then it is called here,
   * simulating the behavior from version 6.x and prior.
   * @param e - The event passed to the target.
   * @param type - The type of event to notify. Defaults to `e.type`.
   */
  notifyTarget(t, e) {
    var n, i;
    if (!t.currentTarget.isInteractive())
      return;
    e = e ?? t.type;
    const o = `on${e}`;
    (i = (n = t.currentTarget)[o]) == null || i.call(n, t);
    const s = t.eventPhase === t.CAPTURING_PHASE || t.eventPhase === t.AT_TARGET ? `${e}capture` : e;
    this._notifyListeners(t, s), t.eventPhase === t.AT_TARGET && this._notifyListeners(t, e);
  }
  /**
   * Maps the upstream `pointerdown` events to a downstream `pointerdown` event.
   *
   * `touchstart`, `rightdown`, `mousedown` events are also dispatched for specific pointer types.
   * @param from - The upstream `pointerdown` event.
   */
  mapPointerDown(t) {
    if (!(t instanceof m)) {
      E("EventBoundary cannot map a non-pointer event as a pointer event");
      return;
    }
    const e = this.createPointerEvent(t);
    if (this.dispatchEvent(e, "pointerdown"), e.pointerType === "touch")
      this.dispatchEvent(e, "touchstart");
    else if (e.pointerType === "mouse" || e.pointerType === "pen") {
      const i = e.button === 2;
      this.dispatchEvent(e, i ? "rightdown" : "mousedown");
    }
    const n = this.trackingData(t.pointerId);
    n.pressTargetsByButton[t.button] = e.composedPath(), this.freeEvent(e);
  }
  /**
   * Maps the upstream `pointermove` to downstream `pointerout`, `pointerover`, and `pointermove` events, in that order.
   *
   * The tracking data for the specific pointer has an updated `overTarget`. `mouseout`, `mouseover`,
   * `mousemove`, and `touchmove` events are fired as well for specific pointer types.
   * @param from - The upstream `pointermove` event.
   */
  mapPointerMove(t) {
    var e, n;
    if (!(t instanceof m)) {
      E("EventBoundary cannot map a non-pointer event as a pointer event");
      return;
    }
    this._allInteractiveElements.length = 0, this._hitElements.length = 0, this._isPointerMoveEvent = !0;
    const i = this.createPointerEvent(t);
    this._isPointerMoveEvent = !1;
    const o = i.pointerType === "mouse" || i.pointerType === "pen", s = this.trackingData(t.pointerId), r = this.findMountedTarget(s.overTargets);
    if (((e = s.overTargets) == null ? void 0 : e.length) > 0 && r !== i.target) {
      const d = t.type === "mousemove" ? "mouseout" : "pointerout", l = this.createPointerEvent(t, d, r);
      if (this.dispatchEvent(l, "pointerout"), o && this.dispatchEvent(l, "mouseout"), !i.composedPath().includes(r)) {
        const p = this.createPointerEvent(t, "pointerleave", r);
        for (p.eventPhase = p.AT_TARGET; p.target && !i.composedPath().includes(p.target); )
          p.currentTarget = p.target, this.notifyTarget(p), o && this.notifyTarget(p, "mouseleave"), p.target = p.target.parent;
        this.freeEvent(p);
      }
      this.freeEvent(l);
    }
    if (r !== i.target) {
      const d = t.type === "mousemove" ? "mouseover" : "pointerover", l = this.clonePointerEvent(i, d);
      this.dispatchEvent(l, "pointerover"), o && this.dispatchEvent(l, "mouseover");
      let p = r == null ? void 0 : r.parent;
      for (; p && p !== this.rootTarget.parent && p !== i.target; )
        p = p.parent;
      if (!p || p === this.rootTarget.parent) {
        const h = this.clonePointerEvent(i, "pointerenter");
        for (h.eventPhase = h.AT_TARGET; h.target && h.target !== r && h.target !== this.rootTarget.parent; )
          h.currentTarget = h.target, this.notifyTarget(h), o && this.notifyTarget(h, "mouseenter"), h.target = h.target.parent;
        this.freeEvent(h);
      }
      this.freeEvent(l);
    }
    const c = [], u = this.enableGlobalMoveEvents ?? !0;
    this.moveOnAll ? c.push("pointermove") : this.dispatchEvent(i, "pointermove"), u && c.push("globalpointermove"), i.pointerType === "touch" && (this.moveOnAll ? c.splice(1, 0, "touchmove") : this.dispatchEvent(i, "touchmove"), u && c.push("globaltouchmove")), o && (this.moveOnAll ? c.splice(1, 0, "mousemove") : this.dispatchEvent(i, "mousemove"), u && c.push("globalmousemove"), this.cursor = (n = i.target) == null ? void 0 : n.cursor), c.length > 0 && this.all(i, c), this._allInteractiveElements.length = 0, this._hitElements.length = 0, s.overTargets = i.composedPath(), this.freeEvent(i);
  }
  /**
   * Maps the upstream `pointerover` to downstream `pointerover` and `pointerenter` events, in that order.
   *
   * The tracking data for the specific pointer gets a new `overTarget`.
   * @param from - The upstream `pointerover` event.
   */
  mapPointerOver(t) {
    var e;
    if (!(t instanceof m)) {
      E("EventBoundary cannot map a non-pointer event as a pointer event");
      return;
    }
    const n = this.trackingData(t.pointerId), i = this.createPointerEvent(t), o = i.pointerType === "mouse" || i.pointerType === "pen";
    this.dispatchEvent(i, "pointerover"), o && this.dispatchEvent(i, "mouseover"), i.pointerType === "mouse" && (this.cursor = (e = i.target) == null ? void 0 : e.cursor);
    const s = this.clonePointerEvent(i, "pointerenter");
    for (s.eventPhase = s.AT_TARGET; s.target && s.target !== this.rootTarget.parent; )
      s.currentTarget = s.target, this.notifyTarget(s), o && this.notifyTarget(s, "mouseenter"), s.target = s.target.parent;
    n.overTargets = i.composedPath(), this.freeEvent(i), this.freeEvent(s);
  }
  /**
   * Maps the upstream `pointerout` to downstream `pointerout`, `pointerleave` events, in that order.
   *
   * The tracking data for the specific pointer is cleared of a `overTarget`.
   * @param from - The upstream `pointerout` event.
   */
  mapPointerOut(t) {
    if (!(t instanceof m)) {
      E("EventBoundary cannot map a non-pointer event as a pointer event");
      return;
    }
    const e = this.trackingData(t.pointerId);
    if (e.overTargets) {
      const n = t.pointerType === "mouse" || t.pointerType === "pen", i = this.findMountedTarget(e.overTargets), o = this.createPointerEvent(t, "pointerout", i);
      this.dispatchEvent(o), n && this.dispatchEvent(o, "mouseout");
      const s = this.createPointerEvent(t, "pointerleave", i);
      for (s.eventPhase = s.AT_TARGET; s.target && s.target !== this.rootTarget.parent; )
        s.currentTarget = s.target, this.notifyTarget(s), n && this.notifyTarget(s, "mouseleave"), s.target = s.target.parent;
      e.overTargets = null, this.freeEvent(o), this.freeEvent(s);
    }
    this.cursor = null;
  }
  /**
   * Maps the upstream `pointerup` event to downstream `pointerup`, `pointerupoutside`,
   * and `click`/`rightclick`/`pointertap` events, in that order.
   *
   * The `pointerupoutside` event bubbles from the original `pointerdown` target to the most specific
   * ancestor of the `pointerdown` and `pointerup` targets, which is also the `click` event's target. `touchend`,
   * `rightup`, `mouseup`, `touchendoutside`, `rightupoutside`, `mouseupoutside`, and `tap` are fired as well for
   * specific pointer types.
   * @param from - The upstream `pointerup` event.
   */
  mapPointerUp(t) {
    if (!(t instanceof m)) {
      E("EventBoundary cannot map a non-pointer event as a pointer event");
      return;
    }
    const e = performance.now(), n = this.createPointerEvent(t);
    if (this.dispatchEvent(n, "pointerup"), n.pointerType === "touch")
      this.dispatchEvent(n, "touchend");
    else if (n.pointerType === "mouse" || n.pointerType === "pen") {
      const r = n.button === 2;
      this.dispatchEvent(n, r ? "rightup" : "mouseup");
    }
    const i = this.trackingData(t.pointerId), o = this.findMountedTarget(i.pressTargetsByButton[t.button]);
    let s = o;
    if (o && !n.composedPath().includes(o)) {
      let r = o;
      for (; r && !n.composedPath().includes(r); ) {
        if (n.currentTarget = r, this.notifyTarget(n, "pointerupoutside"), n.pointerType === "touch")
          this.notifyTarget(n, "touchendoutside");
        else if (n.pointerType === "mouse" || n.pointerType === "pen") {
          const c = n.button === 2;
          this.notifyTarget(n, c ? "rightupoutside" : "mouseupoutside");
        }
        r = r.parent;
      }
      delete i.pressTargetsByButton[t.button], s = r;
    }
    if (s) {
      const r = this.clonePointerEvent(n, "click");
      r.target = s, r.path = null, i.clicksByButton[t.button] || (i.clicksByButton[t.button] = {
        clickCount: 0,
        target: r.target,
        timeStamp: e
      });
      const c = i.clicksByButton[t.button];
      if (c.target === r.target && e - c.timeStamp < 200 ? ++c.clickCount : c.clickCount = 1, c.target = r.target, c.timeStamp = e, r.detail = c.clickCount, r.pointerType === "mouse") {
        const u = r.button === 2;
        this.dispatchEvent(r, u ? "rightclick" : "click");
      } else r.pointerType === "touch" && this.dispatchEvent(r, "tap");
      this.dispatchEvent(r, "pointertap"), this.freeEvent(r);
    }
    this.freeEvent(n);
  }
  /**
   * Maps the upstream `pointerupoutside` event to a downstream `pointerupoutside` event, bubbling from the original
   * `pointerdown` target to `rootTarget`.
   *
   * (The most specific ancestor of the `pointerdown` event and the `pointerup` event must the
   * `{@link EventBoundary}'s root because the `pointerup` event occurred outside of the boundary.)
   *
   * `touchendoutside`, `mouseupoutside`, and `rightupoutside` events are fired as well for specific pointer
   * types. The tracking data for the specific pointer is cleared of a `pressTarget`.
   * @param from - The upstream `pointerupoutside` event.
   */
  mapPointerUpOutside(t) {
    if (!(t instanceof m)) {
      E("EventBoundary cannot map a non-pointer event as a pointer event");
      return;
    }
    const e = this.trackingData(t.pointerId), n = this.findMountedTarget(e.pressTargetsByButton[t.button]), i = this.createPointerEvent(t);
    if (n) {
      let o = n;
      for (; o; )
        i.currentTarget = o, this.notifyTarget(i, "pointerupoutside"), i.pointerType === "touch" ? this.notifyTarget(i, "touchendoutside") : (i.pointerType === "mouse" || i.pointerType === "pen") && this.notifyTarget(i, i.button === 2 ? "rightupoutside" : "mouseupoutside"), o = o.parent;
      delete e.pressTargetsByButton[t.button];
    }
    this.freeEvent(i);
  }
  /**
   * Maps the upstream `wheel` event to a downstream `wheel` event.
   * @param from - The upstream `wheel` event.
   */
  mapWheel(t) {
    if (!(t instanceof T)) {
      E("EventBoundary cannot map a non-wheel event as a wheel event");
      return;
    }
    const e = this.createWheelEvent(t);
    this.dispatchEvent(e), this.freeEvent(e);
  }
  /**
   * Finds the most specific event-target in the given propagation path that is still mounted in the scene graph.
   *
   * This is used to find the correct `pointerup` and `pointerout` target in the case that the original `pointerdown`
   * or `pointerover` target was unmounted from the scene graph.
   * @param propagationPath - The propagation path was valid in the past.
   * @returns - The most specific event-target still mounted at the same location in the scene graph.
   */
  findMountedTarget(t) {
    if (!t)
      return null;
    let e = t[0];
    for (let n = 1; n < t.length && t[n].parent === e; n++)
      e = t[n];
    return e;
  }
  /**
   * Creates an event whose {@code originalEvent} is {@code from}, with an optional `type` and `target` override.
   *
   * The event is allocated using {@link EventBoundary#allocateEvent this.allocateEvent}.
   * @param from - The {@code originalEvent} for the returned event.
   * @param [type=from.type] - The type of the returned event.
   * @param target - The target of the returned event.
   */
  createPointerEvent(t, e, n) {
    const i = this.allocateEvent(m);
    return this.copyPointerData(t, i), this.copyMouseData(t, i), this.copyData(t, i), i.nativeEvent = t.nativeEvent, i.originalEvent = t, i.target = n ?? this.hitTest(i.global.x, i.global.y) ?? this._hitElements[0], typeof e == "string" && (i.type = e), i;
  }
  /**
   * Creates a wheel event whose {@code originalEvent} is {@code from}.
   *
   * The event is allocated using {@link EventBoundary#allocateEvent this.allocateEvent}.
   * @param from - The upstream wheel event.
   */
  createWheelEvent(t) {
    const e = this.allocateEvent(T);
    return this.copyWheelData(t, e), this.copyMouseData(t, e), this.copyData(t, e), e.nativeEvent = t.nativeEvent, e.originalEvent = t, e.target = this.hitTest(e.global.x, e.global.y), e;
  }
  /**
   * Clones the event {@code from}, with an optional {@code type} override.
   *
   * The event is allocated using {@link EventBoundary#allocateEvent this.allocateEvent}.
   * @param from - The event to clone.
   * @param [type=from.type] - The type of the returned event.
   */
  clonePointerEvent(t, e) {
    const n = this.allocateEvent(m);
    return n.nativeEvent = t.nativeEvent, n.originalEvent = t.originalEvent, this.copyPointerData(t, n), this.copyMouseData(t, n), this.copyData(t, n), n.target = t.target, n.path = t.composedPath().slice(), n.type = e ?? n.type, n;
  }
  /**
   * Copies wheel {@link FederatedWheelEvent} data from {@code from} into {@code to}.
   *
   * The following properties are copied:
   * + deltaMode
   * + deltaX
   * + deltaY
   * + deltaZ
   * @param from - The event to copy data from.
   * @param to - The event to copy data into.
   */
  copyWheelData(t, e) {
    e.deltaMode = t.deltaMode, e.deltaX = t.deltaX, e.deltaY = t.deltaY, e.deltaZ = t.deltaZ;
  }
  /**
   * Copies pointer {@link FederatedPointerEvent} data from {@code from} into {@code to}.
   *
   * The following properties are copied:
   * + pointerId
   * + width
   * + height
   * + isPrimary
   * + pointerType
   * + pressure
   * + tangentialPressure
   * + tiltX
   * + tiltY
   * @param from - The event to copy data from.
   * @param to - The event to copy data into.
   */
  copyPointerData(t, e) {
    t instanceof m && e instanceof m && (e.pointerId = t.pointerId, e.width = t.width, e.height = t.height, e.isPrimary = t.isPrimary, e.pointerType = t.pointerType, e.pressure = t.pressure, e.tangentialPressure = t.tangentialPressure, e.tiltX = t.tiltX, e.tiltY = t.tiltY, e.twist = t.twist);
  }
  /**
   * Copies mouse {@link FederatedMouseEvent} data from {@code from} to {@code to}.
   *
   * The following properties are copied:
   * + altKey
   * + button
   * + buttons
   * + clientX
   * + clientY
   * + metaKey
   * + movementX
   * + movementY
   * + pageX
   * + pageY
   * + x
   * + y
   * + screen
   * + shiftKey
   * + global
   * @param from - The event to copy data from.
   * @param to - The event to copy data into.
   */
  copyMouseData(t, e) {
    t instanceof I && e instanceof I && (e.altKey = t.altKey, e.button = t.button, e.buttons = t.buttons, e.client.copyFrom(t.client), e.ctrlKey = t.ctrlKey, e.metaKey = t.metaKey, e.movement.copyFrom(t.movement), e.screen.copyFrom(t.screen), e.shiftKey = t.shiftKey, e.global.copyFrom(t.global));
  }
  /**
   * Copies base {@link FederatedEvent} data from {@code from} into {@code to}.
   *
   * The following properties are copied:
   * + isTrusted
   * + srcElement
   * + timeStamp
   * + type
   * @param from - The event to copy data from.
   * @param to - The event to copy data into.
   */
  copyData(t, e) {
    e.isTrusted = t.isTrusted, e.srcElement = t.srcElement, e.timeStamp = performance.now(), e.type = t.type, e.detail = t.detail, e.view = t.view, e.which = t.which, e.layer.copyFrom(t.layer), e.page.copyFrom(t.page);
  }
  /**
   * @param id - The pointer ID.
   * @returns The tracking data stored for the given pointer. If no data exists, a blank
   *  state will be created.
   */
  trackingData(t) {
    return this.mappingState.trackingData[t] || (this.mappingState.trackingData[t] = {
      pressTargetsByButton: {},
      clicksByButton: {},
      overTarget: null
    }), this.mappingState.trackingData[t];
  }
  /**
   * Allocate a specific type of event from {@link EventBoundary#eventPool this.eventPool}.
   *
   * This allocation is constructor-agnostic, as long as it only takes one argument - this event
   * boundary.
   * @param constructor - The event's constructor.
   */
  allocateEvent(t) {
    this.eventPool.has(t) || this.eventPool.set(t, []);
    const e = this.eventPool.get(t).pop() || new t(this);
    return e.eventPhase = e.NONE, e.currentTarget = null, e.defaultPrevented = !1, e.path = null, e.target = null, e;
  }
  /**
   * Frees the event and puts it back into the event pool.
   *
   * It is illegal to reuse the event until it is allocated again, using `this.allocateEvent`.
   *
   * It is also advised that events not allocated from {@link EventBoundary#allocateEvent this.allocateEvent}
   * not be freed. This is because of the possibility that the same event is freed twice, which can cause
   * it to be allocated twice & result in overwriting.
   * @param event - The event to be freed.
   * @throws Error if the event is managed by another event boundary.
   */
  freeEvent(t) {
    if (t.manager !== this)
      throw new Error("It is illegal to free an event not managed by this EventBoundary!");
    const e = t.constructor;
    this.eventPool.has(e) || this.eventPool.set(e, []), this.eventPool.get(e).push(t);
  }
  /**
   * Similar to {@link EventEmitter.emit}, except it stops if the `propagationImmediatelyStopped` flag
   * is set on the event.
   * @param e - The event to call each listener with.
   * @param type - The event key.
   */
  _notifyListeners(t, e) {
    const n = t.currentTarget._events[e];
    if (n)
      if ("fn" in n)
        n.once && t.currentTarget.removeListener(e, n.fn, void 0, !0), n.fn.call(n.context, t);
      else
        for (let i = 0, o = n.length; i < o && !t.propagationImmediatelyStopped; i++)
          n[i].once && t.currentTarget.removeListener(e, n[i].fn, void 0, !0), n[i].fn.call(n[i].context, t);
  }
}
const mt = 1, gt = {
  touchstart: "pointerdown",
  touchend: "pointerup",
  touchendoutside: "pointerupoutside",
  touchmove: "pointermove",
  touchcancel: "pointercancel"
}, L = class O {
  /**
   * @param {Renderer} renderer
   */
  constructor(t) {
    this.supportsTouchEvents = "ontouchstart" in globalThis, this.supportsPointerEvents = !!globalThis.PointerEvent, this.domElement = null, this.resolution = 1, this.renderer = t, this.rootBoundary = new vt(null), f.init(this), this.autoPreventDefault = !0, this._eventsAdded = !1, this._rootPointerEvent = new m(null), this._rootWheelEvent = new T(null), this.cursorStyles = {
      default: "inherit",
      pointer: "pointer"
    }, this.features = new Proxy({ ...O.defaultEventFeatures }, {
      set: (e, n, i) => (n === "globalMove" && (this.rootBoundary.enableGlobalMoveEvents = i), e[n] = i, !0)
    }), this._onPointerDown = this._onPointerDown.bind(this), this._onPointerMove = this._onPointerMove.bind(this), this._onPointerUp = this._onPointerUp.bind(this), this._onPointerOverOut = this._onPointerOverOut.bind(this), this.onWheel = this.onWheel.bind(this);
  }
  /**
   * The default interaction mode for all display objects.
   * @see Container.eventMode
   * @type {EventMode}
   * @readonly
   * @since 7.2.0
   */
  static get defaultEventMode() {
    return this._defaultEventMode;
  }
  /**
   * Runner init called, view is available at this point.
   * @ignore
   */
  init(t) {
    const { canvas: e, resolution: n } = this.renderer;
    this.setTargetElement(e), this.resolution = n, O._defaultEventMode = t.eventMode ?? "passive", Object.assign(this.features, t.eventFeatures ?? {}), this.rootBoundary.enableGlobalMoveEvents = this.features.globalMove;
  }
  /**
   * Handle changing resolution.
   * @ignore
   */
  resolutionChange(t) {
    this.resolution = t;
  }
  /** Destroys all event listeners and detaches the renderer. */
  destroy() {
    this.setTargetElement(null), this.renderer = null, this._currentCursor = null;
  }
  /**
   * Sets the current cursor mode, handling any callbacks or CSS style changes.
   * @param mode - cursor mode, a key from the cursorStyles dictionary
   */
  setCursor(t) {
    t = t || "default";
    let e = !0;
    if (globalThis.OffscreenCanvas && this.domElement instanceof OffscreenCanvas && (e = !1), this._currentCursor === t)
      return;
    this._currentCursor = t;
    const n = this.cursorStyles[t];
    if (n)
      switch (typeof n) {
        case "string":
          e && (this.domElement.style.cursor = n);
          break;
        case "function":
          n(t);
          break;
        case "object":
          e && Object.assign(this.domElement.style, n);
          break;
      }
    else e && typeof t == "string" && !Object.prototype.hasOwnProperty.call(this.cursorStyles, t) && (this.domElement.style.cursor = t);
  }
  /**
   * The global pointer event.
   * Useful for getting the pointer position without listening to events.
   * @since 7.2.0
   */
  get pointer() {
    return this._rootPointerEvent;
  }
  /**
   * Event handler for pointer down events on {@link EventSystem#domElement this.domElement}.
   * @param nativeEvent - The native mouse/pointer/touch event.
   */
  _onPointerDown(t) {
    if (!this.features.click)
      return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
    const e = this._normalizeToPointerData(t);
    this.autoPreventDefault && e[0].isNormalized && (t.cancelable || !("cancelable" in t)) && t.preventDefault();
    for (let n = 0, i = e.length; n < i; n++) {
      const o = e[n], s = this._bootstrapEvent(this._rootPointerEvent, o);
      this.rootBoundary.mapEvent(s);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  /**
   * Event handler for pointer move events on on {@link EventSystem#domElement this.domElement}.
   * @param nativeEvent - The native mouse/pointer/touch events.
   */
  _onPointerMove(t) {
    if (!this.features.move)
      return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered, f.pointerMoved();
    const e = this._normalizeToPointerData(t);
    for (let n = 0, i = e.length; n < i; n++) {
      const o = this._bootstrapEvent(this._rootPointerEvent, e[n]);
      this.rootBoundary.mapEvent(o);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  /**
   * Event handler for pointer up events on {@link EventSystem#domElement this.domElement}.
   * @param nativeEvent - The native mouse/pointer/touch event.
   */
  _onPointerUp(t) {
    if (!this.features.click)
      return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
    let e = t.target;
    t.composedPath && t.composedPath().length > 0 && (e = t.composedPath()[0]);
    const n = e !== this.domElement ? "outside" : "", i = this._normalizeToPointerData(t);
    for (let o = 0, s = i.length; o < s; o++) {
      const r = this._bootstrapEvent(this._rootPointerEvent, i[o]);
      r.type += n, this.rootBoundary.mapEvent(r);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  /**
   * Event handler for pointer over & out events on {@link EventSystem#domElement this.domElement}.
   * @param nativeEvent - The native mouse/pointer/touch event.
   */
  _onPointerOverOut(t) {
    if (!this.features.click)
      return;
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
    const e = this._normalizeToPointerData(t);
    for (let n = 0, i = e.length; n < i; n++) {
      const o = this._bootstrapEvent(this._rootPointerEvent, e[n]);
      this.rootBoundary.mapEvent(o);
    }
    this.setCursor(this.rootBoundary.cursor);
  }
  /**
   * Passive handler for `wheel` events on {@link EventSystem.domElement this.domElement}.
   * @param nativeEvent - The native wheel event.
   */
  onWheel(t) {
    if (!this.features.wheel)
      return;
    const e = this.normalizeWheelEvent(t);
    this.rootBoundary.rootTarget = this.renderer.lastObjectRendered, this.rootBoundary.mapEvent(e);
  }
  /**
   * Sets the {@link EventSystem#domElement domElement} and binds event listeners.
   *
   * To deregister the current DOM element without setting a new one, pass {@code null}.
   * @param element - The new DOM element.
   */
  setTargetElement(t) {
    this._removeEvents(), this.domElement = t, f.domElement = t, this._addEvents();
  }
  /** Register event listeners on {@link Renderer#domElement this.domElement}. */
  _addEvents() {
    if (this._eventsAdded || !this.domElement)
      return;
    f.addTickerListener();
    const t = this.domElement.style;
    t && (globalThis.navigator.msPointerEnabled ? (t.msContentZooming = "none", t.msTouchAction = "none") : this.supportsPointerEvents && (t.touchAction = "none")), this.supportsPointerEvents ? (globalThis.document.addEventListener("pointermove", this._onPointerMove, !0), this.domElement.addEventListener("pointerdown", this._onPointerDown, !0), this.domElement.addEventListener("pointerleave", this._onPointerOverOut, !0), this.domElement.addEventListener("pointerover", this._onPointerOverOut, !0), globalThis.addEventListener("pointerup", this._onPointerUp, !0)) : (globalThis.document.addEventListener("mousemove", this._onPointerMove, !0), this.domElement.addEventListener("mousedown", this._onPointerDown, !0), this.domElement.addEventListener("mouseout", this._onPointerOverOut, !0), this.domElement.addEventListener("mouseover", this._onPointerOverOut, !0), globalThis.addEventListener("mouseup", this._onPointerUp, !0), this.supportsTouchEvents && (this.domElement.addEventListener("touchstart", this._onPointerDown, !0), this.domElement.addEventListener("touchend", this._onPointerUp, !0), this.domElement.addEventListener("touchmove", this._onPointerMove, !0))), this.domElement.addEventListener("wheel", this.onWheel, {
      passive: !0,
      capture: !0
    }), this._eventsAdded = !0;
  }
  /** Unregister event listeners on {@link EventSystem#domElement this.domElement}. */
  _removeEvents() {
    if (!this._eventsAdded || !this.domElement)
      return;
    f.removeTickerListener();
    const t = this.domElement.style;
    t && (globalThis.navigator.msPointerEnabled ? (t.msContentZooming = "", t.msTouchAction = "") : this.supportsPointerEvents && (t.touchAction = "")), this.supportsPointerEvents ? (globalThis.document.removeEventListener("pointermove", this._onPointerMove, !0), this.domElement.removeEventListener("pointerdown", this._onPointerDown, !0), this.domElement.removeEventListener("pointerleave", this._onPointerOverOut, !0), this.domElement.removeEventListener("pointerover", this._onPointerOverOut, !0), globalThis.removeEventListener("pointerup", this._onPointerUp, !0)) : (globalThis.document.removeEventListener("mousemove", this._onPointerMove, !0), this.domElement.removeEventListener("mousedown", this._onPointerDown, !0), this.domElement.removeEventListener("mouseout", this._onPointerOverOut, !0), this.domElement.removeEventListener("mouseover", this._onPointerOverOut, !0), globalThis.removeEventListener("mouseup", this._onPointerUp, !0), this.supportsTouchEvents && (this.domElement.removeEventListener("touchstart", this._onPointerDown, !0), this.domElement.removeEventListener("touchend", this._onPointerUp, !0), this.domElement.removeEventListener("touchmove", this._onPointerMove, !0))), this.domElement.removeEventListener("wheel", this.onWheel, !0), this.domElement = null, this._eventsAdded = !1;
  }
  /**
   * Maps x and y coords from a DOM object and maps them correctly to the PixiJS view. The
   * resulting value is stored in the point. This takes into account the fact that the DOM
   * element could be scaled and positioned anywhere on the screen.
   * @param  {PointData} point - the point that the result will be stored in
   * @param  {number} x - the x coord of the position to map
   * @param  {number} y - the y coord of the position to map
   */
  mapPositionToPoint(t, e, n) {
    const i = this.domElement.isConnected ? this.domElement.getBoundingClientRect() : {
      x: 0,
      y: 0,
      width: this.domElement.width,
      height: this.domElement.height,
      left: 0,
      top: 0
    }, o = 1 / this.resolution;
    t.x = (e - i.left) * (this.domElement.width / i.width) * o, t.y = (n - i.top) * (this.domElement.height / i.height) * o;
  }
  /**
   * Ensures that the original event object contains all data that a regular pointer event would have
   * @param event - The original event data from a touch or mouse event
   * @returns An array containing a single normalized pointer event, in the case of a pointer
   *  or mouse event, or a multiple normalized pointer events if there are multiple changed touches
   */
  _normalizeToPointerData(t) {
    const e = [];
    if (this.supportsTouchEvents && t instanceof TouchEvent)
      for (let n = 0, i = t.changedTouches.length; n < i; n++) {
        const o = t.changedTouches[n];
        typeof o.button > "u" && (o.button = 0), typeof o.buttons > "u" && (o.buttons = 1), typeof o.isPrimary > "u" && (o.isPrimary = t.touches.length === 1 && t.type === "touchstart"), typeof o.width > "u" && (o.width = o.radiusX || 1), typeof o.height > "u" && (o.height = o.radiusY || 1), typeof o.tiltX > "u" && (o.tiltX = 0), typeof o.tiltY > "u" && (o.tiltY = 0), typeof o.pointerType > "u" && (o.pointerType = "touch"), typeof o.pointerId > "u" && (o.pointerId = o.identifier || 0), typeof o.pressure > "u" && (o.pressure = o.force || 0.5), typeof o.twist > "u" && (o.twist = 0), typeof o.tangentialPressure > "u" && (o.tangentialPressure = 0), typeof o.layerX > "u" && (o.layerX = o.offsetX = o.clientX), typeof o.layerY > "u" && (o.layerY = o.offsetY = o.clientY), o.isNormalized = !0, o.type = t.type, e.push(o);
      }
    else if (!globalThis.MouseEvent || t instanceof MouseEvent && (!this.supportsPointerEvents || !(t instanceof globalThis.PointerEvent))) {
      const n = t;
      typeof n.isPrimary > "u" && (n.isPrimary = !0), typeof n.width > "u" && (n.width = 1), typeof n.height > "u" && (n.height = 1), typeof n.tiltX > "u" && (n.tiltX = 0), typeof n.tiltY > "u" && (n.tiltY = 0), typeof n.pointerType > "u" && (n.pointerType = "mouse"), typeof n.pointerId > "u" && (n.pointerId = mt), typeof n.pressure > "u" && (n.pressure = 0.5), typeof n.twist > "u" && (n.twist = 0), typeof n.tangentialPressure > "u" && (n.tangentialPressure = 0), n.isNormalized = !0, e.push(n);
    } else
      e.push(t);
    return e;
  }
  /**
   * Normalizes the native {@link https://w3c.github.io/uievents/#interface-wheelevent WheelEvent}.
   *
   * The returned {@link FederatedWheelEvent} is a shared instance. It will not persist across
   * multiple native wheel events.
   * @param nativeEvent - The native wheel event that occurred on the canvas.
   * @returns A federated wheel event.
   */
  normalizeWheelEvent(t) {
    const e = this._rootWheelEvent;
    return this._transferMouseData(e, t), e.deltaX = t.deltaX, e.deltaY = t.deltaY, e.deltaZ = t.deltaZ, e.deltaMode = t.deltaMode, this.mapPositionToPoint(e.screen, t.clientX, t.clientY), e.global.copyFrom(e.screen), e.offset.copyFrom(e.screen), e.nativeEvent = t, e.type = t.type, e;
  }
  /**
   * Normalizes the `nativeEvent` into a federateed {@link FederatedPointerEvent}.
   * @param event
   * @param nativeEvent
   */
  _bootstrapEvent(t, e) {
    return t.originalEvent = null, t.nativeEvent = e, t.pointerId = e.pointerId, t.width = e.width, t.height = e.height, t.isPrimary = e.isPrimary, t.pointerType = e.pointerType, t.pressure = e.pressure, t.tangentialPressure = e.tangentialPressure, t.tiltX = e.tiltX, t.tiltY = e.tiltY, t.twist = e.twist, this._transferMouseData(t, e), this.mapPositionToPoint(t.screen, e.clientX, e.clientY), t.global.copyFrom(t.screen), t.offset.copyFrom(t.screen), t.isTrusted = e.isTrusted, t.type === "pointerleave" && (t.type = "pointerout"), t.type.startsWith("mouse") && (t.type = t.type.replace("mouse", "pointer")), t.type.startsWith("touch") && (t.type = gt[t.type] || t.type), t;
  }
  /**
   * Transfers base & mouse event data from the {@code nativeEvent} to the federated event.
   * @param event
   * @param nativeEvent
   */
  _transferMouseData(t, e) {
    t.isTrusted = e.isTrusted, t.srcElement = e.srcElement, t.timeStamp = performance.now(), t.type = e.type, t.altKey = e.altKey, t.button = e.button, t.buttons = e.buttons, t.client.x = e.clientX, t.client.y = e.clientY, t.ctrlKey = e.ctrlKey, t.metaKey = e.metaKey, t.movement.x = e.movementX, t.movement.y = e.movementY, t.page.x = e.pageX, t.page.y = e.pageY, t.relatedTarget = null, t.shiftKey = e.shiftKey;
  }
};
L.extension = {
  name: "events",
  type: [
    w.WebGLSystem,
    w.CanvasSystem,
    w.WebGPUSystem
  ],
  priority: -1
};
L.defaultEventFeatures = {
  /** Enables pointer events associated with pointer movement. */
  move: !0,
  /** Enables global pointer move events. */
  globalMove: !0,
  /** Enables pointer events associated with clicking. */
  click: !0,
  /** Enables wheel events. */
  wheel: !0
};
let V = L;
const yt = {
  /**
   * Property-based event handler for the `click` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onclick = (event) => {
   *  //some function here that happens on click
   * }
   */
  onclick: null,
  /**
   * Property-based event handler for the `mousedown` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onmousedown = (event) => {
   *  //some function here that happens on mousedown
   * }
   */
  onmousedown: null,
  /**
   * Property-based event handler for the `mouseenter` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onmouseenter = (event) => {
   *  //some function here that happens on mouseenter
   * }
   */
  onmouseenter: null,
  /**
   * Property-based event handler for the `mouseleave` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onmouseleave = (event) => {
   *  //some function here that happens on mouseleave
   * }
   */
  onmouseleave: null,
  /**
   * Property-based event handler for the `mousemove` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onmousemove = (event) => {
   *  //some function here that happens on mousemove
   * }
   */
  onmousemove: null,
  /**
   * Property-based event handler for the `globalmousemove` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onglobalmousemove = (event) => {
   *  //some function here that happens on globalmousemove
   * }
   */
  onglobalmousemove: null,
  /**
   * Property-based event handler for the `mouseout` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onmouseout = (event) => {
   *  //some function here that happens on mouseout
   * }
   */
  onmouseout: null,
  /**
   * Property-based event handler for the `mouseover` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onmouseover = (event) => {
   *  //some function here that happens on mouseover
   * }
   */
  onmouseover: null,
  /**
   * Property-based event handler for the `mouseup` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onmouseup = (event) => {
   *  //some function here that happens on mouseup
   * }
   */
  onmouseup: null,
  /**
   * Property-based event handler for the `mouseupoutside` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onmouseupoutside = (event) => {
   *  //some function here that happens on mouseupoutside
   * }
   */
  onmouseupoutside: null,
  /**
   * Property-based event handler for the `pointercancel` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onpointercancel = (event) => {
   *  //some function here that happens on pointercancel
   * }
   */
  onpointercancel: null,
  /**
   * Property-based event handler for the `pointerdown` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onpointerdown = (event) => {
   *  //some function here that happens on pointerdown
   * }
   */
  onpointerdown: null,
  /**
   * Property-based event handler for the `pointerenter` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onpointerenter = (event) => {
   *  //some function here that happens on pointerenter
   * }
   */
  onpointerenter: null,
  /**
   * Property-based event handler for the `pointerleave` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onpointerleave = (event) => {
   *  //some function here that happens on pointerleave
   * }
   */
  onpointerleave: null,
  /**
   * Property-based event handler for the `pointermove` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onpointermove = (event) => {
   *  //some function here that happens on pointermove
   * }
   */
  onpointermove: null,
  /**
   * Property-based event handler for the `globalpointermove` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onglobalpointermove = (event) => {
   *  //some function here that happens on globalpointermove
   * }
   */
  onglobalpointermove: null,
  /**
   * Property-based event handler for the `pointerout` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onpointerout = (event) => {
   *  //some function here that happens on pointerout
   * }
   */
  onpointerout: null,
  /**
   * Property-based event handler for the `pointerover` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onpointerover = (event) => {
   *  //some function here that happens on pointerover
   * }
   */
  onpointerover: null,
  /**
   * Property-based event handler for the `pointertap` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onpointertap = (event) => {
   *  //some function here that happens on pointertap
   * }
   */
  onpointertap: null,
  /**
   * Property-based event handler for the `pointerup` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onpointerup = (event) => {
   *  //some function here that happens on pointerup
   * }
   */
  onpointerup: null,
  /**
   * Property-based event handler for the `pointerupoutside` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onpointerupoutside = (event) => {
   *  //some function here that happens on pointerupoutside
   * }
   */
  onpointerupoutside: null,
  /**
   * Property-based event handler for the `rightclick` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onrightclick = (event) => {
   *  //some function here that happens on rightclick
   * }
   */
  onrightclick: null,
  /**
   * Property-based event handler for the `rightdown` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onrightdown = (event) => {
   *  //some function here that happens on rightdown
   * }
   */
  onrightdown: null,
  /**
   * Property-based event handler for the `rightup` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onrightup = (event) => {
   *  //some function here that happens on rightup
   * }
   */
  onrightup: null,
  /**
   * Property-based event handler for the `rightupoutside` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onrightupoutside = (event) => {
   *  //some function here that happens on rightupoutside
   * }
   */
  onrightupoutside: null,
  /**
   * Property-based event handler for the `tap` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.ontap = (event) => {
   *  //some function here that happens on tap
   * }
   */
  ontap: null,
  /**
   * Property-based event handler for the `touchcancel` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.ontouchcancel = (event) => {
   *  //some function here that happens on touchcancel
   * }
   */
  ontouchcancel: null,
  /**
   * Property-based event handler for the `touchend` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.ontouchend = (event) => {
   *  //some function here that happens on touchend
   * }
   */
  ontouchend: null,
  /**
   * Property-based event handler for the `touchendoutside` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.ontouchendoutside = (event) => {
   *  //some function here that happens on touchendoutside
   * }
   */
  ontouchendoutside: null,
  /**
   * Property-based event handler for the `touchmove` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.ontouchmove = (event) => {
   *  //some function here that happens on touchmove
   * }
   */
  ontouchmove: null,
  /**
   * Property-based event handler for the `globaltouchmove` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onglobaltouchmove = (event) => {
   *  //some function here that happens on globaltouchmove
   * }
   */
  onglobaltouchmove: null,
  /**
   * Property-based event handler for the `touchstart` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.ontouchstart = (event) => {
   *  //some function here that happens on touchstart
   * }
   */
  ontouchstart: null,
  /**
   * Property-based event handler for the `wheel` event.
   * @memberof scene.Container#
   * @default null
   * @example
   * this.onwheel = (event) => {
   *  //some function here that happens on wheel
   * }
   */
  onwheel: null,
  /**
   * Enable interaction events for the Container. Touch, pointer and mouse
   * @memberof scene.Container#
   */
  get interactive() {
    return this.eventMode === "dynamic" || this.eventMode === "static";
  },
  set interactive(a) {
    this.eventMode = a ? "static" : "passive";
  },
  /**
   * @ignore
   */
  _internalEventMode: void 0,
  /**
   * Enable interaction events for the Container. Touch, pointer and mouse.
   * There are 5 types of interaction settings:
   * - `'none'`: Ignores all interaction events, even on its children.
   * - `'passive'`: **(default)** Does not emit events and ignores all hit testing on itself and non-interactive children.
   * Interactive children will still emit events.
   * - `'auto'`: Does not emit events but is hit tested if parent is interactive. Same as `interactive = false` in v7
   * - `'static'`: Emit events and is hit tested. Same as `interaction = true` in v7
   * - `'dynamic'`: Emits events and is hit tested but will also receive mock interaction events fired from a ticker to
   * allow for interaction when the mouse isn't moving
   * @example
   * import { Sprite } from 'pixi.js';
   *
   * const sprite = new Sprite(texture);
   * sprite.eventMode = 'static';
   * sprite.on('tap', (event) => {
   *     // Handle event
   * });
   * @memberof scene.Container#
   * @since 7.2.0
   */
  get eventMode() {
    return this._internalEventMode ?? V.defaultEventMode;
  },
  set eventMode(a) {
    this._internalEventMode = a;
  },
  /**
   * Determines if the container is interactive or not
   * @returns {boolean} Whether the container is interactive or not
   * @memberof scene.Container#
   * @since 7.2.0
   * @example
   * import { Sprite } from 'pixi.js';
   *
   * const sprite = new Sprite(texture);
   * sprite.eventMode = 'static';
   * sprite.isInteractive(); // true
   *
   * sprite.eventMode = 'dynamic';
   * sprite.isInteractive(); // true
   *
   * sprite.eventMode = 'none';
   * sprite.isInteractive(); // false
   *
   * sprite.eventMode = 'passive';
   * sprite.isInteractive(); // false
   *
   * sprite.eventMode = 'auto';
   * sprite.isInteractive(); // false
   */
  isInteractive() {
    return this.eventMode === "static" || this.eventMode === "dynamic";
  },
  /**
   * Determines if the children to the container can be clicked/touched
   * Setting this to false allows PixiJS to bypass a recursive `hitTest` function
   * @memberof scene.Container#
   */
  interactiveChildren: !0,
  /**
   * Interaction shape. Children will be hit first, then this shape will be checked.
   * Setting this will cause this shape to be checked in hit tests rather than the container's bounds.
   * @example
   * import { Rectangle, Sprite } from 'pixi.js';
   *
   * const sprite = new Sprite(texture);
   * sprite.interactive = true;
   * sprite.hitArea = new Rectangle(0, 0, 100, 100);
   * @member {IHitArea}
   * @memberof scene.Container#
   */
  hitArea: null,
  /**
   * Unlike `on` or `addListener` which are methods from EventEmitter, `addEventListener`
   * seeks to be compatible with the DOM's `addEventListener` with support for options.
   * @memberof scene.Container
   * @param type - The type of event to listen to.
   * @param listener - The listener callback or object.
   * @param options - Listener options, used for capture phase.
   * @example
   * // Tell the user whether they did a single, double, triple, or nth click.
   * button.addEventListener('click', {
   *     handleEvent(e): {
   *         let prefix;
   *
   *         switch (e.detail) {
   *             case 1: prefix = 'single'; break;
   *             case 2: prefix = 'double'; break;
   *             case 3: prefix = 'triple'; break;
   *             default: prefix = e.detail + 'th'; break;
   *         }
   *
   *         console.log('That was a ' + prefix + 'click');
   *     }
   * });
   *
   * // But skip the first click!
   * button.parent.addEventListener('click', function blockClickOnce(e) {
   *     e.stopImmediatePropagation();
   *     button.parent.removeEventListener('click', blockClickOnce, true);
   * }, {
   *     capture: true,
   * });
   */
  addEventListener(a, t, e) {
    const n = typeof e == "boolean" && e || typeof e == "object" && e.capture, i = typeof e == "object" ? e.signal : void 0, o = typeof e == "object" ? e.once === !0 : !1, s = typeof t == "function" ? void 0 : t;
    a = n ? `${a}capture` : a;
    const r = typeof t == "function" ? t : t.handleEvent, c = this;
    i && i.addEventListener("abort", () => {
      c.off(a, r, s);
    }), o ? c.once(a, r, s) : c.on(a, r, s);
  },
  /**
   * Unlike `off` or `removeListener` which are methods from EventEmitter, `removeEventListener`
   * seeks to be compatible with the DOM's `removeEventListener` with support for options.
   * @memberof scene.Container
   * @param type - The type of event the listener is bound to.
   * @param listener - The listener callback or object.
   * @param options - The original listener options. This is required to deregister a capture phase listener.
   */
  removeEventListener(a, t, e) {
    const n = typeof e == "boolean" && e || typeof e == "object" && e.capture, i = typeof t == "function" ? void 0 : t;
    a = n ? `${a}capture` : a, t = typeof t == "function" ? t : t.handleEvent, this.off(a, t, i);
  },
  /**
   * Dispatch the event on this {@link Container} using the event's {@link EventBoundary}.
   *
   * The target of the event is set to `this` and the `defaultPrevented` flag is cleared before dispatch.
   * @memberof scene.Container
   * @param e - The event to dispatch.
   * @returns Whether the {@link FederatedEvent.preventDefault preventDefault}() method was not invoked.
   * @example
   * // Reuse a click event!
   * button.dispatchEvent(clickEvent);
   */
  dispatchEvent(a) {
    if (!(a instanceof M))
      throw new Error("Container cannot propagate events outside of the Federated Events API");
    return a.defaultPrevented = !1, a.path = null, a.target = this, a.manager.dispatchEvent(a), !a.defaultPrevented;
  }
};
z.add(Z);
q.mixin(pt);
z.add(V);
q.mixin(yt);
