import { cwd as processCWD } from 'node:process';
// eslint-disable-next-line ava/use-test
import { ExecutionContext } from 'ava';
import { ExecaReturnValue, execa } from 'execa';

type CmdTestCallback = ( t: ExecutionContext, results: ExecaReturnValue ) => void | Promise<void>;

interface CmdTestOptions {
	cmd: string;
	params?: Array<string>;
	cwd?: string;
	env?: Record<string, string>;
	callback: CmdTestCallback;
}

/**
 * @typedef {Object} CmdTestOptions
 * @property {string} cmd Command to execute;
 * @property {Array<string>} [params=[]] Command's parameters.
 * @property {string} [cwd=process.cwd()] CWD for tee command
 * @property {Record<string, string>} [env={}] Additional environment variables to pass to the command.
 * @property {CmdTestCallback} callback
 */
async function testCmd( t: ExecutionContext, {
	cmd,
	callback,
	params = [],
	env = {},
	cwd = processCWD()
}: CmdTestOptions ): Promise<void> {
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
}

export default testCmd;
