import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Integration | Helper | array', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        await render(hbs`
            {{#each (array 1 2 3) as | i | }}
                {{i}}
            {{/each}}
        `);

        assert.dom(this.element).hasText('1 2 3');
    });
});
