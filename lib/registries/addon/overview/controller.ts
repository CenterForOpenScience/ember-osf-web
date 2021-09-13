import Store from '@ember-data/store';
import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import config from 'ember-get-config';

import Registration from 'ember-osf-web/models/registration';
import RevisionModel from 'ember-osf-web/models/revision';
import { GuidRouteModel } from 'ember-osf-web/resolve-guid/guid-route';
import pathJoin from 'ember-osf-web/utils/path-join';

import Intl from 'ember-intl/services/intl';

const {
    support: {
        supportEmail,
    },
} = config;

const { OSF: { url: baseURL } } = config;

export default class Overview extends Controller {
    @service store!: Store;
    @service intl!: Intl;
    model!: GuidRouteModel<Registration>;
    revisionModel!: GuidRouteModel<RevisionModel>;

    queryParams = ['mode', 'revisionId'];
    supportEmail = supportEmail;

    @tracked mode = '';
    @tracked revisionId = '';

    @alias('model.taskInstance.value') registration?: Registration;
    @alias('registration.revisions') revisions?: RevisionModel[];

    @computed('revisions.lastObject.id')
    get latestRevisionId() {
        return this.revisions?.lastObject?.id;
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

    // Versioning
    get isViewingLatestRevision() {
        return this.revisionId === this.latestRevisionId;
    }
}

