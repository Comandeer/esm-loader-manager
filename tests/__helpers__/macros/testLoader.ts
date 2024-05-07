import { dirname } from 'pathe';
import { resolve as resolvePath } from 'pathe';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test, { ExecutionContext } from 'ava';
import testCmd from '../testCmd.js';
import { ExecaReturnValue } from 'execa';

const __dirname = dirname( fileURLToPath( import.meta.url ) );

type TestLoaderCallback = ( t: ExecutionContext, results: ExecaReturnValue ) => void | Promise<void>;

interface TestLoaderOptions {
	fixturePath: string;
	entryPoint?: string;
	env?: Record<string, string>;
	callback: TestLoaderCallback;
}

const testLoader = test.macro( ( t: ExecutionContext, {
	fixturePath,
	entryPoint = fixturePath,
	env = {},
	callback: userCallback
}: TestLoaderOptions ): Promise<void> => {
	const registerPath = resolvePath( __dirname, '..', '..', '..', 'dist', 'register.mjs' );
	const registerURL = pathToFileURL( registerPath );
	const cmd = 'tsx';
	const params = [
		'--import',
		registerURL.href,
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
