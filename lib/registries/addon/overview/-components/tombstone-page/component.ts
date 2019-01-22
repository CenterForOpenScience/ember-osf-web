import { tagName } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Component from '@ember/component';
import config from 'ember-get-config';

import Registration from 'ember-osf-web/models/registration';

const {
    OSF: {
        url: osfUrl,
    },
} = config;

@tagName('')
export default class TombstonePage extends Component {
    registration!: Registration;

    @computed('registration')
    get registeredFromId() {
        return this.registration.belongsTo('registeredFrom').id();
    }

    @computed('registeredFromId')
    get registeredFromDisplayUrl() {
        return `${osfUrl.split('//')[1]}${this.registeredFromId}`;
    }
}
