const { createReadStream, existsSync } = require('fs')
const { createInterface } = require('readline')
const { isNumeric } = require('./util')
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
          reject(new Error(e.message))
        }
      }).on('close', line => {
        resolve(data)
      })
    })
  }

  /**
   * Parse json string into object
   *
   * @param {String} json
   * @returns {Object} customer
   */
  static parse (json) {
    let customer
    try {
      customer = JSON.parse(json)
    } catch (e) {
      throw new Error(`Data file contains invalid json: ${e.message}.`)
    }
    this.validate(customer)
    return customer
  }

  /**
   * Validate the required and numeric fields
   *
   * @param {Object} customer
   * @throws {Error} if validation failed, throw error with message
   */
  static validate (customer) {
    let errMsg = ''
    const { user_id: id, name, latitude, longitude } = customer
    if (!id) {
      errMsg = 'user_id is required in customer'
    } else if (!name) {
      errMsg = `name of user:${id} is required`
    } else if (!isNumeric(latitude)) {
      errMsg = `latitude of user:${id} should be a required number`
    } else if (!isNumeric(longitude)) {
      errMsg = `longitude of user:${id} should be a required number`
    }
    if (errMsg) {
      throw new Error(errMsg)
    }
  }
}
