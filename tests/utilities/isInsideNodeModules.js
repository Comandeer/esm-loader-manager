import { pathToFileURL } from 'node:url';
import test from 'ava';
import createAbsolutePath from '../__helpers__/createAbsolutePath.js';
import isInsideNodeModules from '../../src/utilities/isInsideNodeModules.js';

test( 'isInsideNodeModules() returns true for a path that is inside the node_modules directory', ( t ) => {
	const path = createAbsolutePath( '/whatever/node_modules/test.mjs' );
	const result = isInsideNodeModules( path );

	t.true( result );
} );

test( 'isInsideNodeModules() returns true for a URL that is inside the node_modules directory', ( t ) => {
	const path = createAbsolutePath( '/whatever/node_modules/test.mjs' );
	const url = pathToFileURL( path ).href;
	const result = isInsideNodeModules( url );

	t.true( result );
} );

test( 'isInsideNodeModules() returns false for a path that is not inside the node_modules directory', ( t ) => {
	const path = createAbsolutePath( '/whatever/test.mjs' );
	const result = isInsideNodeModules( path );

	t.false( result );
} );

test( 'isInsideNodeModules() returns false for a URL that is not inside the node_modules directory', ( t ) => {
	const path = createAbsolutePath( '/whatever/test.mjs' );
	const url = pathToFileURL( path ).href;
	const result = isInsideNodeModules( url );

	t.false( result );
} );
