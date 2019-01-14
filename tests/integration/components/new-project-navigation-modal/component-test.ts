import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';

import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

import { click } from 'ember-osf-web/tests/helpers';

module('Integration | Component | new-project-navigation-modal', hooks => {
    setupRenderingTest(hooks);
    hooks.beforeEach(function(this: TestContext, assert) {
        this.setProperties({
            closeModal: (reload: boolean = false) => assert.ok(reload, 'Reload should have been true'),
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
            @closeModal={{action closeModal true}}
            @title="New project created successfully!"
        />`);

        assert.dom(this.element)
            .hasText('New project created successfully! Keep working here Go to project', 'Contents were correct');
        assert.dom('[data-analytics-name="go_to_new_project"][href="/linkValue/"]')
            .exists('Navigation link was correct');
        await click('[data-test-stay-here]');
    });
});
