import test from 'ava';
import LoaderManager from '../src/LoaderManager.js';

test( 'package exports correct export', async ( t ) => {
	const expectedImports = [
		'default'
	];

	const pkg = await import( '../src/index.js' );
	const actualImports = Object.keys( pkg );

	t.deepEqual( actualImports, expectedImports );
	t.true( pkg.default instanceof LoaderManager );
} );
