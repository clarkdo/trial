import renderer from 'react-test-renderer'
import GraphConfig from 'components/graph-config'

describe('graph config', () => {
  test('contain two types', () => {
    expect(GraphConfig).toHaveProperty('NodeTypes')
    expect(GraphConfig).toHaveProperty('LinkTypes')
  })

  test('node types', () => {
    const nodeTypes = GraphConfig.NodeTypes
    expect(nodeTypes).toHaveProperty('rect')

    const rect = nodeTypes.rect
    expect(rect).toMatchObject({
      typeText: 'Rect',
      shapeId: '#rect'
    })

    const shape = renderer.create(rect.shape)
    expect(shape).toMatchSnapshot()
  })

  test('link types', () => {
    const linkTypes = GraphConfig.LinkTypes
    expect(linkTypes).toHaveProperty('rectLink')

    const rectLink = linkTypes.rectLink
    expect(rectLink).toMatchObject({
      shapeId: '#rectLink'
    })

    const shape = renderer.create(rectLink.shape)
    expect(shape).toMatchSnapshot()
  })
})
