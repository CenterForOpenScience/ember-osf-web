import { click } from 'ember-osf-web/tests/helpers';
import { click as untrackedClicked, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { setupIntl, TestContext } from 'ember-intl/test-support';
import ResourceModel, { ResourceTypes } from 'ember-osf-web/models/resource';
import sinon from 'sinon';


interface EditResourceTestContext extends TestContext {
    resource?: ResourceModel;
    reload: any;
}


module('Integration | Component | ResourcesList::DeleteResource', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function(this: EditResourceTestContext) {
        this.store = this.owner.lookup('service:store');
        this.reload = sinon.fake();
    });

    test('it renders', async function(this: EditResourceTestContext, assert) {
        const mirageRegistration = server.create('registration', 'currentUserAdmin');
        const mirageResource = server.create('resource', {
            resourceType: ResourceTypes.AnalyticCode,
            pid: 'https://doi.org/tzuyu',
            description: 'Sneakers',
            registration: mirageRegistration,
            finalized: true,
        });
        this.resource = await this.store.findRecord('resource', mirageResource.id);
        await render(hbs`
            <ResourcesList::DeleteResource
                @resource={{this.resource}}
                @onDelete={{this.reload}}
            as |modal| >
                <Button
                    data-test-open
                    {{on 'click' modal.open}}
                >
                </Button>
            </ResourcesList::DeleteResource>
        `);
        await untrackedClicked('[data-test-open]');
        assert.dom('[data-test-modal-heading]').hasText(
            this.intl.t('osf-components.resources-list.delete_resource.title'),
            'Modal heading text is correct',
        );
        assert.dom('[data-test-modal-body]').hasText(
            this.intl.t('osf-components.resources-list.delete_resource.body'),
            'Modal body text is correct',
        );
        assert.dom('[data-test-resource-card-type]').exists('Shows type in preview');
        assert.dom('[data-test-resource-card-type]').hasText(
            this.intl.t('osf-components.resources-list.analytic_code'),
            'Type is correct',
        );
        assert.dom('[data-test-resource-card-pid-link]').exists('Shows DOI link in preview');
        assert.dom('[data-test-resource-card-pid-link]').hasText(mirageResource.pid, 'DOI is correct');
        assert.dom('[data-test-resource-card-description]').exists('Show description in preview');
        assert.dom('[data-test-resource-card-description]').hasText(
            mirageResource.description,
            'Description is correct',
        );
        await click('[data-test-confirm-delete]');
        sinon.assert.calledOnce(this.reload);
    });
});
