import { action, computed } from '@ember-decorators/object';
import { alias, equal, not } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import RouterService from '@ember/routing/router-service';

import DraftRegistration from 'ember-osf-web/models/draft-registration';
import Registration from 'ember-osf-web/models/registration';
import { getPageParam } from 'ember-osf-web/utils/page-param';

import { DraftRouteModel } from './route';

export default class RegistriesDrat extends Controller {
    @service router!: RouterService;

    model!: DraftRouteModel;

    @alias('model.taskInstance.value') draftRegistration?: DraftRegistration;
    @alias('model.pageIndex') pageIndex!: number;
    @alias('model.page') page!: string;
    @equal('page', 'review') inReview!: boolean;

    @alias('draftRegistration.id') draftId!: string;

    @not('draftRegistration') loading!: boolean;

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
            this.transitionToRoute('drafts.draft', this.draftId, pageSlug);
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
