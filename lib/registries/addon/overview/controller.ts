/* eslint-disable no-console */
import Store from '@ember-data/store';
import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import config from 'ember-get-config';

import Registration from 'ember-osf-web/models/registration';
import { GuidRouteModel } from 'ember-osf-web/resolve-guid/guid-route';
import { QueryHasManyResult } from 'ember-osf-web/models/osf-model';
import pathJoin from 'ember-osf-web/utils/path-join';

import Intl from 'ember-intl/services/intl';
import RouterService from '@ember/routing/router-service';
import Features from 'ember-feature-flags';
import ResourceModel from 'ember-osf-web/models/resource';
import { task } from 'ember-concurrency';
import { waitFor } from '@ember/test-waiters';
import { taskFor } from 'ember-concurrency-ts';

const {
    support: {
        supportEmail,
    },
    featureFlagNames: {
        registrationFilesPage,
    },
    OSF: {
        cookies: {
            outputFeaturePopover,
        },
    },
} = config;

const { OSF: { url: baseURL } } = config;

export default class Overview extends Controller {
    @service store!: Store;
    @service intl!: Intl;
    @service router!: RouterService;
    @service features!: Features;
    model!: GuidRouteModel<Registration>;

    queryParams = ['mode', 'revisionId'];
    supportEmail = supportEmail;
    outputFeaturePopoverCookie = outputFeaturePopover;

    @tracked mode = '';
    @tracked revisionId = '';

    @alias('model.taskInstance.value') registration?: Registration;

    resources?: QueryHasManyResult<ResourceModel>;

    constructor(...args: any[]) {
        super(...args);
        taskFor(this.getResources).perform();
        console.log('resources are ', this.resources);
    }

    get registrationFilesPageEnabled() {
        return this.features.isEnabled(registrationFilesPage);
    }

    get showMetadata() {
        if (this.router.currentRouteName.includes('registries.overview.files')) {
            return false;
        }
        return true;
    }

    get onFilesRoute() {
        return this.router.currentRouteName.includes('registries.overview.files');
    }

    @computed('registration.{reviewsState,archiving}')
    get showTombstone() {
        return this.registration && (this.registration.reviewsState === 'withdrawn' || this.registration.archiving);
    }

    @computed('registration.id')
    get registrationURL() {
        return this.registration && pathJoin(baseURL, `${this.registration.id}`);
    }

    @computed('registration.relatedCounts.comments')
    get commentsCount() {
        return (this.registration && this.registration.relatedCounts!.comments) || 0;
    }

    @computed('registration.relatedCounts.{linkedNodes,linkedRegistrations}')
    get linksCount() {
        if (!this.registration) {
            return 0;
        }
        return (this.registration.relatedCounts.linkedNodes || 0)
        + (this.registration.relatedCounts.linkedRegistrations || 0);
    }

    @computed('registration.resources')
    get resourceBadges() {
        if (!this.registration) {
            return 0;
        }
        return (this.registration && this.registration.resources) || 0;
    }

    @task
    @waitFor
    async getResources() {
        const selectedRegistration = await this.registration;

        if(!selectedRegistration) {
            return;
        }
        const resources =  await selectedRegistration.queryHasMany('resources');
        this.set('resources', resources);
        console.log('Associated resources are:', resources);
    }
}
