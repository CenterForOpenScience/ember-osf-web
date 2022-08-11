import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { t } from 'ember-intl/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

// import ResourceModel, { ResourceTypes }  from 'ember-osf-web/models/resource';
import RegistrationModel from 'ember-osf-web/models/registration';

interface ResourceCardTestContext extends TestContext {
    registration: RegistrationModel;
}


module('Integration | Component | ResourcesList', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function(this: ResourceCardTestContext) {
        this.store = this.owner.lookup('service:store');
    });

    test('it renders for admin users', async function(this: ResourceCardTestContext, assert) {
        const mirageRegistration = server.create('registration', 'currentUserAdmin', 'withResources');
        this.registration = await this.store.findRecord('registration', mirageRegistration.id);
        await render(hbs`<ResourcesList @registration={{this.registration}} />`);
        assert.dom('[data-test-add-resource-section]')
            .containsText(t('osf-components.resources-list.add_instructions'), 'Add resource instructions shown');
        assert.dom('[data-test-resource-help-link]').exists('Help link exists');
        assert.dom('[data-test-resource-card-type]').exists('resource cards shown');
    });

    test('it renders for read users', async function(this: ResourceCardTestContext, assert) {
        const mirageRegistration = server.create('registration', 'withResources');
        this.registration = await this.store.findRecord('registration', mirageRegistration.id);
        await render(hbs`<ResourcesList @registration={{this.registration}} />`);
        assert.dom('[data-test-add-resource-section]').doesNotExist('Add resource section not shown');
        assert.dom('[data-test-resource-card-type]').exists('resource cards shown');
    });
});
