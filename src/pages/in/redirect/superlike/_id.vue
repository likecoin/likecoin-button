<template>
  <div>{{ $t('general.loading') }}</div>
</template>
<script>
import { apiGetSuperLikeInfo } from '@/util/api/api';

const URL = require('url-parse');

export default {
  async fetch({
    res,
    params,
    error,
    redirect,
  }) {
    const superLikeID = params.id;
    try {
      const { data } = await apiGetSuperLikeInfo(superLikeID);
      res.cookie('likebutton_superlike_id', superLikeID, {
        maxAge: 30000,
        secure: true,
        sameSite: 'none',
      });
      res.setHeader('Cache-Control', 'no-store');
      let urlString = data.liker ? `https://like.co/${data.liker}` : 'https://liker.land';
      if (data && data.url) {
        const url = new URL(data.url, true);
        url.query.superlike_id = superLikeID;
        url.set('query', url.query);
        urlString = url.toString();
      }
      redirect(urlString);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      error(err);
    }
  },
};
</script>
