const Office = require('office')

describe('office', () => {
  const office = new Office()

  test('create office with default degrees', () => {
    const { latitude, longitude } = new Office()
    expect(latitude.equals(53.339405)).toBeTruthy()
    expect(longitude.equals(-6.257664)).toBeTruthy()
  })

  test('create office with custom degrees', () => {
    const { latitude, longitude } = new Office(12.345, -67.89)
    expect(latitude.equals(12.345)).toBeTruthy()
    expect(longitude.equals(-67.89)).toBeTruthy()
  })

  test('calculate distance - null customer', () => {
    try {
      office.distance()
    } catch (e) {
      expect(e.message).toEqual('Customer in distance is required.')
    }
  })

  test('calculate distance - invalid degrees', () => {
    try {
      office.distance({latitude: 'a'})
    } catch (e) {
      expect(e.message).toEqual('Degrees of customer should be numeric.')
    }

    try {
      office.distance({latitude: 1.23})
    } catch (e) {
      expect(e.message).toEqual('Degrees of customer should be numeric.')
    }
  })

  test('calculate distance', () => {
    const distance = office.distance({ latitude: 50, longitude: -6 })
    expect(distance.toFixed(6)).toBe('371.749623')
  })

  test('judge if distance is less than a null distance', () => {
    try {
      office.distanceWithin({ latitude: 50, longitude: -6 })
    } catch (e) {
      expect(e.message).toEqual('Max distance should be numeric.')
    }
  })

  test('judge if distance is less than a max distance', () => {
    const isWithin = office.distanceWithin({ latitude: 50, longitude: -6 }, 300)
    expect(isWithin).toBe(false)
  })
})
