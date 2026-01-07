/**
 * @fileoverview Enforce consistent property naming convention (camelCase) in PostHog events
 * @author JTL Platform Team
 */

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce consistent property naming convention (camelCase) in PostHog capture calls',
      recommended: true,
    },
    messages: {
      notCamelCase: 'Property "{{property}}" should use camelCase naming convention',
    },
    schema: [],
  },

  create(context) {
    /**
     * Check if a string is in camelCase
     * @param {string} str - The string to check
     * @returns {boolean}
     */
    function isCamelCase(str) {
      // Allow camelCase: starts with lowercase, can contain uppercase letters and numbers
      // No underscores or hyphens allowed
      return /^[a-z][a-zA-Z0-9]*$/.test(str);
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

    return {
      CallExpression(node) {
        if (!isPostHogCapture(node)) {
          return;
        }

        // Second argument should be the properties object
        const propertiesArg = node.arguments[1];
        if (!propertiesArg || propertiesArg.type !== 'ObjectExpression') {
          return;
        }

        // Check each property in the object
        propertiesArg.properties.forEach((prop) => {
          if (prop.type === 'Property' && prop.key.type === 'Identifier') {
            const propertyName = prop.key.name;
            if (!isCamelCase(propertyName)) {
              context.report({
                node: prop.key,
                messageId: 'notCamelCase',
                data: {
                  property: propertyName,
                },
              });
            }
          }
        });
      },
    };
  },
};
