// Import vue component
import vrcode from './pm-qrcode.vue';

// Declare install function executed by Vue.use()
export function install(Vue) {
	if (install.installed) return;
	install.installed = true;
	Vue.component('vrcode', vrcode);
}

// To allow use as module (npm/webpack/etc.) export component
export default vrcode;