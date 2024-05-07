import { readdir } from 'node:fs/promises';
import { resolve as resolvePath } from 'pathe';

const configFileName = 'esmlm.config';
const configFileExtensions = [
	'.js',
	'.mjs'
];

async function resolveConfigFile( startDir: string, projectRoot: string ): Promise<string | null> {
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

		return resolveConfigFile( dirUp, projectRoot );
	} catch {
		return null;
	}
}

export default resolveConfigFile;
