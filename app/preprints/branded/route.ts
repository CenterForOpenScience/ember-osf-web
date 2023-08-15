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
    templateName = 'index';

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
            return null;
        }

        /*
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
                    }).filter((item: any) => {
                        console.log('item', item);
                        return item.id !== 'osf';
                    }),
        };
        */
    }
}
