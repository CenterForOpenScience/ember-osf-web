import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import { waitFor } from '@ember/test-waiters';
import { all, restartableTask } from 'ember-concurrency';
import { taskFor } from 'ember-concurrency-ts';
import config from 'ember-get-config';
import moment from 'moment';

import Identifier from 'ember-osf-web/models/identifier';
import LicenseModel from 'ember-osf-web/models/license';
import Registration from 'ember-osf-web/models/registration';
import GuidRoute, { GuidRouteModel } from 'ember-osf-web/resolve-guid/guid-route';
import Analytics from 'ember-osf-web/services/analytics';
import CurrentUser from 'ember-osf-web/services/current-user';
import MetaTags, { HeadTagDef } from 'ember-osf-web/services/meta-tags';
import Ready from 'ember-osf-web/services/ready';
import { notFoundURL } from 'ember-osf-web/utils/clean-url';
import pathJoin from 'ember-osf-web/utils/path-join';
import { SparseModel } from 'ember-osf-web/utils/sparse-fieldsets';
import ScriptTags from 'ember-osf-web/services/script-tags';
import captureException from 'ember-osf-web/utils/capture-exception';
import Intl from 'ember-intl/services/intl';

export default class Overview extends GuidRoute {
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;
    @service router!: RouterService;
    @service metaTags!: MetaTags;
    @service scriptTags!: ScriptTags;
    @service ready!: Ready;
    @service intl!: Intl;

    headTags?: HeadTagDef[];

    @restartableTask({ cancelOn: 'deactivate' })
    @waitFor
    async setHeadTags(model: GuidRouteModel<Registration>) {
        const blocker = this.ready.getBlocker();
        const registration = await model.taskInstance;

        if (registration) {
            const [
                contributors = [],
                institutions = [],
                license = null,
                identifiers = [],
                provider = null,
            ] = await all([
                registration.sparseLoadAll(
                    'bibliographicContributors',
                    { contributor: ['users', 'index'], user: ['fullName'] },
                ),
                registration.sparseLoadAll(
                    'affiliatedInstitutions',
                    { institution: ['name'] },
                ),
                registration.license,
                registration.identifiers,
                registration.provider,
            ]);

            const id = registration.id;
            const doi = (identifiers as Identifier[]).find(identifier => identifier.category === 'doi');
            const image = 'engines-dist/registries/assets/img/osf-sharing.png';

            const metaTagsData = {
                title: registration.title,
                description: registration.description,
                publishedDate: moment(registration.dateRegistered).format('YYYY-MM-DD'),
                modifiedDate: moment(registration.dateModified).format('YYYY-MM-DD'),
                identifier: registration.id,
                url: pathJoin(config.OSF.url, registration.id),
                doi: doi && doi.value,
                image,
                keywords: registration.tags,
                siteName: 'OSF',
                license: license && (license as LicenseModel).name,
                author: (contributors as SparseModel[]).map(
                    contrib => (contrib.users as { fullName: string }).fullName,
                ),
                institution: (institutions as SparseModel[]).map(institution => institution.name as string),
            };

            let jsonLD: object = {};
            let scriptTag: HeadTagDef[] = [];
            try {
                jsonLD = await this.scriptTags.returnStructuredData(id);
                const jsonString: string = Object.entries(jsonLD) ?
                    JSON.stringify(jsonLD) : JSON.stringify({ isAccessibleForFree : true });
                const scriptTagData = {
                    type: 'application/ld+json',
                    content: jsonString,
                };
                scriptTag = await this.scriptTags.getHeadTags(scriptTagData);
            } catch (e) {
                const errorMessage = this.intl.t('general.structured_data.json_ld_retrieval_error');
                captureException(e, { errorMessage });
            }

            const metaTags: HeadTagDef[] = this.metaTags.getHeadTags(metaTagsData);
            const allTags: HeadTagDef[] = metaTags.concat(scriptTag);

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
        }
        blocker.done();
    }

    modelName(): 'registration' {
        return 'registration';
    }

    include() {
        return ['registration_schema', 'bibliographic_contributors', 'identifiers', 'root', 'provider',
            'schema_responses', 'files'];
    }

    adapterOptions() {
        return {
            query: {
                related_counts: 'forks,comments,linked_nodes,linked_registrations,children,wikis',
            },
        };
    }

    afterModel(model: GuidRouteModel<Registration>) {
        // Do not return model.taskInstance
        // as it would block rendering until model.taskInstance resolves and `setHeadTags` task terminates.
        if (!this.currentUser.viewOnlyToken) {
            taskFor(this.setHeadTags).perform(model);
        }
    }

    @action
    error() {
        this.replaceWith('page-not-found', notFoundURL(this.router.currentURL));
    }
}
