import { readdir } from 'node:fs/promises';
import { resolve as resolvePath } from 'pathe';

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

export default resolveConfigFile;
