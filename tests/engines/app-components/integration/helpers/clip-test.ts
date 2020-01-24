import { render } from '@ember/test-helpers';
import { setupIntl, TestContext } from 'ember-intl/test-support';
import { setupEngineRenderingTest } from 'ember-osf-web/tests/helpers/engines';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Helper | clip', hooks => {
    setupEngineRenderingTest(hooks, 'registries');
    setupIntl(hooks, {
        general: {
            ellipsis: '...',
        },
    });

    test('it renders', async function(this: TestContext, assert) {
        const cases = [{
            text: 'A'.repeat(200),
            expected: 'A'.repeat(200),
        }, {
            text: 'A'.repeat(201),
            expected: `${'A'.repeat(197)}${this.intl.t('general.ellipsis')}`,
        }];

        for (const testCase of cases) {
            this.set('text', testCase.text);
            await render(hbs`{{clip text 200}}`);
            assert.dom(this.element).hasText(testCase.expected);
        }
    });
});
