import { layout, tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import Changeset from 'ember-changeset';

import defaultTo from 'ember-osf-web/utils/default-to';

import template from './template';

@layout(template)
@tagName('')
export default class FormControls extends Component {
    // Required parameters
    changeset!: Changeset;

    // Optional parameters
    disabled: boolean = defaultTo(this.disabled, false);
    shouldShowMessages: boolean = defaultTo(this.shouldShowMessages, true);
}
