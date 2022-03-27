import { fileURLToPath } from 'url';
import { pathToFileURL } from 'url';
import { dirname } from 'path';
import { resolve as resolvePath } from 'path';
import test from 'ava';
import { createModuleURL } from '../src/utilities.js';
import { loadURL } from '../src/utilities.js';

const __dirname = dirname( fileURLToPath( import.meta.url ) );
const fixtureDirPath = resolvePath( __dirname, '__fixtures__' );
const dummyPath = resolvePath( fixtureDirPath, 'dummy.txt' );

test( '#createModuleURL() creates URL from the given specifier', ( t ) => {
	const specifier = './test.js';
	const expectedURL = new URL( specifier, import.meta.url ).href;
	const url = createModuleURL( specifier, {
		parentURL: import.meta.url
	} );

	t.deepEqual( url, expectedURL );
} );

test( '#loadURL() loads given file as a buffer', async ( t ) => {
	const fileURL = pathToFileURL( dummyPath );
	const expectedFileContent = Buffer.from( 'hublabubla\n' );
	const fileContent = await loadURL( fileURL );

	t.deepEqual( fileContent, expectedFileContent );
} );
