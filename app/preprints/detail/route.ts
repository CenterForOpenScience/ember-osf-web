import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import Theme from 'ember-osf-web/services/theme';
import captureException from 'ember-osf-web/utils/capture-exception';

// Error handling for API
/*
const handlers = new Map([
    // format: ['Message detail', 'page']
    ['Authentication credentials were not provided.', 'page-not-found'], // 401
    ['You do not have permission to perform this action.', 'page-not-found'], // 403
    ['Not found.', 'page-not-found'], // 404
    ['The requested node is no longer available.', 'resource-deleted'], // 410
]);
*/

/**
 * @module ember-preprints
 * @submodule routes
 */

/**
 * @class Content Route Handler
 */


/**
 * Loads all disciplines and preprint providers to the index page
 * @class Index Route Handler
 */
export default class PreprintsDetail extends Route {
    @service store!: Store;
    @service theme!: Theme;
    @service router!: RouterService;

    async model(params: { guid : string }) {
        try {
            const guid = params.guid;

            // eslint-disable-next-line max-len
            const preprint = await this.store.findRecord('preprint', guid, {include: ['bibliographicContributors'] });

            const provider = await preprint?.get('provider');

            const primaryFile = await preprint?.get('primaryFile');

            this.theme.set('providerType', 'preprint');
            this.theme.set('id', provider.id);

            const contributors = await preprint?.queryHasMany('contributors');

            const license = await preprint?.get('license');

            const node = await preprint?.get('node');

            const subjects = await preprint?.queryHasMany('subjects');

            return {
                preprint,
                brand: provider.brand.content,
                contributors,
                provider,
                primaryFile,
                license,
                subjects,
                node,
            };

        } catch (error) {
            captureException(error);
            this.router.transitionTo('not-found', 'preprints');
            return null;
        }
    }
}
