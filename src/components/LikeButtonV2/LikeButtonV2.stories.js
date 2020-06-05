// eslint-disable-next-line import/no-extraneous-dependencies
import {
  withKnobs,
  number,
  select,
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
    state: {
      default: select('State', {
        Initial: 'initial',
        'Super Like-able': 'superlikeable',
        'Super Liked': 'superliked',
        Cooldown: 'cooldown',
      }, 'initial'),
    },
  },
  template: `
    <LikeButtonV2
      v-bind="{
        count,
        cooldown,
        state,
      }"
    />
  `,
});
