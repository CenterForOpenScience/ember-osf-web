import { A } from '@ember/array';
import EmberObject from '@ember/object';
import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-osf-web/tests/helpers/osf-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | new project modal', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(this: TestContext, assert) {
        this.setProperties({
            closeModal: () => assert.ok(true),
            create: () => assert.ok(true),
            removeAll: () => assert.ok(true),
            search: () => assert.ok(true),
            searchChange: () => assert.ok(true),
            selectAll: () => assert.ok(true),
            selectInstitution: () => assert.ok(true),

            institutions: A([]),
            institutionsSelected: A([]),
            newNode: null,
            templateFrom: EmberObject.create({}),
        });
    });

    test('it renders', async function(assert) {
        await render(hbs`{{new-project-modal
            newNode=newNode
            institutions=institutions
            institutionsSelected=institutionsSelected
            closeModal=closeModal
            selectInstitution=selectInstitution
            selectAll=selectAll
            removeAll=removeAll
            search=search
            searchSelected=templateFrom
            searchChange=searchChange
            create=create
        }}`);
        assert.ok(this.$().text().trim());
    });
});
