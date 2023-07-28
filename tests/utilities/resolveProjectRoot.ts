import { resolve as resolvePath } from 'pathe';
import test from 'ava';
import mockFS from 'mock-fs';
import fixtureDirPath from '../__helpers__/fixtureDirPath.js';
import resolveProjectRoot from '../../src/utilities/resolveProjectRoot.js';

const simpleLoaderDirPath = resolvePath( fixtureDirPath, 'simpleLoader' );
const nestedLoaderDirPath = resolvePath( fixtureDirPath, 'nested' );
const nestedLoaderLevel1DirPath = resolvePath( nestedLoaderDirPath, 'level1' );
const nestedLoaderLevel2DirPath = resolvePath( nestedLoaderLevel1DirPath, 'level2' );
const nestedLoaderLevel3DirPath = resolvePath( nestedLoaderLevel2DirPath, 'level3' );
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

// #17
test( 'resolveProjectRoot() returns null in case of any error', async ( t ) => {
	const expectedConfigFilePath = null;
	const nonExistentDirPath = '/hublabubla/';
	const resolvedConfigFilePath = await resolveProjectRoot( nonExistentDirPath );

	t.is( resolvedConfigFilePath, expectedConfigFilePath );
} );
