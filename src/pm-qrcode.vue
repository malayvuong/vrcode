<template>
</template>

<script>
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
    data() {
        return {
            randId: ''
        }
    },
    created() {
        this.randId = Math.floor((Math.random() * 100) + 1);
    },
    methods: {
        // click to download image
        // Only apply for canvas
        clickDownload(e) {
            const { type = 'image/png', filename = 'download.png' } = this.download

            const myCanvas = document.getElementById(`qrcode-${this.randId}`).children[0];

            e.target.href = myCanvas.toDataURL(type)
            e.target.download = filename
        },
    }
}
</script>
