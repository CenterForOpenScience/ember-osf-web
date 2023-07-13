import Store from '@ember-data/store';
import Controller from '@ember/controller';
import { assert } from '@ember/debug';
import { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import config from 'ember-get-config';
import Media from 'ember-responsive';

import Node from 'ember-osf-web/models/node';
import RegistrationSchema from 'ember-osf-web/models/registration-schema';
import Analytics from 'ember-osf-web/services/analytics';

export default class GuidNodeRegistrations extends Controller {
    @service media!: Media;
    @service analytics!: Analytics;
    @service store!: Store;

    queryParams = ['tab'];
    tab?: string;

    draftsQueryParams = { embed: ['initiator', 'registration_schema', 'branched_from', 'provider'] };
    defaultSchema!: RegistrationSchema;
    selectedSchema!: RegistrationSchema;
    schemas: RegistrationSchema[] = [];
    newModalOpen = false;

    reloadDrafts?: (page?: number) => void; // bound by paginated-list

    @alias('model.taskInstance.value') node!: Node | null;

    @task
    @waitFor
    async getRegistrationSchemas() {
        const { defaultProvider } = config;
        const provider = await this.store.findRecord(
            'registration-provider',
            defaultProvider,
        );
        let schemas: RegistrationSchema[] = await provider.loadAll('schemas');
        schemas = schemas.toArray();
        schemas.sort((a: RegistrationSchema, b: RegistrationSchema) => a.name.length - b.name.length);
        this.set('defaultSchema', schemas.firstObject);
        this.set('selectedSchema', this.defaultSchema);
        this.set('schemas', schemas);
    }

    @computed('node.{id,root.id,root.userHasAdminPermission}')
    get isComponentRootAdmin() {
        return this.node && this.node.id !== this.node.root.get('id') && this.node.root.get('userHasAdminPermission');
    }

    @action
    changeTab(activeId: number) {
        const tabName = activeId === 0 ? 'registrations' : 'drafts';
        this.analytics.click('tab', `Registrations tab - Change tab to: ${tabName}`);
    }

    @action
    closeNewModal() {
        this.set('newModalOpen', false);
        this.set('selectedSchema', this.defaultSchema);
    }

    @action
    schemaChanged(schema: RegistrationSchema) {
        this.set('selectedSchema', schema);
        this.analytics.click('radio', `Registrations tab - Select schema: ${schema.name}`);
    }

    @action
    async createDraft() {
        const branchedFrom = this.node!;
        assert('Check that the node exists', Boolean(branchedFrom));

        const draftRegistration = this.store.createRecord('draft-registration', {
            registrationSupplement: this.selectedSchema.id,
            branchedFrom,
            registrationSchema: this.selectedSchema,
        });
        await draftRegistration.save();
        this.set('newModalOpen', false);
        this.set('selectedSchema', this.defaultSchema);

        this.transitionToRoute(
            'guid-node.drafts',
            branchedFrom.id,
            draftRegistration.id,
        );
    }

    get isMobile() {
        return this.media.isMobile;
    }
}

declare module '@ember/controller' {
    interface Registry {
        'guid-node/registrations': GuidNodeRegistrations;
    }
}
