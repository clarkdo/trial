import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import GraphView from 'components/graph-view'
import GraphConfig from 'components/graph-config.js'
import { nodes, links } from './graph.data'

describe('graph view', () => {
  let view
  beforeAll(() => {
    Enzyme.configure({ adapter: new Adapter() })
    view = mount(
      <GraphView
        nodeSize={50}
        nodeKey={'id'}
        nodes={nodes}
        links={links}
        nodeTypes={GraphConfig.NodeTypes}
        linkTypes={GraphConfig.LinkTypes}
        getViewNode={id => nodes.find(node => node.id === id)}
      />)
  })

  test('defs of svg', () => {
    expect(view.find('defs')).toHaveLength(1)
    expect(view.find('defs symbol')).toHaveLength(2)
    expect(view.find('defs symbol rect#rect').props()).toMatchObject({
      id: 'rect',
      width: '100%',
      height: '100%',
      rx: '5'
    })
  })

  test('view of svg graph', () => {
    expect(view.find('#view')).toHaveLength(1)
    expect(view.find('#view #entities')).toHaveLength(1)
    expect(view.find('#view #entities').text()).toBe('abcdef')

    const html = view.find('#view #entities').html()
    expect(html.match(/<g class="node"/g).length).toBe(6)
    expect(html.match(/<g class="link"/g).length).toBe(6)
  })

  test('props are set', () => {
    const props = view.props()
    expect(props.nodes).toHaveLength(6)
    expect(props.links).toHaveLength(6)
    expect(props).toMatchObject({
      nodeSize: 50,
      nodeKey: 'id',
      nodeTypes: GraphConfig.NodeTypes,
      linkTypes: GraphConfig.LinkTypes,
      maxTitleChars: 5,
      transitionTime: 150,
      primary: 'dodgerblue',
      light: '#FFF',
      dark: '#000',
      background: '#F9F9F9',
      linkArrowSize: 6
    })
  })

  test('base styles', () => {
    const props = view.props()
    const state = view.state()
    expect(state).toHaveProperty('viewTransform')
    expect(state).toHaveProperty('styles.node')
    expect(state.styles.node).toMatchObject({
      base: {
        color: props.primary,
        stroke: props.light,
        fill: props.light,
        filter: 'url(#dropshadow)',
        strokeWidth: '0.5px',
        cursor: 'pointer'
      }
    })
  })

  afterAll(() => {
    view.unmount()
  })
})
