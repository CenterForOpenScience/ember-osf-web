import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { layout } from 'ember-osf-web/decorators/component';
import { PageManager } from 'ember-osf-web/packages/registration-schema';
import { getPageParam } from 'ember-osf-web/utils/page-param';
import template from './template';

@tagName('')
@layout(template)
export default class PageLinkComponenet extends Component {
    // Required
    pageManager!: PageManager;
    pageIndex!: number;
    currentPage!: number;
    draftId!: string;

    @computed('pageManager.pageHeadingText', 'pageIndex')
    get pageIndexWithSlug() {
        return getPageParam(this.pageIndex, this.pageManager.pageHeadingText);
    }

    @computed('pageManager.{isVisited,isValid}', 'pageIndex', 'currentPage', 'pageIsActive')
    get pageIcon() {
        if (this.pageIsActive) {
            return 'circle-o';
        }
        if (this.pageManager.isVisited) {
            if (this.pageManager.isValid) {
                return 'check-circle-o';
            }
            return 'exclamation-circle';
        }
        return 'circle';
    }

    @computed('pageManager.{isVisited,isValid}', 'pageIndex', 'currentPage', 'pageIsActive')
    get pageClass() {
        if (this.pageIsActive) {
            return 'Active';
        }
        if (this.pageManager.isVisited) {
            if (this.pageManager.isValid) {
                return 'Valid';
            }
            return 'Invalid';
        }
        return 'Unvisited';
    }

    @computed('pageIndex', 'currentPage')
    get pageIsActive() {
        if (this.pageIndex === this.currentPage) {
            return true;
        }
        return false;
    }
}
