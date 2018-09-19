import { action, computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import DS from 'ember-data';
import config from 'ember-get-config';

import RegistrationSchema from 'ember-osf-web/models/registration-schema';
import Analytics from 'ember-osf-web/services/analytics';
import pathJoin from 'ember-osf-web/utils/path-join';

const { OSF: { url: baseURL } } = config;

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
    reloadDrafts = false;

    preregLinks = {
        approvedJournal: 'http://cos.io/our-services/prereg-more-information/',
        learnMore: 'https://cos.io/prereg',
        eligibleJournal: 'https://cos.io/preregjournals',
        embargoedCountries: 'https://www.pmddtc.state.gov/?id=ddtc_public_portal_country_landing',
        terms: 'https://osf.io/4uxbj/',
    };

    getRegistrationSchemas = task(function *(this: GuidNodeRegistrations) {
        let schemas = yield this.store.findAll('registration-schema');
        schemas = schemas.toArray();
        schemas.sort((a: RegistrationSchema, b: RegistrationSchema) => {
            return a.name.length > b.name.length;
        });
        this.set('defaultSchema', schemas.firstObject);
        this.set('selectedSchema', this.defaultSchema);
        this.set('schemas', schemas);
    });

    @alias('model.taskInstance.value') node!: Node;

    @computed('tab')
    get activeTab() {
        return this.tab ? this.tab : 'registrations';
    }

    @action
    changeTab(this: GuidNodeRegistrations, activeId: string) {
        this.set('tab', activeId === 'registrations' ? undefined : activeId);
        this.analytics.click('tab', `Registrations Tab - Change tab to: ${activeId}`);
    }

    @action
    openNewModal(this: GuidNodeRegistrations) {
        this.set('newModalOpen', true);
        this.analytics.click('button', 'Registrations Tab - Open new registration modal');
    }

    @action
    closeNewModal(this: GuidNodeRegistrations) {
        this.set('newModalOpen', false);
        this.set('selectedSchema', this.defaultSchema);
        this.analytics.click('button', 'Registrations Tab - Close new registration modal');
    }

    @action
    togglePreregConsent() {
        this.toggleProperty('preregConsented');
        if (this.preregConsented) {
            this.analytics.click('checkbox', 'Registrations Tab - Consent to Prereg Challenge ');
        }
    }

    @action
    closePreregModal(this: GuidNodeRegistrations) {
        this.set('preregModalOpen', false);
        this.set('selectedSchema', this.defaultSchema);
        this.analytics.click('button', 'Registrations Tab - Close Prereg Challenge modal');
    }

    @action
    schemaChanged(this: GuidNodeRegistrations, schema: RegistrationSchema) {
        this.set('selectedSchema', schema);
        this.analytics.click('radio', `Registrations Tab - Select schema: ${schema.name}`);
    }

    @action
    async createDraft(this: GuidNodeRegistrations) {
        this.analytics.click('button', 'Registrations Tab - Create draft');
        if (this.selectedSchema.name === 'Prereg Challenge' && this.newModalOpen) {
            this.set('newModalOpen', false);
            this.set('preregConsented', false);
            this.set('preregModalOpen', true);
            return;
        }
        const draftRegistration = this.store.createRecord('draft-registration', {
            registrationSupplement: this.selectedSchema.id,
            branchedFrom: this.node,
            registrationSchema: this.selectedSchema,
        });
        await draftRegistration.save();
        this.set('newModalOpen', false);
        this.set('reloadDrafts', true);
        this.set('selectedSchema', this.defaultSchema);
        window.location.assign(
            pathJoin(baseURL, draftRegistration.branchedFrom.get('id'), 'drafts', draftRegistration.id),
        );
    }
}

declare module '@ember/controller' {
    interface Registry {
        'guid-node/registrations': GuidNodeRegistrations;
    }
}
