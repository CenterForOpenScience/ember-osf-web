import { A } from '@ember/array';
import Service from '@ember/service';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupIntl } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

const currentUserStub = Service.extend({
    user: Object.freeze({
        institutions: A([]),
    }),
});

module('Integration | Component | new-project-modal', hooks => {
    setupRenderingTest(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.owner.register('service:current-user', currentUserStub);
    });

    test('it renders', async function(assert) {
        await render(hbs`<NewProjectModal @openModal={{true}} />`);
        assert.dom('[data-test-create-project-header]').exists();
        assert.dom('[data-test-create-project-header]').hasText('Create new project');
    });
});
