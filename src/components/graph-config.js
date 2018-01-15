import React from 'react'

const CircleShape = (
  <symbol id='circle'>
    <circle cx='50' cy='50' r='45' />
  </symbol>
)

const RectShape = (
  <symbol id='rect'>
    <rect id='rect' width='700' height='700' rx='1' fill='color' />
  </symbol>
)

const CircleLinkShape = (
  <symbol id='circleLink' />
)

const RectLinkShape = (
  <symbol id='rectLink' />
)

export default {
  NodeTypes: {
    circle: {
      typeText: 'None',
      shapeId: '#circle',
      shape: CircleShape
    },
    rect: {
      typeText: 'Rect',
      shapeId: '#rect',
      shape: RectShape
    }
  },
  LinkTypes: {
    circleLink: {
      shapeId: '#circleLink',
      shape: CircleLinkShape
    },
    rectLink: {
      shapeId: '#rectLink',
      shape: RectLinkShape
    }
  }
}
