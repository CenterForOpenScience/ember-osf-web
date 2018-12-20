import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';

import User from 'ember-osf-web/models/user';

@tagName('')
export default class SecurityPane extends Component {
    // Required Parameter
    user!: User;
}
