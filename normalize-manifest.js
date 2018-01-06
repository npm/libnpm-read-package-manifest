'use strict'
const normalizeData = require('normalize-package-data')

module.exports = normalizeManifest

function normalizeManifest (rawManifest) {
  normalizeData(rawManifest)
  delete rawManifest.readme
  return rawManifest
}
