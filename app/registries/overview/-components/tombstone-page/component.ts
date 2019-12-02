import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

import Registration from 'ember-osf-web/models/registration';

@tagName('')
export default class TombstonePage extends Component {
    registration!: Registration;
}
