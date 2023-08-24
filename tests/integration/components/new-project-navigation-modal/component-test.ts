import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupIntl, t } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';

import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import { click } from 'ember-osf-web/tests/helpers';

module('Integration | Component | new-project-navigation-modal', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function(this: TestContext, assert) {
        this.setProperties({
            closeModal: (reload = false) => assert.ok(reload, 'Reload should have been true'),
            theNode: {
                links: {
                    html: '/linkValue/',
                },
            },
        });
    });
    test('it renders', async assert => {
        // Set any properties with this.set('myProperty', 'value');
        // Handle any actions with this.set('myAction', function(val) { ... });
        await render(hbs`<NewProjectNavigationModal
            @openModal={{true}}
            @node={{theNode}}
            @closeModal={{action closeModal true}}
            @title="New project created successfully!"
        />`);

        assert.dom('[data-test-modal-message]').isVisible();
        assert.dom('[data-test-stay-here]').hasText(t('new_project.stay_here').toString());
        assert.dom('[data-test-go-to-new]').hasText(t('move_to_project.go_to_project').toString());
        assert.dom('[data-test-go-to-new]').hasAttribute('href', '/linkValue/', 'Navigation link was correct');

        await click('[data-test-stay-here]');
    });
});
