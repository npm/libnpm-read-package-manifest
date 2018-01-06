# libnpm-read-package-manifest

Read package manifest data off disk.

## WIP

* 100% test coverage
* rewrite normalize-package-data to be less terrible

## SYNOPSIS

```js
const readPackageManifest = require('libnpm-read-package-manifest/sync')
const mft = readPackageManifest('/path/to/package/dir/')
```

```js
const readPackageManifest = require('libnpm-read-package-manifest/async')
const mft = await readPackageManifest('/path/to/package/dir/')
```

```js
const Manifest = require('libnpm-read-package-manifest/Manifest')
const mft = new Manifest({name: 'package', version: '1.23'})
const newMft = mft.set({description: 'example desc'})
```

Reads package manifest data from either a `package.json` or an `index.js`
and passes it through `normalize-package-data` before producing a new
**immutable** Manifest object.
