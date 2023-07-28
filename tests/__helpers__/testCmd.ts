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

async function testCmd( t: ExecutionContext, {
	cmd,
	callback,
	params = [],
	env = {},
	cwd = processCWD()
}: CmdTestOptions ): Promise<void> {
	const result = await execa( cmd, params, {
		cwd,
		env,
		reject: false
	} );

	return callback( t, result );
}

export default testCmd;
