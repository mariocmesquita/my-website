const nodeExternals = require('webpack-node-externals');

/**
 * Webpack config for NestJS production build.
 */
module.exports = (options) => ({
  ...options,
  externals: [
    nodeExternals({
      allowlist: [/^@my-website\//],
    }),
  ],
});
