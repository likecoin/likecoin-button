// eslint-disable-next-line import/no-extraneous-dependencies
import {
  withKnobs,
  text,
} from '@storybook/addon-knobs';

import Identity from './Identity';
import IdentityAvatar from './Identity.avatar';

const defaultAvatarURL = 'https://avatars.dicebear.com/api/identicon/likecoin.svg';

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
      default: text('Avatar URL', defaultAvatarURL),
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

export const Avatar = () => ({
  components: {
    IdentityAvatar,
  },
  props: {
    url: {
      default: text('URL', defaultAvatarURL),
    },
  },
  template: '<IdentityAvatar :url="url" />',
});
