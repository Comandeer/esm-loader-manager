export default [
	{
		matcher( url ) {
			return url.endsWith( 'module.js' );
		},
		loader( url, source ) {
			return source;
		}
	}
];
