<template>
  <div>
    <qrcode-vue
      :id="`qrcode-${randId}`"
      :renderas="type"
      :value="textToQR"
      :padding="options.padding"
      :classname="options.className"
      :size="options.size"
      :level="options.level"
      :background="options.background"
      :foreground="options.foreground"
      :transparent="transparent"
      :logo="logo"
      :logosize="logosize"
      :opacity="opacity"
    />
    <a
      v-if="type === 'canvas' && download.visible"
      role="anchor"
      href="javascript:void(0);"
      :class="download.class || ''"
      :style="download.style"
      @click="clickDownload"
      >{{ download.text }}</a
    >
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

import QRCodePM from "./vue-qrcode.js";

export default {
  name: "VrCode",
  components: {
    "qrcode-vue": QRCodePM,
  },
  props: {
    value: {
      type: [String, Object],
      default: null,
    },
    download: {
      type: Object,
      default: function () {
        return {
          visible: false,
        };
      },
    },
    options: {
      type: Object,
      default: function () {
        return {
          size: 100,
          background: "#ffffff",
          foreground: "#000000",
          className: "",
          level: "L",
          padding: 10,
        };
      },
    },
    type: {
      type: String,
      default: "canvas",
    },

    // Helpers options
    helpers: { type: String, default: "text" },
    //  Set Transparent Background (Only for Canvas)
    transparent: { type: Boolean, default: false },
    //  logo centered
    logo: { type: String, default: null },
    //  Logo Opacity
    logosize: { type: Number, default: null },
    opacity: {
      type: Number,
      default: 100,
    },
  },
  data() {
    return {
      randId: "",
      textToQR: "",
    };
  },
  watch: {
    value(val) {
      this.setTextToQr();
    },
  },
  created() {
    this.randId = Math.floor(Math.random() * 1000 + 1);

    this.setTextToQr();
  },
  methods: {
    /**
     * Set value by helpers type
     *-------------------
     * @author malayvuong
     *
     **/
    setTextToQr() {
      switch (this.helpers) {
        case "email":
          this.textToQR = `MATMSG:TO:${this.value.address || null}${
            this.value.subject ? ";SUB:" + this.value.subject : ""
          }${this.value.body ? ";BODY:" + this.value.body : ""};`;
          break;
        case "call":
          this.textToQR = `tel:${this.value || 0}`;
          break;
        case "sms":
          this.textToQR = `sms:${this.value.number || 0}${
            this.value.message ? ":" + this.value.message : ""
          }`;
          break;
        case "geo":
          this.textToQR = `geo:${this.value.lng || 0},${this.value.lat || 0}${
            this.value.name ? "?q=" + this.value.name : ""
          }`;
          break;
        case "wifi":
          this.textToQR = `WIFI:T:${this.value.encrypt || "nopass"};S:${
            this.value.ssid
          };P:${this.value.password};H:${this.value.hidden || ""};`;
          break;
        case "coin":
          this.textToQR = `${this.value.coin || "bitcoin"}:${
            this.value.address
          }?amount=${this.value.amount || 0}${
            this.value.message ? "&message=" + this.value.message : ""
          }`;
          break;
        case "event":
          this.textToQR = `BEGIN:VEVENT
SUMMARY:${this.value.name || ""}
DTSTART${
            this.value.allDay
              ? ";VALUE=DATE:" + this.value.start
              : ":" + this.value.start
          }
DTEND${
            this.value.allDay
              ? ";VALUE=DATE:" + this.value.end
              : ":" + this.value.end
          }
LOCATION:${this.value.location}
DESCRIPTION:${this.value.description}
END:VEVENT`;
          break;
        case "mecard":
          this.textToQR = `MECARD:N:${this.value.name || "Your name"};ORG:${
            this.value.company || "Your company"
          };TEL:${this.value.phone || ""};URL:${this.value.url || ""};EMAIL:${
            this.value.email || ""
          };ADR: ${this.value.address || ""};NOTE:${this.value.title || ""} ${
            this.value.note || ""
          };;`;
          break;
        case "vcard":
          this.textToQR = `BEGIN:VCARD
VERSION:3.0
N:${this.value.name || "Your name"}
ORG:${this.value.company || "Your company"}
TEL:${this.value.phone || ""}
URL:${this.value.url || ""}
EMAIL:${this.value.email || ""}
TITLE:${this.value.title || ""}
ADR: ${this.value.address || ""}
NOTE:${this.value.note || ""}
END:VCARD`;
          break;
        default:
          this.textToQR = this.value.toString();
          break;
      }
    },

    // click to download image
    // Donwload Only apply for canvas
    clickDownload(e) {
      const { type = "image/png", filename = "download.png" } = this.download;
      const myCanvas = document.getElementById(`qrcode-${this.randId}`)
        .children[0];
      e.target.href = myCanvas.toDataURL(type);
      e.target.download = filename;
    },
  },
};
</script>
