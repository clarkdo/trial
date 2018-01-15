import React from 'react'

const RectShape = (
  <symbol id='rect'>
    <rect id='rect' width='700' height='700' rx='1' fill='color' />
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
