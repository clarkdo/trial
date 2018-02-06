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

  test('read an invalid json format file', async () => {
    try {
      await reader.read(resolve(__dirname, 'data', 'error-format.txt'))
    } catch (e) {
      expect(e.message).toMatch('error-format.txt contains invalid json.')
    }
  })

  test('read a normal file', async () => {
    const data = await reader.read(resolve(__dirname, 'data', 'normal.txt'))
    expect(data).toHaveLength(4)
  })
})
