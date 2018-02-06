const Decimal = require('decimal.js')
const { isNumeric } = require('./util')
const EARTH_RADIUS = new Decimal(6371.0088) // earth mean radius

module.exports = class Office {
  constructor (lat, lon) {
    if ((lat && !isNumeric(lat)) ||
        (lon && !isNumeric(lon))) {
      throw new Error('Latitude/Longitude should be numeric.')
    }
    this.latitude = new Decimal(lat || 53.339405)
    this.longitude = new Decimal(lon || -6.257664)
    this.latRad = this.toRadian(this.latitude)
    this.lonRad = this.toRadian(this.longitude)
  }
  distanceWithin (customer, maxKM) {
    if (!isNumeric(maxKM)) {
      throw new Error('Max distance should be numeric.')
    }
    return this.distance(customer).lessThan(maxKM)
  }
  distance (customer) {
    if (!customer) {
      throw new Error('Customer in distance is required.')
    }
    const {latitude: lat, longitude: lon} = customer
    if (!isNumeric(lat) || !isNumeric(lon)) {
      throw new Error('Degrees of customer should be numeric.')
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
