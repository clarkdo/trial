const fs = require('fs')
const readline = require('readline')
const Stream = require('stream')

module.exports = class Reader {
  constructor () {
    this.data = []
  }
  read (filePath) {
    return new Promise((resolve, reject) => {
      const inStream = fs.createReadStream(filePath, {
        encoding: 'utf-8'
      })
      const outStream = new Stream()
      const reader = readline.createInterface(inStream, outStream)

      reader.on('line', line => {
        try {
          this.data.push(this.parse(line))
        } catch (e) {
          reject(e)
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
