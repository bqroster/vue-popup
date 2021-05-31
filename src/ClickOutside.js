export default {
  bind(el, binding, vnode) {
    el.clickOutsideEvent = (event) => { // eslint-disable-line no-param-reassign
      if (!(el === event.target || el.contains(event.target))) {
        // call method provided in the attribute directive
        vnode.context[binding.expression]()(event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unbind(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  },
};
