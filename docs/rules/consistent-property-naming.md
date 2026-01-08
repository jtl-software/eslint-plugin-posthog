# consistent-property-naming

Enforce consistent property naming convention in PostHog capture calls.

## Rule Details

This rule enforces consistent naming for all properties passed to `postHog.capture()` calls. The default is `snake_case` , but you can configure it to use `camelCase` to match your team's conventions. Consistent naming conventions make it easier to query and analyze events in PostHog.

The rule also works with:
- **Variable tracking**: Detects properties defined in variables
- **Wrapper functions**: Validates properties passed through custom tracking functions
- **Nested functions**: Handles complex component structures

## Options

This rule accepts an options object with the following properties:

```js
{
  "casing": "snake_case" | "camelCase" // default: "snake_case"
}
```

### `casing`

Specifies the casing convention for property names.

- `"snake_case"` (default): Enforces snake_case (e.g., `user_id`, `product_name`) - PostHog's recommendation
- `"camelCase"`: Enforces camelCase (e.g., `userId`, `productName`)

**Example configuration:**

```js
// .eslintrc.js
module.exports = {
  rules: {
    // Use camelCase instead of default snake_case
    'posthog/consistent-property-naming': ['error', { casing: 'camelCase' }]
  }
};
```

## Examples

#### ❌ Incorrect

```js
postHog.capture('user_action', {
  userId: '123', // camelCase (should be snake_case)
  ProductName: 'Test', // PascalCase
  'user-email': 'test@example.com', // kebab-case
});

// Variable tracking
const properties = { userId: '123', productName: 'Test' };
postHog.capture('event_name', properties);

// Wrapper function
function trackEvent(name, props) {
  postHog.capture(name, props);
}
trackEvent('event_name', { userId: '123' });
```

#### ✅ Correct

```js
postHog.capture('user_action', {
  user_id: '123',
  product_name: 'Test',
  user_email: 'test@example.com',
});

// Variable tracking
const properties = { user_id: '123', product_name: 'Test' };
postHog.capture('event_name', properties);

// Wrapper function
function trackEvent(name, props) {
  postHog.capture(name, props);
}
trackEvent('event_name', { user_id: '123', product_name: 'Test' });
```
