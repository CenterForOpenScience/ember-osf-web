import { computed, set } from '@ember/object';
import { alias, not } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import { PageManager } from 'ember-osf-web/packages/registration-schema';
import { getNextPageParam, getPrevPageParam } from 'ember-osf-web/utils/page-param';
import DraftRegistrationManager from 'registries/drafts/draft/draft-registration-manager';

export enum DraftRoute {
    Page = 'page',
    Review = 'review',
    Metadata = 'metadata',
}

export default class NavigationManager {
    currentPage?: number;
    draftManager!: DraftRegistrationManager;
    currentRoute!: DraftRoute;

    @alias('draftManager.pageManagers')
    pageManagers!: PageManager[];

    @not('currentRoute') initializing!: boolean;

    constructor(draftManager: DraftRegistrationManager) {
        set(this, 'draftManager', draftManager);
    }

    setCurrentRoute(routeName: DraftRoute) {
        set(this, 'currentRoute', routeName);
    }

    setCurrentPage(currentPage?: number) {
        set(this, 'currentPage', currentPage);
    }

    @computed('pageManagers.[]')
    get lastPage() {
        const { pageManagers } = this;
        return pageManagers.length - 1;
    }

    @computed('currentPage', 'currentRoute', 'lastPage')
    get currentPageIndex() {
        const { currentPage, currentRoute, lastPage } = this;
        let index: number;

        switch (currentRoute) {
        case DraftRoute.Metadata:
            index = -1;
            break;
        case DraftRoute.Page:
            index = currentPage!;
            break;
        case DraftRoute.Review:
            index = lastPage + 1;
            break;
        default:
            index = -1;
            break;
        }

        return index!;
    }

    @computed('currentPageIndex', 'pageManagers.[]', 'currentRoute')
    get nextPageParam() {
        const {
            pageManagers,
            currentPageIndex,
            lastPage,
        } = this;

        if (!isEmpty(pageManagers) && (currentPageIndex < lastPage)) {
            const { pageHeadingText } = pageManagers[currentPageIndex + 1];
            return getNextPageParam(currentPageIndex, pageHeadingText!);
        }

        return '';
    }

    @computed('currentPageIndex', 'pageManagers.[]')
    get prevPageParam() {
        const {
            pageManagers,
            currentPageIndex,
        } = this;

        if (!isEmpty(pageManagers)) {
            if (currentPageIndex > 0) {
                const { pageHeadingText } = pageManagers[currentPageIndex - 1];
                return getPrevPageParam(currentPageIndex, pageHeadingText!);
            }
        }
        return '';
    }

    @computed('currentPage', 'pageManagers.[]')
    get currentPageManager() {
        const { currentPage, pageManagers } = this;
        if (typeof currentPage !== 'undefined' &&
              !isEmpty(pageManagers) &&
              Number.isInteger(currentPage)
        ) {
            return pageManagers[currentPage];
        }
        return undefined;
    }
}
