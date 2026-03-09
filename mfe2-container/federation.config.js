const { withNativeFederation, shareAll } = require('@softarc/native-federation/build');


module.exports = withNativeFederation({
  name: 'mfe2-container',

  exposes: {
    './Component': './src/remote-entry.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: false, requiredVersion: 'auto' }),
  },
});
