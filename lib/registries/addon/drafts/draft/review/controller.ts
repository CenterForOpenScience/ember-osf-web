import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import { alias, not } from '@ember/object/computed';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

import DraftRegistration from 'ember-osf-web/models/draft-registration';
import Registration from 'ember-osf-web/models/registration';
import Media from 'ember-responsive';

import NodeModel from 'ember-osf-web/models/node';
import { PageManager } from 'ember-osf-web/packages/registration-schema';
import { getPrevPageParam } from 'ember-osf-web/utils/page-param';
import { DraftRegistrationManager } from 'registries/drafts/draft/draft-registration-manager';
import { DraftReviewModel } from './route';

export default class RegistriesDrat extends Controller {
    @service media!: Media;
    @service router!: RouterService;

    model!: DraftReviewModel;

    @alias('model.draftRegistrationManager') draftRegistrationManager?: DraftRegistrationManager;
    @alias('draftRegistrationManager.pageManagers') pageManagers?: PageManager[];
    @alias('model.taskInstance.value.draftRegistration') draftRegistration?: DraftRegistration;
    @alias('model.taskInstance.value.node') node?: NodeModel;

    @alias('draftRegistration.id') draftId!: string;

    @not('draftRegistration') loading!: boolean;
    @not('media.isDesktop') showMobileView!: boolean;

    @computed('pageManagers.[]')
    get lastPageParam() {
        const { pageManagers } = this;
        if (pageManagers) {
            const lastPage = pageManagers.length;
            const lastPageIndex = lastPage - 1;

            const { pageHeadingText } = pageManagers[lastPageIndex];
            return getPrevPageParam(lastPage, pageHeadingText!);
        }
        return '';
    }

    @action
    onSubmitRedirect(registrationId: Registration) {
        this.transitionToRoute('overview.index', registrationId);
    }

    @action
    onPageNotFound() {
        this.transitionToRoute('page-not-found', this.router.currentURL.slice(1));
    }
}
