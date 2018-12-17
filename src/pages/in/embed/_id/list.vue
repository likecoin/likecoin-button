<template>
  <div class="likee-list-page">
    <div class="lc-container">
      <like-form>
        <template
          v-if="shouldShowBackButton"
          slot="header-left"
        >
          <a
            href="#"
            @click="$router.go(-1)"
          >
            {{ $t('general.back') }}
          </a>
        </template>

        <template slot="header-right">
          <a
            href="https://like.co/"
            rel="noopener noreferrer"
            target="_blank"
          >
            {{ $t('LikeButton.button.aboutLikeCoin') }}
          </a>
        </template>

        <span class="likee-list-page__content">
          {{ $t('Embed.label.numLikesForArticle', {
            numOfLikees: likees.length,
            numOfLikes,
          }) }}
          <span v-if="title">— "{{ title }}"</span>
        </span>

        <div
          :class="['likee-list-page__list', { expand: isShowAll }]"
          :style="{ maxHeight: `${Math.ceil(likees.length / 2) * 74}px` }"
        >

          <user-avatar
            v-for="(likee, index) in likees"
            :key="index"
            :user="likee"
          />

          <transition name="lc-transition-default">
            <div
              v-if="!isShowAll"
              class="overflow-overlay"
            />
          </transition>
        </div>

        <div
          class="likee-list-page__show-more-btn-wrapper"
        >
          <button
            v-if="!isShowAll"
            @click="isShowAll = true"
          >
            {{ $t('Embed.button.showMore') }}
          </button>
        </div>
      </like-form>
    </div>
  </div>
</template>


<script>
import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies

import axios from '~/plugins/axios';

import LikeForm from '~/components/LikeForm';
import UserAvatar from '~/components/UserAvatar';

import {
  apiGetUserMinById,
  apiGetLikeButtonLikerList,
  apiGetLikeButtonTotalCount,
} from '@/util/api/api';

import { MEDIUM_REGEX } from '~/constant';

/* Although firebase fn should not have access to sensitive internal res,
  and this isolation behaviour should be used as main defense,
  still implement basic filter on url to avoi SSRF
*/
const checkValidDomainNotIP = (url) => {
  const match = url.match(/^(?:http(?:s)?:\/\/)?([a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+)(?::\d+)?/);
  if (!match || !match[1]) return false;
  const parts = match[1].split('.');
  const isIP = (parts.length === 4 && parts.every((part) => {
    try {
      const partNum = Number(part);
      return partNum >= 0 && partNum <= 255;
    } catch (err) {
      return false;
    }
  }));
  return !isIP;
};

export default {
  name: 'embed-id-list',
  layout: 'narrowWithHeader',
  components: {
    LikeForm,
    UserAvatar,
  },
  async asyncData({ params, query }) {
    const promises = [
      apiGetLikeButtonLikerList(params.id, query.referrer),
      apiGetLikeButtonTotalCount(params.id, query.referrer),
    ];
    if (query.referrer) {
      let url = encodeURI(query.referrer);
      const match = query.referrer.match(MEDIUM_REGEX);
      if (match && match[1]) url = `https://medium.com/p/${match[1]}`;

      /* Try to get html to fetch title below */
      if (checkValidDomainNotIP(url)) {
        promises.push(axios.get(url, { responseType: 'text', headers: { Accept: 'text/html' } }).catch(() => ''));
      }
    }
    const [
      { data: likees },
      { data: totalData },
      { data: html } = {},
    ] = await Promise.all(promises);
    let title = '';
    if (html) {
      const match = html.match(/<title(?: [a-zA-Z0-9-="']+)?>(.*?)<\/title>/);
      if (match && match[1]) [, title] = match;
    }
    return {
      title,
      isShowAll: likees.length <= 8,
      numOfLikes: totalData.total,
      likees: likees.map(id => ({ id })),
    };
  },
  data() {
    return {
      isShowAll: false,
    };
  },
  computed: {
    referrer() {
      return this.$route.query.referrer;
    },
    shouldShowBackButton() {
      return this.$route.query.show_back === '1';
    },
  },
  mounted() {
    this.fetchList();
  },
  methods: {
    async fetchList() {
      this.likees.forEach(async (r) => {
        try {
          const { data } = await apiGetUserMinById(r.id);
          Vue.set(r, 'avatar', data.avatar);
          Vue.set(r, 'displayName', data.displayName);
        } catch (err) {
          console.error(err);
        }
      });
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~assets/css/variables";
@import "~assets/css/mixin";

$user-avatar-image-size: 48px;

.likee-list-page {
  .user-avatar {
    min-height: 72px;
    padding-top: 16px;
    padding-bottom: 8px;

    border-bottom: 1px solid #e6e6e6;
  }

  &__content {
    color: $like-dark-brown-2;

    font-size: 20px;
    font-weight: 300;
  }

  &__list {
    position: relative;

    display: flex;
    overflow: hidden;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;

    margin-top: 8px;

    transition: max-height 0.25s ease-in-out;

    &:not(.expand) {
      max-height: 272px !important;
    }

    > * {
      width: calc(50% - 16px);
    }

    .overflow-overlay {
      position: absolute;
      bottom: 0;
      left: 0;

      width: 100%;
      height: calc(100% - 226px);

      background-image: linear-gradient(to bottom, rgba(247, 247, 247, 0), $like-gray-1);
    }
  }

  &__show-more-btn-wrapper {
    margin-top: 12px;

    text-align: center;

    button {
      padding: 8px 10px;

      cursor: pointer;
      transition: background-color 0.2s ease-in-out;
      text-decoration: underline;

      color: $like-green;
      border: none;
      border-radius: 2px;
      outline:none;
      background-color: transparent;

      font-size: 14px;

      &:hover {
        background-color: $like-gray-3;
      }

      &:active {
        background-color: $gray-9b;
      }
    }
  }
}
</style>
