import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';
import Theme from 'ember-osf-web/services/theme';

/**
 * Loads all disciplines and preprint providers to the index page
 * @class Index Route Handler
 */
export default class Preprints extends Route {
    @service store!: Store;
    @service theme!: Theme;
    @service router!: RouterService;
    livedata = 'livedata';

    async model(args: any) {
        try {
            const provider = await this.store.findRecord('preprint-provider', args.provider_id);
            this.theme.set('providerType', 'preprint');
            this.theme.set('id', args.provider_id);

            const taxonomies = await this.theme.provider?.queryHasMany('highlightedSubjects', {
                page: {
                    size: 20,
                },
            });

            return {
                provider,
                taxonomies,
            };
        } catch (e) {
            this.router.transitionTo('not-found', 'preprints');
            return null;
        }
    }
}
