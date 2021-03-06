import Vue from 'vue'; // eslint-disable-line import/no-extraneous-dependencies
import LikeCoinUI, {
  LcAvatar,
  LcLoadingIndicator,
} from '@likecoin/ui-vue';

Vue.use(LikeCoinUI, {
  components: {
    LcAvatar,
    LcLoadingIndicator,
  },
});
