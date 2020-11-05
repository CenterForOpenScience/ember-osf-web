import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { tracked } from '@glimmer/tracking';
import config from 'ember-get-config';

import Registration from 'ember-osf-web/models/registration';
import { GuidRouteModel } from 'ember-osf-web/resolve-guid/guid-route';
import pathJoin from 'ember-osf-web/utils/path-join';

const {
    support: {
        supportEmail,
    },
} = config;

const { OSF: { url: baseURL } } = config;

export default class Overview extends Controller {
    model!: GuidRouteModel<Registration>;

    queryParams = ['viewMode'];
    supportEmail = supportEmail;

    @tracked viewMode: string = '';

    @alias('model.taskInstance.value') registration?: Registration;

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
}
