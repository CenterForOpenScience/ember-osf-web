import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import Component from '@ember/component';

import { layout, requiredAction } from 'ember-osf-web/decorators/component';
import styles from './styles';
import template from './template';

@layout(template, styles)
@tagName('')
export default class SubmitSectionComplete extends Component {
    showReopen: boolean = this.showReopen;
    editable: boolean = this.editable;

    @requiredAction
    editSection!: () => void;

    @action
    edit() {
        if (this.editable) {
            this.editSection();
        }
    }
}
