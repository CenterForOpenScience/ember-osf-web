import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import { task } from 'ember-concurrency';
import config from 'ember-get-config';

import { layout } from 'ember-osf-web/decorators/component';
import Identifier from 'ember-osf-web/models/identifier';
import Registration from 'ember-osf-web/models/registration';
import styles from './styles';
import template from './template';

const {
    OSF: {
        url: osfUrl,
        doiUrlPrefix,
    },
} = config;

@tagName('')
@layout(template, styles)
export default class RegistriesMetadata extends Component.extend({
    loadIdentifiers: task(function *(this: RegistriesMetadata) {
        if (!this.registration) {
            return;
        }
        const identifiers: Identifier[] = yield this.registration.identifiers;
        const doi = identifiers.find(i => i.category === 'doi');
        if (doi) {
            this.set('registrationDoi', doi.value);
        }
    }).on('didReceiveAttrs'),
}) {
    // Parameters
    registration?: Registration;
    extendedFields?: boolean;

    // Private properties
    registrationDoi?: string;
    expandCitations: boolean = false;

    @computed('registrationDoi')
    get registrationDoiUrl() {
        return `${doiUrlPrefix}${this.registrationDoi}`;
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
        return this.registration ?
            `${osfUrl.split('//')[1]}${this.registration.id}` :
            null;
    }
}
