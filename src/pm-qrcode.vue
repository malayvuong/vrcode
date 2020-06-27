<template>
  <div>
    <qrcode-vue
      :id="`qrcode-${randId}`"
      :renderas="options.type"
      :value="value"
      :padding="options.padding"
      :classname="options.className"
      :size="options.size"
      :level="options.level"
      :background="options.background"
      :foreground="options.foreground"
    />
    <a
      v-if="type === 'canvas' && download.visible"
      role="anchor"
      href="javascript:void(0);"
      :class="download.class || ''"
      :style="download.style || ''"
      @click="clickDownload"
    >{{ download.text }}</a>
  </div>
</template>

<script>
/**
 * About pm-qrcode
 *-------------------
 * @author malayvuong
 * PM-QRCODE mean Phien Malay QR Code
 * Phien (https://github.com/phamanhphien)
 * Malay = Malayvuong (https://github.com/malayvuong)
 *
**/

import QRCodePM from './vue-qrcode.js'

export default {
    name: 'VrCode',
    components: {
        'qrcode-vue': QRCodePM
    },
    props: {
        value: {
            type: String, default: ''
        },
        download: {
            type: Object,
            default: function() {
                return {
                    visible: false,
                }
            },
        },
        options: {
            type: Object,
            default: function() {
                return {
                    size: 100,
                    background: '#ffffff',
                    foreground: '#000000',
                    className: '',
                    level: 'L',
                    padding: 10
                }
            },
        },
        type: {
            type: String, default: 'canvas'
        },
    },
    data() {
        return {
            randId: ''
        }
    },
    created() {
        this.randId = Math.floor((Math.random() * 1000) + 1);
    },
    methods: {
        // click to download image
        // Donwload Only apply for canvas
        clickDownload(e) {
            const { type = 'image/png', filename = 'download.png' } = this.download
            const myCanvas = document.getElementById(`qrcode-${this.randId}`).children[0];
            e.target.href = myCanvas.toDataURL(type)
            e.target.download = filename
        },
    }
}
</script>
