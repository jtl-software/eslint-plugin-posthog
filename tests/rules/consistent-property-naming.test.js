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
    // Variable tracking - valid camelCase
    {
      code: `
        const properties = { userId: '123', productName: 'Test' };
        postHog.capture('event_name', properties);
      `,
    },
    // Wrapper function - valid camelCase
    {
      code: `
        function trackEvent(name, props) {
          postHog.capture(name, props);
        }
        trackEvent('event_name', { userId: '123', productName: 'Test' });
      `,
    },
    // Nested function with wrapper - valid camelCase
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
    // Variable tracking scenarios
    {
      code: `
        const properties = { user_id: '123' };
        postHog.capture('event_name', properties);
      `,
      errors: [
        {
          messageId: 'notCamelCase',
          data: { property: 'user_id' },
        },
      ],
    },
    {
      code: `
        const props = { product_id: '123', product_name: 'Test' };
        postHog.capture('event_name', props);
      `,
      errors: [
        {
          messageId: 'notCamelCase',
          data: { property: 'product_id' },
        },
        {
          messageId: 'notCamelCase',
          data: { property: 'product_name' },
        },
      ],
    },
    {
      code: `
        const eventProps = {
          userId: '123',
          product_name: 'Test',
          is_active: true
        };
        postHog.capture('event_name', eventProps);
      `,
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
    // Wrapper function scenarios
    {
      code: `
        function trackEvent(name, props) {
          postHog.capture(name, props);
        }
        trackEvent('event_name', { user_id: '123' });
      `,
      errors: [
        {
          messageId: 'notCamelCase',
          data: { property: 'user_id' },
        },
      ],
    },
    {
      code: `
        const handleCapture = (eventName, properties) => {
          postHog.capture(eventName, properties);
        };
        handleCapture('product_added', {
          product_id: '123',
          product_name: 'Test'
        });
      `,
      errors: [
        {
          messageId: 'notCamelCase',
          data: { property: 'product_id' },
        },
        {
          messageId: 'notCamelCase',
          data: { property: 'product_name' },
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
              button_id: '123',
              button_name: 'Submit'
            });
          }
        }
      `,
      errors: [
        {
          messageId: 'notCamelCase',
          data: { property: 'button_id' },
        },
        {
          messageId: 'notCamelCase',
          data: { property: 'button_name' },
        },
      ],
    },
  ],
});
