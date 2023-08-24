import Component from '@ember/component';
import { inject as service } from '@ember/service';
import Media from 'ember-responsive';
import { action } from '@ember/object';

export default class MeetingsHeroBanner extends Component {
    // Private properties
    @service media!: Media;
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

    get isMobile() {
        return this.media.isMobile;
    }
}
