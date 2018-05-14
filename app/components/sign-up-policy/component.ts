import { classNames } from '@ember-decorators/component';
import Component from '@ember/component';
import config from 'ember-get-config';
import { localClassNames } from 'ember-osf-web/decorators/css-modules';

@classNames('small')
@localClassNames('SignUpPolicy')
export default class SignUpPolicy extends Component {
    constructor(properties: object) {
        super(properties);
        Object.assign(this, config.signUpPolicy);
    }
}
