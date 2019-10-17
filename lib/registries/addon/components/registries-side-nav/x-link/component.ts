import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';

import defaultTo from 'ember-osf-web/utils/default-to';

@tagName('')
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

    onClick?: () => void;

    @computed('route', 'href')
    get isButton() {
        return typeof this.route === 'undefined' && typeof this.href === 'undefined';
    }

    @computed('count')
    get hasCount() {
        return (typeof this.count) === 'number';
    }

    @computed('isCollapsed', 'isCurrentPage')
    get wrapperClasses() {
        return `Link ${this.isCollapsed ? 'Collapsed' : ''} ${this.isCurrentPage ? 'CurrentPage' : ''}`;
    }
}
