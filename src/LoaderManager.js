/**
 * @typedef {Object} Loader
 * @property {Function} loader The actual loader.
 * @property {Function} matcher Function that matches imports with the loader.
 */

class LoaderManager {
	#loaders;

	/**
	 * @param {Array<Loader>} loaders The collection of loaders to manage.
	 */
	constructor( loaders ) {
		if ( !Array.isArray( loaders ) ) {
			throw new TypeError( 'Provide a valid collection of loaders' );
		}

		this.#loaders = loaders;
	}

	/**
	 * @param {Loader} loader The loader to add to the pool of available loaders.
	 * @returns {void}
	 */
	addLoader( loader ) {
		if ( !this.#validateLoader( loader ) ) {
			throw new TypeError( 'Valid loader should be an object with two methods: matcher() and loader()' );
		}

		if ( this.#loaders.includes( loader ) ) {
			return;
		}

		this.#loaders.push( loader );
	}

	/**
	 * @param {Loader} loader The laoder to be deleted.
	 */
	removeLoader( loader ) {
		const loaderIndex = this.#loaders.findIndex( ( value ) => {
			return value === loader;
		} );

		if ( loaderIndex === -1 ) {
			return;
		}

		this.#loaders.splice( loaderIndex, 1 );
	}

	#validateLoader( loader ) {
		if ( !loader || typeof loader !== 'object' ) {
			return false;
		}

		const isValidMatcher = typeof loader.matcher === 'function';
		const isValidLoader = typeof loader.loader === 'function';

		return isValidMatcher && isValidLoader;
	}
}

export default LoaderManager;
