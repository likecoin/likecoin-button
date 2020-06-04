// eslint-disable-next-line import/no-extraneous-dependencies
import {
  withKnobs,
  color,
  number,
  select,
} from '@storybook/addon-knobs';
import { gsap } from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';

import LikeButtonV2 from './LikeButtonV2';

gsap.registerPlugin(CSSPlugin);

const StoryWrapper = {
  props: {
    bgColor: {
      type: String,
      default: 'transparent',
    },
  },
  template: `
    <div
      :style="{
        width: '100vw',
        height: '100vh',
        padding: '40px',
        backgroundColor: bgColor,
      }"
    >
      <slot />
    </div>
  `,
};

export default {
  title: 'Like Button (v2)',
  decorators: [withKnobs],
};

export const Default = () => ({
  components: {
    StoryWrapper,
    LikeButtonV2,
  },
  props: {
    count: {
      default: number('Like count', 0, {
        range: true,
        min: 0,
        max: 5,
        step: 1,
      }),
    },
    cooldown: {
      default: number('Cooldown', 0, {
        range: true,
        min: 0,
        max: 100,
        step: 1,
      }),
    },
    state: {
      default: select('State', {
        Initial: 'initial',
        'Super Like-able': 'superlikeable',
        'Super Liked': 'superliked',
        Cooldown: 'cooldown',
      }, 'initial'),
    },
    bgColor: {
      default: color('Background Color', '#fff'),
    },
  },
  template: `
    <StoryWrapper :bgColor="bgColor">
      <LikeButtonV2
        v-bind="{
          count,
          cooldown,
          state,
        }"
      />
    </StoryWrapper>
  `,
});

export const Controlled = () => ({
  components: {
    StoryWrapper,
    LikeButtonV2,
  },
  data() {
    return {
      count: 0,
      cooldown: 80,
      state: 'initial',
    };
  },
  methods: {
    onClick() {
      switch (this.state) {
        case 'initial':
          if (this.count < 5) {
            this.count += 1;
            if (this.count === 5) {
              setTimeout(() => {
                this.state = 'superlikeable';
              }, 500);
            }
          }
          break;

        case 'superlikeable':
          this.state = 'cooldown';
          break;

        default:
          break;
      }
    },
    fastForwardCooldown() {
      setTimeout(() => {
        if (this.cooldown > 0) {
          this.cooldown -= 0.2;
          this.fastForwardCooldown();
        } else {
          this.state = 'initial';
          this.count = 0;
          this.cooldown = 80;
        }
      }, 16);
    },
  },
  watch: {
    state(newState) {
      if (newState === 'cooldown') {
        setTimeout(() => {
          this.fastForwardCooldown();
        }, 3000);
      }
    },
  },
  template: `
    <StoryWrapper>
      <LikeButtonV2
        :count="count"
        :cooldown="cooldown"
        :state="state"
        @click="onClick"
      />
    </StoryWrapper>
  `,
});
