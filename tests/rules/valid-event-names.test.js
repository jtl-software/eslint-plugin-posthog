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
