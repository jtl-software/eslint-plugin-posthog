# valid-event-names

Enforce valid event naming conventions for PostHog events.

## Rule Details

This rule enforces that event names follow PostHog's recommended naming conventions:

1. **snake_case**: Event names must use lowercase with underscores
2. **Object-verb pattern**: Events should follow the `[object]_[verb]` format (e.g., `button_clicked`, `user_created`)
3. **Verb ending**: Events must end with a verb to describe the action

## Examples

### ❌ Incorrect

```js
// Not snake_case (camelCase)
postHog.capture('buttonClicked', { userId: '123' });

// Not snake_case (PascalCase)
postHog.capture('ButtonClicked', { userId: '123' });

// Not snake_case (kebab-case)
postHog.capture('button-clicked', { userId: '123' });

// Too short (missing object or verb)
postHog.capture('clicked', { userId: '123' });
postHog.capture('button', { userId: '123' });

// Doesn't end with verb
postHog.capture('button_color', { color: 'red' });
postHog.capture('user_profile', { userId: '123' });
```

### ✅ Correct

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

## Verb Patterns

The rule recognizes several verb patterns:

### Endings

- **-ed**: Past tense (clicked, created, viewed, updated)
- **-ing**: Present participle (clicking, creating, viewing)
- **-e**: Present tense ending in 'e' (create, delete, update)
- **-ize/-ise**: Verbs (initialize, customize)
- **-ate**: Verbs (validate, activate)
- **-ify**: Verbs (notify, verify)

### Common Verbs

The rule includes a list of common present-tense verbs like: click, view, submit, open, close, add, remove, start, stop, play, pause, load, save, send, login, logout, etc.

## Category Prefix (Optional)

The rule supports PostHog's enhanced framework with optional category prefixes:

```js
postHog.capture('category:object_action', { ... });
```

Examples:

- `account_settings:password_changed`
- `signup_flow:form_submitted`
- `checkout:payment_completed`

## Why?

- **Consistency**: Makes events easier to find and filter in PostHog
- **Best practice**: Follows PostHog's official recommendations
- **Clarity**: Object-verb pattern clearly describes what happened
- **Analysis**: Consistent naming enables better querying and grouping

## When Not To Use It

If your team has established a different event naming convention and can't migrate, you may want to disable this rule. However, following PostHog's recommendations will make your analytics more maintainable.

## Related Rules

- [no-literal-event-names](./no-literal-event-names.md)
- [consistent-property-naming](./consistent-property-naming.md)
