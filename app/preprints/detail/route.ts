import Store from '@ember-data/store';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { taskFor } from 'ember-concurrency-ts';
import { all, restartableTask } from 'ember-concurrency';
import moment from 'moment-timezone';

import config from 'ember-osf-web/config/environment';
import CurrentUser from 'ember-osf-web/services/current-user';
import Identifier from 'ember-osf-web/models/identifier';
import LicenseModel from 'ember-osf-web/models/license';
import { SparseModel } from 'ember-osf-web/utils/sparse-fieldsets';
import MetaTags, { HeadTagDef } from 'ember-osf-web/services/meta-tags';
import Ready from 'ember-osf-web/services/ready';
import Theme from 'ember-osf-web/services/theme';
import captureException from 'ember-osf-web/utils/capture-exception';
import pathJoin from 'ember-osf-web/utils/path-join';
import Intl from 'ember-intl/services/intl';
import PrePrintsDetailController from './controller';


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
    @service currentUser!: CurrentUser;
    @service metaTags!: MetaTags;
    @service ready!: Ready;
    @service intl!: Intl;

    headTags?: HeadTagDef[];

    async model(params: { guid : string }) {
        try {
            const guid = params.guid;

            const preprint = await this.store.findRecord('preprint', guid, {
                adapterOptions: {
                    query: {
                        'metrics[views]': 'total',
                        'metrics[downloads]': 'total',
                    },
                },
            });

            const provider = await preprint?.get('provider');

            this.theme.set('providerType', 'preprint');
            this.theme.set('id', provider.id);

            let primaryFile;

            if (!preprint.isWithdrawn) {
                primaryFile = await preprint?.get('primaryFile');
                primaryFile.versions = await primaryFile?.versions;
            }

            const contributors = await preprint?.queryHasMany('contributors');

            const license = await preprint?.get('license');

            const subjects = await preprint?.queryHasMany('subjects');
            const versions = await preprint?.queryHasMany('versions');

            return {
                preprint,
                brand: provider.brand.content,
                contributors,
                provider,
                primaryFile,
                license,
                subjects,
                versions,
            };

        } catch (error) {
            captureException(error);
            this.router.transitionTo('not-found', this.router.currentURL.slice(1));
            return null;
        }
    }

    @restartableTask({ cancelOn: 'deactivate' })
    @waitFor
    async setHeadTags(model: any) {
        const blocker = this.ready.getBlocker();
        const {preprint} = await model;

        if (preprint) {
            const [
                contributors = [],
                license = null,
                identifiers = [],
                provider = null,
            ] = await all([
                preprint.sparseLoadAll(
                    'bibliographicContributors',
                    { contributor: ['users', 'index'], user: ['fullName'] },
                ),
                preprint.license,
                preprint.identifiers,
                preprint.provider,
            ]);

            const doi = (identifiers as Identifier[]).find(identifier => identifier.category === 'doi');
            const image = 'engines-dist/registries/assets/img/osf-sharing.png';

            const preprintTitle = preprint.isWithdrawn ?
                this.intl.t('preprints.detail.withdrawn_title', { title: preprint.title }) :
                preprint.title;

            const metaTagsData = {
                title: preprintTitle,
                description: preprint.description,
                publishedDate: moment(preprint.datePublished).format('YYYY-MM-DD'),
                modifiedDate: moment(preprint.dateModified).format('YYYY-MM-DD'),
                identifier: preprint.id,
                url: pathJoin(config.OSF.url, preprint.id),
                doi: doi && doi.value,
                image,
                keywords: preprint.tags,
                siteName: 'OSF',
                license: license && (license as LicenseModel).name,
                author: (contributors as SparseModel[]).map(
                    contrib => (contrib.users as { fullName: string }).fullName,
                ),
            };

            const allTags: HeadTagDef[] = this.metaTags.getHeadTags(metaTagsData);

            if (provider && provider.assets && provider.assets.favicon) {
                allTags.push({
                    type: 'link',
                    attrs: {
                        rel: 'icon',
                        href: provider.assets.favicon,
                    },
                });
            }
            this.set('headTags', allTags);
            this.metaTags.updateHeadTags();
            (this.controller as PrePrintsDetailController).plauditIsReady = true;
        }
        blocker.done();
    }

    afterModel(model: any) {
        if (!this.currentUser.viewOnlyToken) {
            taskFor(this.setHeadTags).perform(model);
        }
    }
}
