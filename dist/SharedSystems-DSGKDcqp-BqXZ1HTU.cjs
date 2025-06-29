"use strict";const s=require("./index-BJwiKbxy.cjs"),v=require("./colorToUniform-Cu0xVW3l-D2qQxRLC.cjs"),O=class T extends s.to{constructor(e){e={...T.defaultOptions,...e},super(e),this.enabled=!0,this._state=v.w.for2d(),this.blendMode=e.blendMode,this.padding=e.padding,typeof e.antialias=="boolean"?this.antialias=e.antialias?"on":"off":this.antialias=e.antialias,this.resolution=e.resolution,this.blendRequired=e.blendRequired,this.clipToViewport=e.clipToViewport,this.addResource("uTexture",0,1)}apply(e,t,r,i){e.applyFilter(this,t,r,i)}get blendMode(){return this._state.blendMode}set blendMode(e){this._state.blendMode=e}static from(e){const{gpu:t,gl:r,...i}=e;let a,o;return t&&(a=s.fn.from(t)),r&&(o=s.Rl.from(r)),new T({gpuProgram:a,glProgram:o,...i})}};O.defaultOptions={blendMode:"normal",resolution:1,padding:0,antialias:"off",blendRequired:!1,clipToViewport:!0};let he=O;var pe=`in vec2 vMaskCoord;
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
`,fe=`in vec2 aPosition;

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
`,U=`struct GlobalFilterUniforms {
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
`;class me extends he{constructor(e){const{sprite:t,...r}=e,i=new s.iu(t.texture),a=new s.Dl({uFilterMatrix:{value:new s.H,type:"mat3x3<f32>"},uMaskClamp:{value:i.uClampFrame,type:"vec4<f32>"},uAlpha:{value:1,type:"f32"},uInverse:{value:e.inverse?1:0,type:"f32"}}),o=s.fn.from({vertex:{source:U,entryPoint:"mainVertex"},fragment:{source:U,entryPoint:"mainFragment"}}),u=s.Rl.from({vertex:fe,fragment:pe,name:"mask-filter"});super({...r,gpuProgram:o,glProgram:u,resources:{filterUniforms:a,uMaskTexture:t.texture.source}}),this.sprite=t,this._textureMatrix=i}set inverse(e){this.resources.filterUniforms.uniforms.uInverse=e?1:0}get inverse(){return this.resources.filterUniforms.uniforms.uInverse===1}apply(e,t,r,i){this._textureMatrix.texture=this.sprite.texture,e.calculateSpriteMatrix(this.resources.filterUniforms.uniforms.uFilterMatrix,this.sprite).prepend(this._textureMatrix.mapCoord),this.resources.uMaskTexture=this.sprite.texture.source,e.applyFilter(this,t,r,i)}}const M=class F{constructor(e,t){var r,i;this.state=v.w.for2d(),this._batchersByInstructionSet=Object.create(null),this._activeBatches=Object.create(null),this.renderer=e,this._adaptor=t,(i=(r=this._adaptor).init)==null||i.call(r,this)}static getBatcher(e){return new this._availableBatchers[e]}buildStart(e){let t=this._batchersByInstructionSet[e.uid];t||(t=this._batchersByInstructionSet[e.uid]=Object.create(null),t.default||(t.default=new s.Md)),this._activeBatches=t,this._activeBatch=this._activeBatches.default;for(const r in this._activeBatches)this._activeBatches[r].begin()}addToBatch(e,t){if(this._activeBatch.name!==e.batcherName){this._activeBatch.break(t);let r=this._activeBatches[e.batcherName];r||(r=this._activeBatches[e.batcherName]=F.getBatcher(e.batcherName),r.begin()),this._activeBatch=r}this._activeBatch.add(e)}break(e){this._activeBatch.break(e)}buildEnd(e){this._activeBatch.break(e);const t=this._activeBatches;for(const r in t){const i=t[r],a=i.geometry;a.indexBuffer.setDataWithSize(i.indexBuffer,i.indexSize,!0),a.buffers[0].setDataWithSize(i.attributeBuffer.float32View,i.attributeSize,!1)}}upload(e){const t=this._batchersByInstructionSet[e.uid];for(const r in t){const i=t[r],a=i.geometry;i.dirty&&(i.dirty=!1,a.buffers[0].update(i.attributeSize*4))}}execute(e){if(e.action==="startBatch"){const t=e.batcher,r=t.geometry,i=t.shader;this._adaptor.start(this,r,i)}this._adaptor.execute(this,e)}destroy(){this.state=null,this.renderer=null,this._adaptor=null;for(const e in this._activeBatches)this._activeBatches[e].destroy();this._activeBatches=null}};M.extension={type:[s.D.WebGLPipes,s.D.WebGPUPipes,s.D.CanvasPipes],name:"batch"};M._availableBatchers=Object.create(null);let E=M;s.Ct.handleByMap(s.D.Batcher,E._availableBatchers);s.Ct.add(s.Md);const ve={name:"texture-bit",vertex:{header:`

        struct TextureUniforms {
            uTextureMatrix:mat3x3<f32>,
        }

        @group(2) @binding(2) var<uniform> textureUniforms : TextureUniforms;
        `,main:`
            uv = (textureUniforms.uTextureMatrix * vec3(uv, 1.0)).xy;
        `},fragment:{header:`
            @group(2) @binding(0) var uTexture: texture_2d<f32>;
            @group(2) @binding(1) var uSampler: sampler;

         
        `,main:`
            outColor = textureSample(uTexture, uSampler, vUV);
        `}},ge={name:"texture-bit",vertex:{header:`
            uniform mat3 uTextureMatrix;
        `,main:`
            uv = (uTextureMatrix * vec3(uv, 1.0)).xy;
        `},fragment:{header:`
        uniform sampler2D uTexture;

         
        `,main:`
            outColor = texture(uTexture, vUV);
        `}};function xe(n,e){const t=n.root,r=n.instructionSet;r.reset();const i=e.renderPipes?e:e.batch.renderer,a=i.renderPipes;a.batch.buildStart(r),a.blendMode.buildStart(),a.colorMask.buildStart(),t.sortableChildren&&t.sortChildren(),z(t,r,i,!0),a.batch.buildEnd(r),a.blendMode.buildEnd(r)}function b(n,e,t){const r=t.renderPipes?t:t.batch.renderer;n.globalDisplayStatus<7||!n.includeInBuild||(n.sortableChildren&&n.sortChildren(),n.isSimple?_e(n,e,r):z(n,e,r,!1))}function _e(n,e,t){if(n.renderPipeId){const r=n,{renderPipes:i,renderableGC:a}=t;i.blendMode.setBlendMode(r,n.groupBlendMode,e),i[r.renderPipeId].addRenderable(r,e),a.addRenderable(r,e),r.didViewUpdate=!1}if(!n.renderGroup){const r=n.children,i=r.length;for(let a=0;a<i;a++)b(r[a],e,t)}}function z(n,e,t,r){const{renderPipes:i,renderableGC:a}=t;if(!r&&n.renderGroup)i.renderGroup.addRenderGroup(n.renderGroup,e);else{for(let l=0;l<n.effects.length;l++){const c=n.effects[l];i[c.pipe].push(c,n,e)}const o=n,u=o.renderPipeId;u&&(i.blendMode.setBlendMode(o,o.groupBlendMode,e),i[u].addRenderable(o,e),a.addRenderable(o,e),o.didViewUpdate=!1);const d=n.children;if(d.length)for(let l=0;l<d.length;l++)b(d[l],e,t);for(let l=n.effects.length-1;l>=0;l--){const c=n.effects[l];i[c.pipe].pop(c,n,e)}}}const be=new s.me;class ye extends s.$o{constructor(){super(),this.filters=[new me({sprite:new s.Ai(s.W.EMPTY),inverse:!1,resolution:"inherit",antialias:"inherit"})]}get sprite(){return this.filters[0].sprite}set sprite(e){this.filters[0].sprite=e}get inverse(){return this.filters[0].inverse}set inverse(e){this.filters[0].inverse=e}}class W{constructor(e){this._activeMaskStage=[],this._renderer=e}push(e,t,r){const i=this._renderer;if(i.renderPipes.batch.break(r),r.add({renderPipeId:"alphaMask",action:"pushMaskBegin",mask:e,inverse:t._maskOptions.inverse,canBundle:!1,maskedContainer:t}),e.inverse=t._maskOptions.inverse,e.renderMaskToTexture){const a=e.mask;a.includeInBuild=!0,b(a,r,i),a.includeInBuild=!1}i.renderPipes.batch.break(r),r.add({renderPipeId:"alphaMask",action:"pushMaskEnd",mask:e,maskedContainer:t,inverse:t._maskOptions.inverse,canBundle:!1})}pop(e,t,r){this._renderer.renderPipes.batch.break(r),r.add({renderPipeId:"alphaMask",action:"popMaskEnd",mask:e,inverse:t._maskOptions.inverse,canBundle:!1})}execute(e){const t=this._renderer,r=e.mask.renderMaskToTexture;if(e.action==="pushMaskBegin"){const i=s.Se.get(ye);if(i.inverse=e.inverse,r){e.mask.mask.measurable=!0;const a=s.ul(e.mask.mask,!0,be);e.mask.mask.measurable=!1,a.ceil();const o=t.renderTarget.renderTarget.colorTexture.source,u=v.k.getOptimalTexture(a.width,a.height,o._resolution,o.antialias);t.renderTarget.push(u,!0),t.globalUniforms.push({offset:a,worldColor:4294967295});const d=i.sprite;d.texture=u,d.worldTransform.tx=a.minX,d.worldTransform.ty=a.minY,this._activeMaskStage.push({filterEffect:i,maskedContainer:e.maskedContainer,filterTexture:u})}else i.sprite=e.mask.mask,this._activeMaskStage.push({filterEffect:i,maskedContainer:e.maskedContainer})}else if(e.action==="pushMaskEnd"){const i=this._activeMaskStage[this._activeMaskStage.length-1];r&&(t.type===s._r.WEBGL&&t.renderTarget.finishRenderPass(),t.renderTarget.pop(),t.globalUniforms.pop()),t.filter.push({renderPipeId:"filter",action:"pushFilter",container:i.maskedContainer,filterEffect:i.filterEffect,canBundle:!1})}else if(e.action==="popMaskEnd"){t.filter.pop();const i=this._activeMaskStage.pop();r&&v.k.returnTexture(i.filterTexture),s.Se.return(i.filterEffect)}}destroy(){this._renderer=null,this._activeMaskStage=null}}W.extension={type:[s.D.WebGLPipes,s.D.WebGPUPipes,s.D.CanvasPipes],name:"alphaMask"};class L{constructor(e){this._colorStack=[],this._colorStackIndex=0,this._currentColor=0,this._renderer=e}buildStart(){this._colorStack[0]=15,this._colorStackIndex=1,this._currentColor=15}push(e,t,r){this._renderer.renderPipes.batch.break(r);const i=this._colorStack;i[this._colorStackIndex]=i[this._colorStackIndex-1]&e.mask;const a=this._colorStack[this._colorStackIndex];a!==this._currentColor&&(this._currentColor=a,r.add({renderPipeId:"colorMask",colorMask:a,canBundle:!1})),this._colorStackIndex++}pop(e,t,r){this._renderer.renderPipes.batch.break(r);const i=this._colorStack;this._colorStackIndex--;const a=i[this._colorStackIndex-1];a!==this._currentColor&&(this._currentColor=a,r.add({renderPipeId:"colorMask",colorMask:a,canBundle:!1}))}execute(e){this._renderer.colorMask.setMask(e.colorMask)}destroy(){this._colorStack=null}}L.extension={type:[s.D.WebGLPipes,s.D.WebGPUPipes,s.D.CanvasPipes],name:"colorMask"};class V{constructor(e){this._maskStackHash={},this._maskHash=new WeakMap,this._renderer=e}push(e,t,r){var i;const a=e,o=this._renderer;o.renderPipes.batch.break(r),o.renderPipes.blendMode.setBlendMode(a.mask,"none",r),r.add({renderPipeId:"stencilMask",action:"pushMaskBegin",mask:e,inverse:t._maskOptions.inverse,canBundle:!1});const u=a.mask;u.includeInBuild=!0,this._maskHash.has(a)||this._maskHash.set(a,{instructionsStart:0,instructionsLength:0});const d=this._maskHash.get(a);d.instructionsStart=r.instructionSize,b(u,r,o),u.includeInBuild=!1,o.renderPipes.batch.break(r),r.add({renderPipeId:"stencilMask",action:"pushMaskEnd",mask:e,inverse:t._maskOptions.inverse,canBundle:!1});const l=r.instructionSize-d.instructionsStart-1;d.instructionsLength=l;const c=o.renderTarget.renderTarget.uid;(i=this._maskStackHash)[c]??(i[c]=0)}pop(e,t,r){const i=e,a=this._renderer;a.renderPipes.batch.break(r),a.renderPipes.blendMode.setBlendMode(i.mask,"none",r),r.add({renderPipeId:"stencilMask",action:"popMaskBegin",inverse:t._maskOptions.inverse,canBundle:!1});const o=this._maskHash.get(e);for(let u=0;u<o.instructionsLength;u++)r.instructions[r.instructionSize++]=r.instructions[o.instructionsStart++];r.add({renderPipeId:"stencilMask",action:"popMaskEnd",canBundle:!1})}execute(e){var t;const r=this._renderer,i=r.renderTarget.renderTarget.uid;let a=(t=this._maskStackHash)[i]??(t[i]=0);e.action==="pushMaskBegin"?(r.renderTarget.ensureDepthStencil(),r.stencil.setStencilMode(s.Hf.RENDERING_MASK_ADD,a),a++,r.colorMask.setMask(0)):e.action==="pushMaskEnd"?(e.inverse?r.stencil.setStencilMode(s.Hf.INVERSE_MASK_ACTIVE,a):r.stencil.setStencilMode(s.Hf.MASK_ACTIVE,a),r.colorMask.setMask(15)):e.action==="popMaskBegin"?(r.colorMask.setMask(0),a!==0?r.stencil.setStencilMode(s.Hf.RENDERING_MASK_REMOVE,a):(r.renderTarget.clear(null,s.Vl.STENCIL),r.stencil.setStencilMode(s.Hf.DISABLED,a)),a--):e.action==="popMaskEnd"&&(e.inverse?r.stencil.setStencilMode(s.Hf.INVERSE_MASK_ACTIVE,a):r.stencil.setStencilMode(s.Hf.MASK_ACTIVE,a),r.colorMask.setMask(15)),this._maskStackHash[i]=a}destroy(){this._renderer=null,this._maskStackHash=null,this._maskHash=null}}V.extension={type:[s.D.WebGLPipes,s.D.WebGPUPipes,s.D.CanvasPipes],name:"stencilMask"};function ke(n,e){for(const t in n.attributes){const r=n.attributes[t],i=e[t];i?(r.format??(r.format=i.format),r.offset??(r.offset=i.offset),r.instance??(r.instance=i.instance)):s.ct(`Attribute ${t} is not present in the shader, but is present in the geometry. Unable to infer attribute details.`)}Te(n)}function Te(n){const{buffers:e,attributes:t}=n,r={},i={};for(const a in e){const o=e[a];r[o.uid]=0,i[o.uid]=0}for(const a in t){const o=t[a];r[o.buffer.uid]+=s.qu(o.format).stride}for(const a in t){const o=t[a];o.stride??(o.stride=r[o.buffer.uid]),o.start??(o.start=i[o.buffer.uid]),i[o.buffer.uid]+=s.qu(o.format).stride}}const f=[];f[s.Hf.NONE]=void 0;f[s.Hf.DISABLED]={stencilWriteMask:0,stencilReadMask:0};f[s.Hf.RENDERING_MASK_ADD]={stencilFront:{compare:"equal",passOp:"increment-clamp"},stencilBack:{compare:"equal",passOp:"increment-clamp"}};f[s.Hf.RENDERING_MASK_REMOVE]={stencilFront:{compare:"equal",passOp:"decrement-clamp"},stencilBack:{compare:"equal",passOp:"decrement-clamp"}};f[s.Hf.MASK_ACTIVE]={stencilWriteMask:0,stencilFront:{compare:"equal",passOp:"keep"},stencilBack:{compare:"equal",passOp:"keep"}};f[s.Hf.INVERSE_MASK_ACTIVE]={stencilWriteMask:0,stencilFront:{compare:"not-equal",passOp:"replace"},stencilBack:{compare:"not-equal",passOp:"replace"}};class Se{constructor(e){this._syncFunctionHash=Object.create(null),this._adaptor=e,this._systemCheck()}_systemCheck(){if(!s.of())throw new Error("Current environment does not allow unsafe-eval, please use pixi.js/unsafe-eval module to enable support.")}ensureUniformGroup(e){const t=this.getUniformGroupData(e);e.buffer||(e.buffer=new s.ls({data:new Float32Array(t.layout.size/4),usage:s.Rt.UNIFORM|s.Rt.COPY_DST}))}getUniformGroupData(e){return this._syncFunctionHash[e._signature]||this._initUniformGroup(e)}_initUniformGroup(e){const t=e._signature;let r=this._syncFunctionHash[t];if(!r){const i=Object.keys(e.uniformStructures).map(u=>e.uniformStructures[u]),a=this._adaptor.createUboElements(i),o=this._generateUboSync(a.uboElements);r=this._syncFunctionHash[t]={layout:a,syncFunction:o}}return this._syncFunctionHash[t]}_generateUboSync(e){return this._adaptor.generateUboSync(e)}syncUniformGroup(e,t,r){const i=this.getUniformGroupData(e);return e.buffer||(e.buffer=new s.ls({data:new Float32Array(i.layout.size/4),usage:s.Rt.UNIFORM|s.Rt.COPY_DST})),t||(t=e.buffer.data),r||(r=0),i.syncFunction(e.uniforms,t,r),!0}updateUniformGroup(e){if(e.isStatic&&!e._dirtyId)return!1;e._dirtyId=0;const t=this.syncUniformGroup(e);return e.buffer.update(),t}destroy(){this._syncFunctionHash=null}}const x=[{type:"mat3x3<f32>",test:n=>n.value.a!==void 0,ubo:`
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
        `,uniform:`
            gl.uniformMatrix3fv(ud[name].location, false, uv[name].toArray(true));
        `},{type:"vec4<f32>",test:n=>n.type==="vec4<f32>"&&n.size===1&&n.value.width!==void 0,ubo:`
            v = uv[name];
            data[offset] = v.x;
            data[offset + 1] = v.y;
            data[offset + 2] = v.width;
            data[offset + 3] = v.height;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.width || cv[3] !== v.height) {
                cv[0] = v.x;
                cv[1] = v.y;
                cv[2] = v.width;
                cv[3] = v.height;
                gl.uniform4f(ud[name].location, v.x, v.y, v.width, v.height);
            }
        `},{type:"vec2<f32>",test:n=>n.type==="vec2<f32>"&&n.size===1&&n.value.x!==void 0,ubo:`
            v = uv[name];
            data[offset] = v.x;
            data[offset + 1] = v.y;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.x || cv[1] !== v.y) {
                cv[0] = v.x;
                cv[1] = v.y;
                gl.uniform2f(ud[name].location, v.x, v.y);
            }
        `},{type:"vec4<f32>",test:n=>n.type==="vec4<f32>"&&n.size===1&&n.value.red!==void 0,ubo:`
            v = uv[name];
            data[offset] = v.red;
            data[offset + 1] = v.green;
            data[offset + 2] = v.blue;
            data[offset + 3] = v.alpha;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue || cv[3] !== v.alpha) {
                cv[0] = v.red;
                cv[1] = v.green;
                cv[2] = v.blue;
                cv[3] = v.alpha;
                gl.uniform4f(ud[name].location, v.red, v.green, v.blue, v.alpha);
            }
        `},{type:"vec3<f32>",test:n=>n.type==="vec3<f32>"&&n.size===1&&n.value.red!==void 0,ubo:`
            v = uv[name];
            data[offset] = v.red;
            data[offset + 1] = v.green;
            data[offset + 2] = v.blue;
        `,uniform:`
            cv = ud[name].value;
            v = uv[name];
            if (cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue) {
                cv[0] = v.red;
                cv[1] = v.green;
                cv[2] = v.blue;
                gl.uniform3f(ud[name].location, v.red, v.green, v.blue);
            }
        `}];function Me(n,e,t,r){const i=[`
        var v = null;
        var v2 = null;
        var t = 0;
        var index = 0;
        var name = null;
        var arrayOffset = null;
    `];let a=0;for(let u=0;u<n.length;u++){const d=n[u],l=d.data.name;let c=!1,h=0;for(let p=0;p<x.length;p++)if(x[p].test(d.data)){h=d.offset/4,i.push(`name = "${l}";`,`offset += ${h-a};`,x[p][e]||x[p].ubo),c=!0;break}if(!c)if(d.data.size>1)h=d.offset/4,i.push(t(d,h-a));else{const p=r[d.data.type];h=d.offset/4,i.push(`
                    v = uv.${l};
                    offset += ${h-a};
                    ${p};
                `)}a=h}const o=i.join(`
`);return new Function("uv","data","offset",o)}function m(n,e){return`
        for (let i = 0; i < ${n*e}; i++) {
            data[offset + (((i / ${n})|0) * 4) + (i % ${n})] = v[i];
        }
    `}const j={f32:`
        data[offset] = v;`,i32:`
        data[offset] = v;`,"vec2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];`,"vec3<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];`,"vec4<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 3] = v[3];`,"mat2x2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 4] = v[2];
        data[offset + 5] = v[3];`,"mat3x3<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 4] = v[3];
        data[offset + 5] = v[4];
        data[offset + 6] = v[5];
        data[offset + 8] = v[6];
        data[offset + 9] = v[7];
        data[offset + 10] = v[8];`,"mat4x4<f32>":`
        for (let i = 0; i < 16; i++) {
            data[offset + i] = v[i];
        }`,"mat3x2<f32>":m(3,2),"mat4x2<f32>":m(4,2),"mat2x3<f32>":m(2,3),"mat4x3<f32>":m(4,3),"mat2x4<f32>":m(2,4),"mat3x4<f32>":m(3,4)},Ce={...j,"mat2x2<f32>":`
        data[offset] = v[0];
        data[offset + 1] = v[1];
        data[offset + 2] = v[2];
        data[offset + 3] = v[3];
    `};function we(n,e,t,r,i,a){const o=a?1:-1;return n.identity(),n.a=1/r*2,n.d=o*(1/i*2),n.tx=-1-e*n.a,n.ty=-o-t*n.d,n}const g=new Map;function N(n,e){if(!g.has(n)){const t=new s.W({source:new s.Sl({resource:n,...e})}),r=()=>{g.get(n)===t&&g.delete(n)};t.once("destroy",r),t.source.once("destroy",r),g.set(n,t)}return g.get(n)}function Ge(n){const e=n.colorTexture.source.resource;return globalThis.HTMLCanvasElement&&e instanceof HTMLCanvasElement&&document.body.contains(e)}const q=class ${constructor(e={}){if(this.uid=s.gt("renderTarget"),this.colorTextures=[],this.dirtyId=0,this.isRoot=!1,this._size=new Float32Array(2),this._managedColorTextures=!1,e={...$.defaultOptions,...e},this.stencil=e.stencil,this.depth=e.depth,this.isRoot=e.isRoot,typeof e.colorTextures=="number"){this._managedColorTextures=!0;for(let t=0;t<e.colorTextures;t++)this.colorTextures.push(new s._e({width:e.width,height:e.height,resolution:e.resolution,antialias:e.antialias}))}else{this.colorTextures=[...e.colorTextures.map(r=>r.source)];const t=this.colorTexture.source;this.resize(t.width,t.height,t._resolution)}this.colorTexture.source.on("resize",this.onSourceResize,this),(e.depthStencilTexture||this.stencil)&&(e.depthStencilTexture instanceof s.W||e.depthStencilTexture instanceof s._e?this.depthStencilTexture=e.depthStencilTexture.source:this.ensureDepthStencilTexture())}get size(){const e=this._size;return e[0]=this.pixelWidth,e[1]=this.pixelHeight,e}get width(){return this.colorTexture.source.width}get height(){return this.colorTexture.source.height}get pixelWidth(){return this.colorTexture.source.pixelWidth}get pixelHeight(){return this.colorTexture.source.pixelHeight}get resolution(){return this.colorTexture.source._resolution}get colorTexture(){return this.colorTextures[0]}onSourceResize(e){this.resize(e.width,e.height,e._resolution,!0)}ensureDepthStencilTexture(){this.depthStencilTexture||(this.depthStencilTexture=new s._e({width:this.width,height:this.height,resolution:this.resolution,format:"depth24plus-stencil8",autoGenerateMipmaps:!1,antialias:!1,mipLevelCount:1}))}resize(e,t,r=this.resolution,i=!1){this.dirtyId++,this.colorTextures.forEach((a,o)=>{i&&o===0||a.source.resize(e,t,r)}),this.depthStencilTexture&&this.depthStencilTexture.source.resize(e,t,r)}destroy(){this.colorTexture.source.off("resize",this.onSourceResize,this),this._managedColorTextures&&this.colorTextures.forEach(e=>{e.destroy()}),this.depthStencilTexture&&(this.depthStencilTexture.destroy(),delete this.depthStencilTexture)}};q.defaultOptions={width:0,height:0,resolution:1,colorTextures:1,stencil:!1,depth:!1,antialias:!1,isRoot:!1};let S=q;class Pe{constructor(e){this.rootViewPort=new s.ft,this.viewport=new s.ft,this.onRenderTargetChange=new s.Af("onRenderTargetChange"),this.projectionMatrix=new s.H,this.defaultClearColor=[0,0,0,0],this._renderSurfaceToRenderTargetHash=new Map,this._gpuRenderTargetHash=Object.create(null),this._renderTargetStack=[],this._renderer=e,e.renderableGC.addManagedHash(this,"_gpuRenderTargetHash")}finishRenderPass(){this.adaptor.finishRenderPass(this.renderTarget)}renderStart({target:e,clear:t,clearColor:r,frame:i}){this._renderTargetStack.length=0,this.push(e,t,r,i),this.rootViewPort.copyFrom(this.viewport),this.rootRenderTarget=this.renderTarget,this.renderingToScreen=Ge(this.rootRenderTarget)}postrender(){var e,t;(t=(e=this.adaptor).postrender)==null||t.call(e,this.rootRenderTarget)}bind(e,t=!0,r,i){const a=this.getRenderTarget(e),o=this.renderTarget!==a;this.renderTarget=a,this.renderSurface=e;const u=this.getGpuRenderTarget(a);(a.pixelWidth!==u.width||a.pixelHeight!==u.height)&&(this.adaptor.resizeGpuRenderTarget(a),u.width=a.pixelWidth,u.height=a.pixelHeight);const d=a.colorTexture,l=this.viewport,c=d.pixelWidth,h=d.pixelHeight;if(!i&&e instanceof s.W&&(i=e.frame),i){const p=d._resolution;l.x=i.x*p+.5|0,l.y=i.y*p+.5|0,l.width=i.width*p+.5|0,l.height=i.height*p+.5|0}else l.x=0,l.y=0,l.width=c,l.height=h;return we(this.projectionMatrix,0,0,l.width/d.resolution,l.height/d.resolution,!a.isRoot),this.adaptor.startRenderPass(a,t,r,l),o&&this.onRenderTargetChange.emit(a),a}clear(e,t=s.Vl.ALL,r){t&&(e&&(e=this.getRenderTarget(e)),this.adaptor.clear(e||this.renderTarget,t,r,this.viewport))}contextChange(){this._gpuRenderTargetHash=Object.create(null)}push(e,t=s.Vl.ALL,r,i){const a=this.bind(e,t,r,i);return this._renderTargetStack.push({renderTarget:a,frame:i}),a}pop(){this._renderTargetStack.pop();const e=this._renderTargetStack[this._renderTargetStack.length-1];this.bind(e.renderTarget,!1,null,e.frame)}getRenderTarget(e){return e.isTexture&&(e=e.source),this._renderSurfaceToRenderTargetHash.get(e)??this._initRenderTarget(e)}copyToTexture(e,t,r,i,a){r.x<0&&(i.width+=r.x,a.x-=r.x,r.x=0),r.y<0&&(i.height+=r.y,a.y-=r.y,r.y=0);const{pixelWidth:o,pixelHeight:u}=e;return i.width=Math.min(i.width,o-r.x),i.height=Math.min(i.height,u-r.y),this.adaptor.copyToTexture(e,t,r,i,a)}ensureDepthStencil(){this.renderTarget.stencil||(this.renderTarget.stencil=!0,this.adaptor.startRenderPass(this.renderTarget,!1,null,this.viewport))}destroy(){this._renderer=null,this._renderSurfaceToRenderTargetHash.forEach((e,t)=>{e!==t&&e.destroy()}),this._renderSurfaceToRenderTargetHash.clear(),this._gpuRenderTargetHash=Object.create(null)}_initRenderTarget(e){let t=null;return s.Sl.test(e)&&(e=N(e).source),e instanceof S?t=e:e instanceof s._e&&(t=new S({colorTextures:[e]}),s.Sl.test(e.source.resource)&&(t.isRoot=!0),e.once("destroy",()=>{t.destroy(),this._renderSurfaceToRenderTargetHash.delete(e);const r=this._gpuRenderTargetHash[t.uid];r&&(this._gpuRenderTargetHash[t.uid]=null,this.adaptor.destroyGpuRenderTarget(r))})),this._renderSurfaceToRenderTargetHash.set(e,t),t}getGpuRenderTarget(e){return this._gpuRenderTargetHash[e.uid]||(this._gpuRenderTargetHash[e.uid]=this.adaptor.initGpuRenderTarget(e))}}class Re extends s.Tt{constructor({buffer:e,offset:t,size:r}){super(),this.uid=s.gt("buffer"),this._resourceType="bufferResource",this._touched=0,this._resourceId=s.gt("resource"),this._bufferResource=!0,this.destroyed=!1,this.buffer=e,this.offset=t|0,this.size=r,this.buffer.on("change",this.onBufferChange,this)}onBufferChange(){this._resourceId=s.gt("resource"),this.emit("change",this)}destroy(e=!1){this.destroyed=!0,e&&this.buffer.destroy(),this.emit("change",this),this.buffer=null}}class K{constructor(e){this._renderer=e}updateRenderable(){}destroyRenderable(){}validateRenderable(){return!1}addRenderable(e,t){this._renderer.renderPipes.batch.break(t),t.add(e)}execute(e){e.isRenderable&&e.render(this._renderer)}destroy(){this._renderer=null}}K.extension={type:[s.D.WebGLPipes,s.D.WebGPUPipes,s.D.CanvasPipes],name:"customRender"};function Y(n,e){const t=n.instructionSet,r=t.instructions;for(let i=0;i<t.instructionSize;i++){const a=r[i];e[a.renderPipeId].execute(a)}}class J{constructor(e){this._renderer=e}addRenderGroup(e,t){this._renderer.renderPipes.batch.break(t),t.add(e)}execute(e){e.isRenderable&&(this._renderer.globalUniforms.push({worldTransformMatrix:e.worldTransform,worldColor:e.worldColorAlpha}),Y(e,this._renderer.renderPipes),this._renderer.globalUniforms.pop())}destroy(){this._renderer=null}}J.extension={type:[s.D.WebGLPipes,s.D.WebGPUPipes,s.D.CanvasPipes],name:"renderGroup"};function C(n,e){e||(e=0);for(let t=e;t<n.length&&n[t];t++)n[t]=null}function X(n,e=[]){e.push(n);for(let t=0;t<n.renderGroupChildren.length;t++)X(n.renderGroupChildren[t],e);return e}function De(n,e,t){const r=n>>16&255,i=n>>8&255,a=n&255,o=e>>16&255,u=e>>8&255,d=e&255,l=r+(o-r)*t,c=i+(u-i)*t,h=a+(d-a)*t;return(l<<16)+(c<<8)+h}const y=16777215;function Q(n,e){return n===y||e===y?n+e-y:De(n,e,.5)}const Be=new s.It,I=s.Ln|s.Yo|s.ku;function Z(n,e=!1){Ue(n);const t=n.childrenToUpdate,r=n.updateTick++;for(const i in t){const a=Number(i),o=t[i],u=o.list,d=o.index;for(let l=0;l<d;l++){const c=u[l];c.parentRenderGroup===n&&c.relativeRenderGroupDepth===a&&ee(c,r,0)}C(u,d),o.index=0}if(e)for(let i=0;i<n.renderGroupChildren.length;i++)Z(n.renderGroupChildren[i],e)}function Ue(n){const e=n.root;let t;if(n.renderGroupParent){const r=n.renderGroupParent;n.worldTransform.appendFrom(e.relativeGroupTransform,r.worldTransform),n.worldColor=Q(e.groupColor,r.worldColor),t=e.groupAlpha*r.worldAlpha}else n.worldTransform.copyFrom(e.localTransform),n.worldColor=e.localColor,t=e.localAlpha;t=t<0?0:t>1?1:t,n.worldAlpha=t,n.worldColorAlpha=n.worldColor+((t*255|0)<<24)}function ee(n,e,t){if(e===n.updateTick)return;n.updateTick=e,n.didChange=!1;const r=n.localTransform;n.updateLocalTransform();const i=n.parent;if(i&&!i.renderGroup?(t=t|n._updateFlags,n.relativeGroupTransform.appendFrom(r,i.relativeGroupTransform),t&I&&A(n,i,t)):(t=n._updateFlags,n.relativeGroupTransform.copyFrom(r),t&I&&A(n,Be,t)),!n.renderGroup){const a=n.children,o=a.length;for(let l=0;l<o;l++)ee(a[l],e,t);const u=n.parentRenderGroup,d=n;d.renderPipeId&&!u.structureDidChange&&u.updateRenderable(d)}}function A(n,e,t){if(t&s.Yo){n.groupColor=Q(n.localColor,e.groupColor);let r=n.localAlpha*e.groupAlpha;r=r<0?0:r>1?1:r,n.groupAlpha=r,n.groupColorAlpha=n.groupColor+((r*255|0)<<24)}t&s.ku&&(n.groupBlendMode=n.localBlendMode==="inherit"?e.groupBlendMode:n.localBlendMode),t&s.Ln&&(n.globalDisplayStatus=n.localDisplayStatus&e.globalDisplayStatus),n._updateFlags=0}function Ie(n,e){const{list:t,index:r}=n.childrenRenderablesToUpdate;let i=!1;for(let a=0;a<r;a++){const o=t[a];if(i=e[o.renderPipeId].validateRenderable(o),i)break}return n.structureDidChange=i,i}const Ae=new s.H;class te{constructor(e){this._renderer=e}render({container:e,transform:t}){e.isRenderGroup=!0;const r=e.parent,i=e.renderGroup.renderGroupParent;e.parent=null,e.renderGroup.renderGroupParent=null;const a=this._renderer,o=X(e.renderGroup,[]);let u=Ae;t&&(u=u.copyFrom(e.renderGroup.localTransform),e.renderGroup.localTransform.copyFrom(t));const d=a.renderPipes;for(let l=0;l<o.length;l++){const c=o[l];c.runOnRender(),c.instructionSet.renderPipes=d,c.structureDidChange?C(c.childrenRenderablesToUpdate.list,0):Ie(c,d),Z(c),c.structureDidChange?(c.structureDidChange=!1,xe(c,a)):He(c),c.childrenRenderablesToUpdate.index=0,a.renderPipes.batch.upload(c.instructionSet)}a.globalUniforms.start({worldTransformMatrix:t?e.renderGroup.localTransform:e.renderGroup.worldTransform,worldColor:e.renderGroup.worldColorAlpha}),Y(e.renderGroup,d),d.uniformBatch&&d.uniformBatch.renderEnd(),t&&e.renderGroup.localTransform.copyFrom(u),e.parent=r,e.renderGroup.renderGroupParent=i}destroy(){this._renderer=null}}te.extension={type:[s.D.WebGLSystem,s.D.WebGPUSystem,s.D.CanvasSystem],name:"renderGroup"};function He(n){const{list:e,index:t}=n.childrenRenderablesToUpdate;for(let r=0;r<t;r++){const i=e[r];i.didViewUpdate&&n.updateRenderable(i)}C(e,t)}class re{constructor(e){this._gpuSpriteHash=Object.create(null),this._destroyRenderableBound=this.destroyRenderable.bind(this),this._renderer=e,this._renderer.renderableGC.addManagedHash(this,"_gpuSpriteHash")}addRenderable(e,t){const r=this._getGpuSprite(e);e.didViewUpdate&&this._updateBatchableSprite(e,r),this._renderer.renderPipes.batch.addToBatch(r,t)}updateRenderable(e){const t=this._gpuSpriteHash[e.uid];e.didViewUpdate&&this._updateBatchableSprite(e,t),t._batcher.updateElement(t)}validateRenderable(e){const t=e._texture,r=this._getGpuSprite(e);return r.texture._source!==t._source?!r._batcher.checkAndUpdateTexture(r,t):!1}destroyRenderable(e){const t=this._gpuSpriteHash[e.uid];s.Se.return(t),this._gpuSpriteHash[e.uid]=null,e.off("destroyed",this._destroyRenderableBound)}_updateBatchableSprite(e,t){t.bounds=e.bounds,t.texture=e._texture}_getGpuSprite(e){return this._gpuSpriteHash[e.uid]||this._initGPUSprite(e)}_initGPUSprite(e){const t=s.Se.get(v.U);return t.renderable=e,t.transform=e.groupTransform,t.texture=e._texture,t.bounds=e.bounds,t.roundPixels=this._renderer._roundPixels|e._roundPixels,this._gpuSpriteHash[e.uid]=t,e.on("destroyed",this._destroyRenderableBound),t}destroy(){for(const e in this._gpuSpriteHash)s.Se.return(this._gpuSpriteHash[e]);this._gpuSpriteHash=null,this._renderer=null}}re.extension={type:[s.D.WebGLPipes,s.D.WebGPUPipes,s.D.CanvasPipes],name:"sprite"};const w=class ne{constructor(){this.clearBeforeRender=!0,this._backgroundColor=new s.dt(0),this.color=this._backgroundColor,this.alpha=1}init(e){e={...ne.defaultOptions,...e},this.clearBeforeRender=e.clearBeforeRender,this.color=e.background||e.backgroundColor||this._backgroundColor,this.alpha=e.backgroundAlpha,this._backgroundColor.setAlpha(e.backgroundAlpha)}get color(){return this._backgroundColor}set color(e){this._backgroundColor.setValue(e)}get alpha(){return this._backgroundColor.alpha}set alpha(e){this._backgroundColor.setAlpha(e)}get colorRgba(){return this._backgroundColor.toArray()}destroy(){}};w.extension={type:[s.D.WebGLSystem,s.D.WebGPUSystem,s.D.CanvasSystem],name:"background",priority:0};w.defaultOptions={backgroundAlpha:1,backgroundColor:0,clearBeforeRender:!0};let Oe=w;const _={};s.Ct.handle(s.D.BlendMode,n=>{if(!n.name)throw new Error("BlendMode extension must have a name property");_[n.name]=n.ref},n=>{delete _[n.name]});class ie{constructor(e){this._isAdvanced=!1,this._filterHash=Object.create(null),this._renderer=e}setBlendMode(e,t,r){if(this._activeBlendMode===t){this._isAdvanced&&this._renderableList.push(e);return}this._activeBlendMode=t,this._isAdvanced&&this._endAdvancedBlendMode(r),this._isAdvanced=!!_[t],this._isAdvanced&&(this._beginAdvancedBlendMode(r),this._renderableList.push(e))}_beginAdvancedBlendMode(e){this._renderer.renderPipes.batch.break(e);const t=this._activeBlendMode;if(!_[t]){s.ct(`Unable to assign BlendMode: '${t}'. You may want to include: import 'pixi.js/advanced-blend-modes'`);return}let r=this._filterHash[t];r||(r=this._filterHash[t]=new s.$o,r.filters=[new _[t]]);const i={renderPipeId:"filter",action:"pushFilter",renderables:[],filterEffect:r,canBundle:!1};this._renderableList=i.renderables,e.add(i)}_endAdvancedBlendMode(e){this._renderableList=null,this._renderer.renderPipes.batch.break(e),e.add({renderPipeId:"filter",action:"popFilter",canBundle:!1})}buildStart(){this._isAdvanced=!1}buildEnd(e){this._isAdvanced&&this._endAdvancedBlendMode(e)}destroy(){this._renderer=null,this._renderableList=null;for(const e in this._filterHash)this._filterHash[e].destroy();this._filterHash=null}}ie.extension={type:[s.D.WebGLPipes,s.D.WebGPUPipes,s.D.CanvasPipes],name:"blendMode"};const k={png:"image/png",jpg:"image/jpeg",webp:"image/webp"},G=class se{constructor(e){this._renderer=e}_normalizeOptions(e,t={}){return e instanceof s.It||e instanceof s.W?{target:e,...t}:{...t,...e}}async image(e){const t=new Image;return t.src=await this.base64(e),t}async base64(e){e=this._normalizeOptions(e,se.defaultImageOptions);const{format:t,quality:r}=e,i=this.canvas(e);if(i.toBlob!==void 0)return new Promise((a,o)=>{i.toBlob(u=>{if(!u){o(new Error("ICanvas.toBlob failed!"));return}const d=new FileReader;d.onload=()=>a(d.result),d.onerror=o,d.readAsDataURL(u)},k[t],r)});if(i.toDataURL!==void 0)return i.toDataURL(k[t],r);if(i.convertToBlob!==void 0){const a=await i.convertToBlob({type:k[t],quality:r});return new Promise((o,u)=>{const d=new FileReader;d.onload=()=>o(d.result),d.onerror=u,d.readAsDataURL(a)})}throw new Error("Extract.base64() requires ICanvas.toDataURL, ICanvas.toBlob, or ICanvas.convertToBlob to be implemented")}canvas(e){e=this._normalizeOptions(e);const t=e.target,r=this._renderer;if(t instanceof s.W)return r.texture.generateCanvas(t);const i=r.textureGenerator.generateTexture(e),a=r.texture.generateCanvas(i);return i.destroy(),a}pixels(e){e=this._normalizeOptions(e);const t=e.target,r=this._renderer,i=t instanceof s.W?t:r.textureGenerator.generateTexture(e),a=r.texture.getPixels(i);return t instanceof s.It&&i.destroy(),a}texture(e){return e=this._normalizeOptions(e),e.target instanceof s.W?e.target:this._renderer.textureGenerator.generateTexture(e)}download(e){e=this._normalizeOptions(e);const t=this.canvas(e),r=document.createElement("a");r.download=e.filename??"image.png",r.href=t.toDataURL("image/png"),document.body.appendChild(r),r.click(),document.body.removeChild(r)}log(e){const t=e.width??200;e=this._normalizeOptions(e);const r=this.canvas(e),i=r.toDataURL();console.log(`[Pixi Texture] ${r.width}px ${r.height}px`);const a=["font-size: 1px;",`padding: ${t}px 300px;`,`background: url(${i}) no-repeat;`,"background-size: contain;"].join(" ");console.log("%c ",a)}destroy(){this._renderer=null}};G.extension={type:[s.D.WebGLSystem,s.D.WebGPUSystem],name:"extract"};G.defaultImageOptions={format:"png",quality:1};let Fe=G;const Ee=new s.ft,ze=new s.me,We=[0,0,0,0];class ae{constructor(e){this._renderer=e}generateTexture(e){var t;e instanceof s.It&&(e={target:e,frame:void 0,textureSourceOptions:{},resolution:void 0});const r=e.resolution||this._renderer.resolution,i=e.antialias||this._renderer.view.antialias,a=e.target;let o=e.clearColor;o?o=Array.isArray(o)&&o.length===4?o:s.dt.shared.setValue(o).toArray():o=We;const u=((t=e.frame)==null?void 0:t.copyTo(Ee))||s.dl(a,ze).rectangle;u.width=Math.max(u.width,1/r)|0,u.height=Math.max(u.height,1/r)|0;const d=s.ho.create({...e.textureSourceOptions,width:u.width,height:u.height,resolution:r,antialias:i}),l=s.H.shared.translate(-u.x,-u.y);return this._renderer.render({container:a,transform:l,target:d,clearColor:o}),d.source.updateMipmaps(),d}destroy(){this._renderer=null}}ae.extension={type:[s.D.WebGLSystem,s.D.WebGPUSystem],name:"textureGenerator"};class oe{constructor(e){this._stackIndex=0,this._globalUniformDataStack=[],this._uniformsPool=[],this._activeUniforms=[],this._bindGroupPool=[],this._activeBindGroups=[],this._renderer=e}reset(){this._stackIndex=0;for(let e=0;e<this._activeUniforms.length;e++)this._uniformsPool.push(this._activeUniforms[e]);for(let e=0;e<this._activeBindGroups.length;e++)this._bindGroupPool.push(this._activeBindGroups[e]);this._activeUniforms.length=0,this._activeBindGroups.length=0}start(e){this.reset(),this.push(e)}bind({size:e,projectionMatrix:t,worldTransformMatrix:r,worldColor:i,offset:a}){const o=this._renderer.renderTarget.renderTarget,u=this._stackIndex?this._globalUniformDataStack[this._stackIndex-1]:{projectionData:o,worldTransformMatrix:new s.H,worldColor:4294967295,offset:new s.At},d={projectionMatrix:t||this._renderer.renderTarget.projectionMatrix,resolution:e||o.size,worldTransformMatrix:r||u.worldTransformMatrix,worldColor:i||u.worldColor,offset:a||u.offset,bindGroup:null},l=this._uniformsPool.pop()||this._createUniforms();this._activeUniforms.push(l);const c=l.uniforms;c.uProjectionMatrix=d.projectionMatrix,c.uResolution=d.resolution,c.uWorldTransformMatrix.copyFrom(d.worldTransformMatrix),c.uWorldTransformMatrix.tx-=d.offset.x,c.uWorldTransformMatrix.ty-=d.offset.y,v.v(d.worldColor,c.uWorldColorAlpha,0),l.update();let h;this._renderer.renderPipes.uniformBatch?h=this._renderer.renderPipes.uniformBatch.getUniformBindGroup(l,!1):(h=this._bindGroupPool.pop()||new s.zs,this._activeBindGroups.push(h),h.setResource(l,0)),d.bindGroup=h,this._currentGlobalUniformData=d}push(e){this.bind(e),this._globalUniformDataStack[this._stackIndex++]=this._currentGlobalUniformData}pop(){this._currentGlobalUniformData=this._globalUniformDataStack[--this._stackIndex-1],this._renderer.type===s._r.WEBGL&&this._currentGlobalUniformData.bindGroup.resources[0].update()}get bindGroup(){return this._currentGlobalUniformData.bindGroup}get globalUniformData(){return this._currentGlobalUniformData}get uniformGroup(){return this._currentGlobalUniformData.bindGroup.resources[0]}_createUniforms(){return new s.Dl({uProjectionMatrix:{value:new s.H,type:"mat3x3<f32>"},uWorldTransformMatrix:{value:new s.H,type:"mat3x3<f32>"},uWorldColorAlpha:{value:new Float32Array(4),type:"vec4<f32>"},uResolution:{value:[0,0],type:"vec2<f32>"}},{isStatic:!0})}destroy(){this._renderer=null}}oe.extension={type:[s.D.WebGLSystem,s.D.WebGPUSystem,s.D.CanvasSystem],name:"globalUniforms"};let Le=1;class ue{constructor(){this._tasks=[],this._offset=0}init(){s.we.system.add(this._update,this)}repeat(e,t,r=!0){const i=Le++;let a=0;return r&&(this._offset+=1e3,a=this._offset),this._tasks.push({func:e,duration:t,start:performance.now(),offset:a,last:performance.now(),repeat:!0,id:i}),i}cancel(e){for(let t=0;t<this._tasks.length;t++)if(this._tasks[t].id===e){this._tasks.splice(t,1);return}}_update(){const e=performance.now();for(let t=0;t<this._tasks.length;t++){const r=this._tasks[t];if(e-r.offset-r.last>=r.duration){const i=e-r.start;r.func(i),r.last=e}}}destroy(){s.we.system.remove(this._update,this),this._tasks.length=0}}ue.extension={type:[s.D.WebGLSystem,s.D.WebGPUSystem,s.D.CanvasSystem],name:"scheduler",priority:0};let H=!1;function Ve(n){if(!H){if(s.ot.get().getNavigator().userAgent.toLowerCase().indexOf("chrome")>-1){const e=[`%c  %c  %c  %c  %c PixiJS %c v${s.$l} (${n}) http://www.pixijs.com/

`,"background: #E72264; padding:5px 0;","background: #6CA2EA; padding:5px 0;","background: #B5D33D; padding:5px 0;","background: #FED23F; padding:5px 0;","color: #FFFFFF; background: #E72264; padding:5px 0;","color: #E72264; background: #FFFFFF; padding:5px 0;"];globalThis.console.log(...e)}else globalThis.console&&globalThis.console.log(`PixiJS ${s.$l} - ${n} - http://www.pixijs.com/`);H=!0}}class P{constructor(e){this._renderer=e}init(e){if(e.hello){let t=this._renderer.name;this._renderer.type===s._r.WEBGL&&(t+=` ${this._renderer.context.webGLVersion}`),Ve(t)}}}P.extension={type:[s.D.WebGLSystem,s.D.WebGPUSystem,s.D.CanvasSystem],name:"hello",priority:-2};P.defaultOptions={hello:!1};function je(n){let e=!1;for(const r in n)if(n[r]==null){e=!0;break}if(!e)return n;const t=Object.create(null);for(const r in n){const i=n[r];i&&(t[r]=i)}return t}function Ne(n){let e=0;for(let t=0;t<n.length;t++)n[t]==null?e++:n[t-e]=n[t];return n.length=n.length-e,n}const R=class de{constructor(e){this._managedRenderables=[],this._managedHashes=[],this._managedArrays=[],this._renderer=e}init(e){e={...de.defaultOptions,...e},this.maxUnusedTime=e.renderableGCMaxUnusedTime,this._frequency=e.renderableGCFrequency,this.enabled=e.renderableGCActive}get enabled(){return!!this._handler}set enabled(e){this.enabled!==e&&(e?(this._handler=this._renderer.scheduler.repeat(()=>this.run(),this._frequency,!1),this._hashHandler=this._renderer.scheduler.repeat(()=>{for(const t of this._managedHashes)t.context[t.hash]=je(t.context[t.hash])},this._frequency),this._arrayHandler=this._renderer.scheduler.repeat(()=>{for(const t of this._managedArrays)Ne(t.context[t.hash])},this._frequency)):(this._renderer.scheduler.cancel(this._handler),this._renderer.scheduler.cancel(this._hashHandler),this._renderer.scheduler.cancel(this._arrayHandler)))}addManagedHash(e,t){this._managedHashes.push({context:e,hash:t})}addManagedArray(e,t){this._managedArrays.push({context:e,hash:t})}prerender(){this._now=performance.now()}addRenderable(e,t){this.enabled&&(e._lastUsed=this._now,e._lastInstructionTick===-1&&(this._managedRenderables.push(e),e.once("destroyed",this._removeRenderable,this)),e._lastInstructionTick=t.tick)}run(){var e;const t=performance.now(),r=this._managedRenderables,i=this._renderer.renderPipes;let a=0;for(let o=0;o<r.length;o++){const u=r[o];if(u===null){a++;continue}const d=u.renderGroup??u.parentRenderGroup,l=((e=d==null?void 0:d.instructionSet)==null?void 0:e.tick)??-1;u._lastInstructionTick!==l&&t-u._lastUsed>this.maxUnusedTime?(u.destroyed||i[u.renderPipeId].destroyRenderable(u),u._lastInstructionTick=-1,a++,u.off("destroyed",this._removeRenderable,this)):r[o-a]=u}r.length=r.length-a}destroy(){this.enabled=!1,this._renderer=null,this._managedRenderables.length=0,this._managedHashes.length=0,this._managedArrays.length=0}_removeRenderable(e){const t=this._managedRenderables.indexOf(e);t>=0&&(e.off("destroyed",this._removeRenderable,this),this._managedRenderables[t]=null)}};R.extension={type:[s.D.WebGLSystem,s.D.WebGPUSystem],name:"renderableGC",priority:0};R.defaultOptions={renderableGCActive:!0,renderableGCMaxUnusedTime:6e4,renderableGCFrequency:3e4};let qe=R;const D=class le{constructor(e){this._renderer=e,this.count=0,this.checkCount=0}init(e){e={...le.defaultOptions,...e},this.checkCountMax=e.textureGCCheckCountMax,this.maxIdle=e.textureGCAMaxIdle??e.textureGCMaxIdle,this.active=e.textureGCActive}postrender(){this._renderer.renderingToScreen&&(this.count++,this.active&&(this.checkCount++,this.checkCount>this.checkCountMax&&(this.checkCount=0,this.run())))}run(){const e=this._renderer.texture.managedTextures;for(let t=0;t<e.length;t++){const r=e[t];r.autoGarbageCollect&&r.resource&&r._touched>-1&&this.count-r._touched>this.maxIdle&&(r._touched=-1,r.unload())}}destroy(){this._renderer=null}};D.extension={type:[s.D.WebGLSystem,s.D.WebGPUSystem],name:"textureGC"};D.defaultOptions={textureGCActive:!0,textureGCAMaxIdle:null,textureGCMaxIdle:60*60,textureGCCheckCountMax:600};let $e=D;const B=class ce{get autoDensity(){return this.texture.source.autoDensity}set autoDensity(e){this.texture.source.autoDensity=e}get resolution(){return this.texture.source._resolution}set resolution(e){this.texture.source.resize(this.texture.source.width,this.texture.source.height,e)}init(e){e={...ce.defaultOptions,...e},e.view&&(s.$(s.j,"ViewSystem.view has been renamed to ViewSystem.canvas"),e.canvas=e.view),this.screen=new s.ft(0,0,e.width,e.height),this.canvas=e.canvas||s.ot.get().createCanvas(),this.antialias=!!e.antialias,this.texture=N(this.canvas,e),this.renderTarget=new S({colorTextures:[this.texture],depth:!!e.depth,isRoot:!0}),this.texture.source.transparent=e.backgroundAlpha<1,this.resolution=e.resolution}resize(e,t,r){this.texture.source.resize(e,t,r),this.screen.width=this.texture.frame.width,this.screen.height=this.texture.frame.height}destroy(e=!1){(typeof e=="boolean"?e:e!=null&&e.removeView)&&this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas)}};B.extension={type:[s.D.WebGLSystem,s.D.WebGPUSystem,s.D.CanvasSystem],name:"view",priority:0};B.defaultOptions={width:800,height:600,autoDensity:!1,antialias:!1};let Ke=B;const Ye=[Oe,oe,P,Ke,te,$e,ae,Fe,s.kf,qe,ue],Je=[ie,E,re,J,W,V,L,K];exports.Dt=ve;exports.Ft=ke;exports.Ht=Se;exports.Lt=Me;exports.Nt=Je;exports.Ot=ge;exports.Vt=Re;exports.Wt=Ce;exports.ht=j;exports.jt=Ye;exports.k=x;exports.x=f;exports.zt=Pe;
