import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { PageManager } from 'ember-osf-web/packages/registration-schema';
import { getNextPageParam, getPrevPageParam } from 'ember-osf-web/utils/page-param';

@tagName('')
export default class PageNavigation extends Component {
    // required
    currentPage!: number;
    updateRoute!: (pageHeadingText: string) => void;
    onPageNotFound!: () => void;
    pageManagers: PageManager[] = [];

    didReceiveAttrs() {
        assert('@currentPage is not a number', Number.isInteger(this.currentPage));
        assert('@pageManagers is required.', Boolean(this.pageManagers));

        if (this.currentPage > this.lastPage) {
            this.onPageNotFound();
        } else {
            this.updateRoute(this.currentPageManager!.pageHeadingText as string);
        }
    }

    @computed('pageManagers.[]')
    get lastPage() {
        const { pageManagers } = this;
        return pageManagers.length - 1;
    }

    @computed('currentPage', 'pageManagers.[]')
    get nextPageParam() {
        const {
            pageManagers,
            currentPage,
            lastPage,
        } = this;

        if (!isEmpty(pageManagers) && (currentPage < lastPage)) {
            const { pageHeadingText } = pageManagers[currentPage + 1];
            return getNextPageParam(currentPage, pageHeadingText!);
        }
        return '';
    }

    @computed('currentPage', 'pageManagers.[]', 'inReview')
    get prevPageParam() {
        const {
            pageManagers,
            currentPage,
        } = this;

        if (!isEmpty(pageManagers)) {
            if (currentPage > 0) {
                const { pageHeadingText } = pageManagers[currentPage - 1];
                return getPrevPageParam(currentPage, pageHeadingText!);
            }
        }
        return '';
    }

    @computed('currentPage', 'pageManagers.[]')
    get currentPageManager() {
        const { currentPage, pageManagers } = this;
        if (!isEmpty(pageManagers) && Number.isInteger(currentPage)) {
            return pageManagers[currentPage];
        }
        return undefined;
    }
}
