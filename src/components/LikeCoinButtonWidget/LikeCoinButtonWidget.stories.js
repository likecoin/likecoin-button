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
  title: 'LikeCoin Button Widget (v2)',
  decorators: [withKnobs],
};

export const Default = () => ({
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
    saveButtonLabel: {
      default: text('Save Button Label', 'Save'),
    },
    avatarLabel: {
      default: text('Avatar Label', 'Follow'),
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
        saveButtonLabel,
        avatarLabel,
        hintLabel,
      }"
    />
  `,
});

const Controlled = ({
  count,
  cooldown,
  hasSuperLiked = false,
  isCreator = false,
  isSuperLikeEnabled = false,
} = {}) => () => ({
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
  },
  data() {
    return {
      count: count || 0,
      cooldown: cooldown || 0,
      cooldownEndTime: 0,
      hasSuperLiked,
      isSuperLikeEnabled,
      isCreator,
      isSaved: false,
      isFollowing: false,
    };
  },
  computed: {
    avatarLabel() {
      return this.isFollowing ? 'Following' : 'Follow';
    },
    avatarURL() {
      return `https://avatars.dicebear.com/api/identicon/${encodeURIComponent(this.displayName)}.svg`;
    },
    saveButtonLabel() {
      return this.isSaved ? 'Saved' : 'Save';
    },
    likeButtonLabel() {
      if (this.count >= 5 && this.isSuperLikeEnabled && this.cooldown <= 0) {
        return 'Super Like Now';
      }
      return `${this.count + 32} Likes`;
    },
  },
  mounted() {
    if (this.cooldown) {
      this.fastForwardCooldown();
    }
  },
  methods: {
    fastForwardCooldown() {
      this.cooldownEndTime = Date.now() + 20 * 1000;
      this.cooldown = 1;
    },
    onClickLikeButton() {
      if (!isCreator && this.count < 5) {
        this.count += 1;
        if (this.count === 5 && this.hasSuperLiked) {
          this.fastForwardCooldown();
        }
      } else if (isSuperLikeEnabled) {
        this.hasSuperLiked = true;
        this.fastForwardCooldown();
      }
    },
    onCooldownEnd() {
      this.cooldown = 0;
    },
    onClickSaveButton() {
      this.isSaved = !this.isSaved;
    },
    onFollow() {
      this.isFollowing = true;
    },
  },
  template: `
    <LikeCoinButtonWidget
      v-bind="{
        layout,
        avatarLabel,
        likeButtonLabel,
        saveButtonLabel,
        isAvatarLabelButtonDisabled: isFollowing,
      }"
      @click-save-button-label="onClickSaveButton"
      @click-avatar-label="onFollow"
    >
      <template #like-button>
        <LikeButtonV2
          v-bind="{
            cooldown,
            cooldownEndTime,
            count,
            hasSuperLiked,
            isCreator,
            isSuperLikeEnabled,
          }"
          @cooldown-end="onCooldownEnd"
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
            isAvatarButtonDisabled: isFollowing,
          }"
          @click-avatar="onFollow"
        />
      </template>
    </LikeCoinButtonWidget>
  `,
});

export const Liker = Controlled();

export const LikerCanSuperLike = Controlled({
  isSuperLikeEnabled: true,
});

export const LikerHasSuperLiked = Controlled({
  count: 5,
  isSuperLikeEnabled: true,
  hasSuperLiked: true,
  cooldown: 1,
});

export const LikerHasSuperLikedElse = Controlled({
  count: 5,
  isSuperLikeEnabled: true,
  cooldown: 1,
});

export const LikerHadSuperLiked = Controlled({
  count: 5,
  isSuperLikeEnabled: true,
  hasSuperLiked: true,
});

export const Creator = Controlled({
  isCreator: true,
});

export const CreatorCanSuperLike = Controlled({
  isCreator: true,
  isSuperLikeEnabled: true,
});

export const CreatorHasSuperLiked = Controlled({
  isCreator: true,
  isSuperLikeEnabled: true,
  hasSuperLiked: true,
  cooldown: 1,
});

export const CreatorHasSuperLikedElse = Controlled({
  isCreator: true,
  isSuperLikeEnabled: true,
  cooldown: 1,
});

export const CreatorHadSuperLiked = Controlled({
  isCreator: true,
  isSuperLikeEnabled: true,
  hasSuperLiked: true,
});
