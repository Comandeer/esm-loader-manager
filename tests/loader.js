import { cp } from 'node:fs/promises';
import { mkdtemp } from 'node:fs/promises';
import { rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname } from 'pathe';
import { join as joinPath } from 'pathe';
import { resolve as resolvePath } from 'pathe';
import { fileURLToPath } from 'node:url';
import test from 'ava';
import testLoader from './__helpers__/macros/testLoader.js';

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
const loaderArgsFixturePath = resolvePath( fixtureDirPath, 'loaderArgs' );
const npmImportsFixturePath = resolvePath( fixtureDirPath, 'npmImports' );
const builinModulesFixturePath = resolvePath( fixtureDirPath, 'builtinModules' );
const multipleLoadersFixturePath = resolvePath( fixtureDirPath, 'multipleLoaders' );
let tempDirPath;
let noProjectRootFixturePath;

test.before( async () => {
	const tempDirPrefix = joinPath( tmpdir(), 'esmlm' );
	tempDirPath = await mkdtemp( tempDirPrefix );
	const noProjectRootFixtureTemplatePath = resolvePath( fixtureDirPath, 'noProjectRoot' );
	const noProjectRootDirPath = resolvePath( tempDirPath, 'noProjectRoot', 'cwd' );

	await cp( noProjectRootFixtureTemplatePath, noProjectRootDirPath, {
		recursive: true
	} );

	noProjectRootFixturePath = resolvePath( noProjectRootDirPath, 'cwd' );
} );

test.after.always( async () => {
	await rm( tempDirPath, {
		recursive: true,
		force: true
	} );
} );

test( 'loader raises an error if loaders\' definitions are not found', testLoader, {
	fixturePath: withoutLoaderFileFixturePath,
	callback( t, { stderr } ) {
		const errorRegex = /ESMLM:.*?The file with loaders' definition was not found./;

		t.regex( stderr, errorRegex );
	}
} );

test( 'loader correctly uses user-provided loader', testLoader, {
	fixturePath: simpleLoaderFixturePath,
	callback( t, { stdout } ) {
		t.is( stdout, 'hublabubla' );
	}
} );

test( 'path to the config file can be passed as environment variable (relative one)', testLoader, {
	fixturePath: customConfigFileFixturePath,
	env: {
		ESMLM_CONFIG: './customConfig.mjs'
	},
	callback( t, { stdout } ) {
		t.is( stdout, 'true' );
	}
} );

test( 'path to the config file can be passed as environment variable (absolute one)', testLoader, {
	fixturePath: customConfigFileFixturePath,
	env: {
		ESMLM_CONFIG: resolvePath( customConfigFileFixturePath, 'customConfig.mjs' )
	},
	callback( t, { stdout } ) {
		t.is( stdout, 'true' );
	}
} );

test( 'module config file works correctly', testLoader, {
	fixturePath: moduleConfigFileFixturePath,
	callback( t, { stdout } ) {
		t.is( stdout, 'true' );
	}
} );

test( 'nested module uses correct config file', testLoader, {
	fixturePath: nestedLoaderLevel1DirPath,
	entryPoint: 'someNestedModule.js',
	callback( t, { stdout } ) {
		t.is( stdout, 'true' );
	}
} );

test( 'deeply nested module uses correct config file', testLoader, {
	fixturePath: nestedLoaderLevel3DirPath,
	entryPoint: 'superDeeplyNested.js',
	callback( t, { stdout } ) {
		t.is( stdout, 'nested' );
	}
} );

test( 'loader ignores modules loaded from the outside of project root', testLoader, {
	fixturePath: nestedProjectRootDirPath,
	callback( t, { stdout } ) {
		t.is( stdout, 'false' );
	}
} );

test( 'both resolver and loader are matched against module URL', testLoader, {
	fixturePath: resolvingURLsFixturePath,
	callback( t, { stdout } ) {
		t.is( stdout, 'true' );
	}
} );

test( 'loader() receives correct arguments', testLoader, {
	fixturePath: loaderArgsFixturePath,
	callback( t, { stdout } ) {
		t.is( stdout, 'true' );
	}
} );

test( 'loader without a project root restricts itself to CWD', ( t ) => {
	return testLoader.exec( t, {
		fixturePath: noProjectRootFixturePath,
		entryPoint: 'index.mjs',
		callback( t, { stdout, stderr } ) {
			const projectRootNotDetectedError = 'ESMLM: The project root was not detected. Falling back to the CWD.';

			t.is( stdout, 'true\ntrue\nfalse' );
			t.true( stderr.includes( projectRootNotDetectedError ) );
		}
	} );
} );

test( 'modules inside node_modules are ignored', testLoader, {
	fixturePath: npmImportsFixturePath,
	callback( t, { stdout } ) {
		t.is( stdout, 'false\nfalse' );
	}
} );

test( 'built-in modules are ignored', testLoader, {
	fixturePath: builinModulesFixturePath,
	callback( t, { stdout } ) {
		t.not( stdout, 'true\ntrue\ntrue' );
	}
} );

test( 'loaded module is passed through all matched loaders in order', testLoader, {
	fixturePath: multipleLoadersFixturePath,
	callback( t, { stdout } ) {
		t.not( stdout, 'babubla' );
	}
} );
