import baseConfig from '@maintix/eslint-config';

export default [
  ...baseConfig,
  {
    ignores: ['dist/', 'coverage/'],
  },
];
