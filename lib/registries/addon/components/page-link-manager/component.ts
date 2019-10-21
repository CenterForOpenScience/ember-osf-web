import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { layout } from 'ember-osf-web/decorators/component';
import { PageManager } from 'ember-osf-web/packages/registration-schema';
import { getPageParam } from 'ember-osf-web/utils/page-param';
import template from './template';

export enum PageState {
    Unvisited = 'unvisited',
    Active = 'active',
    Valid = 'valid',
    Invalid = 'invalid',
}

@tagName('')
@layout(template)
export default class PageLinkManagerComponenet extends Component {
    // Required
    pageManager!: PageManager;
    pageIndex!: number;
    currentPage!: number;

    @computed('pageManager.pageHeadingText', 'pageIndex')
    get pageIndexWithSlug() {
        return getPageParam(this.pageIndex, this.pageManager.pageHeadingText);
    }

    @computed('pageManager.{isVisited,pageIsValid}', 'pageIsActive')
    get pageState(): PageState {
        if (this.pageIsActive) {
            return PageState.Active;
        }
        if (this.pageManager.isVisited) {
            if (this.pageManager.pageIsValid) {
                return PageState.Valid;
            }
            return PageState.Invalid;
        }
        return PageState.Unvisited;
    }

    @computed('pageIndex', 'currentPage')
    get pageIsActive() {
        return this.pageIndex === this.currentPage;
    }
}
