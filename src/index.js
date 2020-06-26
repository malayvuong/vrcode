// Import vue component
import VrCode from './pm-qrcode.vue';

// Declare install function executed by Vue.use()
export function install(Vue) {
	if (install.installed) return;
	install.installed = true;
	Vue.component('vrcode', VrCode);
}

// To allow use as module (npm/webpack/etc.) export component
export default VrCode;