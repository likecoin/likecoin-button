// eslint-disable-next-line import/no-extraneous-dependencies
import {
  withKnobs,
  select,
  text,
} from '@storybook/addon-knobs';

import Identity from '../Identity/Identity';
import LikeCoinButtonWidget, {
  LAYOUTS,
  LAYOUT_DEFAULT,
} from './LikeCoinButtonWidget';
import LikeButtonV2 from '../LikeButtonV2/LikeButtonV2';
import SaveButton from '../SaveButton/SaveButton';

export default {
  title: 'LikeCoin Button Widget',
  decorators: [withKnobs],
  argTypes: {
    onClickAvatar: { action: 'Clicked Avatar' },
  },
};

export const Default = (_, { argTypes }) => ({
  components: {
    LikeCoinButtonWidget,
  },
  props: {
    layout: {
      default: select('Layout', LAYOUTS, LAYOUT_DEFAULT),
    },
    likeButtonLabel: {
      default: text('Like Button Label', '1 LIKE'),
    },
    hintLabel: {
      default: text('Hint Label', 'This is hint.'),
    },
  },
  template: `
    <LikeCoinButtonWidget
      v-bind="{
        layout,
        likeButtonLabel,
        hintLabel,
      }"
    />
  `,
});

const Controlled = ({
  count,
  isCreator = false,
} = {}) => (_, { argTypes }) => ({
  components: {
    Identity,
    LikeButtonV2,
    LikeCoinButtonWidget,
    SaveButton,
  },
  props: {
    layout: {
      default: select('Layout', LAYOUTS, LAYOUT_DEFAULT),
    },
    displayName: {
      default: text('Display Name', 'ckxpress'),
    },
    onClickAvatar: argTypes.onClickAvatar,
  },
  data() {
    return {
      count: count || 0,
      isCreator,
      isSaved: false,
    };
  },
  computed: {
    avatarURL() {
      return `https://avatars.dicebear.com/api/identicon/${encodeURIComponent(this.displayName)}.svg`;
    },
    likeButtonLabel() {
      return `${this.count + 32} Likes`;
    },
  },
  methods: {
    onClickLikeButton() {
      if (!isCreator && this.count < 5) {
        this.count += 1;
      }
    },
    onClickSaveButton() {
      this.isSaved = !this.isSaved;
    },
  },
  template: `
    <LikeCoinButtonWidget
      v-bind="{
        layout,
        likeButtonLabel,
      }"
    >
      <template #like-button>
        <LikeButtonV2
          v-bind="{
            count,
            isCreator,
          }"
          @click="onClickLikeButton"
        />
      </template>
      <template #save-button="saveButtonProps">
        <SaveButton
          v-bind="saveButtonProps"
          :toggled="isSaved"
          @click="onClickSaveButton"
        />
      </template>
      <template #identity="identityProps">
        <Identity
          v-bind="{
            ...identityProps,
            avatarURL,
            displayName,
          }"
          @click-avatar="onClickAvatar"
        />
      </template>
    </LikeCoinButtonWidget>
  `,
});

export const Liker = Controlled();

export const Creator = Controlled({
  isCreator: true,
});
