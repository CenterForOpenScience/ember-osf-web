import Controller from '@ember/controller';
import { action } from '@ember/object';
import { alias } from '@ember/object/computed';
import RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';

import DraftRegistrationModel from 'ember-osf-web/models/draft-registration';
import NodeModel from 'ember-osf-web/models/node';
import { getPageParam } from 'ember-osf-web/utils/page-param';
import DraftRegistrationManager from 'registries/drafts/draft/draft-registration-manager';
import NavigationManager from 'registries/drafts/draft/navigation-manager';
import { DraftPageRouteModel } from './route';

export default class RegistriesDraftPage extends Controller {
    @service router!: RouterService;

    model!: DraftPageRouteModel;

    @alias('model.draftRegistrationManager') draftRegistrationManager!: DraftRegistrationManager;
    @alias('model.navigationManager') navigationManager!: NavigationManager;
    @alias('model.taskInstance.value.node') node!: NodeModel;
    @alias('model.taskInstance.value.draftRegistration') draftRegistration!: DraftRegistrationModel;
    @alias('model.pageIndex') pageIndex!: number;
    @alias('model.page') page!: string;

    @action
    updateRoute(headingText: string, page: string, draftId: string, pageIndex: number) {
        const regex = /^\d+-?$/;
        const shouldAppendPageSlug = regex.test(page);
        if (page && shouldAppendPageSlug) {
            const pageSlug = getPageParam(pageIndex, headingText);
            this.replaceRoute('drafts.draft.page', draftId, pageSlug);
        }
        this.draftRegistrationManager.onPageChange(pageIndex);
    }

    @action
    onPageNotFound() {
        this.replaceRoute('page-not-found', this.router.currentURL.slice(1));
    }

    @action
    checkRouteParams(_: HTMLElement, [page, pageIndex]: [string, number, string]) {
        const { currentPageManager } = this.navigationManager;
        if (currentPageManager) {
            const { pageHeadingText } = currentPageManager;
            this.updateRoute(pageHeadingText!, page, this.draftRegistration.id, pageIndex!);
        } else {
            this.onPageNotFound();
        }
    }
}
