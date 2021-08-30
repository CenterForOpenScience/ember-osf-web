import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { BufferedChangeset } from 'ember-changeset/types';
import { layout } from 'ember-osf-web/decorators/component';
import template from './template';

@layout(template)
@tagName('')
export default class FormControlWrapper extends Component {
    // Required arguments
    changeset!: BufferedChangeset;
    valuePath!: string;

    // Optional arguments
    errors?: string;
    label?: string;
    id?: string;
}
