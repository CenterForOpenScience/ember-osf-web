import { pauseTest, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupIntl } from 'ember-intl/test-support';

import { module, test } from 'qunit';

import { setupRenderingTest } from 'ember-qunit';

module('Registries | Integration | Component | registration-list', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    // tslint:disable-next-line: only-arrow-functions
    test('list renders and paginates', async function(assert) {
        const provider = server.create('registration-provider', { id: 'stayc' });
        const registrations = server.createList('registration', 13);
        this.store = this.owner.lookup('service:store');
        provider.update({ registrations });
        const providerModel = this.store.findRecord('registration-provider', 'stayc');
        this.set('provider', providerModel);
        await render(hbs`
            <Registries::RegistrationList::Manager
                @provider={{this.provider}}
                @state={{'pending'}}
                as |manager|
            >
                <Registries::RegistrationList::List @manager={{manager}} />
            </Registries::RegistrationList::Manager>`);
        await pauseTest();
        assert.ok(1);
    });
});
