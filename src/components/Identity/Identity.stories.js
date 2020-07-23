// eslint-disable-next-line import/no-extraneous-dependencies
import {
  withKnobs,
  text,
  boolean,
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
    isAvatarButtonDisabled: {
      default: boolean('Avatar Button Disabled', false),
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
        isAvatarButtonDisabled,
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
    isDisabled: {
      default: boolean('Disabled', false),
    },
  },
  template: `
    <IdentityAvatar
      v-bind="{
        url,
        isDisabled,
      }"
    />
  `,
});
