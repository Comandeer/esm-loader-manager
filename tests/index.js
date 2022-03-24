import test from 'ava';

test( 'package exports correct exports', async ( t ) => {
	const expectedImports = [
		'addLoader',
		'removeLoader'
	];

	// Emulate the actual loader.
	globalThis.__ESMLM__ = [];

	const pkg = await import( '../src/index.js' );
	const actualImports = Object.keys( pkg );

	t.deepEqual( actualImports, expectedImports );
} );
