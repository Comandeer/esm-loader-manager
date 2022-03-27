import { dirname } from 'path';
import { resolve as resolvePath } from 'path';
import { fileURLToPath } from 'url';
import test from 'ava';
import createLoaderTest from './__helpers__/createLoaderTest.js';

const __dirname = dirname( fileURLToPath( import.meta.url ) );
const fixtureDirPath = resolvePath( __dirname, '__fixtures__' );
const simpleLoaderFixturePath = resolvePath( fixtureDirPath, 'simpleLoader' );

test( 'loader correctly uses user-provided loader', createLoaderTest( {
	fixturePath: simpleLoaderFixturePath,
	callback( t, { stdout } ) {
		t.is( stdout, '"hublabubla"' );
	}
} ) );
