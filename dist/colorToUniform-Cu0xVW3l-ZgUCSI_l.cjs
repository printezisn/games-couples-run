"use strict";const u=require("./index-BsF6_GBc.cjs"),_={normal:0,add:1,multiply:2,screen:3,overlay:4,erase:5,"normal-npm":6,"add-npm":7,"screen-npm":8,min:9,max:10},d=0,c=1,f=2,g=3,m=4,x=5,p=class b{constructor(){this.data=0,this.blendMode="normal",this.polygonOffset=0,this.blend=!0,this.depthMask=!0}get blend(){return!!(this.data&1<<d)}set blend(t){!!(this.data&1<<d)!==t&&(this.data^=1<<d)}get offsets(){return!!(this.data&1<<c)}set offsets(t){!!(this.data&1<<c)!==t&&(this.data^=1<<c)}set cullMode(t){if(t==="none"){this.culling=!1;return}this.culling=!0,this.clockwiseFrontFace=t==="front"}get cullMode(){return this.culling?this.clockwiseFrontFace?"front":"back":"none"}get culling(){return!!(this.data&1<<f)}set culling(t){!!(this.data&1<<f)!==t&&(this.data^=1<<f)}get depthTest(){return!!(this.data&1<<g)}set depthTest(t){!!(this.data&1<<g)!==t&&(this.data^=1<<g)}get depthMask(){return!!(this.data&1<<x)}set depthMask(t){!!(this.data&1<<x)!==t&&(this.data^=1<<x)}get clockwiseFrontFace(){return!!(this.data&1<<m)}set clockwiseFrontFace(t){!!(this.data&1<<m)!==t&&(this.data^=1<<m)}get blendMode(){return this._blendMode}set blendMode(t){this.blend=t!=="none",this._blendMode=t,this._blendModeId=_[t]||0}get polygonOffset(){return this._polygonOffset}set polygonOffset(t){this.offsets=!!t,this._polygonOffset=t}toString(){return`[pixi.js/core:State blendMode=${this.blendMode} clockwiseFrontFace=${this.clockwiseFrontFace} culling=${this.culling} depthMask=${this.depthMask} polygonOffset=${this.polygonOffset}]`}static for2d(){const t=new b;return t.depthTest=!1,t.blend=!0,t}};p.default2d=p.for2d();let M=p,v=0;class P{constructor(t){this._poolKeyHash=Object.create(null),this._texturePool={},this.textureOptions=t||{},this.enableFullScreen=!1}createTexture(t,o,e){const r=new u._e({...this.textureOptions,width:t,height:o,resolution:1,antialias:e,autoGarbageCollect:!0});return new u.W({source:r,label:`texturePool_${v++}`})}getOptimalTexture(t,o,e=1,r){let n=Math.ceil(t*e-1e-6),l=Math.ceil(o*e-1e-6);n=u.Ro(n),l=u.Ro(l);const a=(n<<17)+(l<<1)+(r?1:0);this._texturePool[a]||(this._texturePool[a]=[]);let s=this._texturePool[a].pop();return s||(s=this.createTexture(n,l,r)),s.source._resolution=e,s.source.width=n/e,s.source.height=l/e,s.source.pixelWidth=n,s.source.pixelHeight=l,s.frame.x=0,s.frame.y=0,s.frame.width=t,s.frame.height=o,s.updateUvs(),this._poolKeyHash[s.uid]=a,s}getSameSizeTexture(t,o=!1){const e=t.source;return this.getOptimalTexture(t.width,t.height,e._resolution,o)}returnTexture(t){const o=this._poolKeyHash[t.uid];this._texturePool[o].push(t)}clear(t){if(t=t!==!1,t)for(const o in this._texturePool){const e=this._texturePool[o];if(e)for(let r=0;r<e.length;r++)e[r].destroy(!0)}this._texturePool={}}}const w=new P,h={name:"local-uniform-bit",vertex:{header:`

            struct LocalUniforms {
                uTransformMatrix:mat3x3<f32>,
                uColor:vec4<f32>,
                uRound:f32,
            }

            @group(1) @binding(0) var<uniform> localUniforms : LocalUniforms;
        `,main:`
            vColor *= localUniforms.uColor;
            modelMatrix *= localUniforms.uTransformMatrix;
        `,end:`
            if(localUniforms.uRound == 1)
            {
                vPosition = vec4(roundPixels(vPosition.xy, globalUniforms.uResolution), vPosition.zw);
            }
        `}},y={...h,vertex:{...h.vertex,header:h.vertex.header.replace("group(1)","group(2)")}},k={name:"local-uniform-bit",vertex:{header:`

            uniform mat3 uTransformMatrix;
            uniform vec4 uColor;
            uniform float uRound;
        `,main:`
            vColor *= uColor;
            modelMatrix = uTransformMatrix;
        `,end:`
            if(uRound == 1.)
            {
                gl_Position.xy = roundPixels(gl_Position.xy, uResolution);
            }
        `}};class F{constructor(){this.batcherName="default",this.attributeSize=4,this.indexSize=6,this.packAsQuad=!0,this.roundPixels=0,this._attributeStart=0,this._batcher=null,this._batch=null}get blendMode(){return this.renderable.groupBlendMode}get color(){return this.renderable.groupColorAlpha}reset(){this.renderable=null,this.texture=null,this._batcher=null,this._batch=null,this.bounds=null}}function O(i,t,o){const e=(i>>24&255)/255;t[o++]=(i&255)/255*e,t[o++]=(i>>8&255)/255*e,t[o++]=(i>>16&255)/255*e,t[o++]=e}exports.F=y;exports.O=k;exports.U=F;exports.k=w;exports.m=h;exports.v=O;exports.w=M;
