const data = [
  ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
  ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
  ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
  ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
  ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
  ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
  ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
  ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#']
]

function print (data) {
  for (let i = 0; i < data.length; i++) {
    let line = ''
    for (let j = 0; j < data[i].length; j++) {
      line += data[i][j]
    }
    console.log(line)
  }
}

function isInBoundary (x, y, max) {
  return x >= 0 && x < max.x && y >= 0 && y < max.y
}

function getSiblings (x, y) {
  return [
    {x: x, y: y - 1}, // above
    {x: x, y: y + 1}, // blow
    {x: x - 1, y: y}, // left
    {x: x + 1, y: y} // right
  ]
}
function isTraversed (traversed, x, y) {
  if (!traversed[x]) {
    traversed[x] = []
    return false
  } else if (traversed[x][y] === true) {
    return true
  }
}

function floodFill (data, newValue) {
  if (!data || data.length === 0) {
    return
  }
  const stack = [{x: 0, y: 0}]
  const traversed = []
  const max = {x: data.length, y: data[0].length}

  while (stack.length > 0) {
    const { x, y } = stack.pop()
    if (isTraversed(traversed, x, y)) {
      continue
    } else if (data[x][y]) {
      data[x][y] = newValue
    }
    traversed[x][y] = true

    for (let sibling of getSiblings(x, y)) {
      if (isInBoundary(sibling.x, sibling.y, max)) {
        stack.push(sibling)
      }
    }
  }
}

function floodFillRecursive (x, y, newValue, data, traversed) {
  if (x < 0 || x >= data.length || y < 0 || y >= data[x].length) {
    return
  }
  if (isTraversed(traversed, x, y)) {
    return
  } else if (data[x][y]) {
    data[x][y] = newValue
  }
  traversed[x][y] = true
  floodFillRecursive(x - 1, y, newValue, data, traversed)
  floodFillRecursive(x, y - 1, newValue, data, traversed)
  floodFillRecursive(x + 1, y, newValue, data, traversed)
  floodFillRecursive(x, y + 1, newValue, data, traversed)
}

print(data)
floodFill(data, '$')
print(data)
floodFillRecursive(0, 0, '*', data, [])
print(data)
