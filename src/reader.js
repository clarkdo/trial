const { createReadStream, existsSync } = require('fs')
const { createInterface } = require('readline')
const Stream = require('stream')

module.exports = class Reader {
  constructor () {
    this.data = []
  }
  read (filePath) {
    if (!filePath || !existsSync(filePath)) {
      throw new Error(`Path:${filePath} is not a valid and existed path`)
    }
    return new Promise((resolve, reject) => {
      const inStream = createReadStream(filePath, {
        encoding: 'utf-8'
      })
      const outStream = new Stream()
      const reader = createInterface(inStream, outStream)

      reader.on('line', line => {
        try {
          line && this.data.push(this.parse(line))
        } catch (e) {
          reject(new Error(`Data file:${filePath} contains invalid json.`))
        }
      }).on('close', line => {
        resolve(this.data)
      })
    })
  }
  parse (json) {
    return JSON.parse(json)
  }
}
