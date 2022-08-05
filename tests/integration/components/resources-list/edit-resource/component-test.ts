
import { click } from 'ember-osf-web/tests/helpers';
import { click as untrackedClicked, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

import RegistrationModel from 'ember-osf-web/models/registration';
import fillIn from '@ember/test-helpers/dom/fill-in';
import { selectChoose } from 'ember-power-select/test-support';
import { setupIntl, TestContext } from 'ember-intl/test-support';
import ResourceModel, { ResourceTypes } from 'ember-osf-web/models/resource';
import sinon from 'sinon';


interface EditResourceTestContext extends TestContext {
    registration: RegistrationModel;
    resource?: ResourceModel;
    reload: any;
}


module('Integration | Component | ResourcesList::EditResource', hooks => {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function(this: EditResourceTestContext) {
        this.store = this.owner.lookup('service:store');
        this.reload = sinon.fake();
    });

    test('it renders when !@resource', async function(this: EditResourceTestContext, assert) {
        const mirageRegistration = server.create('registration', 'currentUserAdmin');
        assert.equal(mirageRegistration.resources.length, 0, 'registration does not have any resource');
        this.registration = await this.store.findRecord('registration', mirageRegistration.id);
        await render(hbs`
            <ResourcesList::EditResource @registration={{this.registration}} @reload={{this.reload}} as |modal| >
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
                'validationErrors.mustSelect',
            ),
            'Resource type validation error msg has correct language',
        );
        await fillIn('[data-test-doi-field] > div > div > input', 'invalid_doi');
        await selectChoose('[data-test-resource-type-field]', this.intl.t('osf-components.resources-list.data'));
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
        await fillIn('[data-test-doi-field] > div > div > input', '10.101/yeji');
        await click('[data-test-preview-button]');
        assert.dom('[data-test-resource-card-type]').exists('Shows type in preview');
        assert.dom('[data-test-resource-card-type]').hasText(
            this.intl.t('osf-components.resources-list.data'),
            'Type is correct',
        );
        assert.dom('[data-test-resource-card-pid-link]').exists('Shows DOI link in preview');
        assert.dom('[data-test-resource-card-pid-link]').hasText('https://doi.org/10.101/yeji', 'DOI is correct');
        await click('[data-test-edit-button]');
        await fillIn('[data-test-doi-field] > div > div > input', '10.101/ryujin');
        await selectChoose('[data-test-resource-type-field]',
            this.intl.t('osf-components.resources-list.analytic_code'));
        await click('[data-test-preview-button]');
        assert.dom('[data-test-resource-card-type]').hasText(
            this.intl.t('osf-components.resources-list.analytic_code'),
            'Type is correct',
        );
        assert.dom('[data-test-resource-card-pid-link]').hasText('https://doi.org/10.101/ryujin', 'DOI is correct');
        const mirageResource = server.schema.resources.first();
        assert.false(mirageResource.finalized, 'Resource is not yet finalized');
        assert.equal(mirageResource.pid, '10.101/ryujin', 'DOI is saved to resource');
        assert.equal(mirageResource.resourceType, ResourceTypes.AnalyticCode, 'Resource type is saved to resource');
        await click('[data-test-add-button]');
        mirageResource.reload();
        assert.ok(mirageResource.finalized, 'Resource is finalized');
        sinon.assert.calledOnce(this.reload);
    });

    test('it renders when @resource is provided', async function(this: EditResourceTestContext, assert) {
        const mirageRegistration = server.create('registration', 'currentUserAdmin');
        const mirageResource = server.create('resource', {
            resourceType: ResourceTypes.AnalyticCode,
            pid: '10.101/yeji',
            description: 'Hello, my name is Stevie',
            registration: mirageRegistration,
        });
        this.registration = await this.store.findRecord('registration', mirageRegistration.id);
        this.resource = await this.store.findRecord('resource', mirageResource.id);
        await render(hbs`
            <ResourcesList::EditResource
                @registration={{this.registration}}
                @resource={{this.resource}}
                @reload={{this.reload}}
            as |modal| >
                <Button
                    data-test-open
                    {{on 'click' modal.open}}
                >
                </Button>
            </ResourcesList::EditResource>
        `);
        await untrackedClicked('[data-test-open]');
        assert.dom('[data-test-doi-field] > div > div > input').hasValue('10.101/yeji');
        assert.dom('[data-test-resource-type-field] > div').hasText(
            this.intl.t('osf-components.resources-list.analytic_code'),
        );
        assert.dom('[data-test-description-field] > div > textarea').hasValue('Hello, my name is Stevie');
        await fillIn('[data-test-doi-field] > div > div > input', 'https://invalid_url');
        assert.dom('[data-test-validation-errors="resourceType"]').doesNotExist();
        assert.dom('[data-test-preview-button]').doesNotExist('No preview option if resource already exists');
        await click('[data-test-save-button]');
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
        await fillIn('[data-test-doi-field] > div > div > input', '10.101/ryujin');
        await selectChoose('[data-test-resource-type-field]', this.intl.t('osf-components.resources-list.materials'));
        await fillIn('[data-test-description-field] > div > textarea', "Actually, I'm lying. It's really Bebe");
        await click('[data-test-save-button]');
        assert.dom('[data-test-dialog]').doesNotExist('Dialog closes after editing resource');
        mirageResource.reload();
        assert.equal(mirageResource.pid, '10.101/ryujin', 'PID is changed');
        assert.equal(mirageResource.resourceType, ResourceTypes.Materials, 'Resource type is changed');
        assert.equal(mirageResource.description, "Actually, I'm lying. It's really Bebe");
        assert.ok(mirageResource.finalized, 'Resource is finalized');
        sinon.assert.calledOnce(this.reload);
    });

    test('it destroys unfinalized resource on close', async function(this: EditResourceTestContext, assert) {
        const mirageRegistration = server.create('registration', 'currentUserAdmin');
        assert.equal(mirageRegistration.resources.length, 0, 'registration does not have any resource');
        this.registration = await this.store.findRecord('registration', mirageRegistration.id);
        await render(hbs`
            <ResourcesList::EditResource @registration={{this.registration}} @reload={{this.reload}} as |modal| >
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
        await click('[data-test-cancel-button]');
        mirageRegistration.reload();
        assert.equal(mirageRegistration.resources.length, 0, 'registration no longer has resource');

        await untrackedClicked('[data-test-open]');
        mirageRegistration.reload();
        assert.equal(mirageRegistration.resources.length, 1, 'registration again has one resource');
        await fillIn('[data-test-doi-field] > div > div > input', '10.101/chaeryeong');
        await selectChoose('[data-test-resource-type-field]', this.intl.t('osf-components.resources-list.data'));
        await click('[data-test-preview-button]');
        await click('[data-test-close-dialog]');
        mirageRegistration.reload();
        assert.equal(mirageRegistration.resources.length, 0, 'registration no longer has resource, even after preview');
    });

    test('it preserves existing/finalized resource', async function(this: EditResourceTestContext, assert) {
        const mirageRegistration = server.create('registration', 'currentUserAdmin');
        const mirageResource = server.create('resource', {
            resourceType: ResourceTypes.AnalyticCode,
            pid: '10.101/lia',
            registration: mirageRegistration,
        });
        this.registration = await this.store.findRecord('registration', mirageRegistration.id);
        this.resource = await this.store.findRecord('resource', mirageResource.id);
        await render(hbs`
            <ResourcesList::EditResource
                @registration={{this.registration}}
                @resource={{this.resource}}
                @reload={{this.reload}}
            as |modal| >
                <Button
                    data-test-open
                    {{on 'click' modal.open}}
                >
                </Button>
            </ResourcesList::EditResource>
        `);
        await untrackedClicked('[data-test-open]');
        assert.dom('[data-test-doi-field] > div > div > input').hasValue('10.101/lia');
        await fillIn('[data-test-doi-field] > div > div > input', '10.101/julia');
        await selectChoose('[data-test-resource-type-field]', this.intl.t('osf-components.resources-list.data'));
        await click('[data-test-close-dialog]');
        mirageResource.reload();
        assert.equal(mirageResource.pid, '10.101/lia', 'PID is reverted to original changed');
        assert.equal(mirageResource.resourceType, ResourceTypes.AnalyticCode, 'Resource type reverted');
    });
});
