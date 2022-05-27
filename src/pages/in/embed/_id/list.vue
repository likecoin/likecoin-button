<template>
  <div class="liker-list-page">
    <div class="lc-container">
      <like-form>
        <template
          v-if="shouldShowBackButton"
          slot="header-left"
        >
          <a
            @click="$router.go(-1)"
            href="#"
          >
            {{ $t('general.back') }}
          </a>
        </template>

        <!-- TO-DO: handle about -->
        <!-- <template slot="header-right">
          <a
            :href="aboutURL"
            rel="noopener noreferrer"
            target="_blank"
          >
            {{ $t('LikeButton.button.aboutLikeCoin') }}
          </a>
        </template> -->

        <template v-if="isFetched">
          <span class="liker-list-page__content">
            {{ $t('Embed.label.numLikesForArticle', {
              numOfLikers,
              numOfLikes,
            }) }}
            <span v-if="title">— "{{ title }}"</span>
          </span>

          <div
            ref="likerList"
            class="liker-list-page__list"
          >
            <ul>
              <li
                v-for="(liker, index) in likerList"
                :key="index"
              >
                <user-avatar
                  :user="liker"
                />
              </li>
            </ul>

            <transition name="lc-transition-default">
              <div
                v-if="!isShowAll"
                class="liker-list-page__overflow-overlay"
              />
            </transition>
          </div>

          <div class="liker-list-page__show-more-btn-wrapper">
            <button
              v-if="!isShowAll"
              @click="onClickMoreButton"
            >
              {{ $t('Embed.button.showMore') }}
            </button>
          </div>
        </template>
        <lc-loading-indicator
          v-else
          class="liker-list-page__loading-indicator"
        />
      </like-form>
    </div>
  </div>
</template>


<script>
import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies

import LikeForm from '~/components/LikeForm';
import UserAvatar from '~/components/UserAvatar';

import { TweenLite } from 'gsap/all';

import {
  apiGetUserMinById,
  apiGetLikeButtonLikerList,
  apiGetLikeButtonTotalCount,
  apiGetPageTitle,
  apiGetLikeButtonLikerListByIscnId,
  apiGetLikeButtonTotalCountByIscnId,
} from '@/util/api/api';
import { checkValidDomainNotIP, handleQueryStringInUrl } from '@/util/url';

export default {
  name: 'embed-id-list',
  components: {
    LikeForm,
    UserAvatar,
  },
  COLLAPSED_LIKER_COUNT: 8,
  data() {
    return {
      isFetched: false,
      isShowAll: false,
      title: '',
      numOfLikes: 0,
      numOfLikers: 0,
      likers: [],
    };
  },
  computed: {
    urlReferrer() {
      const { query } = this.$route;
      let { referrer = '' } = query;
      if (referrer) {
        referrer = handleQueryStringInUrl(referrer);
      }
      return referrer;
    },
    referrer() {
      return this.urlReferrer;
    },
    aboutURL() {
      return `https://liker.land/civic?from=${this.$route.params.id}&referrer=${encodeURIComponent(this.referrer)}&utm_source=button`;
    },
    shouldShowBackButton() {
      return this.$route.query.show_back === '1';
    },
    likerList() {
      return this.isShowAll
        ? this.likers
        : this.likers.slice(0, this.$options.COLLAPSED_LIKER_COUNT);
    },
  },
  async mounted() {
    const { params, query } = this.$route;
    const iscnId = query.iscn_id;
    const referrer = handleQueryStringInUrl(query.referrer);
    let promises;
    if (iscnId) {
      promises = [
        apiGetLikeButtonLikerListByIscnId(iscnId),
        apiGetLikeButtonTotalCountByIscnId(iscnId),
      ];
      promises.push();
    } else {
      promises = [
        apiGetLikeButtonLikerList(params.id, referrer),
        apiGetLikeButtonTotalCount(params.id, referrer),
      ];
      if (referrer) {
        const url = encodeURI(referrer);
        /* Try to get html to fetch title below */
        if (checkValidDomainNotIP(url)) {
          promises.push(apiGetPageTitle(referrer));
        }
      }
    }
    const [
      { data: likers },
      { data: totalData },
      title,
    ] = await Promise.all(promises);
    this.title = title;
    this.numOfLikes = totalData.total;
    this.numOfLikers = totalData.totalLiker;
    this.likers = likers.map(id => ({ id }));
    this.isShowAll = likers.length <= this.$options.COLLAPSED_LIKER_COUNT;
    this.fetchList();
  },
  methods: {
    async fetchList() {
      this.likers.forEach(async (r) => {
        try {
          const { data } = await apiGetUserMinById(r.id);
          Vue.set(r, 'avatar', data.avatar);
          Vue.set(r, 'displayName', data.displayName || r.id);
          Vue.set(r, 'isPreRegCivicLiker', data.isPreRegCivicLiker);
          Vue.set(r, 'isSubscribedCivicLiker', data.isSubscribedCivicLiker);
          Vue.set(r, 'civicLikerSince', data.civicLikerSince);
        } catch (err) {
          console.error(err);
        } finally {
          this.isFetched = true;
        }
      });
    },
    onClickMoreButton() {
      const collapsedHeight = this.$refs.likerList.offsetHeight;
      this.isShowAll = true;
      this.$nextTick(() => {
        TweenLite.from(this.$refs.likerList, 1, {
          height: collapsedHeight,
          ease: 'easeOutPower3',
          clearProps: 'height',
        });
      });
    },
  },
};
</script>


<style lang="scss">
@import "~assets/css/variables";
@import "~assets/css/mixin";

$user-avatar-image-size: 48px;

.liker-list-page {
  .user-avatar {
    min-height: 72px;
    padding: 16px 8px;

    border-bottom: 1px solid #e6e6e6;
  }

  &__loading-indicator {
    display: block;

    margin: 64px auto;

    color: $like-green;
  }

  &__content {
    color: $like-dark-brown-2;

    font-size: 20px;
    font-weight: 300;
  }

  &__list {
    position: relative;

    overflow: hidden;

    margin-top: 8px;

    ul {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;

      margin: -8px;
      padding: 0;

      list-style: none;

      li {
        width: 50%;
        padding: 0 8px;

        @media screen and (max-width: 600px) {
          width: 100%;
        }
      }
    }
  }

  &__overflow-overlay {
    position: absolute;
    bottom: 0;
    left: 0;

    width: 100%;
    height: 25%;

    background-image: linear-gradient(to bottom, rgba($like-gray-1, 0), $like-gray-1 60%);

    @media screen and (max-width: 600px) {
      height: 10%;
    }
  }

  &__show-more-btn-wrapper {
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
