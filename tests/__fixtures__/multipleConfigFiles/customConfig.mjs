export default {
	loaders: [
		{
			matcher( url ) {
				return url.endsWith( 'module.js' );
			},
			loader() {
				return 'export default true;';
			}
		}
	]
};
