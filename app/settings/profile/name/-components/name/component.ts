import { classNames, tagName } from '@ember-decorators/component';
import Component from '@ember/component';

import User from 'ember-osf-web/models/user';

@tagName('div')
@classNames('panel-body')
export default class ProfileNameSettings extends Component {
    // Required Parameter
    user!: User;
}
