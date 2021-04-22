import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { BufferedChangeset } from 'ember-changeset/types';

import { layout } from 'ember-osf-web/decorators/component';

import styles from './styles';
import template from './template';

@tagName('')
@layout(template, styles)
export default class FormControlRadioButton extends Component {
    // Required params
    options!: string[];
    valuePath!: string;
    changeset!: BufferedChangeset;

    // Optional params
    shouldShowMessages?: boolean;
    disabled = false;
    onchange?: (option: string) => void;

    didReceiveAttrs() {
        assert('FormControls::RadioButton - @options are required', Boolean(this.options));
        assert('FormControls::RadioButton - @valuePath is required', Boolean(this.valuePath));
        assert('FormControls::RadioButton - @changeset is required', Boolean(this.changeset));
    }

    @action
    updateChangeset(option: string) {
        this.changeset.set(this.valuePath, option);
        if (this.onchange) {
            this.onchange(option);
        }
    }
}
