let matchedURLs = 0;

export default {
	loaders: [
		{
			matcher( url ) {
				if ( url.startsWith( 'file://' ) && url.endsWith( 'module.js' ) ) {
					matchedURLs++;
				}

				return url.endsWith( 'module.js' );
			},
			loader() {
				const result = matchedURLs === 2 ? 'true' : 'false';

				return `export default ${ result };`;
			}
		}
	]
};
