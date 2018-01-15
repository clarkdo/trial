import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import Radium from 'radium'
import { defaults } from 'lodash'

function styleToString (style) {
  return Object.keys(style)
    .map(function (k) {
      let key = k.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
      return `${key}:${style[k]}`
    })
    .join(';')
}

function makeStyles (
  primary = 'dodgerblue',
  light = 'white',
  dark = 'black',
  background = '#F9F9F9'
) {
  return {
    wrapper: {
      base: {
        height: '100%',
        margin: 0,
        display: 'flex',
        boxShadow: 'none',
        opacity: 1,
        background: background
      }
    },
    svg: {
      base: {
        alignContent: 'stretch',
        flex: 1
      }
    },
    node: {
      base: {
        color: primary,
        stroke: light,
        fill: light,
        filter: 'url(#dropshadow)',
        strokeWidth: '0.5px',
        cursor: 'pointer'
      }
    },
    shape: {
      fill: 'inherit',
      stroke: dark,
      strokeWidth: '0.5px'
    },
    text: {
      base: {
        fill: dark,
        stroke: dark
      }
    },
    link: {
      base: {
        color: dark,
        stroke: dark,
        strokeWidth: '2px',
        markerEnd: 'url(#end-arrow)',
        cursor: 'pointer'
      }
    },
    arrow: {
      fill: dark
    }
  }
}

class GraphView extends Component {
  constructor (props) {
    super(props)

    // Bind methods
    this.setZoom = this.setZoom.bind(this)
    this.getPathDescription = this.getPathDescription.bind(this)
    this.getNodeTransformation = this.getNodeTransformation.bind(this)
    this.getNodeStyle = this.getNodeStyle.bind(this)
    this.getLinkStyle = this.getLinkStyle.bind(this)
    this.getTextStyle = this.getTextStyle.bind(this)
    this.renderNodeText = this.renderNodeText.bind(this)
    this.renderLinks = this.renderLinks.bind(this)
    this.renderNodes = this.renderNodes.bind(this)
    this.renderView = this.renderView.bind(this)

    this.state = {
      viewTransform: d3.zoomIdentity,
      styles: makeStyles(
        props.primary,
        props.light,
        props.dark,
        props.background
      )
    }

    this.zoom = d3.zoom()
      .on('zoom', () => this.setState({
        viewTransform: d3.event.transform
      }))
  }

  componentDidMount () {
    // On the initial load, the 'view' <g> doesn't exist
    // until componentDidMount. Manually render the first view.
    this.renderView()
    this.setZoom(this.state.viewTransform)
  }

  componentWillUnmount () {
    // Remove window event listeners
    d3.select(window)
      .on('keydown', null)
      .on('click', null)
  }

  // Programmatically resets zoom
  setZoom (k = 1, x = 0, y = 0, dur = 0) {
    const t = d3.zoomIdentity.translate(x, y).scale(k)

    d3.select(this.viewWrapper)
      .select('svg')
      .transition()
      .duration(dur)
      .call(this.zoom.transform, t)
  }

  getPathDescription (link) {
    let src = this.props.getViewNode(link.source)
    let trg = this.props.getViewNode(link.target)

    if (src && trg) {
      const from = this.getLinePoint(src, this.getTheta(src, trg) * 180 / Math.PI)
      const to = this.getLinePoint(trg, this.getTheta(trg, src) * 180 / Math.PI)
      return `M${from.x},${from.y}L${to.x},${to.y}`
    }
    console.warn('Unable to get source or target for ', link)
    return ''
  }

  // any objects with x & y properties
  getTheta (pt1, pt2) {
    const xComp = pt2.x + pt2.width / 2 - pt1.x - pt1.width / 2
    const yComp = pt2.y + pt2.height / 2 - pt1.y - pt1.height / 2
    const theta = Math.atan2(yComp, xComp)
    return theta
  }

