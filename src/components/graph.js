import React, { Component } from 'react'
import GraphView from './graph-view'
import GraphConfig from './graph-config.js'
import defaultInput from '../input'

const NODE_KEY = 'id' // Key used to identify nodes
const RECT_TYPE = 'rect'
const RECT_LINK_TYPE = 'rectLink'

export default class Graph extends Component {
  constructor (props) {
    super(props)
    this.state = {
      graph: this.normalize(defaultInput)
    }
    window.visualize = input => {
      this.setState({graph: this.normalize(input)})
    }
  }

  normalize (input) {
    const result = {
      nodes: [],
      links: []
    }
    if (input) {
      let id = 1
      const nodes = input.nodes || {}
      const links = input.links || []
      for (const title in nodes) {
        const node = nodes[title]
        if (node) {
          node[NODE_KEY] = id++
          node.title = title
          node.type = node.type || RECT_TYPE
          result.nodes.push(node)
        }
      }
      for (const index in links) {
        const link = links[index]
        if (link) {
          result.links.push({
            source: nodes[link.source] && nodes[link.source][NODE_KEY],
            target: nodes[link.target] && nodes[link.target][NODE_KEY],
            type: link.type || RECT_LINK_TYPE
          })
        }
      }
    }
    return result
  }

  // Given a nodeKey, return the corresponding node
  getViewNode = nodeKey => this.state.graph.nodes.find(node => node[NODE_KEY] === nodeKey)

  /*
   * Render
   */
  render () {
    return (
      <div id='graph' style={{height: '100%', width: '100%'}}>
        <GraphView
          ref={el => (this.GraphView = el)}
          nodeSize={40}
          nodeKey={NODE_KEY}
          nodes={this.state.graph.nodes}
          links={this.state.graph.links}
          nodeTypes={GraphConfig.NodeTypes}
          linkTypes={GraphConfig.LinkTypes}
          getViewNode={this.getViewNode}
        />
      </div>
    )
  }
}
