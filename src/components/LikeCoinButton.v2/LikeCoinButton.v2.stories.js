// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/vue';

storiesOf('LikeCoin Button v2', module)
  .add('Default', () => ({
    template: '<LikeCoinButtonV2 />',
  }))
  .add('With props', () => ({
    template: '<LikeCoinButtonV2 :count="1" />',
  }));
