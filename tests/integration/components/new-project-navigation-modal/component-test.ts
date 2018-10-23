import { click, render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';

import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | new-project-navigation-modal', hooks => {
    setupRenderingTest(hooks);
    hooks.beforeEach(function(this: TestContext, assert) {
        this.setProperties({
            closeModel: (reload = false) => assert.ok(reload),
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
        await render(hbs`<NewProjectNavigationModal
            @node={{theNode}}
            @closeModal={{action closeModel reload=true}}
            @title="New project created successfully!"
        />`);

        assert.dom(this.element).hasText('New project created successfully! Keep working here Go to new project');
        assert.dom('[data-test-go-to-new][href="/linkValue/"]').exists();
        await click('[data-test-stay-here]');
    });
});
