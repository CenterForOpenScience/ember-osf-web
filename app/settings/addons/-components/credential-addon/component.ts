import { action } from '@ember-decorators/object';
import Component from '@ember/component';

export default class CredentialAddon extends Component {
    modalOpen = false;

    @action
    openModal() {
        this.set('modalOpen', true);
    }

    @action
    closeModal() {
        this.set('modalOpen', false);
    }
}
