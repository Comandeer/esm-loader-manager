/* eslint-disable no-console */

import { access } from 'node:fs/promises';
import { cwd as processCWD } from 'node:process';
import { env as processEnv } from 'node:process';
import { pathToFileURL } from 'node:url';
import { resolve as resolvePath } from 'pathe';
import isBuiltInModule from './utilities/isBuiltInModule.js';
import isInsideDir from './utilities/isInsideDir.js';
import isInsideNodeModules from './utilities/isInsideNodeModules.js';
import resolveConfigFile from './utilities/resolveConfigFile.js';
import resolveProjectRoot from './utilities/resolveProjectRoot.js';
import loadURL from './utilities/loadURL.js';

type ModuleFormat = 'builtin' | 'commonjs' | 'json' | 'module' | 'wasm';
type ImportAssertions = Record<string, unknown>;
type TypedArray =
	| BigInt64Array
	| BigUint64Array
	| Float32Array
	| Float64Array
	| Int8Array
	| Int16Array
	| Int32Array
	| Uint8Array
	| Uint8ClampedArray
	| Uint16Array
	| Uint32Array;

interface ResolverContext {
	conditions: Array<string>;
	importAssertions: ImportAssertions;
	parentURL?: string | undefined;
}

interface ResolverResult {
	format: ModuleFormat | null | undefined;
	importAssertions?: ImportAssertions;
	shortCircuit?: boolean;
	url: string;
}

type NextResolver = (
	specifier: string,
	context: ResolverContext,
	nextResolver?: NextResolver
) => ResolverResult | Promise<ResolverResult>;

interface LoaderContext {
	conditions: Array<string>;
	format: ModuleFormat | null | undefined;
	importAssertions: ImportAssertions;
}

interface LoaderResult {
	format: ModuleFormat;
	shortCircuit?: boolean;
	source: string | ArrayBuffer | TypedArray;
}

type NextLoader = (
	specifier: string,
	context: LoaderContext,
	nextLoader?: NextLoader
) => LoaderResult | Promise<LoaderResult>;

export interface ModuleInfo {
	format?: ModuleFormat | null | undefined;
	url: string;
}

export interface MatcherContext {
	conditions: Array<string>;
	importAssertions: ImportAssertions;
	parentURL?: string | undefined;
}

export interface Loader {
	matcher: ( url: string, context: MatcherContext ) => boolean;
	loader: ( url: string, source: Buffer | string ) => Promise<Buffer | string>;
}

export interface LoaderConfiguration {
	loaders: Array<Loader>;
}

const cwd = processCWD();
const resolvedProjectRoot = await resolveProjectRoot( cwd );

if ( resolvedProjectRoot === null ) {
	console.warn( 'ESMLM: The project root was not detected. Falling back to the CWD.' );
}

const projectRoot = resolvedProjectRoot ?? cwd;
const loaderFileName = 'ESMLM_CONFIG' in processEnv ? String( processEnv.ESMLM_CONFIG ) :
	await resolveConfigFile( cwd, projectRoot );
const loaderPath = loaderFileName !== null ? resolvePath( cwd, loaderFileName ) : null;
let loaders: Array<Loader> = [];

try {
	if ( typeof loaderPath !== 'string' ) {
		throw new Error( 'Invalid path' );
	}

	await access( loaderPath );

	const loaderURL = pathToFileURL( loaderPath );
	const { default: config }: { default: LoaderConfiguration } = await import( loaderURL.href );

	loaders = config.loaders;
} catch {
	console.warn( 'ESMLM: The file with loaders\' definition was not found or cannot be accessed.' );
}

async function resolve( specifier: string, context: ResolverContext, defaultResolve: NextResolver ): Promise<ResolverResult> {
	const defaultResolvedInfo = await defaultResolve( specifier, context, defaultResolve );
	const { url: moduleURL } = defaultResolvedInfo;

	if ( shouldIgnoreModule( projectRoot, defaultResolvedInfo ) ) {
		return defaultResolvedInfo;
	}

	const isAnyLoaderForSpecifier = loaders.some( ( { matcher } ) => {
		return matcher( moduleURL, context );
	} );

	if ( !isAnyLoaderForSpecifier ) {
		return defaultResolvedInfo;
	}

	return {
		url: moduleURL,
		format: 'module'
	};
}

async function load( url: string, context: LoaderContext, defaultLoad: NextLoader ): Promise<LoaderResult> {
	const moduleInfo: ModuleInfo = { ...context, url };

	if ( shouldIgnoreModule( projectRoot, moduleInfo ) ) {
		return defaultLoad( url, context, defaultLoad );
	}

	const matchedLoaders = loaders.filter( ( { matcher } ) => {
		return matcher( url, context );
	} );

	if ( matchedLoaders.length === 0 ) {
		return defaultLoad( url, context, defaultLoad );
	}

	let source = await loadURL( url );

	for ( const { loader } of matchedLoaders ) {
		source = await loader( url, source ); // eslint-disable-line no-await-in-loop
	}

	return {
		format: 'module',
		shortCircuit: true,
		source
	};
}

function shouldIgnoreModule( projectRoot: string, moduleInfo: ModuleInfo ): boolean {
	const moduleURL = moduleInfo.url;

	return isBuiltInModule( moduleInfo ) || isInsideNodeModules( moduleURL ) || !isInsideDir( projectRoot, moduleURL );
}

export { resolve };
export { load };
