<template>
  <div
    v-if="socialMediaList.length > 0"
    :class="[
      'social-media-connect',
      `social-media-connect--${type}`,
      {
        'social-media-connect--center': !!center,
      },
    ]"
  >
    <div>

      <ul>
        <li
          v-for="socialMedia in socialMediaList"
          :key="socialMedia.id"
        >
          <button
            :class="[
              'social-media-connect__button',
              `social-media-connect__button--${socialMedia.id}`,
              `social-media-connect__button--${
                getIsConnected(socialMedia.id) ? 'connected' : 'disconnected'
              }`,
            ]"
            :title="getSocialMediaTitle(socialMedia)"
            type="button"
            @click="onClickButton(socialMedia)"
          >
            <simple-svg
              :filepath="getIconPath(socialMedia.id)"
              fill="white"
              width="36px"
              height="36px"
            />
          </button>
        </li>

        <!-- Will not show until settings page is finished
        <li v-if="isMini">
          <md-button
            class="social-media-connect__add-button md-icon-button"
            type="button"
            :to="{ name: 'in-settings' }"
          >
            <simple-svg
              :filepath="getIconPath('add')"
              fill="#C0C0C0"
              width="22px"
              height="22px"
            />
          </md-button>
        </li>
        -->
      </ul>

    </div>
  </div>
</template>

<script>
import LikeCoinIcon from '~/assets/icons/likecoin.svg';

import { W3C_EMAIL_REGEX } from '~/constant';
import { openURL } from '~/util/client';

function getUrlWithPrefix(url) {
  return /https?:\/\//.test(url) ? url : `https://${url}`;
}

const TYPE = {
  READONLY: 'readonly',
  MINI: 'mini',
  LARGE: 'large',
};

const SOCIAL_MEDIA_LIST = [
  {
    id: 'facebook',
    tier: 1,
  },
  {
    id: 'flickr',
    tier: 1,
  },
  {
    id: 'medium',
    tier: 1,
  },
  {
    id: 'twitter',
    tier: 1,
  },
  /*
  {
    id: 'instagram',
    tier: 1,
  },
  */
];

const iconFolder = require.context('../assets/icons/social-media/');

export default {
  name: 'social-media-connect',
  props: {
    type: {
      type: String,
      default: TYPE.READONLY,
      validator(value) {
        return !!TYPE[value.toUpperCase()];
      },
    },
    platforms: {
      type: Object,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    center: {
      type: [Boolean, String],
      default: false,
    },
    limit: {
      type: Number,
      default: undefined,
    },
  },
  computed: {
    isMini() {
      return this.type === TYPE.MINI;
    },
    socialMediaList() {
      const platforms = SOCIAL_MEDIA_LIST
        .filter(({ id, tier }) => {
          const isConnected = this.getIsConnected(id);
          return (
            (this.type === TYPE.READONLY && isConnected)
            || (this.type === TYPE.MINI && (isConnected || tier === 1))
            || this.type === TYPE.LARGE
          );
        });

      const links = Object.keys(this.platforms)
        .filter(id => this.platforms[id].isExternalLink)
        .map(id => ({ id, url: this.platforms[id].url }));
      links.sort(({ id: id1 }, { id: id2 }) => (
        this.platforms[id1].order - this.platforms[id2].order
      ));

      return [...platforms, ...links].slice(0, this.limit);
    },
  },
  methods: {
    getIconPath(id) {
      try {
        const filePath = this.platforms[id] && this.platforms[id].isExternalLink
          ? `link/${this.platforms[id].iconType}`
          : id;
        return iconFolder(`./${filePath}.svg`);
      } catch (err) {
        return LikeCoinIcon;
      }
    },
    getIsConnected(id) {
      return !!this.platforms[id];
    },
    onClickButton(socialMedia) {
      const isConnected = this.getIsConnected(socialMedia.id);
      let url = this.getSocialMediaUrl(socialMedia);
      const isEmail = new RegExp(W3C_EMAIL_REGEX).test(url);
      if (isEmail) {
        url = `mailto:${url}`;
      } else {
        url = getUrlWithPrefix(url);
      }
      if (isConnected && url) {
        openURL(
          this,
          url,
          '_blank',
        );
      }
    },
    getSocialMediaUrl({ id }) {
      return this.platforms[id].url;
    },
    getSocialMediaTitle({ id }) {
      const platform = this.platforms[id];
      return (platform || {}).siteDisplayName || id;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~assets/css/variables";

$hover-color-map: (
  facebook: #3b5998,
  flickr: #0063dc,
  instagram: #c7548a,
  medium: #231f20,
  twitter: #1ea1f2,
);

.social-media-connect {
  > div {
    display: flex;
  }
  &--center > div {
    justify-content: center;
  }

  ul {
    display: flex;
    flex-wrap: wrap;

    margin: -10px -8px;
    padding: 0;

    list-style: none;

    > li {
      padding: 8px 6px;
    }
  }


  &__button {
    margin: 2px;

    cursor: pointer;

    transition: background-color .25s ease;

    border: none;
    border-radius: 50%;

    background-color: $like-gray-5;

    &:hover {
      background-color: darken($like-gray-5, 10);
    }
    &:active {
      background-color: darken($like-gray-5, 20);
    }

    &--disconnected {
      background-color: $gray-c0;

      &:hover {
        background-color: darken($gray-c0, 20);
      }
      &:active {
        background-color: darken($gray-c0, 30);
      }
    }

    @each $key, $value in $hover-color-map {
      &--#{$key}#{&}--connected {
        &:hover {
          background-color: $value;
        }
        &:active {
          background-color: darken($value, 10);
        }
      }
    }
  }

  &__add-button {
    margin: 0 -7px;
    padding: 7px;
  }
}

button[class*=social-media-connect__button--link] {
  background-color: transparent !important;
}
</style>
