/**
 * @fileoverview Enforce valid event naming conventions for PostHog events
 * @author JTL Platform Team
 */

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce snake_case and object-verb pattern for PostHog event names',
      recommended: true,
    },
    messages: {
      notSnakeCase: 'Event name "{{eventName}}" should use snake_case naming convention',
      missingVerb:
        'Event name "{{eventName}}" should end with a verb (e.g., "object_clicked", "user_created", "page_view")',
      tooShort:
        'Event name "{{eventName}}" should follow the [object][verb] pattern with at least two parts',
    },
    schema: [],
  },

  create(context) {
    /**
     * Check if a string is in snake_case
     * @param {string} str - The string to check
     * @returns {boolean}
     */
    function isSnakeCase(str) {
      // Allow snake_case: lowercase letters, numbers, and underscores
      // Can also start with a category prefix like "category:object_action"
      return /^[a-z][a-z0-9_:]*$/.test(str);
    }

    /**
     * Check if the last word in an event name looks like a verb
     * @param {string} eventName - The event name to check
     * @returns {boolean}
     */
    function endsWithVerb(eventName) {
      // Remove category prefix if present (e.g., "account:button_clicked" -> "button_clicked")
      const nameWithoutCategory = eventName.includes(':') ? eventName.split(':')[1] : eventName;

      // Split by underscore and get the last word
      const words = nameWithoutCategory.split('_');
      const lastWord = words[words.length - 1];

      // Check for common verb patterns
      const verbPatterns = [/ed$/, /ing$/, /ize$/, /ise$/, /ate$/, /ify$/];

      // Common present tense verbs without specific patterns
      const commonVerbs = [
        'click',
        'view',
        'submit',
        'open',
        'close',
        'add',
        'remove',
        'start',
        'stop',
        'play',
        'pause',
        'load',
        'save',
        'send',
        'get',
        'post',
        'put',
        'patch',
        'delete',
        'fetch',
        'push',
        'pull',
        'set',
        'reset',
        'clear',
        'show',
        'hide',
        'toggle',
        'select',
        'deselect',
        'check',
        'uncheck',
        'enable',
        'disable',
        'expand',
        'collapse',
        'scroll',
        'hover',
        'focus',
        'blur',
        'drag',
        'drop',
        'upload',
        'download',
        'export',
        'import',
        'print',
        'copy',
        'paste',
        'cut',
        'undo',
        'redo',
        'refresh',
        'reload',
        'login',
        'logout',
        'signup',
        'signin',
        'signout',
        'create',
        'update',
        'archive',
        'unarchive',
        'like',
        'share',
        'subscribe',
        'unsubscribe',
        'favorite',
        'unfavorite',
        'mute',
        'unmute',
        'change',
        'complete',
        'execute',
        'terminate',
      ];

      return (
        verbPatterns.some((pattern) => pattern.test(lastWord)) || commonVerbs.includes(lastWord)
      );
    }

    /**
     * Check if event name follows [object][verb] pattern
     * @param {string} eventName - The event name to check
     * @returns {boolean}
     */
    function hasObjectVerbPattern(eventName) {
      // Remove category prefix if present
      const nameWithoutCategory = eventName.includes(':') ? eventName.split(':')[1] : eventName;

      // Should have at least 2 parts (object + verb)
      const parts = nameWithoutCategory.split('_');
      return parts.length >= 2;
    }

    /**
     * Check if node is a PostHog capture call
     * @param {Object} node - AST node
     * @returns {boolean}
     */
    function isPostHogCapture(node) {
      return (
        node.type === 'CallExpression' &&
        node.callee.type === 'MemberExpression' &&
        node.callee.property.name === 'capture' &&
        node.callee.object.name === 'postHog'
      );
    }

    // Track identifiers that refer to postHog.capture
    const captureAliases = new Set();

    /**
     * Check if a CallExpression node is a capture call (direct or aliased)
     * @param {Object} node - AST node
     * @returns {boolean}
     */
    function isCaptureCall(node) {
      if (node.type !== 'CallExpression') {
        return false;
      }

      // Direct postHog.capture()
      if (isPostHogCapture(node)) {
        return true;
      }

      // Aliased or imported capture()
      if (node.callee.type === 'Identifier' && captureAliases.has(node.callee.name)) {
        return true;
      }

      return false;
    }

    /**
     * Validate an event name argument
     * @param {Object} eventNameArg - The event name argument node
     */
    function validateEventName(eventNameArg) {
      // Only check literal strings (constants will be checked at their definition)
      if (eventNameArg.type === 'Literal' && typeof eventNameArg.value === 'string') {
        const eventName = eventNameArg.value;

        // Check snake_case
        if (!isSnakeCase(eventName)) {
          context.report({
            node: eventNameArg,
            messageId: 'notSnakeCase',
            data: { eventName },
          });
          return;
        }

        // Check object-verb pattern (at least 2 parts)
        if (!hasObjectVerbPattern(eventName)) {
          context.report({
            node: eventNameArg,
            messageId: 'tooShort',
            data: { eventName },
          });
          return;
        }

        // Check that it ends with a verb
        if (!endsWithVerb(eventName)) {
          context.report({
            node: eventNameArg,
            messageId: 'missingVerb',
            data: { eventName },
          });
        }
      }

      // Also check if it's an Identifier (constant reference)
      if (eventNameArg.type === 'Identifier') {
        // Find the constant definition
        const scope = context.sourceCode.getScope(eventNameArg);
        const variable = scope.variables.find((v) => v.name === eventNameArg.name);

        if (variable && variable.defs.length > 0) {
          const def = variable.defs[0];
          if (def.node.init && def.node.init.type === 'Literal') {
            const eventName = def.node.init.value;

            if (typeof eventName === 'string') {
              // Check snake_case
              if (!isSnakeCase(eventName)) {
                context.report({
                  node: def.node.init,
                  messageId: 'notSnakeCase',
                  data: { eventName },
                });
                return;
              }

              // Check object-verb pattern
              if (!hasObjectVerbPattern(eventName)) {
                context.report({
                  node: def.node.init,
                  messageId: 'tooShort',
                  data: { eventName },
                });
                return;
              }

              // Check that it ends with a verb
              if (!endsWithVerb(eventName)) {
                context.report({
                  node: def.node.init,
                  messageId: 'missingVerb',
                  data: { eventName },
                });
              }
            }
          }
        }
      }
    }

    return {
      // Track imports of capture from posthog packages
      ImportDeclaration(node) {
        if (
          node.source.value === 'posthog-js' ||
          node.source.value === 'posthog' ||
          node.source.value.startsWith('@posthog/')
        ) {
          node.specifiers.forEach((specifier) => {
            if (specifier.type === 'ImportSpecifier' && specifier.imported.name === 'capture') {
              captureAliases.add(specifier.local.name);
            }
          });
        }
      },

      // Track variable assignments of postHog.capture
      VariableDeclarator(node) {
        if (
          node.init &&
          node.init.type === 'MemberExpression' &&
          node.init.object.name === 'postHog' &&
          node.init.property.name === 'capture' &&
          node.id.type === 'Identifier'
        ) {
          captureAliases.add(node.id.name);
        }
      },

      CallExpression(node) {
        if (!isCaptureCall(node)) {
          return;
        }

        // First argument should be the event name
        const eventNameArg = node.arguments[0];
        if (!eventNameArg) {
          return;
        }

        validateEventName(eventNameArg);
      },
    };
  },
};
