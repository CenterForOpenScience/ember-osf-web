import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import config from 'ember-osf-web/config/environment';

import PreprintProviderModel from 'ember-osf-web/models/preprint-provider';
import MetaTags, { HeadTagDef } from 'ember-osf-web/services/meta-tags';
import Theme from 'ember-osf-web/services/theme';

export default class PreprintDiscoverRoute extends Route {
    @service store!: Store;
    @service theme!: Theme;
    @service router!: RouterService;
    @service metaTags!: MetaTags;
    headTags?: HeadTagDef[];

    buildRouteInfoMetadata() {
        return {
            osfMetrics: {
                isSearch: true,
                providerId: this.theme.id,
            },
        };
    }

    async model(args: any) {
        try {
            if (!args.provider_id || args.provider_id === config.defaultProvider) {
                this.router.transitionTo('search', { queryParams: { resourceType: 'Preprint' } });
                return null;
            }
            const provider = await this.store.findRecord('preprint-provider', args.provider_id);
            this.theme.providerType = 'preprint';
            this.theme.id = args.provider_id;
            return provider;
        } catch (e) {
            this.router.transitionTo('not-found', `preprints/${args.provider_id}/discover`);
            return null;
        }
    }

    afterModel(model: PreprintProviderModel) {
        if (model && model.assets && model.assets.favicon) {
            const headTags = [{
                type: 'link',
                attrs: {
                    rel: 'icon',
                    href: model.assets.favicon,
                },
            }];
            this.set('headTags', headTags);
        }
    }
}
