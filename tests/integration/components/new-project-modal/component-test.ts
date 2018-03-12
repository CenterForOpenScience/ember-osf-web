import { A } from '@ember/array';
import EmberObject from '@ember/object';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('new-project-modal', 'Integration | Component | new project modal', {
    integration: true,
    beforeEach(assert) {
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
    },
});

test('it renders', function (assert) {
    this.render(hbs`{{new-project-modal
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
