export default {
	loaders: [
		{
			matcher( url ) {
				const extensionRegex = /\.mjs$/;

				return extensionRegex.test( url );
			},
			loader() {
				return 'export default true;'
			}
		}
	]
};
