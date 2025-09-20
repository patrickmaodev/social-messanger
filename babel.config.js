module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@/components': './src/components',
            '@/screens': './src/screens',
            '@/services': './src/services',
            '@/utils': './src/utils',
            '@/config': './src/config',
            '@/types': './src/types',
            '@/hooks': './src/hooks',
            '@/store': './src/store',
          },
        },
      ],
      'react-native-worklets/plugin',
    ],
  };
};