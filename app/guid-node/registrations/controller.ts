import Controller from '@ember/controller';
import { assert } from '@ember/debug';
import { action, computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import DS from 'ember-data';

import Node from 'ember-osf-web/models/node';
import RegistrationSchema from 'ember-osf-web/models/registration-schema';
import Analytics from 'ember-osf-web/services/analytics';

export default class GuidNodeRegistrations extends Controller {
    @service analytics!: Analytics;
    @service store!: DS.Store;

    queryParams = ['tab'];
    tab?: string;

    draftsQueryParams = { embed: ['initiator', 'registration_schema', 'branched_from'] };
    defaultSchema!: RegistrationSchema;
    selectedSchema!: RegistrationSchema;
    schemas: RegistrationSchema[] = [];
    newModalOpen = false;
    preregModalOpen = false;
    preregConsented = false;

    reloadDrafts?: (page?: number) => void; // bound by paginated-list

    preregLinks = {
        approvedJournal: 'http://cos.io/our-services/prereg-more-information/',
        learnMore: 'https://cos.io/prereg',
        eligibleJournal: 'https://cos.io/preregjournals',
        embargoedCountries: 'https://www.pmddtc.state.gov/?id=ddtc_public_portal_country_landing',
        terms: 'https://osf.io/4uxbj/',
    };

    @task
    getRegistrationSchemas = task(function *(this: GuidNodeRegistrations) {
        let schemas = yield this.store.query('registration-schema',
            {
                adapterOptions: {
                    query: {
                        'filter[active]': true,
                    },
                },
            });
        schemas = schemas.toArray();
        schemas.sort((a: RegistrationSchema, b: RegistrationSchema) => a.name.length - b.name.length);
        this.set('defaultSchema', schemas.firstObject);
        this.set('selectedSchema', this.defaultSchema);
        this.set('schemas', schemas);
    });

    @alias('model.taskInstance.value') node!: Node | null;

    @computed('tab')
    get activeTab() {
        return this.tab ? this.tab : 'registrations';
    }

    @computed('node.{id,root.id,root.userHasAdminPermission}')
    get isComponentRootAdmin() {
        return this.node && this.node.id !== this.node.root.get('id') && this.node.root.get('userHasAdminPermission');
    }

    @action
    changeTab(activeId: string) {
        this.set('tab', activeId === 'registrations' ? undefined : activeId);
        this.analytics.click('tab', `Registrations tab - Change tab to: ${activeId}`);
    }

    @action
    closeNewModal() {
        this.set('newModalOpen', false);
        this.set('selectedSchema', this.defaultSchema);
    }

    @action
    togglePreregConsent() {
        this.toggleProperty('preregConsented');
        if (this.preregConsented) {
            this.analytics.click('checkbox', 'Registrations tab - Consent to Prereg Challenge ');
        }
    }

    @action
    closePreregModal() {
        this.set('preregModalOpen', false);
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

        if (this.selectedSchema.name === 'Prereg Challenge' && this.newModalOpen) {
            this.set('newModalOpen', false);
            this.set('preregConsented', false);
            this.set('preregModalOpen', true);
            return;
        }
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
}

declare module '@ember/controller' {
    interface Registry {
        'guid-node/registrations': GuidNodeRegistrations;
    }
}
