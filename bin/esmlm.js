#!/usr/bin/env node

import { argv, exit, cwd as processCWD } from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname } from 'node:path';
import { resolve as resolvePath } from 'node:path';
import { execa } from 'execa';

const __dirname = dirname( fileURLToPath( import.meta.url ) );
const loaderPath = resolvePath( __dirname, '..', 'dist', 'esm-loader-manager.mjs' );
const loaderURL = pathToFileURL( loaderPath );
const cwd = processCWD();
const [ ,, passedEntryPoint ] = argv;
const entryPoint = passedEntryPoint ? resolvePath( cwd, passedEntryPoint ) : cwd;
const cmd = 'node';
const params = [
	'--experimental-loader',
	loaderURL,
	entryPoint
];

const { exitCode } = await execa( cmd, params, {
	cwd,
	stdio: 'inherit'
} );

exit( exitCode );
