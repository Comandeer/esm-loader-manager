import LoaderManager from './LoaderManager.js';

const loaderManager = new LoaderManager( globalThis.__ESMLM__ );

const addLoader = loaderManager.addLoader.bind( loaderManager );
const removeLoader = loaderManager.removeLoader.bind( loaderManager );

export { addLoader };
export { removeLoader };
