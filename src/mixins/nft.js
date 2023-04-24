import { BigNumber } from 'bignumber.js';

import { LIKER_LAND_URL_BASE } from '~/constant';
import { checkIsValidISCNId, checkIsValidNFTClassId, parseImageURLFromMetadata } from '~/util/nft';
import {
  apiGetNFTMintInfo,
  apiGetLikerDataByAddress,
  apiGetNFTMetadata,
  apiGetNFTOwners,
  getNFTListingInfo,
} from '~/util/api/api';
import { logTrackerEvent } from '@/util/EventLogger';

export default {
  layout: 'widget',
  data() {
    return {
      widgetScale: 1,
    };
  },
  computed: {
    collectButtonLabel() {
      return this.$route.query.cta_button_label || this.$t('cta_nft_collect_button');
    },
    nftIsShowListingPrice() {
      return (
        this.nftListing && this.nftListing.price < this.nftCollectingPrice
      );
    },
    nftPrice() {
      return this.nftIsShowListingPrice
        ? this.nftListing.price
        : this.nftCollectingPrice;
    },
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
    shouldCollectInCampaign() {
      return this.$route.query.campaign !== undefined;
    },
    detailsURL() {
      return `${LIKER_LAND_URL_BASE}/nft/class/${this.nftClassId}`;
    },
    purchaseURL() {
      if (this.shouldCollectInCampaign) {
        return `${LIKER_LAND_URL_BASE}/campaign/writing-nft?utm_source=widget#${this.nftClassId}`;
      }
      return `${this.detailsURL}?action=collect&utm_source=widget`;
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
      nftListingResult,
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
      getNFTListingInfo(qsNftClassId).catch(() => ({})),
    ]);
    const {
      iscnId,
      classId: nftClassId,
      currentPrice: nftCollectingPrice,
      soldCount: nftCollectedCount,
    } = apiMintInfoResult.data || {}
    const {
      name: contentTitle,
      description: contentDescription,
      image: contentImage = '',
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

    const { listings = [] } = nftListingResult.data || {};
    const nftListing = listings
      .map((l) => {
        const {
          class_id: classId,
          nft_id: nftId,
          seller,
          price,
          expiration,
        } = l;
        return {
          classId,
          nftId,
          seller,
          price: new BigNumber(price).shiftedBy(-9).toNumber(),
          expiration: new Date(expiration),
        };
      })
      .sort((a, b) => a.price - b.price)[0]

    return {
      contentTitle,
      contentDescription,
      contentImage: parseImageURLFromMetadata(contentImage),
      contentURL,
      iscnId,
      iscnOwnerAddress,
      iscnOwnerDisplayName,
      iscnOwnerAvatarSrc,
      isIscnOwnerCivicLiker: isIscnOwnerSubscribedCivicLiker || isIscnOwnerCivicLikerTrial,
      nftClassId,
      nftCollectingPrice,
      nftListing,
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
      logTrackerEvent(this, 'NFTWidgetAction', 'clickViewNFTDetails', 'clickViewNFTDetails(widget)', 1);
      window.open(
        `${this.detailsURL}?utm_source=widget`,
        `collect_${this.classId}`
      );
    },
    collectNFT() {
      logTrackerEvent(this, 'NFTWidgetAction', 'clickCollectNFT', 'clickCollectNFT(widget)', 1);
      window.open(
        this.purchaseURL,
        `collect_${this.classId}`,
        this.shouldCollectInCampaign ? undefined : 'popup=1,width=768,height=576,top=0,left=0'
      );
    },
    likeISCN() {
      logTrackerEvent(this, 'NFTWidgetAction', 'clickLikeISCN', 'clickLikeISCN(widget)', 1);
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
