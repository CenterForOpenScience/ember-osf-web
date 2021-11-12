import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';
import { and, or } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';
import Toast from 'ember-toastr/services/toast';
import Intl from 'ember-intl/services/intl';

import { layout } from 'ember-osf-web/decorators/component';

import styles from './styles';
import template from './template';


@tagName('')
@layout(template, styles)
export default class RegistriesSideNav extends Component {
    @service media!: Media;
    @service toast!: Toast;
    @service intl!: Intl;

    // Optional params
    onLinkClicked?: () => void;

    // Private properties
    shouldCollapse = false;

    @or('media.{isDesktop,isJumbo}')
    isCollapseAllowed!: boolean;

    @and('isCollapseAllowed', 'shouldCollapse')
    isCollapsed!: boolean;

    @action
    toggle() {
        this.toggleProperty('shouldCollapse');
    }
}
