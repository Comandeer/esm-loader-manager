import { resolve as resolvePath } from 'pathe';
import test from 'ava';
import mockFS from 'mock-fs';
import fixtureDirPath from '../__helpers__/fixtureDirPath.js';
import resolveConfigFile from '../../src/utilities/resolveConfigFile.js';

const configFileName = 'esmlm.config.js';
const configModuleFileName = 'esmlm.config.mjs';
const simpleLoaderDirPath = resolvePath( fixtureDirPath, 'simpleLoader' );
const nestedLoaderDirPath = resolvePath( fixtureDirPath, 'nested' );
const nestedLoaderLevel1DirPath = resolvePath( nestedLoaderDirPath, 'level1' );
const nestedLoaderLevel2DirPath = resolvePath( nestedLoaderLevel1DirPath, 'level2' );
const nestedLoaderLevel3DirPath = resolvePath( nestedLoaderLevel2DirPath, 'level3' );
const moduleConfigFileDirPath = resolvePath( fixtureDirPath, 'moduleConfigFile' );
const multipleConfigFilesDirPath = resolvePath( fixtureDirPath, 'multipleConfigFiles' );
const projectWithoutLoaderFileDirPath = resolvePath( fixtureDirPath, 'projectWithoutLoaderFile' );

test.before( () => {
	mockFS( {
		[ fixtureDirPath ]: mockFS.load( fixtureDirPath )
	} );
} );

test.after( () => {
	mockFS.restore();
} );

test( 'resolveConfigFile() points to the nearest esmlm.config.js file (same dir)', async ( t ) => {
	const expectedConfigFilePath = resolvePath( simpleLoaderDirPath, configFileName );
	const resolvedConfigFilePath = await resolveConfigFile( simpleLoaderDirPath, simpleLoaderDirPath );

	t.is( resolvedConfigFilePath, expectedConfigFilePath );
} );

test( 'resolveConfigFile() points to the nearest esmlm.config.js file (nested dir)', async ( t ) => {
	const expectedConfigFilePath = resolvePath( nestedLoaderDirPath, configFileName );
	const resolvedConfigFilePath = await resolveConfigFile( nestedLoaderLevel1DirPath, nestedLoaderDirPath );

	t.is( resolvedConfigFilePath, expectedConfigFilePath );
} );

test( 'resolveConfigFile() points to the nearest esmlm.config.js file (deeply nested dir)', async ( t ) => {
	const expectedConfigFilePath = resolvePath( nestedLoaderLevel2DirPath, configFileName );
	const resolvedConfigFilePath = await resolveConfigFile( nestedLoaderLevel3DirPath, nestedLoaderDirPath );

	t.is( resolvedConfigFilePath, expectedConfigFilePath );
} );

test( 'resolveConfigFile() points to the nearest esmlm.config.mjs file', async ( t ) => {
	const expectedConfigFilePath = resolvePath( moduleConfigFileDirPath, configModuleFileName );
	const resolvedConfigFilePath = await resolveConfigFile( moduleConfigFileDirPath, moduleConfigFileDirPath );

	t.is( resolvedConfigFilePath, expectedConfigFilePath );
} );

test( 'resolveConfigFile() prefers esmlm.config.js over esmlm.config.mjs', async ( t ) => {
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

// #17
test( 'resolveConfigFile() returns null in case of any error', async ( t ) => {
	const expectedConfigFilePath = null;
	const nonExistentDirPath = '/hublabubla/';
	const resolvedConfigFilePath = await resolveConfigFile( nonExistentDirPath, nonExistentDirPath );

	t.is( resolvedConfigFilePath, expectedConfigFilePath );
} );
