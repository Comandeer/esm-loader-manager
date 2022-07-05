import { argv } from 'node:process';

const filteredArgs = argv.splice( 2 );

console.log( filteredArgs.join( ' ' ) );
