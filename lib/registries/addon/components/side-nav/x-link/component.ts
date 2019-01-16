import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { assert } from '@ember/debug';

import { layout } from 'ember-osf-web/decorators/component';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import template from './template';

@tagName('')
@layout(template, styles)
export default class XLink extends Component {
    icon!: string;
    label!: string;
    route?: string;
    href?: string;
    models?: any[];
    count?: number;
    isCollapsed: boolean = defaultTo(this.isCollapsed, false);

    onClick?: () => void;

    @computed('route', 'href')
    get isButton() {
        return typeof this.route === 'undefined' && typeof this.href === 'undefined';
    }

    @computed('count')
    get hasCount() {
        return (typeof this.count) === 'number';
    }

    @computed('isCollapsed')
    get wrapperClasses() {
        return `Link ${this.isCollapsed ? 'Collapsed' : ''}`;
    }

    didReceiveAttrs() {
        assert('@icon is required for this component to render', Boolean(this.icon));
        assert('@label is required for this component to render', Boolean(this.label));
    }
}
