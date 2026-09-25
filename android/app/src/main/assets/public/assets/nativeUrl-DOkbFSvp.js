import{t as o,aa as n}from"./index-Cy4AmUg7.js";/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]],p=o("zap",i),s="https://hakkiveda.com";function c(a){if(!a)return"";const t=a.trim();if(!t)return"";const r=n();if(/^(https?:)?\/\//i.test(t)||t.startsWith("data:")||t.startsWith("blob:")){if(r)try{const e=new URL(t,s);if(e.hostname==="localhost"||e.hostname==="127.0.0.1"||e.hostname==="10.0.2.2"||e.protocol==="capacitor:")return`${s}${e.pathname}${e.search}${e.hash}`}catch{}return t}if(r){const e=t.startsWith("/")?t:`/${t}`;return`${s}${e}`}return t}function m(a,t="/images/hero_tribal_elders.jpg"){return!a||typeof a!="string"||!a.trim()?t:c(a)||t}export{p as Z,m as r};
