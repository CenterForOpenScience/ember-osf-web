import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { computed } from '@ember/object';

import { layout } from 'ember-osf-web/decorators/component';
import defaultTo from 'ember-osf-web/utils/default-to';

import styles from './styles';
import template from './template';

@tagName('')
@layout(template, styles)
export default class XLink extends Component {
    icon?: string;
    label?: string;
    route?: string;
    models?: any[];
    href?: string;
    count?: number;
    guid?: string;
    isCollapsed: boolean = defaultTo(this.isCollapsed, false);
    isCurrentPage: boolean = defaultTo(this.isCurrentPage, false);
    isDrawer?: boolean = defaultTo(this.isDrawer, false);
    clickable?: boolean = true;

    onClick?: () => void;

    @computed('route', 'href')
    get isButton() {
        return typeof this.route === 'undefined' && typeof this.href === 'undefined';
    }

    @computed('count')
    get hasCount() {
        return (typeof this.count) === 'number';
    }
}
