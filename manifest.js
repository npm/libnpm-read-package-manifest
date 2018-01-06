'use strict'

class Manifest {
  constructor (init) {
    Object.assign(this, init)
    freezeAll(this)
  }
  set (values) {
    return new Manifest(Object.assign(cloneJson(this), values)) 
  }
}

module.exports = Manifest

function freezeAll (obj) {
  Object.freeze(obj)
  if (Array.isArray(obj)) {
    for (let ii in obj) {
      freezeAll(obj[ii])
    }
  } else if (!Buffer.isBuffer(obj) && typeof obj === 'object') {
    Object.keys(obj).forEach(kk => freezeAll(obj[kk]))
  }
  return obj
}

function cloneJson (obj) {
  if (Array.isArray(obj)) {
    const newarr = new Array(obj.length)
    for (let ii in obj) {
      newarr[ii] = obj[ii]
    }
    return newarr
  } else if (typeof obj === 'object') {
    const newobj = {}
    for (let kk in obj) {
      newobj[kk] = cloneJson(obj[kk])
    }
    return newobj
  } else {
    return obj
  }
}
