const reader = require('./reader')
const Office = require('./office')
const { resolve } = require('path')
const { isNumeric } = require('./util')

module.exports = class Invitation {
  constructor () {
    this.reader = reader
    this.customers = []
    this.office = new Office()
    this.dataPath = resolve(__dirname, '..', 'data', 'customers.txt')
  }

  /**
   * Get the customer list by reader
   */
  async readList () {
    this.customers = await this.reader.read(this.dataPath)
    return this
  }

  /**
   * Sort the customer list by user id
   */
  sortById () {
    this.customers.sort((a, b) => {
      return a.user_id - b.user_id
    })
    return this
  }

  /**
   * Filter out the customers whose distance is less than the given parameter
   *
   * @param {Number} distance(km)
   */
  chooseWithinKM (km) {
    if (!isNumeric(km)) {
      throw new Error('"km" should be numeric.')
    }
    this.customers = this.customers.filter(customer => this.office.distanceWithin(customer, km))
    return this
  }

  /**
   * Print the customer list to console, format like: "Name: clark, Id: 1"
   */
  printInvited () {
    this.customers.forEach(customer => {
      console.log(`Name: ${customer.name}, Id: ${customer.user_id}`)
    })
    return this
  }
}
