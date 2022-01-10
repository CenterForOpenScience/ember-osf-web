import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import Store from '@ember-data/store';
import Component from '@glimmer/component';
import { task } from 'ember-concurrency';

import RegistrationModel from 'ember-osf-web/models/registration';
import SchemaResponseModel from 'ember-osf-web/models/schema-response';
import RouterService from '@ember/routing/router-service';
import { tracked } from '@glimmer/tracking';

interface Args {
    registration: RegistrationModel;
    isOpen: boolean;
    onClose: () => void;
}

export default class NewUpdateModal extends Component<Args> {
    @service store!: Store;
    @service router!: RouterService;

    @tracked showModal = false;

    get updatesAllowed(): boolean {
        return this.args.registration.provider.get('allowUpdates');
    }

    get providerName(): string {
        return this.args.registration.provider.get('name');
    }

    @action
    showCreateModal() {
        this.showModal = true;
    }

    @action
    closeCreateModal() {
        this.showModal = false;
    }

    @task
    @waitFor
    async createNewSchemaResponse() {
        const newRevision: SchemaResponseModel = this.store.createRecord('schema-response', {
            registration: this.args.registration,
        });
        await newRevision.save();
        this.router.transitionTo('registries.edit-revision', newRevision.id);
    }
}
