import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { camelize } from '@ember/string';
import config from 'ember-get-config';
import Intl from 'ember-intl/services/intl';
import moment from 'moment';

import pathJoin from 'ember-osf-web/utils/path-join';

import { layout } from 'ember-osf-web/decorators/component';
import RegistrationModel, { RegistrationState } from 'ember-osf-web/models/registration';
import styles from './styles';
import template from './template';

const { OSF: { url: baseURL } } = config;

@layout(template, styles)
export default class RegistriesStates extends Component {
    // Required
    registration!: RegistrationModel;

    // Private
    public = RegistrationState.Public;
    @service intl!: Intl;

    @computed('registration.state')
    get stateIcon() {
        const { registration } = this;
        const {
            PendingRegistration,
            PendingWithdrawal,
            PendingEmbargo,
            PendingEmbargoTermination,
            Embargoed,
        } = RegistrationState;

        switch (registration.state) {
        case PendingRegistration:
        case PendingWithdrawal:
        case PendingEmbargo:
        case PendingEmbargoTermination:
            return 'clock-o';
        case Embargoed:
            return 'lock';
        default:
            return 'eye';
        }
    }

    @computed('registration.state', 'stateIcon')
    get stateText() {
        if (!this.registration) {
            return undefined;
        }
        const stateKey = camelize(this.registration.state);
        return {
            short: this.intl.t(`registries.overview.${stateKey}.short_description`),
            long: this.intl.t(`registries.overview.${stateKey}.long_description`, {
                projectUrl: this.projectUrl,
                embargoEndDate: this.registration.embargoEndDate &&
                  moment(this.registration.embargoEndDate).format('MMMM D, YYYY'),
                htmlSafe: true,
            }),
            buttonText: this.intl.t(`registries.overview.${stateKey}.text`),
        };
    }

    @computed('registration.{userHasAdminPermission,state}')
    get shouldOpenDropdownOnLoad() {
        return this.registration.userHasAdminPermission &&
            ![RegistrationState.Embargoed, RegistrationState.Public].includes(this.registration.state);
    }

    @computed('registration.registeredFrom.id')
    get projectUrl() {
        if (!this.registration) {
            return undefined;
        }
        const registeredFromId = this.registration.belongsTo('registeredFrom').id();
        return registeredFromId && pathJoin(baseURL, registeredFromId);
    }

    @computed('registration.{userHasAdminPermission,state,isRoot}')
    get shouldHideAdminActions() {
        return (!this.registration.isRoot || !this.registration.userHasAdminPermission ||
            !([RegistrationState.Public, RegistrationState.Embargoed].includes(this.registration.state)));
    }
}
