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

| Rule                                                                     | Description                            | Severity |
| ------------------------------------------------------------------------ | -------------------------------------- | -------- |
| [consistent-property-naming](./docs/rules/consistent-property-naming.md) | Enforce camelCase for property names   | error    |
| [valid-event-names](./docs/rules/valid-event-names.md)                   | Enforce valid event naming conventions | error    |


## Examples

### Before

```js
// ❌ Multiple issues
postHog.capture('user clicked button', {
  user_id: '123', // snake_case instead of camelCase
  ButtonName: 'Submit', // PascalCase
});
```

### After

```js
// ✅ Following best practices
const EVENTS = {
  BUTTON_CLICKED: 'button_clicked',
  PAGE_VIEWED: 'page_viewed',
};

postHog.capture(EVENTS.BUTTON_CLICKED, {
  userId: '123',
  buttonName: 'Submit',
  page: 'checkout',
});

postHog.capture(EVENTS.PAGE_VIEWED, {
  pagePath: '/checkout',
  referrer: document.referrer,
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

### CI/CD

This project uses GitHub Actions for continuous integration and deployment:

- **Tests** run automatically on every push and pull request
- **Publishing to npm** happens automatically when pushing to the `main` branch

To set up automatic publishing, add an `NPM_TOKEN` secret to your GitHub repository:

1. Generate an npm access token at https://www.npmjs.com/settings/tokens
2. Go to your repository settings on GitHub
3. Navigate to Settings → Secrets and variables → Actions
4. Add a new repository secret named `NPM_TOKEN` with your npm token

## License

MIT
