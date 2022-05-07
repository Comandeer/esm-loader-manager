import assertion from './module.mjs';
import nestedAssertion from './subdir/module.mjs';
import outputAssertion from '../outsideCWD/module.mjs';

console.log( assertion );
console.log( nestedAssertion );
console.log( outputAssertion );
