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
        try {
            const provider_id = params.provider_id ? params.provider_id : 'osf';

            const provider = await this.store.findRecord('preprint-provider', provider_id, {
                include: 'brand',
            });
            this.theme.set('providerType', 'preprint');
            this.theme.set('id', provider_id);

            const taxonomies = await this.theme.provider?.queryHasMany('highlightedSubjects', {
                page: {
                    size: 20,
                },
            });

            const brandedProviders = this.theme.id === 'osf' ? await this.store
                .findAll('preprint-provider', { reload: true })
                .then(result => result
                    .filter(item => item.id !== 'osf')) : [];

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
}
