import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
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

    async model() {
        try {
            const provider = await this.store.findRecord('preprint-provider', 'osf');
            this.theme.set('providerType', 'preprint');
            this.theme.set('id', 'osf');

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
