import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { Server } from 'ember-cli-mirage';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import { startMirage } from 'ember-osf-web/initializers/ember-cli-mirage';
import { Permission } from 'ember-osf-web/models/osf-model';

type Context = TestContext & { server: Server };

const noop = () => { /* noop */ };

module('Integration | Component | institution-select-list', hooks => {
    setupRenderingTest(hooks);

    hooks.beforeEach(function(this: Context) {
        this.server = startMirage();
        this.store = this.owner.lookup('service:store');
        const mirageRegistration = server.create('registration', {
            registrationSchema: server.schema.registrationSchemas.find('prereg_challenge'),
            currentUserPermissions: Object.values(Permission),
        });
        const registration = this.store.findRecord('registration', mirageRegistration.id);
        const mirageUser = server.create('user', 'withInstitutions');
        const user = this.store.findRecord('user', mirageUser.id);
        const managerStub = {
            toggleInstitution: noop,
            affiliatedList: [],
            node: registration,
            user,
        };
        this.set('manager', managerStub);
    });

    test('it renders', async assert => {
        await render(hbs`<InstitutionSelectList @manager={{this.manager}} />`);

        assert.dom('[data-test-institution]').exists({ count: 3 });
    });
});
