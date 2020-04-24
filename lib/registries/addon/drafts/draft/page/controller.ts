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

    @alias('draftRegistrationManager.node') node!: NodeModel;

    @alias('draftRegistrationManager.draftRegistration') draftRegistration!: DraftRegistrationModel;

    @alias('model.pageIndex') pageIndex!: number;

    @alias('model.page') page!: string;

    @action
    updateRoute(headingText: string, page: string, draftId: string, pageIndex: number) {
        const shouldAppendPageSlug = /^\d+-?$/.test(page);
        if (page && shouldAppendPageSlug) {
            const pageSlug = getPageParam(pageIndex, headingText);
            this.replaceRoute('drafts.draft.page', draftId, pageSlug);
        }
        this.draftRegistrationManager.onPageChange(pageIndex);
        this.draftRegistrationManager.metadataChangeset.validate();
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
            this.updateRoute(pageHeadingText!, page, this.draftRegistration.id, this.pageIndex!);
        } else {
            this.onPageNotFound();
        }
    }
}
