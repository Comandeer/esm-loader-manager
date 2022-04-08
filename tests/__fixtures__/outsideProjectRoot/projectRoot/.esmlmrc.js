export default {
	loaders: [
		{
			matcher( url ) {
				const extensionRegex = /\.m?js$/;

				return extensionRegex.test( url );
			},
			loader() {
				return 'export default "hublabubla";'
			}
		}
	]
};
