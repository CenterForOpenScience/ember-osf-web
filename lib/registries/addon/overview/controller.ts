import { action, computed } from '@ember-decorators/object';
import { not } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import { TaskInstance } from 'ember-concurrency';
import Registration from 'ember-osf-web/models/registration';
import { chainPages, hasManyIterator, memoize } from 'ember-osf-web/utils/async-iterator';
import Media from 'ember-responsive';

export default class Overview extends Controller {
    @service media!: Media;
    @not('media.isDesktop') showMobileNav!: boolean;

    // Model could be a Registration from a transition or wrapped in a task
    // from the route
    model!: Registration | { taskInstance: TaskInstance<Registration> };

    sidenavGutterClosed = true;
    metadataGutterClosed = true;

    @computed('model', 'model.taskInstance.value')
    get registration(): Registration {
        if (this.model instanceof Registration) {
            return this.model;
        }

        return this.model.taskInstance.value!;
    }

    @computed('registration')
    get loading(): boolean {
        return !this.registration;
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

    @computed('registration.relatedCounts.{linkedNodes,linkedRegistrations}')
    get linksCount() {
        return (this.registration.relatedCounts.linkedNodes || 0)
        + (this.registration.relatedCounts.linkedRegistrations || 0);
    }

    @computed('registration')
    get childGenerator() {
        return memoize(hasManyIterator(this.registration, 'children'));
    }

    @computed('registration')
    get linkGenerator() {
        return memoize(chainPages(
            hasManyIterator(this.registration, 'linkedNodes'),
            hasManyIterator(this.registration, 'linkedRegistrations'),
        ));
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
