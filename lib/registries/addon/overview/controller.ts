import { action, computed } from '@ember-decorators/object';
import { alias, not } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import Media from 'ember-responsive';

import Registration from 'ember-osf-web/models/registration';
import { GuidRouteModel } from 'ember-osf-web/resolve-guid/guid-route';

export default class Overview extends Controller {
    @service media!: Media;
    @not('media.isDesktop') showMobileNav!: boolean;

    model!: GuidRouteModel<Registration>;

    sidenavGutterClosed = true;
    metadataGutterClosed = true;

    @alias('model.taskInstance.value') registration?: Registration;
    @not('registration') loading!: boolean;

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
