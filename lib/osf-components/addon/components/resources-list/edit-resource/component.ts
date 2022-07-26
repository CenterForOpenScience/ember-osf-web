import { action } from '@ember/object';
import { inject as service } from '@ember/service';
// import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { ValidationObject } from 'ember-changeset-validations';
import { validatePresence } from 'ember-changeset-validations/validators';
import { task } from 'ember-concurrency';
// import { taskFor } from 'ember-concurrency-ts';
import DS from 'ember-data';
import IntlService from 'ember-intl/services/intl';
import RegistrationModel from 'ember-osf-web/models/registration';
import ResourceModel, { ResourceTypes } from 'ember-osf-web/models/resource';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import { tracked } from 'tracked-built-ins';
// import captureException, { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';

interface Args {
    resource?: ResourceModel;
    registration?: RegistrationModel;
    reload?: () => {};
}

interface ResourceValidations {
    pid: string;
    description: string;
    resourceType: string;
}

export default class EditResourceModal extends Component<Args> {
    @service toast!: Toastr;
    @service intl!: IntlService;
    @service store!: DS.Store;

    availableTypes = Object.values(ResourceTypes);
    resourceValidations: ValidationObject<ResourceValidations> = {
        pid: [validatePresence({
            type: 'invalid',
            presence: true,
            translationArgs: { description: this.intl.t('osf-components.resources-list.edit_resource.doi') },
        })],
        resourceType: [validatePresence({
            type: 'blank',
            presence: true,
            translationArgs: { description: this.intl.t('osf-components.resources-list.edit_resource.output_type') },
        })],
        description: [validatePresence({
            type: 'blank',
            presence: true,
            translationArgs: { description: this.intl.t('osf-components.resources-list.edit_resource.description') },
        })],
    };

    @tracked changeset: any;
    @tracked resource?: ResourceModel = this.args.resource;
    @tracked shouldShowPreview = false;

    @task
    async onOpen() {
        if (!this.resource) {
            this.resource = await this.store.createRecord('resource', { registration: this.args.registration });
            this.resource.save();
        }
        this.changeset = buildChangeset(this.resource, this.resourceValidations);
    }

    @action
    onClose() {
        this.resource = undefined;
        this.changeset = undefined;
        this.shouldShowPreview = false;
    }

    @task
    async goToPreview() {
        this.changeset.validate();
        if (this.changeset.get('isValid')) {
            await this.changeset.save();
            this.shouldShowPreview = true;
        }
    }

    @action
    goToEdit() {
        this.shouldShowPreview = false;
    }

    @task
    async finalize() {
        if (this.resource) {
            this.resource.finalized = true;
            await this.resource.save();
        }
    }
}
