# @jtl-software/eslint-plugin-posthog

ESLint plugin for enforcing PostHog event tracking best practices.

## Installation

```bash
npm install --save-dev @jtl-software/eslint-plugin-posthog
```

```bash
yarn add -D @jtl-software/eslint-plugin-posthog
```

```bash
pnpm add -D @jtl-software/eslint-plugin-posthog
```

## Usage

### Flat Config (ESLint 9+)

```js
// eslint.config.js
import posthog from '@jtl-software/eslint-plugin-posthog';

export default [
  posthog.configs.recommended,
  {
    // Your other config here
  },
];
```

### Legacy Config (.eslintrc)

For ESLint 8 and below, add to your `.eslintrc.js` or `.eslintrc.json`:

```js
module.exports = {
  plugins: ['@jtl-software/eslint-plugin-posthog'],
  rules: {
    '@jtl-software/posthog/consistent-property-naming': 'error',
    '@jtl-software/posthog/valid-event-names': 'error',
  },
};
```

## Rules

| Rule                                                                     | Description                                                      | Severity |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------- | -------- |
| [consistent-property-naming](./docs/rules/consistent-property-naming.md) | Enforce consistent property naming (snake_case or camelCase)     | error    |
| [valid-event-names](./docs/rules/valid-event-names.md)                   | Enforce valid event naming conventions (snake_case or camelCase) | error    |

## Configuration

Both rules default to `snake_case` , but support configuration to match your team's conventions:

### Event Names Casing

```js
// eslint.config.js
export default [
  {
    rules: {
      'posthog/valid-event-names': ['error', { casing: 'snake_case' }], // default, or 'camelCase'
    },
  },
];
```

### Property Names Casing

```js
// eslint.config.js
export default [
  {
    rules: {
      'posthog/consistent-property-naming': ['error', { casing: 'snake_case' }], // default, or 'camelCase'
    },
  },
];
```

### Complete Configuration Example

```js
// eslint.config.js
import posthog from '@jtl-software/eslint-plugin-posthog';

export default [
  {
    plugins: {
      posthog,
    },
    rules: {
      // Default: snake_case for both
      'posthog/valid-event-names': 'error',
      'posthog/consistent-property-naming': 'error',

      // Or use camelCase for both
      // 'posthog/valid-event-names': ['error', { casing: 'camelCase' }],
      // 'posthog/consistent-property-naming': ['error', { casing: 'camelCase' }],
    },
  },
];
```

## Examples

### Default Configuration (snake_case for both)

#### Before

```js
// ❌ Multiple issues
postHog.capture('userClickedButton', {
  // camelCase event name (should be snake_case)
  userId: '123', // camelCase property (should be snake_case)
  ButtonName: 'Submit', // PascalCase
});
```

#### After

```js
// ✅ Following PostHog's best practices (default)
const EVENTS = {
  BUTTON_CLICKED: 'button_clicked',
  PAGE_VIEWED: 'page_viewed',
};

postHog.capture(EVENTS.BUTTON_CLICKED, {
  user_id: '123',
  button_name: 'Submit',
  page: 'checkout',
});

postHog.capture(EVENTS.PAGE_VIEWED, {
  page_path: '/checkout',
  referrer: document.referrer,
});
```

### With camelCase for Both Events and Properties

```js
// Configuration
export default [
  {
    rules: {
      'posthog/valid-event-names': ['error', { casing: 'camelCase' }],
      'posthog/consistent-property-naming': ['error', { casing: 'camelCase' }],
    },
  },
];

// Usage
const EVENTS = {
  BUTTON_CLICKED: 'buttonClicked',
  PAGE_VIEWED: 'pageViewed',
};

postHog.capture(EVENTS.BUTTON_CLICKED, {
  userId: '123',
  buttonName: 'Submit',
  page: 'checkout',
});
```

### With snake_case for Both Events and Properties

```js
// Configuration
export default [
  {
    rules: {
      'posthog/valid-event-names': ['error', { casing: 'snake_case' }],
      'posthog/consistent-property-naming': ['error', { casing: 'snake_case' }],
    },
  },
];

// Usage
const EVENTS = {
  BUTTON_CLICKED: 'button_clicked',
  PAGE_VIEWED: 'page_viewed',
};

postHog.capture(EVENTS.BUTTON_CLICKED, {
  user_id: '123',
  button_name: 'Submit',
  page: 'checkout',
});
```

## Development

### Running Tests

```bash
pnpm test
# or
pnpm test:watch
```

### Testing Locally

To test the plugin in your project before publishing:

1. In this directory, run:

   ```bash
   npm link
   ```

2. In your project directory:

   ```bash
   npm link @jtl-software/eslint-plugin-posthog
   ```

3. Add the plugin to your ESLint config as shown above

## License

MIT
