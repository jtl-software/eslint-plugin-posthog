import { RuleTester } from 'eslint';
import rule from '../../src/rules/consistent-property-naming.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

ruleTester.run('consistent-property-naming', rule, {
  valid: [
    {
      code: `postHog.capture('event_name', { userId: '123', productName: 'Test' })`,
    },
    {
      code: `postHog.capture('event_name', { count: 5, isActive: true })`,
    },
    {
      code: `postHog.capture('event_name', { a: 1, bc: 2, def: 3 })`,
    },
    {
      code: `// Not a PostHog call
                 someOtherFunction({ user_id: '123' })`,
    },
  ],

  invalid: [
    {
      code: `postHog.capture('event_name', { user_id: '123' })`,
      errors: [
        {
          messageId: 'notCamelCase',
          data: { property: 'user_id' },
        },
      ],
    },
    {
      code: `postHog.capture('event_name', { product_name: 'Test', userId: '123' })`,
      errors: [
        {
          messageId: 'notCamelCase',
          data: { property: 'product_name' },
        },
      ],
    },
    {
      code: `postHog.capture('event_name', { UserID: '123', productName: 'Test' })`,
      errors: [
        {
          messageId: 'notCamelCase',
          data: { property: 'UserID' },
        },
      ],
    },
    {
      code: `postHog.capture('event_name', {
                   userId: '123',
                   product_name: 'Test',
                   is_active: true
                 })`,
      errors: [
        {
          messageId: 'notCamelCase',
          data: { property: 'product_name' },
        },
        {
          messageId: 'notCamelCase',
          data: { property: 'is_active' },
        },
      ],
    },
  ],
});
