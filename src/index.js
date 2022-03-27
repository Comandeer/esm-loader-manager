import { fileURLToPath } from 'url';
import { resolve as resolvePath } from 'path';
import { existsSync as fileExists } from 'fs';
import { readFile } from 'fs/promises';

const cwd = process.cwd();
const loaderFileName = '.esmlm.js';
const loaderPath = resolvePath( cwd, loaderFileName );
let loaders = [];

if ( fileExists( loaderPath ) ) {
	const { default: loadedLoaders } = await import( loaderPath );

	loaders = loadedLoaders;
} else {
	console.warn( 'ESMLM: The file with loaders\' definition was not found.' ); // eslint-disable-line no-console
}

async function resolve( specifier, context, defaultResolve ) {
	const isAnyLoaderForSpecifier = loaders.some( ( { matcher } ) => {
		return matcher( specifier, context );
	} );

	if ( isAnyLoaderForSpecifier ) {
		const moduleURL = createModuleURL( specifier, context );

		return {
			url: moduleURL
		};
	}

	return defaultResolve( specifier, context, defaultResolve );
}

async function load( url, context, defaultLoad ) {
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

function createModuleURL( specifier, { parentURL } ) {
	if ( parentURL ) {
		return new URL( specifier, parentURL ).href;
	}

	return new URL( specifier ).href;
}

async function loadURL( url ) {
	const path = fileURLToPath( url );

	return readFile( path );
}

export { resolve };
export { load };
