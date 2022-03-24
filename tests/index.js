import test from 'ava';
import LoaderManager from '../src/LoaderManager.js';

test( 'package exports correct export', async ( t ) => {
	const expectedImports = [
		'default'
	];

	// Emulate the actual loader.
	globalThis.__ESMLM__ = [];

	const pkg = await import( '../src/index.js' );
	const actualImports = Object.keys( pkg );

	t.deepEqual( actualImports, expectedImports );
	t.true( pkg.default instanceof LoaderManager );
} );
