const reader = require('reader')
const { resolve } = require('path')

describe('reader', () => {
  test('read a non-existent file', async () => {
    try {
      await reader.read('non-existent.txt')
    } catch (e) {
      expect(e.message).toEqual('Path:non-existent.txt is not a valid and existed path')
    }
  })

  test('read a non-existent file', async () => {
    try {
      await reader.read('non-existent.txt')
    } catch (e) {
      expect(e.message).toEqual('Path:non-existent.txt is not a valid and existed path')
    }
  })

  test('read an illegal json format file', async () => {
    try {
      await reader.read(resolve(__dirname, 'data', 'illegal-json.txt'))
    } catch (e) {
      expect(e.message).toMatch('Data file contains invalid json:')
    }
  })

  test('read a lack id field file', async () => {
    try {
      await reader.read(resolve(__dirname, 'data', 'lack-id.txt'))
    } catch (e) {
      expect(e.message).toMatch('user_id is required in customer')
    }
  })

  test('read a lack name field file', async () => {
    try {
      await reader.read(resolve(__dirname, 'data', 'lack-name.txt'))
    } catch (e) {
      expect(e.message).toMatch('name of user:1 is required')
    }
  })

  test('read a wrong latitude type field file', async () => {
    try {
      await reader.read(resolve(__dirname, 'data', 'wrong-type-lat.txt'))
    } catch (e) {
      expect(e.message).toMatch('latitude of user:2 should be a required number')
    }
  })

  test('read a wrong longitude type field file', async () => {
    try {
      await reader.read(resolve(__dirname, 'data', 'wrong-type-lon.txt'))
    } catch (e) {
      expect(e.message).toMatch('longitude of user:2 should be a required number')
    }
  })

  test('read a normal file', async () => {
    const data = await reader.read(resolve(__dirname, 'data', 'normal.txt'))
    expect(data).toHaveLength(4)
  })
})
