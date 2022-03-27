import { fileURLToPath } from 'url';
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

export { createModuleURL };
export { loadURL };
