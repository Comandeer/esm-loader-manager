import { resolve as resolvePath } from 'path';

const cwd = process.cwd();
const loaderFileName = '__ESMLM__.js';
const loaderPath = resolvePath( cwd, loaderFileName );
const { default: loaders } = await import( loaderPath );

export async function resolve( specifier, context, defaultResolve ) {
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

export async function load( url, context, defaultLoad ) {
	return defaultLoad( url, context, defaultLoad );
}

function createModuleURL( specifier, { parentURL } ) {
	if ( parentURL ) {
		return new URL( specifier, parentURL ).href;
	}

	return new URL( specifier ).href;
}
