import { readdir } from 'node:fs/promises';
import { resolve as resolvePath } from 'pathe';

async function resolveProjectRoot( startDir: string ): Promise<string | null> {
	try {
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
	} catch {
		return null;
	}
}

export default resolveProjectRoot;
