import { isAbsolute } from 'pathe';
import { relative as getRelativePath } from 'pathe';
import { fileURLToPath } from 'node:url';

function isInsideDir( dir, pathOrURL ) {
	const filePath = pathOrURL.startsWith( 'file://' ) ? fileURLToPath( pathOrURL ) : pathOrURL;
	const relativePath = getRelativePath( dir, filePath );
	const isNotEmptyPath = relativePath.length > 0;
	const isNotOutsideDir = !relativePath.startsWith( '..' );
	const isNotAbsolutePath = !isAbsolute( relativePath );

	// https://stackoverflow.com/a/45242825/9025529
	return isNotEmptyPath && isNotOutsideDir && isNotAbsolutePath;
}

export default isInsideDir;
