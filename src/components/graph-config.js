import React from 'react'

const RectShape = (
  <symbol id='rect'>
    <rect id='rect' width='100%' height='100%' rx='5' />
  </symbol>
)

const RectLinkShape = (
  <symbol id='rectLink' />
)

export default {
  NodeTypes: {
    rect: {
      typeText: 'Rect',
      shapeId: '#rect',
      shape: RectShape
    }
  },
  LinkTypes: {
    rectLink: {
      shapeId: '#rectLink',
      shape: RectLinkShape
    }
  }
}
