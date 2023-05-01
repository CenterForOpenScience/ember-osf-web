import ObjectProxy from '@ember/object/proxy';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { EnginesTestContext } from 'ember-engines/test-support';
import { setupEngineRenderingTest } from 'ember-osf-web/tests/helpers/engines';
import { module, test } from 'qunit';

module('Integration | Helper | get-model', hooks => {
    setupEngineRenderingTest(hooks, 'registries');

    test('get-model works', async function(this: EnginesTestContext, assert) {
        const scenarios = [
            { model: null, expected: '' },
            { model: Object.create(null), expected: '' },
            { model: Object.create({ content: { id: 'draft' } }), expected: '' },
            { model: ObjectProxy.create({ content: { id: 'draft' } }), expected: 'draft' },
        ];

        for (const scenario of scenarios) {
            this.set('model', scenario.model);
            await render(hbs`
                {{#let (get-model this.model) as |model|}}
                    {{model.id}}
                {{/let}}
            `, { owner: this.engine });
            assert.dom(this.element).hasText(scenario.expected);
        }
    });
});
