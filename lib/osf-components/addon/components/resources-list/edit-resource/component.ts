import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { ValidationObject } from 'ember-changeset-validations';
import { validateExclusion, validatePresence } from 'ember-changeset-validations/validators';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import DS from 'ember-data';
import IntlService from 'ember-intl/services/intl';
import RegistrationModel from 'ember-osf-web/models/registration';
import ResourceModel, { ResourceTypes } from 'ember-osf-web/models/resource';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
import { getApiErrorMessage } from 'ember-osf-web/utils/capture-exception';
import Media from 'ember-responsive';
import { tracked } from 'tracked-built-ins';

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
    @service media!: Media;

    availableTypes = Object.values(ResourceTypes);
    resourceValidations: ValidationObject<ResourceValidations> = {
        pid: [validatePresence({
            type: 'invalid',
            presence: true,
            translationArgs: { description: this.intl.t('osf-components.resources-list.edit_resource.doi') },
        })],
        resourceType: [
            validateExclusion({
                list: ['undefined'],
                type: 'mustSelect',
            }),
        ],
    };

    @tracked changeset: any;
    @tracked resource?: ResourceModel = this.args.resource;
    @tracked shouldShowPreview = false;

    get isMobile() {
        return this.media.isMobile;
    }

    @task
    async onOpen() {
        if (!this.resource) {
            this.resource = this.store.createRecord('resource', { registration: this.args.registration });
            await this.resource.save();
        }
        this.changeset = buildChangeset(this.resource, this.resourceValidations);
    }

    @action
    onClose() {
        if (!this.args.resource) {
            if (!this.resource?.finalized) {
                taskFor(this.deleteResource).perform();
            }
            this.resource = undefined;
            this.changeset = undefined;
        } else {
            this.changeset.rollback();
        }
        this.shouldShowPreview = false;
    }

    @action
    goToPreview() {
        this.shouldShowPreview = true;
    }

    @action
    goToEdit() {
        this.shouldShowPreview = false;
    }

    @task
    @waitFor
    async save(onSuccess?: () => void) {
        this.changeset.validate();
        if (this.changeset.get('isValid')) {
            try {
                await this.changeset.save();
                if (onSuccess) {
                    onSuccess();
                }
                if (this.resource?.finalized) {
                    this.toast.success(this.intl.t('osf-components.resources-list.edit_resource.save_success'));
                }
            } catch (e) {
                this.resource?.rollbackAttributes();
                const error = e.errors[0];
                if (error.status === '400') {
                    let message = this.intl.t('validationErrors.invalid', {
                        description: this.intl.t('osf-components.resources-list.edit_resource.doi'),
                    });
                    if (error.source.pointer === '/data/attributes') {
                        message = this.intl.t('osf-components.resources-list.edit_resource.doi_already_used');
                    }
                    this.changeset.addError(
                        'pid',
                        message,
                    );
                }
            }
        }
    }

    @task
    @waitFor
    async finalize() {
        if (this.resource) {
            this.resource.finalized = true;
            try {
                await this.resource.save();
                this.toast.success(this.intl.t('osf-components.resources-list.edit_resource.add_success'));
            } catch (e) {
                this.toast.error(
                    getApiErrorMessage(e),
                    this.intl.t('osf-components.resources-list.edit_resource.add_failure'),
                );
            }
        }
    }

    @task
    @waitFor
    async deleteResource() {
        await this.resource?.destroyRecord();
    }
}
