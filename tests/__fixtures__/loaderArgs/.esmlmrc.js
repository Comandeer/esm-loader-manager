export default {
	loaders: [
		{
			matcher( url ) {
				return url.endsWith( 'module.js' );
			},
			loader( url, source ) {
				const isCorrectURL = url.startsWith( 'file:///' ) && url.endsWith( 'module.js' );
				const isCorrectSourcetType = source instanceof Buffer;
				const result = isCorrectURL && isCorrectSourcetType ? 'true' : 'false';

				return `export default ${ result };`;
			}
		}
	]
};
