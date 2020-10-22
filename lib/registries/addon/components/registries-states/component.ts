import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { camelize } from '@ember/string';
import config from 'ember-get-config';
import Intl from 'ember-intl/services/intl';
import moment from 'moment';

import pathJoin from 'ember-osf-web/utils/path-join';

import { layout } from 'ember-osf-web/decorators/component';
import RegistrationModel, { RegistrationReviewStates } from 'ember-osf-web/models/registration';
import styles from './styles';
import template from './template';

const { OSF: { url: baseURL } } = config;

@layout(template, styles)
export default class RegistriesStates extends Component {
    // Required
    registration!: RegistrationModel;

    // Private
    @service intl!: Intl;

    @computed('registration.machineState')
    get stateIcon() {
        const { registration } = this;
        switch (registration.machineState) {
        case RegistrationReviewStates.Initial:
        case RegistrationReviewStates.Pending:
        case RegistrationReviewStates.PendingWithdrawRequest:
        case RegistrationReviewStates.PendingEmbargoTermination:
        case RegistrationReviewStates.PendingWithdraw:
            return 'clock-o';
        case RegistrationReviewStates.Embargo:
            return 'lock';
        default:
            return 'eye';
        }
    }

    @computed('registration.{machineState,pendingRegistrationApproval,pendingEmbargoApproval}', 'stateIcon')
    get stateText() {
        if (!this.registration) {
            return undefined;
        }
        let stateKey;
        if (this.registration.pendingRegistrationApproval) {
            stateKey = 'pendingRegistrationApproval';
        }
        if (this.registration.pendingEmbargoApproval) {
            stateKey = 'pendingEmbargoApproval';
        }
        if (!this.registration.userHasAdminPermission) {
            stateKey = RegistrationReviewStates.Accepted;
        } else {
            stateKey = camelize(this.registration.machineState);
        }
        return {
            short: this.intl.t(`registries.overview.${stateKey}.short_description`),
            long: this.intl.t(`registries.overview.${stateKey}.long_description`, {
                projectUrl: this.projectUrl,
                embargoEndDate: this.registration.embargoEndDate
                  && moment(this.registration.embargoEndDate).format('MMMM D, YYYY'),
                htmlSafe: true,
            }),
            buttonText: this.intl.t(`registries.overview.${stateKey}.text`),
        };
    }

    @computed('registration.{userHasAdminPermission,machineState}')
    get shouldOpenDropdownOnLoad() {
        return this.registration.userHasAdminPermission
        && ![
            RegistrationReviewStates.Embargo,
            RegistrationReviewStates.Accepted,
        ].includes(this.registration.machineState);
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
        return (!this.registration.isRoot || !this.registration.userHasAdminPermission
            || !(
                [RegistrationReviewStates.Accepted, RegistrationReviewStates.Embargo].includes(
                    this.registration.machineState,
                )
            )
        );
    }
}
