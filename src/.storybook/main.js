const path = require("path");

module.exports = {
  "stories": [
    "../**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-knobs",
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  "webpackFinal": (config) => {
    /**
     * core-js compatibility issue
     * https://github.com/storybookjs/storybook/issues/11255
     */
    config.resolve.alias['core-js/modules'] = path.resolve(
      __dirname,
      '..',
      'node_modules/@storybook/core/node_modules/core-js/modules'
    );
    return config;
  }
}
