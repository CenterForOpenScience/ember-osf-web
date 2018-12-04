import { layout } from 'ember-osf-web/decorators/component';
import defaultTo from 'ember-osf-web/utils/default-to';

import BaseValidatedComponent from '../base-component';
import template from './template';

@layout(template)
export default class ValidatedText extends BaseValidatedComponent {
    // Additional arguments
    password: boolean = defaultTo(this.password, false);
    onKeyUp?: () => void; // Action
}
