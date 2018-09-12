import Service from '@ember/service';
import { render } from '@ember/test-helpers';
import { setupEngineRenderingTest } from 'ember-osf-web/tests/helpers/engines';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

const i18nStub = Service.extend({
    t(key: string): string {
        if (key === 'general.ellipsis') {
            return '...';
        }

        throw new Error(`Unknown translation ${key}`);
    },
});

module('Integration | Helper | clip', hooks => {
    setupEngineRenderingTest(hooks, 'registries');

    test('it renders', async function(assert) {
        this.owner.register('service:i18n', i18nStub);

        const i18n = this.owner.lookup('service:i18n');

        const cases = [{
            text: 'A'.repeat(200),
            expected: 'A'.repeat(200),
        }, {
            text: 'A'.repeat(201),
            expected: `${'A'.repeat(197)}${i18n.t('general.ellipsis')}`,
        }];

        for (const testCase of cases) {
            this.set('text', testCase.text);
            await render(hbs`{{clip text 200}}`);
            assert.dom(this.element).hasText(testCase.expected);
        }
    });
});
