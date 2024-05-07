# esm-loader-manager

![Build Status](https://github.com/Comandeer/esm-loader-manager/workflows/CI/badge.svg) [![codecov](https://codecov.io/gh/Comandeer/esm-loader-manager/branch/main/graph/badge.svg)](https://codecov.io/gh/Comandeer/esm-loader-manager) [![npm ](https://img.shields.io/npm/v/esm-loader-manager.svg)](https://npmjs.com/package/esm-loader-manager)

Like [Pirates](https://github.com/danez/pirates) but for ESM.

**Works with Node 20.10.0+**.

⚠️ As ESM loaders are still experimental in Node.js, this package should also be considered experimental. **Use in production environment at your own risk!**

## How does it work?

This package allows to use several [module customization hooks](https://nodejs.org/docs/latest-v20.x/api/module.html#customization-hooks) inside one Node.js application. It basically provides an ESM loader that can be configured to pass some of importing modules to user-provided transformation functions (see [Examples](#Examples) section for more info).

**Built-in Node.js modules and modules located inside `node_modules` are ignored by the manager!**

## Installation

```shell
npm install esm-loader-manager
```

## Usage

The loader manager needs to be added as an ESM loader to your Node application. It can be done in two different ways.

### Via Node.js flag

This is probably the easiest way to use the loader manager. You can add it to your application using [the `--import` flag](https://nodejs.org/api/cli.html#--importmodule):

```shell
node --import=esm-loader-manager/register
```

### Via `esmlm` executable

If, however, you find the flag version too long/repulsive, the package provides `esmlm` executable that adds it for you! It takes the path to the Node.js application as a parameter (defaults to [CWD](https://en.wikipedia.org/wiki/Working_directory))

The `esmlm` can be e.g. used inside npm scripts:

```javascript
{
	// Rest of package.json
	"scripts": {
		"start": "esmlm"
	}
}
```

Or it can be invoked using [`npx`](https://www.npmjs.com/package/npx):

```shell
npx esm-loader-manager <path to your app>
```

Note that you need to use _package_ name (not executable one!) when using `npx`.

## Configuration

The loader manager does nothing on its own but you can declare your loaders inside the configuration file.

### Configuration file format

The configuration file needs to be named `.esmlmrc.js` or `.esmlmrc.mjs`.

The sample one could look like the one below:

```javascript
export default {
	loaders: [
		{
			matcher( url ) {
				return url.endsWith( 'module.js' );
			},
			loader( url, content ) {
				return content;
			}
		}
	]
};
```

The configuration file needs to export an object as a default export. This object needs to have the `loaders` property that contains an array of loaders.

Each loader is an object with two methods: `matcher()` and `loader()`.

#### matcher( url: string, context: [ResolveContext](https://nodejs.org/api/module.html#resolvespecifier-context-nextresolve) ): boolean

The task of this method is to check if the module identified by the passed URL should be handled by this particular loader. If yes, it should return `true` and `false` otherwise.

#### loader( url: string, source: Buffer | string ): Buffer | string

This method transforms the source of the module. The manager takes care of actual loading of module file and each loader gets its content. The content is then passed via all loaders sequentially.

### Configuration file location

The manager will look for the configuration file inside the CWD and go up until it hits the project root directory (the nearest one with the `package.json` file). Let's imagine we have a following file structure:

```
- projectRoot/
|- package.json
|- .esmlmrc.js
|- subdir/
|  |- app.js
|  |- .esmlmrc.js
|- someOtherDir/
|  |- someOtherApp.js
```

If we launch Node.js inside `projectRoot/subdir`, the manager will use the `projectRoot/subdir/.esmlmrc.js` file. However, if we launch Node.js inside `projectRoot/someOtherDir` (which does not contain its own configuration file), the `projectRoot/.esmlmrc.js` one will be used.

If for some reason you want to have a config file under some other name, you can provide the path to it via `ESMLM_CONFIG` environment variable, e.g.

```shell
ESMLM_CONFIG="./customConfig.js" esmlm .
```

## Typings

The package contains also basic typings for the configuration file. They can be used via JSDoc syntax, e.g.:

```javascript
/**
 * @type {import('esm-loader-manager').LoaderConfiguration}
 */
const config = {
	loaders: [
		{
			matcher( url ) {
				return url.endsWith( 'module.js' );
			},
			loader( url, content ) {
				return content;
			}
		}
	]
};

export default config;
```

For some reason TS seems to have issue when the export is inlined and the type can be incorrectly applied to the `export` itself instead of the exported object. It's much safer to move exported object to its own variable.

## Examples

### Transforming PNG images into JS modules

#### Files

**index.js**

```javascript
import samplePng from './sample.png';

console.log( samplePng ); // data:image/png;base64,[…]
```

**.esmlmrc.js**

```javascript
export default {
	loaders: [
		{
			matcher( url ) {
				return url.endsWith( '.png' );
			},
			loader( url, content ) {
				const dataURL = content.toString( 'base64' );

				return `export default "data:image/png;base64,${ dataURL }";`;
			}
		}
	]
};
```

**package.json**

```json
{
  "name": "esmlm-test",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "dependencies": {
    "esm-loader-manager": "^0.1.0"
  },
  "scripts": {
    "start": "esmlm"
  }
}
```

**sample.png**

Well, a sample PNG image ¯\\_(ツ)_/¯

#### Running

```shell
cd app-dir
npm start
```

If you enter the app directory and then run `npm start`, you should see an image Data URL displayed in the terminal.

## Known limitations

* Only `file://` module URLs are supported.
* The project root path is not customizable, meaning that this package can be less useful in monorepo environments.
* Ignoring built-in modules and `node_modules` ones can't be configured.

## License

See [LICENSE](./LICENSE) file for details.
