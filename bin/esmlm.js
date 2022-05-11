#!/usr/bin/env node

import { argv } from 'process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { resolve as resolvePath } from 'path';
import { execa } from 'execa';

const __dirname = dirname( fileURLToPath( import.meta.url ) );
const loaderPath = resolvePath( __dirname, '..', 'dist', 'esm-loader-manager.mjs' );
const cwd = process.cwd();
const [ ,, passedEntryPoint ] = argv;
const entryPoint = passedEntryPoint ? resolvePath( cwd, passedEntryPoint ) : cwd;
const cmd = 'node';
const params = [
	'--experimental-loader',
	loaderPath,
	entryPoint
];

execa( cmd, params, {
	cwd,
	stdio: 'inherit'
} );
