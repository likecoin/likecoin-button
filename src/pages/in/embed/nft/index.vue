<template>
  <NFTWidget
    ref="widget"
    :title="contentTitle"
    :description="contentDescription"
    :img-src="contentImage"
    :url="contentURL"
    :price="nftPrice"
    :collect-button-label="$t('cta_nft_collect_button')"
    :collector-count="nftCollectorCount"
    :collected-count="nftCollectedCount"
    :owner-address="iscnOwnerAddress"
    :owner-display-name="iscnOwnerDisplayName"
    :owner-avatar-src="iscnOwnerAvatarSrc"
    :is-fixed-size="isFixedSize"
    :is-content-clickable="false"
    :style="widgetStyle"
    @view-details="viewNFTDetails"
    @collect="collectNFT"
    @like="likeISCN"
    @load-image="handleResizing"
  />
</template>

<script>
import nftMixin from '~/mixins/nft';

export default {
  mixins: [nftMixin],
};
</script>
