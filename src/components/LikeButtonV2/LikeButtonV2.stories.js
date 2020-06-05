// eslint-disable-next-line import/no-extraneous-dependencies
import {
  withKnobs,
  boolean,
  number,
} from '@storybook/addon-knobs';
import { gsap } from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';

import LikeButtonV2 from './LikeButtonV2';

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
        max: 100,
        step: 1,
      }),
    },
    hasSuperLiked: {
      default: boolean('Super Liked', false),
    },
  },
  template: `
    <LikeButtonV2
      v-bind="{
        count,
        cooldown,
        hasSuperLiked,
      }"
    />
  `,
});
