import { resolve as resolvePath } from 'path';
import { relative as getRelativePath } from 'path';
import { fileURLToPath } from 'url';
import { readdir } from 'fs/promises';
import { readFile } from 'fs/promises';

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
}

function isInsideDir( dir, path ) {
	const filePath = path.startsWith( 'file://' ) ? fileURLToPath( path ) : path;
	const relativePath = getRelativePath( dir, filePath );

	// https://www.golinuxcloud.com/if-path-is-subdirectory-of-another-nodejs/
	return !relativePath.startsWith( '..' );
}

function isInsideNodeModules( pathOrURL ) {
	const npmModulesPathRegex = /[/\\]node_modules[/\\]/gi;

	return npmModulesPathRegex.test( pathOrURL );
}

export { loadURL };
export { resolveProjectRoot };
export { resolveConfigFile };
export { isInsideDir };
export { isInsideNodeModules };
