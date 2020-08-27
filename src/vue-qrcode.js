import QRCode from 'qr.js/lib/QRCode'
import ErrorCorrectLevel from 'qr.js/lib/ErrorCorrectLevel'

/**
 * Encode UTF16 to UTF8.
 * See: http://jonisalonen.com/2012/from-utf-16-to-utf-8-in-javascript/
 * @param str {string}
 * @returns {string}
 */
function toUTF8String(str) {
  let utf8Str = ''
  for (let i = 0; i < str.length; i++) {
    let charCode = str.charCodeAt(i)
    if (charCode < 0x0080) {
      utf8Str += String.fromCharCode(charCode)
    } else if (charCode < 0x0800) {
      utf8Str += String.fromCharCode(0xc0 | (charCode >> 6))
      utf8Str += String.fromCharCode(0x80 | (charCode & 0x3f))
    } else if (charCode < 0xd800 || charCode >= 0xe000) {
      utf8Str += String.fromCharCode(0xe0 | (charCode >> 12))
      utf8Str += String.fromCharCode(0x80 | ((charCode >> 6) & 0x3f))
      utf8Str += String.fromCharCode(0x80 | (charCode & 0x3f))
    } else {
      // surrogate pair
      i++
      // UTF-16 encodes 0x10000-0x10FFFF by
      // subtracting 0x10000 and splitting the
      // 20 bits of 0x0-0xFFFFF into two halves
      charCode =
        0x10000 + (((charCode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff))
      utf8Str += String.fromCharCode(0xf0 | (charCode >> 18))
      utf8Str += String.fromCharCode(0x80 | ((charCode >> 12) & 0x3f))
      utf8Str += String.fromCharCode(0x80 | ((charCode >> 6) & 0x3f))
      utf8Str += String.fromCharCode(0x80 | (charCode & 0x3f))
    }
  }
  return utf8Str
}

function generatePath(modules, margin = 0) {
  const ops = []
  modules.forEach(function(row, y) {
    let start = null
    row.forEach(function(cell, x) {
      if (!cell && start !== null) {
        // M0 0h7v1H0z injects the space with the move and drops the comma,
        // saving a char per operation
        ops.push(
          `M${start + margin} ${y + margin}h${x - start}v1H${start + margin}z`
        )
        start = null
        return
      }

      // end of row, clean up or skip
      if (x === row.length - 1) {
        if (!cell) {
          // We would have closed the op above already so this can only mean
          // 2+ light modules in a row.
          return
        }
        if (start === null) {
          // Just a single dark module.
          ops.push(`M${x + margin},${y + margin} h1v1H${x + margin}z`)
        } else {
          // Otherwise finish the current line.
          ops.push(
            `M${start + margin},${y + margin} h${x + 1 - start}v1H${start +
              margin}z`
          )
        }
        return
      }

      if (cell && start === null) {
        start = x
      }
    })
  })
  return ops.join('')
}

/**
 * Logo init
 *-------------------
 * @author malayvuong
 *
**/
function maskLogo(renderAs = 'canvas', logo, ctx, size, opacity) {
  if(renderAs === 'canvas') {
    // 1: math logo scale width & height (300 = 46)
    let widthScale = parseInt(size * 46 / 300);
    let position = (size / 2) - (widthScale / 2)
    let centered = (size / 2);
    console.log(opacity / 100);
    //  Load Logo Image
    var img = new Image();
    img.onload = () => {
      //  Set Opacity
      ctx.globalAlpha = (opacity / 100);
      //  Process to draw white circle
      // drawCircle(ctx, centered, widthScale)
      //  Process to draw logo
      ctx.drawImage(img, position, position, widthScale, widthScale)
    }
    img.src = logo;
  }
  function drawCircle(ctx, centered, radius = 50, color = 'white') {
    ctx.beginPath();
    ctx.arc(centered, centered, ((radius / 2) + 2), 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
  }
}

// @vue/component
const QrcodeVue = {
  props: {
    value: {
      type: String,
      required: true,
      default: '',
    },
    classname: {
      type: String,
      default: '',
    },
    size: {
      type: [Number, String], default: 100,
      validator: (s) => isNaN(Number(s)) !== true,
    },
    level: {
      type: String,
      default: 'L',
      validator: (l) => ['L', 'Q', 'M', 'H'].indexOf(l) > -1,
    },
    background: {
      type: String,
      default: '#fff',
    },
    foreground: {
      type: String,
      default: '#000',
    },
    renderas: {
      type: String,
      required: false,
      default: 'canvas',
      validator: (as) => ['canvas', 'svg'].indexOf(as) > -1,
    },
    padding: {
      type: Number,
      default: 10,
    },
    transparent: {
      type: Boolean,
      default: false
    },
    logo: {
      type: String,
      default: null,
    },
    opacity: {
      type: [Number, String], default: 100,
      validator: (s) => isNaN(Number(s)) !== true,
    }
  },
  data() {
    return {
      numCells: 0,
      fgPath: '',
    }
  },
  updated() {
    this.render()
  },
  mounted() {
    this.render()
  },
  methods: {
    render() {
      const { value, size, level, background, foreground, renderas, padding, transparent, logo, opacity } = this
      const _size = size >>> 0 // size to number

      // We'll use type===-1 to force QRCode to automatically pick the best type
      const qrCode = new QRCode(-1, ErrorCorrectLevel[level])
      qrCode.addData(toUTF8String(value))
      qrCode.make()

      const cells = qrCode.modules
      const tileW = (_size - (2 * padding)) / cells.length
      const tileH = (_size - (2 * padding)) / cells.length
      const scale = window.devicePixelRatio || 1

      if (renderas === 'svg') {
        this.numCells = cells.length

        // Drawing strategy: instead of a rect per module, we're going to create a
        // single path for the dark modules and layer that on top of a light rect,
        // for a total of 2 DOM nodes. We pay a bit more in string concat but that's
        // way faster than DOM ops.
        // For level 1, 441 nodes -> 2
        // For level 40, 31329 -> 2
        this.fgPath = generatePath(cells);
      } else {
        const canvas = this.$refs.vrcode
        const ctx = canvas.getContext('2d')

        canvas.height = canvas.width = _size * scale

        ctx.scale(scale, scale)
        ctx.fillStyle = background;
        //  Set background
        if(transparent) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        cells.forEach(function(row, rdx) {
          row.forEach(function(cell, cdx) {
            const w = Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW)
            const h = Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH)
            if(cell) {
              ctx.fillStyle = foreground
            } else {
              if(transparent) {

              }else {
                ctx.fillStyle = background
              }
            }
            if(!cell && transparent) {
              ctx.clearRect(Math.round(cdx * tileW) + padding, Math.round(rdx * tileH) + padding, w, h);
            } else {
              ctx.fillRect(Math.round(cdx * tileW) + padding, Math.round(rdx * tileH) + padding, w, h)
            }
          })
        })

        //  Begin insert logo
        if(logo) {
          maskLogo(renderas, logo, ctx, _size, opacity)
        }
      }
    },
  },
  render(createElement) {
    const {
      classname,
      transparent,
      background,
      foreground,
      size,
      renderas,
      numCells,
      fgPath,
      logo,
      opacity
    } = this

    let logoWidth = (numCells * 46 / 300);
    let logoPosition = (numCells / 2) - (logoWidth / 4);

    return createElement(
      'div',
      {
        class: this.class || classname,
        // attrs: { value, level, background, foreground },
      },
      [
        renderas === 'svg' ? createElement(
              'svg',
              {
                attrs: {
                  height: size,
                  width: size,
                  shapeRendering: 'crispEdges',
                  viewBox: `0 0 ${numCells + 2} ${numCells + 2}`,
                },
                style: { width: size + 'px', height: size + 'px' },
              },
              [
                !transparent ? createElement('path', {
                  attrs: {
                    fill: background,
                    d: `M0,0 h${numCells + 2}v${numCells + 2}H0z`,
                  },
                }) : false,
                createElement('path', {
                  attrs: { transform: 'translate(1, 1)', fill: foreground, d: fgPath },
                }),
                logo ? createElement('image', {
                  attrs: {
                    href: logo, opacity: (opacity / 100),
                    x: logoPosition, y: logoPosition,
                    height: logoWidth, width: logoWidth
                  },
                }) : false
              ]
            )
          : createElement(
              'canvas',
              {
                attrs: { height: size, width: size },
                style: { width: size + 'px', height: size + 'px' },
                ref: 'vrcode',
              },
              []
            ),
      ]
    )
  },
}

export default QrcodeVue
