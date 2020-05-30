import { configure } from '@storybook/vue';

configure(require.context('../components', true, /\.stories\.js$/), module);
