// eslint-disable-next-line import/no-extraneous-dependencies
import {
  withKnobs,
  text,
} from '@storybook/addon-knobs';

import LikeCoinButtonWidget from './LikeCoinButtonWidget';

export default {
  title: 'LikeCoin Button Widget (v2)',
  decorators: [withKnobs],
};

export const Default = () => ({
  components: {
    LikeCoinButtonWidget,
  },
  props: {
    likeButtonLabel: {
      default: text('Like Button Label', '1 LIKE'),
    },
    saveButtonLabel: {
      default: text('Save Button Label', 'Save'),
    },
    avatarLabel: {
      default: text('Avatar Label', 'Follow'),
    },
    avatarURL: {
      default: text('Avatar URL', 'https://avatars.dicebear.com/api/identicon/likecoin.svg'),
    },
    displayName: {
      default: text('Display Name', 'Display Name'),
    },
  },
  template: `
    <LikeCoinButtonWidget
      v-bind="{
        likeButtonLabel,
        saveButtonLabel,
        avatarLabel,
        avatarURL,
        displayName,
      }"
    />
  `,
});
