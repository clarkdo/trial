import React, { Component } from 'react'
import ReactDOM from 'react-dom'// Configures node/link types
import Graph from './components/graph'

// To bootstrap this example into the Document
class App extends Component {
  render () {
    return <Graph />
  }
}
if (typeof window !== 'undefined') {
  window.onload = function () {
    ReactDOM.render(<App />, document.getElementById('content'))
  }
}
