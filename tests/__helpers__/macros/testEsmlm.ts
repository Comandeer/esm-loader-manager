import { dirname } from 'pathe';
import { resolve as resolvePath } from 'pathe';
import { fileURLToPath } from 'node:url';
import test, { ExecutionContext } from 'ava';
import testCmd from '../testCmd.js';
import { ExecaReturnValue } from 'execa';

const __dirname = dirname( fileURLToPath( import.meta.url ) );

type TestEsmlmCallback = ( t: ExecutionContext, results: ExecaReturnValue ) => void | Promise<void>;

interface TestEsmlmOptions {
	cwd: string;
	entryPoint?: string;
	args?: Array<string>;
	env?: Record<string, string>;
	callback: TestEsmlmCallback;
}

const testEsmlm = test.macro( ( t: ExecutionContext, {
	cwd,
	entryPoint,
	args = [],
	env = {},
	callback: userCallback
}: TestEsmlmOptions ) => {
	const esmlmPath = resolvePath( __dirname, '..', '..', '..', 'bin', 'esmlm.js' );
	const cmd = esmlmPath;
	const params = entryPoint !== undefined ? [
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
