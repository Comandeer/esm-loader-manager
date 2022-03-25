/**
 * @typedef {Object} AssertParameterErrorOption
 * @property {typeof Error} [type=TypeError] Error's constructor.
 * @property {string} [message='Wrong parameter type'] Error's message.
 */
/**
 * @typedef {Object} AssertParameterOptions
 * @property {Array<unknown>} [valids] Valid parameter values.
 * @property {Array<unknown>} [invalids] Invalid parameter values.
 * @property {AssertParameterErrorOption} [error]
 * @property {function} [code=() => {}] Code that takes the parameter.
 */

/**
 * @param {import('ava').ExecutionContext<unknown>} t Test execution context
 * @param {AssertParameterOptions} [options]
 * @returns {void}
 */
function assertParameter( t, {
	valids = [],
	invalids = [],
	error = {
		type: TypeError,
		message: 'Wrong parameter type'
	},
	code = () => {}
} = {} ) {
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
