import { tagName } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import Component from '@ember/component';
import { requiredAction } from 'ember-osf-web/decorators/component';
import styles from './styles';
import layout from './template';

@tagName('')
export default class SubmitSectionComplete extends Component {
    layout = layout;
    styles = styles;

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
