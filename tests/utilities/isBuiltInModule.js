import test from 'ava';
import isBuiltInModule from '../../src/utilities/isBuiltInModule.js';

test( 'isBuiltInModule() returns true for the module with format set to builtin', ( t ) => {
	const moduleInfo = {
		url: 'whatever',
		format: 'builtin'
	};
	const result = isBuiltInModule( moduleInfo );

	t.true( result );
} );

test( 'isBuiltInModule() returns true for the module without format but with URL starting from node:', ( t ) => {
	const moduleInfo = {
		url: 'node:whatever'
	};
	const result = isBuiltInModule( moduleInfo );

	t.true( result );
} );

test( 'isBuiltInModule() returns true for the module with format set to builtin and with URL starting from node:', ( t ) => {
	const moduleInfo = {
		url: 'node:whatever',
		format: 'builtin'
	};
	const result = isBuiltInModule( moduleInfo );

	t.true( result );
} );

test( 'isBuiltInModule() returns false for the module with format set to module', ( t ) => {
	const moduleInfo = {
		url: 'whatever',
		format: 'module'
	};
	const result = isBuiltInModule( moduleInfo );

	t.false( result );
} );

test( 'isBuiltInModule() returns false for the module with format set to module and with URL starting from node:', ( t ) => {
	const moduleInfo = {
		url: 'node:whatever',
		format: 'module'
	};
	const result = isBuiltInModule( moduleInfo );

	t.false( result );
} );
