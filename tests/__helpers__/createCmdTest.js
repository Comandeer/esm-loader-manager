import { cwd as processCWD } from 'node:process';
import { execa } from 'execa';

/**
 * @callback CmdTestCallback
 * @param {import('ava').ExecutionContext<unknown>} t Test execution context
 * @param {ChildProcessResult} results
 * @returns {void}
 */

/**
 * @typedef {Object} CmdTestOptions
 * @property {string} cmd Command to execute;
 * @property {Array<string>} [params=[]] Command's parameters.
 * @property {string} [cwd=process.cwd()] CWD for tee command
 * @property {Record<string, string>} [env={}] Additional environment variables to pass to the command.
 * @property {CmdTestCallback} callback
 */

/**
 * @param {CmdTestOptions} options
 * @returns {() => Promise}
 */
function createCmdTest( {
	cmd,
	callback,
	params = [],
	env = {},
	cwd = processCWD()
} = {} ) {
	return async ( t ) => {
		let result;

		try {
			result = await execa( cmd, params, {
				cwd,
				env
			} );
		} catch ( error ) {
			result = error;
		}

		return callback( t, result );
	};
}

export default createCmdTest;
