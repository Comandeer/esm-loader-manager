import { dirname } from 'path';
import { resolve as resolvePath } from 'path';
import { fileURLToPath } from 'url';
import test from 'ava';
import createEsmlmTest from './__helpers__/createEsmlmTest.js';

const __dirname = dirname( fileURLToPath( import.meta.url ) );
const fixtureDirPath = resolvePath( __dirname, '__fixtures__' );
const esmlmFixturePath = resolvePath( fixtureDirPath, 'esmlm' );

test( 'esmlm correctly launches Node.js module without any parameters and with set CWD', createEsmlmTest( {
	fixturePath: esmlmFixturePath,
	callback( t, { stdout } ) {
		t.is( stdout, 'true' );
	}
} ) );
