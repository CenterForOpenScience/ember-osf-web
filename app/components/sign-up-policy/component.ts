import Component from '@ember/component';
import config from 'ember-get-config';

export default class SignUpPolicy extends Component.extend({
    classNames: ['small'],
}) {
    constructor() {
        super();
        Object.assign(this, config.signUpPolicy);
    }
}
