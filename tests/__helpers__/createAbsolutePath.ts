import { platform } from 'node:os';

function createAbsolutePath( posixPath: string ): string {
	if ( platform() !== 'win32' ) {
		return posixPath;
	}

	const windowsPath = `/C:/${ posixPath }`;

	return windowsPath;
}

export default createAbsolutePath;
