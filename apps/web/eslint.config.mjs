import baseConfig from '@maintix/eslint-config';

export default [
  ...baseConfig,
  {
    ignores: ['.next/', 'out/'],
  },
];
