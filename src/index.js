/* eslint-disable no-console */

import { resolve as resolvePath } from 'path';
import { existsSync as fileExists } from 'fs';
import { createModuleURL } from './utilities.js';
import { isInsideDir } from './utilities.js';
import { resolveConfigFile } from './utilities.js';
import { resolveProjectRoot } from './utilities.js';
import { loadURL } from './utilities.js';

const cwd = process.cwd();
const resolvedProjectRoot = await resolveProjectRoot( cwd );

if ( !resolvedProjectRoot ) {
	console.warn( 'ESMLM: The project root was not detected. Falling back to the CWD.' );
}

const projectRoot = resolvedProjectRoot || cwd;
const loaderFileName = 'ESMLM_CONFIG' in process.env ? process.env.ESMLM_CONFIG :
	await resolveConfigFile( cwd, projectRoot );
const loaderPath = loaderFileName ? resolvePath( cwd, loaderFileName ) : null;
let loaders = [];

if ( loaderPath && fileExists( loaderPath ) ) {
	const { default: config } = await import( loaderPath );

	loaders = config.loaders;
} else {
	console.warn( 'ESMLM: The file with loaders\' definition was not found.' );
}

async function resolve( specifier, context, defaultResolve ) {
	const moduleURL = createModuleURL( specifier, context );

	if ( !isInsideDir( projectRoot, moduleURL ) ) {
		return defaultResolve( specifier, context, defaultResolve );
	}

	const isAnyLoaderForSpecifier = loaders.some( ( { matcher } ) => {
		return matcher( moduleURL, context );
	} );

	if ( !isAnyLoaderForSpecifier ) {
		return defaultResolve( specifier, context, defaultResolve );
	}

	return {
		url: moduleURL
	};
}

async function load( url, context, defaultLoad ) {
	if ( !isInsideDir( projectRoot, url ) ) {
		return defaultLoad( url, context, defaultLoad );
	}

	const matchedLoaders = loaders.filter( ( { matcher } ) => {
		return matcher( url, context );
	} );

	if ( matchedLoaders.length === 0 ) {
		return defaultLoad( url, context, defaultLoad );
	}

	let source = await loadURL( url );

	for ( const { loader } of matchedLoaders ) {
		source = await loader( url, source ); // eslint-disable-line no-await-in-loop
	}

	return {
		format: 'module',
		source
	};
}

export { resolve };
export { load };
