import Controller from '@ember/controller';
import { action } from '@ember/object';
import { alias, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';

import DraftRegistration from 'ember-osf-web/models/draft-registration';
import Media from 'ember-responsive';

import { PageManager } from 'ember-osf-web/packages/registration-schema';
import DraftRegistrationManager from 'registries/drafts/draft/draft-registration-manager';

export default class RegistriesDraftReview extends Controller {
    @service media!: Media;

    @alias('model.draftRegistrationManager') draftRegistrationManager?: DraftRegistrationManager;
    @alias('draftRegistrationManager.pageManagers') pageManagers?: PageManager[];
    @alias('draftRegistrationManager.draftRegistration') draftRegistration?: DraftRegistration;

    @not('draftRegistration') loading!: boolean;
    @not('media.isDesktop') showMobileView!: boolean;

    @action
    markAndValidatedPages() {
        if (this.draftRegistrationManager) {
            this.draftRegistrationManager.markAllPagesVisited();
            this.draftRegistrationManager.validateAllVisitedPages();
            this.draftRegistrationManager.saveAllVisitedPages.perform();
        }
    }
}
