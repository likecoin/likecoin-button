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
import LikeButtonV2StateTable from './LikeButtonV2.stateTable';

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
  },
  template: `
    <LikeButtonV2Badge
      v-bind="{
        count,
      }"
    />
  `,
});

export const StateTable = () => ({
  components: {
    LikeButtonV2StateTable,
  },
  template: '<LikeButtonV2StateTable />',
});
