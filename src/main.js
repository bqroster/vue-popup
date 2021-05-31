import BqrPopup from './Popup.vue';
import ClickOutsideDirective from './ClickOutside';

function install(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('bqr-popup', BqrPopup);
  Vue.directive('bqr-click-outside', ClickOutsideDirective);
}

const plugin = {
  install,
};

let GlobalVue = null;
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.vue;
}

if (GlobalVue) {
  GlobalVue.use(plugin);
}

BqrPopup.install = install;

export default BqrPopup;
