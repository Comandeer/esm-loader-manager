import { dirname } from 'path';
import { resolve as resolvePath } from 'path';
import { fileURLToPath } from 'url';
import test from 'ava';
import createLoaderTest from './__helpers__/createLoaderTest.js';

const __dirname = dirname( fileURLToPath( import.meta.url ) );
const fixtureDirPath = resolvePath( __dirname, '__fixtures__' );
const simpleLoaderFixturePath = resolvePath( fixtureDirPath, 'simpleLoader' );
const withoutLoaderFileFixturePath = resolvePath( fixtureDirPath, 'projectWithoutLoaderFile' );
const customConfigFileFixturePath = resolvePath( fixtureDirPath, 'customConfigFile' );
const moduleConfigFileFixturePath = resolvePath( fixtureDirPath, 'moduleConfigFile' );
const nestedLoaderFixturePath = resolvePath( fixtureDirPath, 'nested' );
const nestedLoaderLevel1DirPath = resolvePath( nestedLoaderFixturePath, 'level1' );
const nestedLoaderLevel2DirPath = resolvePath( nestedLoaderLevel1DirPath, 'level2' );
const nestedLoaderLevel3DirPath = resolvePath( nestedLoaderLevel2DirPath, 'level3' );
const outsideProjectRootFixturePath = resolvePath( fixtureDirPath, 'outsideProjectRoot' );
const nestedProjectRootDirPath = resolvePath( outsideProjectRootFixturePath, 'projectRoot' );
const resolvingURLsFixturePath = resolvePath( fixtureDirPath, 'resolvingURLs' );

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

test( 'path to the config file can be passed as environment variable (relative one)', createLoaderTest( {
	fixturePath: customConfigFileFixturePath,
	env: {
		ESMLM_CONFIG: './customConfig.mjs'
	},
	callback( t, { stdout } ) {
		t.is( stdout, 'true' );
	}
} ) );

test( 'path to the config file can be passed as environment variable (absolute one)', createLoaderTest( {
	fixturePath: customConfigFileFixturePath,
	env: {
		ESMLM_CONFIG: resolvePath( customConfigFileFixturePath, 'customConfig.mjs' )
	},
	callback( t, { stdout } ) {
		t.is( stdout, 'true' );
	}
} ) );

test( 'module config file works correctly', createLoaderTest( {
	fixturePath: moduleConfigFileFixturePath,
	callback( t, { stdout } ) {
		t.is( stdout, 'true' );
	}
} ) );

test( 'nested module uses correct config file', createLoaderTest( {
	fixturePath: nestedLoaderLevel1DirPath,
	entryPoint: 'someNestedModule.js',
	callback( t, { stdout } ) {
		t.is( stdout, 'true' );
	}
} ) );

test( 'deeply nested module uses correct config file', createLoaderTest( {
	fixturePath: nestedLoaderLevel3DirPath,
	entryPoint: 'superDeeplyNested.js',
	callback( t, { stdout } ) {
		t.is( stdout, 'nested' );
	}
} ) );

test( 'loader ignores modules loaded from the outside of project root', createLoaderTest( {
	fixturePath: nestedProjectRootDirPath,
	callback( t, { stdout } ) {
		t.is( stdout, 'false' );
	}
} ) );

test( 'both resolver and loader are matched against module URL', createLoaderTest( {
	fixturePath: resolvingURLsFixturePath,
	callback( t, { stdout } ) {
		t.is( stdout, 'true' );
	}
} ) );
