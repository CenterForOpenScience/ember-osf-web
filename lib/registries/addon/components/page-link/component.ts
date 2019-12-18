import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { action, computed } from '@ember/object';

import { layout } from 'ember-osf-web/decorators/component';
import { PageManager } from 'ember-osf-web/packages/registration-schema';
import { getPageParam } from 'ember-osf-web/utils/page-param';
import XLink from 'osf-components/components/osf-layout/registries-side-nav/x-link/component';
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
    link!: XLink;
    draftId!: string;

    // Optional
    pageManager?: PageManager;
    pageIndex?: number;
    pageName?: string;
    label?: string;
    navMode?: string;
    pageIsActive?: boolean;

    @computed('pageName', 'pageIndex', 'pageManager', 'pageManager.pageHeadingText')
    get page(): string | undefined {
        if (this.pageName) {
            return this.pageName;
        }
        return typeof this.pageIndex === 'number' && this.pageManager ?
            getPageParam(this.pageIndex, this.pageManager.pageHeadingText) :
            undefined;
    }

    @computed('pageManager', 'pageManager.{isVisited,pageIsValid}', 'pageIsActive')
    get pageState(): PageState {
        if (this.pageIsActive) {
            return PageState.Active;
        }
        if (this.pageManager && this.pageManager.isVisited) {
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
        // case PageState.Active:
        //     return 'Active';
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

    @computed('label', 'pageManager', 'pageManager.pageHeadingText')
    get pageLabel(): string | undefined {
        if (typeof this.label === 'string') {
            return this.label;
        }
        return this.pageManager ? this.pageManager.pageHeadingText : undefined;
    }

    @computed('navMode')
    get isDrawer() {
        return this.navMode === 'drawer';
    }

    didReceiveAttrs() {
        assert('Registries::PageLink: @link is required', Boolean(this.link));
        assert('Registries::PageLink: @draftId is required', Boolean(this.draftId));
    }

    @action
    setIsActive(pageIsActive: boolean) {
        this.setProperties({ pageIsActive });
    }
}
