import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import config from 'ember-get-config';
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

export default class Register extends Controller.extend(registerQueryParams.Mixin, {
    getProvider: task(function *(this: Register, preprintProviderId: string) {
        const provider: PreprintProvider = yield this.store.findRecord('preprint-provider', preprintProviderId);
        if (provider) {
            this.set('provider', provider);
        }
    }),
}) {
    @service analytics!: Analytics;

    signUpCampaign?: string;

    hasProvider: boolean = false;
    provider?: PreprintProvider;

    isOsfPreprints: boolean = false;
    isOsfRegistries: boolean = false;

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

    setup({ queryParams }: { queryParams: RegisterQueryParams }) {
        if (queryParams.campaign) {
            const matches = queryParams.campaign.match(/^(.*)-(.*)$/);
            if (matches && matches.length > 2) {
                this.set('signUpCampaign', queryParams.campaign);
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
                    this.getProvider.perform(provider);
                }
            }
        }
    }
}
