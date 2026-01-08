# valid-event-names

Enforce valid event naming conventions for PostHog events.

## Rule Details

This rule enforces that event names follow PostHog's recommended naming conventions:

1. **Consistent casing**: Event names must use either `snake_case` (default) or `camelCase`
2. **Object-verb pattern**: Events should follow the `[object][verb]` format (e.g., `button_clicked` or `buttonClicked`, `user_created` or `userCreated`)
3. **Verb ending**: Events must end with a verb to describe the action

## Options

This rule accepts an options object with the following properties:

```js
{
  "casing": "snake_case" | "camelCase", // default: "snake_case"
  "customVerbs": string[]                // default: []
}
```

### `casing`

Specifies the casing convention for event names.

- `"snake_case"` (default): Enforces lowercase with underscores (e.g., `button_clicked`, `user_created`)
- `"camelCase"`: Enforces camelCase (e.g., `buttonClicked`, `userCreated`)

**Example configuration:**

```js
// .eslintrc.js
module.exports = {
  rules: {
    'posthog/valid-event-names': ['error', { casing: 'camelCase' }]
  }
};
```

### `customVerbs`

An array of additional verbs to recognize as valid event endings. This extends the built-in list of common verbs.

- Type: `string[]`
- Default: `[]`

The rule includes a comprehensive list of built-in verbs (e.g., `click`, `view`, `submit`, `create`, `update`, etc.) and recognizes common verb patterns (e.g., `-ed`, `-ing`, `-ize`, `-ate`). Use `customVerbs` to add domain-specific verbs that aren't in the default list.

**Example configuration:**

```js
// .eslintrc.js
module.exports = {
  rules: {
    // Add custom verbs for your domain
    'posthog/valid-event-names': ['error', {
      customVerbs: ['process', 'checkout', 'authorize', 'reset']
    }]
  }
};
```

## Examples

### With `snake_case` (default)

#### ❌ Incorrect

```js
// camelCase when snake_case is expected
postHog.capture('buttonClicked', { userId: '123' });

// PascalCase
postHog.capture('ButtonClicked', { userId: '123' });

// kebab-case
postHog.capture('button-clicked', { userId: '123' });

// Too short (missing object or verb)
postHog.capture('clicked', { userId: '123' });
postHog.capture('button', { userId: '123' });

// Doesn't end with verb
postHog.capture('button_color', { color: 'red' });
postHog.capture('user_profile', { userId: '123' });
```

#### ✅ Correct

```js
// Past tense verbs
postHog.capture('button_clicked', { userId: '123' });
postHog.capture('user_created', { userId: '123' });
postHog.capture('page_viewed', { path: '/home' });

// Present participle
postHog.capture('video_playing', { videoId: '456' });
postHog.capture('data_loading', { count: 10 });

// Present tense
postHog.capture('button_click', { buttonId: 'submit' });
postHog.capture('page_view', { path: '/about' });
postHog.capture('user_login', { method: 'oauth' });
postHog.capture('form_submit', { formId: 'contact' });

// With category prefix (optional)
postHog.capture('account:settings_updated', { field: 'email' });
postHog.capture('signup:button_clicked', { step: 1 });
```

## Category Prefix (Optional)

The rule supports PostHog's enhanced framework with optional category prefixes:

```js
postHog.capture('category:object_action', { ... });
```

Examples:

- `account_settings:password_changed`
- `signup_flow:form_submitted`
- `checkout:payment_completed`
