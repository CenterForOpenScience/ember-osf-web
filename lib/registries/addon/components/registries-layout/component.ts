import { tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import Media from 'ember-responsive';

import { layout } from 'ember-osf-web/decorators/component';
import defaultTo from 'ember-osf-web/utils/default-to';

import styles from './styles';
import template from './template';

@tagName('')
@layout(template, styles)
export default class RegistriesLayout extends Component {
    @service media!: Media;

    sidenavGutterClosed = true;
    metadataGutterClosed = true;

    hideLeftGutter: boolean = defaultTo(this.hideLeftGutter, true);
    hideRightGutter: boolean = defaultTo(this.hideRightGutter, true);

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
