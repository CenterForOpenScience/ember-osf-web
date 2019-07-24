import { layout } from '@ember-decorators/component';
import Component from '@ember/component';

import defaultTo from 'ember-osf-web/utils/default-to';

import template from './template';

@layout(template)
export default class FormControls extends Component {
    // Optional arguments
    disabled: boolean = defaultTo(this.disabled, false);
    shouldShowMessages: boolean = false;
}
