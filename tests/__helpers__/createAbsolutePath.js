import { platform } from 'node:os';
import { sep as separator } from 'pathe';

/**
 * @param {string} posixPath
 * @returns {string} Path compatible with the operating system.
 */
function createAbsolutePath( posixPath ) {
	if ( platform() !== 'win32' ) {
		return posixPath;
	}

	const pathWithReplacedSeparators = posixPath.replaceAll( '/', separator );
	const windowsPath = `C:\\${ pathWithReplacedSeparators }`;

	return windowsPath;
}

export default createAbsolutePath;
