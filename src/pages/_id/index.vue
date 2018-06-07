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
  methods: {
    async postLike() {
      try {
        await axios.post(`/api/like/${this.likee}`, { reCaptchaResponse: this.reCaptchaResponse });
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
