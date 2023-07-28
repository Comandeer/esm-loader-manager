import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

async function loadURL( url: string | URL ): Promise<Buffer | string> {
	const path = fileURLToPath( url );

	return readFile( path );
}

export default loadURL;
