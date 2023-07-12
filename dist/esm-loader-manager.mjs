/*! esm-loader-manager v0.3.0 | (c) 2023 Comandeer | MIT license (see LICENSE) */
import{existsSync as t}from"node:fs";import{resolve as n,relative as o,isAbsolute as r}from"node:path";import{cwd as e,env as s}from"node:process";import{fileURLToPath as i,pathToFileURL as a}from"node:url";import{readdir as c,readFile as u}from"node:fs/promises";const l=[".js",".mjs"];const f=e(),m=await async function t(o){if((await c(o)).includes("package.json"))return o;const r=n(o,"..");return r===o?null:t(r)}(f);m||console.warn("ESMLM: The project root was not detected. Falling back to the CWD.");const d=m||f,w="ESMLM_CONFIG"in s?s.ESMLM_CONFIG:await async function t(o,r){const e=await c(o);for(const t of l){const r=`.esmlmrc${t}`;if(e.includes(r)){return n(o,r)}}return o===r?null:t(n(o,".."))}(f,d),h=w?n(f,w):null;let p=[];if(h&&t(h)){const t=a(h),{default:n}=await import(t);p=n.loaders}else console.warn("ESMLM: The file with loaders' definition was not found.");async function M(t,n,o){const r=await o(t,n,o),{url:e}=r;if(g(d,r))return r;return p.some((({matcher:t})=>t(e,n)))?{url:e,type:"module"}:r}async function y(t,n,o){const r={...n,url:t};if(g(d,r))return o(t,n,o);const e=p.filter((({matcher:o})=>o(t,n)));if(0===e.length)return o(t,n,o);let s=await async function(t){const n=i(t);return u(n)}(t);for(const{loader:n}of e)s=await n(t,s);return{format:"module",shortCircuit:!0,source:s}}function g(t,n){const e=n.url;return function({url:t,format:n}){return n?"builtin"===n:t.startsWith("node:")}(n)||/[/\\]node_modules[/\\]/gi.test(e)||!function(t,n){const e=n.startsWith("file://")?i(n):n,s=o(t,e),a=s.length>0,c=!s.startsWith(".."),u=!r(s);return a&&c&&u}(t,e)}export{y as load,M as resolve};
//# sourceMappingURL=esm-loader-manager.mjs.map
