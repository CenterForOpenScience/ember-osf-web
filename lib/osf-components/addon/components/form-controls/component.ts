import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { BufferedChangeset } from 'ember-changeset/types';

import { layout } from 'ember-osf-web/decorators/component';

import template from './template';

@layout(template)
@tagName('')
export default class FormControls extends Component {
    // Required parameters
    changeset!: BufferedChangeset;

    // Optional parameters
    disabled: boolean = false;
    shouldShowMessages: boolean = true;
}
