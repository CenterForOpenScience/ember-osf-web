import { classNames } from '@ember-decorators/component';
import Component from '@ember/component';
import config from 'ember-get-config';

@classNames('small')
export default class SignUpPolicy extends Component {
    constructor(properties: object) {
        super(properties);
        Object.assign(this, config.signUpPolicy);
    }
}
