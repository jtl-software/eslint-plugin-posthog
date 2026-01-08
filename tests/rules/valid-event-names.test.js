import { RuleTester } from 'eslint';
import rule from '../../src/rules/valid-event-names.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

ruleTester.run('valid-event-names', rule, {
  valid: [
    // snake_case with object-verb pattern (past tense)
    {
      code: `postHog.capture('button_clicked', { userId: '123' })`,
    },
    {
      code: `postHog.capture('user_created', { userId: '123' })`,
    },
    {
      code: `postHog.capture('page_viewed', { path: '/home' })`,
    },
    // snake_case with object-verb pattern (present participle)
    {
      code: `postHog.capture('video_playing', { videoId: '456' })`,
    },
    {
      code: `postHog.capture('data_loading', { count: 10 })`,
    },
    // snake_case with object-verb pattern (present tense)
    {
      code: `postHog.capture('button_click', { buttonId: 'submit' })`,
    },
    {
      code: `postHog.capture('page_view', { path: '/about' })`,
    },
    {
      code: `postHog.capture('user_login', { method: 'oauth' })`,
    },
    {
      code: `postHog.capture('form_submit', { formId: 'contact' })`,
    },
    // snake_case with category prefix
    {
      code: `postHog.capture('account:settings_updated', { field: 'email' })`,
    },
    {
      code: `postHog.capture('signup:button_clicked', { step: 1 })`,
    },
    // common verb endings
    {
      code: `postHog.capture('user_initialize', { userId: '123' })`,
    },
    {
      code: `postHog.capture('form_validate', { formId: 'signup' })`,
    },
    {
      code: `postHog.capture('account_activate', { accountId: '789' })`,
    },
    {
      code: `postHog.capture('user_notify', { message: 'test' })`,
    },
    // using constants (won't be checked)
    {
      code: `const EVENT_NAME = 'button_clicked';
                 postHog.capture(EVENT_NAME, { userId: '123' })`,
    },
    // not a PostHog call
    {
      code: `someOtherFunction('InvalidName', { data: 'test' })`,
    },
    // aliased postHog.capture
    {
      code: `const capture = postHog.capture;
                 capture('button_clicked', { userId: '123' })`,
    },
    // imported capture from posthog-js
    {
      code: `import { capture } from 'posthog-js';
                 capture('user_created', { userId: '456' })`,
    },
  ],

  invalid: [
    // not snake_case (camelCase)
    {
      code: `postHog.capture('buttonClicked', { userId: '123' })`,
      errors: [
        {
          messageId: 'notSnakeCase',
          data: { eventName: 'buttonClicked' },
        },
      ],
    },
    // not snake_case (PascalCase)
    {
      code: `postHog.capture('ButtonClicked', { userId: '123' })`,
      errors: [
        {
          messageId: 'notSnakeCase',
          data: { eventName: 'ButtonClicked' },
        },
      ],
    },
    // not snake_case (kebab-case)
    {
      code: `postHog.capture('button-clicked', { userId: '123' })`,
      errors: [
        {
          messageId: 'notSnakeCase',
          data: { eventName: 'button-clicked' },
        },
      ],
    },
    // too short (missing object or verb)
    {
      code: `postHog.capture('clicked', { userId: '123' })`,
      errors: [
        {
          messageId: 'tooShort',
          data: { eventName: 'clicked' },
        },
      ],
    },
    {
      code: `postHog.capture('button', { userId: '123' })`,
      errors: [
        {
          messageId: 'tooShort',
          data: { eventName: 'button' },
        },
      ],
    },
    // doesn't end with verb
    {
      code: `postHog.capture('button_color', { color: 'red' })`,
      errors: [
        {
          messageId: 'missingVerb',
          data: { eventName: 'button_color' },
        },
      ],
    },
    {
      code: `postHog.capture('user_profile', { userId: '123' })`,
      errors: [
        {
          messageId: 'missingVerb',
          data: { eventName: 'user_profile' },
        },
      ],
    },
    // constant with a bad name
    {
      code: `const EVENT_NAME = 'BadName';
                 postHog.capture(EVENT_NAME, { userId: '123' })`,
      errors: [
        {
          messageId: 'notSnakeCase',
          data: { eventName: 'BadName' },
        },
      ],
    },
    {
      code: `const EVENT_NAME = 'button_color';
                 postHog.capture(EVENT_NAME, { userId: '123' })`,
      errors: [
        {
          messageId: 'missingVerb',
          data: { eventName: 'button_color' },
        },
      ],
    },
    // aliased postHog.capture with bad event name
    {
      code: `const capture = postHog.capture;
                 capture('InvalidName', { data: 'test' })`,
      errors: [
        {
          messageId: 'notSnakeCase',
          data: { eventName: 'InvalidName' },
        },
      ],
    },
    // imported capture with bad event name
    {
      code: `import { capture } from 'posthog-js';
                 capture('userClicked', { userId: '123' })`,
      errors: [
        {
          messageId: 'notSnakeCase',
          data: { eventName: 'userClicked' },
        },
      ],
    },
  ],
});

