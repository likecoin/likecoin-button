// eslint-disable-next-line import/no-extraneous-dependencies
import { withKnobs, boolean } from '@storybook/addon-knobs';

import BookmarkButton from './BookmarkButton';

export default {
  title: 'Bookmark Button',
  decorators: [withKnobs],
};

export const Default = () => ({
  components: {
    BookmarkButton,
  },
  props: {
    toggled: {
      default: boolean('Toggled', false),
    },
  },
  template: '<BookmarkButton :toggled="toggled" />',
});
