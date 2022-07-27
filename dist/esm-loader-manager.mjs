/*! esm-loader-manager v0.2.0 | (c) 2022 Comandeer | MIT license (see LICENSE) */
import{existsSync as t}from"node:fs";import{resolve as n,relative as o}from"node:path";import{cwd as r,env as e}from"node:process";import{fileURLToPath as s,pathToFileURL as i}from"node:url";import{readdir as a,readFile as c}from"node:fs/promises";const u=[".js",".mjs"];const l=r(),f=await async function t(o){if((await a(o)).includes("package.json"))return o;const r=n(o,"..");return r===o?null:t(r)}(l);f||console.warn("ESMLM: The project root was not detected. Falling back to the CWD.");const m=f||l,d="ESMLM_CONFIG"in e?e.ESMLM_CONFIG:await async function t(o,r){const e=await a(o);for(const t of u){const r=`.esmlmrc${t}`;if(e.includes(r)){return n(o,r)}}return o===r?null:t(n(o,".."))}(l,m),w=d?n(l,d):null;let p=[];if(w&&t(w)){const t=i(w),{default:n}=await import(t);p=n.loaders}else console.warn("ESMLM: The file with loaders' definition was not found.");async function h(t,n,o){const r=await o(t,n,o),{url:e}=r;if(y(m,r))return r;return p.some((({matcher:t})=>t(e,n)))?{url:e,type:"module"}:r}async function M(t,n,o){const r={...n,url:t};if(y(m,r))return o(t,n,o);const e=p.filter((({matcher:o})=>o(t,n)));if(0===e.length)return o(t,n,o);let i=await async function(t){const n=s(t);return c(n)}(t);for(const{loader:n}of e)i=await n(t,i);return{format:"module",shortCircuit:!0,source:i}}function y(t,n){const r=n.url;return function({url:t,format:n}){return n?"builtin"===n:t.startsWith("node:")}(n)||/[/\\]node_modules[/\\]/gi.test(r)||!function(t,n){const r=n.startsWith("file://")?s(n):n;return!o(t,r).startsWith("..")}(t,r)}export{M as load,h as resolve};
//# sourceMappingURL=esm-loader-manager.mjs.map
