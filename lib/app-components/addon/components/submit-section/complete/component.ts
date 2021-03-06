import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import { action } from '@ember/object';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class SubmitSectionComplete extends Component {
    // Required arguments
    showReopen!: boolean;
    editable!: boolean;

    @requiredAction
    editSection!: () => void;

    @action
    edit() {
        this.editSection();
    }
}
