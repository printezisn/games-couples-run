import { D as d, q as ve, C as v, a2 as Ae, _ as Ne, R as A, c as g, O as T, U as Y, Y as Be, x as O, W as b, a9 as $, a5 as R, Z as j, a as y, H as z, B as K, K as Ge, L as Ce, M as q, N as Ie, P as L, a7 as N, a8 as De } from "./index-BH5HnlAs.js";
import { w as U, O as Z } from "./colorToUniform-Cu0xVW3l-CksrxNKe.js";
import { j as Oe, N as ye, F as Ue, H as Pe, z as Fe, O as Me, x as Le, L as He, V as J, k as B, h as we } from "./SharedSystems-DSGKDcqp-BXRBASAd.js";
class Q {
  constructor() {
    this._didUpload = !1, this._tempState = U.for2d();
  }
  init(e) {
    e.renderer.runners.contextChange.add(this);
  }
  contextChange() {
    this._didUpload = !1;
  }
  start(e, r, s) {
    const n = e.renderer;
    n.shader.bind(s, this._didUpload), n.shader.updateUniformGroup(n.globalUniforms.uniformGroup), n.geometry.bind(r, s.glProgram);
  }
  execute(e, r) {
    const s = e.renderer;
    this._didUpload = !0, this._tempState.blendMode = r.blendMode, s.state.set(this._tempState);
    const n = r.textures.textures;
    for (let i = 0; i < r.textures.count; i++)
      s.texture.bind(n[i], i);
    s.geometry.draw("triangle-list", r.size, r.start);
  }
}
Q.extension = {
  type: [
    d.WebGLPipesAdaptor
  ],
  name: "batch"
};
var p = /* @__PURE__ */ ((t) => (t[t.ELEMENT_ARRAY_BUFFER = 34963] = "ELEMENT_ARRAY_BUFFER", t[t.ARRAY_BUFFER = 34962] = "ARRAY_BUFFER", t[t.UNIFORM_BUFFER = 35345] = "UNIFORM_BUFFER", t))(p || {});
class Ve {
  constructor(e, r) {
    this.buffer = e || null, this.updateID = -1, this.byteLength = -1, this.type = r;
  }
}
class ee {
  /**
   * @param {Renderer} renderer - The renderer this System works for.
   */
  constructor(e) {
    this._gpuBuffers = /* @__PURE__ */ Object.create(null), this._boundBufferBases = /* @__PURE__ */ Object.create(null), this._renderer = e, this._renderer.renderableGC.addManagedHash(this, "_gpuBuffers");
  }
  /**
   * @ignore
   */
  destroy() {
    this._renderer = null, this._gl = null, this._gpuBuffers = null, this._boundBufferBases = null;
  }
  /** Sets up the renderer context and necessary buffers. */
  contextChange() {
    this._gpuBuffers = /* @__PURE__ */ Object.create(null), this._gl = this._renderer.gl;
  }
  getGlBuffer(e) {
    return this._gpuBuffers[e.uid] || this.createGLBuffer(e);
  }
  /**
   * This binds specified buffer. On first run, it will create the webGL buffers for the context too
   * @param buffer - the buffer to bind to the renderer
   */
  bind(e) {
    const { _gl: r } = this, s = this.getGlBuffer(e);
    r.bindBuffer(s.type, s.buffer);
  }
  /**
   * Binds an uniform buffer to at the given index.
   *
   * A cache is used so a buffer will not be bound again if already bound.
   * @param buffer - the buffer to bind
   * @param index - the base index to bind it to.
   */
  bindBufferBase(e, r) {
    const { _gl: s } = this;
    if (this._boundBufferBases[r] !== e) {
      const n = this.getGlBuffer(e);
      this._boundBufferBases[r] = e, s.bindBufferBase(s.UNIFORM_BUFFER, r, n.buffer);
    }
  }
  /**
   * Binds a buffer whilst also binding its range.
   * This will make the buffer start from the offset supplied rather than 0 when it is read.
   * @param buffer - the buffer to bind
   * @param index - the base index to bind at, defaults to 0
   * @param offset - the offset to bind at (this is blocks of 256). 0 = 0, 1 = 256, 2 = 512 etc
   */
  bindBufferRange(e, r, s) {
    const { _gl: n } = this;
    s = s || 0;
    const i = this.getGlBuffer(e);
    n.bindBufferRange(n.UNIFORM_BUFFER, r || 0, i.buffer, s * 256, 256);
  }
  /**
   * Will ensure the data in the buffer is uploaded to the GPU.
   * @param {Buffer} buffer - the buffer to update
   */
  updateBuffer(e) {
    const { _gl: r } = this, s = this.getGlBuffer(e);
    if (e._updateID === s.updateID)
      return s;
    s.updateID = e._updateID, r.bindBuffer(s.type, s.buffer);
    const n = e.data;
    if (s.byteLength >= e.data.byteLength)
      r.bufferSubData(s.type, 0, n, 0, e._updateSize / n.BYTES_PER_ELEMENT);
    else {
      const i = e.descriptor.usage & A.STATIC ? r.STATIC_DRAW : r.DYNAMIC_DRAW;
      s.byteLength = n.byteLength, r.bufferData(s.type, n, i);
    }
    return s;
  }
  /** dispose all WebGL resources of all managed buffers */
  destroyAll() {
    const e = this._gl;
    for (const r in this._gpuBuffers)
      e.deleteBuffer(this._gpuBuffers[r].buffer);
    this._gpuBuffers = /* @__PURE__ */ Object.create(null);
  }
  /**
   * Disposes buffer
   * @param {Buffer} buffer - buffer with data
   * @param {boolean} [contextLost=false] - If context was lost, we suppress deleteVertexArray
   */
  onBufferDestroy(e, r) {
    const s = this._gpuBuffers[e.uid], n = this._gl;
    r || n.deleteBuffer(s.buffer), this._gpuBuffers[e.uid] = null;
  }
  /**
   * creates and attaches a GLBuffer object tied to the current context.
   * @param buffer
   * @protected
   */
  createGLBuffer(e) {
    const { _gl: r } = this;
    let s = p.ARRAY_BUFFER;
    e.descriptor.usage & A.INDEX ? s = p.ELEMENT_ARRAY_BUFFER : e.descriptor.usage & A.UNIFORM && (s = p.UNIFORM_BUFFER);
    const n = new Ve(r.createBuffer(), s);
    return this._gpuBuffers[e.uid] = n, e.on("destroy", this.onBufferDestroy, this), n;
  }
}
ee.extension = {
  type: [
    d.WebGLSystem
  ],
  name: "buffer"
};
const P = class te {
  /** @param renderer - The renderer this System works for. */
  constructor(e) {
    this.supports = {
      /** Support for 32-bit indices buffer. */
      uint32Indices: !0,
      /** Support for UniformBufferObjects */
      uniformBufferObject: !0,
      /** Support for VertexArrayObjects */
      vertexArrayObject: !0,
      /** Support for SRGB texture format */
      srgbTextures: !0,
      /** Support for wrapping modes if a texture is non-power of two */
      nonPowOf2wrapping: !0,
      /** Support for MSAA (antialiasing of dynamic textures) */
      msaa: !0,
      /** Support for mipmaps if a texture is non-power of two */
      nonPowOf2mipmaps: !0
    }, this._renderer = e, this.extensions = /* @__PURE__ */ Object.create(null), this.handleContextLost = this.handleContextLost.bind(this), this.handleContextRestored = this.handleContextRestored.bind(this);
  }
  /**
   * `true` if the context is lost
   * @readonly
   */
  get isLost() {
    return !this.gl || this.gl.isContextLost();
  }
  /**
   * Handles the context change event.
   * @param {WebGLRenderingContext} gl - New WebGL context.
   */
  contextChange(e) {
    this.gl = e, this._renderer.gl = e;
  }
  init(e) {
    e = { ...te.defaultOptions, ...e };
    let r = this.multiView = e.multiView;
    if (e.context && r && (g("Renderer created with both a context and multiview enabled. Disabling multiView as both cannot work together."), r = !1), r ? this.canvas = T.get().createCanvas(this._renderer.canvas.width, this._renderer.canvas.height) : this.canvas = this._renderer.view.canvas, e.context)
      this.initFromContext(e.context);
    else {
      const s = this._renderer.background.alpha < 1, n = e.premultipliedAlpha ?? !0, i = e.antialias && !this._renderer.backBuffer.useBackBuffer;
      this.createContext(e.preferWebGLVersion, {
        alpha: s,
        premultipliedAlpha: n,
        antialias: i,
        stencil: !0,
        preserveDrawingBuffer: e.preserveDrawingBuffer,
        powerPreference: e.powerPreference ?? "default"
      });
    }
  }
  ensureCanvasSize(e) {
    if (!this.multiView) {
      e !== this.canvas && g("multiView is disabled, but targetCanvas is not the main canvas");
      return;
    }
    const { canvas: r } = this;
    (r.width < e.width || r.height < e.height) && (r.width = Math.max(e.width, e.width), r.height = Math.max(e.height, e.height));
  }
  /**
   * Initializes the context.
   * @protected
   * @param {WebGLRenderingContext} gl - WebGL context
   */
  initFromContext(e) {
    this.gl = e, this.webGLVersion = e instanceof T.get().getWebGLRenderingContext() ? 1 : 2, this.getExtensions(), this.validateContext(e), this._renderer.runners.contextChange.emit(e);
    const r = this._renderer.view.canvas;
    r.addEventListener("webglcontextlost", this.handleContextLost, !1), r.addEventListener("webglcontextrestored", this.handleContextRestored, !1);
  }
  /**
   * Initialize from context options
   * @protected
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
   * @param preferWebGLVersion
   * @param {object} options - context attributes
   */
  createContext(e, r) {
    let s;
    const n = this.canvas;
    if (e === 2 && (s = n.getContext("webgl2", r)), !s && (s = n.getContext("webgl", r), !s))
      throw new Error("This browser does not support WebGL. Try using the canvas renderer");
    this.gl = s, this.initFromContext(this.gl);
  }
  /** Auto-populate the {@link GlContextSystem.extensions extensions}. */
  getExtensions() {
    const { gl: e } = this, r = {
      anisotropicFiltering: e.getExtension("EXT_texture_filter_anisotropic"),
      floatTextureLinear: e.getExtension("OES_texture_float_linear"),
      s3tc: e.getExtension("WEBGL_compressed_texture_s3tc"),
      s3tc_sRGB: e.getExtension("WEBGL_compressed_texture_s3tc_srgb"),
      // eslint-disable-line camelcase
      etc: e.getExtension("WEBGL_compressed_texture_etc"),
      etc1: e.getExtension("WEBGL_compressed_texture_etc1"),
      pvrtc: e.getExtension("WEBGL_compressed_texture_pvrtc") || e.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
      atc: e.getExtension("WEBGL_compressed_texture_atc"),
      astc: e.getExtension("WEBGL_compressed_texture_astc"),
      bptc: e.getExtension("EXT_texture_compression_bptc"),
      rgtc: e.getExtension("EXT_texture_compression_rgtc"),
      loseContext: e.getExtension("WEBGL_lose_context")
    };
    if (this.webGLVersion === 1)
      this.extensions = {
        ...r,
        drawBuffers: e.getExtension("WEBGL_draw_buffers"),
        depthTexture: e.getExtension("WEBGL_depth_texture"),
        vertexArrayObject: e.getExtension("OES_vertex_array_object") || e.getExtension("MOZ_OES_vertex_array_object") || e.getExtension("WEBKIT_OES_vertex_array_object"),
        uint32ElementIndex: e.getExtension("OES_element_index_uint"),
        // Floats and half-floats
        floatTexture: e.getExtension("OES_texture_float"),
        floatTextureLinear: e.getExtension("OES_texture_float_linear"),
        textureHalfFloat: e.getExtension("OES_texture_half_float"),
        textureHalfFloatLinear: e.getExtension("OES_texture_half_float_linear"),
        vertexAttribDivisorANGLE: e.getExtension("ANGLE_instanced_arrays"),
        srgb: e.getExtension("EXT_sRGB")
      };
    else {
      this.extensions = {
        ...r,
        colorBufferFloat: e.getExtension("EXT_color_buffer_float")
      };
      const s = e.getExtension("WEBGL_provoking_vertex");
      s && s.provokingVertexWEBGL(s.FIRST_VERTEX_CONVENTION_WEBGL);
    }
  }
  /**
   * Handles a lost webgl context
   * @param {WebGLContextEvent} event - The context lost event.
   */
  handleContextLost(e) {
    e.preventDefault(), this._contextLossForced && (this._contextLossForced = !1, setTimeout(() => {
      var r;
      this.gl.isContextLost() && ((r = this.extensions.loseContext) == null || r.restoreContext());
    }, 0));
  }
  /** Handles a restored webgl context. */
  handleContextRestored() {
    this._renderer.runners.contextChange.emit(this.gl);
  }
  destroy() {
    var e;
    const r = this._renderer.view.canvas;
    this._renderer = null, r.removeEventListener("webglcontextlost", this.handleContextLost), r.removeEventListener("webglcontextrestored", this.handleContextRestored), this.gl.useProgram(null), (e = this.extensions.loseContext) == null || e.loseContext();
  }
  /**
   * this function can be called to force a webGL context loss
   * this will release all resources on the GPU.
   * Useful if you need to put Pixi to sleep, and save some GPU memory
   *
   * As soon as render is called - all resources will be created again.
   */
  forceContextLoss() {
    var e;
    (e = this.extensions.loseContext) == null || e.loseContext(), this._contextLossForced = !0;
  }
  /**
   * Validate context.
   * @param {WebGLRenderingContext} gl - Render context.
   */
  validateContext(e) {
    const r = e.getContextAttributes();
    r && !r.stencil && g("Provided WebGL context does not have a stencil buffer, masks may not render correctly");
    const s = this.supports, n = this.webGLVersion === 2, i = this.extensions;
    s.uint32Indices = n || !!i.uint32ElementIndex, s.uniformBufferObject = n, s.vertexArrayObject = n || !!i.vertexArrayObject, s.srgbTextures = n || !!i.srgb, s.nonPowOf2wrapping = n, s.nonPowOf2mipmaps = n, s.msaa = n, s.uint32Indices || g("Provided WebGL context does not support 32 index buffer, large scenes may not render correctly");
  }
};
P.extension = {
  type: [
    d.WebGLSystem
  ],
  name: "context"
};
P.defaultOptions = {
  /**
   * {@link WebGLOptions.context}
   * @default null
   */
  context: null,
  /**
   * {@link WebGLOptions.premultipliedAlpha}
   * @default true
   */
  premultipliedAlpha: !0,
  /**
   * {@link WebGLOptions.preserveDrawingBuffer}
   * @default false
   */
  preserveDrawingBuffer: !1,
  /**
   * {@link WebGLOptions.powerPreference}
   * @default default
   */
  powerPreference: void 0,
  /**
   * {@link WebGLOptions.webGLVersion}
   * @default 2
   */
  preferWebGLVersion: 2,
  /**
   * {@link WebGLOptions.multiView}
   * @default false
   */
  multiView: !1
};
let ke = P;
var I = /* @__PURE__ */ ((t) => (t[t.RGBA = 6408] = "RGBA", t[t.RGB = 6407] = "RGB", t[t.RG = 33319] = "RG", t[t.RED = 6403] = "RED", t[t.RGBA_INTEGER = 36249] = "RGBA_INTEGER", t[t.RGB_INTEGER = 36248] = "RGB_INTEGER", t[t.RG_INTEGER = 33320] = "RG_INTEGER", t[t.RED_INTEGER = 36244] = "RED_INTEGER", t[t.ALPHA = 6406] = "ALPHA", t[t.LUMINANCE = 6409] = "LUMINANCE", t[t.LUMINANCE_ALPHA = 6410] = "LUMINANCE_ALPHA", t[t.DEPTH_COMPONENT = 6402] = "DEPTH_COMPONENT", t[t.DEPTH_STENCIL = 34041] = "DEPTH_STENCIL", t))(I || {}), re = /* @__PURE__ */ ((t) => (t[t.TEXTURE_2D = 3553] = "TEXTURE_2D", t[t.TEXTURE_CUBE_MAP = 34067] = "TEXTURE_CUBE_MAP", t[t.TEXTURE_2D_ARRAY = 35866] = "TEXTURE_2D_ARRAY", t[t.TEXTURE_CUBE_MAP_POSITIVE_X = 34069] = "TEXTURE_CUBE_MAP_POSITIVE_X", t[t.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070] = "TEXTURE_CUBE_MAP_NEGATIVE_X", t[t.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071] = "TEXTURE_CUBE_MAP_POSITIVE_Y", t[t.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072] = "TEXTURE_CUBE_MAP_NEGATIVE_Y", t[t.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073] = "TEXTURE_CUBE_MAP_POSITIVE_Z", t[t.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074] = "TEXTURE_CUBE_MAP_NEGATIVE_Z", t))(re || {}), l = /* @__PURE__ */ ((t) => (t[t.UNSIGNED_BYTE = 5121] = "UNSIGNED_BYTE", t[t.UNSIGNED_SHORT = 5123] = "UNSIGNED_SHORT", t[t.UNSIGNED_SHORT_5_6_5 = 33635] = "UNSIGNED_SHORT_5_6_5", t[t.UNSIGNED_SHORT_4_4_4_4 = 32819] = "UNSIGNED_SHORT_4_4_4_4", t[t.UNSIGNED_SHORT_5_5_5_1 = 32820] = "UNSIGNED_SHORT_5_5_5_1", t[t.UNSIGNED_INT = 5125] = "UNSIGNED_INT", t[t.UNSIGNED_INT_10F_11F_11F_REV = 35899] = "UNSIGNED_INT_10F_11F_11F_REV", t[t.UNSIGNED_INT_2_10_10_10_REV = 33640] = "UNSIGNED_INT_2_10_10_10_REV", t[t.UNSIGNED_INT_24_8 = 34042] = "UNSIGNED_INT_24_8", t[t.UNSIGNED_INT_5_9_9_9_REV = 35902] = "UNSIGNED_INT_5_9_9_9_REV", t[t.BYTE = 5120] = "BYTE", t[t.SHORT = 5122] = "SHORT", t[t.INT = 5124] = "INT", t[t.FLOAT = 5126] = "FLOAT", t[t.FLOAT_32_UNSIGNED_INT_24_8_REV = 36269] = "FLOAT_32_UNSIGNED_INT_24_8_REV", t[t.HALF_FLOAT = 36193] = "HALF_FLOAT", t))(l || {});
const H = {
  uint8x2: l.UNSIGNED_BYTE,
  uint8x4: l.UNSIGNED_BYTE,
  sint8x2: l.BYTE,
  sint8x4: l.BYTE,
  unorm8x2: l.UNSIGNED_BYTE,
  unorm8x4: l.UNSIGNED_BYTE,
  snorm8x2: l.BYTE,
  snorm8x4: l.BYTE,
  uint16x2: l.UNSIGNED_SHORT,
  uint16x4: l.UNSIGNED_SHORT,
  sint16x2: l.SHORT,
  sint16x4: l.SHORT,
  unorm16x2: l.UNSIGNED_SHORT,
  unorm16x4: l.UNSIGNED_SHORT,
  snorm16x2: l.SHORT,
  snorm16x4: l.SHORT,
  float16x2: l.HALF_FLOAT,
  float16x4: l.HALF_FLOAT,
  float32: l.FLOAT,
  float32x2: l.FLOAT,
  float32x3: l.FLOAT,
  float32x4: l.FLOAT,
  uint32: l.UNSIGNED_INT,
  uint32x2: l.UNSIGNED_INT,
  uint32x3: l.UNSIGNED_INT,
  uint32x4: l.UNSIGNED_INT,
  sint32: l.INT,
  sint32x2: l.INT,
  sint32x3: l.INT,
  sint32x4: l.INT
};
function Xe(t) {
  return H[t] ?? H.float32;
}
const We = {
  "point-list": 0,
  "line-list": 1,
  "line-strip": 3,
  "triangle-list": 4,
  "triangle-strip": 5
};
class se {
  /** @param renderer - The renderer this System works for. */
  constructor(e) {
    this._geometryVaoHash = /* @__PURE__ */ Object.create(null), this._renderer = e, this._activeGeometry = null, this._activeVao = null, this.hasVao = !0, this.hasInstance = !0, this._renderer.renderableGC.addManagedHash(this, "_geometryVaoHash");
  }
  /** Sets up the renderer context and necessary buffers. */
  contextChange() {
    const e = this.gl = this._renderer.gl;
    if (!this._renderer.context.supports.vertexArrayObject)
      throw new Error("[PixiJS] Vertex Array Objects are not supported on this device");
    const r = this._renderer.context.extensions.vertexArrayObject;
    r && (e.createVertexArray = () => r.createVertexArrayOES(), e.bindVertexArray = (n) => r.bindVertexArrayOES(n), e.deleteVertexArray = (n) => r.deleteVertexArrayOES(n));
    const s = this._renderer.context.extensions.vertexAttribDivisorANGLE;
    s && (e.drawArraysInstanced = (n, i, a, o) => {
      s.drawArraysInstancedANGLE(n, i, a, o);
    }, e.drawElementsInstanced = (n, i, a, o, c) => {
      s.drawElementsInstancedANGLE(n, i, a, o, c);
    }, e.vertexAttribDivisor = (n, i) => s.vertexAttribDivisorANGLE(n, i)), this._activeGeometry = null, this._activeVao = null, this._geometryVaoHash = /* @__PURE__ */ Object.create(null);
  }
  /**
   * Binds geometry so that is can be drawn. Creating a Vao if required
   * @param geometry - Instance of geometry to bind.
   * @param program - Instance of program to use vao for.
   */
  bind(e, r) {
    const s = this.gl;
    this._activeGeometry = e;
    const n = this.getVao(e, r);
    this._activeVao !== n && (this._activeVao = n, s.bindVertexArray(n)), this.updateBuffers();
  }
  /** Reset and unbind any active VAO and geometry. */
  reset() {
    this.unbind();
  }
  /** Update buffers of the currently bound geometry. */
  updateBuffers() {
    const e = this._activeGeometry, r = this._renderer.buffer;
    for (let s = 0; s < e.buffers.length; s++) {
      const n = e.buffers[s];
      r.updateBuffer(n);
    }
  }
  /**
   * Check compatibility between a geometry and a program
   * @param geometry - Geometry instance.
   * @param program - Program instance.
   */
  checkCompatibility(e, r) {
    const s = e.attributes, n = r._attributeData;
    for (const i in n)
      if (!s[i])
        throw new Error(`shader and geometry incompatible, geometry missing the "${i}" attribute`);
  }
  /**
   * Takes a geometry and program and generates a unique signature for them.
   * @param geometry - To get signature from.
   * @param program - To test geometry against.
   * @returns - Unique signature of the geometry and program
   */
  getSignature(e, r) {
    const s = e.attributes, n = r._attributeData, i = ["g", e.uid];
    for (const a in s)
      n[a] && i.push(a, n[a].location);
    return i.join("-");
  }
  getVao(e, r) {
    var s;
    return ((s = this._geometryVaoHash[e.uid]) == null ? void 0 : s[r._key]) || this.initGeometryVao(e, r);
  }
  /**
   * Creates or gets Vao with the same structure as the geometry and stores it on the geometry.
   * If vao is created, it is bound automatically. We use a shader to infer what and how to set up the
   * attribute locations.
   * @param geometry - Instance of geometry to to generate Vao for.
   * @param program
   * @param _incRefCount - Increment refCount of all geometry buffers.
   */
  initGeometryVao(e, r, s = !0) {
    const n = this._renderer.gl, i = this._renderer.buffer;
    this._renderer.shader._getProgramData(r), this.checkCompatibility(e, r);
    const a = this.getSignature(e, r);
    this._geometryVaoHash[e.uid] || (this._geometryVaoHash[e.uid] = /* @__PURE__ */ Object.create(null), e.on("destroy", this.onGeometryDestroy, this));
    const o = this._geometryVaoHash[e.uid];
    let c = o[a];
    if (c)
      return o[r._key] = c, c;
    Ue(e, r._attributeData);
    const u = e.buffers;
    c = n.createVertexArray(), n.bindVertexArray(c);
    for (let _ = 0; _ < u.length; _++) {
      const h = u[_];
      i.bind(h);
    }
    return this.activateVao(e, r), o[r._key] = c, o[a] = c, n.bindVertexArray(null), c;
  }
  /**
   * Disposes geometry.
   * @param geometry - Geometry with buffers. Only VAO will be disposed
   * @param [contextLost=false] - If context was lost, we suppress deleteVertexArray
   */
  onGeometryDestroy(e, r) {
    const s = this._geometryVaoHash[e.uid], n = this.gl;
    if (s) {
      if (r)
        for (const i in s)
          this._activeVao !== s[i] && this.unbind(), n.deleteVertexArray(s[i]);
      this._geometryVaoHash[e.uid] = null;
    }
  }
  /**
   * Dispose all WebGL resources of all managed geometries.
   * @param [contextLost=false] - If context was lost, we suppress `gl.delete` calls
   */
  destroyAll(e = !1) {
    const r = this.gl;
    for (const s in this._geometryVaoHash) {
      if (e)
        for (const n in this._geometryVaoHash[s]) {
          const i = this._geometryVaoHash[s];
          this._activeVao !== i && this.unbind(), r.deleteVertexArray(i[n]);
        }
      this._geometryVaoHash[s] = null;
    }
  }
  /**
   * Activate vertex array object.
   * @param geometry - Geometry instance.
   * @param program - Shader program instance.
   */
  activateVao(e, r) {
    var s;
    const n = this._renderer.gl, i = this._renderer.buffer, a = e.attributes;
    e.indexBuffer && i.bind(e.indexBuffer);
    let o = null;
    for (const c in a) {
      const u = a[c], _ = u.buffer, h = i.getGlBuffer(_), f = r._attributeData[c];
      if (f) {
        o !== h && (i.bind(_), o = h);
        const m = f.location;
        n.enableVertexAttribArray(m);
        const E = Y(u.format), M = Xe(u.format);
        if (((s = f.format) == null ? void 0 : s.substring(1, 4)) === "int" ? n.vertexAttribIPointer(
          m,
          E.size,
          M,
          u.stride,
          u.offset
        ) : n.vertexAttribPointer(
          m,
          E.size,
          M,
          E.normalised,
          u.stride,
          u.offset
        ), u.instance)
          if (this.hasInstance) {
            const pe = u.divisor ?? 1;
            n.vertexAttribDivisor(m, pe);
          } else
            throw new Error("geometry error, GPU Instancing is not supported on this device");
      }
    }
  }
  /**
   * Draws the currently bound geometry.
   * @param topology - The type primitive to render.
   * @param size - The number of elements to be rendered. If not specified, all vertices after the
   *  starting vertex will be drawn.
   * @param start - The starting vertex in the geometry to start drawing from. If not specified,
   *  drawing will start from the first vertex.
   * @param instanceCount - The number of instances of the set of elements to execute. If not specified,
   *  all instances will be drawn.
   */
  draw(e, r, s, n) {
    const { gl: i } = this._renderer, a = this._activeGeometry, o = We[a.topology || e];
    if (n || (n = a.instanceCount), a.indexBuffer) {
      const c = a.indexBuffer.data.BYTES_PER_ELEMENT, u = c === 2 ? i.UNSIGNED_SHORT : i.UNSIGNED_INT;
      n > 1 ? i.drawElementsInstanced(o, r || a.indexBuffer.data.length, u, (s || 0) * c, n) : i.drawElements(o, r || a.indexBuffer.data.length, u, (s || 0) * c);
    } else n > 1 ? i.drawArraysInstanced(o, s || 0, r || a.getSize(), n) : i.drawArrays(o, s || 0, r || a.getSize());
    return this;
  }
  /** Unbind/reset everything. */
  unbind() {
    this.gl.bindVertexArray(null), this._activeVao = null, this._activeGeometry = null;
  }
  destroy() {
    this._renderer = null, this.gl = null, this._activeVao = null, this._activeGeometry = null;
  }
}
se.extension = {
  type: [
    d.WebGLSystem
  ],
  name: "geometry"
};
const Ye = new ve({
  attributes: {
    aPosition: [
      -1,
      -1,
      // Bottom left corner
      3,
      -1,
      // Bottom right corner, extending beyond right edge
      -1,
      3
      // Top left corner, extending beyond top edge
    ]
  }
}), F = class ne {
  constructor(e) {
    this.useBackBuffer = !1, this._useBackBufferThisRender = !1, this._renderer = e;
  }
  init(e = {}) {
    const { useBackBuffer: r, antialias: s } = { ...ne.defaultOptions, ...e };
    this.useBackBuffer = r, this._antialias = s, this._renderer.context.supports.msaa || (g("antialiasing, is not supported on when using the back buffer"), this._antialias = !1), this._state = U.for2d();
    const n = new Be({
      vertex: `
                attribute vec2 aPosition;
                out vec2 vUv;

                void main() {
                    gl_Position = vec4(aPosition, 0.0, 1.0);

                    vUv = (aPosition + 1.0) / 2.0;

                    // flip dem UVs
                    vUv.y = 1.0 - vUv.y;
                }`,
      fragment: `
                in vec2 vUv;
                out vec4 finalColor;

                uniform sampler2D uTexture;

                void main() {
                    finalColor = texture(uTexture, vUv);
                }`,
      name: "big-triangle"
    });
    this._bigTriangleShader = new O({
      glProgram: n,
      resources: {
        uTexture: b.WHITE.source
      }
    });
  }
  /**
   * This is called before the RenderTargetSystem is started. This is where
   * we replace the target with the back buffer if required.
   * @param options - The options for this render.
   */
  renderStart(e) {
    const r = this._renderer.renderTarget.getRenderTarget(e.target);
    if (this._useBackBufferThisRender = this.useBackBuffer && !!r.isRoot, this._useBackBufferThisRender) {
      const s = this._renderer.renderTarget.getRenderTarget(e.target);
      this._targetTexture = s.colorTexture, e.target = this._getBackBufferTexture(s.colorTexture);
    }
  }
  renderEnd() {
    this._presentBackBuffer();
  }
  _presentBackBuffer() {
    const e = this._renderer;
    e.renderTarget.finishRenderPass(), this._useBackBufferThisRender && (e.renderTarget.bind(this._targetTexture, !1), this._bigTriangleShader.resources.uTexture = this._backBufferTexture.source, e.encoder.draw({
      geometry: Ye,
      shader: this._bigTriangleShader,
      state: this._state
    }));
  }
  _getBackBufferTexture(e) {
    return this._backBufferTexture = this._backBufferTexture || new b({
      source: new $({
        width: e.width,
        height: e.height,
        resolution: e._resolution,
        antialias: this._antialias
      })
    }), this._backBufferTexture.source.resize(
      e.width,
      e.height,
      e._resolution
    ), this._backBufferTexture;
  }
  /** destroys the back buffer */
  destroy() {
    this._backBufferTexture && (this._backBufferTexture.destroy(), this._backBufferTexture = null);
  }
};
F.extension = {
  type: [
    d.WebGLSystem
  ],
  name: "backBuffer",
  priority: 1
};
F.defaultOptions = {
  /** if true will use the back buffer where required */
  useBackBuffer: !1
};
let $e = F;
class ie {
  constructor(e) {
    this._colorMaskCache = 15, this._renderer = e;
  }
  setMask(e) {
    this._colorMaskCache !== e && (this._colorMaskCache = e, this._renderer.gl.colorMask(
      !!(e & 8),
      !!(e & 4),
      !!(e & 2),
      !!(e & 1)
    ));
  }
}
ie.extension = {
  type: [
    d.WebGLSystem
  ],
  name: "colorMask"
};
class ae {
  constructor(e) {
    this.commandFinished = Promise.resolve(), this._renderer = e;
  }
  setGeometry(e, r) {
    this._renderer.geometry.bind(e, r.glProgram);
  }
  finishRenderPass() {
  }
  draw(e) {
    const r = this._renderer, { geometry: s, shader: n, state: i, skipSync: a, topology: o, size: c, start: u, instanceCount: _ } = e;
    r.shader.bind(n, a), r.geometry.bind(s, r.shader._activeProgram), i && r.state.set(i), r.geometry.draw(o, c, u, _ ?? s.instanceCount);
  }
  destroy() {
    this._renderer = null;
  }
}
ae.extension = {
  type: [
    d.WebGLSystem
  ],
  name: "encoder"
};
class je {
  constructor() {
    this.width = -1, this.height = -1, this.msaa = !1, this.msaaRenderBuffer = [];
  }
}
class oe {
  constructor(e) {
    this._stencilCache = {
      enabled: !1,
      stencilReference: 0,
      stencilMode: R.NONE
    }, this._renderTargetStencilState = /* @__PURE__ */ Object.create(null), e.renderTarget.onRenderTargetChange.add(this);
  }
  contextChange(e) {
    this._gl = e, this._comparisonFuncMapping = {
      always: e.ALWAYS,
      never: e.NEVER,
      equal: e.EQUAL,
      "not-equal": e.NOTEQUAL,
      less: e.LESS,
      "less-equal": e.LEQUAL,
      greater: e.GREATER,
      "greater-equal": e.GEQUAL
    }, this._stencilOpsMapping = {
      keep: e.KEEP,
      zero: e.ZERO,
      replace: e.REPLACE,
      invert: e.INVERT,
      "increment-clamp": e.INCR,
      "decrement-clamp": e.DECR,
      "increment-wrap": e.INCR_WRAP,
      "decrement-wrap": e.DECR_WRAP
    }, this._stencilCache.enabled = !1, this._stencilCache.stencilMode = R.NONE, this._stencilCache.stencilReference = 0;
  }
  onRenderTargetChange(e) {
    if (this._activeRenderTarget === e)
      return;
    this._activeRenderTarget = e;
    let r = this._renderTargetStencilState[e.uid];
    r || (r = this._renderTargetStencilState[e.uid] = {
      stencilMode: R.DISABLED,
      stencilReference: 0
    }), this.setStencilMode(r.stencilMode, r.stencilReference);
  }
  setStencilMode(e, r) {
    const s = this._renderTargetStencilState[this._activeRenderTarget.uid], n = this._gl, i = Le[e], a = this._stencilCache;
    if (s.stencilMode = e, s.stencilReference = r, e === R.DISABLED) {
      this._stencilCache.enabled && (this._stencilCache.enabled = !1, n.disable(n.STENCIL_TEST));
      return;
    }
    this._stencilCache.enabled || (this._stencilCache.enabled = !0, n.enable(n.STENCIL_TEST)), (e !== a.stencilMode || a.stencilReference !== r) && (a.stencilMode = e, a.stencilReference = r, n.stencilFunc(this._comparisonFuncMapping[i.stencilBack.compare], r, 255), n.stencilOp(n.KEEP, n.KEEP, this._stencilOpsMapping[i.stencilBack.passOp]));
  }
}
oe.extension = {
  type: [
    d.WebGLSystem
  ],
  name: "stencil"
};
const ce = {
  f32: 4,
  "vec2<f32>": 8,
  "vec3<f32>": 12,
  "vec4<f32>": 16,
  "mat2x2<f32>": 16 * 2,
  "mat3x3<f32>": 16 * 3,
  "mat4x4<f32>": 16 * 4
  // TODO - not essential for now but support these in the future
  // int:      4,
  // ivec2:    8,
  // ivec3:    12,
  // ivec4:    16,
  // uint:     4,
  // uvec2:    8,
  // uvec3:    12,
  // uvec4:    16,
  // bool:     4,
  // bvec2:    8,
  // bvec3:    12,
  // bvec4:    16,
  // mat2:     16 * 2,
  // mat3:     16 * 3,
  // mat4:     16 * 4,
};
function ze(t) {
  const e = t.map((i) => ({
    data: i,
    offset: 0,
    size: 0
  }));
  let r = 0, s = 0, n = 0;
  for (let i = 0; i < e.length; i++) {
    const a = e[i];
    if (r = ce[a.data.type], !r)
      throw new Error(`Unknown type ${a.data.type}`);
    if (a.data.size > 1 && (r = Math.max(r, 16) * a.data.size), a.size = r, s % r !== 0 && s < 16) {
      const o = s % r % 16;
      s += o, n += o;
    }
    s + r > 16 ? (n = Math.ceil(n / 16) * 16, a.offset = n, n += r, s = r) : (a.offset = n, s += r, n += r);
  }
  return n = Math.ceil(n / 16) * 16, { uboElements: e, size: n };
}
function Ke(t, e) {
  const r = Math.max(ce[t.data.type] / 16, 1), s = t.data.value.length / t.data.size, n = (4 - s % 4) % 4;
  return `
        v = uv.${t.data.name};
        offset += ${e};

        arrayOffset = offset;

        t = 0;

        for(var i=0; i < ${t.data.size * r}; i++)
        {
            for(var j = 0; j < ${s}; j++)
            {
                data[arrayOffset++] = v[t++];
            }
            ${n !== 0 ? `arrayOffset += ${n};` : ""}
        }
    `;
}
function qe(t) {
  return He(
    t,
    "uboStd40",
    Ke,
    we
  );
}
class ue extends Pe {
  constructor() {
    super({
      createUboElements: ze,
      generateUboSync: qe
    });
  }
}
ue.extension = {
  type: [d.WebGLSystem],
  name: "ubo"
};
class Ze {
  constructor() {
    this._clearColorCache = [0, 0, 0, 0], this._viewPortCache = new L();
  }
  init(e, r) {
    this._renderer = e, this._renderTargetSystem = r, e.runners.contextChange.add(this);
  }
  contextChange() {
    this._clearColorCache = [0, 0, 0, 0], this._viewPortCache = new L();
  }
  copyToTexture(e, r, s, n, i) {
    const a = this._renderTargetSystem, o = this._renderer, c = a.getGpuRenderTarget(e), u = o.gl;
    return this.finishRenderPass(e), u.bindFramebuffer(u.FRAMEBUFFER, c.resolveTargetFramebuffer), o.texture.bind(r, 0), u.copyTexSubImage2D(
      u.TEXTURE_2D,
      0,
      i.x,
      i.y,
      s.x,
      s.y,
      n.width,
      n.height
    ), r;
  }
  startRenderPass(e, r = !0, s, n) {
    const i = this._renderTargetSystem, a = e.colorTexture, o = i.getGpuRenderTarget(e);
    let c = n.y;
    e.isRoot && (c = a.pixelHeight - n.height), e.colorTextures.forEach((h) => {
      this._renderer.texture.unbind(h);
    });
    const u = this._renderer.gl;
    u.bindFramebuffer(u.FRAMEBUFFER, o.framebuffer);
    const _ = this._viewPortCache;
    (_.x !== n.x || _.y !== c || _.width !== n.width || _.height !== n.height) && (_.x = n.x, _.y = c, _.width = n.width, _.height = n.height, u.viewport(
      n.x,
      c,
      n.width,
      n.height
    )), !o.depthStencilRenderBuffer && (e.stencil || e.depth) && this._initStencil(o), this.clear(e, r, s);
  }
  finishRenderPass(e) {
    const r = this._renderTargetSystem.getGpuRenderTarget(e);
    if (!r.msaa)
      return;
    const s = this._renderer.gl;
    s.bindFramebuffer(s.FRAMEBUFFER, r.resolveTargetFramebuffer), s.bindFramebuffer(s.READ_FRAMEBUFFER, r.framebuffer), s.blitFramebuffer(
      0,
      0,
      r.width,
      r.height,
      0,
      0,
      r.width,
      r.height,
      s.COLOR_BUFFER_BIT,
      s.NEAREST
    ), s.bindFramebuffer(s.FRAMEBUFFER, r.framebuffer);
  }
  initGpuRenderTarget(e) {
    const r = this._renderer, s = r.gl, n = new je();
    return e.colorTexture.resource === r.canvas ? (this._renderer.context.ensureCanvasSize(e.colorTexture.resource), n.framebuffer = null, n) : (this._initColor(e, n), s.bindFramebuffer(s.FRAMEBUFFER, null), n);
  }
  destroyGpuRenderTarget(e) {
    const r = this._renderer.gl;
    e.framebuffer && (r.deleteFramebuffer(e.framebuffer), e.framebuffer = null), e.resolveTargetFramebuffer && (r.deleteFramebuffer(e.resolveTargetFramebuffer), e.resolveTargetFramebuffer = null), e.depthStencilRenderBuffer && (r.deleteRenderbuffer(e.depthStencilRenderBuffer), e.depthStencilRenderBuffer = null), e.msaaRenderBuffer.forEach((s) => {
      r.deleteRenderbuffer(s);
    }), e.msaaRenderBuffer = null;
  }
  clear(e, r, s) {
    if (!r)
      return;
    const n = this._renderTargetSystem;
    typeof r == "boolean" && (r = r ? N.ALL : N.NONE);
    const i = this._renderer.gl;
    if (r & N.COLOR) {
      s ?? (s = n.defaultClearColor);
      const a = this._clearColorCache, o = s;
      (a[0] !== o[0] || a[1] !== o[1] || a[2] !== o[2] || a[3] !== o[3]) && (a[0] = o[0], a[1] = o[1], a[2] = o[2], a[3] = o[3], i.clearColor(o[0], o[1], o[2], o[3]));
    }
    i.clear(r);
  }
  resizeGpuRenderTarget(e) {
    if (e.isRoot)
      return;
    const r = this._renderTargetSystem.getGpuRenderTarget(e);
    this._resizeColor(e, r), (e.stencil || e.depth) && this._resizeStencil(r);
  }
  _initColor(e, r) {
    const s = this._renderer, n = s.gl, i = n.createFramebuffer();
    if (r.resolveTargetFramebuffer = i, n.bindFramebuffer(n.FRAMEBUFFER, i), r.width = e.colorTexture.source.pixelWidth, r.height = e.colorTexture.source.pixelHeight, e.colorTextures.forEach((a, o) => {
      const c = a.source;
      c.antialias && (s.context.supports.msaa ? r.msaa = !0 : g("[RenderTexture] Antialiasing on textures is not supported in WebGL1")), s.texture.bindSource(c, 0);
      const u = s.texture.getGlSource(c).texture;
      n.framebufferTexture2D(
        n.FRAMEBUFFER,
        n.COLOR_ATTACHMENT0 + o,
        3553,
        // texture.target,
        u,
        0
      );
    }), r.msaa) {
      const a = n.createFramebuffer();
      r.framebuffer = a, n.bindFramebuffer(n.FRAMEBUFFER, a), e.colorTextures.forEach((o, c) => {
        const u = n.createRenderbuffer();
        r.msaaRenderBuffer[c] = u;
      });
    } else
      r.framebuffer = i;
    this._resizeColor(e, r);
  }
  _resizeColor(e, r) {
    const s = e.colorTexture.source;
    if (r.width = s.pixelWidth, r.height = s.pixelHeight, e.colorTextures.forEach((n, i) => {
      i !== 0 && n.source.resize(s.width, s.height, s._resolution);
    }), r.msaa) {
      const n = this._renderer, i = n.gl, a = r.framebuffer;
      i.bindFramebuffer(i.FRAMEBUFFER, a), e.colorTextures.forEach((o, c) => {
        const u = o.source;
        n.texture.bindSource(u, 0);
        const _ = n.texture.getGlSource(u).internalFormat, h = r.msaaRenderBuffer[c];
        i.bindRenderbuffer(
          i.RENDERBUFFER,
          h
        ), i.renderbufferStorageMultisample(
          i.RENDERBUFFER,
          4,
          _,
          u.pixelWidth,
          u.pixelHeight
        ), i.framebufferRenderbuffer(
          i.FRAMEBUFFER,
          i.COLOR_ATTACHMENT0 + c,
          i.RENDERBUFFER,
          h
        );
      });
    }
  }
  _initStencil(e) {
    if (e.framebuffer === null)
      return;
    const r = this._renderer.gl, s = r.createRenderbuffer();
    e.depthStencilRenderBuffer = s, r.bindRenderbuffer(
      r.RENDERBUFFER,
      s
    ), r.framebufferRenderbuffer(
      r.FRAMEBUFFER,
      r.DEPTH_STENCIL_ATTACHMENT,
      r.RENDERBUFFER,
      s
    ), this._resizeStencil(e);
  }
  _resizeStencil(e) {
    const r = this._renderer.gl;
    r.bindRenderbuffer(
      r.RENDERBUFFER,
      e.depthStencilRenderBuffer
    ), e.msaa ? r.renderbufferStorageMultisample(
      r.RENDERBUFFER,
      4,
      r.DEPTH24_STENCIL8,
      e.width,
      e.height
    ) : r.renderbufferStorage(
      r.RENDERBUFFER,
      this._renderer.context.webGLVersion === 2 ? r.DEPTH24_STENCIL8 : r.DEPTH_STENCIL,
      e.width,
      e.height
    );
  }
  postrender(e) {
    if (this._renderer.context.multiView && De.test(e.colorTexture.resource)) {
      const r = this._renderer.context.canvas, s = e.colorTexture;
      s.context2D.drawImage(
        r,
        0,
        s.pixelHeight - r.height
      );
    }
  }
}
class _e extends Fe {
  constructor(e) {
    super(e), this.adaptor = new Ze(), this.adaptor.init(e, this);
  }
}
_e.extension = {
  type: [d.WebGLSystem],
  name: "renderTarget"
};
function Je(t, e) {
  const r = [], s = [`
        var g = s.groups;
        var sS = r.shader;
        var p = s.glProgram;
        var ugS = r.uniformGroup;
        var resources;
    `];
  let n = !1, i = 0, a = 0;
  const o = e._getProgramData(t.glProgram);
  for (const u in t.groups) {
    const _ = t.groups[u];
    r.push(`
            resources = g[${u}].resources;
        `);
    for (const h in _.resources) {
      const f = _.resources[h];
      if (f instanceof y)
        f.ubo ? r.push(`
                        sS.bindUniformBlock(
                            resources[${h}],
                            sS._uniformBindMap[${u}[${h}],
                            ${i++}
                        );
                    `) : r.push(`
                        ugS.updateUniformGroup(resources[${h}], p, sD);
                    `);
      else if (f instanceof J)
        r.push(`
                    sS.bindUniformBlock(
                        resources[${h}],
                        sS._uniformBindMap[${u}[${h}],
                        ${i++}
                    );
                `);
      else if (f instanceof $) {
        const m = t._uniformBindMap[u][h], E = o.uniformData[m];
        E && (n || (n = !0, s.push(`
                        var tS = r.texture;
                        `)), e._gl.uniform1i(E.location, a), r.push(`
                        tS.bind(resources[${h}], ${a});
                    `), a++);
      }
    }
  }
  const c = [...s, ...r].join(`
`);
  return new Function("r", "s", "sD", c);
}
class Qe {
  /**
   * Makes a new Pixi program.
   * @param program - webgl program
   * @param uniformData - uniforms
   */
  constructor(e, r) {
    this.program = e, this.uniformData = r, this.uniformGroups = {}, this.uniformDirtyGroups = {}, this.uniformBlockBindings = {};
  }
  /** Destroys this program. */
  destroy() {
    this.uniformData = null, this.uniformGroups = null, this.uniformDirtyGroups = null, this.uniformBlockBindings = null, this.program = null;
  }
}
function w(t, e, r) {
  const s = t.createShader(e);
  return t.shaderSource(s, r), t.compileShader(s), s;
}
function G(t) {
  const e = new Array(t);
  for (let r = 0; r < e.length; r++)
    e[r] = !1;
  return e;
}
function le(t, e) {
  switch (t) {
    case "float":
      return 0;
    case "vec2":
      return new Float32Array(2 * e);
    case "vec3":
      return new Float32Array(3 * e);
    case "vec4":
      return new Float32Array(4 * e);
    case "int":
    case "uint":
    case "sampler2D":
    case "sampler2DArray":
      return 0;
    case "ivec2":
      return new Int32Array(2 * e);
    case "ivec3":
      return new Int32Array(3 * e);
    case "ivec4":
      return new Int32Array(4 * e);
    case "uvec2":
      return new Uint32Array(2 * e);
    case "uvec3":
      return new Uint32Array(3 * e);
    case "uvec4":
      return new Uint32Array(4 * e);
    case "bool":
      return !1;
    case "bvec2":
      return G(2 * e);
    case "bvec3":
      return G(3 * e);
    case "bvec4":
      return G(4 * e);
    case "mat2":
      return new Float32Array([
        1,
        0,
        0,
        1
      ]);
    case "mat3":
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
    case "mat4":
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
let S = null;
const V = {
  FLOAT: "float",
  FLOAT_VEC2: "vec2",
  FLOAT_VEC3: "vec3",
  FLOAT_VEC4: "vec4",
  INT: "int",
  INT_VEC2: "ivec2",
  INT_VEC3: "ivec3",
  INT_VEC4: "ivec4",
  UNSIGNED_INT: "uint",
  UNSIGNED_INT_VEC2: "uvec2",
  UNSIGNED_INT_VEC3: "uvec3",
  UNSIGNED_INT_VEC4: "uvec4",
  BOOL: "bool",
  BOOL_VEC2: "bvec2",
  BOOL_VEC3: "bvec3",
  BOOL_VEC4: "bvec4",
  FLOAT_MAT2: "mat2",
  FLOAT_MAT3: "mat3",
  FLOAT_MAT4: "mat4",
  SAMPLER_2D: "sampler2D",
  INT_SAMPLER_2D: "sampler2D",
  UNSIGNED_INT_SAMPLER_2D: "sampler2D",
  SAMPLER_CUBE: "samplerCube",
  INT_SAMPLER_CUBE: "samplerCube",
  UNSIGNED_INT_SAMPLER_CUBE: "samplerCube",
  SAMPLER_2D_ARRAY: "sampler2DArray",
  INT_SAMPLER_2D_ARRAY: "sampler2DArray",
  UNSIGNED_INT_SAMPLER_2D_ARRAY: "sampler2DArray"
}, et = {
  float: "float32",
  vec2: "float32x2",
  vec3: "float32x3",
  vec4: "float32x4",
  int: "sint32",
  ivec2: "sint32x2",
  ivec3: "sint32x3",
  ivec4: "sint32x4",
  uint: "uint32",
  uvec2: "uint32x2",
  uvec3: "uint32x3",
  uvec4: "uint32x4",
  bool: "uint32",
  bvec2: "uint32x2",
  bvec3: "uint32x3",
  bvec4: "uint32x4"
};
function he(t, e) {
  if (!S) {
    const r = Object.keys(V);
    S = {};
    for (let s = 0; s < r.length; ++s) {
      const n = r[s];
      S[t[n]] = V[n];
    }
  }
  return S[e];
}
function tt(t, e) {
  const r = he(t, e);
  return et[r] || "float32";
}
function rt(t, e, r = !1) {
  const s = {}, n = e.getProgramParameter(t, e.ACTIVE_ATTRIBUTES);
  for (let a = 0; a < n; a++) {
    const o = e.getActiveAttrib(t, a);
    if (o.name.startsWith("gl_"))
      continue;
    const c = tt(e, o.type);
    s[o.name] = {
      location: 0,
      // set further down..
      format: c,
      stride: Y(c).stride,
      offset: 0,
      instance: !1,
      start: 0
    };
  }
  const i = Object.keys(s);
  if (r) {
    i.sort((a, o) => a > o ? 1 : -1);
    for (let a = 0; a < i.length; a++)
      s[i[a]].location = a, e.bindAttribLocation(t, a, i[a]);
    e.linkProgram(t);
  } else
    for (let a = 0; a < i.length; a++)
      s[i[a]].location = e.getAttribLocation(t, i[a]);
  return s;
}
function st(t, e) {
  if (!e.ACTIVE_UNIFORM_BLOCKS)
    return {};
  const r = {}, s = e.getProgramParameter(t, e.ACTIVE_UNIFORM_BLOCKS);
  for (let n = 0; n < s; n++) {
    const i = e.getActiveUniformBlockName(t, n), a = e.getUniformBlockIndex(t, i), o = e.getActiveUniformBlockParameter(t, n, e.UNIFORM_BLOCK_DATA_SIZE);
    r[i] = {
      name: i,
      index: a,
      size: o
    };
  }
  return r;
}
function nt(t, e) {
  const r = {}, s = e.getProgramParameter(t, e.ACTIVE_UNIFORMS);
  for (let n = 0; n < s; n++) {
    const i = e.getActiveUniform(t, n), a = i.name.replace(/\[.*?\]$/, ""), o = !!i.name.match(/\[.*?\]$/), c = he(e, i.type);
    r[a] = {
      name: a,
      index: n,
      type: c,
      size: i.size,
      isArray: o,
      value: le(c, i.size)
    };
  }
  return r;
}
function k(t, e) {
  const r = t.getShaderSource(e).split(`
`).map((u, _) => `${_}: ${u}`), s = t.getShaderInfoLog(e), n = s.split(`
`), i = {}, a = n.map((u) => parseFloat(u.replace(/^ERROR\: 0\:([\d]+)\:.*$/, "$1"))).filter((u) => u && !i[u] ? (i[u] = !0, !0) : !1), o = [""];
  a.forEach((u) => {
    r[u - 1] = `%c${r[u - 1]}%c`, o.push("background: #FF0000; color:#FFFFFF; font-size: 10px", "font-size: 10px");
  });
  const c = r.join(`
`);
  o[0] = c, console.error(s), console.groupCollapsed("click to view full shader code"), console.warn(...o), console.groupEnd();
}
function it(t, e, r, s) {
  t.getProgramParameter(e, t.LINK_STATUS) || (t.getShaderParameter(r, t.COMPILE_STATUS) || k(t, r), t.getShaderParameter(s, t.COMPILE_STATUS) || k(t, s), console.error("PixiJS Error: Could not initialize shader."), t.getProgramInfoLog(e) !== "" && console.warn("PixiJS Warning: gl.getProgramInfoLog()", t.getProgramInfoLog(e)));
}
function at(t, e) {
  const r = w(t, t.VERTEX_SHADER, e.vertex), s = w(t, t.FRAGMENT_SHADER, e.fragment), n = t.createProgram();
  t.attachShader(n, r), t.attachShader(n, s);
  const i = e.transformFeedbackVaryings;
  i && (typeof t.transformFeedbackVaryings != "function" ? g("TransformFeedback is not supported but TransformFeedbackVaryings are given.") : t.transformFeedbackVaryings(
    n,
    i.names,
    i.bufferMode === "separate" ? t.SEPARATE_ATTRIBS : t.INTERLEAVED_ATTRIBS
  )), t.linkProgram(n), t.getProgramParameter(n, t.LINK_STATUS) || it(t, n, r, s), e._attributeData = rt(
    n,
    t,
    !/^[ \t]*#[ \t]*version[ \t]+300[ \t]+es[ \t]*$/m.test(e.vertex)
  ), e._uniformData = nt(n, t), e._uniformBlockData = st(n, t), t.deleteShader(r), t.deleteShader(s);
  const a = {};
  for (const o in e._uniformData) {
    const c = e._uniformData[o];
    a[o] = {
      location: t.getUniformLocation(n, o),
      value: le(c.type, c.size)
    };
  }
  return new Qe(n, a);
}
const x = {
  textureCount: 0,
  blockIndex: 0
};
class de {
  constructor(e) {
    this._activeProgram = null, this._programDataHash = /* @__PURE__ */ Object.create(null), this._nextIndex = 0, this._boundUniformsIdsToIndexHash = /* @__PURE__ */ Object.create(null), this._boundIndexToUniformsHash = /* @__PURE__ */ Object.create(null), this._shaderSyncFunctions = /* @__PURE__ */ Object.create(null), this._renderer = e, this._renderer.renderableGC.addManagedHash(this, "_programDataHash");
  }
  contextChange(e) {
    this._gl = e, this._maxBindings = e.MAX_UNIFORM_BUFFER_BINDINGS ? e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS) : 0, this._programDataHash = /* @__PURE__ */ Object.create(null), this._boundUniformsIdsToIndexHash = /* @__PURE__ */ Object.create(null), this._boundIndexToUniformsHash = /* @__PURE__ */ Object.create(null), this._shaderSyncFunctions = /* @__PURE__ */ Object.create(null), this._activeProgram = null, this.maxTextures = j();
  }
  /**
   * Changes the current shader to the one given in parameter.
   * @param shader - the new shader
   * @param skipSync - false if the shader should automatically sync its uniforms.
   * @returns the glProgram that belongs to the shader.
   */
  bind(e, r) {
    if (this._setProgram(e.glProgram), r)
      return;
    x.textureCount = 0, x.blockIndex = 0;
    let s = this._shaderSyncFunctions[e.glProgram._key];
    s || (s = this._shaderSyncFunctions[e.glProgram._key] = this._generateShaderSync(e, this)), s(this._renderer, e, x);
  }
  /**
   * Updates the uniform group.
   * @param uniformGroup - the uniform group to update
   */
  updateUniformGroup(e) {
    this._renderer.uniformGroup.updateUniformGroup(e, this._activeProgram, x);
  }
  /**
   * Binds a uniform block to the shader.
   * @param uniformGroup - the uniform group to bind
   * @param name - the name of the uniform block
   * @param index - the index of the uniform block
   */
  bindUniformBlock(e, r, s = 0) {
    const n = this._renderer.buffer, i = this._getProgramData(this._activeProgram), a = e._bufferResource;
    a && this._renderer.ubo.updateUniformGroup(e), n.updateBuffer(e.buffer);
    let o = this._boundUniformsIdsToIndexHash[e.uid];
    if (o === void 0) {
      const _ = this._nextIndex++ % this._maxBindings, h = this._boundIndexToUniformsHash[_];
      h && (this._boundUniformsIdsToIndexHash[h.uid] = void 0), o = this._boundUniformsIdsToIndexHash[e.uid] = _, this._boundIndexToUniformsHash[_] = e, a ? n.bindBufferRange(e.buffer, _, e.offset) : n.bindBufferBase(e.buffer, _);
    }
    const c = this._gl, u = this._activeProgram._uniformBlockData[r].index;
    i.uniformBlockBindings[s] !== o && (i.uniformBlockBindings[s] = o, c.uniformBlockBinding(i.program, u, o));
  }
  _setProgram(e) {
    if (this._activeProgram === e)
      return;
    this._activeProgram = e;
    const r = this._getProgramData(e);
    this._gl.useProgram(r.program);
  }
  /**
   * @param program - the program to get the data for
   * @internal
   * @private
   */
  _getProgramData(e) {
    return this._programDataHash[e._key] || this._createProgramData(e);
  }
  _createProgramData(e) {
    const r = e._key;
    return this._programDataHash[r] = at(this._gl, e), this._programDataHash[r];
  }
  destroy() {
    for (const e of Object.keys(this._programDataHash))
      this._programDataHash[e].destroy(), this._programDataHash[e] = null;
    this._programDataHash = null, this._boundUniformsIdsToIndexHash = null;
  }
  /**
   * Creates a function that can be executed that will sync the shader as efficiently as possible.
   * Overridden by the unsafe eval package if you don't want eval used in your project.
   * @param shader - the shader to generate the sync function for
   * @param shaderSystem - the shader system to use
   * @returns - the generated sync function
   * @ignore
   */
  _generateShaderSync(e, r) {
    return Je(e, r);
  }
}
de.extension = {
  type: [
    d.WebGLSystem
  ],
  name: "shader"
};
const ot = {
  f32: `if (cv !== v) {
            cu.value = v;
            gl.uniform1f(location, v);
        }`,
  "vec2<f32>": `if (cv[0] !== v[0] || cv[1] !== v[1]) {
            cv[0] = v[0];
            cv[1] = v[1];
            gl.uniform2f(location, v[0], v[1]);
        }`,
  "vec3<f32>": `if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            gl.uniform3f(location, v[0], v[1], v[2]);
        }`,
  "vec4<f32>": `if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            cv[3] = v[3];
            gl.uniform4f(location, v[0], v[1], v[2], v[3]);
        }`,
  i32: `if (cv !== v) {
            cu.value = v;
            gl.uniform1i(location, v);
        }`,
  "vec2<i32>": `if (cv[0] !== v[0] || cv[1] !== v[1]) {
            cv[0] = v[0];
            cv[1] = v[1];
            gl.uniform2i(location, v[0], v[1]);
        }`,
  "vec3<i32>": `if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            gl.uniform3i(location, v[0], v[1], v[2]);
        }`,
  "vec4<i32>": `if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            cv[3] = v[3];
            gl.uniform4i(location, v[0], v[1], v[2], v[3]);
        }`,
  u32: `if (cv !== v) {
            cu.value = v;
            gl.uniform1ui(location, v);
        }`,
  "vec2<u32>": `if (cv[0] !== v[0] || cv[1] !== v[1]) {
            cv[0] = v[0];
            cv[1] = v[1];
            gl.uniform2ui(location, v[0], v[1]);
        }`,
  "vec3<u32>": `if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            gl.uniform3ui(location, v[0], v[1], v[2]);
        }`,
  "vec4<u32>": `if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            cv[3] = v[3];
            gl.uniform4ui(location, v[0], v[1], v[2], v[3]);
        }`,
  bool: `if (cv !== v) {
            cu.value = v;
            gl.uniform1i(location, v);
        }`,
  "vec2<bool>": `if (cv[0] !== v[0] || cv[1] !== v[1]) {
            cv[0] = v[0];
            cv[1] = v[1];
            gl.uniform2i(location, v[0], v[1]);
        }`,
  "vec3<bool>": `if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            gl.uniform3i(location, v[0], v[1], v[2]);
        }`,
  "vec4<bool>": `if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            cv[3] = v[3];
            gl.uniform4i(location, v[0], v[1], v[2], v[3]);
        }`,
  "mat2x2<f32>": "gl.uniformMatrix2fv(location, false, v);",
  "mat3x3<f32>": "gl.uniformMatrix3fv(location, false, v);",
  "mat4x4<f32>": "gl.uniformMatrix4fv(location, false, v);"
}, ct = {
  f32: "gl.uniform1fv(location, v);",
  "vec2<f32>": "gl.uniform2fv(location, v);",
  "vec3<f32>": "gl.uniform3fv(location, v);",
  "vec4<f32>": "gl.uniform4fv(location, v);",
  "mat2x2<f32>": "gl.uniformMatrix2fv(location, false, v);",
  "mat3x3<f32>": "gl.uniformMatrix3fv(location, false, v);",
  "mat4x4<f32>": "gl.uniformMatrix4fv(location, false, v);",
  i32: "gl.uniform1iv(location, v);",
  "vec2<i32>": "gl.uniform2iv(location, v);",
  "vec3<i32>": "gl.uniform3iv(location, v);",
  "vec4<i32>": "gl.uniform4iv(location, v);",
  u32: "gl.uniform1iv(location, v);",
  "vec2<u32>": "gl.uniform2iv(location, v);",
  "vec3<u32>": "gl.uniform3iv(location, v);",
  "vec4<u32>": "gl.uniform4iv(location, v);",
  bool: "gl.uniform1iv(location, v);",
  "vec2<bool>": "gl.uniform2iv(location, v);",
  "vec3<bool>": "gl.uniform3iv(location, v);",
  "vec4<bool>": "gl.uniform4iv(location, v);"
};
function ut(t, e) {
  const r = [`
        var v = null;
        var cv = null;
        var cu = null;
        var t = 0;
        var gl = renderer.gl;
        var name = null;
    `];
  for (const s in t.uniforms) {
    if (!e[s]) {
      t.uniforms[s] instanceof y ? t.uniforms[s].ubo ? r.push(`
                        renderer.shader.bindUniformBlock(uv.${s}, "${s}");
                    `) : r.push(`
                        renderer.shader.updateUniformGroup(uv.${s});
                    `) : t.uniforms[s] instanceof J && r.push(`
                        renderer.shader.bindBufferResource(uv.${s}, "${s}");
                    `);
      continue;
    }
    const n = t.uniformStructures[s];
    let i = !1;
    for (let a = 0; a < B.length; a++) {
      const o = B[a];
      if (n.type === o.type && o.test(n)) {
        r.push(`name = "${s}";`, B[a].uniform), i = !0;
        break;
      }
    }
    if (!i) {
      const a = (n.size === 1 ? ot : ct)[n.type].replace("location", `ud["${s}"].location`);
      r.push(`
            cu = ud["${s}"];
            cv = cu.value;
            v = uv["${s}"];
            ${a};`);
    }
  }
  return new Function("ud", "uv", "renderer", "syncData", r.join(`
`));
}
class fe {
  /** @param renderer - The renderer this System works for. */
  constructor(e) {
    this._cache = {}, this._uniformGroupSyncHash = {}, this._renderer = e, this.gl = null, this._cache = {};
  }
  contextChange(e) {
    this.gl = e;
  }
  /**
   * Uploads the uniforms values to the currently bound shader.
   * @param group - the uniforms values that be applied to the current shader
   * @param program
   * @param syncData
   * @param syncData.textureCount
   */
  updateUniformGroup(e, r, s) {
    const n = this._renderer.shader._getProgramData(r);
    (!e.isStatic || e._dirtyId !== n.uniformDirtyGroups[e.uid]) && (n.uniformDirtyGroups[e.uid] = e._dirtyId, this._getUniformSyncFunction(e, r)(n.uniformData, e.uniforms, this._renderer, s));
  }
  /**
   * Overridable by the pixi.js/unsafe-eval package to use static syncUniforms instead.
   * @param group
   * @param program
   */
  _getUniformSyncFunction(e, r) {
    var s;
    return ((s = this._uniformGroupSyncHash[e._signature]) == null ? void 0 : s[r._key]) || this._createUniformSyncFunction(e, r);
  }
  _createUniformSyncFunction(e, r) {
    const s = this._uniformGroupSyncHash[e._signature] || (this._uniformGroupSyncHash[e._signature] = {}), n = this._getSignature(e, r._uniformData, "u");
    return this._cache[n] || (this._cache[n] = this._generateUniformsSync(e, r._uniformData)), s[r._key] = this._cache[n], s[r._key];
  }
  _generateUniformsSync(e, r) {
    return ut(e, r);
  }
  /**
   * Takes a uniform group and data and generates a unique signature for them.
   * @param group - The uniform group to get signature of
   * @param group.uniforms
   * @param uniformData - Uniform information generated by the shader
   * @param preFix
   * @returns Unique signature of the uniform group
   */
  _getSignature(e, r, s) {
    const n = e.uniforms, i = [`${s}-`];
    for (const a in n)
      i.push(a), r[a] && i.push(r[a].type);
    return i.join("-");
  }
  /** Destroys this System and removes all its textures. */
  destroy() {
    this._renderer = null, this._cache = null;
  }
}
fe.extension = {
  type: [
    d.WebGLSystem
  ],
  name: "uniformGroup"
};
function _t(t) {
  const e = {};
  if (e.normal = [t.ONE, t.ONE_MINUS_SRC_ALPHA], e.add = [t.ONE, t.ONE], e.multiply = [t.DST_COLOR, t.ONE_MINUS_SRC_ALPHA, t.ONE, t.ONE_MINUS_SRC_ALPHA], e.screen = [t.ONE, t.ONE_MINUS_SRC_COLOR, t.ONE, t.ONE_MINUS_SRC_ALPHA], e.none = [0, 0], e["normal-npm"] = [t.SRC_ALPHA, t.ONE_MINUS_SRC_ALPHA, t.ONE, t.ONE_MINUS_SRC_ALPHA], e["add-npm"] = [t.SRC_ALPHA, t.ONE, t.ONE, t.ONE], e["screen-npm"] = [t.SRC_ALPHA, t.ONE_MINUS_SRC_COLOR, t.ONE, t.ONE_MINUS_SRC_ALPHA], e.erase = [t.ZERO, t.ONE_MINUS_SRC_ALPHA], !(t instanceof T.get().getWebGLRenderingContext()))
    e.min = [t.ONE, t.ONE, t.ONE, t.ONE, t.MIN, t.MIN], e.max = [t.ONE, t.ONE, t.ONE, t.ONE, t.MAX, t.MAX];
  else {
    const r = t.getExtension("EXT_blend_minmax");
    r && (e.min = [t.ONE, t.ONE, t.ONE, t.ONE, r.MIN_EXT, r.MIN_EXT], e.max = [t.ONE, t.ONE, t.ONE, t.ONE, r.MAX_EXT, r.MAX_EXT]);
  }
  return e;
}
const lt = 0, ht = 1, dt = 2, ft = 3, gt = 4, mt = 5, ge = class D {
  constructor() {
    this.gl = null, this.stateId = 0, this.polygonOffset = 0, this.blendMode = "none", this._blendEq = !1, this.map = [], this.map[lt] = this.setBlend, this.map[ht] = this.setOffset, this.map[dt] = this.setCullFace, this.map[ft] = this.setDepthTest, this.map[gt] = this.setFrontFace, this.map[mt] = this.setDepthMask, this.checks = [], this.defaultState = U.for2d();
  }
  contextChange(e) {
    this.gl = e, this.blendModesMap = _t(e), this.reset();
  }
  /**
   * Sets the current state
   * @param {*} state - The state to set.
   */
  set(e) {
    if (e = e || this.defaultState, this.stateId !== e.data) {
      let r = this.stateId ^ e.data, s = 0;
      for (; r; )
        r & 1 && this.map[s].call(this, !!(e.data & 1 << s)), r = r >> 1, s++;
      this.stateId = e.data;
    }
    for (let r = 0; r < this.checks.length; r++)
      this.checks[r](this, e);
  }
  /**
   * Sets the state, when previous state is unknown.
   * @param {*} state - The state to set
   */
  forceState(e) {
    e = e || this.defaultState;
    for (let r = 0; r < this.map.length; r++)
      this.map[r].call(this, !!(e.data & 1 << r));
    for (let r = 0; r < this.checks.length; r++)
      this.checks[r](this, e);
    this.stateId = e.data;
  }
  /**
   * Sets whether to enable or disable blending.
   * @param value - Turn on or off WebGl blending.
   */
  setBlend(e) {
    this._updateCheck(D._checkBlendMode, e), this.gl[e ? "enable" : "disable"](this.gl.BLEND);
  }
  /**
   * Sets whether to enable or disable polygon offset fill.
   * @param value - Turn on or off webgl polygon offset testing.
   */
  setOffset(e) {
    this._updateCheck(D._checkPolygonOffset, e), this.gl[e ? "enable" : "disable"](this.gl.POLYGON_OFFSET_FILL);
  }
  /**
   * Sets whether to enable or disable depth test.
   * @param value - Turn on or off webgl depth testing.
   */
  setDepthTest(e) {
    this.gl[e ? "enable" : "disable"](this.gl.DEPTH_TEST);
  }
  /**
   * Sets whether to enable or disable depth mask.
   * @param value - Turn on or off webgl depth mask.
   */
  setDepthMask(e) {
    this.gl.depthMask(e);
  }
  /**
   * Sets whether to enable or disable cull face.
   * @param {boolean} value - Turn on or off webgl cull face.
   */
  setCullFace(e) {
    this.gl[e ? "enable" : "disable"](this.gl.CULL_FACE);
  }
  /**
   * Sets the gl front face.
   * @param {boolean} value - true is clockwise and false is counter-clockwise
   */
  setFrontFace(e) {
    this.gl.frontFace(this.gl[e ? "CW" : "CCW"]);
  }
  /**
   * Sets the blend mode.
   * @param {number} value - The blend mode to set to.
   */
  setBlendMode(e) {
    if (this.blendModesMap[e] || (e = "normal"), e === this.blendMode)
      return;
    this.blendMode = e;
    const r = this.blendModesMap[e], s = this.gl;
    r.length === 2 ? s.blendFunc(r[0], r[1]) : s.blendFuncSeparate(r[0], r[1], r[2], r[3]), r.length === 6 ? (this._blendEq = !0, s.blendEquationSeparate(r[4], r[5])) : this._blendEq && (this._blendEq = !1, s.blendEquationSeparate(s.FUNC_ADD, s.FUNC_ADD));
  }
  /**
   * Sets the polygon offset.
   * @param {number} value - the polygon offset
   * @param {number} scale - the polygon offset scale
   */
  setPolygonOffset(e, r) {
    this.gl.polygonOffset(e, r);
  }
  // used
  /** Resets all the logic and disables the VAOs. */
  reset() {
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, !1), this.forceState(this.defaultState), this._blendEq = !0, this.blendMode = "", this.setBlendMode("normal");
  }
  /**
   * Checks to see which updates should be checked based on which settings have been activated.
   *
   * For example, if blend is enabled then we should check the blend modes each time the state is changed
   * or if polygon fill is activated then we need to check if the polygon offset changes.
   * The idea is that we only check what we have too.
   * @param func - the checking function to add or remove
   * @param value - should the check function be added or removed.
   */
  _updateCheck(e, r) {
    const s = this.checks.indexOf(e);
    r && s === -1 ? this.checks.push(e) : !r && s !== -1 && this.checks.splice(s, 1);
  }
  /**
   * A private little wrapper function that we call to check the blend mode.
   * @param system - the System to perform the state check on
   * @param state - the state that the blendMode will pulled from
   */
  static _checkBlendMode(e, r) {
    e.setBlendMode(r.blendMode);
  }
  /**
   * A private little wrapper function that we call to check the polygon offset.
   * @param system - the System to perform the state check on
   * @param state - the state that the blendMode will pulled from
   */
  static _checkPolygonOffset(e, r) {
    e.setPolygonOffset(1, r.polygonOffset);
  }
  /**
   * @ignore
   */
  destroy() {
    this.gl = null, this.checks.length = 0;
  }
};
ge.extension = {
  type: [
    d.WebGLSystem
  ],
  name: "state"
};
let Et = ge;
class Tt {
  constructor(e) {
    this.target = re.TEXTURE_2D, this.texture = e, this.width = -1, this.height = -1, this.type = l.UNSIGNED_BYTE, this.internalFormat = I.RGBA, this.format = I.RGBA, this.samplerType = 0;
  }
}
const bt = {
  id: "buffer",
  upload(t, e, r) {
    e.width === t.width || e.height === t.height ? r.texSubImage2D(
      r.TEXTURE_2D,
      0,
      0,
      0,
      t.width,
      t.height,
      e.format,
      e.type,
      t.resource
    ) : r.texImage2D(
      e.target,
      0,
      e.internalFormat,
      t.width,
      t.height,
      0,
      e.format,
      e.type,
      t.resource
    ), e.width = t.width, e.height = t.height;
  }
}, Rt = {
  "bc1-rgba-unorm": !0,
  "bc1-rgba-unorm-srgb": !0,
  "bc2-rgba-unorm": !0,
  "bc2-rgba-unorm-srgb": !0,
  "bc3-rgba-unorm": !0,
  "bc3-rgba-unorm-srgb": !0,
  "bc4-r-unorm": !0,
  "bc4-r-snorm": !0,
  "bc5-rg-unorm": !0,
  "bc5-rg-snorm": !0,
  "bc6h-rgb-ufloat": !0,
  "bc6h-rgb-float": !0,
  "bc7-rgba-unorm": !0,
  "bc7-rgba-unorm-srgb": !0,
  // ETC2 compressed formats usable if "texture-compression-etc2" is both
  // supported by the device/user agent and enabled in requestDevice.
  "etc2-rgb8unorm": !0,
  "etc2-rgb8unorm-srgb": !0,
  "etc2-rgb8a1unorm": !0,
  "etc2-rgb8a1unorm-srgb": !0,
  "etc2-rgba8unorm": !0,
  "etc2-rgba8unorm-srgb": !0,
  "eac-r11unorm": !0,
  "eac-r11snorm": !0,
  "eac-rg11unorm": !0,
  "eac-rg11snorm": !0,
  // ASTC compressed formats usable if "texture-compression-astc" is both
  // supported by the device/user agent and enabled in requestDevice.
  "astc-4x4-unorm": !0,
  "astc-4x4-unorm-srgb": !0,
  "astc-5x4-unorm": !0,
  "astc-5x4-unorm-srgb": !0,
  "astc-5x5-unorm": !0,
  "astc-5x5-unorm-srgb": !0,
  "astc-6x5-unorm": !0,
  "astc-6x5-unorm-srgb": !0,
  "astc-6x6-unorm": !0,
  "astc-6x6-unorm-srgb": !0,
  "astc-8x5-unorm": !0,
  "astc-8x5-unorm-srgb": !0,
  "astc-8x6-unorm": !0,
  "astc-8x6-unorm-srgb": !0,
  "astc-8x8-unorm": !0,
  "astc-8x8-unorm-srgb": !0,
  "astc-10x5-unorm": !0,
  "astc-10x5-unorm-srgb": !0,
  "astc-10x6-unorm": !0,
  "astc-10x6-unorm-srgb": !0,
  "astc-10x8-unorm": !0,
  "astc-10x8-unorm-srgb": !0,
  "astc-10x10-unorm": !0,
  "astc-10x10-unorm-srgb": !0,
  "astc-12x10-unorm": !0,
  "astc-12x10-unorm-srgb": !0,
  "astc-12x12-unorm": !0,
  "astc-12x12-unorm-srgb": !0
}, St = {
  id: "compressed",
  upload(t, e, r) {
    r.pixelStorei(r.UNPACK_ALIGNMENT, 4);
    let s = t.pixelWidth, n = t.pixelHeight;
    const i = !!Rt[t.format];
    for (let a = 0; a < t.resource.length; a++) {
      const o = t.resource[a];
      i ? r.compressedTexImage2D(
        r.TEXTURE_2D,
        a,
        e.internalFormat,
        s,
        n,
        0,
        o
      ) : r.texImage2D(
        r.TEXTURE_2D,
        a,
        e.internalFormat,
        s,
        n,
        0,
        e.format,
        e.type,
        o
      ), s = Math.max(s >> 1, 1), n = Math.max(n >> 1, 1);
    }
  }
}, me = {
  id: "image",
  upload(t, e, r, s) {
    const n = t.alphaMode === "premultiply-alpha-on-upload";
    r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, n);
    const i = e.width, a = e.height, o = t.pixelWidth, c = t.pixelHeight, u = t.resourceWidth, _ = t.resourceHeight;
    u < o || _ < c ? ((i !== o || a !== c) && r.texImage2D(
      e.target,
      0,
      e.internalFormat,
      o,
      c,
      0,
      e.format,
      e.type,
      null
    ), s === 2 ? r.texSubImage2D(
      r.TEXTURE_2D,
      0,
      0,
      0,
      u,
      _,
      e.format,
      e.type,
      t.resource
    ) : r.texSubImage2D(
      r.TEXTURE_2D,
      0,
      0,
      0,
      e.format,
      e.type,
      t.resource
    )) : i === o || a === c ? r.texSubImage2D(
      r.TEXTURE_2D,
      0,
      0,
      0,
      e.format,
      e.type,
      t.resource
    ) : s === 2 ? r.texImage2D(
      e.target,
      0,
      e.internalFormat,
      o,
      c,
      0,
      e.format,
      e.type,
      t.resource
    ) : r.texImage2D(
      e.target,
      0,
      e.internalFormat,
      e.format,
      e.type,
      t.resource
    ), e.width = o, e.height = c;
  }
}, xt = {
  id: "video",
  upload(t, e, r, s) {
    if (!t.isValid) {
      r.texImage2D(
        e.target,
        0,
        e.internalFormat,
        1,
        1,
        0,
        e.format,
        e.type,
        null
      );
      return;
    }
    me.upload(t, e, r, s);
  }
}, X = {
  linear: 9729,
  nearest: 9728
}, pt = {
  linear: {
    linear: 9987,
    nearest: 9985
  },
  nearest: {
    linear: 9986,
    nearest: 9984
  }
}, C = {
  "clamp-to-edge": 33071,
  repeat: 10497,
  "mirror-repeat": 33648
}, vt = {
  never: 512,
  less: 513,
  equal: 514,
  "less-equal": 515,
  greater: 516,
  "not-equal": 517,
  "greater-equal": 518,
  always: 519
};
function W(t, e, r, s, n, i, a, o) {
  const c = i;
  if (!o || t.addressModeU !== "repeat" || t.addressModeV !== "repeat" || t.addressModeW !== "repeat") {
    const u = C[a ? "clamp-to-edge" : t.addressModeU], _ = C[a ? "clamp-to-edge" : t.addressModeV], h = C[a ? "clamp-to-edge" : t.addressModeW];
    e[n](c, e.TEXTURE_WRAP_S, u), e[n](c, e.TEXTURE_WRAP_T, _), e.TEXTURE_WRAP_R && e[n](c, e.TEXTURE_WRAP_R, h);
  }
  if ((!o || t.magFilter !== "linear") && e[n](c, e.TEXTURE_MAG_FILTER, X[t.magFilter]), r) {
    if (!o || t.mipmapFilter !== "linear") {
      const u = pt[t.minFilter][t.mipmapFilter];
      e[n](c, e.TEXTURE_MIN_FILTER, u);
    }
  } else
    e[n](c, e.TEXTURE_MIN_FILTER, X[t.minFilter]);
  if (s && t.maxAnisotropy > 1) {
    const u = Math.min(t.maxAnisotropy, e.getParameter(s.MAX_TEXTURE_MAX_ANISOTROPY_EXT));
    e[n](c, s.TEXTURE_MAX_ANISOTROPY_EXT, u);
  }
  t.compare && e[n](c, e.TEXTURE_COMPARE_FUNC, vt[t.compare]);
}
function At(t) {
  return {
    // 8-bit formats
    r8unorm: t.RED,
    r8snorm: t.RED,
    r8uint: t.RED,
    r8sint: t.RED,
    // 16-bit formats
    r16uint: t.RED,
    r16sint: t.RED,
    r16float: t.RED,
    rg8unorm: t.RG,
    rg8snorm: t.RG,
    rg8uint: t.RG,
    rg8sint: t.RG,
    // 32-bit formats
    r32uint: t.RED,
    r32sint: t.RED,
    r32float: t.RED,
    rg16uint: t.RG,
    rg16sint: t.RG,
    rg16float: t.RG,
    rgba8unorm: t.RGBA,
    "rgba8unorm-srgb": t.RGBA,
    // Packed 32-bit formats
    rgba8snorm: t.RGBA,
    rgba8uint: t.RGBA,
    rgba8sint: t.RGBA,
    bgra8unorm: t.RGBA,
    "bgra8unorm-srgb": t.RGBA,
    rgb9e5ufloat: t.RGB,
    rgb10a2unorm: t.RGBA,
    rg11b10ufloat: t.RGB,
    // 64-bit formats
    rg32uint: t.RG,
    rg32sint: t.RG,
    rg32float: t.RG,
    rgba16uint: t.RGBA,
    rgba16sint: t.RGBA,
    rgba16float: t.RGBA,
    // 128-bit formats
    rgba32uint: t.RGBA,
    rgba32sint: t.RGBA,
    rgba32float: t.RGBA,
    // Depth/stencil formats
    stencil8: t.STENCIL_INDEX8,
    depth16unorm: t.DEPTH_COMPONENT,
    depth24plus: t.DEPTH_COMPONENT,
    "depth24plus-stencil8": t.DEPTH_STENCIL,
    depth32float: t.DEPTH_COMPONENT,
    "depth32float-stencil8": t.DEPTH_STENCIL
  };
}
function Nt(t, e) {
  let r = {}, s = t.RGBA;
  return t instanceof T.get().getWebGLRenderingContext() ? e.srgb && (r = {
    "rgba8unorm-srgb": e.srgb.SRGB8_ALPHA8_EXT,
    "bgra8unorm-srgb": e.srgb.SRGB8_ALPHA8_EXT
  }) : (r = {
    "rgba8unorm-srgb": t.SRGB8_ALPHA8,
    "bgra8unorm-srgb": t.SRGB8_ALPHA8
  }, s = t.RGBA8), {
    // 8-bit formats
    r8unorm: t.R8,
    r8snorm: t.R8_SNORM,
    r8uint: t.R8UI,
    r8sint: t.R8I,
    // 16-bit formats
    r16uint: t.R16UI,
    r16sint: t.R16I,
    r16float: t.R16F,
    rg8unorm: t.RG8,
    rg8snorm: t.RG8_SNORM,
    rg8uint: t.RG8UI,
    rg8sint: t.RG8I,
    // 32-bit formats
    r32uint: t.R32UI,
    r32sint: t.R32I,
    r32float: t.R32F,
    rg16uint: t.RG16UI,
    rg16sint: t.RG16I,
    rg16float: t.RG16F,
    rgba8unorm: t.RGBA,
    ...r,
    // Packed 32-bit formats
    rgba8snorm: t.RGBA8_SNORM,
    rgba8uint: t.RGBA8UI,
    rgba8sint: t.RGBA8I,
    bgra8unorm: s,
    rgb9e5ufloat: t.RGB9_E5,
    rgb10a2unorm: t.RGB10_A2,
    rg11b10ufloat: t.R11F_G11F_B10F,
    // 64-bit formats
    rg32uint: t.RG32UI,
    rg32sint: t.RG32I,
    rg32float: t.RG32F,
    rgba16uint: t.RGBA16UI,
    rgba16sint: t.RGBA16I,
    rgba16float: t.RGBA16F,
    // 128-bit formats
    rgba32uint: t.RGBA32UI,
    rgba32sint: t.RGBA32I,
    rgba32float: t.RGBA32F,
    // Depth/stencil formats
    stencil8: t.STENCIL_INDEX8,
    depth16unorm: t.DEPTH_COMPONENT16,
    depth24plus: t.DEPTH_COMPONENT24,
    "depth24plus-stencil8": t.DEPTH24_STENCIL8,
    depth32float: t.DEPTH_COMPONENT32F,
    "depth32float-stencil8": t.DEPTH32F_STENCIL8,
    // Compressed formats
    ...e.s3tc ? {
      "bc1-rgba-unorm": e.s3tc.COMPRESSED_RGBA_S3TC_DXT1_EXT,
      "bc2-rgba-unorm": e.s3tc.COMPRESSED_RGBA_S3TC_DXT3_EXT,
      "bc3-rgba-unorm": e.s3tc.COMPRESSED_RGBA_S3TC_DXT5_EXT
    } : {},
    ...e.s3tc_sRGB ? {
      "bc1-rgba-unorm-srgb": e.s3tc_sRGB.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT,
      "bc2-rgba-unorm-srgb": e.s3tc_sRGB.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT,
      "bc3-rgba-unorm-srgb": e.s3tc_sRGB.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT
    } : {},
    ...e.rgtc ? {
      "bc4-r-unorm": e.rgtc.COMPRESSED_RED_RGTC1_EXT,
      "bc4-r-snorm": e.rgtc.COMPRESSED_SIGNED_RED_RGTC1_EXT,
      "bc5-rg-unorm": e.rgtc.COMPRESSED_RED_GREEN_RGTC2_EXT,
      "bc5-rg-snorm": e.rgtc.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT
    } : {},
    ...e.bptc ? {
      "bc6h-rgb-float": e.bptc.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT,
      "bc6h-rgb-ufloat": e.bptc.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT,
      "bc7-rgba-unorm": e.bptc.COMPRESSED_RGBA_BPTC_UNORM_EXT,
      "bc7-rgba-unorm-srgb": e.bptc.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT
    } : {},
    ...e.etc ? {
      "etc2-rgb8unorm": e.etc.COMPRESSED_RGB8_ETC2,
      "etc2-rgb8unorm-srgb": e.etc.COMPRESSED_SRGB8_ETC2,
      "etc2-rgb8a1unorm": e.etc.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2,
      "etc2-rgb8a1unorm-srgb": e.etc.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2,
      "etc2-rgba8unorm": e.etc.COMPRESSED_RGBA8_ETC2_EAC,
      "etc2-rgba8unorm-srgb": e.etc.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC,
      "eac-r11unorm": e.etc.COMPRESSED_R11_EAC,
      // 'eac-r11snorm'
      "eac-rg11unorm": e.etc.COMPRESSED_SIGNED_RG11_EAC
      // 'eac-rg11snorm'
    } : {},
    ...e.astc ? {
      "astc-4x4-unorm": e.astc.COMPRESSED_RGBA_ASTC_4x4_KHR,
      "astc-4x4-unorm-srgb": e.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR,
      "astc-5x4-unorm": e.astc.COMPRESSED_RGBA_ASTC_5x4_KHR,
      "astc-5x4-unorm-srgb": e.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR,
      "astc-5x5-unorm": e.astc.COMPRESSED_RGBA_ASTC_5x5_KHR,
      "astc-5x5-unorm-srgb": e.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR,
      "astc-6x5-unorm": e.astc.COMPRESSED_RGBA_ASTC_6x5_KHR,
      "astc-6x5-unorm-srgb": e.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR,
      "astc-6x6-unorm": e.astc.COMPRESSED_RGBA_ASTC_6x6_KHR,
      "astc-6x6-unorm-srgb": e.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR,
      "astc-8x5-unorm": e.astc.COMPRESSED_RGBA_ASTC_8x5_KHR,
      "astc-8x5-unorm-srgb": e.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR,
      "astc-8x6-unorm": e.astc.COMPRESSED_RGBA_ASTC_8x6_KHR,
      "astc-8x6-unorm-srgb": e.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR,
      "astc-8x8-unorm": e.astc.COMPRESSED_RGBA_ASTC_8x8_KHR,
      "astc-8x8-unorm-srgb": e.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR,
      "astc-10x5-unorm": e.astc.COMPRESSED_RGBA_ASTC_10x5_KHR,
      "astc-10x5-unorm-srgb": e.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR,
      "astc-10x6-unorm": e.astc.COMPRESSED_RGBA_ASTC_10x6_KHR,
      "astc-10x6-unorm-srgb": e.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR,
      "astc-10x8-unorm": e.astc.COMPRESSED_RGBA_ASTC_10x8_KHR,
      "astc-10x8-unorm-srgb": e.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR,
      "astc-10x10-unorm": e.astc.COMPRESSED_RGBA_ASTC_10x10_KHR,
      "astc-10x10-unorm-srgb": e.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR,
      "astc-12x10-unorm": e.astc.COMPRESSED_RGBA_ASTC_12x10_KHR,
      "astc-12x10-unorm-srgb": e.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR,
      "astc-12x12-unorm": e.astc.COMPRESSED_RGBA_ASTC_12x12_KHR,
      "astc-12x12-unorm-srgb": e.astc.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR
    } : {}
  };
}
function Bt(t) {
  return {
    // 8-bit formats
    r8unorm: t.UNSIGNED_BYTE,
    r8snorm: t.BYTE,
    r8uint: t.UNSIGNED_BYTE,
    r8sint: t.BYTE,
    // 16-bit formats
    r16uint: t.UNSIGNED_SHORT,
    r16sint: t.SHORT,
    r16float: t.HALF_FLOAT,
    rg8unorm: t.UNSIGNED_BYTE,
    rg8snorm: t.BYTE,
    rg8uint: t.UNSIGNED_BYTE,
    rg8sint: t.BYTE,
    // 32-bit formats
    r32uint: t.UNSIGNED_INT,
    r32sint: t.INT,
    r32float: t.FLOAT,
    rg16uint: t.UNSIGNED_SHORT,
    rg16sint: t.SHORT,
    rg16float: t.HALF_FLOAT,
    rgba8unorm: t.UNSIGNED_BYTE,
    "rgba8unorm-srgb": t.UNSIGNED_BYTE,
    // Packed 32-bit formats
    rgba8snorm: t.BYTE,
    rgba8uint: t.UNSIGNED_BYTE,
    rgba8sint: t.BYTE,
    bgra8unorm: t.UNSIGNED_BYTE,
    "bgra8unorm-srgb": t.UNSIGNED_BYTE,
    rgb9e5ufloat: t.UNSIGNED_INT_5_9_9_9_REV,
    rgb10a2unorm: t.UNSIGNED_INT_2_10_10_10_REV,
    rg11b10ufloat: t.UNSIGNED_INT_10F_11F_11F_REV,
    // 64-bit formats
    rg32uint: t.UNSIGNED_INT,
    rg32sint: t.INT,
    rg32float: t.FLOAT,
    rgba16uint: t.UNSIGNED_SHORT,
    rgba16sint: t.SHORT,
    rgba16float: t.HALF_FLOAT,
    // 128-bit formats
    rgba32uint: t.UNSIGNED_INT,
    rgba32sint: t.INT,
    rgba32float: t.FLOAT,
    // Depth/stencil formats
    stencil8: t.UNSIGNED_BYTE,
    depth16unorm: t.UNSIGNED_SHORT,
    depth24plus: t.UNSIGNED_INT,
    "depth24plus-stencil8": t.UNSIGNED_INT_24_8,
    depth32float: t.FLOAT,
    "depth32float-stencil8": t.FLOAT_32_UNSIGNED_INT_24_8_REV
  };
}
const Gt = 4;
class Ee {
  constructor(e) {
    this.managedTextures = [], this._glTextures = /* @__PURE__ */ Object.create(null), this._glSamplers = /* @__PURE__ */ Object.create(null), this._boundTextures = [], this._activeTextureLocation = -1, this._boundSamplers = /* @__PURE__ */ Object.create(null), this._uploads = {
      image: me,
      buffer: bt,
      video: xt,
      compressed: St
    }, this._useSeparateSamplers = !1, this._renderer = e, this._renderer.renderableGC.addManagedHash(this, "_glTextures"), this._renderer.renderableGC.addManagedHash(this, "_glSamplers");
  }
  contextChange(e) {
    this._gl = e, this._mapFormatToInternalFormat || (this._mapFormatToInternalFormat = Nt(e, this._renderer.context.extensions), this._mapFormatToType = Bt(e), this._mapFormatToFormat = At(e)), this._glTextures = /* @__PURE__ */ Object.create(null), this._glSamplers = /* @__PURE__ */ Object.create(null), this._boundSamplers = /* @__PURE__ */ Object.create(null);
    for (let r = 0; r < 16; r++)
      this.bind(b.EMPTY, r);
  }
  initSource(e) {
    this.bind(e);
  }
  bind(e, r = 0) {
    const s = e.source;
    e ? (this.bindSource(s, r), this._useSeparateSamplers && this._bindSampler(s.style, r)) : (this.bindSource(null, r), this._useSeparateSamplers && this._bindSampler(null, r));
  }
  bindSource(e, r = 0) {
    const s = this._gl;
    if (e._touched = this._renderer.textureGC.count, this._boundTextures[r] !== e) {
      this._boundTextures[r] = e, this._activateLocation(r), e = e || b.EMPTY.source;
      const n = this.getGlSource(e);
      s.bindTexture(n.target, n.texture);
    }
  }
  _bindSampler(e, r = 0) {
    const s = this._gl;
    if (!e) {
      this._boundSamplers[r] = null, s.bindSampler(r, null);
      return;
    }
    const n = this._getGlSampler(e);
    this._boundSamplers[r] !== n && (this._boundSamplers[r] = n, s.bindSampler(r, n));
  }
  unbind(e) {
    const r = e.source, s = this._boundTextures, n = this._gl;
    for (let i = 0; i < s.length; i++)
      if (s[i] === r) {
        this._activateLocation(i);
        const a = this.getGlSource(r);
        n.bindTexture(a.target, null), s[i] = null;
      }
  }
  _activateLocation(e) {
    this._activeTextureLocation !== e && (this._activeTextureLocation = e, this._gl.activeTexture(this._gl.TEXTURE0 + e));
  }
  _initSource(e) {
    const r = this._gl, s = new Tt(r.createTexture());
    if (s.type = this._mapFormatToType[e.format], s.internalFormat = this._mapFormatToInternalFormat[e.format], s.format = this._mapFormatToFormat[e.format], e.autoGenerateMipmaps && (this._renderer.context.supports.nonPowOf2mipmaps || e.isPowerOfTwo)) {
      const n = Math.max(e.width, e.height);
      e.mipLevelCount = Math.floor(Math.log2(n)) + 1;
    }
    return this._glTextures[e.uid] = s, this.managedTextures.includes(e) || (e.on("update", this.onSourceUpdate, this), e.on("resize", this.onSourceUpdate, this), e.on("styleChange", this.onStyleChange, this), e.on("destroy", this.onSourceDestroy, this), e.on("unload", this.onSourceUnload, this), e.on("updateMipmaps", this.onUpdateMipmaps, this), this.managedTextures.push(e)), this.onSourceUpdate(e), this.updateStyle(e, !1), s;
  }
  onStyleChange(e) {
    this.updateStyle(e, !1);
  }
  updateStyle(e, r) {
    const s = this._gl, n = this.getGlSource(e);
    s.bindTexture(s.TEXTURE_2D, n.texture), this._boundTextures[this._activeTextureLocation] = e, W(
      e.style,
      s,
      e.mipLevelCount > 1,
      this._renderer.context.extensions.anisotropicFiltering,
      "texParameteri",
      s.TEXTURE_2D,
      // will force a clamp to edge if the texture is not a power of two
      !this._renderer.context.supports.nonPowOf2wrapping && !e.isPowerOfTwo,
      r
    );
  }
  onSourceUnload(e) {
    const r = this._glTextures[e.uid];
    r && (this.unbind(e), this._glTextures[e.uid] = null, this._gl.deleteTexture(r.texture));
  }
  onSourceUpdate(e) {
    const r = this._gl, s = this.getGlSource(e);
    r.bindTexture(r.TEXTURE_2D, s.texture), this._boundTextures[this._activeTextureLocation] = e, this._uploads[e.uploadMethodId] ? this._uploads[e.uploadMethodId].upload(e, s, r, this._renderer.context.webGLVersion) : r.texImage2D(r.TEXTURE_2D, 0, r.RGBA, e.pixelWidth, e.pixelHeight, 0, r.RGBA, r.UNSIGNED_BYTE, null), e.autoGenerateMipmaps && e.mipLevelCount > 1 && this.onUpdateMipmaps(e, !1);
  }
  onUpdateMipmaps(e, r = !0) {
    r && this.bindSource(e, 0);
    const s = this.getGlSource(e);
    this._gl.generateMipmap(s.target);
  }
  onSourceDestroy(e) {
    e.off("destroy", this.onSourceDestroy, this), e.off("update", this.onSourceUpdate, this), e.off("resize", this.onSourceUpdate, this), e.off("unload", this.onSourceUnload, this), e.off("styleChange", this.onStyleChange, this), e.off("updateMipmaps", this.onUpdateMipmaps, this), this.managedTextures.splice(this.managedTextures.indexOf(e), 1), this.onSourceUnload(e);
  }
  _initSampler(e) {
    const r = this._gl, s = this._gl.createSampler();
    return this._glSamplers[e._resourceId] = s, W(
      e,
      r,
      this._boundTextures[this._activeTextureLocation].mipLevelCount > 1,
      this._renderer.context.extensions.anisotropicFiltering,
      "samplerParameteri",
      s,
      !1,
      !0
    ), this._glSamplers[e._resourceId];
  }
  _getGlSampler(e) {
    return this._glSamplers[e._resourceId] || this._initSampler(e);
  }
  getGlSource(e) {
    return this._glTextures[e.uid] || this._initSource(e);
  }
  generateCanvas(e) {
    const { pixels: r, width: s, height: n } = this.getPixels(e), i = T.get().createCanvas();
    i.width = s, i.height = n;
    const a = i.getContext("2d");
    if (a) {
      const o = a.createImageData(s, n);
      o.data.set(r), a.putImageData(o, 0, 0);
    }
    return i;
  }
  getPixels(e) {
    const r = e.source.resolution, s = e.frame, n = Math.max(Math.round(s.width * r), 1), i = Math.max(Math.round(s.height * r), 1), a = new Uint8Array(Gt * n * i), o = this._renderer, c = o.renderTarget.getRenderTarget(e), u = o.renderTarget.getGpuRenderTarget(c), _ = o.gl;
    return _.bindFramebuffer(_.FRAMEBUFFER, u.resolveTargetFramebuffer), _.readPixels(
      Math.round(s.x * r),
      Math.round(s.y * r),
      n,
      i,
      _.RGBA,
      _.UNSIGNED_BYTE,
      a
    ), { pixels: new Uint8ClampedArray(a.buffer), width: n, height: i };
  }
  destroy() {
    this.managedTextures.slice().forEach((e) => this.onSourceDestroy(e)), this.managedTextures = null, this._renderer = null;
  }
}
Ee.extension = {
  type: [
    d.WebGLSystem
  ],
  name: "texture"
};
class Te {
  init() {
    const e = new y({
      uColor: { value: new Float32Array([1, 1, 1, 1]), type: "vec4<f32>" },
      uTransformMatrix: { value: new z(), type: "mat3x3<f32>" },
      uRound: { value: 0, type: "f32" }
    }), r = j(), s = K({
      name: "graphics",
      bits: [
        Ge,
        Ce(r),
        Z,
        q
      ]
    });
    this.shader = new O({
      glProgram: s,
      resources: {
        localUniforms: e,
        batchSamplers: Ie(r)
      }
    });
  }
  execute(e, r) {
    const s = r.context, n = s.customShader || this.shader, i = e.renderer, a = i.graphicsContext, {
      batcher: o,
      instructions: c
    } = a.getContextRenderData(s);
    n.groups[0] = i.globalUniforms.bindGroup, i.state.set(e.state), i.shader.bind(n), i.geometry.bind(o.geometry, n.glProgram);
    const u = c.instructions;
    for (let _ = 0; _ < c.instructionSize; _++) {
      const h = u[_];
      if (h.size) {
        for (let f = 0; f < h.textures.count; f++)
          i.texture.bind(h.textures.textures[f], f);
        i.geometry.draw("triangle-list", h.size, h.start);
      }
    }
  }
  destroy() {
    this.shader.destroy(!0), this.shader = null;
  }
}
Te.extension = {
  type: [
    d.WebGLPipesAdaptor
  ],
  name: "graphics"
};
class be {
  init() {
    const e = K({
      name: "mesh",
      bits: [
        Z,
        Me,
        q
      ]
    });
    this._shader = new O({
      glProgram: e,
      resources: {
        uTexture: b.EMPTY.source,
        textureUniforms: {
          uTextureMatrix: { type: "mat3x3<f32>", value: new z() }
        }
      }
    });
  }
  execute(e, r) {
    const s = e.renderer;
    let n = r._shader;
    if (n) {
      if (!n.glProgram) {
        g("Mesh shader has no glProgram", r.shader);
        return;
      }
    } else {
      n = this._shader;
      const i = r.texture, a = i.source;
      n.resources.uTexture = a, n.resources.uSampler = a.style, n.resources.textureUniforms.uniforms.uTextureMatrix = i.textureMatrix.mapCoord;
    }
    n.groups[100] = s.globalUniforms.bindGroup, n.groups[101] = e.localUniformsBindGroup, s.encoder.draw({
      geometry: r._geometry,
      shader: n,
      state: r.state
    });
  }
  destroy() {
    this._shader.destroy(!0), this._shader = null;
  }
}
be.extension = {
  type: [
    d.WebGLPipesAdaptor
  ],
  name: "mesh"
};
const Ct = [
  ...Oe,
  ue,
  $e,
  ke,
  ee,
  Ee,
  _e,
  se,
  fe,
  de,
  ae,
  Et,
  oe,
  ie
], It = [...ye], Dt = [Q, be, Te], Re = [], Se = [], xe = [];
v.handleByNamedList(d.WebGLSystem, Re);
v.handleByNamedList(d.WebGLPipes, Se);
v.handleByNamedList(d.WebGLPipesAdaptor, xe);
v.add(...Ct, ...It, ...Dt);
class Pt extends Ae {
  constructor() {
    const e = {
      name: "webgl",
      type: Ne.WEBGL,
      systems: Re,
      renderPipes: Se,
      renderPipeAdaptors: xe
    };
    super(e);
  }
}
export {
  Pt as WebGLRenderer
};
