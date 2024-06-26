# esm-loader-manager Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

---

## [0.6.0] – 2024-05-08
### Added
* [#27]: support for Node 22.

### Changed
* [#31]: **BREAKING CHANGE**: changed the default config file name from `.esmlmrc.js` to `esmlm.config.js`.
* [#26]: **BREAKING CHANGE**: updated dependencies:

	| Dependency | Old version | New version |
	| ---------- | ----------- | ----------- |
	| ⚠️ `execa`  | `^7.1.1`    | `^8.0.1`    |
	| `pathe`    | `^1.1.1`    | `^1.1.2`    |
	| `tslib`    | `^2.6.1`    | `^2.6.2`    |

	Dependencies with major version change are marked with the "⚠️" emoji.

### Removed
* [#27]: **BREAKING CHANGE**: support for Node < 20.10.0.


## [0.5.1] – 2023-08-02
### Fixed
* [#24]: `tslib` was incorrectly marked as dev dependency instead of runtime one.

## [0.5.0] – 2023-07-29
### Changed
* [#20]: **BREAKING CHANGE**: changed exported types due to rewrite in TS.

## [0.4.0] – 2023-07-16
### Changed
* [#13]: **BREAKING CHANGE**: added the `pathe` dependency to replace `node:path` usage in all path-related tasks.
* [#18]: **BREAKING CHANGE**: changed logic for detecting and loading the loader file.

### Fixed
* [#17]: incorrect error handling in the `resolveConfigFile()` utility.

## [0.3.0] – 2023-07-13
### Added
* [#8]: Official support for Node 20.

### Changed
* [#9]: **BREAKING CHANGE**: updated `execa` dependency from `^6.1.0` to `^7.1.1`.

### Fixed
* [#6]: Incorrect results returned by `isInsideDir()` on Windows.

## [0.2.0] – 2022-07-27
### Added
* [#2]: The `esmlm` binary passes arguments to the underlying program.

### Changed
* [#1]: The `esmlm` binary now handles errors in more user-friendly manner.

### Fixed
* [#5]: The loader does not work correctly in Node 18.6+.

## 0.1.0 – 2022-05-26
### Added
* First working version, yay!

[#1]: https://github.com/Comandeer/esm-loader-manager/issues/1
[#2]: https://github.com/Comandeer/esm-loader-manager/issues/2
[#5]: https://github.com/Comandeer/esm-loader-manager/issues/5
[#6]: https://github.com/Comandeer/esm-loader-manager/issues/6
[#8]: https://github.com/Comandeer/esm-loader-manager/issues/8
[#9]: https://github.com/Comandeer/esm-loader-manager/issues/9
[#13]: https://github.com/Comandeer/esm-loader-manager/issues/13
[#17]: https://github.com/Comandeer/esm-loader-manager/issues/17
[#18]: https://github.com/Comandeer/esm-loader-manager/issues/18
[#20]: https://github.com/Comandeer/esm-loader-manager/issues/20
[#24]: https://github.com/Comandeer/esm-loader-manager/issues/24
[#26]: https://github.com/Comandeer/esm-loader-manager/issues/26
[#27]: https://github.com/Comandeer/esm-loader-manager/issues/27
[#31]: https://github.com/Comandeer/esm-loader-manager/issues/31

[0.6.0]: https://github.com/Comandeer/esm-loader-manager/compare/v0.5.1...v0.6.0
[0.5.1]: https://github.com/Comandeer/esm-loader-manager/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/Comandeer/esm-loader-manager/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/Comandeer/esm-loader-manager/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/Comandeer/esm-loader-manager/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/Comandeer/esm-loader-manager/compare/v0.1.0...v0.2.0
