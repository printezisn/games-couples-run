"use strict";const u=require("./index-BsF6_GBc.cjs");require("./webworkerAll-DQbc7pxG-CZGf8vIX.cjs");class P{constructor(t){this.bubbles=!0,this.cancelBubble=!0,this.cancelable=!1,this.composed=!1,this.defaultPrevented=!1,this.eventPhase=P.prototype.NONE,this.propagationStopped=!1,this.propagationImmediatelyStopped=!1,this.layer=new u.At,this.page=new u.At,this.NONE=0,this.CAPTURING_PHASE=1,this.AT_TARGET=2,this.BUBBLING_PHASE=3,this.manager=t}get layerX(){return this.layer.x}get layerY(){return this.layer.y}get pageX(){return this.page.x}get pageY(){return this.page.y}get data(){return this}composedPath(){return this.manager&&(!this.path||this.path[this.path.length-1]!==this.target)&&(this.path=this.target?this.manager.propagationPath(this.target):[]),this.path}initEvent(t,e,n){throw new Error("initEvent() is a legacy DOM API. It is not implemented in the Federated Events API.")}initUIEvent(t,e,n,i,o){throw new Error("initUIEvent() is a legacy DOM API. It is not implemented in the Federated Events API.")}preventDefault(){this.nativeEvent instanceof Event&&this.nativeEvent.cancelable&&this.nativeEvent.preventDefault(),this.defaultPrevented=!0}stopImmediatePropagation(){this.propagationImmediatelyStopped=!0}stopPropagation(){this.propagationStopped=!0}}var D=/iPhone/i,O=/iPod/i,L=/iPad/i,B=/\biOS-universal(?:.+)Mac\b/i,I=/\bAndroid(?:.+)Mobile\b/i,C=/Android/i,b=/(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i,w=/Silk/i,y=/Windows Phone/i,S=/\bWindows(?:.+)ARM\b/i,U=/BlackBerry/i,F=/BB10/i,X=/Opera Mini/i,Y=/\b(CriOS|Chrome)(?:.+)Mobile/i,$=/Mobile(?:.+)Firefox\b/i,R=function(a){return typeof a<"u"&&a.platform==="MacIntel"&&typeof a.maxTouchPoints=="number"&&a.maxTouchPoints>1&&typeof MSStream>"u"};function j(a){return function(t){return t.test(a)}}function G(a){var t={userAgent:"",platform:"",maxTouchPoints:0};!a&&typeof navigator<"u"?t={userAgent:navigator.userAgent,platform:navigator.platform,maxTouchPoints:navigator.maxTouchPoints||0}:typeof a=="string"?t.userAgent=a:a&&a.userAgent&&(t={userAgent:a.userAgent,platform:a.platform,maxTouchPoints:a.maxTouchPoints||0});var e=t.userAgent,n=e.split("[FBAN");typeof n[1]<"u"&&(e=n[0]),n=e.split("Twitter"),typeof n[1]<"u"&&(e=n[0]);var i=j(e),o={apple:{phone:i(D)&&!i(y),ipod:i(O),tablet:!i(D)&&(i(L)||R(t))&&!i(y),universal:i(B),device:(i(D)||i(O)||i(L)||i(B)||R(t))&&!i(y)},amazon:{phone:i(b),tablet:!i(b)&&i(w),device:i(b)||i(w)},android:{phone:!i(y)&&i(b)||!i(y)&&i(I),tablet:!i(y)&&!i(b)&&!i(I)&&(i(w)||i(C)),device:!i(y)&&(i(b)||i(w)||i(I)||i(C))||i(/\bokhttp\b/i)},windows:{phone:i(y),tablet:i(S),device:i(y)||i(S)},other:{blackberry:i(U),blackberry10:i(F),opera:i(X),firefox:i($),chrome:i(Y),device:i(U)||i(F)||i(X)||i($)||i(Y)},any:!1,phone:!1,tablet:!1};return o.any=o.apple.device||o.android.device||o.windows.device||o.other.device,o.phone=o.apple.phone||o.android.phone||o.windows.phone,o.tablet=o.apple.tablet||o.android.tablet||o.windows.tablet,o}const z=G.default??G,q=z(globalThis.navigator),Z=9,M=100,V=0,J=0,H=2,W=1,Q=-1e3,tt=-1e3,et=2;class K{constructor(t,e=q){this._mobileInfo=e,this.debug=!1,this._isActive=!1,this._isMobileAccessibility=!1,this._pool=[],this._renderId=0,this._children=[],this._androidUpdateCount=0,this._androidUpdateFrequency=500,this._hookDiv=null,(e.tablet||e.phone)&&this._createTouchHook();const n=document.createElement("div");n.style.width=`${M}px`,n.style.height=`${M}px`,n.style.position="absolute",n.style.top=`${V}px`,n.style.left=`${J}px`,n.style.zIndex=H.toString(),this._div=n,this._renderer=t,this._onKeyDown=this._onKeyDown.bind(this),this._onMouseMove=this._onMouseMove.bind(this),globalThis.addEventListener("keydown",this._onKeyDown,!1)}get isActive(){return this._isActive}get isMobileAccessibility(){return this._isMobileAccessibility}get hookDiv(){return this._hookDiv}_createTouchHook(){const t=document.createElement("button");t.style.width=`${W}px`,t.style.height=`${W}px`,t.style.position="absolute",t.style.top=`${Q}px`,t.style.left=`${tt}px`,t.style.zIndex=et.toString(),t.style.backgroundColor="#FF0000",t.title="select to enable accessibility for this content",t.addEventListener("focus",()=>{this._isMobileAccessibility=!0,this._activate(),this._destroyTouchHook()}),document.body.appendChild(t),this._hookDiv=t}_destroyTouchHook(){this._hookDiv&&(document.body.removeChild(this._hookDiv),this._hookDiv=null)}_activate(){var t;this._isActive||(this._isActive=!0,globalThis.document.addEventListener("mousemove",this._onMouseMove,!0),globalThis.removeEventListener("keydown",this._onKeyDown,!1),this._renderer.runners.postrender.add(this),(t=this._renderer.view.canvas.parentNode)==null||t.appendChild(this._div))}_deactivate(){var t;!this._isActive||this._isMobileAccessibility||(this._isActive=!1,globalThis.document.removeEventListener("mousemove",this._onMouseMove,!0),globalThis.addEventListener("keydown",this._onKeyDown,!1),this._renderer.runners.postrender.remove(this),(t=this._div.parentNode)==null||t.removeChild(this._div))}_updateAccessibleObjects(t){if(!t.visible||!t.accessibleChildren)return;t.accessible&&t.isInteractive()&&(t._accessibleActive||this._addChild(t),t._renderId=this._renderId);const e=t.children;if(e)for(let n=0;n<e.length;n++)this._updateAccessibleObjects(e[n])}init(t){this.debug=(t==null?void 0:t.debug)??this.debug,this._renderer.runners.postrender.remove(this)}postrender(){const t=performance.now();if(this._mobileInfo.android.device&&t<this._androidUpdateCount||(this._androidUpdateCount=t+this._androidUpdateFrequency,!this._renderer.renderingToScreen||!this._renderer.view.canvas))return;this._renderer.lastObjectRendered&&this._updateAccessibleObjects(this._renderer.lastObjectRendered);const{x:e,y:n,width:i,height:o}=this._renderer.view.canvas.getBoundingClientRect(),{width:s,height:r,resolution:p}=this._renderer,d=i/s*p,v=o/r*p;let l=this._div;l.style.left=`${e}px`,l.style.top=`${n}px`,l.style.width=`${s}px`,l.style.height=`${r}px`;for(let c=0;c<this._children.length;c++){const h=this._children[c];if(h._renderId!==this._renderId)h._accessibleActive=!1,u.mu(this._children,c,1),this._div.removeChild(h._accessibleDiv),this._pool.push(h._accessibleDiv),h._accessibleDiv=null,c--;else{l=h._accessibleDiv;let m=h.hitArea;const f=h.worldTransform;h.hitArea?(l.style.left=`${(f.tx+m.x*f.a)*d}px`,l.style.top=`${(f.ty+m.y*f.d)*v}px`,l.style.width=`${m.width*f.a*d}px`,l.style.height=`${m.height*f.d*v}px`):(m=h.getBounds().rectangle,this._capHitArea(m),l.style.left=`${m.x*d}px`,l.style.top=`${m.y*v}px`,l.style.width=`${m.width*d}px`,l.style.height=`${m.height*v}px`,l.title!==h.accessibleTitle&&h.accessibleTitle!==null&&(l.title=h.accessibleTitle||""),l.getAttribute("aria-label")!==h.accessibleHint&&h.accessibleHint!==null&&l.setAttribute("aria-label",h.accessibleHint||"")),(h.accessibleTitle!==l.title||h.tabIndex!==l.tabIndex)&&(l.title=h.accessibleTitle||"",l.tabIndex=h.tabIndex,this.debug&&this._updateDebugHTML(l))}}this._renderId++}_updateDebugHTML(t){t.innerHTML=`type: ${t.type}</br> title : ${t.title}</br> tabIndex: ${t.tabIndex}`}_capHitArea(t){t.x<0&&(t.width+=t.x,t.x=0),t.y<0&&(t.height+=t.y,t.y=0);const{width:e,height:n}=this._renderer;t.x+t.width>e&&(t.width=e-t.x),t.y+t.height>n&&(t.height=n-t.y)}_addChild(t){let e=this._pool.pop();e||(e=document.createElement("button"),e.style.width=`${M}px`,e.style.height=`${M}px`,e.style.backgroundColor=this.debug?"rgba(255,255,255,0.5)":"transparent",e.style.position="absolute",e.style.zIndex=H.toString(),e.style.borderStyle="none",navigator.userAgent.toLowerCase().includes("chrome")?e.setAttribute("aria-live","off"):e.setAttribute("aria-live","polite"),navigator.userAgent.match(/rv:.*Gecko\//)?e.setAttribute("aria-relevant","additions"):e.setAttribute("aria-relevant","text"),e.addEventListener("click",this._onClick.bind(this)),e.addEventListener("focus",this._onFocus.bind(this)),e.addEventListener("focusout",this._onFocusOut.bind(this))),e.style.pointerEvents=t.accessiblePointerEvents,e.type=t.accessibleType,t.accessibleTitle&&t.accessibleTitle!==null?e.title=t.accessibleTitle:(!t.accessibleHint||t.accessibleHint===null)&&(e.title=`container ${t.tabIndex}`),t.accessibleHint&&t.accessibleHint!==null&&e.setAttribute("aria-label",t.accessibleHint),this.debug&&this._updateDebugHTML(e),t._accessibleActive=!0,t._accessibleDiv=e,e.container=t,this._children.push(t),this._div.appendChild(t._accessibleDiv),t._accessibleDiv.tabIndex=t.tabIndex}_dispatchEvent(t,e){const{container:n}=t.target,i=this._renderer.events.rootBoundary,o=Object.assign(new P(i),{target:n});i.rootTarget=this._renderer.lastObjectRendered,e.forEach(s=>i.dispatchEvent(o,s))}_onClick(t){this._dispatchEvent(t,["click","pointertap","tap"])}_onFocus(t){t.target.getAttribute("aria-live")||t.target.setAttribute("aria-live","assertive"),this._dispatchEvent(t,["mouseover"])}_onFocusOut(t){t.target.getAttribute("aria-live")||t.target.setAttribute("aria-live","polite"),this._dispatchEvent(t,["mouseout"])}_onKeyDown(t){t.keyCode===Z&&this._activate()}_onMouseMove(t){t.movementX===0&&t.movementY===0||this._deactivate()}destroy(){this._destroyTouchHook(),this._div=null,globalThis.document.removeEventListener("mousemove",this._onMouseMove,!0),globalThis.removeEventListener("keydown",this._onKeyDown),this._pool=null,this._children=null,this._renderer=null}}K.extension={type:[u.D.WebGLSystem,u.D.WebGPUSystem],name:"accessibility"};const nt={accessible:!1,accessibleTitle:null,accessibleHint:null,tabIndex:0,_accessibleActive:!1,_accessibleDiv:null,accessibleType:"button",accessiblePointerEvents:"auto",accessibleChildren:!0,_renderId:-1};class it{constructor(){this.interactionFrequency=10,this._deltaTime=0,this._didMove=!1,this._tickerAdded=!1,this._pauseUpdate=!0}init(t){this.removeTickerListener(),this.events=t,this.interactionFrequency=10,this._deltaTime=0,this._didMove=!1,this._tickerAdded=!1,this._pauseUpdate=!0}get pauseUpdate(){return this._pauseUpdate}set pauseUpdate(t){this._pauseUpdate=t}addTickerListener(){this._tickerAdded||!this.domElement||(u.we.system.add(this._tickerUpdate,this,u.dr.INTERACTION),this._tickerAdded=!0)}removeTickerListener(){this._tickerAdded&&(u.we.system.remove(this._tickerUpdate,this),this._tickerAdded=!1)}pointerMoved(){this._didMove=!0}_update(){if(!this.domElement||this._pauseUpdate)return;if(this._didMove){this._didMove=!1;return}const t=this.events._rootPointerEvent;this.events.supportsTouchEvents&&t.pointerType==="touch"||globalThis.document.dispatchEvent(new PointerEvent("pointermove",{clientX:t.clientX,clientY:t.clientY,pointerType:t.pointerType,pointerId:t.pointerId}))}_tickerUpdate(t){this._deltaTime+=t.deltaTime,!(this._deltaTime<this.interactionFrequency)&&(this._deltaTime=0,this._update())}}const E=new it;class A extends P{constructor(){super(...arguments),this.client=new u.At,this.movement=new u.At,this.offset=new u.At,this.global=new u.At,this.screen=new u.At}get clientX(){return this.client.x}get clientY(){return this.client.y}get x(){return this.clientX}get y(){return this.clientY}get movementX(){return this.movement.x}get movementY(){return this.movement.y}get offsetX(){return this.offset.x}get offsetY(){return this.offset.y}get globalX(){return this.global.x}get globalY(){return this.global.y}get screenX(){return this.screen.x}get screenY(){return this.screen.y}getLocalPosition(t,e,n){return t.worldTransform.applyInverse(n||this.global,e)}getModifierState(t){return"getModifierState"in this.nativeEvent&&this.nativeEvent.getModifierState(t)}initMouseEvent(t,e,n,i,o,s,r,p,d,v,l,c,h,m,f){throw new Error("Method not implemented.")}}class g extends A{constructor(){super(...arguments),this.width=0,this.height=0,this.isPrimary=!1}getCoalescedEvents(){return this.type==="pointermove"||this.type==="mousemove"||this.type==="touchmove"?[this]:[]}getPredictedEvents(){throw new Error("getPredictedEvents is not supported!")}}class _ extends A{constructor(){super(...arguments),this.DOM_DELTA_PIXEL=0,this.DOM_DELTA_LINE=1,this.DOM_DELTA_PAGE=2}}_.DOM_DELTA_PIXEL=0;_.DOM_DELTA_LINE=1;_.DOM_DELTA_PAGE=2;const ot=2048,st=new u.At,T=new u.At;class rt{constructor(t){this.dispatch=new u.Tt,this.moveOnAll=!1,this.enableGlobalMoveEvents=!0,this.mappingState={trackingData:{}},this.eventPool=new Map,this._allInteractiveElements=[],this._hitElements=[],this._isPointerMoveEvent=!1,this.rootTarget=t,this.hitPruneFn=this.hitPruneFn.bind(this),this.hitTestFn=this.hitTestFn.bind(this),this.mapPointerDown=this.mapPointerDown.bind(this),this.mapPointerMove=this.mapPointerMove.bind(this),this.mapPointerOut=this.mapPointerOut.bind(this),this.mapPointerOver=this.mapPointerOver.bind(this),this.mapPointerUp=this.mapPointerUp.bind(this),this.mapPointerUpOutside=this.mapPointerUpOutside.bind(this),this.mapWheel=this.mapWheel.bind(this),this.mappingTable={},this.addEventMapping("pointerdown",this.mapPointerDown),this.addEventMapping("pointermove",this.mapPointerMove),this.addEventMapping("pointerout",this.mapPointerOut),this.addEventMapping("pointerleave",this.mapPointerOut),this.addEventMapping("pointerover",this.mapPointerOver),this.addEventMapping("pointerup",this.mapPointerUp),this.addEventMapping("pointerupoutside",this.mapPointerUpOutside),this.addEventMapping("wheel",this.mapWheel)}addEventMapping(t,e){this.mappingTable[t]||(this.mappingTable[t]=[]),this.mappingTable[t].push({fn:e,priority:0}),this.mappingTable[t].sort((n,i)=>n.priority-i.priority)}dispatchEvent(t,e){t.propagationStopped=!1,t.propagationImmediatelyStopped=!1,this.propagate(t,e),this.dispatch.emit(e||t.type,t)}mapEvent(t){if(!this.rootTarget)return;const e=this.mappingTable[t.type];if(e)for(let n=0,i=e.length;n<i;n++)e[n].fn(t);else u.ct(`[EventBoundary]: Event mapping not defined for ${t.type}`)}hitTest(t,e){E.pauseUpdate=!0;const n=this._isPointerMoveEvent&&this.enableGlobalMoveEvents?"hitTestMoveRecursive":"hitTestRecursive",i=this[n](this.rootTarget,this.rootTarget.eventMode,st.set(t,e),this.hitTestFn,this.hitPruneFn);return i&&i[0]}propagate(t,e){if(!t.target)return;const n=t.composedPath();t.eventPhase=t.CAPTURING_PHASE;for(let i=0,o=n.length-1;i<o;i++)if(t.currentTarget=n[i],this.notifyTarget(t,e),t.propagationStopped||t.propagationImmediatelyStopped)return;if(t.eventPhase=t.AT_TARGET,t.currentTarget=t.target,this.notifyTarget(t,e),!(t.propagationStopped||t.propagationImmediatelyStopped)){t.eventPhase=t.BUBBLING_PHASE;for(let i=n.length-2;i>=0;i--)if(t.currentTarget=n[i],this.notifyTarget(t,e),t.propagationStopped||t.propagationImmediatelyStopped)return}}all(t,e,n=this._allInteractiveElements){if(n.length===0)return;t.eventPhase=t.BUBBLING_PHASE;const i=Array.isArray(e)?e:[e];for(let o=n.length-1;o>=0;o--)i.forEach(s=>{t.currentTarget=n[o],this.notifyTarget(t,s)})}propagationPath(t){const e=[t];for(let n=0;n<ot&&t!==this.rootTarget&&t.parent;n++){if(!t.parent)throw new Error("Cannot find propagation path to disconnected target");e.push(t.parent),t=t.parent}return e.reverse(),e}hitTestMoveRecursive(t,e,n,i,o,s=!1){let r=!1;if(this._interactivePrune(t))return null;if((t.eventMode==="dynamic"||e==="dynamic")&&(E.pauseUpdate=!1),t.interactiveChildren&&t.children){const v=t.children;for(let l=v.length-1;l>=0;l--){const c=v[l],h=this.hitTestMoveRecursive(c,this._isInteractive(e)?e:c.eventMode,n,i,o,s||o(t,n));if(h){if(h.length>0&&!h[h.length-1].parent)continue;const m=t.isInteractive();(h.length>0||m)&&(m&&this._allInteractiveElements.push(t),h.push(t)),this._hitElements.length===0&&(this._hitElements=h),r=!0}}}const p=this._isInteractive(e),d=t.isInteractive();return d&&d&&this._allInteractiveElements.push(t),s||this._hitElements.length>0?null:r?this._hitElements:p&&!o(t,n)&&i(t,n)?d?[t]:[]:null}hitTestRecursive(t,e,n,i,o){if(this._interactivePrune(t)||o(t,n))return null;if((t.eventMode==="dynamic"||e==="dynamic")&&(E.pauseUpdate=!1),t.interactiveChildren&&t.children){const p=t.children,d=n;for(let v=p.length-1;v>=0;v--){const l=p[v],c=this.hitTestRecursive(l,this._isInteractive(e)?e:l.eventMode,d,i,o);if(c){if(c.length>0&&!c[c.length-1].parent)continue;const h=t.isInteractive();return(c.length>0||h)&&c.push(t),c}}}const s=this._isInteractive(e),r=t.isInteractive();return s&&i(t,n)?r?[t]:[]:null}_isInteractive(t){return t==="static"||t==="dynamic"}_interactivePrune(t){return!t||!t.visible||!t.renderable||!t.includeInBuild||!t.measurable||t.eventMode==="none"||t.eventMode==="passive"&&!t.interactiveChildren}hitPruneFn(t,e){if(t.hitArea&&(t.worldTransform.applyInverse(e,T),!t.hitArea.contains(T.x,T.y)))return!0;if(t.effects&&t.effects.length)for(let n=0;n<t.effects.length;n++){const i=t.effects[n];if(i.containsPoint&&!i.containsPoint(e,this.hitTestFn))return!0}return!1}hitTestFn(t,e){return t.hitArea?!0:t!=null&&t.containsPoint?(t.worldTransform.applyInverse(e,T),t.containsPoint(T)):!1}notifyTarget(t,e){var n,i;if(!t.currentTarget.isInteractive())return;e=e??t.type;const o=`on${e}`;(i=(n=t.currentTarget)[o])==null||i.call(n,t);const s=t.eventPhase===t.CAPTURING_PHASE||t.eventPhase===t.AT_TARGET?`${e}capture`:e;this._notifyListeners(t,s),t.eventPhase===t.AT_TARGET&&this._notifyListeners(t,e)}mapPointerDown(t){if(!(t instanceof g)){u.ct("EventBoundary cannot map a non-pointer event as a pointer event");return}const e=this.createPointerEvent(t);if(this.dispatchEvent(e,"pointerdown"),e.pointerType==="touch")this.dispatchEvent(e,"touchstart");else if(e.pointerType==="mouse"||e.pointerType==="pen"){const i=e.button===2;this.dispatchEvent(e,i?"rightdown":"mousedown")}const n=this.trackingData(t.pointerId);n.pressTargetsByButton[t.button]=e.composedPath(),this.freeEvent(e)}mapPointerMove(t){var e,n;if(!(t instanceof g)){u.ct("EventBoundary cannot map a non-pointer event as a pointer event");return}this._allInteractiveElements.length=0,this._hitElements.length=0,this._isPointerMoveEvent=!0;const i=this.createPointerEvent(t);this._isPointerMoveEvent=!1;const o=i.pointerType==="mouse"||i.pointerType==="pen",s=this.trackingData(t.pointerId),r=this.findMountedTarget(s.overTargets);if(((e=s.overTargets)==null?void 0:e.length)>0&&r!==i.target){const v=t.type==="mousemove"?"mouseout":"pointerout",l=this.createPointerEvent(t,v,r);if(this.dispatchEvent(l,"pointerout"),o&&this.dispatchEvent(l,"mouseout"),!i.composedPath().includes(r)){const c=this.createPointerEvent(t,"pointerleave",r);for(c.eventPhase=c.AT_TARGET;c.target&&!i.composedPath().includes(c.target);)c.currentTarget=c.target,this.notifyTarget(c),o&&this.notifyTarget(c,"mouseleave"),c.target=c.target.parent;this.freeEvent(c)}this.freeEvent(l)}if(r!==i.target){const v=t.type==="mousemove"?"mouseover":"pointerover",l=this.clonePointerEvent(i,v);this.dispatchEvent(l,"pointerover"),o&&this.dispatchEvent(l,"mouseover");let c=r==null?void 0:r.parent;for(;c&&c!==this.rootTarget.parent&&c!==i.target;)c=c.parent;if(!c||c===this.rootTarget.parent){const h=this.clonePointerEvent(i,"pointerenter");for(h.eventPhase=h.AT_TARGET;h.target&&h.target!==r&&h.target!==this.rootTarget.parent;)h.currentTarget=h.target,this.notifyTarget(h),o&&this.notifyTarget(h,"mouseenter"),h.target=h.target.parent;this.freeEvent(h)}this.freeEvent(l)}const p=[],d=this.enableGlobalMoveEvents??!0;this.moveOnAll?p.push("pointermove"):this.dispatchEvent(i,"pointermove"),d&&p.push("globalpointermove"),i.pointerType==="touch"&&(this.moveOnAll?p.splice(1,0,"touchmove"):this.dispatchEvent(i,"touchmove"),d&&p.push("globaltouchmove")),o&&(this.moveOnAll?p.splice(1,0,"mousemove"):this.dispatchEvent(i,"mousemove"),d&&p.push("globalmousemove"),this.cursor=(n=i.target)==null?void 0:n.cursor),p.length>0&&this.all(i,p),this._allInteractiveElements.length=0,this._hitElements.length=0,s.overTargets=i.composedPath(),this.freeEvent(i)}mapPointerOver(t){var e;if(!(t instanceof g)){u.ct("EventBoundary cannot map a non-pointer event as a pointer event");return}const n=this.trackingData(t.pointerId),i=this.createPointerEvent(t),o=i.pointerType==="mouse"||i.pointerType==="pen";this.dispatchEvent(i,"pointerover"),o&&this.dispatchEvent(i,"mouseover"),i.pointerType==="mouse"&&(this.cursor=(e=i.target)==null?void 0:e.cursor);const s=this.clonePointerEvent(i,"pointerenter");for(s.eventPhase=s.AT_TARGET;s.target&&s.target!==this.rootTarget.parent;)s.currentTarget=s.target,this.notifyTarget(s),o&&this.notifyTarget(s,"mouseenter"),s.target=s.target.parent;n.overTargets=i.composedPath(),this.freeEvent(i),this.freeEvent(s)}mapPointerOut(t){if(!(t instanceof g)){u.ct("EventBoundary cannot map a non-pointer event as a pointer event");return}const e=this.trackingData(t.pointerId);if(e.overTargets){const n=t.pointerType==="mouse"||t.pointerType==="pen",i=this.findMountedTarget(e.overTargets),o=this.createPointerEvent(t,"pointerout",i);this.dispatchEvent(o),n&&this.dispatchEvent(o,"mouseout");const s=this.createPointerEvent(t,"pointerleave",i);for(s.eventPhase=s.AT_TARGET;s.target&&s.target!==this.rootTarget.parent;)s.currentTarget=s.target,this.notifyTarget(s),n&&this.notifyTarget(s,"mouseleave"),s.target=s.target.parent;e.overTargets=null,this.freeEvent(o),this.freeEvent(s)}this.cursor=null}mapPointerUp(t){if(!(t instanceof g)){u.ct("EventBoundary cannot map a non-pointer event as a pointer event");return}const e=performance.now(),n=this.createPointerEvent(t);if(this.dispatchEvent(n,"pointerup"),n.pointerType==="touch")this.dispatchEvent(n,"touchend");else if(n.pointerType==="mouse"||n.pointerType==="pen"){const r=n.button===2;this.dispatchEvent(n,r?"rightup":"mouseup")}const i=this.trackingData(t.pointerId),o=this.findMountedTarget(i.pressTargetsByButton[t.button]);let s=o;if(o&&!n.composedPath().includes(o)){let r=o;for(;r&&!n.composedPath().includes(r);){if(n.currentTarget=r,this.notifyTarget(n,"pointerupoutside"),n.pointerType==="touch")this.notifyTarget(n,"touchendoutside");else if(n.pointerType==="mouse"||n.pointerType==="pen"){const p=n.button===2;this.notifyTarget(n,p?"rightupoutside":"mouseupoutside")}r=r.parent}delete i.pressTargetsByButton[t.button],s=r}if(s){const r=this.clonePointerEvent(n,"click");r.target=s,r.path=null,i.clicksByButton[t.button]||(i.clicksByButton[t.button]={clickCount:0,target:r.target,timeStamp:e});const p=i.clicksByButton[t.button];if(p.target===r.target&&e-p.timeStamp<200?++p.clickCount:p.clickCount=1,p.target=r.target,p.timeStamp=e,r.detail=p.clickCount,r.pointerType==="mouse"){const d=r.button===2;this.dispatchEvent(r,d?"rightclick":"click")}else r.pointerType==="touch"&&this.dispatchEvent(r,"tap");this.dispatchEvent(r,"pointertap"),this.freeEvent(r)}this.freeEvent(n)}mapPointerUpOutside(t){if(!(t instanceof g)){u.ct("EventBoundary cannot map a non-pointer event as a pointer event");return}const e=this.trackingData(t.pointerId),n=this.findMountedTarget(e.pressTargetsByButton[t.button]),i=this.createPointerEvent(t);if(n){let o=n;for(;o;)i.currentTarget=o,this.notifyTarget(i,"pointerupoutside"),i.pointerType==="touch"?this.notifyTarget(i,"touchendoutside"):(i.pointerType==="mouse"||i.pointerType==="pen")&&this.notifyTarget(i,i.button===2?"rightupoutside":"mouseupoutside"),o=o.parent;delete e.pressTargetsByButton[t.button]}this.freeEvent(i)}mapWheel(t){if(!(t instanceof _)){u.ct("EventBoundary cannot map a non-wheel event as a wheel event");return}const e=this.createWheelEvent(t);this.dispatchEvent(e),this.freeEvent(e)}findMountedTarget(t){if(!t)return null;let e=t[0];for(let n=1;n<t.length&&t[n].parent===e;n++)e=t[n];return e}createPointerEvent(t,e,n){const i=this.allocateEvent(g);return this.copyPointerData(t,i),this.copyMouseData(t,i),this.copyData(t,i),i.nativeEvent=t.nativeEvent,i.originalEvent=t,i.target=n??this.hitTest(i.global.x,i.global.y)??this._hitElements[0],typeof e=="string"&&(i.type=e),i}createWheelEvent(t){const e=this.allocateEvent(_);return this.copyWheelData(t,e),this.copyMouseData(t,e),this.copyData(t,e),e.nativeEvent=t.nativeEvent,e.originalEvent=t,e.target=this.hitTest(e.global.x,e.global.y),e}clonePointerEvent(t,e){const n=this.allocateEvent(g);return n.nativeEvent=t.nativeEvent,n.originalEvent=t.originalEvent,this.copyPointerData(t,n),this.copyMouseData(t,n),this.copyData(t,n),n.target=t.target,n.path=t.composedPath().slice(),n.type=e??n.type,n}copyWheelData(t,e){e.deltaMode=t.deltaMode,e.deltaX=t.deltaX,e.deltaY=t.deltaY,e.deltaZ=t.deltaZ}copyPointerData(t,e){t instanceof g&&e instanceof g&&(e.pointerId=t.pointerId,e.width=t.width,e.height=t.height,e.isPrimary=t.isPrimary,e.pointerType=t.pointerType,e.pressure=t.pressure,e.tangentialPressure=t.tangentialPressure,e.tiltX=t.tiltX,e.tiltY=t.tiltY,e.twist=t.twist)}copyMouseData(t,e){t instanceof A&&e instanceof A&&(e.altKey=t.altKey,e.button=t.button,e.buttons=t.buttons,e.client.copyFrom(t.client),e.ctrlKey=t.ctrlKey,e.metaKey=t.metaKey,e.movement.copyFrom(t.movement),e.screen.copyFrom(t.screen),e.shiftKey=t.shiftKey,e.global.copyFrom(t.global))}copyData(t,e){e.isTrusted=t.isTrusted,e.srcElement=t.srcElement,e.timeStamp=performance.now(),e.type=t.type,e.detail=t.detail,e.view=t.view,e.which=t.which,e.layer.copyFrom(t.layer),e.page.copyFrom(t.page)}trackingData(t){return this.mappingState.trackingData[t]||(this.mappingState.trackingData[t]={pressTargetsByButton:{},clicksByButton:{},overTarget:null}),this.mappingState.trackingData[t]}allocateEvent(t){this.eventPool.has(t)||this.eventPool.set(t,[]);const e=this.eventPool.get(t).pop()||new t(this);return e.eventPhase=e.NONE,e.currentTarget=null,e.defaultPrevented=!1,e.path=null,e.target=null,e}freeEvent(t){if(t.manager!==this)throw new Error("It is illegal to free an event not managed by this EventBoundary!");const e=t.constructor;this.eventPool.has(e)||this.eventPool.set(e,[]),this.eventPool.get(e).push(t)}_notifyListeners(t,e){const n=t.currentTarget._events[e];if(n)if("fn"in n)n.once&&t.currentTarget.removeListener(e,n.fn,void 0,!0),n.fn.call(n.context,t);else for(let i=0,o=n.length;i<o&&!t.propagationImmediatelyStopped;i++)n[i].once&&t.currentTarget.removeListener(e,n[i].fn,void 0,!0),n[i].fn.call(n[i].context,t)}}const at=1,ht={touchstart:"pointerdown",touchend:"pointerup",touchendoutside:"pointerupoutside",touchmove:"pointermove",touchcancel:"pointercancel"},k=class x{constructor(t){this.supportsTouchEvents="ontouchstart"in globalThis,this.supportsPointerEvents=!!globalThis.PointerEvent,this.domElement=null,this.resolution=1,this.renderer=t,this.rootBoundary=new rt(null),E.init(this),this.autoPreventDefault=!0,this._eventsAdded=!1,this._rootPointerEvent=new g(null),this._rootWheelEvent=new _(null),this.cursorStyles={default:"inherit",pointer:"pointer"},this.features=new Proxy({...x.defaultEventFeatures},{set:(e,n,i)=>(n==="globalMove"&&(this.rootBoundary.enableGlobalMoveEvents=i),e[n]=i,!0)}),this._onPointerDown=this._onPointerDown.bind(this),this._onPointerMove=this._onPointerMove.bind(this),this._onPointerUp=this._onPointerUp.bind(this),this._onPointerOverOut=this._onPointerOverOut.bind(this),this.onWheel=this.onWheel.bind(this)}static get defaultEventMode(){return this._defaultEventMode}init(t){const{canvas:e,resolution:n}=this.renderer;this.setTargetElement(e),this.resolution=n,x._defaultEventMode=t.eventMode??"passive",Object.assign(this.features,t.eventFeatures??{}),this.rootBoundary.enableGlobalMoveEvents=this.features.globalMove}resolutionChange(t){this.resolution=t}destroy(){this.setTargetElement(null),this.renderer=null,this._currentCursor=null}setCursor(t){t=t||"default";let e=!0;if(globalThis.OffscreenCanvas&&this.domElement instanceof OffscreenCanvas&&(e=!1),this._currentCursor===t)return;this._currentCursor=t;const n=this.cursorStyles[t];if(n)switch(typeof n){case"string":e&&(this.domElement.style.cursor=n);break;case"function":n(t);break;case"object":e&&Object.assign(this.domElement.style,n);break}else e&&typeof t=="string"&&!Object.prototype.hasOwnProperty.call(this.cursorStyles,t)&&(this.domElement.style.cursor=t)}get pointer(){return this._rootPointerEvent}_onPointerDown(t){if(!this.features.click)return;this.rootBoundary.rootTarget=this.renderer.lastObjectRendered;const e=this._normalizeToPointerData(t);this.autoPreventDefault&&e[0].isNormalized&&(t.cancelable||!("cancelable"in t))&&t.preventDefault();for(let n=0,i=e.length;n<i;n++){const o=e[n],s=this._bootstrapEvent(this._rootPointerEvent,o);this.rootBoundary.mapEvent(s)}this.setCursor(this.rootBoundary.cursor)}_onPointerMove(t){if(!this.features.move)return;this.rootBoundary.rootTarget=this.renderer.lastObjectRendered,E.pointerMoved();const e=this._normalizeToPointerData(t);for(let n=0,i=e.length;n<i;n++){const o=this._bootstrapEvent(this._rootPointerEvent,e[n]);this.rootBoundary.mapEvent(o)}this.setCursor(this.rootBoundary.cursor)}_onPointerUp(t){if(!this.features.click)return;this.rootBoundary.rootTarget=this.renderer.lastObjectRendered;let e=t.target;t.composedPath&&t.composedPath().length>0&&(e=t.composedPath()[0]);const n=e!==this.domElement?"outside":"",i=this._normalizeToPointerData(t);for(let o=0,s=i.length;o<s;o++){const r=this._bootstrapEvent(this._rootPointerEvent,i[o]);r.type+=n,this.rootBoundary.mapEvent(r)}this.setCursor(this.rootBoundary.cursor)}_onPointerOverOut(t){if(!this.features.click)return;this.rootBoundary.rootTarget=this.renderer.lastObjectRendered;const e=this._normalizeToPointerData(t);for(let n=0,i=e.length;n<i;n++){const o=this._bootstrapEvent(this._rootPointerEvent,e[n]);this.rootBoundary.mapEvent(o)}this.setCursor(this.rootBoundary.cursor)}onWheel(t){if(!this.features.wheel)return;const e=this.normalizeWheelEvent(t);this.rootBoundary.rootTarget=this.renderer.lastObjectRendered,this.rootBoundary.mapEvent(e)}setTargetElement(t){this._removeEvents(),this.domElement=t,E.domElement=t,this._addEvents()}_addEvents(){if(this._eventsAdded||!this.domElement)return;E.addTickerListener();const t=this.domElement.style;t&&(globalThis.navigator.msPointerEnabled?(t.msContentZooming="none",t.msTouchAction="none"):this.supportsPointerEvents&&(t.touchAction="none")),this.supportsPointerEvents?(globalThis.document.addEventListener("pointermove",this._onPointerMove,!0),this.domElement.addEventListener("pointerdown",this._onPointerDown,!0),this.domElement.addEventListener("pointerleave",this._onPointerOverOut,!0),this.domElement.addEventListener("pointerover",this._onPointerOverOut,!0),globalThis.addEventListener("pointerup",this._onPointerUp,!0)):(globalThis.document.addEventListener("mousemove",this._onPointerMove,!0),this.domElement.addEventListener("mousedown",this._onPointerDown,!0),this.domElement.addEventListener("mouseout",this._onPointerOverOut,!0),this.domElement.addEventListener("mouseover",this._onPointerOverOut,!0),globalThis.addEventListener("mouseup",this._onPointerUp,!0),this.supportsTouchEvents&&(this.domElement.addEventListener("touchstart",this._onPointerDown,!0),this.domElement.addEventListener("touchend",this._onPointerUp,!0),this.domElement.addEventListener("touchmove",this._onPointerMove,!0))),this.domElement.addEventListener("wheel",this.onWheel,{passive:!0,capture:!0}),this._eventsAdded=!0}_removeEvents(){if(!this._eventsAdded||!this.domElement)return;E.removeTickerListener();const t=this.domElement.style;t&&(globalThis.navigator.msPointerEnabled?(t.msContentZooming="",t.msTouchAction=""):this.supportsPointerEvents&&(t.touchAction="")),this.supportsPointerEvents?(globalThis.document.removeEventListener("pointermove",this._onPointerMove,!0),this.domElement.removeEventListener("pointerdown",this._onPointerDown,!0),this.domElement.removeEventListener("pointerleave",this._onPointerOverOut,!0),this.domElement.removeEventListener("pointerover",this._onPointerOverOut,!0),globalThis.removeEventListener("pointerup",this._onPointerUp,!0)):(globalThis.document.removeEventListener("mousemove",this._onPointerMove,!0),this.domElement.removeEventListener("mousedown",this._onPointerDown,!0),this.domElement.removeEventListener("mouseout",this._onPointerOverOut,!0),this.domElement.removeEventListener("mouseover",this._onPointerOverOut,!0),globalThis.removeEventListener("mouseup",this._onPointerUp,!0),this.supportsTouchEvents&&(this.domElement.removeEventListener("touchstart",this._onPointerDown,!0),this.domElement.removeEventListener("touchend",this._onPointerUp,!0),this.domElement.removeEventListener("touchmove",this._onPointerMove,!0))),this.domElement.removeEventListener("wheel",this.onWheel,!0),this.domElement=null,this._eventsAdded=!1}mapPositionToPoint(t,e,n){const i=this.domElement.isConnected?this.domElement.getBoundingClientRect():{x:0,y:0,width:this.domElement.width,height:this.domElement.height,left:0,top:0},o=1/this.resolution;t.x=(e-i.left)*(this.domElement.width/i.width)*o,t.y=(n-i.top)*(this.domElement.height/i.height)*o}_normalizeToPointerData(t){const e=[];if(this.supportsTouchEvents&&t instanceof TouchEvent)for(let n=0,i=t.changedTouches.length;n<i;n++){const o=t.changedTouches[n];typeof o.button>"u"&&(o.button=0),typeof o.buttons>"u"&&(o.buttons=1),typeof o.isPrimary>"u"&&(o.isPrimary=t.touches.length===1&&t.type==="touchstart"),typeof o.width>"u"&&(o.width=o.radiusX||1),typeof o.height>"u"&&(o.height=o.radiusY||1),typeof o.tiltX>"u"&&(o.tiltX=0),typeof o.tiltY>"u"&&(o.tiltY=0),typeof o.pointerType>"u"&&(o.pointerType="touch"),typeof o.pointerId>"u"&&(o.pointerId=o.identifier||0),typeof o.pressure>"u"&&(o.pressure=o.force||.5),typeof o.twist>"u"&&(o.twist=0),typeof o.tangentialPressure>"u"&&(o.tangentialPressure=0),typeof o.layerX>"u"&&(o.layerX=o.offsetX=o.clientX),typeof o.layerY>"u"&&(o.layerY=o.offsetY=o.clientY),o.isNormalized=!0,o.type=t.type,e.push(o)}else if(!globalThis.MouseEvent||t instanceof MouseEvent&&(!this.supportsPointerEvents||!(t instanceof globalThis.PointerEvent))){const n=t;typeof n.isPrimary>"u"&&(n.isPrimary=!0),typeof n.width>"u"&&(n.width=1),typeof n.height>"u"&&(n.height=1),typeof n.tiltX>"u"&&(n.tiltX=0),typeof n.tiltY>"u"&&(n.tiltY=0),typeof n.pointerType>"u"&&(n.pointerType="mouse"),typeof n.pointerId>"u"&&(n.pointerId=at),typeof n.pressure>"u"&&(n.pressure=.5),typeof n.twist>"u"&&(n.twist=0),typeof n.tangentialPressure>"u"&&(n.tangentialPressure=0),n.isNormalized=!0,e.push(n)}else e.push(t);return e}normalizeWheelEvent(t){const e=this._rootWheelEvent;return this._transferMouseData(e,t),e.deltaX=t.deltaX,e.deltaY=t.deltaY,e.deltaZ=t.deltaZ,e.deltaMode=t.deltaMode,this.mapPositionToPoint(e.screen,t.clientX,t.clientY),e.global.copyFrom(e.screen),e.offset.copyFrom(e.screen),e.nativeEvent=t,e.type=t.type,e}_bootstrapEvent(t,e){return t.originalEvent=null,t.nativeEvent=e,t.pointerId=e.pointerId,t.width=e.width,t.height=e.height,t.isPrimary=e.isPrimary,t.pointerType=e.pointerType,t.pressure=e.pressure,t.tangentialPressure=e.tangentialPressure,t.tiltX=e.tiltX,t.tiltY=e.tiltY,t.twist=e.twist,this._transferMouseData(t,e),this.mapPositionToPoint(t.screen,e.clientX,e.clientY),t.global.copyFrom(t.screen),t.offset.copyFrom(t.screen),t.isTrusted=e.isTrusted,t.type==="pointerleave"&&(t.type="pointerout"),t.type.startsWith("mouse")&&(t.type=t.type.replace("mouse","pointer")),t.type.startsWith("touch")&&(t.type=ht[t.type]||t.type),t}_transferMouseData(t,e){t.isTrusted=e.isTrusted,t.srcElement=e.srcElement,t.timeStamp=performance.now(),t.type=e.type,t.altKey=e.altKey,t.button=e.button,t.buttons=e.buttons,t.client.x=e.clientX,t.client.y=e.clientY,t.ctrlKey=e.ctrlKey,t.metaKey=e.metaKey,t.movement.x=e.movementX,t.movement.y=e.movementY,t.page.x=e.pageX,t.page.y=e.pageY,t.relatedTarget=null,t.shiftKey=e.shiftKey}};k.extension={name:"events",type:[u.D.WebGLSystem,u.D.CanvasSystem,u.D.WebGPUSystem],priority:-1};k.defaultEventFeatures={move:!0,globalMove:!0,click:!0,wheel:!0};let N=k;const lt={onclick:null,onmousedown:null,onmouseenter:null,onmouseleave:null,onmousemove:null,onglobalmousemove:null,onmouseout:null,onmouseover:null,onmouseup:null,onmouseupoutside:null,onpointercancel:null,onpointerdown:null,onpointerenter:null,onpointerleave:null,onpointermove:null,onglobalpointermove:null,onpointerout:null,onpointerover:null,onpointertap:null,onpointerup:null,onpointerupoutside:null,onrightclick:null,onrightdown:null,onrightup:null,onrightupoutside:null,ontap:null,ontouchcancel:null,ontouchend:null,ontouchendoutside:null,ontouchmove:null,onglobaltouchmove:null,ontouchstart:null,onwheel:null,get interactive(){return this.eventMode==="dynamic"||this.eventMode==="static"},set interactive(a){this.eventMode=a?"static":"passive"},_internalEventMode:void 0,get eventMode(){return this._internalEventMode??N.defaultEventMode},set eventMode(a){this._internalEventMode=a},isInteractive(){return this.eventMode==="static"||this.eventMode==="dynamic"},interactiveChildren:!0,hitArea:null,addEventListener(a,t,e){const n=typeof e=="boolean"&&e||typeof e=="object"&&e.capture,i=typeof e=="object"?e.signal:void 0,o=typeof e=="object"?e.once===!0:!1,s=typeof t=="function"?void 0:t;a=n?`${a}capture`:a;const r=typeof t=="function"?t:t.handleEvent,p=this;i&&i.addEventListener("abort",()=>{p.off(a,r,s)}),o?p.once(a,r,s):p.on(a,r,s)},removeEventListener(a,t,e){const n=typeof e=="boolean"&&e||typeof e=="object"&&e.capture,i=typeof t=="function"?void 0:t;a=n?`${a}capture`:a,t=typeof t=="function"?t:t.handleEvent,this.off(a,t,i)},dispatchEvent(a){if(!(a instanceof P))throw new Error("Container cannot propagate events outside of the Federated Events API");return a.defaultPrevented=!1,a.path=null,a.target=this,a.manager.dispatchEvent(a),!a.defaultPrevented}};u.Ct.add(K);u.It.mixin(nt);u.Ct.add(N);u.It.mixin(lt);