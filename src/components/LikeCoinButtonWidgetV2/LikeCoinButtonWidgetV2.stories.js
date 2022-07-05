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
} from './LikeCoinButtonWidgetV2';
import LikeButtonV2 from '../LikeButtonV2/LikeButtonV2';
import SaveButton from '../SaveButton/SaveButton';

export default {
  title: 'LikeCoin Button Widget (ISCN)',
  decorators: [withKnobs],
  argTypes: {
    onClickAvatar: { action: 'Clicked Avatar' },
    onClickCta: { action: 'Clicked CTA Button' },
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
    ctaButtonLabel: {
      default: text('CTA Button Label', 'Become a Civic Liker'),
    },
    hintLabel: {
      default: text('Hint Label', 'This is hint.'),
    },
    onClickCta: argTypes.onClickCta,
  },
  template: `
    <LikeCoinButtonWidget
      v-bind="{
        layout,
        likeButtonLabel,
        ctaButtonLabel,
        hintLabel,
      }"
      @click-cta-button="onClickCta"
    />
  `,
});

const Controlled = ({
  count,
  cooldown,
  hasSuperLiked = false,
  isJustSuperLiked = false,
  isCreator = false,
  isSuperLikeEnabled = false,
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
    onClickCta: argTypes.onClickCta,
  },
  data() {
    return {
      count: count || 0,
      cooldown: cooldown || 0,
      cooldownEndTime: 0,
      hasSuperLiked,
      isJustSuperLiked,
      isSuperLikeEnabled,
      isCreator,
      isSaved: false,
    };
  },
  computed: {
    avatarURL() {
      return `https://avatars.dicebear.com/api/identicon/${encodeURIComponent(this.displayName)}.svg`;
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
  },
  template: `
    <LikeCoinButtonWidget
      v-bind="{
        layout,
        likeButtonLabel,
      }"
      cta-button-label="Become a Civic Liker"
      @click-cta-button="onClickCta"
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
          }"
          @click-avatar="onClickAvatar"
        />
      </template>
    </LikeCoinButtonWidget>
  `,
});

export const Liker = Controlled();

export const LikerCanSuperLike = Controlled({
  isSuperLikeEnabled: true,
});

export const LikerHasJustSuperLiked = Controlled({
  count: 5,
  isSuperLikeEnabled: true,
  hasSuperLiked: true,
  isJustSuperLiked: true,
  cooldown: 1,
});

export const LikerHasSuperLiked = Controlled({
  count: 5,
  isSuperLikeEnabled: true,
  hasSuperLiked: true,
  cooldown: 0.8,
});

export const LikerHasSuperLikedElse = Controlled({
  count: 5,
  isSuperLikeEnabled: true,
  cooldown: 0.8,
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

export const CreatorHasJustSuperLiked = Controlled({
  isCreator: true,
  isSuperLikeEnabled: true,
  hasSuperLiked: true,
  isJustSuperLiked: true,
  cooldown: 1,
});

export const CreatorHasSuperLiked = Controlled({
  isCreator: true,
  isSuperLikeEnabled: true,
  hasSuperLiked: true,
  cooldown: 0.8,
});

export const CreatorHasSuperLikedElse = Controlled({
  isCreator: true,
  isSuperLikeEnabled: true,
  cooldown: 0.8,
});

export const CreatorHadSuperLiked = Controlled({
  isCreator: true,
  isSuperLikeEnabled: true,
  hasSuperLiked: true,
});
