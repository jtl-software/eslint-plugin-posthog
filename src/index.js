import consistentPropertyNaming from './rules/consistent-property-naming.js';
import validEventNames from './rules/valid-event-names.js';

const plugin = {
  meta: {
    name: '@jtl-software/eslint-plugin-posthog',
    version: '0.1.0',
  },
  rules: {
    'consistent-property-naming': consistentPropertyNaming,
    'valid-event-names': validEventNames,
  },
  configs: {
    recommended: {
      plugins: ['posthog'],
      rules: {
        'posthog/consistent-property-naming': 'error',
        'posthog/valid-event-names': 'error',
      },
    },
  },
};

export default plugin;
