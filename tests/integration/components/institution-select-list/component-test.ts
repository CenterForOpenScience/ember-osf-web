import { render } from '@ember/test-helpers';
import { Server } from 'ember-cli-mirage';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

import { startMirage } from 'ember-osf-web/initializers/ember-cli-mirage';
import { click } from 'ember-osf-web/tests/helpers';

type Context = TestContext & { server: Server };

module('Integration | Component | institution-select-list', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(this: Context, assert) {
        this.server = startMirage();
        this.store = this.owner.lookup('service:store');

        this.setProperties({
            add: () => assert.ok(true),
            remove: () => assert.ok(true),
            addTask: () => assert.ok(true),
            removeTask: () => assert.ok(true),
            affiliatedList: [],
        });
    });

    test('it renders', async function(this: Context, assert) {
        const mirageUser = server.create('user', 'withInstitutions');

        this.set('user', this.store.findRecord('user', mirageUser.id));

        await render(hbs`
            <InstitutionSelectList
                @model={{this.user}}
                @add={{this.add}}
                @remove={{this.remove}}
                @addTask={{this.addTask}}
                @removeTask={{this.removeTask}}
                @affiliatedList={{this.affiliatedList}}
            />`);
        assert.dom('[data-test-institution]').exists({ count: 3 });
    });

    test('button changes', async function(this: Context, assert) {
        const mirageUser = server.create('user');
        server.create('institution', { users: [mirageUser] });

        this.set('user', this.store.findRecord('user', mirageUser.id));
        function add(this: Context, institution: any) {
            this.set('affiliatedList', [institution]);
        }
        this.set('add', add);

        await render(hbs`
            <InstitutionSelectList
                @model={{this.user}}
                @add={{this.add}}
                @remove={{this.remove}}
                @addTask={{this.addTask}}
                @removeTask={{this.removeTask}}
                @affiliatedList={{this.affiliatedList}}
            />`);
        assert.dom('[data-test-institution]').exists();
        assert.dom('[data-test-institution-button]').exists();
        assert.dom('[data-test-institution-button] > i').hasClass('fa-plus');
        await click('[data-test-institution-button]');
        assert.dom('[data-test-institution-button] > i').hasClass('fa-minus');
    });
});
