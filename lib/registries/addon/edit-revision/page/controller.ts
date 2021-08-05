import Controller from '@ember/controller';
import { action } from '@ember/object';
import { alias } from '@ember/object/computed';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

import DraftRegistrationModel from 'ember-osf-web/models/draft-registration';
import { getPageParam } from 'ember-osf-web/utils/page-param';
import NavigationManager from 'registries/drafts/draft/navigation-manager';
import RevisionManager from 'registries/edit-revision/revision-manager';
import { RevisionPageRouteModel } from './route';

export default class RegistriesDraftPage extends Controller {
    @service router!: RouterService;

    model!: RevisionPageRouteModel;

    @alias('model.revisionManager') revisionManager!: RevisionManager;
    @alias('model.navigationManager') navigationManager!: NavigationManager;
    @alias('revisionManager.revision') revision!: DraftRegistrationModel;
    @alias('model.pageIndex') pageIndex!: number;
    @alias('model.page') page!: string;

    @action
    updateRoute(headingText: string, page: string, draftId: string, pageIndex: number) {
        const shouldAppendPageSlug = /^\d+-?$/.test(page);
        if (page && shouldAppendPageSlug) {
            const pageSlug = getPageParam(pageIndex, headingText);
            this.replaceRoute('edit-revision.page', draftId, pageSlug);
        }
        this.revisionManager.onPageChange(pageIndex);
    }

    @action
    onPageNotFound() {
        this.replaceRoute('page-not-found', this.router.currentURL.slice(1));
    }

    @action
    checkRouteParams(_: HTMLElement, [page]: [string]) {
        const { currentPageManager } = this.navigationManager;
        if (currentPageManager) {
            const { pageHeadingText } = currentPageManager;
            this.updateRoute(pageHeadingText!, page, this.revision.id, this.pageIndex!);
        } else {
            this.onPageNotFound();
        }
    }
}
