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

function readFile (file, enc) {
  return new Promise((resolve, reject) =>
    fs.readFile(file, enc, (err, data) => err ? reject(err) : resolve(data)))
}

function stat (file) {
  return new Promise((resolve, reject) =>
    fs.stat(file, (err, data) => err ? reject(err) : resolve(data)))
}

function readPackageManifest (pkgPath) {
  return readManifest(pkgPath).then(json => {
    if (cache.has(json)) return cache.get(json)

    const manifest = new Manifest(normalizeManifest(safeJSON(stripBOM(json))))
    cache.set(json, manifest)
    return manifest
  })
}

function readManifest (pkgPath) {
  return readFile(path.join(pkgPath, 'package.json'), 'utf8').catch(err => {
    if (!err || err.code !== 'ENOENT') throw err
    return assertIsDirectory(pkgPath).then(() => {
      return readFromIndexjs(pkgPath).catch(() => {
        throw err
      })
    })
  })
}

function assertIsDirectory (pkgPath) {
  return stat(pkgPath).then(info => {
    if (!info.isDirectory()) {
      // ENOTDIR isn't used on Windows, but npm can give better error messages
      // if it knows when it was used on non-directories
      const notDir = Object.create(err)
      notDir.code = 'ENOTDIR'
      throw notDir
    }
  })
}

function readFromIndexjs (pkgPath) {
  return readFile(path.join(pkgPath, 'index.js')).then(rawjs => {
    const data = parseEmbeddedManifest(rawjs)
    if (!data) throw new Error('index without embedded package data')
    return data
  })
}
