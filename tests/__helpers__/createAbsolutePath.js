import { platform } from 'node:os';

/**
 * @param {string} posixPath
 * @returns {string} Path compatible with the operating system.
 */
function createAbsolutePath( posixPath ) {
	if ( platform() !== 'win32' ) {
		return posixPath;
	}

	const windowsPath = `/C:/${ posixPath }`;

	return windowsPath;
}

export default createAbsolutePath;
