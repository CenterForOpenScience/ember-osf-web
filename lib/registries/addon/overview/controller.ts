import { action, computed } from '@ember-decorators/object';
import { alias, not } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import config from 'ember-get-config';
import I18N from 'ember-i18n/services/i18n';
import Media from 'ember-responsive';

import Registration from 'ember-osf-web/models/registration';
import { GuidRouteModel } from 'ember-osf-web/resolve-guid/guid-route';
import CurrentUser from 'ember-osf-web/services/current-user';
import pathJoin from 'ember-osf-web/utils/path-join';

const {
    support: {
        supportEmail,
    },
} = config;

const { OSF: { url: baseURL } } = config;

export default class Overview extends Controller {
    @service media!: Media;
    @service currentUser!: CurrentUser;
    @service i18n!: I18N;

    model!: GuidRouteModel<Registration>;

    sidenavGutterClosed = true;
    metadataGutterClosed = true;

    supportEmail = supportEmail;

    @alias('model.taskInstance.value') registration?: Registration;
    @not('registration') loading!: boolean;
    @not('media.isDesktop') showMobileView!: boolean;

    @computed('registration.id')
    get registrationURL() {
        return this.registration && pathJoin(baseURL, `${this.registration.id}`);
    }

    @computed('media.{isMobile,isTablet,isDesktop}')
    get metadataGutterMode() {
        if (this.media.isMobile) {
            return 'page';
        }
        if (this.media.isTablet) {
            return 'drawer';
        }
        return 'column';
    }

    @computed('media.{isMobile,isTablet,isDesktop}')
    get sidenavGutterMode() {
        if (this.media.isDesktop) {
            return 'column';
        }
        return 'drawer';
    }

    @computed('registration.relatedCounts.forks')
    get forksCount(): number {
        return (this.registration && this.registration.relatedCounts!.forks) || 0;
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

    @action
    toggleSidenav() {
        this.toggleProperty('sidenavGutterClosed');
    }

    @action
    toggleMetadata() {
        this.toggleProperty('metadataGutterClosed');
    }
}
