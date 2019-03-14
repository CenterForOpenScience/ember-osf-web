import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { service } from '@ember-decorators/service';
import Component from '@ember/component';
import config from 'ember-get-config';
import I18N from 'ember-i18n/services/i18n';

import { layout } from 'ember-osf-web/decorators/component';
import RegistrationModel, { RegistrationState } from 'ember-osf-web/models/registration';
import defaultTo from 'ember-osf-web/utils/default-to';
import pathJoin from 'ember-osf-web/utils/path-join';
import styles from './styles';
import template from './template';

const stateToBannerMap: Record<RegistrationState, {text: string, type: string}> = {
    PendingRegistration: {
        text: 'registries.overview.pendingRegistrationApproval.banner',
        type: 'info',
    },
    PendingWithdrawal: {
        text: 'registries.overview.pendingWithdrawal.banner',
        type: 'info',
    },
    PendingEmbargo: {
        text: 'registries.overview.pendingEmbargoApproval.banner',
        type: 'info',
    },
    PendingEmbargoTermination: {
        text: 'registries.overview.pendingEmbargoTerminationApproval.banner',
        type: 'danger',
    },
    Embargoed: {
        text: 'registries.overview.embargoed.banner',
        type: 'danger',
    },
    Public: { text: '', type: '' },
    Withdrawn: { text: '', type: '' },
};

const { OSF: { url: baseURL } } = config;

@layout(template, styles)
export default class RegistriesBanner extends Component {
    @service i18n!: I18N;

    @alias('registration.embargoEndDate') endEmbargoDate!: string;

    // Required
    registration!: RegistrationModel;

    // Optional
    dismissible?: boolean = defaultTo(this.dismissible, false);
    type?: string = defaultTo(this.type, 'info');

    @computed('registration.state')
    get stateBanner(this: RegistriesBanner) {
        return stateToBannerMap[this.registration.state];
    }

    @computed('registration.registeredFrom.id')
    get projectUrl(this: RegistriesBanner) {
        if (!this.registration) {
            return;
        }
        const registeredFromId = this.registration.registeredFrom.get('id');
        return registeredFromId && pathJoin(baseURL, registeredFromId);
    }
}
