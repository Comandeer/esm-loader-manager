#!/usr/bin/env node
/*! esm-loader-manager v0.5.0 | (c) 2023 Comandeer | MIT license (see LICENSE) */
import{cwd as e,exit as o,argv as r}from"node:process";import{dirname as t,resolve as m}from"pathe";import{fileURLToPath as i,pathToFileURL as a}from"node:url";import{execa as d}from"execa";const p=a(m(t(i(import.meta.url)),"..","dist","esm-loader-manager.mjs")),n=e(),[,,s,...c]=r,f=void 0!==s?m(n,s):n,l=["--experimental-loader",p.href,f,...c],{exitCode:h}=await d("node",l,{cwd:n,stdio:"inherit",reject:!1});o("number"==typeof h?h:1);
//# sourceMappingURL=esmlm.js.map
