/* eslint import/no-unresolved: 0 */
import { isEmpty } from 'bqroster-utils';

export default {
  props: {
    /**
    * @false has no animation at all (default value)
    *
    * @true set default animation [swipe-down]
    *
    * @object settings
    * {
    *  type: {
    *    type: string,
    *    options: [swipe-down|swipe-up|swipe-left|swipe-right],
    *    default: 'swipe-down'
    *  }
    * }
    */
    animation: {
      type: [Boolean, Object],
      default: false,
    },
  },

  watch: {
    animation(val) { // eslint-disable-line no-unused-vars
      if (this.isMounted === true) {
        if (this.isAnimatable) {
          this.setIsAnimationReady();
        } else {
          this.clearIsAnimationReady();
        }
      }
    },
  },

  data() {
    return {
      isMounted: false,
      isAnimationReady: false,
      animatableDefaultClass: 'swipe-down',
      animationPrefixClass: 'animation-',
      animationTypeClasses: [
        'swipe-down',
        'swipe-up',
        'swipe-left',
        'swipe-right',
      ],
    };
  },

  computed: {
    /**
     * @return {boolean}
     */
    isReadyToAnimate() {
      return (
        this.isAnimatable
        && this.isAnimationReady === true
      );
    },

    /**
     * @return {boolean}
     */
    isReadyToAnimateBefore() {
      return (
        this.isAnimatable
        && this.isAnimationReady !== true
      );
    },

    /**
     * @return {boolean}
     */
    isAnimatable() {
      return (
        (this.animation === true)
        || (typeof this.animation === 'object')
      );
    },

    /**
     * @return {string}
     */
    animatableTranslateClass() {
      if (this.isReadyToAnimateBefore) {
        return this.animatableClassBySlug('before');
      }

      if (this.isReadyToAnimate) {
        return this.animatableClassRetriever();
      }

      /**
       * @do nothing
       * class does not exist or create
       * for a particular purpose
       */
      return this.animatableClassBySlug('on-hold');
    },
  },

  methods: {
    /**
     * @param {string} animatableClass
     */
    setDefaultClass(animatableClass) {
      this.animatableDefaultClass = animatableClass;
    },

    setIsAnimationReady() {
      this.isAnimationReady = true;
    },

    clearIsAnimationReady() {
      this.isAnimationReady = false;
    },

    /**
     * @run this methods always
     * at the end of all your methods/processes
     */
    startAnimationIf() {
      if (this.isAnimatable) {
        this.setIsAnimationReady();
      }
    },

    isAnimatableTypeDefault() {
      return (
        (this.animation === true)
        || (
          typeof this.animation === 'object'
          && isEmpty(this.animation.type)
        )
      );
    },

    /**
     * @param {string} animationType
     * @return {boolean}
     */
    isAnimationTypeTranslatableClass(animationType) {
      return this.animationTypeClasses.includes(animationType);
    },

    /**
     * @return {string}
     *
     * @throws {Error} animation type is required
     */
    animatableClassRetriever() {
      if (this.isAnimatableTypeDefault()) {
        /**
         * @return default class
         */
        return this.animatableClassBySlug(this.animatableDefaultClass);
      }

      if (this.isAnimationTypeTranslatableClass(this.animation.type)) {
        return this.animatableClassBySlug(this.animation.type);
      }

      /**
       * @animation type does not exist
       */
      throw Error(
        `[Animation]: Translate animation type ${this.animation.type}, does not exist`,
      );
    },

    /**
     * @param {string} slug
     * @return {string}
     */
    animatableClassBySlug(slug) {
      return `${this.animationPrefixClass}${slug}`;
    },
  },

  mounted() {
    this.startAnimationIf();
    this.isMounted = true;
  },
};
