import { resolve as resolvePath } from 'path';
import { existsSync as fileExists } from 'fs';

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
	return defaultLoad( url, context, defaultLoad );
}

function createModuleURL( specifier, { parentURL } ) {
	if ( parentURL ) {
		return new URL( specifier, parentURL ).href;
	}

	return new URL( specifier ).href;
}

export { resolve };
export { load };
