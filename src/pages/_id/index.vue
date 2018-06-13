<template>
  <section class="container">
    <vue-recaptcha
      ref="invisibleRecaptcha"
      size="invisible"
      @verify="onCaptchaVerify"
      @expired="onCaptchaExpired"
      @render="onCaptchaRender"
      sitekey="6Le9w10UAAAAANsMwDA5YuiwCudW8YKu2RGI8Hcl" />
    <div>
      <h1 class="title">
        likecoin-button
      </h1>
      <img v-if="avatar" :src="avatar" />
      <h2 v-if="isError">
        {{ isNotFound ?
          $t('LikeButton.label.likedMessage', { name: likee })
          : $t('LikeButton.label.error') }}
      </h2>
      <h2 v-else-if="isNeedCaptcha"> {{ $t('LikeButton.label.checkingReCaptcha') }}</h2>
      <h2 v-else-if="!isDone"> {{ $t('LikeButton.label.loading') }}</h2>
      <h2 v-else class="subtitle">
        {{ $t('LikeButton.label.likedMessage', { name: likee }) }}
      </h2>
      <div class="links">
        <v-btn color="success">LikeCoin</v-btn>
        <a
          href="https://like.co/"
          target="_blank">LikeCoin</a>
      </div>
    </div>
  </section>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha';
import axios from '~/plugins/axios';

export default {
  name: 'id',
  components: { VueRecaptcha },
  data() {
    return {
      reCaptchaResponse: '',
      isNeedCaptcha: false,
      isDone: false,
      isError: false,
      isNotFound: false,
    };
  },
  computed: {
    likee() {
      return this.$route.params.id;
    },
  },
  asyncData({
    route,
    params,
    query,
    redirect,
    error,
  }) {
    if (params.id !== params.id.toLowerCase()) {
      redirect({ name: route.name, params: { ...params, id: params.id.toLowerCase() }, query });
    }
    return axios.get(`https://api.like.co/api/users/id/${params.id}/min`)
      .then((res) => {
        const { avatar, displayName } = res.data;
        return {
          avatar,
          displayName: displayName || params.id,
        };
      })
      .catch((e) => { // eslint-disable-line no-unused-vars
        error({ statusCode: 404, message: '' });
      });
  },
  head() {
    return {
      title: this.$t('LikeButton.head.title', { name: this.displayName }),
      meta: [
        {
          hid: 'og_title',
          property: 'og:title',
          content: this.$t('LikeButton.head.title', { name: this.displayName }),
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('LikeButton.head.description'),
        },
        {
          hid: 'og_description',
          property: 'og:description',
          content: this.$t('LikeButton.head.description'),
        },
        {
          hid: 'og_image',
          property: 'og:image',
          content: 'https://like.co/images/og/tokensale.jpg',
        },
      ],
    };
  },
  methods: {
    async postLike() {
      try {
        await axios.post(
          `https://api.like.co/api/like/${this.likee}`,
          { reCaptchaResponse: this.reCaptchaResponse },
          { headers: { 'Like-Referer': document.referrer } },
        );
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.isNotFound = true;
        }
        this.isError = true;
      }
      this.isDone = true;
      this.$router.replace({ name: 'id-done', params: this.$route.params });
    },
    onCaptchaVerify(response) {
      this.isNeedCaptcha = false;
      this.reCaptchaResponse = response;
      if (!this.isDone) this.postLike();
    },
    onCaptchaExpired() {
      this.reCaptchaResponse = '';
    },
    onCaptchaRender() {
      this.isNeedCaptcha = true;
      this.$refs.invisibleRecaptcha.execute();
    },
  },
};
</script>
