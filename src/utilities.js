import { readdir } from 'node:fs/promises';
import { readFile } from 'node:fs/promises';
import { isAbsolute } from 'pathe';
import { relative as getRelativePath } from 'pathe';
import { resolve as resolvePath } from 'pathe';
import { fileURLToPath } from 'node:url';

async function loadURL( url ) {
	const path = fileURLToPath( url );

	return readFile( path );
}

async function resolveProjectRoot( startDir ) {
	const files = await readdir( startDir );

	if ( files.includes( 'package.json' ) ) {
		return startDir;
	}

	const dirUp = resolvePath( startDir, '..' );

	// If directory one level up is the same as the current on,
	// we're at / and there's nowhere to go up.
	if ( dirUp === startDir ) {
		return null;
	}

	return resolveProjectRoot( dirUp );
}

const configFileName = '.esmlmrc';
const configFileExtensions = [
	'.js',
	'.mjs'
];

async function resolveConfigFile( startDir, projectRoot ) {
	try {
		const files = await readdir( startDir );

		for ( const extension of configFileExtensions ) {
			const configFileFullName = `${ configFileName }${ extension }`;

			if ( files.includes( configFileFullName ) ) {
				const resolvedConfigFilePath = resolvePath( startDir, configFileFullName );

				return resolvedConfigFilePath;
			}
		}

		// Do not go outside of the project root.
		if ( startDir === projectRoot ) {
			return null;
		}

		const dirUp = resolvePath( startDir, '..' );

		return resolveConfigFile( dirUp );
	} catch {
		return null;
	}
}

function isInsideDir( dir, pathOrURL ) {
	const filePath = pathOrURL.startsWith( 'file://' ) ? fileURLToPath( pathOrURL ) : pathOrURL;
	const relativePath = getRelativePath( dir, filePath );
	const isNotEmptyPath = relativePath.length > 0;
	const isNotOutsideDir = !relativePath.startsWith( '..' );
	const isNotAbsolutePath = !isAbsolute( relativePath );

	// https://stackoverflow.com/a/45242825/9025529
	return isNotEmptyPath && isNotOutsideDir && isNotAbsolutePath;
}

function isInsideNodeModules( pathOrURL ) {
	const npmModulesPathRegex = /[/\\]node_modules[/\\]/gi;

	return npmModulesPathRegex.test( pathOrURL );
}

function isBuiltInModule( { url, format } ) {
	if ( format ) {
		return format === 'builtin';
	}

	return url.startsWith( 'node:' );
}

export { loadURL };
export { resolveProjectRoot };
export { resolveConfigFile };
export { isInsideDir };
export { isInsideNodeModules };
export { isBuiltInModule };
