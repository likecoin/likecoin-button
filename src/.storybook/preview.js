import { configure } from '@storybook/vue';

import Vue from 'vue';

// Import custom components.
import LikeCoinButtonV2 from '../components/LikeCoinButton.v2/LikeCoinButton.v2';

// Register custom components.
Vue.component('LikeCoinButtonV2', LikeCoinButtonV2);

configure(require.context('../components', true, /\.stories\.js$/), module);
