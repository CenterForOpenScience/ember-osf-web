import Store from '@ember-data/store';
import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { task } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import config from 'ember-osf-web/config/environment';
import QueryParams from 'ember-parachute';

import PreprintProvider from 'ember-osf-web/models/preprint-provider';
import Analytics from 'ember-osf-web/services/analytics';
import param from 'ember-osf-web/utils/param';

const { OSF: { casUrl, url: baseUrl } } = config;

interface RegisterQueryParams {
    next: string;
    campaign: string;
}

export const registerQueryParams = new QueryParams<RegisterQueryParams>({
    next: {
        defaultValue: '',
    },
    campaign: {
        defaultValue: '',
    },
});

export default class Register extends Controller.extend(registerQueryParams.Mixin) {
    @service analytics!: Analytics;
    @service store!: Store;

    signUpCampaign?: string;

    hasProvider = false;
    provider?: PreprintProvider;

    isOsfPreprints = false;
    isOsfRegistries = false;

    @computed('next')
    get orcidUrl() {
        return `${casUrl}/login?${param({
            redirectOrcid: 'true',
            service: `${baseUrl}/login/?next=${encodeURIComponent(this.next || baseUrl)}`,
        })}`;
    }

    @computed('next')
    get institutionUrl() {
        return `${casUrl}/login?${param({
            campaign: 'institution',
            service: `${baseUrl}/login/?next=${encodeURIComponent(this.next || baseUrl)}`,
        })}`;
    }

    @computed('provider', 'provider.{id,name,documentType.pluralCapitalized}')
    get headerText() {
        if (this.provider) {
            // Special casing for Thesis Commons
            if (this.provider.id === 'thesiscommons') {
                return this.provider.name;
            }
            return `${this.provider.name} ${this.provider.documentType.pluralCapitalized}`;
        }
        return '';
    }

    @task
    @waitFor
    async getProvider(preprintProviderId: string) {
        const provider: PreprintProvider = await this.store.findRecord('preprint-provider', preprintProviderId);
        if (provider) {
            this.set('provider', provider);
        }
    }

    setup({ queryParams }: { queryParams: RegisterQueryParams }) {
        if (queryParams.campaign) {
            this.set('signUpCampaign', queryParams.campaign);
            const matches = queryParams.campaign.match(/^(.*)-(.*)$/);
            if (matches) {
                const [, provider, type] = matches;
                if (provider === 'osf') {
                    switch (type) {
                    case 'preprints':
                        this.set('isOsfPreprints', true);
                        break;
                    case 'registries':
                        this.set('isOsfRegistries', true);
                        break;
                    default:
                    }
                } else {
                    this.set('hasProvider', true);
                    taskFor(this.getProvider).perform(provider);
                }
            }
        }
    }
}
