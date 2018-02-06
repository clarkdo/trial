const Reader = require('./reader')
const Office = require('./office')
const { resolve } = require('path')
const { isNumeric } = require('./util')

module.exports = class Invitation {
  constructor () {
    this.reader = new Reader()
    this.customers = []
    this.office = new Office()
    this.dataPath = resolve(__dirname, '..', 'data', 'customers.txt')
  }
  async fetch () {
    this.customers = await this.reader.read(this.dataPath)
    return this
  }
  sortById () {
    this.customers.sort((a, b) => {
      return a.user_id - b.user_id
    })
    return this
  }
  withinKM (km) {
    if (!isNumeric(km)) {
      throw new Error('"km" should be numeric.')
    }
    this.customers = this.customers.filter(customer => this.office.distance(customer).lessThan(km))
    return this
  }
  print () {
    this.customers.forEach(customer => {
      console.log(`Name: ${customer.name}, Id: ${customer.user_id}`)
    })
    return this
  }
  async invite100KM () {
    (await this.fetch()).withinKM(100).sortById()
    return this
  }
}
