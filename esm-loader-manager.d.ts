import { Buffer } from 'node:buffer';

export interface MatcherContext {
	conditions: Array<string>;
	importAssertions: Record<string, unknown>;
	parentURL: string | undefined;
}

export interface Loader {
	matcher( url: string, context: MatcherContext ): boolean;
	loader( url: string, source: Buffer | string ): Buffer | string;
}

export interface LoaderConfiguration {
	loaders: Array<Loader>;
}
