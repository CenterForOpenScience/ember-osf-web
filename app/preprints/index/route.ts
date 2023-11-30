import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import Theme from 'ember-osf-web/services/theme';
import captureException from 'ember-osf-web/utils/capture-exception';

/**
 * Loads all disciplines and preprint providers to the index page
 * @class Index Route Handler
 */
export default class Preprints extends Route {
    @service store!: Store;
    @service theme!: Theme;
    @service router!: RouterService;

    async model(params: { provider_id : string }) {
        const provider_id = params.provider_id ? params.provider_id : 'osf';
        let provider;
        try {
            provider = await this.store.findRecord('preprint-provider', provider_id, {
                include: 'brand',
            });
        } catch (error) {
            if (params.provider_id) {
                this.router.transitionTo('resolve-guid', params.provider_id);
                return null;
            } else {
                this.router.transitionTo('not-found', 'preprints');
                return null;
            }
        }

        this.theme.set('providerType', 'preprint');
        this.theme.set('id', provider_id);

        try {
            const taxonomies = await this.theme.provider?.queryHasMany('highlightedSubjects', {
                page: {
                    size: 20,
                },
            });

            let brandedProviders = [];

            if (this.theme.id === 'osf') {
                const allProviders = await this.store.findAll('preprint-provider', { reload: true });
                brandedProviders = allProviders.filter(item => item.id !== 'osf');
            }

            return {
                provider,
                taxonomies,
                brandedProviders,
                brand: provider.brand.content,
            };
        } catch (error) {
            captureException(error);
            this.router.transitionTo('not-found', 'preprints');
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
