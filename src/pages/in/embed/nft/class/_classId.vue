<template>
  <NFTWidget
    :title="contentTitle"
    :description="contentDescription"
    :img-src="contentImage"
    :url="contentURL"
    :price="nftPrice"
    :owner-address="iscnOwnerAddress"
    @collect="collectNFT"
    @like="likeISCN"
  />
</template>

<script>
import { APP_LIKE_CO_URL_BASE } from '~/constant';
import {
  apiGetNFTMetadata,
  apiGetNFTPurchaseInfo,
} from '~/util/api/api';
import { getClassInfo } from '~/util/nft';

export default {
  layout: 'widget',
  computed: {
    purchaseURL() {
      return `${APP_LIKE_CO_URL_BASE}/nft/purchase/${encodeURIComponent(
        this.iscnId
      )}`;
    },
  },
  async asyncData({ params }) {
    const { classId } = params;
    let metadata;
    const [
      apiMetadata,
      chainMetadata = {},
      purchaseInfo,
    ] = await Promise.all([
      apiGetNFTMetadata({ classId })
        // eslint-disable-next-line no-console
        .catch(error => console.error(error)),
      getClassInfo(classId),
      apiGetNFTPurchaseInfo({ classId })
        // eslint-disable-next-line no-console
        .catch(error => console.error(error))
    ]);
    const {
      name,
      description,
      data: {
        metadata: classMetadata = {},
        parent,
      } = {},
    } = chainMetadata;
    metadata = {
      name,
      description,
      metadata: classMetadata,
      parent,
    };
    if (apiMetadata && apiMetadata.data) {
      metadata = {
        ...metadata,
        ...apiMetadata.data,
      };
    }
    const {
      name: contentTitle,
      description: contentDescription,
      image: contentImage,
      metadata: {
        url: contentURL,
      } = {},
      iscn_id: iscnId,
      iscn_owner: iscnOwnerAddress,
    } = metadata;
    const {
      price: nftPrice,
    } = (purchaseInfo || {}).data || {}
    return {
      classId,
      contentTitle,
      contentDescription,
      contentImage,
      contentURL,
      iscnId,
      iscnOwnerAddress,
      nftPrice,
    };
  },
  methods: {
    collectNFT() {
      window.open(
        this.purchaseURL,
        `collect_${this.classId}`,
        'popup=1,width=768,height=576,top=0,left=0'
      );
    },
    likeISCN() {
      window.open(
        `/in/like/iscn/?iscn_id=${encodeURIComponent(
          this.iscnId
        )}&action=like`,
        `like_${this.classId}`,
        'popup=1,width=768,height=576,top=0,left=0'
      );
    },
  }
};
</script>
