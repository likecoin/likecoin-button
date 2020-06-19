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
  },
  template: `
    <LikeCoinButtonWidget
      v-bind="{
        layout,
        likeButtonLabel,
        saveButtonLabel,
        avatarLabel,
      }"
    />
  `,
});

const Controlled = ({
  count,
  cooldown,
  hasSuperLiked = false,
  isSuperLikeEnabled = true,
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
      hasSuperLiked,
      isSuperLikeEnabled,
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
      if (this.count >= 5 && this.isSuperLikeEnabled && !this.cooldown) {
        return 'Super Like Now';
      }
      return `${this.count + 32} Likes`;
    },
  },
  methods: {
    onClickLikeButton() {
      if (this.count < 5) {
        this.count += 1;
      } else {
        this.hasSuperLiked = true;
        this.cooldown = 80;
      }
      if (this.count >= 5) {
        setTimeout(() => {
          this.fastForwardCooldown();
        }, 3000);
      }
    },
    onClickSaveButton() {
      this.isSaved = !this.isSaved;
    },
    onFollow() {
      this.isFollowing = true;
    },
    fastForwardCooldown() {
      setTimeout(() => {
        if (this.cooldown > 0) {
          this.cooldown -= 0.2;
          this.fastForwardCooldown();
        } else {
          this.cooldown = 0;
        }
      }, 16);
    },
  },
  template: `
    <LikeCoinButtonWidget
      v-bind="{
        layout,
        avatarLabel,
        likeButtonLabel,
        saveButtonLabel,
      }"
    >
      <template #like-button>
        <LikeButtonV2
          v-bind="{
            cooldown,
            count,
            hasSuperLiked,
            isSuperLikeEnabled,
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
          @click-avatar="onFollow"
        />
      </template>
    </LikeCoinButtonWidget>
  `,
});

export const Case1 = Controlled();

export const Case2 = Controlled({ cooldown: 80 });

export const Case3 = Controlled({
  count: 5,
  hasSuperLiked: true,
});

export const SuperLikeDisabled = Controlled({
  isSuperLikeEnabled: false,
});
