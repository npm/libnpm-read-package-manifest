'use strict'
const path = require('path')

const safeJSON = require('json-parse-better-errors')

const fs = require('graceful-fs')

const Manifest = require('./manifest.js')
const normalizeManifest = require('./normalize-manifest.js')
const stripBOM = require('./strip-bom.js')
const parseEmbeddedManifest = require('./parse-embedded-manifest.js')
const cache = require('./manifest-cache.js')

module.exports = readPackageManifest

function readPackageManifest (pkgPath) {
  const json = readManifest(pkgPath)
  if (cache.has(json)) return cache.get(json)

  const manifest = new Manifest(normalizeManifest(safeJSON(stripBOM(json))))
  cache.set(json, manifest)
  return manifest
}

function readManifest (pkgPath) {
  try {
    return fs.readFileSync(path.join(pkgPath, 'package.json'), 'utf8')
  } catch (err) {
    if (!err || err.code !== 'ENOENT') throw err
    
    assertIsDirectory(pkgPath)
    try {
      return readFromIndexjs(pkgPath)
    } catch (_) {
      throw err
    }
  }
}

function assertIsDirectory (pkgPath) {
  const info = fs.statSync(pkgPath)
  if (!info.isDirectory()) {
    // ENOTDIR isn't used on Windows, but npm can give better error messages
    // if it knows when it was used on non-directories
    const notDir = Object.create(err)
    notDir.code = 'ENOTDIR'
    throw notDir
  }
}

function readFromIndexjs (pkgPath) {
  const rawjs = fs.readFileSync(path.join(pkgPath, 'index.js'))
  const data = parseEmbeddedManifest(rawjs)
  if (!data) throw new Error('index without embedded package data')
  return data
}
