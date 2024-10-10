// eslint-disable @typescript-eslin/no-var-requires
const stylelint = require('stylelint');

/*
    * This rule prevents the use of bare element selectors in CSS
    * Bare element selectors are selectors that are not wrapped in  or paired with a class or id
*/

const ruleName = 'ember-osf-web-stylelint-plugin/no-unlocalized-selectors';
const messages = stylelint.utils.ruleMessages(ruleName, {
    expected: selector => `Rule "${selector}" should be wrapped in or paired with a local-class or ID`,
});

module.exports = stylelint.createPlugin(ruleName, _ =>
    (postcssRoot, postcssResult) => {
        postcssRoot.walkRules(rule => {
            const selector = rule.selector;
            const isChildRule = rule.parent.type === 'rule'; // top-level rules have rule.parent.type === 'root'
            const hasGlobal = selector.includes(':global');
            if (
                isChildRule ||
                (!hasGlobal && (selector.includes('.') || selector.includes('#'))) // has a local-class or local-id
            ) {
                return;
            }

            if (
                /^[a-z]+/.test(selector) || // starts with a letter
                /^:global\([a-z]+/.test(selector) // or starts with :global
            ) {
                stylelint.utils.report({
                    ruleName,
                    result: postcssResult,
                    message: messages.expected(selector),
                    node: rule,
                });
            }
        });
    });

module.exports.ruleName = ruleName;
module.exports.messages = messages;
