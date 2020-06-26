# vqrcode (Vue QR Code)

A Vue component to generate QR Code and download.

![img](./assets/screenshot.png)

## Table of contents

- [Getting started](#getting-started)
- [Props](#props)
- [Milestone](#milestone)
- [Versioning](#versioning)
- [License](#license)

## Getting started

### Install
```shell
npm i vqrcode
```

### Usage
```js
import Vue from 'vue';
import vrcode from 'vrcode';

Vue.component('vrcode', vrcode);
```
### Example
```html
<vrcode
    :download="{
        text: 'Download',
        filename: 'file-name.png',
        visible: true, type: 'image/png'
    }"
    value="A Vue component to generate QR Code and download."
    :options="{
        size: 200,
        level: 'Q'
    }"
></vrcode>
```

## Props

### value

- Type: `String`
- Default: `undefined`

The value of the QR code.

### download

Passing `download` props, to show download button, it support:

- Type: `Object`

- `text` - button inner text
- `visible` - setting download button visible or not
- `style` - setting download button style
- `class` - setting download button class name
- `type` - image type, such as image/png; use mime type for exactly force download
- `filename` - file name to download

You can only download the qrcode to image by using type: `canvas`

### type

- Type: `String`
- Default: `'canvas'`

You can use `canvas` or `svg`. But SVG not support to download now.

### options

- Type: `Object`
- Values:

  - `level`

    - Type: `String`
    - Default: `'L'`

    Possible levels are shown below:
    | Level            | Error resistance |
    |------------------|:----------------:|
    | **L** (Low)      | **~7%**          |
    | **M** (Medium)   | **~15%**         |
    | **Q** (Quartile) | **~25%**         |
    | **H** (High)     | **~30%**         |

  - `padding`

    - Type: `Number`
    - Default: `10`

    **This is padding border of image (Because users is difficult to scan with dark mode/dark background, so we need an white padding/border)**


  - `background`

    - Type: `String`
    - Default: `'#fff'`

  - `foreground`

    - Type: `String`
    - Default: `'#000'`

  - `className`

    - Type: `String`
    - Default: `''`

## Milestone

- Transparent background
- PNG transparent background download
- With centered logo

## Versioning

Maintained under the [Semantic Versioning guidelines](https://semver.org/).

## License

[MIT](https://opensource.org/licenses/MIT) © [Malayvuong](https://malayvuong.com/)

[⬆ back to top](#table-of-contents)