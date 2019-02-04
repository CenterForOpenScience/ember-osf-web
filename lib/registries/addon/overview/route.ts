import { action } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import RouterService from '@ember/routing/router-service';
import { task } from 'ember-concurrency';
import config from 'ember-get-config';
import moment from 'moment';

import Contributor from 'ember-osf-web/models/contributor';
import Institution from 'ember-osf-web/models/institution';
import Registration from 'ember-osf-web/models/registration';
import GuidRoute, { GuidRouteModel } from 'ember-osf-web/resolve-guid/guid-route';
import Analytics from 'ember-osf-web/services/analytics';
import MetaTags, { HeadTagDef } from 'ember-osf-web/services/meta-tags';
import Ready from 'ember-osf-web/services/ready';
import pathJoin from 'ember-osf-web/utils/path-join';

const { assetsPrefix } = config;

export default class Overview extends GuidRoute {
    @service analytics!: Analytics;
    @service router!: RouterService;
    @service metaTags!: MetaTags;
    @service ready!: Ready;

    headTags?: HeadTagDef[];

    setHeadTags = task(function *(this: Overview, model: any) {
        const blocker = this.ready.getBlocker();

        const registration = yield model.taskInstance as Registration;

        if (registration) {
            const contributors = yield registration.loadAll('contributors');
            const institutions = yield registration.loadAll('affiliatedInstitutions');
            const license = yield registration.license;

            const image = `${assetsPrefix}engines-dist/registries/assets/img/osf-sharing.png`;

            const metaTagsData = {
                title: registration.title,
                description: registration.description,
                publishedDate: moment(registration.dateRegistered).format('YYYY-MM-DD'),
                modifiedDate: moment(registration.dateModified).format('YYYY-MM-DD'),
                identifier: registration.id,
                url: pathJoin(config.OSF.url, registration.id),
                image,
                keywords: registration.tags,
                siteName: 'OSF',
                license: license && license.name,
                author: contributors.map((contrib: Contributor) => contrib.users.get('fullName')),
                institution: institutions.map((ins: Institution) => ins.get('name')),
            };

            this.set('headTags', this.metaTags.getHeadTags(metaTagsData));
            this.metaTags.updateHeadTags();
        }

        blocker.done();
    });

    modelName(): 'registration' {
        return 'registration';
    }

    include() {
        return ['registration_schema', 'contributors', 'identifiers', 'root'];
    }

    adapterOptions() {
        return {
            query: {
                related_counts: 'forks,comments,linked_nodes,linked_registrations,children',
            },
        };
    }

    afterModel(this: Overview, model: GuidRouteModel<Registration>) {
        // Do not return model.taskInstance
        // as it would block rendering until model.taskInstance resolves and `setHeadTags` task terminates.
        this.get('setHeadTags').perform(model);
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
        this.replaceWith('page-not-found', this.router.currentURL.slice(1));
    }
}
