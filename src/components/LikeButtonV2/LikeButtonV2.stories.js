// eslint-disable-next-line import/no-extraneous-dependencies
import {
  withKnobs,
  boolean,
  number,
} from '@storybook/addon-knobs';
import { gsap } from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';

import LikeButtonV2 from './LikeButtonV2';
import LikeButtonV2Badge from './LikeButtonV2.badge';
import LikeButtonV2Cooldown from './LikeButtonV2.cooldown';

gsap.registerPlugin(CSSPlugin);

export default {
  title: 'Like Button (v2)',
  decorators: [withKnobs],
};

export const Default = () => ({
  components: {
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
        max: 1,
        step: 0.01,
      }),
    },
    cooldownEndTimeFromNow: {
      default: number('Cooldown end time from now (seconds)', 10),
    },
    hasSuperLiked: {
      default: boolean('Super Liked', false),
    },
    isSuperLikeEnabled: {
      default: boolean('Enable Super Like', true),
    },
    isCreator: {
      default: boolean('Is creator', false),
    },
    explosionSize: {
      default: number('Explosion Size', 0.65, {
        range: true,
        min: 0,
        max: 1,
        step: 0.01,
      }),
    },
    explosionRange: {
      default: number('Explosion Range', 0.8, {
        range: true,
        min: 0,
        max: 1,
        step: 0.01,
      }),
    },
  },
  methods: {
    onClickDisabled() {
      // eslint-disable-next-line no-alert
      alert('Clicked disabled button.');
    },
  },
  template: `
    <LikeButtonV2
      v-bind="{
        count,
        cooldown,
        cooldownEndTime: Date.now() + cooldownEndTimeFromNow * 1000,
        hasSuperLiked,
        isSuperLikeEnabled,
        isCreator,
        explosionSize,
        explosionRange,
      }"
      @click-disabled="onClickDisabled"
    />
  `,
});

export const Badge = () => ({
  components: {
    LikeButtonV2Badge,
  },
  props: {
    count: {
      default: number('Like count', 5, {
        range: true,
        min: 0,
        max: 5,
        step: 1,
      }),
    },
    hasSuperLiked: {
      default: boolean('Super Liked', false),
    },
    isSuperLikeEnabled: {
      default: boolean('Enable Super Like', true),
    },
  },
  template: `
    <LikeButtonV2Badge
      v-bind="{
        count,
        hasSuperLiked,
        isSuperLikeEnabled,
      }"
    />
  `,
});

export const Cooldown = () => ({
  components: {
    LikeButtonV2Cooldown,
  },
  props: {
    value: {
      default: number('Value', 0.5, {
        range: true,
        min: 0,
        max: 1,
        step: 0.01,
      }),
    },
    endTimeFromNow: {
      default: number('End time from now (seconds)', 10),
    },
  },
  template: `
    <svg viewBox="0 0 100 100" width="100">
      <LikeButtonV2Cooldown
        v-bind="{
          value,
          endTime: Date.now() + endTimeFromNow * 1000,
          radius: 36,
          center: 50,
        }"
      />
    </svg>
  `,
});
