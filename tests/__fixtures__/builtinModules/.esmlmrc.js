export default {
	loaders: [
		{
			matcher( url ) {
				return url.startsWith( 'node:' );
			},
			loader() {
				return 'export default true;'
			}
		}
	]
};
