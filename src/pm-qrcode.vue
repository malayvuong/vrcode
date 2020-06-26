<template>
<div>
    <qrcode-vue
        :id="`qrcode-${randId}`"
        :renderAs="options.type"
        :value="value"
        :padding="options.padding"
        :className="options.className"
        :size="options.size"
        :level="options.level"
        :background="options.background"
        :foreground="options.foreground"
    ></qrcode-vue>
    <a v-if="type === 'canvas' && download.visible"
        role="anchor" href="javascript:void(0);"
        @click="clickDownload"
        v-bind:style="download.style"
        :class="download.class || ''"
    >{{download.text}}</a>
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
        options: {
            type: Object,
            default: function() {
                return {
                    size: {
                        type: [Number, String],
                        default: 100,
                        validator: (s) => isNaN(Number(s)) !== true,
                    },
                    background: {
                        type: String,
                        default: '#ffffff'
                    },
                    foreground: {
                        type: String,
                        default: '#000000'
                    },
                    className: {
                        type: String,
                        default: ''
                    },
                    level: {
                        type: String,
                        default: 'L',
                        validator: (l) => ['L', 'Q', 'M', 'H'].indexOf(l) > -1,
                    },
                    padding: {
                        type: Number,
                        default: 10
                    },
                }
            },
        },
        type: {
            type: String,
            default: 'canvas'
        },
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
