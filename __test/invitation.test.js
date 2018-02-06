const Invitation = require('invitation')

describe('invitation', () => {
  const invitation = new Invitation()
  beforeAll(() => {
    invitation.reader = {read: jest.fn()}
    invitation.reader.read.mockReturnValue([
      { latitude: '52.986375',
        user_id: 12,
        name: 'Christina McArdle',
        longitude: '-6.043701' },
      { latitude: '51.92893',
        user_id: 1,
        name: 'Alice Cahill',
        longitude: '-10.27699' },
      { latitude: '51.8856167',
        user_id: 3,
        name: 'Jack Enright',
        longitude: '-8.5072391' },
      { latitude: '53.807778',
        user_id: 28,
        name: 'Charlie Halligan',
        longitude: '-7.714444' }
    ])
    invitation.office = {distanceWithin: jest.fn()}
    invitation.office.distanceWithin.mockImplementation((c, km) => c.user_id < km)
  })

  test('fetch customer list', async () => {
    const { reader, customers } = await invitation.fetch()
    expect(reader.read).toHaveBeenCalledTimes(1)
    expect(customers).toHaveLength(4)
  })

  test('sort customer list by id', () => {
    const { customers } = invitation.sortById()
    expect(customers).toHaveLength(4)
    expect(customers[0]).toHaveProperty('user_id', 1)
    expect(customers[1]).toHaveProperty('user_id', 3)
    expect(customers[2]).toHaveProperty('user_id', 12)
    expect(customers[3]).toHaveProperty('user_id', 28)
  })

  test('get customers with a distance', () => {
    const { customers } = invitation.withinKM(5)
    expect(customers).toHaveLength(2)
    expect(customers[0]).toHaveProperty('user_id', 1)
    expect(customers[1]).toHaveProperty('user_id', 3)
  })

  test('get customers with invalid distance', () => {
    expect(() => {
      invitation.withinKM(null)
    }).toThrow('"km" should be numeric.')
  })

  test('print list of invited customers', () => {
    const log = console.log
    console.log = jest.fn()

    invitation.printInvited()
    expect(console.log).toHaveBeenCalledTimes(2)

    console.log = log
  })

  test('invite customers within 100km', async () => {
    const { customers } = await invitation.invite100KM()
    expect(customers).toHaveLength(4)
    expect(customers[0]).toHaveProperty('user_id', 1)
    expect(customers[1]).toHaveProperty('user_id', 3)
    expect(customers[2]).toHaveProperty('user_id', 12)
    expect(customers[3]).toHaveProperty('user_id', 28)
  })
})
