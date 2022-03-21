import test from 'ava';
import LoaderManager from '../src/LoaderManager.js';
import assertParameter from './__helpers__/assertParameter.js';

test( 'LoaderManager is a class', ( t ) => {
	t.is( typeof LoaderManager, 'function' );
} );

test( 'constructor requires an array', ( t ) => {
	assertParameter( t, {
		invalids: [
			'',
			undefined,
			null,
			function() {},
			{},
			1,
			{ length: 0 }
		],
		valids: [
			[]
		],
		error: {
			type: TypeError,
			message: 'Provide a valid collection of loaders'
		},
		code: ( parameter ) => {
			new LoaderManager( parameter );
		}
	} );
} );

test( '#addLoader() adds a loader to the collection', ( t ) => {
	const loaders = [];
	const loader = {
		matcher() {},
		loader() {}
	};
	const expectedLoaders = [
		loader
	];
	const loaderManager = new LoaderManager( loaders );

	loaderManager.addLoader( loader );

	t.deepEqual( loaders, expectedLoaders );
} );

test( '#addLoader() adds given loader only once to the collection', ( t ) => {
	const loaders = [];
	const loader = {
		matcher() {},
		loader() {}
	};
	const expectedLoaders = [
		loader
	];
	const loaderManager = new LoaderManager( loaders );

	loaderManager.addLoader( loader );
	loaderManager.addLoader( loader );

	t.deepEqual( loaders, expectedLoaders );
} );

test( '#addLoader() validates passed loaders', ( t ) => {
	const loaderManager = new LoaderManager( [] );

	assertParameter( t, {
		invalids: [
			null,
			1,
			{},
			() => {},

			{
				matcher() {}
			},

			{
				loader() {}
			},

			{
				matcher: 1,
				loader() {}
			},

			{
				matcher() {},
				loader: 1
			}
		],
		valids: [
			{
				matcher() {},
				loader() {}
			}
		],
		error: {
			type: TypeError,
			message: 'Valid loader should be an object with two methods: matcher() and loader()'
		},
		code: ( parameter ) => {
			loaderManager.addLoader( parameter );
		}
	} );
} );

test( '#removeLoader() removes the loader from the pool of available loaders', ( t ) => {
	const loaders = [];
	const loader = {
		matcher() {},
		loader() {}
	};
	const expectedLoaders = [];
	const loaderManager = new LoaderManager( loaders );

	loaderManager.addLoader( loader );
	loaderManager.removeLoader( loader );

	t.deepEqual( loaders, expectedLoaders );
} );

test( '#removeLoader() does nothing if the provided loader is not present', ( t ) => {
	const loaders = [];
	const loader = {
		matcher() {},
		loader() {}
	};
	const notAddedLoader = {
		matcher() {},
		loader() {}
	};
	const expectedLoaders = [
		loader
	];
	const loaderManager = new LoaderManager( loaders );

	loaderManager.addLoader( loader );
	loaderManager.removeLoader( notAddedLoader );

	t.deepEqual( loaders, expectedLoaders );
} );
