module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@/components': './src/components',
          '@/pages': './src/pages',
          '@/hooks': './src/hooks',
          '@/services': './src/services',
          '@/utils': './src/utils',
          '@/types': './src/types',
          '@/assets': './src/assets',
        },
      },
    ],
  ],
};
