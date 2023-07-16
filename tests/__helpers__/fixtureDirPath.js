import { dirname } from 'pathe';
import { resolve as resolvePath } from 'pathe';
import { fileURLToPath } from 'node:url';

const __dirname = dirname( fileURLToPath( import.meta.url ) );
const fixtureDirPath = resolvePath( __dirname, '..', '__fixtures__' );

export default fixtureDirPath;
