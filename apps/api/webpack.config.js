const nodeExternals = require('webpack-node-externals');

/**
 * Webpack config for NestJS production build.
 */
module.exports = (options) => ({
  ...options,
  externals: [
    ({ request }, callback) => {
      // Treat @generated and @prisma as external modules
      if (request && (request.startsWith('@generated/') || request.startsWith('@prisma/'))) {
        return callback(null, `commonjs ${request}`);
      }
      callback();
    },
    nodeExternals({
      allowlist: [/^@my-website\//],
    }),
  ],
});
