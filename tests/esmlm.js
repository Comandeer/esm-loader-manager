import { dirname } from 'node:path';
import { resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'ava';
import testEsmlm from './__helpers__/macros/testEsmlm.js';

const __dirname = dirname( fileURLToPath( import.meta.url ) );
const fixtureDirPath = resolvePath( __dirname, '__fixtures__' );
const esmlmFixturePath = resolvePath( fixtureDirPath, 'esmlm' );
const esmlmFixtureEntryPointPath = resolvePath( esmlmFixturePath, 'index.js' );
const esmlmArgsFixturePath = resolvePath( fixtureDirPath, 'esmlmArgs' );
const esmlmArgsFixtureEntryPointPath = resolvePath( esmlmArgsFixturePath, 'index.js' );
const esmlmErrorFixturePath = resolvePath( fixtureDirPath, 'esmlmError' );
const successfulExitCode = 0;
const unsuccessfulExitCode = 1;
const sampleArgs = [
	'some-path',
	'--some-arg'
];

test( 'esmlm correctly launches Node.js module without any parameters', testEsmlm, {
	cwd: esmlmFixturePath,
	callback( t, { stdout, exitCode } ) {
		t.is( stdout, 'true' );
		t.is( exitCode, successfulExitCode );
	}
} );

test( 'esmlm correctly launches Node.js module with the absolute path as the parameter', testEsmlm, {
	cwd: esmlmFixturePath,
	entryPoint: esmlmFixtureEntryPointPath,
	callback( t, { stdout, exitCode } ) {
		t.is( stdout, 'true' );
		t.is( exitCode, successfulExitCode );
	}
} );

test( 'esmlm correctly launches Node.js module with the relative path as the parameter', testEsmlm, {
	cwd: esmlmFixturePath,
	entryPoint: 'index.js',
	callback( t, { stdout, exitCode } ) {
		t.is( stdout, 'true' );
		t.is( exitCode, successfulExitCode );
	}
} );

test( 'esmlm correctly launches Node.js module with the "." as the parameter', testEsmlm, {
	cwd: esmlmFixturePath,
	entryPoint: '.',
	callback( t, { stdout, exitCode } ) {
		t.is( stdout, 'true' );
		t.is( exitCode, successfulExitCode );
	}
} );

test( 'esmlm throws error when incorrect relative path is passed as the parameter', testEsmlm, {
	cwd: esmlmFixturePath,
	entryPoint: './non-existent.js',
	callback( t, { stderr, exitCode } ) {
		const moduleNotFoundError = /[ERR_MODULE_NOT_FOUND]/;

		t.regex( stderr, moduleNotFoundError );
		t.not( exitCode, 0 );
	}
} );

// #2
test( 'esmlm correctly passes arguments to the underlying program', testEsmlm, {
	cwd: esmlmArgsFixturePath,
	entryPoint: esmlmArgsFixtureEntryPointPath,
	args: sampleArgs,
	callback( t, { stdout, exitCode } ) {
		t.is( stdout, sampleArgs.join( ' ' ) );
		t.is( exitCode, successfulExitCode );
	}
} );

// #1
test( 'esmlm does not duplicate error messages', testEsmlm, {
	cwd: esmlmErrorFixturePath,
	callback( t, { stderr, exitCode } ) {
		const moduleNotFoundError = /Error: Command failed with exit code 1/;

		t.notRegex( stderr, moduleNotFoundError );
		t.is( exitCode, unsuccessfulExitCode );
	}
} );
