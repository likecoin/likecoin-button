<template>
  <div>{{ $t('general.loading') }}</div>
</template>
<script>
import { EXTERNAL_HOSTNAME, LIKECOIN_OEMBED_API_BASE } from '@/constant';

import { checkIsValidISCNId, checkIsValidNFTClassId } from '~/util/nft';

export default {
  head() {
    return {
      title: this.$t('LikeButton.head.title', { name: this.id }),
      meta: [
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.$t('LikeButton.head.title', { name: this.id }),
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('LikeButton.head.description'),
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.$t('LikeButton.head.description'),
        },
      ],
      link: [
        {
          rel: 'alternate',
          type: 'application/json+oembed',
          href: `${LIKECOIN_OEMBED_API_BASE}?url=${this.encodedExternalURL}&format=json`,
          title: this.$t('LikeButton.head.title', { name: this.id }),
        },
        {
          rel: 'alternate',
          type: 'application/xml+oembed',
          href: `${LIKECOIN_OEMBED_API_BASE}?url=${this.encodedExternalURL}&format=xml`,
          title: this.$t('LikeButton.head.title', { name: this.id }),
        },
      ],
    };
  },
  computed: {
    id() {
      return this.params.id;
    },
    encodedExternalURL() {
      return encodeURIComponent(`https://${EXTERNAL_HOSTNAME}${this.$route.path}`);
    },
  },
  fetch({
    params,
    query,
    redirect,
  }) {
    const { id } = params;
    if (checkIsValidISCNId(id)) {
      // /:iscn_id -> /in/like/iscn?iscn_id=:iscn_id
      redirect({ name: 'in-like-id', params: { id: 'iscn' }, query: { iscn_id: id } });
    } else if (checkIsValidNFTClassId(id)) {
      // /:class_id -> /in/nft?class_id=:class_id
      redirect({ name: 'in-nft', query: { ...query, class_id: id } });
    } else {
      redirect({ name: 'in-like-id', params, query });
    }
  },
};
</script>
