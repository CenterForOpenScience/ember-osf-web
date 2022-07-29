import { render, click as untrackedClicked, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupRenderingTest } from 'ember-qunit';
// import { TestContext } from 'ember-test-helpers';
import { module, test } from 'qunit';

import RegistrationModel from 'ember-osf-web/models/registration';
import {  } from '@ember/test-helpers';
import fillIn from '@ember/test-helpers/dom/fill-in';
import { selectChoose } from 'ember-power-select/test-support';
import { setupIntl, TestContext } from 'ember-intl/test-support';
import ResourceModel, { ResourceTypes } from 'ember-osf-web/models/resource';


interface EditResourceTestContext extends TestContext {
    registration: RegistrationModel;
    resource?: ResourceModel;
}


module('Integration | Component | ResourcesList::EditResource', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function(this: EditResourceTestContext) {
        this.store = this.owner.lookup('service:store');
    });

    test('it renders when !@resource', async function(this: EditResourceTestContext, assert) {
        const mirageRegistration = server.create('registration', 'currentUserAdmin');
        assert.equal(mirageRegistration.resources.length, 0, 'registration does not have any resource');
        this.registration = await this.store.findRecord('registration', mirageRegistration.id);
        await render(hbs`
            <ResourcesList::EditResource @registration={{this.registration}} as |modal| >
                <Button
                    data-test-open
                    {{on 'click' modal.open}}
                >
                </Button>
            </ResourcesList::EditResource>
        `);
        await untrackedClicked('[data-test-open]');
        mirageRegistration.reload();
        assert.equal(mirageRegistration.resources.length, 1, 'registration has exactly one resource');
        await click('[data-test-preview-button]');
        assert.dom('[data-test-validation-errors="pid"]').exists('DOI validation error message exists');
        assert.dom('[data-test-validation-errors="pid"]').hasText(
            this.intl.t(
                'validationErrors.invalid',
                {
                    description: this.intl.t('osf-components.resources-list.edit_resource.doi'),
                },
            ),
            'DOI validation error msg has correct language',
        );
        assert.dom('[data-test-validation-errors="resourceType"]').exists(
            'Resource type validation error msage exists',
        );
        assert.dom('[data-test-validation-errors="resourceType"]').hasText(
            this.intl.t(
                'validationErrors.blank',
            ),
            'Resource type validation error msg has correct language',
        );
        await fillIn('[data-test-doi-field] > div > input', 'https://invalid_url');
        await selectChoose('[data-test-resource-type-field]', 'Data');
        assert.dom('[data-test-validation-errors="resourceType"]').doesNotExist();
        await click('[data-test-preview-button]');
        assert.dom('[data-test-validation-errors="pid"]').exists('DOI validation error message exists');
        assert.dom('[data-test-validation-errors="pid"]').hasText(
            this.intl.t(
                'validationErrors.invalid',
                {
                    description: this.intl.t('osf-components.resources-list.edit_resource.doi'),
                },
            ),
            'DOI validation error msg has correct language',
        );
        await fillIn('[data-test-doi-field] > div > input', 'https://doi.org/yeji');
        await click('[data-test-preview-button]');
        assert.dom('[data-test-resource-card-type]').exists('Shows preview');
        const mirageResource = server.schema.resources.first();
        assert.equal(mirageResource.finalized, false, 'Resource is not yet finalized');
        await click('[data-test-add-button]');
        mirageResource.reload();
        assert.ok(mirageResource.finalized, 'Resource is finalized');
    });

    test('it renders when @resource is provided', async function(this: EditResourceTestContext, assert) {
        const mirageRegistration = server.create('registration', 'currentUserAdmin');
        const mirageResource = server.create('resource', {
            resourceType: ResourceTypes.Data,
            pid: 'https://doi.org/yeji',
            description: 'Hello, my name is Stevie',
            registration: mirageRegistration,
        });
        this.registration = await this.store.findRecord('registration', mirageRegistration.id);
        this.resource = await this.store.findRecord('resource', mirageResource.id);
        await render(hbs`
            <ResourcesList::EditResource @registration={{this.registration}} @resource={{this.resource}} as |modal| >
                <Button
                    data-test-open
                    {{on 'click' modal.open}}
                >
                </Button>
            </ResourcesList::EditResource>
        `);
        await untrackedClicked('[data-test-open]');
        await fillIn('[data-test-doi-field] > div > input', 'https://invalid_url');
        assert.dom('[data-test-validation-errors="resourceType"]').doesNotExist();
        await click('[data-test-preview-button]');
        assert.dom('[data-test-validation-errors="pid"]').exists('DOI validation error message exists');
        assert.dom('[data-test-validation-errors="pid"]').hasText(
            this.intl.t(
                'validationErrors.invalid',
                {
                    description: this.intl.t('osf-components.resources-list.edit_resource.doi'),
                },
            ),
            'DOI validation error msg has correct language',
        );
        await fillIn('[data-test-doi-field] > div > input', 'https://doi.org/ryujin');
        await selectChoose('[data-test-resource-type-field]', 'Materials');
        await click('[data-test-preview-button]');
        assert.dom('[data-test-resource-card-type]').exists('Shows preview');
        await click('[data-test-add-button]');
        mirageResource.reload();
        assert.equal(mirageResource.pid, 'https://doi.org/ryujin', 'PID is changed');
        assert.equal(mirageResource.resourceType, ResourceTypes.Materials, 'Resource type is changed');
    });
});
