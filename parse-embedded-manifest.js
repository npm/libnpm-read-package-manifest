module.exports = parseIndex

function parseIndex (data) {
  data = data.split(/^\/\*\*package(?:\s|$)/m)

  if (data.length < 2) return null
  data = data[1]
  data = data.split(/\*\*\/$/m)

  if (data.length < 2) return null
  data = data[0]
  return data.replace(/^\s*\*/mg, '')
}
