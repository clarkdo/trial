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

  /**
   * Calculate if customer is within a given distance(km)
   *
   * @param {Object} customer
   * @param {Number} max distance between office and customer
   * @returns {Boolean} If the distance is within the given
   */
  distanceWithin (customer, maxKM) {
    if (!isNumeric(maxKM)) {
      throw new Error('Max distance should be numeric.')
    }
    return this.distance(customer).lessThan(maxKM)
  }

  /**
   * Calculate distance from customer to office, use Great-circle distance
   *
   * @param {Object} customer
   * @returns {Object} A decimal object corresponding to distance
   */
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

  /**
   * Convert a degree to radian
   *
   * @param {Number} degree
   * @returns {Number} radian
   */
  toRadian (degree) {
    return degree.mul(Math.PI).div(180)
  }
}
