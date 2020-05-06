import { assert } from '@ember/debug';
import { computed, set, setProperties } from '@ember/object';
import { alias, equal, not } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import { PageManager } from 'ember-osf-web/packages/registration-schema';
import { getNextPageParam, getPageSlug, getPrevPageParam } from 'ember-osf-web/utils/page-param';
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

    @equal('currentRoute', DraftRoute.Review)
    inReview!: boolean;

    @equal('currentRoute', DraftRoute.Metadata)
    inMetadata!: boolean;

    @equal('currentPage', 0)
    isFirstPage!: boolean;

    @not('currentRoute') initializing!: boolean;

    constructor(draftManager: DraftRegistrationManager) {
        set(this, 'draftManager', draftManager);
    }

    setPageAndRoute(currentRoute: DraftRoute, currentPage?: number) {
        assert('Page route must have currentPage',
            currentRoute !== DraftRoute.Page || typeof currentPage !== 'undefined');
        setProperties(this, { currentRoute, currentPage });
    }

    @computed('currentPage', 'lastPage')
    get isLastPage() {
        return this.currentPage === this.lastPage;
    }

    @computed('pageManagers.[]')
    get lastPage() {
        const { pageManagers } = this;
        return pageManagers.length - 1;
    }

    @computed('currentPage', 'pageManagers.[]', 'inMetadata', 'lastPage')
    get nextPageParam() {
        const {
            pageManagers,
            currentPage,
            lastPage,
            inMetadata,
        } = this;

        if (!isEmpty(pageManagers)) {
            let pageHeadingText;
            if (inMetadata) {
                [{ pageHeadingText }] = pageManagers;
                return getPageSlug(1, pageHeadingText);
            }

            if (typeof currentPage !== 'undefined' && (currentPage < lastPage)) {
                ({ pageHeadingText } = pageManagers[currentPage + 1]);
                return getNextPageParam(currentPage, pageHeadingText);
            }
        }

        return '';
    }

    @computed('currentPage', 'pageManagers.[]', 'inReview', 'lastPage')
    get prevPageParam() {
        const {
            pageManagers,
            currentPage,
            lastPage,
            inReview,
        } = this;

        if (!isEmpty(pageManagers)) {
            let pageHeadingText;
            if (inReview) {
                ({ pageHeadingText } = pageManagers[lastPage]);
                return getPageSlug(lastPage + 1, pageHeadingText);
            }

            if (typeof currentPage !== 'undefined' && currentPage <= lastPage) {
                if (currentPage > 0) {
                    ({ pageHeadingText } = pageManagers[currentPage - 1]);
                    return getPrevPageParam(currentPage, pageHeadingText);
                }
            }
        }

        return '';
    }

    @computed('currentPage', 'pageManagers.[]')
    get currentPageManager() {
        const { currentPage, pageManagers } = this;
        if (typeof currentPage !== 'undefined' && !isEmpty(pageManagers)) {
            return pageManagers[currentPage];
        }
        return undefined;
    }
}
