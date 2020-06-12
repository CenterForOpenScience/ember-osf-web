import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupEngineRenderingTest } from 'ember-osf-web/tests/helpers/engines';
import { module, test } from 'qunit';

module('Integration | Helper | unescape-xml-entities', hooks => {
    setupEngineRenderingTest(hooks, 'registries');

    test('it renders', async function(assert) {
        const cases = [{
            text: '&amp;test&amp;test&amp;',
            expected: '&test&test&',
        }, {
            text: '&lt;test&lt;test&lt;',
            expected: '<test<test<',
        }, {
            text: '&gt;test&gt;test&gt;',
            expected: '>test>test>',
        }, {
            text: '&gt;test&lt;test&amp;',
            expected: '>test<test&',
        }];

        for (const testCase of cases) {
            this.set('text', testCase.text);
            await render(hbs`{{unescape-xml-entities text}}`);
            assert.dom(this.element).hasText(testCase.expected);
        }
    });
});
