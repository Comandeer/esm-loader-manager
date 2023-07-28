import { join as joinPath } from 'pathe';
import { pathToFileURL } from 'node:url';
import test from 'ava';
import createAbsolutePath from '../__helpers__/createAbsolutePath.js';
import isInsideDir from '../../src/utilities/isInsideDir.js';

test( 'isInsideDir() returns true for a file inside the provided root path', ( t ) => {
	const rootPath = createAbsolutePath( '/some/dummy/path' );
	const modulePath = joinPath( rootPath, 'index.js' );
	const result = isInsideDir( rootPath, modulePath );

	t.true( result );
} );

test( 'isInsideDir() returns true for a file inside the deeply nested subdirectory inside the root path', ( t ) => {
	const rootPath = createAbsolutePath( '/some/dummy/path' );
	const modulePath = joinPath( rootPath, 'with', 'deeply', 'nested', 'sub', 'directory', 'index.js' );
	const result = isInsideDir( rootPath, modulePath );

	t.true( result );
} );

test( 'isInsideDir() returns false for a file inside the directory that is outside the root path', ( t ) => {
	const rootPath = createAbsolutePath( '/some/dummy/path' );
	const modulePath = createAbsolutePath( '/totally/different/dir/index.js' );
	const result = isInsideDir( rootPath, modulePath );

	t.false( result );
} );

test( 'isInsideDir() returns false for a file inside the directory that is a sibling to the root path', ( t ) => {
	const commonRoot = createAbsolutePath( '/some' );
	const rootPath = joinPath( commonRoot, 'dummy' );
	const modulePath = joinPath( commonRoot, 'index.js' );
	const result = isInsideDir( rootPath, modulePath );

	t.false( result );
} );

test( 'isInsideDir() returns true for a file URL inside the provided root path', ( t ) => {
	const rootPath = createAbsolutePath( '/some/dummy/path' );
	const modulePath = joinPath( rootPath, 'index.js' );
	const moduleURL = pathToFileURL( modulePath ).href;
	const result = isInsideDir( rootPath, moduleURL );

	t.true( result );
} );

test( 'isInsideDir() returns true for a file URL inside the deeply nested subdirectory inside the root path', ( t ) => {
	const rootPath = createAbsolutePath( '/some/dummy/path' );
	const modulePath = joinPath( rootPath, 'with', 'deeply', 'nested', 'sub', 'directory', 'index.js' );
	const moduleURL = pathToFileURL( modulePath ).href;
	const result = isInsideDir( rootPath, moduleURL );

	t.true( result );
} );

test( 'isInsideDir() returns false for a file URL inside the directory that is outside the root path', ( t ) => {
	const rootPath = createAbsolutePath( '/some/dummy/path' );
	const moduleURL = createAbsolutePath( '/totally/different/dir/index.js' );
	const result = isInsideDir( rootPath, moduleURL );

	t.false( result );
} );

test( 'isInsideDir() returns false for a file URL inside the directory that is a sibling to the root path', ( t ) => {
	const commonRoot = createAbsolutePath( '/some' );
	const rootPath = joinPath( commonRoot, 'dummy' );
	const modulePath = joinPath( commonRoot, 'index.js' );
	const moduleURL = pathToFileURL( modulePath ).href;
	const result = isInsideDir( rootPath, moduleURL );

	t.false( result );
} );
