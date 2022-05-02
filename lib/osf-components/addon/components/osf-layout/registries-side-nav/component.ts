import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';
import { and } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';

import { layout } from 'ember-osf-web/decorators/component';

import styles from './styles';
import template from './template';

@tagName('')
@layout(template, styles)
export default class RegistriesSideNav extends Component {
    @service media!: Media;

    // Optional params
    onLinkClicked?: () => void;

    // Private properties
    shouldCollapse = false;

    // remove collapse capability for now
    isCollapseAllowed!: false;

    @and('isCollapseAllowed', 'shouldCollapse')
    isCollapsed!: boolean;

    @action
    toggle() {
        this.toggleProperty('shouldCollapse');
    }
}
