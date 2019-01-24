import { computed } from '@ember-decorators/object';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class RegistriesStates extends Component {
    currentState!: string;
    isAdmin!: boolean;
    isRoot!: boolean;

    @computed('isAdmin', 'currentState', 'isRoot')
    get isDisabled(this: RegistriesStates): boolean {
        return !this.isRoot || !['public', 'embargoed'].includes(this.currentState) || !this.isAdmin;
    }
}
