// eslint-disable-next-line import/no-extraneous-dependencies
import { withKnobs, number, select } from '@storybook/addon-knobs';

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
        Cooldown: 'cooldown',
      }, 'initial'),
    },
  },
  template: '<LikeCoinButtonV2 :count="count" :cooldown="cooldown" :state="state" />',
});
