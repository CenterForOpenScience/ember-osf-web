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

    init() {
        super.init();
        assert('@backgroundClass is required!', Boolean(this.backgroundClass));
    }

    @computed('media.{isMobile,isTablet,isDesktop}')
    get metadataGutterMode() {
        if (this.media.isMobile) {
            return 'page';
        }
        if (this.media.isTablet) {
            return 'drawer';
        }
        return 'column';
    }

    @computed('media.{isMobile,isTablet,isDesktop}')
    get sidenavGutterMode() {
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
    toggleMetadata() {
        this.toggleProperty('metadataGutterClosed');
    }
}
