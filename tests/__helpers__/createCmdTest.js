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
	cwd = process.cwd()
} = {} ) {
	return async ( t ) => {
		let result;

		try {
			result = await execa( cmd, params, {
				cwd
			} );
		} catch ( error ) {
			result = error;
		}

		return callback( t, result );
	};
}

export default createCmdTest;
