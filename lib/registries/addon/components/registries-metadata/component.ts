import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { waitFor } from '@ember/test-waiters';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import config from 'ember-get-config';

import { layout } from 'ember-osf-web/decorators/component';
import Registration from 'ember-osf-web/models/registration';
import RegistrationProviderModel from 'ember-osf-web/models/registration-provider';

import styles from './styles';
import template from './template';

const {
    OSF: {
        url: osfUrl,
    },
} = config;

@tagName('')
@layout(template, styles)
export default class RegistriesMetadata extends Component {
    // Parameters
    registration?: Registration;
    extendedFields?: boolean;

    @tracked provider?: RegistrationProviderModel;
    // Private properties
    expandCitations = false;

    @task({ on: 'didReceiveAttrs'})
    @waitFor
    async fetchProvider() {
        this.provider = await this.registration?.provider;
    }

    @computed('registration')
    get registeredFromId() {
        if (!this.registration) {
            return null;
        }
        return this.registration.belongsTo('registeredFrom').id();
    }

    @computed('registeredFromId')
    get registeredFromDisplayUrl() {
        return `${osfUrl.split('//')[1]}${this.registeredFromId}`;
    }

    @computed('registration.id')
    get registrationDisplayUrl() {
        return this.registration
            ? `${osfUrl.split('//')[1]}${this.registration.id}`
            : null;
    }
}
