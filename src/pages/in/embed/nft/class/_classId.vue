<template>
  <NFTWidget
    ref="widget"
    :title="contentTitle"
    :description="contentDescription"
    :img-src="contentImage"
    :url="contentURL"
    :price="nftPrice"
    :collector-count="nftCollectorCount"
    :collected-count="nftCollectedCount"
    :owner-address="iscnOwnerAddress"
    :owner-display-name="iscnOwnerDisplayName"
    :owner-avatar-src="iscnOwnerAvatarSrc"
    :is-content-clickable="false"
    @view-details="viewNFTDetails"
    @collect="collectNFT"
    @like="likeISCN"
    @load-image="notifyParentOfResizing"
  />
</template>

<script>
import {
  APP_LIKE_CO_URL_BASE,
  LIKER_LAND_URL_BASE,
} from '~/constant';
import {
  apiGetLikerDataByAddress,
  apiGetNFTMetadata,
  apiGetNFTOwners,
  apiGetNFTPurchaseInfo,
} from '~/util/api/api';
import { getClassInfo } from '~/util/nft';

export default {
  layout: 'widget',
  computed: {
    widgetId() {
      return this.$route.query.wid;
    },
    detailsURL() {
      return `${LIKER_LAND_URL_BASE}/nft/class/${this.classId}`;
    },
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
      chainMetadata = {},
      apiMetadataResult,
      ownersResult,
      purchaseInfoResult,
    ] = await Promise.all([
      getClassInfo(classId),
      apiGetNFTMetadata({ classId })
        // eslint-disable-next-line no-console
        .catch(error => console.error(error)),
      apiGetNFTOwners({ classId })
        // eslint-disable-next-line no-console
        .catch(error => console.error(error)),
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
    if (apiMetadataResult && apiMetadataResult.data) {
      metadata = {
        ...metadata,
        ...apiMetadataResult.data,
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
    } = (purchaseInfoResult || {}).data || {};
    const ownersMap = (ownersResult || {}).data || {};
    const nftCollectedCount = Object.values(ownersMap).reduce(
      (count, collected) => count + collected.length,
      0
    );
    const nftCollectorCount = Object.keys(ownersMap).length;

    const likerDataResult = await apiGetLikerDataByAddress(iscnOwnerAddress)
      // eslint-disable-next-line no-console
      .catch(error => console.error(error));
    const {
      displayName: iscnOwnerDisplayName,
      avatar: iscnOwnerAvatarSrc,
      isCivicLikerTrial: isIscnOwnerCivicLikerTrial,
      isSubscribedCivicLiker: isIscnOwnerSubscribedCivicLiker,
    } = (likerDataResult || {}).data || {}
    return {
      classId,
      contentTitle,
      contentDescription,
      contentImage,
      contentURL,
      iscnId,
      iscnOwnerAddress,
      iscnOwnerDisplayName,
      iscnOwnerAvatarSrc,
      isIscnOwnerCivicLiker: isIscnOwnerSubscribedCivicLiker || isIscnOwnerCivicLikerTrial,
      nftPrice,
      nftCollectedCount,
      nftCollectorCount,
    };
  },
  mounted() {
    // For iframe to resize
    if (window.parent) {
      this.resizeListener = window.addEventListener('resize', () => {
        window.requestAnimationFrame(this.notifyParentOfResizing);
      });
      this.notifyParentOfResizing();
    }
  },
  beforeDestroy() {
    if (this.resizeListener) {
      window.removeEventListener(this.resizeListener);
    }
  },
  methods: {
    viewNFTDetails() {
      window.open(
        this.detailsURL,
        `collect_${this.classId}`
      );
    },
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
    notifyParentOfResizing() {
      if (!window.parent || !this.$refs.widget) return;
      const {
        scrollWidth: width,
        scrollHeight: height,
      } = this.$refs.widget.$el;
      window.parent.postMessage(
        {
          type: 'likecoin-nft-widget-resize',
          widgetId: this.widgetId,
          width,
          height,
        },
        '*'
      );
    },
  }
};
</script>
