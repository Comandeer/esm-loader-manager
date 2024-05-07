export default {
	loaders: [
		{
			matcher( url ) {
				return url.endsWith( 'module.mjs' );
			},
			loader() {
				return 'export default true;'
			}
		}
	]
};
