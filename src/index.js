/* eslint-disable no-console */

import { access } from 'node:fs/promises';
import { cwd as processCWD } from 'node:process';
import { env as processEnv } from 'node:process';
import { pathToFileURL } from 'node:url';
import { resolve as resolvePath } from 'pathe';
import isBuiltInModule from './utilities/isBuiltInModule.js';
import isInsideDir from './utilities/isInsideDir.js';
import isInsideNodeModules from './utilities/isInsideNodeModules.js';
import resolveConfigFile from './utilities/resolveConfigFile.js';
import resolveProjectRoot from './utilities/resolveProjectRoot.js';
import loadURL from './utilities/loadURL.js';

const cwd = processCWD();
const resolvedProjectRoot = await resolveProjectRoot( cwd );

if ( !resolvedProjectRoot ) {
	console.warn( 'ESMLM: The project root was not detected. Falling back to the CWD.' );
}

const projectRoot = resolvedProjectRoot || cwd;
const loaderFileName = 'ESMLM_CONFIG' in processEnv ? processEnv.ESMLM_CONFIG :
	await resolveConfigFile( cwd, projectRoot );
const loaderPath = loaderFileName ? resolvePath( cwd, loaderFileName ) : null;
let loaders = [];

try {
	await access( loaderPath );

	const loaderURL = pathToFileURL( loaderPath );
	const { default: config } = await import( loaderURL );

	loaders = config.loaders;
} catch {
	console.warn( 'ESMLM: The file with loaders\' definition was not found or cannot be accessed.' );
}

async function resolve( specifier, context, defaultResolve ) {
	const defaultResolvedInfo = await defaultResolve( specifier, context, defaultResolve );
	const { url: moduleURL } = defaultResolvedInfo;

	if ( shouldIgnoreModule( projectRoot, defaultResolvedInfo ) ) {
		return defaultResolvedInfo;
	}

	const isAnyLoaderForSpecifier = loaders.some( ( { matcher } ) => {
		return matcher( moduleURL, context );
	} );

	if ( !isAnyLoaderForSpecifier ) {
		return defaultResolvedInfo;
	}

	return {
		url: moduleURL,
		type: 'module'
	};
}

async function load( url, context, defaultLoad ) {
	const moduleInfo = { ...context, url };

	if ( shouldIgnoreModule( projectRoot, moduleInfo ) ) {
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
		shortCircuit: true,
		source
	};
}

function shouldIgnoreModule( projectRoot, moduleInfo ) {
	const moduleURL = moduleInfo.url;

	return isBuiltInModule( moduleInfo ) || isInsideNodeModules( moduleURL ) || !isInsideDir( projectRoot, moduleURL );
}

export { resolve };
export { load };
