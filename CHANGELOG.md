# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Added
### Fixed
### Changed

## [v2.2.0](https://github.com/pgarciacamou/react-context-consumer-hoc/releases/tag/v2.2.0) - 2018-10-XX
### Added
- Expose inner functionality `createContextConsumerChain`
### Fixed
### Changed
- Simplify codebase by removing all but one forwardRef

## [v2.1.1](https://github.com/pgarciacamou/react-context-consumer-hoc/releases/tag/v2.1.1) - 2018-10-15
### Added
### Fixed
### Changed
- Simplify documentation

## [v2.1.0](https://github.com/pgarciacamou/react-context-consumer-hoc/releases/tag/v2.1.0) - 2018-10-09
### Added
- Introduce `noRef` to all APIs
- Add concept of `nampespacing`
- [feature] pass component own props https://github.com/pgarciacamou/react-context-consumer-hoc/pull/13
### Fixed
- Does not work with react-redux connect https://github.com/pgarciacamou/react-context-consumer-hoc/issues/6
### Changed

## [v2.0.1](https://github.com/pgarciacamou/react-context-consumer-hoc/releases/tag/v2.0.1) - 2018-10-08
### Added
### Fixed
- Removed unneeded `lodash.isstring` dependency
### Changed

## [v2.0.0](https://github.com/pgarciacamou/react-context-consumer-hoc/releases/tag/v2.0.0) - 2018-10-04
### Added
- New `withContext` takes in an array of context and `mapContextToProps` function
- Renamed old `withContext` to `withContextAsProps` which takes in a comma-separated context list
### Fixed
- v1 is re-rendering PureComponents https://github.com/pgarciacamou/react-context-consumer-hoc/issues/7
### Changed
- Deprecate the use of context wrapper (`this.props.context`) by directly injecting context as props

## [v1.0.4](https://github.com/pgarciacamou/react-context-consumer-hoc/releases/tag/v1.0.4) - 2018-07-03
### Added
### Fixed
- Pass component reference to enhanced component (via `React.forwardRef`)
### Changed

## [v1.0.3](https://github.com/pgarciacamou/react-context-consumer-hoc/releases/tag/v1.0.3) - 2018-06-27
### Added
### Fixed
### Changed
- Remove lodash

## [v1.0.2](https://github.com/pgarciacamou/react-context-consumer-hoc/releases/tag/v1.0.2) - 2018-06-27
### Added
### Fixed
- Performance issues due to computing consumers on every render
- Issue #2: UI flashes
### Changed

## [v1.0.1](https://github.com/pgarciacamou/react-context-consumer-hoc/releases/tag/v1.0.1) - 2018-06-27
### Added
- Add CHANGELOG.md
- Add DEVELOP.md
- Add basic unit tests
### Fixed
### Changed
- Clean code
- Simplify usage example in README file

## [v1.0.0](https://github.com/pgarciacamou/react-context-consumer-hoc/releases/tag/1.0.0) - 2018-06-21
### Added
- First release
### Fixed
### Changed
