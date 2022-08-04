import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Component from '@glimmer/component';
import { ValidationObject } from 'ember-changeset-validations';
import { validateExclusion, validatePresence } from 'ember-changeset-validations/validators';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import IntlService from 'ember-intl/services/intl';
import RegistrationModel from 'ember-osf-web/models/registration';
import ResourceModel, { ResourceTypes } from 'ember-osf-web/models/resource';
import buildChangeset from 'ember-osf-web/utils/build-changeset';
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
            this.resource = await this.store.createRecord('resource', { registration: this.args.registration });
            await this.resource.save();
        }
        this.changeset = buildChangeset(this.resource, this.resourceValidations);
    }

    @action
    onClose() {
        if (!this.args.resource) {
            this.resource = undefined;
            this.changeset = undefined;
        }
        this.shouldShowPreview = false;
    }

    @task
    @waitFor
    async goToPreview() {
        this.changeset.validate();
        if (this.changeset.get('isValid')) {
            try {
                await this.changeset.save();
                this.shouldShowPreview = true;
            } catch (e) {
                if (e.errors[0].status === '400') {
                    this.changeset.addError(
                        'pid',
                        this.intl.t(
                            'validationErrors.invalid',
                            {
                                description: this.intl.t('osf-components.resources-list.edit_resource.doi'),
                            },
                        ),
                    );
                }
            }
        }
    }

    @action
    goToEdit() {
        this.shouldShowPreview = false;
    }

    @task
    @waitFor
    async finalize() {
        if (this.resource) {
            this.resource.finalized = true;
            try {
                await this.resource.save();
                this.toast.success(this.intl.t('osf-components.resources-list.edit_resource.add_success'));
            } catch {
                this.toast.error(this.intl.t('osf-components.resources-list.edit_resource.add_failure'));
            }
        }
    }
}
