<template>
  <section class="container">
    <div>
      <h1 class="title">
        likecoin-button
      </h1>
      <img v-if="avatar" :src="avatar" />
      <h2 class="subtitle">
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
import axios from '~/plugins/axios';

export default {
  name: 'id',
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
};
</script>
