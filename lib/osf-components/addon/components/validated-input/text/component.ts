import defaultTo from 'ember-osf-web/utils/default-to';

import BaseValidatedComponent from '../base-component';
import layout from './template';

export default class ValidatedText extends BaseValidatedComponent {
    layout = layout;

    // Additional arguments
    password: boolean = defaultTo(this.password, false);
    keyUp?: () => void; // Action
}
