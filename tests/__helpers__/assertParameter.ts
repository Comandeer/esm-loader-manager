// eslint-disable-next-line ava/use-test
import { ExecutionContext } from 'ava';

interface AssertParameterErrorOption {
	type: typeof Error;
	message: string;
}

interface AssertParameterOptions {
	valids?: Array<unknown>;
	invalids?: Array<unknown>;
	error?: AssertParameterErrorOption;
	code?: ( param: unknown ) => unknown;
}

function assertParameter( t: ExecutionContext, {
	valids = [],
	invalids = [],
	error = {
		type: TypeError,
		message: 'Wrong parameter type'
	},
	code = (): void => {}
}: AssertParameterOptions = {} ): void {
	invalids.forEach( ( invalid ) => {
		t.throws( () => {
			code( invalid );
		}, {
			instanceOf: error.type,
			message: error.message
		} );
	} );

	valids.forEach( ( valid ) => {
		t.notThrows( () => {
			code( valid );
		} );
	} );
}

export default assertParameter;
