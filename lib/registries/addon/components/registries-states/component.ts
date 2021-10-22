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
import { RevisionReviewStates } from 'ember-osf-web/models/schema-response';
import styles from './styles';
import template from './template';

const { OSF: { url: baseURL } } = config;

@layout(template, styles)
export default class RegistriesStates extends Component {
    // Required
    registration!: RegistrationModel;
    isModeratorMode!: boolean;

    // Private
    @service intl!: Intl;

    @computed('registration.reviewsState')
    get stateIcon() {
        const { registration } = this;
        switch (registration.reviewsState) {
        case RegistrationReviewStates.Initial:
        case RegistrationReviewStates.Pending:
        case RegistrationReviewStates.PendingWithdrawRequest:
        case RegistrationReviewStates.PendingEmbargoTermination:
        case RegistrationReviewStates.PendingWithdraw:
            return 'clock';
        case RegistrationReviewStates.Embargo:
            return 'lock';
        default:
            return 'eye';
        }
    }

    /* eslint-disable max-len */
    @computed(
        'isModeratorMode', 'projectUrl',
        'registration.{embargoEndDate,pendingEmbargoApproval,pendingRegistrationApproval,reviewsState,revisionState,userHasAdminPermission}',
        'stateIcon',
    )
    /* eslint-enable max-len */
    get stateText() {
        if (!this.registration || !this.registration.reviewsState) {
            return undefined;
        }
        let stateKey;
        if (this.registration.pendingRegistrationApproval) {
            stateKey = 'pendingRegistrationApproval';
        } else if (this.registration.pendingEmbargoApproval) {
            stateKey = 'pendingEmbargoApproval';
        } else if (this.registration.revisionState !== RevisionReviewStates.Approved) {
            stateKey = camelize(this.registration.revisionState);
        } else {
            stateKey = camelize(this.registration.reviewsState);
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

    @computed('registration.{userHasAdminPermission,reviewsState}')
    get shouldOpenDropdownOnLoad() {
        return this.registration.userHasAdminPermission
        && this.registration.reviewsState
        && ![
            RegistrationReviewStates.Embargo,
            RegistrationReviewStates.Accepted,
        ].includes(this.registration.reviewsState);
    }

    @computed('registration.registeredFrom.id')
    get projectUrl() {
        if (!this.registration) {
            return undefined;
        }
        const registeredFromId = this.registration.belongsTo('registeredFrom').id();
        return registeredFromId && pathJoin(baseURL, registeredFromId);
    }

    @computed('registration.{userHasAdminPermission,reviewsState,isRoot}', 'isModeratorMode')
    get shouldHideAdminActions() {
        return (
            !this.registration.isRoot
            || !this.registration.userHasAdminPermission
            || this.isModeratorMode
            || !this.registration.reviewsState
            || !(
                [RegistrationReviewStates.Accepted, RegistrationReviewStates.Embargo].includes(
                    this.registration.reviewsState,
                )
            )
        );
    }
}
