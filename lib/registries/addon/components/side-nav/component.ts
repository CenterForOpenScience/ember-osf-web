import { layout, tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import Component from '@ember/component';
import defaultTo from 'ember-osf-web/utils/default-to';
import styles from './styles';
import template from './template';

@tagName('')
@layout(template)
export default class SideNav extends Component {
    styles = styles;

    collapsed: boolean = defaultTo(this.collapsed, false);

    @action
    toggle() {
        this.toggleProperty('collapsed');
    }
}
