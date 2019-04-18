import { computed } from '@ember-decorators/object';
import Component from '@ember/component';

import { layout } from 'ember-osf-web/decorators/component';
import RegistrationModel, { RegistrationState } from 'ember-osf-web/models/registration';
import styles from './styles';
import template from './template';

@layout(template, styles)
export default class RegistriesStates extends Component {
    registration!: RegistrationModel;
    public = RegistrationState.Public;

    @computed('registration.{userHasAdminPermission,state,isRoot}')
    get isDisabled(this: RegistriesStates): boolean {
        return (!this.registration.isRoot || !this.registration.userHasAdminPermission ||
            !([RegistrationState.Public, RegistrationState.Embargoed].includes(this.registration.state)));
    }
}