  getLinePoint (link, theta) {
    if (theta >= -45 && theta < 45) {
      return { x: link.x + link.width, y: link.y + link.height / 2 }
    } else if (theta >= 45 && theta < 135) {
      return { x: link.x + link.width / 2, y: link.y + link.height }
    } else if (theta >= 135 || theta < -135) {
      return { x: link.x, y: link.y + link.height / 2 }
    } else if (theta >= -135 || theta < -45) {
      return { x: link.x + link.width / 2, y: link.y }
    }
  }

  // Returns a d3 transformation string from node data
  getNodeTransformation (node) {
    return 'translate(' + node.x + ',' + node.y + ')'
  }

  getNodeStyle (d) {
    if (d.color) {
      d.fill = d.color
    }
    return styleToString(defaults({ ...d }, this.state.styles.node.base))
  }

  getLinkStyle (d) {
    return styleToString(defaults({ ...d }, this.state.styles.link.base))
  }

  getTextStyle (d) {
    return styleToString(this.state.styles.text.base)
  }

  // Renders 'node.title' into node element
  renderNodeText (d, domNode) {
    const d3Node = d3.select(domNode)
    const style = this.getTextStyle(d)
    let title = d.title ? d.title : ' '
    title =
      title.length <= this.props.maxTitleChars
        ? title
        : `${title.substring(0, this.props.maxTitleChars)}...`

    d3Node.selectAll('text').remove()
    d3Node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('style', style)
      .attr('dx', d.width / 2)
      .attr('dy', d.height / 2)
      .text(title)
  }

  // Renders 'links' into entities element
  renderLinks (entities, links) {
    const self = this

    // Join Data
    links = entities.selectAll('g.link').data(links, function (d) {
      // IMPORTANT: this snippet allows D3 to detect updated vs. new data
      return `${d.source}:${d.target}`
    })

    // Remove Old
    links.exit()
      .transition()
      .duration(self.props.transitionTime)
      .attr('opacity', 0)
      .remove()

    // Add New
    links.enter()
      .append('g')
      .classed('link', true)
      .attr('opacity', 0)
      .transition()
      .duration(self.props.transitionTime)
      .each(function (d, i, els) {
        self.props.renderLink(self, this, d, i, els)
      })
      .attr('opacity', 1)

    // Merge
    links.enter().merge(links)

    // Update All
    links.each(function (d, i, els) {
      self.props.renderLink(self, this, d, i, els)
    })
  }

  // Renders 'nodes' into entities element
  renderNodes (entities, nodes) {
    const self = this
    const nodeKey = this.props.nodeKey

    // Join Data
    nodes = entities.selectAll('g.node').data(nodes, function (d) {
      // IMPORTANT: this snippet allows D3 to detect updated vs. new data
      return d[nodeKey]
    })

    // Animate/Remove Old
    nodes.exit()
      .transition()
      .duration(self.props.transitionTime)
      .attr('opacity', 0)
      .remove()

    // Add New
    nodes.enter()
      .append('g')
      .classed('node', true)
      .attr('opacity', 0)
      .transition()
      .duration(self.props.transitionTime)
      .each(function (d, i, els) {
        self.props.renderNode(self, this, d, i, els)
      })
      .attr('opacity', 1)

    // Merge
    nodes.enter().merge(nodes)

    // Update All
    nodes.each(function (d, i, els) {
      self.props.renderNode(self, this, d, i, els)
    })
  }

  // Renders 'graph' into view element
  // All DOM updates within 'view' are managed by D3
  renderView () {
    const nodes = this.props.nodes
    const links = this.props.links

    const entities = d3.select(this.entities)

    this.renderNodes(entities, nodes)
    this.renderLinks(entities, links)
  }

  render () {
    this.renderView()
    const styles = this.state.styles

    return (
      <div
        id='viewWrapper'
        ref={el => (this.viewWrapper = el)}
        style={[
          styles.wrapper.base,
          this.props.style
        ]}
      >
        <svg id='svgRoot' style={styles.svg.base}>
          {this.props.renderDefs(this)}
          <g id='view' ref={el => (this.view = el)}>
            {this.props.renderBackground(this)}
            <g id='entities' ref={el => (this.entities = el)} />
          </g>
        </svg>
      </div>
    )
  }
}

