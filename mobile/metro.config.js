const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Performance optimizations
config.transformer = {
  ...config.transformer,
  enableInlineRequires: true,
  minifierConfig: {
    keep_fnames: true,
    mangle: {
      keep_fnames: true,
    },
  },
};

// Enable Hermes optimizations
config.resolver = {
  ...config.resolver,
  unstable_enableSymlinks: false,
};

// Bundle splitting for better performance
config.serializer = {
  ...config.serializer,
  createModuleIdFactory: function () {
    return function (path) {
      // Use shorter module IDs for better performance
      return path.replace(__dirname, '').replace(/\\/g, '/');
    };
  },
};

module.exports = config;