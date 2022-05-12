import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';
import { dirname } from 'node:path';
import { resolve as resolvePath } from 'node:path';
import test from 'ava';
import mockFS from 'mock-fs';
import { isBuiltInModule } from '../src/utilities.js';
import { isInsideDir } from '../src/utilities.js';
import { isInsideNodeModules } from '../src/utilities.js';
import { resolveConfigFile } from '../src/utilities.js';
import { loadURL } from '../src/utilities.js';
import { resolveProjectRoot } from '../src/utilities.js';

const __dirname = dirname( fileURLToPath( import.meta.url ) );
const fixtureDirPath = resolvePath( __dirname, '__fixtures__' );
const configFileName = '.esmlmrc.js';
const configModuleFileName = '.esmlmrc.mjs';
const dummyPath = resolvePath( fixtureDirPath, 'dummy.txt' );
const simpleLoaderDirPath = resolvePath( fixtureDirPath, 'simpleLoader' );
const nestedLoaderDirPath = resolvePath( fixtureDirPath, 'nested' );
const nestedLoaderLevel1DirPath = resolvePath( nestedLoaderDirPath, 'level1' );
const nestedLoaderLevel2DirPath = resolvePath( nestedLoaderLevel1DirPath, 'level2' );
const nestedLoaderLevel3DirPath = resolvePath( nestedLoaderLevel2DirPath, 'level3' );
const moduleConfigFileDirPath = resolvePath( fixtureDirPath, 'moduleConfigFile' );
const multipleConfigFilesDirPath = resolvePath( fixtureDirPath, 'multipleConfigFiles' );
const projectWithoutLoaderFileDirPath = resolvePath( fixtureDirPath, 'projectWithoutLoaderFile' );
const emptyDirPath = '/testDir/with/nested';

test.before( () => {
	mockFS( {
		[ fixtureDirPath ]: mockFS.load( fixtureDirPath ),
		[ emptyDirPath ]: {}
	} );
} );

test.after( () => {
	mockFS.restore();
} );

test( 'loadURL() loads given file as a buffer', async ( t ) => {
	const fileURL = pathToFileURL( dummyPath );
	const expectedFileContent = Buffer.from( 'hublabubla\n' );
	const fileContent = await loadURL( fileURL );

	t.deepEqual( fileContent, expectedFileContent );
} );

test( 'resolveProjectRoot() points to the directory with the nearest package.json file (same dir)', async ( t ) => {
	const resolvedProjectRoot = await resolveProjectRoot( simpleLoaderDirPath );

	t.is( resolvedProjectRoot, simpleLoaderDirPath );
} );

test( 'resolveProjectRoot() points to the directory with the nearest package.json file (deeply nested dir)', async ( t ) => {
	const resolvedProjectRoot = await resolveProjectRoot( nestedLoaderLevel3DirPath );

	t.is( resolvedProjectRoot, nestedLoaderDirPath );
} );

test( 'resolveProjectRoot() returns null if reaches / without finding package.json file', async ( t ) => {
	const resolvedProjectRoot = await resolveProjectRoot( emptyDirPath );

	t.is( resolvedProjectRoot, null );
} );

test( 'resolveConfigFile() points to the nearest .esmlmrc.js file (same dir)', async ( t ) => {
	const expectedConfigFilePath = resolvePath( simpleLoaderDirPath, configFileName );
	const resolvedConfigFilePath = await resolveConfigFile( simpleLoaderDirPath, simpleLoaderDirPath );

	t.is( resolvedConfigFilePath, expectedConfigFilePath );
} );

test( 'resolveConfigFile() points to the nearest .esmlmrc.js file (nested dir)', async ( t ) => {
	const expectedConfigFilePath = resolvePath( nestedLoaderDirPath, configFileName );
	const resolvedConfigFilePath = await resolveConfigFile( nestedLoaderLevel1DirPath, nestedLoaderDirPath );

	t.is( resolvedConfigFilePath, expectedConfigFilePath );
} );

test( 'resolveConfigFile() points to the nearest .esmlmrc.js file (deeply nested dir)', async ( t ) => {
	const expectedConfigFilePath = resolvePath( nestedLoaderLevel2DirPath, configFileName );
	const resolvedConfigFilePath = await resolveConfigFile( nestedLoaderLevel3DirPath, nestedLoaderDirPath );

	t.is( resolvedConfigFilePath, expectedConfigFilePath );
} );

test( 'resolveConfigFile() points to the nearest .esmlmrc.mjs file', async ( t ) => {
	const expectedConfigFilePath = resolvePath( moduleConfigFileDirPath, configModuleFileName );
	const resolvedConfigFilePath = await resolveConfigFile( moduleConfigFileDirPath, moduleConfigFileDirPath );

	t.is( resolvedConfigFilePath, expectedConfigFilePath );
} );

test( 'resolveConfigFile() prefers .esmlmrc.js over .esmlmrc.mjs', async ( t ) => {
	const expectedConfigFilePath = resolvePath( multipleConfigFilesDirPath, configFileName );
	const resolvedConfigFilePath = await resolveConfigFile( multipleConfigFilesDirPath, multipleConfigFilesDirPath );

	t.is( resolvedConfigFilePath, expectedConfigFilePath );
} );

