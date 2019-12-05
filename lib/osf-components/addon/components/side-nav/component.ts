import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { and, or } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import Media from 'ember-responsive';

import { layout } from 'ember-osf-web/decorators/component';

import styles from './styles';
import template from './template';

@tagName('')
@layout(template, styles)
export default class SideNav extends Component {
    @service media!: Media;

    // Optional params
    onLinkClicked?: () => void;

    // Private properties
    shouldCollapse: boolean = false;

    @or('media.{isDesktop,isJumbo}')
    isCollapseAllowed!: boolean;

    @and('isCollapseAllowed', 'shouldCollapse')
    isCollapsed!: boolean;

    @action
    toggle() {
        this.toggleProperty('shouldCollapse');
    }
}
