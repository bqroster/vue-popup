<template>
  <div
    ref="popupContainer"
    class="bqr__popup-container"
    :style="{'z-index': zIndex}"
    :class="{ [animatableTranslateClass]: true }"
    v-bqr-click-outside="clickOutsideDirectiveFn"
  >
    <slot></slot>
  </div>
</template>

<script>
/* eslint import/no-unresolved: 0 */
import { isFunction } from 'bqroster-utils';
import TranslateOpacityMixin from './TranslateOpacityMixin';

export default {
  mixins: [
    TranslateOpacityMixin,
  ],
  props: {
    /**
     * @Html reference
     * where the popup
     * will be located
     *
     * try to pass this value
     * using $refs
     */
    refPopup: {
      required: true,
    },

    /**
     * Tells the popup
     * how to align vs refEl
     *
     * @options allowed
     * `top-left`
     * `top-center`
     * `top-right`
     * `bottom-left`
     * `bottom-center`
     * `bottom-right`
     */
    align: {
      type: String,
      default: 'top-center',
    },

    /**
     * @true
     *  Closeable by clicking outside
     *  install a custom directive to
     *  handle this
     *
     * @function
     *  when click-outside directive
     *  method is trigger, this
     *  function is called
     *
     */
    isClickableOutside: {
      type: [Boolean, Function],
      default: true,
    },

    /**
     * @set the z-index property
     * for the popup element
     */
    zIndex: {
      type: Number,
      default: 999,
    },
  },

  watch: {
    refPopup(val) {
      if (val) {
        this.processPopupBoundingClientPosition();
        this.installListeners();
      }
    },
  },

  data() {
    return {
      popupBoundingClient: {},
      refPopupBoundingClient: {},
    };
  },

  mounted() {
    if (this.refPopup) {
      this.processPopupBoundingClientPosition();
      this.installListeners();
    }
  },

  methods: {
    /**
     * @param {MouseEvent} $ev
     */
    emitClosePopup($ev) { // eslint-disable-line no-unused-vars
      this.$emit('close');
    },

    /**
     * @return {function}
     */
    clickOutsideDirectiveFn() {
      if (this.isClickableOutside === false) {
        return () => {};
      }

      if (isFunction(this.isClickableOutside)) {
        return this.processCustomCloseablePopup;
      }

      return this.emitClosePopup;
    },

    /**
     * @param {MouseEvent} $ev
     */
    processCustomCloseablePopup($ev) { // eslint-disable-line no-unused-vars
      this.isClickableOutside($ev);
    },

    processScrollOnPopup() {
      this.processPopupBoundingClientPosition();
    },

    processPopupBoundingClientPosition() {
      this.setRefPopupBoundingClient();
      this.setPopupBoudingClient();
      this.setPopupPosition();
    },

    setRefPopupBoundingClient() {
      this.refPopupBoundingClient = this.refPopup.getBoundingClientRect();
    },

    setPopupBoudingClient() {
      this.popupBoundingClient = this.$refs.popupContainer.getBoundingClientRect();
    },

    setPopupPosition() {
      this.$refs.popupContainer.style.left = this.getPopupLeftPosition();
      this.$refs.popupContainer.style.top = this.getPopupTopPosition();
    },

    installListeners() {
      window.addEventListener('scroll', this.processScrollOnPopup);
      window.addEventListener('resize', this.processScrollOnPopup);
    },

    /**
     * @return {string}
     */
    getPopupLeftPosition() {
      const posX = this.getPopupLeftPositionOnAlignment();

      return `${posX}px`;
    },

    /**
     * @return {string}
     */
    getPopupTopPosition() {
      const posY = this.getPopupTopPositionOnAlignment();
      return `${posY}px`;
    },

    /**
     * @return {number}
     */
    getPopupLeftPositionOnAlignment() {
      if (this.align.includes('-left')) {
        return this.refPopupBoundingClient.left;
      }

      if (this.align.includes('-right')) {
        return this.refPopupBoundingClient.left
          + this.refPopupBoundingClient.width
          - this.popupBoundingClient.width;
      }

      /**
       * This is for '-center'
       * as this is default value
       */
      return this.refPopupBoundingClient.left
        + (this.refPopupBoundingClient.width / 2)
        - (this.popupBoundingClient.width / 2);
    },

    /**
     * @return {number}
     */
    getPopupTopPositionOnAlignment() {
      if (this.align.includes('bottom-')) {
        return this.refPopupBoundingClient.top - this.popupBoundingClient.height;
      }

      return this.refPopupBoundingClient.top + this.refPopupBoundingClient.height;
    },

    removeListeners() {
      window.removeEventListener('scroll', this.processScrollOnPopup);
      window.removeEventListener('resize', this.processScrollOnPopup);
    },
  },

  beforeDestroy() {
    this.removeListeners();
  },
};
</script>

<style lang="scss" scoped>
  .bqr__popup-container {
    position: fixed;
  }
  /**
    @note
    This style file is needed when
    TranslateOpacityMixin
    is installed on component
   */
  @import './translate-opacity';
</style>
