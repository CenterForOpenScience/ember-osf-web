import { action } from '@ember-decorators/object';
import Component from '@ember/component';

export default class MeetingsHeroBanner extends Component {
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
