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
      <h2 v-if="isError">{{ isNotFound ? `User ${likee} Not Found` : 'Error' }}</h2>
      <h2 v-else-if="isNeedCaptcha">Checking reCaptcha...</h2>
      <h2 v-else-if="!isDone">Loading...</h2>
      <h2 v-else class="subtitle">
        You have just liked {{ likee }}
      </h2>
      <div class="links">
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
    return axios.get(`https://like.co/api/users/id/${params.id}/min`)
      .then((res) => {
        const { avatar, displayName } = res.data;
        return {
          avatar,
          likee: params.id,
          displayName: displayName || params.id,
        };
      })
      .catch((e) => { // eslint-disable-line no-unused-vars
        error({ statusCode: 404, message: '' });
      });
  },
  head() {
    return {
      title: `Like ${this.displayName}'s work`,
      meta: [
        {
          hid: 'og_title',
          property: 'og:title',
          content: `Like ${this.displayName}'s work`,
        },
        {
          hid: 'description',
          name: 'description',
          content: 'Reward Creativity, powered by LikeCoin',
        },
        {
          hid: 'og_description',
          property: 'og:description',
          content: 'Reward Creativity, powered by LikeCoin',
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
          `/api/like/${this.likee}`,
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
