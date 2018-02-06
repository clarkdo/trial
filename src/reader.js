const { createReadStream, existsSync } = require('fs')
const { createInterface } = require('readline')
const Stream = require('stream')

module.exports = class Reader {
  /**
   * Read the json data from give path line-by-line
   *
   * @param {String} data file path
   * @returns {Array} data in file
   */
  static read (filePath) {
    if (!filePath || !existsSync(filePath)) {
      throw new Error(`Path:${filePath} is not a valid and existed path`)
    }
    return new Promise((resolve, reject) => {
      const inStream = createReadStream(filePath, {
        encoding: 'utf-8'
      })
      const outStream = new Stream()
      const reader = createInterface(inStream, outStream)
      const data = []

      reader.on('line', line => {
        try {
          line && data.push(this.parse(line))
        } catch (e) {
          reject(new Error(`Data file:${filePath} contains invalid json.`))
        }
      }).on('close', line => {
        resolve(data)
      })
    })
  }
  static parse (json) {
    return JSON.parse(json)
  }
}
