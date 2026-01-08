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
      code: `postHog.capture('event_name', { user_id: '123', product_name: 'Test' })`,
    },
    {
      code: `postHog.capture('event_name', { count: 5, is_active: true })`,
    },
    {
      code: `postHog.capture('event_name', { a: 1, bc: 2, def: 3 })`,
    },
    {
      code: `// Not a PostHog call
                 someOtherFunction({ userId: '123' })`,
    },
    // Variable tracking - valid snake_case
    {
      code: `
        const properties = { user_id: '123', product_name: 'Test' };
        postHog.capture('event_name', properties);
      `,
    },
    // Wrapper function - valid snake_case
    {
      code: `
        function trackEvent(name, props) {
          postHog.capture(name, props);
        }
        trackEvent('event_name', { user_id: '123', product_name: 'Test' });
      `,
    },
    // Nested function with wrapper - valid snake_case
    {
      code: `
        function Component() {
          const handleCapture = (eventName, properties) => {
            postHog.capture(eventName, properties);
          };

          function handleClick() {
            handleCapture('button_clicked', {
              button_id: '123',
              button_name: 'Submit'
            });
          }
        }
      `,
    },
  ],

  invalid: [
    {
      code: `postHog.capture('event_name', { userId: '123' })`,
      errors: [
        {
          messageId: 'notSnakeCase',
          data: { property: 'userId' },
        },
      ],
    },
    {
      code: `postHog.capture('event_name', { productName: 'Test', user_id: '123' })`,
      errors: [
        {
          messageId: 'notSnakeCase',
          data: { property: 'productName' },
        },
      ],
    },
    {
      code: `postHog.capture('event_name', { UserID: '123', product_name: 'Test' })`,
      errors: [
        {
          messageId: 'notSnakeCase',
          data: { property: 'UserID' },
        },
      ],
    },
    {
      code: `postHog.capture('event_name', {
                   user_id: '123',
                   productName: 'Test',
                   is_active: true
                 })`,
      errors: [
        {
          messageId: 'notSnakeCase',
          data: { property: 'productName' },
        },
      ],
    },
    // Variable tracking scenarios
    {
      code: `
        const properties = { userId: '123' };
        postHog.capture('event_name', properties);
      `,
      errors: [
        {
          messageId: 'notSnakeCase',
          data: { property: 'userId' },
        },
      ],
    },
    {
      code: `
        const props = { productId: '123', productName: 'Test' };
        postHog.capture('event_name', props);
      `,
      errors: [
        {
          messageId: 'notSnakeCase',
          data: { property: 'productId' },
        },
        {
          messageId: 'notSnakeCase',
          data: { property: 'productName' },
        },
      ],
    },
    {
      code: `
        const eventProps = {
          user_id: '123',
          productName: 'Test',
          isActive: true
        };
        postHog.capture('event_name', eventProps);
      `,
      errors: [
        {
          messageId: 'notSnakeCase',
          data: { property: 'productName' },
        },
        {
          messageId: 'notSnakeCase',
          data: { property: 'isActive' },
        },
      ],
    },
    // Wrapper function scenarios
    {
      code: `
        function trackEvent(name, props) {
          postHog.capture(name, props);
        }
        trackEvent('event_name', { userId: '123' });
      `,
      errors: [
        {
          messageId: 'notSnakeCase',
          data: { property: 'userId' },
        },
      ],
    },
    {
      code: `
        const handleCapture = (eventName, properties) => {
          postHog.capture(eventName, properties);
        };
        handleCapture('product_added', {
          productId: '123',
          productName: 'Test'
        });
      `,
      errors: [
        {
          messageId: 'notSnakeCase',
          data: { property: 'productId' },
        },
        {
          messageId: 'notSnakeCase',
          data: { property: 'productName' },
        },
      ],
    },
    // Nested function scenario (like the original bug report)
    {
      code: `
        function Component() {
          const handleCapture = (eventName, properties) => {
            postHog.capture(eventName, properties);
          };

          function handleClick() {
            handleCapture('button_clicked', {
              buttonId: '123',
              buttonName: 'Submit'
            });
          }
        }
      `,
      errors: [
        {
          messageId: 'notSnakeCase',
          data: { property: 'buttonId' },
        },
        {
          messageId: 'notSnakeCase',
          data: { property: 'buttonName' },
        },
      ],
    },
  ],
});

// Tests for camelCase configuration
ruleTester.run('consistent-property-naming with camelCase', rule, {
  valid: [
    {
      code: `postHog.capture('event_name', { userId: '123', productName: 'Test' })`,
      options: [{ casing: 'camelCase' }],
    },
    {
      code: `postHog.capture('event_name', { count: 5, isActive: true })`,
      options: [{ casing: 'camelCase' }],
    },
    {
      code: `postHog.capture('event_name', { a: 1, bc: 2, def: 3 })`,
      options: [{ casing: 'camelCase' }],
    },
    // Variable tracking - valid camelCase
    {
      code: `
        const properties = { userId: '123', productName: 'Test' };
        postHog.capture('event_name', properties);
      `,
      options: [{ casing: 'camelCase' }],
    },
    // Wrapper function - valid camelCase
    {
      code: `
        function trackEvent(name, props) {
          postHog.capture(name, props);
        }
        trackEvent('event_name', { userId: '123', productName: 'Test' });
      `,
      options: [{ casing: 'camelCase' }],
    },
  ],

  invalid: [
    // snake_case when camelCase is expected
    {
      code: `postHog.capture('event_name', { user_id: '123' })`,
      options: [{ casing: 'camelCase' }],
      errors: [
        {
          messageId: 'notCamelCase',
          data: { property: 'user_id' },
        },
      ],
    },
    {
      code: `postHog.capture('event_name', { product_name: 'Test', userId: '123' })`,
      options: [{ casing: 'camelCase' }],
      errors: [
        {
          messageId: 'notCamelCase',
          data: { property: 'product_name' },
        },
      ],
    },
    // PascalCase (not valid)
    {
      code: `postHog.capture('event_name', { UserID: '123', productName: 'Test' })`,
      options: [{ casing: 'camelCase' }],
      errors: [
        {
          messageId: 'notCamelCase',
          data: { property: 'UserID' },
        },
      ],
    },
    // Mixed casing
    {
      code: `postHog.capture('event_name', {
                   userId: '123',
                   product_name: 'Test',
                   is_active: true
                 })`,
      options: [{ casing: 'camelCase' }],
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
    // Variable tracking with invalid casing
    {
      code: `
        const properties = { user_id: '123' };
        postHog.capture('event_name', properties);
      `,
      options: [{ casing: 'camelCase' }],
      errors: [
        {
          messageId: 'notCamelCase',
          data: { property: 'user_id' },
        },
      ],
    },
    // Wrapper function with invalid casing
    {
      code: `
        function trackEvent(name, props) {
          postHog.capture(name, props);
        }
        trackEvent('event_name', { user_id: '123', product_name: 'Test' });
      `,
      options: [{ casing: 'camelCase' }],
      errors: [
        {
          messageId: 'notCamelCase',
          data: { property: 'user_id' },
        },
        {
          messageId: 'notCamelCase',
          data: { property: 'product_name' },
        },
      ],
    },
  ],
});
