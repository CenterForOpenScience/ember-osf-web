import { render } from '@ember/test-helpers';
import { Server } from 'ember-cli-mirage';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

import { startMirage } from 'ember-osf-web/initializers/ember-cli-mirage';
import { Permission } from 'ember-osf-web/models/osf-model';

type Context = TestContext & { server: Server };

const noop = () => { /* noop */ };

module('Integration | Component | institution-select-list', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(async function(this: Context) {
        this.server = startMirage();
        this.store = this.owner.lookup('service:store');
        const mirageRegistration = server.create('registration', {
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
            currentUserPermissions: Object.values(Permission),
        });
        const registration = await this.store.findRecord('registration', mirageRegistration.id);
        const managerStub = {
            reloadList: noop,
            addInstitution: noop,
            removeInstitution: noop,
            affiliatedList: [],
            shouldDisableButtons: false,
        };
        this.set('node', registration);
        this.set('manager', managerStub);
    });

    test('it renders', async function(this: Context, assert) {
        const mirageUser = server.create('user', 'withInstitutions');
        const user = await this.store.findRecord('user', mirageUser.id);
        this.set('user', user);

        await render(hbs`<InstitutionSelectList
            @user={{this.user}}
            @node={{this.node}}
            @manager={{this.manager}}
        />`);

        assert.dom('[data-test-institution]').exists({ count: 3 });
    });
});
