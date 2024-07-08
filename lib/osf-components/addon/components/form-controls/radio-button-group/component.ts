import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { assert } from '@ember/debug';
import { BufferedChangeset } from 'ember-changeset/types';

import { layout } from 'ember-osf-web/decorators/component';
import { SchemaBlock } from 'ember-osf-web/packages/registration-schema';

import styles from './styles';
import template from './template';

export interface RadioButtonOption {
    displayText: string;
    inputValue: string | boolean | number;
}

@tagName('')
@layout(template, styles)
export default class FormControlRadioButtonGroup extends Component {
    // Required params
    options!: string[] | SchemaBlock[];
    valuePath!: string;
    changeset!: BufferedChangeset;

    // Optional params
    helpTextMapping?: any;
    shouldShowMessages?: boolean;
    disabled = false;
    onchange?: (option: string | number | boolean) => void;

    didReceiveAttrs() {
        assert('FormControls::RadioButton - @options are required', Boolean(this.options));
        assert('FormControls::RadioButton - @valuePath is required', Boolean(this.valuePath));
        assert('FormControls::RadioButton - @changeset is required', Boolean(this.changeset));
    }
}
