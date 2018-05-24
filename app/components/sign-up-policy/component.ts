import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import config from 'ember-get-config';

@tagName('')
export default class SignUpPolicy extends Component {
    constructor(properties: object) {
        super(properties);
        Object.assign(this, config.signUpPolicy);
    }
}
