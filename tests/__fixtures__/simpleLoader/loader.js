import loaderManager from '../../../src/index.js';

loaderManager.addLoader( {
	matcher() {
		return true;
	},
	loader() {
		return 'export default "hublabubla";'
	}
} );
