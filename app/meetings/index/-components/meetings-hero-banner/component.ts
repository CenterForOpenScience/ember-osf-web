import Component from '@ember/component';
import { action } from '@ember/object';

export default class MeetingsHeroBanner extends Component {
    // Private properties
    registerPanelOpen = false;

    uploadPanelOpen = false;

    @action
    toggleRegisterPanel() {
        this.toggleProperty('registerPanelOpen');
    }

    @action
    toggleUploadPanel() {
        this.toggleProperty('uploadPanelOpen');
    }
}
