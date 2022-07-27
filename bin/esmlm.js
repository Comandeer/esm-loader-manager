#!/usr/bin/env node

import { argv } from 'node:process';
import { cwd as processCWD } from 'node:process';
import { exit } from 'node:process';
import { dirname } from 'node:path';
import { resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';
import { execa } from 'execa';

const __dirname = dirname( fileURLToPath( import.meta.url ) );
const loaderPath = resolvePath( __dirname, '..', 'dist', 'esm-loader-manager.mjs' );
const loaderURL = pathToFileURL( loaderPath );
const cwd = processCWD();
const [ ,, passedEntryPoint, ...args ] = argv;
const entryPoint = passedEntryPoint ? resolvePath( cwd, passedEntryPoint ) : cwd;
const cmd = 'node';
const params = [
	'--experimental-loader',
	loaderURL,
	entryPoint,
	...args
];

const { exitCode } = await execa( cmd, params, {
	cwd,
	stdio: 'inherit',
	reject: false
} );

exit( typeof exitCode === 'number' ? exitCode : 1 );
