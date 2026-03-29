import{bf as k,eE as O,g as $,fP as H,hW as et,e as Z,ez as Qe,fX as U,hX as tn,I as lt,eI as en,hY as nn,fB as sn,Z as on,hZ as rn,eR as an,eU as ln,h_ as cn,f3 as un,be as Et,eL as fn,eM as hn,eQ as dn,ay as pn,b4 as bt,av as St,h$ as gn,i0 as mn,eH as yt,J as In,aT as wn,i1 as En,i2 as bn,i3 as Sn,ai as yn,eY as xt,i4 as xn,i5 as kn,ex as An,s as Rn,eC as W,fp as Y,f5 as X,g0 as $n,eJ as q,aV as Tn,g5 as Mn,f6 as Nn,a6 as vn,g6 as Fn,H as kt,eA as D,g3 as At,f4 as R,a7 as Rt,g7 as $t,aI as Tt,aK as Mt,aL as Nt,aM as vt,g9 as Ft,aU as Ot,ga as Dt,gb as _t,b0 as Vt,b7 as Pt,bi as Ct,bn as Lt,fb as On,bo as Dn,g4 as Wt,cd as _n,bz as Vn,af as Gt,dB as Pn,L as Cn,cA as Ln,bN as qt,eS as nt,bR as zt,bX as Wn,c4 as jt,c6 as Bt,gc as Ut,i6 as Gn,c8 as Xt,i7 as j}from"./graph_model-CCGk6-qK.js";function Kt(t,e){const n=t.shape.length,s=e.shape.length;if(n<1)throw new Error(`tf.gatherND() expects the input to be rank 1 or higher, but the rank was ${n}.`);if(s<1)throw new Error(`tf.gatherND() expects the indices to be rank 1 or higher, but the rank was ${s}.`);if(e.dtype!=="int32")throw new Error(`tf.gatherND() expects the indices to be int32 type, but the dtype was ${e.dtype}.`);if(e.shape[s-1]>n)throw new Error(`index innermost dimension length must be <= tensor rank; saw: ${e.shape[s-1]} vs. ${n}`);if(k(t.shape)===0)throw new Error(`Requested more than 0 entries, but input is empty. Input shape: ${t.shape}.`);const o=e.shape,r=o[o.length-1];let a=1;for(let c=0;c<o.length-1;++c)a*=o[c];const i=t.shape,l=o.slice();l.pop();let u=1;for(let c=r;c<n;++c)u*=i[c],l.push(i[c]);const h=[...O(t.shape).map(c=>c/u),1].slice(0,r);return[l,a,u,h]}const Go=Object.freeze(Object.defineProperty({__proto__:null,prepareAndValidate:Kt},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const st=-2,qn=-1;function Zt(t,e,n){const s=t.shape.length;$(s===e.length,()=>`Error in slice${s}D: Length of begin ${e} must match the rank of the array (${s}).`),$(s===n.length,()=>`Error in slice${s}D: Length of size ${n} must match the rank of the array (${s}).`);for(let o=0;o<s;++o)$(e[o]+n[o]<=t.shape[o],()=>`Error in slice${s}D: begin[${o}] + size[${o}] (${e[o]+n[o]}) would overflow input.shape[${o}] (${t.shape[o]})`)}function zn(t){const e=[];let n=0;for(;t>0;)t&1&&e.push(n),t/=2,n++;return e}function jn(t,e,n){const s=[];for(let o=0;o<t.length;o++)s[o]=Math.ceil((e[o]-t[o])/n[o]);return s}function Ht(t,e,n,s){const o=[...t];for(let r=o.length;r<s.length;r++)o.push(1);for(let r=0;r<n;r++)r===0?o[e]=1:(o.splice(e,0,1),o.pop());return o}function Jt(t,e,n){return n<=t?n:n-(e-1)}function Yt(t,e){const n=[];for(let s=0;s<t;s++)n.push(e+s);return n}function Bn(t,e,n,s,o,r,a,i,l){const u=t.length;let h=new Array(u),c=new Array(u),f=new Array(u);if(e.length&&n>0){const p=e[0],g=n+1;h=Qt(a,p,g,s,t),c=te(i,p,g,o,t),f=Ht(r,p,g,t)}else for(let p=0;p<u;p++)h[p]=ne(a,s,r,t,p,l),c[p]=se(i,o,r,t,p,l),f[p]=ee(r,p,l);return{begin:h,end:c,strides:f}}function Qt(t,e,n,s,o){const r=[...o],a=Yt(n,e);for(let i=0;i<r.length;i++)if(a.indexOf(i)>-1)r[i]=0;else{const l=Jt(e,n,i);let u=s[l];t&1<<l&&(u=0),r[i]=u}return r}function te(t,e,n,s,o){const r=[...o],a=Yt(n,e);for(let i=0;i<r.length;i++)if(a.indexOf(i)>-1)r[i]=Number.MAX_SAFE_INTEGER;else{const l=Jt(e,n,i);let u=s[l];t&1<<l&&(u=Number.MAX_SAFE_INTEGER),r[i]=u}for(let i=0;i<r.length;i++){const l=o[i];r[i]<0&&(r[i]+=l),r[i]=H(0,r[i],o[i])}return r}function ee(t,e,n){let s=t[e];return(n&1<<e||s==null)&&(s=1),s}function ne(t,e,n,s,o,r){let a=e[o];const i=n[o]||1;(t&1<<o||r&1<<o||a==null)&&(i>0?a=Number.MIN_SAFE_INTEGER:a=Number.MAX_SAFE_INTEGER);const l=s[o];return a<0&&(a+=l),a=H(0,a,l-1),a}function se(t,e,n,s,o,r){let a=e[o];const i=n[o]||1;(t&1<<o||r&1<<o||a==null)&&(i>0?a=Number.MAX_SAFE_INTEGER:a=Number.MIN_SAFE_INTEGER);const l=s[o];return a<0&&(a+=l),i>0?a=H(0,a,l):a=H(-1,a,l-1),a}function oe(t,e,n){let s=n.length;for(let o=0;o<n.length;o++)if(n[o]>1){s=o;break}for(let o=s+1;o<n.length;o++)if(e[o]>0||n[o]!==t[o])return!1;return!0}function re(t,e){let n=t.length>0?t[t.length-1]:1;for(let s=0;s<t.length-1;s++)n+=t[s]*e[s];return n}function ae(t,e,n){let s;const o=t.shape.length;typeof e=="number"?s=[e,...new Array(o-1).fill(0)]:e.length<o?s=e.concat(new Array(o-e.length).fill(0)):s=e.slice(),s.forEach(a=>{$(a!==-1,()=>"slice() does not support negative begin indexing.")});let r;return n==null?r=new Array(o).fill(-1):typeof n=="number"?r=[n,...new Array(o-1).fill(-1)]:n.length<o?r=n.concat(new Array(o-n.length).fill(-1)):r=n,r=r.map((a,i)=>a>=0?a:($(a===-1,()=>`Negative size values should be exactly -1 but got ${a} for the slice() size at index ${i}.`),t.shape[i]-s[i])),[s,r]}function Un(t,e,n,s,o,r,a,i,l){let u;if(s==null?(u=new Array(e.length),u.fill(1)):u=s,a!=null&&a&a-1)throw new Error("Multiple ellipses in slice is not allowed.");let h=!1;const c={dims:u.length,numAddAxisAfterEllipsis:0,begin:e.slice(),end:n.slice(),strides:u.slice(),beginMask:o,endMask:r,ellipsisMask:a,newAxisMask:i,shrinkAxisMask:l};for(let I=0;I<c.dims;I++)h&&1<<I&i&&c.numAddAxisAfterEllipsis++,1<<I&a&&(h=!0);h||(c.ellipsisMask|=1<<c.dims,c.dims++);const f={dims:t.length,beginMask:0,endMask:0,beginValid:!1,endValid:!1};Xn(c,f);let p=!0,g=!0,E=!0;const d=[],m=[];for(let I=0;I<t.length;++I){if(f.strides[I]===0)throw Error(`strides[${I}] must be non-zero`);const b=!!(f.shrinkAxisMask&1<<I),S=t[I];if(S===-1){d.push(b?1:-1);continue}const y=[f.beginMask&1<<I,f.endMask&1<<I],x=[f.strides[I]>0?0:-1,f.strides[I]>0?S:S-1];if(b&&f.strides[I]<=0)throw Error("only stride 1 allowed on non-range indexing.");E=E&&f.strides[I]===1;const A=!!(f.beginMask&1<<I&&f.endMask&1<<I);if(f.beginValid&&f.endValid){if(b){const L=f.begin[I]<0?S+f.begin[I]:f.begin[I];if(f.begin[I]=L,f.end[I]=f.begin[I]+1,L<0||L>=S)throw Error(`slice index ${f.begin[I]} of dimension ${I} out of bounds.`)}else f.begin[I]=ht(f.begin[I],0,f.strides[I],S,y,x),f.end[I]=ht(f.end[I],1,f.strides[I],S,y,x);const P=f.strides[I]===1&&f.begin[I]===0&&f.end[I]===S;p=p&&P,g=g&&(I===0&&f.strides[I]===1||P)}else p=p&&f.strides[I]===1&&A,g=g&&(I===0&&f.strides[I]===1||A);let M,V=!1;if(f.beginValid&&f.endValid?(M=f.end[I]-f.begin[I],V=!0):b?(M=1,V=!0):A&&S>=0&&(f.strides[I]<0?M=-S:M=S,V=!0),V){let P;M===0||M<0!=f.strides[I]<0?P=0:P=Math.trunc(M/f.strides[I])+(M%f.strides[I]!==0?1:0),d.push(P)}else d.push(-1)}for(let I=0;I<f.finalShapeGatherIndices.length;++I){const b=f.finalShapeGatherIndices[I];b>=0?m.push(d[b]):b===st&&m.push(1)}return{finalShapeSparse:m.filter((I,b)=>f.finalShapeGatherIndices[b]!==st),finalShape:m,isIdentity:p,sliceDim0:g,isSimpleSlice:E,begin:f.begin,end:f.end,strides:f.strides}}function Xn(t,e){e.beginMask=0,e.endMask=0,e.shrinkAxisMask=0;let n=0;e.beginValid=t.begin!=null,e.endValid=t.end!=null,e.begin=new Array(e.dims),e.end=new Array(e.dims),e.strides=new Array(e.dims),e.finalShapeGatherIndices=[],e.finalShapeGatherIndicesSparse=[],e.inputShapeGatherIndicesSparse=new Array(e.dims);for(let s=0;s<t.dims;s++)if(1<<s&t.ellipsisMask){const o=Math.min(e.dims-(t.dims-s)+1+t.numAddAxisAfterEllipsis,e.dims);for(;n<o;n++)e.begin[n]=0,e.end[n]=0,e.strides[n]=1,e.beginMask|=1<<n,e.endMask|=1<<n,e.finalShapeGatherIndices.push(n),e.finalShapeGatherIndicesSparse.push(-1),e.inputShapeGatherIndicesSparse[n]=s}else if(1<<s&t.newAxisMask)e.finalShapeGatherIndices.push(st),e.finalShapeGatherIndicesSparse.push(-1);else{if(n===e.begin.length)throw Error(`Index out of range using input dim ${n}; input has only ${e.dims} dims, ${e.begin.length}.`);t.begin!=null&&(e.begin[n]=t.begin[s]),t.end!=null&&(e.end[n]=t.end[s]),e.strides[n]=t.strides[s],t.beginMask&1<<s&&(e.beginMask|=1<<n),t.endMask&1<<s&&(e.endMask|=1<<n),t.shrinkAxisMask&1<<s?(e.finalShapeGatherIndices.push(qn),e.finalShapeGatherIndicesSparse.push(-1),e.shrinkAxisMask|=1<<n):(e.finalShapeGatherIndices.push(n),e.finalShapeGatherIndicesSparse.push(s)),e.inputShapeGatherIndicesSparse[n]=s,n++}}function ht(t,e,n,s,o,r){if(o[e])return n>0?r[e]:r[e+1&1];{const a=t<0?s+t:t;return a<r[0]?r[0]:a>r[1]?r[1]:a}}const Kn=Object.freeze(Object.defineProperty({__proto__:null,assertParamsValid:Zt,computeFlatOffset:re,computeOutShape:jn,getNormalizedAxes:Bn,isSliceContinous:oe,maskToAxes:zn,parseSliceParams:ae,sliceInfo:Un,startForAxis:ne,startIndicesWithElidedDims:Qt,stopForAxis:se,stopIndicesWithElidedDims:te,stridesForAxis:ee,stridesWithElidedDims:Ht},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Zn(t,e){const n=t[0].length;t.forEach((o,r)=>{$(o.length===n,()=>`Error in concat${n}D: rank of tensors[${r}] must be the same as the rank of the rest (${n})`)}),$(e>=0&&e<n,()=>`Error in concat${n}D: axis must be between 0 and ${n-1}.`);const s=t[0];t.forEach((o,r)=>{for(let a=0;a<n;a++)$(a===e||o[a]===s[a],()=>`Error in concat${n}D: Shape of tensors[${r}] (${o}) does not match the shape of the rest (${s}) along the non-concatenated axis ${r}.`)})}function Hn(t,e){const n=t[0].slice();for(let s=1;s<t.length;s++)n[e]+=t[s][e];return n}/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var F;(function(t){t[t.FIRST_DIM_SIZE=0]="FIRST_DIM_SIZE",t[t.VALUE_ROWIDS=1]="VALUE_ROWIDS",t[t.ROW_LENGTHS=2]="ROW_LENGTHS",t[t.ROW_SPLITS=3]="ROW_SPLITS",t[t.ROW_LIMITS=4]="ROW_LIMITS",t[t.ROW_STARTS=5]="ROW_STARTS"})(F||(F={}));function ie(t,e,n){let s=new Array;if(n==null&&e==null)return s;if(e==null)for(;s.length<t+n.length;)s.push(-1);else s=e.slice();if(n==null)return s;if(t+n.length!==s.length)throw new Error(`rt input.shape and shape=${e} are incompatible: rt input.rank = ${t+n.length}, but shape.rank = ${s.length}`);for(let o=1;o<n.length;++o){const r=n[o],a=s[s.length-n.length+o],i=s[a];if(r>=0)if(i>=0){if(i!==r)throw new Error(`rt input.shape and shape=${e} are incompatible: rt input.shape[${o+t}] = ${r} but shape[${o+t}] = ${i}`)}else s[a]=r}return s}function le(t){const e={FIRST_DIM_SIZE:F.FIRST_DIM_SIZE,VALUE_ROWIDS:F.VALUE_ROWIDS,ROW_LENGTHS:F.ROW_LENGTHS,ROW_SPLITS:F.ROW_SPLITS,ROW_LIMITS:F.ROW_LIMITS,ROW_STARTS:F.ROW_STARTS},n=[];for(const s of t)if(s in e)n.push(e[s]);else break;return n}function ce(t){return t.length===0?0:t[0]===F.FIRST_DIM_SIZE?t.length-1:t.length}function ue(t,e){if(t==null||e==null)return;const n=t.length,s=e.length;if(n>=s)throw new Error(`defaultValue.shape=${t} and ragged tensor flatValues.shape=${e}, are incompatible: defaultValue.rank = ${n} must be less than ragged tensor input flatValues.rank = ${s})`);for(let o=0;o<Math.min(n,s-1);++o){const r=t[o],a=e[o+1];if(r>=0&&a>=0&&r!==1&&r!==a)throw new Error(`defaultValue.shape=${t}, and ragged tensor input flatValues.shape=${e} are incompatible: defaultValue.shape[${o-t.length}] = ${r} but ragged tensor input.flatValues.shape[${o-t.length}] = ${a}`)}}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ct=30;function Jn(t){return t<=ct?t:et(t,Math.floor(Math.sqrt(t)))}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Yn(t,e,n){const s=n*(typeof t=="number"?t:t[0]),o=e*(typeof t=="number"?t:t[1]);return[s,o]}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Qn(t,e,n,s=!0){let o=[];if(s)o=o.concat(e.slice(0)),o.push(t[0]/n),o=o.concat(t.slice(1));else{o=o.concat(t[0]);const r=e.length;for(let a=0;a<r;++a)o=o.concat([t[a+1]/e[a],e[a]]);o=o.concat(t.slice(r+1))}return o}function ts(t,e,n=!0){const s=[];if(n){s.push(e);for(let o=e+1;o<t;++o)o<=2*e?(s.push(o),s.push(o-(e+1))):s.push(o)}else{const o=[],r=[];for(let a=1;a<t;++a)a>=e*2+1||a%2===1?r.push(a):o.push(a);s.push(...o),s.push(0),s.push(...r)}return s}function es(t,e,n,s=!0){const o=[];s?o.push(t[0]/n):o.push(t[0]*n);for(let r=1;r<t.length;++r)r<=e.length?s?o.push(e[r-1]*t[r]):o.push(t[r]/e[r-1]):o.push(t[r]);return o}function ns(t,e){const n=[0];for(let s=0;s<e;++s)n.push(t[s][0]);return n}function ss(t,e,n){const s=t.slice(0,1);for(let o=0;o<n;++o)s.push(t[o+1]-e[o][0]-e[o][1]);return s}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const os=1.7580993408473768,rs=1.0507009873554805;/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const as=.3275911,is=.254829592,ls=-.284496736,cs=1.421413741,us=-1.453152027,fs=1.061405429;/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ot(t,e){if(t.length!==e.length)throw new Error(`Cannot merge real and imag arrays of different lengths. real:${t.length}, imag: ${e.length}.`);const n=new Float32Array(t.length*2);for(let s=0;s<n.length;s+=2)n[s]=t[s/2],n[s+1]=e[s/2];return n}function hs(t){const e=new Float32Array(t.length/2),n=new Float32Array(t.length/2);for(let s=0;s<t.length;s+=2)e[s/2]=t[s],n[s/2]=t[s+1];return{real:e,imag:n}}function ds(t){const e=Math.ceil(t.length/4),n=new Float32Array(e),s=new Float32Array(e);for(let o=0;o<t.length;o+=4)n[Math.floor(o/4)]=t[o],s[Math.floor(o/4)]=t[o+1];return{real:n,imag:s}}function ps(t){const e=Math.floor(t.length/4),n=new Float32Array(e),s=new Float32Array(e);for(let o=2;o<t.length;o+=4)n[Math.floor(o/4)]=t[o],s[Math.floor(o/4)]=t[o+1];return{real:n,imag:s}}function gs(t,e){const n=t[e*2],s=t[e*2+1];return{real:n,imag:s}}function ms(t,e,n,s){t[s*2]=e,t[s*2+1]=n}function Is(t,e){const n=new Float32Array(t/2),s=new Float32Array(t/2);for(let o=0;o<Math.ceil(t/2);o++){const r=(e?2:-2)*Math.PI*(o/t);n[o]=Math.cos(r),s[o]=Math.sin(r)}return{real:n,imag:s}}function ws(t,e,n){const s=(n?2:-2)*Math.PI*(t/e),o=Math.cos(s),r=Math.sin(s);return{real:o,imag:r}}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const tt="->",Es=/->/g,dt=",",pt="...";function bs(t,e){t=t.replace(/\s/g,"");const n=(t.length-t.replace(Es,"").length)/tt.length;if(n<1)throw new Error("Equations without an arrow are not supported.");if(n>1)throw new Error(`Equation must contain exactly one arrow ("${tt}").`);const[s,o]=t.split(tt);$(s.indexOf(pt)===-1,()=>`The ellipsis notation ("${pt}") is not supported yet.`);const r=s.split(dt),a=r.length;if(e!==a)throw new Error(`Expected ${a} input tensors, received ${e}`);if(a>2)throw new Error("Support for more than 2 input tensors is not implemented yet.");const i=[];for(let f=0;f<o.length;++f){const p=o[f];if(!r.some(g=>g.indexOf(p)!==-1))throw new Error(`Output subscripts contain the label ${p} not present in the input subscripts.`);i.indexOf(p)===-1&&i.push(p)}for(let f=0;f<s.length;++f){const p=s[f];i.indexOf(p)===-1&&p!==dt&&i.push(p)}const l=new Array(r.length);for(let f=0;f<a;++f){if(new Set(r[f].split("")).size!==r[f].length)throw new Error(`Found duplicate axes in input component ${r[f]}. Support for duplicate axes in input is not implemented yet.`);l[f]=[];for(let p=0;p<r[f].length;++p)l[f].push(i.indexOf(r[f][p]))}const u=i.length,h=o.length,c=[];for(let f=h;f<u;++f)c.push(f);return{allDims:i,summedDims:c,idDims:l}}function Ss(t,e){let n=new Array(t);n.fill(-1);for(let o=0;o<e.length;++o)n[e[o]]=o;const s=[];for(let o=0;o<t;++o)n[o]===-1&&s.push(o);return n=n.filter(o=>o!==-1),{permutationIndices:n,expandDims:s}}function ys(t,e,n){const s=new Array(t);for(let o=0;o<n.length;++o){const r=n[o].shape;for(let a=0;a<e[o].length;++a)s[e[o][a]]===void 0?s[e[o][a]]=r[a]:$(s[e[o][a]]===r[a],()=>`Expected dimension ${s[e[o][a]]} at axis ${a} of input shaped ${JSON.stringify(r)}, but got dimension ${r[a]}`)}}function xs(t,e){const n=t,s=[];let o=0;t.length===0&&n.push(-1),o=t.length+1;for(let a=0;a<o;++a)s.push([]);const r=[];for(let a=0;a<n.length;++a){const i=n[a],l=As(e,i);for(const u of l)r.indexOf(u)===-1&&(s[a].push(u),r.push(u))}return{path:n,steps:s}}function ks(t){return t.every((e,n)=>e===n)}function As(t,e){const n=[];for(let s=0;s<t.length;++s)(t[s].length===0||t[s].indexOf(e)!==-1||e===-1)&&n.push(s);return n}function Rs(t,e,n=0){let s=[];if(typeof e=="number")$(t.shape[n]%e===0,()=>"Number of splits must evenly divide the axis."),s=new Array(e).fill(t.shape[n]/e);else{const o=e.reduce((a,i)=>(i===-1&&(a+=1),a),0);$(o<=1,()=>"There should be only one negative value in split array.");const r=e.indexOf(-1);if(r!==-1){const a=e.reduce((i,l)=>l>0?i+l:i);e[r]=t.shape[n]-a}$(t.shape[n]===e.reduce((a,i)=>a+i),()=>"The sum of sizes must match the size of the axis dimension."),s=e}return s}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function fe(t){return`Received SparseTensor with denseShape[0] = 0 but
  indices.shape[0] = ${t}`}function he(t,e){return`indices(${t}, 0) is invalid: ${e} < 0`}function de(t,e,n){return`indices(${t}, 0) is invalid: ${e} >= ${n}`}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function pe(t,e){return`only one output dimension may be -1, not both ${t} and ${e}`}function ge(t,e){return`size ${t} must be non-negative, not ${e}`}function me(){return"reshape cannot infer the missing input size for an empty tensor unless all specified input sizes are non-zero"}function Ie(t,e){const n=k(t),s=k(e);return`Input to reshape is a SparseTensor with ${n}
  dense values, but the requested shape requires a multiple of ${s}. inputShape=${t} outputShape= ${e}`}function we(t,e){const n=k(t),s=k(e);return`Input to reshape is a tensor with ${n} dense values, but the requested shape has ${s}. inputShape=${t} outputShape=${e}`}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function rt(){return"segment ids must be >= 0"}function Ee(){return"segment ids are not increasing"}function be(t,e){return`Segment id ${t} out of range [0, ${e}), possibly because segmentIds input is not sorted.`}function Se(t,e,n){return`Bad: indices[${t}] == ${e} out of range [0, ${n})`}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function $s(t,e){let n=!1,s;for(t<=ct?(s=t,n=!0):s=et(t,Math.floor(Math.sqrt(t)));!n;)s>e||s===t?n=!0:s=et(t,s+1);return s}function Ts(t,e,n){const s=[],o=t.length;for(let r=0;r<o;r++)r!==e?s.push(t[r]):s.push(n);return s}function Ms(t,e,n,s){const o=e.shape.length,r=t.shape.length;if(s!==0&&(s<-o||s>o))throw new Error(`Expect batchDims in the range of [-${o}, ${o}], but got ${s}`);if(s<0&&(s+=o),s>r)throw new Error(`batchDims (${s}) must be less than rank(x) (
    ${r}).`);if(n<s)throw new Error(`batchDims (${s}) must be less than or equal to axis (${n}).`);for(let c=0;c<s;++c)if(t.shape[c]!==e.shape[c])throw new Error(`x.shape[${c}]: ${t.shape[c]} should be equal to indices.shape[${c}]: ${e.shape[c]}.`);const a=t.shape[n],i=[];let l=1,u=1,h=1;for(let c=0;c<s;++c)i.push(t.shape[c]),l*=t.shape[c];for(let c=s;c<n;c++)i.push(t.shape[c]),u*=t.shape[c];for(let c=s;c<o;c++)i.push(e.shape[c]);for(let c=n+1;c<r;c++)i.push(t.shape[c]),h*=t.shape[c];return{batchSize:l,sliceSize:h,outerSize:u,dimSize:a,outputShape:i}}const Ns=Object.freeze(Object.defineProperty({__proto__:null,collectGatherOpShapeInfo:Ms,computeOutShape:Ts,segOpComputeOptimalWindowSize:$s},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function z(t){try{return t.map(e=>Qe(e))}catch(e){throw new Error(`Failed to decode encoded string bytes into utf-8, error: ${e}`)}}function ye(t){return t.map(e=>Z(e))}const qo=Object.freeze(Object.defineProperty({__proto__:null,ERF_A1:is,ERF_A2:ls,ERF_A3:cs,ERF_A4:us,ERF_A5:fs,ERF_P:as,PARALLELIZE_THRESHOLD:ct,get RowPartitionType(){return F},SELU_SCALE:rs,SELU_SCALEALPHA:os,applyActivation:tn,assertAndGetBroadcastShape:lt,assertAxesAreInnerMostDims:en,assertParamsConsistent:Zn,assignToTypedArray:ms,axesAreInnerMostDims:nn,calculateShapes:sn,checkEinsumDimSizes:ys,checkPadOnDimRoundingMode:on,combineLocations:rn,combineRaggedTensorToTensorShapes:ie,complexWithEvenIndex:ds,complexWithOddIndex:ps,computeConv2DInfo:an,computeConv3DInfo:ln,computeDefaultPad:cn,computeDilation2DInfo:un,computeOptimalWindowSize:Jn,computeOutAndReduceShapes:Et,computeOutShape:Hn,computePool2DInfo:fn,computePool3DInfo:hn,convertConv2DDataFormat:dn,decodeEinsumEquation:bs,eitherStridesOrDilationsAreOne:pn,expandShapeToKeepDim:bt,exponent:ws,exponents:Is,fromStringArrayToUint8:ye,fromUint8ToStringArray:z,getAxesPermutation:St,getBroadcastDims:U,getComplexWithIndex:gs,getEinsumComputePath:xs,getEinsumPermutation:Ss,getFusedBiasGradient:gn,getFusedDyActivation:mn,getImageCenter:Yn,getInnerMostAxes:yt,getPermuted:ts,getRaggedRank:ce,getReductionAxes:In,getReshaped:Qn,getReshapedPermuted:es,getRowPartitionTypesHelper:le,getSliceBeginCoords:ns,getSliceSize:ss,getSparseFillEmptyRowsIndicesDenseShapeMismatch:fe,getSparseFillEmptyRowsNegativeIndexErrorMessage:he,getSparseFillEmptyRowsOutOfRangeIndexErrorMessage:de,getSparseReshapeEmptyTensorZeroOutputDimErrorMessage:me,getSparseReshapeInputOutputMismatchErrorMessage:we,getSparseReshapeInputOutputMultipleErrorMessage:Ie,getSparseReshapeMultipleNegativeOneOutputDimErrorMessage:pe,getSparseReshapeNegativeOutputDimErrorMessage:ge,getSparseSegmentReductionIndicesOutOfRangeErrorMessage:Se,getSparseSegmentReductionNegativeSegmentIdsErrorMessage:rt,getSparseSegmentReductionNonIncreasingSegmentIdsErrorMessage:Ee,getSparseSegmentReductionSegmentIdOutOfRangeErrorMessage:be,getUndoAxesPermutation:wn,isIdentityPermutation:ks,log:En,mergeRealAndImagArrays:ot,prepareAndValidate:Kt,prepareSplitSize:Rs,segment_util:Ns,shouldFuse:bn,slice_util:Kn,splitRealAndImagArrays:hs,stridesOrDilationsArePositive:Sn,tupleValuesAreOne:yn,upcastType:xt,validateDefaultValueShape:ue,validateInput:xn,validateUpdateShape:kn,warn:An},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function G(t,e){Array.isArray(t)||(t=[t]),t.forEach(n=>{n!=null&&$(n.dtype!=="complex64",()=>`${e} does not support complex64 tensors in the CPU backend.`)})}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function xe(t){const e=new Float32Array(t.length);for(let n=0;n<t.length;++n)e[n]=Math.abs(t[n]);return e}const vs=t=>{const{x:e}=t.inputs,n=t.backend;G(e,"abs");let s=new Float32Array(k(e.shape));const o=n.data.get(e.dataId).values;return s=xe(o),n.makeOutput(s,e.shape,e.dtype)},zo={kernelName:Rn,backendName:"cpu",kernelFunc:vs};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function T(t){return(e,n,s,o,r)=>{const a=lt(e,n),i=a.length,l=O(a),u=k(a),h=W(r,u),c=e.length,f=n.length,p=O(e),g=O(n),E=U(e,a),d=U(n,a);if(E.length+d.length===0)for(let m=0;m<h.length;++m)h[m]=t(s[m%s.length],o[m%o.length]);else for(let m=0;m<h.length;++m){const w=Y(m,i,l),I=w.slice(-c);E.forEach(x=>I[x]=0);const b=X(I,c,p),S=w.slice(-f);d.forEach(x=>S[x]=0);const y=X(S,f,g);h[m]=t(s[b],o[y])}return[h,a]}}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Q(t){const{inputs:e,backend:n}=t,{real:s,imag:o}=e,r=n.data.get(s.dataId).values,a=n.data.get(o.dataId).values,i=n.makeTensorInfo(s.shape,"complex64"),l=n.data.get(i.dataId);return l.complexTensorInfos={real:n.makeTensorInfo(s.shape,"float32",r),imag:n.makeTensorInfo(o.shape,"float32",a)},i}const jo={kernelName:$n,backendName:"cpu",kernelFunc:Q};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function at(t,e,n="float32"){if(n==="complex64"){const o=at(t,e,"float32"),r=at(t,e,"float32");return Q({inputs:{real:o,imag:r},backend:t})}const s=q(k(e),n);return t.makeTensorInfo(e,n,s)}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function it(t){const{inputs:e,backend:n}=t,{x:s}=e;return n.incRef(s.dataId),{dataId:s.dataId,shape:s.shape,dtype:s.dtype}}const Bo={kernelName:Tn,backendName:"cpu",kernelFunc:it};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ke(t){const{inputs:e,backend:n}=t,{input:s}=e,o=n.data.get(s.dataId).complexTensorInfos.real,r=n.data.get(o.dataId).values;return n.makeTensorInfo(o.shape,o.dtype,r)}const Uo={kernelName:Mn,backendName:"cpu",kernelFunc:ke};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ae(t,e,n,s){if(s==="int32"){const o=Int32Array.from(t);return[e,"int32",o]}if(s==="bool"){const o=Nn([0],n),[r,a]=T((i,l)=>i!==l?1:0)(e,[],t,o,"bool");return[a,"bool",r]}throw new Error(`Error in Cast: failed to cast ${n} to ${s}`)}function K(t){const{inputs:e,backend:n,attrs:s}=t,{x:o}=e,{dtype:r}=s;if(r==="complex64"){if(o.dtype==="complex64")return it({inputs:{x:o},backend:n});const h=at(n,o.shape,o.dtype),c=K({inputs:{x:o},backend:n,attrs:{dtype:"float32"}}),f=Q({inputs:{real:c,imag:h},backend:n});return n.disposeIntermediateTensorInfo(h),n.disposeIntermediateTensorInfo(c),f}if(o.dtype==="complex64"){const h=ke({inputs:{input:o},backend:n}),c=K({inputs:{x:h},backend:n,attrs:{dtype:r}});return n.disposeIntermediateTensorInfo(h),c}if(!Fn(o.dtype,r)){const h=it({inputs:{x:o},backend:n});return{dataId:h.dataId,shape:h.shape,dtype:r}}const a=n.data.get(o.dataId).values,[i,l,u]=Ae(a,o.shape,o.dtype,r);return n.makeTensorInfo(i,l,u)}const Xo={kernelName:vn,backendName:"cpu",kernelFunc:K};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function N(t,e,n,s){return n==null?({inputs:o,backend:r})=>{const{a,b:i}=o,l=r;G([a,i],t);const u=l.data.get(a.dataId).values,h=l.data.get(i.dataId).values,c=a.dtype==="string"?z(u):u,f=a.dtype==="string"?z(h):h,p=s||a.dtype,[g,E]=e(a.shape,i.shape,c,f,p);return l.makeTensorInfo(E,p,g)}:({inputs:o,backend:r})=>{const{a,b:i}=o,l=r;if(a.dtype==="complex64"||i.dtype==="complex64"){const u=K({inputs:{x:a},backend:l,attrs:{dtype:"complex64"}}),h=l.data.get(u.dataId),c=h.complexTensorInfos.real,f=h.complexTensorInfos.imag,p=l.data.get(c.dataId).values,g=l.data.get(f.dataId).values,E=K({inputs:{x:i},backend:l,attrs:{dtype:"complex64"}}),d=l.data.get(E.dataId),m=d.complexTensorInfos.real,w=d.complexTensorInfos.imag,I=l.data.get(m.dataId).values,b=l.data.get(w.dataId).values,[S,y,x]=n(a.shape,i.shape,p,g,I,b),A=l.makeTensorInfo(x,"float32",S),M=l.makeTensorInfo(x,"float32",y),V=Q({inputs:{real:A,imag:M},backend:l});return l.disposeIntermediateTensorInfo(u),l.disposeIntermediateTensorInfo(E),l.disposeIntermediateTensorInfo(A),l.disposeIntermediateTensorInfo(M),V}else{const u=l.data.get(a.dataId).values,h=l.data.get(i.dataId).values,c=s||a.dtype,[f,p]=e(a.shape,i.shape,u,h,c);return l.makeTensorInfo(p,c,f)}}}function ut(t){return(e,n,s,o,r,a)=>{const i=lt(e,n),l=k(i),u=i.length,h=O(i),c=W("float32",l),f=W("float32",l),p=U(e,i),g=U(n,i),E=ot(s,o),d=ot(r,a),m=e.length,w=O(e),I=n.length,b=O(n);if(p.length+g.length===0)for(let S=0;S<c.length;S++){const y=S%E.length,x=S%d.length,A=t(E[y*2],E[y*2+1],d[x*2],d[x*2+1]);c[S]=A.real,f[S]=A.imag}else for(let S=0;S<c.length;S++){const y=Y(S,u,h),x=y.slice(-m);p.forEach(L=>x[L]=0);const A=X(x,m,w),M=y.slice(-I);g.forEach(L=>M[L]=0);const V=X(M,I,b),P=t(E[A*2],E[A*2+1],d[V*2],d[V*2+1]);c[S]=P.real,f[S]=P.imag}return[c,f,i]}}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Re=T((t,e)=>t+e),Fs=ut((t,e,n,s)=>({real:t+n,imag:e+s})),Os=N(kt,Re,Fs),Ko={kernelName:kt,backendName:"cpu",kernelFunc:Os};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ds(t,e,n,s,o){const r=k(s),a=q(o,n);for(let i=0;i<t.length;i++){const l=t[i];if(l<0)throw new Error("Input x must be non-negative!");l>=o||(r>0?a[l]+=e[i]:a[l]+=1)}return a}function _s(t,e,n,s=!1){const o=t.shape[0],r=t.shape[1],a=D([o,n],e.dtype);for(let i=0;i<o;i++)for(let l=0;l<r;l++){const u=t.get(i,l);if(u<0)throw new Error("Input x must be non-negative!");u>=n||(s?a.set(1,i,u):e.size>0?a.set(a.get(i,u)+e.get(i,l),i,u):a.set(a.get(i,u)+1,i,u))}return a}/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const $e=T((t,e)=>t&e),Vs=N(At,$e),Zo={kernelName:At,backendName:"cpu",kernelFunc:Vs};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function _(t){return(e,n,s)=>{const o=R(n,e.length);for(let r=0;r<e.length;++r)o[r]=t(e[r],s);return o}}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Te(t,e,n){const s=_(e);return C(t,s,n)}function C(t,e,n){return({inputs:s,attrs:o,backend:r})=>{const{x:a}=s;G(a,t);const i=r,l=i.data.get(a.dataId).values;let u;if(a.dtype==="string"){if(!Array.isArray(l))throw new Error("String tensor's value was not an instance of Array");u=z(l)}else u=l;const h=n||a.dtype,c=e(u,h,o);return i.makeTensorInfo(a.shape,h,c)}}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Me=_(t=>Math.ceil(t)),Ps=C(Rt,Me),Ho={kernelName:Rt,backendName:"cpu",kernelFunc:Ps};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Cs(t,e,n,s){const o=R(n,k(e));if(s&&n!=="string"){let r=0;t.forEach(a=>{const i=k(a.shape);o.set(a.vals,r),r+=i})}else{let r=0;t.forEach(a=>{const i=n==="string"?z(a.vals):a.vals;let l=0;for(let u=0;u<a.shape[0];++u){const h=u*e[1]+r;for(let c=0;c<a.shape[1];++c)o[h+c]=i[l++]}r+=a.shape[1]})}return o}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ne=T((t,e)=>t===e?1:0),Ls=N($t,Ne,null,"bool"),Jo={kernelName:$t,backendName:"cpu",kernelFunc:Ls};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ve=_(t=>Math.exp(t)),Ws=C(Tt,ve,"float32"),Yo={kernelName:Tt,backendName:"cpu",kernelFunc:Ws};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Fe=_(t=>Math.expm1(t)),Gs=C(Mt,Fe),Qo={kernelName:Mt,backendName:"cpu",kernelFunc:Gs};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Oe=_(t=>Math.floor(t)),qs=C(Nt,Oe),tr={kernelName:Nt,backendName:"cpu",kernelFunc:qs};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const De=T((t,e)=>Math.floor(t/e)),zs=N(vt,De,null,"int32"),er={kernelName:vt,backendName:"cpu",kernelFunc:zs};/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function js(t,e,n,s,o,r,a,i,l){const u=D([s,r],n);for(let h=0;h<s;h++){const c=[];let f=0;for(let p=0;p<o;p++){const g=t[h*o+p];f+=g*a[p],c.push(g)}if(f<0||f>=l/r)throw new Error(`Invalid indices: ${c} does not index into ${i}`);for(let p=0;p<r;p++)u.values[h*r+p]=e.get(...e.indexToLoc(f*r+p))}return u}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Bs(t,e,n){const s=D(n,t.dtype);for(let o=0;o<s.size;++o){const a=s.indexToLoc(o).slice(),i=a[0],l=a[2],u=e.locToIndex([i,l]);a[2]=e.values[u];const h=t.locToIndex(a);0<=h&&h<t.values.length&&(s.values[o]=t.values[h])}return s}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const _e=T((t,e)=>t>e?1:0),Us=N(Ft,_e,null,"bool"),nr={kernelName:Ft,backendName:"cpu",kernelFunc:Us};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ve=T((t,e)=>t>=e?1:0),Xs=N(Ot,Ve,null,"bool"),sr={kernelName:Ot,backendName:"cpu",kernelFunc:Xs};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Pe=T((t,e)=>t<e?1:0),Ks=N(Dt,Pe,null,"bool"),or={kernelName:Dt,backendName:"cpu",kernelFunc:Ks};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ce=T((t,e)=>t<=e?1:0),Zs=N(_t,Ce,null,"bool"),rr={kernelName:_t,backendName:"cpu",kernelFunc:Zs};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Hs(t,e,n){const s=(e-t)/(n-1),o=q(n,"float32");o[0]=t;for(let r=1;r<o.length;r++)o[r]=o[r-1]+s;return o}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Le=_(t=>Math.log(t)),Js=C(Vt,Le),ar={kernelName:Vt,backendName:"cpu",kernelFunc:Js};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ys(t,e,n,s){const o=W(s,k(n));for(let r=0;r<o.length;++r){const a=r*e;let i=t[a];for(let l=0;l<e;++l){const u=t[a+l];(Number.isNaN(u)||u>i)&&(i=u)}o[r]=i}return o}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const We=T((t,e)=>Math.max(t,e)),Qs=N(Pt,We),ir={kernelName:Pt,backendName:"cpu",kernelFunc:Qs};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ge=T((t,e)=>Math.min(t,e)),to=N(Ct,Ge),lr={kernelName:Ct,backendName:"cpu",kernelFunc:to};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ft=T((t,e)=>t*e),eo=ut((t,e,n,s)=>({real:t*n-e*s,imag:t*s+e*n})),no=N(Lt,ft,eo),cr={kernelName:Lt,backendName:"cpu",kernelFunc:no};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function qe(t,e,n){const s=On(-1,n);return ft([],e,s,t,n)}function so(t){const{inputs:e,backend:n}=t,{x:s}=e;G(s,"neg");const o=n.data.get(s.dataId).values,[r,a]=qe(o,s.shape,s.dtype);return n.makeTensorInfo(a,s.dtype,r)}const ur={kernelName:Dn,backendName:"cpu",kernelFunc:so};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ze=T((t,e)=>t!==e?1:0),oo=N(Wt,ze,null,"bool"),fr={kernelName:Wt,backendName:"cpu",kernelFunc:oo};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function je(t,e,n,s,o){const r=e.length,a=k(e),i=O(e),l=O(o),u=W(n,k(o));for(let h=0;h<a;++h){const c=Y(h,r,i),f=new Array(c.length);for(let g=0;g<f.length;g++)f[g]=c[s[g]];const p=X(f,r,l);u[p]=t[h]}return u}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Be(t){const{inputs:e,attrs:n,backend:s}=t,{x:o}=e,{perm:r}=n;G(o,"transpose");const a=o.shape.length,i=new Array(a);for(let c=0;c<i.length;c++)i[c]=o.shape[r[c]];const l=s.data.get(o.dataId).values,u=je(l,o.shape,o.dtype,r,i);return{dataId:s.write(u,i,o.dtype),shape:i,dtype:o.dtype}}const hr={kernelName:_n,backendName:"cpu",kernelFunc:Be};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ue(t,e,n,s){const[o,r]=Et(t,s),a=xt(e,"int32"),i=q(k(o),a),l=k(r);for(let u=0;u<i.length;++u){const h=u*l;let c=1;for(let f=0;f<l;++f)c*=n[h+f];i[u]=c}return{outVals:i,outShape:o,outDtype:a}}function ro(t){const{inputs:e,backend:n,attrs:s}=t,{x:o}=e,{axis:r,keepDims:a}=s;G(o,"prod");const i=o.shape.length,l=Gt(r,o.shape),u=St(l,i);let h=l,c=o;const f=[];u!=null&&(c=Be({inputs:{x:o},backend:n,attrs:{perm:u}}),f.push(c),h=yt(h.length,i));const p=n.data.get(c.dataId).values,{outVals:g,outShape:E,outDtype:d}=Ue(c.shape,c.dtype,p,h);let m=E;return a&&(m=bt(E,l)),f.forEach(w=>n.disposeIntermediateTensorInfo(w)),n.makeTensorInfo(m,d,g)}const dr={kernelName:Vn,backendName:"cpu",kernelFunc:ro};/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ao(t,e,n){t.forEach((s,o)=>{if(s<0||s>=n){const r=Y(o,e.length,O(e)).join(",");throw new Error(`indices[${r}] = ${s} is not in [0, ${n})`)}})}function io(t,e){for(let n=0;n<t.length;++n){const s=t[n],o=n===t.length-1?e:t[n+1].length;if(s.length===0)throw new Error("Ragged splits may not be empty");if(s[0]<0)throw new Error("Ragged splits must be non-negative");if(s[s.length-1]>o)throw new Error("Ragged splits must not point past values");for(let r=1;r<s.length;++r)if(s[r-1]>s[r])throw new Error("Ragged splits must be sorted in ascending order")}}function lo(t,e,n,s){const o=[];let r=0;const a=e.length-1+n.length,i=new Array(a).fill(null).map(()=>[0]);io(n,s);let l=1;for(let u=0;u<e.length-1;++u){l*=e[u];const h=e[u+1];for(let c=1;c<l+1;++c)i[u].push(c*h)}for(let u=0;u<t.length;++u){let h=t[u],c=t[u]+1;for(let f=0;f<n.length;++f){const p=n[f],g=f+e.length-1;if(g>=0){const E=i[g],d=E[E.length-1]-p[h];for(let m=h;m<c;++m)i[g].push(p[m+1]+d)}h=p[h],c=p[c]}c!==h&&(o.push([h,c]),r+=c-h)}return{outSplits:i,valueSlices:o,numValues:r}}function co(t){const e=[];for(let n=0;n<t.length;++n){const s=t[n].length,o=R("int32",s);e.push(o),t[n].forEach((r,a)=>o[a]=r)}return e}function gt(t,e){const n=t.slice(0,e);for(;n.length<e;)n.push(1);for(let s=e;s<t.length;s++)n[e-1]*=t[s];return n}function uo(t,e,n,s,o,r){const a=gt(e,2)[1],i=gt(r,2)[1];let l=0;for(const u of n)for(let h=u[0];h<u[1];++h){for(let c=0;c<s;++c)o[l*i+c]=t[h*a+c];++l}}function fo(t,e,n,s,o){const r=e.slice();r[0]=o;const a=R(n,k(r)),i=t.length,l=i===0?0:i/e[0];return uo(t,e,s,l,a,r),[a,r]}function ho(t,e,n,s,o,r,a,i){if(t.length===0)throw new Error("paramsNestedSplits must be non empty");if(e[0].length===0)throw new Error("Split tensors must not be scalars");const l=e[0][0]-1;if(ao(r,a,l),s.length===0)throw new Error("params.rank must be nonzero");const u=s[0],{outSplits:h,valueSlices:c,numValues:f}=lo(r,a,t,u),p=co(h),g=fo(n,s,o,c,f);return[p,g[0],g[1]]}/**
 * @license
 * Copyright 2022 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const mt=2147483647;function po(t,e,n,s,o,r,a){if(e.length>1)throw new Error("starts must be a scalar or vector");if(o.length>1)throw new Error("limits must be a scalar or vector");if(a.length>1)throw new Error("deltas must be a scalar or vector");const i=e.length===0,l=o.length===0,u=a.length===0,h=[];i||h.push(e[0]),l||h.push(o[0]),u||h.push(a[0]);for(let d=1;d<h.length;++d)if(h[d]!==h[d-1])throw new Error("starts, limits, and deltas must have the same shape");const c=h.length===0?1:h[0],f=R("int32",c+1);f[0]=0;for(let d=0;d<c;++d){const m=i?t[0]:t[d],w=l?s[0]:s[d],I=u?r[0]:r[d];if(I===0)throw new Error("Requires delta != 0");let b;if(I>0&&w<m||I<0&&w>m)b=0;else if(b=Math.ceil(Math.abs((w-m)/I)),b>mt)throw new Error(`Requires ((limit - start) / delta) <= ${mt}`);f[d+1]=f[d]+b}const p=f[c],g=R(n,p);let E=0;for(let d=0;d<c;++d){const m=f[d+1]-f[d];let w=i?t[0]:t[d];const I=u?r[0]:r[d];for(let b=0;b<m;++b)g[E++]=w,w+=I}return[f,g]}/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var v=F;class J{constructor(e,n,s,o,r,a,i,l,u,h){this.shape=e,this.shapeShape=n,this.values=s,this.valuesShape=o,this.valuesDType=r,this.defaultValue=a,this.defaultValueShape=i,this.rowPartitionValues=l,this.rowPartitionValuesShapes=u,this.rowPartitionTypes=le(h),this.raggedRank=ce(this.rowPartitionTypes)}getRowPartitionTypeByDimension(e){return this.rowPartitionTypes[0]===v.FIRST_DIM_SIZE?this.rowPartitionTypes[e+1]:this.rowPartitionTypes[e]}getRowPartitionTensor(e){return this.rowPartitionTypes[0]===v.FIRST_DIM_SIZE?this.rowPartitionValues[e+1]:this.rowPartitionValues[e]}getMaxWidth(e){const n=this.getRowPartitionTensor(e-1);switch(this.getRowPartitionTypeByDimension(e-1)){case v.VALUE_ROWIDS:return J.getMaxWidthValueRowID(n);case v.ROW_SPLITS:return J.getMaxWidthRowSplit(n);default:throw new Error(`Cannot handle partition type ${v[this.getRowPartitionTypeByDimension(e-1)]}`)}}static getMaxWidthRowSplit(e){const n=e.length;if(n===0||n===1)return 0;let s=0;for(let o=0;o<n-1;++o){const r=e[o+1]-e[o];r>s&&(s=r)}return s}static getMaxWidthValueRowID(e){const n=e.length;if(n===0)return 0;let s=0,o=e[0],r=0;for(let a=1;a<n;++a){const i=e[a];i!==o&&(o=i,r=Math.max(a-s,r),s=a)}return Math.max(n-s,r)}tensorShapeFromTensor(e,n,s=!0){if(n.length===0){if(e[0]===-1)return[];throw new Error("The only valid scalar shape tensor is the fully unknown shape specified as -1.")}return wt(e,s)}calculateOutputSize(e){const n=this.valuesShape,s=this.defaultValueShape;ue(s,n);const o=this.tensorShapeFromTensor(this.shape,this.shapeShape),a=ie(this.raggedRank,o,n);a[0]<0&&(a[0]=e);for(let i=1;i<=this.raggedRank;++i)a[i]<0&&(a[i]=this.getMaxWidth(i));return a}calculateFirstParentOutputIndex(e,n,s){const o=Math.min(e,s),r=[];let a=0;for(let i=0;i<o;++i,a+=n)r.push(a);for(let i=o;i<e;++i)r.push(-1);return $(r.length===e,()=>"Final length of result must be equal to firstDimension."),r}calculateOutputIndexRowSplit(e,n,s,o){const r=e.length,a=[];for(let i=0;i<r-1;++i){const l=e[i+1]-e[i];let u=Math.min(o,l),h=n[i];h===-1&&(u=0);for(let c=0;c<u;++c)a.push(h),h+=s;for(let c=0;c<l-u;++c)a.push(-1)}if(r>0&&a.length!==e[r-1])throw new Error("Invalid row split size.");return a}calculateOutputIndexValueRowID(e,n,s,o){const r=e.length,a=[];if(r===0)return[];let i=0,l=e[0];if(l>=n.length)throw new Error(`Got currentValueRowId=${l}, which is not less than ${n.length}`);let u=n[l];a.push(u);for(let h=1;h<r;++h){const c=e[h];if(c===l)u>=0&&(++i,i<o?u+=s:u=-1);else{if(i=0,l=c,c>=n.length)throw new Error(`Got nextValueRowId=${c} which is not less than ${n.length}`);u=n[c]}a.push(u)}if(a.length!==e.length)throw new Error("Invalid row ids.");return a}calculateOutputIndex(e,n,s,o){const r=this.getRowPartitionTensor(e),a=this.getRowPartitionTypeByDimension(e);switch(a){case v.VALUE_ROWIDS:return this.calculateOutputIndexValueRowID(r,n,s,o);case v.ROW_SPLITS:if(r.length-1>n.length)throw new Error(`Row partition size is greater than output size: ${r.length-1} > ${n.length}`);return this.calculateOutputIndexRowSplit(r,n,s,o);default:throw new Error(`Unsupported partition type: ${v[a]}`)}}getFirstDimensionSize(){const e=this.rowPartitionValues[0];if(this.rowPartitionTypes.length===0)throw new Error("No row_partition_types given.");const n=this.rowPartitionTypes[0];switch(n){case v.FIRST_DIM_SIZE:return e[0];case v.VALUE_ROWIDS:throw new Error("Cannot handle VALUE_ROWIDS in first dimension.");case v.ROW_SPLITS:return this.rowPartitionValuesShapes[0][0]-1;default:throw new Error(`Cannot handle type ${v[n]}`)}}compute(){if(this.rowPartitionValues[0].length<=0)throw new Error("Invalid first partition input. Tensor requires at least one element.");const n=this.getFirstDimensionSize(),s=this.calculateOutputSize(n),o=new Array(this.raggedRank+1);o[o.length-1]=1;for(let l=o.length-2;l>=0;--l)o[l]=o[l+1]*s[l+1];const r=wt(s,!1),a=R(this.valuesDType,k(r));if(o[0]*s[0]>0){let l=this.calculateFirstParentOutputIndex(n,o[0],s[0]);for(let u=1;u<=this.raggedRank;++u)l=this.calculateOutputIndex(u-1,l,o[u],s[u]);this.setOutput(this.raggedRank,l,a,r)}return[r,a]}setOutput(e,n,s,o){if(s.length===0)return;const r=this.values,a=s;let i=o.slice();i=i.slice(e+1);const l=k(i),u=n.length;let h=this.defaultValue;if(h.length!==l&&h.length!==1){const g=this.defaultValueShape;Pn(()=>{const E=Cn(h,g);h=Ln(E,i).dataSync()})}let c=0,f=0,p=0;for(let g=0;g<=u;++g){let E=g<u?n[g]:-1;if(E===p){++p;continue}if(f<p){const d=r.subarray(c*l),m=a.subarray(f*l),w=(p-f)*l;It(m,d,w)}if(g>=u){const d=s.length;E=Math.floor(d/l)}if(E>p)if(this.defaultValue.length===1)a.subarray(p*l,E*l).fill(this.defaultValue[0]),p=E;else for(;E>p;){const d=a.slice(p*l);It(d,h,l),++p}E<0?(c=g+1,f=p):(c=g,f=p,p=f+1)}}}function It(t,e,n){for(let s=0;s<n;s++)t[s]=e[s]}function wt(t,e){const n=[];for(let s of t){if(s<0){if(!e)throw new Error(`Dimension ${s} must be >= 0`);if(s<-1)throw new Error(`Dimension ${s} must be >= -1`);s=-1}n.push(s)}return n}function go(t,e,n,s,o,r,a,i,l,u){return new J(t,e,n,s,o,r,a,i,l,u).compute()}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function mo(t,e,n,s){const o=t===e,r=t<e&&n<0,a=e<t&&n>1;if(o||r||a)return q(0,s);const i=Math.abs(Math.ceil((e-t)/n)),l=q(i,s);e<t&&n===1&&(n=-1),l[0]=t;for(let u=1;u<l.length;u++)l[u]=l[u-1]+n;return l}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Xe=_(t=>1/Math.sqrt(t)),Io=C(qt,Xe),pr={kernelName:qt,backendName:"cpu",kernelFunc:Io};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function wo(t,e,n,s,o,r,a,i,l,u){const h=[s/o,o],c=t.values,f=e.values;if(s===0)return D(n,e.dtype);const p=l instanceof nt?l:D(h,e.dtype);typeof l=="string"||typeof l=="number"?p.values.fill(l):typeof l=="boolean"&&p.values.fill(+l);for(let g=0;g<r;g++){const E=[];let d=0;for(let m=0;m<a;m++){const w=c[g*a+m];E.push(w),d+=w*i[m]}if(d<0||d>=s/o)throw new Error(`Invalid indices: ${E} does not index into ${n}`);for(let m=0;m<o;m++)u?p.values[d*o+m]+=f[g*o+m]:p.values[d*o+m]=e.rank===0?f[0]:f[g*o+m]}return p}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Eo=_(t=>1/(1+Math.exp(-t))),bo=Te(zt,t=>1/(1+Math.exp(-t))),gr={kernelName:zt,backendName:"cpu",kernelFunc:bo};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ke(t,e,n,s,o){const r=oe(s,e,n),a=k(n),i=O(s);if(r){const c=re(e,i);return o==="string"?t.slice(c,c+a):t.subarray(c,c+a)}const l=o==="string"?z(t):t,u=D(s,o,l),h=D(n,o);for(let c=0;c<h.size;++c){const f=h.indexToLoc(c),p=f.map((g,E)=>g+e[E]);h.set(u.get(...p),...f)}return o==="string"?ye(h.values):h.values}function So(t){const{inputs:e,backend:n,attrs:s}=t,{x:o}=e,{begin:r,size:a}=s;G(o,"slice");const[i,l]=ae(o,r,a);Zt(o,i,l);const u=n.data.get(o.dataId).values,h=Ke(u,i,l,o.shape,o.dtype);return n.makeTensorInfo(l,o.dtype,h)}const mr={kernelName:Wn,backendName:"cpu",kernelFunc:So};/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function yo(t,e,n,s,o,r,a){const i=e[0],l=r[0],u=new Array(l),h=new Array(i),c=e[1];if(l===0){if(i!==0)throw new Error(fe(i));const d=R(n,0),m=R(o,0);return[d,[0,c],m,u,h]}let f=!0,p=0;const g=new Array(l).fill(0);for(let d=0;d<i;++d){const m=t[d*c];if(m<0)throw new Error(he(d,m));if(m>=l)throw new Error(de(d,m,l));++g[m],f=f&&m>=p,p=m}let E=!0;for(let d=0;d<l;++d){const m=g[d]===0;u[d]=m,E=E&&!m,g[d]=Math.max(g[d],1),d>0&&(g[d]+=g[d-1])}if(E&&f){const d=t,m=s;for(let w=0;w<i;++w)h[w]=w;return[d,[i,c],m,u,h]}else{const d=g[l-1],m=R(n,d*c),w=R(o,d),I=new Array(l).fill(0);for(let b=0;b<i;++b){const S=t[b*c],y=I[S],x=(S===0?0:g[S-1])+y;I[S]++;for(let A=0;A<c;++A)m[x*c+A]=t[b*c+A];w[x]=s[b],h[b]=x}for(let b=0;b<l;++b)if(I[b]===0){const y=b===0?0:g[b-1];m[y*c+0]=b;for(let x=1;x<c;++x)m[y*c+x]=0;w[y]=a}return[m,[d,c],w,u,h]}}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function xo(t,e,n,s,o){const r=k(s),a=e[0],i=o.length,l=[];let u=1,h=-1;for(let d=0;d<i;++d){const m=o[d];if(m===-1){if(h!==-1)throw new Error(pe(h,d));h=d,l.push(1)}else{if(m<0)throw new Error(ge(d,m));u*=m,l.push(m)}}if(h!==-1){if(u<=0)throw new Error(me());const d=Math.trunc(r/u);if(u*d!==r)throw new Error(Ie(s,l));l[h]=d}if(k(l)!==r)throw new Error(we(s,l));const f=s.length,p=[];if(f>0){p[f-1]=1;for(let d=f-2;d>=0;--d)p[d]=p[d+1]*s[d+1]}const g=[];if(i>0){g[i-1]=1;for(let d=i-2;d>=0;--d)g[d]=g[d+1]*l[d+1]}const E=R(n,a*i);for(let d=0;d<a;++d){let m=0;for(let w=0;w<f;++w)m+=t[d*f+w]*p[w];for(let w=0;w<i;++w)E[d*i+w]=Math.trunc(m/g[w]),m%=g[w]}return[E,[a,i],l]}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ko(t,e,n,s,o,r=!1,a=0){const i=s.length,l=[e[0],t.length/e[0]],u=l[1],c=i>0?o[i-1]+1:0;if(c<0)throw new Error(rt());const f=e.slice();f[0]=c;const p=f.reduce((I,b)=>I*b,1),g=R(n,p);if(i===0)return c>0&&g.fill(a),[g,f];if(c<=0)throw new Error(rt());let E=0,d=1,m=0,w=o[E];for(;;){let I=0;if(d<i){if(I=o[d],w===I){++d;continue}if(w>=I)throw new Error(Ee())}if(w<0||w>=c)throw new Error(be(w,c));w>m&&g.fill(a,m*u,w*u);for(let b=E;b<d;++b){const S=s[b];if(S<0||S>=l[0])throw new Error(Se(b,s[b],l[0]));for(let y=0;y<u;y++)g[w*u+y]+=t[S*u+y]}if(r)for(let b=0;b<u;b++)g[w*u+b]/=d-E;if(E=d,++d,m=w+1,w=I,d>i)break}return m<c&&g.fill(a,m*u,c*u),[g,f]}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ao=_(t=>Math.sqrt(t)),Ro=Te(jt,t=>Math.sqrt(t)),Ir={kernelName:jt,backendName:"cpu",kernelFunc:Ro};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Ze=T((t,e)=>{const n=t-e;return n*n}),$o=N(Bt,Ze),wr={kernelName:Bt,backendName:"cpu",kernelFunc:$o};/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const He=_((t,e)=>{const{pattern:n,replaceGlobal:s,rewrite:o}=e;return t.replace(new RegExp(n,s?"g":""),o)}),To=C(Ut,He),Er={kernelName:Ut,backendName:"cpu",kernelFunc:To};/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Mo(t,e,n,s){const o=D(t,e.dtype);for(let r=0;r<o.size;r++){const a=o.indexToLoc(r),i=new Array(a.length);for(let l=0;l<i.length;l++)i[l]=a[l]*n[l]+s[l];o.set(e.get(...i),...a)}return o}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class No{constructor(e,n,s,o,r,a){this.separator=Z(e),this.nGramWidths=n,this.leftPad=Z(s),this.rightPad=Z(o),this.padWidth=r,this.preserveShort=a}getPadWidth(e){return Math.min(this.padWidth<0?e-1:this.padWidth,e-1)}getNumNGrams(e,n){const s=this.getPadWidth(n);return Math.max(0,e+2*s-n+1)}createNGrams(e,n,s,o,r,a){for(let i=0;i<r;++i){const l=this.getPadWidth(a),u=Math.max(0,l-i),h=Math.max(0,l-(r-(i+1))),c=a-(u+h),f=n+(u>0?0:i-l);let p=0;p+=u*this.leftPad.length;for(let w=0;w<c;++w)p+=e[f+w].length;p+=h*this.rightPad.length;const g=u+h+c-1;p+=g*this.separator.length,s[o+i]=new Uint8Array(p);const E=s[o+i];let d=0;const m=w=>w.forEach(I=>E[d++]=I);for(let w=0;w<u;++w)m(this.leftPad),m(this.separator);for(let w=0;w<c-1;++w)m(e[f+w]),m(this.separator);if(c>0){m(e[f+c-1]);for(let w=0;w<h;++w)m(this.separator),m(this.rightPad)}else{for(let w=0;w<h-1;++w)m(this.rightPad),m(this.separator);m(this.rightPad)}}}compute(e,n){const s=e.length,o=n.length;if(o>0){let l=n[0];if(l!==0)throw new Error(`First split value must be 0, got ${l}`);for(let u=1;u<o;++u){let h=n[u]>=l;if(h=h&&n[u]<=s,!h)throw new Error(`Invalid split value ${n[u]}, must be in [${l}, ${s}]`);l=n[u]}if(l!==s)throw new Error(`Last split value must be data size. Expected ${s}, got ${l}`)}const r=o-1,a=R("int32",o);if(s===0||o===0){const l=new Array(s);for(let u=0;u<=r;++u)a[u]=0;return[l,a]}a[0]=0;for(let l=1;l<=r;++l){const u=n[l]-n[l-1];let h=0;this.nGramWidths.forEach(c=>{h+=this.getNumNGrams(u,c)}),this.preserveShort&&u>0&&h===0&&(h=1),a[l]=a[l-1]+h}const i=new Array(a[r]);for(let l=0;l<r;++l){const u=n[l];let h=a[l];if(this.nGramWidths.forEach(c=>{const f=n[l+1]-n[l],p=this.getNumNGrams(f,c);this.createNGrams(e,u,i,h,p,c),h+=p}),this.preserveShort&&h===a[l]){const c=n[l+1]-n[l];if(c===0)continue;const f=c+2*this.padWidth;this.createNGrams(e,u,i,h,1,f)}}return[i,a]}}function vo(t,e,n,s,o,r,a,i){return new No(n,s,o,r,a,i).compute(t,e)}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Fo(t,e,n,s){if(!t.length)return;if(e.length===0){for(let r=0;r<t.length;++r)s.push(t.subarray(r,r+1));return}if(e.length===1){const r=e[0];let a=t.indexOf(r);for(;a!==-1;){const i=t.subarray(0,a);(!n||i.length!==0)&&s.push(i),t=t.subarray(a+1),a=t.indexOf(r)}(!n||t.length!==0)&&s.push(t);return}let o=0;for(let r=0;r<t.length+1;r++)if(r===t.length||e.indexOf(t[r])!==-1){const a=t.subarray(o,r);(!n||a.length!==0)&&s.push(a),o=r+1}}function Oo(t,e,n){const s=t.length,o=[];let r=0,a=0;const i=new Array(s);for(let f=0;f<s;++f){const p=o.length;Fo(t[f],e,n,o);const g=o.length-p;i[f]=g,r+=g,a=Math.max(a,g)}const l=R("int32",r*2),u=new Array(r),h=[s,a];let c=0;for(let f=0;f<s;++f)for(let p=0;p<i[f];++p)l[c*2]=f,l[c*2+1]=p,u[c]=o[c],++c;return[l,u,h]}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Do(t,e){const n=R("int32",t.length);for(let s=0;s<t.length;++s)n[s]=Gn(t[s]).modulo(e).getLowBitsUnsigned();return n}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Je=T((t,e)=>t-e),_o=ut((t,e,n,s)=>({real:t-n,imag:e-s})),Vo=N(Xt,Je,_o),br={kernelName:Xt,backendName:"cpu",kernelFunc:Vo};/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Po(t,e){const n=new Array(t.rank);for(let o=0;o<n.length;o++)n[o]=t.shape[o]*e[o];const s=D(n,t.dtype);for(let o=0;o<s.values.length;++o){const r=s.indexToLoc(o),a=new Array(t.rank);for(let l=0;l<a.length;l++)a[l]=r[l]%t.shape[l];const i=t.locToIndex(a);s.values[o]=t.values[i]}return s}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const B=(t,e)=>{const n=e.value-t.value;return n===0?t.index-e.index:n};function Ye(t,e,n=0,s=t.length-1){for(;s>n;){if(s-n>600){const i=s-n+1,l=e-n+1,u=Math.log(i),h=.5*Math.exp(2*u/3),c=.5*Math.sqrt(u*h*(i-h)/i)*Math.sign(l-i/2),f=Math.max(n,Math.floor(e-l*h/i+c)),p=Math.min(s,Math.floor(e+(i-l)*h/i+c));Ye(t,e,f,p)}const o=t[e];let r=n,a=s;for(j(t,n,e),B(t[s],o)>0&&j(t,n,s);r<a;){for(j(t,r,a),r++,a--;B(t[r],o)<0;)r=r+1;for(;B(t[a],o)>0;)a=a-1}B(t[n],o)===0?j(t,n,a):(a=a+1,j(t,a,s)),a<=e&&(n=a+1),e<=a&&(s=a-1)}}function Co(t,e,n,s,o){const r=e[e.length-1],[a,i]=[t.length/r,r],l=W(n,a*s),u=W("int32",a*s);for(let c=0;c<a;c++){const f=c*i,p=t.subarray(f,f+i);let g=new Array(p.length);p.forEach((w,I)=>g[I]={value:w,index:I}),s<g.length&&(Ye(g,s),g=g.slice(0,s)),o&&g.sort(B);const E=c*s,d=l.subarray(E,E+s),m=u.subarray(E,E+s);for(let w=0;w<s;w++)d[w]=g[w].value,m[w]=g[w].index}const h=e.slice();return h[h.length-1]=s,[D(h,n,l),D(h,"int32",u)]}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Lo(t,e,n,s){const o=Gt(e,n)[0],r=[1,n[0],1];for(let g=0;g<o;g++)r[0]*=n[g];r[1]=n[o];for(let g=o+1;g<n.length;g++)r[2]*=n[g];const a=new Map,i=new Int32Array(n[o]),l=new nt(r,s,t),u=[],h=r[0]===1&&r[2]===1;for(let g=0;g<n[o];g++){let E;if(h)E=t[g].toString();else{const m=[];for(let w=0;w<r[0];w++)for(let I=0;I<r[2];I++)m.push(l.get(w,g,I));E=m.join(",")}const d=a.get(E);if(d!=null)i[g]=d;else{const m=a.size;a.set(E,m),i[g]=m,u.push(g)}}const c=r.slice();c[1]=a.size;const f=new nt(c,s);u.forEach((g,E)=>{for(let d=0;d<r[0];d++)for(let m=0;m<r[2];m++)f.set(l.get(d,g,m),d,E,m)});const p=n.slice();return p[o]=c[1],{outputValues:f.values,outputShape:p,indices:i}}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Sr=Object.freeze(Object.defineProperty({__proto__:null,addImpl:Re,bincountImpl:Ds,bincountReduceImpl:_s,bitwiseAndImpl:$e,castImpl:Ae,ceilImpl:Me,concatImpl:Cs,equalImpl:Ne,expImpl:ve,expm1Impl:Fe,floorDivImpl:De,floorImpl:Oe,gatherNdImpl:js,gatherV2Impl:Bs,greaterEqualImpl:Ve,greaterImpl:_e,lessEqualImpl:Ce,lessImpl:Pe,linSpaceImpl:Hs,logImpl:Le,maxImpl:Ys,maximumImpl:We,minimumImpl:Ge,multiplyImpl:ft,negImpl:qe,notEqualImpl:ze,prodImpl:Ue,raggedGatherImpl:ho,raggedRangeImpl:po,raggedTensorToTensorImpl:go,rangeImpl:mo,rsqrtImpl:Xe,scatterImpl:wo,sigmoidImpl:Eo,simpleAbsImpl:xe,sliceImpl:Ke,sparseFillEmptyRowsImpl:yo,sparseReshapeImpl:xo,sparseSegmentReductionImpl:ko,sqrtImpl:Ao,squaredDifferenceImpl:Ze,staticRegexReplaceImpl:He,stridedSliceImpl:Mo,stringNGramsImpl:vo,stringSplitImpl:Oo,stringToHashBucketFastImpl:Do,subImpl:Je,tileImpl:Po,topKImpl:Co,transposeImpl:je,uniqueImpl:Lo},Symbol.toStringTag,{value:"Module"}));export{Ys as $,bs as A,ys as B,xs as C,Ss as D,ks as E,no as F,fs as G,us as H,cs as I,ls as J,is as K,as as L,gs as M,hs as N,ds as O,ps as P,Is as Q,Vo as R,os as S,ms as T,ws as U,Kt as V,js as W,Ms as X,Bs as Y,Hs as Z,je as _,rs as a,Kn as a$,Ws as a0,ho as a1,po as a2,go as a3,mo as a4,Yn as a5,wo as a6,yo as a7,xo as a8,ko as a9,rr as aA,ar as aB,ir as aC,lr as aD,cr as aE,ur as aF,fr as aG,dr as aH,Uo as aI,pr as aJ,gr as aK,mr as aL,Ir as aM,wr as aN,Er as aO,br as aP,hr as aQ,qo as aR,Sr as aS,z as aT,Jn as aU,Zt as aV,oe as aW,re as aX,Ts as aY,$s as aZ,Go as a_,Rs as aa,Un as ab,jn as ac,Mo as ad,vo as ae,Oo as af,Do as ag,Po as ah,Co as ai,Lo as aj,Ls as ak,zo as al,Ko as am,Zo as an,Xo as ao,Ho as ap,jo as aq,Jo as ar,Yo as as,Qo as at,tr as au,er as av,nr as aw,sr as ax,Bo as ay,or as az,G as b,T as c,Os as d,N as e,ts as f,Qn as g,es as h,it as i,ns as j,ss as k,So as l,ot as m,Ds as n,Zn as o,ae as p,Hn as q,ke as r,bo as s,Be as t,Te as u,Q as v,Cs as w,_s as x,K as y,at as z};
