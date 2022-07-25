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
        pid: [validatePresence],
        resourceType: [validatePresence],
        description: [validatePresence],
    };

    @tracked changeset: any;
    @tracked resource?: ResourceModel = this.args.resource;
    @tracked shouldShowPreview = false;

    // constructor(owner: unknown, args: Args) {
    //     super(owner, args);
    //     // if (args.resource) {
    //     //     this.resource = args.resource;
    //     // } else {
    //     //     taskFor(this.onOpen)
    //     // }
    // }

    @task
    async onOpen() {
        if (!this.resource) {
            this.resource = await this.store.createRecord('resource', { registration: this.args.registration });
            this.resource.save();
        }
        this.changeset = buildChangeset(this.resource, this.resourceValidations);
    }
}
