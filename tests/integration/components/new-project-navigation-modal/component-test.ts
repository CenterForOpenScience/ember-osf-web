import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | new-project-navigation-modal', hooks => {
    setupRenderingTest(hooks);

    test('it renders', async function(assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        this.setProperties({
            stayOnPage: () => assert.ok(true),
            node: null,
        });
        await render(hbs`{{new-project-navigation-modal
            node=node
            stayOnPage=stayOnPage
        }}`);

        assert.dom(this.element).hasText('');
    });
});
