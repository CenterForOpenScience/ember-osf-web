import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import config from 'ember-get-config';
import { localClassNames } from 'ember-osf-web/decorators/css-modules';
import styles from './styles';
import layout from './template';

@classNames('small')
@localClassNames('SignUpPolicy')
export default class SignUpPolicy extends Component {
    layout = layout;
    styles = styles;

    constructor(properties: object) {
        super(properties);
        Object.assign(this, config.signUpPolicy);
    }
}
