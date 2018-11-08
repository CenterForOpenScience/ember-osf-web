import { layout, tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import template from './template';

@tagName('')
@layout(template)
export default class XLink extends Component {
    styles = styles;

    icon!: string;
    label!: string;
    route?: string;
    model?: any;
    count?: number;
    collapsed: boolean = defaultTo(this.collapsed, false);
    expandParent: boolean = defaultTo(this.collapsed, true);
    listCollapsed: boolean = defaultTo(this.listCollapsed, true);

    onclick?: () => void;

    @computed('route')
    get isButton() {
        return !this.route;
    }

    @computed('count')
    get hasCount() {
        return (typeof this.count) === 'number';
    }

    @computed('collapsed')
    get wrapperClasses() {
        return `Link ${this.collapsed ? 'Collapsed' : ''}`;
    }

    didReceiveAttrs() {
        assert('@icon is required for this component to render', Boolean(this.icon));
        assert('@label is required for this component to render', Boolean(this.label));
    }

    @action
    toggle() {
        if (this.collapsed && this.expandParent) {
            this.set('collapsed', false);
            this.set('listCollapsed', false);
        } else {
            this.toggleProperty('listCollapsed');
        }

        if (this.onclick) {
            this.onclick();
        }
    }
}
