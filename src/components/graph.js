import React, { Component } from 'react'
import GraphView from './graph-view'
import GraphConfig from './graph-config.js'
import defaultInput from '../input'

const NODE_KEY = 'id' // Key used to identify nodes
const RECT_TYPE = 'rect'
const RECT_EDGE_TYPE = 'rectLink'

export default class Graph extends Component {
  constructor (props) {
    super(props)
    this.state = {
      graph: this.normalize(defaultInput)
    }
    window.visualize = input => {
      input = this.normalize(input)
      this.setState({graph: {
        nodes: input.nodes,
        links: input.links
      }})
    }
  }

  normalize (input) {
    const result = {
      nodes: [],
      links: []
    }
    if (input) {
      let id = 1
      const nodes = input.nodes
      const links = input.links
      for (const title in (nodes || {})) {
        const node = nodes[title]
        if (node) {
          node[NODE_KEY] = id++
          node.title = title
          node.type = node.type || RECT_TYPE
          result.nodes.push(node)
        }
      }
      for (const index in (links || [])) {
        const link = links[index]
        if (link) {
          result.links.push({
            source: nodes[link.source] && nodes[link.source][NODE_KEY],
            target: nodes[link.target] && nodes[link.target][NODE_KEY],
            type: link.type || RECT_EDGE_TYPE
          })
        }
      }
    }
    return result
  }

  // Helper to find the index of a given node
  getNodeIndex (searchNode) {
    return this.state.graph.nodes.findIndex(node => {
      return node[NODE_KEY] === searchNode[NODE_KEY]
    })
  }

  // Helper to find the index of a given link
  getLinkIndex (searchLink) {
    return this.state.graph.links.findIndex(link => {
      return (
        link.source === searchLink.source && link.target === searchLink.target
      )
    })
  }

  // Given a nodeKey, return the corresponding node
  getViewNode = nodeKey => {
    const searchNode = {}
    searchNode[NODE_KEY] = nodeKey
    const i = this.getNodeIndex(searchNode)
    return this.state.graph.nodes[i]
  }

  /*
   * Render
   */

  render () {
    const nodes = this.state.graph.nodes
    const links = this.state.graph.links
    const NodeTypes = GraphConfig.NodeTypes
    const LinkTypes = GraphConfig.LinkTypes

    return (
      <div id='graph' style={{height: '100%', width: '100%'}}>
        <GraphView
          ref={el => (this.GraphView = el)}
          nodeSize={80}
          nodeKey={NODE_KEY}
          nodes={nodes}
          links={links}
          nodeTypes={NodeTypes}
          linkTypes={LinkTypes}
          getViewNode={this.getViewNode}
        />
      </div>
    )
  }
}
