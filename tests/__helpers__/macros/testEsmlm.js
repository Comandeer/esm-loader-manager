import { dirname } from 'pathe';
import { resolve as resolvePath } from 'pathe';
import { fileURLToPath } from 'node:url';
import test from 'ava';
import testCmd from '../testCmd.js';

const __dirname = dirname( fileURLToPath( import.meta.url ) );

/**
 * @callback EsmlmTestCallback
 * @param {import('ava').ExecutionContext<unknown>} t Test execution context
 * @param {import('execa').ExecaReturnValue} results
 * @returns {void}
 */

/**
 * @typedef {Object} EsmlmTestOptions
 * @property {string} cwd Path to the cwd.
 * @property {string} [entryPoint] The file name to be exectued by Node.
 * @property {Array<string>} [args] Arguments to be passed to the program.
 * @property {Record<string, string>} [env={}] Additional environment variables to pass to the command.
 * @property {EsmlmTestCallback} callback Callback to invoke after executing command.
 */

/**
 * @param {import('ava').ExecutionContext<unknown>} t Test execution context
 * @param {EsmlmTestOptions} options
 * @returns {() => Promise}
 */
const testEsmlm = test.macro( ( t, {
	cwd,
	entryPoint,
	args = [],
	env = {},
	callback: userCallback
} = {} ) => {
	const esmlmPath = resolvePath( __dirname, '..', '..', '..', 'bin', 'esmlm.js' );
	const cmd = esmlmPath;
	const params = entryPoint ? [
		entryPoint,
		...args
	] : [
		...args
	];

	// Do not propagate coverage into esmlm binary.
	// For some reason it breaks the coverage calculation.
	env.NODE_V8_COVERAGE = '';

	return testCmd( t, {
		cmd,
		params,
		env,
		cwd,
		callback( t, results ) {
			return userCallback( t, results );
		}
	} );
} );

export default testEsmlm;
