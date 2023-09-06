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
            const preprint = await this.store.findRecord('preprint', guid, {include: 'bibliographicContributors' });

            const provider = await preprint?.get('provider');

            const primaryFile = await preprint?.get('primaryFile');

            this.theme.set('providerType', 'preprint');
            this.theme.set('id', provider.id);


            const contributors = await preprint?.queryHasMany('contributors');

            // const license = await preprint?.queryHasMany('license');

            /*
            const blank = await preprint?.queryHasMany('blank', {
                page: {
                    size: 20,
                },
            });
            */

            return {
                preprint,
                brand: provider.brand.content,
                contributors,
                provider,
                primaryFile,
            };

        } catch (error) {
            captureException(error);
            this.router.transitionTo('not-found', 'preprints');
            return null;
        }
    }
}

/*
export default Route.extend({
    features: service(),
    model(params) {
        const opts = {
            method: 'GET',
            url: `${config.OSF.apiUrl}/${config.OSF.apiNamespace}/`,
            dataType: 'json',
            contentType: 'application/json',
            xhrFields: {
                withCredentials: true,
            },
        };

        return this.store.findRecord(
            'preprint', params.preprint_id,
            {
                adapterOptions: {
                    query: {
                        'metrics[views]': 'total',
                        'metrics[downloads]': 'total',
                    },
                },
            },
        );
    },
    actions: {
        error(error) {
            // Handle API Errors
            if (error && !(error instanceof DS.AbortError)
                && error.errors && isArray(error.errors)) {
                // If  the error is not a AbortError (no connection), we handle it here.
                const { detail } = error.errors[0];
                const page = handlers.get(detail) || 'page-not-found';
                return this.intermediateTransitionTo(page);
            } else {
                // Otherwise, we bubble it to the error handler in our parent route.
                return true;
            }
        },
    },
});
*/
