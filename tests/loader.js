import { dirname } from 'path';
import { resolve as resolvePath } from 'path';
import { fileURLToPath } from 'url';
import test from 'ava';
import createLoaderTest from './__helpers__/createLoaderTest.js';

const __dirname = dirname( fileURLToPath( import.meta.url ) );
const fixtureDirPath = resolvePath( __dirname, '__fixtures__' );
const simpleLoaderFixturePath = resolvePath( fixtureDirPath, 'simpleLoader' );
const withoutLoaderFileFixturePath = resolvePath( fixtureDirPath, 'projectWithoutLoaderFile' );
const multipleConfigFilesFixturePath = resolvePath( fixtureDirPath, 'multipleConfigFiles' );

test( 'loader raises an error if loaders\' definitions are not found', createLoaderTest( {
	fixturePath: withoutLoaderFileFixturePath,
	callback( t, { stderr } ) {
		const errorRegex = /ESMLM:.*?The file with loaders' definition was not found./;

		t.regex( stderr, errorRegex );
	}
} ) );

test( 'loader correctly uses user-provided loader', createLoaderTest( {
	fixturePath: simpleLoaderFixturePath,
	callback( t, { stdout } ) {
		t.is( stdout, 'hublabubla' );
	}
} ) );

test( 'path to the file can be passed as environment variable (relative one)', createLoaderTest( {
	fixturePath: multipleConfigFilesFixturePath,
	env: {
		ESMLM_CONFIG: './customConfig.mjs'
	},
	callback( t, { stdout } ) {
		t.is( stdout, 'true' );
	}
} ) );

test( 'path to the file can be passed as environment variable (absolute one)', createLoaderTest( {
	fixturePath: multipleConfigFilesFixturePath,
	env: {
		ESMLM_CONFIG: resolvePath( multipleConfigFilesFixturePath, 'customConfig.mjs' )
	},
	callback( t, { stdout } ) {
		t.is( stdout, 'true' );
	}
} ) );
