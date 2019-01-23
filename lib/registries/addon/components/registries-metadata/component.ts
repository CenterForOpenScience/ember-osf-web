import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import config from 'ember-get-config';

import { layout } from 'ember-osf-web/decorators/component';
import Registration from 'ember-osf-web/models/registration';
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
    registration?: Registration;

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
}
