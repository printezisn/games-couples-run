import { D as l, C as O, aa as ee, a5 as p, I as C, x as We, a0 as te, Y as re, S as b, ab as Le, _ as F, a7 as B, p as ne, c as ae, ac as se, W as m, ad as Ve, ae as $e, H as v, A as je, z as Ne, a as ie, w as j, $ as qe, u as Ke, P as w, O as oe, af as Ye, b as de, ag as Je, U as N, ah as Xe, l as q, R as k, a8 as U, ai as Qe, a9 as M, T as Ze, aj as S, ak as ue, al as le, am as ce, an as K, ao as et } from "./index-BH5HnlAs.js";
import { w as he, k as Y, U as tt, v as rt } from "./colorToUniform-Cu0xVW3l-CksrxNKe.js";
const pe = class I extends We {
  /**
   * @param options - The optional parameters of this filter.
   */
  constructor(e) {
    e = { ...I.defaultOptions, ...e }, super(e), this.enabled = !0, this._state = he.for2d(), this.blendMode = e.blendMode, this.padding = e.padding, typeof e.antialias == "boolean" ? this.antialias = e.antialias ? "on" : "off" : this.antialias = e.antialias, this.resolution = e.resolution, this.blendRequired = e.blendRequired, this.clipToViewport = e.clipToViewport, this.addResource("uTexture", 0, 1);
  }
  /**
   * Applies the filter
   * @param filterManager - The renderer to retrieve the filter from
   * @param input - The input render target.
   * @param output - The target to output to.
   * @param clearMode - Should the output be cleared before rendering to it
   */
  apply(e, t, r, a) {
    e.applyFilter(this, t, r, a);
  }
  /**
   * Get the blend mode of the filter.
   * @default "normal"
   */
  get blendMode() {
    return this._state.blendMode;
  }
  /** Sets the blend mode of the filter. */
  set blendMode(e) {
    this._state.blendMode = e;
  }
  /**
   * A short hand function to create a filter based of a vertex and fragment shader src.
   * @param options
   * @returns A shiny new PixiJS filter!
   */
  static from(e) {
    const { gpu: t, gl: r, ...a } = e;
    let s, i;
    return t && (s = te.from(t)), r && (i = re.from(r)), new I({
      gpuProgram: s,
      glProgram: i,
      ...a
    });
  }
};
pe.defaultOptions = {
  blendMode: "normal",
  resolution: 1,
  padding: 0,
  antialias: "off",
  blendRequired: !1,
  clipToViewport: !0
};
let nt = pe;
var at = `in vec2 vMaskCoord;
in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform sampler2D uMaskTexture;

uniform float uAlpha;
uniform vec4 uMaskClamp;
uniform float uInverse;

out vec4 finalColor;

void main(void)
{
    float clip = step(3.5,
        step(uMaskClamp.x, vMaskCoord.x) +
        step(uMaskClamp.y, vMaskCoord.y) +
        step(vMaskCoord.x, uMaskClamp.z) +
        step(vMaskCoord.y, uMaskClamp.w));

    // TODO look into why this is needed
    float npmAlpha = uAlpha;
    vec4 original = texture(uTexture, vTextureCoord);
    vec4 masky = texture(uMaskTexture, vMaskCoord);
    float alphaMul = 1.0 - npmAlpha * (1.0 - masky.a);

    float a = alphaMul * masky.r * npmAlpha * clip;

    if (uInverse == 1.0) {
        a = 1.0 - a;
    }

    finalColor = original * a;
}
`, st = `in vec2 aPosition;

out vec2 vTextureCoord;
out vec2 vMaskCoord;


uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;
uniform mat3 uFilterMatrix;

vec4 filterVertexPosition(  vec2 aPosition )
{
    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
       
    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

vec2 filterTextureCoord(  vec2 aPosition )
{
    return aPosition * (uOutputFrame.zw * uInputSize.zw);
}

vec2 getFilterCoord( vec2 aPosition )
{
    return  ( uFilterMatrix * vec3( filterTextureCoord(aPosition), 1.0)  ).xy;
}   

void main(void)
{
    gl_Position = filterVertexPosition(aPosition);
    vTextureCoord = filterTextureCoord(aPosition);
    vMaskCoord = getFilterCoord(aPosition);
}
`, J = `struct GlobalFilterUniforms {
  uInputSize:vec4<f32>,
  uInputPixel:vec4<f32>,
  uInputClamp:vec4<f32>,
  uOutputFrame:vec4<f32>,
  uGlobalFrame:vec4<f32>,
  uOutputTexture:vec4<f32>,
};

struct MaskUniforms {
  uFilterMatrix:mat3x3<f32>,
  uMaskClamp:vec4<f32>,
  uAlpha:f32,
  uInverse:f32,
};

@group(0) @binding(0) var<uniform> gfu: GlobalFilterUniforms;
@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler : sampler;

@group(1) @binding(0) var<uniform> filterUniforms : MaskUniforms;
@group(1) @binding(1) var uMaskTexture: texture_2d<f32>;

struct VSOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv : vec2<f32>,
    @location(1) filterUv : vec2<f32>,
};

fn filterVertexPosition(aPosition:vec2<f32>) -> vec4<f32>
{
    var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;

    position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

fn filterTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
    return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);
}

fn globalTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
  return  (aPosition.xy / gfu.uGlobalFrame.zw) + (gfu.uGlobalFrame.xy / gfu.uGlobalFrame.zw);
}

fn getFilterCoord(aPosition:vec2<f32> ) -> vec2<f32>
{
  return ( filterUniforms.uFilterMatrix * vec3( filterTextureCoord(aPosition), 1.0)  ).xy;
}

fn getSize() -> vec2<f32>
{
  return gfu.uGlobalFrame.zw;
}

@vertex
fn mainVertex(
  @location(0) aPosition : vec2<f32>,
) -> VSOutput {
  return VSOutput(
   filterVertexPosition(aPosition),
   filterTextureCoord(aPosition),
   getFilterCoord(aPosition)
  );
}

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
  @location(1) filterUv: vec2<f32>,
  @builtin(position) position: vec4<f32>
) -> @location(0) vec4<f32> {

    var maskClamp = filterUniforms.uMaskClamp;
    var uAlpha = filterUniforms.uAlpha;

    var clip = step(3.5,
      step(maskClamp.x, filterUv.x) +
      step(maskClamp.y, filterUv.y) +
      step(filterUv.x, maskClamp.z) +
      step(filterUv.y, maskClamp.w));

    var mask = textureSample(uMaskTexture, uSampler, filterUv);
    var source = textureSample(uTexture, uSampler, uv);
    var alphaMul = 1.0 - uAlpha * (1.0 - mask.a);

    var a: f32 = alphaMul * mask.r * uAlpha * clip;

    if (filterUniforms.uInverse == 1.0) {
        a = 1.0 - a;
    }

    return source * a;
}
`;
class it extends nt {
  constructor(e) {
    const { sprite: t, ...r } = e, a = new et(t.texture), s = new ie({
      uFilterMatrix: { value: new v(), type: "mat3x3<f32>" },
      uMaskClamp: { value: a.uClampFrame, type: "vec4<f32>" },
      uAlpha: { value: 1, type: "f32" },
      uInverse: { value: e.inverse ? 1 : 0, type: "f32" }
    }), i = te.from({
      vertex: {
        source: J,
        entryPoint: "mainVertex"
      },
      fragment: {
        source: J,
        entryPoint: "mainFragment"
      }
    }), o = re.from({
      vertex: st,
      fragment: at,
      name: "mask-filter"
    });
    super({
      ...r,
      gpuProgram: i,
      glProgram: o,
      resources: {
        filterUniforms: s,
        uMaskTexture: t.texture.source
      }
    }), this.sprite = t, this._textureMatrix = a;
  }
  set inverse(e) {
    this.resources.filterUniforms.uniforms.uInverse = e ? 1 : 0;
  }
  get inverse() {
    return this.resources.filterUniforms.uniforms.uInverse === 1;
  }
  apply(e, t, r, a) {
    this._textureMatrix.texture = this.sprite.texture, e.calculateSpriteMatrix(
      this.resources.filterUniforms.uniforms.uFilterMatrix,
      this.sprite
    ).prepend(this._textureMatrix.mapCoord), this.resources.uMaskTexture = this.sprite.texture.source, e.applyFilter(this, t, r, a);
  }
}
const H = class fe {
  constructor(e, t) {
    var r, a;
    this.state = he.for2d(), this._batchersByInstructionSet = /* @__PURE__ */ Object.create(null), this._activeBatches = /* @__PURE__ */ Object.create(null), this.renderer = e, this._adaptor = t, (a = (r = this._adaptor).init) == null || a.call(r, this);
  }
  static getBatcher(e) {
    return new this._availableBatchers[e]();
  }
  buildStart(e) {
    let t = this._batchersByInstructionSet[e.uid];
    t || (t = this._batchersByInstructionSet[e.uid] = /* @__PURE__ */ Object.create(null), t.default || (t.default = new ee())), this._activeBatches = t, this._activeBatch = this._activeBatches.default;
    for (const r in this._activeBatches)
      this._activeBatches[r].begin();
  }
  addToBatch(e, t) {
    if (this._activeBatch.name !== e.batcherName) {
      this._activeBatch.break(t);
      let r = this._activeBatches[e.batcherName];
      r || (r = this._activeBatches[e.batcherName] = fe.getBatcher(e.batcherName), r.begin()), this._activeBatch = r;
    }
    this._activeBatch.add(e);
  }
  break(e) {
    this._activeBatch.break(e);
  }
  buildEnd(e) {
    this._activeBatch.break(e);
    const t = this._activeBatches;
    for (const r in t) {
      const a = t[r], s = a.geometry;
      s.indexBuffer.setDataWithSize(a.indexBuffer, a.indexSize, !0), s.buffers[0].setDataWithSize(a.attributeBuffer.float32View, a.attributeSize, !1);
    }
  }
  upload(e) {
    const t = this._batchersByInstructionSet[e.uid];
    for (const r in t) {
      const a = t[r], s = a.geometry;
      a.dirty && (a.dirty = !1, s.buffers[0].update(a.attributeSize * 4));
    }
  }
  execute(e) {
    if (e.action === "startBatch") {
      const t = e.batcher, r = t.geometry, a = t.shader;
      this._adaptor.start(this, r, a);
    }
    this._adaptor.execute(this, e);
  }
  destroy() {
    this.state = null, this.renderer = null, this._adaptor = null;
    for (const e in this._activeBatches)
      this._activeBatches[e].destroy();
    this._activeBatches = null;
  }
};
H.extension = {
  type: [
    l.WebGLPipes,
    l.WebGPUPipes,
    l.CanvasPipes
  ],
  name: "batch"
};
H._availableBatchers = /* @__PURE__ */ Object.create(null);
let me = H;
O.handleByMap(l.Batcher, me._availableBatchers);
O.add(ee);
const Ot = {
  name: "texture-bit",
  vertex: {
    header: (
      /* wgsl */
      `

        struct TextureUniforms {
            uTextureMatrix:mat3x3<f32>,
        }

        @group(2) @binding(2) var<uniform> textureUniforms : TextureUniforms;
        `
    ),
    main: (
      /* wgsl */
      `
            uv = (textureUniforms.uTextureMatrix * vec3(uv, 1.0)).xy;
        `
    )
  },
  fragment: {
    header: (
      /* wgsl */
      `
            @group(2) @binding(0) var uTexture: texture_2d<f32>;
            @group(2) @binding(1) var uSampler: sampler;

         
        `
    ),
    main: (
      /* wgsl */
      `
            outColor = textureSample(uTexture, uSampler, vUV);
        `
    )
  }
}, Ft = {
  name: "texture-bit",
  vertex: {
    header: (
      /* glsl */
      `
            uniform mat3 uTextureMatrix;
        `
    ),
    main: (
      /* glsl */
      `
            uv = (uTextureMatrix * vec3(uv, 1.0)).xy;
        `
    )
  },
  fragment: {
    header: (
      /* glsl */
      `
        uniform sampler2D uTexture;

         
        `
    ),
    main: (
      /* glsl */
      `
            outColor = texture(uTexture, vUV);
        `
    )
  }
};
function ot(n, e) {
  const t = n.root, r = n.instructionSet;
  r.reset();
  const a = e.renderPipes ? e : e.batch.renderer, s = a.renderPipes;
  s.batch.buildStart(r), s.blendMode.buildStart(), s.colorMask.buildStart(), t.sortableChildren && t.sortChildren(), ve(t, r, a, !0), s.batch.buildEnd(r), s.blendMode.buildEnd(r);
}
function G(n, e, t) {
  const r = t.renderPipes ? t : t.batch.renderer;
  n.globalDisplayStatus < 7 || !n.includeInBuild || (n.sortableChildren && n.sortChildren(), n.isSimple ? dt(n, e, r) : ve(n, e, r, !1));
}
function dt(n, e, t) {
  if (n.renderPipeId) {
    const r = n, { renderPipes: a, renderableGC: s } = t;
    a.blendMode.setBlendMode(r, n.groupBlendMode, e), a[r.renderPipeId].addRenderable(r, e), s.addRenderable(r, e), r.didViewUpdate = !1;
  }
  if (!n.renderGroup) {
    const r = n.children, a = r.length;
    for (let s = 0; s < a; s++)
      G(r[s], e, t);
  }
}
function ve(n, e, t, r) {
  const { renderPipes: a, renderableGC: s } = t;
  if (!r && n.renderGroup)
    a.renderGroup.addRenderGroup(n.renderGroup, e);
  else {
    for (let u = 0; u < n.effects.length; u++) {
      const c = n.effects[u];
      a[c.pipe].push(c, n, e);
    }
    const i = n, o = i.renderPipeId;
    o && (a.blendMode.setBlendMode(i, i.groupBlendMode, e), a[o].addRenderable(i, e), s.addRenderable(i, e), i.didViewUpdate = !1);
    const d = n.children;
    if (d.length)
      for (let u = 0; u < d.length; u++)
        G(d[u], e, t);
    for (let u = n.effects.length - 1; u >= 0; u--) {
      const c = n.effects[u];
      a[c.pipe].pop(c, n, e);
    }
  }
}
const ut = new de();
class lt extends se {
  constructor() {
    super(), this.filters = [new it({
      sprite: new Je(m.EMPTY),
      inverse: !1,
      resolution: "inherit",
      antialias: "inherit"
    })];
  }
  get sprite() {
    return this.filters[0].sprite;
  }
  set sprite(e) {
    this.filters[0].sprite = e;
  }
  get inverse() {
    return this.filters[0].inverse;
  }
  set inverse(e) {
    this.filters[0].inverse = e;
  }
}
class ge {
  constructor(e) {
    this._activeMaskStage = [], this._renderer = e;
  }
  push(e, t, r) {
    const a = this._renderer;
    if (a.renderPipes.batch.break(r), r.add({
      renderPipeId: "alphaMask",
      action: "pushMaskBegin",
      mask: e,
      inverse: t._maskOptions.inverse,
      canBundle: !1,
      maskedContainer: t
    }), e.inverse = t._maskOptions.inverse, e.renderMaskToTexture) {
      const s = e.mask;
      s.includeInBuild = !0, G(
        s,
        r,
        a
      ), s.includeInBuild = !1;
    }
    a.renderPipes.batch.break(r), r.add({
      renderPipeId: "alphaMask",
      action: "pushMaskEnd",
      mask: e,
      maskedContainer: t,
      inverse: t._maskOptions.inverse,
      canBundle: !1
    });
  }
  pop(e, t, r) {
    this._renderer.renderPipes.batch.break(r), r.add({
      renderPipeId: "alphaMask",
      action: "popMaskEnd",
      mask: e,
      inverse: t._maskOptions.inverse,
      canBundle: !1
    });
  }
  execute(e) {
    const t = this._renderer, r = e.mask.renderMaskToTexture;
    if (e.action === "pushMaskBegin") {
      const a = b.get(lt);
      if (a.inverse = e.inverse, r) {
        e.mask.mask.measurable = !0;
        const s = Le(e.mask.mask, !0, ut);
        e.mask.mask.measurable = !1, s.ceil();
        const i = t.renderTarget.renderTarget.colorTexture.source, o = Y.getOptimalTexture(
          s.width,
          s.height,
          i._resolution,
          i.antialias
        );
        t.renderTarget.push(o, !0), t.globalUniforms.push({
          offset: s,
          worldColor: 4294967295
        });
        const d = a.sprite;
        d.texture = o, d.worldTransform.tx = s.minX, d.worldTransform.ty = s.minY, this._activeMaskStage.push({
          filterEffect: a,
          maskedContainer: e.maskedContainer,
          filterTexture: o
        });
      } else
        a.sprite = e.mask.mask, this._activeMaskStage.push({
          filterEffect: a,
          maskedContainer: e.maskedContainer
        });
    } else if (e.action === "pushMaskEnd") {
      const a = this._activeMaskStage[this._activeMaskStage.length - 1];
      r && (t.type === F.WEBGL && t.renderTarget.finishRenderPass(), t.renderTarget.pop(), t.globalUniforms.pop()), t.filter.push({
        renderPipeId: "filter",
        action: "pushFilter",
        container: a.maskedContainer,
        filterEffect: a.filterEffect,
        canBundle: !1
      });
    } else if (e.action === "popMaskEnd") {
      t.filter.pop();
      const a = this._activeMaskStage.pop();
      r && Y.returnTexture(a.filterTexture), b.return(a.filterEffect);
    }
  }
  destroy() {
    this._renderer = null, this._activeMaskStage = null;
  }
}
ge.extension = {
  type: [
    l.WebGLPipes,
    l.WebGPUPipes,
    l.CanvasPipes
  ],
  name: "alphaMask"
};
class xe {
  constructor(e) {
    this._colorStack = [], this._colorStackIndex = 0, this._currentColor = 0, this._renderer = e;
  }
  buildStart() {
    this._colorStack[0] = 15, this._colorStackIndex = 1, this._currentColor = 15;
  }
  push(e, t, r) {
    this._renderer.renderPipes.batch.break(r);
    const a = this._colorStack;
    a[this._colorStackIndex] = a[this._colorStackIndex - 1] & e.mask;
    const s = this._colorStack[this._colorStackIndex];
    s !== this._currentColor && (this._currentColor = s, r.add({
      renderPipeId: "colorMask",
      colorMask: s,
      canBundle: !1
    })), this._colorStackIndex++;
  }
  pop(e, t, r) {
    this._renderer.renderPipes.batch.break(r);
    const a = this._colorStack;
    this._colorStackIndex--;
    const s = a[this._colorStackIndex - 1];
    s !== this._currentColor && (this._currentColor = s, r.add({
      renderPipeId: "colorMask",
      colorMask: s,
      canBundle: !1
    }));
  }
  execute(e) {
    this._renderer.colorMask.setMask(e.colorMask);
  }
  destroy() {
    this._colorStack = null;
  }
}
xe.extension = {
  type: [
    l.WebGLPipes,
    l.WebGPUPipes,
    l.CanvasPipes
  ],
  name: "colorMask"
};
class _e {
  constructor(e) {
    this._maskStackHash = {}, this._maskHash = /* @__PURE__ */ new WeakMap(), this._renderer = e;
  }
  push(e, t, r) {
    var a;
    const s = e, i = this._renderer;
    i.renderPipes.batch.break(r), i.renderPipes.blendMode.setBlendMode(s.mask, "none", r), r.add({
      renderPipeId: "stencilMask",
      action: "pushMaskBegin",
      mask: e,
      inverse: t._maskOptions.inverse,
      canBundle: !1
    });
    const o = s.mask;
    o.includeInBuild = !0, this._maskHash.has(s) || this._maskHash.set(s, {
      instructionsStart: 0,
      instructionsLength: 0
    });
    const d = this._maskHash.get(s);
    d.instructionsStart = r.instructionSize, G(
      o,
      r,
      i
    ), o.includeInBuild = !1, i.renderPipes.batch.break(r), r.add({
      renderPipeId: "stencilMask",
      action: "pushMaskEnd",
      mask: e,
      inverse: t._maskOptions.inverse,
      canBundle: !1
    });
    const u = r.instructionSize - d.instructionsStart - 1;
    d.instructionsLength = u;
    const c = i.renderTarget.renderTarget.uid;
    (a = this._maskStackHash)[c] ?? (a[c] = 0);
  }
  pop(e, t, r) {
    const a = e, s = this._renderer;
    s.renderPipes.batch.break(r), s.renderPipes.blendMode.setBlendMode(a.mask, "none", r), r.add({
      renderPipeId: "stencilMask",
      action: "popMaskBegin",
      inverse: t._maskOptions.inverse,
      canBundle: !1
    });
    const i = this._maskHash.get(e);
    for (let o = 0; o < i.instructionsLength; o++)
      r.instructions[r.instructionSize++] = r.instructions[i.instructionsStart++];
    r.add({
      renderPipeId: "stencilMask",
      action: "popMaskEnd",
      canBundle: !1
    });
  }
  execute(e) {
    var t;
    const r = this._renderer, a = r.renderTarget.renderTarget.uid;
    let s = (t = this._maskStackHash)[a] ?? (t[a] = 0);
    e.action === "pushMaskBegin" ? (r.renderTarget.ensureDepthStencil(), r.stencil.setStencilMode(p.RENDERING_MASK_ADD, s), s++, r.colorMask.setMask(0)) : e.action === "pushMaskEnd" ? (e.inverse ? r.stencil.setStencilMode(p.INVERSE_MASK_ACTIVE, s) : r.stencil.setStencilMode(p.MASK_ACTIVE, s), r.colorMask.setMask(15)) : e.action === "popMaskBegin" ? (r.colorMask.setMask(0), s !== 0 ? r.stencil.setStencilMode(p.RENDERING_MASK_REMOVE, s) : (r.renderTarget.clear(null, B.STENCIL), r.stencil.setStencilMode(p.DISABLED, s)), s--) : e.action === "popMaskEnd" && (e.inverse ? r.stencil.setStencilMode(p.INVERSE_MASK_ACTIVE, s) : r.stencil.setStencilMode(p.MASK_ACTIVE, s), r.colorMask.setMask(15)), this._maskStackHash[a] = s;
  }
  destroy() {
    this._renderer = null, this._maskStackHash = null, this._maskHash = null;
  }
}
_e.extension = {
  type: [
    l.WebGLPipes,
    l.WebGPUPipes,
    l.CanvasPipes
  ],
  name: "stencilMask"
};
function Ht(n, e) {
  for (const t in n.attributes) {
    const r = n.attributes[t], a = e[t];
    a ? (r.format ?? (r.format = a.format), r.offset ?? (r.offset = a.offset), r.instance ?? (r.instance = a.instance)) : ae(`Attribute ${t} is not present in the shader, but is present in the geometry. Unable to infer attribute details.`);
  }
  ct(n);
}
function ct(n) {
  const { buffers: e, attributes: t } = n, r = {}, a = {};
  for (const s in e) {
    const i = e[s];
    r[i.uid] = 0, a[i.uid] = 0;
  }
  for (const s in t) {
    const i = t[s];
    r[i.buffer.uid] += N(i.format).stride;
  }
  for (const s in t) {
    const i = t[s];
    i.stride ?? (i.stride = r[i.buffer.uid]), i.start ?? (i.start = a[i.buffer.uid]), a[i.buffer.uid] += N(i.format).stride;
  }
}
const x = [];
x[p.NONE] = void 0;
x[p.DISABLED] = {
  stencilWriteMask: 0,
  stencilReadMask: 0
};
x[p.RENDERING_MASK_ADD] = {
  stencilFront: {
    compare: "equal",
    passOp: "increment-clamp"
  },
  stencilBack: {
    compare: "equal",
    passOp: "increment-clamp"
  }
};
x[p.RENDERING_MASK_REMOVE] = {
  stencilFront: {
    compare: "equal",
    passOp: "decrement-clamp"
  },
  stencilBack: {
    compare: "equal",
    passOp: "decrement-clamp"
  }
};
x[p.MASK_ACTIVE] = {
  stencilWriteMask: 0,
  stencilFront: {
    compare: "equal",
    passOp: "keep"
  },
  stencilBack: {
    compare: "equal",
    passOp: "keep"
  }
};
x[p.INVERSE_MASK_ACTIVE] = {
  stencilWriteMask: 0,
  stencilFront: {
    compare: "not-equal",
    passOp: "replace"
  },
  stencilBack: {
    compare: "not-equal",
    passOp: "replace"
  }
};
class zt {
  constructor(e) {
    this._syncFunctionHash = /* @__PURE__ */ Object.create(null), this._adaptor = e, this._systemCheck();
  }
  /**
   * Overridable function by `pixi.js/unsafe-eval` to silence
   * throwing an error if platform doesn't support unsafe-evals.
   * @private
   */
  _systemCheck() {
    if (!Xe())
      throw new Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.");
  }
  ensureUniformGroup(e) {
    const t = this.getUniformGroupData(e);
    e.buffer || (e.buffer = new q({
      data: new Float32Array(t.layout.size / 4),
      usage: k.UNIFORM | k.COPY_DST
    }));
  }
  getUniformGroupData(e) {
    return this._syncFunctionHash[e._signature] || this._initUniformGroup(e);
  }
  _initUniformGroup(e) {
    const t = e._signature;
    let r = this._syncFunctionHash[t];
    if (!r) {
      const a = Object.keys(e.uniformStructures).map((o) => e.uniformStructures[o]), s = this._adaptor.createUboElements(a), i = this._generateUboSync(s.uboElements);
      r = this._syncFunctionHash[t] = {
        layout: s,
        syncFunction: i
      };
    }
    return this._syncFunctionHash[t];
  }
  _generateUboSync(e) {
    return this._adaptor.generateUboSync(e);
  }
  syncUniformGroup(e, t, r) {
    const a = this.getUniformGroupData(e);
    return e.buffer || (e.buffer = new q({
      data: new Float32Array(a.layout.size / 4),
      usage: k.UNIFORM | k.COPY_DST
    })), t || (t = e.buffer.data), r || (r = 0), a.syncFunction(e.uniforms, t, r), !0;
  }
  updateUniformGroup(e) {
    if (e.isStatic && !e._dirtyId)
      return !1;
    e._dirtyId = 0;
    const t = this.syncUniformGroup(e);
    return e.buffer.update(), t;
  }
  destroy() {
    this._syncFunctionHash = null;
  }
}
const T = [
  // uploading pixi matrix object to mat3
  {
    type: "mat3x3<f32>",
    test: (n) => n.value.a !== void 0,
    ubo: `
            var matrix = uv[name].toArray(true);
            data[offset] = matrix[0];
            data[offset + 1] = matrix[1];
            data[offset + 2] = matrix[2];
            data[offset + 4] = matrix[3];
            data[offset + 5] = matrix[4];
            data[offset + 6] = matrix[5];
            data[offset + 8] = matrix[6];
            data[offset + 9] = matrix[7];
            data[offset + 10] = matrix[8];
        `,
    uniform: `
            gl.uniformMatrix3fv(ud[name].location, false, uv[name].toArray(true));
        `
  },
  // uploading a pixi rectangle as a vec4
  {
    type: "vec4<f32>",
    test: (n) => n.type === "vec4<f32>" && n.size === 1 && n.value.width !== void 0,
    ubo: `
            v = uv[name];
            data[offset] = v.x;
            data[offset + 1] = v.y;
            data[offset + 2] = v.width;
            data[offset + 3] = v.height;
        `,
    uniform: `
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.width || cv[3] !== v.height) {
                cv[0] = v.x;
                cv[1] = v.y;
                cv[2] = v.width;
                cv[3] = v.height;
                gl.uniform4f(ud[name].location, v.x, v.y, v.width, v.height);
            }
        `
  },
  // uploading a pixi point as a vec2
  {
    type: "vec2<f32>",
    test: (n) => n.type === "vec2<f32>" && n.size === 1 && n.value.x !== void 0,
    ubo: `
            v = uv[name];
            data[offset] = v.x;
            data[offset + 1] = v.y;
        `,
    uniform: `
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.x || cv[1] !== v.y) {
                cv[0] = v.x;
                cv[1] = v.y;
                gl.uniform2f(ud[name].location, v.x, v.y);
            }
        `
  },
  // uploading a pixi color as a vec4
  {
    type: "vec4<f32>",
    test: (n) => n.type === "vec4<f32>" && n.size === 1 && n.value.red !== void 0,
    ubo: `
            v = uv[name];
            data[offset] = v.red;
            data[offset + 1] = v.green;
            data[offset + 2] = v.blue;
            data[offset + 3] = v.alpha;
        `,
    uniform: `
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue || cv[3] !== v.alpha) {
                cv[0] = v.red;
                cv[1] = v.green;
                cv[2] = v.blue;
                cv[3] = v.alpha;
                gl.uniform4f(ud[name].location, v.red, v.green, v.blue, v.alpha);
            }
        `
  },
  // uploading a pixi color as a vec3
  {
    type: "vec3<f32>",
    test: (n) => n.type === "vec3<f32>" && n.size === 1 && n.value.red !== void 0,
    ubo: `
            v = uv[name];
            data[offset] = v.red;
            data[offset + 1] = v.green;
            data[offset + 2] = v.blue;
        `,
    uniform: `
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue) {
                cv[0] = v.red;
                cv[1] = v.green;
                cv[2] = v.blue;
                gl.uniform3f(ud[name].location, v.red, v.green, v.blue);
            }
        `
  }
];
function Et(n, e, t, r) {
  const a = [`
        var v = null;
        var v2 = null;
        var t = 0;
        var index = 0;
        var name = null;
        var arrayOffset = null;
    `];
  let s = 0;
  for (let o = 0; o < n.length; o++) {
    const d = n[o], u = d.data.name;
    let c = !1, h = 0;
    for (let f = 0; f < T.length; f++)
      if (T[f].test(d.data)) {
        h = d.offset / 4, a.push(
          `name = "${u}";`,
          `offset += ${h - s};`,
          T[f][e] || T[f].ubo
        ), c = !0;
        break;
      }
    if (!c)
      if (d.data.size > 1)
        h = d.offset / 4, a.push(t(d, h - s));
      else {
        const f = r[d.data.type];
        h = d.offset / 4, a.push(
          /* wgsl */
          `
                    v = uv.${u};
                    offset += ${h - s};
                    ${f};
                `
        );
      }
    s = h;
  }
  const i = a.join(`
`);
  return new Function(
    "uv",
    "data",
    "offset",
    i
  );
}
function g(n, e) {
  return `
        for (let i = 0; i < ${n * e}; i++) {
            data[offset + (((i / ${n})|0) * 4) + (i % ${n})] = v[i];
        }
    `;
}
const ht = {
  f32: `
        data[offset] = v;`,
  i32: `
        data[offset] = v;`,
  "vec2<f32>": `
        data[offset] = v[0];
        data[offset + 1] = v[1];`,
  "vec3<f32>": `
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];`,
  "vec4<f32>": `
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 3] = v[3];`,
  "mat2x2<f32>": `
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 4] = v[2];
        data[offset + 5] = v[3];`,
  "mat3x3<f32>": `
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 4] = v[3];
        data[offset + 5] = v[4];
        data[offset + 6] = v[5];
        data[offset + 8] = v[6];
        data[offset + 9] = v[7];
        data[offset + 10] = v[8];`,
  "mat4x4<f32>": `
        for (let i = 0; i < 16; i++) {
            data[offset + i] = v[i];
        }`,
  "mat3x2<f32>": g(3, 2),
  "mat4x2<f32>": g(4, 2),
  "mat2x3<f32>": g(2, 3),
  "mat4x3<f32>": g(4, 3),
  "mat2x4<f32>": g(2, 4),
  "mat3x4<f32>": g(3, 4)
}, Dt = {
  ...ht,
  "mat2x2<f32>": `
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 3] = v[3];
    `
};
function pt(n, e, t, r, a, s) {
  const i = s ? 1 : -1;
  return n.identity(), n.a = 1 / r * 2, n.d = i * (1 / a * 2), n.tx = -1 - e * n.a, n.ty = -i - t * n.d, n;
}
const _ = /* @__PURE__ */ new Map();
function be(n, e) {
  if (!_.has(n)) {
    const t = new m({
      source: new U({
        resource: n,
        ...e
      })
    }), r = () => {
      _.get(n) === t && _.delete(n);
    };
    t.once("destroy", r), t.source.once("destroy", r), _.set(n, t);
  }
  return _.get(n);
}
function ft(n) {
  const e = n.colorTexture.source.resource;
  return globalThis.HTMLCanvasElement && e instanceof HTMLCanvasElement && document.body.contains(e);
}
const ye = class ke {
  /**
   * @param [descriptor] - Options for creating a render target.
   */
  constructor(e = {}) {
    if (this.uid = S("renderTarget"), this.colorTextures = [], this.dirtyId = 0, this.isRoot = !1, this._size = new Float32Array(2), this._managedColorTextures = !1, e = { ...ke.defaultOptions, ...e }, this.stencil = e.stencil, this.depth = e.depth, this.isRoot = e.isRoot, typeof e.colorTextures == "number") {
      this._managedColorTextures = !0;
      for (let t = 0; t < e.colorTextures; t++)
        this.colorTextures.push(
          new M({
            width: e.width,
            height: e.height,
            resolution: e.resolution,
            antialias: e.antialias
          })
        );
    } else {
      this.colorTextures = [...e.colorTextures.map((r) => r.source)];
      const t = this.colorTexture.source;
      this.resize(t.width, t.height, t._resolution);
    }
    this.colorTexture.source.on("resize", this.onSourceResize, this), (e.depthStencilTexture || this.stencil) && (e.depthStencilTexture instanceof m || e.depthStencilTexture instanceof M ? this.depthStencilTexture = e.depthStencilTexture.source : this.ensureDepthStencilTexture());
  }
  get size() {
    const e = this._size;
    return e[0] = this.pixelWidth, e[1] = this.pixelHeight, e;
  }
  get width() {
    return this.colorTexture.source.width;
  }
  get height() {
    return this.colorTexture.source.height;
  }
  get pixelWidth() {
    return this.colorTexture.source.pixelWidth;
  }
  get pixelHeight() {
    return this.colorTexture.source.pixelHeight;
  }
  get resolution() {
    return this.colorTexture.source._resolution;
  }
  get colorTexture() {
    return this.colorTextures[0];
  }
  onSourceResize(e) {
    this.resize(e.width, e.height, e._resolution, !0);
  }
  /**
   * This will ensure a depthStencil texture is created for this render target.
   * Most likely called by the mask system to make sure we have stencil buffer added.
   * @internal
   * @ignore
   */
  ensureDepthStencilTexture() {
    this.depthStencilTexture || (this.depthStencilTexture = new M({
      width: this.width,
      height: this.height,
      resolution: this.resolution,
      format: "depth24plus-stencil8",
      autoGenerateMipmaps: !1,
      antialias: !1,
      mipLevelCount: 1
      // sampleCount: handled by the render target system..
    }));
  }
  resize(e, t, r = this.resolution, a = !1) {
    this.dirtyId++, this.colorTextures.forEach((s, i) => {
      a && i === 0 || s.source.resize(e, t, r);
    }), this.depthStencilTexture && this.depthStencilTexture.source.resize(e, t, r);
  }
  destroy() {
    this.colorTexture.source.off("resize", this.onSourceResize, this), this._managedColorTextures && this.colorTextures.forEach((e) => {
      e.destroy();
    }), this.depthStencilTexture && (this.depthStencilTexture.destroy(), delete this.depthStencilTexture);
  }
};
ye.defaultOptions = {
  /** the width of the RenderTarget */
  width: 0,
  /** the height of the RenderTarget */
  height: 0,
  /** the resolution of the RenderTarget */
  resolution: 1,
  /** an array of textures, or a number indicating how many color textures there should be */
  colorTextures: 1,
  /** should this render target have a stencil buffer? */
  stencil: !1,
  /** should this render target have a depth buffer? */
  depth: !1,
  /** should this render target be antialiased? */
  antialias: !1,
  // save on perf by default!
  /** is this a root element, true if this is gl context owners render target */
  isRoot: !1
};
let A = ye;
class Wt {
  constructor(e) {
    this.rootViewPort = new w(), this.viewport = new w(), this.onRenderTargetChange = new Qe("onRenderTargetChange"), this.projectionMatrix = new v(), this.defaultClearColor = [0, 0, 0, 0], this._renderSurfaceToRenderTargetHash = /* @__PURE__ */ new Map(), this._gpuRenderTargetHash = /* @__PURE__ */ Object.create(null), this._renderTargetStack = [], this._renderer = e, e.renderableGC.addManagedHash(this, "_gpuRenderTargetHash");
  }
  /** called when dev wants to finish a render pass */
  finishRenderPass() {
    this.adaptor.finishRenderPass(this.renderTarget);
  }
  /**
   * called when the renderer starts to render a scene.
   * @param options
   * @param options.target - the render target to render to
   * @param options.clear - the clear mode to use. Can be true or a CLEAR number 'COLOR | DEPTH | STENCIL' 0b111
   * @param options.clearColor - the color to clear to
   * @param options.frame - the frame to render to
   */
  renderStart({
    target: e,
    clear: t,
    clearColor: r,
    frame: a
  }) {
    this._renderTargetStack.length = 0, this.push(
      e,
      t,
      r,
      a
    ), this.rootViewPort.copyFrom(this.viewport), this.rootRenderTarget = this.renderTarget, this.renderingToScreen = ft(this.rootRenderTarget);
  }
  postrender() {
    var e, t;
    (t = (e = this.adaptor).postrender) == null || t.call(e, this.rootRenderTarget);
  }
  /**
   * Binding a render surface! This is the main function of the render target system.
   * It will take the RenderSurface (which can be a texture, canvas, or render target) and bind it to the renderer.
   * Once bound all draw calls will be rendered to the render surface.
   *
   * If a frame is not provide and the render surface is a texture, the frame of the texture will be used.
   * @param renderSurface - the render surface to bind
   * @param clear - the clear mode to use. Can be true or a CLEAR number 'COLOR | DEPTH | STENCIL' 0b111
   * @param clearColor - the color to clear to
   * @param frame - the frame to render to
   * @returns the render target that was bound
   */
  bind(e, t = !0, r, a) {
    const s = this.getRenderTarget(e), i = this.renderTarget !== s;
    this.renderTarget = s, this.renderSurface = e;
    const o = this.getGpuRenderTarget(s);
    (s.pixelWidth !== o.width || s.pixelHeight !== o.height) && (this.adaptor.resizeGpuRenderTarget(s), o.width = s.pixelWidth, o.height = s.pixelHeight);
    const d = s.colorTexture, u = this.viewport, c = d.pixelWidth, h = d.pixelHeight;
    if (!a && e instanceof m && (a = e.frame), a) {
      const f = d._resolution;
      u.x = a.x * f + 0.5 | 0, u.y = a.y * f + 0.5 | 0, u.width = a.width * f + 0.5 | 0, u.height = a.height * f + 0.5 | 0;
    } else
      u.x = 0, u.y = 0, u.width = c, u.height = h;
    return pt(
      this.projectionMatrix,
      0,
      0,
      u.width / d.resolution,
      u.height / d.resolution,
      !s.isRoot
    ), this.adaptor.startRenderPass(s, t, r, u), i && this.onRenderTargetChange.emit(s), s;
  }
  clear(e, t = B.ALL, r) {
    t && (e && (e = this.getRenderTarget(e)), this.adaptor.clear(
      e || this.renderTarget,
      t,
      r,
      this.viewport
    ));
  }
  contextChange() {
    this._gpuRenderTargetHash = /* @__PURE__ */ Object.create(null);
  }
  /**
   * Push a render surface to the renderer. This will bind the render surface to the renderer,
   * @param renderSurface - the render surface to push
   * @param clear - the clear mode to use. Can be true or a CLEAR number 'COLOR | DEPTH | STENCIL' 0b111
   * @param clearColor - the color to clear to
   * @param frame - the frame to use when rendering to the render surface
   */
  push(e, t = B.ALL, r, a) {
    const s = this.bind(e, t, r, a);
    return this._renderTargetStack.push({
      renderTarget: s,
      frame: a
    }), s;
  }
  /** Pops the current render target from the renderer and restores the previous render target. */
  pop() {
    this._renderTargetStack.pop();
    const e = this._renderTargetStack[this._renderTargetStack.length - 1];
    this.bind(e.renderTarget, !1, null, e.frame);
  }
  /**
   * Gets the render target from the provide render surface. Eg if its a texture,
   * it will return the render target for the texture.
   * If its a render target, it will return the same render target.
   * @param renderSurface - the render surface to get the render target for
   * @returns the render target for the render surface
   */
  getRenderTarget(e) {
    return e.isTexture && (e = e.source), this._renderSurfaceToRenderTargetHash.get(e) ?? this._initRenderTarget(e);
  }
  /**
   * Copies a render surface to another texture
   * @param sourceRenderSurfaceTexture - the render surface to copy from
   * @param destinationTexture - the texture to copy to
   * @param originSrc - the origin of the copy
   * @param originSrc.x - the x origin of the copy
   * @param originSrc.y - the y origin of the copy
   * @param size - the size of the copy
   * @param size.width - the width of the copy
   * @param size.height - the height of the copy
   * @param originDest - the destination origin (top left to paste from!)
   * @param originDest.x - the x origin of the paste
   * @param originDest.y - the y origin of the paste
   */
  copyToTexture(e, t, r, a, s) {
    r.x < 0 && (a.width += r.x, s.x -= r.x, r.x = 0), r.y < 0 && (a.height += r.y, s.y -= r.y, r.y = 0);
    const { pixelWidth: i, pixelHeight: o } = e;
    return a.width = Math.min(a.width, i - r.x), a.height = Math.min(a.height, o - r.y), this.adaptor.copyToTexture(
      e,
      t,
      r,
      a,
      s
    );
  }
  /**
   * ensures that we have a depth stencil buffer available to render to
   * This is used by the mask system to make sure we have a stencil buffer.
   */
  ensureDepthStencil() {
    this.renderTarget.stencil || (this.renderTarget.stencil = !0, this.adaptor.startRenderPass(this.renderTarget, !1, null, this.viewport));
  }
  /** nukes the render target system */
  destroy() {
    this._renderer = null, this._renderSurfaceToRenderTargetHash.forEach((e, t) => {
      e !== t && e.destroy();
    }), this._renderSurfaceToRenderTargetHash.clear(), this._gpuRenderTargetHash = /* @__PURE__ */ Object.create(null);
  }
  _initRenderTarget(e) {
    let t = null;
    return U.test(e) && (e = be(e).source), e instanceof A ? t = e : e instanceof M && (t = new A({
      colorTextures: [e]
    }), U.test(e.source.resource) && (t.isRoot = !0), e.once("destroy", () => {
      t.destroy(), this._renderSurfaceToRenderTargetHash.delete(e);
      const r = this._gpuRenderTargetHash[t.uid];
      r && (this._gpuRenderTargetHash[t.uid] = null, this.adaptor.destroyGpuRenderTarget(r));
    })), this._renderSurfaceToRenderTargetHash.set(e, t), t;
  }
  getGpuRenderTarget(e) {
    return this._gpuRenderTargetHash[e.uid] || (this._gpuRenderTargetHash[e.uid] = this.adaptor.initGpuRenderTarget(e));
  }
}
class Lt extends Ze {
  /**
   * Create a new Buffer Resource.
   * @param options - The options for the buffer resource
   * @param options.buffer - The underlying buffer that this resource is using
   * @param options.offset - The offset of the buffer this resource is using.
   * If not provided, then it will use the offset of the buffer.
   * @param options.size - The size of the buffer this resource is using.
   * If not provided, then it will use the size of the buffer.
   */
  constructor({ buffer: e, offset: t, size: r }) {
    super(), this.uid = S("buffer"), this._resourceType = "bufferResource", this._touched = 0, this._resourceId = S("resource"), this._bufferResource = !0, this.destroyed = !1, this.buffer = e, this.offset = t | 0, this.size = r, this.buffer.on("change", this.onBufferChange, this);
  }
  onBufferChange() {
    this._resourceId = S("resource"), this.emit("change", this);
  }
  /**
   * Destroys this resource. Make sure the underlying buffer is not used anywhere else
   * if you want to destroy it as well, or code will explode
   * @param destroyBuffer - Should the underlying buffer be destroyed as well?
   */
  destroy(e = !1) {
    this.destroyed = !0, e && this.buffer.destroy(), this.emit("change", this), this.buffer = null;
  }
}
class Te {
  constructor(e) {
    this._renderer = e;
  }
  updateRenderable() {
  }
  destroyRenderable() {
  }
  validateRenderable() {
    return !1;
  }
  addRenderable(e, t) {
    this._renderer.renderPipes.batch.break(t), t.add(e);
  }
  execute(e) {
    e.isRenderable && e.render(this._renderer);
  }
  destroy() {
    this._renderer = null;
  }
}
Te.extension = {
  type: [
    l.WebGLPipes,
    l.WebGPUPipes,
    l.CanvasPipes
  ],
  name: "customRender"
};
function Me(n, e) {
  const t = n.instructionSet, r = t.instructions;
  for (let a = 0; a < t.instructionSize; a++) {
    const s = r[a];
    e[s.renderPipeId].execute(s);
  }
}
class Se {
  constructor(e) {
    this._renderer = e;
  }
  addRenderGroup(e, t) {
    this._renderer.renderPipes.batch.break(t), t.add(e);
  }
  execute(e) {
    e.isRenderable && (this._renderer.globalUniforms.push({
      worldTransformMatrix: e.worldTransform,
      worldColor: e.worldColorAlpha
    }), Me(e, this._renderer.renderPipes), this._renderer.globalUniforms.pop());
  }
  destroy() {
    this._renderer = null;
  }
}
Se.extension = {
  type: [
    l.WebGLPipes,
    l.WebGPUPipes,
    l.CanvasPipes
  ],
  name: "renderGroup"
};
function z(n, e) {
  e || (e = 0);
  for (let t = e; t < n.length && n[t]; t++)
    n[t] = null;
}
function Ce(n, e = []) {
  e.push(n);
  for (let t = 0; t < n.renderGroupChildren.length; t++)
    Ce(n.renderGroupChildren[t], e);
  return e;
}
function mt(n, e, t) {
  const r = n >> 16 & 255, a = n >> 8 & 255, s = n & 255, i = e >> 16 & 255, o = e >> 8 & 255, d = e & 255, u = r + (i - r) * t, c = a + (o - a) * t, h = s + (d - s) * t;
  return (u << 16) + (c << 8) + h;
}
const P = 16777215;
function we(n, e) {
  return n === P || e === P ? n + e - P : mt(n, e, 0.5);
}
const vt = new C(), X = ce | ue | le;
function Ge(n, e = !1) {
  gt(n);
  const t = n.childrenToUpdate, r = n.updateTick++;
  for (const a in t) {
    const s = Number(a), i = t[a], o = i.list, d = i.index;
    for (let u = 0; u < d; u++) {
      const c = o[u];
      c.parentRenderGroup === n && c.relativeRenderGroupDepth === s && Pe(c, r, 0);
    }
    z(o, d), i.index = 0;
  }
  if (e)
    for (let a = 0; a < n.renderGroupChildren.length; a++)
      Ge(n.renderGroupChildren[a], e);
}
function gt(n) {
  const e = n.root;
  let t;
  if (n.renderGroupParent) {
    const r = n.renderGroupParent;
    n.worldTransform.appendFrom(
      e.relativeGroupTransform,
      r.worldTransform
    ), n.worldColor = we(
      e.groupColor,
      r.worldColor
    ), t = e.groupAlpha * r.worldAlpha;
  } else
    n.worldTransform.copyFrom(e.localTransform), n.worldColor = e.localColor, t = e.localAlpha;
  t = t < 0 ? 0 : t > 1 ? 1 : t, n.worldAlpha = t, n.worldColorAlpha = n.worldColor + ((t * 255 | 0) << 24);
}
function Pe(n, e, t) {
  if (e === n.updateTick)
    return;
  n.updateTick = e, n.didChange = !1;
  const r = n.localTransform;
  n.updateLocalTransform();
  const a = n.parent;
  if (a && !a.renderGroup ? (t = t | n._updateFlags, n.relativeGroupTransform.appendFrom(
    r,
    a.relativeGroupTransform
  ), t & X && Q(n, a, t)) : (t = n._updateFlags, n.relativeGroupTransform.copyFrom(r), t & X && Q(n, vt, t)), !n.renderGroup) {
    const s = n.children, i = s.length;
    for (let u = 0; u < i; u++)
      Pe(s[u], e, t);
    const o = n.parentRenderGroup, d = n;
    d.renderPipeId && !o.structureDidChange && o.updateRenderable(d);
  }
}
function Q(n, e, t) {
  if (t & ue) {
    n.groupColor = we(
      n.localColor,
      e.groupColor
    );
    let r = n.localAlpha * e.groupAlpha;
    r = r < 0 ? 0 : r > 1 ? 1 : r, n.groupAlpha = r, n.groupColorAlpha = n.groupColor + ((r * 255 | 0) << 24);
  }
  t & le && (n.groupBlendMode = n.localBlendMode === "inherit" ? e.groupBlendMode : n.localBlendMode), t & ce && (n.globalDisplayStatus = n.localDisplayStatus & e.globalDisplayStatus), n._updateFlags = 0;
}
function xt(n, e) {
  const { list: t, index: r } = n.childrenRenderablesToUpdate;
  let a = !1;
  for (let s = 0; s < r; s++) {
    const i = t[s];
    if (a = e[i.renderPipeId].validateRenderable(i), a)
      break;
  }
  return n.structureDidChange = a, a;
}
const _t = new v();
class Re {
  constructor(e) {
    this._renderer = e;
  }
  render({ container: e, transform: t }) {
    e.isRenderGroup = !0;
    const r = e.parent, a = e.renderGroup.renderGroupParent;
    e.parent = null, e.renderGroup.renderGroupParent = null;
    const s = this._renderer, i = Ce(e.renderGroup, []);
    let o = _t;
    t && (o = o.copyFrom(e.renderGroup.localTransform), e.renderGroup.localTransform.copyFrom(t));
    const d = s.renderPipes;
    for (let u = 0; u < i.length; u++) {
      const c = i[u];
      c.runOnRender(), c.instructionSet.renderPipes = d, c.structureDidChange ? z(c.childrenRenderablesToUpdate.list, 0) : xt(c, d), Ge(c), c.structureDidChange ? (c.structureDidChange = !1, ot(c, s)) : bt(c), c.childrenRenderablesToUpdate.index = 0, s.renderPipes.batch.upload(c.instructionSet);
    }
    s.globalUniforms.start({
      worldTransformMatrix: t ? e.renderGroup.localTransform : e.renderGroup.worldTransform,
      worldColor: e.renderGroup.worldColorAlpha
    }), Me(e.renderGroup, d), d.uniformBatch && d.uniformBatch.renderEnd(), t && e.renderGroup.localTransform.copyFrom(o), e.parent = r, e.renderGroup.renderGroupParent = a;
  }
  destroy() {
    this._renderer = null;
  }
}
Re.extension = {
  type: [
    l.WebGLSystem,
    l.WebGPUSystem,
    l.CanvasSystem
  ],
  name: "renderGroup"
};
function bt(n) {
  const { list: e, index: t } = n.childrenRenderablesToUpdate;
  for (let r = 0; r < t; r++) {
    const a = e[r];
    a.didViewUpdate && n.updateRenderable(a);
  }
  z(e, t);
}
class Be {
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
    b.return(t), this._gpuSpriteHash[e.uid] = null, e.off("destroyed", this._destroyRenderableBound);
  }
  _updateBatchableSprite(e, t) {
    t.bounds = e.bounds, t.texture = e._texture;
  }
  _getGpuSprite(e) {
    return this._gpuSpriteHash[e.uid] || this._initGPUSprite(e);
  }
  _initGPUSprite(e) {
    const t = b.get(tt);
    return t.renderable = e, t.transform = e.groupTransform, t.texture = e._texture, t.bounds = e.bounds, t.roundPixels = this._renderer._roundPixels | e._roundPixels, this._gpuSpriteHash[e.uid] = t, e.on("destroyed", this._destroyRenderableBound), t;
  }
  destroy() {
    for (const e in this._gpuSpriteHash)
      b.return(this._gpuSpriteHash[e]);
    this._gpuSpriteHash = null, this._renderer = null;
  }
}
Be.extension = {
  type: [
    l.WebGLPipes,
    l.WebGPUPipes,
    l.CanvasPipes
  ],
  name: "sprite"
};
const E = class Ue {
  constructor() {
    this.clearBeforeRender = !0, this._backgroundColor = new ne(0), this.color = this._backgroundColor, this.alpha = 1;
  }
  /**
   * initiates the background system
   * @param options - the options for the background colors
   */
  init(e) {
    e = { ...Ue.defaultOptions, ...e }, this.clearBeforeRender = e.clearBeforeRender, this.color = e.background || e.backgroundColor || this._backgroundColor, this.alpha = e.backgroundAlpha, this._backgroundColor.setAlpha(e.backgroundAlpha);
  }
  /** The background color to fill if not transparent */
  get color() {
    return this._backgroundColor;
  }
  set color(e) {
    this._backgroundColor.setValue(e);
  }
  /** The background color alpha. Setting this to 0 will make the canvas transparent. */
  get alpha() {
    return this._backgroundColor.alpha;
  }
  set alpha(e) {
    this._backgroundColor.setAlpha(e);
  }
  /** The background color as an [R, G, B, A] array. */
  get colorRgba() {
    return this._backgroundColor.toArray();
  }
  /**
   * destroys the background system
   * @internal
   * @ignore
   */
  destroy() {
  }
};
E.extension = {
  type: [
    l.WebGLSystem,
    l.WebGPUSystem,
    l.CanvasSystem
  ],
  name: "background",
  priority: 0
};
E.defaultOptions = {
  /**
   * {@link WebGLOptions.backgroundAlpha}
   * @default 1
   */
  backgroundAlpha: 1,
  /**
   * {@link WebGLOptions.backgroundColor}
   * @default 0x000000
   */
  backgroundColor: 0,
  /**
   * {@link WebGLOptions.clearBeforeRender}
   * @default true
   */
  clearBeforeRender: !0
};
let yt = E;
const y = {};
O.handle(l.BlendMode, (n) => {
  if (!n.name)
    throw new Error("BlendMode extension must have a name property");
  y[n.name] = n.ref;
}, (n) => {
  delete y[n.name];
});
class Ie {
  constructor(e) {
    this._isAdvanced = !1, this._filterHash = /* @__PURE__ */ Object.create(null), this._renderer = e;
  }
  /**
   * This ensures that a blendMode switch is added to the instruction set if the blend mode has changed.
   * @param renderable - The renderable we are adding to the instruction set
   * @param blendMode - The blend mode of the renderable
   * @param instructionSet - The instruction set we are adding to
   */
  setBlendMode(e, t, r) {
    if (this._activeBlendMode === t) {
      this._isAdvanced && this._renderableList.push(e);
      return;
    }
    this._activeBlendMode = t, this._isAdvanced && this._endAdvancedBlendMode(r), this._isAdvanced = !!y[t], this._isAdvanced && (this._beginAdvancedBlendMode(r), this._renderableList.push(e));
  }
  _beginAdvancedBlendMode(e) {
    this._renderer.renderPipes.batch.break(e);
    const t = this._activeBlendMode;
    if (!y[t]) {
      ae(`Unable to assign BlendMode: '${t}'. You may want to include: import 'pixi.js/advanced-blend-modes'`);
      return;
    }
    let r = this._filterHash[t];
    r || (r = this._filterHash[t] = new se(), r.filters = [new y[t]()]);
    const a = {
      renderPipeId: "filter",
      action: "pushFilter",
      renderables: [],
      filterEffect: r,
      canBundle: !1
    };
    this._renderableList = a.renderables, e.add(a);
  }
  _endAdvancedBlendMode(e) {
    this._renderableList = null, this._renderer.renderPipes.batch.break(e), e.add({
      renderPipeId: "filter",
      action: "popFilter",
      canBundle: !1
    });
  }
  /**
   * called when the instruction build process is starting this will reset internally to the default blend mode
   * @internal
   * @ignore
   */
  buildStart() {
    this._isAdvanced = !1;
  }
  /**
   * called when the instruction build process is finished, ensuring that if there is an advanced blend mode
   * active, we add the final render instructions added to the instruction set
   * @param instructionSet - The instruction set we are adding to
   * @internal
   * @ignore
   */
  buildEnd(e) {
    this._isAdvanced && this._endAdvancedBlendMode(e);
  }
  /**
   * @internal
   * @ignore
   */
  destroy() {
    this._renderer = null, this._renderableList = null;
    for (const e in this._filterHash)
      this._filterHash[e].destroy();
    this._filterHash = null;
  }
}
Ie.extension = {
  type: [
    l.WebGLPipes,
    l.WebGPUPipes,
    l.CanvasPipes
  ],
  name: "blendMode"
};
const R = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp"
}, D = class Ae {
  /** @param renderer - The renderer this System works for. */
  constructor(e) {
    this._renderer = e;
  }
  _normalizeOptions(e, t = {}) {
    return e instanceof C || e instanceof m ? {
      target: e,
      ...t
    } : {
      ...t,
      ...e
    };
  }
  /**
   * Will return a HTML Image of the target
   * @param options - The options for creating the image, or the target to extract
   * @returns - HTML Image of the target
   */
  async image(e) {
    const t = new Image();
    return t.src = await this.base64(e), t;
  }
  /**
   * Will return a base64 encoded string of this target. It works by calling
   * `Extract.canvas` and then running toDataURL on that.
   * @param options - The options for creating the image, or the target to extract
   */
  async base64(e) {
    e = this._normalizeOptions(
      e,
      Ae.defaultImageOptions
    );
    const { format: t, quality: r } = e, a = this.canvas(e);
    if (a.toBlob !== void 0)
      return new Promise((s, i) => {
        a.toBlob((o) => {
          if (!o) {
            i(new Error("ICanvas.toBlob failed!"));
            return;
          }
          const d = new FileReader();
          d.onload = () => s(d.result), d.onerror = i, d.readAsDataURL(o);
        }, R[t], r);
      });
    if (a.toDataURL !== void 0)
      return a.toDataURL(R[t], r);
    if (a.convertToBlob !== void 0) {
      const s = await a.convertToBlob({ type: R[t], quality: r });
      return new Promise((i, o) => {
        const d = new FileReader();
        d.onload = () => i(d.result), d.onerror = o, d.readAsDataURL(s);
      });
    }
    throw new Error("Extract.base64() requires ICanvas.toDataURL, ICanvas.toBlob, or ICanvas.convertToBlob to be implemented");
  }
  /**
   * Creates a Canvas element, renders this target to it and then returns it.
   * @param options - The options for creating the canvas, or the target to extract
   * @returns - A Canvas element with the texture rendered on.
   */
  canvas(e) {
    e = this._normalizeOptions(e);
    const t = e.target, r = this._renderer;
    if (t instanceof m)
      return r.texture.generateCanvas(t);
    const a = r.textureGenerator.generateTexture(e), s = r.texture.generateCanvas(a);
    return a.destroy(), s;
  }
  /**
   * Will return a one-dimensional array containing the pixel data of the entire texture in RGBA
   * order, with integer values between 0 and 255 (included).
   * @param options - The options for extracting the image, or the target to extract
   * @returns - One-dimensional array containing the pixel data of the entire texture
   */
  pixels(e) {
    e = this._normalizeOptions(e);
    const t = e.target, r = this._renderer, a = t instanceof m ? t : r.textureGenerator.generateTexture(e), s = r.texture.getPixels(a);
    return t instanceof C && a.destroy(), s;
  }
  /**
   * Will return a texture of the target
   * @param options - The options for creating the texture, or the target to extract
   * @returns - A texture of the target
   */
  texture(e) {
    return e = this._normalizeOptions(e), e.target instanceof m ? e.target : this._renderer.textureGenerator.generateTexture(e);
  }
  /**
   * Will extract a HTMLImage of the target and download it
   * @param options - The options for downloading and extracting the image, or the target to extract
   */
  download(e) {
    e = this._normalizeOptions(e);
    const t = this.canvas(e), r = document.createElement("a");
    r.download = e.filename ?? "image.png", r.href = t.toDataURL("image/png"), document.body.appendChild(r), r.click(), document.body.removeChild(r);
  }
  /**
   * Logs the target to the console as an image. This is a useful way to debug what's happening in the renderer.
   * @param options - The options for logging the image, or the target to log
   */
  log(e) {
    const t = e.width ?? 200;
    e = this._normalizeOptions(e);
    const r = this.canvas(e), a = r.toDataURL();
    console.log(`[Pixi Texture] ${r.width}px ${r.height}px`);
    const s = [
      "font-size: 1px;",
      `padding: ${t}px 300px;`,
      `background: url(${a}) no-repeat;`,
      "background-size: contain;"
    ].join(" ");
    console.log("%c ", s);
  }
  destroy() {
    this._renderer = null;
  }
};
D.extension = {
  type: [
    l.WebGLSystem,
    l.WebGPUSystem
  ],
  name: "extract"
};
D.defaultImageOptions = {
  /** The format of the image. */
  format: "png",
  /** The quality of the image. */
  quality: 1
};
let kt = D;
const Tt = new w(), Mt = new de(), St = [0, 0, 0, 0];
class Oe {
  constructor(e) {
    this._renderer = e;
  }
  /**
   * A Useful function that returns a texture of the display object that can then be used to create sprites
   * This can be quite useful if your container is complicated and needs to be reused multiple times.
   * @param {GenerateTextureOptions | Container} options - Generate texture options.
   * @param {Container} [options.container] - If not given, the renderer's resolution is used.
   * @param {Rectangle} options.region - The region of the container, that shall be rendered,
   * @param {number} [options.resolution] - The resolution of the texture being generated.
   *        if no region is specified, defaults to the local bounds of the container.
   * @param {GenerateTextureSourceOptions} [options.textureSourceOptions] - Texture options for GPU.
   * @returns a shiny new texture of the container passed in
   */
  generateTexture(e) {
    var t;
    e instanceof C && (e = {
      target: e,
      frame: void 0,
      textureSourceOptions: {},
      resolution: void 0
    });
    const r = e.resolution || this._renderer.resolution, a = e.antialias || this._renderer.view.antialias, s = e.target;
    let i = e.clearColor;
    i ? i = Array.isArray(i) && i.length === 4 ? i : ne.shared.setValue(i).toArray() : i = St;
    const o = ((t = e.frame) == null ? void 0 : t.copyTo(Tt)) || Ve(s, Mt).rectangle;
    o.width = Math.max(o.width, 1 / r) | 0, o.height = Math.max(o.height, 1 / r) | 0;
    const d = $e.create({
      ...e.textureSourceOptions,
      width: o.width,
      height: o.height,
      resolution: r,
      antialias: a
    }), u = v.shared.translate(-o.x, -o.y);
    return this._renderer.render({
      container: s,
      transform: u,
      target: d,
      clearColor: i
    }), d.source.updateMipmaps(), d;
  }
  destroy() {
    this._renderer = null;
  }
}
Oe.extension = {
  type: [
    l.WebGLSystem,
    l.WebGPUSystem
  ],
  name: "textureGenerator"
};
class Fe {
  constructor(e) {
    this._stackIndex = 0, this._globalUniformDataStack = [], this._uniformsPool = [], this._activeUniforms = [], this._bindGroupPool = [], this._activeBindGroups = [], this._renderer = e;
  }
  reset() {
    this._stackIndex = 0;
    for (let e = 0; e < this._activeUniforms.length; e++)
      this._uniformsPool.push(this._activeUniforms[e]);
    for (let e = 0; e < this._activeBindGroups.length; e++)
      this._bindGroupPool.push(this._activeBindGroups[e]);
    this._activeUniforms.length = 0, this._activeBindGroups.length = 0;
  }
  start(e) {
    this.reset(), this.push(e);
  }
  bind({
    size: e,
    projectionMatrix: t,
    worldTransformMatrix: r,
    worldColor: a,
    offset: s
  }) {
    const i = this._renderer.renderTarget.renderTarget, o = this._stackIndex ? this._globalUniformDataStack[this._stackIndex - 1] : {
      projectionData: i,
      worldTransformMatrix: new v(),
      worldColor: 4294967295,
      offset: new je()
    }, d = {
      projectionMatrix: t || this._renderer.renderTarget.projectionMatrix,
      resolution: e || i.size,
      worldTransformMatrix: r || o.worldTransformMatrix,
      worldColor: a || o.worldColor,
      offset: s || o.offset,
      bindGroup: null
    }, u = this._uniformsPool.pop() || this._createUniforms();
    this._activeUniforms.push(u);
    const c = u.uniforms;
    c.uProjectionMatrix = d.projectionMatrix, c.uResolution = d.resolution, c.uWorldTransformMatrix.copyFrom(d.worldTransformMatrix), c.uWorldTransformMatrix.tx -= d.offset.x, c.uWorldTransformMatrix.ty -= d.offset.y, rt(
      d.worldColor,
      c.uWorldColorAlpha,
      0
    ), u.update();
    let h;
    this._renderer.renderPipes.uniformBatch ? h = this._renderer.renderPipes.uniformBatch.getUniformBindGroup(u, !1) : (h = this._bindGroupPool.pop() || new Ne(), this._activeBindGroups.push(h), h.setResource(u, 0)), d.bindGroup = h, this._currentGlobalUniformData = d;
  }
  push(e) {
    this.bind(e), this._globalUniformDataStack[this._stackIndex++] = this._currentGlobalUniformData;
  }
  pop() {
    this._currentGlobalUniformData = this._globalUniformDataStack[--this._stackIndex - 1], this._renderer.type === F.WEBGL && this._currentGlobalUniformData.bindGroup.resources[0].update();
  }
  get bindGroup() {
    return this._currentGlobalUniformData.bindGroup;
  }
  get globalUniformData() {
    return this._currentGlobalUniformData;
  }
  get uniformGroup() {
    return this._currentGlobalUniformData.bindGroup.resources[0];
  }
  _createUniforms() {
    return new ie({
      uProjectionMatrix: { value: new v(), type: "mat3x3<f32>" },
      uWorldTransformMatrix: { value: new v(), type: "mat3x3<f32>" },
      // TODO - someone smart - set this to be a unorm8x4 rather than a vec4<f32>
      uWorldColorAlpha: { value: new Float32Array(4), type: "vec4<f32>" },
      uResolution: { value: [0, 0], type: "vec2<f32>" }
    }, {
      isStatic: !0
    });
  }
  destroy() {
    this._renderer = null;
  }
}
Fe.extension = {
  type: [
    l.WebGLSystem,
    l.WebGPUSystem,
    l.CanvasSystem
  ],
  name: "globalUniforms"
};
let Ct = 1;
class He {
  constructor() {
    this._tasks = [], this._offset = 0;
  }
  /** Initializes the scheduler system and starts the ticker. */
  init() {
    j.system.add(this._update, this);
  }
  /**
   * Schedules a repeating task.
   * @param func - The function to execute.
   * @param duration - The interval duration in milliseconds.
   * @param useOffset - this will spread out tasks so that they do not all run at the same time
   * @returns The unique identifier for the scheduled task.
   */
  repeat(e, t, r = !0) {
    const a = Ct++;
    let s = 0;
    return r && (this._offset += 1e3, s = this._offset), this._tasks.push({
      func: e,
      duration: t,
      start: performance.now(),
      offset: s,
      last: performance.now(),
      repeat: !0,
      id: a
    }), a;
  }
  /**
   * Cancels a scheduled task.
   * @param id - The unique identifier of the task to cancel.
   */
  cancel(e) {
    for (let t = 0; t < this._tasks.length; t++)
      if (this._tasks[t].id === e) {
        this._tasks.splice(t, 1);
        return;
      }
  }
  /**
   * Updates and executes the scheduled tasks.
   * @private
   */
  _update() {
    const e = performance.now();
    for (let t = 0; t < this._tasks.length; t++) {
      const r = this._tasks[t];
      if (e - r.offset - r.last >= r.duration) {
        const a = e - r.start;
        r.func(a), r.last = e;
      }
    }
  }
  /**
   * Destroys the scheduler system and removes all tasks.
   * @internal
   * @ignore
   */
  destroy() {
    j.system.remove(this._update, this), this._tasks.length = 0;
  }
}
He.extension = {
  type: [
    l.WebGLSystem,
    l.WebGPUSystem,
    l.CanvasSystem
  ],
  name: "scheduler",
  priority: 0
};
let Z = !1;
function wt(n) {
  if (!Z) {
    if (oe.get().getNavigator().userAgent.toLowerCase().indexOf("chrome") > -1) {
      const e = [
        `%c  %c  %c  %c  %c PixiJS %c v${K} (${n}) http://www.pixijs.com/

`,
        "background: #E72264; padding:5px 0;",
        "background: #6CA2EA; padding:5px 0;",
        "background: #B5D33D; padding:5px 0;",
        "background: #FED23F; padding:5px 0;",
        "color: #FFFFFF; background: #E72264; padding:5px 0;",
        "color: #E72264; background: #FFFFFF; padding:5px 0;"
      ];
      globalThis.console.log(...e);
    } else globalThis.console && globalThis.console.log(`PixiJS ${K} - ${n} - http://www.pixijs.com/`);
    Z = !0;
  }
}
class W {
  constructor(e) {
    this._renderer = e;
  }
  /**
   * It all starts here! This initiates every system, passing in the options for any system by name.
   * @param options - the config for the renderer and all its systems
   */
  init(e) {
    if (e.hello) {
      let t = this._renderer.name;
      this._renderer.type === F.WEBGL && (t += ` ${this._renderer.context.webGLVersion}`), wt(t);
    }
  }
}
W.extension = {
  type: [
    l.WebGLSystem,
    l.WebGPUSystem,
    l.CanvasSystem
  ],
  name: "hello",
  priority: -2
};
W.defaultOptions = {
  /** {@link WebGLOptions.hello} */
  hello: !1
};
function Gt(n) {
  let e = !1;
  for (const r in n)
    if (n[r] == null) {
      e = !0;
      break;
    }
  if (!e)
    return n;
  const t = /* @__PURE__ */ Object.create(null);
  for (const r in n) {
    const a = n[r];
    a && (t[r] = a);
  }
  return t;
}
function Pt(n) {
  let e = 0;
  for (let t = 0; t < n.length; t++)
    n[t] == null ? e++ : n[t - e] = n[t];
  return n.length = n.length - e, n;
}
const L = class ze {
  /** @param renderer - The renderer this System works for. */
  constructor(e) {
    this._managedRenderables = [], this._managedHashes = [], this._managedArrays = [], this._renderer = e;
  }
  init(e) {
    e = { ...ze.defaultOptions, ...e }, this.maxUnusedTime = e.renderableGCMaxUnusedTime, this._frequency = e.renderableGCFrequency, this.enabled = e.renderableGCActive;
  }
  get enabled() {
    return !!this._handler;
  }
  set enabled(e) {
    this.enabled !== e && (e ? (this._handler = this._renderer.scheduler.repeat(
      () => this.run(),
      this._frequency,
      !1
    ), this._hashHandler = this._renderer.scheduler.repeat(
      () => {
        for (const t of this._managedHashes)
          t.context[t.hash] = Gt(t.context[t.hash]);
      },
      this._frequency
    ), this._arrayHandler = this._renderer.scheduler.repeat(
      () => {
        for (const t of this._managedArrays)
          Pt(t.context[t.hash]);
      },
      this._frequency
    )) : (this._renderer.scheduler.cancel(this._handler), this._renderer.scheduler.cancel(this._hashHandler), this._renderer.scheduler.cancel(this._arrayHandler)));
  }
  addManagedHash(e, t) {
    this._managedHashes.push({ context: e, hash: t });
  }
  addManagedArray(e, t) {
    this._managedArrays.push({ context: e, hash: t });
  }
  prerender() {
    this._now = performance.now();
  }
  addRenderable(e, t) {
    this.enabled && (e._lastUsed = this._now, e._lastInstructionTick === -1 && (this._managedRenderables.push(e), e.once("destroyed", this._removeRenderable, this)), e._lastInstructionTick = t.tick);
  }
  /** Runs the scheduled garbage collection */
  run() {
    var e;
    const t = performance.now(), r = this._managedRenderables, a = this._renderer.renderPipes;
    let s = 0;
    for (let i = 0; i < r.length; i++) {
      const o = r[i];
      if (o === null) {
        s++;
        continue;
      }
      const d = o.renderGroup ?? o.parentRenderGroup, u = ((e = d == null ? void 0 : d.instructionSet) == null ? void 0 : e.tick) ?? -1;
      o._lastInstructionTick !== u && t - o._lastUsed > this.maxUnusedTime ? (o.destroyed || a[o.renderPipeId].destroyRenderable(o), o._lastInstructionTick = -1, s++, o.off("destroyed", this._removeRenderable, this)) : r[i - s] = o;
    }
    r.length = r.length - s;
  }
  destroy() {
    this.enabled = !1, this._renderer = null, this._managedRenderables.length = 0, this._managedHashes.length = 0, this._managedArrays.length = 0;
  }
  _removeRenderable(e) {
    const t = this._managedRenderables.indexOf(e);
    t >= 0 && (e.off("destroyed", this._removeRenderable, this), this._managedRenderables[t] = null);
  }
};
L.extension = {
  type: [
    l.WebGLSystem,
    l.WebGPUSystem
  ],
  name: "renderableGC",
  priority: 0
};
L.defaultOptions = {
  /**
   * If set to true, this will enable the garbage collector on the GPU.
   * @default true
   */
  renderableGCActive: !0,
  /**
   * The maximum idle frames before a texture is destroyed by garbage collection.
   * @default 60 * 60
   */
  renderableGCMaxUnusedTime: 6e4,
  /**
   * Frames between two garbage collections.
   * @default 600
   */
  renderableGCFrequency: 3e4
};
let Rt = L;
const V = class Ee {
  /** @param renderer - The renderer this System works for. */
  constructor(e) {
    this._renderer = e, this.count = 0, this.checkCount = 0;
  }
  init(e) {
    e = { ...Ee.defaultOptions, ...e }, this.checkCountMax = e.textureGCCheckCountMax, this.maxIdle = e.textureGCAMaxIdle ?? e.textureGCMaxIdle, this.active = e.textureGCActive;
  }
  /**
   * Checks to see when the last time a texture was used.
   * If the texture has not been used for a specified amount of time, it will be removed from the GPU.
   */
  postrender() {
    this._renderer.renderingToScreen && (this.count++, this.active && (this.checkCount++, this.checkCount > this.checkCountMax && (this.checkCount = 0, this.run())));
  }
  /**
   * Checks to see when the last time a texture was used.
   * If the texture has not been used for a specified amount of time, it will be removed from the GPU.
   */
  run() {
    const e = this._renderer.texture.managedTextures;
    for (let t = 0; t < e.length; t++) {
      const r = e[t];
      r.autoGarbageCollect && r.resource && r._touched > -1 && this.count - r._touched > this.maxIdle && (r._touched = -1, r.unload());
    }
  }
  destroy() {
    this._renderer = null;
  }
};
V.extension = {
  type: [
    l.WebGLSystem,
    l.WebGPUSystem
  ],
  name: "textureGC"
};
V.defaultOptions = {
  /**
   * If set to true, this will enable the garbage collector on the GPU.
   * @default true
   */
  textureGCActive: !0,
  /**
   * @deprecated since 8.3.0
   * @see {@link TextureGCSystem.textureGCMaxIdle}
   */
  textureGCAMaxIdle: null,
  /**
   * The maximum idle frames before a texture is destroyed by garbage collection.
   * @default 60 * 60
   */
  textureGCMaxIdle: 60 * 60,
  /**
   * Frames between two garbage collections.
   * @default 600
   */
  textureGCCheckCountMax: 600
};
let Bt = V;
const $ = class De {
  /**
   * Whether CSS dimensions of canvas view should be resized to screen dimensions automatically.
   * @member {boolean}
   */
  get autoDensity() {
    return this.texture.source.autoDensity;
  }
  set autoDensity(e) {
    this.texture.source.autoDensity = e;
  }
  /** The resolution / device pixel ratio of the renderer. */
  get resolution() {
    return this.texture.source._resolution;
  }
  set resolution(e) {
    this.texture.source.resize(
      this.texture.source.width,
      this.texture.source.height,
      e
    );
  }
  /**
   * initiates the view system
   * @param options - the options for the view
   */
  init(e) {
    e = {
      ...De.defaultOptions,
      ...e
    }, e.view && (qe(Ke, "ViewSystem.view has been renamed to ViewSystem.canvas"), e.canvas = e.view), this.screen = new w(0, 0, e.width, e.height), this.canvas = e.canvas || oe.get().createCanvas(), this.antialias = !!e.antialias, this.texture = be(this.canvas, e), this.renderTarget = new A({
      colorTextures: [this.texture],
      depth: !!e.depth,
      isRoot: !0
    }), this.texture.source.transparent = e.backgroundAlpha < 1, this.resolution = e.resolution;
  }
  /**
   * Resizes the screen and canvas to the specified dimensions.
   * @param desiredScreenWidth - The new width of the screen.
   * @param desiredScreenHeight - The new height of the screen.
   * @param resolution
   */
  resize(e, t, r) {
    this.texture.source.resize(e, t, r), this.screen.width = this.texture.frame.width, this.screen.height = this.texture.frame.height;
  }
  /**
   * Destroys this System and optionally removes the canvas from the dom.
   * @param {options | false} options - The options for destroying the view, or "false".
   * @param options.removeView - Whether to remove the view element from the DOM. Defaults to `false`.
   */
  destroy(e = !1) {
    (typeof e == "boolean" ? e : e != null && e.removeView) && this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas);
  }
};
$.extension = {
  type: [
    l.WebGLSystem,
    l.WebGPUSystem,
    l.CanvasSystem
  ],
  name: "view",
  priority: 0
};
$.defaultOptions = {
  /**
   * {@link WebGLOptions.width}
   * @default 800
   */
  width: 800,
  /**
   * {@link WebGLOptions.height}
   * @default 600
   */
  height: 600,
  /**
   * {@link WebGLOptions.autoDensity}
   * @default false
   */
  autoDensity: !1,
  /**
   * {@link WebGLOptions.antialias}
   * @default false
   */
  antialias: !1
};
let Ut = $;
const Vt = [
  yt,
  Fe,
  W,
  Ut,
  Re,
  Bt,
  Oe,
  kt,
  Ye,
  Rt,
  He
], $t = [
  Ie,
  me,
  Be,
  Se,
  ge,
  _e,
  xe,
  Te
];
export {
  Ot as D,
  Ht as F,
  zt as H,
  Et as L,
  $t as N,
  Ft as O,
  Lt as V,
  Dt as W,
  ht as h,
  Vt as j,
  T as k,
  x,
  Wt as z
};
