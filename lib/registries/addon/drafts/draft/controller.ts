import { action, computed } from '@ember-decorators/object';
import { alias, equal, not } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Controller from '@ember/controller';
import RouterService from '@ember/routing/router-service';

import DraftRegistration from 'ember-osf-web/models/draft-registration';
import { getPageParam } from 'ember-osf-web/utils/page-param';
import { PageState } from 'registries/components/page-link-manager/component';

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
    pageStateToClass(pageState: PageState): string {
        switch (pageState) {
        case PageState.Active:
            return 'Active';
        case PageState.Unvisited:
            return 'Unvisited';
        case PageState.Invalid:
            return 'Invalid';
        case PageState.Valid:
            return 'Valid';
        default:
            return '';
        }
    }

    @action
    pageStateToIcon(pageState: PageState): string {
        switch (pageState) {
        case PageState.Active:
            return 'circle-o';
        case PageState.Unvisited:
            return 'circle';
        case PageState.Invalid:
            return 'exclamation-circle';
        case PageState.Valid:
            return 'check-circle-o';
        default:
            return '';
        }
    }

    @action
    updateRoute(headingText: string) {
        if (this.page && this.shouldAppendPageSlug) {
            const pageSlug = getPageParam(this.pageIndex, headingText);
            this.transitionToRoute('drafts.draft', this.draftId, pageSlug);
        }
    }

    @action
    onPageNotFound() {
        this.transitionToRoute('page-not-found', this.router.currentURL.slice(1));
    }
}