GraphView.propTypes = {
  nodeKey: PropTypes.string.isRequired,
  nodes: PropTypes.array.isRequired,
  links: PropTypes.array.isRequired,
  nodeTypes: PropTypes.object.isRequired,
  linkTypes: PropTypes.object.isRequired,
  getViewNode: PropTypes.func.isRequired,
  renderLink: PropTypes.func,
  renderNode: PropTypes.func,
  renderDefs: PropTypes.func,
  renderBackground: PropTypes.func,
  maxTitleChars: PropTypes.number, // Per line.
  transitionTime: PropTypes.number, // D3 Enter/Exit duration
  primary: PropTypes.string,
  light: PropTypes.string,
  dark: PropTypes.string,
  background: PropTypes.string,
  style: PropTypes.object,
  nodeSize: PropTypes.number,
  linkArrowSize: PropTypes.number
}

GraphView.defaultProps = {
  maxTitleChars: 5,
  transitionTime: 150,
  primary: 'dodgerblue',
  light: '#FFF',
  dark: '#000',
  background: '#F9F9F9',
  nodeSize: 40,
  linkArrowSize: 6,

  renderLink: (graphView, domNode, datum, index, elements) => {
    d3.select(domNode).append('path')
    d3.select(domNode).append('use')

    const style = graphView.getLinkStyle(datum)
    d3.select(domNode)
      .attr('style', style)
      .select('use')
      .attr('xlink:href', function (d) {
        return graphView.props.linkTypes[d.type].shapeId
      })

    d3.select(domNode)
      .select('path')
      .attr('d', graphView.getPathDescription)
  },

  renderNode: (graphView, domNode, datum, index, elements) => {
    d3.select(domNode)
      .append('use')
      .classed('shape', true)
      .attr('width', datum.width || graphView.props.nodeSize)
      .attr('height', datum.height || graphView.props.nodeSize)
    let style = graphView.getNodeStyle(datum)
    d3.select(domNode)
      .attr('style', style)
      .select('use.shape')
      .attr('xlink:href', function (d) {
        return graphView.props.nodeTypes[d.type].shapeId
      })

    graphView.renderNodeText(datum, domNode)

    d3.select(domNode).attr('transform', graphView.getNodeTransformation)
  },

  renderDefs: graphView => {
    const styles = graphView.state.styles
    const props = graphView.props

    let defIndex = 0
    let graphConfigDefs = []

    Object.keys(props.nodeTypes).forEach(function (type) {
      defIndex += 1
      graphConfigDefs.push(
        React.cloneElement(props.nodeTypes[type].shape, { key: defIndex })
      )
    })

    Object.keys(props.linkTypes).forEach(function (type) {
      defIndex += 1
      graphConfigDefs.push(
        React.cloneElement(props.linkTypes[type].shape, { key: defIndex })
      )
    })

    return (
      <defs>
        {graphConfigDefs}

        <marker
          id='end-arrow'
          key='end-arrow'
          viewBox={`0 -${props.linkArrowSize / 2} ${props.linkArrowSize} ${
            props.linkArrowSize
          }`}
          refX={`${props.linkArrowSize - 1}`}
          markerWidth={`${props.linkArrowSize}`}
          markerHeight={`${props.linkArrowSize}`}
          orient='auto'
        >
          <path
            style={styles.arrow}
            d={`M0,-${props.linkArrowSize / 2}L${
              props.linkArrowSize
            },0L0,${props.linkArrowSize / 2}`}
          />
        </marker>
        <filter id='dropshadow' key='dropshadow' height='130%'>
          <feGaussianBlur in='SourceAlpha' stdDeviation='3' />
          <feOffset dx='2' dy='2' result='offsetblur' />
          <feComponentTransfer>
            <feFuncA type='linear' slope='0.1' />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in='SourceGraphic' />
          </feMerge>
        </filter>
      </defs>
    )
  },

  renderBackground: graphView => {
    return (
      <rect
        className='background'
        width='100%'
        height='100%'
        fill='url(#grid)'
      />
    )
  }
}

export default Radium(GraphView)
