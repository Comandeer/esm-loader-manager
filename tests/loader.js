import { dirname } from 'path';
import { resolve as resolvePath } from 'path';
import { fileURLToPath } from 'url';
import test from 'ava';
import createCmdTest from './__helpers__/createCmdTest.js';

const __dirname = dirname( fileURLToPath( import.meta.url ) );
const fixtureDirPath = resolvePath( __dirname, '__fixtures__' );
const simpleLoaderFixturePath = resolvePath( fixtureDirPath, 'simpleLoader' );

test( 'loader manager raises an error if the loader was not loaded properly', createCmdTest( {
	cmd: 'node',
	params: [
		simpleLoaderFixturePath
	],
	callback( t, { exitCode, stderr } ) {
		const loaderManagerErrorRegex = /TypeError: Provide a valid collection of loaders/;

		t.is( exitCode, 1 );
		t.regex( stderr, loaderManagerErrorRegex );
	}
} ) );
