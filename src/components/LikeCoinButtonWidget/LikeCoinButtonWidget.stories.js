// eslint-disable-next-line import/no-extraneous-dependencies
import {
  withKnobs,
  text,
} from '@storybook/addon-knobs';

import LikeCoinButtonWidget from './LikeCoinButtonWidget';
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


export const Controlled = () => ({
  components: {
    LikeButtonV2,
    LikeCoinButtonWidget,
    SaveButton,
  },
  props: {
    displayName: {
      default: text('Display Name', 'ckxpress'),
    },
  },
  data() {
    return {
      count: 0,
      cooldown: 80,
      state: 'initial',
      isSaved: false,
    };
  },
  computed: {
    avatarLabel() {
      return this.count >= 1 ? 'Following' : 'Follow';
    },
    avatarURL() {
      return `https://avatars.dicebear.com/api/identicon/${encodeURIComponent(this.displayName)}.svg`;
    },
    saveButtonLabel() {
      return this.isSaved ? 'Saved' : 'Save';
    },
    likeButtonLabel() {
      switch (this.state) {
        case 'superlikeable':
        case 'superliked':
          return 'Super Like Now';

        case 'initital':
        case 'cooldown':
        default:
          return `${this.count + 32} Likes`;
      }
    },
  },
  methods: {
    onClickLikeButton() {
      switch (this.state) {
        case 'initial':
          if (this.count < 5) {
            this.count += 1;
          } else {
            this.state = 'superlikeable';
          }
          break;

        case 'superlikeable':
        case 'superliked':
          this.state = 'cooldown';
          break;

        default:
          break;
      }
    },
    onClickSaveButton() {
      this.isSaved = !this.isSaved;
    },
    fastForwardCooldown() {
      setTimeout(() => {
        if (this.cooldown > 0) {
          this.cooldown -= 0.2;
          this.fastForwardCooldown();
        } else {
          this.state = 'superliked';
          this.cooldown = 80;
        }
      }, 16);
    },
  },
  watch: {
    state(newState) {
      if (newState === 'cooldown') {
        setTimeout(() => {
          this.fastForwardCooldown();
        }, 3000);
      }
    },
  },
  template: `
    <LikeCoinButtonWidget
      v-bind="{
        avatarLabel,
        avatarURL,
        displayName,
        likeButtonLabel,
        saveButtonLabel,
      }"
    >
      <template #like-button>
        <LikeButtonV2
          :state="state"
          :cooldown="cooldown"
          :count="count"
          @click="onClickLikeButton"
        />
      </template>
      <template #save-button>
        <SaveButton
          :toggled="isSaved"
          @click="onClickSaveButton"
        />
      </template>
    </LikeCoinButtonWidget>
  `,
});
