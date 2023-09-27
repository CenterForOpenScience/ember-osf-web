import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import config from 'ember-osf-web/config/environment';

import { layout } from 'ember-osf-web/decorators/component';
import template from './template';

@layout(template)
@tagName('')
export default class SignUpPolicy extends Component {
    constructor(properties: object) {
        super(properties);
        Object.assign(this, config.signUpPolicy);
    }
}
