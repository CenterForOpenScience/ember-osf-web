import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import Changeset from 'ember-changeset';

import { layout } from 'ember-osf-web/decorators/component';

import template from './template';

@layout(template)
@tagName('')
export default class FormControls extends Component {
    // Required parameters
    changeset!: Changeset;

    // Optional parameters
    disabled: boolean = false;
    shouldShowMessages: boolean = true;
}
