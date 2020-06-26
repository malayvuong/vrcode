<template>
<div>
    <qrcode-vue
        :id="`qrcode-${randId}`"
        :renderAs="type"
        :value="value"
        :padding="padding"
        size="180"
        level="H"
    ></qrcode-vue>
    <a role="anchor" href="javascript:void(0);" @click="clickDownload" v-if="type === 'canvas' && download.visible" v-bind:style="download.style">{{download.text}}</a>
</div>
</template>

<script>
import QRCodePM from './vue-qrcode.js'

export default {
    name: 'vrcode',
    props: {
        value: {
            type: String,
        },
        download: {
            type: Object,
            default: function() {
                return {
                    visible: false,
                }
            },
        },
        type: {
            type: String,
            default: 'canvas'
        },
        padding: {
            type: Number,
            default: 10
        }
    },
    components: {
        'qrcode-vue': QRCodePM
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
