import test from 'ava';

test( 'package exports correct exports', async ( t ) => {
	const expectedImports = [
		'load',
		'resolve'
	];

	const pkg = await import( '../src/index.js' );
	const actualImports = Object.keys( pkg );

	t.deepEqual( actualImports, expectedImports );
} );
