import { action } from '@ember-decorators/object';
import Component from '@ember/component';

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
