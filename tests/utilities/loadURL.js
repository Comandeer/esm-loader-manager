import { readFile } from 'node:fs/promises';
import { resolve as resolvePath } from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'ava';
import mockFS from 'mock-fs';
import fixtureDirPath from '../__helpers__/fixtureDirPath.js';
import loadURL from '../../src/utilities/loadURL.js';

const dummyPath = resolvePath( fixtureDirPath, 'dummy.txt' );

test.before( () => {
	mockFS( {
		[ fixtureDirPath ]: mockFS.load( fixtureDirPath )
	} );
} );

test.after( () => {
	mockFS.restore();
} );

test( 'loadURL() loads given file as a buffer', async ( t ) => {
	const fileURL = pathToFileURL( dummyPath );
	const expectedFileContent = await readFile( dummyPath );
	const fileContent = await loadURL( fileURL );

	t.deepEqual( fileContent, expectedFileContent );
} );
