# Change Log
All notable changes since 2.3.4 will be documented in this file.

## [3.2.0] - 2015-12-15

### Added
- Add `expandGroups`-option to `getAccessControlRules()`

## [3.1.2] - 2015-12-10

### Added
- Add `setPublicKey`-method to URL classes

## [3.1.1] - 2015-11-09

### Changed
- Replace sha256 library used for signing requests

## [3.1.0] - 2015-10-19

### Added
- Add missing `contrast`-transformation to Image URL class

## [3.0.0] - 2015-07-23

### Changed
- Breaking change: Errors are now proper `Error`-instances instead of the weird error-codes used earlier. Those who check for errors with specific values need to change this. All HTTP-related errors include a `statusCode` property that can be used instead.
- Breaking change: `getUserInfo()` no longer returns the `publicKey` property when using Imbo 2.0. Instead, a `user` property is included (when using Imbo < 2.0, the `user` property will have the same value as `publicKey`).
- Dependencies updated to latest versions.

### Added
- Client constructor now accepts an option instead of individual arguments (backwards compatibility is maintained).
- Client constructor can now take a `user` parameter. This goes along with Imbo 2.0's distinction between a user and a public key. If the public key and user differs, a `publicKey` query parameter is added.
- Image URLs now support the `smartSize`-transformation.
- Methods for resource groups: `getResourceGroups()`, `getResourceGroup()`, `addResourceGroup()`, `editResourceGroup()`, `deleteResourceGroup` and `resourceGroupExists()`.
- Methods for public/private keys: `addPublicKey()`, `editPublicKey()`, `deletePublicKey()` and `publicKeyExists()`.
- Methods for access control rules: `getAccessControlRules()`, `getAccessControlRule()`, `addAccessControlRule()`, `deleteAccessControlRule()`.

[3.2.0]: https://github.com/imbo/imboclient-js/compare/3.1.2...3.2.0
[3.1.2]: https://github.com/imbo/imboclient-js/compare/3.1.1...3.1.2
[3.1.1]: https://github.com/imbo/imboclient-js/compare/3.1.0...3.1.1
[3.1.0]: https://github.com/imbo/imboclient-js/compare/3.0.0...3.1.0
[3.0.0]: https://github.com/imbo/imboclient-js/compare/2.3.4...3.0.0
