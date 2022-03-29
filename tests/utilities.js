import { fileURLToPath } from 'url';
import { pathToFileURL } from 'url';
import { dirname } from 'path';
import { resolve as resolvePath } from 'path';
import test from 'ava';
import { createModuleURL, resolveConfigFile } from '../src/utilities.js';
import { loadURL } from '../src/utilities.js';
import { resolveProjectRoot } from '../src/utilities.js';

const __dirname = dirname( fileURLToPath( import.meta.url ) );
const fixtureDirPath = resolvePath( __dirname, '__fixtures__' );
const configFileName = '.esmlmrc.js';
const dummyPath = resolvePath( fixtureDirPath, 'dummy.txt' );
const simpleLoaderDirPath = resolvePath( fixtureDirPath, 'simpleLoader' );
const nestedLoaderDirPath = resolvePath( fixtureDirPath, 'nested' );
const nestedLoaderLevel1DirPath = resolvePath( nestedLoaderDirPath, 'level1' );
const nestedLoaderLevel2DirPath = resolvePath( nestedLoaderLevel1DirPath, 'level2' );
const nestedLoaderLevel3DirPath = resolvePath( nestedLoaderLevel2DirPath, 'level3' );

test( 'createModuleURL() creates URL from the given specifier', ( t ) => {
	const specifier = './test.js';
	const expectedURL = new URL( specifier, import.meta.url ).href;
	const url = createModuleURL( specifier, {
		parentURL: import.meta.url
	} );

	t.deepEqual( url, expectedURL );
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

test( 'resolveProjectRoot() points to the directory with the nearest package.json file (nested)', async ( t ) => {
	const resolvedProjectRoot = await resolveProjectRoot( nestedLoaderLevel3DirPath );

	t.is( resolvedProjectRoot, nestedLoaderDirPath );
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
