# esm-loader-manager Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

---

## [0.4.0]
### Changed
* [#13]: **BREAKING CHANGE**: added the `pathe` dependency to replace `node:path` usage in all path-related tasks.

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

[0.4.0]: https://github.com/Comandeer/esm-loader-manager/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/Comandeer/esm-loader-manager/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/Comandeer/esm-loader-manager/compare/v0.1.0...v0.2.0
