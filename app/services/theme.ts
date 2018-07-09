import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Service from '@ember/service';
// import config from 'ember-default-config';
import DS from 'ember-data';
import Provider from 'ember-osf-web/models/provider';
import defaultTo from 'ember-osf-web/utils/default-to';

// const { defaultProvider } = config;
const defaultProvider = 'osf';

export default class Theme extends Service {
    @service store!: DS.Store;

    id: string = defaultTo(this.id, defaultProvider);

    // If we're using a provider domain
    isDomain = window.isProviderDomain;

    // If we're using a branded provider
    @computed('id')
    get isProvider() {
        return this.id !== defaultProvider;
    }

    @computed('id', 'isProvider')
    get provider(): Provider | null {
        const provider = this.store.peekRecord('collection-provider', this.id);

        if (!provider) {
            return null;
        }

        // Check if redirect is enabled for the current provider
        if (!window.isProviderDomain && this.isProvider && provider.domainRedirectEnabled) {
            const { href, origin } = window.location;
            const url = href.replace(new RegExp(`^${origin}/collections/${this.id}/?`), provider.domain);

            window.location.replace(url);
        }

        return provider;
    }

    // If we're using a branded provider and not under a branded domain (e.g. /collections/<provider>)
    @computed('isProvider', 'isDomain')
    get isSubRoute() {
        return this.isProvider && !this.isDomain;
    }

    @computed('isProvider', 'isDomain', 'id')
    get pathPrefix() {
        let pathPrefix = '/';

        if (!this.isDomain) {
            pathPrefix += 'collections/';

            if (this.isProvider) {
                pathPrefix += `${this.id}/`;
            }
        }

        return pathPrefix;
    }
}

declare global {
    interface Window {
        isProviderDomain?: boolean;
    }
}

declare module '@ember/service' {
    interface Registry {
        theme: Theme;
    }
}
