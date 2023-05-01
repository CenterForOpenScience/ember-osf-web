import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { EnginesTestContext } from 'ember-engines/test-support';
import { setupEngineRenderingTest } from 'ember-osf-web/tests/helpers/engines';
import { module, test } from 'qunit';

module('Integration | Helper | fix-string', hooks => {
    setupEngineRenderingTest(hooks, 'registries');

    test('it renders', async function(this: EnginesTestContext, assert) {
        await render(hbs`
            {{fix-string 'Unchanging &lt; &amp; &gt;'}}
        `, { owner: this.engine });

        assert.dom(this.element).hasText('Unchanging < & >');
    });
});
