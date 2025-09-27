const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Performance optimizations
config.transformer = {
  ...config.transformer,
  enableInlineRequires: true,
};

module.exports = config;