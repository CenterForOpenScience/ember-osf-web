import { A } from '@ember/array';
import Service from '@ember/service';
import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

const currentUserStub = Service.extend({
    user: Object.freeze({
        institutions: A([]),
    }),
});

module('Integration | Component | new-project-modal', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(this: TestContext, assert) {
        this.owner.register('service:current-user', currentUserStub);

        this.setProperties({
            closeModal: () => assert.ok(true),
            create: () => assert.ok(true),
            search: () => assert.ok(true),
            newNode: null,
        });
    });

    test('it renders', async assert => {
        await render(hbs`{{new-project-modal
            searchNodes=search
            createProject=create
            closeModal=closeModal
        }}`);
        assert.dom('.modal').exists();
        assert.dom('.modal-title').hasText('Create new project');
    });
});