// Tests for camelCase configuration
ruleTester.run('valid-event-names with camelCase', rule, {
  valid: [
    // camelCase with object-verb pattern
    {
      code: `postHog.capture('buttonClicked', { userId: '123' })`,
      options: [{ casing: 'camelCase' }],
    },
    {
      code: `postHog.capture('userCreated', { userId: '123' })`,
      options: [{ casing: 'camelCase' }],
    },
    {
      code: `postHog.capture('pageViewed', { path: '/home' })`,
      options: [{ casing: 'camelCase' }],
    },
    {
      code: `postHog.capture('videoPlaying', { videoId: '456' })`,
      options: [{ casing: 'camelCase' }],
    },
    {
      code: `postHog.capture('dataLoading', { count: 10 })`,
      options: [{ casing: 'camelCase' }],
    },
    {
      code: `postHog.capture('buttonClick', { buttonId: 'submit' })`,
      options: [{ casing: 'camelCase' }],
    },
    {
      code: `postHog.capture('pageView', { path: '/about' })`,
      options: [{ casing: 'camelCase' }],
    },
    {
      code: `postHog.capture('userLogin', { method: 'oauth' })`,
      options: [{ casing: 'camelCase' }],
    },
    {
      code: `postHog.capture('formSubmit', { formId: 'contact' })`,
      options: [{ casing: 'camelCase' }],
    },
    // camelCase with category prefix
    {
      code: `postHog.capture('account:settingsUpdated', { field: 'email' })`,
      options: [{ casing: 'camelCase' }],
    },
  ],

  invalid: [
    // snake_case when camelCase is expected
    {
      code: `postHog.capture('button_clicked', { userId: '123' })`,
      options: [{ casing: 'camelCase' }],
      errors: [
        {
          messageId: 'notCamelCase',
          data: { eventName: 'button_clicked' },
        },
      ],
    },
    {
      code: `postHog.capture('user_created', { userId: '123' })`,
      options: [{ casing: 'camelCase' }],
      errors: [
        {
          messageId: 'notCamelCase',
          data: { eventName: 'user_created' },
        },
      ],
    },
    // PascalCase (not valid)
    {
      code: `postHog.capture('ButtonClicked', { userId: '123' })`,
      options: [{ casing: 'camelCase' }],
      errors: [
        {
          messageId: 'notCamelCase',
          data: { eventName: 'ButtonClicked' },
        },
      ],
    },
    // Single word (missing object-verb pattern)
    {
      code: `postHog.capture('button', { userId: '123' })`,
      options: [{ casing: 'camelCase' }],
      errors: [
        {
          messageId: 'tooShort',
          data: { eventName: 'button' },
        },
      ],
    },
    // Doesn't end with verb
    {
      code: `postHog.capture('buttonColor', { color: 'red' })`,
      options: [{ casing: 'camelCase' }],
      errors: [
        {
          messageId: 'missingVerb',
          data: { eventName: 'buttonColor' },
        },
      ],
    },
  ],
});

// Tests for custom verbs configuration
ruleTester.run('valid-event-names with customVerbs', rule, {
  valid: [
    // Custom verb 'process' in snake_case
    {
      code: `postHog.capture('order_process', { orderId: '123' })`,
      options: [{ customVerbs: ['process'] }],
    },
    // Custom verb 'checkout' in snake_case
    {
      code: `postHog.capture('cart_checkout', { cartId: '456' })`,
      options: [{ customVerbs: ['checkout'] }],
    },
    // Multiple custom verbs
    {
      code: `postHog.capture('payment_authorize', { amount: 100 })`,
      options: [{ customVerbs: ['authorize', 'process', 'checkout'] }],
    },
    // Custom verb with category prefix
    {
      code: `postHog.capture('account:password_reset', { userId: '789' })`,
      options: [{ customVerbs: ['reset'] }],
    },
    // Built-in verbs should still work with customVerbs option
    {
      code: `postHog.capture('button_clicked', { userId: '123' })`,
      options: [{ customVerbs: ['process'] }],
    },
    // Custom verb with camelCase
    {
      code: `postHog.capture('orderProcess', { orderId: '123' })`,
      options: [{ casing: 'camelCase', customVerbs: ['process'] }],
    },
    {
      code: `postHog.capture('cartCheckout', { cartId: '456' })`,
      options: [{ casing: 'camelCase', customVerbs: ['checkout'] }],
    },
    {
      code: `postHog.capture('account:passwordReset', { userId: '789' })`,
      options: [{ casing: 'camelCase', customVerbs: ['reset'] }],
    },
  ],

  invalid: [
    // Custom verb provided but event doesn't end with a verb
    {
      code: `postHog.capture('button_color', { color: 'red' })`,
      options: [{ customVerbs: ['process'] }],
      errors: [
        {
          messageId: 'missingVerb',
          data: { eventName: 'button_color' },
        },
      ],
    },
    // Custom verb provided but event is too short
    {
      code: `postHog.capture('process', { id: '123' })`,
      options: [{ customVerbs: ['process'] }],
      errors: [
        {
          messageId: 'tooShort',
          data: { eventName: 'process' },
        },
      ],
    },
    // Custom verb provided but wrong casing
    {
      code: `postHog.capture('OrderProcess', { orderId: '123' })`,
      options: [{ customVerbs: ['process'] }],
      errors: [
        {
          messageId: 'notSnakeCase',
          data: { eventName: 'OrderProcess' },
        },
      ],
    },
    // camelCase with custom verb but wrong casing
    {
      code: `postHog.capture('order_process', { orderId: '123' })`,
      options: [{ casing: 'camelCase', customVerbs: ['process'] }],
      errors: [
        {
          messageId: 'notCamelCase',
          data: { eventName: 'order_process' },
        },
      ],
    },
  ],
});
