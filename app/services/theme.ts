import { computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import { assert } from '@ember/debug';
import Service from '@ember/service';
import DS from 'ember-data';
import config from 'ember-get-config';
import Provider from 'ember-osf-web/models/provider';
import defaultTo from 'ember-osf-web/utils/default-to';

const { defaultProvider, assetsPrefix } = config;

type ProviderType = 'collection' | 'preprint' | 'registry';

interface Setting {
    assetPath: string;
    routePath: string;
    model: 'collection-provider' | 'preprint-provider' | 'registry-provider';
}

const settings: { [P in ProviderType]: Setting } = {
    collection: {
        assetPath: 'collections-assets',
        routePath: 'collections',
        model: 'collection-provider',
    },
    preprint: {
        assetPath: 'preprints-assets',
        routePath: 'preprints',
        model: 'preprint-provider',
    },
    registry: {
        assetPath: 'registries-assets',
        routePath: 'registries',
        model: 'registry-provider',
    },
};

export default class Theme extends Service {
    @service store!: DS.Store;

    id: string = defaultTo(this.id, defaultProvider);
    defaultProvider = defaultProvider;

    providerType?: ProviderType;

    // If we're using a provider domain
    isDomain = window.isProviderDomain;

    // If we're using a branded provider
    @computed('id')
    get isProvider() {
        return this.id !== defaultProvider;
    }

    @computed('providerType')
    get settings() {
        return settings[this.providerType!];
    }

    @computed('id', 'settings', 'isProvider')
    get provider(): Provider | null {
        if (!this.providerType) {
            return null;
        }

        const { model, routePath } = this.settings;
        const provider = this.store.peekRecord(model, this.id);

        if (!provider) {
            return null;
        }

        // Check if redirect is enabled for the current provider
        if (!window.isProviderDomain && this.isProvider && provider.domainRedirectEnabled) {
            const { href, origin } = window.location;
            const url = href.replace(new RegExp(`^${origin}/${routePath}/${this.id}/?`), provider.domain);

            window.location.replace(url);
        }

        return provider;
    }

    // If we're using a branded provider and not under a branded domain (e.g. /collections/<provider>)
    @computed('isProvider', 'isDomain')
    get isSubRoute(): boolean {
        return this.isProvider && !this.isDomain;
    }

    @computed('isProvider', 'isDomain', 'id', 'settings')
    get pathPrefix(): string {
        let pathPrefix = '/';

        if (!this.isDomain) {
            pathPrefix += `${this.settings.routePath}/`;

            if (this.isProvider) {
                pathPrefix += `${this.id}/`;
            }
        }

        return pathPrefix;
    }

    @computed('id', 'settings')
    get assetsDir(): string {
        return `${assetsPrefix}assets/osf-assets/files/${this.settings.assetPath}/${this.id}`;
    }

    @computed('provider.assets.style', 'assetsDir')
    get stylesheet(): string {
        const { assets } = this.provider!;

        return assets && assets.style ? assets.style : `${this.assetsDir}/style.css`;
    }

    reset(this: Theme) {
        this.setProperties({
            id: defaultProvider,
            providerType: undefined,
        });
    }

    prefixRoute(route: string): string {
        assert('Route should not start with "provider"', !/^(provider)?\./.test(route));

        return this.isSubRoute ? `provider.${route}` : route;
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
