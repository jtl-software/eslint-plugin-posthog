/**
 * @fileoverview Enforce consistent property naming convention (camelCase) in PostHog events
 * @author JTL Platform Team
 */

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce consistent property naming convention in PostHog capture calls',
      recommended: true,
    },
    messages: {
      notCamelCase: 'Property "{{property}}" should use camelCase naming convention',
      notSnakeCase: 'Property "{{property}}" should use snake_case naming convention',
    },
    schema: [
      {
        type: 'object',
        properties: {
          casing: {
            type: 'string',
            enum: ['camelCase', 'snake_case'],
            default: 'snake_case',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const wrapperFunctions = new Map();
    const captureCalls = [];

    const options = context.options[0] || {};
    const casing = options.casing || 'snake_case';

    function isCamelCase(str) {
      return /^[a-z][a-zA-Z0-9]*$/.test(str);
    }

    function isSnakeCase(str) {
      return /^[a-z][a-z0-9_]*$/.test(str);
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

    function validateObjectProperties(objectNode) {
      if (!objectNode || objectNode.type !== 'ObjectExpression') {
        return;
      }

      objectNode.properties.forEach((prop) => {
        if (prop.type === 'Property' && prop.key.type === 'Identifier') {
          const propertyName = prop.key.name;
          const isCorrectCasing = casing === 'camelCase' ? isCamelCase(propertyName) : isSnakeCase(propertyName);
          const messageId = casing === 'camelCase' ? 'notCamelCase' : 'notSnakeCase';

          if (!isCorrectCasing) {
            context.report({
              node: prop.key,
              messageId,
              data: {
                property: propertyName,
              },
            });
          }
        }
      });
    }

    function resolvePropertiesArgument(propertiesArg) {
      if (!propertiesArg) {
        return null;
      }

      // Direct object literal
      if (propertiesArg.type === 'ObjectExpression') {
        return propertiesArg;
      }

      // Variable reference - trace back to definition
      if (propertiesArg.type === 'Identifier') {
        const scope = context.sourceCode.getScope(propertiesArg);
        const variable = scope.variables.find((v) => v.name === propertiesArg.name);

        if (variable && variable.defs.length > 0) {
          const def = variable.defs[0];
          if (def.node.init && def.node.init.type === 'ObjectExpression') {
            return def.node.init;
          }
        }
      }

      return null;
    }

    function getFunctionName(node) {
      // Regular function declaration: function foo() {}
      if (node.type === 'FunctionDeclaration' && node.id) {
        return node.id.name;
      }

      // Variable declaration with arrow function: const foo = () => {}
      // Variable declaration with function expression: const foo = function() {}
      if (node.parent && node.parent.type === 'VariableDeclarator' && node.parent.id) {
        return node.parent.id.name;
      }

      return null;
    }

    function getParentFunction(node) {
      let current = node.parent;
      while (current) {
        if (
          current.type === 'FunctionDeclaration' ||
          current.type === 'FunctionExpression' ||
          current.type === 'ArrowFunctionExpression'
        ) {
          return current;
        }
        current = current.parent;
      }
      return null;
    }

    const allCallExpressions = [];

    return {
      CallExpression(node) {
        allCallExpressions.push(node);

        if (isPostHogCapture(node)) {
          captureCalls.push(node);
        }
      },

      'Program:exit'() {
        captureCalls.forEach((captureCall) => {
          const propertiesArg = captureCall.arguments[1];

          if (propertiesArg && propertiesArg.type === 'Identifier') {
            const parentFunc = getParentFunction(captureCall);
            if (parentFunc) {
              const paramName = propertiesArg.name;
              const paramIndex = parentFunc.params.findIndex(
                (p) => p.type === 'Identifier' && p.name === paramName,
              );

              if (paramIndex !== -1) {
                const functionName = getFunctionName(parentFunc);
                if (functionName) {
                  wrapperFunctions.set(functionName, paramIndex);
                }
              }
            }
          }

          // validate direct calls
          const objectNode = resolvePropertiesArgument(propertiesArg);
          if (objectNode) {
            validateObjectProperties(objectNode);
          }
        });

        // validate calls to wrapper functions
        allCallExpressions.forEach((callNode) => {
          if (isPostHogCapture(callNode)) {
            return;
          }

          if (callNode.callee.type === 'Identifier') {
            const functionName = callNode.callee.name;
            if (wrapperFunctions.has(functionName)) {
              const paramIndex = wrapperFunctions.get(functionName);
              const propertiesArg = callNode.arguments[paramIndex];
              const objectNode = resolvePropertiesArgument(propertiesArg);
              if (objectNode) {
                validateObjectProperties(objectNode);
              }
            }
          }
        });
      },
    };
  },
};
