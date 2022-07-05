import { dirname } from 'node:path';
import { resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'ava';
import createEsmlmTest from './__helpers__/createEsmlmTest.js';

const __dirname = dirname( fileURLToPath( import.meta.url ) );
const fixtureDirPath = resolvePath( __dirname, '__fixtures__' );
const esmlmFixturePath = resolvePath( fixtureDirPath, 'esmlm' );
const esmlmFixtureEntryPointPath = resolvePath( esmlmFixturePath, 'index.js' );
const esmlmArgsFixturePath = resolvePath( fixtureDirPath, 'esmlmArgs' );
const esmlmArgsFixtureEntryPointPath = resolvePath( esmlmArgsFixturePath, 'index.js' );
const successfulExitCode = 0;
const sampleArgs = [
	'some-path',
	'--some-arg'
];

test( 'esmlm correctly launches Node.js module without any parameters', createEsmlmTest( {
	cwd: esmlmFixturePath,
	callback( t, { stdout, exitCode } ) {
		t.is( stdout, 'true' );
		t.is( exitCode, successfulExitCode );
	}
} ) );

test( 'esmlm correctly launches Node.js module with the absolute path as the parameter', createEsmlmTest( {
	cwd: esmlmFixturePath,
	entryPoint: esmlmFixtureEntryPointPath,
	callback( t, { stdout, exitCode } ) {
		t.is( stdout, 'true' );
		t.is( exitCode, successfulExitCode );
	}
} ) );

test( 'esmlm correctly launches Node.js module with the relative path as the parameter', createEsmlmTest( {
	cwd: esmlmFixturePath,
	entryPoint: 'index.js',
	callback( t, { stdout, exitCode } ) {
		t.is( stdout, 'true' );
		t.is( exitCode, successfulExitCode );
	}
} ) );

test( 'esmlm correctly launches Node.js module with the "." as the parameter', createEsmlmTest( {
	cwd: esmlmFixturePath,
	entryPoint: '.',
	callback( t, { stdout, exitCode } ) {
		t.is( stdout, 'true' );
		t.is( exitCode, successfulExitCode );
	}
} ) );

test( 'esmlm throws error when incorrect relative path is passed as the parameter', createEsmlmTest( {
	cwd: esmlmFixturePath,
	entryPoint: './non-existent.js',
	callback( t, { stderr, exitCode } ) {
		const moduleNotFoundError = /[ERR_MODULE_NOT_FOUND]/;

		t.regex( stderr, moduleNotFoundError );
		t.not( exitCode, 0 );
	}
} ) );

// #2
test.only( 'esmlm correctly passes arguments to the underlying program', createEsmlmTest( {
	cwd: esmlmArgsFixturePath,
	entryPoint: esmlmArgsFixtureEntryPointPath,
	args: sampleArgs,
	callback( t, { stdout, exitCode } ) {
		t.is( stdout, sampleArgs.join( ' ' ) );
		t.is( exitCode, successfulExitCode );
	}
} ) );
