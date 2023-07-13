import { dirname } from 'node:path';
import { resolve as resolvePath } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test from 'ava';
import testCmd from '../testCmd.js';

const __dirname = dirname( fileURLToPath( import.meta.url ) );

/**
 * @callback LoaderTestCallback
 * @param {import('ava').ExecutionContext<unknown>} t Test execution context
 * @param {import('execa').ExecaReturnValue} results
 * @returns {void}
 */

/**
 * @typedef {Object} LoaderTestOptions
 * @property {string} fixturePath Path to the fixture directory.
 * @property {string} [entryPoint=fixturePath] The file name to be exectued by Node.
 * @property {Record<string, string>} [env={}] Additional environment variables to pass to the command.
 * @property {LoaderTestCallback} callback Callback to invoke after executing command.
 */

/**
 * @param {import('ava').ExecutionContext<unknown>} t Test execution context
 * @param {LoaderTestOptions} options
 * @returns {() => Promise}
 */
const testLoader = test.macro( ( t, {
	fixturePath,
	entryPoint = fixturePath,
	env = {},
	callback: userCallback
} = {} ) => {
	const loaderPath = resolvePath( __dirname, '..', '..', '..', 'src', 'index.js' );
	const loaderURL = pathToFileURL( loaderPath );
	const cmd = 'node';
	const params = [
		'--experimental-loader',
		loaderURL,
		entryPoint
	];

	return testCmd( t, {
		cmd,
		params,
		env,
		cwd: fixturePath,
		callback( t, results ) {
			return userCallback( t, results );
		}
	} );
} );

export default testLoader;
