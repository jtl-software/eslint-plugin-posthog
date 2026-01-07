# consistent-property-naming

Enforce consistent property naming convention (camelCase) in PostHog capture calls.

## Rule Details

This rule enforces camelCase naming for all properties passed to `postHog.capture()` calls. Consistent naming conventions make it easier to query and analyze events in PostHog.

## Examples

### ❌ Incorrect

```js
postHog.capture('user_action', {
  user_id: '123', // snake_case
  ProductName: 'Test', // PascalCase
  'user-email': 'test@example.com', // kebab-case
});
```

### ✅ Correct

```js
postHog.capture('user_action', {
  userId: '123',
  productName: 'Test',
  userEmail: 'test@example.com',
});
```

## Why?

- **Consistency**: Makes queries and analysis easier
- **Schema validation**: Aligns with code property naming conventions
- **Discoverability**: Properties with consistent naming are easier to find

## When Not To Use It

If your team has established a different naming convention (e.g., snake_case) across all tracking implementations, you may want to disable this rule.

## Related Rules

- [require-event-schema](./require-event-schema.md)
- [no-literal-event-names](./no-literal-event-names.md)
