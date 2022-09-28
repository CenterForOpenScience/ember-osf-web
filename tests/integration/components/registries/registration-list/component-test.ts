import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { module, test } from 'qunit';

import { setupIntl, TestContext } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { OsfLinkRouterStub } from '../../../helpers/osf-link-router-stub';

module('Integration | Component | registration-list', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function(this: TestContext) {
        this.owner.unregister('service:router');
        this.owner.register('service:router', OsfLinkRouterStub);
        this.store = this.owner.lookup('service:store');
    });

    test('list renders and paginates', async function(this: TestContext, assert) {
        const registrations = server.createList('registration', 13, 'isPending');
        server.create('registration-provider', { id: 'stayc', registrations });
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
        assert.dom('[data-test-registration-list-card]').exists({ count: 10 }, 'First page has 10 elements');
        await click('[data-test-next-page-button]');
        assert.dom('[data-test-registration-list-card]').exists({ count: 3 }, 'Second page has 3 elements');
    });

    test('list renders when no registration is available', async function(this: TestContext, assert) {
        server.create('registration-provider', { id: 'stayc' });
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
        assert.dom('[data-test-registration-list-none]').exists({ count: 1 }, 'There are no results');
        assert.dom('[data-test-registration-list-none]').hasText(this.intl.t('registries.registrationList.pending'));
        assert.dom('[data-test-next-page-button]').doesNotExist('No next page button');
    });
});
