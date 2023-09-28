import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { EnginesIntlTestContext } from 'ember-engines/test-support';
import { setupIntl } from 'ember-intl/test-support';
import { setupEngineRenderingTest } from 'ember-osf-web/tests/helpers/engines';
import { module, test } from 'qunit';

module('Integration | Helper | clip', hooks => {
    setupEngineRenderingTest(hooks, 'registries');
    setupIntl(hooks, {
        general: {
            ellipsis: '...',
        },
    });

    test('it renders', async function(this: EnginesIntlTestContext, assert) {
        const cases = [{
            text: 'A'.repeat(200),
            expected: 'A'.repeat(200),
        }, {
            text: 'A'.repeat(201),
            expected: `${'A'.repeat(197)}${this.intl.t('general.ellipsis')}`,
        }];

        for (const testCase of cases) {
            this.set('text', testCase.text);
            await render(hbs`{{clip this.text 200}}`, { owner: this.engine });
            assert.dom(this.element).hasText(testCase.expected);
        }
    });
});
