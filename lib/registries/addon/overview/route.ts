import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import RouterService from '@ember/routing/router-service';
import { all, task } from 'ember-concurrency';
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

export default class Overview extends GuidRoute {
    @service analytics!: Analytics;
    @service currentUser!: CurrentUser;
    @service router!: RouterService;
    @service metaTags!: MetaTags;
    @service ready!: Ready;

    headTags?: HeadTagDef[];

    setHeadTags = task(function *(this: Overview, model: any) {
        const blocker = this.ready.getBlocker();

        const registration: Registration = yield model.taskInstance;

        if (registration) {
            const [
                contributors = [],
                institutions = [],
                license = null,
                identifiers = [],
            ] = yield all([
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
            ]);

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

            this.set('headTags', this.metaTags.getHeadTags(metaTagsData));
            this.metaTags.updateHeadTags();
        }

        blocker.done();
    }).cancelOn('deactivate').restartable();

    modelName(): 'registration' {
        return 'registration';
    }

    include() {
        return ['registration_schema', 'bibliographic_contributors', 'identifiers', 'root'];
    }

    adapterOptions() {
        return {
            query: {
                related_counts: 'forks,comments,linked_nodes,linked_registrations,children,wikis',
            },
        };
    }

    afterModel(this: Overview, model: GuidRouteModel<Registration>) {
        // Do not return model.taskInstance
        // as it would block rendering until model.taskInstance resolves and `setHeadTags` task terminates.
        if (!this.currentUser.viewOnlyToken) {
            this.get('setHeadTags').perform(model);
        }
    }

    @action
    async didTransition() {
        const { taskInstance } = this.controller.model as GuidRouteModel<Registration>;
        await taskInstance;
        const registration = taskInstance.value;
        this.analytics.trackPage(registration ? registration.public : undefined, 'registrations');
    }

    @action
    error() {
        this.replaceWith('page-not-found', notFoundURL(this.router.currentURL));
    }
}
