import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { assert } from '@ember/debug';

import { layout } from 'ember-osf-web/decorators/component';
import { PageManager } from 'ember-osf-web/packages/registration-schema';
import { getPageParam } from 'ember-osf-web/utils/page-param';
import xLink from 'osf-components/components/osf-layout/registries-side-nav/x-link/component';
import template from './template';

export enum PageState {
    Unvisited = 'unvisited',
    Active = 'active',
    Valid = 'valid',
    Invalid = 'invalid',
}

@tagName('')
@layout(template)
export default class PageLinkComponent extends Component {
    // Required
    link!: xLink;
    draftId!: string;
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

    @computed('pageState')
    get pageClass(): string {
        switch (this.pageState) {
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

    @computed('pageState')
    get pageIcon(): string {
        switch (this.pageState) {
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

    @computed('pageIndex', 'currentPage')
    get pageIsActive() {
        return this.pageIndex === this.currentPage;
    }

    didReceiveAttrs() {
        assert('Registries::PageLink: @link is required', Boolean(this.link));
        assert('Registries::PageLink: @pageManager is required', Boolean(this.pageManager));
        assert('Registries::PageLink: @draftId is required', Boolean(this.draftId));
        assert('Registries::PageLink: @pageIndex is required', typeof (this.pageIndex) === 'number');
        assert('Registries::PageLink: @currentPage is required', typeof (this.currentPage) === 'number');
    }
}
