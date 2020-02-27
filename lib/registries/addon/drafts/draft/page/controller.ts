import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import { alias, equal, not } from '@ember/object/computed';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

import DraftRegistration from 'ember-osf-web/models/draft-registration';
import Registration from 'ember-osf-web/models/registration';
import { getPageParam } from 'ember-osf-web/utils/page-param';
import Media from 'ember-responsive';

import NodeModel from 'ember-osf-web/models/node';
import { DraftPageRouteModel } from './route';

export default class RegistriesDrat extends Controller {
    @service media!: Media;
    @service router!: RouterService;

    model!: DraftPageRouteModel;

    @alias('model.taskInstance.value.draftRegistration') draftRegistration?: DraftRegistration;
    @alias('model.taskInstance.value.node') node?: NodeModel;
    @alias('model.pageIndex') pageIndex!: number;
    @alias('model.page') page!: string;
    @equal('page', 'review') inReview!: boolean;

    @alias('draftRegistration.id') draftId!: string;

    @not('draftRegistration') loading!: boolean;
    @not('media.isDesktop') showMobileView!: boolean;

    @computed('page')
    get shouldAppendPageSlug() {
        // Only update current route if it has a pageIndex but no page slug
        const regex = /^\d+-?$/;
        return regex.test(this.page);
    }

    @action
    updateRoute(headingText: string) {
        if (this.page && this.shouldAppendPageSlug) {
            const pageSlug = getPageParam(this.pageIndex, headingText);
            this.replaceRoute('drafts.draft.page', this.draftId, pageSlug);
        }
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
