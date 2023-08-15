import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import Theme from 'ember-osf-web/services/theme';
/**
 * @module ember-preprints
 * @submodule routes
 */

/**
 * Loads all disciplines and preprint providers to the index page
 * @class Index Route Handler
 */
export default class Preprints extends Route {
    @service store!: Store;
    @service theme!: Theme;
    livedata = 'livedata';


    async model() {
        return {
            taxonomies: await this.theme.provider?.queryHasMany('highlightedSubjects', {
                page: {
                    size: 20,
                },
            }),
            brandedProviders: this.theme.isProvider
                ? []
                : await this.store
                    .findAll('preprint-provider', {
                        reload: true,
                    }).filter(item => item.id !== 'osf'),
        };
    }
}
