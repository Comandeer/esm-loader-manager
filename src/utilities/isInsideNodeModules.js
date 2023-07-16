function isInsideNodeModules( pathOrURL ) {
	const npmModulesPathRegex = /[/\\]node_modules[/\\]/gi;

	return npmModulesPathRegex.test( pathOrURL );
}

export default isInsideNodeModules;
