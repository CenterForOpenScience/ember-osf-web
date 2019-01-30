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

enum RegistrationState {
    EMBARGOED = 'embargoed',
    PUBLIC = 'public',
    WITHDRAWN = 'withdrawn',
    PENDING_REGISTRATION = 'pendingRegistrationApproval',
    PENDING_WITHDRAWAL = 'pendingWithdrawal',
    PENDING_EMBARGO = 'pendingEmbargoApproval',
    PENDING_EMBARGO_TERMINATION = 'pendingEmbargoTerminationApproval',
}

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
    @not('media.isDesktop') showMobileView!: boolean;
    @not('registration') loading!: boolean;
    @alias('registration.userHasAdminPermission') isAdmin!: boolean;

    @computed('registration.id')
    get registrationURL() {
        return this.registration && pathJoin(baseURL, `${this.registration.id}`);
    }

    /* eslint-disable max-len */
    @computed('registration.{withdrawn,embargoed,public,pendingRegistrationApproval,pendingEmbargoApproval,pendingEmbargoTerminationApproval,pendingWithdrawal}')
    get currentState() {
        if (!this.registration) {
            return;
        }

        return (
            (this.registration.pendingRegistrationApproval && RegistrationState.PENDING_REGISTRATION) ||
            (this.registration.pendingEmbargoApproval && RegistrationState.PENDING_EMBARGO) ||
            (this.registration.pendingEmbargoTerminationApproval && RegistrationState.PENDING_EMBARGO_TERMINATION) ||
            (this.registration.pendingWithdrawal && RegistrationState.PENDING_WITHDRAWAL) ||
            (this.registration.withdrawn && RegistrationState.WITHDRAWN) ||
            (this.registration.embargoed && RegistrationState.EMBARGOED) ||
            RegistrationState.PUBLIC
        );
    }
    /* eslint-enable max-len */

    @computed('media.isDesktop', 'registration.withdrawn')
    get showMobileNav() {
        return !this.media.isDesktop && this.registration && !this.registration.withdrawn;
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
