import { resolve as resolvePath } from 'path';
import { existsSync as fileExists } from 'fs';
import { createModuleURL } from './utilities.js';
import { loadURL } from './utilities.js';

const cwd = process.cwd();
const loaderFileName = 'ESMLM_CONFIG' in process.env ? process.env.ESMLM_CONFIG : '.esmlmrc.js';
const loaderPath = resolvePath( cwd, loaderFileName );
let loaders = [];

if ( fileExists( loaderPath ) ) {
	const { default: config } = await import( loaderPath );

	loaders = config.loaders;
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

export { resolve };
export { load };
