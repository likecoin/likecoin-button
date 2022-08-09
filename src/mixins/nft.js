import {
  APP_LIKE_CO_URL_BASE,
  LIKER_LAND_URL_BASE,
} from '~/constant';
import {
  apiGetNFTMintInfo,
  apiGetLikerDataByAddress,
  apiGetNFTMetadata,
  apiGetNFTOwners,
} from '~/util/api/api';

export default {
  layout: 'widget',
  computed: {
    widgetId() {
      return this.$route.query.wid;
    },
    detailsURL() {
      return `${LIKER_LAND_URL_BASE}/nft/class/${this.nftClassId}`;
    },
    purchaseURL() {
      return `${APP_LIKE_CO_URL_BASE}/nft/purchase/${encodeURIComponent(
        this.iscnId
      )}`;
    },
  },
  async asyncData({ params }) {
    const [
      apiMintInfoResult,
      apiMetadataResult,
      apiOwnersResult,
    ] = await Promise.all([
      apiGetNFTMintInfo(params)
        // eslint-disable-next-line no-console
        .catch(error => console.error(error)),
      apiGetNFTMetadata(params)
        // eslint-disable-next-line no-console
        .catch(error => console.error(error)),
      apiGetNFTOwners(params)
        // eslint-disable-next-line no-console
        .catch(error => console.error(error)),
    ]);
    const {
      iscnId,
      classId: nftClassId,
      currentPrice: nftPrice,
      soldCount: nftCollectedCount,
    } = (apiMintInfoResult || {}).data || {}
    const {
      name: contentTitle,
      description: contentDescription,
      image: contentImage,
      external_url: contentURL,
      iscn_owner: iscnOwnerAddress,
    } = (apiMetadataResult || {}).data || {};
    const ownersMap = (apiOwnersResult || {}).data || {};
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
      contentTitle,
      contentDescription,
      contentImage,
      contentURL,
      iscnId,
      iscnOwnerAddress,
      iscnOwnerDisplayName,
      iscnOwnerAvatarSrc,
      isIscnOwnerCivicLiker: isIscnOwnerSubscribedCivicLiker || isIscnOwnerCivicLikerTrial,
      nftClassId,
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