test( 'resolveConfigFile() returns null if the config file is not found in the project', async ( t ) => {
	const expectedConfigFilePath = null;
	const resolvedConfigFilePath = await resolveConfigFile( projectWithoutLoaderFileDirPath,
		projectWithoutLoaderFileDirPath );

	t.is( resolvedConfigFilePath, expectedConfigFilePath );
} );

test( 'isInsideDir() returns true for a file inside the provided root path', ( t ) => {
	const rootPath = '/some/dummy/path';
	const modulePath = `${ rootPath }/index.js`;
	const result = isInsideDir( rootPath, modulePath );

	t.true( result );
} );

test( 'isInsideDir() returns true for a file inside the deeply nested subdirectory inside the root path', ( t ) => {
	const rootPath = '/some/dummy/path';
	const modulePath = `${ rootPath }/with/deeply/nested/sub/directory/index.js`;
	const result = isInsideDir( rootPath, modulePath );

	t.true( result );
} );

test( 'isInsideDir() returns false for a file inside the directory that is outside the root path', ( t ) => {
	const rootPath = '/some/dummy/path';
	const modulePath = '/totally/different/dir/index.js';
	const result = isInsideDir( rootPath, modulePath );

	t.false( result );
} );

test( 'isInsideDir() returns false for a file inside the directory that is a sibling to the root path', ( t ) => {
	const commonRoot = '/some';
	const rootPath = `${ commonRoot }/dummy`;
	const modulePath = `${ commonRoot }/index.js`;
	const result = isInsideDir( rootPath, modulePath );

	t.false( result );
} );

test( 'isInsideDir() returns true for a file URL inside the provided root path', ( t ) => {
	const rootPath = '/some/dummy/path';
	const moduleURL = `file://${ rootPath }/index.js`;
	const result = isInsideDir( rootPath, moduleURL );

	t.true( result );
} );

test( 'isInsideDir() returns true for a file URL inside the deeply nested subdirectory inside the root path', ( t ) => {
	const rootPath = '/some/dummy/path';
	const moduleURL = `file://${ rootPath }/with/deeply/nested/sub/directory/index.js`;
	const result = isInsideDir( rootPath, moduleURL );

	t.true( result );
} );

test( 'isInsideDir() returns false for a file URL inside the directory that is outside the root path', ( t ) => {
	const rootPath = '/some/dummy/path';
	const moduleURL = '/totally/different/dir/index.js';
	const result = isInsideDir( rootPath, moduleURL );

	t.false( result );
} );

test( 'isInsideDir() returns false for a file URL inside the directory that is a sibling to the root path', ( t ) => {
	const commonRoot = '/some';
	const rootPath = `${ commonRoot }/dummy`;
	const modulePath = `file://${ commonRoot }/index.js`;
	const result = isInsideDir( rootPath, modulePath );

	t.false( result );
} );

test( 'isInsideNodeModules() returns true for a path that is inside the node_modules directory', ( t ) => {
	const path = '/whatever/node_modules/test.mjs';
	const result = isInsideNodeModules( path );

	t.true( result );
} );

test( 'isInsideNodeModules() returns true for a URL that is inside the node_modules directory', ( t ) => {
	const url = 'file:///whatever/node_modules/test.mjs';
	const result = isInsideNodeModules( url );

	t.true( result );
} );

test( 'isInsideNodeModules() returns false for a path that is not inside the node_modules directory', ( t ) => {
	const path = '/whatever/test.mjs';
	const result = isInsideNodeModules( path );

	t.false( result );
} );

test( 'isInsideNodeModules() returns false for a URL that is not inside the node_modules directory', ( t ) => {
	const url = 'file:///whatever/test.mjs';
	const result = isInsideNodeModules( url );

	t.false( result );
} );

test( 'isBuiltInModule() returns true for the module with format set to builtin', ( t ) => {
	const moduleInfo = {
		url: 'whatever',
		format: 'builtin'
	};
	const result = isBuiltInModule( moduleInfo );

	t.true( result );
} );

test( 'isBuiltInModule() returns true for the module without format but with URL starting from node:', ( t ) => {
	const moduleInfo = {
		url: 'node:whatever'
	};
	const result = isBuiltInModule( moduleInfo );

	t.true( result );
} );

test( 'isBuiltInModule() returns true for the module with format set to builtin and with URL starting from node:', ( t ) => {
	const moduleInfo = {
		url: 'node:whatever',
		format: 'builtin'
	};
	const result = isBuiltInModule( moduleInfo );

	t.true( result );
} );

test( 'isBuiltInModule() returns false for the module with format set to module', ( t ) => {
	const moduleInfo = {
		url: 'whatever',
		format: 'module'
	};
	const result = isBuiltInModule( moduleInfo );

	t.false( result );
} );

test( 'isBuiltInModule() returns false for the module with format set to module and with URL starting from node:', ( t ) => {
	const moduleInfo = {
		url: 'node:whatever',
		format: 'module'
	};
	const result = isBuiltInModule( moduleInfo );

	t.false( result );
} );
