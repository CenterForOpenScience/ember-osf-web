import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { EnginesTestContext } from 'ember-engines/test-support';
import { setupEngineRenderingTest } from 'ember-osf-web/tests/helpers/engines';
import { module, test } from 'qunit';

module('Integration | Helper | sort', hooks => {
    setupEngineRenderingTest(hooks, 'collections');

    test('it renders', async function(this: EnginesTestContext, assert) {
        const options = [
            'Charlie',
            'Delta',
            'Bravo',
            'Alpha',
        ];

        this.setProperties({ options });

        await render(
            hbs`{{#each (sort options) as |option|}} {{option}} {{/each}}`,
            { owner: this.engine },
        );

        assert.dom(this.element).hasText(' Alpha Bravo Charlie Delta ');
    });
});
