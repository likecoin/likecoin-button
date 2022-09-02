import { LIKER_LAND_URL_BASE } from '~/constant';
import { checkIsValidISCNId, checkIsValidNFTClassId } from '~/util/nft';
import {
  apiGetNFTMintInfo,
  apiGetLikerDataByAddress,
  apiGetNFTMetadata,
  apiGetNFTOwners,
} from '~/util/api/api';

export default {
  layout: 'widget',
  data() {
    return {
      widgetScale: 1,
    };
  },
  computed: {
    isFixedSize() {
      return !this.$route.query.responsive;
    },
    widgetWidth() {
      return 360;
    },
    widgetStyle() {
      if (this.isFixedSize) {
        return {
          width: `${this.widgetWidth}px`,
          transform: `scale(${this.widgetScale})`,
          transformOrigin: 'top left',
        };
      }
      return null;
    },
    widgetId() {
      return this.$route.query.wid;
    },
    detailsURL() {
      return `${LIKER_LAND_URL_BASE}/nft/class/${this.nftClassId}`;
    },
    purchaseURL() {
      return `${this.detailsURL}?action=collect`;
    },
  },
  async asyncData({
    redirect,
    error,
    query: { iscn_id: qsIscnId, class_id: qsNftClassId, ...query }
  }) {
    if (qsIscnId) {
      if (!checkIsValidISCNId(qsIscnId)) {
        error({ statusCode: 400, message: 'INVALID_ISCN_ID' });
        return undefined;
      }
    } else if (qsNftClassId) {
      if (!checkIsValidNFTClassId(qsNftClassId)) {
        error({ statusCode: 400, message: 'INVALID_NFT_CLASS_ID' });
        return undefined;
      }
    } else {
      redirect('/');
      return undefined;
    }
    const apiParams = {
      iscnId: qsIscnId,
      classId: qsNftClassId,
    };
    const [
      apiMintInfoResult,
      apiMetadataResult,
      apiOwnersResult,
    ] = await Promise.all([
      apiGetNFTMintInfo(apiParams).catch(() => {
        // Redirect to /in/like/iscn?iscn_id=:iscn_id if the ISCN has not been minted NFT
        if (apiParams.iscnId && !apiParams.classId) {
          redirect({
            name: 'in-like-id',
            params: { id: 'iscn' },
            query: { ...query, iscn_id: qsIscnId },
          });
        } else {
          error({ statusCode: 404, message: 'NFT_NOT_MINTED' });
        }
        return {};
      }),
      apiGetNFTMetadata(apiParams).catch(() => ({})),
      apiGetNFTOwners(apiParams).catch(() => ({})),
    ]);
    const {
      iscnId,
      classId: nftClassId,
      currentPrice: nftPrice,
      soldCount: nftCollectedCount,
    } = apiMintInfoResult.data || {}
    const {
      name: contentTitle,
      description: contentDescription,
      image: contentImage,
      external_url: contentURL,
      iscn_owner: iscnOwnerAddress,
    } = apiMetadataResult.data || {};
    const ownersMap = apiOwnersResult.data || {};
    const nftCollectorCount = Object.keys(ownersMap).length;

    const likerDataResult = await apiGetLikerDataByAddress(iscnOwnerAddress).catch(() => ({}));
    const {
      displayName: iscnOwnerDisplayName,
      avatar: iscnOwnerAvatarSrc,
      isCivicLikerTrial: isIscnOwnerCivicLikerTrial,
      isSubscribedCivicLiker: isIscnOwnerSubscribedCivicLiker,
    } = likerDataResult.data || {}
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
    this.resizeListener = window.addEventListener('resize', () => {
      window.requestAnimationFrame(this.handleResizing);
    });
    this.handleResizing();
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
    handleResizing() {
      if (this.isFixedSize) {
        this.widgetScale = Math.min(1, window.innerWidth / this.widgetWidth);
      } else {
        this.notifyParentOfResizing();
      }
    },
  }
};
