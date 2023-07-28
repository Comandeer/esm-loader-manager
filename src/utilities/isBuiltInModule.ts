import { ModuleInfo } from '../index.js';

function isBuiltInModule( { url, format }: ModuleInfo ): boolean {
	if ( typeof format === 'string' ) {
		return format === 'builtin';
	}

	return url.startsWith( 'node:' );
}

export default isBuiltInModule;
