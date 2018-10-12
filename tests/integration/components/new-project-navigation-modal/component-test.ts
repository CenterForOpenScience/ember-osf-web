import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | new-project-navigation-modal', hooks => {
    setupRenderingTest(hooks);
    hooks.beforeEach(function(this: TestContext, assert) {
        this.setProperties({
            closeModal: () => assert.ok(true),
            theNode: {
                links: {
                    html: '/linkValue/',
                },
            },
        });
    });
    test('it renders', async function(assert) {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });

        await render(hbs`{{new-project-navigation-modal
            node=theNode
            closeModal=closeModal
        }}`);

        assert.dom(this.element).hasText('New project created successfully! Keep working here Go to new project');
    });
});
