import { dirname } from 'path';
import { resolve as resolvePath } from 'path';
import { fileURLToPath } from 'url';
import createCmdTest from './createCmdTest.js';

const __dirname = dirname( fileURLToPath( import.meta.url ) );

/**
 * @callback EsmlmTestCallback
 * @param {import('ava').ExecutionContext<unknown>} t Test execution context
 * @param {ChildProcessResult} results
 * @returns {void}
 */

/**
 * @typedef {Object} EsmlmTestOptions
 * @property {string} cwd Path to the cwd.
 * @property {string} [entryPoint] The file name to be exectued by Node.
 * @property {Record<string, string>} [env={}] Additional environment variables to pass to the command.
 * @property {EsmlmTestCallback} callback Callback to invoke after executing command.
 */

/**
 * @param {EsmlmTestOptions} options
 * @returns {() => Promise}
 */
function createEsmlmTest( {
	cwd,
	entryPoint = cwd,
	env = {},
	callback: userCallback
} = {} ) {
	const esmlmPath = resolvePath( __dirname, '..', '..', 'bin', 'esmlm.js' );
	const cmd = esmlmPath;
	const params = entryPoint ? [
		entryPoint
	] : [];

	return createCmdTest( {
		cmd,
		params,
		env,
		cwd,
		callback( t, results ) {
			return userCallback( t, results );
		}
	} );
}

export default createEsmlmTest;
