import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';

import { layout } from 'ember-osf-web/decorators/component';

import template from './template';

@tagName('')
@layout(template)
export default class OsfLayout extends Component {
    @service media!: Media;

    sidenavGutterClosed = true;
    metadataGutterClosed = true;
    backgroundClass?: string;
    forceMetadataGutterMode?: 'page' | 'drawer' | 'column';
    forceSidenavGutterMode?: 'page' | 'drawer' | 'column';

    init() {
        super.init();
        assert('@backgroundClass is required!', Boolean(this.backgroundClass));
    }

    @computed('media.{isMobile,isTablet,isDesktop}', 'forceMetadataGutterMode')
    get metadataGutterMode() {
        if (this.forceMetadataGutterMode) {
            return this.forceMetadataGutterMode;
        }
        if (this.media.isMobile) {
            return 'page';
        }
        if (this.media.isTablet) {
            return 'drawer';
        }
        return 'column';
    }

    @computed('media.{isMobile,isTablet,isDesktop}', 'forceSidenavGutterMode')
    get sidenavGutterMode() {
        if (this.forceSidenavGutterMode) {
            return this.forceSidenavGutterMode;
        }
        if (this.media.isDesktop) {
            return 'column';
        }
        return 'drawer';
    }

    @action
    toggleSidenav() {
        this.toggleProperty('sidenavGutterClosed');
    }

    @action
    openSidenavGutter() {
        this.set('sidenavGutterClosed', false);
    }

    @action
    toggleMetadata() {
        this.toggleProperty('metadataGutterClosed');
    }
}
