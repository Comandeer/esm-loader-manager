import { dirname } from 'path';
import { resolve as resolvePath } from 'path';
import { fileURLToPath } from 'url';
import test from 'ava';
import createEsmlmTest from './__helpers__/createEsmlmTest.js';

const __dirname = dirname( fileURLToPath( import.meta.url ) );
const fixtureDirPath = resolvePath( __dirname, '__fixtures__' );
const esmlmFixturePath = resolvePath( fixtureDirPath, 'esmlm' );
const entryPointPath = resolvePath( esmlmFixturePath, 'index.js' );
const successfulExitCode = 0;

test( 'esmlm correctly launches Node.js module without any parameters', createEsmlmTest( {
	cwd: esmlmFixturePath,
	callback( t, { stdout, exitCode } ) {
		t.is( stdout, 'true' );
		t.is( exitCode, successfulExitCode );
	}
} ) );

test( 'esmlm correctly launches Node.js module with the absolute path as the parameter', createEsmlmTest( {
	cwd: esmlmFixturePath,
	entryPoint: entryPointPath,
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
