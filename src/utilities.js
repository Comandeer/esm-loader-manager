import { resolve as resolvePath } from 'path';
import { fileURLToPath } from 'url';
import { readdir } from 'fs/promises';
import { readFile } from 'fs/promises';

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

export { createModuleURL };
export { loadURL };
export { resolveProjectRoot };
