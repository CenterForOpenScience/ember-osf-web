import { render } from '@ember/test-helpers';
import { Server } from 'ember-cli-mirage';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

import { startMirage } from 'ember-osf-web/initializers/ember-cli-mirage';
import { Permission } from 'ember-osf-web/models/osf-model';
import { click } from 'ember-osf-web/tests/helpers';

type Context = TestContext & { server: Server };

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
        this.set('node', registration);
    });

    test('it renders', async function(this: Context, assert) {
        const mirageUser = server.create('user', 'withInstitutions');
        const user = await this.store.findRecord('user', mirageUser.id);
        this.set('user', user);

        await render(hbs`<InstitutionSelectList @user={{this.user}} @node={{this.node}} />`);

        assert.dom('[data-test-institution]').exists({ count: 3 });
    });

    test('button changes', async function(this: Context, assert) {
        const mirageUser = server.create('user');
        const user = await this.store.findRecord('user', mirageUser.id);
        server.create('institution', { users: [mirageUser] });
        this.set('user', user);

        await render(hbs`<InstitutionSelectList @user={{this.user}} @node={{this.node}} />`);

        assert.dom('[data-test-institution]').exists();
        assert.dom('[data-test-institution-button]').exists();
        assert.dom('[data-test-institution-button] > i').hasClass('fa-plus');
        await click('[data-test-institution-button]');
        assert.dom('[data-test-institution-button] > i').hasClass('fa-minus');
    });
});
