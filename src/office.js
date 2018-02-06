const Decimal = require('decimal.js')
const { isNumeric } = require('./util')
const EARTH_RADIUS = new Decimal(6371.0088) // earth mean radius

module.exports = class Office {
  constructor () {
    this.latitude = new Decimal(53.339405)
    this.longitude = new Decimal(-6.257664)
    this.latRad = this.toRadian(this.latitude)
    this.lonRad = this.toRadian(this.longitude)
  }
  distance (customer) {
    if (!customer) {
      throw new Error('customer for calculating distance cannot be null.')
    }
    const {latitude: lat, longitude: lon} = customer
    if (!isNumeric(lat) || !isNumeric(lon)) {
      throw new Error('degrees of customer should be numeric.')
    }

    const srcLat = this.toRadian(new Decimal(lat))
    const srcLon = this.toRadian(new Decimal(lon))
    const destLat = this.latRad
    const destLon = this.lonRad

    // Great-circle distance formula
    return Decimal.acos(
      Decimal.sin(srcLat).mul(Decimal.sin(destLat))
      .plus(
        Decimal.cos(srcLat).mul(Decimal.cos(destLat))
          .mul(Decimal.cos(srcLon.sub(destLon)))
      )).mul(EARTH_RADIUS)
  }
  toRadian (degree) {
    return degree.mul(Math.PI).div(180)
  }
}
