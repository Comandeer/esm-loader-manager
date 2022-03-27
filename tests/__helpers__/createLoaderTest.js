import { dirname } from 'path';
import { resolve as resolvePath } from 'path';
import { fileURLToPath } from 'url';
import createCmdTest from './createCmdTest.js';

const __dirname = dirname( fileURLToPath( import.meta.url ) );

/**
 * @callback LoaderTestCallback
 * @param {import('ava').ExecutionContext<unknown>} t Test execution context
 * @param {ChildProcessResult} results
 * @returns {void}
 */

/**
 * @typedef {Object} LoaderTestOptions
 * @property {string} fixturePath Path to the fixture.
 * @property {LoaderTestCallback} callback Callback to invoke after executing command.
 */

/**
 * @param {LoaderTestOptions} options
 * @returns {() => Promise}
 */
function createLoaderTest( {
	fixturePath,
	callback: userCallback
} = {} ) {
	const loaderPath = resolvePath( __dirname, '..', '..', 'src', 'index.js' );
	const cmd = 'node';
	const params = [
		'--experimental-loader',
		loaderPath,
		fixturePath
	];
	return createCmdTest( {
		cmd,
		params,
		cwd: fixturePath,
		callback( t, results ) {
			return userCallback( t, results );
		}
	} );
}

export default createLoaderTest;
