// eslint-disable-next-line import/no-extraneous-dependencies
import {
  withKnobs,
  text,
} from '@storybook/addon-knobs';

import Identity from './Identity';

export default {
  title: 'Identity',
  decorators: [withKnobs],
};

export const Default = () => ({
  components: {
    Identity,
  },
  props: {
    avatarURL: {
      default: text('Avatar URL', 'https://avatars.dicebear.com/api/identicon/likecoin.svg'),
    },
    displayName: {
      default: text('Display Name', 'Display Name'),
    },
  },
  template: `
    <Identity
      v-bind="{
        avatarURL,
        displayName,
      }"
    />
  `,
});
