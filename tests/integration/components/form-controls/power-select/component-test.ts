import { click, render } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

import buildChangeset from 'ember-osf-web/utils/build-changeset';

module('Integration | Component | form-controls/power-select', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    test('it renders', async function(assert) {
        const model = { nodeCategory: null };
        const changeset = buildChangeset(model, {});
        const options = ['a', 'b', 'c'];
        this.set('changeset', changeset);
        this.set('options', options);
        await render(hbs`
            <FormControls @changeset={{this.changeset}} as |form| >
                <form.select
                    data-test-select
                    @options={{this.options}}
                    @label='Category'
                    @valuePath='nodeCategory'
                    as |option|
                >
                    {{option}}
                </form.select>
            </FormControls>
        `);
        assert.dom('label').hasText('Category');
        await click('.ember-power-select-trigger');
        for (const item of options) {
            assert.dom(`[data-test-option='${item}']`).exists();
            assert.dom(`[data-test-option='${item}']`).hasText(item);
        }
    });
});
