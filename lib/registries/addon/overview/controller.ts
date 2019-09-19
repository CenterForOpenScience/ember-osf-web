import { computed } from '@ember-decorators/object';
import { alias, not } from '@ember-decorators/object/computed';
import Controller from '@ember/controller';
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

    supportEmail = supportEmail;

    @alias('model.taskInstance.value') registration?: Registration;
    @not('registration') loading!: boolean;

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

    @computed('registration.{}')
    get shouldHideGutters() {
        if (!this.registration) {
            return undefined;
        }
        return this.registration.withdrawn || this.registration.archiving;
    }
}
