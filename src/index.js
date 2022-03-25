import LoaderManager from './LoaderManager.js';

if ( !( '__ESMLM__' in globalThis ) ) {
	throw new Error( 'The ESM Loader Manager cannot be used without the actual loader' );
}

const loaderManager = new LoaderManager( globalThis.__ESMLM__ );

export default loaderManager;
