import { action } from '@ember-decorators/object';
import Component from '@ember/component';
import { layout } from 'ember-osf-web/decorators/component';

import styles from './styles';
import template from './template';

@layout(template, styles)
export default class MeetingsHeroBanner extends Component {
    registerPanelOpen: boolean = false;
    uploadPanelOpen: boolean = false;

    @action
    toggleRegisterPanel() {
        this.toggleProperty('registerPanelOpen');
    }

    @action
    toggleUploadPanel() {
        this.toggleProperty('uploadPanelOpen');
    }
}
