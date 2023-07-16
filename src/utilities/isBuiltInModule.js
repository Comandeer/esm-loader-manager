function isBuiltInModule( { url, format } ) {
	if ( format ) {
		return format === 'builtin';
	}

	return url.startsWith( 'node:' );
}

export default isBuiltInModule;
