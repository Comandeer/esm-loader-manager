#!/usr/bin/env node

import { argv } from 'node:process';
import { cwd as processCWD } from 'node:process';
import { exit } from 'node:process';
import { dirname } from 'pathe';
import { resolve as resolvePath } from 'pathe';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';
import { execa } from 'execa';

const __dirname = dirname( fileURLToPath( import.meta.url ) );
const loaderPath = resolvePath( __dirname, '..', 'dist', 'register.mjs' );
const registerModuleUrl = pathToFileURL( loaderPath );
const cwd = processCWD();
const [ ,, passedEntryPoint, ...args ] = argv;
const entryPoint = passedEntryPoint !== undefined ? resolvePath( cwd, passedEntryPoint ) : cwd;
const cmd = 'node';
const params = [
	'--import',
	registerModuleUrl.href,
	entryPoint,
	...args
];

const { exitCode } = await execa( cmd, params, {
	cwd,
	stdio: 'inherit',
	reject: false
} );

exit( typeof exitCode === 'number' ? exitCode : 1 );
