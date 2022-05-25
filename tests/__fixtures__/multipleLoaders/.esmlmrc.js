export default {
	loaders: [
		{
			matcher( url ) {
				return url.endsWith( 'module.js' );
			},
			loader() {
				return 'export default "hublabubla";'
			}
		},

		{
			matcher( url ) {
				return !url.endsWith( 'module.js' );
			},
			loader( url, source ) {
				return source.replace( 'hubla', 'FAIL' );
			}
		},

		{
			matcher( url ) {
				return url.endsWith( 'module.js' );
			},
			loader( url, source ) {
				return source.replace( 'hubla', 'babu' );
			}
		}
	]
};
