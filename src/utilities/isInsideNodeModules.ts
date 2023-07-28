function isInsideNodeModules( pathOrURL: string ): boolean {
	const npmModulesPathRegex = /[/\\]node_modules[/\\]/gi;

	return npmModulesPathRegex.test( pathOrURL );
}

export default isInsideNodeModules;
