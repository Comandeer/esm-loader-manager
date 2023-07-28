/// <reference types="node" />
type ModuleFormat = 'builtin' | 'commonjs' | 'json' | 'module' | 'wasm';
type ImportAssertions = Record<string, unknown>;
type TypedArray = BigInt64Array | BigUint64Array | Float32Array | Float64Array | Int8Array | Int16Array | Int32Array | Uint8Array | Uint8ClampedArray | Uint16Array | Uint32Array;
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
type NextResolver = (specifier: string, context: ResolverContext, nextResolver?: NextResolver) => ResolverResult | Promise<ResolverResult>;
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
type NextLoader = (specifier: string, context: LoaderContext, nextLoader?: NextLoader) => LoaderResult | Promise<LoaderResult>;
interface ModuleInfo {
    format?: ModuleFormat | null | undefined;
    url: string;
}
interface MatcherContext {
    conditions: Array<string>;
    importAssertions: ImportAssertions;
    parentURL?: string | undefined;
}
interface Loader {
    matcher: (url: string, context: MatcherContext) => boolean;
    loader: (url: string, source: Buffer | string) => Promise<Buffer | string>;
}
interface LoaderConfiguration {
    loaders: Array<Loader>;
}
declare function resolve(specifier: string, context: ResolverContext, defaultResolve: NextResolver): Promise<ResolverResult>;
declare function load(url: string, context: LoaderContext, defaultLoad: NextLoader): Promise<LoaderResult>;

export { Loader, LoaderConfiguration, MatcherContext, ModuleInfo, load, resolve };
