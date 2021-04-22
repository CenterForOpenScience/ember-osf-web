import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';
import { BufferedChangeset } from 'ember-changeset/types';

import { layout } from 'ember-osf-web/decorators/component';

import template from './template';

@tagName('')
@layout(template)
export default class FormControlPowerSelect extends Component {
    // Required params
    options!: any[];
    valuePath!: string;
    changeset!: BufferedChangeset;

    // Optional params
    shouldShowMessages?: boolean;
    disabled = false;
    onchange?: (option: unknown) => void;

    @action
    updateChangeset(option: unknown) {
        this.changeset.set(this.valuePath, option);
        if (this.onchange) {
            this.onchange(option);
        }
    }
}
