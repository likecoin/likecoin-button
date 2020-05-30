// eslint-disable-next-line import/no-extraneous-dependencies
import { withKnobs, number } from '@storybook/addon-knobs';

import LikeCoinButtonV2 from './LikeCoinButton.v2';

export default {
  title: 'LikeCoin Button v2',
  decorators: [withKnobs],
};

export const Default = () => ({
  components: {
    LikeCoinButtonV2,
  },
  props: {
    count: {
      default: number('Like count', 0),
    },
    cooldown: {
      default: number('Cooldown (0-100)', 0),
    },
  },
  template: '<LikeCoinButtonV2 :count="count" :cooldown="cooldown" />',
});
