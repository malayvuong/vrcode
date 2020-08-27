<h1 align="center">vrcode (Vue QR Code)</h1>

<p align="center">
  <a href="https://circleci.com/gh/malayvuong/vrcode/tree/dev"><img src="https://img.shields.io/circleci/project/github/malayvuong/vrcode/dev.svg?sanitize=true" alt="Build Status"></a>
  <a href="https://npmcharts.com/compare/@ispa.io/vrcode?minimal=true"><img src="https://img.shields.io/npm/dm/@ispa.io/vrcode.svg?sanitize=true" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/@ispa.io/vrcode"><img src="https://img.shields.io/npm/v/@ispa.io/vrcode.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.npmjs.com/package/@ispa.io/vrcode"><img src="https://img.shields.io/npm/l/@ispa.io/vrcode.svg?sanitize=true" alt="License"></a>
  <a href="https://m.me/malayvuong"><img src="https://img.shields.io/badge/chat-messenger-green" alt="Chat"></a>
</p>

A Vue component to generate QR Code and download.

<img src="./assets/screenshot.png" alt=" screenshot ">

## Table of contents

- [Getting started](#getting-started)
- [Props](#props)
- [Milestone](#milestone)
- [Versioning](#versioning)
- [License](#license)

## Getting started

### Install
```shell
npm i @ispa.io/vrcode     // npm
yarn add @ispa.io/vrcode  //  yarn
```

### Usage
```js
import Vue from 'vue';
import vrcode from '@ispa.io/vrcode'

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

- Type: `String` or `Object`
- Default: `undefined`

The value of the QR code. `Object` type used for some helpers tool below.

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

### transparent

- Type: `Boolean`
- Default: `false`

Transparent background for canvas and download png image. If `transparent` is setted, `background` option will not work.

**Notes: If after you run `npm update` but the QR Code not generate transparent background, please run `npm clean-install` and run build again.**

### logo
- Type: `String`
- Default: `null`

Your Brand Logo URL.

### opacity
- Type: `Number`
- Default: `100`

Opacity of Logo, by default 100 ~ `opacity: 1`. We will division this number to 100 and set opacity to it.

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

    **This is padding border of image (Because users is difficult to scan with dark mode/dark background, so we need a white padding/border)**


  - `background`

    - Type: `String`
    - Default: `'#fff'`

  - `foreground`

    - Type: `String`
    - Default: `'#000'`

  - `className`

    - Type: `String`
    - Default: `''`

### Helpers
#### What are helpers?
Helpers are an easy way to create QrCodes that cause a reader to perform a certain action when scanned.

#### Email
This helper generates an e-mail qrcode that is able to fill in the e-mail address, subject, and body.

```html
<vrcode
  :value="{
    address: 'email@example.com',
    subject: 'Hello',
    body: 'This is body'
  }"
  helpers="email"
></vrcode>
```

#### Call a number
This helper generates a QrCode that can be scanned and then dials a number.

```html
<vrcode
  value="+1 98-765-43-21"
  helpers="call"
></vrcode>
```

#### SMS (Text Messages)
This helper makes SMS messages that can be prefilled with the send to address and body of the message.

```html
<vrcode
  :value="{
    number: '+1 98-765-43-21',
    message: 'Hello, this message can be null'
  }"
  helpers="sms"
></vrcode>
```

#### Geo
This helper generates a latitude and longitude that a phone can read and opens the location in Google Maps or similar app.

```html
<vrcode
  :value="{
    lng: 10.7800965,
    lat: 106.6854548,
    name: 'QR Guiding'
  }"
  helpers="geo"
></vrcode>
```

#### Wifi
This helpers makes scannable QrCodes that can connect a phone to a WiFI network.

```html
<vrcode
  :value="{
    encrypt: 'WPA',
    ssid: 'Your SSID or Network Name',
    password: 'Your-Wifi-Password',
    hidden: true
  }"
  helpers="wifi"
></vrcode>
```
- `encrypt`: `WPA`, `WEP` or can be `null`
- `hidden`: `true` or `false`

#### Coin Wallet Address
This helper generates a scannable bitcoin (and other coins) to send payments.

```html
<vrcode
  :value="{
    coin: 'ethereum',
    address: '0x0000000000000000000000000000000000000000',
    amount: 0.00,
    message: 'Hello world'
  }"
  helpers="coin"
></vrcode>
```
- `coin`: default is `bitcoin`, you can change it by your own coin code (`ethereum`, `bitcoincash`, `dash`...)
- `coin`, `address`, `amount` has required
- `message` has not required.

#### Event
This helper generates a scannable event tag to add into calendar events.

```html
<vrcode
  :value="{
    name: 'Event name',
    allDay: false,
    start: '20200702T080000Z',
    end: '20200702T2030000Z',
    location: 'Event location',
    description: 'Event descriptions'
  }"
  helpers="event"
></vrcode>
```
- `allDay`: if set `true` => start and end has format: `20200702`
- `start` and `end`: timezone is UTC

#### meCard AND vCard
This helpers makes scannable QrCodes that add to contact list. You can use `mecard` or `vcard`. Notes that `mecard` has not `title` value.

```html
<vrcode
  :value="{
    name: 'Your name',
    company: 'Your company name',
    phone: 'Your Phone number',
    url: 'Your Website Url',
    email: 'Your Email address',
    address: 'Your Address',
    title: 'Your Title',
    note: 'Your Notes'
  }"
  helpers="vcard"
></vrcode>
```

## Milestone

- [x] Transparent background (Finished at 2020-08-08)
- [x] PNG transparent background download (Finished at 2020-08-08)
- [x] With centered logo (Finished at 2020-08-28)

## Versioning

Maintained under the [Semantic Versioning guidelines](https://semver.org/).

## License

[MIT](https://opensource.org/licenses/MIT) © [Malayvuong](https://malayvuong.com/)

## Invite me a cup of coffee
If you like this project and want to contribute us, then you can send us a cup of coffee by this ways below:

| PAYPAL.ME            | MOMO App (Vietnam) |
|:--------------------:|:------------------:|
| <img src="./assets/qr-code-paypal.png" style="max-width: 100px;" alt="support us"> | <img src="./assets/qr-code-momo.jpg" style="max-width: 100px;" alt="support us"> |

[⬆ back to top](#table-of-contents)
