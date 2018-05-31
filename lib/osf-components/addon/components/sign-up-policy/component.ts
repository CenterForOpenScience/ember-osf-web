import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import config from 'ember-get-config';
import layout from './template';

@tagName('')
export default class SignUpPolicy extends Component {
    layout = layout;

    constructor(properties: object) {
        super(properties);
        Object.assign(this, config.signUpPolicy);
    }
}
