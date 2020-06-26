# vqrcode (Vue QR Code)

A Vue component to generate QR Code and download.

## Table of contents

- [Getting started](#getting-started)
- [Props](#props)
- [Browser support](#browser-support)
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
    :padding="10"
></vrcode>
```

## Props

### value

- Type: `String`
- Default: `undefined`

The value of the QR code.

### options

- Type: `Object`
- Default: `undefined`

The options for the QR code generator. References the [node-qrcode's options](https://github.com/soldair/node-qrcode#qr-code-options).

### tag

- Type: `String`
- Default: `'canvas'`
- Options: `'canvas'`, `'img'` and other element tags.

The tag name of the component's root element.

## Versioning

Maintained under the [Semantic Versioning guidelines](https://semver.org/).

## License

[MIT](https://opensource.org/licenses/MIT) © [Malayvuong](https://malayvuong.com/)

[⬆ back to top](#table-of-contents)