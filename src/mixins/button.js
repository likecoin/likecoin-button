export default {
  data() {
    return {
      isHovering: false,
      isPressing: false,
    };
  },
  computed: {
    buttonListeners() {
      return {
        mouseover: this.onMouseOver,
        mouseleave: this.onMouseLeave,
        mousedown: this.onPressDown,
        mouseup: this.onPressUp,
        touchstart: this.onTouchStart,
        touchend: this.onTouchEnd,
      };
    },
    buttonBaseStyle() {
      return {
        display: 'block',
        border: 'none',
        background: 'none',
        outline: 'none',
        userSelect: 'none',
        margin: 0,
        padding: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
      };
    },
    buttonPressedScale() {
      return 0.85;
    },
    buttonPressedStyle() {
      return {
        transform: `scale(${this.isPressing ? this.buttonPressedScale : 1})`,
        transformOrigin: 'center center',
        transition: 'transform 0.2s ease',
      };
    },
  },
  methods: {
    onMouseOver() {
      this.isHovering = true;
    },
    onMouseLeave() {
      this.isHovering = false;
      this.isPressing = false;
    },
    onPressDown() {
      this.isPressing = true;
    },
    onPressUp() {
      this.isPressing = false;
    },
    onTouchStart() {
      this.isHovering = true;
      this.isPressing = true;
    },
    onTouchEnd() {
      this.isHovering = false;
      this.isPressing = false;
    },
    onClick(e) {
      this.$emit('click', e);
    },
  },
};
