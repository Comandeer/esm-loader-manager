#!/usr/bin/env node
/*! esm-loader-manager v0.6.0 | (c) 2024 Comandeer | MIT license (see LICENSE) */
import{cwd as o,exit as r,argv as e}from"node:process";import{dirname as t,resolve as i}from"pathe";import{fileURLToPath as m,pathToFileURL as d}from"node:url";import{execa as p}from"execa";const s=d(i(t(m(import.meta.url)),"..","dist","register.mjs")),a=o(),[,,c,...f]=e,n=void 0!==c?i(a,c):a,h=["--import",s.href,n,...f],{exitCode:u}=await p("node",h,{cwd:a,stdio:"inherit",reject:!1});r("number"==typeof u?u:1);
//# sourceMappingURL=esmlm.js.map
