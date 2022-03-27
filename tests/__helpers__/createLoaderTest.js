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
 * @property {Record<string, string>} [env={}] Additional environment variables to pass to the command.
 * @property {LoaderTestCallback} callback Callback to invoke after executing command.
 */

/**
 * @param {LoaderTestOptions} options
 * @returns {() => Promise}
 */
function createLoaderTest( {
	fixturePath,
	env = {},
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
		env,
		cwd: fixturePath,
		callback( t, results ) {
			return userCallback( t, results );
		}
	} );
}

export default createLoaderTest;
