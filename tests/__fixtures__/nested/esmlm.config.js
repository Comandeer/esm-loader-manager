export default {
	loaders: [
		{
			matcher( url ) {
				return url.endsWith( 'index.js' );
			},
			loader() {
				return 'export default true;'
			}
		}
	]
};
