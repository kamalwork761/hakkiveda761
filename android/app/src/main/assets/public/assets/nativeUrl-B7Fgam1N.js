import{t as o,ab as n}from"./index-DK7wKq-1.js";/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]],p=o("zap",i),a="https://hakkiveda.com";function c(r){if(!r)return"";const t=r.trim();if(!t)return"";const s=n();if(/^(https?:)?\/\//i.test(t)||t.startsWith("data:")||t.startsWith("blob:")){if(s)try{const e=new URL(t,a);if(e.hostname==="localhost"||e.hostname==="127.0.0.1"||e.hostname==="10.0.2.2"||e.protocol==="capacitor:")return`${a}${e.pathname}${e.search}${e.hash}`}catch{}return t}if(s){const e=t.startsWith("/")?t:`/${t}`;return`${a}${e}`}return t}function m(r,t="/images/hero_tribal_elders.jpg"){return!r||typeof r!="string"||!r.trim()?t:c(r)||t}export{p as Z,m as r};
