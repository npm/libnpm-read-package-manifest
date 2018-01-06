'use strict'
module.exports = stripBOM

function stripBOM (content) {
  // utf8 bom
  if (content[0] === 0xEF && content[1] === 0xBB && content[2] === 0xBF) {
    return content.slice(3)
  } else {
    return content
  }
}
