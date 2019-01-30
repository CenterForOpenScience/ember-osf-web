import { computed } from '@ember-decorators/object';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import RegistrationModel, { RegistrationState } from 'ember-osf-web/models/registration';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class RegistriesStates extends Component {
    node!: RegistrationModel;

    @computed('node.userHasAdminPermission', 'node.state', 'node.isRoot')
    get isDisabled(this: RegistriesStates): boolean {
        return (!this.node.isRoot || !this.node.userHasAdminPermission ||
            !([RegistrationState.Public, RegistrationState.Embargoed].includes(this.node.state)));
    }
}
