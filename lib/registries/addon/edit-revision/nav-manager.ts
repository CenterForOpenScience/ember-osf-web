import { assert } from '@ember/debug';
import { computed, set, setProperties } from '@ember/object';
import { alias, equal, not } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import { PageManager } from 'ember-osf-web/packages/registration-schema';
import { getNextPageParam, getPageSlug, getPrevPageParam } from 'ember-osf-web/utils/page-param';
import RevisionManager from 'registries/edit-revision/revision-manager';

export enum RevisionRoute {
    Page = 'page',
    Review = 'review',
}

export default class RevisionNavigationManager {
    currentPage?: number;
    revisionManager!: RevisionManager;
    currentRoute!: RevisionRoute;

    @alias('revisionManager.pageManagers')
    pageManagers!: PageManager[];

    @equal('currentRoute', RevisionRoute.Review)
    inReview!: boolean;

    @equal('currentPage', 0)
    isFirstPage!: boolean;

    @not('currentRoute') initializing!: boolean;

    constructor(revisionManager: RevisionManager) {
        set(this, 'revisionManager', revisionManager);
    }

    setPageAndRoute(currentRoute: RevisionRoute, currentPage?: number) {
        assert('Page route must have currentPage',
            currentRoute !== RevisionRoute.Page || typeof currentPage !== 'undefined');
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
        } = this;

        if (!isEmpty(pageManagers)) {
            let pageHeadingText;
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
