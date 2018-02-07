export function styleToString (style) {
  return Object.keys(style)
    .map(function (k) {
      const key = k.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
      return `${key}:${style[k]}`
    })
    .join(';')
}

export function makeStyles (
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
